// Faithful rebuilds of the five real Perez Tracker screens as 430px iPhone
// artboards: the two project splashes (Allenone Sucat, Corazon del Mar), the
// two dashboards, and the Corazon expense ledger.
'use strict';

const CSS_UI = `
.uiscreen {
  position: absolute; inset: 0; width: 430px; height: 932px;
  background: var(--wash); overflow: hidden;
  font-family: 'Figtree', sans-serif; color: var(--ink);
}
.pad { padding: 0 18px; }
.row { display: flex; align-items: center; }
.sp { justify-content: space-between; }
.card { background: var(--paper); border-radius: 16px; }
.mut { color: var(--muted); }
.lbl { font-size: 12px; font-weight: 800; letter-spacing: 0.09em; color: #8A90A0; }

/* ---------- status bar ---------- */
.sb { height: 54px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px 0 26px; font-size: 15px; font-weight: 700; color: #fff; }
.sb .r { display: flex; align-items: center; gap: 6px; }
.sb .bars { display: flex; align-items: flex-end; gap: 2px; }
.sb .bars i { display: block; width: 3px; background: #fff; border-radius: 1px; }
.sb .batt { width: 24px; height: 12px; border: 1.6px solid rgba(255,255,255,0.85);
  border-radius: 3px; position: relative; }
.sb .batt::after { content: ''; position: absolute; inset: 2px; right: 4px; background: #fff; border-radius: 1px; }

/* ---------- header ---------- */
.hdr { padding: 4px 18px 18px; }
.hdr .eyebrow { font-size: 11.5px; letter-spacing: 0.26em; color: rgba(255,255,255,0.62); }
.hdr .nm { font-size: 23px; font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-top: 3px; }
.hdr .wk { font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500; margin-top: 5px; }
.appicon { width: 46px; height: 46px; border-radius: 12px; background: #fff; flex: 0 0 46px;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
.hbtn { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }

/* ---------- segmented ---------- */
.seg { background: #fff; border-radius: 14px; padding: 5px; display: flex; gap: 4px;
  box-shadow: 0 2px 10px rgba(20,18,40,0.06); }
.seg > div { flex: 1; height: 46px; border-radius: 11px; display: flex; align-items: center;
  justify-content: center; font-size: 16px; font-weight: 700; color: #6B7280; }
.seg > div.on { color: #fff; }

/* ---------- filter card ---------- */
.fbtn { height: 50px; border-radius: 25px; border: 1px solid var(--line); background: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 15.5px;
  font-weight: 600; color: #4B5563; }
.fbtn.on { color: #fff; border-color: transparent; font-weight: 700; }
.input { height: 44px; border-radius: 11px; background: #FAFAFB; border: 1px solid var(--line); }
.pill { height: 48px; border-radius: 24px; border: 1px solid var(--line); background: #fff;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: #4B5563; }
.pill.on { color: #fff; border-color: transparent; }
.dot { width: 9px; height: 9px; border-radius: 50%; }
.homebar { position: absolute; left: 50%; bottom: 9px; transform: translateX(-50%);
  width: 140px; height: 5px; border-radius: 3px; background: #1E2430; opacity: 0.85; }
`;

const statusBar = (time = '12:29') => `
<div class="sb">
  <div class="row" style="gap:7px">
    <span>${time}</span>
    <svg width="15" height="15" viewBox="0 0 24 24"><path d="M4 4l16 16M12 4a8 8 0 0 1 8 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
  </div>
  <div class="r">
    <span class="bars"><i style="height:5px"></i><i style="height:8px"></i><i style="height:11px"></i><i style="height:13px;opacity:.45"></i></span>
    <svg width="17" height="13" viewBox="0 0 24 18"><path d="M12 15.5l3-3a4.2 4.2 0 0 0-6 0zM5 8.5a10 10 0 0 1 14 0M1.5 4.8a15 15 0 0 1 21 0" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/></svg>
    <span class="batt"></span>
  </div>
</div>`;

