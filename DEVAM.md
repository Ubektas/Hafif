# Yeni oturum için devir notu (31 Ekim 2026)

Bu dosya, Hafif üzerinde çalışan yeni bir Claude oturumunun kaldığı yerden devam etmesi içindir. Ayrıntılı geçmiş ve bütün kararlar `YOL-HARITASI.md` dosyasındadır.

## Proje
- **Hafif**: Türkçe kilo ve haftalık iğne (GLP-1) takip uygulaması. Android, Capacitor 8, paket `com.ugurbektas.hafif`.
- Kullanıcıyla **Türkçe** konuşulur.
- Repo: `Ubektas/Hafif`. Çalışma dalı: **`surum-2.0`** (henüz `main`'e birleşmedi; 2.0 Play'de yayına çıkınca birleştirilecek).
- Gizlilik sayfası ayrı repo: `Ubektas/hafif-gizlilik` (main yayında, 2.0 metni dahil).

## Kaynak dosya (önemli)
- Uygulamanın asıl kaynağı tek bir HTML dosyası: Claude artifact'i **https://claude.ai/artifact/HLc1A77LCcKJpmgXxitBdw** (sürüm 110 en güncel hâl).
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

## Sıradaki işler (toplantı 2 kararları ve açık konular)
1. **Üretimden önce:** Play'de görünen ev adresi ve geliştirici adı ("Hafif" olmalı), veri güvenliği formu (kullanıcı yapar).
2. **2.0.1:** "2.0'da yeni" tanıtım sayfası (bir kez), Ne yesem?'i Protein & Su'da protein kartının hemen altına taşımak.
3. Yorum yanıt şablonları; mağaza görseli 6'daki Ne yesem? widget'ını akşam saatine göre yeniden çizdirmek (isteğe bağlı).
4. **2.1:** içerik katmanında emoji (+ paneli vb.), yazı boyutu ayarı (en fazla %115), rakamsız haftalık paylaşım kartı, bildirimleri koçun sesiyle yeniden yazmak.
5. **Şubat 2027'den önce:** Ramazan modu.
6. **Karar bekleyen:** maliyet takibi (tasarım `YOL-HARITASI.md`'de).
