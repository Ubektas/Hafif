#!/usr/bin/env node
// Google Ads "Reklam zaman planlaması gün ve saat raporu" CSV'lerini birleştirip özetler.
// Kullanım: node magaza/reklam/analiz.js            (saatlik/ klasöründeki tüm dosyalar)
//           node magaza/reklam/analiz.js dosya.csv  (tek dosya; UTF-16 Google Ads dışa aktarımı da olur)
// Her günün raporunu saatlik/YYYY-AA-GG.csv olarak kaydet.

const fs = require("fs");
const path = require("path");

function oku(dosya) {
  const ham = fs.readFileSync(dosya);
  const utf16 = ham[0] === 0xff && ham[1] === 0xfe;
  return (utf16 ? ham.toString("utf16le") : ham.toString("utf8")).replace(/^﻿/, "");
}

const sayi = (s) => parseFloat(String(s || "0").replace(/"/g, "").replace(/\./g, "").replace(",", ".")) || 0;

function satirlar(dosya) {
  const gun = path.basename(dosya, ".csv");
  const metin = oku(dosya).split(/\r?\n/);
  const baslikNo = metin.findIndex((l) => l.startsWith("Haftanın günü"));
  if (baslikNo < 0) throw new Error(dosya + ": başlık satırı bulunamadı");
  const baslik = metin[baslikNo].split("\t");
  const i = (ad) => baslik.indexOf(ad);
  const out = [];
  for (const l of metin.slice(baslikNo + 1)) {
    const c = l.split("\t");
    if (!c[0] || c[1] === "" || c[1] === undefined) continue; // toplam satırları
    out.push({ gun, haftaGunu: c[i("Haftanın günü")], saat: +c[i("Günün saati")], maliyet: sayi(c[i("Maliyet")]), donusum: sayi(c[i("Dönüşümler")]) });
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

const argDosyalar = process.argv.slice(2);
const klasor = path.join(__dirname, "saatlik");
const dosyalar = argDosyalar.length
  ? argDosyalar
  : fs.readdirSync(klasor).filter((f) => f.endsWith(".csv")).sort().map((f) => path.join(klasor, f));

const hepsi = dosyalar.flatMap(satirlar);
const top = (r) => r.reduce((a, x) => ({ m: a.m + x.maliyet, d: a.d + x.donusum }), { m: 0, d: 0 });

console.log(`# Saatlik reklam özeti (${dosyalar.length} gün)\n`);

console.log("## Günlere göre\n\n| Gün | Harcama | Yükleme | Yükleme başı |\n|---|---|---|---|");
for (const g of [...new Set(hepsi.map((x) => x.gun))]) {
  const t = top(hepsi.filter((x) => x.gun === g));
  console.log(`| ${g} | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} |`);
}

const T = top(hepsi);
console.log("\n## Saat bloklarına göre\n\n| Blok | Harcama | Yükleme | Yükleme başı | Harcama payı | Yükleme payı |\n|---|---|---|---|---|---|");
for (const [ad, a, b] of bloklar) {
  const t = top(hepsi.filter((x) => x.saat >= a && x.saat <= b));
  const pay = (v, tot) => (tot ? "%" + Math.round((v / tot) * 100) : "—");
  console.log(`| ${ad} | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} | ${pay(t.m, T.m)} | ${pay(t.d, T.d)} |`);
}

console.log("\n## Saat saat\n\n| Saat | Harcama | Yükleme | Yükleme başı |\n|---|---|---|---|");
for (let s = 0; s < 24; s++) {
  const t = top(hepsi.filter((x) => x.saat === s));
  console.log(`| ${String(s).padStart(2, "0")}:00 | ${tl(t.m)} | ${t.d} | ${ybm(t.m, t.d)} |`);
}

console.log(`\n**Toplam:** ${tl(T.m)} harcama, ${T.d} yükleme, yükleme başı ${ybm(T.m, T.d)}`);
