# 12 — Assets Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Visual Asset Specifications, AI Image Prompt Templates, and Production Guidelines**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | AST-012 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `04-ui-design-system.md`, `05-animation-system.md`, `06-map-system.md`, `14-content-guideline.md` |

---

## 2. Asset Scope

This document is the **single source of truth for all visual assets**. It defines:

| In Scope | Out of Scope |
|---|---|
| Texture assets (rice paper, ink wash, cloud, fog) | CSS implementation of textures |
| Image assets (hero landscape, tea illustrations, map elements) | Animation behavior (→ `05-animation-system.md`) |
| AI image prompt templates | API integration code |
| File naming conventions | Build tooling / asset pipeline |
| Format and compression requirements | Color tokens (→ `04-ui-design-system.md`) |
| Resolution specifications | Component markup |
| Seasonal variation asset mapping | Scroll-driven reveal logic |
| Brand/licensing attribution | — |

---

## 3. Asset Inventory

### 3.1 Complete Asset List

| Asset ID | Asset Name | Type | Dimensions | Format | Size Target | Priority |
|---|---|---|---|---|---|---|
| **AST-001** | Rice Paper Texture | Texture | 512×512 tile | WebP | ≤ 40KB | P0 |
| **AST-002** | Rice Paper Texture (Dark) | Texture | 512×512 tile | WebP | ≤ 40KB | P0 |
| **AST-003** | Ink Wash Mountain — Layer 1 (Distant) | Image | 2560×800 | WebP | ≤ 150KB | P0 |
| **AST-004** | Ink Wash Mountain — Layer 2 (Midground) | Image | 2560×800 | WebP | ≤ 150KB | P0 |
| **AST-005** | Ink Wash Mountain — Layer 3 (Foreground) | Image | 2560×800 | WebP | ≤ 150KB | P0 |
| **AST-006** | Cloud Layer — Distant (Slow Drift) | Image | 2560×600 | WebP | ≤ 80KB | P0 |
| **AST-007** | Cloud Layer — Foreground (Fast Drift) | Image | 2560×600 | WebP | ≤ 80KB | P0 |
| **AST-008** | Fog Overlay (Light) | Image | 2560×400 | WebP | ≤ 50KB | P0 |
| **AST-009** | Fog Overlay (Heavy) | Image | 2560×400 | WebP | ≤ 50KB | P0 |
| **AST-010** | Hero Landscape Composite | Image | 2560×1440 | WebP | ≤ 300KB | P0 |
| **AST-011** | Tea Leaf (Single, Falling) | Image | 200×200 | WebP | ≤ 15KB | P0 |
| **AST-012** | Tea Tree / Bush Illustration | Image | 400×400 | WebP | ≤ 50KB | P0 |
| **AST-013** | Dry Tea Leaves Illustration | Image | 400×300 | WebP | ≤ 50KB | P0 |
| **AST-014** | Tea Plantation Landscape | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-015** | Ancient Tea Forest Scene | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-016** | Tea Harvest Scene | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-017** | Tea Processing Scene | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-018** | Tea Ceremony Scene | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-019** | Modern Tea Appreciation Scene | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-020** | Tea Logo (Calligraphy Tree + Text) | Logo | 120×120 | SVG | ≤ 5KB | P0 |
| **AST-021** | Map Province Base (China Outline) | Map | 1200×900 | SVG | ≤ 30KB | P0 |
| **AST-022** | Map Terrain Texture | Map | 1024×1024 tile | WebP | ≤ 80KB | P0 |
| **AST-023** | Tea Point Pin Icon | Icon | 32×32 | SVG | ≤ 2KB | P0 |
| **AST-024** | Province Highlight Overlay | Map | Per-province | SVG | ≤ 5KB each | P0 |
| **AST-025** | Season — Spring Color Overlay | Effect | 2560×1440 | WebP | ≤ 100KB | P1 |
| **AST-026** | Season — Summer Color Overlay | Effect | 2560×1440 | WebP | ≤ 100KB | P1 |
| **AST-027** | Season — Autumn Color Overlay | Effect | 2560×1440 | WebP | ≤ 100KB | P1 |
| **AST-028** | Season — Winter Color Overlay | Effect | 2560×1440 | WebP | ≤ 100KB | P1 |
| **AST-029** | Snow Particle (Winter) | Effect | 64×64 | WebP | ≤ 5KB | P1 |
| **AST-030** | Tea Type — Green Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-031** | Tea Type — Black Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-032** | Tea Type — Oolong Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-033** | Tea Type — White Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-034** | Tea Type — Yellow Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-035** | Tea Type — Dark Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-036** | Tea Type — Pu'er Tea Illustration | Image | 400×500 | WebP | ≤ 60KB | P0 |
| **AST-037** | Province — Fujian Atmosphere | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-038** | Province — Yunnan Atmosphere | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-039** | Province — Zhejiang Atmosphere | Image | 2560×800 | WebP | ≤ 200KB | P1 |
| **AST-040** | Empty State Illustration | Image | 400×300 | WebP | ≤ 40KB | P1 |
| **AST-041** | Decorative Line — Gold Foil Border | Decoration | 400×4 | SVG | ≤ 2KB | P0 |
| **AST-042** | Decorative Line — Ink Brush Stroke | Decoration | 200×8 | SVG | ≤ 2KB | P1 |
| **AST-043** | Tea Culture Icon Set (8 icons) | Icon | 24×24 each | SVG Sprite | ≤ 8KB | P1 |
| **AST-044** | Timeline Stage Illustrations (7 stages) | Image | 600×400 each | WebP | ≤ 60KB each | P1 |
| **AST-045** | Favicon / App Icon | Icon | 512×512 | PNG | ≤ 30KB | P0 |

