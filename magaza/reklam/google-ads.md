# Google Ads – Hafif – Yükleme – TR

Uygulama kampanyası (Android), Türkiye, Türkçe. Teklif: "Yükleme hacmi", tüm kullanıcılar, yükleme başı hedef yok.
Başlangıç: 16 Kasım 2026, ~21:47.

## Günlük özet

| Gün | Bütçe | Harcama | Tıklama | Yükleme | Yükleme başı | Not |
|---|---|---|---|---|---|---|
| 16–17 Kas | ₺100 | ₺199,81 | 57 | 16 | ₺12,49 | 17 Kas ~18:00'de günlük bütçe doldu, akşam reklamsız |
| 18 Kas | ₺150 → ₺200 | ₺191,80 | ~116 | 33 | ₺5,81 | ~07:00'de ilk ₺250 kart çekimi geçmedi, ~1 saat durdu |
| **Toplam** | | **₺391,61** | | **49** | **₺7,99** | |

Not: Google Ads rakamları birkaç gün içinde düzeltilebilir (geçersiz trafik ayıklaması, geç gelen dönüşümler).

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

### 18 Kasım saat blokları

| Blok | Harcama | Yükleme | Yükleme başı |
|---|---|---|---|
| Gece 00–05 | ₺30,04 | 3 | ₺10,01 |
| Sabah 06–11 | ₺43,83 | 5 | ₺8,77 |
| Öğleden sonra 12–16 | ₺36,33 | 9 | ₺4,04 |
| Akşam 17–23 | ₺81,61 | 16 | ₺5,10 |

Akşam 17–23, yüklemelerin ~%48'ini getirdi. Tek günlük veri; en az bir haftalık raporla doğrulanmalı.

## Yapılacaklar

- [ ] 22–23 Kas: 7 günlük değerlendirme (yükleme başı, günlük hacim, saat dağılımı)
- [ ] Play Console: kullanıcı edinmeleri, etkin kullanıcılar, kayıplar (kalıcılık)
- [ ] Öğrenme bitince yeni öğeler: başlıklar, açıklamalar, 1200x628 / 1200x1200 / 1200x1500 görseller
- [ ] Play Console ↔ Google Ads bağlantısı: Plus aboneliklerini dönüşüm olarak saymak
- [ ] Mastercard ••7634'te internet ve yurt dışı işlemleri kalıcı açık olsun (otomatik ödeme)

## Referans

- Play Store: https://play.google.com/store/apps/details?id=com.ugurbektas.hafif
- IARC Global Rating ID: `68cef814-1afb-8393-8060-3fc39bf5e943` (16 Kas 2026)
