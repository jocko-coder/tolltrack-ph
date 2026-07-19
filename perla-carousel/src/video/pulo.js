// PULO.PH — pixel/LED logo animation (~17.1s, 9:16, 60fps).
// Technique study of the reference: wireframe guides on black → LED-matrix
// blocks flicker-boot (dot-grid + bloom) → chunky glyph parade bobbing →
// chromatic RGB smear-whip → warm-white end card, glyphs as flat black print.
// Original twist: the "." of PULO.PH is a pixel Philippine sun; a tiny 8-bit
// palm island cameos on the end card. Deterministic window.seek(t).
'use strict';

const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);

/* ---- glyphs on a 3x5 cell grid (1 = lit cell) ---- */
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

// build one glyph's cell divs; cells carry data-ci for deterministic stagger
function glyph(id, name, cell, cls = '') {
  const rows = G[name];
  const w = rows[0].length * cell, h = rows.length * cell;
  let cells = '', ci = 0;
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === 'X') { cells += `<i class="cell" data-ci="${ci}" style="left:${x * cell}px;top:${y * cell}px;width:${cell}px;height:${cell}px"></i>`; ci++; }
    });
  });
  return `<div class="glyph ${cls}" id="${id}" data-n="${ci}" style="width:${w}px;height:${h}px">${cells}</div>`;
}

// pixel sun: center block + 8 rays (its own mini-grid)
function sun(id, cell) {
  const pts = [[1,1],[2,1],[1,2],[2,2],[1.5,-0.4],[1.5,3.4],[-0.4,1.5],[3.4,1.5],[0.1,0.1],[2.9,0.1],[0.1,2.9],[2.9,2.9]];
  let cells = '';
  pts.forEach(([x, y], i) => {
    const s = i < 4 ? cell : cell * 0.55;
    cells += `<i class="cell" data-ci="${i}" style="left:${x * cell - (i < 4 ? 0 : s / 2) + (i < 4 ? 0 : cell / 2)}px;top:${y * cell - (i < 4 ? 0 : s / 2) + (i < 4 ? 0 : cell / 2)}px;width:${s}px;height:${s}px"></i>`;
  });
  return `<div class="glyph sun" id="${id}" data-n="${pts.length}" style="width:${cell * 4}px;height:${cell * 4}px">${cells}</div>`;
}

// tiny 8-bit palm island (cells: sand, trunk, fronds)
function island(id, c) {
  const cells = [
    // sand
    [0,4,'#E8C77D'],[1,4,'#F2D48F'],[2,4,'#F2D48F'],[3,4,'#E8C77D'],[1,3.5,'#F2D48F'],[2,3.5,'#F2D48F'],
    // trunk
    [1.6,2.6,'#8A5A33'],[1.7,1.8,'#8A5A33'],
    // fronds
    [0.7,1.1,'#2FA65A'],[1.6,0.7,'#2FA65A'],[2.5,1.1,'#2FA65A'],[0.9,1.9,'#38BF68'],[2.3,1.9,'#38BF68'],
  ];
  let out = '';
  cells.forEach(([x, y, col], i) => {
    out += `<i class="cell isl" data-ci="${i}" style="left:${x * c}px;top:${y * c}px;width:${c * 0.9}px;height:${c * 0.9}px;background:${col}"></i>`;
  });
  return `<div class="glyph island" id="${id}" data-n="${cells.length}" style="width:${c * 4}px;height:${c * 5}px">${out}</div>`;
}

function buildHTML() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#020204;overflow:hidden;font-family:sans-serif}
#cam{position:absolute;inset:0;will-change:transform}
.scene{position:absolute;inset:0;opacity:0;will-change:opacity}

.glyph{position:absolute;will-change:transform,opacity,filter}
.cell{position:absolute;display:block;background:var(--c,#fff);opacity:0;
  background-image:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0 18%, rgba(255,255,255,0) 40%);
  background-size:12px 12px}
.wire{position:absolute;border:2px solid rgba(255,60,60,0.75);opacity:0;will-change:opacity,transform;
  box-shadow:0 0 14px rgba(255,60,60,0.25), inset 0 0 14px rgba(255,60,60,0.12)}

/* smear streak copies (cheap chromatic motion smear: stretched hue-shifted clones) */
.streaks{position:absolute;inset:0;pointer-events:none}
.streak{position:absolute;left:50%;top:50%;opacity:0;mix-blend-mode:screen;will-change:transform,opacity,filter}

