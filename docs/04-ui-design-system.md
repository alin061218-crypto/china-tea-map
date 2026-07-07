# 04 — UI Design System

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | UI-DS-004 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-04 |
| **Related Documents** | `03-site-architecture.md`, `05-animation-system.md`, `08-component-specification.md`, `12-assets-guide.md` |

---

## 2. Design System Scope

This document is the **single source of truth for all visual rules**. It defines:

| In Scope | Out of Scope (→ `05-animation-system.md`) |
|---|---|
| Design Tokens | Animation durations |
| Color System | Easing curves |
| Typography | GSAP timeline definitions |
| Spacing | Scroll-driven animation behavior |
| Radius | Camera motion |
| Elevation / Shadows | Keyframe definitions |
| Grid & Layout | Transition implementations |
| Component Library & Variants | Bloom / growth animations |
| Visual States | Mist / fog animation |
| Icon Rules | — |
| Layer System (z-index) | — |
| Motion References (ID only) | — |

---

## 3. Design Token System

### 3.1 Token Hierarchy

Tea Atlas uses a **four-level token system**. Components consume only Component Tokens or Instance Tokens. Primitive and Semantic tokens are internal to the design system.

```
Primitive Token        →  Semantic Token       →  Component Token      →  Instance
─────────────────────────────────────────────────────────────────────────────────
Gray.0 – Gray.100      →  Color.Surface.*      →  Card.Background      →  TeaCard
                                                    Button.Background
Ink.0 – Ink.100        →  Color.Ink.*          →  Hero.Background
Warm.0 – Warm.100      →  Color.Accent.*       →  Province.Highlight
Green.0 – Green.100    →  Color.Tea.*          →  Tea.Type.Green
                                                    Tea.Type.Oolong
```

### 3.2 Token Naming Convention

```
[Category].[Subcategory].[Modifier]

Examples:
  Color.Surface.Primary
  Color.Text.Secondary
  Typography.Title.XL
  Spacing.Section.Vertical
  Radius.Card
```

---

## 4. Primitive Tokens

### 4.1 Neutral Scale

| Token | Role | Value |
|---|---|---|
| `Neutral.0` | Pure white (paper base) | `#FAF8F5` |
| `Neutral.10` | Off-white | `#F5F2ED` |
| `Neutral.20` | Light warm gray | `#EDE8E2` |
| `Neutral.30` | Light gray | `#E0DBD4` |
| `Neutral.40` | Medium light gray | `#C5BFB5` |
| `Neutral.50` | Medium gray | `#A0998F` |
| `Neutral.60` | Medium dark gray | `#7A7369` |
| `Neutral.70` | Dark warm gray | `#5C564D` |
| `Neutral.80` | Darker gray (body text) | `#3D3831` |
| `Neutral.90` | Near black | `#1F1C18` |
| `Neutral.100` | Pure black (ink) | `#0D0B08` |

### 4.2 Ink Scale

| Token | Role | Value |
|---|---|---|
| `Ink.10` | Lightest wash | `#E8E3DB` |
| `Ink.20` | Light wash | `#D5CFC5` |
| `Ink.30` | Pale ink | `#BFB8AD` |
| `Ink.40` | Soft ink | `#A3998C` |
| `Ink.50` | Medium ink | `#807668` |
| `Ink.60` | Dark ink | `#595145` |
| `Ink.70` | Deep ink | `#3D3730` |
| `Ink.80` | Calligraphy ink | `#26221D` |
| `Ink.90` | Sumi ink | `#141210` |
| `Ink.100` | Pure ink | `#0A0806` |

### 4.3 Warm Accent Scale

| Token | Role | Value |
|---|---|---|
| `Warm.10` | Lightest warm | `#FDF6ED` |
| `Warm.20` | Light warm | `#F9E8D5` |
| `Warm.30` | Pale amber | `#F2D4B0` |
| `Warm.40` | Soft amber | `#E8C088` |
| `Warm.50` | Amber | `#D4A05C` |
| `Warm.60` | Tea stain | `#B8803E` |
| `Warm.70` | Deep amber | `#8C5E2A` |
| `Warm.80` | Dark amber | `#6B4420` |
| `Warm.90` | Deep tea | `#4A2E14` |

### 4.4 Tea Green Scale

| Token | Role | Value |
|---|---|---|
| `Tea.10` | Lightest green | `#F2F7F0` |
| `Tea.20` | Light green | `#DFEDD8` |
| `Tea.30` | Pale tea green | `#C5E0B8` |
| `Tea.40` | Soft tea green | `#A3CF90` |
| `Tea.50` | Tea green | `#7AB865` |
| `Tea.60` | Fresh tea | `#5A9A45` |
| `Tea.70` | Deep green | `#3D7530` |
| `Tea.80` | Dark tea green | `#285520` |
| `Tea.90` | Deep forest | `#1A3814` |

