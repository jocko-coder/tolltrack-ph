// Real Perla product screens, recreated pixel-faithfully as 430x932 frames:
//   masterHome    — Home / Morning Report (dark)
//   masterScribe  — Perla Scribe notes list (dark)
//   masterAsk     — Ask Perla chat (dark teal→violet)
// Used on slides 2 (Home macro), 5 (Scribe panel), 7 & 8 (Home hero).
'use strict';

const CSS_UI = `
.uiscreen {
  position: relative; width: 430px; height: 932px; overflow: hidden;
  font-family: 'Figtree', sans-serif; color: #EAF4F2;
  background:
    radial-gradient(120% 70% at 50% -6%, #0E2A2E 0%, #081619 58%),
    #081619;
}

/* ---- status bar ---- */
.ui-status {
  display: flex; align-items: center; justify-content: space-between;
  padding: 15px 26px 0 30px; font-size: 15px; font-weight: 700; color: #EAF4F2;
}
.ui-status .r { display: flex; align-items: center; gap: 7px; }
.ui-status .bars { display: flex; gap: 2px; align-items: flex-end; height: 11px; }
.ui-status .bars i { width: 3px; background: #EAF4F2; border-radius: 1px; display: block; }
.ui-status .batt { width: 24px; height: 12px; border: 1.5px solid rgba(255,255,255,0.55); border-radius: 4px; position: relative; }
.ui-status .batt::before { content:""; position:absolute; inset:2px; right:11px; background:#EAF4F2; border-radius:1.5px; }
.ui-status .batt.low::before { right: 15px; background: #E7564F; }

/* ---- generic dark card ---- */
.ui-card {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.075);
  border-radius: 22px;
}
.teal { color: #35D6C7; }
.g { color: rgba(255,255,255,0.5); }

/* ---- pill / peso ---- */
.pesoG { position: relative; display: inline-block; }
.pesoG::before, .pesoG::after {
  content: ""; position: absolute; left: -0.03em; width: 0.62em; height: 0.085em;
  background: currentColor; border-radius: 1px;
}
.pesoG::before { top: 0.30em; }
.pesoG::after  { top: 0.47em; }

/* ---- bottom nav ---- */
.ui-nav {
  position: absolute; left: 14px; right: 14px; bottom: 14px; height: 74px;
  background: rgba(9,22,25,0.72);
  border: 1px solid rgba(255,255,255,0.06);
  -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
  border-radius: 26px;
  display: flex; align-items: center; justify-content: space-around;
  box-shadow: 0 18px 40px rgba(0,0,0,0.4);
}
.ui-nav .it { display: flex; flex-direction: column; align-items: center; gap: 5px; color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 600; }
.ui-nav .it.on { color: #35D6C7; }
.ui-nav .it svg { display: block; }
.ui-nav .askbtn {
  width: 54px; height: 54px; border-radius: 50%;
  background: linear-gradient(160deg, #1ED0C0, #12A093);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 26px rgba(21,194,182,0.5); margin-top: -22px;
}
.ui-nav .ask { gap: 3px; }
.ui-nav .ask .lb { color: #35D6C7; font-size: 11px; font-weight: 600; }

/* ================= HOME ================= */
.home-scroll { padding: 8px 20px 0; }
.home-searchrow { display: flex; gap: 10px; margin-top: 10px; }
.home-search {
  flex: 1; height: 50px; border-radius: 16px;
  background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; gap: 10px; padding: 0 16px;
  color: rgba(255,255,255,0.55); font-size: 15px; font-weight: 500;
}
.home-toggle {
  display: flex; align-items: center; border-radius: 16px; padding: 4px;
  background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.08);
  font-size: 13px; font-weight: 600;
}
.home-toggle .seg { display: flex; align-items: center; gap: 5px; padding: 7px 11px; border-radius: 12px; color: rgba(255,255,255,0.5); }
.home-toggle .seg.on { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; }

.home-bday { display: flex; align-items: center; gap: 14px; padding: 16px; margin-top: 16px; }
.home-bday .ic { width: 46px; height: 46px; border-radius: 13px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; flex: none; }
.home-bday .tx { flex: 1; }
.home-bday .tx b { font-size: 16px; font-weight: 700; }
.home-bday .tx p { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 3px; line-height: 1.3; }
.home-bday .greet { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-weight: 700; font-size: 14px; padding: 11px 20px; border-radius: 999px; flex: none; box-shadow: 0 8px 20px rgba(21,194,182,0.35); }

.mr-card { position: relative; overflow: hidden; padding: 24px 22px 22px; margin-top: 18px;
  background: linear-gradient(158deg, rgba(29,74,76,0.42) 0%, rgba(12,32,34,0.5) 60%);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 26px;
}
.mr-glow { position: absolute; right: -60px; top: -70px; width: 260px; height: 240px;
  background: radial-gradient(50% 50% at 50% 50%, rgba(21,194,182,0.28), transparent 70%); }
.mr-eyebrow { position: relative; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: #38CEC1; }
.mr-head { position: relative; font-size: 30px; font-weight: 800; line-height: 1.12; letter-spacing: -0.01em; margin-top: 12px; }
.mr-row { position: relative; display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.mr-mascot { width: 118px; flex: none; margin-left: -8px; margin-bottom: -6px; }
.mr-amount { font-size: 30px; font-weight: 800; line-height: 1.12; letter-spacing: -0.01em; }
.mr-sub { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.5); margin-top: 12px; line-height: 1.35; }

.share-card { padding: 22px; margin-top: 18px; }
.share-card h3 { font-size: 20px; font-weight: 700; }
.share-card .desc { display: flex; gap: 14px; margin-top: 12px; }
.share-card .lic { width: 46px; height: 46px; border-radius: 13px; background: linear-gradient(160deg, #1ED0C0, #12A093); display: flex; align-items: center; justify-content: center; flex: none; }
.share-card .desc p { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.4; }
.share-card .urlbox { margin-top: 16px; height: 50px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; padding: 0 18px; color: #35D6C7; font-size: 14.5px; font-weight: 600; }
.share-card .copy { margin-top: 14px; height: 52px; border-radius: 14px; background: linear-gradient(160deg, #1ED0C0, #11A497); color: #06272E; font-weight: 700; font-size: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 26px rgba(21,194,182,0.4); }

.home-qa { margin-top: 22px; display: flex; align-items: center; justify-content: space-between; }
.home-qa .lb { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); }
.home-qa .gear { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; }
.home-tiles { display: flex; gap: 12px; margin-top: 14px; }
.home-tiles .t { flex: 1; height: 96px; border-radius: 18px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; }
.home-tiles .t .ci { width: 40px; height: 40px; border-radius: 12px; background: rgba(21,194,182,0.12); display: flex; align-items: center; justify-content: center; }

/* ================= SCRIBE ================= */
.scribe-scroll { padding: 6px 20px 0; }
.scribe-hero { position: relative; overflow: hidden; margin-top: 10px; border-radius: 28px; padding: 26px 24px 24px; text-align: center;
  background: linear-gradient(157deg, #1EC6B7 0%, #14A99C 52%, #0C8078 100%);
  box-shadow: 0 24px 50px rgba(9,90,84,0.45); }
.scribe-hero .orb { width: 88px; height: 88px; border-radius: 50%; margin: 4px auto 0; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28); display: flex; align-items: center; justify-content: center; }
.scribe-hero .wave { display: flex; gap: 5px; align-items: center; justify-content: center; height: 26px; margin-top: 18px; }
.scribe-hero .wave i { width: 5px; border-radius: 3px; background: rgba(255,255,255,0.92); display: block; }
.scribe-hero h2 { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; margin-top: 16px; color: #fff; }
.scribe-hero p { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.9); margin-top: 10px; line-height: 1.4; padding: 0 6px; }
.scribe-hero .rec { display: inline-flex; align-items: center; gap: 9px; margin-top: 20px; background: #fff; color: #0C8078; font-weight: 700; font-size: 16px; padding: 14px 26px; border-radius: 999px; box-shadow: 0 12px 26px rgba(0,0,0,0.2); }

.scribe-tabs { display: flex; gap: 10px; margin-top: 22px; }
.scribe-tabs .tab { padding: 9px 20px; border-radius: 999px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.5); }
.scribe-tabs .tab.on { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; }

.note { padding: 18px 18px; margin-top: 14px; }
.note .nh { display: flex; align-items: center; justify-content: space-between; }
.note .nm { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-weight: 700; font-size: 13.5px; padding: 6px 13px; border-radius: 999px; }
.note .dur { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.45); }
.note .body { font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.82); line-height: 1.4; margin-top: 12px; }
.note .when { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 12px; }

/* ================= ASK PERLA ================= */
.ask-screen { position: relative; width: 430px; height: 932px; overflow: hidden; font-family: 'Figtree', sans-serif;
  background:
    radial-gradient(70% 45% at 50% 52%, rgba(63,52,120,0.55) 0%, rgba(63,52,120,0) 60%),
    radial-gradient(60% 40% at 78% 40%, rgba(41,120,120,0.4) 0%, transparent 60%),
    radial-gradient(120% 90% at 50% 0%, #0C2226 0%, #06131A 55%),
    #06111A; }
.ask-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px 0; }
.ask-top .cir { width: 46px; height: 46px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); display: flex; align-items: center; justify-content: center; color: #35D6C7; }
.ask-top .cir2 { display:flex; gap: 10px; }
.ask-top .pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: #35D6C7; font-weight: 700; font-size: 17px; }
.ask-center { position: absolute; top: 46%; left: 0; right: 0; transform: translateY(-50%); text-align: center; }
.ask-center .mas { width: 168px; margin: 0 auto; }
.ask-hello { font-size: 18px; font-weight: 500; color: rgba(255,255,255,0.55); margin-top: 22px; }
.ask-head { font-size: 40px; font-weight: 800; line-height: 1.12; letter-spacing: -0.01em; margin-top: 8px;
  background: linear-gradient(96deg, #38D9E6 0%, #5B8CF0 38%, #A66BE6 66%, #E36FC0 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent; }
.ask-chips { position: absolute; left: 20px; right: 20px; bottom: 118px; display: flex; gap: 12px; }
.ask-chips .c { flex: 1; padding: 18px 18px; border-radius: 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.82); line-height: 1.3; }
.ask-input { position: absolute; left: 18px; right: 18px; bottom: 40px; height: 60px; display: flex; align-items: center; gap: 12px; padding: 0 8px 0 18px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
.ask-input .ph { flex: 1; color: rgba(255,255,255,0.45); font-size: 16px; }
.ask-input .send { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(160deg, #1ED0C0, #12A093); display: flex; align-items: center; justify-content: center; }
`;

