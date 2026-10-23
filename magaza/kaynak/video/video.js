// Tanıtım videosu: sahne.html'i kare kare çizer, müzikle birlikte MP4'e çevirir.
// Önce ekran-goruntuleri.js çalıştırılmış olmalı (magaza/ekran/*.png).
// Çalıştırma: node magaza/kaynak/video/video.js <playwright modül yolu> [fps]
const { chromium } = require(process.argv[2] || 'playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const FPS = +(process.argv[3] || 30);
const OUT = path.resolve(__dirname, '../../video');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'sahne.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const SURE = await p.evaluate(() => window.SURE);
  const wav = path.join(OUT, '_muzik.wav');
  execFileSync('python3', [path.join(__dirname, 'muzik.py'), String(SURE), wav], { stdio: 'inherit' });
  const mp4 = path.join(OUT, 'hafif-tanitim-1920x1080.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', wav,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
  const kare = Math.round(SURE * FPS);
  for (let i = 0; i < kare; i++) {
    await p.evaluate(t => window.render(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`kare ${i}/${kare}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  fs.unlinkSync(wav);
  await b.close();
  console.log('video: ' + mp4);
})();