### 4.5 Accent Colors (Sparse Use)

| Token | Value | Usage |
|---|---|---|
| `Accent.Red` | `#C45A4A` | Red tea type indicator, seal stamps |
| `Accent.Gold` | `#B8956A` | Special highlights, ceremony elements |
| `Accent.Blue` | `#6B8FA3` | Celadon / 青花 reference |
| `Accent.Jade` | `#8FBBA0` | Jade elements, subtle accents |

---

## 5. Semantic Tokens

### 5.1 Color Tokens

| Token | Value (ref) | Usage |
|---|---|---|
| `Color.Surface.Primary` | `Neutral.0` | Page background |
| `Color.Surface.Secondary` | `Neutral.10` | Section background alt |
| `Color.Surface.Card` | `Neutral.0` | Card background |
| `Color.Surface.Nav` | `Neutral.0` (95% opacity) | Navigation bar |
| `Color.Surface.Panel` | `Neutral.10` (98% opacity) | Floating panel background |
| `Color.Surface.Modal` | `Neutral.0` | Modal / overlay background |
| `Color.Surface.Hover` | `Neutral.10` | Hover state background |
| `Color.Surface.Active` | `Neutral.20` | Active/pressed state background |
| `Color.Surface.Selected` | `Tea.10` | Selected state background |
| `Color.Surface.Disabled` | `Neutral.20` | Disabled state background |
| `Color.Text.Primary` | `Ink.90` | Primary text (headings, body) |
| `Color.Text.Secondary` | `Ink.60` | Secondary text (captions, meta) |
| `Color.Text.Tertiary` | `Ink.40` | Placeholder, disabled text |
| `Color.Text.Inverse` | `Neutral.0` | Text on dark backgrounds |
| `Color.Text.Link` | `Tea.70` | Hyperlink text |
| `Color.Text.LinkHover` | `Tea.80` | Hyperlink hover |
| `Color.Border.Default` | `Ink.20` | Default border |
| `Color.Border.Hover` | `Ink.40` | Hover border |
| `Color.Border.Focus` | `Tea.50` | Focus ring |
| `Color.Border.Active` | `Ink.50` | Active border |
| `Color.Accent.Primary` | `Warm.50` | Primary accent |
| `Color.Accent.Secondary` | `Tea.50` | Secondary accent |
| `Color.Accent.Region` | `Warm.60` | Province/map highlight |
| `Color.Accent.Active` | `Tea.60` | Active filter, selected element |
| `Color.Accent.Error` | `Accent.Red` | Error state |
| `Color.Accent.Success` | `Tea.60` | Success state |
| `Color.Ink.Base` | `Ink.30` | Ink-wash base layer |
| `Color.Ink.Mid` | `Ink.50` | Ink-wash mid-tone |
| `Color.Ink.Dark` | `Ink.70` | Ink-wash dark strokes |
| `Color.Ink.Calligraphy` | `Ink.90` | Calligraphy text |

### 5.2 Typography Tokens

| Token | Font Family | Font Weight | Line Height | Usage |
|---|---|---|---|---|
| `Typography.Display.XL` | `"Noto Serif SC", "Source Han Serif", serif` | 700 | 1.1 | Hero title |
| `Typography.Display.L` | `"Noto Serif SC", "Source Han Serif", serif` | 700 | 1.15 | Page titles |
| `Typography.Display.M` | `"Noto Serif SC", "Source Han Serif", serif` | 600 | 1.2 | Section titles |
| `Typography.Title.XL` | `"Noto Serif SC", "Source Han Serif", serif` | 600 | 1.25 | Province name, tea name (detail) |
| `Typography.Title.L` | `"Noto Serif SC", "Source Han Serif", serif` | 600 | 1.3 | Card titles |
| `Typography.Title.M` | `"Noto Serif SC", "Source Han Serif", serif` | 500 | 1.3 | Panel titles |
| `Typography.Title.S` | `"Noto Serif SC", "Source Han Serif", serif` | 500 | 1.35 | Subsection titles |
| `Typography.Body.L` | `"Noto Sans SC", "Source Han Sans", sans-serif` | 400 | 1.7 | Lead paragraphs |
| `Typography.Body.M` | `"Noto Sans SC", "Source Han Sans", sans-serif` | 400 | 1.7 | Body text |
| `Typography.Body.S` | `"Noto Sans SC", "Source Han Sans", sans-serif` | 400 | 1.6 | Captions, meta |
| `Typography.Label.M` | `"Noto Sans SC", "Source Han Sans", sans-serif` | 500 | 1.4 | Labels, chips, tags |
| `Typography.Label.S` | `"Noto Sans SC", "Source Han Sans", sans-serif` | 500 | 1.3 | Badges, small labels |
| `Typography.Calligraphy` | `"Ma Shan Zheng", "ZCOOL KuaiLe", cursive` | 400 | 1.3 | Decorative Chinese text, poetic quotes |