/* ---------------- icons ---------------- */
const I = {
  search: `<svg width="18" height="18" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" fill="none" stroke="#35D6C7" stroke-width="1.8"/><path d="M13.6 13.6 17.5 17.5" stroke="#35D6C7" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  sun: `<svg width="15" height="15" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4"/></g></svg>`,
  moon: `<svg width="15" height="15" viewBox="0 0 20 20"><path d="M16 12.3A7 7 0 0 1 7.7 4a7 7 0 1 0 8.3 8.3z" fill="currentColor"/></svg>`,
  cake: `<svg width="26" height="26" viewBox="0 0 28 28"><path d="M5 22h18v-7a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v7z" fill="none" stroke="#E7B36A" stroke-width="1.6"/><path d="M5 17c1.5 1.4 3 1.4 4.5 0S12.5 15.6 14 17s3 1.4 4.5 0S21.5 15.6 23 17" fill="none" stroke="#E7B36A" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 12V8" stroke="#E7B36A" stroke-width="1.6" stroke-linecap="round"/><circle cx="14" cy="6.4" r="1.4" fill="#F2C27E"/></svg>`,
  link: `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M9 15l6-6M8.5 12l-2 2a3 3 0 1 0 4.2 4.2l2-2M15.5 12l2-2a3 3 0 1 0-4.2-4.2l-2 2" fill="none" stroke="#06272E" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  gear: `<svg width="17" height="17" viewBox="0 0 22 22"><circle cx="11" cy="11" r="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.6"/><path d="M11 2v2.2M11 17.8V20M2 11h2.2M17.8 11H20M4.3 4.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 4.3l-1.6 1.6M5.9 16.1l-1.6 1.6" stroke="rgba(255,255,255,0.6)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  mic: (c = '#fff') => `<svg width="30" height="30" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="${c}"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  micSm: `<svg width="18" height="18" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="#0C8078"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3" fill="none" stroke="#0C8078" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bell: `<svg width="15" height="15" viewBox="0 0 20 20"><path d="M10 3a4 4 0 0 0-4 4c0 4-1.6 5-1.6 5h11.2S14 11 14 7a4 4 0 0 0-4-4zM8.4 16a1.7 1.7 0 0 0 3.2 0" fill="none" stroke="#EAF4F2" stroke-width="1.4"/><path d="M4 4l12 12" stroke="#EAF4F2" stroke-width="1.4"/></svg>`,
  navHome: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>`,
  navCal: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.7"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 9h16M8 3v4M16 3v4" stroke-linecap="round"/></svg>`,
  navPhone: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.7"><path d="M6 3.5c1 0 1.6.6 2 1.7l.7 2c.3.9.1 1.5-.6 2.1l-1 .8a11 11 0 0 0 4.5 4.5l.8-1c.6-.7 1.2-.9 2.1-.6l2 .7c1.1.4 1.7 1 1.7 2v2c0 1.3-1 2.3-2.4 2.1C10.6 21.3 2.7 13.4 2 6.4 1.8 5 2.8 4 4.1 4z"/></svg>`,
  navMore: (c) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="${c}"><circle cx="6" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="18" cy="12" r="1.9"/></svg>`,
  askStar: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 4l1.4 4.2L17.5 9l-3.5 2.4L15.4 16 12 13.3 8.6 16l1.4-4.6L6.5 9l4.1-.8z" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M18 4v3M16.5 5.5h3" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 3.5v13M3.5 10h13" stroke="#35D6C7" stroke-width="1.9" stroke-linecap="round"/></svg>`,
  people: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35D6C7" stroke-width="1.7"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6a3 3 0 0 1 0 6M17 19a5.5 5.5 0 0 0-2.5-4.6" stroke-linecap="round"/></svg>`,
  chat: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35D6C7" stroke-width="1.7"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2z"/></svg>`,
  back: `<svg width="18" height="18" viewBox="0 0 20 20"><path d="M12 4 6 10l6 6" fill="none" stroke="#35D6C7" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#35D6C7" stroke-width="1.6"/><path d="M10 6v4.2l2.6 1.6" fill="none" stroke="#35D6C7" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  pencil: `<svg width="18" height="18" viewBox="0 0 20 20"><path d="M13.5 3.5l3 3L7 16l-3.5.5L4 13z" fill="none" stroke="#35D6C7" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  send: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 12L20 4l-6 16-2.5-6.5z" fill="#06272E"/></svg>`,
  chevR: `<svg width="16" height="16" viewBox="0 0 20 20"><path d="M8 4l6 6-6 6" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevL: `<svg width="16" height="16" viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  plusW: `<svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 3.5v13M3.5 10h13" stroke="#06272E" stroke-width="2" stroke-linecap="round"/></svg>`,
  plusBig: `<svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  phoneSm: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.7"><path d="M6 3.5c1 0 1.6.6 2 1.7l.7 2c.3.9.1 1.5-.6 2.1l-1 .8a11 11 0 0 0 4.5 4.5l.8-1c.6-.7 1.2-.9 2.1-.6l2 .7c1.1.4 1.7 1 1.7 2v2c0 1.3-1 2.3-2.4 2.1C10.6 21.3 2.7 13.4 2 6.4 1.8 5 2.8 4 4.1 4z"/></svg>`,
  checkW: `<svg width="15" height="15" viewBox="0 0 16 16"><path d="M2.5 8.2 6 11.5 13.5 4" fill="none" stroke="#06272E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  swap: `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.7"><path d="M4 7h11l-2.5-2.5M16 13H5l2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function statusBar(time, { bell = false, low = false } = {}) {
  return `<div class="ui-status"><span style="display:flex;align-items:center;gap:7px">${time}${bell ? I.bell : ''}</span>
    <span class="r"><span class="bars"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span>
    <svg width="17" height="13" viewBox="0 0 17 13" fill="#EAF4F2"><path d="M8.5 2.2c2 0 3.9.8 5.3 2.1l1.2-1.2A9 9 0 0 0 2 3.1l1.2 1.2A7.4 7.4 0 0 1 8.5 2.2zM8.5 6c1 0 2 .4 2.7 1.1l1.2-1.2a5.6 5.6 0 0 0-7.8 0l1.2 1.2A3.8 3.8 0 0 1 8.5 6zm0 3.5 1.9 1.9-1.9 1.9-1.9-1.9z"/></svg>
    <span class="batt ${low ? 'low' : ''}"></span></span></div>`;
}

function navBar(active) {
  const c = (k) => (active === k ? '#35D6C7' : 'rgba(255,255,255,0.45)');
  return `<div class="ui-nav">
    <div class="it ${active === 'home' ? 'on' : ''}">${I.navHome(c('home'))}<span>Home</span></div>
    <div class="it ${active === 'visits' ? 'on' : ''}">${I.navCal(c('visits'))}<span>Visits</span></div>
    <div class="it ask"><div class="askbtn">${I.askStar}</div><span class="lb">Ask Perla</span></div>
    <div class="it ${active === 'calls' ? 'on' : ''}">${I.navPhone(c('calls'))}<span>Calls</span></div>
    <div class="it ${active === 'more' ? 'on' : ''}">${I.navMore(c('more'))}<span>More</span></div>
  </div>`;
}

function mascotSVG(size = 118) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mg" cx="40%" cy="30%" r="78%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#EFF4F3"/><stop offset="100%" stop-color="#D2DDDB"/>
      </radialGradient>
      <radialGradient id="mh" cx="34%" cy="24%" r="34%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <filter id="ms" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse cx="100" cy="180" rx="50" ry="11" fill="rgba(0,0,0,0.30)" filter="url(#ms)"/>
    <ellipse cx="82" cy="170" rx="15" ry="10" fill="#E0E8E6"/>
    <ellipse cx="118" cy="170" rx="15" ry="10" fill="#E0E8E6"/>
    <ellipse cx="41" cy="122" rx="12" ry="21" fill="#E6EDEB" transform="rotate(19 41 122)"/>
    <ellipse cx="159" cy="122" rx="12" ry="21" fill="#E6EDEB" transform="rotate(-19 159 122)"/>
    <path d="M100 26C143 26 168 58 168 101C168 144 139 170 100 170C61 170 32 144 32 101C32 58 57 26 100 26Z" fill="url(#mg)"/>
    <ellipse cx="100" cy="96" rx="66" ry="70" fill="url(#mh)"/>
    <ellipse cx="82" cy="104" rx="9" ry="13.5" fill="#0B1416"/>
    <ellipse cx="118" cy="104" rx="9" ry="13.5" fill="#0B1416"/>
    <circle cx="85" cy="99" r="2.7" fill="#fff"/><circle cx="121" cy="99" r="2.7" fill="#fff"/>
    <path d="M89 122 Q100 131 111 122" fill="none" stroke="#0B1416" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

function scribeWave() {
  const hs = [8, 14, 20, 26, 18, 10, 16, 22, 12];
  return hs.map((h) => `<i style="height:${h}px"></i>`).join('');
}

/* ================= HOME ================= */
function masterHome() {
  return `<div class="uiscreen">
    ${statusBar('3:25', { low: true })}
    <div class="home-scroll">
      <div class="home-searchrow">
        <div class="home-search">${I.search}<span>Search anything…</span></div>
        <div class="home-toggle">
          <div class="seg">${I.sun}Light</div>
          <div class="seg on">${I.moon}Dark</div>
        </div>
      </div>

      <div class="ui-card home-bday">
        <div class="ic">${I.cake}</div>
        <div class="tx"><b>Birthdays this month</b><p>4 patients celebrating — greet them, they'll remember</p></div>
        <div class="greet">Greet</div>
      </div>

      <div class="mr-card">
        <div class="mr-glow"></div>
        <div class="mr-eyebrow">PERLA · MORNING REPORT</div>
        <div class="mr-head">Good afternoon, <span class="teal">Dr. Santos.</span></div>
        <div class="mr-row">
          <div class="mr-mascot">${mascotSVG(118)}</div>
          <div>
            <div class="mr-amount"><span class="pesoG">P</span>88,497 is waiting to be collected.</div>
            <div class="mr-sub">Perla answered 38 calls · 21 booked automatically.</div>
          </div>
        </div>
      </div>

      <div class="ui-card share-card">
        <h3>Share your booking link</h3>
        <div class="desc">
          <div class="lic">${I.link}</div>
          <p>Patients tap this to talk to Perla &amp; book — post it on Facebook, Viber, or your clinic page.</p>
        </div>
        <div class="urlbox">https://jericko-smile-design-2.perla-ai.app</div>
        <div class="copy">Copy</div>
      </div>

      <div class="home-qa">
        <span class="lb">QUICK ACTIONS</span>
        <span class="gear">${I.gear}</span>
      </div>
      <div class="home-tiles">
        <div class="t"><span class="ci">${I.plus}</span>New booking</div>
        <div class="t"><span class="ci">${I.people}</span>Patients</div>
        <div class="t"><span class="ci">${I.chat}</span>Messages</div>
      </div>
    </div>
    ${navBar('home')}
  </div>`;
}

/* ================= SCRIBE ================= */
const NOTES = [
  { nm: 'Jose Ramirez', dur: '0:19', body: 'Chief complaint: Patient presented for a root canal procedure. Findings: The procedure was complicated due t…', when: 'Jul 6 · 5:41 PM' },
  { nm: 'Camille Villanueva', dur: '1:35', body: 'Chief complaint: lingering pain on tooth 36 after deep caries removal. Findings: pulpal involvement confirmed…', when: 'Jul 6 · 7:43 AM' },
  { nm: 'Miguel Dela Cruz', dur: '1:00', body: 'Braces adjustment #2. Good hygiene, minimal plaque. Replaced upper archwire, elastics changed to 3/16 medium….', when: 'Jul 6 · 7:43 AM' },
  { nm: 'Daniel Ocampo', dur: '0:48', body: 'Two-surface composite on 46, shade A2. Isolation good, no complications. Advised to avoid hard food for 24 hou…', when: 'Jul 6 · 6:12 AM' },
];

function masterScribe() {
  const notes = NOTES.map((n) => `<div class="ui-card note">
    <div class="nh"><span class="nm">${n.nm}</span><span class="dur">${n.dur}</span></div>
    <div class="body">${n.body}</div>
    <div class="when">${n.when}</div>
  </div>`).join('');
  return `<div class="uiscreen">
    ${statusBar('11:30', { bell: true })}
    <div class="scribe-scroll">
      <div class="scribe-hero">
        <div class="orb">${I.mic('#fff')}</div>
        <div class="wave">${scribeWave()}</div>
        <h2>Perla Scribe</h2>
        <p>Just talk — English, Tagalog, or both. Perla writes the clinical note for you.</p>
        <div class="rec">${I.micSm}Record a note</div>
      </div>
      <div class="scribe-tabs">
        <div class="tab on">All</div><div class="tab">General</div><div class="tab">Patient</div>
      </div>
      ${notes}
    </div>
    ${navBar('more')}
  </div>`;
}

/* ================= ASK PERLA ================= */
function masterAsk() {
  return `<div class="ask-screen">
    ${statusBar('10:42', { bell: true })}
    <div class="ask-top">
      <div class="cir">${I.back}</div>
      <div class="pill">Perla ${I.askStar.replace('#fff', '#35D6C7')}</div>
      <div class="cir2"><div class="cir">${I.clock}</div><div class="cir">${I.pencil}</div></div>
    </div>
    <div class="ask-center">
      <div class="mas">${mascotSVG(168)}</div>
      <div class="ask-hello">Hello, JerickoSmile</div>
      <div class="ask-head">How can I help<br>you today?</div>
    </div>
    <div class="ask-chips">
      <div class="c">How was production this week?</div>
      <div class="c">Who has unpaid balances?</div>
    </div>
    <div class="ask-input"><span class="ph">Ask Perla anything…</span><span class="send">${I.send}</span></div>
  </div>`;
}

/* ================= VISITS (calendar) & ANALYTICS ================= */
const peso = () => '<span class="pesoG">P</span>';

const CSS_EXTRA = `
/* ---- Visits / calendar ---- */
.vis-scroll { padding: 0 16px; }
.cal-card { padding: 20px 20px 22px; margin-top: 10px; }
.cal-head { display: flex; align-items: flex-start; justify-content: space-between; }
.cal-head .mo { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; line-height: 1; }
.cal-head .yr { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 8px; display: flex; align-items: center; gap: 10px; }
.cal-seg { display: flex; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 4px; }
.cal-seg .s { padding: 8px 18px; border-radius: 999px; font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.5); }
.cal-seg .s.on { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; }
.cal-ctrls { display: flex; align-items: center; gap: 8px; }
.cal-today { padding: 9px 16px; border-radius: 999px; border: 1px solid #1B8E86; color: #35D6C7; font-size: 13px; font-weight: 700; }
.cal-nav { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.65); }
.cal-grid { margin-top: 16px; }
.cal-wk { display: grid; grid-template-columns: repeat(7,1fr); margin-bottom: 4px; }
.cal-wk span { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; color: rgba(255,255,255,0.35); }
.cal-row { display: grid; grid-template-columns: repeat(7,1fr); }
.cal-cell { height: 66px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 4px; }
.cal-day { width: 44px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 13px; font-size: 19px; font-weight: 600; color: #EAF4F2; }
.cal-day.dim { color: rgba(255,255,255,0.22); }
.cal-day.today { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-weight: 800; box-shadow: 0 8px 22px rgba(21,194,182,0.5); }
.cal-day.sel { border: 1.5px solid #2BB6AA; color: #35D6C7; }
.cal-dots { display: flex; gap: 3px; margin-top: 3px; height: 8px; }
.cd { width: 6px; height: 6px; border-radius: 50%; display: block; }
.cd.o { background: transparent; border: 1.5px solid rgba(255,255,255,0.45); width: 5px; height: 5px; }
.cal-badge { margin-top: 3px; min-width: 20px; height: 20px; border-radius: 999px; background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; padding: 0 5px; }
.cal-legend { border-top: 1px solid rgba(255,255,255,0.07); margin-top: 12px; padding-top: 18px; display: flex; flex-wrap: wrap; gap: 12px 22px; }
.cal-legend .lg { display: flex; align-items: center; gap: 8px; font-size: 15px; color: rgba(255,255,255,0.7); }
.cal-legend .lg .d { width: 11px; height: 11px; border-radius: 50%; }
.cal-legend .lg .d.o { background: transparent; border: 1.6px solid rgba(255,255,255,0.5); }

.day-head { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
.day-head .t b { font-size: 25px; font-weight: 800; letter-spacing: -0.01em; }
.day-head .t p { font-size: 15px; color: rgba(255,255,255,0.5); margin-top: 4px; }
.day-head .nb { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-weight: 700; font-size: 15px; padding: 12px 20px; border-radius: 999px; box-shadow: 0 10px 24px rgba(21,194,182,0.4); }
.appt { position: relative; margin-top: 18px; padding: 20px 20px 20px 26px; overflow: hidden; }
.appt .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: #E85A9C; }
.appt .r1 { display: flex; align-items: center; gap: 12px; }
.appt .tm { font-size: 16px; font-weight: 700; color: #35D6C7; }
.appt .nm { font-size: 21px; font-weight: 800; letter-spacing: -0.01em; }
.appt .stat { padding: 6px 13px; border-radius: 999px; border: 1px solid #1B8E86; color: #35D6C7; font-size: 13px; font-weight: 700; }
.appt .proc { font-size: 16px; color: rgba(255,255,255,0.55); margin-top: 10px; }
.appt .doc { display: flex; align-items: center; gap: 9px; margin-top: 12px; font-size: 15px; color: rgba(255,255,255,0.6); }
.appt .doc .pd { width: 9px; height: 9px; border-radius: 50%; background: #E85A9C; }
.appt .doc .av { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.appt .ph { display: flex; align-items: center; gap: 9px; margin-top: 10px; font-size: 15px; color: rgba(255,255,255,0.55); }
.appt .btns { display: flex; gap: 12px; margin-top: 18px; }
.appt .bt { display: inline-flex; align-items: center; gap: 7px; padding: 12px 18px; border-radius: 999px; font-size: 15px; font-weight: 700; border: 1px solid rgba(255,255,255,0.14); color: rgba(255,255,255,0.8); }
.appt .bt.done { background: linear-gradient(160deg, #1ED0C0, #12A093); color: #06272E; border-color: transparent; box-shadow: 0 8px 20px rgba(21,194,182,0.4); }
.appt .cancel { margin-top: 12px; display: inline-flex; align-items: center; padding: 12px 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); color: rgba(255,255,255,0.75); font-size: 15px; font-weight: 700; }

/* ---- Analytics ---- */
.an-scroll { padding: 0 18px; }
.an-card { padding: 22px 22px; margin-top: 16px; }
.an-card h3 { font-size: 23px; font-weight: 800; letter-spacing: -0.01em; margin-bottom: 6px; }
.an-row { display: flex; align-items: center; gap: 14px; height: 44px; }
.an-lb { width: 132px; flex: none; font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.82); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.an-bar { flex: 1; height: 15px; }
.an-bar i { display: block; height: 15px; border-radius: 999px; background: linear-gradient(90deg, #0FA79B, #2FE0CE); box-shadow: 0 0 16px rgba(21,194,182,0.35); }
.an-val { width: 108px; flex: none; text-align: right; font-size: 17px; font-weight: 800; color: #EAF4F2; }
.an-fab { position: absolute; right: 22px; bottom: 104px; width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(160deg, #1ED0C0, #12A093); display: flex; align-items: center; justify-content: center; box-shadow: 0 14px 30px rgba(21,194,182,0.5); }
.an-ghost { font-size: 22px; font-weight: 800; color: rgba(255,255,255,0.14); margin: 20px 4px 0; }
`;

/* ---- Visits screen ---- */
const T = '#15C2B6', PK = '#E85A9C', BL = '#4A7BE0', AM = '#E0A54A';
const CAL_ROWS = [
  [{ n: 28, dim: 1 }, { n: 29, dim: 1 }, { n: 30, dim: 1 }, { n: 1, dots: [T, PK] }, { n: 2, dots: [T, PK, BL] }, { n: 3, badge: 4 }, { n: 4, badge: 5 }],
  [{ n: 5, dots: [PK, T, T] }, { n: 6, dots: [PK] }, { n: 7, dots: ['o', T, PK] }, { n: 8, dots: [T, PK] }, { n: 9, today: 1, dots: [T, PK] }, { n: 10, dots: [BL] }, { n: 11 }],
  [{ n: 12 }, { n: 13, dots: [PK] }, { n: 14, badge: 7 }, { n: 15, sel: 1 }, { n: 16 }, { n: 17 }, { n: 18 }],
  [{ n: 19 }, { n: 20 }, { n: 21 }, { n: 22 }, { n: 23 }, { n: 24 }, { n: 25 }],
  [{ n: 26 }, { n: 27 }, { n: 28 }, { n: 29 }, { n: 30 }, { n: 31 }, { n: 1, dim: 1 }],
];
function calCell(c) {
  let inner;
  if (c.badge != null) {
    inner = `<div class="cal-day">${c.n}</div><div class="cal-badge">${c.badge}</div>`;
  } else {
    const cls = ['cal-day', c.dim ? 'dim' : '', c.today ? 'today' : '', c.sel ? 'sel' : ''].join(' ');
    const dots = (c.dots || []).map((d) => (d === 'o' ? '<span class="cd o"></span>' : `<span class="cd" style="background:${d}"></span>`)).join('');
    inner = `<div class="${cls}">${c.n}</div><div class="cal-dots">${dots}</div>`;
  }
  return `<div class="cal-cell">${inner}</div>`;
}
function masterVisits() {
  const grid = CAL_ROWS.map((r) => `<div class="cal-row">${r.map(calCell).join('')}</div>`).join('');
  return `<div class="uiscreen">
    ${statusBar('11:31', { bell: true })}
    <div class="vis-scroll">
      <div class="ui-card cal-card">
        <div class="cal-head">
          <div><div class="mo">July</div><div class="yr">2026 <span class="cal-nav">${I.chevR}</span></div></div>
          <div class="cal-seg"><div class="s on">Month</div><div class="s">Week</div></div>
          <div class="cal-ctrls"><div class="cal-today">Today</div><div class="cal-nav">${I.chevL}</div></div>
        </div>
        <div class="cal-grid">
          <div class="cal-wk"><span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span></div>
          ${grid}
        </div>
        <div class="cal-legend">
          <div class="lg"><span class="d" style="background:${T}"></span>Dr cj</div>
          <div class="lg"><span class="d" style="background:${AM}"></span>dr jocko</div>
          <div class="lg"><span class="d" style="background:${BL}"></span>Dr. Prada</div>
          <div class="lg"><span class="d" style="background:${PK}"></span>Dr. Hachi</div>
          <div class="lg"><span class="d" style="background:#9BB84A"></span>Test</div>
          <div class="lg"><span class="d o"></span>Unassigned</div>
        </div>
      </div>

      <div class="day-head">
        <div class="t"><b>Thursday, July 9</b><p>2 appointments</p></div>
        <div class="nb">${I.plusW}New booking</div>
      </div>
      <div class="ui-card appt">
        <div class="bar"></div>
        <div class="r1"><span class="tm">12:00 PM</span><span class="nm">Joshua Lim</span><span class="stat">Confirmed</span></div>
        <div class="proc">Composite Filling</div>
        <div class="doc"><span class="pd"></span><span class="av">H</span>Dr. Hachi</div>
        <div class="ph">${I.phoneSm}09171371370</div>
        <div class="btns"><span class="bt done">${I.checkW} Done</span><span class="bt">${I.swap} Reschedule</span><span class="bt">No-show</span></div>
        <div class="cancel">Cancel</div>
      </div>
    </div>
    ${navBar('visits')}
  </div>`;
}

/* ---- Analytics screen ---- */
function anCard(title, rows, max) {
  const body = rows.map((r) => `<div class="an-row"><div class="an-lb">${r[0]}</div><div class="an-bar"><i style="width:${Math.round((r[1] / max) * 100)}%"></i></div><div class="an-val">${peso()}${r[2]}</div></div>`).join('');
  return `<div class="ui-card an-card"><h3>${title}</h3>${body}</div>`;
}
function masterAnalytics() {
  const service = anCard('Revenue by service', [
    ['Teeth Whiteni…', 162000, '162,000'],
    ['Root Canal Th…', 160880, '160,880'],
    ['Tooth Extraction', 32760, '32,760'],
    ['Braces Adjust…', 32350, '32,350'],
    ['Composite Fill…', 20850, '20,850'],
    ['Teeth Cleaning', 18000, '18,000'],
  ], 200000);
  const dentist = anCard('Revenue by dentist', [
    ['Dr. Prada', 592540, '592,540'],
    ['Dr. Hachi', 315680, '315,680'],
  ], 640000);
  const patients = anCard('Top patients', [
    ['Michelle Nava…', 87530, '87,530'],
    ['Andrea Santos', 76600, '76,600'],
    ['Isabella Garcia', 69350, '69,350'],
    ['Adrian Sy', 55130, '55,130'],
    ['Samantha Cruz', 53030, '53,030'],
    ['Katrina Lopez', 47800, '47,800'],
  ], 92000);
  const payment = anCard('By payment status', [
    ['Paid', 790780, '790,780'],
    ['Partial', 57300, '57,300'],
    ['Unpaid', 59490, '59,490'],
  ], 830000);
  return `<div class="uiscreen">
    ${statusBar('3:28', { low: true })}
    <div class="an-scroll" style="transform: translateY(-118px)">
      ${service}
      ${dentist}
      ${patients}
      ${payment}
      <div class="an-ghost">Per-dentist performance</div>
    </div>
    <div class="an-fab">${I.plusBig}</div>
    ${navBar('more')}
  </div>`;
}

module.exports = { CSS_UI: CSS_UI + CSS_EXTRA, masterHome, masterScribe, masterAsk, masterVisits, masterAnalytics, mascotSVG };
