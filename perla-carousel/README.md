# Perla.ai — "She didn't." Instagram carousel

Nine-slide UI-showcase carousel, art direction per the handoff (rondesignlab-style
glassmorphic UI, macro tilt crops, dot-matrix numerals, monochrome hand hero,
oversized-type CTA).

## Deliverables

- `out/perla-carousel-01.jpg` … `-09.jpg` — 1080×1350 (4:5), sRGB, JPG q90
- `out/masters/perla-carousel-0N.png` — 3240×4050 PNG masters (3×)

## Slide map

1. Hook — duotone mesh plate, two glass cards, "Your clinic closed at 6. / *She didn't.*"
2. **Real Home / Morning Report macro** — "₱88,497 is waiting to be collected", mascot, ~20° tilt
3. Call-log macro — Maria Dela Cruz card, summary chip sharp, defocused bezel corner
4. Taglish signature — patient/Perla bubbles, verbatim copy, "Booked." pill
5. **Real Perla Scribe screen** floating as a glass panel over duotone mesh
6. Rose accent macro — "Live Call" tile, rings sharp, schedule card blurred left
7. **Hero** — monochrome sculptural hand holding phone showing the **real Home screen**
8. Hero, punched in ~20%, phone low-left
9. CTA — ink base, ghosted cards, "We answer. You drill." + oversized "Save this design"

Slides 2, 5, 7, 8 use faithful HTML recreations of the actual Perla product
screens (`src/masterUI.js`): the dark **Home / Morning Report**, the **Perla
Scribe** notes list, and the **Ask Perla** chat (built but currently unused).
Per that direction they carry the real product's figures (**₱88,497 · 38 calls ·
21 booked · 4 birthdays**) and the Perla **mascot** — which the original
handoff's "no mascot" rule forbade; the real-UI request overrides it. Slide 6
is the lone remaining invented frame (the rose Live-Call tile), kept as the
set's single warm accent.

## Deviations from the handoff (forced by environment)

- **Satoshi → Figtree.** Fontshare (and jsdelivr) are blocked by this
  environment's network policy; Satoshi is not obtainable from any reachable
  source. Per the handoff's own contingency, the closest available Google Fonts
  grotesque (Figtree, variable 300–900 + italic) is used for wordmark, display,
  and UI text. Doto (Google Fonts) is used for dot-matrix numerals as specified.
  To restore Satoshi: drop `satoshi-*.woff2` into `fonts/`, update the
  `@font-face` block in `src/common.js`, re-run.
- **Photo plates → gradient-mesh fallback.** No image-generation tool is
  available here, so slides 1/5/9 use the spec'd fallback (three-radial-gradient
  duotone mesh + grain) and the hero hand is a stylized monochrome CSS/SVG
  build rather than an AI-generated photographic plate.
- **₱ glyph** is composed (Figtree "P" + double strike via CSS) since neither
  Doto nor Figtree's latin subset carries U+20B1.

## Pipeline

```
npm install          # playwright-core + sharp (Chromium comes from /opt/pw-browsers)
node src/run.js      # all nine slides
node src/run.js 2 7  # just slides 2 and 7
```

- Each slide is a 1080×1350 HTML artboard (`src/slides.js`), screenshotted at
  deviceScaleFactor 3 → 3240×4050 masters, then Lanczos-downscaled to
  1080×1350 JPG q90 (4:4:4).
- Masters: `src/masterA.js` (app frame), `src/masterBC.js` (call log + Taglish),
  `src/masterD.js` (hand hero). Shared tokens/overlays: `src/common.js`.
- Macro slides (2/3/4/6) get depth of field in a **second pass**: the sharp
  render is re-loaded as a flat image and a blurred, radially-masked copy is
  composited over it. (In-page `filter: blur()` over a ~3.3×-scaled subtree at
  dpr 3 exceeds Chromium's compositor texture limits and silently drops tiles.)
- Slides 2/6 transform a pre-rendered dpr-8 bitmap plate of Master A for the
  same reason.
- Grain (3.5% SVG turbulence) + 12% vignette are the final overlays on every slide.

## QA (per handoff checklist)

- Figures verbatim from the product screens: real Home shows ₱88,497 · 38 calls ·
  21 booked (slides 2/7/8); the invented Master-A frame (slide 6) keeps 14 · 7.
  No invented claims or superlatives.
- Rose is confined to the Live-Call tile (slide 6) and small chips.
- Mascot appears on the real-UI slides (2/7/8) as in the actual product —
  intentional override of the handoff's "no mascot" rule. Wordmark on 1 and 9 only.
- Taglish verbatim: "Gusto ko magpa-linis ng ngipin." / "Sige po! May slot
  Miyerkules 2PM. Book na po?"
- Scribe note names/text verbatim from the real screen: Jose Ramirez, Camille
  Villanueva, Miguel Dela Cruz, Daniel Ocampo.
