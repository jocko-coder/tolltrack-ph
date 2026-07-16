// Render an animated HTML timeline to MP4: capture deterministic frames via
// window.seek(t), then encode with ffmpeg (libx264).
// Usage: node src/video/render-video.js animatic [fps] [dpr]
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');

const FFMPEG = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const ROOT = path.join(__dirname, '..', '..');

const BUILDS = {
  animatic: { mod: './animatic', dur: 6.4, out: 'perla-ad-animatic' },
};

async function main() {
  const which = process.argv[2] || 'animatic';
  const fps = Number(process.argv[3] || 30);
  const dpr = Number(process.argv[4] || 1);
  const cfg = BUILDS[which];
  if (!cfg) throw new Error('unknown build ' + which);

  const { buildHTML } = require(cfg.mod);
  const framesDir = path.join(ROOT, 'build', 'frames');
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const htmlPath = path.join(ROOT, 'build', `video-${which}.html`);
  fs.writeFileSync(htmlPath, buildHTML());

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--force-color-profile=srgb', '--no-sandbox', '--disable-lcd-text'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: dpr });
  const pg = await ctx.newPage();
  await pg.goto('file://' + htmlPath);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(200);

  const total = Math.round(cfg.dur * fps);
  for (let i = 0; i < total; i++) {
    const t = i / fps;
    await pg.evaluate((tt) => window.seek(tt), t);
    await pg.screenshot({ path: path.join(framesDir, `f_${String(i).padStart(5, '0')}.png`) });
    if (i % 30 === 0) console.log(`frame ${i}/${total}`);
  }
  await browser.close();

  const outMp4 = path.join(ROOT, 'out', 'video', `${cfg.out}.mp4`);
  execFileSync(FFMPEG, [
    '-y', '-framerate', String(fps),
    '-i', path.join(framesDir, 'f_%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17',
    '-vf', `scale=1080:1920:flags=lanczos`,
    '-movflags', '+faststart',
    outMp4,
  ], { stdio: 'inherit' });
  console.log('wrote', outMp4);
}

main().catch((e) => { console.error(e); process.exit(1); });
