// Mağaza 1. görseli için 3 tarz alternatifi (1080×1920). Ekran görüntüsü yerine uygulamanın öğeleri yeniden çizilir.
// Çalıştırma: node magaza/kaynak/aso/kapak-alternatifleri.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/aso-alternatif');
fs.mkdirSync(OUT, { recursive: true });
const FONTS = `<link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css">`;
const I = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC = {
  yaprak: I('<path d="M20 4C11 4 5 9 5 17v3"/><path d="M20 4c0 9-5 14-13 14"/>'),
  kilo: I('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9.5a3 3 0 0 1 6 0"/><path d="M12 9.5l1.3-1.6"/>'),
  igne: I('<path d="M18 3l3 3M16 5l3 3-9 9H7v-3z"/><path d="M5 19l2-2"/>'),
  protein: I('<path d="M12 3.5c3.5 0 6 4.5 6 9.5a6 6 0 0 1-12 0c0-5 2.5-9.5 6-9.5z"/>'),
  su: I('<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>'),
  adim: I('<path d="M8.5 3.5c1.6 0 2.5 1.6 2.5 3.8S10 11 8.6 11 6 9.5 6 7.3s.9-3.8 2.5-3.8zM6.6 13h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/><path d="M15.5 7.5c1.6 0 2.5 1.6 2.5 3.8S17 15 15.6 15 13 13.5 13 11.3s.9-3.8 2.5-3.8zM13.6 17h4l-.4 3a2.2 2.2 0 0 1-4.3-.3z"/>'),
  takviye: I('<rect x="3.5" y="9" width="17" height="6.5" rx="3.25" transform="rotate(-35 12 12.25)"/><path d="M9.6 8.6l4.4 6.6"/>'),
  koc: I('<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
  rapor: I('<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 17v-3M12 17v-5M15 17v-2"/>'),
  foto: I('<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6l1.5-2.5h3L15 6"/>'),
  kalkan: I('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  kisi: I('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M4 4l16 16"/>'),
  reklam: I('<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M3 3l18 18"/>'),
  telefon: I('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  plan: I('<path d="M5 19V9M12 19V5M19 19v-7"/>'),
  ok: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>')
};
const spark = (w, h, col, fill) => { const pts = [0, 4, 3, 9, 8, 13, 12, 19, 18, 22, 27, 26, 30, 33, 36, 38, 40, 43, 47, 50, 52, 56, 60, 61]; const n = pts.length; const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (n - 1) * w).toFixed(1)} ${(8 + v / 61 * (h - 16)).toFixed(1)}`).join(''); return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="sg${col.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fill}" stop-opacity=".45"/><stop offset="1" stop-color="${fill}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${w} ${h}L0 ${h}Z" fill="url(#sg${col.slice(1)})"/><path d="${d}" fill="none" stroke="${col}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>`; };
const ring = (sz, f, col, bg, sw = 12) => { const r = (sz - sw) / 2, c = 2 * Math.PI * r; return `<svg width="${sz}" height="${sz}"><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${sw}"/><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c * f} ${c}" transform="rotate(-90 ${sz / 2} ${sz / 2})"/></svg>`; };
const base = `*{box-sizing:border-box}html,body{margin:0}.s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif}h1,.o{font-family:Outfit,sans-serif}`;
const logo = (col, ink) => `<div style="display:flex;align-items:center;gap:14px;color:${col}"><span style="width:52px;height:52px;display:block;color:${col}">${IC.yaprak}</span><b style="font:700 44px Outfit;letter-spacing:-.02em;color:${ink}">Hafif</b></div>`;

/* ———————— A · Gece: koyu zümrüt, yüzen kartlardan kolaj ———————— */
const A = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:radial-gradient(70% 40% at 85% 8%,#1F8A70 0%,transparent 70%),radial-gradient(60% 35% at 0% 62%,#12524A 0%,transparent 70%),linear-gradient(170deg,#0B3B33 0%,#061F1B 100%);color:#fff}
.top{position:absolute;left:88px;right:88px;top:110px}
h1{margin:64px 0 0;font:700 104px/1.02 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#9FF0D6}
.sub{margin-top:30px;font:500 36px/1.4 Figtree;color:rgba(255,255,255,.72);max-width:860px}
.c{position:absolute;border-radius:44px;box-shadow:0 50px 90px -40px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.08) inset}
.hero{left:88px;top:700px;width:560px;height:420px;background:linear-gradient(160deg,#17604F 0%,#0B3B33 100%);padding:40px;overflow:hidden}
.hero .e{font:600 24px Figtree;letter-spacing:.12em;color:rgba(255,255,255,.62)}
.hero .m{font:700 150px/1 Outfit;letter-spacing:-.05em;margin-top:18px}.hero .m small{font-size:52px;color:rgba(255,255,255,.6);margin-left:6px;letter-spacing:0}
.hero .ft{font:500 28px Figtree;color:rgba(255,255,255,.65);margin-top:6px}.hero .ft b{color:#fff}
.hero svg{position:absolute;left:0;bottom:0}
.rings{right:64px;top:850px;width:430px;padding:34px 34px 30px;background:#F5F8F6;color:#0B2420;transform:rotate(3deg)}
.rings h3{margin:0 0 22px;font:700 34px Outfit}.rg{display:grid;grid-template-columns:1fr 1fr;gap:20px 14px}.rg div{position:relative;display:flex;flex-direction:column;align-items:center;font:600 22px Figtree;color:#5F726C}
.rg div b{position:absolute;top:44px;font:700 30px Outfit;color:#0B2420}.rg div span{margin-top:8px}
.shot{left:88px;top:1250px;width:490px;padding:30px 34px;background:#fff;color:#0B2420;display:flex;gap:24px;align-items:center;transform:rotate(-2deg)}
.shot .n{width:96px;height:96px;border-radius:28px;background:#E6EBF5;color:#27407A;display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 44px/1 Outfit}.shot .n small{font:600 18px Figtree}
.shot b{display:block;font:700 34px Outfit}.shot span{font:500 24px Figtree;color:#5F726C}
.coach{right:72px;top:1420px;width:520px;padding:32px 34px;background:#0F2A25;border:1px solid rgba(159,240,214,.25);transform:rotate(2deg)}
.coach .k{display:flex;align-items:center;gap:10px;font:600 24px Figtree;color:#9FF0D6}.coach .k span{width:30px;height:30px;display:block}
.coach p{margin:14px 0 0;font:700 32px/1.25 Outfit;color:#fff}.coach small{display:block;margin-top:10px;font:500 22px/1.4 Figtree;color:rgba(255,255,255,.6)}
.trust{position:absolute;left:88px;right:88px;bottom:96px;display:flex;justify-content:space-between;align-items:center;padding-top:34px;border-top:1px solid rgba(255,255,255,.14)}
.trust div{display:flex;align-items:center;gap:14px;font:600 28px Figtree;color:rgba(255,255,255,.88)}.trust i{width:40px;height:40px;color:#9FF0D6;display:block}
.plus{position:absolute;right:88px;top:118px;font:700 24px Figtree;letter-spacing:.06em;color:#0B3B33;background:#9FF0D6;border-radius:99px;padding:12px 24px}
</style></head><body><div class="s">
<div class="top">${logo('#9FF0D6', '#fff')}
<h1>Kilo yolculuğun,<br><em>tek sakin yerde.</em></h1>
<div class="sub">Tartın, haftalık iğnen, proteinin ve suyun; seni tanıyan bir koçla.</div></div>
<span class="plus">7 GÜN PLUS ÜCRETSİZ</span>
<div class="c hero"><div class="e">İLK İĞNEDEN BU YANA · 59 GÜN</div><div class="m">−7,2<small>kg</small></div><div class="ft">98,4 → <b>91,2 kg</b> · hedefin %39'u</div>${spark(560, 130, '#9FF0D6', '#7FE0C2')}</div>
<div class="c rings"><h3>Bugün</h3><div class="rg">
<div>${ring(118, .67, '#C27A12', '#FBF0DC')}<b>74</b><span>Protein</span></div><div>${ring(118, .7, '#2E8BC0', '#E4F1F8')}<b>1,75</b><span>Su (L)</span></div>
<div>${ring(118, .83, '#1C8EA6', '#E1F1F4')}<b style="font-size:26px">6.240</b><span>Adım</span></div><div>${ring(118, .5, '#B8577A', '#F7E8EE')}<b>2/4</b><span>Takviye</span></div></div></div>
<div class="c shot"><div class="n">4<small>gün</small></div><div><b>Salı · 7,5 mg ↑</b><span>Öneri: Karın (sol)</span></div></div>
<div class="c coach"><div class="k"><span>${IC.koc}</span>Koç · iğneden sonraki 2. gün</div><p>Bulantı en çok bugün oluyor. Küçük ve sık ye.</p><small>Son 9 iğnene göre, sana özel.</small></div>
<div class="trust"><div><i>${IC.kisi}</i>Hesap yok</div><div><i>${IC.reklam}</i>Reklam yok</div><div><i>${IC.telefon}</i>Veri telefonunda</div></div>
</div></body></html>`;

/* ———————— B · Bento: açık, sıcak zemin, özellik karoları ———————— */
const tile = (cls, inner) => `<div class="t ${cls}">${inner}</div>`;
const B = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:radial-gradient(80% 30% at 100% 0%,#E3F1EA 0%,transparent 70%),#F5F2EB;color:#0B2420}
.top{position:absolute;left:80px;right:80px;top:100px}
h1{margin:52px 0 0;font:700 100px/1.02 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#0E7C66}
.sub{margin-top:26px;font:500 34px/1.4 Figtree;color:#5F726C;max-width:900px}
.g{position:absolute;left:64px;right:64px;top:630px;display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:128px;gap:22px}
.t{border-radius:40px;background:#fff;padding:28px 30px;position:relative;overflow:hidden;box-shadow:0 24px 50px -36px rgba(11,36,32,.35)}
.t .l{display:flex;align-items:center;gap:10px;font:600 24px Figtree;color:#5F726C}.t .l i{width:30px;height:30px;display:block}
.kilo{grid-column:span 4;grid-row:span 2;background:linear-gradient(160deg,#17604F,#0B3B33);color:#fff}.kilo .l{color:rgba(255,255,255,.7)}
.kilo .m{font:700 128px/1 Outfit;letter-spacing:-.05em;margin-top:16px}.kilo .m small{font-size:44px;color:rgba(255,255,255,.6);letter-spacing:0;margin-left:6px}.kilo svg.sp{position:absolute;left:0;bottom:0}
.kilo .eta{position:absolute;right:30px;top:30px;text-align:right;font:500 22px Figtree;color:rgba(255,255,255,.65)}.kilo .eta b{display:block;font:700 34px Outfit;color:#9FF0D6}
.igne{grid-column:span 2;grid-row:span 2;background:#E6EBF5;color:#27407A}.igne .l{color:#27407A}
.igne .dial{position:absolute;left:50%;top:60%;transform:translate(-50%,-50%)}.igne .dial b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 44px Outfit}.igne .dial b small{font:600 18px Figtree;color:#5B6FA3}
.prot{grid-column:span 3;grid-row:span 2;background:#FBF0DC}.prot .l{color:#8A5A10}.prot .v{font:700 64px Outfit;margin-top:14px;color:#0B2420}.prot .v small{font-size:28px;color:#8A5A10}
.blk{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin-top:18px}.blk i{height:30px;border-radius:8px;background:rgba(194,122,18,.18)}.blk i.on{background:#D98A3D}
.su{grid-column:span 3;grid-row:span 2;background:#E4F1F8}.su .l{color:#1F6E99}.su .v{font:700 64px Outfit;margin-top:14px}.su .v small{font-size:28px;color:#1F6E99}
.glass{position:absolute;right:40px;bottom:30px;width:110px;height:150px;border:4px solid #9CC9E2;border-top:0;border-radius:0 0 22px 22px;overflow:hidden}.glass i{position:absolute;left:0;right:0;bottom:0;height:70%;background:linear-gradient(#7CC3EA,#2E8BC0)}
.koc{grid-column:span 4;grid-row:span 2;background:#0F2A25;color:#fff}.koc .l{color:#9FF0D6}.koc p{margin:16px 0 0;font:700 40px/1.2 Outfit}.koc small{display:block;margin-top:12px;font:500 24px Figtree;color:rgba(255,255,255,.6)}
.adim{grid-column:span 2;grid-row:span 2;background:#E1F1F4}.adim .l{color:#14707F}.adim .rr{position:absolute;left:50%;top:60%;transform:translate(-50%,-50%)}.adim .rr b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 36px Outfit}
.mini{grid-column:span 2;display:flex;flex-direction:column;justify-content:space-between;padding:22px 26px}.mini b{font:700 32px Outfit}.mini .l{font-size:22px}
.trust{position:absolute;left:80px;right:80px;bottom:90px;display:flex;justify-content:center;gap:16px}
.trust span{display:flex;align-items:center;gap:10px;background:#fff;border-radius:99px;padding:16px 26px;font:600 26px Figtree;color:#0B3B33;box-shadow:0 14px 30px -24px rgba(11,36,32,.5)}.trust i{width:30px;height:30px;color:#0E7C66;display:block}
</style></head><body><div class="s">
<div class="top">${logo('#0E7C66', '#0B3B33')}
<h1>Her şey,<br><em>bir bakışta.</em></h1>
<div class="sub">Kilo, haftalık iğne, protein, su, adım ve takviyeler; seni tanıyan bir koçla.</div></div>
<div class="g">
${tile('kilo', `<div class="l"><i>${IC.kilo}</i>Kilo · 59 gün</div><div class="m">−7,2<small>kg</small></div><div class="eta">Bu hızla hedefe<b>Mart 2027</b></div>${spark(640, 120, '#9FF0D6', '#7FE0C2').replace('<svg', '<svg class="sp"')}`)}
${tile('igne', `<div class="l"><i>${IC.igne}</i>İğne</div><div class="dial">${ring(190, .62, '#27407A', '#C9D3EA', 16)}<b>4<small>gün kaldı</small></b></div>`)}
${tile('prot', `<div class="l"><i>${IC.protein}</i>Protein</div><div class="v">74<small> / 110 g</small></div><div class="blk">${[...Array(16)].map((_, i) => `<i class="${i < 11 ? 'on' : ''}"></i>`).join('')}</div>`)}
${tile('su', `<div class="l"><i>${IC.su}</i>Su</div><div class="v">1,75<small> / 2,5 L</small></div><div class="glass"><i></i></div>`)}
${tile('koc', `<div class="l"><i>${IC.koc}</i>Kişisel koç</div><p>Tartı 3 gündür aynı ama belin 1,5 cm incelmiş.</p><small>Kayıtlarına bakar, doğru anda tek öneri verir.</small>`)}
${tile('adim', `<div class="l"><i>${IC.adim}</i>Adım</div><div class="rr">${ring(170, .83, '#1C8EA6', '#C5E3EA', 14)}<b>6.240</b></div>`)}
${tile('mini', `<div class="l"><i>${IC.plan}</i>Doz planı</div><b>Salı 7,5 mg</b>`)}
${tile('mini', `<div class="l"><i>${IC.foto}</i>Fotoğraflar</div><b>Önce / sonra</b>`)}
${tile('mini', `<div class="l"><i>${IC.rapor}</i>Doktor raporu</div><b>Tek PDF</b>`)}
</div>
<div class="trust"><span><i>${IC.kisi}</i>Hesap yok</span><span><i>${IC.reklam}</i>Reklam yok</span><span><i>${IC.telefon}</i>Veri telefonunda</span></div>
</div></body></html>`;

/* ———————— C · Yörünge: ortada büyük halka, etrafında özellikler ———————— */
const arcs = (() => { const sz = 640, cx = sz / 2, rs = [290, 254, 218, 182], cols = [['#C27A12', .67], ['#2E8BC0', .7], ['#1C8EA6', .83], ['#7FA3F0', .62]]; return `<svg width="${sz}" height="${sz}">${rs.map((r, i) => { const c = 2 * Math.PI * r; return `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="22"/><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${cols[i][0]}" stroke-width="22" stroke-linecap="round" stroke-dasharray="${c * cols[i][1]} ${c}" transform="rotate(-90 ${cx} ${cx})"/>`; }).join('')}</svg>`; })();
const orb = [['Kilo', IC.kilo, 150, 920], ['İğne', IC.igne, 140, 1190], ['Koç', IC.koc, 150, 1460], ['Protein', IC.protein, 930, 920], ['Su', IC.su, 950, 1190], ['Adım', IC.adim, 935, 1460], ['Rapor', IC.rapor, 410, 1600], ['Takviye', IC.takviye, 670, 1600]];
const C = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${base}
.s{background:radial-gradient(60% 35% at 50% 62%,#145A4C 0%,transparent 75%),linear-gradient(180deg,#0A2E29 0%,#05181A 100%);color:#fff}
.top{position:absolute;left:0;right:0;top:110px;text-align:center;display:flex;flex-direction:column;align-items:center}
h1{margin:52px 0 0;font:700 96px/1.04 Outfit;letter-spacing:-.035em}h1 em{font-style:normal;color:#9FF0D6}
.sub{margin-top:26px;font:500 34px/1.4 Figtree;color:rgba(255,255,255,.7);max-width:820px}
.ar{position:absolute;left:50%;top:1190px;transform:translate(-50%,-50%)}
.mid{position:absolute;left:50%;top:1190px;transform:translate(-50%,-50%);text-align:center}
.mid .e{font:600 18px Figtree;letter-spacing:.14em;color:rgba(255,255,255,.6)}.mid .m{font:700 104px/1 Outfit;letter-spacing:-.05em;margin:10px 0 4px}.mid .m small{font-size:50px;color:rgba(255,255,255,.55);letter-spacing:0}
.mid .f{font:500 22px Figtree;color:rgba(255,255,255,.65)}
.ob{position:absolute;display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.07);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.14);border-radius:99px;padding:14px 24px 14px 14px;font:600 26px Figtree;transform:translate(-50%,-50%)}
.ob i{width:46px;height:46px;border-radius:50%;background:rgba(159,240,214,.16);color:#9FF0D6;padding:10px;display:block}
.leg{position:absolute;left:0;right:0;top:1700px;display:flex;justify-content:center;gap:26px;font:500 22px Figtree;color:rgba(255,255,255,.6)}.leg span{display:flex;align-items:center;gap:8px}.leg i{width:14px;height:14px;border-radius:50%;display:block}
.trust{position:absolute;left:0;right:0;bottom:70px;text-align:center;font:600 28px Figtree;color:rgba(255,255,255,.85)}.trust b{color:#9FF0D6;font-weight:600}
</style></head><body><div class="s">
<div class="top">${logo('#9FF0D6', '#fff')}
<h1>Kilonu, iğneni, suyunu<br><em>tek ekranda gör.</em></h1>
<div class="sub">Sakin bir yardımcı: hesap açmadan, verini telefondan çıkarmadan.</div></div>
<div class="ar">${arcs}</div>
<div class="mid"><div class="e">İLK İĞNEDEN BU YANA</div><div class="m">−7,2<small>kg</small></div><div class="f">hedefin %39'u · Mart 2027</div></div>
${orb.map(([n, ic, x, y]) => `<div class="ob" style="left:${x}px;top:${y}px"><i>${ic}</i>${n}</div>`).join('')}
<div class="leg"><span><i style="background:#C27A12"></i>Protein 74 g</span><span><i style="background:#2E8BC0"></i>Su 1,75 L</span><span><i style="background:#1C8EA6"></i>6.240 adım</span><span><i style="background:#7FA3F0"></i>İğneye 4 gün</span></div>
<div class="trust">Hesap yok · Reklam yok · Veri telefonunda · <b>7 gün Plus ücretsiz</b></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [ad, html] of [['A-gece', A], ['B-bento', B], ['C-yorunge', C]]) {
    const f = path.join(OUT, `_${ad}.html`); fs.writeFileSync(f, html);
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, ad + '.png') }); fs.unlinkSync(f);
  }
  await b.close(); console.log('tamam');
})();
