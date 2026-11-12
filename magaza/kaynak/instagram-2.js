// Instagram 2. set: 10 gönderi, her biri gönderi (1080×1350) ve hikâye (1080×1920) boyunda.
// Eski setten (telefon çerçevesi + başlık) farklı olarak her gönderi başka bir format: lansman, bir günüm, bildirimler,
// mit/gerçek, ana ekran, önce/sonra, rozetler, iğne haftası ipuçları, son 7 gün, gizlilik manifestosu.
// Hikâyede Instagram arayüzü için üstte ~250, altta ~340 piksel boş kalır; içerik flex ile ortalanır.
// Kişisel veri ya da gerçek fotoğraf yok; sayılar örnektir. Çalıştırma: node magaza/kaynak/instagram-2.js [playwright modül yolu]
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(ROOT, 'magaza/instagram-2');
fs.mkdirSync(OUT, { recursive: true });
const Z = '#0B3B33', N = '#9FF0D6', K = '#F4F1EA', AC = '#0E7C66', INK = '#0B2420', MU = '#5F726C';
const WI = f => `file://${ROOT}/magaza/kaynak/aso/widget-ios/${f}`;
const leaf = (c, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/><path d="M9 15l6-6"/></svg>`;

const sayfa = (H, tema, govde, css = '') => {
  const st = H > 1500;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}
.s{width:1080px;height:${H}px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;display:flex;flex-direction:column;
  padding:${st ? '250px 84px 360px' : '84px 84px 80px'};${tema === 'dk' ? `background:radial-gradient(70% 45% at 100% 0%,#1F8A70 0%,transparent 60%),${Z};color:#fff` : `background:${K};color:${INK}`}}
.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
.lg{display:flex;align-items:center;gap:12px;font:700 36px Outfit;letter-spacing:-.02em}.lg svg{width:40px;height:40px}
.kick{display:inline-block;margin-top:${st ? 46 : 38}px;font:700 22px Figtree;letter-spacing:.14em;text-transform:uppercase;color:${tema === 'dk' ? N : AC}}
h1{margin:18px 0 0;font:700 ${st ? 92 : 84}px/1.02 Outfit;letter-spacing:-.04em}h1 em{font-style:normal;color:${tema === 'dk' ? N : AC}}
.sub{margin-top:22px;font:500 32px/1.4 Figtree;color:${tema === 'dk' ? 'rgba(255,255,255,.74)' : '#4E6B63'}}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
.foot{display:flex;justify-content:space-between;align-items:center;font:600 24px Figtree;color:${tema === 'dk' ? 'rgba(255,255,255,.6)' : MU}}
.card{background:#fff;color:${INK};border-radius:40px;box-shadow:0 34px 70px -40px rgba(11,59,51,.45)}
${css}</style></head><body><div class="s">${govde}</div></body></html>`;
};
const ust = (tema, kick, h, sub) => `<div class="lg">${leaf(tema === 'dk' ? N : AC)}Hafif</div>${kick ? `<span class="kick">${kick}</span>` : ''}<h1>${h}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}`;
const alt = (sol, sag = 'App Store · Google Play') => `<div class="foot"><span>${sol}</span><span>${sag}</span></div>`;

/* 1 · Lansman: büyük tipografi, iki mağaza rozeti */
const p1 = H => sayfa(H, 'dk', `${ust('dk', 'Yeni', 'Hafif artık<br><em>iPhone\'da da.</em>', 'Kilo, protein, su, adım ve haftalık iğne takibi; tek uygulamada, hesapsız.')}
<div class="mid"><div class="badges">
<div class="bd"><span class="bi">${leaf(Z, 2)}</span><div><small>İndir</small><b>App Store</b></div></div>
<div class="bd"><span class="bi">${leaf(Z, 2)}</span><div><small>İndir</small><b>Google Play</b></div></div></div>
<div class="chips">${['Kişisel koç', 'Ne yesem?', 'Widget\'lar', 'Rozetler', 'Doktor raporu'].map(x => `<span>${x}</span>`).join('')}</div></div>
${alt('İlk 7 gün tüm Plus özellikleri açık', 'Hesap yok · Reklam yok')}`,
`.badges{display:flex;flex-direction:column;gap:24px}.bd{display:flex;align-items:center;gap:26px;background:#fff;color:${INK};border-radius:36px;padding:30px 36px;box-shadow:0 40px 70px -40px rgba(0,0,0,.6)}
.bi{width:96px;height:96px;border-radius:26px;background:${N};display:grid;place-items:center}.bi svg{width:56px;height:56px}
.bd small{display:block;font:600 24px Figtree;color:${MU}}.bd b{font:700 52px Outfit;letter-spacing:-.02em}
.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:40px}.chips span{border:2px solid rgba(159,240,214,.35);border-radius:99px;padding:14px 24px;font:600 26px Figtree;color:#E9FFF7}`);

/* 2 · Bir günüm: zaman çizelgesi, protein dolan çubuk */
const gun = [['08:30', '🍳', 'Menemen ve beyaz peynir', 19], ['11:00', '🥛', 'Protein tozu, 30 g', 24], ['13:30', '🍗', 'Tavuk şiş ve bulgur', 34], ['17:00', '🥣', 'Yoğurt ve ceviz', 12], ['20:00', '🍲', 'Mercimek çorbası', 14]];
const p2 = H => { const st = H > 1500; let t = 0; return sayfa(H, 'lt', `${ust('lt', 'Bir günüm', 'İştahım yokken<br><em>110 gram protein.</em>', 'Ne yesem? kalan proteinine ve saate göre öneriyor; dokun, eklensin.')}
<div class="mid"><div class="card tl">${gun.map(([s, e, n, g]) => { t += g; return `<div class="r"><span class="tm">${s}</span><span class="e ic">${e}</span><span class="nm">${n}</span><b>+${g} g</b></div>`; }).join('')}
<div class="bar"><i style="width:${Math.min(100, t / 110 * 100)}%"></i></div><div class="tot"><span>Bugün</span><b>${t} / 110 g</b></div></div></div>
${alt('Örnek bir gün')}`,
`.tl{padding:${st ? 40 : 30}px 40px}.r{display:grid;grid-template-columns:96px 72px 1fr auto;align-items:center;gap:14px;padding:${st ? 20 : 15}px 0;border-bottom:2px solid #EEF2F0}
.tm{font:600 26px Figtree;color:${MU}}.ic{font-size:50px}.nm{font:600 31px Figtree}.r b{font:700 32px Outfit;color:#C27A12}
.bar{margin-top:28px;height:26px;border-radius:99px;background:#F3E3C8;overflow:hidden}.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#E0A23A,#C27A12)}
.tot{display:flex;justify-content:space-between;margin-top:14px;font:600 28px Figtree;color:${MU}}.tot b{font:700 34px Outfit;color:${INK}}`); };

/* 3 · Bildirimler: kilit ekranı bildirim yığını */
const bil = [['💧', 'Su zamanı', 'Bugün 1,2 L içtin. Bir bardak daha?', 'şimdi', '+250 ml'], ['💉', 'Yarın iğne günün', 'Önerilen bölge: karın, sağ.', '18:00', ''], ['💊', 'Akşam takviyelerin', 'Magnezyum ve D vitamini', '21:00', 'Hepsini aldım'], ['🥚', '36 g protein kaldı', 'Akşam için: tavuk şiş ve bulgur', '19:30', '']];
const p3 = H => { const st = H > 1500; return sayfa(H, 'dk', `${ust('dk', 'Hatırlatıcılar', 'Seni dürtmez,<br><em>hatırlatır.</em>', '')}
<div class="mid"><div class="clock">09:41</div><div class="stack">${bil.map(([e, a, b, s, btn]) => `<div class="nt"><span class="e ni">${e}</span><div class="nb"><div class="nh"><b>${a}</b><small>${s}</small></div><span>${b}</span>${btn ? `<em>${btn}</em>` : ''}</div></div>`).join('')}</div></div>
${alt('Bildirimden tek dokunuşla kaydet', 'Hepsi telefonunda kurulur')}`,
`.clock{font:600 ${st ? 150 : 120}px Outfit;letter-spacing:-.04em;text-align:center;color:rgba(255,255,255,.92);margin-bottom:${st ? 40 : 24}px}
.stack{display:flex;flex-direction:column;gap:${st ? 22 : 16}px}.nt{display:flex;gap:22px;align-items:flex-start;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.18);border-radius:34px;padding:${st ? 28 : 22}px 28px;backdrop-filter:blur(10px)}
.ni{font-size:46px;width:72px;height:72px;border-radius:20px;background:rgba(255,255,255,.9);display:grid;place-items:center;flex:none}
.nb{flex:1}.nh{display:flex;justify-content:space-between}.nh b{font:700 30px Figtree}.nh small{font:500 22px Figtree;color:rgba(255,255,255,.6)}
.nb span{display:block;margin-top:4px;font:500 26px Figtree;color:rgba(255,255,255,.8)}.nb em{display:inline-block;margin-top:14px;font:700 24px Figtree;font-style:normal;background:${N};color:${Z};border-radius:99px;padding:8px 20px}`); };

/* 4 · Mit / gerçek: iki büyük kart */
const p4 = H => { const st = H > 1500; return sayfa(H, 'lt', `${ust('lt', 'Tartı 3 gündür kıpırdamıyor', 'Duraklama,<br><em>durmak değil.</em>', '')}
<div class="mid"><div class="mt no"><span class="tag">Sanılan</span><b>“İşe yaramıyor, bıraksam mı?”</b></div>
<div class="mt ok"><span class="tag">Gerçek</span><b>Tartıdaki günlük oynamanın çoğu su. Bel 2 cm inceldiyse yağ kaybı sürüyor.</b>
<div class="ck">${['Bu hafta protein hedefini 4 gün tamamladın', 'Bu hafta su ortalaman 1,9 litre', 'Bu ay ölçü girişi yaptın'].map(x => `<span><i>✓</i>${x}</span>`).join('')}</div></div></div>
${alt('Hafif duraklamayı fark eder, nedenini anlatır')}`,
`.mt{border-radius:40px;padding:${st ? 44 : 34}px 44px}.mt+.mt{margin-top:24px}.mt .tag{display:inline-block;font:700 22px Figtree;letter-spacing:.12em;text-transform:uppercase;border-radius:99px;padding:8px 18px}
.mt b{display:block;margin-top:18px;font:700 ${st ? 44 : 40}px/1.2 Outfit;letter-spacing:-.02em}
.no{background:#F7E4E1;color:#7A2A20}.no .tag{background:#7A2A20;color:#fff}.no b{text-decoration:line-through;text-decoration-thickness:4px;text-decoration-color:rgba(122,42,32,.5)}
.ok{background:#fff;box-shadow:0 34px 70px -40px rgba(11,59,51,.45)}.ok .tag{background:${AC};color:#fff}
.ck{margin-top:24px;display:flex;flex-direction:column;gap:12px}.ck span{display:flex;gap:16px;align-items:center;font:600 28px Figtree;color:#34504A}.ck i{font-style:normal;width:40px;height:40px;border-radius:50%;background:#E1F3EC;color:${AC};display:grid;place-items:center;font:700 22px Figtree;flex:none}`); };

/* 5 · Ana ekran: gerçek iPhone widget'ları */
const p5 = H => { const st = H > 1500; return sayfa(H, 'lt', `${ust('lt', 'Ana ekran', 'Uygulamayı açmadan<br><em>su ekle.</em>', 'Kilo, bugün, su ve sıradaki iğnen; ana ekranında ve kilit ekranında.')}
<div class="mid"><div class="home"><img class="pano" src="${WI('pano.png')}"><img src="${WI('su.png')}"><img src="${WI('igne.png')}"></div></div>
${alt('iPhone ve Android widget\'ları', 'Hafif Plus')}`,
`.home{border-radius:60px;background:linear-gradient(160deg,#A9C7BC,#6E9790 50%,#3F6670);padding:${st ? 44 : 34}px;display:grid;grid-template-columns:1.9fr 1fr;gap:${st ? 26 : 22}px;align-items:start}
.home img{width:100%;display:block;border-radius:36px;filter:drop-shadow(0 18px 22px rgba(11,40,36,.35))}.home .pano{grid-row:1/3}`); };

/* 6 · Önce/sonra: şablon gösterimi, siluetler (gerçek fotoğraf yok) */
const sil = (bg, fg, w) => `<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice"><rect width="200" height="260" fill="${bg}"/><circle cx="100" cy="84" r="32" fill="${fg}"/><path d="M${100 - w} 260c0-72 22-112 ${w}-112s${w} 40 ${w} 112z" fill="${fg}"/></svg>`;
const p6 = H => { const st = H > 1500; return sayfa(H, 'dk', `${ust('dk', 'İlerleme fotoğrafları', 'Tartının göremediğini<br><em>sen gör.</em>', 'İki tarihi yan yana koy, paylaşım için 4 şablondan birini seç.')}
<div class="mid"><div class="ba card"><div class="ph">${sil('#DCEFE7', '#9FC9B8', 62)}<span>1. hafta</span></div><div class="ph">${sil('#CDE9DE', '#0E7C66', 50)}<span>12. hafta</span></div>
<div class="st"><b>−9,4 kg</b><b>−11 cm bel</b></div></div>
<div class="lock"><span class="e">🔒</span>Fotoğraflar galeride görünmez, telefonundan çıkmaz.</div></div>
${alt('Paylaşmak tamamen senin seçimin', 'Hafif Plus')}`,
`.ba{padding:26px;display:grid;grid-template-columns:1fr 1fr;gap:18px}.ph{position:relative;border-radius:26px;overflow:hidden;aspect-ratio:${st ? '3/4.2' : '3/3.6'}}.ph svg{width:100%;height:100%;display:block}
.ph span{position:absolute;left:18px;bottom:18px;background:rgba(11,59,51,.85);color:#fff;font:700 22px Figtree;border-radius:99px;padding:8px 16px}
.st{grid-column:1/3;display:flex;justify-content:space-around;padding:10px 0 4px}.st b{font:700 46px Outfit;color:${AC};letter-spacing:-.02em}
.lock{margin-top:26px;display:flex;gap:16px;align-items:center;font:600 28px Figtree;color:#E9FFF7}.lock .e{font-size:40px}`); };

/* 7 · Rozetler: madalya rafı */
const med = (t, s, c1, c2, ink) => `<div class="md"><div class="mc" style="background:radial-gradient(circle at 35% 30%,${c1},${c2});color:${ink}"><b>${t}</b></div><span>${s}</span></div>`;
const p7 = H => sayfa(H, 'lt', `${ust('lt', 'Rozetler', 'Her eşik<br><em>bir kutlama.</em>', 'İlk kilodan hedefe; protein, su, adım ve iğne serilerinde de rozet.')}
<div class="mid"><div class="shelf">
${med('−1 kg', 'İlk adım', '#C4F5E3', '#3CC39C', Z)}${med('%5', 'Vücut ağırlığı', '#ECE4FF', '#AF96F4', '#46348F')}${med('90', 'kg\'ın altı', '#FFF4CC', '#F7D774', '#86601A')}
${med('7', 'gün protein', '#FFE9C2', '#F2B65A', '#7A4B0C')}${med('7', 'gün su', '#D8EEFB', '#6BB8E3', '#123E5C')}${med('Hedef', 'Ulaştın', '#C4F5E3', '#0E7C66', '#fff')}</div>
<div class="share card"><span class="e">🎉</span><div><b>Rozetini paylaş</b><small>3 şablon · hikâye ya da gönderi</small></div></div></div>
${alt('Rozetler Hafif defterinde damgalanır')}`,
`.shelf{display:grid;grid-template-columns:repeat(3,1fr);gap:34px 20px}.md{display:flex;flex-direction:column;align-items:center;gap:14px}
.mc{width:220px;height:220px;border-radius:50%;display:grid;place-items:center;box-shadow:0 26px 40px -24px rgba(11,59,51,.55),inset 0 0 0 12px rgba(255,255,255,.45)}.mc b{font:700 62px Outfit;letter-spacing:-.03em}
.md span{font:600 26px Figtree;color:#34504A}.share{margin-top:44px;display:flex;align-items:center;gap:24px;padding:28px 34px}.share .e{font-size:58px}.share b{display:block;font:700 36px Outfit}.share small{font:500 24px Figtree;color:${MU}}`);

/* 8 · İğne haftası: 5 küçük hatırlatma (tıbbi tavsiye değil) */
const ip = [['🥚', 'Proteini öne al', 'İştah azken önce protein; kası korur.'], ['💧', 'Suyu küçük yudumlarla', 'Gün boyuna yay, bir anda değil.'], ['🍽️', 'Küçük ve sık', 'Bulantılı günlerde az ama sık ye.'], ['🏋️', 'Haftada 2–3 direnç', '20–30 dakika yeter; lastik bant da olur.'], ['📝', 'Belirtileri not et', 'Hangi gün ne oluyor, Hafif örüntüyü gösterir.']];
const p8 = H => { const st = H > 1500; return sayfa(H, 'lt', `${ust('lt', 'İğne haftası için', '5 küçük<br><em>hatırlatma.</em>', '')}
<div class="mid"><div class="list">${ip.map(([e, a, b], i) => `<div class="it card"><span class="n">${i + 1}</span><span class="e ie">${e}</span><div><b>${a}</b><small>${b}</small></div></div>`).join('')}</div></div>
${alt('Genel bilgidir; dozun ve planın için doktoruna danış.', '')}`,
`.list{display:flex;flex-direction:column;gap:${st ? 20 : 14}px}.it{display:flex;align-items:center;gap:22px;padding:${st ? 28 : 20}px 30px;border-radius:32px}
.n{font:700 34px Outfit;color:${AC};width:34px}.ie{font-size:48px;width:84px;height:84px;border-radius:24px;background:#F3F0E8;display:grid;place-items:center;flex:none}
.it b{display:block;font:700 34px Outfit;letter-spacing:-.01em}.it small{display:block;margin-top:4px;font:500 25px Figtree;color:${MU}}`); };

/* 9 · Son 7 gün: Günlük ekranındaki sayılı kutucuklar */
const P = [96, 128, 115, 110, 72, 120, 104], Wv = [2.1, 2.6, 2.7, 1.8, 2.2, 2.6, 2.4], D = ['Per', 'Cum', 'Cmt', 'Paz', 'Pzt', 'Sal', 'Bugün'];
const cell = (v, g, c, txt) => { const ok = v >= g, f = Math.min(1, v / g); return `<i class="${ok ? 'ok' : ''}" style="background:${ok ? c : `color-mix(in oklab,${c} ${Math.round(12 + f * 40)}%,#fff)`}">${txt}</i>`; };
const p9 = H => sayfa(H, 'dk', `${ust('dk', 'Günlük', 'Haftan,<br><em>tek bakışta.</em>', 'Her günün protein ve su değeri; renk koyulaştıkça hedefe yaklaşıyorsun.')}
<div class="mid"><div class="card wk"><div class="eb">SON 7 GÜN</div>
<div class="g"><span class="lb" style="color:#C27A12">Protein</span>${P.map(v => cell(v, 110, '#C27A12', v)).join('')}
<span class="lb" style="color:#2E8BC0">Su</span>${Wv.map(v => cell(v, 2.5, '#2E8BC0', String(v).replace('.', ','))).join('')}
<span></span>${D.map((d, i) => `<span class="dd${i === 6 ? ' b' : ''}">${d}</span>`).join('')}</div>
<div class="sum">Bu hafta protein hedefini <b>4 gün</b>, su hedefini <b>3 gün</b> tamamladın.</div></div></div>
${alt('Protein gram, su litre · örnek hafta')}`,
`.wk{padding:40px 34px}.eb{font:700 22px Figtree;letter-spacing:.12em;color:${MU};margin-bottom:22px}
.g{display:grid;grid-template-columns:118px repeat(7,1fr);gap:10px;align-items:center}.lb{font:700 26px Figtree}
.g i{height:92px;border-radius:20px;display:grid;place-items:center;font:700 28px Outfit;font-style:normal;color:${INK}}.g i.ok{color:#fff}
.dd{text-align:center;font:600 22px Figtree;color:${MU}}.dd.b{color:${INK};font-weight:700}.sum{margin-top:28px;font:500 30px/1.4 Figtree;color:#34504A}.sum b{color:${INK}}`);

/* 10 · Gizlilik manifestosu: üstü çizili satırlar */
const yok = ['Hesap', 'Reklam', 'Sunucu', 'Takip', 'Veri satışı'];
const p10 = H => { const st = H > 1500; return sayfa(H, 'dk', `${ust('dk', 'Gizlilik', 'Verilerin<br><em>sende kalır.</em>', '')}
<div class="mid"><div class="ys">${yok.map(x => `<div class="y"><span>${x}</span><b>yok</b></div>`).join('')}</div>
<div class="var"><span class="e">📱</span>Kilon, iğnelerin, fotoğrafların: hepsi yalnızca telefonunda. İnternetsiz de çalışır.</div></div>
${alt('Yedeğini sen al, Excel\'e sen aktar', '')}`,
`.ys{display:flex;flex-direction:column;gap:${st ? 10 : 4}px}.y{display:flex;align-items:baseline;justify-content:space-between;border-bottom:2px solid rgba(159,240,214,.22);padding:${st ? 18 : 12}px 0}
.y span{font:700 ${st ? 88 : 76}px Outfit;letter-spacing:-.04em;color:rgba(255,255,255,.92);text-decoration:line-through;text-decoration-color:${N};text-decoration-thickness:6px}
.y b{font:700 34px Figtree;color:${N}}.var{margin-top:${st ? 48 : 34}px;display:flex;gap:20px;align-items:center;background:rgba(159,240,214,.12);border:1px solid rgba(159,240,214,.3);border-radius:32px;padding:28px 32px;font:600 29px/1.4 Figtree;color:#E9FFF7}.var .e{font-size:56px}`); };

const SET = [['01-iphone-da', p1], ['02-bir-gunum', p2], ['03-bildirimler', p3], ['04-duraklama', p4], ['05-ana-ekran', p5], ['06-once-sonra', p6], ['07-rozetler', p7], ['08-igne-haftasi', p8], ['09-son-7-gun', p9], ['10-gizlilik', p10]];
(async () => {
  const b = await chromium.launch();
  for (const [H, ek] of [[1350, 'gonderi'], [1920, 'hikaye']]) {
    const p = await b.newPage({ viewport: { width: 1080, height: H } });
    for (const [ad, f] of SET) {
      const fp = path.join(OUT, `_${ad}.html`); fs.writeFileSync(fp, f(H));
      await p.goto('file://' + fp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
      await p.screenshot({ path: path.join(OUT, `${ad}-${ek}.png`) }); fs.unlinkSync(fp);
    }
    await p.close();
  }
  await b.close(); console.log('tamam', SET.length * 2);
})();
