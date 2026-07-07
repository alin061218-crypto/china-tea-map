# 08 — Component Specification

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **UI Surface → Data → Interaction Contract**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | COMP-008 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-04 |
| **Related Documents** | `04-ui-design-system.md`, `05-animation-system.md`, `07-tea-content-system.md`, `09-frontend-architecture.md` |

---

## 2. Scope Rule

> **This document defines ONLY UI surfaces that exist in the codebase or are explicitly listed for v1. No component is spec'd against fields that are not currently in `demoTeas.js`.**

### 2.1 Active Data Fields (from `demoTeas.js`)

| Field | Type | Used By |
|---|---|---|
| `id` | `string` | All components |
| `name` | `string` | TeaNode, TeaDetailPanel, TeaCatalogPopup |
| `province` | `string` | TeaNode, TeaDetailPanel, TeaCatalogPopup |
| `city` | `string` | TeaDetailPanel, TeaCatalogPopup |
| `latitude` | `number` | MapView (marker position) |
| `longitude` | `number` | MapView (marker position) |
| `category` | `string`（中文） | TeaDetailPanel, TeaCatalogPopup |
| `maturity_months` | `string` | TeaDetailPanel, TeaCatalogPopup |
| `seasons` | `string` | MapView (inSeason calculation) |
| `meaning` | `string` | TeaDetailPanel |

### 2.2 Unused Schema Fields (Future Expansion — Do NOT Implement)

> These fields exist in `07-tea-content-system.md` but have **zero UI surface** in the current codebase. Components MUST NOT reference them.

| Field | Reason Not Used |
|---|---|
| `nameEn` | No English UI |
| `provinceSlug` | No province detail page |
| `categoryEn` | Category stored as Chinese label |
| `region` | No tea region grouping UI |
| `meaningEn` | No English UI |
| `flavorProfile` | No FlavorWheel component |
| `elevation` | No elevation display |
| `originStory` | No origin story section |
| `brewingGuide` | No brewing guide UI |
| `heroImage` | No tea hero image |
| `thumbnailImage` | No card thumbnails (SVG illustration used instead) |
| `relatedTeas` | No related teas section |
| `storyRefs` | No story linking |
| `cultureRefs` | No culture linking |

---

## 3. Component Inventory

### 3.1 Component → File Map

| Component ID | Component Name | File | Status |
|---|---|---|---|
| **COMP-01** | MapView | `components/Map/TeaMap.jsx` | ✅ Exists |
| **COMP-02** | TeaNode | (inline in TeaMap — `FlowerMarker`) | ✅ Exists |
| **COMP-03** | TeaDetailPanel | `components/Map/TeaDetailCard.jsx` | ✅ Exists |
| **COMP-04** | TeaCatalogPopup | `components/Tea/TeaCatalogPopup.jsx` | ✅ Exists |
| **COMP-05** | BottomControlBar | `components/Navigation/BottomControlBar.jsx` | ✅ Exists |
| **COMP-06** | Navbar | `components/Navigation/Navbar.jsx` | ✅ Exists |
| **COMP-07** | TeaBloomLayer | `components/Map/TeaBloomLayer.jsx` | ✅ Exists (visual effect) |
| **COMP-08** | Mountains (Decorative) | (inline in `MapPage.jsx`) | ✅ Exists |
| **COMP-09** | CloudAnimation | `components/Effects/CloudAnimation.jsx` | ✅ Exists |
| **COMP-10** | Snowfall | `components/Effects/Snowfall.jsx` | ✅ Exists |
| **COMP-11** | RegionFocusOverlay | — | ⚠️ New (v1) |
| **COMP-12** | StoryPreviewOverlay | — | ⚠️ New (v1) |

---

## 4. Component Specifications

---

### 4.1 COMP-01: MapView

| Property | Value |
|---|---|
| **File** | `components/Map/TeaMap.jsx` |
| **Status** | ✅ Exists |
| **Type** | Interactive SVG + D3 map |

#### 4.1.1 Props

| Prop | Type | Required | Source | Description |
|---|---|---|---|---|
| `teas` | `Tea[]` | Yes | `demoTeas` | Full tea array for marker rendering |
| `onTeaSelect` | `(tea: Tea) => void` | Yes | Parent (`MapPage`) | Callback when tea is hovered or clicked |
| `bloomOpen` | `boolean` | Yes | Parent state | Whether bloom layer is visible |

