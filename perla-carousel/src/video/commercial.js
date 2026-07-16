// Perla.ai motion ad — FULL COMMERCIAL (~23.5s, 9:16).
// Natural per-beat pacing, but punchy/alive motion (overshoot eases, breathing
// glow, animated waveforms, count-up, staggered pops). Teal throughout, one
// violet beat (Perla Scribe). Deterministic window.seek(t) for frame capture.
'use strict';

const FONTS = 'file:///home/user/tolltrack-ph/perla-carousel/fonts';
const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);

const toothIc = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-2.2-1.2-5-1-6.3.9-1.4 2-1 5 .2 8.4.6 1.7.7 3.4 1 5 .2 1.3.5 3 1.4 3s1-1.3 1.3-2.6c.2-1 .6-1.7 1.4-1.7s1.2.7 1.4 1.7c.3 1.3.5 2.6 1.3 2.6s1.2-1.7 1.4-3c.3-1.6.4-3.3 1-5 1.2-3.4 1.6-6.4.2-8.4C17 2 14.2 1.8 12 3z"/></svg>`;
const sparkleIc = `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" stroke-linejoin="round"/><path d="M19 4v3M17.5 5.5h3" stroke-linecap="round"/></svg>`;
const heartIc = `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20C7 16.5 4 13.8 4 10.2 4 7.6 6 5.6 8.5 5.6c1.6 0 3 .8 3.5 2.2.5-1.4 1.9-2.2 3.5-2.2C18 5.6 20 7.6 20 10.2c0 3.6-3 6.3-8 9.8z" stroke-linejoin="round"/></svg>`;
const phoneIc = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3.5c1 0 1.6.6 2 1.7l.7 2c.3.9.1 1.5-.6 2.1l-1 .8a11 11 0 0 0 4.5 4.5l.8-1c.6-.7 1.2-.9 2.1-.6l2 .7c1.1.4 1.7 1 1.7 2v2c0 1.3-1 2.3-2.4 2.1C10.6 21.3 2.7 13.4 2 6.4 1.8 5 2.8 4 4.1 4z"/></svg>`;
const micIc = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke-linecap="round"/></svg>`;
const checkIc = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#04201d" stroke-width="2.6"><path d="M5 12.5l4.5 4.5L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// waveform bars markup (n bars); heights animated in seek
function bars(n, cls) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<i class="${cls}" data-i="${i}"></i>`;
  return s;
}