### 5.3 Typography Size Scale

| Token | Size (px) | Size (rem) |
|---|---|---|
| `Size.XXS` | 11 | 0.6875 |
| `Size.XS` | 12 | 0.75 |
| `Size.S` | 14 | 0.875 |
| `Size.M` | 16 | 1 |
| `Size.L` | 18 | 1.125 |
| `Size.XL` | 20 | 1.25 |
| `Size.XXL` | 24 | 1.5 |
| `Size.Display.S` | 32 | 2 |
| `Size.Display.M` | 40 | 2.5 |
| `Size.Display.L` | 56 | 3.5 |
| `Size.Display.XL` | 80 | 5 |

### 5.4 Spacing Tokens

| Token | Value (px) | Value (rem) | Usage |
|---|---|---|---|
| `Spacing.XXS` | 4 | 0.25 | Inline gap (icon + text) |
| `Spacing.XS` | 8 | 0.5 | Tight internal padding |
| `Spacing.S` | 12 | 0.75 | Internal padding |
| `Spacing.M` | 16 | 1 | Standard padding |
| `Spacing.L` | 24 | 1.5 | Section internal spacing |
| `Spacing.XL` | 32 | 2 | Block spacing |
| `Spacing.XXL` | 48 | 3 | Large block spacing |
| `Spacing.Section.Vertical` | 80 | 5 | Vertical gap between page sections |
| `Spacing.Section.Horizontal` | 64 | 4 | Horizontal section margin |
| `Spacing.Grid.Gap` | 24 | 1.5 | Grid item gap |
| `Spacing.Grid.Row` | 32 | 2 | Grid row gap |
| `Spacing.Page.Padding` | 48 | 3 | Page-level horizontal padding |

### 5.5 Radius Tokens

| Token | Value (px) | Usage |
|---|---|---|
| `Radius.None` | 0 | Sharp edges (calligraphy panels) |
| `Radius.XS` | 2 | Subtle rounding |
| `Radius.S` | 4 | Inputs, chips, tags |
| `Radius.M` | 8 | Cards, panels |
| `Radius.L` | 12 | Large cards, modal |
| `Radius.XL` | 16 | Hero panels |
| `Radius.Full` | 9999px | Pills, badges |

### 5.6 Elevation / Shadow Tokens

| Token | Shadow Value | Usage |
|---|---|---|
| `Elevation.None` | `none` | Flat elements |
| `Elevation.XS` | `0 1px 2px rgba(10,8,6,0.04)` | Subtle lift (card default) |
| `Elevation.S` | `0 2px 8px rgba(10,8,6,0.06)` | Hover cards |
| `Elevation.M` | `0 4px 16px rgba(10,8,6,0.08)` | Floating panels |
| `Elevation.L` | `0 8px 32px rgba(10,8,6,0.10)` | Modal, dropdown |
| `Elevation.XL` | `0 16px 48px rgba(10,8,6,0.12)` | Fullscreen overlay |

> Shadows use `Ink.100` (`#0A0806`) as the shadow base. All shadows are warm, not pure black.

### 5.7 Opacity Tokens

| Token | Value | Usage |
|---|---|---|
| `Opacity.Disabled` | 0.4 | Disabled elements |
| `Opacity.Hover` | 0.08 | Hover overlay |
| `Opacity.Pressed` | 0.12 | Pressed overlay |
| `Opacity.Overlay` | 0.5 | Modal backdrop |
| `Opacity.Muted` | 0.6 | Muted non-tea provinces |
| `Opacity.Ghost` | 0.12 | Ghost button background |
| `Opacity.Fog.Light` | 0.15 | Light fog layer |
| `Opacity.Fog.Heavy` | 0.35 | Heavy fog layer |

---

## 6. Component Tokens

### 6.1 Component Token Map

Each Semantic Token maps to one or more Component Tokens.

