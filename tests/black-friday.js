// Black Friday 2026 testi (tarayıcıda, www/index.html): sahte Capacitor (yerel bildirim) ve sahte mağaza (cordova-plugin-purchase)
// ile kampanya öncesi / içi / sonrası, abone, satın alma, izin yok ve bildirime dokunma durumlarını dener.
// Çalıştırma: node tests/black-friday.js [playwright modül yolu]   → çıkış kodu 0 ise hepsi geçti; ekran görüntüleri $OUT (varsayılan geçici klasör)/bf-*.png
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), OUT = process.env.OUT || path.join(require('os').tmpdir(), 'hafif-bf');
fs.mkdirSync(OUT, { recursive: true });
// Uygulama kodu kapalı bir fonksiyonun içinde: testte iç fonksiyonlara erişmek için www/index.html'in geçici kopyasına küçük bir kanca eklenir
const KOPYA = path.join(require('os').tmpdir(), 'hafif-bf-test.html');
{ const h = fs.readFileSync(path.join(ROOT, 'www/index.html'), 'utf8'), son = h.lastIndexOf('})();');
  if (son < 0) throw new Error('www/index.html beklenen yapıda değil');
  fs.writeFileSync(KOPYA, h.slice(0, son) + 'window.__hf={openPaywall,closePaywall,render,bfBildirim,get S(){return S},setTab(t){tab=t},setPw(k){pwSel=k}};\n' + h.slice(son)); }
const URL = 'file://' + KOPYA;
let gecen = 0, kalan = 0;
const ok = (ad, kosul, detay) => { kosul ? gecen++ : kalan++; console.log(kosul ? '✓' : '✗', ad, detay !== undefined && !kosul ? '→ ' + JSON.stringify(detay) : ''); };

// Örnek hesap: kurulum bitmiş, 7 günlük ücretsiz dönemi bitmiş (since 30 gün önce)
const hesap = gun => {
  const d = n => { const x = new Date(gun); x.setDate(x.getDate() - n); return x.toISOString().slice(0, 10); };
  return { profile: { startWeight: 96, goalWeight: 82, heightCm: 176, intervalDays: 7, onboarded: true, disclaimer: d(30), since: d(30), proteinGoal: 110, waterGoal: 2500, stepGoal: 7500, theme: 'sys', noCelebrate: true, trialEndSeen: d(20), remHide: 1 },
    weights: [{ id: 'w1', date: d(20), kg: 95, t: 1 }, { id: 'w2', date: d(1), kg: 91, t: 2 }], shots: [], daily: {}, steps: {} };
};

// Sahte eklentiler sayfa yüklenmeden önce kurulur
function sahte({ izin, abone, yillik, tema }) {
  const pend = new Map(); window.__bf = { schedule: 0, requestPerm: 0, cancel: [] };
  const LN = {
    registerActionTypes: async () => ({}),
    checkPermissions: async () => ({ display: izin }),
    requestPermissions: async () => { window.__bf.requestPerm++; return { display: izin }; },
    getPending: async () => ({ notifications: [...pend.values()] }),
    schedule: async ({ notifications }) => { window.__bf.schedule += notifications.length; notifications.forEach(n => pend.set(+n.id, n)); return { notifications }; },
    cancel: async ({ notifications }) => { notifications.forEach(n => { window.__bf.cancel.push(+n.id); pend.delete(+n.id); }); },
  };
  window.__pend = pend; window.__listeners = {};
  window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: { LocalNotifications: LN },
    addListener: (p, ev, fn) => { window.__listeners[ev] = fn; return { remove() {} }; } };
  // mağaza
  const faz = (micros, per) => ({ price: '₺' + (micros / 1e6).toLocaleString('tr-TR', { minimumFractionDigits: 2 }), priceMicros: micros, currency: 'TRY', billingPeriod: per, paymentMode: 'PayAsYouGo' });
  const urun = { id: 'hafif_plus', offers: [
    { id: 'hafif_plus@aylik', pricingPhases: [faz(99990000, 'P1M')], order: async () => undefined },
    { id: 'hafif_plus@uc-aylik', pricingPhases: [faz(249990000, 'P3M')], order: async () => undefined },
    { id: 'hafif_plus@yillik', pricingPhases: [faz(yillik, 'P1Y')], order: async () => undefined }] };
  let owned = !!abone; const h = {};
  const zincir = { approved(f) { h.approved = f; return zincir; }, verified(f) { return zincir; }, receiptUpdated(f) { h.receipt = f; return zincir; }, productUpdated(f) { return zincir; }, finished(f) { return zincir; } };
  window.CdvPurchase = { Platform: { GOOGLE_PLAY: 'android-playstore', APPLE_APPSTORE: 'ios-appstore' }, ProductType: { PAID_SUBSCRIPTION: 'paid subscription' }, ErrorCode: { PAYMENT_CANCELLED: 6777006 },
    store: { register() {}, when: () => zincir, initialize: async () => [], update: async () => {}, error() {}, get: id => id === 'hafif_plus' ? urun : null, owned: () => owned, restorePurchases: async () => {} } };
  window.__satinAl = () => { owned = true; h.receipt && h.receipt(); };
  if (abone) localStorage.setItem('hf-plus', '1');
  if (tema) localStorage.setItem('hf-theme-test', tema);
}

