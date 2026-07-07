# Mountain Layers Plan

## Inputs Checked

- Visual target: `reference/moban.png`
- Existing reference memory: `C:\Users\xiaoruo\.claude\projects\C--Users-xiaoruo\memory\tea-atlas-visual-references.md`
- Current map renderer: `client/src/components/Map/TeaMap.jsx`

The memory file appears mojibake-encoded in this shell, but the key tables remain readable enough to confirm the intended system: four mountain depth planes, cold/warm/cold/warm interleaving, far layers without gold ridge lines, nearer layers with fine muted gold accents, rice-paper base, pale ocean wash, and mist transitions.

## 1. What `moban.png` Shows

`moban.png` is not a literal GIS map and not a landscape painting. It uses the Chinese pictorial-map convention: mountains are seen from a raised oblique cartographic angle, arranged as overlapping terrain symbols over China and surrounding regions. There is no horizon, sky, vanishing point, or scenic foreground. The map reads as one antique rice-paper surface covered by layered mountain systems, coastlines, islands, mist, and faint sea wash.

Approximate sampled global palette:

- Paper and mist base: `#eadfde`, `#ede4e1`, `#f4e8e4`, `#e8d9d6`
- Warm mountain masses: `#e3cbc6`, `#e1c4bb`, `#d5b6b1`, `#d8c3bd`
- Cool mountain masses: `#d9cad1`, `#cabbc3`, `#b5a4ae`, `#b0a1ad`
- Deeper warm ridge accents: `#d1b6b2`, `#c0897f`
- Pale gold / peach-gold line family as sampled from warm outline candidates: `#efd4c1`, `#f4d0bd`, `#e9c7b3`, `#e5baa7`, `#d9ad9a`

### Four Depth Planes

Layer 1, farthest: very pale rice-paper gray-pink mountains. They are readable only as soft ranges and haze fields. Blur is highest. No gold ridge lines. This layer establishes peripheral terrain and atmospheric distance.

Layer 2, mid-far: low-saturation warm ochre and pale peach-pink. Ridge groups are recognizable, with soft internal mountain marks. Blur is lower than Layer 1. No gold lines. This layer fills gaps left by Layer 1 and starts the warm/cool alternation.

Layer 3, mid-near: cool gray-purple and gray-blue-violet mountain systems. Individual peaks and ridge chains are more legible. Blur is low. Fine gold can appear selectively on ridges and some boundary-adjacent high points, but it should still be restrained.

Layer 4, near solid: deepest purple-gray, tea-gray, and muted warm-brown accents. Edges are the crispest in the system, though still ink-wash softened. Fine gold outlines and ridge highlights are most present here, especially around important national/coastal contours and dominant ridgelines.

### Interleaving

The target image avoids a flat single-color mountain field by alternating temperature and depth:

- Cold far mist sits behind warm mid-far ochre.
- Warm mid-far groups are interrupted by cool mid-near purple ridges.
- Deeper near ridges punctuate both warm and cool fields.
- Gold appears only after enough structure exists; it is an accent, not a layer-wide contour style.

This means the four generated PNGs should not be four identical coverage masks with different colors. Each layer should occupy different gaps and partially overlap adjacent layers to create woven terrain.

## 2. Four-Layer Generation Plan

All layers should be transparent PNGs, at least `4000x3000`, using the same artboard, geographic composition, and raised oblique mountain-symbol language. Recommended working size: `4096x3072`. Each PNG includes only its own visible ink/mist/mountain/gold content and alpha; the shared paper base should remain outside these layer PNGs unless a very low-alpha paper fiber is needed for edge blending.

### Layer 1/4: Farthest Background

- File: `map-mountains-layer-1-farthest.png`
- Role: atmospheric terrain foundation.
- Palette:
  - Mountain haze: `#d8d0cc` to `#c8c0c0`
  - Pale warm-gray/pink: `#e8ddd8` to `#d9cad1`
  - Avoid strong chroma and avoid dark ink.
- Blur / definition:
  - Softest layer.
  - About 40-50% softness in the revised direction: visible mountain silhouettes, but edges dissolve into mist.
  - Internal ridge marks are faint and low-contrast.
- Cluster zones:
  - Dense west and southwest periphery.
  - Moderate north.
  - Lighter northeast.
  - Scattered southeast and surrounding regions.
  - Center remains mostly open with only faint wisps.
