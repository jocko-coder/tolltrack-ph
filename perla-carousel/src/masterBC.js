// MASTER B — call log card. MASTER C — Taglish conversation.
'use strict';

const CSS_B = `
.calllog { position: relative; width: 720px; font-family: 'Figtree', sans-serif; }
.logcard {
  position: relative; z-index: 3;
  border-radius: 32px; padding: 30px 32px;
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.55);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  box-shadow: 0 34px 80px rgba(6,39,46,0.35);
  color: #06272E;
}
.logcard .lhead { display: flex; align-items: center; gap: 16px; }
.logcard .ava {
  width: 58px; height: 58px; border-radius: 50%; flex: none;
  background: linear-gradient(140deg, #15C2B6, #0B7F7B);
  color: #fff; font-size: 20px; font-weight: 700; letter-spacing: 0.03em;
  display: flex; align-items: center; justify-content: center;
}
.logcard .who .nm { font-size: 24px; font-weight: 700; letter-spacing: -0.01em; }
.logcard .who .mt { font-size: 14.5px; font-weight: 500; color: rgba(6,39,46,0.55); margin-top: 3px; }
.logcard .summary {
  margin-top: 22px; border-radius: 18px;
  background: rgba(21,194,182,0.13);
  border: 1px solid rgba(21,194,182,0.22);
  padding: 16px 20px;
  font-size: 19px; font-weight: 500; color: #075B55;
  display: flex; align-items: center; gap: 12px;
}
.logcard .summary .spark-ic { flex: none; }
.logcard .chips { display: flex; gap: 10px; margin-top: 20px; }
.chip {
  display: inline-flex; align-items: center; gap: 8px;
  border-radius: 999px; padding: 9px 16px;
  font-size: 13.5px; font-weight: 700; letter-spacing: 0.02em;
}
.chip.teal { background: #15C2B6; color: #fff; box-shadow: 0 10px 24px rgba(21,194,182,0.4); }
.chip.ghost { background: rgba(255,255,255,0.6); border: 1px solid rgba(6,39,46,0.1); color: #06272E; }

.logrow {
  border-radius: 24px; padding: 20px 26px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 20px 50px rgba(6,39,46,0.2);
  color: #06272E;
  display: flex; align-items: center; gap: 14px;
  filter: blur(7px);
}
.logrow .ava2 {
  width: 44px; height: 44px; border-radius: 50%; flex: none;
  background: linear-gradient(140deg, #6ad2c9, #2b9f95);
  color: #fff; font-size: 15px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.logrow .nm { font-size: 18px; font-weight: 700; }
.logrow .mt { font-size: 13px; font-weight: 500; color: rgba(6,39,46,0.55); margin-top: 2px; }
.logrow.top { position: relative; z-index: 1; margin: 0 26px -18px; }
.logrow.bottom { position: relative; z-index: 1; margin: -18px 26px 0; }
`;

const check = (c = '#fff', s = 13) => `<svg width="${s}" height="${s}" viewBox="0 0 14 14"><path d="M2.2 7.4 5.4 10.6 11.8 3.6" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const sparkIc = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2.4 11.8 7.6 17 9.4 11.8 11.2 10 16.4 8.2 11.2 3 9.4 8.2 7.6z" fill="#15C2B6"/></svg>`;

function masterB() {
  return `
<div class="calllog">
  <div class="logrow top">
    <span class="ava2">PR</span>
    <span><div class="nm">Paolo Reyes</div><div class="mt">1:07 &middot; answered by Perla</div></span>
  </div>
  <div class="logcard">
    <div class="lhead">
      <span class="ava">MD</span>
      <span class="who">
        <div class="nm">Maria Dela Cruz</div>
        <div class="mt">2:14 &middot; answered by Perla</div>
      </span>
    </div>
    <div class="summary"><span class="spark-ic">${sparkIc}</span>Rescheduled cleaning to Friday 10 AM</div>
    <div class="chips">
      <span class="chip teal">Booked ${check()}</span>
      <span class="chip ghost">Taglish</span>
    </div>
  </div>
  <div class="logrow bottom">
    <span class="ava2">NB</span>
    <span><div class="nm">Nielle Bautista</div><div class="mt">0:58 &middot; answered by Perla</div></span>
  </div>
</div>`;
}

const CSS_C = `
.taglish { position: relative; width: 860px; font-family: 'Figtree', sans-serif; }
.taglish .eyebrow-c {
  font-size: 15px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(255,255,255,0.85); text-align: center; margin-bottom: 40px;
}
.bubble {
  position: relative; border-radius: 36px; padding: 34px 40px;
  font-size: 40px; font-weight: 500; line-height: 1.28; letter-spacing: -0.01em;
}
.bubble.patient {
  width: 620px; margin-right: auto;
  transform: rotate(-2deg);
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.7);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  border-bottom-left-radius: 10px;
  color: #06272E;
  box-shadow: 0 30px 70px rgba(6,39,46,0.3);
}
.bubble.perla {
  width: 660px; margin-left: auto; margin-top: 44px;
  transform: rotate(2deg);
  background: linear-gradient(150deg, #1BCFC2, #0FA79D);
  border: 1px solid rgba(255,255,255,0.35);
  border-bottom-right-radius: 10px;
  color: #fff;
  box-shadow: 0 34px 80px rgba(9,113,106,0.45);
}
.bubble .tail { font-size: 14px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.55; margin-bottom: 10px; }
.timechip {
  position: absolute; right: 44px; bottom: -26px;
  background: #fff; color: #06272E; border-radius: 16px;
  padding: 10px 18px;
  font-family: 'Doto', monospace; font-weight: 700; font-size: 26px; letter-spacing: 0.06em;
  box-shadow: 0 18px 40px rgba(6,39,46,0.3);
  transform: rotate(2deg);
}
.bookedpill {
  margin: 64px auto 0; width: fit-content;
  display: flex; align-items: center; gap: 10px;
  background: #fff; color: #06272E;
  border-radius: 999px; padding: 14px 28px;
  font-size: 24px; font-weight: 700; letter-spacing: -0.01em;
  box-shadow: 0 24px 60px rgba(6,39,46,0.35);
}
.bookedpill .ck {
  width: 28px; height: 28px; border-radius: 50%; background: #15C2B6;
  display: flex; align-items: center; justify-content: center;
}
`;

function masterC() {
  return `
<div class="taglish">
  <div class="eyebrow-c">She speaks Taglish</div>
  <div class="bubble patient">
    <div class="tail">Patient &middot; 8:03 PM</div>
    Gusto ko magpa-linis ng ngipin.
  </div>
  <div class="bubble perla">
    <div class="tail">Perla</div>
    Sige po! May slot Miyerkules 2PM. Book na po?
    <span class="timechip">2 PM</span>
  </div>
  <div class="bookedpill"><span class="ck">${check('#fff', 15)}</span>Booked.</div>
</div>`;
}

module.exports = { masterB, masterC, CSS_B, CSS_C, check };
