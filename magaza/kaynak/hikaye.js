// Instagram hikâyeleri (1080x1920). Üstte ~250, altta ~340 piksel Instagram arayüzüne kalır; içerik ortada.
// Önce ekran-goruntuleri.js çalıştırılmış olmalı (magaza/ekran/*.png).
// Çalıştırma: node magaza/kaynak/hikaye.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/instagram');
fs.mkdirSync(OUT, { recursive: true });

const app = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
const sekme = t => '<svg' + app.match(new RegExp(`data-tab="${t}"[^>]*><svg(.*?)</svg>`))[1] + '</svg>';
const svgI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const YAPRAK = svgI('<path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/><path d="M9 14l5-5"/>');
const I = {
  kilo: sekme('kilo'), igne: sekme('igne'), besin: sekme('besin'), takviye: sekme('takviye'),
  nabiz: svgI('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
  adim: svgI('<path d="M8.5 3.5c1.6 0 2.5 1.6 2.5 3.8S10 11 8.6 11 6 9.5 6 7.3s.9-3.8 2.5-3.8zM6.6 13h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/><path d="M15.5 7.5c1.6 0 2.5 1.6 2.5 3.8S17 15 15.6 15 13 13.5 13 11.3s.9-3.8 2.5-3.8zM13.6 17h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/>'),
  zil: svgI('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  olcu: svgI('<path d="M3.5 8.5h17v7h-17z"/><path d="M7 8.5v3M10.5 8.5v4M14 8.5v3M17.5 8.5v4"/>'),
  rapor: svgI('<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 17v-3M12 17v-5M15 17v-2"/>'),
  widget: svgI('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="17" height="7" rx="2"/>'),
  rozet: svgI('<circle cx="12" cy="9" r="6"/><path d="M8.5 13.8 7 21l5-2.6L17 21l-1.5-7.2"/>'),
  dalga: svgI('<path d="M3 16c3 0 3-8 6-8s3 8 6 8 3-5 6-5"/>'),
  grafik: svgI('<path d="M4 19h16"/><path d="M5 15l4-4 3 2 6-6"/>'),
  kalem: svgI('<rect x="9" y="2.5" width="6" height="15" rx="2"/><path d="M12 17.5v4M9 7h6"/>'),
  kilit: svgI('<rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
};

const CSS = `html,body{margin:0}
.s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;box-sizing:border-box}
.koyu{color:#fff;background:radial-gradient(90% 55% at 85% 0%,#1F8A70 0%,transparent 60%),radial-gradient(80% 40% at 0% 100%,#14594A 0%,transparent 70%),linear-gradient(165deg,#0D4237,#051D18)}
.acik{color:#0B3B33;background:radial-gradient(100% 50% at 100% 0%,#CDEBDF 0%,transparent 60%),radial-gradient(90% 45% at 0% 100%,#CDEBDF 0%,transparent 65%),#E6F4EE}
.marka{position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center;align-items:center;gap:14px;font:700 40px Outfit}
.marka svg{width:44px;height:44px;color:#9FF0D6}.acik .marka svg{color:#0E7C66}
h1{margin:0;font:700 112px/1.02 Outfit;letter-spacing:-.02em;text-align:center}
h1 em{font-style:normal;color:#9FF0D6}.acik h1 em{color:#0E7C66}
p{margin:28px auto 0;font:500 38px/1.4 Figtree;text-align:center;max-width:860px;opacity:.8}
.tel{position:absolute;left:50%;width:560px;height:1150px;margin-left:-280px;background:#0B2420;border-radius:74px;padding:16px;box-sizing:border-box;box-shadow:0 60px 120px -40px #000C,0 0 0 2px #2A4A43 inset;overflow:hidden}
.tel img{display:block;width:100%;border-radius:58px 58px 0 0}
`;
const marka = '<div class="marka">' + YAPRAK + 'Hafif</div>';
const tel = (img, top, rot = 0, left = 0) => `<div class="tel" style="top:${top}px;transform:translateX(${left}px) rotate(${rot}deg)"><img src="../ekran/${img}"></div>`;

const OZELLIK = [
  [I.kilo, 'Kilo takibi', 'eğri, hız ve rozetler'],
  [I.igne, 'İğne takibi', 'evre ve sıradaki iğne'],
  [I.nabiz, 'Yan etki günlüğü', 'hangi gün yoğunlaşıyor'],
  [I.besin, 'Protein ve su', 'günlük hedeflerin'],
  [I.takviye, 'Takviyeler', 'sabah, öğle, akşam, gece'],
  [I.adim, 'Adım ve akıllı tartı', 'Health Connect ile'],
  [I.zil, 'Hatırlatıcılar', 'iğne, su, tartı, takviye'],
  [I.olcu, 'Vücut ölçüleri', 'bel, kalça, göğüs…'],
  [I.kalem, 'Kalem stoğu', 'kaç doz kaldı'],
  [I.rapor, 'Doktor raporu', 'tek PDF', 1],
  [I.dalga, 'İlaç seviyesi', 'vücuttaki mg, evre önerileri', 1],
  [I.grafik, 'Detaylı kilo grafikleri', 'haftalık, trend, yağ oranı', 1],
  [I.widget, 'Widget\'lar', '10 ana ekran widget\'ı', 1],
  [I.kilit, 'Gizli ve reklamsız', 'hesap yok, veri sende'],
];

const HIKAYELER = [
  { ad: 'hikaye-1-yayinda', sinif: 'koyu', html: `${marka}
    <div style="position:absolute;left:80px;right:80px;top:370px"><h1>Hafif<br><em>yayında!</em></h1>
      <p>Kilo verirken takip ettiğin her şey tek sade uygulamada.</p></div>
    ${tel('01-ozet.png', 820)}
    <div style="position:absolute;left:0;right:0;bottom:250px;display:flex;justify-content:center"><span style="background:#9FF0D6;color:#0B3B33;border-radius:99px;padding:22px 44px;font:700 36px Figtree;box-shadow:0 20px 50px -10px #000A">Google Play'de ücretsiz</span></div>` },
  { ad: 'hikaye-2-ozellikler', sinif: 'acik', html: `${marka}
    <div style="position:absolute;left:70px;right:70px;top:340px"><h1 style="font-size:92px">Hepsi<br><em>tek uygulamada.</em></h1></div>
    <div style="position:absolute;left:60px;right:60px;top:590px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${OZELLIK.map(([ic, b, s, pl]) => `<div style="background:#fff;border-radius:30px;padding:20px 22px;display:flex;gap:18px;align-items:center;box-shadow:0 22px 44px -32px #0B3B3388;position:relative">
        <i style="flex:none;width:76px;height:76px;border-radius:22px;background:${pl ? '#E8EDFA' : '#E1F3EC'};color:${pl ? '#3552B0' : '#0E7C66'};padding:17px;box-sizing:border-box;display:block">${ic}</i>
        <span style="padding-right:${pl ? 50 : 0}px"><b style="display:block;font:700 30px/1.15 Outfit">${b}</b><span style="display:block;font:500 24px/1.3 Figtree;opacity:.65;margin-top:4px">${s}</span></span>
        ${pl ? '<em style="position:absolute;top:12px;right:16px;font:700 17px Figtree;font-style:normal;letter-spacing:.06em;color:#3552B0">✦ PLUS</em>' : ''}</div>`).join('')}
    </div>
    <div style="position:absolute;left:60px;right:60px;top:1640px;text-align:center;font:600 28px Figtree;opacity:.65">✦ Plus özellikleri ilk 7 gün ücretsiz</div>` },
  { ad: 'hikaye-3-soru', sinif: 'koyu', html: `${marka}
    <div style="position:absolute;left:80px;right:80px;top:380px"><h1 style="font-size:100px">Kilo verirken<br>en çok neyi<br><em>unutuyorsun?</em></h1>
      <p>Anket çıkartmasıyla cevapla, sonraki gönderiyi senin cevabına göre hazırlayalım.</p></div>
    <div style="position:absolute;left:0;right:0;top:1500px;display:flex;justify-content:center;gap:40px;font-size:96px">💧 🥚 💊 ⚖️</div>` },
];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(__dirname, '_hk.html');
  for (const h of HIKAYELER) {
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../www/fonts/fonts.css"><style>${CSS}</style></head><body><div class="s ${h.sinif}">${h.html}</div></body></html>`);
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, h.ad + '.png') });
  }
  fs.unlinkSync(f);
  await b.close();
  console.log('hikâyeler:', OUT);
})();
