// Nine artboards — every slide is an extreme macro crop of a real APLUS screen
// (Splash, Home, Scan, Dashboard), tilted with shallow depth of field, a
// navy/blue bloom and a diagonal light sweep. Fully faithful UI.
'use strict';

// plate <img> reference (rendered separately at high dpr by run.js)
const IMG = (name, h = 932) =>
  `<img src="${name}.png" style="display:block;width:430px;height:${h}px">`;

/* ============================ macro helper ============================ */
// `focus` is a point in 430-wide plate coordinates; the translate needed to
// bring it to the centre of the artboard is solved rather than eyeballed:
//   final = translate + R(rot)·S(scale)·(focus − plateCentre)  →  0
function macro({ plate, plateH = 932, focus, rot, scale, blurPx, maskCss, bg, glow, sweep = true, overlay }) {
  const r = (rot * Math.PI) / 180;
  const dx = (focus[0] - 215) * scale;
  const dy = (focus[1] - plateH / 2) * scale;
  const tx = -(Math.cos(r) * dx - Math.sin(r) * dy);
  const ty = -(Math.sin(r) * dx + Math.cos(r) * dy);
  const transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot}deg) scale(${scale})`;

  return {
    css: `
.macro-bg { position: absolute; inset: 0; ${bg} }
.mwrap { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
.mx {
  position: absolute; left: -215px; top: ${-plateH / 2}px;
  width: 430px; height: ${plateH}px;
  transform: ${transform};
  box-shadow: 0 60px 140px rgba(3,10,24,0.6);
}
.bloom { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; ${glow ? `background: ${glow};` : ''} }
.sweep { position: absolute; inset: -12%; pointer-events: none; mix-blend-mode: screen;
  background: linear-gradient(114deg, transparent 40%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.08) 51%, transparent 60%); }
`,
    body: `
