// Play Store ekran görüntüleri: örnek (uydurma) verilerle, 1080x1920.
// Çalıştırma: node magaza/kaynak/ekran-goruntuleri.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/ekran');
const BUGUN = '2026-10-23';

function ornekVeri() {
  const d0 = new Date(2026, 7, 25); // 25 Ağustos
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const gun = n => { const d = new Date(d0); d.setDate(d.getDate() + n); return iso(d); };
  const SITES = ['Karın sol', 'Karın sağ', 'Uyluk sol', 'Uyluk sağ', 'Kol sol', 'Kol sağ'];
  const shots = [], weights = [], daily = {};
  for (let i = 0; i < 9; i++) shots.push({ id: 's' + i, date: gun(i * 7), time: '09:00', dose: i < 4 ? '2,5' : '5', site: SITES[i % 6], note: null });
  const ofs = [0, 2, 4, 7, 9, 11, 14, 16, 18, 21, 24, 28, 30, 33, 35, 38, 42, 45, 49, 52, 56, 59];
  ofs.forEach((n, i) => { const k = 98.4 - 8.9 * (1 - Math.exp(-n / 34)) + [0, .3, -.2, .1, .2, -.1][i % 6]; weights.push({ id: 'w' + i, date: gun(n), kg: Math.round(k * 10) / 10, fat: Math.round((34.2 - 3.4 * n / 59) * 10) / 10, note: null, t: i }); });
  const t = Date.UTC(2026, 9, 22, 21, 0); // 23 Ekim 00:00, İstanbul
  for (let n = 1; n <= 7; n++) { const d = new Date(2026, 9, 23 - n); daily[iso(d)] = { p: [96, 104, 88, 112, 99, 107, 92][n - 1], w: [2250, 2500, 2000, 2750, 2500, 2250, 2500][n - 1], log: [] }; }
  daily[BUGUN] = { p: 74, w: 1750, log: [[t + 8.4 * 36e5, 'p', 6, 'yumurta'], [t + 8.5 * 36e5, 'p', 6, 'yumurta'], [t + 8.6 * 36e5, 'p', 7, 'peynir'], [t + 13 * 36e5, 'p', 31, 'tavuk'], [t + 16 * 36e5, 'p', 15, 'yogurt'], [t + 17 * 36e5, 'p', 9, null], [t + 8 * 36e5, 'w', 500], [t + 11 * 36e5, 'w', 250], [t + 13.2 * 36e5, 'w', 500], [t + 15 * 36e5, 'w', 500]] };
  const sides = {};
  for (let i = 0; i < 9; i++) { const k = i % 3; sides[gun(i * 7 + 1)] = { bulanti: i < 4 ? 2 : 1, ...(k ? { yorgun: 1 } : {}) }; sides[gun(i * 7 + 2)] = { bulanti: 1, ...(k === 1 ? { reflu: 1 } : {}) }; if (i % 2 === 0 || i === 8) sides[gun(i * 7 + 3)] = { kabiz: 1 }; }
  const meas = [{ id: 'm1', date: gun(0), bel: 108, kalca: 121, gogus: 112, kol: 37.5, uyluk: 66 }, { id: 'm2', date: gun(28), bel: 103.5, kalca: 118, gogus: 109, kol: 36, uyluk: 64 }, { id: 'm3', date: gun(57), bel: 99, kalca: 115.5, gogus: 106.5, kol: 35, uyluk: 62.5 }];
  const supps = [
    { id: 'mg', name: 'Magnezyum', slot: 'sabah', days: [0, 1, 2, 3, 4, 5, 6], shape: 'caps', color: '#4F8FDB' },
    { id: 'd3', name: 'D3 vitamini', slot: 'sabah', days: [1, 3, 5], shape: 'soft', color: '#F2C94C' },
    { id: 'om', name: 'Omega-3', slot: 'aksam', days: [0, 1, 2, 3, 4, 5, 6], shape: 'oval', color: '#E9D59A' },
    { id: 'b12', name: 'B12', slot: 'sabah', days: [1, 4], shape: 'tab', color: '#F1B3C3' },
    { id: 'mgn', name: 'Magnezyum (gece)', slot: 'gece', days: [0, 1, 2, 3, 4, 5, 6], shape: 'caps', color: '#7A52D6' }];
  return {
    profile: { onboarded: true, usesShots: true, disclaimer: gun(0), age: 42, sex: 'k', penSize: 4, penLeft: 2, drug: null, startWeight: 98.4, goalWeight: 80, heightCm: 172, intervalDays: 7, proteinGoal: 110, waterGoal: 2500, noCelebrate: true },
    weights, shots, daily, sides, meas, supps, suppTimes: { sabah: '08:00', aksam: '19:00', gece: '22:30' },
    suppLog: { [BUGUN]: { mg: t + 8.1 * 36e5, d3: t + 8.15 * 36e5 } },
    hc: { on: true, last: t + 14.3 * 36e5, wFrom: BUGUN }
  };
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2.6667, isMobile: true, hasTouch: true, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
  await ctx.addInitScript(([veri, bugun]) => {
    localStorage.setItem('doz-defteri', JSON.stringify(veri));
    const T = new Date(bugun + 'T14:20:00+03:00').getTime(), D = Date, off = T - D.now();
    class FD extends D { constructor(...a) { super(...(a.length ? a : [D.now() + off])); } static now() { return D.now() + off; } }
    window.Date = FD;
    // Örnek Health Connect: adım sayar ekranları için (yalnızca görsel üretimi)
    const gun = n => { const d = new FD(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; };
    const GUNLUK = [8240, 10450, 4120, 9180, 5630, 9870, 7340, 8810, 11020, 6150, 9460, 7980, 10230, 5210];
    const SAAT = [0, 0, 0, 0, 0, 0, 0, 420, 1650, 820, 380, 290, 1240, 560, 260, 300, 120, 0, 0, 0, 0, 0, 0, 0];
    window.Capacitor = { isNativePlatform: () => true, addListener: () => {}, Plugins: { App: {}, Health: {
      isAvailable: async () => ({ available: true }),
      requestAuthorization: async o => ({ readAuthorized: o.read }),
      readSamples: async () => ({ samples: [] }),
      queryAggregated: async o => o.bucket === 'hour'
        ? { samples: SAAT.map((v, i) => ({ startDate: new FD(gun(0).getTime() + i * 36e5).toISOString(), value: v })) }
        : { samples: [...Array(30)].map((_, i) => ({ startDate: gun(29 - i).toISOString(), value: i === 29 ? 6240 : GUNLUK[i % GUNLUK.length] })) }
    } } };
  }, [ornekVeri(), BUGUN]);
  const p = await ctx.newPage();
  await p.goto('file://' + path.join(ROOT, 'www/index.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  let n = 0;
  const shot = async ad => { await p.waitForTimeout(1600); await p.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${ad}.png` }); };
  const tab = async t => { await p.click(`.tab[data-tab="${t}"]`); await p.evaluate(() => scrollTo(0, 0)); };
  const kaydir = async sel => p.evaluate(s => { const e = document.querySelector(s); if (e) scrollTo(0, e.getBoundingClientRect().top + scrollY - 12); }, sel);
  await shot('ozet');
  await kaydir('#cycWrap'); await shot('dongu');
  await kaydir('.mscard'); await shot('basarilar');
  await p.click('[data-go="basari"]'); await p.evaluate(() => scrollTo(0, 0)); await shot('rozetler');
  await tab('kilo'); await shot('kilo');
  await tab('igne'); await shot('igneler');
  await tab('besin'); await shot('protein-su');
  await tab('takviye'); await shot('takviyeler');
  await tab('ozet'); await kaydir('.stcard'); await shot('adim-kart');
  await p.click('.stcard'); await p.waitForTimeout(800); await p.evaluate(() => scrollTo(0, 0)); await shot('adimlar');
  await tab('igne'); await kaydir('#seCard'); await shot('yan-etkiler');
  await kaydir('.pencard'); await shot('kalem');
  await tab('kilo'); await kaydir('.mgrid'); await p.evaluate(() => scrollBy(0, -150)); await shot('olculer');
  await p.click('#gearBtn'); await p.waitForTimeout(400); await p.click('[data-theme-set="dark"]'); await tab('ozet'); await shot('karanlik-ozet');
  await tab('igne'); await kaydir('#seCard'); await shot('karanlik-yan-etkiler');
  await b.close();
})();
