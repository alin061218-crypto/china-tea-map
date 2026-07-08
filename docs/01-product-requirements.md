# 01 — Product Requirements

> Tea Atlas: Interactive Chinese Tea Culture Map

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | PRD-001 |
| **Version** | 2.0 |
| **Status** | Aligned with Implementation |
| **Last Updated** | 2026-07-08 |
| **Related Documents** | `00-project-overview.md`, `02-information-architecture.md` |

---

## 2. Product Scope

### 2.1 In Scope (Implemented)

| ID | Scope Item | Description |
|---|---|---|
| S-001 | Interactive Tea Map | SVG China map with D3 zoom/pan, province boundaries, mountain terrain layers |
| S-002 | Tea Marker System | 35 tea markers with zoom-aware states, region-matched bloom effects, seasonal opacity |
| S-003 | Tea Detail Panel | Side panel: tea info, brewing guide, origin story, harvest months, checkin spots |
| S-004 | Tea Catalog | Bottom-sheet browser with category filtering (7 tea types) |
| S-005 | Seasonal Atmosphere | SeasonContext driving map-wide color shifts and bloom intensity changes |
| S-006 | Region Atmosphere | Per-province visual profiles: wash color, stroke, bloom, dot fill, tea density |
| S-007 | Visual Effects | CSS cloud wisps, MapEffectLayer bloom/atmosphere overlays, mountain raster layers |
| S-008 | Map Controls | Zoom in/out/reset buttons, catalog launcher |
| S-009 | Backend API | Express + SQLite: teas CRUD, user auth (JWT), favorites, checkins, admin routes |
| S-010 | Data Seeding | Auto-seed 25 tea records on first server start; demo data of 35 teas on frontend |

### 2.2 Out of Scope (Not Implemented)

| ID | Scope Item | Reason |
|---|---|---|
| O-001 | Hero Entrance Animation | Current scope is map-first; hero is deferred |
| O-002 | Scroll-Driven Narrative | Single-page map experience; narrative scenes deferred |
| O-003 | Tea Growth Timeline | Horizontal scroll timeline deferred |
| O-004 | Province Detail Pages | `/province/:slug` route not implemented |
| O-005 | Independent Tea Detail Pages | `/tea/:slug` route not implemented; detail panel is overlay-based |
| O-006 | Independent Encyclopedia Page | `/encyclopedia` route not implemented; catalog is popup-based |
| O-007 | Multi-Page Animated Transitions | App is single-route; transitions deferred |
| O-008 | Mobile Responsive Layout | Desktop-first; responsive is a later phase |
| O-009 | Multi-language (i18n) | Chinese content only for current version |
| O-010 | GSAP Animation System | Current animations use framer-motion + D3; GSAP modules are design reference |
| O-011 | User Comments / Reviews | Not a community platform |
| O-012 | E-commerce / Shop | Not a store |
| O-013 | Search Engine | Category filtering is sufficient; no full-text search |
| O-014 | Social Media Integration | No share buttons, no embeds |
| O-015 | Dark Mode | Museum aesthetic suits light tones |

---

## 3. Functional Requirements (Implemented)

### 3.1 Interactive Tea Map

| ID | Requirement | Status |
|---|---|---|
| FR-M-01 | Display SVG map of China with tea-producing provinces highlighted | ✅ |
| FR-M-02 | D3-powered zoom (0.82x–5.2x) and pan interaction | ✅ |
| FR-M-03 | Four mountain depth layers (PNG rasters) with ink-wash aesthetic | ✅ |
| FR-M-04 | River track mountains overlay layer | ✅ |
| FR-M-05 | Neighboring countries rendered as muted background | ✅ |
| FR-M-06 | Province hover triggers region atmosphere effect via EffectController | ✅ |
| FR-M-07 | Hovered province gets distinct visual state; other provinces dim | ✅ |
| FR-M-08 | Province fills use region-specific watercolor washes | ✅ |
| FR-M-09 | Paper relief filter and ink-wash blur filters (heavy/mid/light) on SVG defs | ✅ |
| FR-M-10 | Map supports resize (ResizeObserver) with responsive projection | ✅ |
| FR-M-11 | Zoom controls: + (zoom in), - (zoom out), 收 (reset) via BottomControlBar | ✅ |
| FR-M-12 | Province enter animation with distance-based delay for organic reveal | ✅ |

