# Hafif – Play Console kapalı test rehberi

2023 sonrasında açılan kişisel geliştirici hesaplarında uygulama doğrudan yayına çıkamaz. Önce **en az 12 test kullanıcısı**, **14 gün boyunca kesintisiz** kapalı teste katılmış olmalı. Ardından "Üretime erişim" başvurusu yapılır.

Gereken dosyalar:
- AAB: GitHub → Releases → son sürüm → `hafif-x.y.z.aab`
- Mağaza metinleri: `magaza/aciklama.md`
- Görseller: `magaza/gorseller/ikon-512.png`, `magaza/gorseller/tanitim-1024x500.png`, `magaza/tanitim/*.png`
- Video: `magaza/video/hafif-tanitim-1920x1080.mp4`. Play yalnızca YouTube bağlantısı kabul eder; videoyu YouTube'a "Liste dışı" ya da "Herkese açık" olarak yükle.
- Gizlilik politikası: https://ubektas.github.io/hafif-gizlilik/

---

## 1. Uygulamayı oluştur
Play Console → **Uygulama oluştur**
- Uygulama adı: `Hafif: Kilo ve İğne Takibi`
- Varsayılan dil: Türkçe – tr-TR
- Uygulama / oyun: **Uygulama**
- Ücretsiz / ücretli: **Ücretsiz**. Abonelik sonradan eklenebilir; ücretsiz uygulama içinde abonelik satılabilir.
- Beyanları işaretle → Oluştur

## 2. "Uygulamanızı ayarlayın" görevleri (Kontrol paneli)
**Uygulama içeriği** bölümündeki her maddeyi doldur:

| Madde | Cevap |
|---|---|
| Gizlilik politikası | `https://ubektas.github.io/hafif-gizlilik/` |
| Uygulama erişimi | Tüm işlevler özel erişim gerektirmeden kullanılabilir |
| Reklamlar | Hayır, uygulama reklam içermiyor |
| İçerik derecelendirmesi | Kategori: "Diğer / Tüm diğer uygulama türleri"; şiddet, cinsellik, kumar vb. tüm sorulara **Hayır**. Kullanıcılar etkileşimde bulunabilir mi: **Hayır**. Konum paylaşımı: **Hayır** |
| Hedef kitle | Yalnızca **18 ve üzeri**. Çocuklara hitap etmiyor |
| Haber uygulaması | Hayır |
| Devlet uygulaması | Hayır |
| Finansal özellikler | Hiçbiri |
| Sağlık uygulamaları | Kategoriler: **Fitness ve sağlıklı yaşam** (kilo, adım, beslenme), **İlaç ve tedavi yönetimi** (iğne/doz hatırlatma ve kayıt). "Tıbbi cihaz" ya da "teşhis/tedavi" seçme |
| Health Connect izinleri | Aşağıdaki 2a bölümüne bak |
| Veri güvenliği | Aşağıdaki 2b bölümüne bak |

### 2a. Health Connect izin beyanı
İstenen izinler yalnızca **okuma**: Adımlar, Kilo, Vücut yağ oranı.
- Kullanım amacı: "Kullanıcının günlük adımlarını ve akıllı tartı ölçümlerini (kilo, vücut yağ oranı) uygulama içinde göstermek ve kilo geçmişine eklemek."
- Veriler cihazdan çıkıyor mu: **Hayır**; yalnızca telefondaki uygulama depolamasında tutulur.
- Gerekirse kısa bir ekran videosu istenir: Özet → "Adımlarını ve tartını bağla" → Health Connect izin ekranı → adım kartı. Telefonda ekran kaydıyla 30 saniyelik bir video yeterli.

### 2b. Veri güvenliği formu
Hafif hiçbir veriyi cihazdan dışarı göndermediği için Google'ın tanımına göre veri **toplamaz** ve **paylaşmaz**.
- Uygulamanız gerekli kullanıcı veri türlerini topluyor veya paylaşıyor mu? → **Hayır**
- (Form "hayır" deyince kısalır.) Özet ekranında "Veri toplanmıyor · Veri paylaşılmıyor" görünür.
- Not: Android'in kendi otomatik yedeklemesi ve kullanıcının kendi başlattığı paylaşım/dışa aktarma Google'ın tanımında "toplama" sayılmaz.

