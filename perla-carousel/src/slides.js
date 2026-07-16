// The nine artboards, composed from the masters.
'use strict';

const { masterA, CSS_A } = require('./masterA');
const { masterB, masterC, CSS_B, CSS_C, check } = require('./masterBC');
const { masterD, CSS_D } = require('./masterD');
const { CSS_UI, masterScribe, masterVisits, masterAnalytics } = require('./masterUI');

/* ---------- shared slide-level css ---------- */
const CSS_SHARED = `
.wordmark {
  font-family: 'Figtree', sans-serif; font-weight: 900;
  letter-spacing: -0.02em; color: #fff;
}
.stage { position: absolute; inset: 0; }
.layer { position: absolute; inset: 0; }
.m { position: absolute; left: 50%; top: 50%; }
.m > * { position: absolute; left: 0; top: 0; }
`;

/* ---------- slide 1 / 9 shared glass cards ---------- */
const CSS_CARDS = `
.fcard {
  width: 560px; border-radius: 28px; padding: 30px 34px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.35);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  box-shadow: 0 24px 60px rgba(6,39,46,0.35);
  color: #fff; font-family: 'Figtree', sans-serif;
}
.fcard .eyebrow { font-size: 13px; color: rgba(255,255,255,0.75); }
.fcard .big { font-size: 27px; font-weight: 700; letter-spacing: -0.01em; margin-top: 12px; }
.fcard .row { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.fcard .durchip {
  font-family: 'Doto', monospace; font-weight: 700; font-size: 22px; letter-spacing: 0.06em;
  background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px; padding: 8px 18px;
}
.fcard .ckpill {
  display: inline-flex; align-items: center; gap: 9px;
  background: #15C2B6; color: #fff; border-radius: 999px; padding: 9px 18px;
  font-size: 15px; font-weight: 700;
  box-shadow: 0 12px 28px rgba(21,194,182,0.45);
}
.fcard .meta { font-size: 19px; font-weight: 500; color: rgba(255,255,255,0.85); margin-top: 8px; }
.fcard .wave { margin-top: 18px; display: flex; align-items: center; gap: 5px; height: 44px; }
.fcard .wave i { display: block; width: 6px; border-radius: 3px; background: rgba(255,255,255,0.9); }
.fcard .wave i.t { background: #15C2B6; box-shadow: 0 0 12px rgba(21,194,182,0.7); }
`;

function waveBars() {
  const hs = [10, 18, 26, 38, 30, 42, 22, 34, 44, 28, 36, 18, 26, 14, 20, 10, 14, 8];
  return hs.map((h, i) => `<i class="${i >= 3 && i <= 9 ? 't' : ''}" style="height:${h}px"></i>`).join('');
}

function cardIncoming() {
  return `<div class="fcard">
  <div class="eyebrow">Incoming call</div>
  <div class="wave">${waveBars()}</div>
  <div class="row" style="margin-top:16px">
    <div class="big" style="margin-top:0">Answered by Perla</div>
    <span class="durchip">0:42</span>
  </div>
</div>`;
}
function cardBooked() {
  return `<div class="fcard">
  <div class="row">
    <div>
      <div class="eyebrow">Appointment booked</div>
      <div class="meta"><strong style="color:#fff">Maria Dela Cruz</strong> &middot; Tomorrow 2:00 PM</div>
    </div>
    <span class="ckpill">${check('#fff', 14)} Booked</span>
  </div>
</div>`;
}

/* =============================== SLIDE 1 =============================== */
const slide1 = {
  name: 'perla-carousel-01',
  css: CSS_SHARED + CSS_CARDS + `
.s1-wordmark { position: absolute; top: 56px; left: 64px; font-size: 36px; z-index: 20; }
.s1-cards { position: absolute; left: 84px; top: 400px; z-index: 10; }
.s1-cards .c1 { transform: rotate(-2deg); }
.s1-cards .c2 { transform: rotate(1.5deg) translateX(56px); margin-top: 26px; }
.s1-copy {
  position: absolute; left: 64px; bottom: 84px; z-index: 15;
  font-weight: 900; font-size: 82px; line-height: 1.04; letter-spacing: -0.02em; color: #fff;
}
.s1-copy em { font-style: italic; color: #7DE8DE; }
.s1-halo {
  position: absolute; right: -220px; top: -180px; width: 900px; height: 900px;
  background: radial-gradient(50% 50% at 50% 50%, rgba(21,194,182,0.35) 0%, transparent 70%);
}
`,
  body: `
<div class="mesh"></div>
<div class="s1-halo"></div>
<div class="wordmark s1-wordmark">Perla.ai</div>
<div class="s1-cards">
  <div class="c1">${cardIncoming()}</div>
  <div class="c2">${cardBooked()}</div>
</div>
<div class="s1-copy">Your clinic closed at 6.<br><em>She didn&rsquo;t.</em></div>
`,
};