### 3.2 Tea Marker System

| ID | Requirement | Status |
|---|---|---|
| FR-TM-01 | 35 tea varieties plotted at geographic coordinates | ✅ |
| FR-TM-02 | Three zoom-aware states: far (dot only), mid (dot + bloom), close (dot + bloom + label) | ✅ |
| FR-TM-03 | Marker opacity tied to region tea density and zoom level | ✅ |
| FR-TM-04 | Bloom fill and dot fill use region atmosphere profile colors | ✅ |
| FR-TM-05 | Bloom animation with organic pulse timing (CSS animation, region-aware duration) | ✅ |
| FR-TM-06 | Tea category icon images (7 types: green/black/oolong/white/yellow/dark/flower) | ✅ |
| FR-TM-07 | Hover on tea marker highlights its parent province | ✅ |
| FR-TM-08 | Click tea marker opens TeaDetailPanel | ✅ |
| FR-TM-09 | In-season markers visually distinct (via SeasonContext integration) | ✅ |
| FR-TM-10 | Marker entrance animation with wave-like delay based on distance from map center | ✅ |

### 3.3 Tea Detail Panel

| ID | Requirement | Status |
|---|---|---|
| FR-TD-01 | Animated slide-in from right (framer-motion) | ✅ |
| FR-TD-02 | Backdrop blur overlay; click background to close | ✅ |
| FR-TD-03 | Tea image with category icon fallback on load error | ✅ |
| FR-TD-04 | Tea name (Chinese), category badge, province/city location | ✅ |
| FR-TD-05 | Cultural meaning / description | ✅ |
| FR-TD-06 | Brewing guide: water temperature and steep time | ✅ |
| FR-TD-07 | Origin story / legend section | ✅ |
| FR-TD-08 | Harvest months calendar (12-month grid, active months highlighted) | ✅ |
| FR-TD-09 | Checkin spots list with pin icons | ✅ |
| FR-TD-10 | Close button in header | ✅ |

### 3.4 Tea Catalog Popup

| ID | Requirement | Status |
|---|---|---|
| FR-TC-01 | Animated slide-up bottom sheet (framer-motion) | ✅ |
| FR-TC-02 | Category filter pills: 全部, 绿茶, 红茶, 乌龙茶, 白茶, 黄茶, 黑茶, 花茶 | ✅ |
| FR-TC-03 | Filter categories dynamically based on available teas | ✅ |
| FR-TC-04 | Active filter pill has distinct visual state | ✅ |
| FR-TC-05 | Each tea row: category icon, name, province/city/category, harvest months | ✅ |
| FR-TC-06 | Click tea row opens TeaDetailPanel and closes catalog | ✅ |
| FR-TC-07 | Backdrop overlay; click background to close | ✅ |
| FR-TC-08 | Handle at top of sheet for visual affordance | ✅ |

### 3.5 Seasonal Atmosphere System

| ID | Requirement | Status |
|---|---|---|
| FR-SA-01 | SeasonContext provides current season state globally | ✅ |
| FR-SA-02 | Four seasons: 春 (spring), 夏 (summer), 秋 (autumn), 冬 (winter) | ✅ |
| FR-SA-03 | Season changes dispatch to EffectController (`season:preset`) | ✅ |
| FR-SA-04 | Each region has an atmosphere profile: wash color, stroke, dot, bloom, tea density, motion scale | ✅ |
| FR-SA-05 | Region profiles are resolved by geographic coordinates | ✅ |

### 3.6 Visual Effects

