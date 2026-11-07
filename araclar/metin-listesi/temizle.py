import json,re
raw=json.load(open("ham.json"))
PH=re.compile(r"«[^»]*»")
def clean(t):
    t=PH.sub("«…»",t)
    t=t.replace("&amp;","&").replace("&nbsp;"," ").replace("&lt;","<").replace("&gt;",">").replace("&quot;",'"').replace("&#39;","'")
    t=re.sub(r"\s+"," ",t).strip()
    return t
BAD=[r"^\d00 ",r"\d+px",r"^[a-z]+/[a-z.+-]+$",r"prefers-",r"color-mix",r"url\(",r"blur\(",r"%PDF",r"\bobj\b",r"xref",r"/Im0",r"\.(json|js|png|jpe?g|ttf|pdf|xlsx)\b",r"Download/",r"[a-z-]+=\"",r"[a-z-]+=«",r"^L«",r"@gmail",r"maximum-scale",r"^\(cm\)$",r"oklab",r"system-ui",r"monospace",r"^[a-z]+:[a-z]",r"&#",r"^#",r"^\.",r"^\W*«…»\W*$",r"^(Figtree|Outfit|DM Mono)",r"tr-TR",r"^[A-Z_]+$",r"^[a-z]+[A-Z]\w*$",r"^[a-z_]+\.[a-z_]+",r"\bvar\(--",r"^(true|false|null|undefined)$",r"^[MLCQZHVmlcqzhv0-9 .,«…»-]+$"]
BADR=[re.compile(b) for b in BAD]
def ok(t):
    if len(re.sub(r"«…»|[^A-Za-zçğıöşüÇĞİÖŞÜâ]","",t))<2: return False
    if any(b.search(t) for b in BADR): return False
    # Türkçe olmayan tek kelime kod adları
    if re.fullmatch(r"[a-z][a-z0-9]*",t) and not re.search(r"[çğıöşü]",t) and t not in ("kg","ml","adım","gün","mg","cm","iğne","kalem","doz","yaş","bugün","dün","sabah","akşam","öğle","gece"):
        if not t in("bardak","ölçek","şişe","bar","adet","hafta","ay","yıl","saat","dk","kez","kapsül","tablet","damla","ölçü","tartı","giriş","görsel","sürüyor","büyük","küçük"): return False
    return True
SEC=[(1,"Genel (sayfa iskeleti, alt sekmeler)"),(1129,"Genel (ortak metinler, yedek, kayıt)"),(1264,"Hafif Plus ödeme ekranı"),(1344,"Ana ekran widget'ı (uygulamanın gönderdiği yazılar)"),(1361,"Genel (Plus kartı, görünüm)"),(1444,"Özet › Koç kartları"),(1616,"Özet ekranı"),(1738,"Özet › Pazartesi haftalık özet"),(1818,"Ekleme pencereleri (+ menüsü, su, iştah, not)"),(1915,"İğneler › İlaç düzeyi ve evreler"),(2086,"Günlük › Protein ve su"),(2194,"Günlük › Ne yesem? (öğün önerileri)"),(2255,"Günlük › Protein ve su"),(2444,"Özet › Üst kart (kahraman kart, koruma dönemi)"),(2546,"Paylaşım › Kilo ilerleme kartları"),(2808,"Paylaşım › Adım kartları"),(2944,"Paylaşım › Hafif ekibine gönder"),(3005,"Başarılar (rozetler, kutlama)"),(3231,"Ayarlar › Verilerim (indir, yedek)"),(3296,"Doktor raporu (PDF)"),(3418,"Kilo › Vücut kompozisyonu"),(3508,"Günlük › Takviyeler"),(3651,"İğneler › Döngü kartı"),(3789,"Kilo ekranı (grafik, tartılar)"),(3998,"Kilo › Ölçüler ve fotoğraflar"),(4136,"İğneler › Yan etki ve iştah"),(4188,"İğneler › Kalem ve doz planı"),(4305,"İğneler ekranı"),(4328,"Ayarlar ekranı"),(4356,"Adımlar ekranı"),(4511,"Hatırlatıcılar (telefon bildirimleri)"),(4641,"İlk kurulum"),(4794,"Ekleme pencereleri (kilo, iğne, ölçü vb.)"),(4953,"Ayarlar › Değerleri düzenle")]
FN={"vOzetMain":"Özet ekranı","coachCards":"Özet › Koç kartları","vAyar":"Ayarlar ekranı","themeCard":"Ayarlar ekranı","plusCard":"Ayarlar ekranı","dataCard":"Ayarlar › Verilerim (indir, yedek)","remCard":"Ayarlar › Hatırlatıcılar","remStatus":"Ayarlar › Hatırlatıcılar","bindRem":"Ayarlar › Hatırlatıcılar","remCta":"Özet ekranı","suppCta":"Özet ekranı","exCard":"Özet ekranı","musCard":"Kilo ekranı (grafik, tartılar)","nextShotRow":"Özet ekranı","todayRings":"Özet ekranı","items":"Özet ekranı","sub":"Özet ekranı","milestoneCard":"Özet ekranı","msStrip":"Özet ekranı","nx":"Özet ekranı","openQuick":"+ menüsü","it":"+ menüsü"}
order=[]
def screen(o):
    if o["fn"] in FN: return FN[o["fn"]]
    sc=SEC[0][1]
    for l,n in SEC:
        if o["line"]>=l: sc=n
    return sc
TAG={"button":"Düğme","h1":"Başlık","h2":"Başlık","h3":"Başlık","label":"Alan adı","option":"Seçenek","summary":"Açılır başlık","b":"Vurgulu yazı","strong":"Vurgulu yazı","small":"Küçük yazı","em":"Vurgulu yazı","li":"Madde","th":"Tablo başlığı","td":"Tablo hücresi","a":"Bağlantı"}
def tur(o):
    if o["ctx"]=="toast": return "Kısa bildirim (ekranın altında çıkan)"
    if o["ctx"]=="onay": return "Onay sorusu"
    if o["kind"]=="placeholder": return "Kutu içi ipucu"
    if o["kind"] in("aria-label","title","alt"): return "Erişilebilirlik etiketi (ekran okuyucu)"
    sc=screen(o)
    if sc.startswith("Hatırlatıcılar"): return "Telefon bildirimi / hatırlatıcı"
    if sc.startswith("Paylaşım") or sc.startswith("Doktor raporu"): return "Görselin / raporun üstündeki yazı"
    return TAG.get(o["kind"],"Metin")
rows=[];seen=set()
for o in raw:
    o["ctx"]=o.get("ctx","")
    t=clean(o["text"])
    if not ok(t): continue
    sc=screen(o);k=(sc,t)
    if k in seen: continue
    seen.add(k)
    rows.append(dict(ekran=sc,tur=tur(o),metin=t,satir=o["line"],fn=o["fn"]))
json.dump(rows,open("satirlar.json","w"),ensure_ascii=False)
print(len(rows))
import collections
print(collections.Counter(r["ekran"] for r in rows).most_common())
