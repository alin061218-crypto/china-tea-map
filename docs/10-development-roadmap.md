# 10 — Development Roadmap

> Tea Atlas: Interactive Chinese Tea Culture Map
>
> **Roadmap aligned with current project scope (v2.0)**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | ROADMAP-010 |
| **Version** | 2.0 |
| **Status** | Aligned with Implementation |
| **Last Updated** | 2026-07-08 |
| **Related Documents** | `00-project-overview.md`, `01-product-requirements.md`, `08-component-specification.md`, `09-frontend-architecture.md` |

---

## 2. Current State Summary

### 2.1 What's Built

The project is a **single-page interactive tea map** with the following implemented features:

- SVG China map with D3 zoom/pan, province rendering, mountain terrain layers
- 35 tea markers with zoom-aware bloom effects and seasonal integration
- Tea detail side panel with brewing guides, stories, harvest months, checkin spots
- Tea catalog bottom-sheet popup with 7-category filtering
- Seasonal atmosphere system with region-specific visual profiles
- CSS cloud animation and ink-wash MapEffectLayer
- Express + SQLite backend with auth, teas CRUD, favorites, checkins
- Map controls: zoom in/out/reset, catalog launcher

### 2.2 What's NOT in Scope

Hero animation, scroll narratives, tea timeline, province detail pages, independent encyclopedia/detail routes, GSAP integration, and mobile responsiveness are deferred to future phases.

---

## 3. Task Priority Overview

| Priority | Count | Category |
|---|---|---|
| P0 | 6 | Critical: code quality, stability, verification |
| P1 | 6 | Structural: cleanup, documentation, polish |
| P2 | 4 | Minor: conventions, metadata, configuration |

---

## 4. Task Specifications

---

### Task001: Remove Unused Dependencies

| Field | Value |
|---|---|
| **Task ID** | TASK-001 |
| **Priority** | P0 |
| **Estimated Effort** | 15 min |

**Goal**: Remove `echarts` from client dependencies (never imported). Check if `gsap` is listed but unused. Reduce bundle size.

**Files**: `client/package.json`

**Acceptance**: `npm run build` succeeds. Map renders correctly. No new console errors.

---

### Task002: Remove or Integrate GSAP Animation Files

| Field | Value |
|---|---|
| **Task ID** | TASK-002 |
| **Priority** | P0 |
| **Estimated Effort** | 20 min |

**Goal**: `client/src/animations/` contains 4 GSAP timeline files with zero imports. Remove them. Current animations use framer-motion + D3 — this is the established pattern. Revisit GSAP only if a new animation requirement demands it.

**Files**: Delete 4 `.ts` files in `animations/`. Remove `gsap` from `package.json` if present.

**Acceptance**: Zero `.ts` files in `animations/`. Build succeeds. All existing animations (detail panel, catalog, zoom) still work.

---

### Task003: Render Navbar or Remove It

| Field | Value |
|---|---|
| **Task ID** | TASK-003 |
| **Priority** | P0 |
| **Estimated Effort** | 15 min |

**Goal**: `Navbar.jsx` exists but is never rendered. Either add it to `App.jsx` or delete it. Recommendation: render a minimal navbar with brand name only — the current app has zero visible navigation.

**Files**: `client/src/App.jsx` (add `<Navbar />`), or delete `Navbar.jsx`.

**Acceptance**: Navbar visible at top of page, or file deleted. Build succeeds.

---

### Task004: Verify Three.js Cleanup (Memory Leak Check)

| Field | Value |
|---|---|
| **Task ID** | TASK-004 |
| **Priority** | P0 |
| **Estimated Effort** | 20 min |

**Goal**: Audit `TeaBloomLayer.jsx` cleanup function. Verify all Three.js resources (renderer, scene, geometries, materials) are disposed on unmount. Add a `disposed` guard flag if missing.

**Files**: `client/src/components/Map/TeaBloomLayer.jsx`

**Acceptance**: No Three.js objects retained after unmount in Chrome DevTools heap snapshot. Bloom toggle works correctly.

---

### Task005: Extract Duplicate Utility Functions

