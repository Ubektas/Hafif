// Google Ads uygulama kampanyası görselleri, tanıtım 2 tasarım dili. 2 tasarım × 3 boy:
// yatay 1200×628 (1,91:1), kare 1200×1200, dikey 1200×1500 (4:5). Çıktı: magaza/reklam/
// Reklam kuralı: ilaç adı, iğne/ilaç simgesi, önce/sonra, "kilo verdirir" yok.
// Çalıştırma: node magaza/kaynak/aso/reklam-gorselleri.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/reklam');
fs.mkdirSync(OUT, { recursive: true });
const Z = '#0B3B33', N = '#9FF0D6', K = '#F4F1EA';
const BOY = { yatay: [1200, 628], kare: [1200, 1200], dikey: [1200, 1500] };
const leaf = s => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${N}" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const plate = d => `<div class="plate" style="width:${d}px;height:${d}px;box-shadow:0 ${d / 8}px ${d / 4}px -${d / 10}px rgba(0,0,0,.6),inset 0 0 0 ${d / 19}px #F3EEE5">
<i class="e" style="left:${d * .17}px;top:${d * .2}px;font-size:${d * .35}px;transform:rotate(-12deg)">🍗</i><i class="e" style="left:${d * .5}px;top:${d * .37}px;font-size:${d * .31}px">🥗</i><i class="e" style="left:${d * .2}px;top:${d * .52}px;font-size:${d * .29}px">🍚</i></div>`;

// her tasarım: başlık, alt yazı, görsel parçası
const TAS = {
  'her-sey': { h: 'Kilo verirken<br><em>ihtiyacın olan<br>her şey.</em>', sub: 'Kilo, protein, su ve adım tek ekranda.',
    alt: s => `<div class="chips">${['⚖️', '🥚', '💧', '👟', '📋'].map(e => `<span class="c e" style="width:${s}px;height:${s}px;font-size:${s * .55}px;border-radius:${s * .3}px">${e}</span>`).join('')}</div>` },
  'ne-yesem': { h: 'Akşam ne yesem?<br><em>Hafif söylesin.</em>', sub: 'Kalan proteinine göre Türk mutfağından.',
    alt: s => `<div class="card" style="padding:${s * .28}px ${s * .36}px;gap:${s * .3}px;border-radius:${s * .45}px"><span class="e ci" style="font-size:${s * .6}px;width:${s}px;height:${s}px;border-radius:${s * .3}px">🍗</span><div><b style="font-size:${s * .42}px">Tavuk şiş ve bulgur</b><small style="font-size:${s * .28}px">+38 g protein · akşam için</small></div></div>` }
};

const html = (t, boy) => {
  const [W, H] = BOY[boy], y = boy === 'yatay';
  const hs = y ? 60 : boy === 'kare' ? 92 : 100, pd = y ? 64 : 90;
  const lay = y
    ? `.l{position:absolute;left:${pd}px;top:56px;width:560px}.r{position:absolute;right:56px;top:0;bottom:0;width:470px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}`
    : `.l{position:absolute;left:${pd}px;right:${pd}px;top:${pd}px}.r{position:absolute;left:0;right:0;bottom:${boy === 'kare' ? 70 : 100}px;display:flex;flex-direction:column;align-items:center;gap:${boy === 'kare' ? 40 : 56}px}`;
  const pl = y ? 330 : boy === 'kare' ? 430 : 560, cs = y ? 74 : boy === 'kare' ? 100 : 116;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}.s{width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#fff;
background:radial-gradient(${y ? '55% 100%' : '90% 55%'} at 100% 0%,#1F8A70 0%,transparent 65%),${Z}}
.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
.lg{display:flex;align-items:center;gap:12px;font:700 ${y ? 36 : 44}px Outfit}
h1{margin:${y ? 26 : 40}px 0 0;font:700 ${hs}px/1.03 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:${N}}
.sub{margin-top:${y ? 18 : 26}px;font:500 ${y ? 24 : 34}px/1.35 Figtree;color:rgba(255,255,255,.75)}
.plate{position:relative;border-radius:50%;background:#fff;flex:none}.plate i{position:absolute}
.chips{display:flex;gap:${y ? 10 : 16}px}.c{background:${K};display:grid;place-items:center;box-shadow:0 16px 30px -16px rgba(0,0,0,.6)}
.card{display:flex;align-items:center;background:#fff;color:#0B2420;box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.ci{background:#FBF0DC;display:grid;place-items:center;flex:none}.card b{display:block;font-family:Outfit;font-weight:700;letter-spacing:-.01em}.card small{font-family:Figtree;font-weight:500;color:#5F726C}
${lay}</style></head><body><div class="s">
<div class="l"><div class="lg">${leaf(y ? 40 : 50)}Hafif</div><h1>${t.h}</h1><div class="sub">${t.sub}</div></div>
<div class="r">${plate(pl)}${t.alt(cs)}</div></div></body></html>`;
};

(async () => {
  const b = await chromium.launch();
  for (const [ad, t] of Object.entries(TAS)) for (const boy of Object.keys(BOY)) {
    const [W, H] = BOY[boy]; const p = await b.newPage({ viewport: { width: W, height: H } });
    const f = path.join(OUT, `_${ad}-${boy}.html`); fs.writeFileSync(f, html(t, boy));
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, `${ad}-${boy}-${W}x${H}.png`) }); fs.unlinkSync(f); await p.close();
  }
  await b.close(); console.log('tamam');
})();