#### 4.1.2 Data Fields Used

| Field | How Used |
|---|---|
| `id` | Marker identity; passed to bloom layer for activeId matching |
| `name` | Tooltip display |
| `province` | Tooltip display |
| `city` | Tooltip display |
| `latitude` | Marker Y position via `project()` |
| `longitude` | Marker X position via `project()` |
| `seasons` | `inSeason` calculation via `normalizeSeasonText()` |

#### 4.1.3 Internal Sub-components

| Sub-component | Description | Data Used |
|---|---|---|
| `FlowerMarker` | SVG circle group per tea location | `x`, `y`, `inSeason`, `id` |
| Province paths | GeoJSON-derived SVG `<path>` elements | GeoJSON `features[].geometry` |
| Tooltip bubble | Positioned `<div>` on hover | `name`, `province`, `city` |

#### 4.1.4 States

| State | Trigger | Visual Result |
|---|---|---|
| **Default** | Page load | Markers visible; opacity based on `inSeason` |
| **Hover** | Mouse enter marker | Marker scales up; tooltip appears; bloom layer highlights |
| **Focus** | Click marker | Marker selected; detail panel opens (via `onTeaSelect`) |
| **Zooming** | Scroll wheel / button | D3 zoom transform applied |
| **Loading** | GeoJSON fetch in progress | Markers hidden until GeoJSON loaded |

#### 4.1.5 Behavior

| ID | Behavior | Priority |
|---|---|---|
| MAP-B01 | Markers are positioned by projecting `[longitude, latitude]` to SVG coordinates | P0 |
| MAP-B02 | Marker opacity: 0.9 (in season), 0.34 (out of season), 0.1 (winter + not in season) | P0 |
| MAP-B03 | Marker size: 18px (in season), 14px (out of season) | P0 |
| MAP-B04 | Hover sets `tooltip` state with `{x, y, name, place}` | P0 |
| MAP-B05 | Hover also sets `hoveredBloomId` for bloom layer | P0 |
| MAP-B06 | Click sets `selectedBloomId` and calls `onTeaSelect(marker)` | P0 |
| MAP-B07 | Mouse leave clears tooltip and hoveredBloomId | P0 |
| MAP-B08 | D3 zoom: scale extent [0.82, 5.2]; expose `zoomIn`/`zoomOut`/`reset` via ref | P0 |
| MAP-B09 | GeoJSON loaded once via `fetch('/china.json')` with module-level cache | P0 |
| MAP-B10 | ResizeObserver recalculates projection on container resize | P0 |

#### 4.1.6 Accessibility

| ID | Requirement |
|---|---|
| MAP-A11Y-01 | SVG has `role="img"` or equivalent |
| MAP-A11Y-02 | Markers have `cursor: pointer` and are keyboard-focusable |
| MAP-A11Y-03 | Tooltip content is also available as `aria-label` on marker |
| MAP-A11Y-04 | Map base image has `alt=""` (decorative) |
| MAP-A11Y-05 | Zoom controls have accessible labels |

---

### 4.2 COMP-02: TeaNode (FlowerMarker)

| Property | Value |
|---|---|
| **File** | Inline in `TeaMap.jsx` |
| **Status** | ✅ Exists |
| **Type** | SVG marker (circle group) |

#### 4.2.1 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `marker` | `object` | Yes | Tea data + computed position `{x, y, inSeason, id, name, province, city}` |
| `transform` | `d3.ZoomTransform` | Yes | Current D3 zoom transform (for inverse scaling) |
| `onHover` | `(event: MouseEvent) => void` | Yes | Mouse enter/move handler |
| `onLeave` | `() => void` | Yes | Mouse leave handler |
| `onPick` | `() => void` | Yes | Click handler |

#### 4.2.2 Data Fields Used

| Field | How Used |
|---|---|
| `id` | Identity for highlight matching |
| `inSeason` | Opacity and size calculation |
| `x`, `y` | Computed from `latitude`/`longitude` by parent |

#### 4.2.3 States

