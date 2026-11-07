#!/usr/bin/env python3
"""Android (Java, strings.xml) ve iPhone (Swift, Info.plist) yazılarını yerel.json'a döker. Depo kökünden çalıştır."""
import re,glob,json,sys
TR=re.compile(r"[çğıöşüÇĞİÖŞÜ]")
SKIPCALL=re.compile(r"(opt\w*|get\w*|put|has|isNull|equals|startsWith|endsWith|parse|SimpleDateFormat|reject|resolve|Log\.\w|forName|getIdentifier|getSharedPreferences|setAction|putExtra|getStringExtra|custom|Image|systemName|named|fixedSize|kind|ofType|appendingPathComponent|containerURL|UserDefaults|string|double|integer|bool|object|key|forKey|data|contains|hasPrefix|hasSuffix|dateFormat|Locale|identifier|url|URL|NSLog|print|fatalError)\s*\(\s*$")
def keep(t):
    t=t.strip()
    if len(t)<2 and t not in("+",): return False
    if re.fullmatch(r"[a-z0-9_./:#%-]*",t): return False      # anahtarlar, yollar
    if re.fullmatch(r"[A-Za-z]{1,2}",t) and not TR.search(t): return False
    if re.fullmatch(r"[EMydHhmsaLz.: ,'-]+",t): return False  # tarih biçimleri
    if re.search(r"(Bold|Medium|Regular)$|^com\.|^group\.|\.ttf$|\.json$|^sans-serif|^#",t): return False
    if not re.search(r"[A-Za-zçğıöşüÇĞİÖŞÜ]",t): return False
    if re.fullmatch(r"[A-Za-z]+[A-Z][A-Za-z«…»]*|[a-z]+«…»",t): return False   # kod adları (HafifWidget, suDugme)
    if re.search(r"\\\(|\$0|\?\?|^[?&]\w+=|_[A-Z]{2}|Configuration|^M\d|\dQ\d|^[\d.,]+$",t): return False
    return True
JM={"draw":"Ortak","emptyG":"Ortak","hdr":"Ortak","compact":"Ortak","noShots":"İğne widget'ları (iğne kaydı yokken)","dayWord":"Sıradaki iğne / Döngü","dongu":"Döngü widget'ı","siradaki":"Sıradaki iğne widget'ı","weekStrip":"Sıradaki iğne widget'ı","bugun":"Bugün widget'ı","kilo":"Kilo widget'ı","trendWord":"Kilo widget'ı","etaWord":"Kilo widget'ı","monthOf":"Kilo widget'ı","grafik":"Kilo grafiği widget'ı","hedef":"Hedef ve rozet widget'ı","su":"Su widget'ı","protein":"Protein widget'ı","adim":"Adım widget'ı","ringWidget":"Su / Protein / Adım widget'ları","takviye":"Takviye widget'ı","yemek":"Ne yesem? widget'ı","pano":"Pano (4×4) widget'ı","miniCard":"Pano (4×4) widget'ı","locked":"Kilitli widget (Plus yokken)"}
SM={"BugunGorunum":"Bugün widget'ı","IgneGorunum":"Sıradaki iğne widget'ı","KiloGorunum":"Kilo widget'ı","SuGorunum":"Su widget'ı","HafifKart":"Ortak","Bicim":"Tarih ve sayı yazımı"}
out=[]
def add(plat,yer,t,f,i):
    t=re.sub(r"\\\((?:[^()]|\([^()]*\))*\)","«…»",t).replace("\\n"," ").replace("\\'","'").replace('\\"','"')
    if keep(t): out.append(dict(plat=plat,yer=yer,metin=t,kod=f"{f.split('/')[-1]}:{i}"))
base="android/app/src/main/java/com/ugurbektas/hafif/"
for f in sorted(x for x in glob.glob(base+"**/*.java",recursive=True) if "Glyphs" not in x):
    fn=f.split("/")[-1];ctx="Ortak"
    for i,l in enumerate(open(f,encoding="utf8"),1):
        m=re.match(r"\s*(?:private|public|static|protected)[^=;(]*?\s(\w+)\s*\(",l)
        if m: ctx=m.group(1)
        if l.strip().startswith(("//","*","/*","import","Log.")): continue
        for mm in re.finditer(r'"((?:[^"\\]|\\.)*)"',l):
            if SKIPCALL.search(l[:mm.start()]): continue
            if fn=="WidgetRenderer.java": yer="Android widget › "+JM.get(ctx,"Ortak")
            elif fn=="WidgetData.java": yer="Android widget › Ortak (gün adları, tarih)"
            elif fn=="WidgetPlugin.java": yer="Android › Paylaşım / e-posta penceresi"
            elif "adim" in f: yer="Android › Telefonun adım sayacı"
            else: yer="Android › Diğer"
            add("Android",yer,mm.group(1),f,i)
for i,l in enumerate(open("android/app/src/main/res/values/strings.xml",encoding="utf8"),1):
    for m in re.finditer(r'<string name="([^"]*)"[^>]*>([^<]*)</string>',l):
        add("Android","Android › Widget ekleme listesindeki ad ve açıklama" if m.group(1)!="app_name" else "Android › Uygulama adı",m.group(2),"strings.xml",i)
for f in sorted(glob.glob("ios/App/HafifWidget/*.swift")+["ios/App/App/HafifWidgetPlugin.swift","ios/App/App/SceneDelegate.swift","ios/App/App/AppDelegate.swift"]):
    try: L=open(f,encoding="utf8").read().split("\n")
    except FileNotFoundError: continue
    ctx="Ortak";fn=f.split("/")[-1]
    for i,l in enumerate(L,1):
        m=re.match(r"\s*(?:struct|enum|extension)\s+(\w+)",l)
        if m: ctx=m.group(1)
        if l.strip().startswith(("//","import")) or "localizedDescription" in l: continue
        for mm in re.finditer(r'"((?:[^"\\]|\\.)*)"',l):
            if SKIPCALL.search(l[:mm.start()]): continue
            if fn=="HafifWidgetBundle.swift": yer="iPhone widget › Widget ekleme listesindeki ad ve açıklama"
            elif fn=="HafifVeri.swift": yer="iPhone widget › Ortak (bölge adları vb.)"
            elif fn=="HafifNiyet.swift": yer="iPhone widget › Su ekleme düğmesi"
            elif "HafifWidget/" in f: yer="iPhone widget › "+SM.get(ctx,"Ortak")
            else: yer="iPhone › Diğer"
            add("iPhone",yer,mm.group(1),f,i)
pl=open("ios/App/App/Info.plist",encoding="utf8").read().split("\n")
for i,l in enumerate(pl,1):
    m=re.search(r"<key>(NS\w+UsageDescription)</key>",l)
    if m:
        v=re.search(r"<string>(.*)</string>",pl[i]).group(1)
        add("iPhone","iPhone › İzin pencereleri ("+{"NSHealthShareUsageDescription":"Apple Sağlık okuma","NSHealthUpdateUsageDescription":"Apple Sağlık yazma","NSPhotoLibraryUsageDescription":"Fotoğraflar","NSPhotoLibraryAddUsageDescription":"Fotoğraflara kaydetme","NSCameraUsageDescription":"Kamera","NSMotionUsageDescription":"Hareket"}.get(m.group(1),m.group(1))+")",v,"Info.plist",i+1)
seen=set();res=[]
for o in out:
    k=(o["yer"],o["metin"])
    if k in seen: continue
    seen.add(k);res.append(o)
json.dump(res,open(sys.argv[1] if len(sys.argv)>1 else "yerel.json","w"),ensure_ascii=False)
print(len(res))
