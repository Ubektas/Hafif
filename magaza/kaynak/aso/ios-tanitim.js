// App Store (iPhone 6,9") tanıtım görselleri: 1320×2868. Play'in 2. tasarımıyla aynı renkler (zümrüt #0B3B33, nane #9FF0D6, krem #F4F1EA).
// Apple ekranların "uygulamayı kullanırken" görünmesini istediği için her görselde gerçek uygulama ekranı var.
// 1) www/ yerel sunucuyla açılır, iPhone gibi davranması için Capacitor.getPlatform() "ios" döner, tests/ios-demo.js örnek hesabı kurulur.
// 2) Ham ekranlar magaza/ios/ham/ içine, tanıtım görselleri magaza/ios/ içine yazılır.
// Çalıştırma: node magaza/kaynak/aso/ios-tanitim.js [playwright modül yolu]
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/ios'), HAM = path.join(OUT, 'ham');
fs.mkdirSync(HAM, { recursive: true });
const Z = '#0B3B33', N = '#9FF0D6', K = '#F4F1EA', AC = '#0E7C66';
const W = 1320, H = 2868;

/* --- 1. Ham ekranlar (440×956 @3x = 1320×2868) --- */
const tip = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/json' };
const sunucu = () => new Promise(r => { const s = http.createServer((q, a) => { const f = path.join(ROOT, 'www', decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html')); fs.readFile(f, (e, d) => { if (e) { a.writeHead(404); return a.end(); } a.writeHead(200, { 'Content-Type': tip[path.extname(f)] || 'application/octet-stream' }); a.end(d); }); }).listen(0, '127.0.0.1', () => r(s)); });
async function hamCek(b, port) {
  const demo = fs.readFileSync(path.join(ROOT, 'tests/ios-demo.js'), 'utf8').split('/* Ekran gezintisi')[0];
  for (const koyu of [false, true]) {
    const p = await b.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, colorScheme: koyu ? 'dark' : 'light' });
    await p.addInitScript(() => { window.Capacitor = { getPlatform: () => 'ios', isNativePlatform: () => false }; });
    await p.addInitScript(demo);
    await p.goto(`http://127.0.0.1:${port}/index.html`); await p.waitForTimeout(2500);
    const cek = async n => { await p.waitForTimeout(900); await p.screenshot({ path: path.join(HAM, n + (koyu ? '-koyu' : '') + '.png') }); };
    const sekme = async t => { await p.click(`.tab[data-tab="${t}"]`); await p.evaluate(() => scrollTo(0, 0)); };
    await cek('ozet');
    if (!koyu) {
      for (const t of ['besin', 'kilo', 'igne']) { await sekme(t); await cek(t); }
      await sekme('ozet'); await p.click('#navPlus'); await cek('arti');
    }
    await p.close();
  }
}

/* --- 2. Tanıtım görselleri --- */
const head = css => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}.s{width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#0B2420;background:${K}}
.s.dk{background:radial-gradient(70% 40% at 100% 60%,#145A4C 0%,transparent 70%),${Z};color:#fff}
.t{position:absolute;left:110px;right:110px;top:150px}
.lg{display:flex;align-items:center;gap:16px;font:700 50px Outfit;letter-spacing:-.02em}.lg svg{width:58px;height:58px}
h1{margin:60px 0 0;font:700 124px/1.02 Outfit;letter-spacing:-.04em}h1 em{font-style:normal;color:${AC}}.dk h1 em{color:${N}}
.sub{margin-top:34px;font:500 46px/1.38 Figtree;color:#4E6B63}.dk .sub{color:rgba(255,255,255,.74)}
.tel{position:absolute;left:50%;top:var(--top,960px);width:1010px;margin-left:-505px;height:2300px;border-radius:150px;background:#0A1411;padding:24px;box-shadow:0 80px 140px -60px rgba(0,0,0,.55),inset 0 0 0 4px #2A3632}
.dk .tel{box-shadow:0 80px 160px -50px rgba(0,0,0,.8),inset 0 0 0 4px #3B4A45}
.ekr{position:relative;width:962px;height:2252px;border-radius:128px;overflow:hidden;background:#fff}
.ekr img{position:absolute;left:0;top:118px;width:962px}
.durum{position:absolute;left:0;right:0;top:0;height:118px;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:16px 92px 0;font:600 40px Figtree;color:#0B2420}
.durum.ak{color:#fff}.ada{position:absolute;left:50%;top:30px;width:290px;height:84px;margin-left:-145px;border-radius:50px;background:#000;z-index:3}
.ik{display:flex;gap:12px;align-items:center}.ik i{display:block;width:44px;height:26px;border:3px solid currentColor;border-radius:9px;position:relative}.ik i:after{content:"";position:absolute;inset:3px;right:9px;background:currentColor;border-radius:4px}
.ik b{display:block;width:40px;height:26px;background:linear-gradient(90deg,currentColor 0 20%,transparent 20% 27%,currentColor 27% 47%,transparent 47% 54%,currentColor 54% 74%,transparent 74% 81%,currentColor 81%);clip-path:polygon(0 100%,100% 0,100% 100%)}
.chip{position:absolute;z-index:5;background:#fff;color:#0B2420;border-radius:52px;padding:34px 42px;display:flex;align-items:center;gap:28px;box-shadow:0 50px 90px -40px rgba(11,59,51,.6)}
.chip .e{font-family:"Noto Color Emoji";font-size:76px;line-height:1}.chip small{display:block;font:600 30px Figtree;color:#5F726C}.chip b{display:block;font:700 52px Outfit;letter-spacing:-.01em}
.tag{display:inline-block;margin-top:30px;font:700 30px Figtree;letter-spacing:.12em;text-transform:uppercase;border-radius:99px;padding:14px 26px;background:rgba(159,240,214,.16);color:${N};border:2px solid rgba(159,240,214,.35)}
${css}</style></head><body><div class="s`;
const leaf = c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const ust = (dk, h, sub, ek = '') => `${dk ? ' dk' : ''}"><div class="t"><div class="lg">${leaf(dk ? N : AC)}Hafif</div><h1>${h}</h1><div class="sub">${sub}</div>${ek}</div>`;
// kay: ekran görüntüsünü yukarı kaydırır (alttaki panel görünsün diye); durum çubuğu panelin kararttığı zemin rengiyle örter
const tel = (img, koyuEkran, kay = 0) => `<div class="tel"><div class="ekr" style="background:${koyuEkran ? '#0B1714' : '#F3F6F4'}"><div class="ada"></div><div class="durum${koyuEkran ? ' ak' : ''}"${kay ? ` style="background:#909291"` : ''}><span>9:41</span><span class="ik"><b></b><i></i></span></div><img src="file://${HAM}/${img}"${kay ? ` style="top:${118 - kay}px"` : ''}></div></div>`;
const chip = (e, a, b, st) => `<div class="chip" style="${st}"><span class="e">${e}</span><div><small>${a}</small><b>${b}</b></div></div>`;
const end = `</div></body></html>`;

const G = [
  ['01-hepsi-bir-arada', head('') + ust(true, 'Kilon, iğnen, suyun<br><em>bir arada.</em>', 'Verdiğin kilo, bugünkü protein ve su, adımların ve sıradaki iğnen tek bakışta.') + tel('ozet.png') + chip('🎯', 'Hedefin', '%54 tamam', 'right:70px;top:1500px') + end],
  ['02-ne-yesem', head('') + ust(false, 'Akşam ne yesem?<br><em>Hafif söylesin.</em>', 'Kalan proteinine göre Türk mutfağından öneriler. Dokun, protein eklensin.') + tel('besin.png') + chip('🍳', 'Ne yesem?', '+19 g protein', 'left:60px;top:1720px') + end],
  ['03-igne-dongu', head('') + ust(true, 'İğne günün,<br><em>hep aklında.</em>', 'Sıradaki iğnen, döngünün evresi ve doktorunun doz planı.', '<span class="tag">İsteğe bağlı</span>') + tel('igne.png') + chip('💉', 'Sıradaki iğne', '5 gün sonra', 'right:60px;top:1960px') + end],
  ['04-kilo-yolu', head('') + ust(false, 'Yolun nereye<br><em>gidiyor, gör.</em>', 'Kilo eğrin, haftalık hızın ve bu hızla hedefe varacağın tarih.') + tel('kilo.png') + chip('📍', 'Bu hızla hedefe', 'Aralık 2026', 'right:60px;top:2020px') + end],
  ['05-hizli-kayit', head('') + ust(true, 'Üç saniyede<br><em>kaydet.</em>', '+ düğmesine dokun: kilo, iğne, protein, su, ölçü, fotoğraf ve egzersiz.') + tel('arti.png', false, 640) + end],
  ['06-widgetlar', head(`
.home{position:absolute;left:70px;right:70px;top:820px;bottom:-80px;border-radius:110px 110px 0 0;background:linear-gradient(165deg,#A9C7BC 0%,#6E9790 45%,#3F6670 100%);padding:90px 70px}
.home .g{display:grid;grid-template-columns:1fr 1fr;gap:56px 52px}
.home img{display:block;width:100%;border-radius:60px;box-shadow:0 30px 50px -24px rgba(11,40,36,.5)}
.home .wide{grid-column:1/3}.home .pano{grid-column:1/3}`) + ust(false, 'Ana ekranında,<br><em>tek bakışta.</em>', 'Pano, kilo, su ve iğne widget\'ları; uygulamayı açmadan su ekle.') +
    `<div class="home"><div class="g"><img class="pano" src="file://${ROOT}/magaza/kaynak/aso/widget-ios/pano.png"><img src="file://${ROOT}/magaza/kaynak/aso/widget-ios/su.png"><img src="file://${ROOT}/magaza/kaynak/aso/widget-ios/igne.png"><img class="wide" src="file://${ROOT}/magaza/kaynak/aso/widget-ios/bugun.png"></div></div>` + end],
  ['07-gizlilik', head(`
.ok{position:absolute;left:110px;right:110px;top:640px;display:flex;flex-wrap:wrap;gap:20px}
.ok span{font:600 36px Figtree;border-radius:99px;padding:18px 30px;background:rgba(159,240,214,.14);border:2px solid rgba(159,240,214,.3);color:#E9FFF7}
.tel{--top:900px}`) + ust(true, 'Verilerin<br><em>telefonunda kalır.</em>', '') +
    `<div class="ok"><span>Hesap yok</span><span>Reklam yok</span><span>Takip yok</span><span>İnternetsiz çalışır</span></div>` + tel('ozet-koyu.png', true) + end],
];

(async () => {
  const srv = await sunucu(); const b = await chromium.launch();
  await hamCek(b, srv.address().port); srv.close();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  for (const [ad, html] of G) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam:', G.length, 'görsel', OUT);
})();