/* ====================== macro helper (depth of field) ====================== */
// pass 1 renders the sharp composition only; the blur falloff is applied in a
// second pass over the flat screenshot (see dofPage in common.js) — in-page
// blur over huge transformed subtrees breaks Chromium tiling.
function macro({ masterHTML, masterW, masterH, transform, blurPx, maskCss, bg }) {
  return {
    css: `
.macro-bg { position: absolute; inset: 0; ${bg} }
.mwrap { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
.mx {
  position: absolute; left: ${-masterW / 2}px; top: ${-masterH / 2}px;
  width: ${masterW}px; height: ${masterH}px;
  transform: ${transform};
}
`,
    body: `
<div class="macro-bg"></div>
<div class="layer layer-sharp"><div class="mwrap"><div class="mx">${masterHTML}</div></div></div>
`,
    post: { blurPx, maskCss },
  };
}

/* =============================== SLIDE 2 =============================== */
// Real Analytics dashboard — macro crop into "Revenue by dentist · ₱592,540",
// tilted. Uses a pre-rendered bitmap plate: live DOM at macro scale × dpr 3
// exceeds Chromium's compositor texture limits and drops tiles.
const PLATE_A = '<img src="plate-a.png" style="display:block;width:430px;height:932px">';
const PLATE_ANALYTICS = '<img src="plate-analytics.png" style="display:block;width:430px;height:932px">';

const s2m = macro({
  masterHTML: PLATE_ANALYTICS,
  masterW: 430, masterH: 932,
  transform: 'translate(70px, 205px) rotate(-18deg) scale(2.62)',
  blurPx: 11,
  maskCss: 'radial-gradient(105% 105% at 48% 46%, transparent 40%, black 80%)',
  bg: 'background: linear-gradient(200deg, #0C3A3B 0%, #081619 68%);',
});
const slide2 = {
  name: 'perla-carousel-02',
  css: CSS_SHARED + s2m.css,
  body: s2m.body,
  post: s2m.post,
};

/* =============================== SLIDE 3 =============================== */
// call-log macro, sharp on the summary chip, defocused bezel bottom-left
const s3m = macro({
  masterHTML: masterB(),
  masterW: 720, masterH: 560,
  transform: 'translate(0px, -30px) perspective(1700px) rotateX(16deg) rotateZ(-13deg) scale(1.42)',
  blurPx: 10,
  maskCss: 'radial-gradient(80% 70% at 50% 48%, transparent 40%, black 78%)',
  bg: `background:
    radial-gradient(90% 80% at 75% 15%, rgba(21,194,182,0.5) 0%, rgba(21,194,182,0) 60%),
    radial-gradient(110% 100% at 40% 70%, #0B5458 0%, #06272E 80%),
    #06272E;`,
});
const slide3 = {
  name: 'perla-carousel-03',
  post: s3m.post,
  css: CSS_SHARED + CSS_B + s3m.css + `
.bezel {
  position: absolute; left: -260px; bottom: -320px; width: 780px; height: 700px;
  background: linear-gradient(150deg, #262b30, #0c0f12);
  border-radius: 120px;
  transform: rotate(-18deg);
  filter: blur(26px);
  opacity: 0.9;
  z-index: 0;
}
.layer { z-index: 2; }
`,
  body: `<div class="macro-bg"></div><div class="bezel"></div>` +
    s3m.body.replace('<div class="macro-bg"></div>', ''),
};

/* =============================== SLIDE 4 =============================== */
// Taglish signature — cleanest slide, shallow tilt
const s4m = macro({
  masterHTML: masterC(),
  masterW: 860, masterH: 620,
  transform: 'translate(0px, 30px) perspective(2200px) rotateX(7deg) rotateZ(-3deg) scale(1.14)',
  blurPx: 5,
  maskCss: 'radial-gradient(110% 110% at 50% 45%, transparent 62%, black 96%)',
  bg: `background:
    radial-gradient(100% 80% at 20% 10%, #2ED3BF 0%, rgba(46,211,191,0) 55%),
    radial-gradient(120% 110% at 70% 90%, #0A8C82 0%, #0B4A4C 70%),
    #0B4A4C;`,
});
const slide4 = {
  name: 'perla-carousel-04',
  css: CSS_SHARED + CSS_C + s4m.css,
  body: s4m.body,
  post: s4m.post,
};

