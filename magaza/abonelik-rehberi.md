# Hafif Plus – Play Console'da abonelik açma

Uygulamadaki kod hazır. Ürünü ve planları Play Console'da **tam olarak bu kimliklerle** açman gerekiyor; kimlikler sonradan değiştirilemez.

| Alan | Değer |
|---|---|
| Ürün kimliği (Product ID) | `hafif_plus` |
| Temel plan 1 | `aylik`: 1 ay, otomatik yenilenen, **99,99 ₺** |
| Temel plan 2 | `uc-aylik`: 3 ay, otomatik yenilenen, **229,99 ₺** |
| Temel plan 3 | `yillik`: 1 yıl, otomatik yenilenen, **499,99 ₺** |
| (İsteğe bağlı) Deneme teklifi | `yillik` planına teklif: `deneme`, 7 gün ücretsiz, uygunluk: "Yeni müşteri kazanımı" |

## 0. Önce
1. **Ödeme profili:** Play Console → Ayarlar → Ödeme profili. Banka hesabı (IBAN) ve vergi bilgileri girilmeden ücretli ürün açılamaz.
2. Faturalandırma izni olan bir AAB'nin (1.5.0 ve sonrası) herhangi bir kanala, örneğin kapalı teste, yüklenmiş olması gerekir. Play, uygulama BILLING iznini içermeden abonelik sayfasını açmaz.

## 1. Aboneliği oluştur
Play Console → Hafif → **Para kazanma → Ürünler → Abonelikler** → **Abonelik oluştur**
- Ürün kimliği: `hafif_plus`
- Ad: `Hafif Plus`
- Avantajlar (en fazla 4, mağazada abonelik sayfasında görünür):
  - Kilo değişiminin tüm grafikleri
  - Doktor için PDF rapor
  - Yan etki analizi
  - Kalori ve yemek takibi (yakında)

## 2. Temel planları ekle
Aboneliğin içinde → **Temel plan ekle** (üç kez)
- Temel plan kimliği: `aylik` / `uc-aylik` / `yillik`
- Tür: **Otomatik yenilenen**
- Faturalandırma dönemi: 1 ay / 3 ay / 1 yıl
- Ek süre (grace period): 7 gün (önerilen)
- Hesap askıya alma: varsayılan
- Abonelikte değişiklik: **Planlar arasında geçişe izin ver**
- **Fiyatlar → Fiyatları ayarla:** Türkiye için 99,99 / 229,99 / 499,99 TRY gir. Diğer ülkeler için Play'in önerdiği dönüştürmeyi kabul edebilirsin.
- Her planı kaydettikten sonra **Etkinleştir**'e bas.

## 3. (İsteğe bağlı) 7 gün ücretsiz deneme
`yillik` temel planı → **Teklif ekle**
- Teklif kimliği: `deneme`
- Uygunluk: **Yeni müşteri kazanımı** ("Bu aboneliği hiç almamış kullanıcılar")
- Aşama: **Ücretsiz deneme, 7 gün**
- Kaydet → Etkinleştir

Uygulama denemeyi kendisi algılar: ödeme ekranında yıllık planda "7 GÜN ÜCRETSİZ" etiketi ve "7 gün ücretsiz dene" düğmesi çıkar. Teklifi kaldırırsan bunlar kendiliğinden kaybolur.

## 4. Test et (ücret alınmadan)
1. Play Console → **Ayarlar → Lisans testi** → kendi Gmail'ini ve test kullanıcılarının adreslerini ekle → Lisans yanıtı: `RESPOND_NORMALLY`.
2. Uygulamayı kapalı test bağlantısından indir (APK'yı elle kurarsan satın alma çalışmaz; Play'den gelmeli).
3. Ayarlar → **Hafif Plus'a geç** → plan seç. Lisans test hesaplarında ödeme sayfasında "Test kartı, ücret alınmaz" yazar. Test aboneliklerinde 1 ay yaklaşık 5 dakikadır; yenilenmeyi de görebilirsin.
4. Satın aldıktan sonra kilitler açılmalı. Ayarlar'da "Hafif Plus aktif" kartı görünür.
5. "Satın alımları geri yükle" ve "Aboneliği yönet" düğmelerini dene.

## 5. Veri güvenliği formu
Satın alma işlemi Google Play üzerinden yapılır ve Hafif hiçbir satın alma verisini kendi sunucusuna göndermez. Bu yüzden veri güvenliği formundaki "Veri toplanmıyor" cevabı değişmez. Gizlilik politikasına "Hafif Plus aboneliği" bölümü eklendi.

## Notlar
- Google'ın komisyonu abonelikte **%15**.
- Abonelik iptal edilirse kullanıcının verileri silinmez; yalnızca Plus alanları yeniden kilitlenir.
- Claude'daki sürümde (artifact) Plus her zaman açık. Ayarlar → Hafif Plus → "Ücretsiz sürümü göster" ile kilitli görünümü önizleyebilirsin.