- Gold lines:
  - None.
- Relationship:
  - Provides cold/pale background mass for Layer 2 to step forward from.
  - Should leave central-west, southwest corridor, lower-center, and parts of center-right open enough for warm Layer 2.

### Layer 2/4: Mid-Far Warm Layer

- File: `map-mountains-layer-2-mid-far.png`
- Role: readable warm mountain groups emerging from Layer 1 mist.
- Palette:
  - Low-saturation ochre / sandstone: `#d4c4b5` to `#c8b0a0`
  - Pale peach-pink: `#dfc4bb` to `#d5b6ad`
  - Deeper warm ridge accents: `#c4a18f` to `#b99682`
  - No cool gray, purple, or blue.
- Blur / definition:
  - About 30-40% softness.
  - Individual mountain groups and general ridge-chain shapes are distinguishable.
  - Ridge marks are visible but not hard outlines.
- Cluster zones:
  - Central-west belt, Qinling/Qilian direction.
  - Southwest corridor, Hengduan direction, lower-left to center-left.
  - South-central, Nanling direction.
  - Lighter east, Wuyi direction.
  - Some overlap with Layer 1 voids so this layer feels forward.
- Gold lines:
  - None.
- Relationship:
  - Warm counterpoint to Layer 1.
  - Must interleave rather than blanket Layer 1. It should fill gaps, not cover all far terrain.

### Layer 3/4: Mid-Near Cool Layer

- File: `map-mountains-layer-3-mid-near.png`
- Role: structural cool mountain systems and sharper cartographic depth.
- Palette:
  - Gray-purple: `#b8aeba` to `#9f95a8`
  - Gray-blue-violet: `#aaa5b8` to `#878399`
  - Pale cool mist edges: `#d8d0d6` to `#c8bec8`
  - Optional subdued warm transition pixels only where it overlaps Layer 2: `#cdb5aa` to `#bda092`
- Blur / definition:
  - Low blur, roughly 15-25% softness.
  - Individual peaks are readable.
  - Ridge chains can have stronger internal valley strokes.
- Cluster zones:
  - Central spine through Qinghai/Sichuan/Yunnan direction.
  - East-west bands across central China.
  - Northeast highland cluster.
  - Selected south and east ridges to break up Layer 2 warmth.
- Gold lines:
  - Yes, but limited.
  - Use very fine semi-transparent muted gold/peach-gold: `#efd4c1` to `#d9ad9a`, alpha around 0.18-0.35.
  - Apply to ridge crests and occasional boundary-adjacent terrain only.
- Relationship:
  - Sits over Layer 2 as the cool return in the cold/warm/cold/warm rhythm.
  - Should not erase Layer 2 warmth; instead it cuts through it with cooler mountain chains.

### Layer 4/4: Near Solid Foreground / Gold Accent Layer

- File: `map-mountains-layer-4-near-gold.png`
- Role: crispest foreground terrain, national/coastal outline accents, and final antique-map definition.
- Palette:
  - Deep muted purple-gray: `#8f8798` to `#706b80`
  - Tea-gray / brown-gray: `#9a897c` to `#7f7067`
  - Warm brown accent: `#b68b78` to `#a17468`
  - Gold line: `#f4d0bd`, `#e9c7b3`, `#d9ad9a`; keep matte and low saturation.
- Blur / definition:
  - Crispest layer, but never vector-hard.
  - 5-12% softness at mountain edges.
  - Internal ridge and valley marks can be clear.
- Cluster zones:
  - Dominant central and southwest mountain masses.
  - Stronger northwest/west peaks.
  - A few southeast and coastal-adjacent ridges.
  - Gold coastline / boundary accents should align with map geography rather than random decoration.
- Gold lines:
  - Yes.
  - Fine gold ridgeline highlights and boundary/coastline accents.
  - Stroke must be hairline and broken/ink-wash faded, not continuous shiny vector trim.
- Relationship:
  - Final detail pass over Layers 1-3.
  - Gives the stack the antique-map signature seen in `moban.png`.
  - Must remain sparse enough that tea signals and provincial paths are still legible.

## 3. Stacking Strategy In `TeaMap.jsx`

Current render order in `client/src/components/Map/TeaMap.jsx`:

