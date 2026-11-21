# Google Ads – Hafif – Yükleme – TR

Uygulama kampanyası (Android), Türkiye, Türkçe. Teklif: "Yükleme hacmi", tüm kullanıcılar, yükleme başı hedef yok.
Başlangıç: 16 Kasım 2026, ~21:47.

## Günlük özet

| Gün | Bütçe | Harcama | Tıklama | Yükleme | Yükleme başı | Not |
|---|---|---|---|---|---|---|
| 16–17 Kas | ₺100 | ₺199,82 | 57 | 16 | ₺12,49 | 16 Kas gece gösterim yok; 17 Kas 04:00–17:59 arası yayın, ~18:00'de günlük bütçe doldu |
| 18 Kas | ₺150 → ₺200 | ₺202,25 | 128 | 36 | ₺5,62 | ~07:00'de ilk ₺250 kart çekimi geçmedi, ~1 saat durdu |
| 19 Kas (akşam, kampanya raporu) | ₺200 → ₺300, tCPI ₺10 (~13:45) | ₺308,19 | 112 | 27 | ₺11,41 | 11:00'e kadar ₺217/24 yükleme; tCPI sonrası +₺91, +3 yükleme (geç gelen dönüşümler eklenebilir). Ham rapor: `gunluk/2026-11-19-kampanya.csv` |
| 20 Kas | ₺300, tCPI ₺10 | ₺280,77 (akşam, kesinleşecek) | 178 | 34 | ₺8,26 | tCPI 2. gün: gece ~₺23, gündüz/akşam ₺4–9; TO %8,39, TBM ₺1,58. 100. yükleme bu gün |
| 21 Kas (Cmt) | ₺300, tCPI ₺10 | ₺326,28 | 145 | **50** | **₺6,53** | En iyi gün; harcama güne dengeli yayıldı (13:00'te ₺95) |
| **Toplam (17–21 Kas)** | | **~₺1.316** | | **~165** | **~₺7,98** | 20 Kas akşam rakamıyla (34); kesinleşince küçük fark olabilir |

Not: Google Ads rakamları birkaç gün içinde düzeltilebilir (geçersiz trafik ayıklaması, geç gelen dönüşümler).
Günlük satırlar `saatlik/` raporlarından (`node magaza/reklam/analiz.js`). Tıklama sayısı saatlik raporda yok.

## Erişim (16–18 Kas)

| Tekil kullanıcı | Ort. sıklık | Gösterim | BGBM | Tekil kullanıcı başına |
|---|---|---|---|---|
| ~2.180 | 1,57 | 3.410 | ₺115 | ₺0,18 |

Reklamı gören kişilerin ~%2,2'si yükledi. Sıklık 4–5'i geçerse yeni öğe (görsel/metin) eklenmeli.

## Olaylar ve kararlar

- **16 Kas** – Kampanya başladı. Günlük bütçe ₺100.
- **17 Kas 18:36** – Bütçe ₺100 → ₺150 (günlük bütçe akşamdan önce doluyordu).
- **17 Kas** – Durum "Uygun (Sınırlı)": *Kişiselleştirilmiş reklamlarda sağlık*. Kalıcı kısıt; itiraz edilmez, kitle hedeflemesi kullanılamaz.
- **18 Kas ~07:00** – Ödeme eşiği (₺250) aşıldı, otomatik çekim geçmedi → "Reklamlarınız yayınlanmıyor". Elle ödeme yapıldı, ~08:00'de yeniden yayında.
- **18 Kas gün içi** – Bütçe ₺150 → ₺200.
- **19 Kas ~11:00** – Bütçe ₺200 sabah 11:00'e kadar harcandı (09:00 ₺54, 10:00 ₺40), ₺217'de durdu. Ödeme sorunu yok: Google ödeme eşiğini ₺250 → ₺500'e çıkardı (bakiye ₺394,93; sonraki çekim ₺500'de ya da 1 Ara).
- **19 Kas ~13:45** – Bütçe ₺200 → ₺250 → **₺300**; teklif **Hedef EBM (tCPI) ₺10** açıldı. Gerekçe: 3 gündür bütçe pahalı sabah saatlerinde bitiyor (06–11 yükleme başı ~₺13), akşam (~₺5) aç kalıyor. Yeni öğrenme 2–3 gün.
  - 21–22 Kas değerlendirme: günlük yükleme %30+ düştüyse (≤20/gün) hedef ₺12; harcama bütçenin çok altındaysa ₺11–12; ₺10 civarı ve akşamlar doluysa dokunma.
- ~~Karar: 22–23 Kasım'a kadar ayarlara dokunulmayacak.~~ (19 Kas'ta tCPI ile değişti)

