// App Store (iPhone 6,9") görselleri, Play'in 2. tasarımıyla aynı (magaza/tanitim-2). 1080 genişlikte tasarlanıp CSS zoom ile 1320×2868'e büyütülür.
// iPhone ekranı daha uzun (9:19,5); fazladan yükseklik her sayfada içerik bloklarının arasına dağıtılır (KAY).
// Farklar: Health Connect → Apple Sağlık; widget'lar iPhone'daki gerçek çizimler (widget-ios/).
// Çalıştırma: node magaza/kaynak/aso/ios-tanitim-2.js [playwright modül yolu]  → magaza/ios-2/*.png
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/ios-2');
fs.mkdirSync(OUT, { recursive: true });
const T = require('./tanitim-2.js'), { Kk } = require('./kapak-alternatifleri-2.js');
const H = 2348; // ≈ 2868 / (1320/1080)
const WI = f => `file://${ROOT}/magaza/kaynak/aso/widget-ios/${f}`;
const ek = (html, css) => html.replace('</style>', `html{zoom:${1320 / 1080}}.s{height:${H}px}${css}</style>`);
const SAYFA = [
  ['01-neler-yapar', ek(Kk, '.top{margin-top:160px}.tl{margin-top:150px}')],
  ['02-ne-yesem', ek(T.s02, '.band{height:1060px}.t{top:180px}.plate{top:800px}.rows{top:1520px;gap:26px}')],
  ['03-igne-doz', ek(T.s03, '.t{top:180px}.next{top:780px}.plan{top:1160px}.warn{top:1960px}')],
  ['04-koc', ek(T.s04, '.t{top:180px}.chat{top:820px;gap:80px}')],
  ['05-kilo-yolu', ek(T.s05, '.t{top:180px}.cv{top:800px}.lbl{top:1250px!important}.eta{top:1250px}.wk{top:1480px}')],
  ['06-her-gun', ek(T.s06.replace("Health Connect'ten kendiliğinden", "Apple Sağlık'tan kendiliğinden"),
    '.band{height:900px}.t{top:180px}.tri{top:720px}.wh{top:1290px}' +
    '.home{top:1350px;height:auto;bottom:auto;display:grid;grid-template-columns:1.9fr 1fr;grid-auto-rows:auto;gap:30px;padding:44px;align-items:start}' +
    '.home img{width:100%;height:auto;border-radius:44px;filter:drop-shadow(0 18px 24px rgba(11,40,36,.35))}.home .tam{grid-row:1/3}') ],
  ['07-ilerleme', ek(T.s07, '.t{top:180px}.pol{top:800px}.p2{top:840px}.lock{top:1440px}.ex{top:1620px}')],
  ['08-rapor-gizlilik', ek(T.s08, '.band{height:1160px}.t{top:180px}.doc{top:720px}.tag{top:760px}.tr{top:1680px}')],
];
// 06: Android widget ızgarasının yerine iPhone widget'ları
SAYFA[5][1] = SAYFA[5][1].replace(/<div class="home">.*?<\/div>/s, `<div class="home"><img class="tam" src="${WI('pano.png')}"><img src="${WI('su.png')}"><img src="${WI('igne.png')}"></div>`);
if (require.main === module) (async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1320, height: 2868 } });
  for (const [ad, html] of SAYFA) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam', SAYFA.length);
})();
