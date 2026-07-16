// Perla.ai motion ad #2 — "Your clinic's AI teammate" (~24s, 9:16, 60fps).
// Reference language: neon-on-black, glowing chat cards, kinetic typography.
// Flow: cold-open hook → clinic team group chat with /perla (revenue answer,
// teal) → /perla teammate advice (violet) → "connected to your whole clinic"
// data tiles → kinetic hook → wordmark + tagline. Deterministic window.seek(t).
'use strict';

const FONTS = 'file:///home/user/tolltrack-ph/perla-carousel/fonts';
const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);
const spark = (c, w = 24) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.5"><path d="M12 2.4l2.3 6.9L21 11l-6.7 1.9L12 21l-2.3-7L3 11l6.7-1.7z" stroke-linejoin="round"/><path d="M19.5 3v3M18 4.5h3" stroke-linecap="round"/></svg>`;
const iPeople = c => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6a3 3 0 0 1 0 6M17 19a5.5 5.5 0 0 0-2.5-4.6" stroke-linecap="round"/></svg>`;
const iCal = c => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 9h16M8 3v4M16 3v4" stroke-linecap="round"/></svg>`;
const iPay = c => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18" stroke-linecap="round"/></svg>`;
const iNote = c => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5" stroke-linecap="round"/></svg>`;
const iPhone = c => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><path d="M6 3.5c1 0 1.6.6 2 1.7l.7 2c.3.9.1 1.5-.6 2.1l-1 .8a11 11 0 0 0 4.5 4.5l.8-1c.6-.7 1.2-.9 2.1-.6l2 .7c1.1.4 1.7 1 1.7 2v2c0 1.3-1 2.3-2.4 2.1C10.6 21.3 2.7 13.4 2 6.4 1.8 5 2.8 4 4.1 4z"/></svg>`;

function buildHTML() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Figtree';font-weight:300 900;src:url('${FONTS}/figtree-latin.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#000;font-family:'Figtree',sans-serif;overflow:hidden}
.bgbloom{position:absolute;inset:0}
#particles{position:absolute;inset:0;pointer-events:none}
#particles i{position:absolute;width:6px;height:6px;border-radius:50%;opacity:0}
.scene{position:absolute;inset:0;opacity:0;will-change:opacity,transform}
.pk{position:relative;margin-right:0.06em}
.pk::after{content:"";position:absolute;left:-0.1em;right:-0.05em;top:0.26em;border-top:0.075em solid currentColor;box-shadow:0 0.17em 0 currentColor}
.eyebrow{position:absolute;top:300px;left:0;right:0;text-align:center;font-size:29px;font-weight:700;letter-spacing:0.32em;text-shadow:0 0 22px rgba(53,214,199,0.7)}

/* cold open */
.co{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center}
.co .mark{margin:0 auto 46px;width:130px;height:130px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 0 26px rgba(53,214,199,0.9));will-change:transform,opacity}
/* kinetic type: .kw masks the rise (overflow toggled to visible once settled
   so the glow spills as a soft halo, never a clipped box) */
.krow{overflow:visible;display:block}.kw{display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 10px}
.kwi{display:inline-block;transform:translateY(115%);will-change:transform}
.co{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center}
.co .r1{font-size:74px;font-weight:800;letter-spacing:-0.02em;color:#eafffb;line-height:1.05}
.r2wrap{position:relative;display:inline-block;margin-top:8px}
.copad{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);width:130%;height:260%;background:radial-gradient(50% 50% at 50% 50%,rgba(21,194,182,0.32),transparent 68%);filter:blur(34px);opacity:0;pointer-events:none}
.co .r2{position:relative;font-size:130px;font-weight:900;letter-spacing:-0.03em;line-height:1.0}
.co .r2 .kwi{color:#35D6C7;text-shadow:0 0 34px rgba(53,214,199,0.55)}

/* chat card */
.chatwrap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:788px}
.chatcard{border-radius:44px;border:1.5px solid rgba(53,214,199,0.4);background:linear-gradient(168deg, rgba(12,40,42,0.72), rgba(6,16,18,0.62));padding:34px 34px 30px;will-change:box-shadow}
.chatcard.vi{border-color:rgba(166,107,230,0.45)}
.chdr{display:flex;align-items:center;gap:16px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,0.08);will-change:opacity,transform}
.avstack{display:flex}
.avstack .av{width:52px;height:52px;border-radius:50%;margin-left:-14px;border:2px solid #0a1a1c;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#04201d}
.avstack .av:first-child{margin-left:0}
.av.h{background:linear-gradient(160deg,#F2789F,#d64f7e)}
.av.p{background:linear-gradient(160deg,#4A7BE0,#2f57b0)}
.av.f{background:linear-gradient(160deg,#E0A54A,#c9862a)}
.av.pe{background:linear-gradient(160deg,#1ED0C0,#12A093);color:#04201d}
.chdr .tt{flex:1}.chdr .tt b{font-size:29px;font-weight:800;color:#eafffb}.chdr .tt p{font-size:20px;color:rgba(255,255,255,0.45);margin-top:3px}
.chdr .live{display:flex;align-items:center;gap:9px;font-size:19px;color:#35D6C7;font-weight:700}.chdr .live .d{width:11px;height:11px;border-radius:50%;background:#35D6C7;box-shadow:0 0 12px #35D6C7}

.msgs{padding-top:26px;display:flex;flex-direction:column;gap:22px}
.mrow{display:flex;gap:16px;align-items:flex-end;opacity:0;will-change:opacity,transform}
.mrow.right{flex-direction:row-reverse}
.mrow .mav{width:52px;height:52px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
.mrow .mav.pe{background:radial-gradient(circle at 40% 35%,rgba(30,208,192,0.5),rgba(6,40,40,0.6));border:1.5px solid rgba(53,214,199,0.7)}
.mrow .mav.pv{background:radial-gradient(circle at 40% 35%,rgba(166,107,230,0.5),rgba(24,10,44,0.6));border:1.5px solid rgba(166,107,230,0.7)}
.mrow .mav.h{background:linear-gradient(160deg,#F2789F,#d64f7e);color:#fff}
.mrow .mav.p{background:linear-gradient(160deg,#4A7BE0,#2f57b0);color:#fff}
.bub{max-width:560px;border-radius:28px;padding:20px 26px;font-size:29px;font-weight:500;line-height:1.34}
.bub .nm{font-size:20px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:6px}
.bub.staff{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:#eafffb;border-bottom-left-radius:8px}
.cbub{max-width:600px;border-radius:28px;padding:20px 26px;font-size:29px;font-weight:600;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.16);color:#eafffb;border-bottom-right-radius:8px}
.cbub .slash{display:inline-block;background:rgba(53,214,199,0.18);border:1px solid rgba(53,214,199,0.5);color:#5CF2E3;border-radius:10px;padding:2px 12px;font-weight:800;margin-right:8px;text-shadow:0 0 12px rgba(53,214,199,0.6)}
.cur{display:inline-block;width:2px;height:30px;background:#5CF2E3;margin-left:2px;box-shadow:0 0 10px #5CF2E3;vertical-align:middle}
.pbub{max-width:580px;border-radius:28px;padding:20px 26px;font-size:29px;font-weight:500;line-height:1.34;border-bottom-left-radius:8px}
.pbub.teal{background:linear-gradient(150deg,rgba(24,224,206,0.22),rgba(15,167,155,0.14));border:1.5px solid rgba(53,214,199,0.6);color:#eafffb;box-shadow:0 0 60px rgba(24,224,206,0.35)}
.pbub.teal b{color:#5CF2E3;text-shadow:0 0 16px rgba(53,214,199,0.6)}
.pbub.violet{background:linear-gradient(150deg,rgba(166,107,230,0.24),rgba(120,70,200,0.14));border:1.5px solid rgba(166,107,230,0.6);color:#F1E9FC;box-shadow:0 0 60px rgba(139,92,246,0.4)}
.pbub.violet b{color:#C9A6F7;text-shadow:0 0 16px rgba(166,107,230,0.6)}
.typing{display:inline-flex;gap:9px;align-items:center;padding:26px 30px}
.typing i{width:14px;height:14px;border-radius:50%;background:#5CF2E3;box-shadow:0 0 10px #5CF2E3}
.typing.vi i{background:#C9A6F7;box-shadow:0 0 10px #C9A6F7}

/* data grid */
.rings{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:1200px;height:1200px}
.rings b{position:absolute;left:50%;top:50%;border-radius:80px;border:1.5px solid rgba(21,194,182,0.2);box-shadow:0 0 50px rgba(21,194,182,0.07);will-change:transform,opacity}
.grid{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center}
.grid .gh{font-size:60px;font-weight:900;letter-spacing:-0.02em;color:#eafffb;margin-bottom:14px}
.grid .gh b{color:#35D6C7;text-shadow:0 0 30px rgba(53,214,199,0.7)}
.grid .gsub{font-size:30px;color:rgba(255,255,255,0.5);margin-bottom:54px}
.tiles{display:flex;flex-wrap:wrap;gap:26px;justify-content:center;max-width:820px;margin:0 auto}
.tile{width:236px;height:180px;border-radius:28px;border:1.5px solid rgba(53,214,199,0.35);background:linear-gradient(160deg,rgba(14,42,44,0.6),rgba(6,18,20,0.5));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#eafffb;font-size:26px;font-weight:700;opacity:0;will-change:transform,opacity,box-shadow}
.tile .ti{color:#5CF2E3}

/* hook — flex column so the subline always sits clear of the headline */
.hookbox{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hookpad{position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);width:840px;height:560px;background:radial-gradient(50% 50% at 50% 50%,rgba(21,194,182,0.24),transparent 68%);filter:blur(46px);opacity:0;pointer-events:none}
.hookbox .r2{position:relative;font-size:134px;font-weight:900;letter-spacing:-0.03em;line-height:1.06}
.hookbox .r2 .kwi{color:#35D6C7;text-shadow:0 0 36px rgba(53,214,199,0.55)}
.hooksub{position:relative;margin-top:54px;text-align:center;font-size:34px;font-weight:600;letter-spacing:0.02em;color:rgba(255,255,255,0.55);opacity:0}
.hooksweep{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:340px;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,0.14) 50%,transparent 58%);opacity:0}

/* outro */
.logo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
.logo .beamline{position:absolute;left:50%;top:calc(50% - 40px);transform:translate(-50%,-50%) scaleX(0);width:1100px;height:6px;background:linear-gradient(90deg,transparent,#5CF2E3,transparent);filter:blur(1px);box-shadow:0 0 40px #16E0CE}
.logo .wm{font-size:140px;font-weight:900;letter-spacing:-0.03em;color:#fff;text-shadow:0 0 50px rgba(53,214,199,0.7)}
.logo .wm b{color:#35D6C7}
.logo .tag{font-size:42px;font-weight:700;color:#eafffb;opacity:0}
.logo .url{font-size:32px;font-weight:600;color:rgba(255,255,255,0.6);opacity:0;margin-top:2px}

.grain{position:absolute;inset:-20px;z-index:80;pointer-events:none;background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.05;mix-blend-mode:overlay}
.vig{position:absolute;inset:0;z-index:79;pointer-events:none;background:radial-gradient(120% 100% at 50% 44%, transparent 52%, rgba(0,0,0,0.6) 100%)}
</style></head>
<body>
<div id="stage">
  <div class="bgbloom" id="bgbloom"></div>
  <div id="particles"></div>

  <!-- COLD OPEN -->
  <div class="scene" id="sceneCO">
    <div class="co">
      <div class="mark" id="coMark">${spark('#5CF2E3', 130)}</div>
      <div class="krow r1"><span class="kw"><span class="kwi">Meet your</span></span><span class="kw"><span class="kwi">clinic's</span></span></div>
      <div class="r2wrap"><div class="copad" id="coPad"></div><div class="krow r2"><span class="kw"><span class="kwi">AI teammate.</span></span></div></div>
    </div>
  </div>

  <!-- CHAT A (revenue, teal) -->
  <div class="scene" id="sceneCA">
    <div class="chatwrap"><div class="chatcard" id="caCard">
      <div class="chdr" id="caHdr">
        <div class="avstack"><div class="av h">H</div><div class="av p">P</div><div class="av f">F</div><div class="av pe">${spark('#04201d', 26)}</div></div>
        <div class="tt"><b>JerickoSmile</b><p>Clinic Team · 4 members</p></div>
        <div class="live"><span class="d"></span>Perla</div>
      </div>
      <div class="msgs">
        <div class="mrow left" id="caStaff"><div class="mav h">H</div><div class="bub staff"><div class="nm">Dr. Hachi</div>Feels like a slow week.</div></div>
        <div class="mrow right" id="caCmd"><div class="cbub"><span class="slash">/perla</span><span id="qA"></span><span class="cur" id="curA"></span></div></div>
        <div class="mrow left" id="caType"><div class="mav pe">${spark('#5CF2E3', 24)}</div><div class="pbub teal typing"><i></i><i></i><i></i></div></div>
        <div class="mrow left" id="caReply"><div class="mav pe">${spark('#5CF2E3', 24)}</div><div class="pbub teal">Root canals earned the most — <b><span class="pk">P</span>160,880</b> this month. Up <b>12%</b> vs last.</div></div>
      </div>
    </div></div>
  </div>

  <!-- CHAT B (advice, violet) -->
  <div class="scene" id="sceneCB">
    <div class="chatwrap"><div class="chatcard vi" id="cbCard">
      <div class="chdr" id="cbHdr">
        <div class="avstack"><div class="av h">H</div><div class="av p">P</div><div class="av f">F</div><div class="av pe">${spark('#04201d', 26)}</div></div>
        <div class="tt"><b>JerickoSmile</b><p>Clinic Team · 4 members</p></div>
        <div class="live" style="color:#C9A6F7"><span class="d" style="background:#C9A6F7;box-shadow:0 0 12px #C9A6F7"></span>Perla</div>
      </div>
      <div class="msgs">
        <div class="mrow left" id="cbStaff"><div class="mav p">P</div><div class="bub staff"><div class="nm">Dr. Prada</div>And the no-shows? Losing slots every week.</div></div>
        <div class="mrow right" id="cbCmd"><div class="cbub"><span class="slash" style="background:rgba(166,107,230,0.18);border-color:rgba(166,107,230,0.5);color:#C9A6F7;text-shadow:0 0 12px rgba(166,107,230,0.6)">/perla</span><span id="qB"></span><span class="cur" id="curB" style="background:#C9A6F7;box-shadow:0 0 10px #C9A6F7"></span></div></div>
        <div class="mrow left" id="cbType"><div class="mav pv">${spark('#C9A6F7', 24)}</div><div class="pbub violet typing vi"><i></i><i></i><i></i></div></div>
        <div class="mrow left" id="cbReply"><div class="mav pv">${spark('#C9A6F7', 24)}</div><div class="pbub violet">Turn on 24-hour reminders — clinics like yours cut no-shows by <b>~30%</b>. Want me to set it up?</div></div>
      </div>
    </div></div>
  </div>

  <!-- DATA GRID -->
  <div class="scene" id="sceneGrid">
    <div class="rings" id="gRings"></div>
    <div class="grid">
      <div class="gh">Connected to your <b>whole clinic</b></div>
      <div class="gsub">she already knows everything</div>
      <div class="tiles">
        <div class="tile" data-i="0"><span class="ti">${iPeople('#5CF2E3')}</span>Patients</div>
        <div class="tile" data-i="1"><span class="ti">${iCal('#5CF2E3')}</span>Calendar</div>
        <div class="tile" data-i="2"><span class="ti">${iPay('#5CF2E3')}</span>Payments</div>
        <div class="tile" data-i="3"><span class="ti">${iNote('#5CF2E3')}</span>Notes</div>
        <div class="tile" data-i="4"><span class="ti">${iPhone('#5CF2E3')}</span>Calls</div>
      </div>
    </div>
  </div>

  <!-- HOOK -->
  <div class="scene" id="sceneHook">
    <div class="hookbox">
      <div class="hookpad" id="hookPad"></div>
      <div class="krow r2"><span class="kw"><span class="kwi">Ask her</span></span></div>
      <div class="krow r2"><span class="kw"><span class="kwi">anything.</span></span></div>
      <div class="hooksub" id="hookSub">part of the team · on call 24/7</div>
    </div>
    <div class="hooksweep" id="hookSweep"></div>
  </div>

  <!-- OUTRO -->
  <div class="scene" id="sceneLogo">
    <div class="logo">
      <div class="beamline" id="logoBeam"></div>
      <div class="wm" id="logoWm">Perla<b>.ai</b></div>
      <div class="tag" id="logoTag">Your clinic's AI teammate.</div>
      <div class="url" id="logoUrl">meetperla-ai.com</div>
    </div>
  </div>

  <div class="vig"></div><div class="grain"></div>
</div>

<script>
const S=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,t0,t1)=>clamp((t-t0)/(t1-t0));
const eOut=x=>1-Math.pow(1-x,3);
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
const pulse=(t,sp)=>0.5+0.5*Math.sin(t*sp);
function vis(t,w,fi=0.3,fo=0.24){return clamp(seg(t,w[0],w[0]+fi))-clamp(seg(t,w[1]-fo,w[1]));}
function typed(el,cur,full,p,t){el.textContent=full.slice(0,Math.floor(clamp(p)*full.length));cur.style.opacity=(p>0.001&&p<0.999)?(Math.sin(t*16)>0?1:0.25):0;}

(function(){const P=S('particles');for(let i=0;i<16;i++){const b=document.createElement('i');b.dataset.i=i;P.appendChild(b);}})();
function mkRings(h){for(let i=0;i<5;i++){const b=document.createElement('b');b.dataset.i=i;const sz=300+i*230;b.style.width=sz+'px';b.style.height=sz+'px';b.style.marginLeft=(-sz/2)+'px';b.style.marginTop=(-sz/2)+'px';h.appendChild(b);}}
mkRings(S('gRings'));

let t=0;
// smoother enter: fade + gentle rise + slight scale settle; subtle exit lift
function sceneFx(id,w){const o=vis(t,w);const el=S(id);el.style.opacity=o;
  const ip=eOut(clamp(seg(t,w[0],w[0]+0.6)));const ex=clamp(seg(t,w[1]-0.24,w[1]));
  el.style.transform='translateY('+(lerp(26,0,ip)+ex*-14)+'px) scale('+(lerp(1.05,1,ip)+ex*0.02)+')';return o;}
function fr(id,a,b,l,dy){const el=S(id);const p=eBack(seg(l,a,b));el.style.opacity=clamp(seg(l,a,b-0.12));el.style.transform='translateY('+lerp(dy||22,0,clamp(p))+'px)';}
function pop(id,a,b,l){const el=S(id);const p=eBack(seg(l,a,b));el.style.opacity=clamp(seg(l,a,b-0.14));el.style.transform='translateY('+lerp(18,0,clamp(p))+'px) scale('+lerp(0.92,1,clamp(p))+')';}
// kinetic rise on .kw masks; overflow flips to visible once settled so the glow
// spills as a soft halo instead of a clipped rectangular box
function krise(scope,l,base,stag){document.querySelectorAll(scope+' .kw').forEach((kw,i)=>{const inner=kw.firstElementChild;const d=base+i*stag;const prog=seg(l,d,d+0.6);inner.style.transform='translateY('+lerp(115,0,clamp(eBack(prog)))+'%)';kw.style.overflow=prog>0.86?'visible':'hidden';});}

// windows
const CO=[0.3,3.3], CA=[3.2,8.7], CB=[8.6,14.0], GR=[13.9,18.3], HK=[18.2,21.0], LG=[20.9,24.2];
const QA='which service earned the most?', QB='how do we cut no-shows?';

window.seek=function(tt){
  t=tt;
  const violet = vis(t,CB)>0.35 || (vis(t,HK)<0.01 && false);
  const col=violet?'166,107,230':'21,194,182', pc=violet?'#A66BE6':'#16E0CE';
  const bx=50+Math.sin(t*0.5)*4, by=44+Math.cos(t*0.42)*3;
  S('bgbloom').style.background='radial-gradient(58% 42% at '+bx+'% '+by+'%, rgba('+col+','+(0.15+0.05*pulse(t,1.4))+'), transparent 70%)';
  document.querySelectorAll('#particles i').forEach(el=>{const i=+el.dataset.i;const x=(i*137.5)%100;const y=(((i*53.3)%100)-(t*3+i*7))%110;el.style.left=x+'%';el.style.top=((y+110)%110)+'%';el.style.opacity=0.09+0.09*pulse(t*0.001+i,3+i%3);el.style.background=pc;el.style.boxShadow='0 0 12px '+pc;});

  const oCO=sceneFx('sceneCO',CO), oCA=sceneFx('sceneCA',CA), oCB=sceneFx('sceneCB',CB),
        oGR=sceneFx('sceneGrid',GR), oHK=sceneFx('sceneHook',HK), oLG=sceneFx('sceneLogo',LG);

  // COLD OPEN
  if(oCO>0.001){const l=t-CO[0];
    const mp=eBack(seg(l,0.1,0.8));S('coMark').style.opacity=clamp(seg(l,0.1,0.5));S('coMark').style.transform='scale('+lerp(0.3,1,clamp(mp))+') rotate('+lerp(-90,0,clamp(eOut(seg(l,0.1,0.9))))+'deg)';
    krise('#sceneCO',l,0.55,0.13);
    S('coPad').style.opacity=eOut(seg(l,0.75,1.25))*(0.85+0.15*pulse(t,2.2));
  }

  // CHAT A
  if(oCA>0.001){const l=t-CA[0];
    fr('caHdr',0.1,0.55,l,-18);
    pop('caStaff',0.5,1.0,l);
    S('caCmd').style.opacity=clamp(seg(l,1.0,1.3));S('caCmd').style.transform='translateY('+lerp(16,0,eBack(seg(l,1.0,1.4)))+'px)';
    typed(S('qA'),S('curA'),QA,seg(l,1.25,2.35),t);
    const showType=l>2.45&&l<3.15;S('caType').style.opacity=showType?clamp(seg(l,2.45,2.65)):(l>=3.15?0:0);
    document.querySelectorAll('#caType .typing i').forEach((el,i)=>{el.style.transform='translateY('+(-8*pulse(t*1.0+i*0.6,7))+'px)';el.style.opacity=0.4+0.6*pulse(t+i*0.6,7);});
    pop('caReply',3.15,3.7,l);
    S('caCard').style.transform='translateY('+(Math.sin(t*1.1)*5)+'px)';
    S('caCard').style.boxShadow='0 0 '+(46+18*pulse(t,2))+'px rgba(53,214,199,0.3)';
  }

  // CHAT B
  if(oCB>0.001){const l=t-CB[0];
    fr('cbHdr',0.1,0.55,l,-18);
    pop('cbStaff',0.45,0.95,l);
    S('cbCmd').style.opacity=clamp(seg(l,0.95,1.25));S('cbCmd').style.transform='translateY('+lerp(16,0,eBack(seg(l,0.95,1.35)))+'px)';
    typed(S('qB'),S('curB'),QB,seg(l,1.2,2.15),t);
    const showType=l>2.25&&l<2.95;S('cbType').style.opacity=showType?clamp(seg(l,2.25,2.45)):0;
    document.querySelectorAll('#cbType .typing i').forEach((el,i)=>{el.style.transform='translateY('+(-8*pulse(t*1.0+i*0.6,7))+'px)';el.style.opacity=0.4+0.6*pulse(t+i*0.6,7);});
    pop('cbReply',2.95,3.55,l);
    S('cbCard').style.transform='translateY('+(Math.sin(t*1.1+1)*5)+'px)';
    S('cbCard').style.boxShadow='0 0 '+(46+20*pulse(t,2))+'px rgba(139,92,246,0.34)';
  }

  // DATA GRID
  if(oGR>0.001){const l=t-GR[0];
    document.querySelectorAll('#gRings b').forEach(el=>{const i=+el.dataset.i;const ip=eOut(seg(l,i*0.05,0.5+i*0.05));el.style.transform='translate(-50%,-50%) scale('+(0.6+0.4*ip+0.03*Math.sin(t*1.5+i))+')';el.style.opacity=(0.4-i*0.06)*ip;});
    document.querySelectorAll('#sceneGrid .gh, #sceneGrid .gsub').forEach((el,i)=>{el.style.opacity=eOut(seg(l,0.15+i*0.1,0.5+i*0.1));el.style.transform='translateY('+lerp(20,0,eOut(seg(l,0.15+i*0.1,0.55+i*0.1)))+'px)';});
    document.querySelectorAll('#sceneGrid .tile').forEach(el=>{const i=+el.dataset.i;const d=0.55+i*0.14;const p=eBack(seg(l,d,d+0.5));el.style.opacity=clamp(seg(l,d,d+0.35));el.style.transform='translateY('+lerp(30,0,clamp(p))+'px) scale('+lerp(0.9,1,clamp(p))+')';el.style.boxShadow='0 0 '+(26+14*pulse(t+i,3))+'px rgba(53,214,199,0.3)';});
  }

  // HOOK
  if(oHK>0.001){const l=t-HK[0];
    krise('#sceneHook',l,0.15,0.16);
    S('hookPad').style.opacity=eOut(seg(l,0.45,1.0))*(0.85+0.15*pulse(t,2.4));
    const sw=S('hookSweep');sw.style.opacity=1;sw.style.transform='translateY(-50%) translateX('+lerp(-1200,1200,eOut(seg(l,0.55,1.3)))+'px)';
    S('hookSub').style.opacity=eOut(seg(l,0.95,1.3));
  }

  // OUTRO
  if(oLG>0.001){const l=t-LG[0];
    S('logoBeam').style.transform='translate(-50%,-50%) scaleX('+eOut(seg(l,0,0.45))+')';
    const wp=eBack(seg(l,0.15,0.65));S('logoWm').style.opacity=clamp(seg(l,0.15,0.4));S('logoWm').style.transform='scale('+lerp(0.82,1,clamp(wp))+')';
    S('logoTag').style.opacity=eOut(seg(l,0.55,0.9));
    S('logoUrl').style.opacity=eOut(seg(l,0.85,1.2));
  }
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