| Semantic Token | Component Token |
|---|---|
| `Color.Surface.Primary` | `Page.Background` |
| `Color.Surface.Card` | `Card.Background` |
| `Color.Surface.Hover` | `Card.HoverBackground`, `Button.HoverBackground` |
| `Color.Surface.Nav` | `Nav.Background` |
| `Color.Surface.Panel` | `Panel.Background` |
| `Color.Text.Primary` | `Card.Title`, `Panel.Title`, `Hero.Title` |
| `Color.Text.Secondary` | `Card.Description`, `Panel.Caption`, `Filter.Chip` |
| `Color.Accent.Active` | `Filter.ChipActive`, `Tab.Active`, `Province.Selected` |
| `Color.Border.Default` | `Card.Border`, `Input.Border`, `Divider` |
| `Color.Border.Focus` | `Input.FocusRing`, `Button.FocusRing` |

### 6.2 Instance Token Examples

| Component Token | Instance | Value Override |
|---|---|---|
| `Card.Background` | `TeaCard.Background` | — (inherits) |
| `Card.Background` | `ProvinceCard.Background` | — (inherits) |
| `Card.Title` | `TeaCard.Title` | — (inherits) |
| `Card.Title` | `ProvinceCard.Title` | `Typography.Title.XL` (overrides size) |
| `Filter.Chip` | `TypeFilter.Chip` | — (inherits) |
| `Filter.ChipActive` | `TypeFilter.ChipActive` | — (inherits) |

---

## 7. Typography Rules

| ID | Rule | Priority |
|---|---|---|
| TYPO-R01 | All Chinese text uses serif fonts (Noto Serif SC) | P0 |
| TYPO-R02 | All English body text uses sans-serif fonts (Noto Sans SC) | P0 |
| TYPO-R03 | Decorative calligraphy uses `Typography.Calligraphy` — never for body text | P0 |
| TYPO-R04 | Heading-to-body hierarchy uses at least 1.5× size ratio | P0 |
| TYPO-R05 | Line height minimum 1.5 for body text | P0 |
| TYPO-R06 | Maximum line length: 72 characters for body text | P0 |
| TYPO-R07 | Font sizes use rem units, never px | P0 |
| TYPO-R08 | No more than 3 font families loaded per page | P0 |
| TYPO-R09 | No italic for Chinese text (Chinese typography convention) | P0 |

---

## 8. Color Rules

| ID | Rule | Priority |
|---|---|---|
| CLR-R01 | Pure white (`#FFFFFF`) is never used — use `Neutral.0` (`#FAF8F5`) instead | P0 |
| CLR-R02 | Pure black (`#000000`) is never used — use `Ink.90` (`#141210`) or `Ink.100` (`#0A0806`) | P0 |
| CLR-R03 | No neon, no high-saturation colors | P0 |
| CLR-R04 | Gradients must stay within one color family (Ink-to-Ink, Tea-to-Tea) | P0 |
| CLR-R05 | Color alone never conveys information — always pair with an icon or text | P0 |
| CLR-R06 | Background-to-text contrast ratio ≥ 4.5:1 (WCAG AA) | P0 |
| CLR-R07 | Large text (≥24px) contrast ratio ≥ 3:1 | P0 |
| CLR-R08 | Accent colors cover ≤ 5% of any viewport | P1 |

---

## 9. Spacing & Layout Rules

| ID | Rule | Priority |
|---|---|---|
| SPC-R01 | All spacing uses tokens from Section 5.4 — never ad-hoc values | P0 |
| SPC-R02 | Section vertical spacing is always `Spacing.Section.Vertical` (80px) | P0 |
| SPC-R03 | Card grid uses `Spacing.Grid.Gap` (24px) and `Spacing.Grid.Row` (32px) | P0 |
| SPC-R04 | Page horizontal padding uses `Spacing.Page.Padding` (48px) | P0 |
| SPC-R05 | Minimum white space ratio: 20% of any viewport must be negative space | P0 |
| SPC-R06 | Maximum content width: 1280px (with full-bleed exceptions for hero/map) | P1 |
| SPC-R07 | Spacing scale follows 4px baseline grid | P0 |

---

## 10. Grid System

### 10.1 Page Grid

| Property | Value |
|---|---|
| Columns | 12 |
| Gutter | `Spacing.Grid.Gap` (24px) |
| Max content width | 1280px |
| Margin (≥1440px) | Auto (centered) |
| Margin (1280–1439px) | `Spacing.Page.Padding` (48px) |

### 10.2 Card Grid (Encyclopedia)

| Property | Value |
|---|---|
| Columns (≥1440px) | 4 |
| Columns (1280–1439px) | 3 |
| Columns (1024–1279px) | 2 |
| Columns (<1024px) | 1 |
| Gap | `Spacing.Grid.Gap` (24px) |
| Row gap | `Spacing.Grid.Row` (32px) |

---

## 11. Component Library

### 11.1 Component Inventory

