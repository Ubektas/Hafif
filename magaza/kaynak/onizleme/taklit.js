/* Önizleme: uygulamanın içinde Android'in yerel parçalarını taklit eder (yalnızca tarayıcı önizlemesi için) */
(function () {
  var post = function (m) { m.hafif = 1; try { parent.postMessage(m, '*'); } catch (e) {} };
  var ls = {};
  window.addEventListener('message', function (e) { var d = e.data || {}; if (d.hafifLink && ls['App.appUrlOpen']) ls['App.appUrlOpen']({ url: d.hafifLink }); });
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var ago = function (n) { var d = new Date(); d.setDate(d.getDate() - n); return iso(d); };
  // örnek veriler (ilk açılışta)
  try {
    if (!localStorage.getItem('doz-defteri')) {
      var shots = [], weights = [], sides = {}, daily = {};
      var doses = ['2,5', '2,5', '2,5', '2,5', '5', '5', '5', '5', '5'], sites = ['Karın sol', 'Karın sağ', 'Uyluk sol', 'Uyluk sağ', 'Kol sol', 'Kol sağ'];
      for (var i = 0; i < 9; i++) shots.push({ id: 's' + i, date: ago(3 + 7 * (8 - i)), time: '09:00', dose: doses[i], site: sites[i % 6] });
      for (var g = 60; g >= 1; g -= 3) weights.push({ id: 'w' + g, date: ago(g), kg: +(98.4 - (60 - g) * 0.15 + Math.sin(g) * 0.25).toFixed(1), fat: +(34.2 - (60 - g) * 0.055).toFixed(1), t: g });
      for (var j = 0; j < 9; j++) { var sd = 3 + 7 * (8 - j); sides[ago(sd - 1)] = { bulanti: j < 4 ? 2 : 1, yorgun: 1 }; sides[ago(sd - 2)] = { bulanti: 1 }; }
      for (var n = 1; n <= 7; n++) daily[ago(n)] = { p: [96, 104, 88, 112, 99, 107, 92][n - 1], w: [2250, 2500, 2000, 2750, 2500, 2250, 2500][n - 1], log: [] };
      var t = Date.now();
      daily[ago(0)] = { p: 49, w: 1250, log: [[t - 8e6, 'p', 6, 'yumurta'], [t - 7.9e6, 'p', 6, 'yumurta'], [t - 7.8e6, 'p', 7, 'peynir'], [t - 4e6, 'p', 15, 'yogurt'], [t - 2e6, 'p', 15, 'bar'], [t - 6e6, 'w', 500], [t - 3e6, 'w', 750]] };
      var steps = {}; [8240, 10450, 4120, 9180, 5630, 9870, 6240].forEach(function (v, k) { steps[ago(6 - k)] = v; });
      localStorage.setItem('doz-defteri', JSON.stringify({
        profile: { onboarded: true, usesShots: true, disclaimer: ago(0), since: ago(0), drug: 'Mounjaro', startWeight: 98.4, goalWeight: 80, heightCm: 170, age: 41, sex: 'k', intervalDays: 7, proteinGoal: 110, waterGoal: 2500, stepGoal: 7500, penSize: 4, penLeft: 2, noCelebrate: true },
        weights: weights, shots: shots, sides: sides, daily: daily, steps: steps, hc: { on: true, last: t, wFrom: ago(0) },
        meas: [{ id: 'm1', date: ago(58), bel: 108, kalca: 121, kol: 37.5 }, { id: 'm2', date: ago(2), bel: 99, kalca: 115.5, kol: 35 }],
        supps: [{ id: 'mg', name: 'Magnezyum', slots: ['sabah', 'gece'], slot: 'sabah', days: [0, 1, 2, 3, 4, 5, 6], shape: 'caps', color: '#4F8FDB' }, { id: 'd3', name: 'D3 vitamini', slot: 'sabah', days: [1, 3, 5], shape: 'soft', color: '#F2C94C' }, { id: 'om', name: 'Omega-3', slot: 'aksam', days: [0, 1, 2, 3, 4, 5, 6], shape: 'oval', color: '#E9D59A' }],
        suppTimes: { sabah: '08:00', ogle: '13:00', aksam: '19:00', gece: '22:30' }, suppLog: (function () { var o = {}; o[ago(0)] = { mg: t - 9e6 }; return o; })()
      }));
    }
  } catch (e) {}
  // Google Play faturalandırma (deneme satın alma, ücret alınmaz)
  var owned = false; try { owned = localStorage.getItem('hf-plus') === '1'; } catch (e) {}
  var cb = {};
  var buy = function () { owned = true; try { localStorage.setItem('hf-plus', '1'); } catch (e) {} post({ t: 'toast', m: 'Deneme satın alma: Plus açıldı (ücret alınmadı)' }); setTimeout(function () { cb.r && cb.r(); }, 300); return Promise.resolve(); };
  var ph = function (p, m, b) { return { price: p, priceMicros: m, currency: 'TRY', billingPeriod: b, paymentMode: 'PayAsYouGo' }; };
  var offers = [
    { id: 'hafif_plus@aylik', canPurchase: true, pricingPhases: [ph('₺99,99', 99990000, 'P1M')], order: buy },
    { id: 'hafif_plus@uc-aylik', canPurchase: true, pricingPhases: [ph('₺229,99', 229990000, 'P3M')], order: buy },
    { id: 'hafif_plus@yillik', canPurchase: true, pricingPhases: [ph('₺499,99', 499990000, 'P1Y')], order: buy },
    { id: 'hafif_plus@yillik@deneme', canPurchase: true, pricingPhases: [{ price: 'Ücretsiz', priceMicros: 0, billingPeriod: 'P7D', paymentMode: 'FreeTrial' }, ph('₺499,99', 499990000, 'P1Y')], order: buy }
  ];
  var when = { approved: function () { return when; }, verified: function () { return when; }, receiptUpdated: function (f) { cb.r = f; return when; }, productUpdated: function () { return when; } };
  window.CdvPurchase = {
    ProductType: { PAID_SUBSCRIPTION: 'paid subscription' }, Platform: { GOOGLE_PLAY: 'android-playstore' }, ErrorCode: { PAYMENT_CANCELLED: 6777006 },
    store: { register: function () {}, when: function () { return when; }, initialize: function () { setTimeout(function () { cb.r && cb.r(); }, 200); return Promise.resolve([]); },
      get: function () { return { offers: offers }; }, owned: function () { return owned; }, restorePurchases: function () { return Promise.resolve(); },
      manageSubscriptions: function () { post({ t: 'toast', m: 'Burada Google Play abonelik sayfası açılırdı' }); return Promise.resolve(); } }
  };
  // Health Connect (örnek adımlar)
  var day0 = function (n) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; };
  var HOURS = [0, 0, 0, 0, 0, 0, 0, 420, 1650, 820, 380, 290, 1240, 560, 260, 300, 120, 200, 0, 0, 0, 0, 0, 0];
  var DAYS = [8240, 10450, 4120, 9180, 5630, 9870];
  window.Capacitor = {
    isNativePlatform: function () { return true; },
    addListener: function (p, e, f) { ls[p + '.' + e] = f; return { remove: function () {} }; },
    Plugins: {
      App: { getLaunchUrl: function () { return Promise.resolve({}); }, exitApp: function () {} },
      Filesystem: { writeFile: function (o) { if (o.path === 'widget.json') post({ t: 'wj', d: o.data }); return Promise.resolve({ uri: 'file:///' + o.path }); }, readFile: function () { return Promise.reject(new Error('yok')); } },
      Share: { share: function () { post({ t: 'toast', m: 'Burada Android paylaş penceresi açılırdı' }); return Promise.resolve({}); } },
      HafifWidget: { refresh: function () { return Promise.resolve(); }, preview: function () { return Promise.resolve({ files: '' }); } },
      InAppReview: { requestReview: function () { post({ t: 'toast', m: 'Burada Google Play değerlendirme penceresi açılırdı' }); return Promise.resolve(); } },
      LocalNotifications: {
        checkPermissions: function () { return Promise.resolve({ display: 'granted' }); }, requestPermissions: function () { return Promise.resolve({ display: 'granted' }); },
        registerActionTypes: function () { return Promise.resolve(); }, getPending: function () { return Promise.resolve({ notifications: [] }); }, cancel: function () { return Promise.resolve(); },
        schedule: function (o) { var L = o.notifications.slice().sort(function (a, b) { return new Date(a.schedule.at) - new Date(b.schedule.at); }).slice(0, 4).map(function (n) { return { title: n.title, body: n.body, at: +new Date(n.schedule.at) }; }); post({ t: 'notif', first: L }); return Promise.resolve({ notifications: o.notifications }); }
      },
      Health: {
        isAvailable: function () { return Promise.resolve({ available: true }); },
        requestAuthorization: function (o) { return Promise.resolve({ readAuthorized: o.read }); },
        readSamples: function () { return Promise.resolve({ samples: [] }); },
        openHealthConnectSettings: function () { post({ t: 'toast', m: 'Burada Health Connect ayarları açılırdı' }); return Promise.resolve(); },
        queryAggregated: function (o) {
          if (o.bucket === 'hour') return Promise.resolve({ samples: HOURS.map(function (v, i) { return { startDate: new Date(day0(0).getTime() + i * 36e5).toISOString(), value: v }; }) });
          return Promise.resolve({ samples: Array.from({ length: 30 }, function (_, i) { return { startDate: day0(29 - i).toISOString(), value: i === 29 ? 6240 : DAYS[i % DAYS.length] }; }) });
        }
      }
    }
  };
  setTimeout(function () { document.dispatchEvent(new Event('deviceready')); }, 400);
})();
