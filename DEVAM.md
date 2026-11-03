# Yeni oturum için devir notu (31 Ekim 2026)

Bu dosya, Hafif üzerinde çalışan yeni bir Claude oturumunun kaldığı yerden devam etmesi içindir. Ayrıntılı geçmiş ve bütün kararlar `YOL-HARITASI.md` dosyasındadır.

## Proje
- **Hafif**: Türkçe kilo ve haftalık iğne (GLP-1) takip uygulaması. Android, Capacitor 8, paket `com.ugurbektas.hafif`.
- Kullanıcıyla **Türkçe** konuşulur.
- Repo: `Ubektas/Hafif`. Çalışma dalı: **`surum-2.0`** (henüz `main`'e birleşmedi; 2.0 Play'de yayına çıkınca birleştirilecek).
- Gizlilik sayfası ayrı repo: `Ubektas/hafif-gizlilik` (main yayında, 2.0 metni dahil).

## Kaynak dosya (önemli)
- Uygulamanın asıl kaynağı tek bir HTML dosyası: Claude artifact'i **https://claude.ai/artifact/HLc1A77LCcKJpmgXxitBdw** (sürüm 116 en güncel hâl).
- Bu dosya kişisel test verileri (Tracky, Zepp, takviye listesi) içerir; **repoya konmaz**. Yeni oturumda Artifact aracıyla `action: "read"` ile indirilir, örneğin `/home/user/hafif-kaynak/artifact.html` olarak kaydedilir.
- Android'e giden sürüm bundan üretilir; araç kişisel verileri ayıklar:
  `python3 araclar/android-uyarla.py <artifact.html> www/index.html`
- Her değişiklikten sonra: `node -e` ile sözdizimi kontrolü, `www/index.html` yeniden üretimi, commit, push ve artifact'in aynı URL'ye yeniden yayımlanması.

## Derleme ve test (GitHub Actions, yalnızca REST; GraphQL kullanma)
- Emülatör testi: `gh api -X POST repos/Ubektas/Hafif/actions/workflows/android-test.yml/dispatches -f ref=surum-2.0`
  Sonuç `test-sonuclari` dalında: `rapor.json`, ekran görüntüleri, `widget-*.png`. Son durum 47/47.
  Emülatör ara sıra kendi "yanıt vermiyor" penceresiyle takılır; tekrar çalıştırmak yeter.
- Yayın: `gh api -X POST repos/Ubektas/Hafif/actions/workflows/yayin.yml/dispatches -f ref=surum-2.0 -f 'inputs[surum]=2.0.0'`
  GitHub Release `v2.0.0` silinip yeniden oluşturulur; sürüm kodu = çalışma numarası (son: 18).
  Dosya indirme: `gh api -H "Accept: application/octet-stream" repos/Ubektas/Hafif/releases/assets/<id>`
- Koç simülatörü (yerel): `node tests/koc-simulator.js /opt/node-tools/node_modules/playwright 300`
- Yayın derlemesinde R8 küçültme açık; emülatör testi de küçültülmüş kodla çalışır.

## Kalıcı kurallar
- Kişisel veri Android derlemesine girmez.
- İletişim e-postası: apphafif@gmail.com. Keystore şifresi yalnızca GitHub secrets'ta.
- Mağaza metinlerinde ve görsellerinde **ilaç marka adı yok**, önce/sonra vücut görseli yok, "kilo verdirir / garanti / doktor onaylı" yok.
- Uygulama içi gezinme ikonları çizgi; içerik katmanında emoji (toplantı 2 kararı).
- Her ekranda tek ana düğme; büyük harf her kartta en fazla bir kez.
- İş akışı: kullanıcıya önce görselle anlat → karar → uygula → önce/sonra göster → `YOL-HARITASI.md`'ye işle. Kullanım sınırı nedeniyle küçük işlerde görseli toplu göstermek tercih edilir.

