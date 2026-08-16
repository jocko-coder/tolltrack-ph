// Nine artboards — extreme macro crops of the real Perez Tracker screens,
// arcing across both project skins: Allenone Sucat (orange mark, indigo
// chrome) then Corazon del Mar (teal mark, slate chrome).
'use strict';

const IMG = (name, h = 932) =>
  `<img src="${name}.png" style="display:block;width:430px;height:${h}px">`;

/* ============================ macro helper ============================ */
// `focus` is a point in 430-wide plate coordinates; the translate needed to
// bring it to the centre of the artboard is solved, not eyeballed.
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
  box-shadow: 0 60px 140px rgba(8,6,18,0.6);
}
.bloom { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; ${glow ? `background: ${glow};` : ''} }
.sweep { position: absolute; inset: -12%; pointer-events: none; mix-blend-mode: screen;
  background: linear-gradient(114deg, transparent 40%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.08) 51%, transparent 60%); }
`,
    body: `
<div class="macro-bg"></div>
<div style="position:absolute;inset:0"><div class="mwrap"><div class="mx">${plate}</div></div></div>
${glow ? '<div class="bloom"></div>' : ''}
${sweep ? '<div class="sweep"></div>' : ''}
`,
    post: { blurPx, maskCss, overlay },
  };
}

/* grade backdrops — warm/indigo for Allenone, cool slate for Corazon */
const BG_EMBER = 'background: radial-gradient(120% 90% at 50% 28%, #45230F 0%, #1A0E08 72%);';
const BG_INDIGO = 'background: radial-gradient(120% 90% at 50% 30%, #241B5A 0%, #0C0920 72%);';
const BG_PLUM = 'background: radial-gradient(120% 90% at 50% 42%, #2C1E52 0%, #0E0A1E 74%);';
const BG_SEA = 'background: radial-gradient(120% 90% at 50% 28%, #12403C 0%, #061815 72%);';
const BG_SLATE = 'background: radial-gradient(120% 90% at 50% 32%, #26333B 0%, #0A1014 74%);';

const GLOW_ORANGE = 'radial-gradient(48% 36% at 50% 46%, rgba(233,101,30,0.5) 0%, rgba(233,101,30,0) 72%)';
const GLOW_INDIGO = 'radial-gradient(50% 38% at 50% 46%, rgba(110,86,230,0.44) 0%, rgba(233,101,30,0.14) 48%, transparent 76%)';
const GLOW_VIOLET = 'radial-gradient(50% 38% at 50% 44%, rgba(126,98,240,0.42) 0%, rgba(126,98,240,0) 72%)';
const GLOW_TEAL = 'radial-gradient(48% 36% at 50% 46%, rgba(79,156,147,0.5) 0%, rgba(79,156,147,0) 72%)';
const GLOW_SLATE = 'radial-gradient(50% 38% at 50% 46%, rgba(120,160,175,0.34) 0%, rgba(79,156,147,0.12) 48%, transparent 76%)';

const H_DA = 1150, H_DC = 1130, H_LC = 1080;

/* ====== 1 · Allenone splash — the cart mark + wordmark. Opener. ====== */
const slide1 = {
  name: 'perez-carousel-01',
  ...macro({
    plate: IMG('plate-splash-a'),
    focus: [215, 470],
    rot: -12,
    scale: 2.3,
    blurPx: 13,
    maskCss: 'radial-gradient(105% 105% at 48% 44%, transparent 44%, black 84%)',
    bg: BG_EMBER,
    glow: GLOW_ORANGE,
    overlay: {
      css: ".s1-wm{ top:60px; left:64px; font-size:26px; font-weight:800; letter-spacing:0.24em; color:#fff; opacity:0.94; }",
      html: '<div class="ovl s1-wm">PEREZ · TRACKER</div>',
    },
  }),
};

/* ====== 2 · Allenone header — project, week, the orange confirm ====== */
const slide2 = {
  name: 'perez-carousel-02',
  ...macro({
    plate: IMG('plate-dash-a', H_DA),
    plateH: H_DA,
    focus: [200, 112],
    rot: 9,
    scale: 2.44,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 52% 44%, transparent 40%, black 80%)',
    bg: BG_INDIGO,
    glow: GLOW_INDIGO,
  }),
};

/* ====== 3 · The money shot — CURRENT BALANCE ₱449,615.88 ====== */
const slide3 = {
  name: 'perez-carousel-03',
  ...macro({
    plate: IMG('plate-dash-a', H_DA),
    plateH: H_DA,
    focus: [113, 336],
    rot: -14,
    scale: 2.72,
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 44%, black 82%)',
    bg: BG_PLUM,
    glow: GLOW_VIOLET,
  }),
};

/* ====== 4 · Deposits vs expenses — money in, money out ====== */
const slide4 = {
  name: 'perez-carousel-04',
  ...macro({
    plate: IMG('plate-dash-a', H_DA),
    plateH: H_DA,
    focus: [215, 425],
    rot: 11,
    scale: 2.36,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 46%, transparent 42%, black 80%)',
    bg: BG_INDIGO,
    glow: GLOW_VIOLET,
  }),
};

/* ====== 5 · Quick filter — Today / This Week / This Month / All ====== */
const slide5 = {
  name: 'perez-carousel-05',
  ...macro({
    plate: IMG('plate-dash-a', H_DA),
    plateH: H_DA,
    focus: [215, 700],
    rot: -10,
    scale: 2.5,
    blurPx: 11,
    maskCss: 'radial-gradient(105% 105% at 50% 46%, transparent 44%, black 84%)',
    bg: BG_PLUM,
    glow: GLOW_INDIGO,
  }),
};

/* ====== 6 · Corazon splash — the island mark. The turn. ====== */
const slide6 = {
  name: 'perez-carousel-06',
  ...macro({
    plate: IMG('plate-splash-c'),
    focus: [215, 470],
    rot: 12,
    scale: 2.3,
    blurPx: 13,
    maskCss: 'radial-gradient(105% 105% at 52% 44%, transparent 44%, black 84%)',
    bg: BG_SEA,
    glow: GLOW_TEAL,
  }),
};

/* ====== 7 · WALLET · CASH ON HAND ₱24,664.50 + budget vs spent ====== */
const slide7 = {
  name: 'perez-carousel-07',
  ...macro({
    plate: IMG('plate-dash-c', H_DC),
    plateH: H_DC,
    focus: [215, 330],
    rot: -13,
    scale: 2.46,
    blurPx: 12,
    maskCss: 'radial-gradient(100% 100% at 50% 46%, transparent 44%, black 82%)',
    bg: BG_SLATE,
    glow: GLOW_TEAL,
  }),
};

/* ====== 8 · The actions — Add Expense / Add Budget ====== */
const slide8 = {
  name: 'perez-carousel-08',
  ...macro({
    plate: IMG('plate-dash-c', H_DC),
    plateH: H_DC,
    focus: [215, 446],
    rot: 10,
    scale: 2.66,
    blurPx: 11,
    maskCss: 'radial-gradient(110% 110% at 50% 46%, transparent 46%, black 86%)',
    bg: BG_SEA,
    glow: GLOW_TEAL,
  }),
};

/* ====== 9 · The ledger — receipts, amounts, Wallet tags. Closer. ====== */
const slide9 = {
  name: 'perez-carousel-09',
  ...macro({
    plate: IMG('plate-list-c', H_LC),
    plateH: H_LC,
    focus: [215, 400],
    rot: -11,
    scale: 2.34,
    blurPx: 12,
    maskCss: 'radial-gradient(105% 105% at 50% 48%, transparent 50%, black 88%)',
    bg: BG_SLATE,
    glow: GLOW_SLATE,
    overlay: {
      // the crop is mostly light cards, so every mark rides a dark scrim
      css: `
