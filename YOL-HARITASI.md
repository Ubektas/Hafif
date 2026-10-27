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
- **Öneri (onay bekliyor): Alınmayan takviye / yapılmayan iğne için otomatik ikinci hatırlatma**
  - Şu an: her vakit için o saatte tek bildirim; alındıysa hiç gelmiyor; "Ertele" elle 1 saat sonraya kuruyor. Kendiliğinden ikinci hatırlatma yok.
  - Plan: vaktin saatinden X dakika sonra (varsayılan 60, ayarlardan 30/60/120 ya da kapalı) "Sabah takviyelerini aldın mı?" bildirimi. Önceden kurulur; "Hepsini aldım" işaretlenince kendiliğinden iptal edilir (uygulama açık olmasa da çalışır). Günde en fazla 1 ek hatırlatma, gece saatlerinde gönderilmez.
  - Aynı mantık iğne günü için: iğne saatinden 3 saat sonra kaydedilmemişse "İğneni yaptın mı?".
- **"Hafif ekibine gönder" (paylaşım kartı)**
  - Paylaşım ekranına "Görseli kaydet / paylaş"ın altına ikinci düğme. Taslak: `magaza/taslak/gonder-akisi.png`.
  - İzin ekranı: "Instagram'da paylaşabilirsiniz" kutusu (işaretlenmeden düğme açılmaz), görünüm seçimi (Adımla / Baş harflerle / Anonim), isteğe bağlı not, iznin geri alınabileceği bilgisi.
  - Telefonun e-posta uygulaması alıcı apphafif@gmail.com, konu, izin metni ve ekli kartla açılır; uygulama veriyi kendisi göndermez (Android'de HafifWidget eklentisine EXTRA_EMAIL + ek dosyalı paylaşım fonksiyonu).
  - Gizlilik politikasına bir cümle: kullanıcının kendi başlattığı e-posta gönderimi.
- **Paylaşım ekranı metni (yapıldı, 1.9.0 ile Android'e gelecek):** "iPhone'da paylaşım menüsü açılır…" yerine "Telefonunun paylaşım menüsü açılır; WhatsApp'ı, Instagram'ı ya da galeriye kaydetmeyi seçebilirsin."

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