### 3.2 Asset Priority Summary

| Priority | Count | Assets |
|---|---|---|
| **P0** (Phase 1 — MVP) | 22 | AST-001 through AST-013, AST-020 through AST-024, AST-030 through AST-036, AST-041, AST-045 |
| **P1** (Phase 2 — Full) | 23 | AST-014 through AST-019, AST-025 through AST-029, AST-037 through AST-044 |
| **P2** (Phase 3 — Polish) | 0 | — |

---

## 4. Visual Texture System

### 4.1 Rice Paper Texture (AST-001, AST-002)

The foundational texture of the entire project. Applied as a CSS `background-image` or overlay on `:root`, covering the full viewport at all times.

| Property | Specification |
|---|---|
| **Visual Character** | Organic fiber weave, subtle warm off-white, irregular fiber distribution, faint tea-stain spots |
| **Base Color** | `Neutral.0` (`#FAF8F5`) |
| **Fiber Color** | `Neutral.20` (`#EDE8E2`) — barely perceptible |
| **Pattern** | Non-repeating at 512×512; seamless tile |
| **Opacity in UI** | 100% over background; 60% over cards (allow card bg to show through) |
| **Production Method** | AI-generated from prompt `PROMPT-AST-001`; then processed for seamless tiling |

**AST-002 (Dark Variant):** Same fiber pattern, base color shifted to `Neutral.10` (`#F5F2ED`). Used for modal backdrops and dark-themed sections.

### 4.2 Ink Wash Mountain Layers (AST-003 – AST-005)

Three parallax mountain layers composited via CSS/z-index. Each layer is a horizontally-long transparent PNG/WebP with ink-wash mountain silhouettes.

| Layer | z-index (→ `04-ui-design-system.md` §13) | Parallax Rate | Opacity | Character |
|---|---|---|---|---|
| **AST-003 (Distant)** | 20 | 0.3× scroll | 0.4 | Softest, lightest wash, minimal detail |
| **AST-004 (Midground)** | 20 | 0.6× scroll | 0.7 | Medium contrast, visible brush strokes |
| **AST-005 (Foreground)** | 20 | 1.0× scroll | 0.9 | Darkest ink, defined mountain contours, occasional pine tree silhouettes |

**Production Method:** AI-generated from prompt `PROMPT-AST-003`. Each layer generated separately with progressively stronger ink wash parameters.

### 4.3 Cloud & Fog Layers (AST-006 – AST-009)

| Asset | Behavior | Opacity Range | Speed | Production |
|---|---|---|---|---|
| **AST-006 (Distant Cloud)** | Continuous horizontal drift (loop) | 0.15 – 0.25 | 20px/s leftward | AI-generated cloud band |
| **AST-007 (Foreground Cloud)** | Continuous horizontal drift (loop) | 0.25 – 0.40 | 40px/s rightward | AI-generated cloud band (denser) |
| **AST-008 (Fog Light)** | Scroll-driven opacity | 0.10 – 0.35 | Static Y, fades with scroll | Soft gradient + noise |
| **AST-009 (Fog Heavy)** | Scroll-driven opacity | 0.25 – 0.50 | Static Y, fades with scroll | Denser gradient + noise |

### 4.4 Seasonal Color Overlays (AST-025 – AST-028)

Full-viewport semi-transparent color overlays applied during season transitions.

| Season | Overlay Color | Opacity | Blend Mode |
|---|---|---|---|
| **Spring** | `Tea.30` (`#C5E0B8`) — fresh green | 0.10 | `overlay` |
| **Summer** | `Warm.20` (`#F9E8D5`) — warm beige | 0.08 | `soft-light` |
| **Autumn** | `Warm.50` (`#D4A05C`) — caramel brown | 0.12 | `overlay` |
| **Winter** | `Ink.30` (`#BFB8AD`) — cool gray | 0.15 | `multiply` |

### 4.5 Decorative Lines (AST-041, AST-042)

| Asset | Width | Color | Usage |
|---|---|---|---|
| **AST-041 (Gold Foil Border)** | 2px | `Accent.Gold` (`#B8956A`) with 60% opacity | Section dividers, card borders, province boundary highlights on map |
| **AST-042 (Ink Brush Stroke)** | 4–8px variable | `Ink.60` (`#595145`) | Decorative underline for titles, calligraphic accents |

---

## 5. Image Asset Specifications

### 5.1 Hero Assets (AST-010, AST-011)

**AST-010 — Hero Landscape Composite:**
- Full composition of mountains + fog + sky + subtle tea field
- Composition: bottom-weighted (2/3 landscape, 1/3 sky for title overlay)
- Style: ink-wash watercolor, soft gradients, no hard edges
- Color palette: `Neutral.0` → `Ink.40` → `Tea.20` → `Warm.20` (background to foreground)

**AST-011 — Falling Tea Leaf:**
- Single fresh green tea leaf (Camellia sinensis), 3/4 angle
- Watercolor style, slightly translucent edges
- Transparent background
- Used in hero entrance animation (ANIM-023)

### 5.2 Tea Illustration Assets (AST-012, AST-013, AST-030 – AST-036)

**Tea Tree / Bush (AST-012):**
- Mature tea bush, watercolor style
- Used as map point icon (scaled dynamically) and scene element

