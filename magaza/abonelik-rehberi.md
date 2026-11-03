# Hafif Plus – Play Console'da abonelik açma

Uygulamadaki kod hazır. Ürünü ve planları Play Console'da **tam olarak bu kimliklerle** açman gerekiyor; kimlikler sonradan değiştirilemez.

| Alan | Değer |
|---|---|
| Ürün kimliği (Product ID) | `hafif_plus` |
| Temel plan 1 | `aylik`: 1 ay, otomatik yenilenen, **99,99 ₺** |
| Temel plan 2 | `uc-aylik`: 3 ay, otomatik yenilenen, **229,99 ₺** |
| Temel plan 3 | `yillik`: 1 yıl, otomatik yenilenen, **499,99 ₺** |
| (İsteğe bağlı, şimdilik açma) Deneme teklifi | `yillik` planına teklif: `deneme`, 7 gün ücretsiz; uygulama zaten ilk 7 günü ücretsiz veriyor (bkz. 3. adım) |

## 0. Önce
1. **Ödeme profili:** Play Console → Ayarlar → Ödeme profili. Banka hesabı (IBAN) ve vergi bilgileri girilmeden ücretli ürün açılamaz.
2. Faturalandırma izni olan bir AAB'nin (1.5.0 ve sonrası) herhangi bir kanala, örneğin kapalı teste, yüklenmiş olması gerekir. Play, uygulama BILLING iznini içermeden abonelik sayfasını açmaz.

## 1. Aboneliği oluştur
Play Console → Hafif → **Google Play ile para kazanın → Ürünler → Abonelikler** → **Abonelik oluştur**
- Ürün kimliği: `hafif_plus`
- Ad: `Hafif Plus`
- Avantajlar (en fazla 4, mağazada abonelik sayfasında görünür):
  - Tahmini ilaç düzeyi ve evre önerileri
  - Tüm kilo grafikleri ve yan etki analizi
  - Doktor için PDF rapor
  - Ana ekran widget'ları

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
> **Şimdilik açma.** Uygulama zaten her yeni kullanıcıya ilk **7 gün** Plus'ı ödeme bilgisi istemeden açıyor. Play'deki deneme teklifi bunun üstüne ikinci bir ücretsiz hafta verir. İleride uygulama içi ücretsiz dönemi kaldırırsan bu teklifi kullanırsın.

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

## 6. Yurtdışı: ülkeler ve ülke başına fiyat
Uygulama Türkçe kalarak, Türkçe konuşan kullanıcıların çok olduğu ülkelerde de açılır. **Kod değişmez:** ödeme ekranı fiyatı, para birimini, "aylık karşılığı"nı ve "% tasarruf"u mağazadan alır. Sabit TL fiyatları (`PLANS`) yalnızca mağaza fiyat gönderemezse görünür (örneğin internet yoksa); o an satın alma da yapılamaz.

### Hangi ülkeler
| Öncelik | Ülkeler | Neden |
|---|---|---|
| 1 | Almanya, Hollanda, Avusturya, Belçika, Fransa | En büyük Türk nüfusu |
| 2 | İsviçre, Birleşik Krallık, Danimarka, İsveç | Orta büyüklükte Türk nüfusu, alım gücü yüksek |
| 3 | Kıbrıs, Azerbaycan | Türkçe anlaşılır. KKTC Play'de ayrı ülke değil; oradaki kullanıcılar çoğunlukla Türkiye hesabıyla gelir |
| İsteğe bağlı | ABD | GLP-1 pazarı büyük, Türkçe konuşan kitle küçük; açmanın zararı yok |

### Önerilen fiyatlar (KDV dahil, kullanıcının gördüğü)
TL fiyatını otomatik çevirmek Avrupa'da çok ucuz kalır (99,99 ₺ ≈ 2,5 €). Benzer uygulamalar Avrupa'da aylık 4–8 €, yıllık 30–50 € arasında. Önerilen fiyatlar aşağıda; bunlar **elle** girilir:

