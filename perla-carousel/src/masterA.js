// MASTER A — the Perla app frame. 430 x 932 CSS px, scaled/tilted per slide.
'use strict';

const CSS = `
.screen {
  position: relative;
  width: 430px; height: 932px;
  overflow: hidden;
  background: linear-gradient(180deg,
    #F5B85C 0%,
    #8FCB8F 22%,
    #2FC4A8 40%,
    #15C2B6 52%,
    #BDE9E4 68%,
    #E8F6F5 78%,
    #EDF4F3 100%);
  font-family: 'Figtree', sans-serif;
}
.screen .status {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 28px 0 32px;
  color: rgba(255,255,255,0.95);
  font-size: 15px; font-weight: 700;
}
.screen .status .sicons { display: flex; gap: 6px; align-items: center; }
.screen .status .bars { display: flex; gap: 2px; align-items: flex-end; height: 11px; }
.screen .status .bars i { width: 3px; background: rgba(255,255,255,0.95); border-radius: 1px; display: block; }
.screen .status .batt {
  width: 24px; height: 12px; border: 1.5px solid rgba(255,255,255,0.8);
  border-radius: 4px; position: relative;
}
.screen .status .batt::before { content: ""; position: absolute; inset: 2px 8px 2px 2px; background: #fff; border-radius: 1.5px; }
.screen .titlebar {
  position: relative; margin-top: 14px; height: 44px;
  display: flex; align-items: center; justify-content: center;
}
.screen .titlebar .back {
  position: absolute; left: 20px; top: 2px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 8px 20px rgba(6,39,46,0.18);
  display: flex; align-items: center; justify-content: center;
}
.screen .titlebar .back svg { display: block; }
.screen .titlebar .name { font-size: 17px; font-weight: 500; color: #fff; letter-spacing: 0.01em; }

/* score block */
.score { text-align: center; margin-top: 26px; color: #fff; }
.score .eyebrow { font-size: 11px; color: rgba(255,255,255,0.85); }
.score .num {
  font-family: 'Doto', monospace; font-weight: 700;
  font-size: 118px; line-height: 1.02; letter-spacing: 0.04em;
  text-shadow: 0 2px 14px rgba(255,255,255,0.25);
}
.score .cap { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.95); margin-top: 2px; }
.score .pill {
  display: inline-flex; align-items: center; gap: 7px;
  margin-top: 14px; padding: 8px 16px; border-radius: 999px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.4);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  font-size: 12.5px; font-weight: 700; color: #fff; letter-spacing: 0.02em;
}
.score .pill .dot { width: 7px; height: 7px; border-radius: 50%; background: #C9F7E3; box-shadow: 0 0 8px rgba(201,247,227,0.9); }

/* dot-matrix sparkline */
.spark { margin: 22px 34px 0; text-align: center; }
.spark svg { display: block; margin: 0 auto; }
.spark .lab { margin-top: 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.75); }

/* metric tiles */
.tiles { display: flex; gap: 14px; margin: 20px 20px 0; }
.tile {
  flex: 1; border-radius: 24px; padding: 18px 18px 16px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.35);
  -webkit-backdrop-filter: blur(28px); backdrop-filter: blur(28px);
  box-shadow: 0 18px 44px rgba(6,39,46,0.18);
  color: #fff;
}
.tile .head { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.92); }
.tile .head .ic {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35);
  display: flex; align-items: center; justify-content: center;
}
.tile .val {
  font-family: 'Doto', monospace; font-weight: 700;
  font-size: 40px; letter-spacing: 0.03em; margin-top: 14px; line-height: 1;
  white-space: nowrap;
}
.tile .val .peso {
  position: relative; display: inline-block;
  font-family: 'Figtree', sans-serif; font-weight: 700; font-size: 0.82em;
  margin-right: 2px; top: -0.03em;
}
.tile .val .peso::after {
  content: ""; position: absolute; left: -0.12em; right: -0.06em; top: 0.22em;
  border-top: 0.07em solid currentColor;
  box-shadow: 0 0.16em 0 currentColor;
}
.tile .sub { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8); margin-top: 8px; }

/* bottom row */
.bottomrow { display: flex; gap: 14px; margin: 16px 20px 0; height: 296px; }
.card-sched {
  flex: 1; border-radius: 28px; background: #fff; padding: 20px 18px;
  box-shadow: 0 20px 50px rgba(6,39,46,0.12);
  position: relative; color: #06272E;
  display: flex; flex-direction: column;
}
.card-sched .chead { display: flex; justify-content: space-between; align-items: flex-start; }
.card-sched h3 { font-size: 17px; font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
.card-sched .plus, .card-live .plus {
  width: 38px; height: 38px; border-radius: 50%; background: #fff;
  box-shadow: 0 8px 18px rgba(6,39,46,0.14);
  display: flex; align-items: center; justify-content: center; flex: none;
}
.card-sched .slip {
  margin-top: 12px; border-radius: 16px; background: #F2F8F7;
  border: 1px solid rgba(6,39,46,0.05);
  padding: 10px 12px;
}
.card-sched .slip .nm { font-size: 12.5px; font-weight: 700; }
.card-sched .slip .mt { font-size: 11px; font-weight: 500; color: rgba(6,39,46,0.55); margin-top: 2px; }
.card-sched .vpill {
  margin-top: auto; align-self: flex-start;
  background: #E8F6F5; color: #06272E;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.02em;
  padding: 8px 14px; border-radius: 999px;
}
.card-live {
  flex: 1; border-radius: 28px; position: relative; overflow: hidden;
  background:
    radial-gradient(90% 70% at 50% 58%, #F2789F 0%, #F591B1 55%, #F8B7CB 100%);
  box-shadow: 0 20px 50px rgba(242,120,159,0.35);
  padding: 20px 18px; color: #fff;
  display: flex; flex-direction: column;
}
.card-live .chead { display: flex; justify-content: space-between; align-items: flex-start; }
.card-live h3 { font-size: 17px; font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; color: #fff; }
.card-live .rings { flex: 1; display: flex; align-items: center; justify-content: center; }
.card-live .arcs { text-align: center; margin-bottom: 4px; }
`;

