// Hafif Koç simülatörü: yüzlerce sanal kullanıcı üretir, her biri için koçun seçtiği kartı
// uygulamanın gerçek koduyla (www/index.html) hesaplar ve kuralları bağımsız olarak doğrular.
// Çalıştırma: node tests/koc-simulator.js [playwright modül yolu] [kullanıcı sayısı]
// Çıktı: test-sonuclari/koc-rapor.json ve koc-ornekler.html (her kart türünden örnekler)
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const N = +(process.argv[3] || 500);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(ROOT, process.env.OUT || 'test-sonuclari');
fs.mkdirSync(OUT, { recursive: true });

// tekrarlanabilir rastgelelik
let seed = 20261025;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const chance = p => rnd() < p;

const SIM_DAY = '2026-10-21'; // Çarşamba
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const toD = s => { const [a, b, c] = s.split('-').map(Number); return new Date(a, b - 1, c); };
const add = (s, n) => { const d = toD(s); d.setDate(d.getDate() + n); return iso(d); };
const diff = (a, b) => Math.round((toD(b) - toD(a)) / 864e5);
const SITES = ['Karın sol', 'Karın sağ', 'Uyluk sol', 'Uyluk sağ', 'Kol sol', 'Kol sağ'];
const FOODK = [['yumurta', 6], ['tavuk', 31], ['ton', 25], ['yogurt', 15], ['peynir', 7], ['et', 26]];

