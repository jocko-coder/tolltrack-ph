// APLUS — shared tokens, fonts, grain/vignette for every artboard.
// Palette lifted from the real app: deep navy chrome, a brighter blue for the
// AOG hero, lime green as the action accent, red for AOG, amber for NIS.
'use strict';

const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='280' height='280' filter='url(#n)'/></svg>`
);

const BASE_CSS = `
@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: 300 900;
  src: url('../../perla-carousel/fonts/figtree-latin.woff2') format('woff2');
}

:root {
  --navy:     #14284F;   /* status bar / chrome */
  --navy-dp:  #0B1A38;   /* deepest navy */
  --navy-ink: #16294D;   /* headings on light */
  --blue:     #1A4C9E;   /* AOG hero card */
  --blue-hi:  #2060C0;
  --lime:     #8DC63F;
  --lime-hi:  #A3DC52;
  --aog:      #DC3A2E;
  --nis:      #C67C1E;
  --wash:     #EEF1F5;   /* app background */
  --paper:    #FFFFFF;
  --muted:    #5C6B84;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body {
  font-family: 'Figtree', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: var(--navy-dp);
}

.artboard { position: relative; width: 1080px; height: 1350px; overflow: hidden; }

/* ------- final overlays ------- */
.vignette {
  position: absolute; inset: 0; z-index: 900; pointer-events: none;
  background: radial-gradient(130% 110% at 50% 45%, transparent 55%, rgba(6,16,34,0.14) 100%);
}
.grain {
  position: absolute; inset: -20px; z-index: 901; pointer-events: none;
  background-image: url("data:image/svg+xml,${GRAIN_SVG}");
  background-size: 280px 280px;
  opacity: 0.035;
  mix-blend-mode: overlay;
}
`;

function page({ title, css, body, overlays = true }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>${BASE_CSS}\n${css}</style></head>
<body>
<div class="artboard">
${body}
${overlays ? '<div class="vignette"></div>\n<div class="grain"></div>' : ''}
</div>
</body></html>`;
}

// pass-2: sharp base + blurred masked copy (photographic DOF), optional crisp
// overlay, then vignette + grain.
function dofPage({ title, imgSrc, blurPx, maskCss, overlay }) {
  const css = `
.base, .blurcopy { position: absolute; inset: 0; width: 1080px; height: 1350px; }
.blurcopy {
  filter: blur(${blurPx}px);
  transform: scale(${1 + (blurPx * 2.4) / 1080});
  -webkit-mask-image: ${maskCss};
  mask-image: ${maskCss};
}
.ovl { position: absolute; z-index: 5; }
${overlay ? overlay.css || '' : ''}`;
  const body = `<img class="base" src="${imgSrc}"><img class="blurcopy" src="${imgSrc}">${overlay ? overlay.html || '' : ''}`;
  return page({ title, css, body, overlays: true });
}

module.exports = { page, dofPage, BASE_CSS };
