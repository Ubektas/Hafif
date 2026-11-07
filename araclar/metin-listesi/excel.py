import json,re,sys
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
    if r["fn"]=="MEALS": r["tur"]="Öğün önerisi (ad, kısa ad, porsiyon)"
    elif r["fn"] in("PHASES","phaseInner","PH_SHORT") and r["tur"]=="Metin": r["tur"]="Evre açıklaması / ipucu"
    elif r["fn"] in("tipHtml",) : r["tur"]="İpucu"
    elif r["ekran"]=="Özet › Koç kartları" and r["tur"]=="Metin": r["tur"]="Koç kartı yazısı"
    r["pl"]={"":"Her ikisi","Android":"Yalnızca Android","iPhone":"Yalnızca iPhone"}[r["plat"]]
    out.append(r)
ORDER=["Genel (sayfa iskeleti, alt sekmeler)","İlk kurulum","Özet ekranı","Özet › Üst kart (kahraman kart, koruma dönemi)","Özet › Koç kartları","Özet › Pazartesi haftalık özet","+ menüsü","Ekleme pencereleri (+ menüsü, su, iştah, not)","Ekleme pencereleri (kilo, iğne, ölçü vb.)","Günlük › Protein ve su","Günlük › Ne yesem? (öğün önerileri)","Günlük › Takviyeler","Kilo ekranı (grafik, tartılar)","Kilo › Vücut kompozisyonu","Kilo › Ölçüler ve fotoğraflar","İğneler ekranı","İğneler › Döngü kartı","İğneler › İlaç düzeyi ve evreler","İğneler › Kalem ve doz planı","İğneler › Yan etki ve iştah","Adımlar ekranı","Başarılar (rozetler, kutlama)","Paylaşım › Kilo ilerleme kartları","Paylaşım › Adım kartları","Paylaşım › Hafif ekibine gönder","Doktor raporu (PDF)","Ayarlar ekranı","Ayarlar › Değerleri düzenle","Ayarlar › Hatırlatıcılar","Ayarlar › Verilerim (indir, yedek)","Hatırlatıcılar (telefon bildirimleri)","Hafif Plus ödeme ekranı","Genel (Plus kartı, görünüm)","Genel (ortak metinler, yedek, kayıt)","Ana ekran widget'ı (uygulamanın gönderdiği yazılar)"]
missing={r["ekran"] for r in out}-set(ORDER);assert not missing,missing
out.sort(key=lambda r:(ORDER.index(r["ekran"]),r["satir"]))
nat=json.load(open("yerel.json"))
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
"• Platform: Her ikisi = Android ve iPhone'da aynı; Yalnızca Android / Yalnızca iPhone = o yazı sadece o telefonda çıkar.",
"• Kod yeri: Benim bulmam için satır numarası; dokunmana gerek yok.",
"","İşaretler:",
"• «…» Uygulamanın o anda doldurduğu değer: sayı, tarih, kilo, gün, yiyecek adı gibi. Örnek: '«…» gün sonra' → '3 gün sonra'.",
"• Bazı satırlar cümlenin bir parçasıdır (ör. 'iğneden sonraki'); uygulama bunları başka parçalarla birleştirip tek cümle yapar. Aynı ekrandaki yan satırlara bakınca cümlenin tamamı anlaşılır.",
"• Aynı yazı aynı ekranda birden çok yerde geçiyorsa bir kez yazıldı.",
"• Büyük harfli yazılar (ör. BUGÜN) uygulamada da büyük harfle görünür.",
"","Sayfalar:",
f"• Uygulama metinleri: {len(out)} satır (uygulamanın içi).",
f"• Widget ve sistem: {len(nat)} satır (Android ve iPhone ana ekran widget'ları, widget listesindeki ad ve açıklamalar, iPhone izin pencereleri).",
"• iPhone farkları: Android ile iPhone'da farklı yazılan yerler yan yana, en altta genel farklar (widget'lar, sağlık verisi, abonelik, izinler).",
"• Öğün önerileri (Ne yesem?), evre ipuçları, koç kartları, bildirimler ve kutu içi ipuçları da 'Uygulama metinleri' sayfasında; Tür sütunundan süzebilirsin.",
"• Ekranlara göre sayı: hangi ekranda kaç yazı olduğu.",
"","Bitince dosyayı bana geri gönder; 'Önerilen Türkçe' sütununu uygulamaya işlerim."]
for i,t in enumerate(info,1):
    c=ws.cell(i,1,t);c.alignment=Alignment(wrap_text=True,vertical="top")
