# Hafif reklam çalışması: devir notu (güncel: 27 Kasım 2026, 20:50)

Bu dosya yeni oturumun başlangıç noktası. Ayrıntılı geçmiş: `google-ads.md` (günlük tablo, olaylar), `baglantilar.md` (kanal bağlantıları, Google iOS testi), `saatlik/` (Google Ads saatlik CSV'leri), `analiz.js` (saatlik özet betiği; `--saat=N` ile her günün N:59'a kadarki toplamı). Dal: `claude/sweet-hamilton-qn0ov7`. Uygulama kodu ve iOS derlemeleri başka oturumda (`surum-2.0`, `claude/gifted-keller-p80qcv`, DEVAM.md).

## Çalışma şekli (kullanıcı tercihleri)
- Kullanıcı Türkçe yazar, mobilden ekran görüntüsü atar; saatini yazar. Kısa, net, tablolu yorum ister.
- Google Ads'te **tıklama/gösterim/maliyet neredeyse anlık**; **yüklemeler tıklama saatine geriye dönük eklenir** (günün kesin rakamı ertesi gün oturur, gün içi rakam biraz düşük görünür). "2–3 saat gecikme" deme.
- Karşılaştırma için `saatlik/` raporlarından aynı saate kadarki toplamları hesapla.
- Kesin günlük rakamları ertesi gün `google-ads.md`'ye işle, commit + push.
- Uygulamada analitik/SDK yok; "veri toplama yok" ilkesi. Sağlık reklam kuralları: Google onaylıyor ("iğne" başlıkları onaylı), Meta'da ilaç adı/önce-sonra yok.