/* ---- end card ---- */
#endcard{background:#F2EFE7}
#endcard .cell{background-image:none}
.cap{position:absolute;font-size:26px;letter-spacing:0.62em;font-weight:600;color:#17171a;opacity:0;white-space:nowrap}
.scan{position:absolute;inset:0;z-index:70;pointer-events:none;opacity:0.16;
  background:repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 5px)}
.vig{position:absolute;inset:0;z-index:71;pointer-events:none;background:radial-gradient(120% 100% at 50% 46%, transparent 52%, rgba(0,0,0,0.55) 100%)}
.vig.lite{background:radial-gradient(120% 100% at 50% 46%, transparent 60%, rgba(30,25,12,0.18) 100%)}
.grain{position:absolute;inset:-20px;z-index:72;pointer-events:none;background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.06;mix-blend-mode:overlay}
</style></head>
<body>
<div id="stage">
  <div id="cam">

    <!-- A: wireframes + boot -->
    <div class="scene" id="scA">
      <div class="wire" id="w1" style="left:150px;top:640px;width:180px;height:180px"></div>
      <div class="wire" id="w2" style="left:470px;top:700px;width:150px;height:150px"></div>
      <div class="wire" id="w3" style="left:740px;top:610px;width:200px;height:260px"></div>
      ${glyph('a1', 'cross', 82)}
      ${glyph('a2', 'block', 78)}
      ${glyph('a3', 'step', 84)}
    </div>

    <!-- B: abstract parade -->
    <div class="scene" id="scB">
      ${glyph('b1', 'step', 66)}
      ${glyph('b2', 'bar', 60)}
      ${glyph('b3', 'cross', 72)}
      ${glyph('b4', 'block', 68)}
      ${glyph('b5', 'L', 52)}
    </div>

    <!-- C: streak burst -->
    <div class="streaks" id="scC"></div>

    <!-- D: PULO.PH lineup (dark, LED) -->
    <div class="scene" id="scD">
      ${glyph('dP', 'P', 62)}
      ${glyph('dU', 'U', 62)}
      ${glyph('dL', 'L', 62)}
      ${glyph('dO', 'O', 62)}
      ${sun('dS', 26)}
      ${glyph('dp2', 'P', 34)}
      ${glyph('dh2', 'H', 34)}
    </div>

    <!-- E: white end card -->
    <div class="scene" id="endcard">
      ${glyph('eP', 'P', 56)}
      ${glyph('eU', 'U', 56)}
      ${glyph('eL', 'L', 56)}
      ${glyph('eO', 'O', 56)}
      ${sun('eS', 23)}
      ${glyph('ep2', 'P', 30)}
      ${glyph('eh2', 'H', 30)}
      ${island('eI', 26)}
      <div class="cap" id="cap1">P U L O . P H</div>
      <div class="cap" id="cap2" style="letter-spacing:0.4em;font-size:22px;color:rgba(23,23,26,0.55)">I S L A N D&nbsp;&nbsp;P I X E L S</div>
    </div>

  </div>
  <div class="scan" id="scan"></div>
  <div class="vig" id="vig"></div>
  <div class="grain"></div>
</div>
<script>
const S=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const seg=(t,t0,t1)=>clamp((t-t0)/(t1-t0));
const eOut=x=>1-Math.pow(1-x,3);
const eBack=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
const hash=i=>{let h=(i*2654435761)>>>0;h^=h>>13;h=(h*2246822519)>>>0;return (h>>>8)/16777216;}

// deterministic LED flicker that resolves on
function boot(p,seedI,t){
  if(p<=0)return 0; if(p>=1)return 1;
  const n=Math.sin(t*53+seedI*17.3)+Math.sin(t*91+seedI*7.7)*0.6;
  return n > lerp(1.4,-1.6,p) ? 1 : 0.06;
}
// per-cell staggered pop (pixel assembly)
function cells(gid,p,mode,t){
  const g=S(gid); if(!g)return; const n=+g.dataset.n;
  g.querySelectorAll('.cell').forEach(c=>{
    const ci=+c.dataset.ci, r=hash(ci*7+gid.charCodeAt(0)*31+gid.charCodeAt(1));
    const lp=clamp((p - r*0.55)/0.45);
    c.style.opacity = mode==='boot' ? boot(lp,ci+n,t) : (mode==='pop' ? (lp>0? 1:0) : lp);
    if(mode==='pop') c.style.transform='scale('+(lp>0?lerp(1.6,1,eOut(lp)):0)+')';
  });
}
function setG(id,x,y,col,glow,extra){const g=S(id);g.style.left=x+'px';g.style.top=y+'px';
  if(col)g.style.setProperty('--c',col);g.querySelectorAll('.cell').forEach(c=>{if(col&&!c.classList.contains('isl'))c.style.background=col;});
  if(glow!=null)g.style.filter='drop-shadow(0 0 '+glow+'px '+(col||'#fff')+') drop-shadow(0 0 '+(glow*2.2)+'px '+(col||'#fff')+'55)';
  if(extra)g.style.transform=extra;}
