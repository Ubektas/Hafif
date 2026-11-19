// Instagram Reels reklam videosu: App Store tanıtım görsellerinden (magaza/ios-2) 1080×1920, ~27 sn.
// Her görsel yukarıdan aşağı yavaşça kayar (başlık önce görünür), geçişler yumuşak; sonda kapanış kartı.
// İğne/doz görseli (03) reklam politikası (reçeteli ilaç) riski yüzünden kullanılmaz.
// Çalıştırma: node magaza/kaynak/video/reels.js <playwright modül yolu>
const { chromium } = require(process.argv[2] || 'playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..'), OUT = path.join(ROOT, 'magaza/video');
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'reels-'));
const SLAYT = ['01-neler-yapar', '02-ne-yesem', '04-koc', '05-kilo-yolu', '06-her-gun', '07-ilerleme', '08-rapor-gizlilik']
  .map(a => path.join(ROOT, 'magaza/ios-2', a + '.png'));
const D = 3.8, X = 0.4, SON = 3.6, FPS = 30;

const kapanis = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${ROOT}/www/fonts/fonts.css"><style>
*{box-sizing:border-box}html,body{margin:0}.s{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Figtree,sans-serif;color:#fff;
background:radial-gradient(80% 45% at 100% 0%,#1F8A70 0%,transparent 65%),#0B3B33;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.ic{width:260px;height:260px;border-radius:60px;box-shadow:0 40px 80px -30px rgba(0,0,0,.6)}
h1{margin:60px 0 0;font:700 104px/1.02 Outfit;letter-spacing:-.04em}h1 em{font-style:normal;color:#9FF0D6}
p{margin:34px 90px 0;font:500 40px/1.4 Figtree;color:rgba(255,255,255,.8)}
.st{margin-top:70px;display:flex;gap:22px}.st span{padding:22px 34px;border-radius:24px;background:#F4F1EA;color:#0B3B33;font:700 36px Figtree}
.f{margin-top:46px;font:600 32px Figtree;color:#9FF0D6}
</style></head><body><div class="s">
<img class="ic" src="file://${ROOT}/assets/icon-only.png">
<h1>Hafif<br><em>tek yerde.</em></h1>
<p>Kilo, iğne günü, protein, su ve adım.<br>Hesap yok, veriler telefonunda.</p>
<div class="st"><span>App Store</span><span>Google Play</span></div>
<div class="f">İlk 7 gün Plus ücretsiz</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const h = path.join(TMP, 'k.html'); fs.writeFileSync(h, kapanis);
  await p.goto('file://' + h); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const son = path.join(TMP, 'son.png'); await p.screenshot({ path: son }); await b.close();

  const n = SLAYT.length, SURE = n * D + SON - n * X;
  const wav = path.join(TMP, 'm.wav');
  execFileSync('python3', [path.join(__dirname, 'muzik.py'), String(SURE), wav], { stdio: 'inherit' });

  const args = ['-y', '-loglevel', 'error'];
  SLAYT.forEach(f => args.push('-loop', '1', '-t', String(D), '-i', f));
  args.push('-loop', '1', '-t', String(SON), '-i', son, '-i', wav);
  let g = SLAYT.map((_, i) =>
    `[${i}:v]scale=1080:-2,crop=1080:1920:0:'(ih-1920)*min(1\\,t/${D - 0.3})',fps=${FPS},setsar=1,format=yuv420p[v${i}]`);
  g.push(`[${n}:v]scale=1080:1920,zoompan=z='1+0.0006*on':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps=${FPS},setsar=1,format=yuv420p[v${n}]`);
  let prev = 'v0', t = D;
  for (let i = 1; i <= n; i++) {
    const off = (t - X).toFixed(2), o = i === n ? 'vout' : `x${i}`;
    g.push(`[${prev}][v${i}]xfade=transition=${i === n ? 'fade' : 'slideleft'}:duration=${X}:offset=${off}[${o}]`);
    prev = o; t = t - X + (i === n ? SON : D);
  }
  g.push(`[${n + 1}:a]afade=t=out:st=${(SURE - 1.5).toFixed(2)}:d=1.5[aout]`);
  const mp4 = path.join(OUT, 'hafif-reels-1080x1920.mp4');
  args.push('-filter_complex', g.join(';'), '-map', '[vout]', '-map', '[aout]', '-t', SURE.toFixed(2),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', mp4);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('video: ' + mp4 + ' (' + SURE.toFixed(1) + ' sn)');
})();
