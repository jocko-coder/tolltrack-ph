// Build artboards → screenshot at 3× → export 1080×1350 JPG q90 + PNG masters.
// Usage: node src/run.js [slideNumbers...]   e.g. `node src/run.js 2 7`
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const sharp = require('sharp');
const { page, dofPage } = require('./common');
const slides = require('./slides');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const OUT = path.join(ROOT, 'out');
const MASTERS = path.join(OUT, 'masters');

async function main() {
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  fs.mkdirSync(BUILD, { recursive: true });
  fs.mkdirSync(MASTERS, { recursive: true });

  const targets = slides
    .map((s, i) => ({ ...s, idx: i + 1 }))
    .filter((s) => only.length === 0 || only.includes(s.idx));

  for (const s of targets) {
    // slides with a `post` DOF spec render without overlays in pass 1;
    // vignette + grain land in pass 2 together with the blur falloff
    const html = page({ title: s.name, css: s.css, body: s.body, overlays: !s.post });
    fs.writeFileSync(path.join(BUILD, `${s.name}.html`), html);
  }

  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--force-color-profile=srgb', '--no-sandbox', '--disable-lcd-text'],
  });

  // flat high-res plates for the bitmap-macro slides: MASTER A (slide 6) and
  // the real Home screen (slide 2). Live DOM at macro scale × dpr 3 exceeds
  // Chromium's compositor texture limits and drops tiles.
  {
    const { masterA, CSS_A } = require('./masterA');
    const { CSS_UI, masterAnalytics } = require('./masterUI');
    const plates = [
      { name: 'plate-a', css: CSS_A, body: masterA() },
      { name: 'plate-analytics', css: CSS_UI, body: masterAnalytics() },
    ];
    const pctx = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 8,
    });
    const pp = await pctx.newPage();
    for (const pl of plates) {
      fs.writeFileSync(
        path.join(BUILD, `${pl.name}.html`),
        page({ title: pl.name, css: pl.css, body: pl.body, overlays: false })
      );
      await pp.goto('file://' + path.join(BUILD, `${pl.name}.html`));
      await pp.evaluate(() => document.fonts.ready);
      await pp.waitForTimeout(250);
      await pp.screenshot({
        path: path.join(BUILD, `${pl.name}.png`),
        clip: { x: 0, y: 0, width: 430, height: 932 },
      });
    }
    await pctx.close();
  }

  const ctx = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 3,
  });
  const pg = await ctx.newPage();

  for (const s of targets) {
    const file = path.join(BUILD, `${s.name}.html`);
    await pg.goto('file://' + file);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(250);
    const masterPng = path.join(MASTERS, `${s.name}.png`);
    await pg.screenshot({ path: masterPng, type: 'png' });

    if (s.post) {
      // pass 2: blur the flat render photographically + overlays
      const passPng = path.join(BUILD, `${s.name}-pass1.png`);
      fs.copyFileSync(masterPng, passPng);
      const html2 = dofPage({
        title: s.name,
        imgSrc: `${s.name}-pass1.png`,
        blurPx: s.post.blurPx,
        maskCss: s.post.maskCss,
      });
      const file2 = path.join(BUILD, `${s.name}-pass2.html`);
      fs.writeFileSync(file2, html2);
      await pg.goto('file://' + file2);
      await pg.evaluate(() => document.fonts.ready);
      await pg.waitForTimeout(150);
      await pg.screenshot({ path: masterPng, type: 'png' });
    }
    await sharp(masterPng)
      .resize(1080, 1350, { kernel: 'lanczos3' })
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(path.join(OUT, `${s.name}.jpg`));
    console.log('done', s.name);
  }

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
