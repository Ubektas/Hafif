# Google Ads – Hafif – Yükleme – TR

Uygulama kampanyası (Android), Türkiye, Türkçe. Teklif: "Yükleme hacmi", tüm kullanıcılar, yükleme başı hedef yok.
Başlangıç: 16 Kasım 2026, ~21:47.

## Günlük özet

| Gün | Bütçe | Harcama | Tıklama | Yükleme | Yükleme başı | Not |
|---|---|---|---|---|---|---|
| 16–17 Kas | ₺100 | ₺199,82 | 57 | 16 | ₺12,49 | 16 Kas gece gösterim yok; 17 Kas 04:00–17:59 arası yayın, ~18:00'de günlük bütçe doldu |
| 18 Kas | ₺150 → ₺200 | ₺202,25 | 128 | 36 | ₺5,62 | ~07:00'de ilk ₺250 kart çekimi geçmedi, ~1 saat durdu |
| 19 Kas (10:59'a kadar) | ₺200 | ₺217,36 | — | 24 | ₺9,06 | Bütçeyi sabah aştı (₺400'e kadar izinli); 07:00'de yine neredeyse sıfır harcama (2. ödeme eşiği?) |
| **Toplam** | | **₺619,43** | | **76** | **₺8,15** | saatlik rapora göre (16–19 Kas 10:59) |

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
- **Karar:** 22–23 Kasım'a kadar (öğrenme dönemi) ayarlara dokunulmayacak.

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
- Reklam önizlemesinde geliştirici adı **"ugut BEKTAS"** görünüyor (Apple'daki ad düzeltmesi bekliyor).
- Not: iOS'ta SDK eklenmeyecek ("Data Not Collected"); Google/Meta iOS uygulama kampanyası yok.

## Google Ads promosyonu

8.000 TL: 15 Ocak 2027'ye kadar 8.000 TL + KDV harcanırsa 8.000 TL kredi. ₺200/gün ile hedef tutuyor; ₺135/günün altına inilirse kaçar.

## Referans

- Play Store: https://play.google.com/store/apps/details?id=com.ugurbektas.hafif
- IARC Global Rating ID: `68cef814-1afb-8393-8060-3fc39bf5e943` (16 Kas 2026)
