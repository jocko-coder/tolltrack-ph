// Faithful rebuilds of the four real APLUS screens, as 430px iPhone artboards.
// These are rendered once at high dpr into flat plates; every carousel slide is
// an extreme macro crop of one of them.
'use strict';

const CSS_UI = `
.uiscreen {
  position: absolute; inset: 0; width: 430px; height: 932px;
  background: var(--wash); overflow: hidden;
  font-family: 'Figtree', sans-serif; color: var(--navy-ink);
}
.uiscreen.dark { background: #0E2043; color: #fff; }

/* ---------- status bar ---------- */
.sb { height: 54px; background: var(--navy); color: #fff; display: flex;
  align-items: center; justify-content: space-between; padding: 0 22px 0 26px;
  font-size: 15px; font-weight: 700; letter-spacing: 0.01em; }
.sb .r { display: flex; align-items: center; gap: 6px; }
.sb .bars { display: flex; align-items: flex-end; gap: 2px; }
.sb .bars i { display: block; width: 3px; background: #fff; border-radius: 1px; }
.sb .batt { width: 24px; height: 12px; border: 1.6px solid rgba(255,255,255,0.85);
  border-radius: 3px; position: relative; }
.sb .batt::after { content: ''; position: absolute; inset: 2px; right: 4px;
  background: #fff; border-radius: 1px; }

/* ---------- generic ---------- */
.pad { padding: 0 18px; }
.card { background: var(--paper); border-radius: 16px; }
.row { display: flex; align-items: center; }
.sp { justify-content: space-between; }
.mut { color: var(--muted); }
.mono { font-family: ui-monospace, 'SF Mono', Menlo, monospace; }

/* ---------- stat tiles ---------- */
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.tile { background: var(--paper); border-radius: 14px; padding: 15px 16px 14px;
  border: 1px solid transparent; }
.tile .n { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; line-height: 1;
  color: var(--navy-ink); }
.tile .n small { font-size: 21px; font-weight: 700; color: #9AA7BC; }
.tile .l { margin-top: 7px; font-size: 14px; color: var(--muted); font-weight: 500; }
.tile.amber { border-color: #F0D6A8; } .tile.amber .n { color: var(--nis); }
.tile.red   { border-color: #F3C9C4; } .tile.red .n   { color: var(--aog); }

/* ---------- AOG hero ---------- */
.hero { border-radius: 20px; padding: 18px 18px 20px;
  background: linear-gradient(150deg, #1E56AC 0%, #17418A 62%, #143A7B 100%);
  box-shadow: 0 14px 34px rgba(12,32,70,0.28); color: #fff; }
.pill-aog { background: var(--aog); color: #fff; font-size: 13px; font-weight: 800;
  letter-spacing: 0.04em; padding: 7px 15px; border-radius: 999px; }
.hero h2 { font-size: 25px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.12;
  margin-top: 15px; }
.hero .meta { font-size: 14px; color: #A9C4EA; margin-top: 7px; letter-spacing: 0.01em; }
.bar { height: 7px; border-radius: 4px; background: rgba(255,255,255,0.22); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 4px; background: var(--lime); }
.btn-w { background: #fff; color: #14356E; font-weight: 800; font-size: 17px;
  border-radius: 12px; height: 50px; display: flex; align-items: center; justify-content: center; }
.btn-o { border: 1px solid rgba(255,255,255,0.42); color: #fff; font-weight: 600;
  font-size: 14px; border-radius: 12px; height: 50px; display: flex;
  align-items: center; justify-content: center; padding: 0 14px; }

/* ---------- bottom nav ---------- */
.nav { position: absolute; left: 0; right: 0; bottom: 0; height: 92px;
  background: #F7F9FB; border-top: 1px solid #E2E7EF;
  display: flex; align-items: flex-start; padding-top: 12px; }
.nav.dk { background: var(--navy); border-top-color: rgba(255,255,255,0.08); }
.nav .it { flex: 1; text-align: center; font-size: 12px; font-weight: 700; color: #8B98AE; }
.nav .it.on { color: var(--navy-ink); }
.nav.dk .it { color: rgba(255,255,255,0.55); } .nav.dk .it.on { color: #fff; }
.nav .ic { height: 26px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.fab { position: absolute; left: 50%; top: -6px; transform: translateX(-50%);
  width: 66px; height: 66px; border-radius: 50%; background: var(--navy);
  border: 3px solid var(--lime-hi); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 22px rgba(12,32,70,0.35); }
.homebar { position: absolute; left: 50%; bottom: 9px; transform: translateX(-50%);
  width: 140px; height: 5px; border-radius: 3px; background: #0B1A38; opacity: 0.85; }
.nav.dk ~ .homebar, .homebar.lt { background: #fff; }
`;

