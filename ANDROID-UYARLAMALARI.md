# Android uyarlamaları

`www/index.html`, Claude'daki Hafif artifact'inden (https://claude.ai/artifact/HLc1A77LCcKJpmgXxitBdw) türetildi.
Claude sürümünde yapılan tasarım değişiklikleri buraya taşınırken artifact'in yeni HTML'i esas alınır ve
aşağıdaki değişiklikler yeniden uygulanır. Bunların dışında iki sürüm aynı kalmalıdır.

1. **Yerel fontlar** – Google Fonts `<link>` satırları yerine `<link rel="stylesheet" href="fonts/fonts.css">`.
   Yeni bir font ya da ağırlık eklenirse `www/fonts/` altına indirilip `fonts.css`'e eklenir.
2. **Yerel Excel kütüphanesi** – `loadXLSX` içinde `sc.src="vendor/xlsx.full.min.js"` (cdnjs yerine).
3. **Android'de kaydetme** – `dlSave` fonksiyonunun önüne `CAP` sabiti ve `nativeSave` fonksiyonu eklenir;
   `dlSave` ilk satırında `if(CAP)return nativeSave(name,data);` olur. `saveShare` içinde `try{` sonrasına
   `if(CAP){…nativeSave(`hafif-ilerleme-…png`,blob);toast("Görsel hazır");return}` satırı eklenir.
4. **Geri tuşu** – IIFE'nin sonundaki `boot();` satırından sonra
   `window.Capacitor.addListener("App","backButton",…)` bloğu: kutlama → alt sayfa → Özet → `exitApp`.
5. **Kişisel veriler çıkarıldı** – `TRACKY`, `TRACKY_TIMES`, `importTracky`, `importCard`, `ZEPP`,
   `importZepp`, `zeppCard` ve bunların `bindView` bağlantıları silinir; `vOzet` yalnızca `vOzetMain()` döndürür;
   `shotTime` yalnızca `x.time||"09:00"` kullanır.
6. **Boş başlangıç** – `DEF_SUPPS=[]` (kişisel takviye listesi yok) ve `startCut` varsayılanı `""`
   (sabit `"2026-09-16"` yerine; iğnesi olmayan kullanıcının eski tartıları gizlenmesin diye).

Taşımadan sonra: `npx cap sync android`, emülatör testi (`.github/workflows/android-test.yml`) ve
`node magaza/kaynak/ekran-goruntuleri.js` ile ekran görüntüleri yenilenir.