## 3. Mağaza girişi (Büyüme → Mağaza varlığı → Ana mağaza girişi)
- Uygulama adı, kısa açıklama, tam açıklama: `magaza/aciklama.md`
- Uygulama simgesi: `magaza/gorseller/ikon-512.png`
- Öne çıkan grafik: `magaza/gorseller/tanitim-1024x500.png`
- Telefon ekran görüntüleri (en fazla 8): `magaza/tanitim/` klasöründeki 8 görseli dosya adı sırasıyla yükle:
  01-kilo, 02-koc, 03-igne, 04-yan-etki, 05-rapor, 06-protein-su, 07-hatirlatici, 08-gizlilik
- Video: YouTube bağlantısı
- Kategori: **Sağlık ve Fitness**; iletişim e-postası: apphafif@gmail.com

## 4. Kapalı test kanalı
Test ve yayınla → Test → **Kapalı test** → "Kanal oluştur" (ya da hazır gelen "Alfa"yı kullan)
1. **Test kullanıcıları** sekmesi → "E-posta listesi oluştur" → en az **12–15** Gmail adresi ekle (fazlası iyi; biri çıkarsa 12'nin altına düşmezsin). Geri bildirim URL'si/e-postası: apphafif@gmail.com
2. **Ülkeler**: Türkiye (istersen tüm ülkeler)
3. **Sürüm oluştur** → Play Uygulama İmzalama'yı kabul et → AAB'yi yükle → sürüm adı otomatik gelir → sürüm notu:
   `İlk test sürümü: kilo, iğne, yan etki, protein, su, takviye ve adım takibi; kişisel koç, hatırlatıcılar, widget'lar ve PDF rapor.`
4. **İncelemeye gönder.** İlk inceleme birkaç saatten birkaç güne kadar sürebilir.
5. Onaylanınca **Test kullanıcıları** sekmesindeki "Katılım bağlantısı"nı testçilere gönder. Her biri:
   - bağlantıyı **Play'e giriş yaptığı Gmail ile** açar → "Test kullanıcısı ol"a basar
   - ardından Play Store'dan Hafif'i indirir
   - **14 gün boyunca testten çıkmaz**; birkaç kez açıp kullanırsa başvuruda işine yarar

> 14 günlük sayaç, 12. kişi katıldığı gün başlar. Kontrol panelindeki "Üretim erişimi" kartında kaç kişinin katıldığını ve kaç gün kaldığını görürsün.

**Testçi bulmak için:** aile ve arkadaşlar (her biri ayrı Gmail ve Android telefon gerekir); Reddit'te r/AndroidClosedTesting ve r/TestersCommunity; "12 testers" gibi karşılıklı test toplulukları.

## 5. Test sırasında yeni sürüm
Yeni sürüm çıkarmak 14 günlük sayacı **sıfırlamaz**. GitHub → Actions → "Play Store sürümü" → sürüm numarasını yaz → oluşan AAB'yi aynı kapalı test kanalına yeni sürüm olarak yükle.

## 6. Üretime erişim başvurusu (14 gün dolunca)
Kontrol paneli → **Üretime erişim için başvur**. Sorulara örnek cevaplar:
- *Testçileri nasıl buldunuz?* "Arkadaş ve aile çevremden, ayrıca Android test topluluklarından."
- *Testçiler uygulamayı nasıl kullandı?* "Tartı, adım, iğne ve protein/su kayıtlarını günlük girdiler; hatırlatıcıları ve PDF raporu denediler."
- *Hangi geri bildirimleri aldınız, ne değiştirdiniz?* Test sırasında gelen geri bildirimleri ve yaptığın düzeltmeleri yaz. Örnek: "Kayıt düzenleme, koyu tema ve yan etki günlüğü eklendi; protein ekranı sadeleştirildi."
- *Uygulama üretime hazır mı?* Evet; hedef kitle 18+, sağlık verileri cihazda kalıyor.

Onaylandıktan sonra **Üretim** kanalında "Sürüm oluştur" → kapalı testteki sürümü "Kitaplıktan ekle" ile seç → incelemeye gönder.
