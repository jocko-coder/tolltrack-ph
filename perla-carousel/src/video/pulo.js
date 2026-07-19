// PULO.PH — pixel/LED logo animation (~17.1s, 9:16, 60fps). V2.
// Momentum-driven transitions: boot shapes zip out with smear, the parade
// accelerates and stretches INTO the chromatic burst, streaks decelerate INTO
// the letters, white-flash hard cut into the print end card. Elastic bounce
// landings, squash & stretch, hop-waves, LED shimmer, glitch blinks.
// Strictly PULO.PH — plain pixel dot, no icons. Deterministic window.seek(t).
'use strict';

const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);

/* ---- glyphs on a 3x5 cell grid ---- */
const G = {
  P: ['XXX', 'X.X', 'XXX', 'X..', 'X..'],
  U: ['X.X', 'X.X', 'X.X', 'X.X', 'XXX'],
  L: ['X..', 'X..', 'X..', 'X..', 'XXX'],
  O: ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'],
  H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'],
  dot: ['X'],
  cross: ['.X.', 'XXX', '.X.'],
  bar: ['X', 'X', 'X'],
  block: ['XX', 'XX'],
  step: ['X.', 'XX'],
};

function glyph(id, name, cell, cls = '') {
  const rows = G[name];
  const w = rows[0].length * cell, h = rows.length * cell;
  let cells = '', ci = 0;
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === 'X') { cells += `<i class="cell" data-ci="${ci}" data-x="${x}" data-y="${y}" style="left:${x * cell}px;top:${y * cell}px;width:${cell}px;height:${cell}px"></i>`; ci++; }
    });
  });
  return `<div class="gwrap" id="${id}w"><div class="glyph ${cls}" id="${id}" data-n="${ci}" style="width:${w}px;height:${h}px">${cells}</div></div>`;
}

function buildHTML() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#020204;overflow:hidden;font-family:sans-serif}
#cam{position:absolute;inset:0;will-change:transform}
.scene{position:absolute;inset:0;opacity:0;will-change:opacity}

.gwrap{position:absolute;will-change:transform,opacity}
.glyph{position:relative;will-change:transform,opacity,filter;transform-origin:50% 100%}
.cell{position:absolute;display:block;background:var(--c,#fff);opacity:0;
  background-image:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0 18%, rgba(255,255,255,0) 40%);
  background-size:12px 12px}
.wire{position:absolute;border:2px solid rgba(255,60,60,0.75);opacity:0;will-change:opacity,transform;
  box-shadow:0 0 14px rgba(255,60,60,0.25), inset 0 0 14px rgba(255,60,60,0.12)}

.streaks{position:absolute;inset:0;pointer-events:none}
.streak{position:absolute;left:50%;top:50%;opacity:0;mix-blend-mode:screen;will-change:transform,opacity,filter}

#flash{position:absolute;inset:0;background:#fff;opacity:0;z-index:75;pointer-events:none}

#endcard{background:#F2EFE7}
#endcard .cell{background-image:none}
.cap{position:absolute;font-size:25px;letter-spacing:0.6em;font-weight:600;color:rgba(23,23,26,0.65);opacity:0;white-space:nowrap}
.scan{position:absolute;inset:0;z-index:70;pointer-events:none;opacity:0.16;
  background:repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 5px)}