| ID | Requirement | Status |
|---|---|---|
| FR-VE-01 | CSS cloud wisps drifting across map (5 clouds, varying speed/opacity/position) | ✅ |
| FR-VE-02 | MapEffectLayer for ink-wash bloom and atmosphere overlays | ✅ |
| FR-VE-03 | EffectController event bus: region:hover, region:hover:end, season:preset | ✅ |
| FR-VE-04 | Province hover triggers region-specific atmosphere bloom | ✅ |
| FR-VE-05 | Bloom toggle via BottomControlBar (瓣月花开) | ✅ |

### 3.7 Backend API

| ID | Requirement | Status |
|---|---|---|
| FR-API-01 | Express server on configurable port (default 3001) | ✅ |
| FR-API-02 | SQLite database with auto-migration (users, teas, favorites, checkins) | ✅ |
| FR-API-03 | Auto-seed 25 tea records + admin user on empty database | ✅ |
| FR-API-04 | JWT-based authentication (register, login, profile) | ✅ |
| FR-API-05 | Tea CRUD with season/month filtering | ✅ |
| FR-API-06 | User favorites (add, remove, list, check) | ✅ |
| FR-API-07 | User checkins (add, remove, list) | ✅ |
| FR-API-08 | Admin routes (stats, user management, tea management) | ✅ |
| FR-API-09 | CORS configured for dev and production origins | ✅ |
| FR-API-10 | Serves built frontend static files in production | ✅ |
| FR-API-11 | Health check endpoint (`/api/health`) | ✅ |

### 3.8 Map Controls

| ID | Requirement | Status |
|---|---|---|
| FR-CTL-01 | Zoom in button (+) with smooth D3 transition | ✅ |
| FR-CTL-02 | Zoom out button (-) with smooth D3 transition | ✅ |
| FR-CTL-03 | Reset view button (收) returns to identity transform | ✅ |
| FR-CTL-04 | Catalog launcher button (茶信录) opens TeaCatalogPopup | ✅ |
| FR-CTL-05 | Controls float above map, bottom-centered, non-intrusive styling | ✅ |

---

## 4. Non-functional Requirements

| ID | Category | Requirement | Target |
|---|---|---|---|
| NFR-01 | Performance | Animation frame rate | Stable 60fps |
| NFR-02 | Performance | Scroll/zoom response latency | < 16ms per frame |
| NFR-03 | Browser | Supported browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-04 | Browser | Minimum viewport width | 1280px (desktop-first) |
| NFR-05 | Accessibility | Reduced motion | Respects `prefers-reduced-motion` |
| NFR-06 | Accessibility | Keyboard navigation | Interactive elements are focusable |
| NFR-07 | Content | All tea data in structured format | JSON/JS static data (frontend); SQLite (backend) |
| NFR-08 | Deployment | Static site capable | Vite build output served by Express |

---

## 5. Page / Route List

| ID | Route | Component | Description |
|---|---|---|---|
| P-01 | `/` | MapPage | Interactive tea map (primary and only page) |
| P-02 | `/map` | MapPage | Alias for map view |
| P-03 | `*` | Redirect to `/map` | Catch-all |

---

## 6. Component Inventory

| Component | File | Type |
|---|---|---|
| TeaMap | `components/Map/TeaMap.jsx` | Interactive SVG map (D3 + React) |
| TeaDetailPanel | `components/Tea/TeaDetailPanel.jsx` | Side panel overlay (framer-motion) |
| TeaCatalogPopup | `components/Tea/TeaCatalogPopup.jsx` | Bottom sheet overlay (framer-motion) |
| BottomControlBar | `components/Navigation/BottomControlBar.jsx` | Map controls |
| CloudAnimation | `components/Effects/CloudAnimation.jsx` | CSS effects overlay |
| MapEffectLayer | `components/Effects/MapEffectLayer.jsx` | Ink-wash effects overlay |

---

## 7. Data: Tea Schema (Active Fields)