const bob=(t,i)=>Math.sin(t*2.1+i*1.7)*9;

// palette
const PINK='#FF4FA0', GOLD='#FFC53D', CYAN='#3ED4FF', BLUE='#5B74FF', VIOLET='#B36BFF', RED='#FF4D5E';

// build streaks once
(function(){const host=S('scC');const cols=[PINK,'#FF8A3D',CYAN,GOLD,VIOLET,'#fff'];
 for(let i=0;i<14;i++){const d=document.createElement('div');d.className='streak';const c=cols[i%cols.length];
  const h=10+hash(i)*46, w=500+hash(i+40)*560;
  d.style.width=w+'px';d.style.height=h+'px';d.style.background='linear-gradient(90deg,transparent, '+c+', transparent)';
  d.dataset.i=i;host.appendChild(d);}})();

// timeline
const A=[0.15,3.1], B=[2.9,6.4], C=[6.2,8.1], D=[7.7,12.7], E=[12.7,17.1];

window.seek=function(t){
  // camera
  let cx=0, cy=0, cs=1;
  if(t<B[1]){cs=lerp(1.07,1.0,eOut(seg(t,0,4)));cx=Math.sin(t*0.4)*10;}
  if(t>C[0]&&t<C[1]){const w=seg(t,C[0],C[1]);cx+=Math.sin(w*Math.PI)* -120*(w<0.5?1:0.4); cs=1+Math.sin(w*Math.PI)*0.10;}
  if(t>=D[0]&&t<D[1]){cs=lerp(1.05,1.0,eOut(seg(t,D[0],D[0]+1.2)));cy=Math.sin(t*0.5)*8;}
  if(t>=E[0]){cs=lerp(1.05,1.0,eOut(seg(t,E[0],E[0]+1.4)));cx=Math.sin(t*0.3)*6;}
  // micro-jitter during smear
  if(t>C[0]+0.2&&t<C[1]-0.2){cx+=(hash(Math.floor(t*60))-0.5)*26;cy+=(hash(Math.floor(t*60)+9)-0.5)*26;}
  S('cam').style.transform='translate('+cx+'px,'+cy+'px) scale('+cs+')';

  const oA=clamp(seg(t,A[0],A[0]+0.2)-seg(t,A[1]-0.3,A[1]));
  const oB=clamp(seg(t,B[0],B[0]+0.3)-seg(t,C[0]+0.5,C[0]+0.9));
  const oD=clamp(seg(t,D[0]+0.3,D[0]+0.6)-seg(t,E[0]-0.06,E[0]));
  const oE=t>=E[0]?1:0;
  S('scA').style.opacity=oA; S('scB').style.opacity=oB; S('scD').style.opacity=oD;
  S('endcard').style.opacity=oE;
  S('stage').style.background = oE? '#F2EFE7' : '#020204';
  S('scan').style.opacity = oE? 0.05 : 0.16;
  S('vig').className = oE? 'vig lite' : 'vig';

  // ---------- A: wireframes + boot ----------
  if(oA>0.001){
    [['w1',0.2],['w2',0.45],['w3',0.7]].forEach(([id,d],i)=>{const w=S(id);
      w.style.opacity=clamp(seg(t,d,d+0.25))*(0.55+0.45*Math.sin(t*9+i)); w.style.transform='translateY('+Math.sin(t*1.3+i)*6+'px)';});
    setG('a1',168,655,CYAN,26,'translateY('+bob(t,0)+'px)'); cells('a1',seg(t,0.9,2.0),'boot',t);
    setG('a2',480,712,VIOLET,20,'translateY('+bob(t,1)+'px)'); cells('a2',seg(t,1.3,2.4),'boot',t);
    setG('a3',760,640,PINK,20,'translateY('+bob(t,2)+'px)'); cells('a3',seg(t,1.6,2.7),'boot',t);
  }

  // ---------- B: parade ----------
  if(oB>0.001){const l=t-B[0];
    const Y=760;
    setG('b1',96,Y+8,PINK,20,'translateY('+bob(t,3)+'px)');
    setG('b2',300,Y+20,GOLD,18,'translateY('+bob(t,4)+'px)');
    setG('b3',430,Y-6,CYAN,26,'translateY('+bob(t,5)+'px)');
    setG('b4',700,Y+10,BLUE,20,'translateY('+bob(t,6)+'px)');
    setG('b5',880,Y-30,VIOLET,20,'translateY('+bob(t,7)+'px)');
    ['b1','b2','b3','b4','b5'].forEach((id,i)=>cells(id,seg(l,0.1+i*0.22,0.7+i*0.22),'boot',t));
  }

  // ---------- C: chromatic smear ----------
  {const w=seg(t,C[0],C[1]);const on=w>0&&w<1;
   document.querySelectorAll('.streak').forEach(el=>{const i=+el.dataset.i;
    if(!on){el.style.opacity=0;return;}
    const ph=Math.sin(w*Math.PI);
    const y=(hash(i+3)-0.5)*900*lerp(0.4,1,ph), x=(hash(i+11)-0.5)*400;
    el.style.opacity=ph*(0.5+hash(i)*0.5);
    el.style.transform='translate('+(-50+x/10)+'%,-50%) translate('+x+'px,'+y+'px) scaleX('+lerp(0.6,3.4,ph)+') scaleY('+lerp(0.6,1.6,ph)+')';
    el.style.filter='blur('+lerp(2,10,ph)+'px)';});
  }

  // ---------- D: PULO.PH LED lineup ----------
  if(oD>0.001){const l=t-D[0];
    const X0=132, Y=800, adv=214;
    setG('dP',X0,Y,PINK,24,'translateY('+bob(t,0)+'px)');
    setG('dU',X0+adv,Y,GOLD,24,'translateY('+bob(t,1.2)+'px)');
    setG('dL',X0+adv*2,Y,CYAN,24,'translateY('+bob(t,2.4)+'px)');
    setG('dO',X0+adv*3,Y,BLUE,24,'translateY('+bob(t,3.6)+'px)');
    setG('dS',X0+adv*2+40,Y+380,GOLD,20,'translateY('+bob(t,4.2)+'px) rotate('+Math.sin(t*0.9)*8+'deg)');
    setG('dp2',X0+adv*2+180,Y+370,'#EDEDF2',14,'translateY('+bob(t,5)+'px)');
    setG('dh2',X0+adv*2+320,Y+370,'#EDEDF2',14,'translateY('+bob(t,6)+'px)');
    ['dP','dU','dL','dO'].forEach((id,i)=>cells(id,seg(l,0.35+i*0.3,1.15+i*0.3),'boot',t));
    cells('dS',seg(l,1.9,2.6),'pop',t); cells('dp2',seg(l,2.2,2.8),'boot',t); cells('dh2',seg(l,2.4,3.0),'boot',t);
  }

  // ---------- E: end card ----------
  if(oE>0.001){const l=t-E[0];
    const X0=170, Y=790, adv=194;
    const ink='#17171a';
    setG('eP',X0,Y,ink,0,'');
    setG('eU',X0+adv,Y,ink,0,'');
    setG('eL',X0+adv*2,Y,ink,0,'');
    setG('eO',X0+adv*3,Y,ink,0,'');
    // second row: sun-dot + PH (the "." is a pixel Philippine sun)
    setG('eS',X0+adv*2+96,Y+330,'#F5B301',0,'rotate('+lerp(-24,0,eOut(seg(l,0.7,1.3)))+'deg)');
    setG('ep2',X0+adv*2+230,Y+322,ink,0,'');
    setG('eh2',X0+adv*2+352,Y+322,ink,0,'');
    ['eP','eU','eL','eO'].forEach((id,i)=>cells(id,seg(l,0.06+i*0.12,0.4+i*0.12),'pop',t));
    cells('eS',seg(l,0.65,1.05),'pop',t);
    cells('ep2',seg(l,0.85,1.15),'pop',t); cells('eh2',seg(l,0.95,1.25),'pop',t);
    // island cameo bottom-left + caption
    const isl=S('eI'); isl.style.left=X0+'px'; isl.style.top=(Y+560)+'px';
    cells('eI',seg(l,1.6,2.2),'pop',t);
    S('cap1').style.opacity=0;
    const c2=S('cap2'); c2.style.left=(X0+150)+'px'; c2.style.top=(Y+610)+'px';
    const full='I S L A N D   P I X E L S';
    const tp=seg(l,1.9,2.9); c2.style.opacity=eOut(seg(l,1.9,2.2));
    c2.textContent=full.slice(0, Math.ceil(tp*full.length));
  }
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