async function ac(b, { zaman, izin = 'granted', abone = false, yillik = 299990000, tema = 'light', gizli } = {}) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: tema });
  const p = await ctx.newPage();
  const hatalar = []; p.on('pageerror', e => hatalar.push(e.message));
  await p.clock.setFixedTime(new Date(zaman));
  await p.addInitScript(([S, o, g]) => {
    if (!localStorage.getItem('doz-defteri')) localStorage.setItem('doz-defteri', JSON.stringify(S));
    if (g) localStorage.setItem('hf-bf-x', g);
  }, [hesap(zaman), null, gizli]);
  await p.addInitScript(sahte, { izin, abone, yillik, tema });
  await p.goto(URL); await p.waitForSelector('#view');
  await p.evaluate(() => document.dispatchEvent(new Event('deviceready')));
  await p.waitForTimeout(700);
  return { p, ctx, hatalar };
}
const band = p => p.$('.bfband');
const bekleyen = p => p.evaluate(() => [...window.__pend.keys()].sort());

(async () => {
  const b = await chromium.launch();

  // 1) Kampanya öncesi (26 Kasım öğlen): bant ve etiket yok; iki bildirim kurulur, tekrar açılışta çift olmaz
  { const { p, ctx, hatalar } = await ac(b, { zaman: '2026-11-26T12:00:00' });
    ok('öncesi: bant yok', !(await band(p)));
    await p.evaluate(() => __hf.openPaywall('test')); await p.waitForTimeout(200);
    ok('öncesi: ödeme ekranında etiket yok', !(await p.$('.bfetk')));
    ok('öncesi: üstü çizili fiyat yok', !(await p.$('.bfold')));
    await p.evaluate(() => __hf.closePaywall());
    ok('öncesi: iki bildirim kuruldu (9950, 9951)', JSON.stringify(await bekleyen(p)) === '[9950,9951]', await bekleyen(p));
    for (let i = 0; i < 3; i++) { await p.evaluate(() => { __hf.bfBildirim(); document.dispatchEvent(new Event('visibilitychange')); }); await p.waitForTimeout(300); }
    const n = await p.evaluate(() => window.__bf.schedule);
    ok('öncesi: yeniden açılışlarda tekrar kurulmuyor (toplam 2 kurulum)', n === 2, n);
    ok('öncesi: bildirim izni istenmedi', (await p.evaluate(() => window.__bf.requestPerm)) === 0);
    const bd = await p.evaluate(() => [...window.__pend.values()].map(x => [x.id, new Date(x.schedule.at).toString().slice(0, 21), x.title]));
    ok('öncesi: bildirim saatleri 27 Kas 20:00 ve 30 Kas 20:00', bd[0][1].includes('Nov 27 2026 20:00') && bd[1][1].includes('Nov 30 2026 20:00'), bd);
    ok('öncesi: sayfa hatası yok', !hatalar.length, hatalar); await ctx.close(); }

  // 2) Kampanya içi (28 Kasım), mağaza fiyatı 299,99
  { const { p, ctx, hatalar } = await ac(b, { zaman: '2026-11-28T10:00:00' });
    const bt = await p.evaluate(() => { const e = document.querySelector('.bfband'); return e && e.innerText.replace(/\s+/g, ' ').trim(); });
    ok('içi: bant görünüyor', !!bt && bt.includes('Black Friday: Plus yıllık %40 indirimli') && bt.includes("30 Kasım'a kadar"), bt);
    await p.screenshot({ path: path.join(OUT, 'bf-ozet-acik.png') });
    await p.evaluate(() => { __hf.setPw('aylik'); });
    await p.click('.bfband .bft'); await p.waitForTimeout(300);
    ok('içi: banda dokununca ödeme ekranı açılıyor', !!(await p.$('#paywall')));
    ok('içi: yıllık plan seçili', (await p.getAttribute('[data-pw="yillik"]', 'aria-checked')) === 'true');
    ok('içi: "Black Friday · %40" etiketi var', ((await p.textContent('.bfetk')) || '').includes('Black Friday · %40'));
    ok('içi: yıllıkta üstü çizili 499,99 ₺ var', ((await p.textContent('[data-pw="yillik"] .bfold')) || '') === '499,99 ₺');
    ok('içi: aylık ve 3 aylıkta üstü çizili yok', (await p.$$('.bfold')).length === 1);
    const tas = await p.textContent('[data-pw="yillik"] small');
    ok('içi: yıllık "%75 tasarruf" (299,99 / 12 / 99,99)', tas.trim() === '%75 tasarruf', tas);
    const fy = await p.textContent('[data-pw="yillik"] .pr b');
    ok('içi: fiyat mağazadan (299,99)', fy.includes('299,99'), fy);
    await p.screenshot({ path: path.join(OUT, 'bf-odeme.png') });
    await p.click('#pwX');
    ok('içi: 27 Kas 20:00 geçmiş, yalnızca 30 Kas bildirimi kurulu', JSON.stringify(await bekleyen(p)) === '[9951]', await bekleyen(p));
    // × ile kapat: bugün görünmez
    await p.click('.bfband .bfx'); await p.waitForTimeout(100);
    ok('içi: × ile kapanıyor', !(await band(p)));
    await p.evaluate(() => { __hf.setTab('kilo'); __hf.render(); __hf.setTab('ozet'); __hf.render(); });
    ok('içi: aynı gün yeniden çizimde görünmüyor', !(await band(p)));
    ok('içi: sayfa hatası yok', !hatalar.length, hatalar); await ctx.close(); }

  // 2b) Ertesi gün (dün kapatılmış) bant geri gelir
  { const { p, ctx } = await ac(b, { zaman: '2026-11-29T09:00:00', gizli: '2026-11-28' });
    ok('içi: ertesi gün bant geri geliyor', !!(await band(p))); await ctx.close(); }

  // 2c) Son dakika (30 Kasım 23:59) açık, 1 Aralık 00:00 kapalı
  { const { p, ctx } = await ac(b, { zaman: '2026-11-30T23:59:30' }); ok('sınır: 30 Kas 23:59 bant var', !!(await band(p))); await ctx.close(); }
  { const { p, ctx } = await ac(b, { zaman: '2026-11-27T00:00:00' }); ok('sınır: 27 Kas 00:00 bant var', !!(await band(p))); await ctx.close(); }
  { const { p, ctx } = await ac(b, { zaman: '2026-11-26T23:59:59' }); ok('sınır: 26 Kas 23:59:59 bant yok', !(await band(p))); await ctx.close(); }

  // 3) Kampanya içi ama mağaza fiyatı henüz 499,99: sahte indirim yok
  { const { p, ctx } = await ac(b, { zaman: '2026-11-28T10:00:00', yillik: 499990000 });
    await p.evaluate(() => __hf.openPaywall('test')); await p.waitForTimeout(200);
    ok('fiyat değişmemiş: üstü çizili fiyat yok', !(await p.$('.bfold')));
    ok('fiyat değişmemiş: etiket var (kampanya sürüyor)', !!(await p.$('.bfetk'))); await ctx.close(); }

  // 4) Kampanya sonrası (1 Aralık): hiçbir şey yok, bekleyen bildirimler iptal
  { const { p, ctx, hatalar } = await ac(b, { zaman: '2026-12-01T09:00:00' });
    ok('sonrası: bant yok', !(await band(p)));
    await p.evaluate(() => __hf.openPaywall('test')); await p.waitForTimeout(200);
    ok('sonrası: etiket yok', !(await p.$('.bfetk')));
    ok('sonrası: üstü çizili fiyat yok (mağaza fiyatı düşük kalsa bile)', !(await p.$('.bfold')));
    ok('sonrası: bildirim kurulmadı, 9950/9951 iptal edildi', (await bekleyen(p)).length === 0 && (await p.evaluate(() => window.__bf.cancel.includes(9951))));
    ok('sonrası: sayfa hatası yok', !hatalar.length, hatalar); await ctx.close(); }

  // 5) Plus abonesi, kampanya içinde: bant, etiket, bildirim yok
  { const { p, ctx } = await ac(b, { zaman: '2026-11-28T10:00:00', abone: true });
    ok('abone: bant yok', !(await band(p)));
    await p.evaluate(() => __hf.openPaywall('test')); await p.waitForTimeout(200);
    ok('abone: ödeme ekranı açılmıyor (etiket yok)', !(await p.$('#paywall')) && !(await p.$('.bfetk')));
    ok('abone: bildirim kurulmadı', (await bekleyen(p)).length === 0 && (await p.evaluate(() => window.__bf.schedule)) === 0); await ctx.close(); }

  // 6) Satın alma: bildirimler iptal, bant kalkar
  { const { p, ctx } = await ac(b, { zaman: '2026-11-26T12:00:00' });
    ok('satın alma öncesi: 2 bildirim', (await bekleyen(p)).length === 2);
    await p.evaluate(() => window.__satinAl()); await p.waitForTimeout(400);
    ok('satın alma sonrası: bildirimler iptal', (await bekleyen(p)).length === 0, await bekleyen(p)); await ctx.close(); }
  { const { p, ctx } = await ac(b, { zaman: '2026-11-28T10:00:00' });
    await p.evaluate(() => window.__satinAl()); await p.waitForTimeout(400);
    ok('satın alma (kampanya içi): bant kalkıyor', !(await band(p))); await ctx.close(); }

  // 7) Bildirim izni yok: sorulmuyor, kurulmuyor
  { const { p, ctx } = await ac(b, { zaman: '2026-11-26T12:00:00', izin: 'denied' });
    ok('izin yok: kurulmadı, izin istenmedi', (await bekleyen(p)).length === 0 && (await p.evaluate(() => window.__bf.requestPerm)) === 0); await ctx.close(); }
  { const { p, ctx } = await ac(b, { zaman: '2026-11-26T12:00:00', izin: 'prompt' });
    ok('izin sorulmamış: yine sorulmuyor', (await p.evaluate(() => window.__bf.requestPerm)) === 0 && (await bekleyen(p)).length === 0); await ctx.close(); }

  // 8) Bildirime dokunma: ödeme ekranı yıllık seçili
  { const { p, ctx } = await ac(b, { zaman: '2026-11-30T20:01:00' });
    await p.evaluate(() => { __hf.setPw('uc-aylik'); __hf.setTab('kilo'); __hf.render(); window.__listeners.localNotificationActionPerformed({ actionId: 'tap', notification: { id: 9951, extra: { bf: 1 } } }); });
    await p.waitForTimeout(600);
    ok('dokunma: ödeme ekranı açık', !!(await p.$('#paywall')));
    ok('dokunma: yıllık seçili', (await p.getAttribute('[data-pw="yillik"]', 'aria-checked')) === 'true'); await ctx.close(); }

  // 9) Koyu tema görünümü
  { const { p, ctx } = await ac(b, { zaman: '2026-11-28T10:00:00', tema: 'dark' });
    await p.evaluate(() => { __hf.S.profile.theme = 'dark'; __hf.render(); }); await p.waitForTimeout(200);
    ok('koyu tema: bant var', !!(await band(p)));
    await p.screenshot({ path: path.join(OUT, 'bf-ozet-koyu.png') }); await ctx.close(); }

  await b.close();
  console.log(`\n${gecen} geçti, ${kalan} kaldı`);
  process.exit(kalan ? 1 : 0);
})();