function kullanici(i) {
  const tip = pick(['normal', 'normal', 'normal', 'hizli', 'duraklama', 'geri', 'seyrek', 'hergun', 'aynigun', 'yeni', 'bos']);
  const shots = chance(0.72), iv = shots ? pick([7, 7, 7, 7, 10, 14]) : 7;
  const H = tip === 'yeni' ? ri(0, 4) : tip === 'bos' ? 0 : ri(10, 120);
  const start = ri(70, 130) + rnd(), boy = ri(155, 190);
  const dusukHedef = chance(0.04);
  const goal = dusukHedef ? Math.round(16.5 * (boy / 100) ** 2) : Math.round(start - ri(8, 30));
  const gap = chance(0.25) ? ri(3, 9) : chance(0.3) ? ri(1, 2) : 0; // son kayıttan beri gün
  const son = add(SIM_DAY, -gap), d0 = add(son, -H);
  const S = { profile: { onboarded: true, usesShots: shots, intervalDays: iv, disclaimer: d0, since: d0, age: ri(25, 65), sex: pick(['k', 'e']),
    startWeight: Math.round(start * 10) / 10, goalWeight: goal, heightCm: boy, proteinGoal: pick([90, 100, 110, 120, 130, 140]), waterGoal: pick([2000, 2500, 3000]),
    penSize: shots ? 4 : null, penLeft: shots && chance(0.7) ? ri(0, 4) : null, noCelebrate: true },
    weights: [], shots: [], daily: {}, sides: {}, supps: [], suppLog: {}, meas: [] };
  if (tip === 'bos') return { S, tip, gap: null };
  // iğneler
  if (shots) { const ofs = ri(0, iv - 1); let k = 0;
    for (let d = d0; diff(d, son) >= 0; d = add(d, iv)) { const dd = k === 0 ? d0 : add(d, -ofs * 0); if (diff(dd, son) < 0) break;
      S.shots.push({ id: 's' + k, date: dd, time: pick(['08:00', '09:00', '21:00']), dose: '5', site: chance(0.9) ? SITES[k % 6] : null }); k++; }
    // sıradaki iğnenin bugüne göre konumunu çeşitlendir: son iğneyi kaydır
    const last = S.shots[S.shots.length - 1]; if (last) { const want = ri(-4, iv + 1); const nd = add(SIM_DAY, want); last.date = add(nd, -iv); if (diff(last.date, son) < 0) last.date = son;
      if (S.shots.length > 1 && diff(S.shots[S.shots.length - 2].date, last.date) <= 0) S.shots.pop(); } }
  // tartılar
  const hiz = { normal: -0.7, hizli: -2.4, duraklama: -0.6, geri: 0.4, seyrek: -0.6, hergun: -0.8, aynigun: -0.6, yeni: -0.5 }[tip];
  const adim = tip === 'hergun' ? 1 : tip === 'seyrek' ? ri(7, 12) : ri(1, 4);
  let t = 0;
  for (let n = 0; n <= H; n += adim) { const d = add(d0, n); if (diff(d, son) < 0) break;
    let wk = start + hiz * n / 7 * (tip === 'hizli' ? start / 100 * 0.9 : 1);
    if (tip === 'duraklama' && n > H - 21) wk = start + hiz * (H - 21) / 7;
    wk += (rnd() - 0.5) * pick([0.4, 0.8, 1.2]);
    S.weights.push({ id: 'w' + t, date: d, kg: Math.round(wk * 10) / 10, t: t++ });
    if (tip === 'aynigun' && chance(0.5)) S.weights.push({ id: 'w' + t, date: d, kg: Math.round((wk + 0.3) * 10) / 10, t: t++ }); }
  // son gün tartı sıçraması
  const L = S.weights[S.weights.length - 1];
  if (L && gap === 0 && chance(0.35)) { L.date = SIM_DAY; L.kg = Math.round((L.kg + pick([0.3, 0.5, 0.8, 1.1, 1.8, 5.2])) * 10) / 10; }
  // protein, su, yan etki
  const suSerisi = chance(0.35) ? ri(3, 12) : 0;
  for (let n = 0; n <= H; n++) { const d = add(d0, n); if (diff(d, son) < 0) break; const bugun = d === SIM_DAY;
    const pg = S.profile.proteinGoal, log = []; let p = 0;
    const hedefP = bugun ? pg * pick([0, 0.2, 0.4, 0.6, 0.8, 1.05]) : pg * (0.5 + rnd() * 0.6);
    while (p < hedefP) { const [k, g] = pick(FOODK); p += g; log.push([toD(d).getTime() + ri(8, 20) * 36e5, 'p', g, k]); }
    const geri = diff(d, SIM_DAY);
    let w = geri >= 1 && geri <= suSerisi ? S.profile.waterGoal + 250 : bugun ? pick([0, 500, 1250, 2000]) : S.profile.waterGoal * (0.4 + rnd() * 0.5);
    w = Math.round(w / 250) * 250; if (w) log.push([toD(d).getTime() + 12 * 36e5, 'w', w]);
    if (p || w) S.daily[d] = { p, w, log };
    if (shots && S.shots.length) { const ls = S.shots.filter(x => x.date <= d).pop(); if (ls) { const k = diff(ls.date, d);
      if (k >= 1 && k <= 3 && chance(0.55)) S.sides[d] = { bulanti: pick([1, 1, 2, 2, 3]), ...(chance(0.3) ? { yorgun: 1 } : {}) }; } } }
  // nadiren: iki gün üst üste şiddetli yan etki
  if (shots && gap <= 1 && chance(0.06)) { S.sides[SIM_DAY] = { ...(S.sides[SIM_DAY] || {}), bas: 3 }; S.sides[add(SIM_DAY, -1)] = { ...(S.sides[add(SIM_DAY, -1)] || {}), bas: 3 }; }
  return { S, tip, gap };
}

