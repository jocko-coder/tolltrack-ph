// Perla.ai carousel montage — cinematic gliding slideshow (~20s, 9:16, 60fps).
// The nine macro shots drift (Ken Burns) over a soft blurred backdrop of the
// same shot and cross-dissolve into one another — one continuous flowing video.
// Sources are the 3x masters so the pan/zoom stays razor sharp. No text.
'use strict';

const MASTERS = 'file:///home/user/tolltrack-ph/perla-carousel/out/masters';
const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(#n)'/></svg>`
);

// Ken Burns per shot — each either opens or lands on the full composition
// (scale 1.0, no pan) then glides. Pan in px, kept within the zoom's headroom.
const KB = [
  { s0: 1.00, s1: 1.10, x0: 0, x1: -20, y0: 0, y1: -14 },
  { s0: 1.10, s1: 1.00, x0: 18, x1: 0, y0: 12, y1: 0 },
  { s0: 1.00, s1: 1.10, x0: 0, x1: 20, y0: 0, y1: 8 },
  { s0: 1.10, s1: 1.00, x0: -16, x1: 0, y0: 14, y1: 0 },
  { s0: 1.00, s1: 1.11, x0: 0, x1: -18, y0: 0, y1: 12 },
  { s0: 1.11, s1: 1.00, x0: 14, x1: 0, y0: -16, y1: 0 },
  { s0: 1.00, s1: 1.10, x0: 0, x1: 0, y0: 0, y1: 16 },
  { s0: 1.10, s1: 1.00, x0: -18, x1: 0, y0: 10, y1: 0 },
  { s0: 1.00, s1: 1.12, x0: 0, x1: -12, y0: 0, y1: -10 },
];

function buildHTML() {
  let slides = '';
  for (let i = 1; i <= 9; i++) {
    const src = `${MASTERS}/perla-carousel-${String(i).padStart(2, '0')}.png`;
    slides += `<div class="slide" data-i="${i - 1}"><img class="bg" src="${src}"><div class="fgbox"><img class="fg" src="${src}"></div></div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
#stage{position:relative;width:1080px;height:1920px;background:#04100f;overflow:hidden}
.slide{position:absolute;inset:0;opacity:0;will-change:opacity}
.bg{position:absolute;left:50%;top:50%;width:1180px;height:2100px;transform:translate(-50%,-50%) scale(1.25);
  object-fit:cover;filter:blur(56px) brightness(0.42) saturate(1.2);will-change:transform}
.fgbox{position:absolute;left:50%;top:50%;width:1080px;height:1350px;transform:translate(-50%,-50%);
  overflow:hidden;box-shadow:0 50px 130px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)}
.fg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform}
.edgeglow{position:absolute;left:50%;top:50%;width:1180px;height:1460px;transform:translate(-50%,-50%);
  pointer-events:none;z-index:60;box-shadow:inset 0 0 120px 40px rgba(4,16,15,0.75)}
.vig{position:absolute;inset:0;z-index:61;pointer-events:none;background:radial-gradient(125% 100% at 50% 50%, transparent 58%, rgba(0,0,0,0.5) 100%)}
.grain{position:absolute;inset:-20px;z-index:62;pointer-events:none;background-image:url("data:image/svg+xml,${GRAIN}");background-size:260px 260px;opacity:0.045;mix-blend-mode:overlay}
</style></head>
<body>
<div id="stage">
  ${slides}
  <div class="edgeglow"></div>
  <div class="vig"></div>
  <div class="grain"></div>
</div>
<script>
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,x)=>a+(b-a)*x;
const smooth=x=>x*x*(3-2*x);            // gentle ease on the dissolve
const KB=${JSON.stringify(KB)};
const N=9, STEP=2.15, FADE=0.62;
const slides=[...document.querySelectorAll('.slide')];

window.seek=function(t){
  slides.forEach((el,i)=>{
    const A=i*STEP, B=A+STEP+FADE;
    const op=clamp((t-A)/FADE)-clamp((t-(B-FADE))/FADE);
    el.style.opacity=smooth(clamp(op));
    if(op<=0.002){ return; }
    const p=clamp((t-A)/(B-A));         // 0..1 across the shot's full life (linear glide)
    const k=KB[i];
    const sc=lerp(k.s0,k.s1,p), px=lerp(k.x0,k.x1,p), py=lerp(k.y0,k.y1,p);
    el.querySelector('.fg').style.transform='translate('+px+'px,'+py+'px) scale('+sc+')';
    el.querySelector('.bg').style.transform='translate(calc(-50% + '+(-px*0.5)+'px), calc(-50% + '+(-py*0.5)+'px)) scale('+lerp(1.22,1.32,p)+')';
  });
};
window.seek(0);
</script>
</body></html>`;
}

module.exports = { buildHTML };
