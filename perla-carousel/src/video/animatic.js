// Perla.ai motion ad — ANIMATIC (look/motion test, ~6.4s).
// Self-contained animated HTML driven by a deterministic window.seek(t) so
// frames can be captured headless. Neon-on-black, teal→violet, snappy.
'use strict';

const FONTS = 'file:///home/user/tolltrack-ph/perla-carousel/fonts';

const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);

// ---- icons ----
const toothIc = `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c-2.2-1.2-5-1-6.3.9-1.4 2-1 5 .2 8.4.6 1.7.7 3.4 1 5 .2 1.3.5 3 1.4 3s1-1.3 1.3-2.6c.2-1 .6-1.7 1.4-1.7s1.2.7 1.4 1.7c.3 1.3.5 2.6 1.3 2.6s1.2-1.7 1.4-3c.3-1.6.4-3.3 1-5 1.2-3.4 1.6-6.4.2-8.4C17 2 14.2 1.8 12 3z"/></svg>`;
const sparkleIc = `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" stroke-linejoin="round"/><path d="M19 4v3M17.5 5.5h3" stroke-linecap="round"/></svg>`;
const heartIc = `<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20C7 16.5 4 13.8 4 10.2 4 7.6 6 5.6 8.5 5.6c1.6 0 3 .8 3.5 2.2.5-1.4 1.9-2.2 3.5-2.2C18 5.6 20 7.6 20 10.2c0 3.6-3 6.3-8 9.8z" stroke-linejoin="round"/></svg>`;
const phoneIc = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3.5c1 0 1.6.6 2 1.7l.7 2c.3.9.1 1.5-.6 2.1l-1 .8a11 11 0 0 0 4.5 4.5l.8-1c.6-.7 1.2-.9 2.1-.6l2 .7c1.1.4 1.7 1 1.7 2v2c0 1.3-1 2.3-2.4 2.1C10.6 21.3 2.7 13.4 2 6.4 1.8 5 2.8 4 4.1 4z"/></svg>`;