// --- bağımsız beklenti hesapları (uygulama kodundan ayrı yazıldı) ---
function beklenen(S, saat) {
  const td = SIM_DAY, P = S.profile, shots = P.usesShots !== false;
  const cut = S.shots.length ? [...S.shots].sort((a, b) => a.date < b.date ? -1 : 1)[0].date : '';
  const w = S.weights.filter(x => x.date >= cut).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.t - b.t);
  const sev = d => Object.values(S.sides[d] || {}).some(v => v >= 3);
  const guvenlik = (sev(td) && sev(add(td, -1))) || (sev(add(td, -1)) && sev(add(td, -2)));
  const w21 = w.filter(x => x.date >= add(td, -21)); let hizli = false;
  if (w21.length >= 4) { const f = w21[0], l = w21[w21.length - 1], sp = diff(f.date, l.date); if (sp >= 14 && (f.kg - l.kg) / f.kg / sp * 7 * 100 > 1.5) hizli = true; }
  const ds = [...S.weights.map(x => x.date), ...S.shots.map(x => x.date), ...Object.entries(S.daily).filter(([, r]) => r.p > 0 || r.w > 0).map(([d]) => d),
    ...Object.entries(S.sides).filter(([, r]) => Object.values(r).some(v => v > 0)).map(([d]) => d)].sort();
  const gap = ds.length ? diff(ds[ds.length - 1], td) : null;
  const ls = shots ? [...S.shots].sort((a, b) => a.date < b.date ? -1 : 1).pop() : null;
  const left = ls ? diff(td, add(ls.date, P.intervalDays || 7)) : null;
  const site = ls ? SITES[(SITES.indexOf(ls.site) + 1) % 6] : null;
  const r = S.daily[td] || { p: 0, w: 0 }, rem = P.proteinGoal - (r.p || 0);
  const protein = saat >= 16 && rem >= 15 && (r.p || 0) < P.proteinGoal * 0.75;
  let st = 0; for (let i = 1; i <= 60; i++) { if (((S.daily[add(td, -i)] || {}).w || 0) >= P.waterGoal) st++; else break; }
  const su = st >= 3 && saat >= 12 && (r.w || 0) < P.waterGoal;
  const bmiOk = !(P.goalWeight / (P.heightCm / 100) ** 2 < 18.5);
  return { guvenlik, hizli, gap, left, site, rem, protein, st, su, bmiOk, w, shots };
}

