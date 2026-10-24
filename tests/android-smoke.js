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
    page.on('response', r => { if (r.status() >= 400) report.konsol.push('HTTP ' + r.status() + ' ' + r.url()); });
    await page.waitForSelector('#view', { timeout: 30000 });
    await wait(1500);
    return page;
  };
  const tap = async (page, sel) => { await page.waitForSelector(sel, { state: 'attached', timeout: 20000 }); await page.evaluate(s => document.querySelector(s).click(), sel); };
  const type = (page, sel, v) => page.evaluate(([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, v]);
  try {
    await device.shell(`pm clear ${PKG}`);
    await device.shell(`am start -n ${PKG}/.MainActivity`);
    for (const ms of [300, 500, 500]) { await wait(ms); await shot('acilis-ekrani'); }
    await device.shell(`am force-stop ${PKG}`);

    let page = await launch();
    // İlk kurulum: karşılama → "Evet" → iğne bilgileri → hedefleri atla → bitir
    const onb = await page.evaluate(() => !!document.querySelector('#onb'));
    step('İlk kurulum ekranı açıldı', onb);
    await shot('kurulum-hosgeldin');
    const kilitli = await page.evaluate(() => document.querySelector('[data-ob="next"]').disabled);
    await tap(page, '#obTos'); await wait(300);
    step('Tıbbi uyarı onaylanmadan başlanamıyor', kilitli && await page.evaluate(() => !document.querySelector('[data-ob="next"]').disabled));
    await tap(page, '[data-ob="next"]'); await wait(500);
    await tap(page, '[data-ob-uses="1"]'); await tap(page, '[data-ob="next"]'); await wait(500); await shot('kurulum-igne');
    await tap(page, '[data-ob="next"]'); await wait(500); await shot('kurulum-hedef');
    await tap(page, '[data-ob="skip"]'); await wait(500);
    await tap(page, '[data-ob="finish"]'); await wait(1200);
    step('İlk kurulum tamamlandı', await page.evaluate(() => !document.querySelector('#onb') && JSON.parse(localStorage.getItem('doz-defteri') || '{}').profile?.onboarded === true));
    await shot('ozet-bos');
    // Adım sayar: kart görünüyor mu, Health Connect var mı, izin penceresi açılıyor mu?
    const hc = await page.evaluate(async () => ({ kart: !!document.querySelector('.stcta'), uygun: await Capacitor.Plugins.Health.isAvailable().then(r => JSON.stringify(r), e => 'hata: ' + e.message) }));
    step('Adım kartı görünüyor', hc.kart, hc.uygun);
    await tap(page, '.stcta'); await wait(700); await shot('adim-baglan');
    await tap(page, '#hcGo'); await wait(3500); await shot('health-connect-izin');
    const izin = (await device.shell('dumpsys window | grep mCurrentFocus')).toString().trim();
    step('Health Connect izin penceresi açıldı', /healthdata|permissioncontroller|health/i.test(izin), izin);
    await device.shell('input keyevent 4'); await wait(1500);
    await page.evaluate(() => { const r = document.querySelector('#sheetRoot'); if (r) r.innerHTML = ''; });
    // Hatırlatıcılar: izin ver, aç, bildirimler kuruldu mu; gerçek bir bildirim gösterilebiliyor mu?
    await device.shell(`pm grant ${PKG} android.permission.POST_NOTIFICATIONS`);
    await page.evaluate(() => document.querySelector('.remcta').scrollIntoView({ block: 'center' })); await shot('hatirlatici-kart');
    await tap(page, '.remcta [data-rem-on]'); await wait(3500);
    const bek = await page.evaluate(async () => (await Capacitor.Plugins.LocalNotifications.getPending()).notifications.length);
    step('Hatırlatıcılar kuruldu', bek > 0, bek + ' bekleyen bildirim');
    await page.evaluate(() => Capacitor.Plugins.LocalNotifications.schedule({ notifications: [{ id: 9998, title: 'Hafif test', body: 'Bir bardak su?', actionTypeId: 'SU', schedule: { at: new Date(Date.now() + 3000), allowWhileIdle: true }, isExactNotification: false }] }));
    let goruldu = false;
    for (let i = 0; i < 20 && !goruldu; i++) { await wait(3000); goruldu = /Hafif test/.test((await device.shell('dumpsys notification --noredact')).toString()); }
    await device.shell('cmd statusbar expand-notifications'); await wait(1500); await shot('bildirim-paneli');
    await device.shell('cmd statusbar collapse'); await wait(800);
    step('Bildirim telefonda göründü', goruldu);
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

    const fps = () => Promise.race([page.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else r(Math.round(n / 2)); })(); })), wait(8000).then(() => 'yanıt yok')]);
    report.fps = { ozet: await fps() };
    for (const t of ['takviye', 'besin', 'kilo', 'igne', 'ozet']) {
      const t0 = Date.now();
      const r = await Promise.race([page.evaluate(s => { document.querySelector(s).click(); return document.querySelector('#title')?.textContent; }, `.tab[data-tab="${t}"]`), wait(10000).then(() => 'ZAMAN AŞIMI')]);
      report['sekme_' + t] = { sonuc: r, ms: Date.now() - t0 };
      await wait(1500); await shot('sekme-' + t);
      if (r === 'ZAMAN AŞIMI') {
        for (const sn of [5, 15]) { await wait(sn * 1000); await shot(`sekme-${t}-${sn}sn-sonra`); }
        report.pid = (await device.shell(`pidof ${PKG}`)).toString().trim();
        report.logcat = (await device.shell('logcat -d -t 400 *:W')).toString().split('\n').filter(l => /chromium|Console|hafif|ANR|FATAL|AndroidRuntime|WebView|Capacitor/i.test(l)).slice(-80);
        throw new Error('Sekme yanıt vermedi: ' + t);
      }
      report.fps[t] = await fps();
    }
    step('Tüm sekmeler açıldı', report.hatalar.length === 0, report.hatalar.join(' | '));

    // Kilo girişi
    await tap(page, '[data-open="weight"]'); await wait(600);
    await type(page, '#w-kg', '88,4'); await shot('kilo-gir');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(900);
    // İğne girişi
    await tap(page, '[data-open="shot"]'); await wait(600);
    await type(page, '#s-dose', '2,5'); await shot('igne-ekle');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(900);
    // Su
    await tap(page, '.tab[data-tab="besin"]'); await wait(600);
    const su = page.locator('[data-wamt]').first();
    if (await su.count()) { await tap(page, '[data-wamt]'); await wait(900); }
    await shot('besin-su-eklendi');
    const kayit = await page.evaluate(() => { try { const d = JSON.parse(localStorage.getItem('doz-defteri')); return { tarti: d.weights.length, igne: d.shots.length, gun: Object.keys(d.daily || {}).length }; } catch (e) { return String(e); } });
    step('Kayıt eklendi', kayit.tarti === 1 && kayit.igne === 1, JSON.stringify(kayit));

    // Kapat-aç: veri kalıcı mı?
    await device.shell(`am force-stop ${PKG}`); await wait(800);
    page = await launch();
    const kayit2 = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri') || '{}'); return { tarti: (d.weights || []).length, igne: (d.shots || []).length }; });
    await shot('yeniden-acildi');
    step('Uygulama kapatılıp açılınca veriler duruyor', kayit2.tarti === 1 && kayit2.igne === 1, JSON.stringify(kayit2));

    // Kayıt düzenleme: tartıya dokun → değiştir
    await tap(page, '.tab[data-tab="kilo"]'); await wait(600);
    await tap(page, '[data-edit-w]'); await wait(600);
    const baslik = await page.textContent('#sheetRoot h2');
    await type(page, '#w-kg', '87,9'); await shot('tarti-duzenle');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(1200);
    const duz = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri')); return { tarti: d.weights.length, kg: d.weights[0].kg }; });
    step('Tartı düzenlendi', baslik.includes('düzenle') && duz.tarti === 1 && duz.kg === 87.9, baslik + ' ' + JSON.stringify(duz));
    await tap(page, '.tab[data-tab="ozet"]'); await wait(1500);

    // Veri dosyası (otomatik yedeğe giren kopya) yazıldı mı, web depolaması silinince geri geliyor mu?
    const dosya = (await device.shell(`run-as ${PKG} cat files/hafif-veri.json`)).toString();
    step('Veri dosyası yazıldı', dosya.includes('"kg":87.9'), dosya.slice(0, 120));
    await device.shell(`am force-stop ${PKG}`); await wait(800);
    await device.shell(`run-as ${PKG} rm -rf app_webview`); await wait(500);
    page = await launch(); await wait(1500);
    const geri = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri') || '{}'); return { tarti: (d.weights || []).length, igne: (d.shots || []).length, kurulum: !!document.querySelector('#onb') }; });
    await shot('yedekten-geri-yuklendi');
    step('Web depolaması silinince veriler dosyadan geri yüklendi', geri.tarti === 1 && geri.igne === 1 && !geri.kurulum, JSON.stringify(geri));

    // Yan etki, kalem stoğu, ölçü, karanlık tema
    const D = () => page.evaluate(() => JSON.parse(localStorage.getItem('doz-defteri') || '{}'));
    await tap(page, '.tab[data-tab="igne"]'); await wait(700);
    await tap(page, '[data-se="bulanti"]'); await wait(300); await tap(page, '[data-se="bulanti"]'); await wait(500);
    await tap(page, '#penStart'); await wait(700);
    await shot('yan-etki-kalem');
    await tap(page, '[data-open="shot"]'); await wait(600); await type(page, '#s-dose', '5'); await tap(page, '#sheetRoot [type="submit"]'); await wait(1000);
    const yk = await D();
    const bugun = Object.keys(yk.sides || {})[0];
    step('Yan etki kaydedildi', bugun && yk.sides[bugun].bulanti === 2, JSON.stringify(yk.sides));
    step('Kalem stoğu iğneyle azaldı', yk.profile.penLeft === 3, 'kalan ' + yk.profile.penLeft);
    await tap(page, '.tab[data-tab="kilo"]'); await wait(600);
    await tap(page, '#mAdd'); await wait(600); await type(page, '#m-bel', '96,5'); await type(page, '#m-kalca', '110');
    await tap(page, '#fM [type="submit"]'); await wait(900);
    const ol = await D();
    step('Vücut ölçüsü kaydedildi', (ol.meas || []).length === 1 && ol.meas[0].bel === 96.5, JSON.stringify(ol.meas));
    await tap(page, '#gearBtn'); await wait(600);
    await tap(page, '[data-theme-set="dark"]'); await wait(800);
    const koyu = await page.evaluate(() => document.documentElement.dataset.hf);
    await tap(page, '.tab[data-tab="ozet"]'); await wait(900); await shot('karanlik-ozet');
    step('Karanlık tema açıldı', koyu === 'dark', koyu);
    await tap(page, '#gearBtn'); await wait(600); await tap(page, '[data-theme-set="sys"]'); await wait(500);
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);

    // Geri tuşu: alt sayfa kapanmalı
    await tap(page, '[data-open="weight"]'); await wait(600);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await device.shell('input keyevent 111'); await wait(800); // klavyeyi kapat
    await device.shell('input keyevent 4'); await wait(700);
    const sheetKapali = await page.evaluate(() => !document.querySelector('#sheetRoot').firstChild);
    step('Geri tuşu açık pencereyi kapatıyor', sheetKapali);
    // Geri tuşu: sekmeden Özet'e
    await tap(page, '.tab[data-tab="kilo"]'); await wait(500);
    await device.shell('input keyevent 4'); await wait(700);
    const ozette = await page.evaluate(() => document.querySelector('.tab[aria-selected="true"]')?.dataset.tab);
    step('Geri tuşu Özet sekmesine dönüyor', ozette === 'ozet', ozette);

    // Geri tuşu: Özet'teyken uygulamadan çıkmalı (en sonda tekrar açılır)
    await device.shell('input keyevent 4'); await wait(1500);
    const odak = (await device.shell('dumpsys window | grep mCurrentFocus')).toString();
    step('Özet\'te geri tuşu uygulamadan çıkıyor', !odak.includes(PKG), odak.trim());
    await device.shell(`am force-stop ${PKG}`); await wait(1500);
    page = await launch();
    // Ayarlar → yedek indir: Android paylaş penceresi açılmalı
    await tap(page, '#gearBtn'); await wait(700);
    await page.evaluate(() => document.querySelector('#exJson').scrollIntoView()); await wait(500); await shot('ayarlar-verilerim');
    await tap(page, '#exJson'); await wait(2500);
    await shot('yedek-paylas-penceresi');
    const pencere = await device.shell('dumpsys window | grep -E "mCurrentFocus|mFocusedApp"');
    step('Yedek dosyası → paylaş penceresi', !/hafif\/.*MainActivity/.test(pencere.toString().split('\n').find(l => l.includes('mCurrentFocus')) || ''), pencere.toString().trim());
    await device.shell('input keyevent 4'); await wait(1000);
    const msg = await page.textContent('#dataMsg');
    step('Yedek dosyası hata mesajı yok', !msg, msg);

    await tap(page, '#exXlsx'); await wait(3500);
    await shot('excel-paylas-penceresi');
    await device.shell('input keyevent 4'); await wait(1000);
    const msg2 = await page.textContent('#dataMsg');
    step('Excel dosyası hata mesajı yok', !msg2, msg2);

    // Hafif Plus: ücretsiz kullanıcıda rapor ödeme ekranını açar; Google Play faturalandırma eklentisi yüklü
    const iap = await page.evaluate(() => !!(window.CdvPurchase && window.CdvPurchase.store));
    step('Google Play faturalandırma eklentisi yüklendi', iap);
    await tap(page, '#exPdf'); await wait(2500);
    await shot('odeme-ekrani');
    const pw = await page.evaluate(() => ({ acik: !!document.querySelector('#paywall'), planlar: document.querySelectorAll('[data-pw]').length, baslik: (document.querySelector('#paywall h1') || {}).textContent }));
    step('Rapor (Plus) → ödeme ekranı açıldı', pw.acik && pw.planlar === 3, JSON.stringify(pw));
    await device.shell('input keyevent 4'); await wait(800);
    step('Geri tuşu ödeme ekranını kapatıyor', await page.evaluate(() => !document.querySelector('#paywall')));
    // grafik kartı için ikinci (dünkü) tartı
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);
    await tap(page, '[data-open="weight"]'); await wait(600); await type(page, '#w-kg', '88,6');
    await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() - 1); document.querySelector('#w-date').value = d.toISOString().slice(0, 10); });
    await tap(page, '#sheetRoot [type="submit"]'); await wait(1200);
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);
    await page.evaluate(() => { const b = document.querySelector('[data-chart="trend"]'); if (b) b.click(); }); await wait(900);
    const kilit = await page.evaluate(() => !!document.querySelector('.plock [data-plus]'));
    await shot('kilitli-grafik');
    step('Plus grafikleri kilitli görünüyor', kilit);
    await page.evaluate(() => { const b = document.querySelector('[data-chart="egri"]'); if (b) b.click(); }); await wait(500);
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