.s9-wm { bottom: 152px; left: 56px; display: inline-flex; align-items: center;
  background: rgba(10,16,20,0.66); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; padding: 13px 26px;
  font-size: 24px; font-weight: 800; letter-spacing: 0.2em; color: #fff; }
.s9-tag { bottom: 76px; left: 56px; display: inline-flex; align-items: center;
  background: rgba(10,16,20,0.66); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px; padding: 14px 26px; font-weight: 700; font-size: 21px; color: #fff; }
.s9-save { bottom: 62px; right: 68px; width: 116px; height: 116px; border-radius: 50%;
  background: rgba(10,16,20,0.72); border: 1px solid rgba(255,255,255,0.22);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
.s9-save span { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  font-weight: 700; font-size: 18px; color: rgba(255,255,255,0.92); white-space: nowrap;
  text-shadow: 0 2px 10px rgba(0,0,0,0.7); }
`,
      html: `
<div class="ovl s9-wm">PEREZ · TRACKER</div>
<div class="ovl s9-tag">Every peso, receipted.</div>
<div class="ovl s9-save">
  <svg width="46" height="46" viewBox="0 0 24 24"><path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.4L5.5 20.5v-16a1 1 0 0 1 1-1z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
  <span>Save this</span>
</div>`,
    },
  }),
};

module.exports = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9];