## Android – Google Ads "Hafif - Yükleme - TR" (ana kanal)
- Uygulama kampanyası, Türkiye/Türkçe, **günlük ₺300**, teklif **Yükleme hacmi + Hedef EBM (tCPI) ₺10** (19 Kas'tan beri). "Uygun (Sınırlı)": kişiselleştirilmiş reklamlarda sağlık kısıtı (kalıcı, normal).
- Kesin günler:

| Gün | Harcama | Yükleme | Yükleme başı |
|---|---|---|---|
| 17 Kas Sal | ₺199,82 | 16 | ₺12,49 |
| 18 Kas Çar | ₺202,25 | 36 | ₺5,62 |
| 19 Kas Per | ₺307,29 | 29 | ₺10,60 |
| 20 Kas Cum | ₺315,75 | 45 | ₺7,02 |
| 21 Kas Cmt | ₺326,28 | 50 | ₺6,53 |
| 22 Kas Paz | ₺344,29 | 50 | ₺6,89 |
| 23 Kas Pzt | ₺333,60 | 50 | ₺6,67 |
| 24 Kas Sal | ₺365,70 | 62 | ₺5,90 |
| 25 Kas Çar | ₺336,80 | 67 | ₺5,03 |
| 26 Kas Per | ₺339,47 | 70 | ₺4,85 |
| 27 Kas Cum (Black Friday) | 23:00'te ₺324,29 | 72 | ₺4,50 |

- 17:00'ye kadar karşılaştırma (saatlik rapor): 17 Kas ₺188/14, 20 Kas ₺178/23, 21 Kas ₺170/24, 22 Kas ₺181/27, 23 Kas ₺170/23, **24 Kas ₺157/24**.
- Saat dilimi (17–23 Kas): gece ₺8,7 · sabah 06–11 ₺9,6 (en pahalı; 07–08 ₺16–27) · öğleden sonra ₺7,2 · **akşam 17–23 ₺5,9, yüklemelerin %42'si**. tCPI ile harcama akşama kaydı.
- Play Console "Kullanıcı sayısını artırın" hunisi (son 28 gün, 27 Kas): Play cihaz gösterimi **8.310** (25 Kas'a kadar), cihaz edinme **508** (25 Kas'a kadar), ilk açılış **78** (21 Kas'a kadar; aynı dönemde ~260 edinme → ~%30, örneklemli/gecikmeli olabilir ama düşük), aylık etkin cihaz **86** (21 Kas), 7 gün elde tutma 1 (7 Kas, anlamsız). İzlenecek: ilk açılış/edinme oranı; düşükse onboarding ve ilk açılış bildirimi.
- Play Console 26 Kas akşamı TPG: edinme 24 Kas **66**; kayıp 24 Kas 31; toplam yükleme 24 Kas 407; MAU 19 Kas 65; DAU 19 Kas 16; **mağaza girişi ziyaretçisi 23 Kas 330, dönüşüm %16,4** (28 gün ort. %22,7; 18–23 Kas ~%12–27, düşük taraf); kilitlenme ve gelir: veri yok. Öneri: Black Friday sonrası Play mağaza girişi denemesi (A/B: ekran görüntüleri / kısa açıklama).
- Play Console 26 Kas sabahı TPG: edinme 23 Kas **57**; kullanıcı kaybı (kaldırma) 24 Kas **31** (22 Kas ~39 tepe, 23 Kas ~18); toplam yükleme 23 Kas **346**; etkin cihaz 21 Kas **152**; aylık etkin kullanıcı 18 Kas 50 (gecikmeli). Günlük kayıp edinmenin ~%40–50'si → net ~+30/gün.
- Play Console: 22 Kas'a kadar **314 cihaz edinme**; 20 Kas'ta 58 edinme (43 ücretli/doğrudan, 13 ilişkilendirilmemiş, 2 Play keşfetme). İlk açılış/etkin cihaz metrikleri örneklem ve 1–2 hafta gecikmeli.
- Ödeme: otomatik, eşik ₺500 (Google yükseltti). Kart Mastercard ••7634 (internet/yurt dışı açık kalmalı).
- **Promosyon:** 15 Ocak 2027'ye kadar 8.000 TL + KDV harcanırsa 8.000 TL kredi (₺300/gün ile Aralık ortası dolar; ₺135/gün altına inme).
- Kural: tek yavaş sabaha göre ayar değiştirme. Akşam 21:00'de ≤35 yükleme ve >₺10 birkaç gün sürerse tCPI ₺11–12.

## iPhone (zayıf taraf)
- App Store günlük indirme: 18 Kas ~15, 19 Kas ~15 (eş dost), 20 Kas 2, 21 Kas 8, 22 Kas 7, 23 Kas 2, 24 Kas 6, 25 Kas 7. 18–24 Kas toplam **55** (Trends). Güncelleme: 24 Kas ~33, 25 Kas 3 (2.0.13 dağıtımı). Gelir hâlâ yalnızca 19 Kas arkadaş satışı ($10 / net $5,56).
- **Google iOS Talep Yaratma: DURDURULDU** (22 Kas). ~₺460, ~1.170 tıklama, App Store'a ~1.000 sayfa ziyareti (App Referrer) ama ~%1 indirme. Kitle ilgisiz (Gmail/Discover/YouTube). Kampanya silinmedi.
- **Apple Ads Advanced "Hafif - Arama - TR" / grup "Kilo ve iğne":** Running, Search Results, Search Match açık, 100 $ promosyon kredisiyle (Basic ile ortak hesap kredisi, tek kredi). Son 7 gün: 17,45 $, ~12 yükleme, **CPA 1,45 $ (~₺66)**. En iyi kelimeler: **kilo takibi** (1,50 $; 13 dokunma/6 yükleme), **kilo verme** (1,50 $; 7/4), adımsayar (177 gösterim/3/2). Önerilen ama yapıldığı teyit edilmemiş: adımsayar 1,50→0,80 $, tartı 1,10→0,60 $; zayıflama 0 dokunma (ad değişikliği sonrası bak). Negatif: kilo alma. **Basic:** Max CPI 1,16 $, aylık 100 $ (0 harcama; duraklatılması önerildi). ⚠️ Aylık bütçe 1 Ara'da yenilenir, kredi bitince karttan öder → **30 Kas'ta devam/duraklat kararı**.
  - **25 Kas gece anahtar kelime tablosu** (tarih aralığı belirtilmedi): kilo verme 2,00 $ teklif, 88 gösterim/10 dokunma/6 yükleme, 5,15 $, CPA 0,86 $ · kilo takibi 2,00 $, 104/14/6, 9,20 $, CPA 1,53 $ · adımsayar 2,00 $, 223/6/2, 5,55 $, CPA 2,78 $ (TTR %2,7, en zayıf; 0,80 $'a indirilmesi önerildi) · aralıklı oruç 1,00 $, 27/2/1, 1,36 $ · zayıflama 0,60 $, 116/5/1, 2,32 $ · su içme hatırlatıcı 0,60 $, 14/2/1, 0,89 $. protein 0,60 $, 44/2/1, 0,72 $ · diyet 1,60 $, 7/1/1, 0,52 $ · Takviye 1,10 $, 1/0/0 · kalori hesaplama 0,01 $ (fiilen kapalı), 30/3/0, 1,77 $. **Toplam ~27,5 $, 45 dokunma, 19 yükleme, CPA ~1,45 $.** **Toplam harcama 25 Kas: 32 $ → kalan kredi ~68 $** (~4,5 $/gün; 1 Ara'da ~45 $ kalır, kredi ~15 Ara civarı biter). 30 Kas kararı aciliyetini kaybetti: kredi bitmeden karttan çekim yok; asıl karar kredi ~10 $'a inince. **26 Kas 19:28: reklam grubu "Kilo ve iğne" durumu "Ad group ended"** (bitiş tarihi geçmiş; kampanya "No running ad groups"). Kullanıcı 26 Kas akşamı düzeltti (yeni bitiş tarihi önerisi 14 Ara 2026; kredi bitmeden otomatik dursun, karttan çekim olmasın). Teklifler önceki nottan farklı (kilo verme, kilo takibi ve adımsayar 2,00 $'a çıkmış).
- Yorumlar: App Store'daki 2 değerlendirmeyi kullanıcı arkadaşlarına yazdırmış. Kendi cümleleri/gerçek kullanım değilse silinmeleri ya da yeniden yazılmaları önerildi (Apple 5.6.3). Doğru yol: uygulamaya SKStoreReviewController / Play In-App Review eklemek (diğer oturuma prompt verilecek).
- Geliştirici adı 24 Kas'ta **Ugur Bektas** olarak düzeldi (önce "ugut BEKTAS").

## Mağaza (ASO)
- Ad iki mağazada **"Hafif: GLP-1 ve Kilo Takibi"** (Play 22 Kas, App Store 2.0.13 derleme 21 ile 23–24 Kas yayında). App Store alt başlık "İğne günü, doz, protein ve su"; anahtar kelimeler `zayıflama,diyet,adım,enjeksiyon,ölçü,vücut,koç,tartı,takviye,yan etki,hatırlatıcı,glp1`. Metinler: `magaza/aciklama.md`, `magaza/app-store.md`.
- Etki ölçümü (1–2 hafta): Play Console "Google Play keşfetme" (önce ~2/gün), App Store Connect Sources "App Store Search" (önce 3–10/gün), Apple Ads TTR (önce %2,8).
- Apple öne çıkarma adaylığı gönderildi (yayın tarihi 1 Ocak 2027, Türkiye). Fikir: Ocak için "30 günlük protein ve su" In-App Event.
- YouTube/Play tanıtım videosu kapağı değişti (`magaza/video/hafif-youtube-kapak-1280x720.png`).
- Play "Satıcı statünüzü beyan edin" (DSA) uyarısı duruyor → **Tacirim**, apphafif@gmail.com; yapılmadıysa yapılmalı.
- App Store Small Business Program başvurusu yapıldı (22 Kas); onay bekleniyor (%30→%15).
- App Store Connect "Age Ratings: Location Sharing and Dating" soruları: Hayır/Hayır (15 Oca 2027'ye kadar).

## Instagram (@hafifapp)
- Öne çıkarma: "Hafif seninle neler yapar?" Reels, hedef internet sitesi ziyareti (iki mağazaya giden ortak bağlantı), bütçe ₺760, ~26 Kas biter. 22 Kas akşamı 941 gösterim/20 ziyaret/₺132; 23 Kas 19:54 2.579/54/₺262,66 (son 24 saatte ziyaret başı ~₺3,8). İndirme ölçülemiyor (ortak bağlantı etiketsiz) → App Store "Web Referrer", Play "üçüncü taraf/ilişkilendirilmemiş" artışından tahmin.
- Reklam güvenli videolar: `magaza/video/hafif-reklam-2-1080x1920.mp4` (26 sn, yeni tasarım, kapak `hafif-reklam-2-kapak.png`), `hafif-reklam-1080x1920.mp4` (32 sn, 2.0 ekranları). Kaynak: `magaza/kaynak/video/sahne-reklam*.html`, `video.js --dikey --sahne=… --ad=…`.

## Abonelik (en kritik veri)
- Yabancı ücretli abone **henüz 0** (19 Kas App Store satışı kullanıcının arkadaşı).
- 7 gün ücretsiz Plus uygulama içinde (mağaza denemesi değil) → mağazalar denemeyi saymaz.
- İlk reklam kullanıcılarının denemesi **24 Kas'tan** itibaren bitiyor. Takip: Play Console → Siparişler ("Test:" yazmayanlar), App Store Connect → Subscriptions/Paid Plans.
- Bu oran (hedef %3+) şunları belirleyecek: bütçe artışı, Apple Ads'e kendi parayla devam, SDK kararı.

## Oturum "Hafif Reklam 2" (24–27 Kas) özeti
- Android 24/25/26 Kas üç gün üst üste rekor: 62 / 67 / 70 yükleme, YBM ₺5,90 / ₺5,03 / ₺4,85 (17–26 Kas toplam ₺3.071,25 / 475 / ₺6,47). Gün içi seyir: sabah kısık ve pahalı, 15–17 durgun, 17–23 günün ~%45'i. Tek sabaha/öğleden sonraya bakıp ayar değiştirme.
- 27 Kas Black Friday: sabah TO %1,6, TBM ₺3,1, 10:30'da 5 yükleme/₺15; akşam toparladı (20:20'de 52/₺5,07; 23:00'te 72/₺4,50, 7.840 gösterim, TO %2,63, TBM ₺1,57; kesin rakam 28 Kas). tCPI ₺10 koruyucu çalıştı. BF'de bütçe artırma reddedildi; plan: 1–2 Ara ₺300→₺360, sonra ₺430 → ₺500 (YBM <₺6 ve en az 1 gerçek abone şartıyla).
- Google "15 başlık" e-postası: şimdi dokunma; ~1 Ara yeni öğeler (başlık adayları sohbette: "GLP-1 iğne günün hep aklında", "Doz, kilo ve protein tek yerde", "Haftalık iğneni unutma", "Bulantını ve iştahını kaydet", "Doktoruna PDF rapor götür", "Kası koru: protein ve su", "Hesap yok, veri telefonunda", "Kilo eğrini haftalık gör", "Kalem stoğun bitmeden haber"; ilaç markası yok) + yeni görseller/video.
- Black Friday: Plus yıllık %40 (499,99 → 299,99 ₺), 27–30 Kas; uygulama içi bant + 27 ve 30 Kas 20:00 yerel bildirim. Prompt: `black-friday-prompt.md` (uygulama oturumuna verildi; Android önce). Güncellemenin ve mağaza fiyatının yayında olduğu **teyit edilmedi**. 1 Ara fiyatı geri al (BF alanları eski fiyatta kalsın). Play "Tanıtım içeriği" önerildi, yapıldığı bilinmiyor.
- **Abonelik 0 — bulgu:** uygulamada deneme sonu ödeme ekranı yalnızca kullanıcı 8. günden sonra uygulamayı kendisi açarsa ve tek sefer çıkıyor (`trialEndCheck`, www/index.html); deneme sonu bildirimi yok. Öneri (uygulama oturumuna iş): 6. gün "Plus yarın bitiyor" + 8. gün bildirimi → ödeme ekranı. Ayrıca test hesabı olmayan gerçek Google hesabıyla bir satın alma yapıp iade ederek Play ödeme akışını canlıda doğrula.
- Play mağaza girişi dönüşümü %16,4 (düşük) → ~1 Ara Play mağaza girişi denemesi (önce ekran görüntüleri, sonra kısa açıklama). Play hunisi: ilk açılış/edinme ~%30 (örneklemli olabilir), kaldırma ~%45 → ~4 Ara tekrar bak.
- App Store yeni "Header and Search Results" özelliği → BF sonrası değerlendir.
- Apple Ads: reklam grubu bitiş tarihi geçmişti (26 Kas düzeltildi; öneri bitiş 14 Ara). adımsayar 2,00 → 0,80 $ önerisi yapıldı mı teyit edilmedi. Kredinin son kullanma tarihi e-postadan kontrol edilecek.

## Bekleyen kararlar / sıradaki işler
1. Her gün: Android kesin rakam → `google-ads.md`.
2. 24–30 Kas: ilk abonelikler (iki platform).
3. ~26 Kas: Instagram öne çıkarma sonucu; Web Referrer / ilişkilendirilmemiş artışı.
4. 25–30 Kas: yeni adın etkisi (Search, Play keşfetme, Apple Ads TTR).
5. **30 Kas:** Apple Ads devam/duraklat (1 Ara bütçe yenilenmesi öncesi). Basic duraklat.
6. Play Console ↔ Google Ads: Plus aboneliklerini dönüşüm olarak saymak (SDK'sız, ilk abonelikler gelince).
7. iPhone büyümesi için seçenekler: Instagram mikro içerik üreticisi testi (ct + UTM bağlantılı), Apple Ads Custom Product Page (GLP-1/iğne odaklı), SDK kararı (~5 Ara, abone oranına göre; önce SKAdNetwork yolu, olmazsa yalnızca kurulum+abonelik ölçen sınırlı Meta SDK).
8. Uygulama içi değerlendirme isteği (SKStoreReviewController / Play In-App Review) → diğer oturuma iş.
9. Nisan 2027'den önce iOS derlemeleri Xcode 27 / iOS 27 SDK ile yapılmalı (Apple ITMS-90725 uyarısı).