| Component | Type | Variants | Owner Module |
|---|---|---|---|
| **TeaCard** | Card | Default, Compact, Featured | Encyclopedia (shared) |
| **ProvinceCard** | Card | Default, Compact | Map Page, Encyclopedia |
| **SceneCard** | Card | Story (full-bleed) | Homepage / Scenes |
| **FilterBar** | Control | Default | Encyclopedia |
| **FilterChip** | Control | Default, Active, Removable | Encyclopedia |
| **TypeBadge** | Badge | Green, Black, Oolong, White, Yellow, Dark, Puer | Encyclopedia, Tea Detail |
| **RegionBadge** | Badge | Default | Map, Province Detail |
| **NavigationBar** | Navigation | Default, Transparent, Hidden | Global |
| **NavItem** | Navigation | Default, Active | Global |
| **ProvincePanel** | Panel | Floating (map), Side (page) | Map Module, Province Detail |
| **DetailPanel** | Panel | Side | Tea Detail |
| **FlavorWheel** | Data Display | Default | Tea Detail |
| **BrewingGuide** | Data Display | Default (steps) | Tea Detail |
| **MiniMap** | Map | Default | Tea Detail, Province Detail |
| **TimelineTrack** | Data Display | Default | Homepage / Timeline |
| **TimelineStage** | Data Display | Default, Active, Complete | Homepage / Timeline |
| **ScrollIndicator** | Navigation | Default | Hero |
| **EmptyState** | Feedback | Default | Encyclopedia |
| **PageTransition** | Animation | FadeUp, FadeOut | Global |
| **FogLayer** | Visual Effect | Light, Heavy | Homepage, Map Page |
| **InkLayer** | Visual Effect | Default | Homepage, Map Page |
| **ParallaxContainer** | Visual Effect | Default (2-layer, 3-layer) | Homepage |
| **Tooltip** | Overlay | Default | Map (province hover) |

### 11.2 Component → Variant Matrix

#### 11.2.1 Card Variants

| Variant | Token Reference | Dimensions | Usage |
|---|---|---|---|
| **Card.Default** | `Card.Background`, `Radius.M`, `Elevation.XS` | min 280×360px | TeaCard, ProvinceCard |
| **Card.Compact** | `Card.Background`, `Radius.M`, `Elevation.XS` | min 200×120px | Related teas, province list item |
| **Card.Featured** | `Card.Background`, `Radius.L`, `Elevation.S` | min 360×440px | Hero tea, featured province |
| **Card.Story** | Transparent, `Radius.None`, `Elevation.None` | Full viewport width | Scroll narrative scene |

#### 11.2.2 Panel Variants

| Variant | Token Reference | Dimensions | Usage |
|---|---|---|---|
| **Panel.Floating** | `Panel.Background`, `Radius.M`, `Elevation.M` | 360×480px | Map province detail |
| **Panel.Side** | `Panel.Background`, `Radius.None`, `Elevation.None` | 400px × full height | Province/Tea detail side panel |
| **Panel.Detail** | `Panel.Background`, `Radius.L`, `Elevation.L` | 480×640px | Modal-style detail |

#### 11.2.3 Badge Variants

| Variant | Token Reference | Usage |
|---|---|---|
| **Badge.Type.Green** | `Tea.70` background, `Neutral.0` text | Green tea |
| **Badge.Type.Black** | `Warm.70` background, `Neutral.0` text | Black tea |
| **Badge.Type.Oolong** | `Tea.50` background, `Ink.80` text | Oolong tea |
| **Badge.Type.White** | `Neutral.30` background, `Ink.70` text | White tea |
| **Badge.Type.Yellow** | `Warm.30` background, `Ink.70` text | Yellow tea |
| **Badge.Type.Dark** | `Ink.60` background, `Neutral.0` text | Dark tea |
| **Badge.Type.Puer** | `Warm.60` background, `Neutral.0` text | Pu'er tea |
| **Badge.Region** | `Warm.20` background, `Warm.80` text | Province/region badge |

#### 11.2.4 Chip Variants

| Variant | Token Reference | Usage |
|---|---|---|
| **Chip.Default** | `Neutral.10` bg, `Neutral.70` text, `Radius.Full` | Filter chip (inactive) |
| **Chip.Active** | `Tea.10` bg, `Tea.70` text, `Radius.Full` | Filter chip (active) |
| **Chip.Removable** | Same as Active + '×' icon | Active filter tag |

#### 11.2.5 Navigation Variants

| Variant | Token Reference | Usage |
|---|---|---|
| **Nav.Transparent** | Transparent bg, `Color.Text.Primary` | Hero section (before scroll) |
| **Nav.Default** | `Nav.Background` (95% opacity), `Color.Text.Primary` | After scroll past hero |
| **Nav.Hidden** | `opacity: 0`, `pointer-events: none` | During critical animations |