// dot-matrix sparkline as inline SVG: columns of dots, varying height + opacity
function sparkSVG(w = 330, dotR = 2.6, gap = 11) {
  const heights = [2,3,2,4,3,5,4,6,7,6,8,7,6,5,6,4,3,4,3,2,3,2,2,3,2,4,3,2,3,2];
  const cols = heights.length;
  const maxH = 8;
  const svgH = maxH * gap;
  let dots = '';
  for (let c = 0; c < cols; c++) {
    const x = c * gap + dotR;
    const h = heights[c];
    for (let r = 0; r < h; r++) {
      const y = svgH - r * gap - dotR;
      const op = (0.35 + 0.6 * (r / maxH)) * (c >= 6 && c <= 14 ? 1 : 0.55);
      dots += `<circle cx="${x}" cy="${y}" r="${dotR}" fill="#fff" opacity="${op.toFixed(2)}"/>`;
    }
  }
  return `<svg width="${cols * gap}" height="${svgH}" viewBox="0 0 ${cols * gap} ${svgH}" xmlns="http://www.w3.org/2000/svg">${dots}</svg>`;
}

// concentric waveform rings for the Live Call tile (yellow core like the ref)
function ringsSVG(size = 128) {
  const c = size / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${c}" cy="${c}" r="${c - 4}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <circle cx="${c}" cy="${c}" r="${c * 0.72}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5"/>
    <circle cx="${c}" cy="${c}" r="${c * 0.5}" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="3"/>
    <circle cx="${c}" cy="${c}" r="${c * 0.3}" fill="rgba(255,255,255,0.9)"/>
    <circle cx="${c}" cy="${c}" r="${c * 0.13}" fill="#F5E04B"/>
  </svg>`;
}

// side arcs  ((((  ))))  under the rings
function arcsSVG(w = 150, h = 26) {
  let out = '';
  const cy = h / 2;
  for (let i = 0; i < 4; i++) {
    const rx = 8 + i * 9;
    const op = 0.9 - i * 0.18;
    out += `<path d="M ${w/2 - rx} ${cy - 10} A ${rx} 12 0 0 0 ${w/2 - rx} ${cy + 10}" fill="none" stroke="rgba(255,255,255,${op})" stroke-width="2.4" stroke-linecap="round"/>`;
    out += `<path d="M ${w/2 + rx} ${cy - 10} A ${rx} 12 0 0 1 ${w/2 + rx} ${cy + 10}" fill="none" stroke="rgba(255,255,255,${op})" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  out += `<circle cx="${w/2}" cy="${cy}" r="3.4" fill="#fff"/>`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

const chevron = `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M10.5 2.5 5 8l5.5 5.5" fill="none" stroke="#06272E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plus = (color = '#06272E') => `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2.5v11M2.5 8h11" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
const heartIc = `<svg width="13" height="13" viewBox="0 0 16 16"><path d="M8 13.6C4.2 10.9 1.8 8.6 1.8 5.9 1.8 4 3.3 2.6 5 2.6c1.2 0 2.3.6 3 1.7.7-1.1 1.8-1.7 3-1.7 1.7 0 3.2 1.4 3.2 3.3 0 2.7-2.4 5-6.2 7.7z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const pesoIc = `<svg width="13" height="13" viewBox="0 0 16 16"><path d="M4.5 13.5V2.8h4a3.2 3.2 0 0 1 0 6.4h-4M2.5 5.2h11M2.5 7.4h11" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function masterA() {
  return `
<div class="screen">
  <div class="status">
    <span>9:41</span>
    <span class="sicons">
      <span class="bars"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span>
      <span class="batt"></span>
    </span>
  </div>
  <div class="titlebar">
    <span class="back">${chevron}</span>
    <span class="name">Amara Santiago</span>
  </div>

  <div class="score">
    <div class="eyebrow">Clinic Pulse</div>
    <div class="num">37</div>
    <div class="cap">calls answered</div>
    <div><span class="pill"><span class="dot"></span>On duty &middot; 24/7</span></div>
  </div>

  <div class="spark">
    ${sparkSVG()}
    <div class="lab">31 answered overnight</div>
  </div>

  <div class="tiles">
    <div class="tile">
      <div class="head"><span class="ic">${heartIc}</span>Booked</div>
      <div class="val">14</div>
      <div class="sub">patients overnight</div>
    </div>
    <div class="tile">
      <div class="head"><span class="ic">${pesoIc}</span>Collections</div>
      <div class="val"><span class="peso">P</span>88,497</div>
      <div class="sub">16 patients</div>
    </div>
  </div>

  <div class="bottomrow">
    <div class="card-sched">
      <div class="chead">
        <h3>Today's<br>Schedule</h3>
        <span class="plus">${plus()}</span>
      </div>
      <div class="slip">
        <div class="nm">Maria Dela Cruz</div>
        <div class="mt">9:30 AM &middot; Cleaning</div>
      </div>
      <div class="slip">
        <div class="nm">Paolo Reyes</div>
        <div class="mt">11:00 AM &middot; Extraction</div>
      </div>
      <div class="vpill">7 visits today</div>
    </div>
    <div class="card-live">
      <div class="chead">
        <h3>Live<br>Call</h3>
        <span class="plus">${plus('#F2789F')}</span>
      </div>
      <div class="rings">${ringsSVG()}</div>
      <div class="arcs">${arcsSVG()}</div>
    </div>
  </div>
</div>`;
}

module.exports = { masterA, CSS_A: CSS, ringsSVG, sparkSVG };