/* =============================== SLIDE 5 =============================== */
// real Perla Scribe screen floating as a glass panel over the duotone plate
const slide5 = {
  name: 'perla-carousel-05',
  css: CSS_SHARED + CSS_UI + `
.s5-panel {
  position: absolute; left: 50%; top: 50%; width: 430px; height: 932px;
  transform: translate(-50%, -50%) perspective(1900px) rotateY(-8deg) rotateX(3deg) rotate(-2deg) scale(1.16);
  border-radius: 54px; overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.28);
  box-shadow: 0 80px 160px rgba(3,20,24,0.6), 0 30px 60px rgba(3,20,24,0.5);
}
.s5-panel .uiscreen { border-radius: 54px; }
.s5-glowtop {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 60%);
}
.s5-fig1 { position: absolute; left: -140px; top: 120px; width: 560px; height: 1400px;
  background: radial-gradient(50% 40% at 50% 30%, rgba(232,246,245,0.16) 0%, transparent 70%);
  transform: rotate(14deg); }
.s5-fig2 { position: absolute; right: -160px; bottom: -100px; width: 640px; height: 1200px;
  background: radial-gradient(50% 40% at 50% 55%, rgba(21,194,182,0.4) 0%, transparent 70%);
  transform: rotate(-12deg); }
`,
  body: `
<div class="mesh"></div>
<div class="s5-fig1"></div>
<div class="s5-fig2"></div>
<div class="s5-panel">${masterScribe()}<div class="s5-glowtop"></div></div>
`,
};

/* =============================== SLIDE 6 =============================== */
// rose Live-Call tile macro — the single warm frame
const s6m = macro({
  masterHTML: PLATE_A,
  masterW: 430, masterH: 932,
  transform: 'translate(-610px, -790px) rotate(-22deg) scale(3.3)',
  blurPx: 11,
  maskCss: 'radial-gradient(95% 95% at 57% 52%, transparent 38%, black 76%)',
  bg: 'background: linear-gradient(160deg, #EDF4F3 0%, #F4E9EC 55%, #F8DFE7 100%);',
});
const slide6 = {
  name: 'perla-carousel-06',
  css: CSS_SHARED + CSS_A + s6m.css,
  body: s6m.body,
  post: s6m.post,
};

/* =============================== SLIDE 7 =============================== */
const slide7 = {
  name: 'perla-carousel-07',
  css: CSS_SHARED + CSS_UI + CSS_D + `
.hero-rig { transform: scale(0.82); }
`,
  body: masterD({ screenHTML: masterVisits() }),
};

/* =============================== SLIDE 8 =============================== */
// same render, punched in ~20%, phone low-left, hand dominating upper frame
const slide8 = {
  name: 'perla-carousel-08',
  css: CSS_SHARED + CSS_UI + CSS_D + `
.hero-rig { transform: translate(-150px, 240px) scale(1.02); }
`,
  body: masterD({ screenHTML: masterVisits() }),
};

/* =============================== SLIDE 9 =============================== */
const slide9 = {
  name: 'perla-carousel-09',
  css: CSS_SHARED + CSS_CARDS + `
.artboard { background: #06272E; }
.s9-mesh { position: absolute; inset: 0; opacity: 0.2; }
.s9-ghosts { position: absolute; right: 30px; top: 150px; opacity: 0.4; transform: rotate(6deg) scale(0.95); }
.s9-ghosts .c2 { margin-top: 24px; transform: translateX(-70px) rotate(-3deg); }
.s9-wordmark-pill {
  position: absolute; top: 56px; left: 64px; z-index: 20;
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  border-radius: 999px; padding: 14px 26px;
  font-weight: 900; font-size: 28px; letter-spacing: -0.02em; color: #fff;
}
.s9-url-pill {
  position: absolute; top: 56px; right: 64px; z-index: 20;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  border-radius: 999px; padding: 16px 26px;
  font-weight: 700; font-size: 22px; letter-spacing: 0.01em; color: rgba(255,255,255,0.92);
}
.s9-small {
  position: absolute; left: 76px; bottom: 415px; z-index: 15;
  font-size: 36px; font-weight: 500; color: rgba(255,255,255,0.92); letter-spacing: 0.01em;
}
.s9-big {
  position: absolute; left: -20px; bottom: -64px; z-index: 15;
  font-weight: 900; font-size: 226px; line-height: 0.94; letter-spacing: -0.03em; color: #fff;
  white-space: nowrap;
}
.s9-save {
  position: absolute; right: 76px; bottom: 96px; z-index: 20;
  width: 128px; height: 128px; border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.22);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
}
`,
  body: `
<div class="mesh s9-mesh"></div>
<div class="s9-ghosts">
  <div class="c1">${cardIncoming()}</div>
  <div class="c2">${cardBooked()}</div>
</div>
<div class="s9-wordmark-pill">Perla.ai</div>
<div class="s9-url-pill">meetperla-ai.com</div>
<div class="s9-small">We answer. You drill.</div>
<div class="s9-big">Save<br>this design</div>
<div class="s9-save">
  <svg width="52" height="52" viewBox="0 0 24 24"><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.4L5.5 20.5v-16a1 1 0 0 1 1-1z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
</div>
`,
};

module.exports = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];
