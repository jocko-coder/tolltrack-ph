# Perla.ai — Instagram carousel

Nine-slide carousel. Every slide is an **extreme close-up macro of a real Perla
screen** — tilted, with shallow depth of field, a teal/violet bloom and a light
sweep — in the rondesignlab tradition (glassmorphic UI, macro tilt crops). Fully
faithful to the actual product UI; no invented frames, no mascot.

## Deliverables

- `out/perla-carousel-01.jpg` … `-09.jpg` — 1080×1350 (4:5), sRGB, JPG q90
- `out/masters/perla-carousel-0N.png` — 3240×4050 PNG masters (3×)

## Slide map — all macro crops of real screens

| # | Screen | Focus |
|---|--------|-------|
| 1 | Home / Morning Report | "Good afternoon, Dr. Santos." · ₱88,497 waiting · *Perla.ai* wordmark |
| 2 | Visits | July 2026 grid, today "9" glowing |
| 3 | Visits | Appointment card — 12:00 PM · Joshua Lim · Confirmed · Dr. Hachi |
| 4 | Scribe | Mic orb · "Perla Scribe" · "Just talk — English, Tagalog, or both" |
| 5 | Scribe | Clinical note cards (Jose Ramirez root canal, Camille Villanueva tooth 36) |
| 6 | Ask Perla | "How can I help you today?" gradient + chips (the warm frame) |
| 7 | Analytics | "Revenue by dentist · ₱592,540 / ₱315,680" |
| 8 | Analytics | "Top patients" bars — ₱87,530 → ₱47,800 |
| 9 | Home | "Share your booking link" + Copy · *meetperla-ai.com* · Save-this (CTA) |

Screens are faithful HTML recreations of the actual app (`src/masterUI.js`):
`masterHome`, `masterVisits`, `masterScribe`, `masterAnalytics`, `masterAsk`.
The mascot is removed from the Home and Ask Perla source screens (`{mascot:false}`)
so no crop shows it. The warm accent that used to come from an invented rose
tile now comes from the real Ask Perla gradient headline (slide 6).

## Look & feel

- **Extreme macro**: each slide zooms a single screen region 2.3–2.6× and tilts
  it 7–18°, so one element dominates and the frame edges fall into soft focus.
- **Depth of field**: a blurred, radially-masked copy of the sharp render is
  composited over it (pass 2) for a real lens falloff — the focal band stays
  crisp, the corners melt.
- **Alive**: a screen-blended teal (or violet, slide 6) bloom sits under the
  focal point, a diagonal light sweep crosses the glass, and 3.5% film grain +
  a 12% vignette finish every frame.

## Deviations from the original handoff

- **Satoshi → Figtree.** Fontshare/jsdelivr are blocked by this environment's
  network policy; Satoshi is unobtainable from any reachable source. Per the
  handoff's own contingency, the closest available Google Fonts grotesque
  (Figtree, variable 300–900 + italic) is used. Doto is loaded for dot-matrix
  numerals. To restore Satoshi: drop `satoshi-*.woff2` into `fonts/`, update the
  `@font-face` block in `src/common.js`, re-run.
- **All-UI, no photography.** The brief's photo plates / monochrome hand hero
  are dropped in favour of the all-close-up-UI direction requested later — every
  slide is the real product, cropped.
- **₱ glyph** is composed (Figtree "P" + double strike via CSS) since neither
  Figtree's latin subset nor Doto carries U+20B1.

## Pipeline

```
npm install          # playwright-core + sharp (Chromium from /opt/pw-browsers)
node src/run.js      # all nine slides
node src/run.js 2 7  # just slides 2 and 7
```

1. Every real screen is rendered once as a high-dpr flat **plate** (dpr 7–8;
   `plate-home`, `plate-visits`, `plate-scribe`, `plate-analytics`, `plate-ask`).
   Cropping samples the bitmap — live DOM at macro scale × dpr 3 overruns
   Chromium's compositor texture limits and drops tiles.
2. Each slide (`src/slides.js`) is a 1080×1350 artboard that scales/tilts its
   plate, adds the bloom + light sweep, and is screenshotted at dpr 3 →
   3240×4050 master.
3. Pass 2 (`dofPage` in `src/common.js`) re-loads that master as a flat image,
   overlays the blurred masked copy for depth of field, draws any crisp overlay
   (wordmark / CTA), then bakes in grain + vignette.
4. Lanczos-downscaled to 1080×1350 JPG q90 (4:4:4).

`src/masterA.js`, `masterBC.js`, `masterD.js` (the earlier invented app frame,
call log, Taglish and hand-hero builds) are retained in the repo but unused by
the shipped set.

## QA

- Figures verbatim from the product screens — ₱88,497 · 38 calls · 21 booked
  (Home); July 2026 grid + Joshua Lim · Composite Filling · Dr. Hachi (Visits);
  ₱592,540 / ₱315,680 and the Top-patients column (Analytics). No invented claims.
- No mascot anywhere. Wordmark on slides 1 and 9 only.
- Scribe note names/text verbatim: Jose Ramirez, Camille Villanueva, Miguel Dela
  Cruz, Daniel Ocampo.
- Grain visible at 100%, invisible at feed size.