/* ---------------- shared bits ---------------- */
const statusBar = (time = '12:28', dark = true) => `
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

const iHome = (c) => `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" fill="none" stroke="${c}" stroke-width="1.9" stroke-linejoin="round"/></svg>`;
const iKits = (c) => `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="none" stroke="${c}" stroke-width="1.9" stroke-linejoin="round"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9" fill="none" stroke="${c}" stroke-width="1.6"/></svg>`;
const iTools = (c) => `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0 5 5l-8.4 8.4a2.1 2.1 0 0 1-3-3z" fill="none" stroke="${c}" stroke-width="1.9" stroke-linejoin="round"/></svg>`;
const iMore = (c) => `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.9" fill="${c}"/><circle cx="12" cy="12" r="1.9" fill="${c}"/><circle cx="19" cy="12" r="1.9" fill="${c}"/></svg>`;
const iScan = (c, s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 8.5V5.6A1.6 1.6 0 0 1 5.6 4h2.9M15.5 4h2.9A1.6 1.6 0 0 1 20 5.6v2.9M20 15.5v2.9a1.6 1.6 0 0 1-1.6 1.6h-2.9M8.5 20H5.6A1.6 1.6 0 0 1 4 18.4v-2.9" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/><path d="M4 12h16" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`;

const bottomNav = (active = 'Home') => `
<div class="nav">
  <div class="it ${active === 'Home' ? 'on' : ''}"><div class="ic">${iHome(active === 'Home' ? '#16294D' : '#8B98AE')}</div>Home</div>
  <div class="it ${active === 'Kits' ? 'on' : ''}"><div class="ic">${iKits(active === 'Kits' ? '#16294D' : '#8B98AE')}</div>Kits</div>
  <div class="it" style="position:relative">
    <div class="fab">${iScan('#A3DC52', 30)}</div>
    <div style="margin-top:34px">Scan</div>
  </div>
  <div class="it ${active === 'Tools' ? 'on' : ''}"><div class="ic">${iTools(active === 'Tools' ? '#16294D' : '#8B98AE')}</div>Tools</div>
  <div class="it ${active === 'More' ? 'on' : ''}"><div class="ic">${iMore(active === 'More' ? '#16294D' : '#8B98AE')}</div>More</div>
</div>
<div class="homebar"></div>`;

/* ======================= SPLASH ======================= */
function masterSplash() {
  return `
<div class="uiscreen" style="background:linear-gradient(168deg,#16305F 0%,#102449 42%,#0A1730 100%)">
  ${statusBar('12:28')}
  <!-- lime swooshes -->
  <svg width="430" height="932" style="position:absolute;inset:0" viewBox="0 0 430 932" fill="none">
    <path d="M-30 790 C 120 754, 300 640, 470 536" stroke="#2E4A2B" stroke-width="15" stroke-linecap="round" opacity="0.85"/>
    <path d="M-30 760 C 120 724, 300 610, 470 506" stroke="#8DC63F" stroke-width="13" stroke-linecap="round"/>
  </svg>

  <div style="position:absolute;left:0;right:0;top:352px;text-align:center">
    <!-- logo tile -->
    <div style="width:104px;height:104px;margin:0 auto;border-radius:24px;
        background:linear-gradient(150deg,#2160B4,#17458C);position:relative;overflow:hidden;
        box-shadow:0 16px 40px rgba(4,14,34,0.55)">
      <div style="position:absolute;left:0;right:0;top:16px;text-align:center;
          font-size:56px;font-weight:900;color:#fff;letter-spacing:-0.04em;line-height:1">A</div>
      <div style="position:absolute;right:15px;top:11px;width:22px;height:22px">
        <div style="position:absolute;left:9px;top:0;width:5px;height:22px;background:#A3DC52;border-radius:2px"></div>
        <div style="position:absolute;left:0;top:9px;width:22px;height:5px;background:#A3DC52;border-radius:2px"></div>
      </div>
      <svg width="104" height="104" style="position:absolute;inset:0" viewBox="0 0 104 104" fill="none">
        <path d="M6 74 C 34 88, 68 80, 98 44" stroke="#8DC63F" stroke-width="9" stroke-linecap="round"/>
      </svg>
    </div>
    <div style="margin-top:26px;font-size:31px;font-weight:800;color:#fff;letter-spacing:0.34em;padding-left:0.34em">APLUS</div>
    <div style="margin-top:14px;font-size:16px;color:#9FB4D4;font-weight:500">The flight line, in your hand.</div>
    <div class="row" style="justify-content:center;gap:11px;margin-top:32px">
      ${[1, 0.92, 0.8, 0.66, 0.5, 0.34, 0.22].map((o) => `<span style="width:8px;height:8px;border-radius:50%;background:#8DC63F;opacity:${o}"></span>`).join('')}
    </div>
  </div>

  <div style="position:absolute;left:0;right:0;bottom:96px;text-align:center">
    <div style="font-size:15px;color:#7C90B2;font-weight:500">Preparing MNL station</div>
    <div class="mono" style="margin-top:14px;font-size:13px;color:#54688C;letter-spacing:0.04em">v1.0 · installable · works offline</div>
  </div>
  <div class="homebar" style="background:#8FA3C4"></div>
</div>`;
}

/* ======================= HOME ======================= */
function masterHome() {
  return `
<div class="uiscreen">
  ${statusBar('12:28')}
  <div class="pad" style="padding-top:16px">
    <div class="row sp" style="align-items:flex-start">
      <div>
        <div style="font-size:19px;font-weight:800;letter-spacing:-0.01em">MNL · Morning shift</div>
        <div class="row" style="gap:8px;margin-top:6px">
          <span style="width:8px;height:8px;border-radius:50%;background:#2FA65A"></span>
          <span style="font-size:14px;color:var(--muted);font-weight:500">No AMOS import yet at this station</span>
        </div>
      </div>
      <div style="width:44px;height:44px;border-radius:50%;background:var(--navy);color:#fff;
          display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800">RS</div>
    </div>

    <div style="margin-top:20px;font-size:29px;font-weight:800;letter-spacing:-0.03em">Good morning, Ria.</div>
    <div style="margin-top:5px;font-size:16px;color:var(--muted);font-weight:500">One aircraft is on ground. Start there.</div>

    <!-- AOG hero -->
    <div class="hero" style="margin-top:16px">
      <div class="row sp">
        <span class="pill-aog">AOG</span>
        <span style="font-size:14px;color:#B9CFEE;font-weight:600">Task 1 of 4</span>
      </div>
      <h2>Continue kit for RP-C3287</h2>
      <div class="meta mono">WO 18013440 · PS 989718</div>
      <div class="row sp" style="margin-top:15px">
        <span style="font-size:14px;color:#CBDCF4;font-weight:600">1 of 2 lines staged</span>
        <span style="font-size:17px;font-weight:800">67%</span>
      </div>
      <div class="bar" style="margin-top:8px"><i style="width:67%"></i></div>
      <div class="row" style="gap:10px;margin-top:16px">
        <div class="btn-w" style="flex:1">Continue AOG pick</div>
        <div class="btn-o">1 line NIS</div>
      </div>
    </div>

    <!-- tiles -->
    <div class="tiles" style="margin-top:13px">
      <div class="tile"><div class="n">4</div><div class="l">Open work orders</div></div>
      <div class="tile"><div class="n">0 <small>/ 4</small></div><div class="l">Kits ready</div></div>
      <div class="tile amber"><div class="n">1</div><div class="l">NIS line</div></div>
      <div class="tile"><div class="n">0</div><div class="l">Moves today</div></div>
    </div>

    <!-- offline -->
    <div class="card" style="margin-top:13px;padding:15px 16px">
      <div class="row" style="gap:13px;align-items:flex-start">
        <div style="width:44px;height:44px;border-radius:12px;background:#EFF2F6;flex:0 0 44px;
            display:flex;align-items:center;justify-content:center">
          <svg width="23" height="23" viewBox="0 0 24 24"><path d="M3 3l18 18M5 12.5a10 10 0 0 1 4-2.4M12 19.6l2.4-2.4a3.4 3.4 0 0 0-4.8 0z" fill="none" stroke="#5C6B84" stroke-width="1.9" stroke-linecap="round"/></svg>
        </div>
        <div style="flex:1">
          <div style="font-size:17px;font-weight:800;letter-spacing:-0.01em">Offline work</div>
          <div style="font-size:14px;color:var(--muted);margin-top:3px;line-height:1.36">Posts saved on this phone, and what the server answered.</div>
        </div>
        <div style="font-size:15px;font-weight:800;color:#1A62C8">Open</div>
      </div>
    </div>

    <!-- kits -->
    <div class="row sp" style="margin-top:20px">
      <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em">Kits</div>
      <div style="font-size:15px;font-weight:800;color:#1A62C8">All kits</div>
    </div>
    <div class="card" style="margin-top:11px;padding:0;overflow:hidden">
      <div class="row" style="padding:14px 15px;gap:12px">
        <span class="pill-aog" style="font-size:12px;padding:6px 12px">AOG</span>
        <div style="flex:1">
          <div class="mono" style="font-size:17px;font-weight:700">18013440</div>
          <div style="font-size:13px;color:var(--muted);margin-top:2px;white-space:nowrap">RP-C3287 · AOG recovery</div>
        </div>
        <div style="width:78px"><div class="bar" style="background:#F5D9D6"><i style="width:67%;background:#DC3A2E"></i></div></div>
        <div style="font-size:15px;font-weight:800;width:40px;text-align:right">67%</div>
      </div>
      <div style="height:1px;background:#EDF0F5"></div>
      <div class="row" style="padding:14px 15px;gap:12px">
        <div style="flex:1;padding-left:2px">
          <div class="mono" style="font-size:17px;font-weight:700">13554880</div>
          <div style="font-size:13px;color:var(--muted);margin-top:2px;white-space:nowrap">RP-C4102 · Weekly check</div>
        </div>
        <div style="width:78px"><div class="bar" style="background:#DCE5F1"><i style="width:86%;background:#1A62C8"></i></div></div>
        <div style="font-size:15px;font-weight:800;width:40px;text-align:right">86%</div>
      </div>
    </div>
  </div>
  ${bottomNav('Home')}
</div>`;
}

/* ======================= SCAN ======================= */
function masterScan() {
  return `
<div class="uiscreen dark">
  ${statusBar('12:28')}
  <div class="pad" style="padding-top:18px">
    <div class="row sp">
      <div class="row" style="gap:12px">
        <svg width="13" height="22" viewBox="0 0 12 20"><path d="M10 1L2 10l8 9" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:25px;font-weight:800;letter-spacing:-0.02em">Scan</span>
      </div>
      <div class="row" style="gap:8px;background:rgba(141,198,63,0.14);border:1px solid rgba(141,198,63,0.3);
          padding:8px 16px;border-radius:999px">
        <span style="width:8px;height:8px;border-radius:50%;background:#8DC63F"></span>
        <span style="font-size:14px;font-weight:800;color:#A3DC52;letter-spacing:0.1em">READY</span>
      </div>
    </div>

    <!-- viewfinder -->
    <div style="margin-top:18px;height:190px;border-radius:18px;position:relative;
        background:linear-gradient(160deg,#1B4585 0%,#132F5E 55%,#0F2549 100%)">
      ${[['left:26px;top:24px', 'M22 1H5a4 4 0 0 0-4 4v17'], ['right:26px;top:24px', 'M1 1h17a4 4 0 0 1 4 4v17'], ['left:26px;bottom:24px', 'M22 22H5a4 4 0 0 1-4-4V1'], ['right:26px;bottom:24px', 'M1 22h17a4 4 0 0 0 4-4V1']]
      .map(([pos, d]) => `<svg width="34" height="34" viewBox="0 0 23 23" style="position:absolute;${pos}"><path d="${d}" fill="none" stroke="#8DC63F" stroke-width="2.6" stroke-linecap="round"/></svg>`).join('')}
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          display:flex;align-items:center;gap:11px;background:rgba(255,255,255,0.1);
          border:1px solid rgba(255,255,255,0.2);border-radius:999px;padding:13px 26px;white-space:nowrap">
        ${iScan('#A3DC52', 21)}
        <span style="font-size:17px;font-weight:700;color:#fff">Start the camera</span>
      </div>
    </div>

    <!-- lookup -->
    <div class="row" style="gap:10px;margin-top:14px">
      <div style="flex:1;height:56px;border-radius:14px;background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.13);display:flex;align-items:center;padding:0 18px;
          font-size:16px;color:#8CA2C4">Type a bin, part, serial, or tool</div>
      <div style="height:56px;padding:0 20px;border-radius:14px;background:rgba(255,255,255,0.13);
          display:flex;align-items:center;font-size:16px;font-weight:800;color:#fff">Look up</div>
    </div>

    <!-- hardware scan mode -->
    <div style="margin-top:12px;border-radius:16px;background:rgba(255,255,255,0.05);
        border:1px solid rgba(255,255,255,0.1);padding:16px 17px">
      <div class="row sp" style="align-items:flex-start;gap:14px">
        <div style="flex:1">
          <div style="font-size:17px;font-weight:800">Hardware scan mode</div>
          <div style="font-size:14px;color:#93A9CB;margin-top:5px;line-height:1.42">For a scanner with no APLUS prefix programmed in. A scanner programmed to send ~AP is meant to be read without this.</div>
        </div>
        <div style="height:48px;padding:0 20px;border-radius:12px;background:rgba(255,255,255,0.12);
            display:flex;align-items:center;font-size:15px;font-weight:800;color:#fff">Turn on</div>
      </div>
      <div class="row" style="gap:9px;margin-top:13px;align-items:flex-start">
        <svg width="17" height="17" viewBox="0 0 24 24" style="margin-top:2px;flex:0 0 17px"><circle cx="12" cy="12" r="9.5" fill="none" stroke="#93A9CB" stroke-width="1.8"/><path d="M12 7.4v6.2M12 16.4v.2" stroke="#93A9CB" stroke-width="1.9" stroke-linecap="round"/></svg>
        <div style="font-size:13.5px;color:#93A9CB;line-height:1.44">Unproved on hardware. No scanner has been qualified against APLUS yet, so this mode is the path that works today and the prefix path waits for a device.</div>
      </div>
    </div>
  </div>

  <!-- resolve sheet -->
  <div style="position:absolute;left:0;right:0;bottom:0;height:310px;background:#fff;
      border-radius:24px 24px 0 0;padding-top:14px;text-align:center">
    <div style="width:46px;height:5px;border-radius:3px;background:#D5DCE6;margin:0 auto"></div>
    <div style="width:74px;height:74px;border-radius:50%;background:#E9F0FA;margin:44px auto 0;
        display:flex;align-items:center;justify-content:center">${iScan('#1A62C8', 34)}</div>
    <div style="margin-top:20px;font-size:22px;font-weight:800;color:var(--navy-ink);letter-spacing:-0.02em">Point at a label</div>
    <div style="margin:9px 30px 0;font-size:15px;color:var(--muted);line-height:1.44">Bins, parts, serials, and tools all resolve here. Camera, hardware gun, or typing, whatever is in your hand.</div>
  </div>
  <div class="homebar"></div>
</div>`;
}

/* ======================= DASHBOARD (More) ======================= */
function masterDash() {
  return `
<div class="uiscreen">
  ${statusBar('12:28')}
  <div class="pad" style="padding-top:18px">
    <div class="row" style="gap:10px">
      <svg width="11" height="19" viewBox="0 0 12 20"><path d="M10 1L2 10l8 9" fill="none" stroke="#1A62C8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span style="font-size:19px;font-weight:800;color:#1A62C8">More</span>
    </div>

    <div class="row sp" style="margin-top:24px;align-items:baseline;gap:12px">
      <div style="font-size:25px;font-weight:800;letter-spacing:-0.03em;white-space:nowrap">Good morning, Ria.</div>
      <div style="font-size:12.5px;color:var(--muted);font-weight:500;white-space:nowrap">Saturday 15 Aug · Morning shift</div>
    </div>
    <div style="margin-top:5px;font-size:15px;color:var(--muted);font-weight:500">1 aircraft on ground needs attention.</div>

    <div class="tiles" style="margin-top:17px">
      <div class="tile"><div class="n">4</div><div class="l">Open WOs</div></div>
      <div class="tile red"><div class="n">1</div><div class="l">AOG</div></div>
      <div class="tile"><div class="n">0 <small>/ 4</small></div><div class="l">Kits ready</div></div>
      <div class="tile amber"><div class="n">1</div><div class="l">NIS lines</div></div>
      <div class="tile"><div class="n">0</div><div class="l">Moves today</div></div>
      <div class="tile"><div class="n">0</div><div class="l">Overdue tools</div></div>
    </div>

    <div class="hero" style="margin-top:17px">
      <div class="row sp">
        <span class="pill-aog">AOG</span>
        <div><span style="font-size:20px;font-weight:800">67%</span>
          <span style="font-size:13px;font-weight:700;color:#B9CFEE;letter-spacing:0.06em;margin-left:7px">BLOCKED · NIS</span></div>
      </div>
      <div class="mono" style="margin-top:15px;font-size:22px;font-weight:700;letter-spacing:-0.01em">18013440 · RP-C3287</div>
      <div style="font-size:14px;color:#A9C4EA;margin-top:6px">AOG recovery · pickslip 989718 · 1 of 2 staged</div>
      <div class="row" style="gap:10px;margin-top:14px;background:rgba(255,255,255,0.1);
          border-radius:10px;padding:12px 15px">
        <span style="width:8px;height:8px;border-radius:50%;background:#FF6B5E;flex:0 0 8px"></span>
        <span class="mono" style="font-size:12.5px;color:#DCE8F8;white-space:nowrap">Blocking part S700P0786-522, not in stock</span>
      </div>
      <div class="btn-w" style="margin-top:15px">Open kit</div>
    </div>

    <div class="card" style="margin-top:15px;padding:17px 0 0;overflow:hidden">
      <div class="row sp" style="padding:0 16px 14px">
        <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em">Kitting board</div>
        <div style="font-size:15px;font-weight:800;color:#1A62C8">All kits</div>
      </div>
      <div style="height:1px;background:#EDF0F5"></div>
      <div class="row" style="padding:12px 16px;font-size:12px;font-weight:800;color:#96A3B8;letter-spacing:0.08em">
        <span style="flex:0 0 96px">WO</span><span style="flex:1">AIRCRAFT</span>
        <span style="flex:0 0 96px">KIT</span><span style="flex:0 0 34px;text-align:right">NIS</span>
      </div>
      <div class="row" style="padding:13px 16px;background:#FDEEEC;border-left:4px solid #DC3A2E">
        <div class="row" style="flex:0 0 148px;gap:8px">
          <span class="pill-aog" style="font-size:11px;padding:5px 9px">AOG</span>
          <span class="mono" style="font-size:14.5px;font-weight:700;white-space:nowrap">18013440</span>
        </div>
        <span class="mono" style="flex:1;font-size:14.5px;white-space:nowrap">RP-C3287</span>
        <div class="row" style="flex:0 0 104px;gap:8px">
          <div class="bar" style="flex:1;background:#F5D9D6"><i style="width:67%;background:#DC3A2E"></i></div>
          <span style="font-size:14px;font-weight:800">67%</span>
        </div>
        <span style="flex:0 0 30px;text-align:right;font-size:15px;font-weight:800">1</span>
      </div>
      <div class="row" style="padding:13px 16px;opacity:0.55">
        <span class="mono" style="flex:0 0 148px;font-size:14.5px;font-weight:700;white-space:nowrap">13554880</span>
        <span class="mono" style="flex:1;font-size:14.5px;white-space:nowrap">RP-C4102</span>
        <div class="row" style="flex:0 0 104px;gap:8px">
          <div class="bar" style="flex:1;background:#DCE5F1"><i style="width:86%;background:#1A62C8"></i></div>
          <span style="font-size:14px;font-weight:800">86%</span>
        </div>
        <span style="flex:0 0 30px;text-align:right;font-size:15px;font-weight:800">0</span>
      </div>
    </div>
  </div>
  ${bottomNav('More')}
</div>`;
}

module.exports = { CSS_UI, masterSplash, masterHome, masterScan, masterDash };
