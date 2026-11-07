# Uygulama metinleri listesi (dil/hafif-metinler.xlsx)

`www/index.html`'deki bütün kullanıcıya görünen yazıları ve Android/iPhone widget yazılarını Excel'e döker.
Çalışma klasöründe (ör. geçici bir klasör) sırasıyla:

    node cikar.js            # www/index.html → ham.json (acorn: /opt/node-tools/node_modules)
    python3 temizle.py       # kod parçalarını ayıklar, ekranlara göre sınıflar → satirlar.json
    python3 excel.py         # native.txt (widget/sistem yazıları) ile birlikte dil/hafif-metinler.xlsx

`native.txt`, Java/Swift/strings.xml/Info.plist'ten tırnak içindeki Türkçe yazıların listesidir (satır: `dosya:satır<TAB>metin`).
