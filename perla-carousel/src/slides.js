// Nine artboards — every slide is an extreme macro crop of a real Perla screen
// (Home, Visits, Scribe, Analytics, Ask Perla), tilted with shallow depth of
// field, a teal/violet bloom and a light sweep. Fully faithful UI, no mascot.
'use strict';

/* ---------- shared slide-level css ---------- */
const CSS_SHARED = `
.wordmark { font-family: 'Figtree', sans-serif; font-weight: 900; letter-spacing: -0.02em; color: #fff; }
.layer { position: absolute; inset: 0; }
`;

// plate <img> reference (rendered separately at high dpr by run.js)
const IMG = (name, h = 932) =>
  `<img src="${name}.png" style="display:block;width:430px;height:${h}px">`;

/* ============================ macro helper ============================ */
// Pass 1 renders the sharp composition: base grade, the transformed UI plate,
// a screen-blended bloom at the focal point, and a diagonal light sweep. The
// depth-of-field falloff + grain + vignette (+ optional crisp overlay) are
// applied in pass 2 over the flat screenshot (see dofPage / run.js) — in-page
// blur over a huge transformed bitmap breaks Chromium tiling.
function macro({ plate, plateH = 932, transform, blurPx, maskCss, bg, glow, sweep = true, overlay }) {
  return {
    css: `
.macro-bg { position: absolute; inset: 0; ${bg} }
.mwrap { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
.mx {
  position: absolute; left: -215px; top: ${-plateH / 2}px;
  width: 430px; height: ${plateH}px;
  transform: ${transform};
  box-shadow: 0 60px 140px rgba(2,14,16,0.6);
}
.bloom { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; ${glow ? `background: ${glow};` : ''} }
.sweep { position: absolute; inset: -12%; pointer-events: none; mix-blend-mode: screen;
  background: linear-gradient(114deg, transparent 40%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.08) 51%, transparent 60%); }
`,
    body: `
<div class="macro-bg"></div>
<div class="layer"><div class="mwrap"><div class="mx">${plate}</div></div></div>
${glow ? '<div class="bloom"></div>' : ''}
${sweep ? '<div class="sweep"></div>' : ''}
`,
    post: { blurPx, maskCss, overlay },
  };
}

// grade backdrops
const BG_TEAL = 'background: radial-gradient(120% 90% at 50% 26%, #0C2E31 0%, #06181B 68%);';
const BG_INK = 'background: radial-gradient(120% 90% at 50% 30%, #0A2427 0%, #05151A 70%);';
const BG_VIOLET = 'background: radial-gradient(120% 90% at 50% 42%, #191742 0%, #08121C 72%);';

const GLOW_TEAL = 'radial-gradient(46% 34% at 52% 46%, rgba(21,194,182,0.55) 0%, rgba(21,194,182,0) 72%)';
const GLOW_TEAL_HI = 'radial-gradient(50% 38% at 50% 44%, rgba(35,214,199,0.6) 0%, rgba(21,194,182,0) 72%)';
const GLOW_VIOLET = 'radial-gradient(52% 40% at 50% 46%, rgba(150,96,232,0.5) 0%, rgba(90,140,240,0.18) 45%, transparent 74%)';

/* =============================== SLIDE 1 =============================== */
// Home / Morning Report — "Good afternoon, Dr. Santos." + eyebrow. Opener.
const slide1 = {
  name: 'perla-carousel-01',
  ...macro({
    plate: IMG('plate-home'),
    transform: 'translate(96px, 250px) rotate(-15deg) scale(2.48)',
    blurPx: 13,
    maskCss: 'radial-gradient(105% 105% at 44% 40%, transparent 40%, black 80%)',
    bg: BG_TEAL,
    glow: GLOW_TEAL,
    overlay: {
      css: ".s1-wm{ top:60px; left:64px; font-size:34px; font-family:'Figtree',sans-serif; font-weight:900; letter-spacing:-0.02em; color:#fff; }",
      html: '<div class="ovl s1-wm">Perla.ai</div>',
    },
  }),
};

/* =============================== SLIDE 2 =============================== */
// Visits — the July grid with "9" (today) glowing.
const slide2 = {
  name: 'perla-carousel-02',
  ...macro({
    plate: IMG('plate-visits', 1120),
    plateH: 1120,
    transform: 'translate(-150px, 300px) rotate(11deg) scale(2.34)',
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 58% 42%, transparent 40%, black 80%)',
    bg: BG_INK,
    glow: GLOW_TEAL,
  }),
};

