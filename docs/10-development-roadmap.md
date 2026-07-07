# 10 — Development Roadmap

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Cleanup + Integration Roadmap — NOT a Feature Roadmap**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | ROADMAP-010 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-06 |
| **Related Documents** | `08-component-specification.md`, `09-frontend-architecture.md`, `07-tea-content-system.md` |

---

## 2. Roadmap Principle

> **Every task corresponds to a real problem found in the existing codebase (`Desktop/tea/client/`). No speculative work. No new features. No architectural redesign.**

### 2.1 Current Phase Decision: Frontend-Only

For the current development phase, Tea Atlas is treated as a **frontend-first visual experience project**.

The active product surface is the Vite/React frontend in `client/`. Work should prioritize:

- map rendering and ink-wash visual quality
- intro, atmosphere, bloom, and region effects
- tea discovery UI and static/demo content presentation
- interaction rhythm, motion consistency, and visual polish

The backend in `server/` is **not a current product-development priority**. It may remain in the repository as a local service, API scaffold, or static-file host, but roadmap work should not focus on backend database tables, CRUD administration, authentication, or server-side content management unless a later task explicitly reopens backend scope.

During this phase, tea content should be understood as frontend presentation data, not as a traditional database-table product. If `localhost:3001` serves the same built frontend as the Vite page, that is expected and does not mean the backend is a separate user-facing system. For design and development review, use the Vite frontend URL shown by `npm run dev` (usually `localhost:5173`, or the next available port such as `localhost:5174`).

### 2.2 Task Priority Distribution

| Priority | Count | Description |
|---|---|---|
| P0 | 7 | Critical fixes: dead code removal, duplicate logic, broken wiring |
| P1 | 8 | Structural cleanup: empty directories, import hygiene, type scaffolding |
| P2 | 7 | Minor refactors: naming, documentation, final verification |

### 2.3 Task Dependency Graph

```
Task001 (echarts) ─────────────────────────────────────────────────────────────┐
Task002 (getMonths) ──────────────────────────────────────────────────────┐    │
Task003 (spotsFor) ─── Task007 (utils barrel) ────────────────────────────┤    │
Task004 (GSAP) ───────────────────────────────────────────────────────────┤    │
Task005 (Navbar) ─────────────────────────────────────────────────────────┤    │
Task006 (dead buttons) ───────────────────────────────────────────────────┤    │
                                                                            │    │
Task008 (hooks barrel) ────────────────────────────────────────────────────┤    │
Task009 (types scaffold) ──────────────────────────────────────────────────┤    │
Task010 (CSS variables audit) ─────────────────────────────────────────────┤    │
Task011 (SeasonContext align) ─────────────────────────────────────────────┤    │
Task012 (API cleanup) ─────────────────────────────────────────────────────┤    │
Task013 (styles structure) ────────────────────────────────────────────────┤    │
Task014 (Three.js leak check) ─────────────────────────────────────────────┤    │
                                                                            │    │
Task015 (import conventions) ─── depends on Task007, Task008 ──────────────┤    │
Task016 (display names) ───────────────────────────────────────────────────┤    │
Task017 (empty dir docs) ──────────────────────────────────────────────────┤    │
Task018 (package.json) ─── depends on Task001 ─────────────────────────────┤    │
Task019 (gitignore) ───────────────────────────────────────────────────────┤    │
Task020 (integration test) ─── depends on ALL ─────────────────────────────┘
```

---

## 3. Task Specifications

---

### Task001: Remove Unused `echarts` Dependency

| Field | Value |
|---|---|
| **Task ID** | TASK-001 |
| **Priority** | P0 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | None |

#### Goal

Remove the unused `echarts` package from the project. It is listed in `package.json` dependencies but never imported by any component. This reduces bundle size by approximately 1MB.

#### Current State

```json
// package.json dependencies
"echarts": "^5.5.1"   ← never imported in any src/ file
```

Verified by `grep -r "echarts" client/src/` — zero matches in component code.

#### Target State

- `echarts` removed from `package.json` `dependencies`
- `package-lock.json` regenerated
- `npm run build` succeeds without errors
- Bundle size reduced

#### Files to Modify

| File | Action |
|---|---|
| `client/package.json` | Remove `"echarts": "^5.5.1"` from dependencies |

#### Constraints

| ID | Constraint |
|---|---|
| T001-C01 | Do NOT remove any other dependency |
| T001-C02 | Run `npm install` after removal to update lockfile |
| T001-C03 | Verify build before considering task complete |
| T001-C04 | Do NOT run `npm audit fix` unless separately authorized |

#### Acceptance Criteria

- [ ] `echarts` is no longer in `package.json` `dependencies`
- [ ] `npm run build` completes with exit code 0
- [ ] `npm run dev` starts without errors
- [ ] Map still renders tea markers correctly
- [ ] No new console errors

#### Risk Notes

- **Risk**: Low. `echarts` has zero imports — removal is purely subtractive.
- **Rollback**: Re-add the line to `package.json`, run `npm install`.

---

### Task002: Extract Duplicate `getMonths()` to `utils/`

| Field | Value |
|---|---|
| **Task ID** | TASK-002 |
| **Priority** | P0 |
| **Estimated Effort** | 20 minutes |
| **Dependency** | None |

#### Goal

Eliminate the duplicate `getMonths()` function. It is currently defined identically in two files:

- `components/Map/TeaDetailCard.jsx` (line 4)
- `components/Tea/TeaCatalogPopup.jsx` (line 6)

Extract it to `utils/season.js` and import from a single source.

#### Current State

```js
// TeaDetailCard.jsx, line 4
function getMonths(value = '') {
  return String(value).match(/\d+/g)?.map(Number) || [];
}

// TeaCatalogPopup.jsx, line 6
function getMonths(value = '') {
  return String(value).match(/\d+/g)?.map(Number) || [];
}
```

Identical logic. Two locations. Will diverge over time.

#### Target State