function buildHTML() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Figtree';font-weight:300 900;src:url('${FONTS}/figtree-latin.woff2') format('woff2')}
@font-face{font-family:'Doto';font-weight:100 900;src:url('${FONTS}/doto-latin.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#000;font-family:'Figtree',sans-serif;overflow:hidden}
.bgbloom{position:absolute;inset:0}
.scene{position:absolute;inset:0;opacity:0;will-change:opacity}
.eyebrow{position:absolute;top:300px;left:0;right:0;text-align:center;font-size:30px;font-weight:700;letter-spacing:0.32em;color:#35D6C7;text-shadow:0 0 22px rgba(53,214,199,0.7)}
.eyebrow.violet{color:#B98BF2;text-shadow:0 0 22px rgba(166,107,230,0.8)}

/* grid */
.grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;gap:34px;align-items:center}
.ncard{width:560px;height:190px;border-radius:34px;border:1.5px solid rgba(53,214,199,0.28);
  background:linear-gradient(160deg, rgba(14,42,44,0.6), rgba(6,20,22,0.5));
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:rgba(255,255,255,0.5);will-change:transform,opacity,box-shadow}
.ncard .ic{color:rgba(53,214,199,0.55)}
.ncard .lb{font-size:34px;font-weight:600}
.ncard.hot{border-color:#3EE7D6;color:#eafffb}
.ncard.hot .ic{color:#5CF2E3}
.ncard.hot .lb{text-shadow:0 0 20px rgba(53,214,199,0.6)}

/* form */
.form{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:660px}
.form .ftitle{font-size:30px;font-weight:700;letter-spacing:0.28em;color:#35D6C7;text-align:center;margin-bottom:44px;text-shadow:0 0 22px rgba(53,214,199,0.7)}
.field{margin-bottom:30px}
.field .lab{font-size:24px;color:rgba(255,255,255,0.5);margin-bottom:12px;font-weight:500}
.field .inp{min-height:78px;border-radius:20px;border:1.5px solid rgba(53,214,199,0.35);background:rgba(10,30,32,0.5);
  box-shadow:inset 0 0 30px rgba(21,194,182,0.06), 0 0 30px rgba(21,194,182,0.12);display:flex;align-items:center;padding:0 26px;font-size:30px;font-weight:600;color:#eafffb}
.field .inp.tall{min-height:120px;align-items:flex-start;padding-top:22px;line-height:1.35}
.cur{display:inline-block;width:2px;height:34px;background:#5CF2E3;margin-left:3px;box-shadow:0 0 10px #5CF2E3;vertical-align:middle}
.cbtn{margin-top:16px;height:84px;border-radius:22px;display:flex;align-items:center;justify-content:center;gap:12px;background:linear-gradient(160deg,#1ED0C0,#12A093);color:#04201d;font-size:32px;font-weight:800}

/* call card + chat */
.callwrap{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:720px}
.callcard{border-radius:40px;border:1.5px solid rgba(53,214,199,0.4);background:linear-gradient(165deg, rgba(12,40,42,0.7), rgba(6,18,20,0.6));padding:38px 40px;min-height:640px;position:relative;will-change:box-shadow}
.callhdr{display:flex;align-items:center;gap:18px;margin-bottom:8px}
.callhdr .dot{width:16px;height:16px;border-radius:50%;background:#3EE7D6;box-shadow:0 0 16px #3EE7D6}
.callhdr .who{font-size:30px;font-weight:700;color:#eafffb}
.callhdr .st{font-size:22px;color:rgba(255,255,255,0.5);margin-top:2px}
.wave{display:flex;align-items:center;gap:8px;height:96px;margin:26px 4px 10px}
.wave i{width:8px;border-radius:5px;background:#35D6C7;box-shadow:0 0 14px rgba(53,214,199,0.6);display:block;height:16px}
.bub{max-width:520px;border-radius:30px;padding:24px 30px;font-size:31px;font-weight:500;line-height:1.32;opacity:0;will-change:transform,opacity}
.bub.pt{margin-left:auto;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#eafffb;border-bottom-right-radius:8px;margin-top:22px}
.bub.pe{background:linear-gradient(150deg,#18E0CE,#0FA79B);color:#04201d;border-bottom-left-radius:8px;margin-top:22px;box-shadow:0 0 60px rgba(24,224,206,0.5)}
.booked{position:absolute;left:50%;bottom:-34px;transform:translateX(-50%) scale(0.6);opacity:0;display:flex;align-items:center;gap:12px;background:#fff;color:#04201d;border-radius:999px;padding:16px 34px;font-size:30px;font-weight:800;box-shadow:0 0 60px rgba(53,214,199,0.6);will-change:transform,opacity}
.booked .ck{width:38px;height:38px;border-radius:50%;background:#16E0CE;display:flex;align-items:center;justify-content:center}

/* light beam word */
.beam{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:360px}
.beam .bar{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(0);width:1200px;height:150px;filter:blur(6px);opacity:0.9;background:linear-gradient(90deg, transparent, #16E0CE 18%, #7BF7EA 50%, #16E0CE 82%, transparent)}
.beam .bar2{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(0);width:1200px;height:12px;background:linear-gradient(90deg, transparent, #fff 50%, transparent);filter:blur(2px)}
.beam .word{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:100px;font-weight:800;letter-spacing:-0.02em;color:#fff;text-shadow:0 0 40px rgba(53,214,199,0.8)}
.beam .word b{color:#5CF2E3}
.beam .sub{position:absolute;left:0;right:0;top:calc(50% + 92px);text-align:center;font-size:34px;font-weight:600;color:rgba(255,255,255,0.6)}

/* scribe (violet) */
.scribe{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:720px;text-align:center}
.scribe .orb{width:150px;height:150px;border-radius:50%;margin:0 auto;border:1.5px solid rgba(166,107,230,0.6);background:radial-gradient(circle at 40% 35%, rgba(166,107,230,0.35), rgba(20,10,40,0.3));display:flex;align-items:center;justify-content:center;color:#C4A2F5;will-change:box-shadow}
.wavev{display:flex;align-items:center;justify-content:center;gap:8px;height:70px;margin:30px 0 8px}
.wavev i{width:8px;border-radius:5px;background:#B98BF2;box-shadow:0 0 14px rgba(166,107,230,0.7);display:block;height:16px}
.notecard{margin-top:26px;border-radius:28px;border:1.5px solid rgba(166,107,230,0.4);background:rgba(24,14,44,0.5);box-shadow:0 0 50px rgba(139,92,246,0.25);padding:30px 32px;text-align:left;min-height:230px;font-size:29px;line-height:1.5;color:#EBE2FB;font-weight:500}
.notecard .cur2{display:inline-block;width:2px;height:30px;background:#C4A2F5;margin-left:2px;box-shadow:0 0 10px #C4A2F5;vertical-align:middle}

/* money + calendar */
.money{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:760px;text-align:center}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-bottom:52px}
.cal .cel{height:64px;border-radius:14px;border:1px solid rgba(53,214,199,0.18);display:flex;align-items:center;justify-content:center;font-size:24px;color:rgba(255,255,255,0.35);position:relative;will-change:box-shadow,opacity}
.cal .cel .d{position:absolute;bottom:8px;width:8px;height:8px;border-radius:50%;background:#16E0CE;box-shadow:0 0 10px #16E0CE;opacity:0;will-change:opacity,transform}
.cal .cel.today{border-color:#3EE7D6;color:#04201d;background:linear-gradient(160deg,#1ED0C0,#12A093);font-weight:800}
.money .num{font-size:150px;font-weight:900;letter-spacing:-0.03em;color:#fff;text-shadow:0 0 50px rgba(53,214,199,0.7);line-height:1}
.money .num .pk{font-family:'Figtree';font-weight:800;font-size:0.78em;position:relative;margin-right:4px}
.money .num .pk::after{content:"";position:absolute;left:-0.1em;right:-0.05em;top:0.26em;border-top:0.07em solid currentColor;box-shadow:0 0.17em 0 currentColor}
.money .cap{font-size:38px;font-weight:600;color:rgba(255,255,255,0.65);margin-top:22px}

/* logo */
.logo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px}
.logo .beamline{position:absolute;left:50%;top:calc(50% - 30px);transform:translate(-50%,-50%) scaleX(0);width:1100px;height:6px;background:linear-gradient(90deg,transparent,#5CF2E3,transparent);filter:blur(1px);box-shadow:0 0 40px #16E0CE}
.logo .wm{font-size:140px;font-weight:900;letter-spacing:-0.03em;color:#fff;text-shadow:0 0 50px rgba(53,214,199,0.7)}
.logo .wm b{color:#35D6C7}
.logo .url{font-size:36px;font-weight:700;color:rgba(255,255,255,0.78)}
.logo .cta{font-size:30px;font-weight:600;color:rgba(255,255,255,0.5);margin-top:6px}

#cursor{position:absolute;left:0;top:0;width:70px;height:70px;opacity:0;will-change:transform,opacity;filter:drop-shadow(0 0 16px rgba(53,214,199,0.9))}
.grain{position:absolute;inset:-20px;z-index:80;pointer-events:none;background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.05;mix-blend-mode:overlay}
.vig{position:absolute;inset:0;z-index:79;pointer-events:none;background:radial-gradient(120% 100% at 50% 44%, transparent 52%, rgba(0,0,0,0.55) 100%)}
</style></head>
<body>
<div id="stage">
  <div class="bgbloom" id="bgbloom"></div>

  <div class="scene" id="sceneGrid">
    <div class="eyebrow">BUILD YOUR PERLA</div>
    <div class="grid">
      <div class="ncard" id="cardD"><span class="ic">${toothIc}</span><span class="lb">Dental Clinic</span></div>
      <div class="ncard" id="cardA"><span class="ic">${sparkleIc}</span><span class="lb">Aesthetic Clinic</span></div>
      <div class="ncard" id="cardM"><span class="ic">${heartIc}</span><span class="lb">Medical Clinic</span></div>
    </div>
  </div>

  <div class="scene" id="sceneForm">
    <div class="form">
      <div class="ftitle">SET HER UP</div>
      <div class="field"><div class="lab">Clinic name</div><div class="inp"><span id="f1"></span><span class="cur" id="c1"></span></div></div>
      <div class="field"><div class="lab">Booking link</div><div class="inp"><span id="f2"></span><span class="cur" id="c2"></span></div></div>
      <div class="field"><div class="lab">What should Perla do?</div><div class="inp tall"><span id="f3"></span><span class="cur" id="c3"></span></div></div>
      <div class="cbtn" id="cbtn">${phoneIc}<span>Bring Perla online</span></div>
    </div>
  </div>

  <div class="scene" id="sceneCall">
    <div class="callwrap"><div class="callcard" id="callcard">
      <div class="callhdr"><span class="dot"></span><span><div class="who">Incoming call</div><div class="st" id="callst">Perla is answering…</div></span></div>
      <div class="wave" id="callwave">${bars(26, 'wv')}</div>
      <div class="bub pt" id="bub1">Hi! Do you have a slot for a cleaning?</div>
      <div class="bub pe" id="bub2">Yes — there's an opening Wednesday at 2 PM. Want me to book it?</div>
      <div class="booked" id="booked"><span class="ck">${checkIc}</span>Booked</div>
    </div></div>
  </div>

  <div class="scene" id="sceneBeam1">
    <div class="beam">
      <div class="bar" id="b1bar"></div><div class="bar2" id="b1bar2"></div>
      <div class="word" id="b1word">Answers every <b>call</b></div>
      <div class="sub" id="b1sub">day or night · 24/7</div>
    </div>
  </div>

  <div class="scene" id="sceneScribe">
    <div class="eyebrow violet">PERLA SCRIBE</div>
    <div class="scribe">
      <div class="orb" id="scorb">${micIc}</div>
      <div class="wavev" id="scwave">${bars(21, 'wvv')}</div>
      <div class="notecard"><span id="note"></span><span class="cur2" id="notecur"></span></div>
      <div style="font-size:34px;font-weight:600;color:rgba(255,255,255,0.6);margin-top:26px" id="scsub">You talk. She writes the note.</div>
    </div>
  </div>

  <div class="scene" id="sceneMoney">
    <div class="money">
      <div class="cal" id="cal"></div>
      <div class="num"><span class="pk">P</span><span id="moneynum">0</span></div>
      <div class="cap" id="moneycap">collected — while you slept.</div>
    </div>
  </div>

  <div class="scene" id="sceneLogo">
    <div class="logo">
      <div class="beamline" id="logoBeam"></div>
      <div class="wm" id="logoWm">Perla<b>.ai</b></div>
      <div class="url" id="logoUrl">meetperla-ai.com</div>
      <div class="cta" id="logoCta">Never miss another call.</div>
    </div>
  </div>

  <svg id="cursor" viewBox="0 0 24 24"><path d="M4 2l15 8.5-6.2 1.6L9.5 20z" fill="#eafffb" stroke="#16E0CE" stroke-width="1.2" stroke-linejoin="round"/></svg>
  <div class="vig"></div><div class="grain"></div>
</div>

<script>
const S=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,t0,t1)=>clamp((t-t0)/(t1-t0));
const eOut=x=>1-Math.pow(1-x,3);
const eInOut=x=>x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
const pulse=(t,sp)=>0.5+0.5*Math.sin(t*sp);
function show(el,o){el.style.opacity=o;}
function vis(t,w,fi=0.28,fo=0.22){return clamp(seg(t,w[0],w[0]+fi))-clamp(seg(t,w[1]-fo,w[1]));}
function typed(el,cur,full,p,t){el.textContent=full.slice(0,Math.floor(clamp(p)*full.length));cur.style.opacity=(p>0.001&&p<0.999)?(Math.sin(t*16)>0?1:0.25):0;}

// scene windows (s)
const A=[0.3,4.0], B=[3.9,8.4], CALL=[8.3,14.2], BM=[14.1,16.8], SCR=[16.7,20.4], MON=[20.3,23.4], LG=[23.3,25.6];
const F1='JerickoSmile', F2='jericko-smile-design-2.perla-ai.app', F3='Answer every call & book patients — 24/7';
const NOTE='Chief complaint: routine cleaning. Findings: mild plaque, no caries. Plan: prophylaxis, recall in 6 months.';

// build calendar cells once
(function(){const cal=S('cal');const dotDays={2:1,3:1,5:1,7:1,8:1,9:1,12:1,14:1,16:1,19:1,21:1,23:1};
 for(let i=0;i<35;i++){const day=i-2;const cel=document.createElement('div');cel.className='cel'+(day===9?' today':'');
  if(day>=1&&day<=31){cel.innerHTML=day+(dotDays[day]?'<span class="d" data-day="'+day+'"></span>':'');}cal.appendChild(cel);}})();

let last=-1;
window.seek=function(t){
  // living background bloom (teal, shifts violet during scribe)
  const violet = vis(t,SCR)>0.4;
  const bx=50+Math.sin(t*0.5)*4, by=42+Math.cos(t*0.42)*3;
  const col = violet? '166,107,230' : '21,194,182';
  const amp = 0.16+0.05*pulse(t,1.4);
  S('bgbloom').style.background='radial-gradient('+(58)+'% '+(40)+'% at '+bx+'% '+by+'%, rgba('+col+','+amp+'), transparent 70%)';

  show(S('sceneGrid'),vis(t,A)); show(S('sceneForm'),vis(t,B)); show(S('sceneCall'),vis(t,CALL));
  show(S('sceneBeam1'),vis(t,BM)); show(S('sceneScribe'),vis(t,SCR)); show(S('sceneMoney'),vis(t,MON)); show(S('sceneLogo'),vis(t,LG));

  // ---------- GRID ----------
  if(vis(t,A)>0.001){
    [['cardD',0.15],['cardA',0.28],['cardM',0.41]].forEach(([id,d])=>{
      const p=eBack(seg(t,A[0]+d,A[0]+d+0.6));const el=S(id);el.style.opacity=clamp(seg(t,A[0]+d,A[0]+d+0.4));
      el.style.transform='translateY('+lerp(70,0,clamp(p))+'px)';});
    const clickT=A[0]+2.0, hot=t>clickT; S('cardD').classList.toggle('hot',hot);
    const dim=eOut(seg(t,clickT,clickT+0.35)); S('cardA').style.opacity=lerp(1,0.22,dim); S('cardM').style.opacity=lerp(1,0.22,dim);
    // breathing glow on dental card (alive), burst on click
    const base = hot? 70:0, burst = hot? 60*Math.exp(-(t-clickT)*3):0, breathe=hot?18*pulse(t,3):8*pulse(t,2);
    S('cardD').style.boxShadow='0 0 '+(base+burst+breathe)+'px rgba(35,231,214,'+(hot?0.6:0.2)+'), inset 0 0 40px rgba(21,194,182,'+(hot?0.14:0.05)+')';
    const pop=hot?1+0.05*Math.exp(-(t-clickT)*9)*Math.cos((t-clickT)*34):1; S('cardD').style.transform='translateY(0) scale('+pop+')';
    const cur=S('cursor'); cur.style.opacity=eOut(seg(t,A[0]+0.4,A[0]+0.8));
    const mp=eInOut(seg(t,A[0]+0.7,clickT)); const cx=lerp(770,600,mp), cy=lerp(1540,868,mp)+(t>clickT?Math.exp(-(t-clickT)*15)*16:0);
    cur.style.transform='translate('+cx+'px,'+cy+'px) scale('+(t>clickT?1-0.12*Math.exp(-(t-clickT)*12):1)+')';
  }

  // ---------- FORM ----------
  if(vis(t,B)>0.001){
    typed(S('f1'),S('c1'),F1,seg(t,B[0]+0.35,B[0]+1.15),t);
    typed(S('f2'),S('c2'),F2,seg(t,B[0]+1.3,B[0]+2.5),t);
    typed(S('f3'),S('c3'),F3,seg(t,B[0]+2.65,B[0]+3.7),t);
    const clickT=B[0]+4.0, done=t>clickT;
    const bp=done?1+0.06*Math.exp(-(t-clickT)*9)*Math.cos((t-clickT)*34):1;
    S('cbtn').style.transform='scale('+bp+')';
    const g=done? 90:44; S('cbtn').style.boxShadow='0 0 '+(g+14*pulse(t,3))+'px rgba(35,231,214,'+(done?0.85:0.45)+')';
    const cur=S('cursor'); cur.style.opacity=1;
    const mp=eInOut(seg(t,B[0]+0.4,clickT)); cur.style.transform='translate('+lerp(600,560,mp)+'px,'+(lerp(820,1150,mp)+(done?Math.exp(-(t-clickT)*15)*16:0))+'px) scale('+(done?1-0.12*Math.exp(-(t-clickT)*12):1)+')';
  } else if(t>B[1]+0.1 && t<CALL[1]) { S('cursor').style.opacity=0; }

  // ---------- CALL ----------
  if(vis(t,CALL)>0.001){
    const c0=CALL[0];
    // animated waveform while "answering", fades as bubbles arrive
    const waveOn=1-clamp(seg(t,c0+1.4,c0+2.0)); S('callwave').style.opacity=waveOn;
    document.querySelectorAll('#callwave .wv').forEach(el=>{const i=+el.dataset.i;el.style.height=(16+70*Math.abs(Math.sin(t*7+i*0.6))*(0.4+0.6*Math.sin(t*3+i)))+'px';});
    S('callst').textContent = t>c0+1.6?'Perla · on the line':'Perla is answering…';
    // bubbles pop in
    const b1=eBack(seg(t,c0+1.8,c0+2.4)); const e1=S('bub1'); e1.style.opacity=clamp(seg(t,c0+1.8,c0+2.2)); e1.style.transform='translateY('+lerp(24,0,clamp(b1))+'px) scale('+lerp(0.9,1,clamp(b1))+')';
    const b2=eBack(seg(t,c0+2.9,c0+3.5)); const e2=S('bub2'); e2.style.opacity=clamp(seg(t,c0+2.9,c0+3.3)); e2.style.transform='translateY('+lerp(24,0,clamp(b2))+'px) scale('+lerp(0.9,1,clamp(b2))+')';
    e2.style.boxShadow='0 0 '+(50+16*pulse(t,3))+'px rgba(24,224,206,0.5)';
    // booked pop
    const bkT=c0+4.4, bk=eBack(seg(t,bkT,bkT+0.5)); const bel=S('booked'); bel.style.opacity=clamp(seg(t,bkT,bkT+0.3)); bel.style.transform='translateX(-50%) scale('+lerp(0.6,1,clamp(bk))+')';
    S('callcard').style.boxShadow='0 0 '+(40+18*pulse(t,2))+'px rgba(53,214,199,0.28)';
    S('cursor').style.opacity=0;
  }

  // ---------- BEAM 1 ----------
  if(vis(t,BM)>0.001){
    const p=eOut(seg(t,BM[0]+0.1,BM[0]+0.6)); S('b1bar').style.transform='translate(-50%,-50%) scaleX('+p+')';
    S('b1bar2').style.transform='translate(-50%,-50%) scaleX('+eOut(seg(t,BM[0],BM[0]+0.4))+')';
    S('b1bar').style.opacity=lerp(0.95,0.4,seg(t,BM[0]+0.6,BM[1]))*(0.85+0.15*pulse(t,4));
    const wp=eOut(seg(t,BM[0]+0.25,BM[0]+0.6)); S('b1word').style.opacity=wp; S('b1word').style.transform='translateY(-50%) scale('+lerp(0.92,1,wp)+')';
    S('b1sub').style.opacity=eOut(seg(t,BM[0]+0.6,BM[0]+0.95));
  }

  // ---------- SCRIBE (violet) ----------
  if(vis(t,SCR)>0.001){
    const s0=SCR[0];
    S('scorb').style.boxShadow='0 0 '+(50+26*pulse(t,3))+'px rgba(139,92,246,0.5)';
    document.querySelectorAll('#scwave .wvv').forEach(el=>{const i=+el.dataset.i;el.style.height=(14+52*Math.abs(Math.sin(t*6+i*0.7)))+'px';});
    typed(S('note'),S('notecur'),NOTE,seg(t,s0+0.9,s0+3.0),t);
    S('scsub').style.opacity=eOut(seg(t,s0+0.3,s0+0.7));
  }

  // ---------- MONEY ----------
  if(vis(t,MON)>0.001){
    const m0=MON[0];
    // calendar dots pop in staggered
    document.querySelectorAll('#cal .d').forEach((el,idx)=>{const dd=+el.dataset.day;const p=eBack(seg(t,m0+0.2+dd*0.03,m0+0.5+dd*0.03));el.style.opacity=clamp(seg(t,m0+0.2+dd*0.03,m0+0.45+dd*0.03));el.style.transform='scale('+lerp(0,1,clamp(p))+')';});
    // today cell breathe
    S('cal').querySelector('.today').style.boxShadow='0 0 '+(20+14*pulse(t,3))+'px rgba(53,214,199,0.6)';
    // count up
    const cp=eOut(seg(t,m0+0.6,m0+2.2)); const val=Math.round(88497*cp); S('moneynum').textContent=val.toLocaleString('en-US');
    S('moneycap').style.opacity=eOut(seg(t,m0+2.0,m0+2.4));
  }

  // ---------- LOGO ----------
  if(vis(t,LG)>0.001){
    S('logoBeam').style.transform='translate(-50%,-50%) scaleX('+eOut(seg(t,LG[0],LG[0]+0.45))+')';
    const wp=eBack(seg(t,LG[0]+0.15,LG[0]+0.65)); S('logoWm').style.opacity=clamp(seg(t,LG[0]+0.15,LG[0]+0.4)); S('logoWm').style.transform='scale('+lerp(0.82,1,clamp(wp))+')';
    S('logoUrl').style.opacity=eOut(seg(t,LG[0]+0.55,LG[0]+0.85));
    S('logoCta').style.opacity=eOut(seg(t,LG[0]+0.8,LG[0]+1.15));
  }
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