| Field | Type | Example |
|---|---|---|
| `id` | `string` | `"longjing"` |
| `name` | `string` | `"西湖龙井"` |
| `province` | `string` | `"浙江"` |
| `city` | `string` | `"杭州"` |
| `latitude` | `number` | `30.10` |
| `longitude` | `number` | `120.30` |
| `category` | `string` | `"绿茶"` |
| `categoryEn` | `string` | `"green"` |
| `maturity_months` | `string` | `"3月 4月"` |
| `seasons` | `string` | `"spring"` |
| `meaning` | `string` | `"清雅鲜爽..."` |
| `brewingTemp` | `string` | `"80-85°C"` |
| `brewingTime` | `string` | `"2-3分钟"` |
| `story` | `string` | `"乾隆南巡..."` |
| `checkinSpots` | `string[]` | `["龙井村", "九溪烟树", ...]` |

---

## 8. Interaction Rules

| ID | Rule | Applies To |
|---|---|---|
| IR-01 | Map zoom/pan via D3 zoom behavior (scroll + drag) | TeaMap |
| IR-02 | Province hover triggers atmosphere effect (120ms debounce) | TeaMap |
| IR-03 | Province leave clears atmosphere effect (80ms debounce) | TeaMap |
| IR-04 | Tea marker click opens detail panel | TeaMap |
| IR-05 | Detail panel closes via X button or backdrop click | TeaDetailPanel |
| IR-06 | Catalog opens via bottom bar button, closes via backdrop or tea selection | TeaCatalogPopup |
| IR-07 | Hover states have visual feedback within 150ms | All interactive elements |
| IR-08 | Animations respect `prefers-reduced-motion` | All animated components |
| IR-09 | No autoplay audio or video | Entire site |

---

## 9. Future Expansion (Deferred)

> NOT for current version. Listed here to ensure architecture does not preclude these.

| ID | Feature | Why Deferred |
|---|---|---|
| FX-01 | Hero entrance animation | Requires dedicated animation phase |
| FX-02 | Scroll-driven narrative scenes | Significant content + animation scope |
| FX-03 | Tea growth timeline | Separate interaction design needed |
| FX-04 | Province detail pages (`/province/:slug`) | Requires routing + page design |
| FX-05 | Independent tea detail pages (`/tea/:slug`) | Requires routing restructure |
| FX-06 | Multi-language (Chinese, Japanese) | Content volume; Chinese first |
| FX-07 | Mobile responsive layout | Desktop-first strategy |
| FX-08 | Audio ambiance (music, nature sounds) | Licensing + performance |
| FX-09 | 3D tea set viewer (Three.js) | Significant scope increase |
| FX-10 | User bookmarks / favorites in UI | Backend exists; UI integration deferred |
| FX-11 | GSAP animation integration | Current framer-motion + D3 sufficient |

---

## 10. Acceptance Criteria

- [x] SVG China map renders with province boundaries and ink-wash styling
- [x] D3 zoom/pan functional with smooth transitions
- [x] 35 tea markers visible with zoom-aware states
- [x] Tea detail panel shows all required information sections
- [x] Tea catalog popup with working category filters
- [x] Seasonal atmosphere system functional
- [x] Region hover effects working
- [x] Mountain layer PNGs rendering correctly
- [x] Map controls (zoom in/out/reset, catalog) functional
- [x] Backend API server starts, seeds data, serves endpoints
- [x] Build succeeds with `npm run build`

---

## 11. Dependencies

| Dependency | Description | Status |
|---|---|---|
| `00-project-overview.md` | Project identity and design philosophy | ✅ Complete |
| Tea data content | 35 teas in `demoTeas.js` + 25 in `seed.js` | ✅ Complete |
| SVG China map asset | `china.json` GeoJSON with province boundaries | ✅ Complete |
| Mountain layer assets | 4 depth layers + river tracks PNG | ✅ Complete |
| Tea category icons | 7 icons (64×64px, ink-wash style) | ✅ Complete |

---

## 12. Next Document

> **`02-information-architecture.md`** — Content hierarchy, data flow, and navigation model.

---

> This document is aligned with the **implemented** Tea Atlas product. All requirements marked ✅ exist in the codebase and are functional.