function buildHTML() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Figtree';font-weight:300 900;src:url('${FONTS}/figtree-latin.woff2') format('woff2')}
@font-face{font-family:'Doto';font-weight:100 900;src:url('${FONTS}/doto-latin.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#000;font-family:'Figtree',sans-serif;overflow:hidden}

.bgbloom{position:absolute;inset:0;background:radial-gradient(60% 40% at 50% 42%, rgba(21,194,182,0.18), transparent 70%)}
.scene{position:absolute;inset:0;opacity:0;will-change:opacity,transform}

/* ---- eyebrow ---- */
.eyebrow{position:absolute;top:300px;left:0;right:0;text-align:center;font-size:30px;font-weight:700;letter-spacing:0.32em;color:#35D6C7;text-shadow:0 0 22px rgba(53,214,199,0.7)}

/* ---- neon cards (grid) ---- */
.grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;gap:34px;align-items:center}
.ncard{width:560px;height:190px;border-radius:34px;border:1.5px solid rgba(53,214,199,0.28);
  background:linear-gradient(160deg, rgba(14,42,44,0.6), rgba(6,20,22,0.5));
  box-shadow:0 0 0 rgba(21,194,182,0); display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
  color:rgba(255,255,255,0.5);will-change:transform,opacity}
.ncard .ic{color:rgba(53,214,199,0.55)}
.ncard .lb{font-size:34px;font-weight:600}
.ncard.hot{border-color:#3EE7D6;color:#eafffb;
  box-shadow:0 0 90px rgba(35,231,214,0.55), 0 0 26px rgba(35,231,214,0.7), inset 0 0 46px rgba(21,194,182,0.14)}
.ncard.hot .ic{color:#5CF2E3}
.ncard.hot .lb{text-shadow:0 0 20px rgba(53,214,199,0.6)}

/* ---- setup form ---- */
.form{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:660px}
.form .ftitle{font-size:30px;font-weight:700;letter-spacing:0.28em;color:#35D6C7;text-align:center;margin-bottom:44px;text-shadow:0 0 22px rgba(53,214,199,0.7)}
.field{margin-bottom:30px}
.field .lab{font-size:24px;color:rgba(255,255,255,0.5);margin-bottom:12px;font-weight:500}
.field .inp{min-height:78px;border-radius:20px;border:1.5px solid rgba(53,214,199,0.35);
  background:rgba(10,30,32,0.5);box-shadow:inset 0 0 30px rgba(21,194,182,0.06), 0 0 30px rgba(21,194,182,0.12);
  display:flex;align-items:center;padding:0 26px;font-size:30px;font-weight:600;color:#eafffb}
.field .inp.tall{min-height:120px;align-items:flex-start;padding-top:22px;line-height:1.35}
.field .cur{display:inline-block;width:2px;height:34px;background:#5CF2E3;margin-left:3px;box-shadow:0 0 10px #5CF2E3;vertical-align:middle}
.cbtn{margin-top:16px;height:84px;border-radius:22px;display:flex;align-items:center;justify-content:center;gap:12px;
  background:linear-gradient(160deg,#1ED0C0,#12A093);color:#04201d;font-size:32px;font-weight:800;
  box-shadow:0 0 50px rgba(21,194,182,0.5)}

/* ---- light beam word ---- */
.beam{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:360px}
.beam .bar{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(0);width:1200px;height:150px;
  background:linear-gradient(90deg, transparent, #16E0CE 18%, #7BF7EA 50%, #16E0CE 82%, transparent);
  filter:blur(6px);opacity:0.9}
.beam .bar2{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(0);width:1200px;height:12px;
  background:linear-gradient(90deg, transparent, #ffffff 50%, transparent);filter:blur(2px)}
.beam .word{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;
  font-size:104px;font-weight:800;letter-spacing:-0.02em;color:#fff;text-shadow:0 0 40px rgba(53,214,199,0.8)}
.beam .word b{color:#5CF2E3}
.beam .sub{position:absolute;left:0;right:0;top:calc(50% + 96px);text-align:center;font-size:34px;font-weight:600;color:rgba(255,255,255,0.6)}

/* ---- logo outro ---- */
.logo{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.logo .beamline{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(0);width:1100px;height:6px;
  background:linear-gradient(90deg,transparent,#5CF2E3,transparent);filter:blur(1px);box-shadow:0 0 40px #16E0CE}
.logo .wm{font-size:132px;font-weight:900;letter-spacing:-0.03em;color:#fff;text-shadow:0 0 50px rgba(53,214,199,0.7)}
.logo .wm b{color:#35D6C7}
.logo .url{font-size:34px;font-weight:700;color:rgba(255,255,255,0.75);letter-spacing:0.02em}

/* ---- cursor ---- */
#cursor{position:absolute;left:0;top:0;width:70px;height:70px;opacity:0;will-change:transform,opacity;filter:drop-shadow(0 0 16px rgba(53,214,199,0.9))}

.grain{position:absolute;inset:-20px;z-index:80;pointer-events:none;
  background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.05;mix-blend-mode:overlay}
.vig{position:absolute;inset:0;z-index:79;pointer-events:none;background:radial-gradient(120% 100% at 50% 44%, transparent 52%, rgba(0,0,0,0.55) 100%)}
</style></head>
<body>
<div id="stage">
  <div class="bgbloom" id="bgbloom"></div>

  <!-- SCENE A: build grid -->
  <div class="scene" id="sceneGrid">
    <div class="eyebrow">BUILD YOUR PERLA</div>
    <div class="grid">
      <div class="ncard" id="cardD"><span class="ic">${toothIc}</span><span class="lb">Dental Clinic</span></div>
      <div class="ncard" id="cardA"><span class="ic">${sparkleIc}</span><span class="lb">Aesthetic Clinic</span></div>
      <div class="ncard" id="cardM"><span class="ic">${heartIc}</span><span class="lb">Medical Clinic</span></div>
    </div>
  </div>

  <!-- SCENE B: setup form -->
  <div class="scene" id="sceneForm">
    <div class="form">
      <div class="ftitle">SET HER UP</div>
      <div class="field"><div class="lab">Clinic name</div><div class="inp"><span id="f1"></span><span class="cur" id="c1"></span></div></div>
      <div class="field"><div class="lab">Booking link</div><div class="inp"><span id="f2"></span><span class="cur" id="c2"></span></div></div>
      <div class="field"><div class="lab">What should Perla do?</div><div class="inp tall"><span id="f3"></span><span class="cur" id="c3"></span></div></div>
      <div class="cbtn" id="cbtn">${phoneIc}<span>Bring Perla online</span></div>
    </div>
  </div>

  <!-- SCENE C: light beam word -->
  <div class="scene" id="sceneBeam">
    <div class="beam">
      <div class="bar" id="beamBar"></div>
      <div class="bar2" id="beamBar2"></div>
      <div class="word" id="beamWord">Answers every <b>call</b></div>
      <div class="sub" id="beamSub">day or night · 24/7</div>
    </div>
  </div>

  <!-- SCENE D: logo -->
  <div class="scene" id="sceneLogo">
    <div class="logo">
      <div class="beamline" id="logoBeam"></div>
      <div class="wm" id="logoWm">Perla<b>.ai</b></div>
      <div class="url" id="logoUrl">meetperla-ai.com</div>
    </div>
  </div>

  <svg id="cursor" viewBox="0 0 24 24"><path d="M4 2l15 8.5-6.2 1.6L9.5 20z" fill="#eafffb" stroke="#16E0CE" stroke-width="1.2" stroke-linejoin="round"/></svg>

  <div class="vig"></div>
  <div class="grain"></div>
</div>

<script>
const S = (id)=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,t0,t1)=>clamp((t-t0)/(t1-t0));
const eOut=x=>1-Math.pow(1-x,3);
const eIn=x=>x*x*x;
const eInOut=x=>x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
function show(el,o){el.style.opacity=o;}
function setXY(el,x,y,s=1){el.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';}

// scene time windows
const A=[0.0,2.3], B=[2.25,4.35], C=[4.3,5.55], D=[5.5,6.4];
const F1='JerickoSmile', F2='jericko-smile-design-2.perla-ai.app', F3='Answer every call & book patients 24/7';

function typed(el,cur,full,p){
  const n=Math.floor(clamp(p)*full.length);
  el.textContent=full.slice(0,n);
  cur.style.opacity = (p>0 && p<1) ? ((Math.floor(performance.now?0:0)) , (Math.sin(p*40)>0?1:0.25)) : (p>=1?0:0);
}

window.seek=function(t){
  // background bloom drift + hue toward violet near the end
  const drift = Math.sin(t*0.8)*30;
  S('bgbloom').style.background='radial-gradient(60% 40% at '+(50+drift/10)+'% 42%, rgba(21,194,182,0.18), transparent 70%)';

  // ---- crossfades ----
  const aOn=clamp(seg(t,A[0],A[0]+0.25)-seg(t,A[1]-0.15,A[1]+0.05));
  const bOn=clamp(seg(t,B[0],B[0]+0.2)-seg(t,B[1]-0.15,B[1]+0.05));
  const cOn=clamp(seg(t,C[0],C[0]+0.18)-seg(t,C[1]-0.15,C[1]+0.02));
  const dOn=clamp(seg(t,D[0],D[0]+0.22));
  show(S('sceneGrid'),aOn); show(S('sceneForm'),bOn); show(S('sceneBeam'),cOn); show(S('sceneLogo'),dOn);

  // ================= SCENE A =================
  if(aOn>0.001){
    const cards=[['cardD',0.10],['cardA',0.20],['cardM',0.30]];
    cards.forEach(([id,d])=>{
      const p=eOut(seg(t,A[0]+d,A[0]+d+0.5));
      const el=S(id); el.style.opacity=p; setXY(el,0,lerp(60,0,p));
    });
    // highlight dental after "click"
    const clickT=A[0]+1.55;
    const hot = t>clickT;
    S('cardD').classList.toggle('hot',hot);
    // dim siblings after click
    const dim = eOut(seg(t,clickT,clickT+0.3));
    S('cardA').style.opacity = lerp(S('cardA').style.opacity||1, 0.25, dim);
    S('cardM').style.opacity = lerp(S('cardM').style.opacity||1, 0.25, dim);
    // click pulse
    const pulse = t>clickT ? 1+0.05*Math.exp(-(t-clickT)*10)*Math.cos((t-clickT)*40) : 1;
    setXY(S('cardD'),0,0,pulse);

    // cursor: move from bottom-right to the dental card, then dip (click)
    const cur=S('cursor'); cur.style.opacity=eOut(seg(t,A[0]+0.2,A[0]+0.5));
    const mp=eInOut(seg(t,A[0]+0.4,clickT));
    const cx=lerp(760,600,mp), cy=lerp(1500,858,mp);
    const dip = t>clickT ? -Math.exp(-(t-clickT)*14)*Math.sin((t-clickT)*30)*10 : 0;
    setXY(cur, cx, cy+ (t>clickT? (Math.exp(-(t-clickT)*16)*14):0), 1+dip*0.006);
  }

  // ================= SCENE B =================
  if(bOn>0.001){
    S('sceneForm').style.transform='';
    typed(S('f1'),S('c1'),F1, seg(t,B[0]+0.15,B[0]+0.6));
    typed(S('f2'),S('c2'),F2, seg(t,B[0]+0.6,B[0]+1.15));
    typed(S('f3'),S('c3'),F3, seg(t,B[0]+1.15,B[0]+1.75));
    // button click
    const clickT=B[0]+1.9;
    const bp = t>clickT ? 1+0.06*Math.exp(-(t-clickT)*10)*Math.cos((t-clickT)*40) : 1;
    const cbtn=S('cbtn'); cbtn.style.transform='scale('+bp+')';
    cbtn.style.boxShadow = t>clickT ? '0 0 90px rgba(35,231,214,0.8)' : '0 0 50px rgba(21,194,182,0.5)';
    // cursor to button
    const cur=S('cursor'); cur.style.opacity=1;
    const mp=eInOut(seg(t,B[0]+0.2,clickT));
    setXY(cur, lerp(600,560,mp), lerp(760,1120,mp) + (t>clickT?Math.exp(-(t-clickT)*16)*14:0), 1);
  } else if(t>B[1]) { S('cursor').style.opacity=0; }

  // ================= SCENE C (beam word) =================
  if(cOn>0.001){
    const p=eOut(seg(t,C[0]+0.05,C[0]+0.5));
    S('beamBar').style.transform='translate(-50%,-50%) scaleX('+p+')';
    S('beamBar2').style.transform='translate(-50%,-50%) scaleX('+eOut(seg(t,C[0],C[0]+0.35))+')';
    S('beamBar').style.opacity=lerp(0.95,0.25,seg(t,C[0]+0.5,C[1]));
    const wp=seg(t,C[0]+0.18,C[0]+0.5);
    S('beamWord').style.opacity=eOut(wp);
    S('beamWord').style.transform='translateY(-50%) scale('+lerp(0.92,1,eOut(wp))+')';
    S('beamSub').style.opacity=eOut(seg(t,C[0]+0.45,C[0]+0.75));
  }

  // ================= SCENE D (logo) =================
  if(dOn>0.001){
    S('logoBeam').style.transform='translate(-50%,-50%) scaleX('+eOut(seg(t,D[0],D[0]+0.4))+')';
    const wp=eBack(seg(t,D[0]+0.15,D[0]+0.6));
    S('logoWm').style.opacity=clamp(seg(t,D[0]+0.15,D[0]+0.4));
    S('logoWm').style.transform='scale('+lerp(0.8,1,clamp(wp))+')';
    S('logoUrl').style.opacity=eOut(seg(t,D[0]+0.5,D[0]+0.8));
  }
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
