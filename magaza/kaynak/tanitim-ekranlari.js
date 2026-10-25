// Play Store tanıtım ekranları: başlık + telefon çerçevesinde ekran görüntüsü + öne çıkan bilgi kartı.
// Önce ekran-goruntuleri.js çalıştırılır (magaza/ekran/*.png), sonra bu betik magaza/tanitim/*.png üretir.
// Çalıştırma: node magaza/kaynak/tanitim-ekranlari.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/tanitim');
fs.mkdirSync(OUT, { recursive: true });

// Uygulamanın kendi sekme ikonları
const html = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8');
const ikon = t => '<svg width="100%" height="100%"' + html.match(new RegExp(`data-tab="${t}"[^>]*><svg(.*?)</svg>`))[1] + '</svg>';
const KILIT = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2"/></svg>';
const svgI = d => `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const KISI = svgI('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M4 4l16 16"/>');
const REKLAMYOK = svgI('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M8 15l2-6 2 6M8.7 13h2.6M15 9v6h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/><path d="M3 3l18 18"/>');
const WIFIYOK = svgI('<path d="M5 12.5a10 10 0 0 1 3.2-2M12 9a10 10 0 0 1 7 3.5M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/><path d="M3 3l18 18"/>');
const YEDEK = svgI('<path d="M12 3v11M7.5 9.5 12 14l4.5-4.5"/><path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/>');
const ADIMI = svgI('<path d="M8.5 3.5c1.6 0 2.5 1.6 2.5 3.8S10 11 8.6 11 6 9.5 6 7.3s.9-3.8 2.5-3.8zM6.6 13h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/><path d="M15.5 7.5c1.6 0 2.5 1.6 2.5 3.8S17 15 15.6 15 13 13.5 13 11.3s.9-3.8 2.5-3.8zM13.6 17h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/>');
const NABIZ = svgI('<path d="M3 12h4l2-5 4 10 2-5h6"/>');
const RAPOR = svgI('<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 17v-3M12 17v-5M15 17v-2"/>');
const KOC = svgI('<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>');
const AY = svgI('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>');
const ROZET = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.8 7 21l5-2.6L17 21l-1.5-7.2"/></svg>';

// Her özelliğin rengi uygulamadaki rengiyle aynı
const R = {
  kilo: { ana: '#0E7C66', koyu: '#0B3B33', acik: '#E1F3EC', zemin: ['#E6F4EE', '#CDEBDF'] },
  igne: { ana: '#3552B0', koyu: '#1C2B66', acik: '#E8EDFA', zemin: ['#EDF1FB', '#D5DEF6'] },
  rozet: { ana: '#B8892A', koyu: '#5C4210', acik: '#FBF1DC', zemin: ['#FBF5E6', '#F2E3BF'] },
  takviye: { ana: '#7B5BD0', koyu: '#3A2378', acik: '#EEE9FB', zemin: ['#F2EEFC', '#DFD6F6'] },
  su: { ana: '#2C8FE0', koyu: '#123F66', acik: '#E7F3F6', zemin: ['#EAF4FB', '#CFE6F5'] },
  adim: { ana: '#E0507A', koyu: '#7A1F3C', acik: '#FCE8EF', zemin: ['#FDEFF3', '#F8D3DF'] },
};

const EKRANLAR = [
  { ad: '01-kilo', renk: 'kilo', ikon: ikon('kilo'), etiket: 'Kilo takibi', baslik: ['Her tartı', 'bir adım.'], alt: 'Verdiğin kiloyu, hızını ve hedefe kalan yolu gör; her eşikte bir rozet kazan.', ekran: '01-ozet.png', kart: ['Yeni rozet', '%5 vücut ağırlığı'], kartIkon: ROZET, kartRenk: 'rozet', kartYer: 'sag' },
  { ad: '02-koc', renk: 'kilo', ikon: KOC, etiket: 'Kişisel koç', baslik: ['Seni tanıyan', 'bir koç.'], alt: 'Kayıtlarına bakar, doğru anda tek bir öneri verir. Hepsi telefonunda hesaplanır; hiçbir veri dışarı çıkmaz.', ekran: '16-koc.png', kart: ['Son 9 iğnene göre', 'Sana özel öneri'], kartIkon: NABIZ, kartRenk: 'igne', kartYer: 'sag', kartTop: 1640 },
  { ad: '03-igne', renk: 'igne', ikon: ikon('igne'), etiket: 'İğne takibi · isteğe bağlı', baslik: ['Haftanı', 'tanı.'], alt: 'Döngünün evresini, sıradaki iğneni ve kaleminde kaç doz kaldığını hep bil.', plus: 1, ekran: '02-dongu.png', kart: ['Kalemde kalan', '2 doz'], kartYer: 'sol', kartTop: 1720 },
  { ad: '04-yan-etki', renk: 'igne', ikon: NABIZ, etiket: 'Yan etki günlüğü', baslik: ['Yan etkilerini', 'öngör.'], alt: 'Belirtilerini kaydet; iğneden sonraki hangi günlerde yoğunlaştığını gör.', ekran: '11-yan-etkiler.png', kart: ['En yoğun gün', 'İğneden 1 gün sonra'], kartYer: 'sag', kartTop: 1760 },
  { ad: '05-rapor', renk: 'kilo', ikon: RAPOR, etiket: 'Doktor raporu', baslik: ['Kontrole', 'hazır git.'], alt: 'Kilo, doz, yan etkiler ve vücut ölçülerin tek PDF raporda; doktoruna telefondan göster.', plus: 1, sayfalar: ['rapor-1.png', 'rapor-2.png'], kart: ['Bel çevresi', '−9 cm'], kartYer: 'sol', kartTop: 1640 },
  { ad: '06-protein-su', renk: 'su', ikon: ikon('besin'), etiket: 'Protein ve su', baslik: ['Protein ve su', 'hep hedefte.'], alt: 'Protein ve su takibi tek ekranda: yediklerin hedefini doldurur, suyu tek dokunuşla eklersin.', ekran: '07-protein-su.png', kart: ['Bugün', '74 g · 1.750 ml'], kartYer: 'sol' },
];

const yaziCSS = `@font-face{font-family:"Outfit";src:url(../../www/fonts/Outfit-700-latin.woff2) format("woff2");font-weight:700;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}`;

const kartH = (e, r) => { const k = e.kartRenk ? R[e.kartRenk] : r; return `<div class="kart ${e.kartYer}"${e.kartTop ? ` style="top:${e.kartTop}px"` : ''}><span class="ki" style="background:${k.acik};color:${k.ana}">${e.kartIkon || e.ikon}</span><div><small>${e.kart[0]}</small><b>${e.kart[1]}</b></div></div>`; };
function sayfa(e) {
  const r = R[e.renk];
  const telefon = e.ekran ? `
    <div class="tel"><div class="cam"></div>
      <div class="durum"><span>14:20</span><span class="ik"><i></i><i></i><b></b></span></div>
      <img src="../ekran/${e.ekran}">
    </div>
    ${kartH(e, r)}` : e.sayfalar ? `
    <div class="pdf p2"><img src="../ekran/${e.sayfalar[1]}"></div><div class="pdf p1"><img src="../ekran/${e.sayfalar[0]}"></div>
    <div class="pdfetk"><b>PDF</b>hafif-rapor.pdf · 3 sayfa</div>
    ${kartH(e, r)}` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../www/fonts/fonts.css"><style>
  html,body{margin:0}
  .s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:${r.koyu};
     background:radial-gradient(110% 60% at 100% 0%,${r.zemin[1]} 0%,transparent 60%),radial-gradient(90% 50% at 0% 100%,${r.zemin[1]} 0%,transparent 65%),${r.zemin[0]}}
  .s::before{content:"";position:absolute;right:-220px;top:300px;width:760px;height:760px;border-radius:50%;border:2px dashed ${r.ana}22}
  .ust{position:absolute;left:84px;right:84px;top:118px}
  .etk{display:inline-flex;align-items:center;gap:14px;background:#fff;border-radius:99px;padding:12px 26px 12px 14px;font:700 30px Figtree;color:${r.ana};box-shadow:0 10px 30px -18px ${r.koyu}66}
  .etk i{width:44px;height:44px;border-radius:50%;background:${r.acik};display:grid;place-items:center;padding:9px;box-sizing:border-box}
  h1{margin:40px 0 0;font:700 108px/1 "Outfit";letter-spacing:-.02em;color:${r.koyu}}
  h1 em{font-style:normal;color:${r.ana}}
  p{margin:30px 0 0;font:500 36px/1.38 Figtree;color:${r.koyu}B3;max-width:860px}
  .tel{position:absolute;left:50%;top:${e.ekran ? 800 : 0}px;width:740px;height:1520px;margin-left:-370px;background:#0B2420;border-radius:96px;padding:22px;box-sizing:border-box;box-shadow:0 60px 120px -50px ${r.koyu}AA,0 0 0 2px #2A4A43 inset}
  .tel img{display:block;width:100%;border-radius:0 0 4px 4px}
  .durum{height:58px;background:#F1F5F3;border-radius:74px 74px 0 0;display:flex;justify-content:space-between;align-items:center;padding:6px 64px 0;font:600 24px Figtree;color:#0B2420}
  .ik{display:flex;gap:10px;align-items:center}.ik i{width:26px;height:16px;border-radius:3px;background:#0B2420;opacity:.85}.ik i:first-child{border-radius:50% 50% 2px 2px}.ik b{width:34px;height:16px;border-radius:4px;border:2px solid #0B2420;box-sizing:border-box}
  .cam{position:absolute;left:50%;top:38px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:#0B2420;z-index:2}
  .kart{position:absolute;top:1560px;display:flex;align-items:center;gap:22px;background:#fff;border-radius:34px;padding:26px 36px 26px 26px;box-shadow:0 40px 80px -30px ${r.koyu}88,0 2px 6px ${r.koyu}14;z-index:3}
  .kart.sag{right:46px;transform:rotate(3deg)}.kart.sol{left:46px;transform:rotate(-3deg)}
  .kart .ki{width:84px;height:84px;border-radius:24px;padding:20px;box-sizing:border-box;display:block}
  .kart small{display:block;font:600 26px Figtree;color:${r.koyu}99}
  .kart b{display:block;font:700 54px "Outfit";letter-spacing:-.015em;color:${r.koyu};white-space:nowrap}
  .pdf{position:absolute;width:760px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 50px 100px -40px ${r.koyu}AA,0 0 0 1px ${r.koyu}14}
  .pdf img{display:block;width:100%}
  .pdf.p1{left:70px;top:760px;transform:rotate(-4deg);z-index:2}.pdf.p2{left:330px;top:840px;transform:rotate(5deg)}
  .pdfetk{position:absolute;right:70px;top:700px;z-index:4;display:flex;align-items:center;gap:14px;background:${r.koyu};color:#fff;border-radius:99px;padding:14px 28px 14px 14px;font:600 26px Figtree;transform:rotate(3deg)}
  .pdfetk b{background:#3552B0;border-radius:99px;padding:6px 16px;font:700 24px Figtree}
  .pl{display:inline-block;margin-left:14px;vertical-align:middle;background:#0B3B33;color:#9FF0D6;border-radius:99px;padding:12px 22px;font:700 26px Figtree;letter-spacing:.06em}
  .gz{position:absolute;left:84px;right:84px;top:720px;display:flex;flex-direction:column;gap:26px}
  .gz div{display:flex;align-items:center;gap:30px;background:#fff;border-radius:40px;padding:36px 40px;box-shadow:0 30px 60px -36px ${r.koyu}77}
  .gz i{flex:none;width:96px;height:96px;border-radius:28px;background:${r.acik};color:${r.ana};padding:22px;box-sizing:border-box}
  .gz b{display:block;font:700 46px "Outfit";letter-spacing:-.02em}
  .gz span{display:block;font:500 30px Figtree;color:${r.koyu}AA;margin-top:4px}
  </style></head><body><div class="s">
  <div class="ust"><span class="etk"><i>${e.ikon}</i>${e.etiket}</span>${e.plus ? '<span class="pl">✦ Plus</span>' : ''}
    <h1>${e.baslik[0]}<br><em>${e.baslik[1]}</em></h1><p>${e.alt}</p></div>
  ${telefon}${e.gz || ''}
  </div></body></html>`;
}