| State | Trigger | Visual Result |
|---|---|---|
| **Default** | Render | Three concentric circles; opacity varies by `inSeason` |
| **Hover** | Mouse enter | Cursor pointer; bloom layer highlights matching cluster |
| **Focus** | Click | `onPick` → detail panel opens |
| **Dimmed (off-season)** | `inSeason === false` | Opacity 0.34; size 14px |
| **Dimmed (winter)** | Winter + not in season | Opacity 0.1 |

#### 4.2.4 Behavior

| ID | Behavior | Priority |
|---|---|---|
| NODE-B01 | Inverse-scale marker size: `1 / Math.sqrt(transform.k)` so markers don't shrink on zoom | P0 |
| NODE-B02 | Three sub-circles: hotspot-hit (invisible, large), hotspot-ring (visible outline), hotspot-core (filled center) | P0 |

#### 4.2.5 Accessibility

| ID | Requirement |
|---|---|
| NODE-A11Y-01 | Marker group has `role="button"` |
| NODE-A11Y-02 | Marker has `aria-label="{name}, {province}, {city}"` |
| NODE-A11Y-03 | Marker is keyboard-focusable (`tabindex="0"`) |

---

### 4.3 COMP-03: TeaDetailPanel

| Property | Value |
|---|---|
| **File** | `components/Map/TeaDetailCard.jsx` |
| **Status** | ✅ Exists |
| **Type** | Slide-in side panel |

#### 4.3.1 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `tea` | `Tea \| null` | Yes | Selected tea object; `null` hides the panel |
| `onClose` | `() => void` | Yes | Close button / backdrop click handler |
| `onFavoriteChange` | `(tea: Tea, isFavorite: boolean) => void` | No | Callback when favorite is toggled |

#### 4.3.2 Data Fields Used

| Field | How Used |
|---|---|
| `id` | localStorage key (`tea-favorite-{id}`) |
| `name` | Panel title (Chinese) |
| `province` | Location badge |
| `city` | Location badge |
| `category` | Type label |
| `maturity_months` | Month tag grid (parsed by `getMonths()`) |
| `meaning` | Poetic description paragraph |

#### 4.3.3 Sub-sections

| Section | Content | Data Source |
|---|---|---|
| Header bar | Close button, location badge, favorite toggle | `province`, `city` |
| Tea illustration | Inline SVG (procedural, not from data) | `name` |
| Title + meta | Tea name, city, category | `name`, `city`, `category` |
| Meaning | Poetic description | `meaning` |
| Visit spots | 4 generated spot cards | `city`, `name` (computed) |
| Month tags | 12-month grid with active months highlighted | `maturity_months` |
| Favorite button | Toggle favorite state | `id` (localStorage) |

#### 4.3.4 States

| State | Trigger | Visual Result |
|---|---|---|
| **Hidden** | `tea === null` | Panel not rendered (`return null`) |
| **Entering** | `tea` changes from null to object | Slide in from right (handled by framer-motion) |
| **Visible** | Panel rendered with tea data | All sections populated |
| **Exiting** | Close button clicked | Slide out to right |
| **Favorite (off)** | Default | `♡` icon, outline style |
| **Favorite (on)** | Toggle clicked | `♥` icon, filled red (`#bd6f6d`) |

#### 4.3.5 Behavior

| ID | Behavior | Priority |
|---|---|---|
| DETAIL-B01 | Panel slides in/out via framer-motion `<motion.aside>` | P0 |
| DETAIL-B02 | `getMonths()` parses `maturity_months` string for numeric month values | P0 |
| DETAIL-B03 | Favorite state persisted to `localStorage` keyed by `tea-favorite-{id}` | P0 |
| DETAIL-B04 | `spotsFor()` generates 4 visit recommendations from `city` + `name` — pure function, no data dependency | P0 |
| DETAIL-B05 | Close via: × button, backdrop click (delegated to `MapPage`), or catalog selection | P0 |
| DETAIL-B06 | Panel content scrolls independently if overflow (`max-h-[calc(100vh-184px)]`) | P0 |

#### 4.3.6 Accessibility

| ID | Requirement |
|---|---|
| DETAIL-A11Y-01 | Panel has `role="complementary"` or `role="dialog"` |
| DETAIL-A11Y-02 | Close button has `aria-label="关闭详情"` |
| DETAIL-A11Y-03 | Favorite button announces state change |
| DETAIL-A11Y-04 | Focus trapped within panel when open |
| DETAIL-A11Y-05 | Escape key closes panel |