/* project marks — thin white line icons inside a ring */
const cartMark = (s = 118) => `
<svg width="${s}" height="${s}" viewBox="0 0 120 120" fill="none">
  <circle cx="60" cy="60" r="53" stroke="#fff" stroke-width="4"/>
  <path d="M38 46h48l-5 26H45z" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
  <path d="M38 46l-5-8h-7" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <path d="M50 46V36M60 46V32M70 46V38" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <circle cx="49" cy="80" r="4.4" stroke="#fff" stroke-width="3.4"/>
  <circle cx="74" cy="80" r="4.4" stroke="#fff" stroke-width="3.4"/>
</svg>`;

const islandMark = (s = 118) => `
<svg width="${s}" height="${s}" viewBox="0 0 120 120" fill="none">
  <circle cx="60" cy="60" r="53" stroke="#fff" stroke-width="4"/>
  <path d="M46 52c-6-6-14-5-18 1M46 52c-2-8 2-14 9-16M46 52c7-4 14-2 18 4" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M46 52v22" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M60 74c0-10 7-18 16-18s16 8 16 18z" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/>
  <path d="M76 56v18" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
  <path d="M32 84c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
</svg>`;

/* ======================= SPLASHES ======================= */
function splash({ bg, mark, name }) {
  return `
<div class="uiscreen" style="background:${bg}">
  ${statusBar()}
  <div style="position:absolute;left:0;right:0;top:392px;text-align:center">
    <div style="display:flex;justify-content:center">${mark}</div>
    <div style="margin-top:34px;font-size:25px;font-weight:800;color:#fff;letter-spacing:0.26em;padding-left:0.26em">${name}</div>
  </div>
  <div class="homebar" style="background:#1E2430"></div>
</div>`;
}
const masterSplashA = () => splash({ bg: 'var(--orange)', mark: cartMark(), name: 'ALLENONE SUCAT' });
const masterSplashC = () => splash({ bg: 'var(--teal)', mark: islandMark(), name: 'CORAZON DEL MAR' });

/* ---------- shared filter block ---------- */
const filterCard = ({ accent, searchLabel, searchPh }) => `
<div class="card" style="margin-top:20px;padding:18px 16px 20px">
  <div class="lbl">QUICK FILTER</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
    <div class="fbtn">Today</div><div class="fbtn">This Week</div>
    <div class="fbtn">This Month</div><div class="fbtn on" style="background:${accent}">All</div>
  </div>
  <div class="lbl" style="margin-top:22px">CUSTOM RANGE</div>
  <div style="font-size:14.5px;color:#4B5563;font-weight:500;margin-top:12px">From</div>
  <div class="input" style="margin-top:8px"></div>
  <div style="font-size:14.5px;color:#4B5563;font-weight:500;margin-top:14px">To</div>
  <div class="input" style="margin-top:8px"></div>
  <div class="lbl" style="margin-top:22px">${searchLabel}</div>
  <div class="input" style="margin-top:10px;display:flex;align-items:center;padding:0 16px;
      font-size:15.5px;color:#A6ABB6">${searchPh}</div>
</div>`;

const header = ({ chrome, mark, eyebrow, name, week, dot, btn, serifName }) => `
<div style="background:${chrome}">
  ${statusBar()}
  <div class="hdr row sp">
    <div class="row" style="gap:13px">
      <div class="appicon">${mark}</div>
      <div>
        <div class="eyebrow serif">${eyebrow}</div>
        <div class="nm${serifName ? ' serif' : ''}" ${serifName ? 'style="font-weight:400;font-size:25px"' : ''}>${name}</div>
        <div class="row" style="gap:8px;margin-top:5px">
          <span style="width:8px;height:8px;border-radius:50%;background:${dot}"></span>
          <span class="wk">${week}</span>
        </div>
      </div>
    </div>
    <div class="row" style="gap:10px">
      <div class="hbtn" style="background:${btn}">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="#1E2430" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="hbtn" style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.2)">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
  </div>
</div>`;

