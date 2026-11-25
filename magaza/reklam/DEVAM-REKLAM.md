# Hafif reklam çalışması: devir notu (24 Kasım 2026, 17:30)

Bu dosya yeni oturumun başlangıç noktası. Ayrıntılı geçmiş: `google-ads.md` (günlük tablo, olaylar), `baglantilar.md` (kanal bağlantıları, Google iOS testi), `saatlik/` (Google Ads saatlik CSV'leri), `analiz.js` (saatlik özet betiği). Dal: `claude/sweet-hamilton-qn0ov7`. Uygulama kodu ve iOS derlemeleri başka oturumda (`surum-2.0`, `claude/gifted-keller-p80qcv`, DEVAM.md).

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
| 25 Kas Çar | 17:17'de ₺167,30 | 34 | ₺4,92 |

- 17:00'ye kadar karşılaştırma (saatlik rapor): 17 Kas ₺188/14, 20 Kas ₺178/23, 21 Kas ₺170/24, 22 Kas ₺181/27, 23 Kas ₺170/23, **24 Kas ₺157/24**.
- Saat dilimi (17–23 Kas): gece ₺8,7 · sabah 06–11 ₺9,6 (en pahalı; 07–08 ₺16–27) · öğleden sonra ₺7,2 · **akşam 17–23 ₺5,9, yüklemelerin %42'si**. tCPI ile harcama akşama kaydı.
- Play Console: 22 Kas'a kadar **314 cihaz edinme**; 20 Kas'ta 58 edinme (43 ücretli/doğrudan, 13 ilişkilendirilmemiş, 2 Play keşfetme). İlk açılış/etkin cihaz metrikleri örneklem ve 1–2 hafta gecikmeli.
- Ödeme: otomatik, eşik ₺500 (Google yükseltti). Kart Mastercard ••7634 (internet/yurt dışı açık kalmalı).
- **Promosyon:** 15 Ocak 2027'ye kadar 8.000 TL + KDV harcanırsa 8.000 TL kredi (₺300/gün ile Aralık ortası dolar; ₺135/gün altına inme).
- Kural: tek yavaş sabaha göre ayar değiştirme. Akşam 21:00'de ≤35 yükleme ve >₺10 birkaç gün sürerse tCPI ₺11–12.

## iPhone (zayıf taraf)
- App Store günlük indirme: 18 Kas ~15, 19 Kas ~15 (eş dost), 20 Kas 2, 21 Kas 8, 22 Kas 6, 23 Kas ~2. 17–23 Kas toplam 49.
- **Google iOS Talep Yaratma: DURDURULDU** (22 Kas). ~₺460, ~1.170 tıklama, App Store'a ~1.000 sayfa ziyareti (App Referrer) ama ~%1 indirme. Kitle ilgisiz (Gmail/Discover/YouTube). Kampanya silinmedi.
- **Apple Ads Advanced "Hafif - Arama - TR" / grup "Kilo ve iğne":** Running, Search Results, Search Match açık, 100 $ promosyon kredisiyle (Basic ile ortak hesap kredisi, tek kredi). Son 7 gün: 17,45 $, ~12 yükleme, **CPA 1,45 $ (~₺66)**. En iyi kelimeler: **kilo takibi** (1,50 $; 13 dokunma/6 yükleme), **kilo verme** (1,50 $; 7/4), adımsayar (177 gösterim/3/2). Önerilen ama yapıldığı teyit edilmemiş: adımsayar 1,50→0,80 $, tartı 1,10→0,60 $; zayıflama 0 dokunma (ad değişikliği sonrası bak). Negatif: kilo alma. **Basic:** Max CPI 1,16 $, aylık 100 $ (0 harcama; duraklatılması önerildi). ⚠️ Aylık bütçe 1 Ara'da yenilenir, kredi bitince karttan öder → **30 Kas'ta devam/duraklat kararı**.
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
