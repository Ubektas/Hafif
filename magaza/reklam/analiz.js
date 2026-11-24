#!/usr/bin/env node
// Google Ads "Reklam zaman planlaması gün ve saat raporu" CSV'lerini birleştirip özetler.
// Kullanım: node magaza/reklam/analiz.js            (saatlik/ klasöründeki tüm dosyalar)
//           node magaza/reklam/analiz.js dosya.csv  (tek dosya)
// Hem sekmeyle ayrılmış UTF-16 hem virgülle ayrılmış UTF-8 dışa aktarımı okur.
// Rapor birden fazla gün kapsayabilir; gün, 2. satırdaki tarih aralığı + "Haftanın günü" ile bulunur.
// Aynı gün+saat birden fazla dosyada varsa adı alfabetik olarak sonra gelen (daha yeni) dosya geçerlidir.

const fs = require("fs");
const path = require("path");

const AYLAR = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"];
const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function oku(dosya) {
  const ham = fs.readFileSync(dosya);
  const utf16 = ham[0] === 0xff && ham[1] === 0xfe;
  return (utf16 ? ham.toString("utf16le") : ham.toString("utf8")).replace(/^﻿/, "");
}

// Tırnak içindeki ayırıcıları bölmeden tek satırı ayırır.
function bol(satir, ayirici) {
  const out = [];
  let cur = "", tirnak = false;
  for (const ch of satir) {
    if (ch === '"') tirnak = !tirnak;
    else if (ch === ayirici && !tirnak) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const sayi = (s) => parseFloat(String(s || "0").replace(/\./g, "").replace(",", ".")) || 0;

function tarih(metin) {
  const m = metin.match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);
  if (!m) return null;
  const ay = AYLAR.indexOf(m[2].toLocaleLowerCase("tr"));
  return ay < 0 ? null : new Date(Date.UTC(+m[3], ay, +m[1]));
}
const iso = (d) => d.toISOString().slice(0, 10);

function satirlar(dosya) {
  const metin = oku(dosya).split(/\r?\n/);
  const baslikNo = metin.findIndex((l) => l.startsWith("Haftanın günü"));
  if (baslikNo < 0) throw new Error(dosya + ": başlık satırı bulunamadı");
  const ayirici = metin[baslikNo].includes("\t") ? "\t" : ",";
  const baslik = bol(metin[baslikNo], ayirici);
  const i = (ad) => baslik.indexOf(ad);

  // Tarih aralığındaki her gün için haftanın günü → tarih eşlemesi
  const [bas, son] = (metin[baslikNo - 1] || "").split(" - ").map(tarih);
  const gunTarihi = {};
  if (bas && son) {
    if ((son - bas) / 864e5 > 6) console.error(`Uyarı: ${path.basename(dosya)} 7 günden uzun; aynı haftanın günleri karışır.`);
    for (let d = new Date(bas); d <= son; d = new Date(d.getTime() + 864e5)) gunTarihi[GUNLER[d.getUTCDay()]] = iso(d);
  }

  const out = [];
  for (const l of metin.slice(baslikNo + 1)) {
    const c = bol(l, ayirici);
    if (!c[0] || c[1] === "" || c[1] === undefined) continue; // toplam ve boş satırlar
    const haftaGunu = c[i("Haftanın günü")];
    out.push({
      gun: gunTarihi[haftaGunu] || haftaGunu,
      haftaGunu,
      saat: +c[i("Günün saati")],
      maliyet: sayi(c[i("Maliyet")]),
      donusum: sayi(c[i("Dönüşümler")]),
    });
  }
  return out;
}

const bloklar = [
  ["Gece 00–05", 0, 5],
  ["Sabah 06–11", 6, 11],
  ["Öğleden sonra 12–16", 12, 16],
  ["Akşam 17–23", 17, 23],
];

const tl = (n) => "₺" + n.toFixed(2).replace(".", ",");
const ybm = (m, d) => (d ? tl(m / d) : "—");

// --saat=N: her gün için 00:00'dan N:59'a kadarki birikimli toplam (aynı saate kadar karşılaştırma).
const saatArg = process.argv.slice(2).find((a) => a.startsWith("--saat="));
const kesim = saatArg ? +saatArg.split("=")[1] : null;
const argDosyalar = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const klasor = path.join(__dirname, "saatlik");
const dosyalar = argDosyalar.length
  ? argDosyalar
  : fs.readdirSync(klasor).filter((f) => f.endsWith(".csv")).sort().map((f) => path.join(klasor, f));

const tekil = new Map();
for (const d of dosyalar) for (const r of satirlar(d)) tekil.set(r.gun + "|" + r.saat, r);
const hepsi = [...tekil.values()];
const top = (r) => r.reduce((a, x) => ({ m: a.m + x.maliyet, d: a.d + x.donusum }), { m: 0, d: 0 });
const gunler = [...new Set(hepsi.map((x) => x.gun))].sort();

if (kesim !== null) {
  console.log(`## Günlere göre ${String(kesim).padStart(2, "0")}:59'a kadar\n\n| Gün | Harcama | Yükleme | Yükleme başı |\n|---|---|---|---|`);
  for (const g of gunler) {
    const r = hepsi.filter((x) => x.gun === g && x.saat <= kesim);
    if (!r.length || Math.max(...hepsi.filter((x) => x.gun === g).map((x) => x.saat)) < kesim) continue;
    const t = top(r);
    console.log(`| ${g} ${r[0].haftaGunu} | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} |`);
  }
  process.exit(0);
}

console.log(`# Saatlik reklam özeti (${gunler.length} gün)\n`);

console.log("## Günlere göre\n\n| Gün | Harcama | Yükleme | Yükleme başı | Saat aralığı |\n|---|---|---|---|---|");
for (const g of gunler) {
  const r = hepsi.filter((x) => x.gun === g);
  const t = top(r);
  const s = r.map((x) => x.saat);
  console.log(`| ${g} ${r[0].haftaGunu} | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} | ${Math.min(...s)}–${Math.max(...s)} |`);
}

const T = top(hepsi);
const pay = (v, tot) => (tot ? "%" + Math.round((v / tot) * 100) : "—");
console.log("\n## Saat bloklarına göre (tüm günler)\n\n| Blok | Harcama | Yükleme | Yükleme başı | Harcama payı | Yükleme payı |\n|---|---|---|---|---|---|");
for (const [ad, a, b] of bloklar) {
  const t = top(hepsi.filter((x) => x.saat >= a && x.saat <= b));
  console.log(`| ${ad} | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} | ${pay(t.m, T.m)} | ${pay(t.d, T.d)} |`);
}

console.log("\n## Saat saat (tüm günler)\n\n| Saat | Harcama | Yükleme | Yükleme başı |\n|---|---|---|---|");
for (let s = 0; s < 24; s++) {
  const t = top(hepsi.filter((x) => x.saat === s));
  console.log(`| ${String(s).padStart(2, "0")}:00 | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} |`);
}

console.log(`\n**Toplam:** ${tl(T.m)} harcama, ${T.d} yükleme, yükleme başı ${ybm(T.m, T.d)}`);