| Field | Value |
|---|---|
| **Task ID** | TASK-005 |
| **Priority** | P1 |
| **Estimated Effort** | 20 min |

**Goal**: Audit components for duplicate function definitions. If `getMonths()` or similar utilities are duplicated, extract to `utils/`. Ensure `utils/index.js` barrel export is up to date.

**Files**: `utils/season.js`, `utils/index.js`, consumer components.

**Acceptance**: No duplicate function definitions across components. All imports use shared utils. Build succeeds.

---

### Task006: Scaffold Type Definitions

| Field | Value |
|---|---|
| **Task ID** | TASK-006 |
| **Priority** | P1 |
| **Estimated Effort** | 20 min |

**Goal**: Create `types/tea.js` with JSDoc `@typedef` for the Tea object matching `demoTeas.js` active fields. This provides IDE IntelliSense without TypeScript migration.

**Files**: `client/src/types/tea.js` (create)

**Acceptance**: JSDoc typedef exists with all active fields. Build succeeds.

---

### Task007: Audit and Centralize CSS Custom Properties

| Field | Value |
|---|---|
| **Task ID** | TASK-007 |
| **Priority** | P1 |
| **Estimated Effort** | 25 min |

**Goal**: Audit all CSS custom properties used across components. Centralize them in `styles/tokens.css`. Current properties are scattered across `index.css` and component inline styles.

**Files**: `client/src/styles/tokens.css` (create), `client/src/index.css` (add import)

**Acceptance**: All CSS custom properties documented in one file. No visual changes. Build succeeds.

---

### Task008: Clean Up `services/api.js`

| Field | Value |
|---|---|
| **Task ID** | TASK-008 |
| **Priority** | P1 |
| **Estimated Effort** | 15 min |

**Goal**: Mark unused API objects with JSDoc `@unused` comments. Currently `teaAPI`, `favAPI`, `checkinAPI`, `adminAPI` exist but the frontend uses static `demoTeas.js` data. Do NOT delete — the server routes are functional.

**Files**: `client/src/services/api.js`

**Acceptance**: All unused API objects marked with `/** @unused */`. `authAPI` NOT marked (it's used by AuthContext). Build succeeds.

---

### Task009: Standardize Import Conventions

| Field | Value |
|---|---|
| **Task ID** | TASK-009 |
| **Priority** | P2 |
| **Estimated Effort** | 20 min |

**Goal**: Apply consistent import ordering across all source files: 1) external libs, 2) contexts, 3) services, 4) utils, 5) components, 6) data, 7) assets, 8) styles.

**Files**: `MapPage.jsx`, `TeaMap.jsx`, `TeaDetailPanel.jsx`, `TeaCatalogPopup.jsx`

**Acceptance**: All files follow import ordering convention. Build succeeds. No runtime errors.

---

### Task010: Add Component Display Names

| Field | Value |
|---|---|
| **Task ID** | TASK-010 |
| **Priority** | P2 |
| **Estimated Effort** | 15 min |

**Goal**: Add explicit `displayName` to all components for React DevTools debugging.

**Components**: TeaMap, TeaDetailPanel, TeaCatalogPopup, BottomControlBar, CloudAnimation, MapEffectLayer

**Acceptance**: All components show explicit names in React DevTools. Build succeeds.

---

### Task011: Document Empty Directory Purposes

| Field | Value |
|---|---|
| **Task ID** | TASK-011 |
| **Priority** | P2 |
| **Estimated Effort** | 10 min |

**Goal**: Add short `README.md` files to empty directories explaining their intended purpose.

**Directories**: `hooks/`, `types/`, `layouts/`, `animations/`

**Acceptance**: Each empty directory has a ≤5 line README. Build succeeds.

---

### Task012: Clean Up `package.json` Metadata

| Field | Value |
|---|---|
| **Task ID** | TASK-012 |
| **Priority** | P2 |
| **Estimated Effort** | 10 min |

**Goal**: Verify `package.json` has `description`, `license` fields. Add `clean` script. The `name` field already reads `tea-atlas` in client — verify consistency with root.

**Files**: `client/package.json`, root `package.json`

**Acceptance**: Both package.json files have complete metadata. `npm run clean` removes `dist/`. Build succeeds.

