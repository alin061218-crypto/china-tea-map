# 00 — Project Overview

> Tea Atlas: Interactive Chinese Tea Culture Map

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Tea Atlas |
| **Subtitle** | Interactive Chinese Tea Culture Map |
| **Type** | Interactive Web Application (Single-Page) |
| **Genre** | Cultural Experience / Data Visualization |
| **Target Audience** | Global users interested in Chinese tea culture; tourists, educators, designers, tea enthusiasts |
| **Language** | Chinese (content); English (UI framework) |

---

## 2. Elevator Pitch

Tea Atlas is a browser-based interactive map that lets users explore China's tea culture through an ink-wash aesthetic SVG map. Pan and zoom across tea-producing provinces, hover regions to see atmospheric effects shift, click blooming tea markers to open detail panels with brewing guides and cultural stories, and browse the full tea catalog by category — all within a single immersive full-screen interface.

---

## 3. Core Experience (Implemented)

1. **Interactive Tea Map** — An SVG map of China rendered in ink-wash style, with D3-powered zoom and pan. Province boundaries use watercolor fills keyed to regional atmosphere profiles. Four mountain depth layers (PNG rasters) plus river tracks provide terrain context.

2. **Tea Marker System** — 35 tea varieties plotted as blooming floral markers across China. Each marker has zoom-level-aware states (far → mid → close) that control opacity, bloom size, and label visibility. Markers pulse with region-matched colors and seasonal bloom intensity.

3. **Tea Detail Panel** — Click any tea marker to open a side panel showing: tea name and category, origin province and city, brewing temperature and steep time, cultural meaning and origin story, harvest months calendar, and recommended visit spots.

4. **Tea Catalog Popup** — A bottom-sheet overlay with category-based filtering (Green, Black, Oolong, White, Yellow, Dark, Flower teas). Browse all 35 teas, filter by type, and tap to view details.

5. **Seasonal Atmosphere System** — A SeasonContext drives global map atmosphere changes. Each season shifts color palettes, bloom intensity, and region wash tones. Regions have individual atmosphere profiles (e.g., Yunnan is warmer and more saturated, Zhejiang is cooler and mistier).

6. **Visual Effects Layer** — CSS cloud wisps drift across the map. A MapEffectLayer provides ink-wash bloom and atmosphere overlays. An EffectController dispatches region-hover and season-change events.

7. **Backend API Server** — Express + SQLite server with RESTful endpoints for teas, users, authentication (JWT), favorites, and checkins. Auto-seeds 25 tea records on first start. Serves the built frontend in production.

---

## 4. Design Philosophy

| Principle | Description |
|---|---|
| **Atmosphere First** | Visual mood and emotional resonance take precedence over information density. Users should *feel* the regions before they *read* about them. |
| **Map as Canvas** | The map is not a navigation tool — it's a painting. Ink-wash textures, mountain layers, and bloom effects create an artistic surface. |
| **Ink-Wash Aesthetic** | All visuals derive from Chinese ink painting (水墨画): low saturation, rice-paper textures, fog gradients, restrained palettes. |
| **Progressive Discovery** | Information unfolds through hover and click. Tea data is layered: marker → tooltip → detail panel. Nothing is dumped in tables. |
| **Restraint** | White space and negative space are deliberate design elements. Every pixel must earn its place. |

---

## 5. Visual Identity Keywords

水墨 (Ink Wash) · 宣纸 (Rice Paper) · 留白 (Negative Space) · 茶山 (Tea Mountains) · 云雾 (Mist & Cloud) · 自然 (Nature) · 诗意 (Poetic) · 东方 (Oriental) · 慢 (Slow) · 柔和 (Soft)

---

## 6. Technical Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite 6 |
| **Language** | JavaScript (JSX); TypeScript in `modules/` (design layer) |
| **Map** | D3.js (zoom/pan, SVG projection, GeoJSON rendering) |
| **Animation** | framer-motion (UI transitions); D3 transitions (map zoom) |
| **Styling** | Tailwind CSS 3 + custom CSS custom properties |
| **3D / Canvas** | Three.js (TeaBloomLayer particle effects) |
| **Routing** | React Router v6 (currently single-route; extensible) |
| **State** | React Context (SeasonContext, AuthContext) + local state |
| **Backend** | Express.js + SQLite (via sql.js / better-sqlite3) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Image Generation** | Python scripts for mountain layer raster assets |

---

## 7. Current Scope (What Exists)

### Frontend (`client/`)

