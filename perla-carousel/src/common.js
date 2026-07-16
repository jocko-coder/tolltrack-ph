// Shared tokens, fonts, surface language, grain/vignette for every artboard.
'use strict';

const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='280' height='280' filter='url(#n)'/></svg>`
);

const BASE_CSS = `
@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: 300 900;
  src: url('../fonts/figtree-latin.woff2') format('woff2');
}
@font-face {
  font-family: 'Figtree';
  font-style: italic;
  font-weight: 300 900;
  src: url('../fonts/figtree-italic-latin.woff2') format('woff2');
}
@font-face {
  font-family: 'Doto';
  font-style: normal;
  font-weight: 100 900;
  src: url('../fonts/doto-latin.woff2') format('woff2');
}

:root {
  --teal: #15C2B6;
  --rose: #F2789F;
  --wash: #E8F6F5;
  --ink: #06272E;
  --paper: #FFFFFF;
  --amber: #F5B85C;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body {
  font-family: 'Figtree', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background: var(--ink);
}

.artboard {
  position: relative;
  width: 1080px;
  height: 1350px;
  overflow: hidden;
}

/* ------- final overlays: vignette then grain, on every slide ------- */
.vignette {
  position: absolute; inset: 0; z-index: 900; pointer-events: none;
  background: radial-gradient(130% 110% at 50% 45%, transparent 55%, rgba(6,39,46,0.12) 100%);
}
.grain {
  position: absolute; inset: -20px; z-index: 901; pointer-events: none;
  background-image: url("data:image/svg+xml,${GRAIN_SVG}");
  background-size: 280px 280px;
  opacity: 0.035;
  mix-blend-mode: overlay;
}

/* ------- surface language ------- */
.glass {
  background: rgba(255,255,255,0.14);
  -webkit-backdrop-filter: blur(28px);
  backdrop-filter: blur(28px);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(6,39,46,0.35);
}
.eyebrow {
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* duotone plate fallback: gradient mesh, teal duotone mood */
.mesh {
  position: absolute; inset: 0;
  background:
    radial-gradient(85% 70% at 22% 18%, rgba(21,194,182,0.55) 0%, rgba(21,194,182,0.0) 60%),
    radial-gradient(70% 60% at 85% 78%, rgba(232,246,245,0.22) 0%, rgba(232,246,245,0.0) 55%),
    radial-gradient(120% 100% at 60% 40%, rgba(11,84,88,0.85) 0%, rgba(6,39,46,1) 78%),
    #06272E;
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

// pass-2 page: sharp base image + blurred masked copy (photographic DOF),
// then vignette + grain on top.
function dofPage({ title, imgSrc, blurPx, maskCss }) {
  const css = `
.base, .blurcopy { position: absolute; inset: 0; width: 1080px; height: 1350px; }
.blurcopy {
  filter: blur(${blurPx}px);
  transform: scale(${1 + (blurPx * 2.4) / 1080});
  -webkit-mask-image: ${maskCss};
  mask-image: ${maskCss};
}`;
  const body = `<img class="base" src="${imgSrc}"><img class="blurcopy" src="${imgSrc}">`;
  return page({ title, css, body, overlays: true });
}

module.exports = { page, dofPage, BASE_CSS };
