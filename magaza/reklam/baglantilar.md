# Kanal bağlantıları (SDK'sız ölçüm)

iPhone: App Store Connect → Analytics → Acquisition → Campaigns ("Generate a Campaign Link").
Raporda görünmesi için bir kampanyadan en az 5 farklı Apple hesabının yüklemesi gerekir; veri 1–2 gün gecikmeli.

Android: Play bağlantısına `referrer` (URL kodlu UTM) eklenir; Play Console → Büyüme → Edinme raporları.

| Kanal | iPhone (App Store, `ct`) | Android (Play, UTM) |
|---|---|---|
| Google Talep Yaratma (iOS testi) | https://apps.apple.com/app/apple-store/id6830226671?pt=129732609&ct=google-ios&mt=8 | — (Android'de uygulama kampanyası var) |
| Instagram profil | (oluşturulacak: `instagram-bio`) | https://play.google.com/store/apps/details?id=com.ugurbektas.hafif&referrer=utm_source%3Dinstagram%26utm_medium%3Dbio |
| Instagram lansman | (oluşturulacak: `instagram-lansman`) | https://play.google.com/store/apps/details?id=com.ugurbektas.hafif&referrer=utm_source%3Dinstagram%26utm_medium%3Dsocial%26utm_campaign%3Dlansman |
| QR kod | (oluşturulacak: `qr-kod`) | https://play.google.com/store/apps/details?id=com.ugurbektas.hafif&referrer=utm_source%3Dqr%26utm_medium%3Dbasili |
| WhatsApp | (oluşturulacak: `whatsapp`) | https://play.google.com/store/apps/details?id=com.ugurbektas.hafif&referrer=utm_source%3Dwhatsapp%26utm_medium%3Dpaylasim |

App Store uygulama kimliği: `id6830226671` · sağlayıcı (pt): `129732609`
Play paket adı: `com.ugurbektas.hafif`

## Google Talep Yaratma – iOS testi (plan)

- Hedef: iPhone kullanıcılarına tıklama odaklı reklam; indirmeleri App Store Connect'teki `google-ios` kampanyasından ölçmek.
- Talep Yaratma, teklif: tıklamaları en üst düzeye çıkar, ₺100/gün, bitiş 27 Kas, Türkiye/Türkçe, cihaz: mobil + iOS.
- Görseller: `her-sey-*` ve `ne-yesem-*` (dikey 1200x1500, kare 1200x1200, yatay 1200x628; `claude/gifted-keller-p80qcv` dalında `magaza/reklam/`).
- Değerlendirme 27–28 Kas: App Store indirme başı ≤ ₺30 → devam; üstü ya da indirme yok → kapat.