/* =============================== SLIDE 3 =============================== */
// Visits — the appointment card: "12:00 PM · Joshua Lim · Confirmed".
const slide3 = {
  name: 'perla-carousel-03',
  ...macro({
    plate: IMG('plate-visits', 1120),
    plateH: 1120,
    transform: 'translate(-150px, -690px) rotate(-15deg) scale(2.4)',
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_INK,
    glow: GLOW_TEAL,
  }),
};

/* =============================== SLIDE 4 =============================== */
// Scribe — hero card: mic orb + "Perla Scribe" + "English, Tagalog, or both".
const slide4 = {
  name: 'perla-carousel-04',
  ...macro({
    plate: IMG('plate-scribe'),
    transform: 'translate(-60px, 402px) rotate(8deg) scale(2.42)',
    blurPx: 11,
    maskCss: 'radial-gradient(110% 110% at 50% 44%, transparent 46%, black 86%)',
    bg: BG_TEAL,
    glow: GLOW_TEAL_HI,
  }),
};

/* =============================== SLIDE 5 =============================== */
// Scribe — a clinical note card (the AI-written output).
const slide5 = {
  name: 'perla-carousel-05',
  ...macro({
    plate: IMG('plate-scribe'),
    transform: 'translate(-118px, -556px) rotate(-13deg) scale(2.46)',
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_INK,
    glow: GLOW_TEAL,
  }),
};

/* =============================== SLIDE 6 =============================== */
// Ask Perla — the "How can I help you today?" gradient + chips. Warm frame.
const slide6 = {
  name: 'perla-carousel-06',
  ...macro({
    plate: IMG('plate-ask'),
    transform: 'translate(46px, -404px) rotate(7deg) scale(2.36)',
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 50%, transparent 42%, black 80%)',
    bg: BG_VIOLET,
    glow: GLOW_VIOLET,
  }),
};

/* =============================== SLIDE 7 =============================== */
// Analytics — "Revenue by dentist · ₱592,540".
const slide7 = {
  name: 'perla-carousel-07',
  ...macro({
    plate: IMG('plate-analytics'),
    transform: 'translate(48px, 168px) rotate(-17deg) scale(2.6)',
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 48% 46%, transparent 40%, black 80%)',
    bg: BG_INK,
    glow: GLOW_TEAL_HI,
  }),
};

/* =============================== SLIDE 8 =============================== */
// Analytics — "Top patients" bars, rhythmic.
const slide8 = {
  name: 'perla-carousel-08',
  ...macro({
    plate: IMG('plate-analytics'),
    transform: 'translate(120px, -452px) rotate(14deg) scale(2.4)',
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 52% 48%, transparent 40%, black 80%)',
    bg: BG_INK,
    glow: GLOW_TEAL,
  }),
};

/* =============================== SLIDE 9 =============================== */
// Home — "Share your booking link" + Copy. CTA, with url + save overlay.
const slide9 = {
  name: 'perla-carousel-09',
  ...macro({
    plate: IMG('plate-home'),
    transform: 'translate(-118px, -560px) rotate(-12deg) scale(2.42)',
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 46%, transparent 42%, black 82%)',
    bg: BG_TEAL,
    glow: GLOW_TEAL,
    overlay: {
      css: `
.s9-url { top: 60px; right: 60px; display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25);
  border-radius: 999px; padding: 14px 24px; font-weight: 700; font-size: 22px;
  letter-spacing: 0.01em; color: #fff; font-family: 'Figtree', sans-serif; }
.s9-wm { top: 60px; left: 64px; font-size: 30px; font-family: 'Figtree', sans-serif; font-weight: 900; letter-spacing: -0.02em; color: #fff; }
.s9-save { bottom: 72px; right: 68px; width: 116px; height: 116px; border-radius: 50%;
  background: rgba(6,26,28,0.5); border: 1px solid rgba(255,255,255,0.22);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.45); }
.s9-save span { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  font-family: 'Figtree', sans-serif; font-weight: 700; font-size: 18px; color: rgba(255,255,255,0.8); white-space: nowrap; }
`,
      html: `
<div class="ovl s9-wm">Perla.ai</div>
<div class="ovl s9-url">meetperla-ai.com</div>
<div class="ovl s9-save">
  <svg width="46" height="46" viewBox="0 0 24 24"><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.4L5.5 20.5v-16a1 1 0 0 1 1-1z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
  <span>Save this</span>
</div>`,
    },
  }),
};

module.exports = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];