## Son durum
- **2.0.0 hazır** (kod 18): G1–G8, Ne yesem? (Türk mutfağı önerileri), yorum isteme anları, yeni widget'lar (A · krem kart, koyu temada koyu) ve 11. widget "Ne yesem?". Kullanıcı Play kapalı test kanalına yükleyecek.
- Mağaza: 8 görsel `magaza/tanitim-2/`, öne çıkan görsel `magaza/tanitim-2/one-cikan-1024x500.png`, video `magaza/video/hafif-tanitim-2-1920x1080.mp4`, metinler `magaza/aciklama.md` (3949 karakter), sürüm notu `magaza/surum-notlari.md`.
- Ekip toplantısı 2 raporu: `magaza/taslak/toplanti-2/index.html` (artifact: https://claude.ai/artifact/6rTSGcM2pwaeVJ87PjYXVz).

- **31 Ekim · telefonun adım sayacı (2.0.1 adayı, `surum-2.0`'da, test 48/48):** Yeni Samsung telefonda Samsung Health Health Connect'e hiç yazmadı (izinler açık olduğu hâlde), Hafif 0 adım gösterdi. Çözüm: Health Connect'te adım yoksa adım ekranında "Health Connect'e adım gelmiyor" kartı → "Telefonun sayacıyla say" (ACTIVITY_RECOGNITION izni). Yerel eklenti `android/.../adim/` (HafifAdim): donanım sayacı TYPE_STEP_COUNTER, AlarmManager ile 15 dk'da bir okuma, açılışta yeniden kurulum (BOOT_COMPLETED), günlük ve saatlik adımlar SharedPreferences'ta. Health Connect'te o gün adım varsa her zaman Health Connect kullanılır. Ayarlar'da "Telefonun adım sayacı · Aç/kapat". WorkManager denendi, ListenableFuture derleme hatası verdiği için bırakıldı. Kullanıcıya üçüncü taraf uygulama önerilmez (kullanıcı kararı).
  Açık: gizlilik metnine telefon sayacı cümlesi, veri güvenliği formu kontrolü, gerçek telefonda deneme (emülatörde sensör yok).

- **31 Ekim · 2.0.0 Play'de (kod 19, kapalı test Alpha).** Sağlık beyanı formunda yalnızca Aktivite ve fitness + Beslenme ve kilo yönetimi; ACTIVITY_RECOGNITION için açıklama metni girildi. Mağaza metni `magaza/aciklama.md` (3970 karakter, 11 widget, telefon sayacı). Video açılışı yenilendi (logo yerine başlık + emojiler, `magaza/kaynak/video/sahne-2.html`). YouTube logosu 800×800 (`assets/icon-only.png`'den).
- **31 Ekim · 2.0.1 gezinme (`surum-2.0`'da, test 48/48, henüz derlenmedi):** Alt çubuk `Özet · Günlük · + · Kilo · İğneler`. Protein & Su ile Takviye "Günlük" sekmesinde birleşti (iç ad hâlâ `besin`): üstte protein/su/takviye kutuları (`data-gjump`, dokununca bölüme kayar), her zaman görünen Ne yesem? kartı (hedefe <10 g kalınca da), protein+su kartı (`#todayCard`, su `#secSu`), takviyeler (`#secSupp`, `suppBody()`). `tab="takviye"` ve `"besin:su"` gibi adresler render() başında Günlük'ün ilgili bölümüne çevrilir (bildirim, widget, Özet halkaları). Yüzen + kalktı, ortada `#navPlus`. Gezinme ikonları Noto Emoji (tek renk, 400/600 ağırlık SVG yolu olarak gömülü); Kilo için aynı tarzda tartı çizildi. Kullanıcı kararı: ad "Günlük", ikon Yön 3. Maket: https://claude.ai/artifact/VaQL7TNobbqwu7VwwR5Nc1

- **31 Ekim · 2.0.1 devam:** + menüsü 3×3, Noto Emoji (tek renk) ikonları gömülü SVG (`NQ`), 9. kutu Takviye. Widget'larda küçültülünce üst üste binme düzeltildi (`WidgetRenderer.low()` = H<120 için `compact()` düzeni; geniş alçakta sığmayan parçalar gizlenir). Emülatör widget önizlemeleri artık 170x96, 170x74, 360x110 boylarını da üretir. Test 48/48. Açık soru: widget emojileri hâlâ telefonun renkli emojisi; tek renkli çizime geçirilsin mi (kullanıcıya soruldu).

- **1 Kasım · 2.0.1'e ayrıca girenler:** Ayarlar'daki Plus kartı ücretsiz dönemde abonelik ekranını açıyor (openPaywall artık yalnızca gerçek abonede kapalı); "Hatırlatıcıları aç" izin sorma ile ekran çizimi ayrıldı, izin hatası nedeniyle gösteriliyor (kullanıcının 2.0.0'da "Bildirim izni alınamadı" görmesi; bildirimler telefonda açıktı, kesin neden bilinmiyor).
- **1 Kasım · iOS (widget'sız ilk sürüm) başladı:** `ios/` (Capacitor, CocoaPods), Apple Sağlık yetkisi ve izin metinleri, yalnızca iPhone + dikey, `hafif://` URL şeması. Uygulama `IOS()` ile Health Connect yazılarını "Apple Sağlık" yapıyor; App Store aboneliği her süre ayrı ürün: `hafif_plus_aylik`, `hafif_plus_uc_aylik`, `hafif_plus_yillik` (abonelik grubu "Hafif Plus"); ödeme ekranında Kullanım koşulları bağlantısı. GitHub Actions `ios-test.yml` (macos-15, imzasız simülatör derlemesi; `surum-2.0`'a ios/www/tests/ios-demo.js push'unda çalışır, elle tetiklenemez çünkü main'de yok). Test verisi ve zamanlı ekran gezintisi `tests/ios-demo.js` (yalnızca test derlemesine eklenir). Sonuçlar `ios-sonuclari` dalında. Simülatörde tüm ana ekranlar doğru çiziliyor.
  Apple Developer: ödeme yapıldı, başvuru "pending"; Apple kimlik doğrulaması istedi (sürücü belgesinden ad "ugut" okunmuş). Kullanıcıya pasaport/kimlik kartıyla yeniden yükleme ve ad düzeltme e-postası önerildi. Onaydan sonra: Ücretli Uygulamalar Sözleşmesi + banka, App Store Connect'te uygulama kaydı (com.ugurbektas.hafif, HealthKit), API anahtarı (Issuer ID, Key ID, .p8 GitHub secret), abonelik grubu, TestFlight iş akışı. iOS sürüm numarası şu an 2.0.0 yazıyor; içerik 2.0.1, kullanıcıya 2.0.1 yapılsın mı diye soruldu.
  iOS'ta henüz yok: widget'lar (WidgetKit, sonraki sürüm), "Hafif ekibine gönder" yerli e-posta (genel paylaşım menüsüne düşüyor).

- **2 Kasım · Apple ödeme durumu:** Kullanıcı Apple Developer uygulamasından 649,99 ₺ ödedi; kimlik doğrulamasından sonra uygulama "bu hesap için kayıt yok" diyor, web sitesi Enrollment ID **QX7X2D3C5V** için 1.029 ₺ istiyor. Çift ödeme riski: önce Apple Developer Destek'e (Membership and Account → Program Enrollment) ilk ödemenin durumu sorulacak; 1.029 ₺ yanıttan sonra ödenecek. "Withdraw enrollment"a basılmayacak.
- **2 Kasım · Reklam kararı (öneri):** İlaç adı ve önce/sonra görseli reklamda yok. Firebase/Meta SDK **eklenmeyecek** ("veri toplama yok" vaadi, KVKK özel nitelikli sağlık verisi, Health Connect reklam yasağı, iOS takip izni). Ölçüm SDK'sız: Play Console edinme raporları + UTM'li bağlantılar, Google Ads–Play Console bağlantısı (abonelikleri sayıp saymadığı kurulumda doğrulanacak), iOS'ta Apple Search Ads. Sıra: üretime çıkış + `hafif_plus` → ücretsiz kanallar (GLP-1 toplulukları, Instagram, diyetisyenlere Plus kodu) → abone oranı belli olunca küçük reklam testi. Gelir hesabı (KDV %20, komisyon %15 sonrası): aylık ~71 ₺, 3 aylık ~163 ₺, yıllık ~354 ₺.
- **3 Kasım · + menüsü iğnesiz kullanıcıda 9 kutu (`surum-2.0`'da, henüz derlenmedi):** İğne kullanmayanda İğne ve Yan etki yerine **İştah** ve **Not** (kullanıcı kararı; önce denenen Ne yesem?/Adımlar geri alındı). Sıra: Kilo · Protein · Su / Takviye · Ölçü · Fotoğraf / Egzersiz · İştah · Not. İştah: `openAppSheet()`, Bugün/Dün/önceki gün, aynı `S.app` kaydı (Ne yesem? iştaha göre yumuşak öneri). Not: `openNoteSheet()`, yeni `S.notes[gün]` (en fazla 500 karakter, yedekte var), pencerede son 5 not, sil + Geri al. Notlar henüz Excel/PDF raporunda yok. İkonlar Noto Emoji 500: 😋 `NQ.ap`, 📝 `NQ.no`. İğne kullananın menüsü değişmedi.
- **3 Kasım · "Bildirim izni alınamadı" çözüldü (2.0.1 adayı):** Neden R8: Capacitor 8.5.3'ün kendi kurallarında eklenti açıklamalarını (annotation) koruyan satırlar yok; R8 tam modu yayın derlemesinde bunları siliyor, `LocalNotifications.checkPermissions` hata veriyor (bildirimler açıkken bile). Debug test derlemesinde R8 hafif çalıştığı için emülatörde görünmüyordu. `android/app/proguard-rules.pro`'ya Capacitor'ın güncel kuralları eklendi. Emülatör testine ikinci aşama: yayın derlemesi (HAFIF_TEST_RELEASE, hata ayıklama anahtarıyla imzalı, WebView hata ayıklaması yalnızca test için) kurulup `tests/android-izin.js` ile izin kontrolü/isteme, bekleyen bildirimler, dosya izni ve İndirilenler'e yazma denenir (`izin-yayin.json`). Test artık bildirim iznini gerçek izin penceresinden veriyor; yedek/Excel/PDF İndirilenler'de aranıyor; rapor her adımda yazılıyor ve takılırsa 15 dk'da kesiliyor. Son: 50/51 (PDF adımı yalnızca toast zamanlaması, dosya kaydedilmişti; test gevşetildi) + yayın derlemesi 6/6.
- **3 Kasım · 2.0.1 derlendi (kod 20, `a55ca8e`, Release v2.0.1: .aab 5,4 MB, APK 4,3 MB); 3 Kasım 12:24 Play kapalı teste (Alpha) gönderildi, Gönderim 7 · incelemede** (`surum-2.0`, sürüm notu `magaza/surum-notlari.md`, 377 karakter).
- **3 Kasım · paylaşım tek tartıyla:** "İlerlemeni paylaş" artık 1 tartıyla da çalışıyor: "Yolculuğum başladı · 1. gün" kartı (`tBaslangic`): bugünkü kilo, hedef ve kesikli iniş çizgisi, alışkanlık kutuları. Tek tartıda şablon seçimi ve yağ anahtarı gizli. Tartı yoksa kırık görsel yerine "Paylaşmak için önce bir tartı gir."
- **3 Kasım · PDF/Excel/yedek indirme (Android):** `nativeSave` dosyayı doğrudan `Download/` klasörüne yazar (Android 11+ izinsiz), bildirimde "Paylaş" seçeneği; olmazsa (Android 8–10) eskisi gibi paylaşım menüsü. iOS'ta paylaşım menüsü (Dosyalar'a Kaydet orada var).
- **3 Kasım · alt çubuk iğnesiz kullanımda (2.0.2 derlendi: kod 21, Release v2.0.2; 2.0.1 Play'de yayında):** İğneler gizlenince 4 öğe kalıyor ve + ortadan kayıyordu. Artık iğnesiz kullanımda İğneler yerine **Adımlar** sekmesi (`.tab[data-tab="adim"]`, Noto Emoji 👟 400/600): Özet · Günlük · + · Kilo · Adımlar; ızgara her zaman 5 sütun.
- **Kullanım sınırı:** Kullanıcı haftalık kullanımına dikkat ediyor; her büyük iş ayrı oturumda, görseller toplu ve az, küçük işlerde maket yok.

## Sıradaki işler (toplantı 2 kararları ve açık konular)
0. **Kapalı test sayacı:** 31 Ekim'de 12 testçi kayıtlı, 14 gün sayacı başladı (1. gün). Testçiler çıkmazsa ~14 Kasım'da "Üretime başvur" açılır. `hafif_plus` henüz kurulu değil: "Google Play ile para kazanın" sayfası "kurulumu kontrol panelinde tamamlayın" diyor; Kontrol paneli → Uygulamanızı ayarlayın görevleri ve ödeme profili kontrol edilecek, sonra abonelik `magaza/abonelik-rehberi.md`'ye göre kurulacak.
1. **Üretimden önce:** Play'de görünen ev adresi ve geliştirici adı ("Hafif" olmalı), veri güvenliği formu (kullanıcı yapar).
2. **2.0.1:** gezinme, widget seti, Pano ve e-posta düzeltmesi `surum-2.0`'da hazır (test 48/48); kullanıcı derlemeyi şimdilik istemedi. "2.0'da yeni" tanıtım sayfası iptal (kullanıcı kararı: uygulama henüz yayında değil, eski kullanıcı yok).
3. Yorum yanıt şablonları; mağaza görseli 6'daki Ne yesem? widget'ını akşam saatine göre yeniden çizdirmek (isteğe bağlı).
4. **2.1:** içerik katmanında emoji (+ paneli vb.), yazı boyutu ayarı (en fazla %115), rakamsız haftalık paylaşım kartı, bildirimleri koçun sesiyle yeniden yazmak.
5. **Şubat 2027'den önce:** Ramazan modu.
6. **Karar bekleyen:** maliyet takibi (tasarım `YOL-HARITASI.md`'de).