- `utils/season.js` exports `getMonths()`
- `TeaDetailCard.jsx` imports from `utils/season.js`
- `TeaCatalogPopup.jsx` imports from `utils/season.js`
- Local definitions removed from both files
- Behavior unchanged

#### Files to Modify

| File | Action |
|---|---|
| `client/src/utils/season.js` | **Create** — export `getMonths()` |
| `client/src/components/Map/TeaDetailCard.jsx` | Remove local `getMonths`, add import |
| `client/src/components/Tea/TeaCatalogPopup.jsx` | Remove local `getMonths`, add import |

#### Constraints

| ID | Constraint |
|---|---|
| T002-C01 | Do NOT change the function signature or behavior |
| T002-C02 | Do NOT modify the parsing logic — preserve exact regex |
| T002-C03 | Do NOT extract `normalizeSeasonText()` — it belongs in SeasonContext |
| T002-C04 | Do NOT create a barrel export file yet (that's Task007) |

#### Acceptance Criteria

- [ ] `utils/season.js` exists with exact `getMonths()` function
- [ ] `TeaDetailCard.jsx` no longer contains local `getMonths` definition
- [ ] `TeaCatalogPopup.jsx` no longer contains local `getMonths` definition
- [ ] Month tags render identically on tea detail panel
- [ ] Month tags render identically on catalog popup
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: Very low. Pure function extraction. No side effects.
- **Verification**: Compare month tags before/after on 3 different teas with different `maturity_months` values.

---

### Task003: Extract `spotsFor()` to `utils/`

| Field | Value |
|---|---|
| **Task ID** | TASK-003 |
| **Priority** | P0 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Extract the `spotsFor()` function from `TeaDetailCard.jsx` to `utils/spots.js`. This function generates 4 visit recommendation cards from tea `city` and `name`. It is currently inline inside the component file.

#### Current State

```js
// TeaDetailCard.jsx, lines 8-16
function spotsFor(tea) {
  const city = tea.city || tea.province || '本地';
  return [
    { name: `${city}茶山步道`, desc: `沿山势寻找${tea.name}原产地风土。` },
    { name: `${city}古茶村`, desc: '看老茶树、老作坊与日常饮茶礼俗。' },
    { name: `${city}茶文化馆`, desc: '梳理茶史、器具与地方茶俗脉络。' },
    { name: `${tea.name}制茶工坊`, desc: '体验采青、萎凋、揉捻或焙火工序。' },
  ];
}
```

#### Target State

- `utils/spots.js` exports `spotsFor()`
- `TeaDetailCard.jsx` imports from `utils/spots.js`
- Local definition removed
- Behavior unchanged

#### Files to Modify

| File | Action |
|---|---|
| `client/src/utils/spots.js` | **Create** — export `spotsFor()` |
| `client/src/components/Map/TeaDetailCard.jsx` | Remove local `spotsFor`, add import |

#### Constraints

| ID | Constraint |
|---|---|
| T003-C01 | Do NOT change the function signature or the 4 generated spots |
| T003-C02 | Do NOT add new spot types or change existing descriptions |
| T003-C03 | Do NOT extract `TeaIllustration` component — it stays in TeaDetailCard |

#### Acceptance Criteria

- [ ] `utils/spots.js` exists with exact `spotsFor()` function
- [ ] `TeaDetailCard.jsx` imports `spotsFor` from `utils/spots.js`
- [ ] Visit recommendations section renders identically
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: Very low. Pure function extraction.
- **Verification**: Open detail panel for any tea; verify 4 spots render unchanged.

---

### Task004: Remove or Integrate Unused GSAP Animation Files

| Field | Value |
|---|---|
| **Task ID** | TASK-004 |
| **Priority** | P0 |
| **Estimated Effort** | 30 minutes |
| **Dependency** | None |

#### Goal

Resolve the dead code in `animations/`. Four GSAP timeline files exist but are never imported by any component. Current animations use framer-motion (TeaDetailCard, TeaCatalogPopup) and D3 (TeaMap zoom).

Two options — **default to removal unless user chooses integration**:

- **Option A (Recommended)**: Remove the 4 files. Revisit GSAP when animation system is ready.
- **Option B**: Import and wire one or more timelines into components. Requires GSAP dependency check.

#### Current State

```
animations/
├── heroTimeline.ts       ← 0 imports in src/
├── mapTimeline.ts        ← 0 imports in src/
├── provinceZoom.ts       ← 0 imports in src/
└── scrollTimeline.ts     ← 0 imports in src/
```

Verified by `grep -r "heroTimeline\|mapTimeline\|provinceZoom\|scrollTimeline" client/src/` — only matches are the file definitions themselves.

#### Target State (Option A — Removal)

- `animations/` directory is empty or removed
- No GSAP dependency in `package.json` (check: is gsap listed?)
- All current animations (framer-motion, D3 zoom) continue to work

#### Target State (Option B — Integration)

- At least one GSAP timeline is imported and actively used
- GSAP is in `package.json` dependencies (add if missing)
- Old framer-motion calls for the same animation are removed

#### Files to Modify (Option A)

| File | Action |
|---|---|
| `client/src/animations/heroTimeline.ts` | **Delete** |
| `client/src/animations/mapTimeline.ts` | **Delete** |
| `client/src/animations/provinceZoom.ts` | **Delete** |
| `client/src/animations/scrollTimeline.ts` | **Delete** |
| `client/package.json` | Remove `gsap` if present (check first) |

#### Constraints

| ID | Constraint |
|---|---|
| T004-C01 | If removing: do NOT remove the `animations/` directory itself — it may be used in the future |
| T004-C02 | If removing: verify GSAP is not a dependency in `package.json` — if it is, remove it |
| T004-C03 | Do NOT modify any framer-motion or D3 animation code |
| T004-C04 | Ask user to choose Option A or B before executing |

#### Acceptance Criteria

- [ ] User has chosen Option A or B
- [ ] If Option A: zero `.ts` files remain in `animations/`
- [ ] If Option A: `npm run build` succeeds
- [ ] If Option B: at least one GSAP timeline is wired and functional
- [ ] No import errors in any component

#### Risk Notes

- **Risk (Option A)**: Low. Dead code removal.
- **Risk (Option B)**: Medium. GSAP + React lifecycle management requires careful cleanup. GSAP and framer-motion may conflict.
- **Recommendation**: Option A. Revisit GSAP when `05-animation-system.md` ANIM-ID system is implemented.

---

### Task005: Render Navbar or Remove It

| Field | Value |
|---|---|
| **Task ID** | TASK-005 |
| **Priority** | P1 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Resolve the orphaned `Navbar.jsx` component. It is defined, implements auth-aware navigation, but is **never rendered** — no component imports or renders it.

#### Current State

- `Navbar.jsx` exists: `components/Navigation/Navbar.jsx`
- `import Navbar` appears **nowhere** in `App.jsx` or `MapPage.jsx`
- The app currently has no visible top navigation

#### Target State

**Option A (Recommended — Render it)**: Add `<Navbar />` to `App.jsx` above `<Routes>`. This provides navigation between `/` and `/map`.

**Option B (Remove it)**: Delete `Navbar.jsx`. This is acceptable if top navigation is intentionally absent.

#### Files to Modify

| File | Action |
|---|---|
| `client/src/App.jsx` | Add `import Navbar` + render `<Navbar />` (Option A) |
| **or** | |
| `client/src/components/Navigation/Navbar.jsx` | **Delete** (Option B) |

#### Constraints

| ID | Constraint |
|---|---|
| T005-C01 | If rendering: place `<Navbar />` inside the `<div className="ink-app">` but outside `<Routes>` |
| T005-C02 | If rendering: verify it doesn't overlap with MapPage header |
| T005-C03 | If rendering: verify auth links work (login/register/logout) |
| T005-C04 | Ask user to choose Option A or B before executing |

#### Acceptance Criteria

- [ ] User has chosen Option A or B
- [ ] If Option A: Navbar visible at top of page on all routes
- [ ] If Option A: Auth state reflected correctly (logged in vs logged out)
- [ ] If Option B: `Navbar.jsx` deleted; no import errors
- [ ] `npm run build` succeeds
- [ ] No console errors

#### Risk Notes

- **Risk**: Low either way. Navbar is self-contained.
- **Note**: If rendered, the Navbar shows "花间集" branding — this may conflict with MapPage's inline `Header` component which also shows "花间集". Only one should show the brand. This is a design decision — resolve during implementation.

---

### Task006: Fix BottomControlBar Dead Buttons

| Field | Value |
|---|---|
| **Task ID** | TASK-006 |
| **Priority** | P0 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Fix two dead/interactive buttons in `BottomControlBar.jsx`:

1. **"四季流转" button** — has no `onClick` handler. Clicking it does nothing.
2. **"花信风" button** — duplicates `onCatalogOpen` (same action as "茶信录"). Redundant.

#### Current State

```jsx
// BottomControlBar.jsx, lines 14-18
<button type="button" className="ui-pill">四季流转</button>          ← no onClick
<button type="button" className="ui-pill" onClick={onCatalogOpen}>茶信录</button>
// ... later:
<button type="button" className="ui-pill" onClick={onCatalogOpen}>花信风</button>  ← duplicate
```

#### Target State

Either:

**Option A**: Wire "四季流转" to trigger `SeasonSlider` expansion or season cycle. Remove "花信风".

**Option B**: Remove both "四季流转" and "花信风" buttons. Keep only "瓣月花开" (bloom toggle) and "茶信录" (catalog).

#### Files to Modify

| File | Action |
|---|---|
| `client/src/components/Navigation/BottomControlBar.jsx` | Remove or wire dead buttons |
| `client/src/components/Navigation/BottomControlBar.jsx` | Add `onSeasonToggle` prop if wiring (Option A) |

#### Constraints

| ID | Constraint |
|---|---|
| T006-C01 | Do NOT remove "瓣月花开" (bloom toggle) — it works |
| T006-C02 | Do NOT remove "茶信录" (catalog) — it works |
| T006-C03 | Do NOT remove zoom buttons (+, -, 收) — they work |
| T006-C04 | Do NOT add new props to MapPage unless necessary for the fix |

#### Acceptance Criteria

- [ ] No button in BottomControlBar is clickable without effect
- [ ] No two buttons perform the exact same action
- [ ] All remaining buttons have `onClick` handlers
- [ ] `npm run build` succeeds
- [ ] Map controls still function (zoom, bloom, catalog)

#### Risk Notes

- **Risk**: Very low. Purely subtractive or minimal wiring.
- **Recommendation**: Option B (remove dead buttons). Simplest, least risk.

---

### Task007: Create `utils/` Barrel Export

| Field | Value |
|---|---|
| **Task ID** | TASK-007 |
| **Priority** | P1 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | TASK-002, TASK-003 |

#### Goal

Create `utils/index.js` that re-exports all utility functions. This provides a single import path for components.

#### Current State

After Task002 and Task003, utility functions exist in separate files:

```
utils/
├── season.js    ← getMonths()
└── spots.js     ← spotsFor()
```

Components import from individual files.

#### Target State

```
utils/
├── index.js     ← barrel: re-exports getMonths, spotsFor
├── season.js
└── spots.js
```

Components may import from `utils/` (barrel) or individual files — both are valid.

#### Files to Modify

| File | Action |
|---|---|
| `client/src/utils/index.js` | **Create** — re-export `getMonths` from `./season`, `spotsFor` from `./spots` |

#### Constraints

| ID | Constraint |
|---|---|
| T007-C01 | Do NOT change existing imports in components — barrel is additive only |
| T007-C02 | Do NOT add functions to the barrel that don't exist yet |
| T007-C03 | Use ES module re-export syntax: `export { getMonths } from './season'` |

#### Acceptance Criteria

- [ ] `utils/index.js` exists
- [ ] `import { getMonths } from '../../utils'` works in any component
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: None. Additive change only.

---

### Task008: Create `hooks/` Barrel Export

| Field | Value |
|---|---|
| **Task ID** | TASK-008 |
| **Priority** | P1 |
| **Estimated Effort** | 5 minutes |
| **Dependency** | None |

#### Goal

Create `hooks/index.js` as an empty barrel file. The `hooks/` directory is currently empty but documented as the location for custom hooks. A barrel file signals this intent and provides a ready import path.

#### Current State

```
hooks/   ← empty directory (no files)
```

#### Target State

```
hooks/
└── index.js   ← empty barrel with comment documenting intended usage
```

#### Files to Modify

| File | Action |
|---|---|
| `client/src/hooks/index.js` | **Create** — JSDoc comment + empty export |

#### Constraints

| ID | Constraint |
|---|---|
| T008-C01 | Do NOT create stub hook functions — this is a placeholder only |
| T008-C02 | File must contain at least a JSDoc comment explaining purpose |

#### Acceptance Criteria

- [ ] `hooks/index.js` exists
- [ ] Contains JSDoc comment: `/** Custom React hooks for Tea Atlas */`
- [ ] `npm run build` succeeds (empty export is valid)

#### Risk Notes

- **Risk**: None.

---

### Task009: Scaffold Basic Type Definitions in `types/`

| Field | Value |
|---|---|
| **Task ID** | TASK-009 |
| **Priority** | P1 |
| **Estimated Effort** | 20 minutes |
| **Dependency** | None |

#### Goal

Create a minimal `types/tea.js` with JSDoc type definitions that match the actual `demoTeas.js` data shape. This is **not** TypeScript migration — it's JSDoc annotations for IDE IntelliSense in JSX files.

#### Current State

```
types/   ← empty directory
```

All data shapes are implicit. No autocomplete for tea object fields.

#### Target State

```
types/
└── tea.js   ← JSDoc @typedef for Tea object (10 active fields only)
```

#### Schema (Active Fields Only)

```js
/**
 * @typedef {Object} Tea
 * @property {string} id
 * @property {string} name
 * @property {string} province
 * @property {string} city
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} category
 * @property {string} maturity_months
 * @property {string} seasons
 * @property {string} meaning
 */
```

#### Files to Modify

| File | Action |
|---|---|
| `client/src/types/tea.js` | **Create** — JSDoc typedef for Tea |

#### Constraints

| ID | Constraint |
|---|---|
| T009-C01 | Do NOT define fields that are not in `demoTeas.js` (no `nameEn`, `flavorProfile`, etc.) |
| T009-C02 | Do NOT create `.ts` files — this is JSDoc in `.js` |
| T009-C03 | Do NOT create barrel `types/index.js` yet — wait until more types exist |
| T009-C04 | Do NOT add `@ts-check` to any component — this task is passive documentation |

#### Acceptance Criteria

- [ ] `types/tea.js` exists
- [ ] JSDoc `@typedef` matches `demoTeas.js` field names exactly (snake_case for `maturity_months`)
- [ ] All 10 active fields documented
- [ ] No TypeScript compilation errors (`types/tea.js` is plain JS)
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: None. This is documentation, not active code.

---

### Task010: Audit and Document CSS Custom Properties

| Field | Value |
|---|---|
| **Task ID** | TASK-010 |
| **Priority** | P1 |
| **Estimated Effort** | 25 minutes |
| **Dependency** | None |

#### Goal

Audit all CSS custom properties currently in use, document them in `styles/tokens.css`, and identify inconsistencies. The current properties are scattered across `index.css` and component inline styles.

#### Current State

CSS custom properties used in codebase:

| Property | Defined In | Used By |
|---|---|---|
| `--wash-a`, `--wash-b`, `--wash-c` | `index.css` | Mountains SVG, MapPage |
| `--ink`, `--ink-darkest`, `--ink-soft`, `--ink-medium`, `--ink-faint` | `index.css` | Navbar, TeaDetailCard, TeaCatalogPopup |
| `--bloom-a`, `--bloom-b`, `--bloom-c` | (inline in TeaIllustration) | TeaDetailCard |
| `--accent` | `index.css` | TeaDetailCard |
| `--size` | (inline in Navbar) | Navbar |

#### Target State

`styles/tokens.css` contains all CSS custom properties on `:root`, with JSDoc-style comments explaining each token's purpose. Components reference tokens by name — no new values introduced.

#### Files to Modify

| File | Action |
|---|---|
| `client/src/styles/tokens.css` | **Create** — all CSS custom properties on `:root` |
| `client/src/index.css` | Add `@import './styles/tokens.css'` at top |
| `client/src/components/Map/TeaDetailCard.jsx` | Move `--bloom-*` from inline to tokens.css |

#### Constraints

| ID | Constraint |
|---|---|
| T010-C01 | Do NOT change any color values — this is documentation + centralization only |
| T010-C02 | Do NOT add new tokens beyond what's already in use |
| T010-C03 | Do NOT convert components to use tokens if they currently use inline values — that's a separate task |
| T010-C04 | Do NOT modify Tailwind config |

#### Acceptance Criteria

- [ ] `styles/tokens.css` exists with all 12 current CSS custom properties
- [ ] `index.css` imports `tokens.css`
- [ ] No visual changes to any component
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: Low. Centralization only — no value changes.
- **Verification**: Screenshot comparison before/after.

---

### Task011: Align SeasonContext Exports

| Field | Value |
|---|---|
| **Task ID** | TASK-011 |
| **Priority** | P1 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Review and document `SeasonContext.jsx` exports. Currently exports `SeasonProvider`, `useSeason`, `SEASONS`, `SEASON_ORDER`, and `normalizeSeasonText`. Verify that:

1. All exports are used somewhere
2. No export is missing that should exist
3. `normalizeSeasonText` is in the right location (it's a pure function, not context-dependent)

#### Current State

| Export | Used By |
|---|---|
| `SeasonProvider` | `main.jsx` |
| `useSeason` | `TeaMap.jsx`, `MapPage.jsx`, `SeasonSlider.jsx` |
| `SEASONS` | `MapPage.jsx` |
| `SEASON_ORDER` | No external consumers (used internally by `setSeason`) |
| `normalizeSeasonText` | `TeaMap.jsx` |

#### Target State

- `normalizeSeasonText` moved to `utils/season.js` (it's a pure string parser, not context logic)
- `SeasonContext.jsx` imports it from `utils/season.js`
- `TeaMap.jsx` imports it from `utils/season.js` instead of `SeasonContext`
- JSDoc added to all exports

#### Files to Modify

| File | Action |
|---|---|
| `client/src/utils/season.js` | Add `normalizeSeasonText` (move from SeasonContext) |
| `client/src/contexts/SeasonContext.jsx` | Remove `normalizeSeasonText`, import from utils |
| `client/src/components/Map/TeaMap.jsx` | Update import to `utils/season.js` |

#### Constraints

| ID | Constraint |
|---|---|
| T011-C01 | Do NOT change `normalizeSeasonText` logic — move only |
| T011-C02 | Do NOT change `SEASONS` or `SEASON_ORDER` structure |
| T011-C03 | Verify season detection still works after move |

#### Acceptance Criteria

- [ ] `normalizeSeasonText` is in `utils/season.js`
- [ ] `SeasonContext.jsx` no longer defines `normalizeSeasonText`
- [ ] `TeaMap.jsx` imports `normalizeSeasonText` from `utils/season.js`
- [ ] Season filter works correctly (in-season markers highlighted)
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: Low. Pure function move.
- **Verification**: Change season via SeasonSlider; verify marker opacity updates.

---

### Task012: Clean Up `services/api.js` Unused Endpoints

| Field | Value |
|---|---|
| **Task ID** | TASK-012 |
| **Priority** | P1 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Audit `services/api.js` and mark API endpoints that are not consumed by any UI component. Do not delete them (they correspond to existing server routes). Instead, add JSDoc comments marking their status.

#### Current State

| API Object | Methods | Consumed By |
|---|---|---|
| `authAPI` | `register`, `login`, `me` | `AuthContext.jsx` |
| `teaAPI` | `getAll`, `getById`, `getBySeason`, `getByMonth`, `getStats` | **None** (UI uses `demoTeas.js`) |
| `favAPI` | `getAll`, `add`, `remove`, `check` | **None** (favorites use localStorage) |
| `checkinAPI` | `getAll`, `add`, `remove` | **None** (no checkin UI) |
| `adminAPI` | `getStats`, CRUD teas, CRUD users | **None** (no admin UI in client) |

#### Target State

- All unused API objects marked with `/** @unused — UI uses static data */` JSDoc
- No code deleted (server routes may still be active)
- No new API calls added

#### Files to Modify

| File | Action |
|---|---|
| `client/src/services/api.js` | Add JSDoc status comments to `teaAPI`, `favAPI`, `checkinAPI`, `adminAPI` |

#### Constraints

| ID | Constraint |
|---|---|
| T012-C01 | Do NOT delete any API endpoint definitions |
| T012-C02 | Do NOT modify `authAPI` — it is actively used |
| T012-C03 | Do NOT modify axios instance or interceptors |
| T012-C04 | Comments must be JSDoc format: `/** @unused — ... */` |

#### Acceptance Criteria

- [ ] All 4 unused API objects have `@unused` JSDoc comments
- [ ] `authAPI` is NOT marked unused
- [ ] No code removed
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: None. Comment-only change.

---

### Task013: Create `styles/` Structure

| Field | Value |
|---|---|
| **Task ID** | TASK-013 |
| **Priority** | P1 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | TASK-010 |

#### Goal

Create a minimal `styles/` file for global CSS patterns that don't belong in `index.css` or Tailwind. Currently `styles/` is empty.

#### Current State

```
styles/   ← empty directory
```

All styles live in `index.css` (global) + Tailwind utilities.

#### Target State

```
styles/
├── tokens.css     ← CSS custom properties (from TASK-010)
└── base.css       ← Reset, font-face, scrollbar, selection styles (moved from index.css)
```

`index.css` becomes a thin file that imports `styles/tokens.css` and `styles/base.css`, then adds only the remaining app-specific styles.

#### Files to Modify

| File | Action |
|---|---|
| `client/src/styles/base.css` | **Create** — move reset/base styles from `index.css` |
| `client/src/index.css` | Remove moved styles; add `@import` for `base.css` |

#### Constraints

| ID | Constraint |
|---|---|
| T013-C01 | Do NOT change any CSS property values — move only |
| T013-C02 | Do NOT split into more than 2 files (tokens.css + base.css) |
| T013-C03 | Preserve exact `@import` order: tokens → base → index |

#### Acceptance Criteria

- [ ] `styles/base.css` exists with reset/base styles
- [ ] `index.css` imports both `tokens.css` and `base.css`
- [ ] No visual changes to any component
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: Low. Pure file split — no value changes.

---

### Task014: Verify TeaBloomLayer Three.js Cleanup

| Field | Value |
|---|---|
| **Task ID** | TASK-014 |
| **Priority** | P0 |
| **Estimated Effort** | 20 minutes |
| **Dependency** | None |

#### Goal

Audit `TeaBloomLayer.jsx` for memory leaks. The component creates Three.js resources (renderer, scene, geometries, materials) and must dispose of them on unmount. The cleanup exists in the `useEffect` return function — verify it's comprehensive.

#### Current State

Cleanup in `TeaBloomLayer.jsx` (lines 353-364):
```js
return () => {
  cancelAnimationFrame(frameRef.current);
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose?.());
    else object.material?.dispose?.();
  });
  petalGeometry.dispose();
  leafGeometry.dispose();
  renderer.dispose();
  mount.removeChild(renderer.domElement);
};
```

#### Items to Verify

| Check | Status |
|---|---|
| `renderer.dispose()` called | ✅ Present |
| `renderer.domElement` removed from DOM | ✅ Present |
| All geometries disposed | ✅ Scene traversal + petal/leaf geometries |
| All materials disposed | ✅ Scene traversal handles single + array materials |
| `requestAnimationFrame` cancelled | ✅ `cancelAnimationFrame(frameRef.current)` |
| `renderer.render()` not called after dispose | ⚠️ Not explicitly gated |

#### Target State

- Add a `disposed` flag after cleanup to prevent post-unmount renders
- Add JSDoc comment documenting the cleanup strategy
- No functional changes

#### Files to Modify

| File | Action |
|---|---|
| `client/src/components/Map/TeaBloomLayer.jsx` | Add `disposed` guard + JSDoc for cleanup |

#### Constraints

| ID | Constraint |
|---|---|
| T014-C01 | Do NOT change the animation logic |
| T014-C02 | Do NOT change the Three.js setup |
| T014-C03 | Add only the minimum guard: `let disposed = false` + check before `renderer.render()` |

#### Acceptance Criteria

- [ ] Cleanup function sets `disposed = true`
- [ ] `renderer.render()` is guarded by `if (!disposed)`
- [ ] JSDoc comment explains cleanup strategy
- [ ] Map still functions (bloom toggle works)
- [ ] No console errors on page navigation
- [ ] Chrome DevTools heap snapshot shows no Three.js objects retained after unmount

#### Risk Notes

- **Risk**: Medium if cleanup is incomplete — Three.js leaks are hard to detect.
- **Verification**: Open/close bloom toggle 10+ times; check memory profile.

---

### Task015: Standardize Import Conventions

| Field | Value |
|---|---|
| **Task ID** | TASK-015 |
| **Priority** | P2 |
| **Estimated Effort** | 20 minutes |
| **Dependency** | TASK-007, TASK-008 |

#### Goal

Standardize import ordering across all source files. Current imports are in arbitrary order. Establish a consistent convention aligned with `09-frontend-architecture.md` dependency rules.

#### Target Convention

```js
// 1. External libraries (react, d3, three, framer-motion)
// 2. Internal contexts
// 3. Internal services
// 4. Internal utils/hooks
// 5. Internal components
// 6. Internal data
// 7. Assets (images, JSON)
// 8. Styles
```

#### Files to Modify

| File | Current Issue |
|---|---|
| `MapPage.jsx` | Imports intermixed — components, data, contexts unordered |
| `TeaMap.jsx` | D3 import mixed with asset imports |
| `TeaDetailCard.jsx` | framer-motion import not clearly separated |
| `TeaCatalogPopup.jsx` | Same as above |
| `BottomControlBar.jsx` | Minor ordering issue |

#### Constraints

| ID | Constraint |
|---|---|
| T015-C01 | Do NOT change import paths — reorder only |
| T015-C02 | Do NOT change named vs default import style |
| T015-C03 | Do NOT remove any imports |
| T015-C04 | Skip files with fewer than 3 imports |

#### Acceptance Criteria

- [ ] All 5 files above follow the import convention
- [ ] Each import group separated by a blank line
- [ ] `npm run build` succeeds
- [ ] No runtime errors

#### Risk Notes

- **Risk**: Very low. Cosmetic change — no logic affected.

---

### Task016: Add Component Display Names

| Field | Value |
|---|---|
| **Task ID** | TASK-016 |
| **Priority** | P2 |
| **Estimated Effort** | 15 minutes |
| **Dependency** | None |

#### Goal

Add explicit `displayName` to all components. Currently `TeaMap` uses `forwardRef` (which sets displayName via the function name), but other components rely on inferred names. Explicit displayNames improve React DevTools debugging.

#### Components Needing displayName

| Component | Current Status |
|---|---|
| `TeaMap` | `forwardRef(function TeaMap(...))` — name is inferred but safe. Add explicit. |
| `TeaDetailCard` | Default export — inferred. Add explicit. |
| `TeaCatalogPopup` | Default export — inferred. Add explicit. |
| `TeaBloomLayer` | Default export — inferred. Add explicit. |
| `BottomControlBar` | Default export — inferred. Add explicit. |
| `Navbar` | Default export — inferred. Add explicit. |
| `SeasonSlider` | Not read — check if needed. |

#### Files to Modify

| File | Action |
|---|---|
| `client/src/components/Map/TeaMap.jsx` | Add `TeaMap.displayName = 'TeaMap'` after `forwardRef` |
| `client/src/components/Map/TeaDetailCard.jsx` | Add `TeaDetailCard.displayName = 'TeaDetailCard'` |
| `client/src/components/Tea/TeaCatalogPopup.jsx` | Add `TeaCatalogPopup.displayName = 'TeaCatalogPopup'` |
| `client/src/components/Map/TeaBloomLayer.jsx` | Add `TeaBloomLayer.displayName = 'TeaBloomLayer'` |
| `client/src/components/Navigation/BottomControlBar.jsx` | Add `BottomControlBar.displayName = 'BottomControlBar'` |
| `client/src/components/Navigation/Navbar.jsx` | Add `Navbar.displayName = 'Navbar'` |

#### Constraints

| ID | Constraint |
|---|---|
| T016-C01 | Do NOT change component function names |
| T016-C02 | Do NOT change export style (default vs named) |
| T016-C03 | Place `displayName` assignment immediately after the component definition |

#### Acceptance Criteria

- [ ] All 6 components have explicit `displayName`
- [ ] React DevTools shows explicit names (not "Anonymous" or inferred)
- [ ] `npm run build` succeeds

#### Risk Notes

- **Risk**: None. Additive only.

---

### Task017: Document Empty Directory Purposes

| Field | Value |
|---|---|
| **Task ID** | TASK-017 |
| **Priority** | P2 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | None |

#### Goal

Add a `README.md` or comment file in each empty directory explaining its intended purpose. This prevents confusion for new developers and AI coding agents.

#### Empty Directories

| Directory | Intended Purpose |
|---|---|
| `hooks/` | Custom React hooks (`useScrollPosition`, `useReducedMotion`, etc.) |
| `types/` | TypeScript/JSDoc type definitions |
| `utils/` | Pure utility functions |
| `styles/` | Additional CSS files (tokens, base, animations) |
| `layouts/` | Layout wrapper components (PageLayout, etc.) |
| `animations/` | GSAP/ScrollTrigger timeline definitions |

#### Files to Modify

| File | Action |
|---|---|
| `client/src/hooks/README.md` | **Create** — "Custom React hooks directory" + examples |
| `client/src/types/README.md` | **Create** — "Type definitions directory" + examples |
| `client/src/layouts/README.md` | **Create** — "Layout components directory" + examples |
| `client/src/animations/README.md` | **Create** — "Animation timeline definitions" + examples |

> `utils/` and `styles/` are no longer empty after previous tasks — skip them.

#### Constraints

| ID | Constraint |
|---|---|
| T017-C01 | Each README must be ≤ 5 lines |
| T017-C02 | Do NOT create README in non-empty directories |
| T017-C03 | Use consistent format: `# Directory Name` → one-line purpose → one example |

#### Acceptance Criteria

- [ ] 4 README.md files exist (hooks, types, layouts, animations)
- [ ] Each describes intended purpose
- [ ] `npm run build` succeeds (README files don't affect build)

#### Risk Notes

- **Risk**: None.

---

### Task018: Clean Up `package.json` Scripts and Metadata

| Field | Value |
|---|---|
| **Task ID** | TASK-018 |
| **Priority** | P2 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | TASK-001 |

#### Goal

Review `package.json` for:
1. Missing `"description"`, `"license"`, `"repository"` fields
2. Missing common scripts (`"lint"`, `"typecheck"`)
3. Clean up after Task001 dependency removal

#### Current State

```json
{
  "name": "tea-map-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  // no description, no license
}
```

#### Target State

```json
{
  "name": "tea-atlas",
  "version": "1.0.0",
  "type": "module",
  "description": "Interactive Chinese Tea Culture Digital Museum",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  },
  "license": "UNLICENSED"
}
```

#### Files to Modify

| File | Action |
|---|---|
| `client/package.json` | Add description, license; rename to `tea-atlas`; add `clean` script |

#### Constraints

| ID | Constraint |
|---|---|
| T018-C01 | Do NOT change `dev`, `build`, or `preview` script commands |
| T018-C02 | Do NOT add linting/typecheck scripts unless tooling is already configured |
| T018-C03 | `clean` script must work on Windows: use `rimraf` or `rm -rf` (bash) |
| T018-C04 | If renaming `name`, verify no code references the old name `tea-map-client` |

#### Acceptance Criteria

- [ ] `package.json` has `description` field
- [ ] `package.json` has `license` field
- [ ] `clean` script works (`npm run clean` removes `dist/`)
- [ ] `npm run build` still succeeds after rename (if renamed)

#### Risk Notes

- **Risk**: Low. Metadata changes only.
- **Note**: Renaming `"name"` from `tea-map-client` to `tea-atlas` is cosmetic — verify nothing imports by package name.

---

### Task019: Review and Update `.gitignore`

| Field | Value |
|---|---|
| **Task ID** | TASK-019 |
| **Priority** | P2 |
| **Estimated Effort** | 10 minutes |
| **Dependency** | None |

#### Goal

Verify `.gitignore` covers all generated and environment-specific files. Add missing entries.

#### Items to Check

| Entry | Should Be Ignored? | Currently Ignored? |
|---|---|---|
| `node_modules/` | Yes | Check |
| `dist/` | Yes | Check |
| `.env` / `.env.local` | Yes | Check |
| `*.log` | Yes | Check |
| `.DS_Store` | Yes | Check (macOS) |
| `Thumbs.db` | Yes | Check (Windows) |

#### Files to Modify

| File | Action |
|---|---|
| `client/.gitignore` | **Create or update** — add missing entries |
| `tea/.gitignore` (root) | Check if exists; create if missing |

#### Constraints

| ID | Constraint |
|---|---|
| T019-C01 | Do NOT add `package-lock.json` to gitignore — it must be committed |
| T019-C02 | Do NOT add `china.json` to gitignore — it's a project asset |
| T019-C03 | Do NOT add image assets to gitignore |

#### Acceptance Criteria

- [ ] `.gitignore` exists at project root and `client/` level
- [ ] `node_modules/` and `dist/` are ignored
- [ ] Environment files are ignored
- [ ] `git status` shows no generated files as untracked

#### Risk Notes

- **Risk**: None.

---

### Task020: Integration Verification

| Field | Value |
|---|---|
| **Task ID** | TASK-020 |
| **Priority** | P0 |
| **Estimated Effort** | 30 minutes |
| **Dependency** | TASK-001 through TASK-019 |

#### Goal

Run a full integration verification after all previous tasks are complete. Verify:

1. The app builds without errors
2. The app runs in dev mode without console errors
3. All interactive features work: map zoom, tea markers, detail panel, catalog popup, bloom toggle, season slider
4. No visual regressions
5. No new console warnings

#### Verification Checklist

| # | Test | Method |
|---|---|---|
| 1 | `npm run build` succeeds | Terminal |
| 2 | `npm run dev` starts | Terminal |
| 3 | Map renders with province outlines | Visual |
| 4 | Tea markers visible (27 markers) | Visual + count |
| 5 | Hover marker → tooltip appears | Interactive |
| 6 | Click marker → detail panel opens | Interactive |
| 7 | Detail panel → close button works | Interactive |
| 8 | Catalog popup → opens, filters work | Interactive |
| 9 | Bloom toggle → tea flowers appear/disappear | Interactive |
| 10 | Season slider → changes season → markers update | Interactive |
| 11 | Zoom controls (+, -, 收) work | Interactive |
| 12 | No console errors | DevTools console |
| 13 | No React key warnings | DevTools console |
| 14 | CSS renders correctly (no broken styles) | Visual |
| 15 | `prefers-reduced-motion` respected (bloom layer) | Emulate in DevTools |

#### Files to Check

All files modified in TASK-001 through TASK-019.

#### Constraints

| ID | Constraint |
|---|---|
| T020-C01 | Do NOT fix issues found during verification in this task — create follow-up tasks instead |
| T020-C02 | Do NOT modify code — this is verification only |
| T020-C03 | Document ALL issues found, even minor ones |

#### Acceptance Criteria

- [ ] All 15 verification checks pass
- [ ] Issues documented (if any) with reproduction steps
- [ ] Verification report written to `VERIFICATION-REPORT.md` in project root

#### Risk Notes

- **Risk**: This task may surface regressions from earlier tasks. Each should be tracked as a new Task (Task021+), not fixed inline.

---

## 4. Task Summary Matrix

| Task | Priority | Effort | Category | Description |
|---|---|---|---|---|
| TASK-001 | P0 | 10min | Dead Code | Remove unused `echarts` dependency |
| TASK-002 | P0 | 20min | Dedup | Extract duplicate `getMonths()` to utils |
| TASK-003 | P0 | 15min | Dedup | Extract `spotsFor()` to utils |
| TASK-004 | P0 | 30min | Dead Code | Remove or integrate GSAP animation files |
| TASK-005 | P1 | 15min | Wiring | Render Navbar or remove it |
| TASK-006 | P0 | 15min | Wiring | Fix BottomControlBar dead buttons |
| TASK-007 | P1 | 10min | Structure | Create `utils/index.js` barrel |
| TASK-008 | P1 | 5min | Structure | Create `hooks/index.js` barrel |
| TASK-009 | P1 | 20min | Types | Scaffold JSDoc type definitions |
| TASK-010 | P1 | 25min | Styles | Audit + centralize CSS custom properties |
| TASK-011 | P1 | 15min | Refactor | Move `normalizeSeasonText` to utils |
| TASK-012 | P1 | 15min | Docs | Mark unused API endpoints |
| TASK-013 | P1 | 10min | Structure | Create `styles/` file structure |
| TASK-014 | P0 | 20min | Stability | Verify Three.js cleanup (memory leak) |
| TASK-015 | P2 | 20min | Style | Standardize import conventions |
| TASK-016 | P2 | 15min | Style | Add component displayNames |
| TASK-017 | P2 | 10min | Docs | Document empty directory purposes |
| TASK-018 | P2 | 10min | Config | Clean up package.json |
| TASK-019 | P2 | 10min | Config | Review .gitignore |
| TASK-020 | P0 | 30min | QA | Full integration verification |

---

## 5. Constraints

| ID | Constraint |
|---|---|
| ROAD-C01 | Every task corresponds to a real problem found in the codebase — no speculative tasks |
| ROAD-C02 | No task introduces new features, new UI, or new product behavior |
| ROAD-C03 | No task introduces new dependencies (only removes or reorganizes) |
| ROAD-C04 | All file paths are relative to `Desktop/tea/client/` |
| ROAD-C05 | Each task must be executable independently (except where dependencies are listed) |
| ROAD-C06 | No task may modify `demoTeas.js` data |
| ROAD-C07 | No task may modify server-side code (`tea/server/`) |
| ROAD-C08 | After each task: `npm run build` must succeed |

---

## 6. Acceptance Criteria

- [ ] 20 tasks defined (TASK-001 through TASK-020)
- [ ] Each task has: Goal, Current State, Target State, Files to Modify, Constraints, Acceptance Criteria, Risk Notes
- [ ] Priority distribution: 7× P0, 8× P1, 5× P2
- [ ] Task dependency graph shows no circular dependencies
- [ ] All tasks reference real files and real problems
- [ ] No task proposes new features or architectural redesigns
- [ ] Each task is atomic — single concern, minimal files
- [ ] Total estimated effort: approximately 6 hours

---

## 7. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| ROAD-Q01 | Should TASK-004 use Option A (remove GSAP) or Option B (integrate GSAP)? | Animation architecture | Before TASK-004 |
| ROAD-Q02 | Should TASK-005 use Option A (render Navbar) or Option B (remove Navbar)? | Navigation UX | Before TASK-005 |
| ROAD-Q03 | Should TASK-006 use Option A (wire dead buttons) or Option B (remove dead buttons)? | Control bar design | Before TASK-006 |
| ROAD-Q04 | Should TASK-018 rename `"tea-map-client"` to `"tea-atlas"` in package.json? | Cosmetic — may break nothing, but verify first | Before TASK-018 |
| ROAD-Q05 | Should TASK-020 failures spawn new tasks (Task021+) inline, or be deferred for a separate planning session? | Process | Before TASK-020 |

---

## 8. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Component inventory + unused fields | `08-component-specification.md` | ✅ Complete |
| Codebase findings (dead code, duplicates, gaps) | `09-frontend-architecture.md` | ✅ Complete |
| Data schema (for type scaffolding) | `07-tea-content-system.md` | ✅ Complete |
| Codex rules (for task execution) | `11-codex-master-guide.md` | ⚠️ Next |

---

## 9. References

| Document | Relationship |
|---|---|
| `09-frontend-architecture.md` | Source of all findings that drive these tasks |
| `08-component-specification.md` | Component inventory referenced in file paths |
| `11-codex-master-guide.md` | Rules for executing these tasks via AI agents |

---

## 10. Next Document

> **`11-codex-master-guide.md`** — AI coding agent rules: never delete, never rename, never rebuild; incremental modification only; one task at a time.

---

> This roadmap contains 20 atomic, verifiable tasks. Every task fixes a real problem found in the existing codebase. No task invents new features. The total estimated effort is approximately 6 hours. After all tasks are complete, the codebase will be clean, consistent, and ready for feature development based on the documented architecture.