.vig{position:absolute;inset:0;z-index:71;pointer-events:none;background:radial-gradient(120% 100% at 50% 46%, transparent 52%, rgba(0,0,0,0.55) 100%)}
.vig.lite{background:radial-gradient(120% 100% at 50% 46%, transparent 60%, rgba(30,25,12,0.18) 100%)}
.grain{position:absolute;inset:-20px;z-index:72;pointer-events:none;background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.06;mix-blend-mode:overlay}
</style></head>
<body>
<div id="stage">
  <div id="cam">

    <div class="scene" id="scA">
      <div class="wire" id="w1" style="left:150px;top:640px;width:180px;height:180px"></div>
      <div class="wire" id="w2" style="left:470px;top:700px;width:150px;height:150px"></div>
      <div class="wire" id="w3" style="left:740px;top:610px;width:200px;height:260px"></div>
      ${glyph('a1', 'cross', 82)}
      ${glyph('a2', 'block', 78)}
      ${glyph('a3', 'step', 84)}
    </div>

    <div class="scene" id="scB">
      ${glyph('b1', 'step', 66)}
      ${glyph('b2', 'bar', 60)}
      ${glyph('b3', 'cross', 72)}
      ${glyph('b4', 'block', 68)}
      ${glyph('b5', 'L', 52)}
    </div>

    <div class="streaks" id="scC"></div>

    <div class="scene" id="scD">
      ${glyph('dP', 'P', 62)}
      ${glyph('dU', 'U', 62)}
      ${glyph('dL', 'L', 62)}
      ${glyph('dO', 'O', 62)}
      ${glyph('dDot', 'dot', 44)}
      ${glyph('dp2', 'P', 36)}
      ${glyph('dh2', 'H', 36)}
    </div>

    <div class="scene" id="endcard">
      ${glyph('eP', 'P', 56)}
      ${glyph('eU', 'U', 56)}
      ${glyph('eL', 'L', 56)}
      ${glyph('eO', 'O', 56)}
      ${glyph('eDot', 'dot', 40)}
      ${glyph('ep2', 'P', 30)}
      ${glyph('eh2', 'H', 30)}
      <div class="cap" id="cap">P U L O . P H</div>
    </div>

  </div>
  <div id="flash"></div>
  <div class="scan" id="scan"></div>
  <div class="vig" id="vig"></div>
  <div class="grain"></div>
</div>
<script>
const S=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,t0,t1)=>clamp((t-t0)/(t1-t0));
const eOut=x=>1-Math.pow(1-x,3);
const eIn=x=>x*x*x;
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const eEl=x=>x<=0?0:x>=1?1:Math.pow(2,-10*x)*Math.sin((x*10-0.75)*2.0944)+1;
const lerp=(a,b,x)=>a+(b-a)*x;
const pulse=(t,sp)=>0.5+0.5*Math.sin(t*sp);
const hash=i=>{let h=(i*2654435761)>>>0;h^=h>>13;h=(h*2246822519)>>>0;return (h>>>8)/16777216;}

function boot(p,seedI,t){
  if(p<=0)return 0; if(p>=1)return 1;
  const n=Math.sin(t*53+seedI*17.3)+Math.sin(t*91+seedI*7.7)*0.6;
  return n > lerp(1.4,-1.6,p) ? 1 : 0.06;
}
// per-cell staggered pop + LED shimmer once lit
function cells(gid,p,mode,t){
  const g=S(gid); if(!g)return; const n=+g.dataset.n;
  g.querySelectorAll('.cell').forEach(c=>{
    const ci=+c.dataset.ci, r=hash(ci*7+gid.charCodeAt(0)*31+gid.charCodeAt(1));
    const lp=clamp((p - r*0.5)/0.5);
    let o;
    if(mode==='boot') o=boot(lp,ci+n,t);
    else if(mode==='pop'){o=lp>0?1:0;c.style.transform='scale('+(lp>0?lerp(1.5,1,eOut(lp)):0)+')';}
    else o=lp;
    if(o>=1 && mode==='boot') o=0.9+0.1*Math.sin(t*7+ci*2.1+r*9); // shimmer
    c.style.opacity=o;
  });
}
function setG(id,x,y,col,glow,extra,hue){const w=S(id+'w'),g=S(id);
  w.style.left=x+'px';w.style.top=y+'px';w.style.transform=extra||'';
  if(col)g.querySelectorAll('.cell').forEach(c=>{c.style.background=col;});
  let f='';
  if(hue)f+='hue-rotate('+hue+'deg) ';
  if(glow)f+='drop-shadow(0 0 '+glow+'px '+(col||'#fff')+') drop-shadow(0 0 '+(glow*2.2)+'px '+(col||'#fff')+'55)';
  g.style.filter=f;}
function gT(id,tr,op){const g=S(id);g.style.transform=tr;if(op!=null)g.style.opacity=op;}
const bob=(t,i)=>Math.sin(t*2.1+i*1.7)*9;
// hop wave: periodic jump w/ squash, staggered by index
function hop(t,i,period,amp){const ph=((t/period + 10 - i*0.14)%1);
  if(ph>0.22)return {y:0,sx:1,sy:1};
  const p=ph/0.22, arc=Math.sin(p*Math.PI);
  return {y:-arc*amp, sx:1+0.08*Math.sin(p*Math.PI*2), sy:1-0.10*Math.sin(p*Math.PI*2)};}