---

### Task013: Review `.gitignore`

| Field | Value |
|---|---|
| **Task ID** | TASK-013 |
| **Priority** | P2 |
| **Estimated Effort** | 10 min |

**Goal**: Verify `.gitignore` covers `node_modules/`, `dist/`, `.env`, `*.log`, `.DS_Store`, `Thumbs.db`. Check both root and `client/` level.

**Files**: `.gitignore` (root), `client/.gitignore`

**Acceptance**: `git status` shows no generated/transient files as untracked.

---

### Task014: Integration Verification

| Field | Value |
|---|---|
| **Task ID** | TASK-014 |
| **Priority** | P0 |
| **Estimated Effort** | 30 min |

**Goal**: Full integration test after all previous tasks. Verify:

1. `npm run build` succeeds
2. `npm run dev` starts without errors
3. Map renders with province outlines and mountain layers
4. 35 tea markers visible, zoom-aware states work
5. Hover province → atmosphere effect triggers
6. Click marker → detail panel opens
7. Detail panel close works
8. Catalog popup opens, filters work
9. Season changes affect map appearance
10. Zoom controls functional
11. No console errors or React warnings

**Output**: `VERIFICATION-REPORT.md` updated.

---

## 5. Cleanup Checklist

Beyond the roadmap tasks, these housekeeping items should be addressed:

| Item | Priority |
|---|---|
| Remove `.codex-client-err.log` and `.codex-dev-err.log` from tracked files | P0 |
| Remove `.codex-client-out.log` and `.codex-dev-out.log` from tracked files | P0 |
| Verify `.venv-imagegen/` is gitignored | P1 |
| Remove empty `output/` directory | P2 |
| Clean `reference/` — keep only essential reference images | P2 |

---

## 6. Task Summary Matrix

| Task | Priority | Effort | Category | Description |
|---|---|---|---|---|
| TASK-001 | P0 | 15min | Dead Code | Remove unused dependencies |
| TASK-002 | P0 | 20min | Dead Code | Remove unused GSAP animation files |
| TASK-003 | P0 | 15min | Wiring | Render Navbar or remove it |
| TASK-004 | P0 | 20min | Stability | Verify Three.js cleanup |
| TASK-005 | P1 | 20min | Dedup | Extract duplicate utilities to utils/ |
| TASK-006 | P1 | 20min | Types | Scaffold JSDoc type definitions |
| TASK-007 | P1 | 25min | Styles | Audit + centralize CSS custom properties |
| TASK-008 | P1 | 15min | Docs | Mark unused API endpoints |
| TASK-009 | P2 | 20min | Style | Standardize import conventions |
| TASK-010 | P2 | 15min | Style | Add component displayNames |
| TASK-011 | P2 | 10min | Docs | Document empty directory purposes |
| TASK-012 | P2 | 10min | Config | Clean up package.json |
| TASK-013 | P2 | 10min | Config | Review .gitignore |
| TASK-014 | P0 | 30min | QA | Full integration verification |

**Total: 14 tasks, ~4.5 hours estimated effort.**

---

## 7. Constraints

| ID | Constraint |
|---|---|
| ROAD-C01 | Every task fixes a real problem in the codebase — no speculative work |
| ROAD-C02 | No task introduces new features beyond the current single-page map scope |
| ROAD-C03 | No task introduces new dependencies |
| ROAD-C04 | All file paths relative to `Desktop/tea/` |
| ROAD-C05 | After each task: `npm run build` must succeed |

---

## 8. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Component inventory | `08-component-specification.md` | ✅ Complete |
| Codebase findings | `09-frontend-architecture.md` | ✅ Complete |
| Data schema | `07-tea-content-system.md` | ✅ Complete |
| Product requirements (v2.0) | `01-product-requirements.md` | ✅ Updated |

---

## 9. Next Document

> **`11-codex-master-guide.md`** — AI coding agent rules for executing these tasks.

---

> This roadmap contains 14 atomic, verifiable tasks aligned with the **current** Tea Atlas scope. Every task fixes a real problem in the existing codebase. No task invents features beyond the single-page interactive map. Total estimated effort: approximately 4.5 hours.
