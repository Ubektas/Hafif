# Uygulama metinleri listesi (dil/hafif-metinler.xlsx)

Uygulamadaki bütün yazıları (uygulama içi, Ne yesem? önerileri, ipuçları, koç kartları, bildirimler,
Android ve iPhone widget'ları, iPhone izin pencereleri) ekran, tür ve platformla Excel'e döker.
Android/iPhone farkı `IOS()` koşullarından ve Health Connect / Apple Sağlık adlarından çıkarılır.

Geçici bir klasörde, sırasıyla:

    node /home/user/Hafif/araclar/metin-listesi/cikar.js        # www/index.html → ham.json (acorn: /opt/node-tools/node_modules)
    python3 /home/user/Hafif/araclar/metin-listesi/temizle.py   # → satirlar.json
    (cd /home/user/Hafif && python3 araclar/metin-listesi/yerel.py "$OLDPWD/yerel.json")   # Java/Swift/strings.xml/Info.plist
    python3 /home/user/Hafif/araclar/metin-listesi/excel.py /home/user/Hafif/dil/hafif-metinler.xlsx