---

### 4.4 COMP-04: TeaCatalogPopup

| Property | Value |
|---|---|
| **File** | `components/Tea/TeaCatalogPopup.jsx` |
| **Status** | ✅ Exists |
| **Type** | Bottom sheet overlay |

#### 4.4.1 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `teas` | `Tea[]` | Yes | Full tea array |
| `isOpen` | `boolean` | Yes | Controls visibility |
| `onClose` | `() => void` | Yes | Close handler |
| `onTeaSelect` | `(tea: Tea) => void` | Yes | Tea selection → opens detail panel |

#### 4.4.2 Data Fields Used

| Field | How Used |
|---|---|
| `id` | List item key |
| `name` | List item primary text |
| `province` | List item secondary text |
| `city` | List item secondary text |
| `category` | Filter chips; list item badge |
| `maturity_months` | Month tags on each list item |

#### 4.4.3 States

| State | Trigger | Visual Result |
|---|---|---|
| **Hidden** | `isOpen === false` | Not rendered |
| **Open (default)** | `isOpen === true` | Bottom sheet slides up; category "全部" selected |
| **Filtered** | Category chip clicked | Tea list filtered to selected category |
| **Empty** | No teas match selected category | (Should show empty state — currently renders empty list) |

#### 4.4.4 Behavior

