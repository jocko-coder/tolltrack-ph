// MASTER D — monochrome sculptural hand holding the phone, screen in full color.
// Hand parts live inside the phone's 3D plane (same perspective transform), so
// fingers/thumb stay registered to the phone edges. Stylized glove-like look.
'use strict';

const CSS_D = `
.hero-stage {
  position: absolute; inset: 0;
  background:
    radial-gradient(120% 90% at 50% 30%, #C7CBCC 0%, #AFB5B6 55%, #969C9E 100%);
}
.hero-shadow {
  position: absolute; left: 50%; top: 64%;
  width: 1100px; height: 460px; margin-left: -520px;
  transform: rotate(-14deg);
  background: radial-gradient(50% 50% at 50% 50%, rgba(25,31,33,0.5) 0%, rgba(25,31,33,0.22) 45%, rgba(25,31,33,0) 72%);
}
.hero-rig { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
.rig-rot { position: absolute; transform: rotate(-16deg); }

/* the whole hand+phone group shares one perspective plane */
.phone3d {
  position: absolute; left: -232px; top: -486px;
  width: 464px; height: 972px;
  transform: perspective(1900px) rotateX(24deg);
}
.phone-body {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #24282C 0%, #101418 45%, #0B0E11 100%);
  border-radius: 78px;
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.35),
    inset 0 -3px 6px rgba(0,0,0,0.6),
    0 60px 90px rgba(20,26,28,0.4);
}
.phone-edge {
  position: absolute; inset: 7px;
  border-radius: 72px;
  background: linear-gradient(160deg, #3A4046 0%, #16191c 30%, #0e1114 100%);
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.25);
}
.phone-screen {
  position: absolute; inset: 17px;
  border-radius: 62px;
  overflow: hidden;
  background: #000;
}
.phone-screen .fit {
  position: absolute; left: 50%; top: 50%;
  width: 430px; height: 932px;
  transform: translate(-50%, -50%);
}
.phone-island {
  position: absolute; top: 34px; left: 50%; transform: translateX(-50%);
  width: 118px; height: 34px; border-radius: 20px;
  background: #05070a;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.08);
  z-index: 5;
}
.phone-sweep {
  position: absolute; inset: 17px; z-index: 6; border-radius: 62px;
  background: linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.06) 44%, rgba(255,255,255,0.085) 50%, rgba(255,255,255,0) 62%);
}
.phone-sidebtn {
  position: absolute; left: -4px; top: 330px; width: 5px; height: 110px;
  border-radius: 3px; background: linear-gradient(90deg, #33383d, #14171a);
}

/* ---- hand parts: smooth monochrome capsules, same plane as phone ---- */
.finger {
  position: absolute;
  border-radius: 999px;
  background: linear-gradient(185deg, #464C4F 0%, #2A2F32 48%, #15181B 100%);
  box-shadow:
    inset 0 4px 8px rgba(255,255,255,0.16),
    inset 0 -8px 14px rgba(0,0,0,0.5),
    0 18px 30px rgba(15,19,21,0.3);
}
.palm {
  position: absolute;
  background: radial-gradient(70% 60% at 40% 35%, #3C4245 0%, #23282B 55%, #121517 100%);
  box-shadow: inset 0 6px 14px rgba(255,255,255,0.1);
}
.wrist {
  position: absolute;
  background: linear-gradient(200deg, #383E41 0%, #1D2124 60%, #101315 100%);
}
`;

// paint order inside .phone3d: wrist, palm (behind), phone, fingers, thumb (front)
function masterD({ screenHTML }) {
  return `
<div class="hero-stage"></div>
<div class="hero-shadow"></div>
<div class="hero-rig">
  <div class="rig-rot">
    <div class="phone3d">
      <!-- forearm entering from the upper-right, behind the phone -->
      <div class="wrist" style="left:330px; top:-1060px; width:280px; height:1140px; border-radius:145px; transform:rotate(38deg);"></div>
      <!-- palm mass behind the phone's upper half, peeking mostly on the right -->
      <div class="palm" style="left:10px; top:-150px; width:540px; height:360px; border-radius:200px; transform:rotate(-7deg);"></div>

      <div class="phone-body"></div>
      <div class="phone-edge"></div>
      <div class="phone-sidebtn"></div>
      <div class="phone-screen"><div class="fit">${screenHTML}</div></div>
      <div class="phone-island"></div>
      <div class="phone-sweep"></div>

      <!-- fingertips curling over the top edge -->
      <div class="finger" style="left:16px;  top:-96px; width:88px; height:180px; transform:rotate(10deg);"></div>
      <div class="finger" style="left:120px; top:-118px; width:94px; height:196px; transform:rotate(4deg);"></div>
      <div class="finger" style="left:228px; top:-122px; width:96px; height:200px; transform:rotate(-3deg);"></div>
      <div class="finger" style="left:336px; top:-104px; width:90px; height:180px; transform:rotate(-10deg);"></div>
    </div>
  </div>
</div>`;
}

module.exports = { masterD, CSS_D };
