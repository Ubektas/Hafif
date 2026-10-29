# Hafif yol haritası

## 1.9.0 (29 Ekim'de hazırlandı)
Aşağıdakilerin hepsi koda girdi. Ek olarak: kas kütlesi alanı ve kartı; takviye için 30/60/120 dk sonra, iğne için 3 saat sonra ikinci hatırlatma (gece gönderilmez, kayıt yapılınca düşer); Android'de "Hafif ekibine gönder" e-postayı alıcı, konu, metin ve hikâye görseliyle doğrudan açar; gizlilik politikası güncellendi (hafif-gizlilik deposunda surum-1.9.0 dalı, yayınla birlikte main'e alınacak); emülatör testine 1.9.0 adımları eklendi; sürüm notları magaza/surum-notlari.md.
- **Enjeksiyon bölgeleri**
  - Daha net adlar: "Üst kol (sol)", "Uyluk ön (sol)", "Karın (sol)"…
  - Ayarlarda "Hangi bölgeleri kullanıyorsun?" seçimi. Varsayılan: karın ve uyluk; kol isteğe bağlı. Bölge önerisi, koç kartları ve hatırlatıcılar yalnızca seçili bölgeler arasında döner.
  - İğne ekleme ekranında not: "Aynı bölgeye vuracaksan bir öncekinden birkaç santim uzağa."
  - Not: Semaglutid (Ozempic/Wegovy), tirzepatid (Mounjaro) ve liraglutid (Saxenda) prospektüslerinde onaylı bölgeler karın (göbeğin ~5 cm çevresi hariç), uyluk ön yüzü ve üst kolun arka-dış yüzü.
- **Vücut kompozisyonu: "yağsız" yerine "kas"**
  - Şu an Özet ve Kilo'daki vücut kompozisyonu kartı, "Yağsız kg" istatistiği, grafik etiketleri ve PDF rapor "yağsız kütle (su, kas, kemik)" gösteriyor; kullanıcı "kas" görmek istiyor.
  - Dikkat: Yağsız kütle kasla aynı şey değil (su, kemik ve organlar da içinde). Yalnızca yağ oranı girilmişse kas hesaplanamaz.
  - Plan: tartı girişine isteğe bağlı "Kas kütlesi (kg)" alanı (akıllı tartıların çoğu bunu gösterir). Kas girilmişse kartlar "Kas" gösterir; girilmemişse "Yağsız (kas, su, kemik)" adıyla devam eder ve uydurma bir kas sayısı göstermez.
  - Health Connect'te kas kütlesi türü yok (yağ, yağsız kütle, kemik, vücut suyu var); kas elle girilecek.