---

## 12. Component State Matrix

Every interactive component supports these states. States share consistent visual treatment across all components.

### 12.1 State Definitions

| State | Trigger | Visual Treatment (Component-Token Level) |
|---|---|---|
| **Default** | Initial render, no interaction | Component's default tokens |
| **Hover** | Mouse enter | `Surface.Hover` background, `Border.Hover`, subtle scale (via ANIM-020) |
| **Focus** | Keyboard focus | `Border.Focus` ring, 2px offset |
| **Active** | Mouse down / key down | `Surface.Active` background, slight scale-down (via ANIM-021) |
| **Pressed** | Click moment | Same as Active + brief duration |
| **Selected** | Selection persisted | `Surface.Selected` background, `Accent.Active` border |
| **Disabled** | Not available | `Opacity.Disabled`, `Surface.Disabled`, no pointer events |
| **Loading** | Data fetching / processing | Skeleton or subtle pulse (via ANIM-023) |
| **Error** | Validation or fetch failure | `Accent.Error` border, error icon |
| **Success** | Action completed | `Accent.Success` indicator, brief highlight |
| **Warning** | Non-blocking issue | Warm border, subtle warning icon |

### 12.2 State Applicability Matrix

| Component | D | H | F | A | P | S | Di | L | E | Su | W |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **TeaCard** | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | — |
| **ProvinceCard** | ✓ | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | — |
| **FilterChip** | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | — | — | — | — |
| **TypeBadge** | ✓ | — | — | — | — | — | — | — | — | — | — |
| **NavItem** | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | — | — | — | — |
| **ProvincePanel** | ✓ | — | — | — | — | — | — | ✓ | — | — | — |
| **Map Province** | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| **TimelineStage** | ✓ | ✓ | — | — | — | ✓ | — | — | — | — | — |
| **Button** | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — | — |
| **Input** | ✓ | — | ✓ | — | — | — | ✓ | — | ✓ | — | — |

> D=Default, H=Hover, F=Focus, A=Active, P=Pressed, S=Selected, Di=Disabled, L=Loading, E=Error, Su=Success, W=Warning

### 12.3 State Consistency Rules

| ID | Rule | Priority |
|---|---|---|
| STT-R01 | All interactive components must handle: Default, Hover, Focus, Disabled | P0 |
| STT-R02 | Hover state feedback latency ≤ 150ms | P0 |
| STT-R03 | Focus indicators use `Border.Focus` (2px `Tea.50` outline, 2px offset) | P0 |
| STT-R04 | Disabled state always includes `cursor: not-allowed` + `Opacity.Disabled` | P0 |
| STT-R05 | Loading state shows skeleton with same dimensions as content | P0 |
| STT-R06 | No component has hover state on touch devices | P0 |

---

## 13. Visual Layer System

### 13.1 Layer Stack (Bottom → Top)

| z-index | Layer Name | Owner | Description |
|---|---|---|---|
| 0 | **Background** | Page | Base background color/image |
| 10 | **Paper Texture** | Visual Effects | Rice paper texture overlay (full viewport) |
| 20 | **Ink Wash** | Visual Effects | Ink-wash landscape layers, mountains |
| 30 | **Cloud** | Visual Effects | Distant cloud elements |
| 40 | **Fog** | Visual Effects | Foreground mist/fog overlay |
| 50 | **Content** | Pages | All page content (cards, text, grids) |
| 60 | **Map** | Map Module | SVG China map |
| 70 | **Map Markers** | Map Module | Province labels, tea point pins |
| 80 | **Parallax Foreground** | Visual Effects | Foreground parallax elements (leaves, branches) |
| 100 | **Floating Panels** | Shared | Floating detail panels on map |
| 200 | **Navigation Bar** | Global | Persistent navigation |
| 300 | **Side Panels** | Shared | Slide-in panels |
| 400 | **Modal Overlay** | Shared | Backdrop |
| 500 | **Modal Content** | Shared | Full modal/dialog |
| 600 | **Tooltip** | Shared | Hover tooltips |
| 700 | **Scroll Indicator** | Hero | Scroll-down indicator |
| 800 | **Cursor** | Global | Custom cursor (if implemented) |

### 13.2 Layer Rules

| ID | Rule | Priority |
|---|---|---|
| LYR-R01 | All z-index values defined here — no ad-hoc z-index in component CSS | P0 |
| LYR-R02 | Layer names are used as CSS custom properties: `var(--z-content)`, `var(--z-map)` etc. | P0 |
| LYR-R03 | No layer value may be overridden by a component | P0 |
| LYR-R04 | Paper Texture layer is always present, always at z-index 10 | P0 |
| LYR-R05 | Fog layer opacity is controlled by scroll position (see ANIM-012) | P0 |