// entrance: fly from off-screen with stretch, elastic settle
function flyIn(p,fromX){const m=eEl(p);return {x:lerp(fromX,0,m), sx:lerp(2.6,1,eOut(p)), sy:lerp(0.5,1,eOut(p))};}

const PINK='#FF4FA0', GOLD='#FFC53D', CYAN='#3ED4FF', BLUE='#5B74FF', VIOLET='#B36BFF';

(function(){const host=S('scC');const cols=[PINK,'#FF8A3D',CYAN,GOLD,VIOLET,'#fff'];
 for(let i=0;i<14;i++){const d=document.createElement('div');d.className='streak';const c=cols[i%cols.length];
  const h=10+hash(i)*46, w=500+hash(i+40)*560;
  d.style.width=w+'px';d.style.height=h+'px';d.style.background='linear-gradient(90deg,transparent, '+c+', transparent)';
  d.dataset.i=i;host.appendChild(d);}})();

const A=[0.15,3.0], B=[2.85,6.35], C=[6.15,8.05], D=[7.6,12.65], E=[12.65,17.1];

window.seek=function(t){
  // ---- camera: per-beat push + micro-rotate, shake in the whip ----
  let cx=0, cy=0, cs=1, cr=0;
  if(t<B[1]){cs=lerp(1.08,1.0,eOut(seg(t,0,4)));cx=Math.sin(t*0.4)*10;cr=lerp(-1.2,0,eOut(seg(t,0,3)));}
  if(t>C[0]&&t<C[1]){const w=seg(t,C[0],C[1]);cx+=Math.sin(w*Math.PI)*-140*(w<0.5?1:0.4);cs=1+Math.sin(w*Math.PI)*0.12;cr=Math.sin(w*Math.PI*2)*1.2;}
  if(t>=D[0]&&t<D[1]){cs=lerp(1.06,1.0,eOut(seg(t,D[0]+0.3,D[0]+1.6)));cy=Math.sin(t*0.5)*8;cr=lerp(1.0,0,eOut(seg(t,D[0]+0.3,D[0]+1.8)));}
  if(t>=E[0]){cs=lerp(1.06,1.0,eOut(seg(t,E[0],E[0]+1.6)));cx=Math.sin(t*0.3)*6;cr=lerp(-0.7,0,eOut(seg(t,E[0],E[0]+1.4)));}
  if(t>C[0]+0.2&&t<C[1]-0.2){cx+=(hash(Math.floor(t*60))-0.5)*30;cy+=(hash(Math.floor(t*60)+9)-0.5)*30;}
  S('cam').style.transform='translate('+cx+'px,'+cy+'px) rotate('+cr+'deg) scale('+cs+')';

  const oA=clamp(seg(t,A[0],A[0]+0.2)-seg(t,A[1]-0.25,A[1]));
  const oB=clamp(seg(t,B[0],B[0]+0.25)-seg(t,C[0]+0.45,C[0]+0.8));
  const oD=clamp(seg(t,D[0]+0.25,D[0]+0.5)-(t>=E[0]?1:0));
  const oE=t>=E[0]?1:0;
  S('scA').style.opacity=oA; S('scB').style.opacity=oB; S('scD').style.opacity=oD;
  S('endcard').style.opacity=oE;
  S('stage').style.background = oE? '#F2EFE7' : '#020204';
  S('scan').style.opacity = oE? 0.05 : 0.16;
  S('vig').className = oE? 'vig lite' : 'vig';
  // white flash on the hard cut into the end card
  const fd=Math.abs(t-E[0]); S('flash').style.opacity = t>E[0]-0.06&&t<E[0]+0.14 ? lerp(0.95,0,seg(t,E[0],E[0]+0.14)) : 0;

  // ---------- A: wireframes + boot, then zip-out with smear ----------
  if(oA>0.001){
    const ex=eIn(seg(t,A[1]-0.4,A[1]-0.05)); // exit progress
    [['w1',0.2],['w2',0.45],['w3',0.7]].forEach(([id,d],i)=>{const w=S(id);
      w.style.opacity=clamp(seg(t,d,d+0.25))*(0.55+0.45*Math.sin(t*9+i))*(1-ex);
      w.style.transform='translateY('+Math.sin(t*1.3+i)*6+'px)';});
    const zip=-ex*1300;
    setG('a1',168,655,CYAN,26,'translate('+zip+'px,'+bob(t,0)+'px)');
    gT('a1','scaleX('+(1+ex*4)+')');
    cells('a1',seg(t,0.9,2.0),'boot',t);
    setG('a2',480,712,VIOLET,20,'translate('+zip*1.15+'px,'+bob(t,1)+'px)');
    gT('a2','scaleX('+(1+ex*4)+')');
    cells('a2',seg(t,1.3,2.4),'boot',t);
    setG('a3',760,640,PINK,20,'translate('+zip*1.3+'px,'+bob(t,2)+'px)');
    gT('a3','scaleX('+(1+ex*4)+')');
    cells('a3',seg(t,1.6,2.7),'boot',t);
  }

  // ---------- B: parade — shapes slam in from the right, play, then smear out ----------
  if(oB>0.001){const l=t-B[0];
    const Y=760, EX=eIn(seg(l,3.0,3.45)); // accelerate out into the burst
    const defs=[['b1',96,Y+8,PINK,20,0],['b2',300,Y+20,GOLD,18,1],['b3',430,Y-6,CYAN,26,2],['b4',700,Y+10,BLUE,20,3],['b5',880,Y-30,VIOLET,20,4]];
    defs.forEach(([id,x,y,col,gl,i])=>{
      const f=flyIn(seg(l,0.1+i*0.16,0.85+i*0.16),1400);
      const out=EX*1500*(1+i*0.12);
      const h=hop(t,i,2.6,26);
      setG(id,x,y+h.y,col,gl,'translate('+(f.x+out)+'px,'+bob(t,3+i)+'px)');
      // pixel-snap 90° spins on two of the shapes: playful LED rotation
      const spin=(id==='b2'||id==='b4') ? 'rotate('+(Math.floor((t*0.8+i)%4)*90)+'deg) ' : '';
      gT(id,spin+'scaleX('+((1+EX*5)*f.sx*h.sx)+') scaleY('+(f.sy*h.sy)+')');
      cells(id,seg(l,0.15+i*0.16,0.8+i*0.16),'boot',t);
    });
  }

  // ---------- C: chromatic smear ----------
  {const w=seg(t,C[0],C[1]);const on=w>0&&w<1;
   document.querySelectorAll('.streak').forEach(el=>{const i=+el.dataset.i;
    if(!on){el.style.opacity=0;return;}
    const ph=Math.sin(w*Math.PI);
    const y=(hash(i+3)-0.5)*900*lerp(0.4,1,ph), x=(hash(i+11)-0.5)*400 - lerp(600,-600,w)*0.4;
    el.style.opacity=ph*(0.5+hash(i)*0.5);
    el.style.transform='translate(-50%,-50%) translate('+x+'px,'+y+'px) scaleX('+lerp(0.5,3.6,ph)+') scaleY('+lerp(0.6,1.6,ph)+')';
    el.style.filter='blur('+lerp(2,10,ph)+'px)';});
  }

  // ---------- D: PULO.PH — letters land from the smear, then PLAY ----------
  if(oD>0.001){const l=t-D[0];
    const X0=132, Y=800, adv=214;
    const L=[['dP',X0,PINK,0],['dU',X0+adv,GOLD,1],['dL',X0+adv*2,CYAN,2],['dO',X0+adv*3,BLUE,3]];
    L.forEach(([id,x,col,i])=>{
      const ep=seg(l,0.35+i*0.22,1.15+i*0.22);
      const f=flyIn(ep, i%2? 1500:-1500);
      const h=hop(t,i,3.1,30);
      // glitch blink: brief window per glyph, deterministic
      const gw=hash(Math.floor(t*1.4)+i*13);
      const blink=(gw>0.86 && ep>=1)? (Math.sin(t*70+i)>0?1:0.35):1;
      setG(id,x,Y+h.y,col,24,'translate('+f.x+'px,'+bob(t,i*1.2)+'px)',Math.sin(t*0.9+i)*8);
      gT(id,'scaleX('+(f.sx*h.sx)+') scaleY('+(f.sy*h.sy)+')',blink);
      cells(id,ep,'boot',t);
    });
    // dot + PH bounce in under the O — plain square dot
    const dp=seg(l,1.6,2.2), hp=seg(l,1.8,2.4), hp2=seg(l,1.95,2.55);
    const bD=eEl(dp), bP=eEl(hp), bH=eEl(hp2);
    const h5=hop(t,4,3.1,20), h6=hop(t,5,3.1,20), h7=hop(t,6,3.1,20);
    setG('dDot',X0+adv*2+58,Y+392+lerp(-700,0,bD)*0+h5.y,GOLD,18,'translateY('+(lerp(-500,0,bD)+bob(t,5))+'px)');
    gT('dDot','scale('+lerp(0.2,1,bD)+') scaleX('+h5.sx+') scaleY('+h5.sy+')',dp>0?1:0);
    cells('dDot',dp,'pop',t);
    setG('dp2',X0+adv*2+164,Y+330+h6.y,'#EDEDF2',14,'translateY('+(lerp(-560,0,bP)+bob(t,6))+'px)');
    gT('dp2','scaleX('+h6.sx+') scaleY('+h6.sy+')',hp>0?1:0);
    cells('dp2',hp,'boot',t);
    setG('dh2',X0+adv*2+312,Y+330+h7.y,'#EDEDF2',14,'translateY('+(lerp(-560,0,bH)+bob(t,7))+'px)');
    gT('dh2','scaleX('+h7.sx+') scaleY('+h7.sy+')',hp2>0?1:0);
    cells('dh2',hp2,'boot',t);
  }

  // ---------- E: end card — squash-snap print, then playful settle ----------
  if(oE>0.001){const l=t-E[0];
    const X0=170, Y=800, adv=194, ink='#17171a';
    [['eP',X0,0],['eU',X0+adv,1],['eL',X0+adv*2,2],['eO',X0+adv*3,3]].forEach(([id,x,i])=>{
      const ep=seg(l,0.04+i*0.1,0.5+i*0.1);
      const sc=eEl(ep);
      const h=l>1.4? hop(t,i,3.4,16):{y:0,sx:1,sy:1};
      setG(id,x,Y+h.y,ink,0,'');
      gT(id,'scale('+lerp(1.55,1,sc)+') scaleX('+h.sx+') scaleY('+h.sy+')',ep>0?1:0);
      cells(id,ep,'pop',t);
    });
    const dp=seg(l,0.5,0.85), pp=seg(l,0.62,1.0), hh=seg(l,0.74,1.12);
    const h5=l>1.6?hop(t,4.4,3.4,12):{y:0,sx:1,sy:1};
    setG('eDot',X0+adv*2+70,Y+338+h5.y,'#17171a',0,'translateY('+lerp(-420,0,eEl(dp))+'px)');
    gT('eDot','scale('+lerp(0.3,1,eEl(dp))+')',dp>0?1:0); cells('eDot',dp,'pop',t);
    const h6=l>1.6?hop(t,5.2,3.4,12):{y:0,sx:1,sy:1}, h7=l>1.6?hop(t,6,3.4,12):{y:0,sx:1,sy:1};
    setG('ep2',X0+adv*2+168,Y+300+h6.y,ink,0,'translateX('+lerp(600,0,eEl(pp))+'px)');
    gT('ep2','scaleX('+h6.sx+') scaleY('+h6.sy+')',pp>0?1:0); cells('ep2',pp,'pop',t);
    setG('eh2',X0+adv*2+296,Y+300+h7.y,ink,0,'translateX('+lerp(700,0,eEl(hh))+'px)');
    gT('eh2','scaleX('+h7.sx+') scaleY('+h7.sy+')',hh>0?1:0); cells('eh2',hh,'pop',t);
    const cap=S('cap'); cap.style.left=X0+'px'; cap.style.top=(Y+560)+'px';
    const full='P U L O . P H';
    const tp=seg(l,1.5,2.3); cap.style.opacity=eOut(seg(l,1.5,1.8));
    cap.textContent=full.slice(0, Math.ceil(tp*full.length));
  }
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
