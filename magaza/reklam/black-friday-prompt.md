# Black Friday 2026: uygulama oturumu için prompt

Uygulama oturumuna (dal `claude/gifted-keller-p80qcv`) aşağıdaki metni olduğu gibi ver.

---

Hafif'e Black Friday kampanyası ekleyelim. Önce Android'e çıkacak: Play'e en geç **25 Kasım 2026** gönderilecek. iOS yetişirse aynı kodla gider.

**Kampanya:** Plus **yıllık** plan %40 indirimli: ~~499,99 ₺~~ → **299,99 ₺**. Aylık ve 3 aylık planlar değişmiyor.
**Süre:** 27 Kasım 2026 00:00 – 30 Kasım 2026 23:59, telefonun yerel saatiyle.
**Fiyat:** İndirim mağazada uygulanacak. Kampanyadan önce yıllık temel planın fiyatını Play Console'da ve App Store Connect'te 299,99 ₺ yapacağım, 1 Aralık'ta geri alacağım. Uygulama fiyatı zaten mağazadan okuyor (`pwOffer` / `pricingPhases`). Bu yüzden **koda yeni bir teklif ya da ürün ekleme**.

## İstenenler

1. **Kampanya tarih kontrolü:** tek bir sabit ve yardımcı fonksiyon, örn. `BF = {bas: 2026-11-27 00:00, bit: 2026-11-30 23:59, eski: 499.99}` ve `bfAktif()`. Kampanya dışında hiçbir şey görünmez. Bu sayede 1 Aralık'tan sonra yeni bir güncelleme gerekmez.

2. **Ana ekranda bant** (yalnızca Plus aboneliği olmayanlara, kampanya süresince):
   - Metin: "Black Friday: Plus yıllık %40 indirimli · 30 Kasım'a kadar"
   - Dokununca ödeme ekranı açılır ve **yıllık plan seçili** gelir.
   - Kapatılabilsin (×); kapatılınca o gün bir daha görünmesin.
   - Uygulamanın mevcut tasarım dilinde olsun (çizgi simge, emoji yok), koyu temada da düzgün görünsün.

3. **Ödeme ekranı:**
   - Kampanya süresince en üstte küçük bir "Black Friday · %40" etiketi göster.
   - Yıllık planda mağazadan gelen fiyatın yanında **üstü çizili 499,99 ₺** göster, ama **yalnızca mağaza fiyatı 499,99'dan düşükse**. Fiyat henüz değişmemişse sahte indirim görünmesin.
   - Kampanya süresince yıllık plan varsayılan olarak seçili gelsin.
   - Mevcut "%X tasarruf" hesabı mağaza fiyatıyla doğru çalışmaya devam etsin.

4. **Yerel bildirimler** (`@capacitor/local-notifications`; su ve iğne hatırlatıcılarıyla aynı altyapı):
   - Uygulama her açıldığında, kampanya bitmediyse ve kullanıcı Plus abonesi değilse, iki bildirimi kur. Bildirimlere sabit ID ver; tekrar açılışta çift bildirim olmasın.
     - **27 Kas 2026 20:00:** başlık "Black Friday: Plus %40 indirimli", gövde "Yıllık Plus 299,99 ₺. Doz planı, grafikler ve doktor raporu. 30 Kasım'a kadar."
     - **30 Kas 2026 20:00:** başlık "Son gün: Plus %40 indirimli", gövde "Yıllık Plus 299,99 ₺ fırsatı bu gece bitiyor."
   - Saati geçmiş bildirimi kurma.
   - Kullanıcı Plus satın alırsa iki bildirimi iptal et.
   - Bildirim iznini yalnızca bunun için isteme. İzin yoksa sessizce atla.
   - Bildirime dokununca ödeme ekranı yıllık plan seçili açılsın.

5. **Kurallar:**
   - Analitik, SDK ya da sunucu yok ("veri toplama yok" ilkesi).
   - Sağlık iddiası ya da ilaç adı kullanma.
   - Plus aboneleri bant, etiket ve bildirim görmesin.

6. **Test:**
   - Tarihi kampanya öncesine, içine ve sonrasına alarak bandın ve etiketin göründüğünü ve kaybolduğunu doğrula.
   - Abone olan kullanıcıda hiçbir şeyin görünmediğini doğrula.
   - Bildirimlerin bir kez kurulduğunu, satın almada iptal edildiğini doğrula.
   - Mağaza fiyatı 499,99 iken üstü çizili fiyatın görünmediğini doğrula.
   - Mevcut testler (`tests/`) geçsin.

7. **Sürüm:** sürüm numarası ve versionCode artır. Play sürüm notu: "Küçük iyileştirmeler ve Black Friday fırsatı." Android paketini (AAB) hazırla; sonra iOS derlemesi.

Bitince ne değiştiğini, test sonucunu ve Play'e yükleme adımlarını kısaca yaz.
