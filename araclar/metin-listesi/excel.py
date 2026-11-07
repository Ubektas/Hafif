import json,re
from openpyxl import Workbook
from openpyxl.styles import Font,PatternFill,Alignment,Border,Side
from openpyxl.worksheet.datavalidation import DataValidation
rows=json.load(open("satirlar.json"))
CANVAS={"tZumrut","tFis","tMezura","tBasamak","tAfis","tBaslangic","B","title","mark","statList","appFoot","w1","tFoto","tPist","tRota","tHalka","tHafta","stBrand","stTrio","wk","weekCanvas","rpPages","cols","tiles","info","page","foot","storyOf","fitFont"}
JUNK=re.compile(r'">|&&|\?"|":"|\|\||\[i|\)\.|=>')
out=[]
for r in rows:
    if JUNK.search(r["metin"]): continue
    if r["tur"].startswith("Görselin"):
        if r["fn"] not in CANVAS: r["tur"]="Metin"
    elif r["fn"] in CANVAS: r["tur"]="Görselin / raporun üstündeki yazı"
    out.append(r)
ORDER=["Genel (sayfa iskeleti, alt sekmeler)","İlk kurulum","Özet ekranı","Özet › Üst kart (kahraman kart, koruma dönemi)","Özet › Koç kartları","Özet › Pazartesi haftalık özet","+ menüsü","Ekleme pencereleri (+ menüsü, su, iştah, not)","Ekleme pencereleri (kilo, iğne, ölçü vb.)","Günlük › Protein ve su","Günlük › Ne yesem? (öğün önerileri)","Günlük › Takviyeler","Kilo ekranı (grafik, tartılar)","Kilo › Vücut kompozisyonu","Kilo › Ölçüler ve fotoğraflar","İğneler ekranı","İğneler › Döngü kartı","İğneler › İlaç düzeyi ve evreler","İğneler › Kalem ve doz planı","İğneler › Yan etki ve iştah","Adımlar ekranı","Başarılar (rozetler, kutlama)","Paylaşım › Kilo ilerleme kartları","Paylaşım › Adım kartları","Paylaşım › Hafif ekibine gönder","Doktor raporu (PDF)","Ayarlar ekranı","Ayarlar › Değerleri düzenle","Ayarlar › Hatırlatıcılar","Ayarlar › Verilerim (indir, yedek)","Hatırlatıcılar (telefon bildirimleri)","Hafif Plus ödeme ekranı","Genel (Plus kartı, görünüm)","Genel (ortak metinler, yedek, kayıt)","Ana ekran widget'ı (uygulamanın gönderdiği yazılar)"]
missing={r["ekran"] for r in out}-set(ORDER);assert not missing,missing
out.sort(key=lambda r:(ORDER.index(r["ekran"]),r["satir"]))
# native
nat=[]
for l in open("native.txt",encoding="utf8"):
    f,t=l.rstrip("\n").split("\t",1)
    if "WidgetDeneme" in f or "HafifWidgetPlugin" in f or "localizedDescription" in t or re.fullmatch(r"[LyMdHms .]+",t) or len(t.strip())<2: continue
    t=re.sub(r"\\\([^)]*(\([^)]*\))?[^)]*\)","«…»",t).replace("\\n"," ")
    if "ios/" in f and "Info.plist" in f: yer="iPhone izin pencereleri"
    elif "ios/" in f: yer="iPhone widget'ları"
    elif "strings.xml" in f or "/xml/" in f: yer="Android widget listesindeki adlar ve açıklamalar"
    elif "widget/" in f: yer="Android widget'ları"
    else: yer="Android (diğer sistem yazıları)"
    nat.append(dict(ekran=yer,metin=t.strip(),kod=f.replace("android/app/src/main/java/com/ugurbektas/hafif/","android/…/")+""))
seen=set();nat=[n for n in nat if not ((n["ekran"],n["metin"]) in seen or seen.add((n["ekran"],n["metin"])))]