| Ülke | Aylık (`aylik`) | 3 aylık (`uc-aylik`) | Yıllık (`yillik`) |
|---|---|---|---|
| Türkiye (temel) | 99,99 ₺ | 229,99 ₺ | 499,99 ₺ |
| Euro bölgesi (DE, NL, AT, BE, FR) | 4,99 € | 11,99 € | 34,99 € |
| Kıbrıs | 2,99 € | 6,99 € | 19,99 € |
| İsviçre | 5,00 CHF | 12,00 CHF | 36,00 CHF |
| Birleşik Krallık | £3.99 | £9.99 | £29.99 |
| Danimarka | 35 kr | 89 kr | 249 kr |
| İsveç | 49 kr | 119 kr | 349 kr |
| Azerbaycan | Play'in önerisini kabul et | | |
| ABD | $4.99 | $11.99 | $34.99 |

Euro bölgesinde ödeme ekranında 3 aylık plan "%20 tasarruf", yıllık plan "%42 tasarruf" yazar (uygulama bunu kendisi hesaplar). Türkiye'deki oranlar %23 ve %58; yıllık planı daha cazip yapmak istersen yıllık fiyatı 29,99 €'ya indir (%50).

**Eline geçen (Almanya örneği, aylık 4,99 €):** %19 KDV düşülünce 4,19 €, %15 komisyon düşülünce yaklaşık **3,56 €**. AB'de KDV'yi Google ve Apple kendileri öder; senin ayrıca AB KDV kaydı yapman gerekmez.

### Google Play'de
1. **Fiyatlar:** Abonelikler → `hafif_plus` → her temel plan → **Fiyatları ayarla** → Türkiye fiyatını gir → listede ülkeyi bul → fiyatı yukarıdaki tabloya göre elle değiştir → Kaydet. Üç planın her biri için ayrı ayrı yapılır.
2. **Ülkeler:** Test ve sürüm → **Üretim → Ülkeler/bölgeler → Ülke/bölge ekle** → listedeki ülkeleri seç. Kapalı testte ülke seçimi ayrıdır; üretime çıkışta yeniden seçilir.
3. Mağaza sayfası yalnızca Türkçe olduğu için Almanca telefonlarda da Türkçe görünür; bu beklenen durumdur.

### App Store'da (iOS)
1. Uygulama → **Fiyatlandırma ve Kullanılabilirlik → Kullanılabilirlik:** ülkeleri seç.
2. Abonelikler → Hafif Plus grubu → her ürün (`hafif_plus_aylik`, `hafif_plus_uc_aylik`, `hafif_plus_yillik`) → **Abonelik Fiyatları** → temel ülke **Türkiye** → diğer ülkeler otomatik eşitlenir → **Fiyatları düzenle** ile yukarıdaki ülkeleri elle değiştir.

### Dikkat
- **Gizlilik metni Türkçe:** Türkçe kullanan kullanıcı için GDPR açısından yeterli. "Veri toplanmıyor" yanıtı değişmez.
- **Sonradan fiyat değişikliği:** Fiyat düşürülürse mevcut aboneler de düşük fiyattan yenilenir. Fiyat artırılırsa mevcut aboneler bildirim alır ve onay vermesi gerekebilir. Bu yüzden ilk fiyatı düşük değil, doğru koymak daha kolaydır.
- Ülke başına abone sayıları Play Console → Para kazanma → Abonelikler raporunda görülür; ilk aylardan sonra fiyatlar buna göre ayarlanır.

## Notlar
- Google'ın komisyonu abonelikte **%15**.
- Abonelik iptal edilirse kullanıcının verileri silinmez; yalnızca Plus alanları yeniden kilitlenir.
- Claude'daki sürümde (artifact) Plus her zaman açık. Ayarlar → Hafif Plus → "Ücretsiz sürümü göster" ile kilitli görünümü önizleyebilirsin.
