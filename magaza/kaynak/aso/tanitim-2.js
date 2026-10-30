// Play Store tanıtım görselleri, 2. tasarım (2.0). 1080×1920. Renkler: koyu zümrüt #0B3B33, nane #9FF0D6, krem #F4F1EA.
// 01 kapak kapak-alternatifleri-2.js içindeki K'dır; bu betik onu kopyalar ve 02–08'i üretir.
// Çalıştırma: node magaza/kaynak/aso/tanitim-2.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/tanitim-2');
fs.mkdirSync(OUT, { recursive: true });
const Z = '#0B3B33', N = '#9FF0D6', K = '#F4F1EA', AC = '#0E7C66';
const head = css => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}.s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#0B2420;background:${K}}
.e{font-family:"Noto Color Emoji";font-style:normal;line-height:1}
h1{margin:0;font:700 96px/1.02 Outfit;letter-spacing:-.04em}h1 em{font-style:normal}
.lg{display:flex;align-items:center;gap:12px;font:700 38px Outfit;letter-spacing:-.02em}.lg svg{width:44px;height:44px}
.sub{font:500 34px/1.4 Figtree}
.card{background:#fff;border-radius:48px;box-shadow:0 40px 80px -48px rgba(11,59,51,.45)}
${css}</style></head><body><div class="s">`;
const leaf = c => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"><path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/></svg>`;
const logo = (c, ink) => `<div class="lg" style="color:${ink}">${leaf(c)}Hafif</div>`;
const end = `</div></body></html>`;

/* 02 · Ne yesem? — koyu bant, ortada büyük tabak, altında öneri satırları */
const s02 = head(`
.band{position:absolute;left:0;right:0;top:0;height:900px;background:${Z};color:#fff}
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px}.t h1 em{color:${N}}.t .sub{margin-top:22px;color:rgba(255,255,255,.72)}
.plate{position:absolute;left:50%;top:640px;width:500px;height:500px;margin-left:-250px;border-radius:50%;background:#fff;box-shadow:0 60px 100px -50px rgba(0,0,0,.55),inset 0 0 0 26px #F3EEE5}
.plate i{position:absolute}
.rows{position:absolute;left:84px;right:84px;top:1200px;display:flex;flex-direction:column;gap:18px}
.r{display:flex;align-items:center;gap:26px;padding:24px 30px}.r .e{font-size:58px;width:96px;height:96px;border-radius:30px;background:#FBF0DC;display:grid;place-items:center}
.r b{display:block;font:700 38px Outfit;letter-spacing:-.01em}.r small{font:500 26px Figtree;color:#5F726C}
.r .tag{margin-left:auto;font:700 20px Figtree;letter-spacing:.1em;text-transform:uppercase;color:#B06D10;background:#FBF0DC;border-radius:99px;padding:10px 18px}
.note{position:absolute;left:84px;right:84px;bottom:90px;text-align:center;font:500 28px Figtree;color:#4E6B63}`) + `
<div class="band"><div class="t">${logo(N, '#fff')}<h1>Akşam ne yesem?<br><em>Hafif söylesin.</em></h1><div class="sub">Kalan proteinine ve iştahına göre, Türk mutfağından.</div></div></div>
<div class="plate"><i class="e" style="left:92px;top:120px;font-size:170px;transform:rotate(-12deg)">🍗</i><i class="e" style="left:250px;top:200px;font-size:150px">🥗</i><i class="e" style="left:110px;top:270px;font-size:140px">🍚</i></div>
<div class="rows">
<div class="r card"><span class="e">🍗</span><div><b>Tavuk şiş ve bulgur</b><small>Akşam için</small></div><span class="tag">Öneri</span></div>
<div class="r card"><span class="e">🍲</span><div><b>Mercimek çorbası ve yoğurt</b><small>İştahın azsa hafif bir seçenek</small></div></div>
<div class="r card"><span class="e">🍳</span><div><b>Menemen ve beyaz peynir</b><small>Kahvaltı için</small></div></div></div>
<div class="note">Dokun, proteinin tek seferde eklensin.</div>` + end;

/* 03 · İğne ve doz planı — krem zemin, koyu başlık, büyük kart: sıradaki iğne + basamaklar; yüzen uyarı */
const step = (st, d, sub) => `<div class="st ${st}"><i>${st === 'ok' ? '✓' : ''}</i><div><b>${d}</b><small>${sub}</small></div></div>`;
const s03 = head(`
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px;color:${Z}}.t h1 em{color:${AC}}.t .sub{margin-top:22px;color:#4E6B63}
.next{position:absolute;left:84px;right:84px;top:660px;padding:40px 44px;background:${Z};color:#fff;border-radius:48px;display:flex;align-items:center;gap:30px;box-shadow:0 50px 90px -50px rgba(11,59,51,.7)}
.next .e{font-size:84px;width:140px;height:140px;border-radius:40px;background:rgba(159,240,214,.14);display:grid;place-items:center}
.next small{display:block;font:700 22px Figtree;letter-spacing:.12em;text-transform:uppercase;color:${N}}.next b{display:block;margin-top:8px;font:700 50px Outfit}.next span{font:500 28px Figtree;color:rgba(255,255,255,.72)}
.plan{position:absolute;left:84px;right:84px;top:990px;padding:48px 52px}
.plan h3{margin:0 0 26px;font:700 40px Outfit}
.st{display:flex;align-items:center;gap:28px;position:relative;padding:28px 0}
.st:not(:last-child):after{content:"";position:absolute;left:27px;top:84px;bottom:-28px;width:4px;border-radius:2px;background:#E0E8E4}
.st.ok:not(:last-child):after{background:#27407A}
.st i{width:58px;height:58px;border-radius:50%;flex:none;display:grid;place-items:center;font:700 30px Figtree;font-style:normal;color:#fff;border:4px solid #E0E8E4;background:#fff;z-index:1}
.st.ok i{background:#27407A;border-color:#27407A}.st.now i{border-color:#27407A;box-shadow:0 0 0 10px #E6EBF5}.st.now i:after{content:"";width:20px;height:20px;border-radius:50%;background:#27407A}
.st b{display:block;font:700 40px Outfit}.st small{font:500 26px Figtree;color:#5F726C}.st.nx b{color:#9AA8A3}
.warn{position:absolute;right:60px;top:1680px;width:620px;padding:30px 34px;background:#fff;border-radius:36px;display:flex;gap:22px;align-items:center;transform:rotate(-2.5deg);box-shadow:0 40px 70px -36px rgba(11,59,51,.55);border:2px solid #E6EBF5}
.warn .e{font-size:60px}.warn b{display:block;font:700 32px Outfit}.warn span{font:500 24px Figtree;color:#5F726C}`) + `
<div class="t">${logo(AC, Z)}<h1>İğne günü ve<br><em>doz artışı, hep aklında.</em></h1><div class="sub">Sıradaki iğnen, önerilen bölge ve doktorunun planı.</div></div>
<div class="next"><span class="e">💉</span><div><small>Sıradaki iğne</small><b>Pazar sabahı</b><span>Önerilen bölge: karın, sol</span></div></div>
<div class="plan card"><h3>Doz planım 🗓️</h3>${step('ok', '1. basamak', 'Tamamlandı')}${step('ok', '2. basamak', 'Tamamlandı')}${step('now', '3. basamak', 'Şu an · 2. hafta')}${step('nx', '4. basamak', 'Sıradaki')}</div>
<div class="warn"><span class="e">🛒</span><div><b>Gelecek hafta doz artıyor</b><span>Yeni kalemini bu hafta al.</span></div></div>` + end;

/* 04 · Koç — tamamen koyu, sohbet baloncukları */
const s04 = head(`
.s{background:radial-gradient(60% 30% at 100% 70%,#145A4C 0%,transparent 70%),${Z};color:#fff}
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px}.t h1 em{color:${N}}.t .sub{margin-top:22px;color:rgba(255,255,255,.72)}
.chat{position:absolute;left:84px;right:84px;top:640px;display:flex;flex-direction:column;gap:46px}
.m{display:flex;gap:20px;align-items:flex-end;max-width:860px}.m .av{width:84px;height:84px;border-radius:50%;background:${N};display:grid;place-items:center;font-size:44px;flex:none}
.b{background:#fff;color:#0B2420;border-radius:40px 40px 40px 10px;padding:34px 40px;font:600 40px/1.3 Figtree}.b small{display:block;margin-top:10px;font:500 24px Figtree;color:#5F726C}
.m.me{align-self:flex-end;flex-direction:row-reverse}.m.me .b{background:rgba(159,240,214,.16);color:#fff;border:1px solid rgba(159,240,214,.3);border-radius:40px 40px 10px 40px}
.foot{position:absolute;left:84px;right:84px;bottom:96px;font:500 28px/1.4 Figtree;color:rgba(255,255,255,.62);text-align:center}`) + `
<div class="t">${logo(N, '#fff')}<h1>Seni tanıyan<br><em>bir koç.</em></h1><div class="sub">Kayıtlarına bakar, doğru anda tek bir öneri verir.</div></div>
<div class="chat">
<div class="m"><span class="av e">🌿</span><div class="b">Tartı üç gündür yerinde ama belin incelmiş. Yağ kaybı sürüyor. 💪<small>Duraklama · bugün</small></div></div>
<div class="m me"><div class="b">Bulantı yine başladı…</div></div>
<div class="m"><span class="av e">🌿</span><div class="b">Senin döngünde en çok iğneden sonraki 2. gün oluyor, yarın hafifler. Bugün küçük ve sık ye. 🍵<small>Son iğnelerine göre</small></div></div>
<div class="m"><span class="av e">🌿</span><div class="b">Bu hafta proteinde bir gün daha yeter. 🥚</div></div></div>
<div class="foot">Hepsi telefonunda hesaplanır. Koç teşhis koymaz, doktorunun yerine geçmez.</div>` + end;

/* 05 · Kilo yolu — krem, büyük yumuşak eğri, hedef tarihi, pazartesi özeti */
const curve = (() => { const W = 912, H = 420; const pts = [...Array(26)].map((_, i) => { const x = i / 25; return [x * W, 60 + (1 - Math.exp(-x * 2.2)) * 230 + Math.sin(i * 1.7) * 10]; }); const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(''); const k = 17, pk = pts[k];
  return `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AC}" stop-opacity=".28"/><stop offset="1" stop-color="${AC}" stop-opacity="0"/></linearGradient></defs>
  <path d="${pts.slice(0, k + 1).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('')}L${pk[0]} ${H}L0 ${H}Z" fill="url(#g)"/>
  <path d="${pts.slice(0, k + 1).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('')}" fill="none" stroke="${AC}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${pts.slice(k).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('')}" fill="none" stroke="${AC}" stroke-width="6" stroke-dasharray="4 16" stroke-linecap="round"/>
  <circle cx="${pk[0]}" cy="${pk[1]}" r="22" fill="#fff" stroke="${AC}" stroke-width="8"/><path d="M${W - 14} 300v-60" stroke="${Z}" stroke-width="4" stroke-linecap="round"/><path d="M${W - 14} 240h40l-10 14 10 14h-40" fill="${N}" stroke="${Z}" stroke-width="3" stroke-linejoin="round" transform="translate(-40 0)"/></svg>`; })();
const s05 = head(`
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px;color:${Z}}.t h1 em{color:${AC}}.t .sub{margin-top:22px;color:#4E6B63}
.cv{position:absolute;left:84px;top:640px}.lbl{position:absolute;font:600 26px Figtree;color:#4E6B63}
.eta{position:absolute;left:300px;top:1080px;background:${Z};color:#fff;border-radius:99px;padding:22px 36px;font:600 32px Figtree;display:flex;gap:16px;align-items:center;box-shadow:0 30px 60px -30px rgba(11,59,51,.6)}.eta b{color:${N};font:700 36px Outfit}
.wk{position:absolute;left:84px;right:84px;top:1260px;padding:44px 48px}
.wk small{font:700 22px Figtree;letter-spacing:.12em;text-transform:uppercase;color:${AC}}.wk h3{margin:10px 0 28px;font:700 46px Outfit}
.row{display:grid;grid-template-columns:150px repeat(7,1fr);align-items:center;gap:10px;margin:14px 0;font:600 28px Figtree}.row i{width:44px;height:44px;border-radius:50%;justify-self:center;border:4px solid currentColor;opacity:.9}.row i.f{background:currentColor}
.goal{margin-top:30px;padding:26px 30px;border-radius:30px;background:#E1F3EC;display:flex;gap:20px;align-items:center;font:600 30px Figtree}.goal .e{font-size:52px}`) + `
<div class="t">${logo(AC, Z)}<h1>Yolun nereye<br><em>gidiyor, gör.</em></h1><div class="sub">Kilo eğrin, hızın ve bu hızla hedefe varacağın zaman.</div></div>
<div class="cv">${curve}</div><span class="lbl" style="left:84px;top:1080px">Başlangıç</span><span class="lbl" style="right:84px;top:1080px">Hedef</span>
<div class="eta"><span class="e">📍</span>Bu hızla hedefe <b>Mart</b></div>
<div class="wk card"><small>Her pazartesi</small><h3>Haftan, tek bakışta</h3>
${[['Protein', '#C27A12', [1, 1, 0, 1, 1, 0, 1]], ['Su', '#2E8BC0', [1, 1, 1, 0, 1, 1, 1]], ['Adım', '#1C8EA6', [0, 1, 1, 1, 0, 1, 1]]].map(([n, c, a]) => `<div class="row" style="color:${c}"><span style="color:#0B2420">${n}</span>${a.map(v => `<i class="${v ? 'f' : ''}"></i>`).join('')}</div>`).join('')}
<div class="goal"><span class="e">🎯</span>Bu haftanın tek hedefi: proteinde bir gün daha.</div></div>` + end;

/* 06 · Her gün — koyu üst, üç büyük karo yan yana, altında widget'lar */
const s06 = head(`
.band{position:absolute;left:0;right:0;top:0;height:760px;background:${Z};color:#fff}
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px}.t h1 em{color:${N}}.t .sub{margin-top:22px;color:rgba(255,255,255,.72)}
.tri{position:absolute;left:84px;right:84px;top:600px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.tri .card{padding:40px 28px;text-align:center}.tri .e{font-size:110px;display:block;margin:6px 0 22px}.tri b{display:block;font:700 40px Outfit}.tri span{display:block;margin-top:8px;font:500 25px/1.35 Figtree;color:#5F726C}
.wh{position:absolute;left:84px;top:1150px;font:700 22px Figtree;letter-spacing:.12em;text-transform:uppercase;color:${AC}}
.home{position:absolute;left:84px;right:84px;top:1200px;height:580px;border-radius:56px;background:linear-gradient(160deg,#CFE8DE,#B7D9CC);padding:40px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:28px}
.w{border-radius:40px;background:rgba(255,255,255,.88);padding:28px 30px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 20px 40px -30px rgba(11,59,51,.5)}
.w .e{font-size:64px}.w b{font:700 34px/1.15 Outfit}.w small{display:block;font:500 22px Figtree;color:#5F726C;margin-top:4px}
.w.dk{background:${Z};color:#fff}.w.dk small{color:rgba(255,255,255,.65)}.w .btn{align-self:flex-start;background:${N};color:${Z};border-radius:99px;padding:10px 20px;font:700 24px Figtree}`) + `
<div class="band"><div class="t">${logo(N, '#fff')}<h1>Küçük alışkanlıklar,<br><em>tek dokunuş.</em></h1><div class="sub">Su, adım ve takviyelerin; zamanında hatırlatmalarla.</div></div></div>
<div class="tri"><div class="card"><span class="e">💧</span><b>Su</b><span>Bardağını seç, tek dokunuşla ekle</span></div><div class="card"><span class="e">👟</span><b>Adım</b><span>Health Connect'ten kendiliğinden</span></div><div class="card"><span class="e">💊</span><b>Takviye</b><span>Sabah, akşam, gece programın</span></div></div>
<div class="wh">Ana ekran widget'ları</div>
<div class="home"><div class="w dk"><span class="e">💉</span><div><b>İğneye 4 gün</b><small>Önerilen bölge hazır</small></div></div>
<div class="w"><span class="e">💧</span><div><b>Su</b><small>Hedefe az kaldı</small></div><span class="btn">+ Bardak</span></div>
<div class="w"><span class="e">💊</span><div><b>Akşam takviyeleri</b><small>Hepsini aldım</small></div></div>
<div class="w"><span class="e">🔔</span><div><b>Hatırlatmalar</b><small>İğne, su, tartı, kalem</small></div></div></div>` + end;

/* 07 · İlerleme — krem; iki polaroid, egzersiz haftası, şerit metre */
const sil = c => `<svg viewBox="0 0 200 260"><rect width="200" height="260" fill="${c[0]}"/><circle cx="100" cy="86" r="34" fill="${c[1]}"/><path d="M${c[2]} 260c0-70 30-108 ${100 - c[2]}-108s${100 - c[2]} 38 ${100 - c[2]} 108z" fill="${c[1]}"/></svg>`;
const s07 = head(`
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px;color:${Z}}.t h1 em{color:${AC}}.t .sub{margin-top:22px;color:#4E6B63}
.pol{position:absolute;top:640px;width:420px;padding:22px 22px 70px;background:#fff;border-radius:14px;box-shadow:0 40px 70px -36px rgba(11,59,51,.5)}
.pol svg{display:block;width:100%;border-radius:6px}.pol b{position:absolute;left:0;right:0;bottom:20px;text-align:center;font:600 28px Figtree;color:#4E6B63}
.p1{left:90px;transform:rotate(-5deg)}.p2{right:90px;transform:rotate(4deg);top:680px}
.lock{position:absolute;left:50%;top:1250px;transform:translateX(-50%);background:${Z};color:#fff;border-radius:99px;padding:18px 32px;font:600 28px Figtree;display:flex;gap:12px;align-items:center;white-space:nowrap}
.ex{position:absolute;left:84px;right:84px;top:1380px;padding:40px 44px}
.ex h3{margin:0 0 6px;font:700 42px Outfit}.ex p{margin:0 0 26px;font:500 26px Figtree;color:#5F726C}
.days{display:grid;grid-template-columns:repeat(7,1fr);gap:12px}.days span{height:96px;border-radius:26px;background:#EDF3F0;display:grid;place-items:center;font:600 24px Figtree;color:#5F726C}.days span.on{background:#E6EBF5;font-size:46px}`) + `
<div class="t">${logo(AC, Z)}<h1>Tartının göremediğini<br><em>sen gör.</em></h1><div class="sub">Haftalık fotoğraf, kas koruma ve vücut ölçüleri.</div></div>
<div class="pol p1">${sil(['#DCEFE7', '#9FC9B8', 46])}<b>1. hafta</b></div>
<div class="pol p2">${sil(['#CDE9DE', '#0E7C66', 46])}<b>8. hafta</b></div>
<div class="lock"><span class="e">🔒</span>Fotoğraflar galeride görünmez, telefondan çıkmaz</div>
<div class="ex card"><h3>Kas koruma 🏋️</h3><p>Haftada birkaç gün direnç egzersizi, tek dokunuşla.</p>
<div class="days">${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => [0, 2, 4].includes(i) ? `<span class="on e">💪</span>` : `<span>${d}</span>`).join('')}</div></div>` + end;

/* 08 · Rapor + gizlilik — koyu üst yarıda eğik PDF, krem altta güven satırları */
const pdf = `<svg viewBox="0 0 600 780"><rect width="600" height="780" rx="20" fill="#fff"/><rect x="48" y="50" width="200" height="22" rx="11" fill="${Z}"/><rect x="48" y="90" width="320" height="14" rx="7" fill="#D5E6DE"/>
${[0, 1, 2, 3].map(i => `<rect x="${48 + i * 130}" y="140" width="112" height="84" rx="16" fill="#EDF3F0"/>`).join('')}
<path d="M60 430L130 380 200 395 270 340 340 330 410 290 480 280 540 250" fill="none" stroke="${AC}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 460H540" stroke="#E0E8E4" stroke-width="3"/>
${[0, 1, 2, 3, 4].map(i => `<rect x="48" y="${510 + i * 46}" width="${504 - (i % 2) * 80}" height="16" rx="8" fill="#EDF3F0"/>`).join('')}</svg>`;
const s08 = head(`
.band{position:absolute;left:0;right:0;top:0;height:1000px;background:${Z};color:#fff}
.t{position:absolute;left:84px;right:84px;top:100px}.t h1{margin-top:46px}.t h1 em{color:${N}}.t .sub{margin-top:22px;color:rgba(255,255,255,.72)}
.doc{position:absolute;left:240px;top:560px;width:600px;transform:rotate(-4deg);box-shadow:0 60px 110px -50px rgba(0,0,0,.7);border-radius:20px}.doc svg{display:block}
.tag{position:absolute;right:120px;top:600px;background:${N};color:${Z};border-radius:99px;padding:14px 26px;font:700 26px Figtree;transform:rotate(4deg)}
.tr{position:absolute;left:84px;right:84px;top:1400px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.tr div{display:flex;align-items:center;gap:20px;padding:28px 30px}.tr .e{font-size:56px}.tr b{display:block;font:700 32px Outfit}.tr small{font:500 22px Figtree;color:#5F726C}`) + `
<div class="band"><div class="t">${logo(N, '#fff')}<h1>Doktoruna hazır git.<br><em>Verilerin sende kalsın.</em></h1><div class="sub">Kilo, doz, yan etki ve ölçülerin tek bir PDF raporda.</div></div></div>
<div class="doc">${pdf}</div><span class="tag">📄 PDF rapor</span>
<div class="tr"><div class="card"><span class="e">🙅</span><span><b>Hesap yok</b><small>Kayıt olmadan başla</small></span></div><div class="card"><span class="e">🚫</span><span><b>Reklam yok</b><small>Takip de yok</small></span></div>
<div class="card"><span class="e">📴</span><span><b>İnternetsiz</b><small>Her şey telefonunda</small></span></div><div class="card"><span class="e">📲</span><span><b>Yedekle, taşı</b><small>Yeni telefona geçer</small></span></div></div>` + end;

(async () => {
  fs.copyFileSync(path.join(ROOT, 'magaza/aso-alternatif/K-sozler-liste.png'), path.join(OUT, '01-neler-yapar.png'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [ad, html] of [['02-ne-yesem', s02], ['03-igne-doz', s03], ['04-koc', s04], ['05-kilo-yolu', s05], ['06-her-gun', s06], ['07-ilerleme', s07], ['08-rapor-gizlilik', s08]]) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam');
})();