---

## 14. Icon System

### 14.1 Icon Rules

| ID | Rule | Priority |
|---|---|---|
| ICO-R01 | Icons are inline SVG only — no icon font, no PNG icons | P0 |
| ICO-R02 | Icon size uses tokens: `Icon.S` (16px), `Icon.M` (20px), `Icon.L` (24px), `Icon.XL` (32px) | P0 |
| ICO-R03 | Icon color inherits from parent text color by default (`currentColor`) | P0 |
| ICO-R04 | No more than 2 icon sizes per component | P1 |
| ICO-R05 | Decorative icons have `aria-hidden="true"` | P0 |
| ICO-R06 | Functional icons have accessible labels | P0 |

### 14.2 Icon Inventory

| Icon | Usage | Size |
|---|---|---|
| `icon-tea-leaf` | Tea type indicator | `Icon.M` (20px) |
| `icon-mountain` | Province/region indicator | `Icon.M` |
| `icon-water-temp` | Brewing guide | `Icon.M` |
| `icon-steep-time` | Brewing guide | `Icon.M` |
| `icon-map-pin` | Map marker | `Icon.S` (16px) |
| `icon-arrow-right` | Navigation, links | `Icon.M` |
| `icon-arrow-left` | Back navigation | `Icon.M` |
| `icon-close` | Panel dismiss, clear filter | `Icon.M` |
| `icon-filter` | Filter bar toggle | `Icon.M` |
| `icon-scroll-down` | Hero scroll indicator | `Icon.L` (24px) |
| `icon-search` | (Future) Search | `Icon.M` |
| `icon-check` | Active filter, selected state | `Icon.S` |

---

## 15. Motion References

> This section references animation IDs defined in `05-animation-system.md`. No animation implementation details belong here.

| Interaction | Animation Reference | Notes |
|---|---|---|
| Card hover (scale + shadow) | ANIM-020 | All card variants |
| Card click (press) | ANIM-021 | All card variants |
| Filter chip toggle | ANIM-022 | Chip selected ↔ unselected |
| Panel enter (slide + fade) | ANIM-010 | Floating panel, side panel |
| Panel exit | ANIM-011 | Floating panel, side panel |
| Page enter | ANIM-010 | Route-based page transition |
| Page exit | ANIM-011 | Route-based page transition |
| Province zoom in | ANIM-014 | Map camera |
| Province zoom out | ANIM-015 | Map camera |
| Loading skeleton pulse | ANIM-023 | Cards, panels during load |
| Scroll indicator bounce | ANIM-024 | Hero scroll-down indicator |
| Fog opacity change | ANIM-012 | Scroll-driven |
| Parallax shift | ANIM-013 | Scroll-driven |
| Hero title reveal | ANIM-003 | Hero entrance |
| Tea leaf fall | ANIM-002 | Hero entrance |

---

## 16. Responsive Design Tokens

> Desktop-first. Mobile tokens defined for Phase 2 reference.

### 16.1 Breakpoint Tokens

| Token | Value | Phase |
|---|---|---|
| `Breakpoint.XL` | ≥ 1440px | P0 |
| `Breakpoint.L` | 1280px – 1439px | P0 |
| `Breakpoint.M` | 1024px – 1279px | P0 |
| `Breakpoint.S` | 768px – 1023px | P1 |
| `Breakpoint.XS` | < 768px | P2 |

---

## 17. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-UI-01 | Custom fonts (Noto Serif SC) cause FOUT/CLS on slow connections | Medium | Medium | Font subsetting for Latin + common CJK; system font fallback; `font-display: swap` |
| RISK-UI-02 | Rice paper texture overlay impacts scroll performance | Medium | Low | Use CSS `background-image` with `will-change` sparingly; test on low-end devices |
| RISK-UI-03 | 11-state matrix is overkill for simple components | Low | Medium | Only apply relevant states per component (see matrix in Section 12.2) |
| RISK-UI-04 | Token system adds indirection that slows development | Medium | Medium | Provide a token cheatsheet; enforce via lint rule, not memory |
| RISK-UI-05 | Low-saturation palette may fail contrast requirements | High | Low | All color pairs pre-validated against WCAG AA in Section 8 |
| RISK-UI-06 | 3 font families exceed performance budget | Medium | Low | Subset fonts; lazy-load calligraphy font (only used on hero + province titles) |

---

## 18. Constraints