| Component | File | Description |
|---|---|---|
| TeaMap | `components/Map/TeaMap.jsx` | Full SVG map with D3 zoom, province rendering, mountain layers, tea markers |
| TeaDetailPanel | `components/Tea/TeaDetailPanel.jsx` | Side panel: tea info, brewing guide, story, harvest months, checkin spots |
| TeaCatalogPopup | `components/Tea/TeaCatalogPopup.jsx` | Bottom-sheet tea browser with category filtering |
| BottomControlBar | `components/Navigation/BottomControlBar.jsx` | Zoom controls + catalog launcher |
| CloudAnimation | `components/Effects/CloudAnimation.jsx` | CSS cloud wisps overlay |
| MapEffectLayer | `components/Effects/MapEffectLayer.jsx` | Ink-wash bloom and atmosphere effects |

| Context / Service | File | Description |
|---|---|---|
| SeasonContext | `contexts/SeasonContext.jsx` | Global season state, season cycling, seasonal preset dispatch |
| AuthContext | `contexts/AuthContext.jsx` | User auth state, login/register/logout |
| EffectController | `effects/EffectController.js` | Event-driven effects dispatcher |
| regionAtmosphereProfiles | `effects/regionAtmosphereProfiles.js` | Per-region color/wash/bloom profiles |
| demoTeas | `data/demoTeas.js` | 35 tea records with full metadata |
| api.js | `services/api.js` | Axios-based API client (auth, teas, favorites, checkins, admin) |

### Backend (`server/`)

| Component | File | Description |
|---|---|---|
| Express Server | `index.js` | API server on port 3001, serves static frontend in production |
| Database | `db/database.js` | SQLite via sql.js (with better-sqlite3 fallback), auto-migration |
| Seed Data | `db/seed.js` | 25 teas + admin user |
| Auth Routes | `routes/auth.js` | Register, login, profile (JWT) |
| Tea Routes | `routes/teas.js` | CRUD + filtering by season/month |
| Favorites | `routes/favorites.js` | User tea favorites |
| Checkins | `routes/checkins.js` | User location checkins |
| Admin | `routes/admin.js` | Admin dashboard stats, user/tea management |

### Design Layer (`modules/`)

33 TypeScript modules covering animation engine, map node system, content graph, UI layer system, and app runtime controller. These represent the architectural design and serve as implementation reference. They are not directly imported by `client/` runtime code.

### Assets

- 4 mountain depth layer PNGs + river track mountains PNG (AI-generated, ink-wash style)
- 7 tea category icons (64×64px PNG, ink-wash gongbi style)
- China GeoJSON (`china.json`) and neighbors GeoJSON (`neighbors.json`)

---

## 8. Out of Scope (Not Implemented)

The following were part of earlier design documents but are **not implemented** and **not part of the current product scope**:

- Hero entrance animation with ink-wash landscape reveal
- Scroll-driven narrative scenes (Ancient Tea Forests → Tea Ceremony)
- Tea growth timeline (horizontal scroll scrub)
- Province detail pages (`/province/:slug`)
- Independent tea encyclopedia page (`/encyclopedia`)
- Tea detail pages as independent routes (`/tea/:slug`)
- Multi-page animated transitions
- GSAP-based animation system
- Mobile responsive layout

These may be revisited as future extensions but are not required for the current project scope.

---

## 9. Document Map

| Document | Purpose |
|---|---|
| `00-project-overview.md` | Project identity, current scope, technical stack (this file) |
| `01-product-requirements.md` | Requirements aligned with implemented features |
| `02-information-architecture.md` | Content hierarchy, data flow |
| `03-site-architecture.md` | URL structure, routing, API architecture |
| `04-ui-design-system.md` | Colors, typography, spacing, textures |
| `05-animation-system.md` | Animation principles, easing, timing |
| `06-map-system.md` | SVG map architecture, zoom states, province rendering |
| `07-tea-content-system.md` | Tea data schema, content types, filtering |
| `08-component-specification.md` | Component props, states, behavior |
| `09-frontend-architecture.md` | Folder structure, module boundaries |
| `10-development-roadmap.md` | Task list aligned with current scope |
| `11-codex-master-guide.md` | AI coding agent rules |
| `12-assets-guide.md` | Asset specifications, AI image prompts |
| `13-content-guide.md` | Writing standards, cultural guidelines |
| `14-deployment-guide.md` | Build, deploy, CI/CD |
| `15-project-rules.md` | Governance, AI collaboration rules |
| `16-qa-testing-guide.md` | Testing standards, quality gates |
| `17-contributing-guide.md` | Onboarding, workflow standards |
| `18-maintenance-guide.md` | Ongoing maintenance, monitoring |

---

## 10. Notes

- This is a living document system. As the project evolves, documents should be updated to reflect reality.
- The documents are designed to be consumed by AI coding agents (Claude Code, Cursor, Codex). Write for that audience.
- Consistency across documents is critical. A change to the map system must be reflected in the component spec and the roadmap.
- All documents assume the reader has context from this overview. Cross-reference abundantly.

---

> **Next:** `01-product-requirements.md` — Requirements aligned with the current Tea Atlas interactive map product.
