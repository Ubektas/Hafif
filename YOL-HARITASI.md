# Hafif yol haritası

## 1.9.0 için bekleyenler
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
  - Sağ altta + düğmesi: Kilo, İğne, Protein, Su (anında, "Geri al" ile), Ölçü, Yan etki.
  - Kilo gir: −/+ ile 0,1 kg (basılı tutunca hızlanır), Bugün/Dün/Tarih seç, yağ oranı ve not isteğe bağlı açılır.
  - İğne ekle: doz çipleri, Şimdi/Dün/Başka zaman, vücut çizimi üzerinde bölge ve her bölgenin son kullanımı. Bölge adları "Karın (sol)", "Uyluk ön (sol)", "Üst kol (sol)"; ayarlardan "Kullandığım bölgeler" (varsayılan karın + uyluk). Öneri: seçili bölgeler arasında en uzun süredir kullanılmayan. (Enjeksiyon bölgeleri maddesini karşılar.)
  - Kilo listesi: çöp kutusu yok (silme düzenleme penceresinde), yağ oranı düz yazı, geçmiş aylar kapalı.
  - İğneler: yedi günlük evre şeridi (güne dokununca evre), evre metni "Devamı" ile, "Vücuttaki ilaç" açılır bölümü; geçmişte çöp kutusu ve "bu aralıkta" yok.
  - Protein & Su: hızlı yiyecek satırında solma, haftalık grafikte açıklama. Takviyeler: "Hepsini aldım", dar ekranda tek harfli gün başlıkları, saat kutuları taşmıyor. (Bu üç hata maddesini karşılar.)
  - Ayarlar satır satır gruplar; kilolar virgülle. Hata düzeltmesi: ayarları kaydetmek tema seçimini ve kalem stoğunu sıfırlıyordu, artık korunuyor.
  - "Bu cihazda kayıtlı" yazısı yalnızca Ayarlar'da.
  - Emülatör testi + düğmesine göre güncellendi; koç simülatörü yeni bölge kuralıyla 0 hata.

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