wb=Workbook()
H=Font(bold=True,color="FFFFFF");HF=PatternFill("solid",fgColor="0B3B33");ED=PatternFill("solid",fgColor="FFF4E5")
thin=Side(style="thin",color="E0E8E4");BR=Border(bottom=thin)
W=Alignment(wrap_text=True,vertical="top")
ws=wb.active;ws.title="Nasıl okunur"
info=["Hafif · Uygulamadaki bütün yazılar","",
"Bu dosyada uygulamada görünen yazıların hepsi var; hangi ekranda ve ne tür bir yazı olduğuyla birlikte.",
"","Sütunlar:",
"• Ekran: Yazının çıktığı yer (ör. Günlük › Protein ve su).",
"• Tür: Düğme, başlık, kısa bildirim (ekranın altında beliren), telefon bildirimi, kutu içi ipucu, paylaşım görselinin üstündeki yazı vb.",
"• Metin: Uygulamada yazan hâli.",
"• Önerilen Türkçe: Doğal gelmeyen yazının yerine ne yazsın istiyorsan buraya yaz. Boş bırakılanlar olduğu gibi kalır.",
"• Not: İstersen açıklama (ör. 'çok resmi', 'kısalt').",
"• Kod yeri: Benim bulmam için satır numarası; dokunmana gerek yok.",
"","İşaretler:",
"• «…» Uygulamanın o anda doldurduğu değer: sayı, tarih, kilo, gün, yiyecek adı gibi. Örnek: '«…» gün sonra' → '3 gün sonra'.",
"• Bazı satırlar cümlenin bir parçasıdır (ör. 'iğneden sonraki'); uygulama bunları başka parçalarla birleştirip tek cümle yapar. Aynı ekrandaki yan satırlara bakınca cümlenin tamamı anlaşılır.",
"• Aynı yazı aynı ekranda birden çok yerde geçiyorsa bir kez yazıldı.",
"• Büyük harfli yazılar (ör. BUGÜN) uygulamada da büyük harfle görünür.",
"","Sayfalar:",
f"• Uygulama metinleri: {len(out)} satır (uygulamanın içi).",
f"• Widget ve sistem: {len(nat)} satır (ana ekran widget'ları, widget listesindeki açıklamalar, iPhone izin pencereleri).",
"• Ekranlara göre sayı: hangi ekranda kaç yazı olduğu.",
"","Bitince dosyayı bana geri gönder; 'Önerilen Türkçe' sütununu uygulamaya işlerim."]
for i,t in enumerate(info,1):
    c=ws.cell(i,1,t);c.alignment=Alignment(wrap_text=True,vertical="top")
ws["A1"].font=Font(bold=True,size=16,color="0B3B33")
for r in (5,13,19): ws.cell(r,1).font=Font(bold=True)
ws.column_dimensions["A"].width=120
def sheet(name,cols,data,widths):
    s=wb.create_sheet(name)
    for j,c in enumerate(cols,1):
        x=s.cell(1,j,c);x.font=H;x.fill=HF;x.alignment=Alignment(vertical="center",wrap_text=True)
    for i,row in enumerate(data,2):
        for j,v in enumerate(row,1):
            x=s.cell(i,j,v);x.alignment=W;x.border=BR
            if cols[j-1] in("Önerilen Türkçe","Not"): x.fill=ED
    for j,w in enumerate(widths,1): s.column_dimensions[chr(64+j)].width=w
    s.freeze_panes="E2" if "Metin" in cols[3:4] else "D2"
    s.auto_filter.ref=s.dimensions;s.row_dimensions[1].height=22
    return s
sheet("Uygulama metinleri",["No","Ekran","Tür","Metin","Önerilen Türkçe","Not","Kod yeri"],
      [[i,r["ekran"],r["tur"],r["metin"],"","",f"satır {r['satir']} · {r['fn']}"] for i,r in enumerate(out,1)],[6,34,24,60,50,26,22])
sheet("Widget ve sistem",["No","Yer","Metin","Önerilen Türkçe","Not","Kod yeri"],
      [[i,n["ekran"],n["metin"],"","",n["kod"]] for i,n in enumerate(nat,1)],[6,34,60,50,26,40])
import collections
cnt=collections.Counter(r["ekran"] for r in out)
s=wb.create_sheet("Ekranlara göre sayı")
s.append(["Ekran","Yazı sayısı"]);[setattr(s.cell(1,j),"font",H) or setattr(s.cell(1,j),"fill",HF) for j in (1,2)]
for e in ORDER: s.append([e,cnt[e]])
s.append(["Toplam",len(out)]);s.cell(s.max_row,1).font=Font(bold=True);s.cell(s.max_row,2).font=Font(bold=True)
s.column_dimensions["A"].width=50;s.column_dimensions["B"].width=14
wb.save("/home/user/Hafif/dil/hafif-metinler.xlsx")
print(len(out),len(nat))