const KOTU = /NaN|undefined|null|Infinity|\[object|−0,0|-0,0|\$\{/;

(async () => {
  // www/ klasörünü yerel sunucudan aç (localStorage için http gerekir)
  const srv = http.createServer((q, s) => { const f = path.join(ROOT, 'www', decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html'));
    fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html; charset=utf-8' : f.endsWith('.css') ? 'text/css' : 'application/octet-stream' }); s.end(b); }); });
  await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
  const b = await chromium.launch(); const page = await b.newPage({ locale: 'tr-TR', timezoneId: 'Europe/Istanbul', deviceScaleFactor: 2 });
  const hatalar = []; page.on('pageerror', e => hatalar.push('sayfa: ' + e.message));
  await page.clock.install({ time: new Date(SIM_DAY + 'T09:00:00+03:00') });
  await page.addInitScript(() => { localStorage.setItem('doz-defteri', JSON.stringify({ profile: { onboarded: true, disclaimer: '2026-01-01', since: '2026-01-01', usesShots: false }, weights: [], shots: [], daily: {} })); });
  await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForTimeout(1500);

  const rapor = { kullanici: N, degerlendirme: 0, kartli: 0, turler: {}, hatalar: [], tipler: {} };
  const ornek = {};
  const hata = (u, saat, m, c) => { if (rapor.hatalar.length < 200) rapor.hatalar.push({ kullanici: u, saat, hata: m, kart: c && { id: c.id, t: c.t, b: c.b } }); };

  for (let u = 0; u < N; u++) {
    const { S, tip } = kullanici(u); rapor.tipler[tip] = (rapor.tipler[tip] || 0) + 1;
    for (const saat of [9, 17, 21]) {
      await page.clock.setFixedTime(new Date(`${SIM_DAY}T${String(saat).padStart(2, '0')}:30:00+03:00`));
      const sonuc = await page.evaluate(([st, dis]) => {
        const K = window.__hafifKoc, d = new Date(), td = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const S = JSON.parse(st); S.coach = dis ? { d: td, x: dis } : {}; K.set(S);
        try { const cards = K.cards(), p = K.pick(); return { cards: cards.map(c => ({ ...c })), pick: p && p.id, today: td, html: p ? K.html() : '' }; }
        catch (e) { return { err: e.message + ' ' + (e.stack || '').split('\n')[1] }; }
      }, [JSON.stringify(S), null]);
      rapor.degerlendirme++;
      if (sonuc.err) { hata(u, saat, 'çalışma hatası: ' + sonuc.err); continue; }
      if (sonuc.today !== SIM_DAY) { hata(u, saat, 'saat ayarı tutmadı: ' + sonuc.today); continue; }
      const C = sonuc.cards, ids = C.map(c => c.id), B = beklenen(S, saat), has = id => ids.includes(id), get = id => C.find(c => c.id === id);
      if (sonuc.pick) { rapor.kartli++; rapor.turler[sonuc.pick] = (rapor.turler[sonuc.pick] || 0) + 1; }
      if (new Set(ids).size !== ids.length) hata(u, saat, 'aynı kart iki kez', null);
      for (const c of C) {
        const metin = [c.k, c.t, c.b, ...(c.l || []), ...((c.ch || []).map(x => x.join(' ')))].join(' | ');
        if (KOTU.test(metin)) hata(u, saat, 'bozuk metin', c);
        if (c.t.length > 60) hata(u, saat, 'başlık çok uzun', c);
        if ((c.b || '').replace(/<[^>]+>/g, '').length > 280) hata(u, saat, 'metin çok uzun', c);
        (ornek[c.id] = ornek[c.id] || []).length < 3 && !ornek[c.id].some(o => o.t === c.t) && ornek[c.id].push({ ...c, saat, tip });
      }
      // güvenlik
      if (B.guvenlik !== has('guvenlik')) hata(u, saat, `güvenlik kartı beklenen=${B.guvenlik} çıkan=${has('guvenlik')}`);
      if (B.guvenlik && sonuc.pick !== 'guvenlik') hata(u, saat, 'güvenlik kartı öne çıkmadı: ' + sonuc.pick);
      // hız
      if (B.hizli !== has('hizli')) hata(u, saat, `hızlı kayıp beklenen=${B.hizli} çıkan=${has('hizli')}`);
      if ((B.hizli || !B.bmiOk) && (has('tarti') || has('esik'))) hata(u, saat, 'hızlı kayıpta ya da düşük hedefte kilo motivasyonu çıktı');
      // dönüş
      if ((B.gap != null && B.gap >= 3) !== has('donus')) hata(u, saat, `dönüş beklenen gap=${B.gap} çıkan=${has('donus')}`);
      // iğne
      if (!B.shots && ['yarin', 'bugun', 'gecikti', 'bulanti'].some(has)) hata(u, saat, 'iğne kullanmayana iğne kartı');
      if (B.shots && B.left === 1 !== has('yarin')) hata(u, saat, `yarın kartı left=${B.left}`);
      if (has('yarin') && !get('yarin').t.includes(B.site)) hata(u, saat, 'yarın kartında bölge yanlış: beklenen ' + B.site, get('yarin'));
      if (B.shots && B.left === 0 !== has('bugun')) hata(u, saat, `bugün kartı left=${B.left}`);
      if (B.shots && (B.left < 0 && B.left >= -3) !== has('gecikti')) hata(u, saat, `gecikti kartı left=${B.left}`);
      if (has('gecikti') && !get('gecikti').t.includes(String(-B.left))) hata(u, saat, 'gecikme günü yanlış', get('gecikti'));
      if (has('bulanti') && /döngünde/.test(get('bulanti').b)) { const cyc = +get('bulanti').b.match(/Son (\d+) döngünde/)[1]; if (cyc < 3) hata(u, saat, 'örüntü 3 döngüden azla kuruldu', get('bulanti')); }
      // tartı
      if (has('tarti')) { const w = B.w, L = w[w.length - 1], P2 = w[w.length - 2];
        if (w.length < 6 || diff(w[0].date, L.date) < 14 || L.date !== SIM_DAY || L.kg - P2.kg < 0.3 - 1e-9) hata(u, saat, 'tartı kartı eşik altında çıktı', get('tarti'));
        const fark = L.kg - P2.kg, d = fark.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        if (fark > 2.5 ? !(get('tarti').t.includes(d + ' kg fazla') && get('tarti').a[0][1] === 'edit:' + L.id) : !get('tarti').t.includes('+' + d)) hata(u, saat, 'tartı farkı/türü yanlış: ' + d, get('tarti')); }
      // eşik
      if (has('esik')) { const m = get('esik').t.match(/([\d,]+) kg kaldı/); const v = m && +m[1].replace(',', '.'); if (!(v > 0 && v <= 0.6)) hata(u, saat, 'eşik mesafesi aralık dışı', get('esik')); }
      // protein
      if (B.protein !== has('protein')) hata(u, saat, `protein kartı beklenen=${B.protein} çıkan=${has('protein')}`);
      if (has('protein')) { const pr = get('protein'), hic = !((S.daily[SIM_DAY] || {}).p > 0);
        if (hic ? !pr.t.includes('kaydı yok') : !pr.t.includes(`${Math.round(B.rem)} g`)) hata(u, saat, 'protein kalan yanlış: ' + B.rem, pr);
        if (saat >= 20 && /Akşama/.test(pr.t)) hata(u, saat, 'akşam 20 sonrası "Akşama" dendi', pr);
        if (get('protein').ch.some(x => x[2] > B.rem + 10)) hata(u, saat, 'protein önerisi kalandan çok büyük', get('protein')); }
      // su
      if (B.su !== has('su')) hata(u, saat, `su kartı beklenen=${B.su} (seri ${B.st}) çıkan=${has('su')}`);
      if (has('su') && !get('su').t.startsWith(B.st + ' gün')) hata(u, saat, 'su serisi sayısı yanlış: ' + B.st, get('su'));
      for (const c of C) if (/Kaleminde 0 doz|\d\. gün ve \d\. gün/.test(c.b || '')) hata(u, saat, 'dil hatası', c);
      // seçim kuralları: sıralama ve günde en fazla 2 kart
      if (C.length && !B.guvenlik && sonuc.pick !== C[0].id) hata(u, saat, 'seçilen kart ilk uygun kart değil: ' + sonuc.pick + ' / ' + C[0].id);
      if (C.length >= 1) {
        const secim = x => page.evaluate(([st, x, td]) => { const S = JSON.parse(st); S.coach = { d: td, x }; window.__hafifKoc.set(S); const p = window.__hafifKoc.pick(); return p && p.id; }, [JSON.stringify(S), x, SIM_DAY]);
        const r2 = await secim(['a', 'b']);
        if (B.guvenlik ? r2 !== 'guvenlik' : r2 !== null) hata(u, saat, 'iki kart kapatıldıktan sonra yine kart çıktı: ' + r2);
        const r3 = await secim([C[0].id]);
        const bek = B.guvenlik ? 'guvenlik' : (C.find(c => c.id !== C[0].id) || {}).id || null;
        if (r3 !== bek) hata(u, saat, `kapatılan kart yerine beklenen=${bek} çıkan=${r3}`);
      }
    }
  }
  // her kart türünden bir örneği uygulamanın kendi görünümüyle çiz (onay için)
  const sira = ['guvenlik', 'hizli', 'donus', 'yarin', 'bugun', 'gecikti', 'bulanti', 'tarti', 'esik', 'protein', 'su'];
  const secilen = sira.flatMap(id => (ornek[id] || []).slice(0, id === 'tarti' || id === 'protein' ? 2 : 1));
  await page.setViewportSize({ width: 412, height: 900 });
  await page.evaluate(L => { const v = document.querySelector('#view'); document.querySelector('nav.tabs') && (document.querySelector('nav.tabs').style.display = 'none');
    v.innerHTML = '<section>' + L.map(c => `<div class="eyebrow" style="color:var(--muted);margin:14px 4px 6px">${c.id} · ${c.saat}:30 · ${c.tip}</div>` + window.__hafifKoc.html(c)).join('') + '</section>'; window.scrollTo(0, 0); }, secilen);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'koc-ornekler.png'), fullPage: true });
  rapor.hatalar.push(...hatalar.slice(0, 20));
  rapor.sonuc = rapor.hatalar.length ? 'SORUN VAR' : 'BAŞARILI';
  rapor.kartOrani = Math.round(rapor.kartli / rapor.degerlendirme * 100) + '%';
  fs.writeFileSync(path.join(OUT, 'koc-rapor.json'), JSON.stringify(rapor, null, 2));
  fs.writeFileSync(path.join(OUT, 'koc-ornekler.json'), JSON.stringify(ornek, null, 2));
  console.log(JSON.stringify({ sonuc: rapor.sonuc, degerlendirme: rapor.degerlendirme, kartOrani: rapor.kartOrani, turler: rapor.turler, hataSayisi: rapor.hatalar.length, ilkHatalar: rapor.hatalar.slice(0, 8) }, null, 2));
  await b.close(); srv.close();
  process.exit(rapor.hatalar.length ? 1 : 0);
})();