// Son ekran: gizlilik
EKRANLAR.push({
  ad: '08-gizlilik', renk: 'kilo', ikon: KILIT, etiket: 'Gizlilik', baslik: ['Verilerin', 'sende kalır.'],
  alt: 'Hafif senin kişisel defterin; kimse okumaz, kimseyle paylaşılmaz.',
  gz: `<div class="gz">
    <div><i>${KISI}</i><span><b>Hesap yok</b><span>Kayıt olmadan hemen başla.</span></span></div>
    <div><i>${REKLAMYOK}</i><span><b>Reklam ve takip yok</b><span>Verilerin hiçbir sunucuya gitmez.</span></span></div>
    <div><i>${WIFIYOK}</i><span><b>İnternetsiz çalışır</b><span>Her şey telefonunda saklanır.</span></span></div>
    <div><i>${YEDEK}</i><span><b>Yedekle, taşı</b><span>Android yedeğiyle yeni telefonuna geçer.</span></span></div>
    <div><i>${AY}</i><span><b>Açık ya da koyu</b><span>Gece gözünü yormayan koyu tema.</span></span></div>
  </div>`
});

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const e of EKRANLAR) {
    const f = path.join(__dirname, `_${e.ad}.html`);
    fs.writeFileSync(f, sayfa(e));
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, e.ad + '.png') });
    fs.unlinkSync(f);
  }
  await b.close();
  console.log(EKRANLAR.length + ' tanıtım ekranı: ' + OUT);
})();
