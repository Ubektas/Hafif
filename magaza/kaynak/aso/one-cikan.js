// Play öne çıkan görsel (feature graphic), 1024×500. Video bağlıysa ortasına oynat düğmesi gelir; orta kısım sakin tutulur.
// Çalıştırma: node magaza/kaynak/aso/one-cikan.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/tanitim-2');
const leaf = `<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#9FF0D6" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const html = (play) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}.s{width:1024px;height:500px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#fff;
background:radial-gradient(60% 90% at 100% 0%,#1F8A70 0%,transparent 65%),#0B3B33}
.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
.l{position:absolute;left:64px;top:54px;width:420px}
.lg{display:flex;align-items:center;gap:10px;font:700 34px Outfit}
h1{margin:30px 0 0;font:700 56px/1.04 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#9FF0D6}
.tr{position:absolute;left:64px;bottom:50px;display:flex;gap:10px}.tr span{border:1px solid rgba(159,240,214,.3);color:rgba(255,255,255,.85);border-radius:99px;padding:8px 16px;font:600 17px Figtree}
.plate{position:absolute;right:60px;top:60px;width:300px;height:300px;border-radius:50%;background:#fff;box-shadow:0 40px 70px -30px rgba(0,0,0,.6),inset 0 0 0 16px #F3EEE5}
.plate i{position:absolute}
.chips{position:absolute;right:30px;bottom:44px;display:flex;gap:10px}
.c{width:66px;height:66px;border-radius:20px;background:#F4F1EA;display:grid;place-items:center;font-size:36px;box-shadow:0 16px 30px -16px rgba(0,0,0,.6)}
.pb{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px;border-radius:50%;background:rgba(0,0,0,.55);display:grid;place-items:center}.pb:after{content:"";margin-left:8px;border-left:30px solid #fff;border-top:18px solid transparent;border-bottom:18px solid transparent}
</style></head><body><div class="s">
<div class="l"><div class="lg">${leaf}Hafif</div><h1>Kilo verirken<br><em>ihtiyacın olan<br>her şey.</em></h1></div>
<div class="tr"><span>Hesap yok</span><span>Reklam yok</span><span>Veri telefonunda</span></div>
<div class="plate"><i class="e" style="left:52px;top:62px;font-size:104px;transform:rotate(-12deg)">🍗</i><i class="e" style="left:150px;top:112px;font-size:92px">🥗</i><i class="e" style="left:62px;top:158px;font-size:86px">🍚</i></div>
<div class="chips">${['💉', '💧', '💊', '👟', '📋'].map(e => `<span class="c e">${e}</span>`).join('')}</div>
${play ? '<span class="pb"></span>' : ''}
</div></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 500 } });
  for (const [ad, pl] of [['one-cikan-1024x500', 0], ['_one-cikan-video-onizleme', 1]]) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html(pl));
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam');
})();
