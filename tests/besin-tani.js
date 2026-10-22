// Tanı: Protein & Su sekmesindeki donmanın kaynağını bulmak için farklı koşullarda dener.
const { _android: android } = require('playwright');
const fs = require('fs');
const PKG = 'com.ugurbektas.hafif', OUT = process.env.OUT || 'test-sonuclari';
fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const race = (p, ms) => Promise.race([p, wait(ms).then(() => 'YANIT YOK')]);
(async () => {
  const [device] = await android.devices();
  const res = {};
  for (const mod of ['bulaniklik-yok+animasyon-yok', 'animasyon-yok', 'bulaniklik-yok', 'normal']) {
    try {
      await device.shell(`am force-stop ${PKG}`); await wait(1500);
      await device.shell(`am start -W -n ${PKG}/.MainActivity`);
      const page = await (await device.webView({ pkg: PKG }, { timeout: 60000 })).page();
      await page.waitForSelector('#view', { timeout: 30000 }); await wait(1000);
      await page.evaluate(mod => {
        if (mod.includes('bulaniklik-yok')) { const s = document.createElement('style'); s.textContent = '*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'; document.head.appendChild(s); }
        if (mod.includes('animasyon-yok')) { const mm = window.matchMedia.bind(window); window.matchMedia = q => /reduce/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {} } : mm(q); }
      }, mod);
      await page.evaluate(() => document.querySelector('.tab[data-tab="besin"]').click());
      await wait(3000);
      const fps = await race(page.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else r(Math.round(n / 2)); })(); })), 10000);
      const ekran = await race(device.screenshot({ path: `${OUT}/tani-${mod}.png` }).then(() => 'alındı', e => 'HATA'), 15000);
      res[mod] = { fps, ekran };
    } catch (e) { res[mod] = { hata: String(e.message || e).slice(0, 200) }; }
    console.log(mod, JSON.stringify(res[mod]));
  }
  const r = JSON.parse(fs.existsSync(`${OUT}/rapor.json`) ? fs.readFileSync(`${OUT}/rapor.json`) : '{}');
  r.besinTani = res; fs.writeFileSync(`${OUT}/rapor.json`, JSON.stringify(r, null, 2));
  await device.close(); process.exit(0);
})();