1. `<rect width="100%" height="100%" fill="url(#mapAura)" />`
2. `<g transform={transform.toString()} className="china-relief">`
3. `neighbors-layer`
4. `province-ink-layer`
5. `tea-signal-layer`
6. `MapEffectLayer` is rendered after the SVG and receives `transform={transform.toString()}`

The mountain PNGs should live inside the transformed SVG group so they zoom and pan with the D3 map. They should not be absolutely positioned outside the SVG unless we also mirror the same D3 transform exactly. The clean integration point is inside:

```jsx
<g transform={transform.toString()} className="china-relief">
  <g className="mountain-raster-layer" aria-hidden="true">
    ...
  </g>
  <g className="neighbors-layer" aria-hidden="true">...</g>
  <g className="province-ink-layer" filter="url(#paperRelief)">...</g>
  <g className="tea-signal-layer">...</g>
</g>
```

Recommended internal order:

1. Layer 1 raster, farthest.
2. `neighbors-layer`, or keep neighbors above Layer 1 if surrounding land outlines must remain visible.
3. Layer 2 raster.
4. Layer 3 raster.
5. `province-ink-layer`.
6. Layer 4 gold/near accent raster if it is mostly mountains and boundary accents, or split Layer 4 into `4a mountains` below provinces and `4b gold accents` above provinces.
7. `tea-signal-layer` always remains above all mountain layers.

The main implementation issue is coordinate registration. The existing projector maps China bounds into a dynamic frame:

- `CHINA_BOUNDS = { minLon: 73, maxLon: 135, minLat: 18, maxLat: 54 }`
- `makePlanarProjector(dims)` computes a fitted frame and returns screen-space x/y.

The raster layers therefore need a map-space rectangle tied to the same projected lon/lat extent. The safest approach is to define a broader atlas extent that matches `moban.png` coverage, for example:

- `ATLAS_BOUNDS = { minLon: 55, maxLon: 150, minLat: 0, maxLat: 60 }`

Then project the northwest and southeast corners with the same `project` function, derive `x`, `y`, `width`, and `height`, and render each PNG as an SVG `<image>`:

```jsx
const atlasTopLeft = project([ATLAS_BOUNDS.minLon, ATLAS_BOUNDS.maxLat]);
const atlasBottomRight = project([ATLAS_BOUNDS.maxLon, ATLAS_BOUNDS.minLat]);
```

Because the current `project` is calibrated only to `CHINA_BOUNDS`, coordinates outside those bounds will extrapolate linearly, which is acceptable for the surrounding-neighbor atlas art as long as all four PNGs share the same extent. The four PNGs must be generated against that same atlas coordinate space and not cropped independently.

Suggested `<image>` attributes:

- `href={layerSrc}`
- `x={atlasTopLeft[0]}`
- `y={atlasTopLeft[1]}`
- `width={atlasBottomRight[0] - atlasTopLeft[0]}`
- `height={atlasBottomRight[1] - atlasTopLeft[1]}`
- `preserveAspectRatio="none"` if the art is generated exactly to the atlas bounds.
- `style={{ pointerEvents: 'none', mixBlendMode: 'multiply' }}` only if browser rendering looks better; default normal alpha may be safer for color control.

If gold coastline/border accents need precise geography, do not bake all gold into the same mountain raster. Generate a separate transparent gold line overlay from projected GeoJSON paths, or split Layer 4 so its gold pass can sit above `province-ink-layer` while the dense mountain mass stays below it.

## 4. Generation Order

Generate in visual-depth order, far to near:

1. Layer 1 first because it establishes the atmospheric coverage, global empty areas, and the pale cold foundation.
2. Layer 2 second because it must intentionally fill Layer 1 gaps with warm ochre/peach terrain.
3. Layer 3 third because it needs to weave cool, sharper ridge systems through the warm Layer 2 masses.
4. Layer 4 last because gold line placement and near-peak density depend on what is already visually crowded below.

After each layer, create two previews:

- Single-layer preview on rice paper.
- Full stack preview with all generated previous layers.

Do not evaluate each PNG on a black transparency checker alone. These layers are designed to be low-contrast ink over rice paper, so paper-context previews are required.

Acceptance checks before moving to the next layer:

- The layer is `4096x3072` or larger and has a real alpha channel.
- It contains no text or watermark.
- Its colors match the intended temperature band.
- It does not duplicate the previous layer's mountain placement too closely.
- The stack keeps enough 留白 for province boundaries, tea signals, and mist effects to breathe.
