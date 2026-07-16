// Pre-bake the blurred/darkened backdrops for the montage so the video render
// doesn't recompute a heavy Gaussian blur every frame. One image per shot.
'use strict';
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const MASTERS = path.join(ROOT, 'out', 'masters');
const OUT = path.join(ROOT, 'build', 'montage-bg');
require('fs').mkdirSync(OUT, { recursive: true });

async function main() {
  for (let i = 1; i <= 9; i++) {
    const name = `perla-carousel-${String(i).padStart(2, '0')}.png`;
    // cover a 9:16 frame, blur hard, darken + slightly desaturate-boost for depth
    await sharp(path.join(MASTERS, name))
      .resize(720, 1280, { fit: 'cover' })
      .blur(42)
      .modulate({ brightness: 0.42, saturation: 1.18 })
      .png()
      .toFile(path.join(OUT, name));
    console.log('baked', name);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