| ID | Constraint |
|---|---|
| UI-C01 | No hardcoded color values in components — all colors reference tokens |
| UI-C02 | No hardcoded spacing values — all spacing references `Spacing.*` tokens |
| UI-C03 | No hardcoded z-index values — all layers reference layer system |
| UI-C04 | No more than 3 font families loaded on any page |
| UI-C05 | No component may define its own animation — all animation references point to `05-animation-system.md` |
| UI-C06 | No pure white (`#FFFFFF`) or pure black (`#000000`) anywhere in the UI |
| UI-C07 | No neon, no high-saturation colors, no glass-morphism effects |
| UI-C08 | All interactive components must handle Default, Hover, Focus, Disabled states |
| UI-C09 | All design tokens exported as CSS custom properties on `:root` |
| UI-C10 | Component variants are predefined — no ad-hoc variant creation without updating this document |

---

## 19. Acceptance Criteria

- [ ] Four-level token hierarchy (Primitive → Semantic → Component → Instance) is complete
- [ ] All Primitive Tokens are defined (Neutral, Ink, Warm, Tea, Accent)
- [ ] All Semantic Tokens are defined (Color, Typography, Spacing, Radius, Elevation, Opacity)
- [ ] Component Token map links every Semantic Token to at least one Component Token
- [ ] Typography scale covers Display → Body → Label with size/weight/line-height
- [ ] Color rules prohibit pure white, pure black, neon, high-saturation
- [ ] Grid system defines column/gutter/margin for all breakpoints
- [ ] Component library inventoried: 24 components with owner modules
- [ ] All component variants defined (Card ×4, Panel ×3, Badge ×8, Chip ×3, Nav ×3)
- [ ] State matrix covers 11 states with consistent visual treatment
- [ ] State applicability matrix maps every component to its required states
- [ ] Visual layer system defines 16 layers with explicit z-index values
- [ ] Icon inventory covers all required icons with size tokens
- [ ] Motion references table maps every interaction to an ANIM-* ID
- [ ] All UI-C* constraints are verifiable
- [ ] No visual rule overlaps with `05-animation-system.md`

---

## 20. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| UI-Q01 | Should the calligraphy font be loaded eagerly (hero needs it) or lazily (saves bandwidth)? | FOUT on hero vs ~30KB extra initial load | Before Task: Hero |
| UI-Q02 | Should the rice paper texture be a CSS pattern (lightweight) or an image overlay (more authentic)? | 2KB CSS vs 100KB+ image | Before Task: Global Styles |
| UI-Q03 | Should card hover scale use `transform: scale()` (GPU) or `padding` change (layout-friendly)? | Performance vs layout stability | Before Task: TeaCard component |
| UI-Q04 | Should the Fog Layer be a CSS gradient (performant) or canvas-based (more organic)? | 60fps target vs visual quality | Before Task: Visual Effects |
| UI-Q05 | Should the layer system use CSS custom properties (`var(--z-map)`) or a JS constants file? | Runtime vs build-time; both valid | Before Task: Global Styles setup |

---

## 21. References

| Document | Relationship |
|---|---|
| `03-site-architecture.md` | Component ownership and directory structure defined there |
| `05-animation-system.md` | All ANIM-* IDs defined there; referenced in Section 15 |
| `08-component-specification.md` | Detailed props/behavior per component; this doc defines their visual tokens |
| `12-assets-guide.md` | Textures, fonts, images consumed by this design system |
| `14-content-guideline.md` | Typography rules applied to actual content |

---

## 22. Implementation Checklist

- [ ] UI-001: CSS custom properties file created (`styles/tokens.css`) with all Primitive tokens
- [ ] UI-002: Semantic tokens defined as CSS custom properties
- [ ] UI-003: Typography CSS rules written (font-face, scale classes)
- [ ] UI-004: Grid utility classes created
- [ ] UI-005: Layer system CSS custom properties created (`--z-*`)
- [ ] UI-006: Card component variants styled
- [ ] UI-007: Badge component variants styled
- [ ] UI-008: Chip component variants styled
- [ ] UI-009: Panel component variants styled
- [ ] UI-010: State system implemented (hover/focus/active/disabled as base classes)
- [ ] UI-011: Icon SVG sprite or component set created
- [ ] UI-012: Typography scale validated (all sizes render correctly)
- [ ] UI-013: Color contrast audit passed (all pairs ≥ 4.5:1 for body text)
- [ ] UI-014: All component variants documented in Storybook or equivalent

---

## 23. Next Document

> **`05-animation-system.md`** — Animation principles, GSAP architecture, ScrollTrigger configuration, Lenis setup, animation ID catalog, easing presets, timeline definitions, and performance rules.

---

> This document is the visual constitution of Tea Atlas. Every color, every pixel of spacing, every font choice, every shadow — they are all defined here. No component may deviate from this system. Changes to this document cascade to every UI element in the project.
