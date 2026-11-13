// Instagram 3. set: "yapay zeka görünümü"nden uzak, samimi gönderiler (1080×1350).
// Sahte telefon/arayüz çizimi yok: ekranlar uygulamanın kendisinden (iPhone gibi, örnek hesapla) çekilir.
// Kâğıt dokusu, bant, el yazısı (Caveat, magaza/kaynak/fonts), fiş, not defteri, mesaj gibi gündelik biçimler.
// Sayılar örnektir; gerçek kişi, fotoğraf ya da kullanıcı verisi yok.
// Çalıştırma: node magaza/kaynak/instagram-3.js [playwright modül yolu]  → magaza/instagram-3/*.png
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(ROOT, 'magaza/instagram-3'), HAM = path.join(OUT, 'ham');
fs.mkdirSync(HAM, { recursive: true });
const AC = '#0E7C66', Z = '#0B3B33', INK = '#1F2A27';

/* --- 1. Uygulamadan gerçek ekran parçaları --- */
const tip = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const sunucu = () => new Promise(r => { const s = http.createServer((q, a) => { const f = path.join(ROOT, 'www', decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html')); fs.readFile(f, (e, d) => { if (e) { a.writeHead(404); return a.end(); } a.writeHead(200, { 'Content-Type': tip[path.extname(f)] || 'application/octet-stream' }); a.end(d); }); }).listen(0, '127.0.0.1', () => r(s)); });
async function ekranlar(b, port) {
  const demo = fs.readFileSync(path.join(ROOT, 'tests/ios-demo.js'), 'utf8').split('/* Ekran gezintisi')[0];
  const p = await b.newPage({ viewport: { width: 400, height: 860 }, deviceScaleFactor: 3 });
  await p.addInitScript(() => { window.Capacitor = { getPlatform: () => 'ios', isNativePlatform: () => false }; });
  await p.addInitScript(demo);
  // son 7 güne örnek protein/su
  await p.addInitScript(() => { try { const S = JSON.parse(localStorage.getItem('doz-defteri')); const P = [96, 128, 115, 110, 72, 120], W = [2100, 2600, 2700, 1800, 2200, 2600];
    for (let i = 1; i <= 6; i++) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.toISOString().slice(0, 10); S.daily[k] = { p: P[6 - i], w: W[6 - i], log: [] }; }
    localStorage.setItem('doz-defteri', JSON.stringify(S)); } catch (e) {} });
  await p.goto(`http://127.0.0.1:${port}/index.html`); await p.waitForTimeout(2500);
  await p.screenshot({ path: path.join(HAM, 'ozet.png') });
  await p.click('.tab[data-tab="besin"]'); await p.waitForTimeout(800);
  const w = await p.$('#week'); await w.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const kart = await w.evaluateHandle(e => e.parentElement); await kart.screenshot({ path: path.join(HAM, 'hafta.png') });
  await p.close();
}

/* --- 2. Gönderiler --- */
const FONTS = `<link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
@font-face{font-family:Caveat;src:url(file://${ROOT}/magaza/kaynak/fonts/Caveat-latin.woff2) format("woff2");font-weight:400 700}
@font-face{font-family:Caveat;src:url(file://${ROOT}/magaza/kaynak/fonts/Caveat-latin-ext.woff2) format("woff2");font-weight:400 700;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1E00-1E9F}</style>`;
// kâğıt dokusu: hafif gren
const GREN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>')}")`;
const sayfa = (bg, govde, css = '') => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box}html,body{margin:0}.s{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:${INK};background:${GREN},${bg}}
.el{font-family:Caveat,cursive;font-weight:700;line-height:1}.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
.imza{position:absolute;right:64px;bottom:52px;display:flex;align-items:center;gap:10px;font:700 30px Outfit;letter-spacing:-.02em;color:${Z};opacity:.85}
.imza svg{width:32px;height:32px}
.bant{position:absolute;width:190px;height:54px;background:rgba(240,226,180,.75);box-shadow:0 2px 4px rgba(0,0,0,.08);z-index:3}
${css}</style></head><body><div class="s">${govde}</div></body></html>`;
const imza = (c = Z) => `<div class="imza" style="color:${c}"><svg viewBox="0 0 24 24" fill="none" stroke="${c === Z ? AC : c}" stroke-width="1.9" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/><path d="M9 15l6-6"/></svg>hafif</div>`;
// elle çizilmiş alt çizgi, daire, ok
const cizgi = (w, c, k = 7) => `<svg width="${w}" height="30" viewBox="0 0 ${w} 30" style="display:block"><path d="M4 18 C ${w * .25} 10, ${w * .5} 24, ${w * .75} 14 S ${w - 6} 16, ${w - 4} 12" fill="none" stroke="${c}" stroke-width="${k}" stroke-linecap="round"/></svg>`;
const daire = (w, h, c) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;overflow:visible"><path d="M${w * .52} 6 C ${w * .95} 2, ${w + 4} ${h * .45}, ${w * .9} ${h * .8} S ${w * .25} ${h + 6}, ${w * .06} ${h * .7} S ${w * .1} 4, ${w * .62} 10" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/></svg>`;
const ok = (d, c) => `<svg width="220" height="160" viewBox="0 0 220 160" style="position:absolute;overflow:visible"><path d="${d}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/></svg>`;

/* 1 · Haftanın fişi */
const fis = sayfa('#E9E2D3', `
<div class="fis"><div class="bas">HAFİF MARKET<br><small>bu haftanın fişi · 13.11</small></div>
${[['Tartı', '+0,3 kg'], ['Bel', '−1,5 cm'], ['Protein hedefi', '4 gün'], ['Su ortalaması', '1,9 L'], ['Yürüyüş', '3 gün'], ['Direnç egzersizi', '2 gün'], ['Pes etmek', '0']].map(([a, b]) => `<div class="l"><span>${a}</span><i></i><b>${b}</b></div>`).join('')}
<div class="ay"></div><div class="l t"><span>TOPLAM</span><i></i><b>iyi gidiyorsun</b></div><div class="ay"></div>
<div class="alt">tartı fişin sadece bir satırı.<br>tekrar bekleriz :)</div></div>
<div class="not el">kilo vermek<br>sadece tartıdaki<br>sayı değil.</div>${imza()}`,
`.fis{position:absolute;left:130px;top:70px;width:560px;background:#FFFEFA;padding:56px 46px 70px;font-family:"DM Mono",monospace;color:#2A2A2A;transform:rotate(-2.5deg);box-shadow:0 30px 50px -30px rgba(60,40,10,.45);
 -webkit-mask:linear-gradient(#000,#000) top/100% calc(100% - 18px) no-repeat,radial-gradient(circle 12px at 12px 100%,transparent 11px,#000 12px) bottom left/24px 18px repeat-x}
.bas{text-align:center;font:500 34px "DM Mono";letter-spacing:.12em;margin-bottom:34px}.bas small{display:block;margin-top:10px;font-size:20px;letter-spacing:.04em;color:#777}
.l{display:flex;align-items:baseline;gap:10px;font-size:26px;margin:14px 0}.l i{flex:1;border-bottom:3px dotted #bbb}.l b{font-weight:500}
.t{font-size:28px;font-weight:500}.t b{color:${AC}}.ay{border-top:3px dashed #999;margin:24px 0}
.alt{text-align:center;margin-top:30px;font-size:20px;line-height:1.6;color:#777}
.not{position:absolute;right:70px;bottom:190px;font-size:84px;color:${Z};transform:rotate(-4deg);text-align:right}`);

/* 2 · Düz metin (tweet gibi) */
const duz = sayfa('#DCEBE3', `
<div class="kart"><div class="ust"><span class="av">${'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>'}</span><div><b>hafif</b><small>kilo · protein · iğne günlüğü</small></div></div>
<p>tartı: +0,4<br>mezura: −1,5 cm<br>en dar kot pantolon: bol geldi<br><br>ben: tartıya bu hafta küsmüyorum</p>
<div class="alt"><span>09:12 · 13 Kas</span></div></div>`,
`.kart{position:absolute;left:80px;right:80px;top:50%;transform:translateY(-52%);background:#fff;border-radius:36px;padding:60px 64px 46px;box-shadow:0 30px 60px -40px rgba(11,59,51,.35)}
.ust{display:flex;align-items:center;gap:22px}.av{width:92px;height:92px;border-radius:50%;background:${AC};display:grid;place-items:center}.av svg{width:50px;height:50px}
.ust b{display:block;font:700 36px Figtree}.ust small{font:500 26px Figtree;color:#7A8783}
p{margin:44px 0 0;font:500 56px/1.32 Figtree;letter-spacing:-.01em}.alt{margin-top:46px;padding-top:26px;border-top:2px solid #EEF2F0;font:500 26px Figtree;color:#7A8783}`);

/* 3 · Not defteri listesi */
const madde = [[1, 'sabah ilk iş 1 bardak su'], [1, 'kahvaltıda 2 yumurta'], [1, 'öğlen 10 dk yürüyüş'], [0, 'akşam önce protein, sonra gerisi'], [1, 'takviyeler (magnezyum, D)'], [0, 'pazartesi: tartı + mezura'], [0, 'pazar sabahı iğne günü']];
const notlar = sayfa('#FBF8F0', `
<div class="nb"><div class="tar">13 Kasım 2026 · 08:41</div><h2>küçük adımlar listem</h2>
${madde.map(([d, t]) => `<div class="m ${d ? 'd' : ''}"><i>${d ? '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</i><span>${t}</span></div>`).join('')}
</div><div class="el yaz">hepsi<br>sayılır.</div>${cizgiPos()}${imza()}`,
`.nb{position:absolute;left:84px;right:84px;top:90px}.tar{font:500 26px Figtree;color:#A39E8F;text-align:center}
h2{margin:30px 0 30px;font:700 64px Figtree;letter-spacing:-.02em}
.m{display:flex;align-items:center;gap:26px;padding:20px 0;border-bottom:1.5px solid #ECE6D6;font:500 40px Figtree}
.m i{width:52px;height:52px;border-radius:50%;border:3px solid #C9C2B0;flex:none;display:grid;place-items:center}.m.d i{background:#E5A93A;border-color:#E5A93A}.m i svg{width:34px;height:34px}
.m.d span{color:#A39E8F;text-decoration:line-through;text-decoration-color:#C9C2B0}
.yaz{position:absolute;right:110px;bottom:150px;font-size:110px;color:${AC};transform:rotate(-6deg)}`);
function cizgiPos() { return `<div style="position:absolute;right:96px;bottom:128px;transform:rotate(-6deg)">${cizgi(300, '#E5A93A', 8)}</div>`; }

/* 4 · Defter sayfası + bantlı gerçek ekran */
const defter = sayfa('#F7F4EC', `
<div class="kag"></div>
<div class="bas el">bu haftanın özeti ✏︎</div>
<div class="ss"><span class="bant" style="left:-40px;top:-18px;transform:rotate(-14deg)"></span><span class="bant" style="right:-40px;top:-14px;transform:rotate(12deg)"></span><img src="file://${HAM}/hafta.png"></div>
<div class="el n1">protein hedefim<br>4 gün tamam ✓</div>
<div class="el n2">pazartesi biraz<br>kaçtı, olsun.</div>
${ok('M10 20 C 60 10, 120 30, 160 90 M160 90 l-10 -36 M160 90 l-34 -10', AC).replace('style="', 'style="left:610px;top:900px;')}
${imza()}`,
`.kag{position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 66px,#D5DEE8 66px 68px);opacity:.8}.kag:before{content:"";position:absolute;left:120px;top:0;bottom:0;width:3px;background:#EDB6AE}
.bas{position:absolute;left:150px;top:96px;font-size:88px;color:${Z}}
.ss{position:absolute;left:150px;right:90px;top:250px;transform:rotate(1.5deg);background:#fff;padding:18px;border-radius:14px;box-shadow:0 26px 44px -26px rgba(0,0,0,.35)}.ss img{display:block;width:100%;border-radius:8px}
.n1{position:absolute;left:150px;top:880px;font-size:72px;color:${AC};transform:rotate(-3deg)}
.n2{position:absolute;right:120px;top:1060px;font-size:60px;color:#8A8A8A;transform:rotate(3deg);text-align:right}`);

/* 5 · Gerçek ekran üzerine el yazısı notlar */
const notlu = sayfa('#F1EDE3', `
<div class="el bas">kilo vermek<br>sadece tartıdaki<br>sayı değil.</div>
<div class="ss"><img src="file://${HAM}/ozet.png"></div>
<div style="position:absolute;left:478px;top:452px">${daire(300, 150, '#E0623A')}</div>
<div class="el n1">tartı bunu<br>söylüyor →</div>
<div style="position:absolute;left:478px;top:770px">${daire(520, 190, AC)}</div>
<div class="el n2">ama bunlar<br>da sayılır →</div><div class="el n3">protein, su,<br>adım, takviye</div>
${imza()}`,
`.bas{position:absolute;left:70px;top:70px;font-size:74px;color:${Z};transform:rotate(-2deg)}
.ss{position:absolute;left:490px;top:300px;width:500px;height:1120px;border-radius:44px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(0,0,0,.4);transform:rotate(2deg);border:10px solid #fff}.ss img{width:100%;display:block}
.n1{position:absolute;left:80px;top:520px;font-size:66px;color:#E0623A;transform:rotate(-4deg)}
.n2{position:absolute;left:80px;top:790px;font-size:66px;color:${AC};transform:rotate(-3deg)}
.n3{position:absolute;left:96px;top:960px;font-size:50px;color:#6E7D78;transform:rotate(-3deg)}`);

/* 6 · Arkadaşla mesajlaşma */
const msj = [[0, 'bu hafta kaç verdin?'], [1, 'tartıya göre 0,3 😅'], [1, 'ama belim 1,5 cm incelmiş'], [0, 'o zaman gidiyor demek 👏'], [1, 'evet, ikisini yan yana görünce ben de rahatladım'], [0, 'hangi uygulama o?'], [1, 'hafif 🌿']];
const mesaj = sayfa('#ECEFEE', `
<div class="ust"><div class="av el">S</div><b>Selin</b><small>şimdi</small></div>
<div class="ch">${msj.map(([b, t]) => `<div class="m ${b ? 'b' : ''}">${t.replace(/(\p{Extended_Pictographic})/gu, '<span class="e">$1</span>')}</div>`).join('')}</div>
<div class="el alt">tartı her şeyi söylemiyor.</div>${imza()}`,
`.ust{position:absolute;left:0;right:0;top:0;height:170px;background:rgba(255,255,255,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-bottom:1px solid #DCE1DF}
.ust .av{width:70px;height:70px;border-radius:50%;background:#B9C9C3;color:#fff;display:grid;place-items:center;font-size:48px}.ust b{font:600 26px Figtree}.ust small{display:none}
.ch{position:absolute;left:56px;right:56px;top:220px;display:flex;flex-direction:column;gap:16px}
.m{max-width:74%;align-self:flex-start;background:#fff;border-radius:36px 36px 36px 10px;padding:22px 32px;font:500 38px/1.3 Figtree}.m .e{font-size:36px}
.m.b{align-self:flex-end;background:${AC};color:#fff;border-radius:36px 36px 10px 36px}
.alt{position:absolute;left:70px;bottom:130px;font-size:74px;color:${Z};transform:rotate(-3deg)}`);

const SET = [['01-fis', fis], ['02-duz-metin', duz], ['03-not-listesi', notlar], ['04-defter', defter], ['05-ekran-notlu', notlu], ['06-mesaj', mesaj]];
(async () => {
  const srv = await sunucu(); const b = await chromium.launch();
  await ekranlar(b, srv.address().port); srv.close();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [ad, html] of SET) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, `${ad}.png`) }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam', SET.length);
})();
