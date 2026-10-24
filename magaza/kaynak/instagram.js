// Instagram'ın ilk 3 gönderisi (kaydırmalı, 1080x1350).
// Önce ekran-goruntuleri.js çalıştırılmış olmalı (magaza/ekran/*.png).
// Çalıştırma: node magaza/kaynak/instagram.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/instagram');
fs.mkdirSync(OUT, { recursive: true });

const R = {
  kilo: { ana: '#0E7C66', koyu: '#0B3B33', acik: '#E1F3EC', zemin: ['#E6F4EE', '#CDEBDF'] },
  igne: { ana: '#3552B0', koyu: '#1C2B66', acik: '#E8EDFA', zemin: ['#EDF1FB', '#D5DEF6'] },
  su: { ana: '#2C8FE0', koyu: '#123F66', acik: '#E7F3F6', zemin: ['#EAF4FB', '#CFE6F5'] },
  adim: { ana: '#E0507A', koyu: '#7A1F3C', acik: '#FCE8EF', zemin: ['#FDEFF3', '#F8D3DF'] },
  rozet: { ana: '#B8892A', koyu: '#5C4210', acik: '#FBF1DC', zemin: ['#FBF5E6', '#F2E3BF'] },
};
const YAPRAK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/><path d="M9 14l5-5"/></svg>';
const svgI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  kisi: svgI('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M4 4l16 16"/>'),
  reklam: svgI('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M8 15l2-6 2 6M8.7 13h2.6M15 9v6h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/><path d="M3 3l18 18"/>'),
  telefon: svgI('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  su: svgI('<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>'),
  tuz: svgI('<path d="M8 9h8l-1 11H9z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M11 13h.01M13 15h.01M11 17h.01"/>'),
  saat: svgI('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  ay: svgI('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  kas: svgI('<path d="M4 14c2-1 3-4 5-6s5-2 6 0-1 4-3 4"/><path d="M4 14c3 5 12 6 16 1 0-3-2-5-5-5"/>'),
  tabak: svgI('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>'),
  tarti: svgI('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 12"/>'),
  grafik: svgI('<path d="M4 19h16"/><path d="M5 15l4-4 3 2 6-6"/>'),
};

const CSS = r => `
html,body{margin:0}
.s{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:${r.koyu};box-sizing:border-box;
  background:radial-gradient(100% 60% at 100% 0%,${r.zemin[1]} 0%,transparent 60%),radial-gradient(90% 55% at 0% 100%,${r.zemin[1]} 0%,transparent 65%),${r.zemin[0]}}
.s.koyu{color:#fff;background:radial-gradient(90% 70% at 85% 0%,#1F8A70 0%,transparent 60%),linear-gradient(160deg,#0D4237,#051D18)}
.bar{position:absolute;left:80px;right:80px;top:64px;display:flex;justify-content:space-between;align-items:center;font:700 30px "Outfit";letter-spacing:-.01em}
.bar .m{display:flex;align-items:center;gap:12px}.bar svg{width:34px;height:34px;color:${r.ana}}.koyu .bar svg{color:#9FF0D6}
.bar .no{font:600 24px Figtree;opacity:.55;letter-spacing:.04em}
.ust{position:absolute;left:80px;right:80px;top:170px}
.etk{display:inline-flex;align-items:center;gap:12px;background:#fff;border-radius:99px;padding:10px 24px;font:700 26px Figtree;color:${r.ana};box-shadow:0 10px 30px -18px ${r.koyu}66}
h1{margin:30px 0 0;font:700 96px/1.02 "Outfit";letter-spacing:-.02em}
h1 em{font-style:normal;color:${r.ana}}.koyu h1 em{color:#9FF0D6}
p{margin:26px 0 0;font:500 34px/1.4 Figtree;opacity:.75;max-width:880px}
.tel{position:absolute;left:50%;width:600px;height:1232px;margin-left:-300px;background:#0B2420;border-radius:80px;padding:18px;box-sizing:border-box;box-shadow:0 50px 100px -40px ${r.koyu}AA,0 0 0 2px #2A4A43 inset;overflow:hidden}
.tel img{display:block;width:100%;border-radius:62px 62px 0 0}
.kart{position:absolute;display:flex;align-items:center;gap:20px;background:#fff;color:${r.koyu};border-radius:30px;padding:22px 32px 22px 22px;box-shadow:0 36px 70px -28px ${r.koyu}88;z-index:3}
.kart i{width:76px;height:76px;border-radius:22px;padding:18px;box-sizing:border-box;background:${r.acik};color:${r.ana};display:block}
.kart small{display:block;font:600 24px Figtree;opacity:.6}.kart b{display:block;font:700 48px "Outfit";letter-spacing:-.01em;white-space:nowrap}
.liste{position:absolute;left:80px;right:80px;display:flex;flex-direction:column;gap:22px}
.liste div{display:flex;align-items:center;gap:28px;background:#fff;color:${r.koyu};border-radius:36px;padding:30px 36px;box-shadow:0 26px 54px -34px ${r.koyu}77}
.liste i{flex:none;width:88px;height:88px;border-radius:26px;background:${r.acik};color:${r.ana};padding:20px;box-sizing:border-box}
.liste b{display:block;font:700 40px "Outfit";letter-spacing:-.01em}.liste span span{display:block;font:500 28px/1.35 Figtree;opacity:.7;margin-top:4px}
.not{position:absolute;left:80px;right:80px;bottom:56px;font:500 22px/1.4 Figtree;opacity:.55}
.kaydir{position:absolute;right:80px;bottom:60px;display:flex;align-items:center;gap:12px;font:700 26px Figtree;opacity:.8}
.kaydir svg{width:34px;height:34px}
`;
const OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const bar = (no, top) => `<div class="bar"><span class="m">${YAPRAK}Hafif</span><span class="no">${no}</span></div>`;
const tel = (img, top, ofs = 0) => `<div class="tel" style="top:${top}px"><img src="../ekran/${img}" style="margin-top:${-ofs}px"></div>`;
const kart = (ic, a, b, css) => `<div class="kart" style="${css}"><i>${ic}</i><div><small>${a}</small><b>${b}</b></div></div>`;
const liste = (top, rows) => `<div class="liste" style="top:${top}px">${rows.map(([ic, b, s]) => `<div><i>${ic}</i><span><b>${b}</b><span>${s}</span></span></div>`).join('')}</div>`;
const kaydir = t => `<div class="kaydir">${t}${OK}</div>`;

// Uygulamanın gerçek evre metinleri (www/index.html → PHASES)
const app = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
const PHASES = eval(app.match(/const PHASES=(\[[\s\S]*?\n\]);/)[1]);

const NOT_IGNE = 'Genel bilgilendirmedir, tıbbi tavsiye değildir. İlacın ve dozun için doktorunun önerisine uy.';
const POSTS = [];

// 1) Tanışma
POSTS.push({ ad: '1-tanisma', slaytlar: [
  { r: 'kilo', koyu: 1, html: `${bar('')}
    <div class="ust" style="top:250px"><img src="ikon.png" style="width:150px;height:150px;border-radius:38px;box-shadow:0 30px 60px -20px #000A">
      <h1 style="font-size:124px;margin-top:56px">Kilo vermenin<br><em>en hafif yolu.</em></h1>
      <p style="opacity:.8">Kilo, iğne, protein, su ve takviyelerin tek sade uygulamada. Hesap yok, reklam yok.</p></div>
    <div style="position:absolute;left:80px;right:80px;top:960px;display:flex;flex-wrap:wrap;gap:16px">${['Kilo', 'İğne', 'Yan etki', 'Protein', 'Su', 'Takviye', 'Adım'].map(t => `<span style="border:2px solid #9FF0D655;color:#DDF7EE;border-radius:99px;padding:14px 30px;font:600 30px Figtree">${t}</span>`).join('')}</div>
    <div class="kaydir" style="color:#9FF0D6;opacity:1">Kaydır, tanış${OK}</div>
    <div class="not" style="right:400px">Şimdi Google Play'de</div>` },
  { r: 'kilo', html: `${bar('2/5')}<div class="ust"><span class="etk">Kilo takibi</span><h1>Her tartı<br><em>bir adım.</em></h1></div>
    ${tel('01-ozet.png', 560)}${kart(I.grafik, 'İlk günden bu yana', '−7,2 kg', 'left:60px;top:1010px;transform:rotate(-3deg)')}` },
  { r: 'igne', html: `${bar('3/5')}<div class="ust"><span class="etk">İğne takibi · isteğe bağlı</span><h1>Haftanı<br><em>tanı.</em></h1></div>
    ${tel('02-dongu.png', 560)}${kart(I.saat, 'Sıradaki iğne', '4 gün sonra', 'right:60px;top:1000px;transform:rotate(3deg)')}` },
  { r: 'su', html: `${bar('4/5')}<div class="ust"><span class="etk">Protein ve su</span><h1>Az yerken de<br><em>eksik kalma.</em></h1></div>
    ${tel('07-protein-su.png', 560)}${kart(I.su, 'Bugün', '74 g · 1.750 ml', 'left:60px;top:1020px;transform:rotate(-3deg)')}` },
  { r: 'kilo', html: `${bar('5/5')}<div class="ust"><h1 style="margin-top:0">Verilerin<br><em>sende kalır.</em></h1></div>
    ${liste(480, [[I.kisi, 'Hesap yok', 'Kayıt olmadan hemen başla.'], [I.reklam, 'Reklam ve takip yok', 'Hiçbir veri sunucuya gitmez.'], [I.telefon, 'Her şey telefonunda', 'İnternetsiz çalışır, yedeğinle taşınır.']])}
    <div style="position:absolute;left:80px;right:80px;bottom:80px;display:flex;align-items:center;gap:26px;background:#0B3B33;color:#fff;border-radius:36px;padding:30px 36px">
      <img src="ikon.png" style="width:96px;height:96px;border-radius:24px"><div><b style="display:block;font:700 40px Outfit">Google Play'de ücretsiz</b><span style="font:500 28px Figtree;opacity:.75">“Hafif” diye ara · bağlantı profilde</span></div></div>` },
]});

// 2) İğne haftasının 6 evresi
const evreS = (i) => { const p = PHASES[i];
  const nokta = PHASES.map((_, k) => `<i style="flex:1;height:14px;border-radius:9px;background:${k === i ? '#3552B0' : k < i ? '#A9B8F0' : '#D5DEF6'}"></i>`).join('');
  return { r: 'igne', html: `${bar((i + 2) + '/8')}
    <div class="ust"><div style="display:flex;gap:10px;margin-bottom:46px">${nokta}</div>
      <span class="etk">Evre ${i + 1} / 6</span><h1 style="font-size:120px">${p.k}</h1>
      <p style="font-size:40px;opacity:.85">${p.txt}</p></div>
    <div style="position:absolute;left:80px;right:80px;bottom:80px"><div style="font:700 26px Figtree;letter-spacing:.08em;color:#3552B0;margin-bottom:18px">BU EVREDE İŞE YARAYABİLİR</div>
    ${p.tips.slice(0, 2).map(t => `<div style="display:flex;gap:22px;align-items:flex-start;background:#fff;border-radius:30px;padding:26px 32px;margin-top:16px;box-shadow:0 26px 54px -34px #1C2B6677"><i style="flex:none;width:20px;height:20px;border-radius:50%;background:#3552B0;margin-top:14px"></i><span style="font:600 34px/1.4 Figtree">${t}</span></div>`).join('')}</div>` };
};
POSTS.push({ ad: '2-igne-haftasi', slaytlar: [
  { r: 'igne', html: `${bar('1/8')}<div class="ust" style="top:240px"><span class="etk">Haftalık iğne kullananlar için</span>
      <h1 style="font-size:132px">İğne haftanın<br><em>6 evresi.</em></h1>
      <p>İştahın, enerjin ve yan etkiler hafta boyunca neden değişiyor? Gün gün anlatıyoruz.</p></div>
    <div style="position:absolute;left:80px;right:80px;top:920px;display:flex;gap:14px">${PHASES.map((p, k) => `<div style="flex:1;text-align:center"><div style="height:${[90, 150, 210, 170, 120, 80][k]}px;margin-top:${210 - [90, 150, 210, 170, 120, 80][k]}px;border-radius:24px;background:${['#B9C6EE', '#7D94E6', '#3552B0', '#5A73C8', '#9FB1EA', '#D3DCF5'][k]}"></div><div style="font:600 22px Figtree;margin-top:14px;opacity:.75">${p.k}</div></div>`).join('')}</div>
    ${kaydir('Kaydır')}<div class="not" style="right:300px">${NOT_IGNE}</div>` },
  ...PHASES.map((_, i) => evreS(i)),
  { r: 'igne', html: `${bar('8/8')}<div class="ust"><h1 style="margin-top:0">Hangi evrede<br><em>olduğunu bil.</em></h1>
      <p>Hafif son iğnene göre bugünün evresini ve sıradaki iğneni gösterir.</p></div>
    ${tel('06-igneler.png', 640)}` },
]});

// günlük tartı (zikzak) ve haftalık gidiş (yumuşak çizgi)
const GUN = [92.4, 91.6, 92.2, 91.9, 91.1, 91.7, 91.3, 90.6, 91.2, 90.8, 90.1, 90.7, 90.2, 89.6];
const grafik = (top, h = 330) => { const W = 920, x = i => 20 + i * (W - 40) / (GUN.length - 1), y = v => 20 + (92.6 - v) / 3.2 * (h - 40);
  const ort = GUN.map((_, i) => { const a = GUN.slice(Math.max(0, i - 3), i + 4); return a.reduce((s, v) => s + v, 0) / a.length; });
  return `<div style="position:absolute;left:80px;top:${top}px;width:${W}px;background:#fff;border-radius:36px;box-shadow:0 26px 54px -34px #5C421077;padding:26px 0 18px">
    <div style="display:flex;gap:30px;padding:0 34px 6px;font:600 24px Figtree"><span style="color:#B8892A">● günlük tartı</span><span style="color:#0E7C66">━ haftalık gidiş</span></div>
    <svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}"><polyline points="${GUN.map((v, i) => x(i) + ',' + y(v)).join(' ')}" fill="none" stroke="#E9CF95" stroke-width="4"/>
    ${GUN.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="9" fill="#B8892A"/>`).join('')}
    <polyline points="${ort.map((v, i) => x(i) + ',' + y(v)).join(' ')}" fill="none" stroke="#0E7C66" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`; };

// 3) Tartı neden her gün değişir?
POSTS.push({ ad: '3-tarti', slaytlar: [
  { r: 'rozet', html: `${bar('1/4')}<div class="ust" style="top:250px"><span class="etk">Tartı günlüğü</span>
      <h1 style="font-size:124px">Dün −0,8.<br>Bugün +0,6.<br><em>Panik yok.</em></h1>
      <p>Tartıdaki günlük oynamaların çoğu yağ değil. Peki ne?</p></div>${grafik(880, 250)}${kaydir('Kaydır')}` },
  { r: 'rozet', html: `${bar('2/4')}<div class="ust"><h1 style="margin-top:0">Günlük farkın<br><em>sık nedenleri</em></h1></div>
    ${liste(420, [[I.su, 'Su', 'Ne kadar içtiğin ve terlediğin.'], [I.tuz, 'Tuz ve karbonhidrat', 'Vücut bir süre fazladan su tutar.'], [I.tabak, 'Sindirim', 'Midende ve bağırsaklarında olan.'], [I.ay, 'Hormonlar ve uyku', 'Döngü, stres ve az uyku.']])}` },
  { r: 'rozet', html: `${bar('3/4')}<div class="ust"><h1 style="margin-top:0">Ne yapmalı?</h1></div>
    ${grafik(880, 260)}${liste(300, [[I.saat, 'Aynı saatte tartıl', 'Sabah, tuvaletten sonra, kahvaltıdan önce.'], [I.tarti, 'Değişmese de kaydet', 'Her tartı eğriyi daha doğru yapar.'], [I.grafik, 'Gün değil hafta', 'Tek güne değil, haftalık gidişe bak.']])}` },
  { r: 'kilo', html: `${bar('4/4')}<div class="ust"><h1 style="margin-top:0">Gidişini<br><em>tek bakışta gör.</em></h1>
      <p>Hafif her tartını eğriye ekler; haftalık hızını ve hedefe kalan yolu gösterir.</p></div>
    ${tel('05-kilo.png', 660)}${kart(I.grafik, 'Haftalık hız', '−0,9 kg', 'right:60px;top:1060px;transform:rotate(3deg)')}` },
]});

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const f = path.join(__dirname, '_ig.html');
  for (const post of POSTS) for (const [i, sl] of post.slaytlar.entries()) {
    const r = R[sl.r];
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../www/fonts/fonts.css"><style>${CSS(r)}</style></head><body><div class="s${sl.koyu ? ' koyu' : ''}">${sl.html}</div></body></html>`);
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, `${post.ad}-${String(i + 1).padStart(2, '0')}.png`) });
  }
  fs.unlinkSync(f);
  await b.close();
  console.log('Instagram gönderileri:', OUT);
})();
