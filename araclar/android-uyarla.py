#!/usr/bin/env python3
"""Claude'daki Hafif artifact'inin HTML'ini Android sürümüne (www/index.html) dönüştürür.

Kullanım: python3 araclar/android-uyarla.py <artifact.html> [www/index.html]

ANDROID-UYARLAMALARI.md'deki 6 değişikliği uygular. Beklenen bir parça bulunamazsa
(artifact'te ilgili kod değişmişse) hata verip durur; o adım elle gözden geçirilmelidir.
"""
import re
import sys

src = open(sys.argv[1], encoding="utf8").read()
out_path = sys.argv[2] if len(sys.argv) > 2 else "www/index.html"


def rep(s, old, new, label, count=1):
    n = s.count(old)
    if n != count:
        sys.exit(f"[{label}] beklenen parça {count} kez değil {n} kez bulundu:\n{old[:200]}")
    return s.replace(old, new)


def cut_block(s, start, end, label):
    """start ile başlayan satırdan end ile başlayan satıra kadar (end hariç) siler."""
    lines = s.split("\n")
    try:
        a = next(i for i, l in enumerate(lines) if l.startswith(start))
        b = next(i for i in range(a + 1, len(lines)) if lines[i].startswith(end))
    except StopIteration:
        sys.exit(f"[{label}] blok bulunamadı: {start!r} … {end!r}")
    del lines[a:b]
    return "\n".join(lines)


def del_line(s, start, label):
    lines = s.split("\n")
    hits = [i for i, l in enumerate(lines) if l.startswith(start)]
    if len(hits) != 1:
        sys.exit(f"[{label}] satır {len(hits)} kez bulundu: {start!r}")
    del lines[hits[0]]
    return "\n".join(lines)


s = src

# 1. Yerel fontlar
s = re.sub(r'<link rel="preconnect" href="https://fonts.googleapis.com">\n', "", s)
s, n = re.subn(r'<link rel="stylesheet" href="https://fonts.googleapis.com/css2\?[^"]*">',
               '<link rel="stylesheet" href="fonts/fonts.css">', s)
if n != 1:
    sys.exit("[fontlar] Google Fonts bağlantısı bulunamadı")

# 2. Yerel Excel kütüphanesi
s = rep(s, 'sc.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";',
        'sc.src="vendor/xlsx.full.min.js";', "excel")

# 3. Android'de kaydetme
s = rep(s, "async function dlSave(name,data){const dl=",
        """/* Android (Capacitor): dosyayı önbelleğe yazıp sistemin Paylaş/Kaydet penceresini açar */
const CAP=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()?window.Capacitor.Plugins:null;
async function nativeSave(name,data){
  let opts;
  if(typeof data==="string") opts={data,encoding:"utf8"};
  else{const blob=data instanceof Blob?data:new Blob([data]);opts={data:await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=rej;r.readAsDataURL(blob)})}}
  const {uri}=await CAP.Filesystem.writeFile({path:name,directory:"CACHE",...opts});
  try{await CAP.Share.share({title:name,files:[uri]})}catch(e){if(/cancel/i.test(String(e&&e.message)))throw {code:"declined"};throw e}
  return {status:"saved"};
}
async function dlSave(name,data){if(CAP)return nativeSave(name,data);const dl=""", "dlSave")
s = rep(s, """  try{
    const dl=window.claude&&window.claude.use?await claude.use("downloads"):null;
    if(!dl){$("#shHint")""", """  try{
    if(CAP){const blob=await new Promise(r=>shareCanvas.toBlob(r,"image/png"));await nativeSave(`hafif-ilerleme-${today()}.png`,blob);toast("Görsel hazır");return}
    const dl=window.claude&&window.claude.use?await claude.use("downloads"):null;
    if(!dl){$("#shHint")""", "saveShare")

# 4. Android geri tuşu
s = rep(s, "boot();\n})();", """boot();
/* Android geri tuşu: önce kutlamayı, sonra açık alt sayfayı kapatır, sonra Özet'e döner, en son uygulamadan çıkar */
if(CAP&&CAP.App)window.Capacitor.addListener("App","backButton",()=>{
  const c=$("#celeb");if(c){c.remove();return}
  if($("#sheetRoot").firstChild){closeSheet();return}
  if(tab!=="ozet"){selPhase=null;tab="ozet";render();window.scrollTo(0,0);return}
  CAP.App.exitApp();
});
})();""", "geri tuşu")

# 5. Kişisel veriler (Tracky / Zepp aktarımı)
s = cut_block(s, "/* Tracky'den aktarılan geçmiş", 'let tab="ozet"', "tracky")
s = cut_block(s, "function importCard(){", "function vOzet(){", "import kartları")
s = rep(s, "  return importCard()+zeppCard()+vOzetMain();", "  return vOzetMain();", "vOzet")
s = del_line(s, "const TRACKY_TIMES=", "tracky saatleri")
s = re.sub(r"const shotTime=x=>x\.time\|\|TRACKY_TIMES\[x\.date\]\|\|\"09:00\";", 'const shotTime=x=>x.time||"09:00";', s)
s = del_line(s, '  v.querySelectorAll("[data-zepp]")', "zepp bağlantısı")
s = del_line(s, '  v.querySelectorAll("[data-import]")', "tracky bağlantısı")

# 6. Boş başlangıç
a = s.find("const DEF_SUPPS=[")
b = s.find("const SUPP_TIMES=", a)
if a < 0 or b < 0:
    sys.exit("[takviyeler] DEF_SUPPS bulunamadı")
s = s[:a] + "const DEF_SUPPS=[];\n" + s[b:]
s, n = re.subn(r'(const startCut=\(\)=>S\.profile\.startDate\|\|\(S\.shots\.length\?sortedS0\(\)\[0\]\.date:)"\d{4}-\d{2}-\d{2}"\)',
               r'\1"")', s)
if n != 1:
    sys.exit("[startCut] bulunamadı")

# Son kontrol: kişisel veri ya da dış adres kalmasın
for bad in ("TRACKY", "ZEPP", "importTracky", "importZepp", "fonts.googleapis", "cdnjs.cloudflare"):
    if bad in s:
        sys.exit(f"[son kontrol] hâlâ var: {bad}")

open(out_path, "w", encoding="utf8").write(s)
print(f"{out_path} yazıldı ({len(s):,} bayt)")
