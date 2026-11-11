// App Store ürün sayfası afişleri (isteğe bağlı): Header 3840×1646 ve Search Results 1920×1280.
// Play öne çıkan görselinin (one-cikan.js) aynı tasarımı; küçük çizilip CSS zoom ile büyütülür.
// Çalıştırma: node magaza/kaynak/aso/ios-afis.js [playwright modül yolu]  → magaza/ios-afis/*.png
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/ios-afis');
fs.mkdirSync(OUT, { recursive: true });
const leaf = `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#9FF0D6" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const plate = s => `<div class="plate" style="width:${s}px;height:${s}px"><i class="e" style="left:${s * .17}px;top:${s * .2}px;font-size:${s * .35}px;transform:rotate(-12deg)">🍗</i><i class="e" style="left:${s * .5}px;top:${s * .37}px;font-size:${s * .31}px">🥗</i><i class="e" style="left:${s * .2}px;top:${s * .53}px;font-size:${s * .29}px">🍚</i></div>`;
const chips = `<div class="chips">${['💉', '💧', '💊', '👟', '📋'].map(e => `<span class="c e">${e}</span>`).join('')}</div>`;
const html = (w, h, z, govde, css) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html{zoom:${z}}html,body{margin:0}.s{width:${w}px;height:${h}px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#fff;
background:radial-gradient(60% 90% at 100% 0%,#1F8A70 0%,transparent 65%),#0B3B33}
.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
.lg{display:flex;align-items:center;gap:10px;font:700 34px Outfit}
h1{margin:30px 0 0;font:700 56px/1.04 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#9FF0D6}
.tr{position:absolute;display:flex;gap:10px}.tr span{border:1px solid rgba(159,240,214,.3);color:rgba(255,255,255,.85);border-radius:99px;padding:8px 16px;font:600 17px Figtree}
.plate{position:absolute;border-radius:50%;background:#fff;box-shadow:0 40px 70px -30px rgba(0,0,0,.6),inset 0 0 0 16px #F3EEE5}.plate i{position:absolute}
.chips{position:absolute;display:flex;gap:10px}
.c{width:66px;height:66px;border-radius:20px;background:#F4F1EA;display:grid;place-items:center;font-size:36px;box-shadow:0 16px 30px -16px rgba(0,0,0,.6)}
${css}</style></head><body><div class="s">${govde}</div></body></html>`;
const baslik = `<div class="lg">${leaf}Hafif</div><h1>Kilo verirken<br><em>ihtiyacın olan<br>her şey.</em></h1>`;
const tr = `<div class="tr"><span>Hesap yok</span><span>Reklam yok</span><span>Veri telefonunda</span></div>`;
const AFIS = [
  // Header 3840×1646 = 1024×439 × 3,75
  ['header-3840x1646', 3840, 1646, html(1024, 439, 3.75, `<div class="l">${baslik}</div>${tr}<div style="position:absolute;right:70px;top:40px">${plate(270)}</div>${chips}`,
    '.l{position:absolute;left:64px;top:46px}.tr{left:64px;bottom:40px}.plate{position:relative;display:block}.chips{right:36px;bottom:36px}')],
  // Search Results 1920×1280 = 960×640 × 2
  ['arama-1920x1280', 1920, 1280, html(960, 640, 2, `<div class="l">${baslik}</div>${tr}<div style="position:absolute;right:56px;top:70px">${plate(330)}</div>${chips}`,
    '.l{position:absolute;left:60px;top:70px}h1{font-size:60px}.tr{left:60px;bottom:56px}.plate{position:relative;display:block}.chips{right:46px;bottom:48px}')],
];
(async () => {
  const b = await chromium.launch();
  for (const [ad, w, h, s] of AFIS) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, s);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f); await p.close();
  }
  await b.close(); console.log('tamam');
})();