<div class="macro-bg"></div>
<div class="layer" style="position:absolute;inset:0"><div class="mwrap"><div class="mx">${plate}</div></div></div>
${glow ? '<div class="bloom"></div>' : ''}
${sweep ? '<div class="sweep"></div>' : ''}
`,
    post: { blurPx, maskCss, overlay },
  };
}

/* grade backdrops — deep aviation navy */
const BG_NAVY = 'background: radial-gradient(120% 90% at 50% 28%, #14305F 0%, #08152F 70%);';
const BG_INK = 'background: radial-gradient(120% 90% at 50% 32%, #102647 0%, #060F24 72%);';
const BG_DEEP = 'background: radial-gradient(120% 90% at 50% 44%, #0E2A55 0%, #050D1F 74%);';

const GLOW_BLUE = 'radial-gradient(48% 36% at 50% 46%, rgba(38,110,214,0.5) 0%, rgba(38,110,214,0) 72%)';
const GLOW_BLUE_HI = 'radial-gradient(52% 38% at 50% 44%, rgba(52,132,240,0.58) 0%, rgba(38,110,214,0) 72%)';
const GLOW_LIME = 'radial-gradient(50% 38% at 50% 46%, rgba(141,198,63,0.42) 0%, rgba(60,140,90,0.12) 46%, transparent 74%)';
const GLOW_AOG = 'radial-gradient(50% 38% at 50% 46%, rgba(220,58,46,0.34) 0%, rgba(120,40,80,0.14) 48%, transparent 76%)';

const H_HOME = 1030;
const H_DASH = 1060;

/* =============================== SLIDE 1 =============================== */
// Splash — the A+ mark, the APLUS wordmark and the lime swoosh. Opener.
const slide1 = {
  name: 'aplus-carousel-01',
  ...macro({
    plate: IMG('plate-splash'),
    focus: [215, 448],
    rot: -13,
    scale: 2.36,
    blurPx: 13,
    maskCss: 'radial-gradient(105% 105% at 48% 42%, transparent 42%, black 82%)',
    bg: BG_NAVY,
    glow: GLOW_BLUE,
    overlay: {
      css: ".s1-wm{ top:60px; left:64px; font-size:32px; font-weight:900; letter-spacing:0.22em; color:#fff; }",
      html: '<div class="ovl s1-wm">APLUS</div>',
    },
  }),
};

/* =============================== SLIDE 2 =============================== */
// Home — "Good morning, Ria." + "One aircraft is on ground. Start there."
const slide2 = {
  name: 'aplus-carousel-02',
  ...macro({
    plate: IMG('plate-home', H_HOME),
    plateH: H_HOME,
    focus: [200, 160],
    rot: 10,
    scale: 2.42,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 52% 44%, transparent 40%, black 80%)',
    bg: BG_INK,
    glow: GLOW_BLUE,
  }),
};

/* =============================== SLIDE 3 =============================== */
// Home — the AOG hero: "Continue kit for RP-C3287" + the 67% lime bar.
const slide3 = {
  name: 'aplus-carousel-03',
  ...macro({
    plate: IMG('plate-home', H_HOME),
    plateH: H_HOME,
    focus: [215, 300],
    rot: -15,
    scale: 2.44,
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_DEEP,
    glow: GLOW_BLUE_HI,
  }),
};

/* =============================== SLIDE 4 =============================== */
// Home — "Continue AOG pick" button + the 1 line NIS pill. The action.
const slide4 = {
  name: 'aplus-carousel-04',
  ...macro({
    plate: IMG('plate-home', H_HOME),
    plateH: H_HOME,
    focus: [200, 420],
    rot: 8,
    scale: 2.62,
    blurPx: 11,
    maskCss: 'radial-gradient(110% 110% at 50% 46%, transparent 44%, black 84%)',
    bg: BG_NAVY,
    glow: GLOW_BLUE_HI,
  }),
};

/* =============================== SLIDE 5 =============================== */
// Home — the stat tiles: 4 open work orders, 0/4 kits ready, 1 NIS line.
const slide5 = {
  name: 'aplus-carousel-05',
  ...macro({
    plate: IMG('plate-home', H_HOME),
    plateH: H_HOME,
    focus: [215, 572],
    rot: -11,
    scale: 2.38,
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_INK,
    glow: GLOW_BLUE,
  }),
};

/* =============================== SLIDE 6 =============================== */
// Scan — the viewfinder: lime brackets + "Start the camera".
const slide6 = {
  name: 'aplus-carousel-06',
  ...macro({
    plate: IMG('plate-scan'),
    focus: [215, 225],
    rot: 12,
    scale: 2.5,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 48%, transparent 42%, black 80%)',
    bg: BG_DEEP,
    glow: GLOW_LIME,
  }),
};

/* =============================== SLIDE 7 =============================== */
// Scan — the resolve sheet: "Point at a label". Bright, warm counterpoint.
const slide7 = {
  name: 'aplus-carousel-07',
  ...macro({
    plate: IMG('plate-scan'),
    focus: [215, 762],
    rot: -9,
    scale: 2.44,
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_NAVY,
    glow: GLOW_BLUE,
  }),
};

/* =============================== SLIDE 8 =============================== */
// Dashboard — the tile grid with the red 1 AOG and the amber 1 NIS.
const slide8 = {
  name: 'aplus-carousel-08',
  ...macro({
    plate: IMG('plate-dash', H_DASH),
    plateH: H_DASH,
    focus: [215, 280],
    rot: 14,
    scale: 2.4,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 46%, transparent 40%, black 80%)',
    bg: BG_INK,
    glow: GLOW_AOG,
  }),
};

/* =============================== SLIDE 9 =============================== */
// Dashboard — the blocked AOG kit: "Blocking part S700P0786-522, not in
// stock" + Open kit. Closer, with wordmark + save cue.
const slide9 = {
  name: 'aplus-carousel-09',
  ...macro({
    plate: IMG('plate-dash', H_DASH),
    plateH: H_DASH,
    focus: [215, 600],
    rot: -12,
    scale: 2.42,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 48%, transparent 50%, black 88%)',
    bg: BG_DEEP,
    glow: GLOW_BLUE_HI,
    overlay: {
      // the crop is dominated by light cards, so every mark rides a dark scrim
      css: `
.s9-wm { bottom: 152px; left: 56px; display: inline-flex; align-items: center;
  background: rgba(6,16,36,0.66); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; padding: 13px 26px;
  font-size: 27px; font-weight: 900; letter-spacing: 0.2em; color: #fff; }
.s9-tag { bottom: 76px; left: 56px; display: inline-flex; align-items: center;
  background: rgba(6,16,36,0.66); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px; padding: 14px 26px; font-weight: 700; font-size: 21px;
  letter-spacing: 0.01em; color: #fff; }
.s9-save { bottom: 62px; right: 68px; width: 116px; height: 116px; border-radius: 50%;
  background: rgba(6,16,36,0.72); border: 1px solid rgba(255,255,255,0.22);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
.s9-save span { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  font-weight: 700; font-size: 18px; color: rgba(255,255,255,0.92); white-space: nowrap;
  text-shadow: 0 2px 10px rgba(0,0,0,0.7); }
`,
      html: `
<div class="ovl s9-wm">APLUS</div>
<div class="ovl s9-tag">The flight line, in your hand.</div>
<div class="ovl s9-save">
  <svg width="46" height="46" viewBox="0 0 24 24"><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.4L5.5 20.5v-16a1 1 0 0 1 1-1z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
  <span>Save this</span>
</div>`,
    },
  }),
};

module.exports = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];
