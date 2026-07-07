# PEAK-1: Ink Map Awakening Sequence

> **For Codex.** Start here. This file is your complete context for this task.

---

## Project Identity

**Tea Atlas** — a browser-based interactive digital museum about Chinese tea culture. Ink-wash aesthetic, rice paper textures, low-saturation palette. The user enters and experiences tea regions through an animated SVG map of China.

**Tech:** React 18 + Vite 6 + Tailwind 3 + D3 7 + framer-motion 11. Three.js is in dependencies but the bloom system uses a custom EffectController, not Three.js directly.

**Code at:** `C:\Users\xiaoruo\Desktop\tea\client\`

---

## What Exists Right Now

```
Single-page app: MapPage at / and /map

Working:
- D3 map with GeoJSON provinces + zoom/pan
- 27 tea markers from demoTeas.js
- Season-aware CSS variables (--paper, --accent, --bloom-a/b/c per season)
- EffectController (event-driven: season:preset, region:hover, region:hover:end)
- Clouds, falling petals, snowfall components
- BottomControlBar (zoom, catalog button)
- TeaCatalogPopup (category-filtered tea list)
- TeaDetailPanel (side panel with tea info)
- introState machine: dormant → awakening → active (2.4s total, MapPage.jsx)

Empty directories (no files yet):
- components/Hero/, Province/, Timeline/, Common/, Layout/, UI/
- hooks/, types/, styles/
```

---

## Task: Replace Fade-in with Ink Diffusion Awakening

### Scope — ONLY these files:
- `src/pages/MapPage.jsx` — introState timing/logic
- `src/components/Map/TeaMap.jsx` — map rendering container
- `src/index.css` — visual transitions only
- `src/effects/` — timing hook IF needed (read-only by default)

### DO NOT TOUCH:
- `src/data/demoTeas.js`
- `src/contexts/SeasonContext.jsx`
- `src/effects/EffectController.js`
- `src/effects/BloomEffect.js`
- `src/effects/AtmosphereEffect.js`
- `src/effects/regionAtmosphereProfiles.js`
- Tea interaction logic (click, hover, zoom)
- BottomControlBar
- TeaCatalogPopup / TeaDetailPanel
- `package.json`

---

## Current State → Target State

**CURRENT (remove this):**
Map fades in via opacity transition. Linear. Boring.

**TARGET (build this):**
Map appears via an "ink spreading into paper" illusion — organic, not mechanical.

---

## 4 Visual Phases

Reuse the existing `introState` machine if possible. Timing can be adjusted.

### STATE 1: dormant (0ms)
- Paper-like background visible (use `--paper` CSS variable)
- Map NOT visible at all
- Atmosphere NOT visible
- User sees: warm paper surface, mountains SVG, clouds drifting

### STATE 2: ink spreading (trigger → ~1000ms)
- Province BORDERS appear first (stroke opacity rises before fill)
- Opacity increases UNEVENLY across the map — not a uniform fade
- Slight blur that progressively reduces (blurry → sharp, like ink settling into paper)
- Coastline edges and border strokes lead the reveal
- The feeling: ink bleeding outward from stroke lines into the paper

### STATE 3: stabilizing (1000ms → ~2000ms)
- Full map becomes stable and sharp
- Province fill colors settle into their final values
- Bloom effect begins subtly (just barely perceptible)
- Atmosphere overlay starts to exist

### STATE 4: active (2000ms+)
- Existing interaction enabled (this gate already exists — keep it)
- All controls and tea interactions work normally

---

## Visual Rules (HARD CONSTRAINTS)

1. **NO linear opacity fade** on the full map container. The whole point of this task is to replace that.

2. **Must feel organic.** Ink doesn't fade in — it spreads, bleeds, settles. Use:
   - Staged layer reveal (preferred approach): borders → fill → bloom → atmosphere
   - OR radial gradient mask revealing from edges
   - OR progressive blur reduction (blur → clarity)

3. **CSS animation constraints:**
   - `ease-out` or `cubic-bezier(0.25, 0.1, 0.1, 1.0)` — slow start, natural settle
   - NO `spring`, NO `elastic`, NO `bounce`
   - NO `transform: scale()` animations
   - NO `translate` or position animations on the map container
   - Existing CSS custom properties `--ink-ease` and `--ink-rhythm*` are available in `index.css`

4. **Timing reference** (from index.css):
   - `--ink-rhythm-quiet: 920ms`
   - `--ink-rhythm: 1240ms`
   - `--ink-rhythm-slow: 1760ms`
   - Use these variables for animation durations. Don't hardcode new timing values.

5. **Interaction gate stays.** The existing check in MapPage that prevents interaction before the intro completes must remain. After STATE 4, interaction unlocks as before.

---

## Existing introState Machine (MapPage.jsx)

```javascript
const [introState, setIntroState] = useState('dormant');
// dormant → awakening → active (currently 0ms and 2400ms setTimeouts)
```

Modify the timing, not the mechanism. Add intermediate states if needed:
- `dormant` — STATE 1
- `ink-spreading` — STATE 2 (new OR repurpose `awakening`)
- `stabilizing` — STATE 3 (new)
- `active` — STATE 4 (existing, keep name for backward compat)

TeaMap receives `introState` as a prop. TeaMap's CSS already uses `[data-intro-state]` selectors.

---

## CSS Hints (index.css already has these patterns)

```css
.map-layer[data-intro-state="dormant"] .ink-map-artwork { opacity: 0; }
.map-layer[data-intro-state="awakening"] .ink-map-artwork { opacity: 1; transition: opacity var(--ink-rhythm) var(--ink-ease); }
```

The `.ink-scene` class renders paper texture via CSS pseudo-elements (radial gradients + SVG noise). You can layer reveal effects on top of this.

---

## Verification

After implementation, run:
```bash
cd C:\Users\xiaoruo\Desktop\tea\client && npm run build
```

Build must pass with zero errors. Then visually verify:
1. On page load: paper background visible, map NOT visible
2. 0–1s: province borders appear first, slightly blurry
3. 1–2s: fills settle in, blur clears, bloom starts
4. 2s+: map is fully interactive

---

## Rules

- Modify in-place. No new files unless absolutely necessary.
- No new dependencies.
- Preserve existing `data-*` attributes and accessibility.
- No cleanup of unrelated code.
- After completion: report what changed, run `npm run build`, confirm result.
- STOP after this task. Do not chain to another task.
