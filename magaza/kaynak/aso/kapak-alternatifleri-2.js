// Mağaza 1. görseli · 2. tur: her özelliğe değinir, rakam yerine çizim ve kısa cümle. 1080×1920.
// Çalıştırma: node magaza/kaynak/aso/kapak-alternatifleri-2.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/aso-alternatif');
const FONTS = `<link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css">`;
const base = `*{box-sizing:border-box}html,body{margin:0}.s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif}h1{font-family:Outfit,sans-serif}`;
const leaf = c => `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const logo = (c, ink) => `<div style="display:flex;align-items:center;gap:14px">${leaf(c)}<b style="font:700 44px Outfit;letter-spacing:-.02em;color:${ink}">Hafif</b></div>`;

/* —— düz çizimler (100×100 kutu) —— */
const IL = {
  tabak: `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="44" fill="#E9E4DA"/><circle cx="50" cy="50" r="44" fill="#fff"/><circle cx="50" cy="50" r="34" fill="#F7F3EC"/>
    <g fill="#E8B04A">${[[36,58],[41,63],[34,64],[44,57],[39,68],[46,66],[31,60],[42,52]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2"/>`).join('')}</g>
    <path d="M30 34L74 52" stroke="#8A6A4A" stroke-width="2.4" stroke-linecap="round"/>${[[40,38],[50,42],[60,46]].map(([x,y])=>`<rect x="${x-6}" y="${y-6}" width="12" height="12" rx="4" fill="#C9792E" transform="rotate(22 ${x} ${y})"/>`).join('')}
    <path d="M60 60c4-6 12-6 14 0-3 5-10 6-14 0z" fill="#6DBF67"/><path d="M56 68c3-5 10-5 12 0-3 4-9 5-12 0z" fill="#4FA35A"/><circle cx="66" cy="72" r="3.5" fill="#E2483C"/></svg>`,
  corba: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="80" rx="30" ry="5" fill="#E9E4DA"/><path d="M12 44h76c0 20-16 34-38 34S12 64 12 44z" fill="#FFFFFF" stroke="#E6DFD2" stroke-width="1.5"/>
    <ellipse cx="50" cy="44" rx="38" ry="10" fill="#E07B2C"/><ellipse cx="50" cy="43" rx="34" ry="7.5" fill="#EE9440"/><path d="M40 42c4-4 12-4 16 0-4 3-12 3-16 0z" fill="#fff"/><circle cx="66" cy="42" r="2.2" fill="#B5442A"/><circle cx="33" cy="45" r="1.8" fill="#6DBF67"/>
    <path d="M74 30l10-14" stroke="#C9C1B3" stroke-width="4" stroke-linecap="round"/></svg>`,
  tarti: `<svg viewBox="0 0 100 100"><rect x="14" y="20" width="72" height="66" rx="18" fill="#fff" stroke="#D5E6DE" stroke-width="2"/><path d="M34 46a16 16 0 0 1 32 0" fill="none" stroke="#0E7C66" stroke-width="5" stroke-linecap="round"/><path d="M50 46l7-9" stroke="#0B3B33" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="46" r="3.5" fill="#0B3B33"/></svg>`,
  kalem: `<svg viewBox="0 0 100 100"><g transform="rotate(-40 50 50)"><rect x="22" y="40" width="50" height="20" rx="10" fill="#fff" stroke="#C9D3EA" stroke-width="2"/><rect x="30" y="44" width="24" height="12" rx="4" fill="#7FA3F0"/><rect x="72" y="44" width="10" height="12" rx="3" fill="#27407A"/><path d="M22 50H10" stroke="#9AA8C9" stroke-width="3" stroke-linecap="round"/></g></svg>`,
  bardak: `<svg viewBox="0 0 100 100"><path d="M28 18h44l-6 66a6 6 0 0 1-6 5H40a6 6 0 0 1-6-5z" fill="#EAF5FB" stroke="#B9DCEE" stroke-width="2"/><path d="M31 46c8-4 14 4 22 0s12-4 16 0l-3 37a6 6 0 0 1-6 5H40a6 6 0 0 1-6-5z" fill="#4AA6DA"/></svg>`,
  hap: `<svg viewBox="0 0 100 100"><g transform="rotate(-35 40 50)"><rect x="14" y="40" width="52" height="22" rx="11" fill="#E8A3BB"/><path d="M40 40h15a11 11 0 0 1 0 22H40z" fill="#B8577A"/></g><circle cx="72" cy="68" r="12" fill="#F2C94C"/><path d="M64 68h16" stroke="#D9A92C" stroke-width="2"/></svg>`,
  ayak: `<svg viewBox="0 0 100 100" fill="#1C8EA6"><ellipse cx="36" cy="38" rx="11" ry="16"/><ellipse cx="34" cy="64" rx="8" ry="6"/><ellipse cx="64" cy="50" rx="11" ry="16" opacity=".55"/><ellipse cx="62" cy="76" rx="8" ry="6" opacity=".55"/></svg>`,
  dambil: `<svg viewBox="0 0 100 100"><rect x="30" y="46" width="40" height="8" rx="4" fill="#9AA8C9"/><rect x="16" y="32" width="14" height="36" rx="6" fill="#27407A"/><rect x="70" y="32" width="14" height="36" rx="6" fill="#27407A"/><rect x="8" y="40" width="8" height="20" rx="4" fill="#3D5BA8"/><rect x="84" y="40" width="8" height="20" rx="4" fill="#3D5BA8"/></svg>`,
  foto: `<svg viewBox="0 0 100 100"><g transform="rotate(-8 35 50)"><rect x="10" y="22" width="44" height="56" rx="6" fill="#fff" stroke="#E0E8E4" stroke-width="2"/><rect x="15" y="27" width="34" height="38" rx="3" fill="#DCEFE7"/><circle cx="32" cy="38" r="5" fill="#9FC9B8"/><path d="M24 64c0-10 16-10 16 0z" fill="#9FC9B8"/></g><g transform="rotate(7 65 50)"><rect x="46" y="20" width="44" height="56" rx="6" fill="#fff" stroke="#E0E8E4" stroke-width="2"/><rect x="51" y="25" width="34" height="38" rx="3" fill="#CDE9DE"/><circle cx="68" cy="36" r="5" fill="#0E7C66"/><path d="M61 62c0-9 14-9 14 0z" fill="#0E7C66"/></g></svg>`,
  rapor: `<svg viewBox="0 0 100 100"><path d="M26 12h34l18 18v54a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" fill="#fff" stroke="#E0E8E4" stroke-width="2"/><path d="M60 12v18h18" fill="#EDF3F0"/><path d="M30 66l10-12 8 6 14-16" fill="none" stroke="#0E7C66" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="30" y="74" width="30" height="4" rx="2" fill="#D5E6DE"/></svg>`,
  koc: `<svg viewBox="0 0 100 100"><path d="M16 26a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H44L28 80V66h-2a10 10 0 0 1-10-10z" fill="#0F2A25"/><path d="M50 28l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#9FF0D6"/></svg>`,
  takvim: `<svg viewBox="0 0 100 100"><rect x="16" y="20" width="68" height="64" rx="12" fill="#fff" stroke="#C9D3EA" stroke-width="2"/><rect x="16" y="20" width="68" height="18" rx="12" fill="#27407A"/><rect x="16" y="30" width="68" height="8" fill="#27407A"/>${[0,1,2,3].map(i=>`<circle cx="${30+i*13}" cy="52" r="4" fill="${i<2?'#27407A':'#C9D3EA'}"/>`).join('')}<path d="M64 66l6-8 6 8" fill="none" stroke="#C27A12" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  kilit: `<svg viewBox="0 0 100 100"><rect x="22" y="44" width="56" height="42" rx="12" fill="#0E7C66"/><path d="M34 44V34a16 16 0 0 1 32 0v10" fill="none" stroke="#0E7C66" stroke-width="7"/><circle cx="50" cy="64" r="5" fill="#9FF0D6"/></svg>`
};
const ill = (k, sz) => `<span style="display:block;width:${sz}px;height:${sz}px">${IL[k]}</span>`;

/* ———— D · Mozaik: krem zemin, büyük çizimli yuvarlaklar, tek kelimelik etiketler; ortada "Ne yesem?" ———— */
const items = [['tarti', 'Kilo', '#E1F3EC'], ['kalem', 'İğne günü', '#E6EBF5'], ['bardak', 'Su', '#E4F1F8'], ['hap', 'Takviyeler', '#F7E8EE'], ['ayak', 'Adımlar', '#E1F1F4'], ['dambil', 'Kas koruma', '#E6EBF5'], ['foto', 'Fotoğraflar', '#E1F3EC'], ['takvim', 'Doz planı', '#FBF0DC'], ['koc', 'Koç', '#DDEFE7'], ['rapor', 'Doktor raporu', '#EDF3F0']];
const D = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:radial-gradient(70% 28% at 90% 0%,#E3F1EA 0%,transparent 70%),#F6F2EA;color:#0B2420}
.top{position:absolute;left:84px;right:84px;top:100px}
h1{margin:50px 0 0;font:700 96px/1.03 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#0E7C66}
.sub{margin-top:24px;font:500 34px/1.4 Figtree;color:#5F726C}
.meal{position:absolute;left:84px;right:84px;top:590px;height:450px;border-radius:52px;background:#fff;box-shadow:0 40px 80px -50px rgba(11,36,32,.45);padding:44px 48px;display:flex;gap:30px;align-items:center}
.meal .tx{flex:1}.meal .k{font:600 26px Figtree;color:#C27A12;letter-spacing:.02em}.meal h2{margin:12px 0 16px;font:700 54px/1.08 Outfit;letter-spacing:-.02em}
.meal .ch{display:flex;flex-wrap:wrap;gap:10px}.meal .ch span{background:#FBF0DC;color:#8A5A10;border-radius:99px;padding:10px 20px;font:600 24px Figtree}
.meal .pl{position:relative;width:320px;height:320px;flex:none}.meal .pl .b{position:absolute;right:-30px;bottom:-24px;width:170px;height:170px}
.grid{position:absolute;left:50px;right:50px;top:1110px;display:grid;grid-template-columns:repeat(5,1fr);gap:56px 6px}
.it{display:flex;flex-direction:column;align-items:center;gap:14px;font:600 25px Figtree;color:#0B3B33;text-align:center}
.it span.c{width:172px;height:172px;border-radius:50%;display:grid;place-items:center}
.trust{position:absolute;left:0;right:0;bottom:96px;display:flex;justify-content:center;gap:16px}
.trust span{background:#0B3B33;color:#E8FBF3;border-radius:99px;padding:16px 28px;font:600 26px Figtree}
</style></head><body><div class="s">
<div class="top">${logo('#0E7C66', '#0B3B33')}<h1>Kilo verirken<br><em>ihtiyacın olan her şey.</em></h1><div class="sub">Tartından tabağına, iğne gününden doktor kontrolüne kadar.</div></div>
<div class="meal"><div class="tx"><div class="k">Ne yesem? · Akşam için</div><h2>Tavuk şiş ve bulgur pilavı</h2><div class="ch"><span>Mercimek çorbası</span><span>Izgara köfte</span><span>Menemen</span></div></div>
<div class="pl">${ill('tabak', 300)}<span class="b">${IL.corba}</span></div></div>
<div class="grid">${items.map(([k, n, bg]) => `<div class="it"><span class="c" style="background:${bg}">${ill(k, 108)}</span>${n}</div>`).join('')}</div>
<div class="trust"><span>Hesap yok</span><span>Reklam yok</span><span>Veri telefonunda</span></div>
</div></body></html>`;

/* ———— E · Bir gün: sabahtan geceye dikey zaman çizgisi, her anda Hafif ne yapar ———— */
const day = [['tarti', 'Sabah', 'Tartıl, takviyelerini al.', '#E1F3EC'], ['tabak', 'Öğle', 'Ne yiyeceğine Hafif öneri versin.', '#FBF0DC'], ['bardak', 'Gün boyu', 'Suyunu tek dokunuşla ekle, adımların kendiliğinden gelsin.', '#E4F1F8'], ['kalem', 'İğne günü', 'Bölgeni ve doz artışını hatırlatır.', '#E6EBF5'], ['koc', 'Akşam', 'Koçun tek bir öneriyle gelir.', '#DDEFE7'], ['foto', 'Pazartesi', 'Haftanın özeti ve fotoğrafın.', '#F7F3EC']];
const E = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:linear-gradient(180deg,#0B3B33 0%,#0B3B33 34%,#F4F1EA 34%,#F4F1EA 100%);color:#0B2420}
.top{position:absolute;left:84px;right:84px;top:100px;color:#fff}
h1{margin:50px 0 0;font:700 100px/1.02 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#9FF0D6}
.sub{margin-top:24px;font:500 34px/1.4 Figtree;color:rgba(255,255,255,.72)}
.tl{position:absolute;left:84px;right:84px;top:560px;background:#fff;border-radius:56px;padding:36px 44px;box-shadow:0 50px 90px -50px rgba(11,36,32,.5)}
.tl:before{content:"";position:absolute;left:119px;top:90px;bottom:90px;width:3px;background:repeating-linear-gradient(#D5E6DE 0 10px,transparent 10px 20px)}
.r{display:flex;align-items:center;gap:30px;padding:16px 0;position:relative}
.r .c{width:150px;height:150px;border-radius:44px;display:grid;place-items:center;flex:none;position:relative;z-index:1}
.r small{display:block;font:600 24px Figtree;color:#0E7C66;letter-spacing:.04em;text-transform:uppercase}.r b{display:block;margin-top:6px;font:700 40px/1.15 Outfit;letter-spacing:-.015em}
.trust{position:absolute;left:84px;right:84px;bottom:90px;display:flex;justify-content:space-between;font:600 28px Figtree;color:#0B3B33}
.trust span:before{content:"✓ ";color:#0E7C66}
</style></head><body><div class="s">
<div class="top">${logo('#9FF0D6', '#fff')}<h1>Günün her anında,<br><em>sakin bir yardımcı.</em></h1><div class="sub">Kilo, iğne, protein, su ve daha fazlası tek yerde.</div></div>
<div class="tl">${day.map(([k, t, d, bg]) => `<div class="r"><span class="c" style="background:${bg}">${ill(k, 100)}</span><div><small>${t}</small><b>${d}</b></div></div>`).join('')}</div>
<div class="trust"><span>Hesap yok</span><span>Reklam yok</span><span>Veri telefonunda</span></div>
</div></body></html>`;

/* ———— F · Sözler: koyu, tipografik; her özellik bir cümle, büyük çizimler kenarlarda ———— */
const say = [['Tartın yerinde sayınca', 'nedenini anlatır.'], ['Akşam ne yiyeceğini', 'Türk mutfağından önerir.'], ['İğne gününü ve doz artışını', 'unutturmaz.'], ['Suyunu, adımını, takviyeni', 'tek yerde takip eder.'], ['Kaslarını ve ilerlemeni', 'egzersiz ve fotoğrafla izlersin.'], ['Doktoruna', 'tek bir rapor götürürsün.']];
const F = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:radial-gradient(60% 30% at 100% 30%,#1F8A70 0%,transparent 70%),radial-gradient(50% 25% at 0% 85%,#12524A 0%,transparent 70%),#082924;color:#fff}
.top{position:absolute;left:84px;right:84px;top:100px}
h1{margin:50px 0 0;font:700 104px/1.0 Outfit;letter-spacing:-.04em}h1 em{font-style:normal;color:#9FF0D6}
.l{position:absolute;left:84px;right:84px;top:560px;display:flex;flex-direction:column;gap:18px}
.q{display:flex;align-items:center;gap:30px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:40px;padding:22px 34px 22px 22px}
.q .c{width:120px;height:120px;border-radius:36px;background:#F6F2EA;display:grid;place-items:center;flex:none}
.q span{font:500 34px/1.25 Figtree;color:rgba(255,255,255,.75)}.q span b{display:block;font:700 42px/1.15 Outfit;color:#fff;letter-spacing:-.015em}
.trust{position:absolute;left:84px;right:84px;bottom:90px;display:flex;align-items:center;gap:22px}
.trust .k{width:90px;height:90px;flex:none}.trust div{font:500 30px/1.35 Figtree;color:rgba(255,255,255,.75)}.trust div b{color:#9FF0D6;font-weight:600}
</style></head><body><div class="s">
<div class="top">${logo('#9FF0D6', '#fff')}<h1>Hafif seninle<br><em>neler yapar?</em></h1></div>
<div class="l">${say.map(([a, b], i) => `<div class="q"><span class="c">${ill(['tarti', 'tabak', 'kalem', 'bardak', 'dambil', 'rapor'][i], 84)}</span><span>${a}<b>${b}</b></span></div>`).join('')}</div>
<div class="trust"><span class="k" style="background:#F6F2EA;border-radius:28px;display:grid;place-items:center">${ill('kilit', 64)}</span><div>Hesap yok, reklam yok. <b>Her şey yalnızca senin telefonunda.</b></div></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [ad, html] of [['D-mozaik', D], ['E-bir-gun', E], ['F-sozler', F]]) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam');
})();