**Dry Tea Leaves (AST-013):**
- Top-down scattered dry tea leaves
- Used in tea type badges and as decorative elements

**Tea Type Illustrations (AST-030 – AST-036):**
- One illustration per tea type, each in a tall 400×500 format
- Each must visually distinguish the tea type through:
  - Leaf shape and size
  - Dry leaf color (green, dark, twisted, etc.)
  - Infused liquor color shown as a subtle watercolor wash behind
- Style: delicate watercolor, white/transparent background
- Used in: TeaCard component, Detail Panel hero image

| Asset | Tea Type | Key Visual Cues | Dry Leaf Color | Liquor Wash Color |
|---|---|---|---|---|
| AST-030 | Green | Tender buds, flat leaves | `Tea.50` (#7AB865) | `Tea.20` (#DFEDD8) |
| AST-031 | Black | Twisted, dark leaves | `Warm.70` (#8C5E2A) | `Warm.50` (#D4A05C) |
| AST-032 | Oolong | Rolled pearls or twisted strips | `Tea.60` (#5A9A45) | `Warm.30` (#F2D4B0) |
| AST-033 | White | Silver buds, downy tips | `Neutral.30` (#E0DBD4) | `Neutral.10` (#F5F2ED) |
| AST-034 | Yellow | Slightly yellowed buds | `Warm.40` (#E8C088) | `Warm.20` (#F9E8D5) |
| AST-035 | Dark | Compressed dark cakes or bricks | `Ink.70` (#3D3730) | `Warm.60` (#B8803E) |
| AST-036 | Pu'er | Aged compressed cakes, earthy | `Ink.80` (#26221D) | `Warm.70` (#8C5E2A) |

### 5.3 Scene Illustrations (AST-014 – AST-019)

Six full-width scene illustrations for the scroll narrative. Each is a horizontally-long composition (2560×800) with transparent sky area for text overlay.

| Scene | Scroll Range | Key Elements | Dominant Palette |
|---|---|---|---|
| **AST-014 — Ancient Tea Forest** | 15%–28% | Old-growth tea trees, dappled light, moss, wild undergrowth | `Tea.70` + `Ink.50` + `Warm.20` |
| **AST-015 — Tea Mountains** | 28%–42% | Terraced tea plantations, rolling hills, distant peaks, mist | `Tea.40` + `Neutral.20` + `Ink.30` |
| **AST-016 — Harvest** | 42%–56% | Tea pickers (small scale), baskets, spring growth, bright atmosphere | `Tea.30` + `Warm.20` + `Neutral.10` |
| **AST-017 — Processing** | 56%–70% | Wok-firing, rolling, drying, workshop interior warmth | `Warm.40` + `Ink.50` + `Neutral.20` |
| **AST-018 — Tea Ceremony** | 70%–84% | Tea set, pouring water, steam, serene interior | `Neutral.20` + `Ink.40` + `Warm.30` |
| **AST-019 — Modern Appreciation** | 84%–95% | Contemporary setting, clean lines, tea + lifestyle, global context | `Neutral.10` + `Tea.20` + `Ink.30` |

### 5.4 Map Assets (AST-021 – AST-024)

**AST-021 — China Province Outline Map:**
- SVG format — must be scalable and scriptable
- Gold foil relief line style: `stroke="Accent.Gold"`, `stroke-width="1.5"`, `fill="transparent"`
- Each province as a separate `<path>` with `data-province` attribute
- Non-tea provinces: `fill="Neutral.20"`, `opacity="0.5"`
- Tea-producing provinces: `fill="Warm.10"`, `opacity="0.8"` (default state)

**AST-022 — Map Terrain Texture:**
- Subtle topographic texture overlay for the map background
- Very low contrast, warm ink tones
- Applied as repeating background pattern on map container

**AST-023 — Tea Point Pin Icon:**
- Small watercolor tea leaf shape, 32×32
- Two states: default (`Tea.60`) and hover (`Warm.50`)
- SVG for crisp scaling during map zoom

**AST-024 — Province Highlight Overlay:**
- Per-province SVG path for the hover/selected highlight state
- Fill: `Tea.20` with 40% opacity
- Generated from the same GeoJSON/SVG source as AST-021

### 5.5 Province Atmosphere Images (AST-037 – AST-039)

Province-specific atmosphere illustrations for Province Detail pages. Same format as scene illustrations (2560×800).

| Asset | Province | Key Visual Elements |
|---|---|---|
| AST-037 | Fujian | Coastal mountains, Wuyi rock cliffs, Tieguanyin bushes, humid atmosphere |
| AST-038 | Yunnan | Ancient tea forests, Pu'er mountains, diverse terrain, tropical highland feel |
| AST-039 | Zhejiang | West Lake mist, Longjing terraces, gentle hills, refined atmosphere |

> Additional province atmosphere images (Sichuan, Anhui, Guangdong, Hunan, Hubei, Guizhou, Jiangsu, Henan, Shaanxi, Guangxi) are P2 and deferred to Phase 3.

### 5.6 Timeline Stage Illustrations (AST-044)

Seven illustrations for the horizontal scroll timeline. Each is 600×400, watercolor style.

| Stage | Key Elements | Dominant Palette |
|---|---|---|
| 1 — Seed | Tea seed in soil, sprouting | `Warm.40` + `Ink.50` |
| 2 — Sprout | Young seedling, two leaves | `Tea.40` + `Neutral.20` |
| 3 — Bush | Mature tea bush, lush | `Tea.50` + `Tea.20` |
| 4 — Harvest | Hands picking leaves | `Tea.30` + `Warm.20` |
| 5 — Processing | Wok-firing, rolling | `Warm.50` + `Ink.40` |
| 6 — Cup | Brewed tea, steam, cup | `Warm.30` + `Neutral.10` |
| 7 — Ceremony | Full tea set, pouring | `Ink.40` + `Warm.20` |

### 5.7 Other Assets (AST-020, AST-040, AST-043, AST-045)

**AST-020 — Tea Logo:**
- Circular emblem, 120×120, SVG
- Stylized tea tree formed from calligraphy brush strokes
- Below: project name "Tea Atlas" in `Typography.Calligraphy` style
- Color: `Ink.80` (`#26221D`) on transparent background

**AST-040 — Empty State Illustration:**
- Gentle watercolor of an empty tea cup or a single tea leaf
- Conveys "nothing here yet" without feeling like an error
- Used when filter returns no results

**AST-043 — Tea Culture Icon Set:**
- 8 icons for tea culture elements: tea mountain, tea village, tea museum, tea workshop, teapot, tea cup, tea leaf, tea cake
- 24×24, SVG sprite, `currentColor` inheritance
- Used in Province Detail panel's "打卡推荐" (recommended visits) section

**AST-045 — Favicon / App Icon:**
- 512×512 PNG (generated at multiple sizes by build tooling)
- Simplified version of AST-020 (logo)
- Must be recognizable at 16×16 (favicon) and 180×180 (Apple Touch Icon)

---

## 6. AI Image Prompt Templates

### 6.1 Prompt Architecture

All AI-generated images for Tea Atlas follow a **layered prompt template** with four components:

```
[STYLE_HEADER] + [SUBJECT] + [TECHNICAL_SPEC] + [NEGATIVE_PROMPT]
```

| Component | Purpose | Example |
|---|---|---|
| **STYLE_HEADER** | Sets the global visual style (constant for all prompts) | "宽屏2D国风..." |
| **SUBJECT** | Describes what to generate (varies per asset) | "分层水墨远山..." |
| **TECHNICAL_SPEC** | Resolution, format, quality parameters | "4K, 300dpi..." |
| **NEGATIVE_PROMPT** | What to avoid | "no 3D, no neon, no..." |

### 6.2 Universal Style Header

This header is **prepended to every Tea Atlas image prompt** to ensure visual consistency across all assets.

```
PROMPT-HEADER:
宽屏2D国风茶文化网页美术资源，整体统一宣纸细腻底纹肌理，
浅烫金浮雕细线勾勒，淡彩工笔水墨分层，全程采用低饱和莫兰迪柔和低对比配色，
通透水彩手绘统一美术质感，柔和柔光光影，遵循东方留白美学，
无尖锐硬边角，4K高清。
```

### 6.3 Universal Negative Prompt

Appended to every prompt to prevent style drift.

```
NEGATIVE-UNIVERSAL:
no 3D rendering, no photorealistic, no neon colors, no high saturation,
no sharp edges, no glass-morphism, no dark mode, no western illustration style,
no anime style, no cartoon, no thick outlines, no heavy shadows,
no busy composition, no cluttered details, no text, no watermark, no logo.
```

### 6.4 Asset-Specific Prompt Templates

#### 6.4.1 Texture Prompts

**PROMPT-AST-001 — Rice Paper Texture:**
```
[STYLE_HEADER]
Subject: 中国传统手工宣纸表面细腻纤维肌理，不规则分布天然纤维丝，
极淡暖米色底，轻微茶渍斑点，纸张自然褶皱纹理，无缝平铺贴图，
柔和散射光线，极简留白构图。
[NEGATIVE_UNIVERSAL]
no obvious repeating pattern, no dark stains, no text, no watermark.
Technical: 512x512 seamless tile, orthographic top-down view.
```

**PROMPT-AST-003 — Ink Wash Mountain Layers:**
```
[STYLE_HEADER]
Subject: [LAYER_DESCRIPTION — see table below], 横向全景构图，
底部山脉轮廓，顶部留白透明天空区域用于文字叠加。
[NEGATIVE_UNIVERSAL]
Technical: 2560x800, transparent background above mountains, horizontal panorama.
```

| Layer | LAYER_DESCRIPTION |
|---|---|
| AST-003 (Distant) | 极淡远山剪影，几乎融入天空，最少笔触，最浅墨色，大量留白 |
| AST-004 (Midground) | 中层山峦，可见水墨笔触纹理，中等墨色，略有松树轮廓点缀 |
| AST-005 (Foreground) | 近景深色山体，浓墨渲染，清晰山形轮廓，茶树梯田隐约可见 |

#### 6.4.2 Tea Illustration Prompts

**PROMPT-AST-030 — Green Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘绿茶植株特写，嫩绿茶芽，扁形叶片，
新鲜翠绿，叶缘半透明水彩渐变，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-031 — Black Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘红茶植株特写，深色卷曲条索状茶叶，
乌润色泽带金毫，暖棕色调，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-032 — Oolong Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘乌龙茶植株特写，半球形卷曲茶粒，
砂绿色泽带红边，半发酵茶叶特征，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-033 — White Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘白茶植株特写，银白色茶芽满披白毫，
纤柔嫩芽，极淡绿色调，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-034 — Yellow Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘黄茶植株特写，微黄嫩芽，
闷黄工艺特征，淡鹅黄色调，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-035 — Dark Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘黑茶植株特写，深色压制茶砖形态，
深褐近黑色泽，紧压茶特征纹理，暖棕底调，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

**PROMPT-AST-036 — Pu'er Tea Illustration:**
```
[STYLE_HEADER]
Subject: 一株精致水彩手绘普洱茶植株特写，圆饼茶形态，
陈化深褐色泽，压制茶饼纹理可见茶叶条索，古朴质感，白色留白背景，
中国工笔淡彩画法，细腻柔和笔触。
[NEGATIVE_UNIVERSAL]
no dark background, no pot, no cup, no text.
Technical: 400x500, transparent or white background, vertical portrait.
```

#### 6.4.3 Scene Prompts

**PROMPT-AST-014 — Ancient Tea Forest:**
```
[STYLE_HEADER]
Subject: 中国云南古茶树林深处，百年古茶树参天，林间斑驳光影，
苔藓覆盖树干，原始野性自然气息，横向全景构图，
底部密林，顶部透光留白，薄雾弥漫。
[NEGATIVE_UNIVERSAL]
no modern elements, no buildings, no people.
Technical: 2560x800, horizontal panorama, top area transparent for text.
```

**PROMPT-AST-016 — Tea Harvest:**
```
[STYLE_HEADER]
Subject: 中国春日茶山采茶场景，翠绿茶园梯田层层，
远景有小型采茶人剪影点缀（非主要焦点），竹编茶篓，
春日清新明亮氛围，横向全景构图。
[NEGATIVE_UNIVERSAL]
no modern machinery, no large human faces.
Technical: 2560x800, horizontal panorama, top area transparent for text.
```

**PROMPT-AST-018 — Tea Ceremony:**
```
[STYLE_HEADER]
Subject: 中国传统茶道场景，紫砂茶壶与白瓷茶杯，
热水注入时蒸汽升腾，禅意宁静室内氛围，
柔和暖光从侧面窗棂洒入，横向全景构图。
[NEGATIVE_UNIVERSAL]
no modern furniture, no people faces, no bright colors.
Technical: 2560x800, horizontal panorama, top area transparent for text.
```

#### 6.4.4 Map & Decoration Prompts

**PROMPT-AST-023 — Tea Point Pin:**
```
[STYLE_HEADER]
Subject: 极简水彩手绘小茶树图标，单株茶树剪影，
精巧细腻，透明背景，适合地图标记使用。
[NEGATIVE_UNIVERSAL]
no background, no shadow, no text.
Technical: 32x32, transparent background, icon scale, centered.
```

**PROMPT-AST-041 — Gold Foil Line:**
```
[STYLE_HEADER]
Subject: 极细烫金浮雕线条，哑光金色泽，手工不规则轻微粗细变化，
仿手工金箔贴边效果，透明背景。
[NEGATIVE_UNIVERSAL]
no pattern, no texture beyond gold line, no background.
Technical: 400x4, transparent background, horizontal line.
```

---

## 7. File Naming Conventions

### 7.1 Naming Pattern

```
[category]-[subject]-[variant]-[size].[format]

Examples:
  tex-rice-paper-512.webp          → Texture, rice paper, 512px
  img-tea-green-sd-400x500.webp    → Image, green tea, standard, 400×500
  img-scene-harvest-2560.webp      → Image, harvest scene, 2560px wide
  map-china-outline.svg            → Map, China outline
  icon-tea-leaf-24.svg             → Icon, tea leaf, 24px
  logo-tea-atlas-120.svg           → Logo, Tea Atlas, 120px
```

### 7.2 Category Prefixes

| Prefix | Category | Example |
|---|---|---|
| `tex-` | Texture (tileable patterns) | `tex-rice-paper-512.webp` |
| `img-` | Image (illustrations, scenes) | `img-tea-green-sd-400x500.webp` |
| `map-` | Map (SVG map elements) | `map-china-outline.svg` |
| `icon-` | Icon (SVG icons) | `icon-tea-leaf-24.svg` |
| `logo-` | Logo (brand assets) | `logo-tea-atlas-120.svg` |
| `dec-` | Decoration (lines, borders, dividers) | `dec-gold-line.svg` |
| `eff-` | Effect (particles, overlays) | `eff-snow-particle-64.webp` |

### 7.3 Size Suffixes

| Suffix | Meaning | Example |
|---|---|---|
| `-sd` | Standard definition (asset size from inventory) | `img-tea-green-sd-400x500.webp` |
| `-2x` | Retina (2× standard size) | `img-tea-green-2x-800x1000.webp` |
| `-thumb` | Thumbnail (for cards, lists) | `img-tea-green-thumb-200x250.webp` |
| (none) | Implicit size from dimensions or context | `tex-rice-paper-512.webp` |

---

## 8. Format & Compression Requirements

### 8.1 Format Selection

| Asset Type | Format | Reason |
|---|---|---|
| Textures (tileable) | **WebP** (lossy, quality 85) | Superior compression for photographic textures; supports alpha |
| Illustrations (watercolor) | **WebP** (lossy, quality 88) | Best size/quality ratio for watercolor gradients |
| Maps (vector) | **SVG** (optimized) | Infinite scaling; scriptable; small file size |
| Icons (vector) | **SVG** (optimized, sprite-capable) | `currentColor` support; crisp at all sizes |
| Logo | **SVG** (primary) + **PNG** (fallback) | SVG for web; PNG for favicon/social meta |
| Particles | **WebP** (lossless if ≤ 32px) | Small assets benefit from lossless |
| App Icon / Favicon | **PNG** | Universal compatibility for meta tags |

### 8.2 Compression Targets

| Format | Target Size | Quality Setting | Tools |
|---|---|---|---|
| WebP (lossy) | As specified in §3.1 per asset | Quality 85–90 | `cwebp`, Sharp, Squoosh |
| SVG | ≤ 30KB per file | Precision 2 (2 decimal places) | SVGO, `svgo --precision 2` |
| PNG | ≤ 30KB (favicon) | Lossless with max compression | `pngquant`, `oxipng` |

### 8.3 Resolution Rules

| ID | Rule | Priority |
|---|---|---|
| RES-R01 | All raster assets provided at 1× and 2× resolutions | P0 |
| RES-R02 | 2× assets use `-2x` suffix and exactly double the 1× dimensions | P0 |
| RES-R03 | Scene images (2560×800) target 1440p–4K displays; 1× only (2× would exceed 500KB budget) | P0 |
| RES-R04 | Textures max 1024×1024 per tile; prefer 512×512 | P0 |
| RES-R05 | Icons at 24×24 (1×) and 48×48 (2×) | P0 |
| RES-R06 | No asset exceeds 512KB — split into smaller assets if needed | P0 |

---

## 9. Seasonal Asset Mapping

### 9.1 Season → Asset Overrides

When the season changes (via bottom control bar slider), certain assets swap or overlay:

| Season | Cloud Opacity | Mountain Tint | Tea Point Color | Particle System | Color Overlay |
|---|---|---|---|---|---|
| **Spring** | 0.15 (light) | `Tea.30` wash | `Tea.50` | None | AST-025 |
| **Summer** | 0.10 (clear) | None (default) | `Tea.60` | None | AST-026 |
| **Autumn** | 0.20 (moderate) | `Warm.50` wash | `Warm.50` | None | AST-027 |
| **Winter** | 0.35 (heavy) | `Ink.30` wash | `Ink.40` (reduced count) | AST-029 (Snow) | AST-028 |

### 9.2 Season Transition Rules

| ID | Rule | Priority |
|---|---|---|
| SEA-R01 | Season asset swaps are always animated (smooth crossfade, DUR-04, EASE-04) | P0 |
| SEA-R02 | All seasonal overlays use CSS `mix-blend-mode` — never replace base assets | P0 |
| SEA-R03 | Winter reduces visible tea points by 60% (map data filter, not asset change) | P1 |
| SEA-R04 | Seasonal mountain tint is applied as a CSS `background-color` overlay, not a new image | P0 |

---

## 10. Constraints

| ID | Constraint |
|---|---|
| AST-C01 | All raster images use WebP format — no JPEG, no PNG (except favicon) |
| AST-C02 | All vector graphics use SVG — no EPS, no AI, no PDF |
| AST-C03 | No image exceeds 512KB — hard limit enforced at build time |
| AST-C04 | All AI prompts include the universal style header + negative prompt |
| AST-C05 | All color references use design tokens from `04-ui-design-system.md` |
| AST-C06 | No text in any AI-generated image — all text is CSS/HTML |
| AST-C07 | No photorealistic, 3D, anime, cartoon, or western illustration style |
| AST-C08 | All assets follow naming convention from §7 |
| AST-C09 | All assets follow resolution rules from §8.3 |
| AST-C10 | Rice paper texture must be seamless-tileable (visual continuity at all viewport sizes) |
| AST-C11 | Tea type illustrations must be visually distinct from each other |
| AST-C12 | No human faces clearly visible in any image (silhouettes only) |

---

## 11. Acceptance Criteria

- [ ] 45 assets inventoried with ID, dimensions, format, size target, and priority
- [ ] 22 P0 assets defined for Phase 1 MVP
- [ ] 23 P1 assets defined for Phase 2
- [ ] Universal style header prompt template defined
- [ ] Universal negative prompt template defined
- [ ] Asset-specific prompts for all AI-generated assets (textures, tea illustrations, scenes)
- [ ] 3-layer mountain parallax system specified with opacity and parallax rates
- [ ] 4-season overlay system specified with colors, opacity, and blend modes
- [ ] Cloud/fog layer system specified with drift speeds and opacity ranges
- [ ] Tea type illustration visual cues table covers all 7 tea types
- [ ] 6 scene illustrations specified with scroll ranges, key elements, and palettes
- [ ] File naming convention defined with category prefixes and size suffixes
- [ ] Format selection table covers all asset types
- [ ] Resolution rules (6 rules) defined
- [ ] Seasonal asset mapping table covers all 4 seasons
- [ ] All AST-C* constraints are verifiable
- [ ] No asset specification overlaps with `04-ui-design-system.md` (which defines tokens, not images)
- [ ] No animation specification — all animation references point to `05-animation-system.md`

---

## 12. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Color tokens for AI prompt references | `04-ui-design-system.md` | ✅ Complete |
| Animation IDs for seasonal transitions | `05-animation-system.md` | ✅ Complete |
| Map architecture for map assets | `06-map-system.md` | ✅ Complete |
| Scroll scene mapping for scene assets | `05-animation-system.md` §7.3 | ✅ Complete |
| Component specs for asset usage context | `08-component-specification.md` | ✅ Complete |
| Content guideline for cultural accuracy of prompts | `14-content-guideline.md` | ⚠️ Pending |

---

## 13. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-AST-01 | AI-generated images vary in style despite identical prompts | High | High | Generate 3–5 variants per prompt; select by human review against style checklist |
| RISK-AST-02 | Large total asset payload (45 assets × avg 80KB ≈ 3.6MB) impacts initial load | Medium | Medium | Lazy-load below-fold assets; progressive loading for scene images; texture and hero assets load first |
| RISK-AST-03 | Rice paper texture seamless tiling looks artificial | Medium | Medium | AI prompt specifies irregular fiber distribution; post-process with manual seam removal if needed |
| RISK-AST-04 | Seasonal color overlays look muddy on certain displays | Low | Low | Test on sRGB + P3 displays; use `mix-blend-mode` carefully |
| RISK-AST-05 | SVG map with 34 province paths exceeds performance budget for animations | Medium | Low | Simplify SVG paths with SVGO; use `will-change: transform` on map container |
| RISK-AST-06 | WebP format not supported in very old browsers (IE, KaiOS) | Low | Low | `<picture>` element with PNG fallback for textures only (hero/scene images accept degradation) |
| RISK-AST-07 | Tea type illustrations look too similar (especially Green vs Yellow, Dark vs Pu'er) | Medium | Medium | Visual cues table (§5.2) provides explicit differentiation parameters; human review required |

---

## 14. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| AST-Q01 | Should the rice paper texture be AI-generated (authentic look, larger file) or CSS-generated (lightweight, less authentic)? | ~38KB vs ~2KB; visual authenticity tradeoff | Before Task: Global Styles |
| AST-Q02 | Should we generate all 7 tea type illustrations in one batch (style consistency) or individually (more control)? | Batch = consistent style but less fine-tuning; individual = more iteration cycles | Before Task: Tea Illustrations |
| AST-Q03 | Should the China map use a pre-made SVG (Tencents, AMap) or be custom-drawn? | Custom = style control but ~10h work; pre-made = faster but style mismatch | Before Task: Map |
| AST-Q04 | Should province atmosphere images cover all 14 tea provinces (P2) or just the 3 major ones (P1)? | 14 provinces × 200KB = 2.8MB additional payload | Before Task: Province Pages |
| AST-Q05 | Should winter snow particles be CSS-based (`box-shadow` trick) or image-based (WebP sprites)? | CSS = 0KB but limited organic feel; image = ~5KB but more natural | Before Task: Winter Season |
| AST-Q06 | What AI image generation model/API should be used for production assets? | Consistency, cost, and iteration speed | Before first asset generation |

---

## 15. References

| Document | Relationship |
|---|---|
| `04-ui-design-system.md` | Color tokens, typography, layer system — all referenced in asset specifications |
| `05-animation-system.md` | ANIM-IDs for asset-related animations (fog drift, parallax, seasonal transitions) |
| `06-map-system.md` | Map architecture — AST-021 through AST-024 are consumed by the map system |
| `08-component-specification.md` | Component-level asset usage (which component uses which asset) |
| `14-content-guideline.md` | Cultural accuracy requirements for AI prompts |
| `03-site-architecture.md` | Asset directory structure: `public/assets/textures/`, `public/assets/images/`, etc. |

---

## 16. Asset Directory Structure

```
public/assets/
├── textures/
│   ├── tex-rice-paper-512.webp
│   ├── tex-rice-paper-dark-512.webp
│   └── tex-map-terrain-1024.webp
├── images/
│   ├── hero/
│   │   ├── img-hero-landscape-2560.webp
│   │   └── img-tea-leaf-fall-200.webp
│   ├── mountains/
│   │   ├── img-mountain-distant-2560.webp
│   │   ├── img-mountain-midground-2560.webp
│   │   └── img-mountain-foreground-2560.webp
│   ├── clouds/
│   │   ├── img-cloud-distant-2560.webp
│   │   ├── img-cloud-foreground-2560.webp
│   │   ├── img-fog-light-2560.webp
│   │   └── img-fog-heavy-2560.webp
│   ├── tea/
│   │   ├── img-tea-bush-400.webp
│   │   ├── img-tea-dry-leaves-400x300.webp
│   │   ├── img-tea-green-sd-400x500.webp
│   │   ├── img-tea-green-2x-800x1000.webp
│   │   ├── img-tea-black-sd-400x500.webp
│   │   ├── img-tea-oolong-sd-400x500.webp
│   │   ├── img-tea-white-sd-400x500.webp
│   │   ├── img-tea-yellow-sd-400x500.webp
│   │   ├── img-tea-dark-sd-400x500.webp
│   │   └── img-tea-puer-sd-400x500.webp
│   ├── scenes/
│   │   ├── img-scene-forest-2560.webp
│   │   ├── img-scene-mountains-2560.webp
│   │   ├── img-scene-harvest-2560.webp
│   │   ├── img-scene-processing-2560.webp
│   │   ├── img-scene-ceremony-2560.webp
│   │   └── img-scene-modern-2560.webp
│   ├── provinces/
│   │   ├── img-province-fujian-2560.webp
│   │   ├── img-province-yunnan-2560.webp
│   │   └── img-province-zhejiang-2560.webp
│   ├── seasons/
│   │   ├── eff-season-spring-2560.webp
│   │   ├── eff-season-summer-2560.webp
│   │   ├── eff-season-autumn-2560.webp
│   │   └── eff-season-winter-2560.webp
│   ├── timeline/
│   │   ├── img-timeline-stage-01-600x400.webp
│   │   ├── img-timeline-stage-02-600x400.webp
│   │   ├── img-timeline-stage-03-600x400.webp
│   │   ├── img-timeline-stage-04-600x400.webp
│   │   ├── img-timeline-stage-05-600x400.webp
│   │   ├── img-timeline-stage-06-600x400.webp
│   │   └── img-timeline-stage-07-600x400.webp
│   └── misc/
│       ├── img-empty-state-400x300.webp
│       └── eff-snow-particle-64.webp
├── map/
│   ├── map-china-outline.svg
│   └── map-province-highlight.svg
├── icons/
│   ├── icon-tea-leaf-24.svg
│   ├── icon-tea-pin-32.svg
│   ├── icon-tea-culture-sprite.svg
│   └── ... (see `04-ui-design-system.md` §14.2 for full icon inventory)
├── decorations/
│   ├── dec-gold-line.svg
│   └── dec-ink-brush-stroke.svg
├── logo/
│   ├── logo-tea-atlas-120.svg
│   ├── logo-tea-atlas-512.png
│   └── favicon-32.png
└── fonts/
    ├── NotoSerifSC-Regular.woff2
    ├── NotoSerifSC-Bold.woff2
    ├── NotoSansSC-Regular.woff2
    ├── NotoSansSC-Medium.woff2
    └── MaShanZheng-Regular.woff2
```

---

## 17. Production Pipeline

### 17.1 Asset Generation Workflow

```
1. PROMPT
   ├── Write prompt using template from §6
   ├── Review against style header checklist
   └── Approve prompt

2. GENERATE
   ├── Run prompt through AI image generation API
   ├── Generate 3–5 variants per prompt
   └── Save all variants for review

3. REVIEW
   ├── Human review against checklist:
   │   ├── □ Matches ink-wash watercolor style
   │   ├── □ Low saturation, Morandi palette
   │   ├── □ No forbidden elements (3D, neon, text, faces)
   │   ├── □ Transparent/white background where required
   │   ├── □ Correct dimensions
   │   └── □ Visually distinct from other assets in same category
   ├── Select best variant
   └── Document selection rationale

4. PROCESS
   ├── Crop/resize to exact specification dimensions
   ├── Convert to WebP (cwebp -q 85-90)
   ├── Generate 2× variant if applicable
   ├── Run through SVGO (SVG assets only)
   ├── Verify file size under budget
   └── Name according to §7 convention

5. INTEGRATE
   ├── Place in correct directory (§16)
   ├── Update asset manifest (auto-generated)
   ├── Reference in component (via CSS or <img>)
   └── Test on 1× and 2× displays
```

### 17.2 Asset Quality Checklist

Every asset must pass this checklist before integration:

- [ ] Style matches `PROMPT-HEADER` description
- [ ] Color palette within Tea Atlas design tokens
- [ ] No text, watermark, or logo in image
- [ ] No photorealistic or 3D elements
- [ ] Dimensions match specification ±2px
- [ ] File size under budget
- [ ] Correct format (WebP/SVG/PNG)
- [ ] Correct file name
- [ ] Seamless tiling (textures only)
- [ ] Transparent background (where specified)
- [ ] Visible at intended display size
- [ ] 2× variant generated (where applicable)

---

## 18. Implementation Checklist

- [ ] AST-IMPL-001: Generate rice paper texture (AST-001, AST-002)
- [ ] AST-IMPL-002: Generate 3-layer mountain parallax (AST-003 – AST-005)
- [ ] AST-IMPL-003: Generate cloud and fog layers (AST-006 – AST-009)
- [ ] AST-IMPL-004: Generate hero landscape composite (AST-010)
- [ ] AST-IMPL-005: Generate falling tea leaf (AST-011)
- [ ] AST-IMPL-006: Generate tea bush + dry leaves (AST-012, AST-013)
- [ ] AST-IMPL-007: Generate 7 tea type illustrations (AST-030 – AST-036)
- [ ] AST-IMPL-008: Generate 6 scene illustrations (AST-014 – AST-019)
- [ ] AST-IMPL-009: Create SVG China province map (AST-021)
- [ ] AST-IMPL-010: Create map supporting assets (AST-022 – AST-024)
- [ ] AST-IMPL-011: Create seasonal color overlays (AST-025 – AST-028)
- [ ] AST-IMPL-012: Create snow particle (AST-029)
- [ ] AST-IMPL-013: Create tea logo (AST-020)
- [ ] AST-IMPL-014: Create decorative lines (AST-041, AST-042)
- [ ] AST-IMPL-015: Create icon sprite (AST-043)
- [ ] AST-IMPL-016: Create empty state illustration (AST-040)
- [ ] AST-IMPL-017: Generate 7 timeline stage illustrations (AST-044)
- [ ] AST-IMPL-018: Generate 3 province atmosphere images (AST-037 – AST-039)
- [ ] AST-IMPL-019: Create favicon/app icon (AST-045)
- [ ] AST-IMPL-020: Set up asset directory structure per §16
- [ ] AST-IMPL-021: Configure WebP conversion pipeline
- [ ] AST-IMPL-022: Configure SVGO optimization pipeline
- [ ] AST-IMPL-023: Generate asset manifest JSON
- [ ] AST-IMPL-024: Font files acquired and subsetted (see §16 fonts/)

---

## 19. Next Document

> **`13-animation-timeline.md`** — Frame-by-frame animation sequencing, temporal order of all ANIM-IDs, scene animation orchestration, and timeline visualization of the complete animation sequence.

---

> This document is the visual library of Tea Atlas. Every texture, every watercolor illustration, every SVG icon — they are all specified here. AI prompts are provided verbatim so any team member or future Codex can regenerate assets with consistent style. No asset enters the project without passing through this guide.
