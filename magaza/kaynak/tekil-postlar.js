// Instagram tekil gönderileri (1080x1350): 1 reklam görseli + özellik başına bir gönderi.
// Önce ekran-goruntuleri.js ve bildirimler.js çalıştırılmış olmalı.
// Çalıştırma: node magaza/kaynak/tekil-postlar.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'magaza/instagram/tekil');
fs.mkdirSync(OUT, { recursive: true });

const R = {
  kilo: { ana: '#0E7C66', koyu: '#0B3B33', acik: '#E1F3EC', zemin: ['#E6F4EE', '#CDEBDF'] },
  igne: { ana: '#3552B0', koyu: '#1C2B66', acik: '#E8EDFA', zemin: ['#EDF1FB', '#D5DEF6'] },
  su: { ana: '#2C8FE0', koyu: '#123F66', acik: '#E7F3F6', zemin: ['#EAF4FB', '#CFE6F5'] },
  adim: { ana: '#E0507A', koyu: '#7A1F3C', acik: '#FCE8EF', zemin: ['#FDEFF3', '#F8D3DF'] },
  rozet: { ana: '#B8892A', koyu: '#5C4210', acik: '#FBF1DC', zemin: ['#FBF5E6', '#F2E3BF'] },
  takviye: { ana: '#7B5BD0', koyu: '#3A2378', acik: '#EEE9FB', zemin: ['#F2EEFC', '#DFD6F6'] },
};
const svgI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  yaprak: svgI('<path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/><path d="M9 14l5-5"/>'),
  koc: svgI('<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>'),
  grafik: svgI('<path d="M4 19h16"/><path d="M5 15l4-4 3 2 6-6"/>'),
  kalem: svgI('<path d="M18 3l3 3M16 5l3 3-9 9H7v-3z"/>'),
  nabiz: svgI('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
  damla: svgI('<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>'),
  hap: svgI('<rect x="2.8" y="8.2" width="18.4" height="7.6" rx="3.8" transform="rotate(-40 12 12)"/><path d="M9.6 9.1l5.1 6.1"/>'),
  adim: svgI('<path d="M8.5 3.5c1.6 0 2.5 1.6 2.5 3.8S10 11 8.6 11 6 9.5 6 7.3s.9-3.8 2.5-3.8zM6.6 13h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/><path d="M15.5 7.5c1.6 0 2.5 1.6 2.5 3.8S17 15 15.6 15 13 13.5 13 11.3s.9-3.8 2.5-3.8zM13.6 17h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/>'),
  olcu: svgI('<path d="M3.5 8.5h17v7h-17z"/><path d="M7 8.5v3M10.5 8.5v4M14 8.5v3M17.5 8.5v4"/>'),
  rapor: svgI('<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 17v-3M12 17v-5M15 17v-2"/>'),
  widget: svgI('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="17" height="7" rx="2"/>'),
  zil: svgI('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  rozet: svgI('<circle cx="12" cy="9" r="6"/><path d="M8.5 13.8 7 21l5-2.6L17 21l-1.5-7.2"/>'),
  kilit: svgI('<rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  ay: svgI('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  kisi: svgI('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M4 4l16 16"/>'),
  reklam: svgI('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M8 15l2-6 2 6M8.7 13h2.6M15 9v6h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/><path d="M3 3l18 18"/>'),
  telefon: svgI('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
  yedek: svgI('<path d="M12 3v11M7.5 9.5 12 14l4.5-4.5"/><path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/>'),
};

const CSS = r => `
html,body{margin:0}
.s{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:${r.koyu};
  background:radial-gradient(100% 60% at 100% 0%,${r.zemin[1]} 0%,transparent 60%),radial-gradient(90% 55% at 0% 100%,${r.zemin[1]} 0%,transparent 65%),${r.zemin[0]}}
.s.koyu{color:#fff;background:radial-gradient(90% 70% at 85% 0%,#1F8A70 0%,transparent 60%),linear-gradient(160deg,#0D4237,#051D18)}
.bar{position:absolute;left:72px;right:72px;top:60px;display:flex;justify-content:space-between;align-items:center;font:700 30px Outfit}
.bar .m{display:flex;align-items:center;gap:12px}.bar svg{width:34px;height:34px;color:${r.ana}}.koyu .bar svg{color:#9FF0D6}
.pl{background:#0B3B33;color:#9FF0D6;border-radius:99px;padding:10px 20px;font:700 22px Figtree;letter-spacing:.06em}
.koyu .pl{background:#9FF0D6;color:#0B3B33}
.ust{position:absolute;left:72px;right:72px;top:150px}
.etk{display:inline-flex;align-items:center;gap:12px;background:#fff;border-radius:99px;padding:10px 24px 10px 12px;font:700 26px Figtree;color:${r.ana};box-shadow:0 10px 30px -18px ${r.koyu}66}
.etk i{width:42px;height:42px;border-radius:50%;background:${r.acik};display:grid;place-items:center;padding:9px;box-sizing:border-box}
h1{margin:26px 0 0;font:700 92px/1.02 Outfit;letter-spacing:-.02em}
h1 em{font-style:normal;color:${r.ana}}.koyu h1 em{color:#9FF0D6}
p{margin:22px 0 0;font:500 32px/1.4 Figtree;opacity:.75;max-width:900px}
.tel{position:absolute;left:50%;width:560px;height:1150px;margin-left:-280px;background:#0B2420;border-radius:76px;padding:16px;box-sizing:border-box;box-shadow:0 50px 100px -40px ${r.koyu}AA,0 0 0 2px #2A4A43 inset;overflow:hidden}
.tel img{display:block;width:100%;border-radius:60px 60px 0 0}
.kart{position:absolute;display:flex;align-items:center;gap:18px;background:#fff;color:${r.koyu};border-radius:28px;padding:20px 30px 20px 20px;box-shadow:0 36px 70px -28px ${r.koyu}88;z-index:3}
.kart i{width:72px;height:72px;border-radius:20px;padding:17px;box-sizing:border-box;background:${r.acik};color:${r.ana};display:block}
.kart small{display:block;font:600 22px Figtree;opacity:.6}.kart b{display:block;font:700 44px Outfit;white-space:nowrap}
.liste{position:absolute;left:72px;right:72px;display:flex;flex-direction:column;gap:20px}
.liste div{display:flex;align-items:center;gap:26px;background:#fff;color:${r.koyu};border-radius:34px;padding:28px 34px;box-shadow:0 26px 54px -34px ${r.koyu}77}
.liste i{flex:none;width:84px;height:84px;border-radius:24px;background:${r.acik};color:${r.ana};padding:19px;box-sizing:border-box}
.liste b{display:block;font:700 38px Outfit}.liste span span{display:block;font:500 27px/1.35 Figtree;opacity:.7;margin-top:4px}
.not{position:absolute;left:72px;right:72px;bottom:44px;font:500 21px/1.4 Figtree;opacity:.6}
`;
const bar = plus => `<div class="bar"><span class="m">${I.yaprak}Hafif</span>${plus ? '<span class="pl">✦ PLUS</span>' : ''}</div>`;
const ust = (r, ic, etk, h, sub) => `<div class="ust"><span class="etk"><i style="color:${r.ana}">${ic}</i>${etk}</span><h1>${h[0]}<br><em>${h[1]}</em></h1>${sub ? `<p>${sub}</p>` : ''}</div>`;
const tel = (img, top, ofs = 0) => `<div class="tel" style="top:${top}px"><img src="../../ekran/${img}" style="margin-top:${-ofs}px"></div>`;
const kart = (ic, a, b, css) => `<div class="kart" style="${css}"><i>${ic}</i><div><small>${a}</small><b>${b}</b></div></div>`;
const liste = (top, rows) => `<div class="liste" style="top:${top}px">${rows.map(([ic, b, s]) => `<div><i>${ic}</i><span><b>${b}</b><span>${s}</span></span></div>`).join('')}</div>`;
const NOT_IGNE = 'Genel bilgilendirmedir, tıbbi tavsiye değildir.';

const P = [];
// 00 · Reklam görseli: ilaç/iğne sözcüğü yok (Meta reklam politikası: reçeteli ilaç tanıtımı sertifika ister)
P.push({ ad: '00-reklam', r: 'kilo', koyu: 1, html: `${bar()}
  <div class="ust" style="top:150px"><h1 style="font-size:104px">Kilo vermenin<br><em>en hafif yolu.</em></h1>
  <p style="opacity:.82">Tartı, protein, su, adım ve takviyelerin tek sade uygulamada. Seni tanıyan kişisel bir koçla.</p></div>
  <div class="tel" style="top:620px;left:76%;transform:rotate(5deg);width:460px;height:960px;margin-left:-230px"><img src="../../ekran/05-kilo.png"></div>
  <div style="position:absolute;left:72px;top:660px;display:flex;flex-direction:column;gap:16px;width:420px">
    ${[['koc', 'Kişisel koç'], ['grafik', 'Kilo eğrisi ve rozetler'], ['damla', 'Protein ve su'], ['hap', 'Takviye programı'], ['adim', 'Adım ve akıllı tartı'], ['kilit', 'Hesap yok, reklam yok']].map(([k, t]) => `<div style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,.08);border:1.5px solid rgba(159,240,214,.3);border-radius:22px;padding:14px 20px;font:600 27px Figtree"><i style="width:46px;height:46px;border-radius:14px;background:#9FF0D6;color:#0B3B33;padding:10px;box-sizing:border-box;display:block">${I[k]}</i>${t}</div>`).join('')}
  </div>
  <div style="position:absolute;left:72px;bottom:60px;background:#9FF0D6;color:#0B3B33;border-radius:99px;padding:20px 40px;font:700 32px Figtree">Google Play'de ücretsiz</div>` });

const T = (ad, r, ic, etk, h, sub, img, k, plus, extra) => P.push({ ad, r, html: `${bar(plus)}${ust(R[r], ic, etk, h, sub)}${img ? tel(img, 600) : ''}${k || ''}${extra || ''}` });
T('01-koc', 'kilo', I.koc, 'Kişisel koç', ['Seni tanıyan', 'bir koç.'], 'Kayıtlarına bakar, doğru anda tek bir öneri verir. Hepsi telefonunda hesaplanır.', '16-koc.png', kart(I.nabiz, 'Son 9 iğnene göre', 'Sana özel öneri', 'right:40px;top:1010px;transform:rotate(3deg)'));
T('02-kilo', 'kilo', I.grafik, 'Kilo takibi', ['Her tartı', 'bir adım.'], 'Değişimin, haftalık hızın ve hedefe kalan yolun tek bakışta.', '05-kilo.png', kart(I.grafik, 'Haftalık hız', '−0,9 kg', 'left:40px;top:1020px;transform:rotate(-3deg)'));
T('03-dongu', 'igne', I.kalem, 'İğne takibi · isteğe bağlı', ['Haftanı', 'tanı.'], 'Hangi evrede olduğunu, sıradaki iğneni ve önerilen bölgeyi gör.', '02-dongu.png', kart(I.kalem, 'Sıradaki iğne', '4 gün sonra', 'right:40px;top:1010px;transform:rotate(3deg)'));
T('04-yan-etki', 'igne', I.nabiz, 'Yan etki günlüğü', ['Yan etkilerini', 'öngör.'], 'Belirtilerini tek dokunuşla kaydet; iğneden sonraki hangi günlerde yoğunlaştığını gör.<br><small style="font-size:22px;opacity:.75">' + NOT_IGNE + '</small>', '11-yan-etkiler.png', kart(I.nabiz, 'En yoğun gün', 'İğneden 1 gün sonra', 'left:40px;top:1030px;transform:rotate(-3deg)'));
T('05-protein-su', 'su', I.damla, 'Protein ve su', ['Protein ve su', 'hep hedefte.'], 'Yediklerin hedefini doldurur; suyu tek dokunuşla eklersin.', '07-protein-su.png', kart(I.damla, 'Bugün', '74 g · 1.750 ml', 'left:40px;top:1030px;transform:rotate(-3deg)'));
T('06-takviye', 'takviye', I.hap, 'Takviyeler', ['Sabah, öğle,', 'akşam, gece.'], 'Kendi programını kur; aynı takviyeyi günde birkaç kez ekle, aldıkça işaretle.', '08-takviyeler.png', kart(I.hap, 'Bugün', '3/4 alındı', 'right:40px;top:1020px;transform:rotate(3deg)'));
T('07-adim', 'adim', I.adim, 'Adım ve akıllı tartı', ['Her adım', 'sayılır.'], 'Health Connect ile adımların ve akıllı tartının ölçümleri kendiliğinden gelir.', '10-adimlar.png', kart(I.adim, 'Bu hafta ortalama', '8.240 adım', 'right:40px;top:1010px;transform:rotate(3deg)'));
T('08-olculer', 'kilo', I.olcu, 'Vücut ölçüleri', ['Tartı dursa da', 'santimler konuşur.'], 'Bel, kalça, göğüs, kol ve uyluk ölçülerini kaydet; değişimi gör.', '13-olculer.png', kart(I.olcu, 'Bel çevresi', '−9 cm', 'left:40px;top:1020px;transform:rotate(-3deg)'));
P.push({ ad: '09-rapor', r: 'kilo', html: `${bar(1)}${ust(R.kilo, I.rapor, 'Doktor raporu', ['Kontrole', 'hazır git.'], 'Kilo, doz, yan etki ve ölçülerin tek PDF raporda; doktoruna telefondan göster.')}
  <div style="position:absolute;left:330px;top:620px;width:640px;background:#fff;border-radius:12px;overflow:hidden;transform:rotate(5deg);box-shadow:0 50px 100px -40px #0B3B33AA"><img src="../../ekran/rapor-2.png" style="display:block;width:100%"></div>
  <div style="position:absolute;left:90px;top:580px;width:640px;background:#fff;border-radius:12px;overflow:hidden;transform:rotate(-4deg);box-shadow:0 50px 100px -40px #0B3B33AA;z-index:2"><img src="../../ekran/rapor-1.png" style="display:block;width:100%"></div>` });
P.push({ ad: '10-widget', r: 'kilo', koyu: 1, html: `${bar(1)}${ust(R.kilo, I.widget, 'Ana ekran widget\'ları', ['Açmadan', 'bak, ekle.'], '10 widget: sıradaki iğne, kilo, su, protein, adım, takviye. +250 ml su tek dokunuşla.')}
  <div style="position:absolute;left:72px;right:72px;top:640px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px">
    ${[1, 6, 8, 3, 7].map(k => `<img src="../../../android/app/src/main/res/drawable-nodpi/widget_prev_${k}.png" style="width:100%;${k === 3 ? 'grid-column:span 2;' : ''}border-radius:28px;box-shadow:0 30px 60px -30px #000">`).join('')}
  </div>` });
P.push({ ad: '11-hatirlatici', r: 'kilo', html: `${bar()}${ust(R.kilo, I.zil, 'Hatırlatıcılar', ['Hiçbir şeyi', 'unutma.'], 'İğne günü, takviyeler, su, protein, tartı ve kalem stoğu; bildirimden tek dokunuşla kaydet.')}
  <div class="tel" style="top:640px"><img src="../../bildirim/kilit-ekrani.png" style="border-radius:60px"></div>` });
T('12-kalem', 'igne', I.kalem, 'Kalem stoğu', ['Kalemin bitmeden', 'haber al.'], 'Kaleminde kaç doz kaldığını izle; son doza gelince hatırlatalım.', '12-kalem.png', kart(I.kalem, 'Kalemde kalan', '2 doz', 'right:40px;top:1020px;transform:rotate(3deg)'));
T('13-rozet', 'rozet', I.rozet, 'Rozetler ve paylaşım', ['Her eşik', 'bir kutlama.'], 'Ara hedeflere ulaştıkça rozet kazan; ilerlemeni şık bir kartla paylaş.', '04-rozetler.png', kart(I.rozet, 'Yeni rozet', '90 kg\'ın altı', 'left:40px;top:1020px;transform:rotate(-3deg)'));
P.push({ ad: '14-gizlilik', r: 'kilo', html: `${bar()}${ust(R.kilo, I.kilit, 'Gizlilik', ['Verilerin', 'sende kalır.'], '')}
  ${liste(480, [[I.kisi, 'Hesap yok', 'Kayıt olmadan hemen başla.'], [I.reklam, 'Reklam ve takip yok', 'Hiçbir veri sunucuya gitmez.'], [I.telefon, 'İnternetsiz çalışır', 'Her şey telefonunda saklanır.'], [I.yedek, 'Yedekle, taşı', 'Yedek dosyası ve Excel\'e aktarma.']])}` });
P.push({ ad: '15-koyu-tema', r: 'kilo', koyu: 1, html: `${bar()}${ust(R.kilo, I.ay, 'Koyu tema', ['Gece de', 'göz yormaz.'], 'Telefonunun ayarını izler ya da Açık / Koyu olarak sen seç.')}${tel('14-karanlik-ozet.png', 600)}` });

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const f = path.join(OUT, '_t.html');
  for (const x of P) {
    fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../../www/fonts/fonts.css"><style>${CSS(R[x.r])}</style></head><body><div class="s${x.koyu ? ' koyu' : ''}">${x.html}</div></body></html>`);
    await p.goto('file://' + f);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: path.join(OUT, x.ad + '.png') });
  }
  fs.unlinkSync(f);
  await b.close();
  console.log(P.length + ' gönderi:', OUT);
})();
