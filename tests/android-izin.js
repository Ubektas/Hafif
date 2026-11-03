// Yayın derlemesinde (R8 tam iyileştirme, debuggable değil) Capacitor izin yollarını dener.
// Play'deki 2.0.0'da bildirimler açıkken "Bildirim izni alınamadı" çıkıyordu; debug test derlemesi bunu göstermiyordu.
const { _android: android } = require('playwright');
const fs = require('fs');
const PKG = 'com.ugurbektas.hafif';
const OUT = process.env.OUT || 'test-sonuclari';
fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const sonuc = { adimlar: [] };
  const step = (ad, ok, detay) => { sonuc.adimlar.push({ ad, sonuc: ok, detay }); console.log(ok ? '✓' : '✗', ad, detay ?? ''); };
  const [device] = await android.devices();
  try {
    // kullanıcının durumu: bildirim izni zaten verilmiş
    await device.shell(`pm grant ${PKG} android.permission.POST_NOTIFICATIONS`);
    await device.shell(`am start -W -n ${PKG}/.MainActivity`);
    const wv = await device.webView({ pkg: PKG }, { timeout: 60000 });
    const page = await wv.page();
    await page.waitForSelector('#view', { timeout: 30000 }); await wait(1500);
    const r = await page.evaluate(async () => {
      const P = Capacitor.Plugins, out = {};
      const dene = async (ad, f) => { try { out[ad] = JSON.stringify(await f()); } catch (e) { out[ad] = 'HATA: ' + (e && e.message); } };
      await dene('bildirim_check', () => P.LocalNotifications.checkPermissions());
      await dene('bildirim_request', () => P.LocalNotifications.requestPermissions());
      await dene('bildirim_pending', () => P.LocalNotifications.getPending());
      await dene('dosya_check', () => P.Filesystem.checkPermissions());
      // PDF/Excel/yedek İndirilenler klasörüne kaydedilir (nativeSave)
      await dene('indir_yaz', () => P.Filesystem.writeFile({ path: 'Download/hafif-test.pdf', directory: 'EXTERNAL_STORAGE', recursive: true, data: btoa('%PDF-1.4 test') }));
      await dene('indir_sil', () => P.Filesystem.deleteFile({ path: 'Download/hafif-test.pdf', directory: 'EXTERNAL_STORAGE' }));
      return out;
    });
    const ok = v => typeof v === 'string' && !v.startsWith('HATA');
    step('Yayın derlemesi: bildirim izni kontrolü', ok(r.bildirim_check) && /granted/.test(r.bildirim_check), r.bildirim_check);
    step('Yayın derlemesi: bildirim izni isteme', ok(r.bildirim_request) && /granted/.test(r.bildirim_request), r.bildirim_request);
    step('Yayın derlemesi: bekleyen bildirimler', ok(r.bildirim_pending), r.bildirim_pending);
    step('Yayın derlemesi: dosya izni kontrolü', ok(r.dosya_check), r.dosya_check);
    step('Yayın derlemesi: İndirilenler klasörüne kaydetme', ok(r.indir_yaz) && ok(r.indir_sil), r.indir_yaz + ' · ' + r.indir_sil);
    await device.screenshot({ path: `${OUT}/izin-yayin.png` });
  } catch (e) { step('Yayın derlemesi testi çalıştı', false, e.message); }
  fs.writeFileSync(`${OUT}/izin-yayin.json`, JSON.stringify(sonuc, null, 2));
  await device.close().catch(() => {});
  process.exit(0);
})();