ws["A1"].font=Font(bold=True,size=16,color="0B3B33")
for i,t in enumerate(info,1):
    if t in("Sütunlar:","İşaretler:","Sayfalar:"): ws.cell(i,1).font=Font(bold=True)
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
sheet("Uygulama metinleri",["No","Ekran","Tür","Metin","Platform","Önerilen Türkçe","Not","Kod yeri"],
      [[i,r["ekran"],r["tur"],r["metin"],r["pl"],"","",f"satır {r['satir']} · {r['fn']}"] for i,r in enumerate(out,1)],[6,32,24,60,16,50,24,22])
sheet("Widget ve sistem",["No","Platform","Yer","Metin","Önerilen Türkçe","Not","Kod yeri"],
      [[i,n["plat"],n["yer"],n["metin"],"","",n["kod"]] for i,n in enumerate(nat,1)],[6,12,44,60,50,24,26])
# iPhone farkları
g={}
for r in out:
    if r["pid"]: g.setdefault(r["pid"],[]).append(r)
fr=[]
for pid,L in g.items():
    an=" / ".join(x["metin"] for x in L if x["plat"]=="Android") or "(Android'de bu yazı yok)"
    ip=" / ".join(x["metin"] for x in L if x["plat"]=="iPhone") or "(iPhone'da bu yazı yok)"
    fr.append([L[0]["ekran"],an,ip,f"satır {L[0]['satir']}"])
fr.sort(key=lambda x:ORDER.index(x[0]))
fr=[[i]+x[:3]+["",""]+x[3:] for i,x in enumerate(fr,1)]
ext=[["Widget'lar","Android'de 12 widget: Döngü, Sıradaki iğne, Bugün, Kilo, Kilo grafiği, Hedefe ilerleme, Su, Protein, Adım, Takviyeler, Ne yesem?, Pano (4×4). Plus yoksa kilitli görünür.","iPhone'da 4 widget türü: Bugün, Sıradaki iğne, Kilo, Su (küçük/orta ve kilit ekranı). Yazıları 'Widget ve sistem' sayfasında ayrı satırlarda.","Widget ve sistem sayfası"],
     ["Sağlık verisi","Health Connect (Samsung Health, Google Fit, Fitbit vb. buraya yazar). Health Connect'te adım yoksa telefonun kendi adım sayacı kullanılabilir.","Apple Sağlık (iPhone ve Apple Watch adımları buraya yazar).","Adımlar ekranı"],
     ["Abonelik","Google Play üzerinden; iptal Google Play → Abonelikler.","App Store üzerinden; iptal Ayarlar → Apple Kimliği → Abonelikler; ödeme ekranında Kullanım koşulları bağlantısı var.","Hafif Plus ödeme ekranı"],
     ["İzin pencereleri","İzinleri Android sorar; yazılarını Android belirler.","Apple Sağlık, kamera ve fotoğraf izin pencerelerindeki açıklama yazıları Hafif'in; 'Widget ve sistem' sayfasında.","Widget ve sistem sayfası"]]
n=len(fr)
fr+= [[n+i+1,a,b,c,"","",d] for i,(a,b,c,d) in enumerate(ext)]
s2=sheet("iPhone farkları",["No","Ekran / konu","Android'de","iPhone'da","Önerilen Türkçe","Not","Kod yeri"],fr,[6,30,55,55,40,22,22])
s2.freeze_panes="C2"
import collections
cnt=collections.Counter(r["ekran"] for r in out)
s=wb.create_sheet("Ekranlara göre sayı")
s.append(["Ekran","Yazı sayısı"]);[setattr(s.cell(1,j),"font",H) or setattr(s.cell(1,j),"fill",HF) for j in (1,2)]
for e in ORDER: s.append([e,cnt[e]])
s.append(["Toplam",len(out)]);s.cell(s.max_row,1).font=Font(bold=True);s.cell(s.max_row,2).font=Font(bold=True)
s.column_dimensions["A"].width=50;s.column_dimensions["B"].width=14
wb.save(sys.argv[1] if len(sys.argv)>1 else "hafif-metinler.xlsx")
print(len(out),len(nat))
