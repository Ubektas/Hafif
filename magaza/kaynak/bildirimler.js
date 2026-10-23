// Hatırlatıcı bildirimlerinin görselleri (tasarım önizlemesi).
// Çıktı: magaza/bildirim/*.png (tek tek, şeffaf zemin), kilit-ekrani.png ve magaza/tanitim/09-hatirlatici.png
// Çalıştırma: node magaza/kaynak/bildirimler.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/bildirim');
fs.mkdirSync(OUT, { recursive: true });

const BILDIRIMLER = [
  { ad: '01-igne-gunu', zaman: 'şimdi', baslik: 'Bugün iğne günü', metin: '5 mg · önerilen bölge: Uyluk sol. Yaptıktan sonra kaydetmeyi unutma.', butonlar: ['İğneyi kaydet', '1 saat ertele'], renk: '#E2643D' },
  { ad: '02-igne-yarin', zaman: '20:00', baslik: 'Yarın iğne günü', metin: 'Saat 09:00 · sıradaki bölgen Uyluk sol. Kalemini ve iğne ucunu hazırla.', butonlar: ['Tamam'], renk: '#E2643D' },
  { ad: '03-takviye', zaman: '08:00', baslik: 'Sabah takviyeleri', metin: 'Magnezyum · D3 vitamini', butonlar: ['Hepsini aldım', 'Ertele'], renk: '#7B5BD0' },
  { ad: '04-su', zaman: '15:00', baslik: 'Bir bardak su?', metin: 'Bugün 1.250 ml içtin, hedefe 1.250 ml kaldı.', butonlar: ['+250 ml', '+500 ml'], renk: '#2C8FE0' },
  { ad: '05-protein', zaman: '18:30', baslik: 'Protein hedefine az kaldı', metin: '74 / 110 g. Akşam yemeğinde 36 g protein hedefini tamamlar.', butonlar: ['Protein ekle'], renk: '#D08A1E' },
  { ad: '06-tarti', zaman: '07:30', baslik: 'Haftalık tartı zamanı', metin: 'Sabah, aç karnına ve aynı saatte tartılmak en tutarlı sonucu verir.', butonlar: ['Kilo gir'], renk: '#0E7C66' },
  { ad: '07-rozet-yakin', zaman: '09:10', baslik: '90 kg\'ın altına çok az kaldı', metin: 'Sadece 1,2 kg. Yeni rozetin yolda, devam!', butonlar: ['Rozetlerim'], renk: '#B8892A' },
  { ad: '08-rozet-kazanildi', zaman: '09:12', baslik: 'Yeni rozet: %5 vücut ağırlığı', metin: 'Başlangıçtan bu yana 4,9 kg verdin. Tebrikler!', butonlar: ['Paylaş', 'Rozetlerim'], renk: '#B8892A' },
];

const ikon = 'file://' + path.join(ROOT, 'assets/icon-only.png');
const kart = (b, gen = 920) => `
  <div class="bd" style="width:${gen}px">
    <div class="bh"><img src="${ikon}"><span>Hafif</span><i>•</i><span>${b.zaman}</span><svg viewBox="0 0 24 24" width="28" height="28"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
    <div class="bg"><b>${b.baslik}</b><p>${b.metin}</p></div>
    <div class="bb">${b.butonlar.map(t => `<span style="color:${b.renk}">${t}</span>`).join('')}</div>
  </div>`;

const CSS = `
  html,body{margin:0;background:transparent}
  .bd{box-sizing:border-box;background:#F6F8F7;border-radius:44px;padding:30px 36px 26px;font-family:Figtree,sans-serif;color:#0B2420;box-shadow:0 24px 50px -28px rgba(5,29,24,.45)}
  .bh{display:flex;align-items:center;gap:12px;font:500 26px Figtree;color:#5F726C}
  .bh img{width:40px;height:40px;border-radius:50%}
  .bh span:first-of-type{color:#0B3B33;font-weight:600}
  .bh i{font-style:normal;opacity:.6}
  .bh svg{margin-left:auto;color:#5F726C}
  .bg{margin-top:18px}
  .bg b{display:block;font:700 34px Figtree;letter-spacing:-.01em}
  .bg p{margin:8px 0 0;font:500 30px/1.38 Figtree;color:#3D524C}
  .bb{display:flex;gap:44px;margin-top:22px;font:700 28px Figtree}`;