/* ======================= ALLENONE DASHBOARD ======================= */
function masterDashA() {
  return `
<div class="uiscreen">
  ${header({
    chrome: 'var(--indigo)', mark: `<div style="width:34px;height:34px;border-radius:9px;background:var(--orange);
      display:flex;align-items:center;justify-content:center">${cartMark(24)}</div>`,
    eyebrow: 'PEREZ &nbsp;—&nbsp; TRACKER', name: 'Allenone Sucat',
    week: 'Week 12 · started Aug 12', dot: '#F0A16A', btn: 'var(--orange)',
  })}
  <div class="pad" style="padding-top:18px">
    <div class="seg">
      <div class="on" style="background:var(--indigo-dp)">Bank</div>
      <div>Cash on Hand</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
      <!-- balance -->
      <div style="border-radius:16px;padding:15px 15px 17px;position:relative;overflow:hidden;
          background:linear-gradient(152deg,#2E2170 0%,#251B60 58%,#221957 100%);
          box-shadow:0 12px 28px rgba(30,20,80,0.28)">
        <div style="position:absolute;right:-30px;top:-30px;width:120px;height:120px;border-radius:50%;
            background:radial-gradient(circle,rgba(233,101,30,0.5) 0%,rgba(233,101,30,0) 68%)"></div>
        <div style="width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,0.12);
            display:flex;align-items:center;justify-content:center">
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M3.5 9.5L12 5l8.5 4.5M5.5 10v8M18.5 10v8M9.5 10v8M14.5 10v8M3.5 19h17" fill="none" stroke="#F2B183" stroke-width="1.7" stroke-linecap="round"/></svg>
        </div>
        <div style="margin-top:26px;font-size:11.5px;font-weight:800;letter-spacing:0.1em;color:#B9B2E0">CURRENT BALANCE</div>
        <div class="mono" style="margin-top:7px;font-size:19px;font-weight:700;color:#fff;letter-spacing:-0.03em">₱449,615.88</div>
        <div class="row" style="gap:6px;margin-top:12px;background:rgba(255,255,255,0.13);border-radius:999px;
            padding:7px 12px;width:fit-content">
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M7 10V7.5a5 5 0 0 1 10 0V10M5.5 10h13v10h-13z" fill="none" stroke="#fff" stroke-width="2"/></svg>
          <span style="font-size:12.5px;font-weight:700;color:#fff">as of today</span>
        </div>
      </div>

      <!-- deposits -->
      <div class="card" style="padding:15px 15px 17px;border:1px solid #EFF0F4">
        <div style="width:38px;height:38px;border-radius:11px;background:#E3F5EA;
            display:flex;align-items:center;justify-content:center">
          <svg width="19" height="19" viewBox="0 0 24 24"><path d="M12 19V6M6 11.5L12 5.5l6 6" fill="none" stroke="#2E9E63" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div style="margin-top:26px;font-size:11.5px;font-weight:800;letter-spacing:0.1em;color:#8A90A0">TOTAL DEPOSITS</div>
        <div class="mono" style="margin-top:7px;font-size:19px;font-weight:700;letter-spacing:-0.03em">₱72,587.10</div>
        <div style="margin-top:9px;font-size:14px;color:var(--muted)">Money in · all-time</div>
      </div>

      <!-- expenses -->
      <div class="card" style="padding:15px 15px 17px;border:1px solid #EFF0F4">
        <div style="width:38px;height:38px;border-radius:11px;background:#FCE7E7;
            display:flex;align-items:center;justify-content:center">
          <svg width="19" height="19" viewBox="0 0 24 24"><path d="M12 5v13M6 12.5l6 6 6-6" fill="none" stroke="#D64545" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div style="margin-top:26px;font-size:11.5px;font-weight:800;letter-spacing:0.1em;color:#8A90A0">TOTAL EXPENSES</div>
        <div class="mono" style="margin-top:7px;font-size:19px;font-weight:700;letter-spacing:-0.03em">₱73,046.00</div>
        <div style="margin-top:9px;font-size:14px;color:var(--muted)">Money out · all-time</div>
      </div>
    </div>

    ${filterCard({ accent: 'var(--indigo-dp)', searchLabel: 'SEARCH DESCRIPTION', searchPh: 'Search description...' })}

    <div class="row" style="gap:10px;margin-top:14px">
      <div class="pill on" style="flex:1;background:var(--indigo-dp)">All</div>
      <div class="pill" style="flex:1"><span class="dot" style="background:#16A34A"></span>Deposit</div>
      <div class="pill" style="flex:1"><span class="dot" style="background:#DC2626"></span>Expense</div>
    </div>
  </div>
  <div class="homebar"></div>
</div>`;
}

/* ======================= CORAZON DASHBOARD ======================= */
function masterDashC() {
  return `
<div class="uiscreen">
  ${header({
    chrome: 'var(--slate)', mark: `<div style="width:34px;height:34px;border-radius:9px;background:var(--teal);
      display:flex;align-items:center;justify-content:center">${islandMark(24)}</div>`,
    eyebrow: 'PEREZ &nbsp;—&nbsp; TRACKER', name: 'Corazon del Mar', serifName: true,
    week: 'Week 1 · started Jun 16', dot: '#7FC4B8', btn: 'var(--teal)',
  })}
  <div class="pad" style="padding-top:18px">
    <div class="seg"><div class="on" style="background:var(--slate-dp);border-bottom:3px solid var(--teal)">Wallet</div></div>

    <div style="margin-top:16px;border-radius:16px;padding:18px 18px 20px;
        background:linear-gradient(152deg,#48575F 0%,#3E4D58 56%,#36444E 100%);
        box-shadow:0 12px 28px rgba(30,40,50,0.26)">
      <div class="serif" style="font-size:13px;letter-spacing:0.2em;color:#C6D0D6">WALLET · CASH ON HAND</div>
      <div class="mono" style="margin-top:9px;font-size:30px;font-weight:700;color:#fff;letter-spacing:-0.03em">₱24,664.50</div>
      <div class="row" style="margin-top:16px">
        <div style="flex:1">
          <div style="font-size:11.5px;font-weight:800;letter-spacing:0.1em;color:#AEBBC3">BUDGET IN</div>
          <div class="mono" style="margin-top:6px;font-size:16px;font-weight:700;color:#fff">₱300,000.00</div>
        </div>
        <div style="width:1px;height:40px;background:rgba(255,255,255,0.22)"></div>
        <div style="flex:1;padding-left:18px">
          <div style="font-size:11.5px;font-weight:800;letter-spacing:0.1em;color:#AEBBC3">SPENT</div>
          <div class="mono" style="margin-top:6px;font-size:16px;font-weight:700;color:#fff">₱275,335.50</div>
        </div>
      </div>
    </div>

    <div class="row" style="gap:12px;margin-top:14px">
      <div style="flex:1;height:56px;border-radius:14px;background:var(--teal-dk);display:flex;
          align-items:center;justify-content:center;gap:9px;color:#fff;font-size:17px;font-weight:800">
        <svg width="19" height="19" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>
        Add Expense
      </div>
      <div style="flex:1;height:56px;border-radius:14px;background:#fff;border:1px solid var(--line);
          display:flex;align-items:center;justify-content:center;gap:9px;font-size:17px;font-weight:800">
        <svg width="21" height="21" viewBox="0 0 24 24"><rect x="3" y="6.5" width="18" height="11" rx="2.4" fill="none" stroke="#1E2430" stroke-width="1.9"/><path d="M6.5 12h4" stroke="#1E2430" stroke-width="1.9" stroke-linecap="round"/></svg>
        Add Budget
      </div>
    </div>

    ${filterCard({ accent: 'var(--slate-dp)', searchLabel: 'SEARCH PURPOSE OR SOURCE', searchPh: 'Search purpose or source...' })}

    <div class="row sp" style="margin-top:20px">
      <div class="row" style="gap:12px">
        <div style="width:38px;height:38px;border-radius:11px;background:#EDF1F3;display:flex;
            align-items:center;justify-content:center">
          <svg width="19" height="19" viewBox="0 0 24 24"><path d="M6 3.5h9l4 4v13H6z" fill="none" stroke="#4A5963" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h7M9 15h7" stroke="#4A5963" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="serif" style="font-size:24px">Recent Expenses</div>
        <div style="background:var(--slate-dp);color:#fff;border-radius:999px;padding:5px 13px;
            font-size:14px;font-weight:800">25</div>
      </div>
      <div style="background:#EDF1F3;border-radius:11px;padding:12px 17px;font-size:15px;font-weight:800">Export CSV</div>
    </div>
  </div>
  <div class="homebar"></div>
</div>`;
}

/* ======================= CORAZON EXPENSE LEDGER ======================= */
// receipt thumbnails, approximated as the real photos read at this size:
// a printed till receipt, a second receipt, a dark chat screenshot, a photo grid
const thumbs = [
  `<div style="width:100%;height:100%;background:#F2F0EC;position:relative;overflow:hidden">
     ${Array.from({ length: 9 }, (_, i) => `<div style="position:absolute;left:11%;right:${18 + (i % 3) * 12}%;top:${9 + i * 10}%;height:3.4%;background:#B9B4AC"></div>`).join('')}
   </div>`,
  `<div style="width:100%;height:100%;background:#E8E5DF;position:relative;overflow:hidden">
     ${Array.from({ length: 8 }, (_, i) => `<div style="position:absolute;left:14%;right:${20 + (i % 4) * 10}%;top:${12 + i * 10}%;height:3.2%;background:#AFA9A0"></div>`).join('')}
   </div>`,
  `<div style="width:100%;height:100%;background:#12161C;position:relative;overflow:hidden">
     <div style="position:absolute;left:8%;right:34%;top:14%;height:13%;background:#2B3440;border-radius:4px"></div>
     <div style="position:absolute;left:30%;right:8%;top:34%;height:15%;background:#2B6CF0;border-radius:4px"></div>
     <div style="position:absolute;left:8%;right:40%;top:56%;height:12%;background:#2B3440;border-radius:4px"></div>
     <div style="position:absolute;left:26%;right:8%;top:74%;height:13%;background:#2B6CF0;border-radius:4px"></div>
   </div>`,
  `<div style="width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:1px;background:#fff">
     <div style="background:linear-gradient(140deg,#8C8377,#5E574E)"></div>
     <div style="background:linear-gradient(140deg,#A79C8C,#736A5E)"></div>
     <div style="background:linear-gradient(140deg,#6E6A63,#46433D)"></div>
     <div style="background:linear-gradient(140deg,#9AA0A6,#6B7075)"></div>
   </div>`,
];

const expenses = [
  { d: 'Aug 14, 2026', amt: '₱421.00', t: 'Ice, Water & Mosquito Spray', th: 0 },
  { d: 'Aug 14, 2026', amt: '₱4,000.00', t: 'Gas', th: 1 },
  { d: 'Aug 14, 2026', amt: '₱19,443.00', t: 'kuya Terso July 19-31 & Aug 1-15 + SSS & Soap', th: 2 },
  { d: 'Aug 14, 2026', amt: '₱85,711.50', t: 'Wilcon', th: 3 },
];

const actionBtn = (label, icon) => `
<div style="background:#F1F2F4;border-radius:11px;padding:11px 18px;display:flex;align-items:center;
    gap:8px;font-size:15px;font-weight:700;color:#374151">${icon}${label}</div>`;

function masterListC() {
  return `
<div class="uiscreen" style="background:#F6F6F5">
  <div style="background:var(--slate)">${statusBar()}</div>
  <div class="pad" style="padding-top:16px">
    <div class="row sp">
      <div class="row" style="gap:12px">
        <div style="width:38px;height:38px;border-radius:11px;background:#EDF1F3;display:flex;
            align-items:center;justify-content:center">
          <svg width="19" height="19" viewBox="0 0 24 24"><path d="M6 3.5h9l4 4v13H6z" fill="none" stroke="#4A5963" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h7M9 15h7" stroke="#4A5963" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <div class="serif" style="font-size:24px">Recent Expenses</div>
        <div style="background:var(--slate-dp);color:#fff;border-radius:999px;padding:5px 13px;
            font-size:14px;font-weight:800">25</div>
      </div>
      <div style="background:#EDF1F3;border-radius:11px;padding:12px 17px;font-size:15px;font-weight:800">Export CSV</div>
    </div>

    <!-- source tiles -->
    <div class="row" style="gap:10px;margin-top:16px">
      <div class="card" style="flex:1;padding:12px 13px;border:1px solid #EFF0F2">
        <div class="row" style="gap:7px"><span class="dot" style="background:#3D4C57"></span>
          <span class="lbl" style="font-size:10px;white-space:nowrap">FROM WALLET</span></div>
        <div class="mono" style="margin-top:8px;font-size:15px;font-weight:700">₱275,335.50</div>
        <div style="margin-top:5px;font-size:13px;color:var(--muted)">25 items</div>
      </div>
      <div class="card" style="flex:1;padding:12px 13px;border:1px solid #EFF0F2">
        <div class="row" style="gap:7px"><span class="dot" style="background:#A9B4BC"></span>
          <span class="lbl" style="font-size:10px;white-space:nowrap">FROM ABONO</span></div>
        <div class="mono" style="margin-top:8px;font-size:15px;font-weight:700">₱0.00</div>
        <div style="margin-top:5px;font-size:13px;color:var(--muted)">0 items</div>
      </div>
      <div style="flex:1;padding:12px 13px;border-radius:16px;background:var(--slate-dp)">
        <div class="lbl" style="font-size:10px;color:#B9C4CB;white-space:nowrap">TOTAL SPENT</div>
        <div class="mono" style="margin-top:8px;font-size:15px;font-weight:700;color:#fff">₱275,335.50</div>
        <div style="margin-top:5px;font-size:13px;color:#AEBBC3">25 items</div>
      </div>
    </div>

    <div class="row" style="gap:10px;margin-top:14px">
      <div class="pill on" style="flex:1;background:var(--slate-dp)">All</div>
      <div class="pill" style="flex:1"><span class="dot" style="background:#3D4C57"></span>Wallet</div>
      <div class="pill" style="flex:1"><span class="dot" style="background:#A9B4BC"></span>Abono</div>
    </div>

    ${expenses.map((e) => `
    <div class="card" style="margin-top:14px;padding:15px 16px 14px;border-left:4px solid var(--slate-dp);
        box-shadow:0 2px 10px rgba(30,36,48,0.05)">
      <div class="row sp">
        <span class="mono" style="font-size:14px;color:#7A828F">${e.d}</span>
        <span class="mono" style="font-size:19px;font-weight:700;letter-spacing:-0.02em">${e.amt}</span>
      </div>
      <div class="row" style="gap:13px;margin-top:12px;align-items:flex-start">
        <div style="width:52px;height:52px;border-radius:11px;overflow:hidden;flex:0 0 52px;
            border:1px solid #E9EAEE">${thumbs[e.th]}</div>
        <div style="flex:1">
          <div style="font-size:17px;font-weight:700;line-height:1.25;letter-spacing:-0.01em">${e.t}</div>
          <div style="margin-top:9px;background:#EDF1F3;border-radius:8px;padding:6px 12px;width:fit-content;
              font-size:12px;font-weight:800;letter-spacing:0.08em;color:#54606B">WALLET</div>
        </div>
      </div>
      <div class="row" style="gap:10px;margin-top:13px;justify-content:flex-end">
        ${actionBtn('Edit', '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="#374151" stroke-width="1.9" stroke-linejoin="round"/></svg>')}
        ${actionBtn('Delete', '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 7h14M9.5 7V5h5v2M7 7l1 13h8l1-13" fill="none" stroke="#374151" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>')}
      </div>
    </div>`).join('')}
  </div>
  <div class="homebar"></div>
</div>`;
}

module.exports = { CSS_UI, masterSplashA, masterSplashC, masterDashA, masterDashC, masterListC };