| ID | Behavior | Priority |
|---|---|---|
| CAT-B01 | Category filter: defaults to `"全部"`; chip click sets category filter | P0 |
| CAT-B02 | Filter chips derived from unique `category` values in `teas` array, plus `"全部"` | P0 |
| CAT-B03 | Tea list filtered by `category === selectedCategory` (unless "全部") | P0 |
| CAT-B04 | Click tea: calls `onTeaSelect(tea)` then `onClose()` | P0 |
| CAT-B05 | Backdrop click (`onClick` on overlay div) closes popup | P0 |
| CAT-B06 | Click on panel content stops propagation (doesn't close) | P0 |
| CAT-B07 | Month tags shown per tea: up to 3 months from `getMonths(tea.maturity_months)` | P0 |

#### 4.4.5 Accessibility

| ID | Requirement |
|---|---|
| CAT-A11Y-01 | Popup has `role="dialog"` |
| CAT-A11Y-02 | Close button has `aria-label="关闭"` |
| CAT-A11Y-03 | Filter chips are `role="tab"` within a `role="tablist"` |
| CAT-A11Y-04 | Tea list items are `role="option"` |
| CAT-A11Y-05 | Escape key closes popup |

---

### 4.5 COMP-05: BottomControlBar

| Property | Value |
|---|---|
| **File** | `components/Navigation/BottomControlBar.jsx` |
| **Status** | ✅ Exists |
| **Type** | Fixed bottom toolbar |

#### 4.5.1 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `onZoomIn` | `() => void` | Yes | Zoom in handler |
| `onZoomOut` | `() => void` | Yes | Zoom out handler |
| `onReset` | `() => void` | Yes | Reset view handler |
| `onCatalogOpen` | `() => void` | Yes | Open catalog popup handler |
| `bloomOpen` | `boolean` | Yes | Bloom layer toggle state |
| `onBloomToggle` | `() => void` | Yes | Toggle bloom layer handler |

#### 4.5.2 States

| State | Trigger | Visual Result |
|---|---|---|
| **Default** | Render | All buttons visible |
| **Bloom Active** | `bloomOpen === true` | Bloom toggle button shows active state |
| **Bloom Inactive** | `bloomOpen === false` | Bloom toggle button shows inactive state |

#### 4.5.3 Behavior

| ID | Behavior | Priority |
|---|---|---|
| BAR-B01 | Five buttons: Zoom In, Zoom Out, Reset, Bloom Toggle, Catalog | P0 |
| BAR-B02 | Each button calls its corresponding prop callback | P0 |

#### 4.5.4 Accessibility

| ID | Requirement |
|---|---|
| BAR-A11Y-01 | All buttons have `aria-label` |
| BAR-A11Y-02 | Bloom toggle announces state (`aria-pressed`) |

---

### 4.6 COMP-06: Navbar

| Property | Value |
|---|---|
| **File** | `components/Navigation/Navbar.jsx` |
| **Status** | ✅ Exists |
| **Type** | Fixed top navigation bar |

#### 4.6.1 Props

> No props — uses `useAuth()` context and `useLocation()` directly.

#### 4.6.2 Data Fields Used

| Source | Field | How Used |
|---|---|---|
| `AuthContext` | `user`, `isAdmin` | Auth state for login/logout links |
| `useLocation()` | `pathname` | Active link highlighting |

#### 4.6.3 States

| State | Trigger | Visual Result |
|---|---|---|
| **Logged Out** | `user === null` | Shows "登录" / "注册" links |
| **Logged In** | `user` object exists | Shows username, "管理" (if admin), "退出" |
| **Admin** | `isAdmin === true` | Shows "管理" link |
| **Active Link** | `pathname === link.to` | White background + shadow on active link |

#### 4.6.4 Behavior

| ID | Behavior | Priority |
|---|---|---|
| NAV-B01 | Two nav links: "首页" (`/`), "茶文化地图" (`/map`) | P0 |
| NAV-B02 | Active link detection via `location.pathname === link.to` | P0 |
| NAV-B03 | Login/Register links navigate to `/login`, `/register` | P1 |

---

### 4.7 COMP-07: TeaBloomLayer

| Property | Value |
|---|---|
| **File** | `components/Map/TeaBloomLayer.jsx` |
| **Status** | ✅ Exists |
| **Type** | Three.js WebGL canvas overlay (visual effect, not interactive UI) |

#### 4.7.1 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `dims` | `{width: number, height: number}` | Yes | Canvas dimensions |
| `markers` | `Marker[]` | Yes | Tea markers with computed `x`, `y`, `inSeason`, `id` |
| `transform` | `d3.ZoomTransform` | Yes | Current D3 zoom state (syncs canvas position) |
| `activeId` | `string \| null` | Yes | Currently hovered/selected tea ID (drives bloom intensity) |
| `bloomOpen` | `boolean` | Yes | Global bloom toggle (drives field-wide openness) |

#### 4.7.2 Data Fields Used

| Field | How Used |
|---|---|
| `id` | `activeId` matching; seed for random number generator |
| `name` | Seed for random number generator |
| `inSeason` | Determines flower count (3–5 vs 2) and cluster size |
| `x`, `y` | Computed canvas position |

#### 4.7.3 Behavior

| ID | Behavior | Priority |
|---|---|---|
| BLOOM-B01 | Generates 3D tea flower clusters at each marker position via Three.js | P0 |
| BLOOM-B02 | Each cluster: branch line + 3–4 leaves + 2–5 flowers (varies by `inSeason`) | P0 |
| BLOOM-B03 | `openness` interpolates toward target: 1.0 (active), fieldTarget (bloomOpen), 0 (hidden) | P0 |
| BLOOM-B04 | Canvas position/scale synced to D3 zoom transform | P0 |
| BLOOM-B05 | Respects `prefers-reduced-motion` — no animation when true | P0 |
| BLOOM-B06 | All geometries and materials disposed on unmount | P0 |

---

### 4.8 COMP-08, COMP-09, COMP-10: Decorative Effects

| Component | File | Type | Props | Interactive? |
|---|---|---|---|---|
| **Mountains** | Inline in `MapPage.jsx` | Static SVG ink-wash mountains | None | No — `aria-hidden="true"` |
| **CloudAnimation** | `components/Effects/CloudAnimation.jsx` | CSS animated clouds | None | No |
| **Snowfall** | `components/Effects/Snowfall.jsx` | Particle effect | None | No |

> These are ambient visual effects. They have no data binding, no interactive states, no accessibility requirements beyond `aria-hidden`. They are documented here for inventory completeness only.

---

### 4.9 COMP-11: RegionFocusOverlay

| Property | Value |
|---|---|
| **File** | To create |
| **Status** | ⚠️ New (v1) |
| **Type** | Transient overlay on map province hover |

#### 4.9.1 Purpose

When the user hovers a province on the map, a subtle overlay highlights the region and shows the province name + tea count. This is a lightweight hint state — not a full detail panel. It replaces the current behavior where provinces have no hover state at all.

#### 4.9.2 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `provinceName` | `string \| null` | Yes | Province name (Chinese); `null` hides the overlay |
| `teaCount` | `number` | Yes | Number of teas in this province |
| `position` | `{x: number, y: number}` | Yes | Centroid position for overlay placement |

#### 4.9.3 Data Fields Used

| Field | Source | How Used |
|---|---|---|
| Province name | GeoJSON `feature.properties.name` | Overlay title |
| Tea count | Derived: `teas.filter(t => t.province === provinceName).length` | Subtitle text |

#### 4.9.4 States

| State | Trigger | Visual Result |
|---|---|---|
| **Hidden** | `provinceName === null` | Not rendered |
| **Visible** | Mouse enter province path | Fade in at province centroid; shows name + count |
| **Exiting** | Mouse leave province path | Fade out |

#### 4.9.5 Behavior

| ID | Behavior | Priority |
|---|---|---|
| REG-B01 | Overlay appears on province SVG path `mouseenter` | P0 |
| REG-B02 | Overlay disappears on `mouseleave` | P0 |
| REG-B03 | Overlay positioned near province centroid (derived from GeoJSON or computed bounding box center) | P0 |
| REG-B04 | Overlay is purely informational — no click action (click is reserved for tea markers) | P0 |

#### 4.9.6 Accessibility

| ID | Requirement |
|---|---|
| REG-A11Y-01 | Province paths have `aria-label="{name}, {count} teas"` |
| REG-A11Y-02 | Province paths are not keyboard-focusable (interaction is visual hint only) |

---

### 4.10 COMP-12: StoryPreviewOverlay

| Property | Value |
|---|---|
| **File** | To create |
| **Status** | ⚠️ New (v1) |
| **Type** | Lightweight expansion overlay from tea node |

#### 4.10.1 Purpose

When the user clicks a tea marker, before the full detail panel opens, a minimal preview overlay appears near the marker showing the tea name and its one-line meaning. This provides instant feedback at the point of interaction.

#### 4.10.2 Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `tea` | `Tea \| null` | Yes | Selected tea; `null` hides |
| `anchorPosition` | `{x: number, y: number}` | Yes | Marker screen position (anchors overlay) |

#### 4.10.3 Data Fields Used

| Field | How Used |
|---|---|
| `name` | Overlay title |
| `meaning` | Overlay body text |
| `category` | Small type badge |

#### 4.10.4 States

| State | Trigger | Visual Result |
|---|---|---|
| **Hidden** | `tea === null` | Not rendered |
| **Appearing** | `tea` set (click) | Fade + scale up from anchor position; stays 1.5s |
| **Visible** | After appear animation | Small card: name + meaning + type badge |
| **Dismissing** | Detail panel opens or user clicks away | Fade out |

#### 4.10.5 Behavior

| ID | Behavior | Priority |
|---|---|---|
| STORY-B01 | Overlay appears immediately on tea marker click, at marker position | P0 |
| STORY-B02 | Overlay auto-dismisses after 1.5s OR when TeaDetailPanel opens | P0 |
| STORY-B03 | Overlay is a bridge animation — not a persistent UI element | P0 |
| STORY-B04 | Only 3 data fields displayed: `name`, `meaning`, `category` | P0 |

#### 4.10.6 Accessibility

| ID | Requirement |
|---|---|
| STORY-A11Y-01 | Overlay has `role="status"` (transient announcement) |
| STORY-A11Y-02 | Content is announced via `aria-live="polite"` |

---

## 5. Data Binding Map

### 5.1 UI Surface → Data Field Matrix

| Data Field | COMP-01 MapView | COMP-02 TeaNode | COMP-03 DetailPanel | COMP-04 CatalogPopup | COMP-11 RegionFocus | COMP-12 StoryPreview |
|---|---|---|---|---|---|---|
| `id` | ✓ | ✓ | ✓ | ✓ | — | — |
| `name` | ✓ | — | ✓ | ✓ | — | ✓ |
| `province` | ✓ | — | ✓ | ✓ | ✓ (filter) | — |
| `city` | ✓ | — | ✓ | ✓ | — | — |
| `latitude` | ✓ | ✓ (as x) | — | — | — | — |
| `longitude` | ✓ | ✓ (as y) | — | — | — | — |
| `category` | — | — | ✓ | ✓ | — | ✓ |
| `maturity_months` | — | — | ✓ | ✓ | — | — |
| `seasons` | ✓ | ✓ (inSeason) | — | — | — | — |
| `meaning` | — | — | ✓ | — | — | ✓ |

### 5.2 Unused Fields Reminder

| Field | Status |
|---|---|
| `nameEn`, `provinceSlug`, `categoryEn`, `region`, `meaningEn` | ❌ No UI surface |
| `flavorProfile` (5 sub-fields) | ❌ No FlavorWheel component |
| `elevation` (3 sub-fields) | ❌ No elevation display |
| `originStory` (6 sub-fields) | ❌ No origin story section |
| `brewingGuide` (10 sub-fields) | ❌ No brewing guide UI |
| `heroImage`, `thumbnailImage` | ❌ No image loading |
| `relatedTeas`, `storyRefs`, `cultureRefs` | ❌ No cross-linking UI |

---

## 6. Interaction State Contract

### 6.1 State Transitions

```
Map Page Idle
    │
    ├── Hover tea marker
    │   └── COMP-02: marker scales + tooltip
    │   └── COMP-07: bloom cluster highlights
    │
    ├── Click tea marker
    │   └── COMP-12: StoryPreviewOverlay (1.5s)
    │   └── COMP-03: TeaDetailPanel slides in
    │
    ├── Hover province path (NEW)
    │   └── COMP-11: RegionFocusOverlay appears
    │
    ├── Click catalog button
    │   └── COMP-04: TeaCatalogPopup slides up
    │       └── Click category chip → filter
    │       └── Click tea → COMP-03 + close popup
    │
    └── Close detail panel
        └── COMP-03: slides out
        └── State returns to Map Page Idle
```

### 6.2 State Conflict Rules

| ID | Rule | Priority |
|---|---|---|
| STC-R01 | Only one detail panel (COMP-03) open at a time | P0 |
| STC-R02 | Catalog popup (COMP-04) and detail panel (COMP-03) may coexist | P0 |
| STC-R03 | Selecting a tea from catalog closes catalog and opens detail panel | P0 |
| STC-R04 | StoryPreviewOverlay (COMP-12) auto-dismisses when detail panel enters | P0 |
| STC-R05 | RegionFocusOverlay (COMP-11) hides when cursor leaves province | P0 |

---

## 7. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-COMP-01 | COMP-07 (TeaBloomLayer) creates 3D clusters for all 27 teas × 5–8 sub-markers = 135–216 Three.js objects — performance risk | Medium | Medium | Reduce sub-marker count for off-screen markers; cull clusters outside viewport |
| RISK-COMP-02 | COMP-01 GeoJSON fetch (`/china.json`) may fail on some deployments | High | Low | Catch error; render markers without province outlines as fallback |
| RISK-COMP-03 | COMP-03 `getMonths()` parsing brittle — assumes space-separated numeric months | Low | Medium | Validate format; handle empty string gracefully |
| RISK-COMP-04 | COMP-11 and COMP-12 are new components — no existing implementation to verify against | Medium | High | Start with minimal implementation; extend incrementally |
| RISK-COMP-05 | COMP-04 filter state resets when popup closes — user loses filter context | Low | Low | Keep filter state in component (not reset on close); acceptable for v1 |
| RISK-COMP-06 | 15 unused schema fields create pressure to add UI prematurely | Medium | Medium | Explicit "do not implement" markers in this document; enforce in code review |

---

## 8. Constraints

| ID | Constraint |
|---|---|
| COMP-C01 | Components MUST NOT access fields not listed in their "Data Fields Used" table |
| COMP-C02 | No component may import from `07-tea-content-system.md` schema types directly — use only `demoTeas` field subset |
| COMP-C03 | New components (COMP-11, COMP-12) must use ONLY data fields from Section 5.1 matrix |
| COMP-C04 | No animation timing values in components — reference ANIM-IDs only |
| COMP-C05 | No component may exceed 400 lines |
| COMP-C06 | All interactive components must handle: Default, Hover, Focus, Disabled states |
| COMP-C07 | All components must pass existing behavior tests before adding new states |
| COMP-C08 | FlavorProfile, OriginStory, BrewingGuide, and all image fields are OFF-LIMITS until explicitly authorized by a future task |
| COMP-C09 | TeaBloomLayer (COMP-07) Three.js resources must be fully disposed on unmount — no memory leaks |

---

## 9. Acceptance Criteria

- [ ] All 12 components inventoried with file path and status (Exists / New)
- [ ] Props table for every component — only fields from `demoTeas.js`
- [ ] States defined for every interactive component (Default / Hover / Focus / Hidden / Entering / Exiting)
- [ ] Behavior IDs (COMP-B*) defined for every component with priority
- [ ] Accessibility requirements (COMP-A11Y-*) defined for interactive components
- [ ] Data binding matrix shows exactly which fields each component uses
- [ ] 15 unused schema fields explicitly marked as "future expansion — do NOT implement"
- [ ] State transition diagram covers all interaction paths
- [ ] State conflict rules prevent overlapping interactions
- [ ] COMP-11 (RegionFocusOverlay) and COMP-12 (StoryPreviewOverlay) are spec'd as minimal new surfaces
- [ ] All COMP-C* constraints are verifiable
- [ ] No component spec references animation durations, easing, or GSAP

---

## 10. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| COMP-Q01 | Should COMP-11 (RegionFocusOverlay) work on province path hover, or should it only appear on tea marker hover? | Interaction design for map | Before Task: RegionFocusOverlay |
| COMP-Q02 | Should COMP-12 (StoryPreviewOverlay) auto-dismiss timer be configurable or fixed at 1.5s? | UX tuning | Before Task: StoryPreviewOverlay |
| COMP-Q03 | Should COMP-04 (TeaCatalogPopup) preserve filter state when closed and reopened within the same session? | User experience for repeated catalog browsing | Before Task: CatalogPopup Enhancement |
| COMP-Q04 | Should COMP-03 (TeaDetailPanel) show an empty state when `tea` is null but the panel container still exists (for exit animation)? | Animation smoothness | Before Task: DetailPanel Refinement |
| COMP-Q05 | Should COMP-07 (TeaBloomLayer) be extracted to `components/Effects/` since it's a visual effect, not a UI component? | File organization | Before Task: Directory Cleanup |

---

## 11. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Data field definitions | `data/demoTeas.js` (existing seed) | ✅ Source of truth |
| Design tokens (opacity, colors) | `04-ui-design-system.md` | ✅ Defined |
| ANIM-ID references | `05-animation-system.md` | ✅ Defined |
| Full tea schema (unused fields) | `07-tea-content-system.md` | ✅ Defined |
| Directory structure | `03-site-architecture.md` | ✅ Defined |

---

## 12. References

| Document | Relationship |
|---|---|
| `04-ui-design-system.md` | Component tokens, variant system, state matrix |
| `05-animation-system.md` | ANIM-IDs for interaction animations (referenced, not defined here) |
| `07-tea-content-system.md` | Full schema — Section 2.2 of this doc explicitly gates unused fields |
| `09-frontend-architecture.md` | Component directory placement, import rules |

---

## 13. Implementation Checklist

- [ ] COMP-001: All existing components documented with actual props and data bindings
- [ ] COMP-002: Data binding matrix verified against `demoTeas.js` field usage
- [ ] COMP-003: Unused schema fields gated — no component imports them
- [ ] COMP-004: COMP-11 (RegionFocusOverlay) — province hover state implemented
- [ ] COMP-005: COMP-12 (StoryPreviewOverlay) — click-to-preview bridge implemented
- [ ] COMP-006: All accessibility requirements validated (aria labels, roles, keyboard)
- [ ] COMP-007: State conflict rules enforced (single detail panel, auto-dismiss)
- [ ] COMP-008: COMP-C08 field gating enforced in code review
- [ ] COMP-009: TeaBloomLayer Three.js cleanup verified (no memory leaks)
- [ ] COMP-010: All COMP-C* constraints validated

---

## 14. Next Document

> **`09-frontend-architecture.md`** — Folder structure, module boundaries, import rules, code splitting strategy, and component registration.

---

> This document is the UI surface contract for Tea Atlas v1. It defines exactly 12 components, their data dependencies (10 fields from `demoTeas.js`), their states, and their behaviors. 15 schema fields from `07-tea-content-system.md` are explicitly gated as future expansion. No component may cross this boundary without updating this document first.