const sayfa = govde => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>${CSS}</style></head><body>${govde}</body></html>`;

// Kilit ekranı: Hafif'in zümrüt tonlarında duvar kâğıdı + üst üste bildirimler
const kilit = (liste, olcek = 1) => `
  <div class="tel" style="transform:scale(${olcek});transform-origin:top center">
    <div class="ekr">
      <div class="dur"><span>08:00</span><span class="ik"><i></i><i></i><b></b></span></div>
      <div class="saat">08:00</div><div class="tarih">Cuma, 23 Ekim</div>
      <div class="yigin">${liste.map(b => kart(b, 640)).join('')}</div>
    </div><div class="cam"></div>
  </div>`;
const KILIT_CSS = `
  .tel{position:relative;width:740px;height:1520px;background:#0B2420;border-radius:96px;padding:22px;box-sizing:border-box;box-shadow:0 60px 120px -50px rgba(8,41,36,.8),0 0 0 2px #2A4A43 inset}
  .ekr{height:100%;border-radius:76px;overflow:hidden;background:radial-gradient(90% 60% at 80% 10%,#1F8A70 0%,transparent 60%),radial-gradient(80% 50% at 10% 90%,#126B58 0%,transparent 60%),linear-gradient(170deg,#0B3B33,#062520);padding:0 28px;box-sizing:border-box;color:#fff}
  .cam{position:absolute;left:50%;top:40px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:#0B2420}
  .dur{height:64px;display:flex;justify-content:space-between;align-items:center;padding:8px 40px 0;font:600 24px Figtree}
  .ik{display:flex;gap:10px;align-items:center}.ik i{width:26px;height:16px;border-radius:3px;background:#fff;opacity:.9}.ik i:first-child{border-radius:50% 50% 2px 2px}.ik b{width:34px;height:16px;border-radius:4px;border:2px solid #fff;box-sizing:border-box}
  .saat{text-align:center;margin-top:70px;font:700 190px/1 "Bricolage Grotesque";letter-spacing:-.05em}
  .tarih{text-align:center;font:500 32px Figtree;opacity:.8;margin-top:6px}
  .yigin{display:flex;flex-direction:column;gap:14px;margin-top:70px;align-items:center}
  .yigin .bd{background:rgba(246,248,247,.94);padding:24px 28px 20px;border-radius:36px}
  .yigin .bh{font-size:21px}.yigin .bh img{width:32px;height:32px}.yigin .bg b{font-size:27px}.yigin .bg p{font-size:24px}.yigin .bb{font-size:23px;margin-top:16px;gap:34px}`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 600 }, deviceScaleFactor: 1 });
  // Yerel font ve ikonlara erişebilmesi için sayfa dosyadan açılır
  const TMP = path.join(__dirname, '_bildirim.html');
  p.setContent = async h => { fs.writeFileSync(TMP, h); await p.goto('file://' + TMP); };
  // 1) Tek tek bildirimler (şeffaf zemin)
  for (const n of BILDIRIMLER) {
    await p.setContent(sayfa(`<div style="padding:40px">${kart(n)}</div>`));
    await p.evaluate(() => document.fonts.ready);
    const el = await p.$('body > div');
    await el.screenshot({ path: path.join(OUT, n.ad + '.png'), omitBackground: true });
  }
  // 2) Kilit ekranı (tek başına)
  const secili = [BILDIRIMLER[0], BILDIRIMLER[2], BILDIRIMLER[3], BILDIRIMLER[7]];
  await p.setViewportSize({ width: 820, height: 1600 });
  await p.setContent(sayfa(`<style>${KILIT_CSS}</style><div style="padding:40px">${kilit(secili)}</div>`));
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('body > div')).screenshot({ path: path.join(OUT, 'kilit-ekrani.png'), omitBackground: true });
  // 3) Tanıtım ekranı: Hatırlatıcılar
  const z = { ana: '#0E7C66', koyu: '#0B3B33', acik: '#E1F3EC', z0: '#E6F4EE', z1: '#CDEBDF' };
  const zil = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>';
  await p.setViewportSize({ width: 1080, height: 1920 });
  await p.setContent(sayfa(`<style>${KILIT_CSS}
    .s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree;color:${z.koyu};background:radial-gradient(110% 60% at 100% 0%,${z.z1} 0%,transparent 60%),radial-gradient(90% 50% at 0% 100%,${z.z1} 0%,transparent 65%),${z.z0}}
    .ust{position:absolute;left:84px;right:84px;top:118px}
    .etk{display:inline-flex;align-items:center;gap:14px;background:#fff;border-radius:99px;padding:12px 26px 12px 14px;font:700 30px Figtree;color:${z.ana};box-shadow:0 10px 30px -18px ${z.koyu}66}
    .etk i{width:44px;height:44px;border-radius:50%;background:${z.acik};display:grid;place-items:center;padding:9px;box-sizing:border-box}
    h1{margin:40px 0 0;font:700 108px/1 "Bricolage Grotesque";letter-spacing:-.045em}h1 em{font-style:normal;color:${z.ana}}
    p.alt{margin:30px 0 0;font:500 36px/1.38 Figtree;color:${z.koyu}B3;max-width:860px}
    .tw{position:absolute;left:50%;top:760px;margin-left:-370px}</style>
    <div class="s"><div class="ust"><span class="etk"><i>${zil}</i>Hatırlatıcılar</span>
      <h1>Hiçbir şeyi<br><em>unutma.</em></h1><p class="alt">İğne günü, takviyeler, su ve tartı; hepsi zamanında, internetsiz.</p></div>
      <div class="tw">${kilit(secili)}</div></div>`));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(ROOT, 'magaza/tanitim/09-hatirlatici.png') });
  fs.unlinkSync(TMP);
  await b.close();
  console.log('bildirim görselleri: ' + OUT);
})();