- **Hata: "Programı düzenle" ekranında saat kutuları sağdan taşıyor** (iPhone'da görüldü: Öğle ve Gece kutuları ekran dışına kayıyor). Saat alanlarına `min-width:0; width:100%` verilecek, Android'de de kontrol edilecek.
- **Hata: Haftalık program tablosunda gün başlıkları birbirine giriyor** (Android'de görüldü: "PZT SAL ÇARPER CUMCMTPAZ"). İlaç adı sütunu geniş kalınca 7 gün sütunu daralıyor. Çözüm: tabloyu sabit düzenle kur, ad sütununa üst sınır verip uzun adları "…" ile kısalt, gün başlıklarını küçük ve harf aralıksız yaz (dar ekranda tek harf: P S Ç P C C P).
- **Takviye vakti düğmesi: "Hepsini al" → "Hepsini aldım"** (dört vakitte de aynı). "Hepsini al" belirsiz okunuyor ve bildirimdeki "Hepsini aldım" ile tutarsız. Uzun metinle dar ekranda taşmaması kontrol edilecek (düğme kartın sağ kenarına dayanıyor); takviye ekranı 320–360 px genişlikte baştan sona denenecek.
- **Alınmayan takviye / yapılmayan iğne için otomatik ikinci hatırlatma (onaylandı)**
  - Şu an: her vakit için o saatte tek bildirim; alındıysa hiç gelmiyor; "Ertele" elle 1 saat sonraya kuruyor. Kendiliğinden ikinci hatırlatma yok.
  - Plan: vaktin saatinden X dakika sonra (varsayılan 60, ayarlardan 30/60/120 ya da kapalı) "Sabah takviyelerini aldın mı?" bildirimi. Önceden kurulur; "Hepsini aldım" işaretlenince kendiliğinden iptal edilir (uygulama açık olmasa da çalışır). Günde en fazla 1 ek hatırlatma, gece saatlerinde gönderilmez.
  - Aynı mantık iğne günü için: iğne saatinden 3 saat sonra kaydedilmemişse "İğneni yaptın mı?".
- **Adım paylaşımı (Claude sürümünde yapıldı, 1.9.0 ile Android'e gelecek)**
  - Adım ekranında "Adımlarını paylaş" kartı → 5 kart: Fotoğraf (kullanıcının kendi fotoğrafı üzerine adım bilgileri; fotoğraf kaydedilmez), Pist (lacivert/neon yeşil), Rota (harita/mavi), Halka (siyah/turkuaz), Hafta (zümrüt). Seçenekler: Hedef, Mesafe ve kalori.
  - Android: fotoğraf seçici (input type=file) Capacitor WebView'da emülatörde ve gerçek telefonda denenecek.
  - "Görseli kaydet / paylaş" ve "Hafif ekibine gönder" düğmeleri.
- **"Hafif ekibine gönder" (Claude sürümünde yapıldı; Android için tamamlanacak)**
  - Hem ilerleme hem adım paylaşımında. İzin kutusu (işaretlenmeden düğme açılmaz), görünüm (Adımla / Baş harflerle / Anonim), görünecek ad, isteğe bağlı not.
  - Ekibe giden görsel **hikâye boyutunda (1080×1920)**: kartın bulanık hâli zemin, kart ortada, altta "Google Play'de · Hafif". Instagram hikâyesine doğrudan konabilir.
  - Claude/web: Claude önizlemesi e-posta bağlantılarını açmıyor (korumalı çerçeve). Bu yüzden: 1) hikâye görselini kaydet, 2) adres ve metni kopyala; tarayıcı destekliyorsa "Paylaş…" ile e-posta uygulaması seçilir.
  - Android (şu an geçici): paylaşım menüsünden e-posta uygulaması seçilir, alıcı metinde yazar. **1.9.0'da:** HafifWidget eklentisine EXTRA_EMAIL + ekli görsel ile doğrudan e-posta açan fonksiyon; alıcı, konu, metin ve görsel hazır gelsin.
  - Gizlilik politikasına bir cümle: kullanıcının kendi başlattığı e-posta gönderimi.
  - Emülatör testine adım paylaşımı ve ekip gönderimi adımları eklenecek.
- **Adım kartı yeni tasarım "Okyanus" (Claude sürümünde yapıldı, 1.9.0 ile Android'e gelecek)**
  - Özet'teki "Bugün hareket" kartı: petrol mavisi zemin, turkuaz vurgu; büyük adım sayısı + "kaldı", hedef bayrağına yürüyen işaretli ilerleme çizgisi, mesafe/kcal/süre, son 7 gün yuvarlakları (hedef tutan gün ✓, tutmayan gün yüzde ve dolu halka), "🔥 N gün seri".
  - Adım sayfası: pembe yerine turkuaz/petrol (halka, saatlik grafik); "Son 7 gün" de yuvarlaklarla. Eski haftalık sütunların hep aynı boyda görünme hatası böylece kalkıyor.
  - Android'de açık/koyu temada ve 320 px dar ekranda kontrol edilecek.
- **Paylaşım ekranı metni (yapıldı, 1.9.0 ile Android'e gelecek):** "iPhone'da paylaşım menüsü açılır…" yerine "Telefonunun paylaşım menüsü açılır; WhatsApp'ı, Instagram'ı ya da galeriye kaydetmeyi seçebilirsin."

- **Yeni tasarım (Claude sürümünde yapıldı, 1.9.0 ile Android'e gelecek; ayrıntı: magaza/taslak/hafif-tasarim-incelemesi.html)**
  - Renk sistemi: iğne gece mavisi (#27407A), protein kehribar, su gök mavisi, yağ lavanta; koyu temada iğne düğmesi koyu zemin + beyaz yazı.
  - Özet tek ekran: kilo kartı, "Bugün" halkaları (protein, su, takviye), sıradaki iğne satırı (evre + önerilen bölge), adım kartı, rozet şeridi. Kilo grafiği ve vücut kompozisyonu Kilo sekmesine; döngü ve iğne geçmişi İğneler'e taşındı.
  - Sağ altta + düğmesi: Kilo, İğne, Protein, Su, Ölçü, Yan etki. Su kendi penceresini açar: hazır miktarlar (200–750) ya da −/+ ile 50 ml adım, elle yazılabilir; ekledikten sonra "Geri al". Düğme, ilk kurulum işareti olmayan eski kullanıcılarda da görünür (gizli kalma hatası düzeltildi).
  - Kilo gir: −/+ ile 0,1 kg (basılı tutunca hızlanır), Bugün/Dün/Tarih seç, yağ oranı ve not isteğe bağlı açılır.
  - İğne ekle: doz çipleri, Şimdi/Dün/Başka zaman, vücut çizimi üzerinde bölge ve her bölgenin son kullanımı. Bölge adları "Karın (sol)", "Uyluk ön (sol)", "Üst kol (sol)"; ayarlardan "Kullandığım bölgeler" (varsayılan karın + uyluk). Öneri: seçili bölgeler arasında en uzun süredir kullanılmayan. (Enjeksiyon bölgeleri maddesini karşılar.)
  - Kilo listesi: çöp kutusu yok (silme düzenleme penceresinde), yağ oranı düz yazı, geçmiş aylar kapalı.
  - İğneler: en üstte iğne kadranı (Özet'ten buraya taşındı; evre, kadranın etrafındaki yaylara dokunarak seçilir), düğmeye benzeyen evre kutuları yok, evre metni "Devamı" ile, "Vücuttaki ilaç" açılır bölümü; geçmişte çöp kutusu ve "bu aralıkta" yok.
  - Protein & Su: hızlı yiyecek satırında solma, haftalık grafikte açıklama. Takviyeler: "Hepsini aldım", dar ekranda tek harfli gün başlıkları, saat kutuları taşmıyor. (Bu üç hata maddesini karşılar.)
  - Ayarlar satır satır gruplar; kilolar virgülle. Hata düzeltmesi: ayarları kaydetmek tema seçimini ve kalem stoğunu sıfırlıyordu, artık korunuyor.
  - "Bu cihazda kayıtlı" yazısı yalnızca Ayarlar'da.
  - Emülatör testi + düğmesine göre güncellendi; koç simülatörü yeni bölge kuralıyla 0 hata.

## 1.9.0 · ekip toplantısı adımları (magaza/taslak/hafif-ekip-toplantisi.html)
Her adım tek tek konuşulup karar veriliyor; onaylananlar Claude sürümüne işlenip buraya ekleniyor.
- **Adım 1 · Ayarlar kendiliğinden kaydediyor (yapıldı):** "Kaydet" düğmesi kalktı; her değer kutudan çıkınca kaydediliyor, altta "Hedef kilo kaydedildi ✓". Hatalı değer (ör. hedef 5 kg) kaydedilmiyor, uyarı çıkıp eski değere dönüyor. Ayarlar'da dişli yok, "‹ Geri" önceki sekmeye döndürüyor; başlık altında "Değişiklikler kendiliğinden kaydedilir". "Bu cihazda kayıtlı" yazısı başlıktan tamamen kalktı (Verilerim kartında zaten yazıyor).
- **Adım 2 · Özet halkalarında kısaltma yok (yapıldı):** halkanın içinde üstte değer, altta hedef/birim: "74 · /110 g", "1,75 · /2,5 L", "6.240 · adım", "2/4 · alındı". Halkaların gri kutucukları kaldırıldı (kare içinde kare görünümü), dokununca hafif vurgu. Adım halkasının rengi diğerleriyle aynı tona çekildi (açık #1C8EA6, koyu #3DB5C4). 320, 360 ve 390 piksel genişlikte taşma yok.
- **Kahraman kart eski büyük hâline döndü (karar):** sade kart küçük kalıyordu; eğrili, "Hedefin %39'u" dikey göstergeli, çipli büyük kart geri geldi.
- **İlk ekran:** kilo kartı ve "Bugün" halkaları tek ekrana sığıyor (360×640 dahil): kart biraz sıkılaştı, eğri 60 px, çipler tek satır (dar ekranda "9 iğne" çipi gizli), halkalardaki "Ayrıntı için halkaya dokun" satırı kalktı (oklar yeterli). Koç kartı kilo kartının üstünden halkaların altına taşındı.
- **Özet rozet şeridi:** son kazanılan rozet ve sıradakine ilerleme gösteriliyor.
- **Adım 3 · Adım geçmişi (yapıldı):** Adımlar sayfasının altındaki ikinci "Son 7 gün" kartı (üstteki ile aynıydı) kalktı; yerine "Adım geçmişi" geldi: 7 gün / 30 gün / 3 ay seçimi (son seçim hatırlanır), toplam adım, günlük ortalama, hedefi tutan gün sayısı (19 / 30), en iyi gün ve tarihi; kesikli hedef çizgili çubuk grafik, çubuğa dokununca ya da parmağı grafik üzerinde gezdirince (bilgisayarda fareyle üzerine gelince) "25 Eki · 5.310 adım"; son 7 günün listesi, her gün hedefe göre fark (✓ +130 / −1.660). Üstteki 7 gün halkalarına sayı eklenmedi (karar). Health Connect ilk eşitlemede 90 gün istiyor; telefon izin vermezse geçmiş kullandıkça dolar.
- **Adım 4 · Takviyede alınanlar sakin görünüyor (yapıldı):** alınan satır artık pembe zemine dönmüyor; satırlar ayrı kutucuk değil, vakit kartının içinde ince çizgiyle ayrılmış liste. Alınınca sağdaki halka pembe ✓ ile doluyor, ad ve hap simgesi soluklaşıyor; dikkat alınmamış olana gidiyor. "Programı düzenle" sayfa altındaki büyük düğme yerine üst kartta tarihin yanında küçük bağlantı. "4 ilaç" yerine "4 takviye".
- **Adım 5 · Tek ana düğme kuralı (yapıldı):** bütün ekranlar ve paneller tarandı; çoğu zaten tek ana düğmeli. Kuralın dışında kalan 3 yer düzeltildi: (1) Ayarlar › Verilerim: tek ana düğme "Doktor için rapor (PDF)", altında simgeli satırlar (Yedek dosyası indir, Yedekten geri yükle, Excel olarak indir); turuncu uyarı kutusu kalktı, yedek durumu başlık satırında ("son yedek 3 gün önce" ya da turuncu "henüz yedek almadın"); açıklama tek cümle. (2) Protein & Su: "Protein ekle" ve "250 ml su ekle" açık zeminli renkli yazılı düğme oldu; ekranın tek dolu düğmesi yeşil +. (3) Kilo › Vücut ölçüleri: büyük gri "Ölçü ekle" yerine çerçeveli bağlantı satırı. Paylaş panellerindeki ikincil "Hafif ekibine gönder" olduğu gibi kaldı.
- **Adım 6 · + düğmesi içeriği örtmüyor (yapıldı):** her sayfanın sonuna düğme kadar boşluk eklendi (en alttaki satır her zaman düğmenin üstüne kaydırılabiliyor). Aşağı kaydırırken + küçülüp kayboluyor; yukarı kaydırınca ya da kaydırma durunca (0,7 sn) geri geliyor. Hareket azaltma açıksa yalnızca soluyor. Emülatör testinde + dokunuşundan önce kısa bekleme.
- **Adım 7 · Kullanım açıklamaları tek seferlik ipucu (yapıldı):** (1) Kilo: ay başlıklarındaki "düzenlemek için dokun, silmek için sola kaydır" kalktı, yerine listenin üstünde bir kez "İpucu" kartı; ✕ ile ya da ilk kaydırıp silmede kalıcı kapanıyor. (2) Yan etkiler: "dokundukça artar" ipucu kartı oldu, ilk dokunuşta kapanıyor; tıbbi uyarı kalıcı ve tek satır ("Şiddetli ya da geçmeyen yan etkide doktoruna danış."). (3) Kilo gir: "rakama dokun" açıklaması ilk 3 açılışta görünüyor; "Son tartı 87,9 kg" bilgisi kalıyor. Kapatılan ipuçları S.profile.tips içinde, yedekle birlikte taşınıyor.
- **Adım 8 · İlk kurulum: doğru metin ve yol haritası (yapıldı):** "Yaş ve cinsiyet, günlük kalori ve protein önerisi için" yanlışı kalktı (uygulamada kalori yok); yerine "Yaş ve cinsiyet doktor raporunda görünür; istersen boş bırakabilirsin." Ölçü adımındaki "3–6 ay" kutusu kalktı. Son adım "Yol haritan hazır.": Bugün → Hedef, kesikli iniş çizgisi, haftada 0,5–1 kg ile tarih aralığı ("Şubat–Mayıs 2027"), "İlk haftan için" üç madde (aynı saatte tartıl · günlük protein ve su · iğne günü). Hedef girilmemişse ya da hedef şu anki kilodan büyükse eski "Her şey hazır" özeti.
- **Adım 9 · Sıradaki iğne satırı kısaldı (yapıldı, kullanıcı değişikliğiyle):** başlık "ne zaman · doz" ("Pazar 09:00 · 5 mg", "Bugün · 5 mg", "2 gün gecikti · 5 mg"; doz son iğneden), alt satır "Denge evresi · Öneri: Karın (sağ)" ("önerilen bölge" yerine kullanıcının istediği "Öneri:"). Tekrarlanan "Bugün" ve "Sıradaki iğne:" kalktı. 360 px ve üstünde iki satır; 320 px'de bölge adı bölünmeden alt satıra iniyor.
- **Adım 10 · Emoji yerine çizgi simge (yapıldı):** uygulama içindeki emojiler uygulamanın kendi çizgi simgeleriyle değişti (her telefonda aynı görünür): Plus ekranı özellik listesi (iğne, grafik, belge, nabız, telefon; kutu rengiyle), Health Connect izinleri (ayak izi, tartı, damla) ve gizlilik satırındaki kilit, Adımlar "3 gün seri" (alev) ve "Hedef tamam" (onay), grafik kilitleri, koç protein önerisindeki yiyecekler (Protein ekranındaki yiyecek simgeleri). Ana ekran widget metinleri, ekibe gönder e-posta metni ve ✦/✓ karakterleri olduğu gibi kaldı.
- **Adım 11 · Yazı ölçeği (yapıldı):** ölçüm: kart başlıkları zaten tek boyuttaydı (17,5 px). Küçük yazılar 13 farklı boyuttan dörde toplandı: 11 (etiket), 12,5 (açıklama), 14 (normal), 15,5 (vurgulu); en küçük yazı artık 11 px (halka içi "/120 g", "Hedefin", "Son rozet", kadran altı etiketler büyüdü). 16 px ve üstü, büyük sayılar, paylaşım görselleri ve PDF değişmedi. Büyük harf kart başına bir etiket: "Hedefin", koç kartı "Protein", "Son rozet", kadran altındaki "Evre / Döngü günü / Yeni iğne" normal yazıya döndü; Ayarlar bölüm ayraçları kaldı. 320/360/390 px'de 8 sekmede taşma yok.
- **Adım 12 · Tarih ve saat alanları (yapıldı):** telefonun diline göre "10/23/2026" ve "06:30 PM" çıkan yerel tarih/saat kutuları yerine her telefonda Türkçe görünen alan ("23 Ekim 2026, Cuma", dar yerde "29 Eki 2026"; saat "18:30"); dokununca telefonun kendi takvimi/saati açılıyor. Uygulandığı yerler: Kilo gir, İğne ekle (tarih + saat), Ölçü ekle (yeni Bugün / Dün / Tarih seç çipleri), ilk kurulum son iğne tarihi ve saati, takviye programı saatleri, tartı hatırlatma saati (yalnızca Android). Kaydedilen değer biçimi değişmedi (2026-10-23, 18:30).
- **Sürüm hazırlığı:** Ayarlar'daki "Sürüm 1.9.0 önizleme · Adım …" etiketi kaldırıldı; sürüm notları (tr-TR, 443 karakter) güncellendi.
- **Performans:** emülatörde Protein & Su sekmesi boştayken 4–5 kare/sn ölçüldü (diğer sekmeler 56–61). Su bardağındaki dalga ve kabarcık animasyonu sonsuz döngüdeydi; artık açılışta birkaç tur oynayıp duruyor. Emülatör testi: adım paylaşma testi Özet'teki kaldırılan karta dokunmaya çalışıyordu, Adım halkasına dokunacak şekilde düzeltildi (40/40).

## Sırada (karar bekleyen / sonraki sürümler)
- Plus koç kartları: haftalık özet ve "gelecek haftanın tek hedefi", duraklama analizi (ölçü ve adım karşılaştırması)
- Koçtaki kişisel bulantı örüntüsü ücretsiz mi kalsın, Plus'a mı bağlansın (öneri: ücretsiz)
- Büyük yazı ayarı: şu an tamamen kapalı (textZoom 100); en fazla %115'e izin veren ara çözüm
- Web sitesi ve blog (ana sayfa ve ilk 4 yazı); yazıların kısa hâlleri uygulamada bağlama göre kart olarak
- İngilizce (sonra Almanca) sürüm, lb/oz birimleri, ülke bazında abonelik fiyatları
- iPhone sürümü (Apple Developer hesabı açılınca; ilk sürüm widget'sız)

## Play Console'da yapılacaklar (kullanıcı)
- Hesap doğrulaması → kapalı test (12 kişi, 14 gün) → üretim
- Abonelik ürünü `hafif_plus` ve 3 temel plan (bkz. magaza/abonelik-rehberi.md)
- Mağaza metni (magaza/aciklama.md), 8 tanıtım görseli (magaza/tanitim), video (YouTube bağlantısı)
