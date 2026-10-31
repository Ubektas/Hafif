/* Yalnızca iOS simülatör testinde sayfaya eklenir (GitHub Actions): ilk açılışta örnek verilerle dolu bir hesap hazırlar.
   Uygulamanın kendisinde yoktur; mağaza görüntüleri ve ekran testleri içindir. Sayılar örnektir. */
(function () {
  try {
    if (localStorage.getItem('doz-defteri')) return;
    var ago = function (n) { var d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
    var td = ago(0), t0 = new Date(td + 'T00:00:00').getTime();
    var S = {
      profile: { drug: '', startWeight: 96.2, goalWeight: 82, heightCm: 176, intervalDays: 7, onboarded: true, disclaimer: ago(1), since: ago(1),
        proteinGoal: 110, waterGoal: 2500, stepGoal: 7500, theme: 'sys', sex: 'm', age: 41 },
      weights: [], shots: [], daily: {}, steps: {}
    };
    var kg = [96.2, 95.6, 95.1, 94.8, 94.1, 93.7, 93.2, 92.9, 92.3, 91.9, 91.6, 91.0, 90.7, 90.2, 89.8, 89.5, 89.1, 88.6];
    kg.forEach(function (k, i) { S.weights.push({ id: 'w' + i, date: ago((kg.length - 1 - i) * 3), kg: k, t: i }); });
    var sites = ['Karın sol', 'Karın sağ', 'Uyluk sol', 'Uyluk sağ'];
    for (var i = 7; i >= 0; i--) S.shots.push({ id: 's' + i, date: ago(i * 7 + 2), time: '09:00', dose: i > 4 ? '2,5' : '5', site: sites[i % 4] });
    S.daily[td] = { p: 74, w: 1500, log: [[t0 + 8.4 * 36e5, 'p', 12, 'yumurta'], [t0 + 13 * 36e5, 'p', 31, 'tavuk'], [t0 + 16 * 36e5, 'p', 15, 'yogurt'], [t0 + 17 * 36e5, 'p', 16, 'peynir'], [t0 + 8 * 36e5, 'w', 750], [t0 + 13 * 36e5, 'w', 750]] };
    S.supps = [{ id: 'mg', name: 'Magnezyum', slot: 'aksam', days: [0, 1, 2, 3, 4, 5, 6], shape: 'caps', color: '#4F8FDB' },
      { id: 'om', name: 'Omega-3', slot: 'sabah', days: [0, 1, 2, 3, 4, 5, 6], shape: 'oval', color: '#E9D59A' },
      { id: 'd3', name: 'D vitamini', slot: 'sabah', days: [0, 1, 2, 3, 4, 5, 6], shape: 'tab', color: '#F1B3C3' }];
    S.suppTimes = { sabah: '08:30', ogle: '13:00', aksam: '21:00', gece: '23:30' };
    S.suppLog = {}; S.suppLog[td] = { 'om@sabah': t0 + 9 * 36e5, 'd3@sabah': t0 + 9 * 36e5 };
    S.hc = { on: true, last: Date.now() };
    [5820, 8110, 7340, 9020, 6480, 7900, 6240].forEach(function (n, j) { S.steps[ago(6 - j)] = n; });
    localStorage.setItem('doz-defteri', JSON.stringify(S));
  } catch (e) {}
})();
