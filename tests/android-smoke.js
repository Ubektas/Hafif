// Emülatörde Hafif'i açar, temel akışları dener, ekran görüntüsü ve rapor üretir.
const { _android: android } = require('playwright');
const fs = require('fs');
const PKG = 'com.ugurbektas.hafif';
const OUT = process.env.OUT || 'test-sonuclari';
fs.mkdirSync(OUT, { recursive: true });
const report = { adimlar: [], hatalar: [], konsol: [] };
const wait = ms => new Promise(r => setTimeout(r, ms));
const step = (ad, sonuc, detay) => { report.adimlar.push({ ad, sonuc, detay }); console.log(sonuc ? '✓' : '✗', ad, detay ?? ''); };

(async () => {
  const [device] = await android.devices();
  let n = 0;
  const shot = async name => { await device.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${name}.png` }); };
  const launch = async () => {
    await device.shell(`am start -W -n ${PKG}/.MainActivity`);
    const wv = await device.webView({ pkg: PKG }, { timeout: 60000 });
    const page = await wv.page();
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') report.konsol.push(m.type() + ': ' + m.text()); });
    page.on('pageerror', e => report.hatalar.push(e.message));
    await page.waitForSelector('#view', { timeout: 30000 });
    await wait(1500);
    return page;
  };
  try {
    await device.shell(`pm clear ${PKG}`);
    await device.shell(`am start -n ${PKG}/.MainActivity`);
    await wait(400); await shot('acilis-ekrani');
    await device.shell(`am force-stop ${PKG}`);

    let page = await launch();
    await shot('ozet-bos');
    const env = await page.evaluate(async () => {
      await document.fonts.ready;
      const nav = document.querySelector('nav.tabs').getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      return {
        native: !!(window.Capacitor && Capacitor.isNativePlatform()),
        eklentiler: Object.keys((window.Capacitor && Capacitor.Plugins) || {}),
        fontlar: ['Bricolage Grotesque', 'Figtree'].map(f => f + ':' + document.fonts.check(`700 20px "${f}"`, 'ğşıİ')),
        ekran: [innerWidth, innerHeight], navAlt: Math.round(nav.bottom), padUst: cs.paddingTop, padAlt: cs.paddingBottom,
        senkron: document.querySelector('#sync')?.textContent
      };
    });
    step('Uygulama açıldı (Capacitor)', env.native, JSON.stringify(env));

    for (const t of ['takviye', 'besin', 'kilo', 'igne', 'ozet']) {
      await page.click(`.tab[data-tab="${t}"]`); await wait(700); await shot('sekme-' + t);
    }
    step('Tüm sekmeler açıldı', report.hatalar.length === 0, report.hatalar.join(' | '));

    // Kilo girişi
    await page.click('[data-open="weight"]'); await wait(600);
    await page.fill('#w-kg', '88,4'); await shot('kilo-gir');
    await page.click('#sheetRoot [type="submit"]'); await wait(900);
    // İğne girişi
    await page.click('[data-open="shot"]'); await wait(600);
    await page.fill('#s-dose', '2,5'); await shot('igne-ekle');
    await page.click('#sheetRoot [type="submit"]'); await wait(900);
    // Su
    await page.click('.tab[data-tab="besin"]'); await wait(600);
    const su = page.locator('[data-wamt]').first();
    if (await su.count()) { await su.click(); await wait(900); }
    await shot('besin-su-eklendi');
    const kayit = await page.evaluate(() => { try { const d = JSON.parse(localStorage.getItem('doz-defteri')); return { tarti: d.weights.length, igne: d.shots.length, gun: Object.keys(d.daily || {}).length }; } catch (e) { return String(e); } });
    step('Kayıt eklendi', kayit.tarti === 1 && kayit.igne === 1, JSON.stringify(kayit));

    // Kapat-aç: veri kalıcı mı?
    await device.shell(`am force-stop ${PKG}`); await wait(800);
    page = await launch();
    const kayit2 = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri') || '{}'); return { tarti: (d.weights || []).length, igne: (d.shots || []).length }; });
    await shot('yeniden-acildi');
    step('Uygulama kapatılıp açılınca veriler duruyor', kayit2.tarti === 1 && kayit2.igne === 1, JSON.stringify(kayit2));

    // Geri tuşu: alt sayfa kapanmalı
    await page.click('[data-open="weight"]'); await wait(600);
    await device.shell('input keyevent 4'); await wait(700);
    const sheetKapali = await page.evaluate(() => !document.querySelector('#sheetRoot').firstChild);
    step('Geri tuşu açık pencereyi kapatıyor', sheetKapali);
    // Geri tuşu: sekmeden Özet'e
    await page.click('.tab[data-tab="kilo"]'); await wait(500);
    await device.shell('input keyevent 4'); await wait(700);
    const ozette = await page.evaluate(() => document.querySelector('.tab[aria-selected="true"]')?.dataset.tab);
    step('Geri tuşu Özet sekmesine dönüyor', ozette === 'ozet', ozette);

    // Ayarlar → yedek indir: Android paylaş penceresi açılmalı
    await page.click('#gearBtn'); await wait(700);
    await page.locator('#exJson').scrollIntoViewIfNeeded(); await shot('ayarlar-verilerim');
    await page.click('#exJson'); await wait(2500);
    await shot('yedek-paylas-penceresi');
    const pencere = await device.shell('dumpsys window | grep -E "mCurrentFocus|mFocusedApp"');
    step('Yedek dosyası → paylaş penceresi', !/hafif\/.*MainActivity/.test(pencere.toString().split('\n').find(l => l.includes('mCurrentFocus')) || ''), pencere.toString().trim());
    await device.shell('input keyevent 4'); await wait(1000);
    const msg = await page.textContent('#dataMsg');
    step('Yedek dosyası hata mesajı yok', !msg, msg);

    await page.click('#exXlsx'); await wait(3500);
    await shot('excel-paylas-penceresi');
    await device.shell('input keyevent 4'); await wait(1000);
    const msg2 = await page.textContent('#dataMsg');
    step('Excel dosyası hata mesajı yok', !msg2, msg2);
  } catch (e) {
    report.hatalar.push('TEST HATASI: ' + (e && e.stack || e));
    try { await shot('hata-ani'); } catch (_) {}
  }
  report.sonuc = report.adimlar.every(a => a.sonuc) && !report.hatalar.length ? 'BAŞARILI' : 'SORUN VAR';
  fs.writeFileSync(`${OUT}/rapor.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await device.close();
  process.exit(0);
})();
