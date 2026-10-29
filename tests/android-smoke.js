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
  // + düğmesi → hızlı ekleme panelinden kilo (w) ya da iğne (s)
  const ekle = async (page, k) => { await new Promise(r => setTimeout(r, 900)); await tap(page, '#fab'); await new Promise(r => setTimeout(r, 500)); await tap(page, `[data-q="${k}"]`); };
  const type = (page, sel, v) => page.evaluate(([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [sel, v]);
  try {
    // Emülatörde başka uygulamaların "yanıt vermiyor" pencereleri testi kapatmasın
    await device.shell('settings put global hide_error_dialogs 1');
    await device.shell('settings put secure anr_show_background 0');
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
    await tap(page, '#hcGo');
    // pencere yavaş emülatörde geç açılabilir: 15 sn'ye kadar bekle, sonra uygulamaya dönene kadar geri bas
    const odakNe = async () => (await device.shell('dumpsys window | grep mCurrentFocus')).toString().trim();
    let izin = '';
    for (let i = 0; i < 15; i++) { await wait(1000); izin = await odakNe(); if (/healthdata|permissioncontroller|health/i.test(izin)) break; }
    await wait(800); await shot('health-connect-izin');
    step('Health Connect izin penceresi açıldı', /healthdata|permissioncontroller|health/i.test(izin), izin);
    for (let i = 0; i < 4 && !/hafif\/.*MainActivity/.test(await odakNe()); i++) { await device.shell('input keyevent 4'); await wait(1500); }
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
        fontlar: ['Outfit', 'Figtree'].map(f => f + ':' + document.fonts.check(`700 20px "${f}"`, 'ğşıİ')),
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
    // Protein & Su: su bardağı durulunca çizim durmalı (boşta akıcılık)
    await page.evaluate(() => document.querySelector('.tab[data-tab="besin"]').click()); await wait(9000);
    report.fps.besin_bosta = await fps();
    await page.evaluate(() => document.querySelector('.tab[data-tab="ozet"]').click()); await wait(1200);
    step('Tüm sekmeler açıldı', report.hatalar.length === 0, report.hatalar.join(' | '));

    // Kilo girişi
    await ekle(page, 'w'); await wait(600);
    await type(page, '#w-kg', '88,4'); await shot('kilo-gir');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(900);
    // İğne girişi
    await ekle(page, 's'); await wait(600);
    await type(page, '#s-dose', '2,5'); await shot('igne-ekle');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(900);
    // Su
    await tap(page, '.tab[data-tab="besin"]'); await wait(600);
    const su = page.locator('#wAdd');
    if (await su.count()) { await tap(page, '#wAdd'); await wait(900); }
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
    await ekle(page, 's'); await wait(600); await type(page, '#s-dose', '5'); await tap(page, '#sheetRoot [type="submit"]'); await wait(1000);
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
    await tap(page, '.tab[data-tab="ozet"]'); await wait(2000); await shot('karanlik-ozet');
    step('Karanlık tema açıldı', koyu === 'dark', koyu);
    await tap(page, '#gearBtn'); await wait(600); await tap(page, '[data-theme-set="sys"]'); await wait(500);
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);

    // Geri tuşu: alt sayfa kapanmalı
    await ekle(page, 'w'); await wait(600);
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

    // Hafif Plus: ilk 7 gün açık → rapor paylaşılır
    const iap = await page.evaluate(() => !!(window.CdvPurchase && window.CdvPurchase.store));
    step('Google Play faturalandırma eklentisi yüklendi', iap);
    await tap(page, '#exPdf'); await wait(5000);
    await shot('rapor-paylas-penceresi');
    const pencere3 = (await device.shell('dumpsys window | grep mCurrentFocus')).toString();
    step('Ücretsiz dönemde doktor raporu (PDF) → paylaş penceresi', !/hafif\/.*MainActivity/.test(pencere3), pencere3.trim());
    await device.shell('input keyevent 4'); await wait(1000);
    // 7 gün geçmiş gibi: Plus alanları kilitlenir, dönem bitince ödeme ekranı bir kez açılır
    await wait(1000);
    await page.evaluate(() => { const S = JSON.parse(localStorage.getItem('doz-defteri')); S.profile.since = '2020-01-01'; delete S.profile.trialEndSeen; localStorage.setItem('doz-defteri', JSON.stringify(S)); });
    await page.reload(); await page.waitForSelector('#view'); await wait(3500);
    step('Ücretsiz dönem bitince ödeme ekranı bir kez açıldı', await page.evaluate(() => !!document.querySelector('#paywall')));
    await page.evaluate(() => { const x = document.querySelector('#pwX'); if (x) x.click(); }); await wait(500);
    await tap(page, '#gearBtn'); await wait(700);
    await tap(page, '#exPdf'); await wait(2500);
    await shot('odeme-ekrani');
    const pw = await page.evaluate(() => ({ acik: !!document.querySelector('#paywall'), planlar: document.querySelectorAll('[data-pw]').length, baslik: (document.querySelector('#paywall h1') || {}).textContent }));
    step('Rapor (Plus) → ödeme ekranı açıldı', pw.acik && pw.planlar === 3, JSON.stringify(pw));
    await device.shell('input keyevent 4'); await wait(800);
    step('Geri tuşu ödeme ekranını kapatıyor', await page.evaluate(() => !document.querySelector('#paywall')));
    // grafik kartı için ikinci tartı (ilk iğneden sonra sayılsın diye bugün)
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);
    await ekle(page, 'w'); await wait(600); await type(page, '#w-kg', '88,6');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(1200);
    await tap(page, '.tab[data-tab="kilo"]'); await wait(700);
    await page.evaluate(() => { const b = document.querySelector('[data-chart="trend"]'); if (b) b.click(); }); await wait(900);
    const kilit = await page.evaluate(() => !!document.querySelector('.plock [data-plus]'));
    await shot('kilitli-grafik');
    step('Plus grafikleri kilitli görünüyor', kilit);

    // Ana ekran widget'ları: 10 sağlayıcı kayıtlı, veri dosyası yazılıyor, çizimler üretiliyor, widget bağlantısı çalışıyor
    const aw = (await device.shell('dumpsys appwidget')).toString();
    const saglayici = new Set((aw.match(/HafifWidgets\$\w+/g) || [])).size;
    step('10 widget sağlayıcısı kayıtlı', saglayici === 10, saglayici + ' sağlayıcı');
    await wait(1500);
    const wj = (await device.shell(`run-as ${PKG} cat files/widget.json`)).toString();
    step('Widget veri dosyası yazıldı', wj.includes('"cyc"') && wj.includes('"day"'), wj.slice(0, 100));
    await page.evaluate(() => { const S = JSON.parse(localStorage.getItem('doz-defteri')); const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
      S.profile.goalWeight = 80; S.profile.since = new Date().toISOString().slice(0, 10);
      S.supps = [{ id: 'mg', name: 'Magnezyum', slots: ['sabah', 'aksam'], slot: 'sabah', days: [0, 1, 2, 3, 4, 5, 6], shape: 'caps', color: '#4F8FDB' }, { id: 'om', name: 'Omega-3', slot: 'aksam', days: [0, 1, 2, 3, 4, 5, 6], shape: 'oval', color: '#E9D59A' }];
      [[20, 92.4], [14, 91.1], [7, 90.2], [3, 89.4]].forEach(([g, k], i) => S.weights.push({ id: 'wt' + i, date: ago(g), kg: k, t: i }));
      // widget önizlemeleri dolu görünsün: bugünün suyu/proteini, 7 günlük adım, ikinci takviye
      const td = ago(0), t0 = new Date(td + 'T00:00:00').getTime();
      S.daily = S.daily || {}; S.daily[td] = { p: 74, w: 1750, log: [[t0 + 8.4 * 36e5, 'p', 12, 'yumurta'], [t0 + 13 * 36e5, 'p', 31, 'tavuk'], [t0 + 16 * 36e5, 'p', 15, 'yogurt'], [t0 + 17 * 36e5, 'p', 16, 'peynir'], [t0 + 8 * 36e5, 'w', 750], [t0 + 13 * 36e5, 'w', 1000]] };
      S.hc = Object.assign({}, S.hc, { on: true }); S.steps = {}; [5820, 8110, 7340, 9020, 6480, 7900, 6240].forEach((n, i) => { S.steps[ago(6 - i)] = n; });
      S.supps[1].name = 'Omega-3'; S.supps.push({ id: 'b12', name: 'B12', slot: 'aksam', days: [0, 1, 2, 3, 4, 5, 6], shape: 'tab', color: '#F1B3C3' });
      S.shots.forEach(x => { x.date = ago(21); }); S.shots.push({ id: 'sh2', date: ago(14), time: '09:00', dose: '5', site: 'Karın sağ' }, { id: 'sh3', date: ago(7), time: '09:00', dose: '5', site: 'Uyluk sol' }, { id: 'sh4', date: ago(2), time: '09:00', dose: '5', site: 'Uyluk sağ' });
      localStorage.setItem('doz-defteri', JSON.stringify(S)); });
    await page.reload(); await page.waitForSelector('#view'); await wait(4000);
    await page.evaluate(() => { const x = document.querySelector('#pwX'); if (x) x.click(); });
    const pv = await page.evaluate(async () => { try { return (await window.Capacitor.Plugins.HafifWidget.preview()).files; } catch (e) { return 'HATA ' + e.message; } });
    const dosyalar = String(pv).split(',').filter(Boolean);
    for (const f of dosyalar) {
      const b64 = (await device.shell(`run-as ${PKG} base64 files/wprev/${f}`)).toString().replace(/\s+/g, '');
      if (b64) fs.writeFileSync(`${OUT}/widget-${f}`, Buffer.from(b64, 'base64'));
    }
    step('Widget çizimleri üretildi', dosyalar.length >= 20, pv);
    const suOnce = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri')); return (d.daily[Object.keys(d.daily).sort().pop()] || {}).w || 0; });
    await device.shell(`am start -W -a android.intent.action.VIEW -d "hafif://w/water/250" -n ${PKG}/.MainActivity`); await wait(2500);
    const suSonra = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri')); return (d.daily[Object.keys(d.daily).sort().pop()] || {}).w || 0; });
    step('Widget bağlantısı (+250 ml su) çalıştı', suSonra - suOnce === 250, suOnce + ' → ' + suSonra);
    await page.evaluate(() => { const b = document.querySelector('[data-chart="egri"]'); if (b) b.click(); }); await wait(500);

    // 1.9.0: + panelinden su (miktar seçilerek) ve kas kütlesi
    const D2 = () => page.evaluate(() => JSON.parse(localStorage.getItem('doz-defteri') || '{}'));
    const suA = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri')); return (d.daily[Object.keys(d.daily).sort().pop()] || {}).w || 0; });
    await tap(page, '.tab[data-tab="ozet"]'); await wait(600);
    await ekle(page, 'su'); await wait(600); await tap(page, '[data-wv="500"]'); await shot('su-ekle'); await tap(page, '#fWa [type="submit"]'); await wait(900);
    const suB = await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('doz-defteri')); return (d.daily[Object.keys(d.daily).sort().pop()] || {}).w || 0; });
    step('+ paneli → su penceresi → 500 ml eklendi', suB - suA === 500, suA + ' → ' + suB);
    await ekle(page, 'w'); await wait(600); await type(page, '#w-kg', '88,2'); await tap(page, '[data-more="wMusL"]'); await type(page, '#w-mus', '31,4'); await shot('kas-kutlesi');
    await tap(page, '#sheetRoot [type="submit"]'); await wait(900);
    const ks = await D2();
    step('Kas kütlesi kaydedildi', ks.weights.some(x => x.mus === 31.4), JSON.stringify(ks.weights.slice(-1)));

    // 1.9.0: ikinci hatırlatmalar kuruluyor
    await device.shell(`pm grant ${PKG} android.permission.POST_NOTIFICATIONS`).catch(() => {});
    await page.evaluate(() => { const S = JSON.parse(localStorage.getItem('doz-defteri')); S.profile.rem = { on: true }; localStorage.setItem('doz-defteri', JSON.stringify(S)); });
    await page.reload(); await page.waitForSelector('#view'); await wait(5000);
    const bek2 = await page.evaluate(async () => { try { return ((await window.Capacitor.Plugins.LocalNotifications.getPending()).notifications || []).map(n => n.id); } catch (e) { return ['HATA ' + e.message]; } });
    step('Takviye için ikinci hatırlatma kuruldu', bek2.some(i => i >= 2500 && i < 2600), (bek2.includes(1002) ? 'iğne ikinci hatırlatması da var · ' : '') + bek2.slice(0, 30).join(','));

    // 1.9.0: adım paylaşımı, fotoğraf seçici ve Hafif ekibine gönder (e-posta)
    await page.evaluate(() => { const x = document.querySelector('#pwX'); if (x) x.click(); });
    await tap(page, '.tab[data-tab="ozet"]'); await wait(700);
    await tap(page, '.tring[data-go="adim"]'); await wait(1200);
    await tap(page, '#stShareBtn'); await wait(2500); await shot('adim-paylas');
    const kart = await page.evaluate(() => (document.querySelector('#stImg') || {}).src || '');
    step('Adım paylaşım kartı çizildi', kart.startsWith('data:image') && kart.length > 20000, kart.length + ' bayt');
    await tap(page, '[data-sttpl="foto"]'); await wait(800); await tap(page, '#stPick'); await wait(2500);
    const secici = (await device.shell('dumpsys window | grep mCurrentFocus')).toString();
    await shot('foto-secici');
    step('Fotoğraf seçici açıldı (izin istemeden)', !/hafif\/.*MainActivity/.test(secici) && !/permission/i.test(secici), secici.trim());
    await device.shell('input keyevent 4'); await wait(1200);
    await tap(page, '#stTeam'); await wait(900); await tap(page, '.tsck'); await wait(300); await tap(page, '#tsGo'); await wait(3000);
    const eposta = (await device.shell('dumpsys window | grep mCurrentFocus')).toString();
    await shot('ekibe-gonder-eposta');
    step('Hafif ekibine gönder → e-posta seçici açıldı', !/hafif\/.*MainActivity/.test(eposta), eposta.trim());
    await device.shell('input keyevent 4'); await wait(1000);
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