## Saatlik raporlar

Google Ads → Analizler ve raporlar → Reklamların gösterilme yeri ve zamanı → Reklamların gösterilme zamanı → **Gün ve saat** → İndir (CSV).
Dosyayı `saatlik/YYYY-AA-GG.csv` olarak kaydet, özet için:

```
node magaza/reklam/analiz.js
```

### Saat blokları (17–19 Kas, 19 Kas 10:59'a kadar)

| Blok | Harcama | Yükleme | Yükleme başı | Harcama payı | Yükleme payı |
|---|---|---|---|---|---|
| Gece 00–05 | ₺142,09 | 16 | ₺8,88 | %23 | %21 |
| Sabah 06–11 | ₺283,25 | 22 | ₺12,88 | %46 | %29 |
| Öğleden sonra 12–16 | ₺89,94 | 17 | ₺5,29 | %15 | %22 |
| Akşam 17–23 | ₺104,15 | 21 | ₺4,96 | %17 | %28 |

Sabah 06–11 harcamanın yarısını alıyor ama en pahalı dilim (08:00 ₺20, 10:00 ₺15). Öğleden sonra ve akşam ~₺5. Uygulama kampanyasında saat ayarı yok; bütçe akşama kalmalı.

## Yapılacaklar

- [ ] 22–23 Kas: 7 günlük değerlendirme (yükleme başı, günlük hacim, saat dağılımı)
- [ ] Play Console: kullanıcı edinmeleri, etkin kullanıcılar, kayıplar (kalıcılık)
- [ ] Öğrenme bitince yeni öğeler: başlıklar, açıklamalar, 1200x628 / 1200x1200 / 1200x1500 görseller
- [ ] Play Console ↔ Google Ads bağlantısı: Plus aboneliklerini dönüşüm olarak saymak
- [ ] Mastercard ••7634'te internet ve yurt dışı işlemleri kalıcı açık olsun (otomatik ödeme)

## Apple Ads (iOS)

- **Advanced – "Hafif - Arama - TR"** (18 Kas 23:09'dan beri): Search Results, Türkiye, günlük 4,40 $, dokunma teklifi 0,10 $ (öneri 1,16 $), 25 geniş anahtar kelime, Search Match açık. 19 Kas sabahına kadar 0 gösterim → duraklatılacak.
- **Basic** (19 Kas 2026'dan beri): Türkiye, Max CPI **0,40 $** (öneri 1,16 $), aylık bütçe **100 $**. Sadece yükleme başına ödeme.
  - İlk denemede "Server encountered an error" (kod `6c462b97-9379-42cf-b95c-427639aac6d5_1795062862249.208B370`), ikinci denemede oluştu.
  - Plan: 3–4 gün bekle; hiç yükleme yoksa Max CPI 0,60 $; 23 Kas'ta Google ile karşılaştır.
  - **19 Kas 07:32: 100 $ Apple Ads Basic promosyon kredisi** hesaba tanımlandı (koşullar e-postada * ile). Aylık bütçe 100 $ olduğu için bu ayın harcaması krediden düşer.
  - **19 Kas ~13:30: Max CPI 0,40 $ → 1,16 $** (Apple önerisi; kredi bedava olduğu için gerçek maliyeti görmek için). Aylık bütçe 100 $ sabit.
  - ⚠️ Aylık bütçe **1 Aralık'ta yenilenir**; kredi bittiyse karttan ödenir. 30 Kas'ta devam/pause kararı.
- **App Store Connect Analytics, 18 Kas (yayının ilk günü, reklamsız):** 15 ilk indirme, 55 gösterim, 27 ürün sayfası görüntüleme (sayfadan indirmeye ~%56). Apple Ads o gün 0 gösterim. Kullanıcıya göre çoğu eş-dost indirmesi → gerçek organik/mağaza dönüşüm ölçüsü değil.
- Reklam önizlemesinde geliştirici adı **"ugut BEKTAS"** görünüyor (Apple'daki ad düzeltmesi bekliyor).
- Not: iOS'ta SDK eklenmeyecek ("Data Not Collected"); Google/Meta iOS uygulama kampanyası yok.

## Google Ads promosyonu

8.000 TL: 15 Ocak 2027'ye kadar 8.000 TL + KDV harcanırsa 8.000 TL kredi. ₺200/gün ile hedef tutuyor; ₺135/günün altına inilirse kaçar.

## Referans

- Play Store: https://play.google.com/store/apps/details?id=com.ugurbektas.hafif
- IARC Global Rating ID: `68cef814-1afb-8393-8060-3fc39bf5e943` (16 Kas 2026)
