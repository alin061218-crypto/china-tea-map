# 01 — Product Requirements

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | PRD-001 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Author** | AI Documentation Agent |
| **Last Updated** | 2026-07-04 |
| **Related Documents** | `00-project-overview.md`, `02-information-architecture.md` |

---

## 2. Product Scope

### 2.1 In Scope

| ID | Scope Item | Description |
|---|---|---|
| S-001 | Hero Entrance | Fullscreen animated intro with ink-wash landscape, fog, and tea motifs |
| S-002 | Scroll Narrative | Scroll-driven storytelling across multiple scene sections |
| S-003 | Interactive Tea Map | SVG China map with clickable provinces, zoom states, and tea region highlights |
| S-004 | Tea Encyclopedia | Filterable, searchable collection of Chinese tea varieties with detail cards |
| S-005 | Tea Detail Pages | Individual tea pages with origin, flavor, legend, brewing info |
| S-006 | Tea Growth Timeline | Horizontal scroll scrub showing tea lifecycle from seed to cup |
| S-007 | Province Detail Pages | Per-province pages with regional tea culture and famous teas |
| S-008 | Page Transitions | Smooth, animated transitions between all major sections |
| S-009 | Ambient Effects | Fog, particles, parallax, atmospheric overlays |

### 2.2 Out of Scope

| ID | Scope Item | Reason |
|---|---|---|
| O-001 | User Accounts / Login | Museum experience; no personalization needed |
| O-002 | E-commerce / Shop | Not a store |
| O-003 | Admin / CMS Backend | Content is static, curated, version-controlled |
| O-004 | User Comments / Reviews | Not a community platform |
| O-005 | Search Engine | Encyclopedia filtering is sufficient; no full-text search |
| O-006 | Multi-language i18n | English only for v1; extend later |
| O-007 | Mobile App | Browser-only; mobile responsive is a later phase |
| O-008 | Real-time Data | All content is static and pre-curated |
| O-009 | Social Media Integration | No share buttons, no embeds |

---

## 3. Design Objectives

| ID | Objective | How to Measure |
|---|---|---|
| DO-01 | Users feel they have entered a museum, not a website | Qualitative: first-impression testing |
| DO-02 | Scrolling feels cinematic, not utilitarian | Smoothness, frame rate, narrative flow |
| DO-03 | Chinese ink-wash aesthetic is consistent on every page | Visual audit checklist |
| DO-04 | Information is discovered progressively, not dumped | Content depth increases with scroll depth |
| DO-05 | Interactions feel slow, deliberate, respectful | No instant jumps; all transitions animated |
| DO-06 | White space is used as a structural element | Minimum 20% negative space on every viewport |
| DO-07 | Every visual element serves the tea culture narrative | Design audit: each element must have a cultural justification |

---

## 4. Functional Requirements

### 4.1 Hero Section

| ID | Requirement | Priority |
|---|---|---|
| FR-H-01 | Hero displays fullscreen ink-wash landscape on load | P0 |
| FR-H-02 | Hero animation plays automatically on page load | P0 |
| FR-H-03 | Hero includes: mountains, fog layers, falling tea leaf, title reveal | P0 |
| FR-H-04 | Title "Tea Atlas" fades in with calligraphic styling | P0 |
| FR-H-05 | Subtitle "Interactive Chinese Tea Culture Digital Museum" appears after title | P0 |
| FR-H-06 | A "Begin Journey" or scroll-down indicator appears after hero animation completes | P0 |
| FR-H-07 | User can skip hero animation by scrolling | P1 |
| FR-H-08 | Hero does not replay on revisit during same session | P1 |

### 4.2 Scroll Narrative

| ID | Requirement | Priority |
|---|---|---|
| FR-S-01 | Page scroll drives all scene transitions | P0 |
| FR-S-02 | Each "scene" activates at a defined scroll position | P0 |
| FR-S-03 | Scenes include: Ancient Tea Forests → Tea Mountains → Harvest → Processing → Tea Ceremony → Modern Appreciation | P0 |
| FR-S-04 | Each scene has unique background, foreground elements, and text overlay | P0 |
| FR-S-05 | Text fades in/out as user scrolls through each scene | P0 |
| FR-S-06 | Parallax effect between background, midground, foreground layers | P0 |
| FR-S-07 | Smooth scrolling via Lenis (no native browser scroll) | P0 |
| FR-S-08 | Scene transitions have defined entry and exit trigger points | P0 |

### 4.3 Interactive Tea Map

| ID | Requirement | Priority |
|---|---|---|
| FR-M-01 | Display SVG map of China with tea-producing provinces highlighted | P0 |
| FR-M-02 | Map has two camera states: National Overview (zoom out) and Province Detail (zoom in) | P0 |
| FR-M-03 | Clicking a province triggers zoom-in camera animation | P0 |
| FR-M-04 | Zoomed-in province shows: province name, famous teas, region character badge | P0 |
| FR-M-05 | Map includes terrain features: mountains, rivers, tea-growing regions | P1 |
| FR-M-06 | Hover on province shows province name tooltip | P0 |
| FR-M-07 | "Back to China" button returns to National Overview | P0 |
| FR-M-08 | Currently selected province has distinct visual state | P0 |
| FR-M-09 | Provinces without tea culture are visually muted | P0 |
| FR-M-10 | Map supports pan and zoom via scroll (when map section is active) | P1 |

### 4.4 Tea Encyclopedia

| ID | Requirement | Priority |
|---|---|---|
| FR-E-01 | Display tea cards in a masonry or grid layout | P0 |
| FR-E-02 | Each card shows: tea name, type badge, region, flavor notes, thumbnail | P0 |
| FR-E-03 | Filter teas by: type (Green, Black, Oolong, White, Yellow, Dark, Pu'er) | P0 |
| FR-E-04 | Filter teas by: province/region | P0 |
| FR-E-05 | Filter teas by: flavor profile (floral, nutty, smoky, sweet, vegetal, earthy) | P1 |
| FR-E-06 | Card hover reveals additional info + subtle scale animation | P0 |
| FR-E-07 | Clicking a card navigates to Tea Detail page | P0 |
| FR-E-08 | Active filters are visually indicated and individually removable | P0 |
| FR-E-09 | "Clear All Filters" button available when any filter is active | P0 |
| FR-E-10 | Empty state: "No teas match your filters" with suggestion to adjust | P1 |

### 4.5 Tea Detail Pages

| ID | Requirement | Priority |
|---|---|---|
| FR-TD-01 | Hero image/illustration of the tea | P0 |
| FR-TD-02 | Tea name, type, region, elevation | P0 |
| FR-TD-03 | Flavor profile with visual indicators (not just text) | P0 |
| FR-TD-04 | Origin story / legend section | P0 |
| FR-TD-05 | Brewing guide: water temp, steep time, vessel recommendation | P0 |
| FR-TD-06 | Mini map showing origin location within province | P1 |
| FR-TD-07 | Related teas section (same region or same type) | P1 |
| FR-TD-08 | Back navigation to encyclopedia with scroll position preserved | P0 |

### 4.6 Tea Growth Timeline

| ID | Requirement | Priority |
|---|---|---|
| FR-TL-01 | Horizontal timeline: Seed → Sprout → Mature Bush → Harvest → Processing → Cup | P0 |
| FR-TL-02 | Progress driven by horizontal scroll within the section | P0 |
| FR-TL-03 | Each stage has a unique illustration and short description | P0 |
| FR-TL-04 | Visual indicator shows current stage and progress within stage | P0 |
| FR-TL-05 | Stages animate in as user scrolls; previous stages remain visible | P0 |
| FR-TL-06 | Timeline section has clear entry and exit points in the page | P0 |

### 4.7 Province Detail Pages

| ID | Requirement | Priority |
|---|---|---|
| FR-P-01 | Province name in large calligraphic display | P0 |
| FR-P-02 | Province atmosphere image/illustration (ink-wash style) | P0 |
| FR-P-03 | List of famous teas from this province (linked to detail pages) | P0 |
| FR-P-04 | Regional tea culture notes | P0 |
| FR-P-05 | Climate and terroir description | P1 |
| FR-P-06 | Mini map showing province location within China | P0 |
| FR-P-07 | Back button returns to national map view | P0 |

### 4.8 Global Navigation

| ID | Requirement | Priority |
|---|---|---|
| FR-N-01 | Minimal top or side navigation bar | P0 |
| FR-N-02 | Nav items: Map, Encyclopedia, Timeline, About | P0 |
| FR-N-03 | Navigation is subtle — does not dominate the visual field | P0 |
| FR-N-04 | Active section is indicated | P0 |
| FR-N-05 | Logo/wordmark returns user to hero/top of page | P0 |
| FR-N-06 | Navigation appears after hero section is scrolled past | P1 |

---

## 5. Non-functional Requirements

| ID | Category | Requirement | Target |
|---|---|---|---|
| NFR-01 | Performance | Initial page load (LCP) | < 2.5s |
| NFR-02 | Performance | Animation frame rate | Stable 60fps |
| NFR-03 | Performance | Scroll response latency | < 16ms per frame |
| NFR-04 | Performance | Total page weight (initial) | < 3MB |
| NFR-05 | Performance | Image lazy loading | All non-hero images |
| NFR-06 | Browser | Supported browsers | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-07 | Browser | Minimum viewport width | 1280px (desktop-first) |
| NFR-08 | Accessibility | Color contrast ratio | WCAG AA (4.5:1 for text) |
| NFR-09 | Accessibility | Keyboard navigation | All interactive elements focusable |
| NFR-10 | Accessibility | Reduced motion | Respects `prefers-reduced-motion` |
| NFR-11 | Code Quality | TypeScript coverage | All new code in TS |
| NFR-12 | Code Quality | Component reusability | No duplicated animation or layout logic |
| NFR-13 | Content | All tea data in structured format | Single source of truth (JSON/TS) |
| NFR-14 | Content | All text content centralized | No hardcoded strings in components |

---

## 6. User Flow

### 6.1 Primary Flow

```
Hero Entrance
    │
    ▼
Scroll Narrative (5-7 scenes)
    │
    ├──► Interactive Tea Map
    │       │
    │       ├──► Province Detail ──► Back to Map
    │       │       │
    │       │       └──► Tea Detail ──► Back
    │       │
    │       └──► Tea Detail (direct from map)
    │
    ├──► Tea Encyclopedia
    │       │
    │       ├──► Filter / Search
    │       │
    │       └──► Tea Detail ──► Related Teas
    │
    └──► Tea Growth Timeline
            │
            └──► Horizontal scrub through lifecycle
```

### 6.2 Secondary Flows

| Flow | Description |
|---|---|
| Direct Navigation | User can jump to any section via nav bar |
| Map → Encyclopedia | Province zoom shows link: "Explore all teas from this region" |
| Encyclopedia → Map | Tea detail shows mini map → click opens full map |
| Timeline → Detail | Timeline processing stage links to tea detail pages |
| Deep Link | Any tea detail page is directly linkable via URL |

---

## 7. Page List

| ID | Page | Route | Description |
|---|---|---|---|
| P-01 | Home | `/` | Hero + scroll narrative + timeline |
| P-02 | Map | `/map` | Interactive tea map of China (also embedded on home) |
| P-03 | Province | `/province/:slug` | Province detail page |
| P-04 | Encyclopedia | `/encyclopedia` | Tea card collection with filters |
| P-05 | Tea Detail | `/tea/:slug` | Individual tea detail page |
| P-06 | (Section) | `/` (section anchor) | Tea Growth Timeline (section within home) |

---

## 8. Feature List

| ID | Feature | Pages Involved | Priority |
|---|---|---|---|
| F-01 | Hero animation with ink-wash landscape | P-01 | P0 |
| F-02 | Scroll-driven scene narrative | P-01 | P0 |
| F-03 | Interactive SVG China map with province zoom | P-01, P-02, P-03 | P0 |
| F-04 | Tea encyclopedia with multi-filter | P-04 | P0 |
| F-05 | Tea detail pages | P-05 | P0 |
| F-06 | Province detail pages | P-03 | P0 |
| F-07 | Horizontal tea growth timeline | P-01 | P0 |
| F-08 | Page transitions (animated) | All | P0 |
| F-09 | Ambient effects (fog, particles) | P-01, P-02 | P1 |
| F-10 | Parallax layering | P-01 | P0 |
| F-11 | Navigation bar (subtle, minimal) | All | P0 |
| F-12 | Responsive layout (mobile) | All | P2 |

---

## 9. Interaction Rules

| ID | Rule | Applies To |
|---|---|---|
| IR-01 | All state transitions must be animated — no instant cuts | All pages |
| IR-02 | Scroll is the primary navigation axis; clicks supplement scroll | Home, Map |
| IR-03 | Hover states must have visual feedback within 150ms | All interactive elements |
| IR-04 | Click/tap targets minimum 44×44px | All interactive elements |
| IR-05 | Back navigation always returns to previous scroll position | Map → Province, Encyclopedia → Detail |
| IR-06 | Animations respect `prefers-reduced-motion`: replace with fade on reduced | All animations |
| IR-07 | Only one major animation sequence plays at a time | Home page |
| IR-08 | No autoplay audio or video | Entire site |
| IR-09 | Scroll-jacking is limited to defined scroll-driven sections | Home page sections |
| IR-10 | Native scroll behavior outside of scroll-driven sections | Encyclopedia, Detail pages |

---

## 10. Animation Requirements

> Implementation details belong in `05-animation-system.md`. This section describes WHAT animations are needed, not HOW to build them.

| ID | Animation | Trigger | Duration | Easing Character |
|---|---|---|---|---|
| AR-01 | Hero landscape reveal | Page load | 2-3s | Slow ease-out, like mist clearing |
| AR-02 | Tea leaf fall | After landscape settles | 1-1.5s | Gentle drift, slight sway |
| AR-03 | Title fade-in | After leaf lands | 0.8-1s | Slow fade, calligraphic reveal feel |
| AR-04 | Scene-to-scene transition | Scroll position | Variable (1-3s scrub) | Smooth crossfade + parallax |
| AR-05 | Province zoom in | Click province | 0.8-1.2s | Ease-in-out, camera-like zoom |
| AR-06 | Province zoom out | Click back | 0.6-1s | Ease-in-out, reverse of zoom in |
| AR-07 | Tea card hover | Mouse enter | 0.2-0.3s | Subtle scale + shadow lift |
| AR-08 | Tea card filter | Click filter | 0.3-0.5s | Cards animate out, remaining re-flow |
| AR-09 | Timeline stage advance | Horizontal scroll | Scrub-driven | One-to-one with scroll position |
| AR-10 | Page transition enter | Route change | 0.5-0.8s | Fade up + slight translate |
| AR-11 | Page transition exit | Route change | 0.3-0.5s | Fade out, faster than enter |
| AR-12 | Fog drift | Continuous (ambient) | Infinite loop | Very slow, barely perceptible |
| AR-13 | Parallax layer shift | Scroll position | Scrub-driven | Background slower than foreground |
| AR-14 | Navigation appear/disappear | Scroll past hero | 0.3-0.5s | Fade and slide |

---

## 11. Responsive Requirements

| ID | Breakpoint | Behavior |
|---|---|---|
| RR-01 | ≥ 1440px | Optimal experience; all effects enabled |
| RR-02 | 1280px – 1439px | Full feature set; minor spacing adjustments |
| RR-03 | 1024px – 1279px | Reduced parallax layers; simplified hero |
| RR-04 | 768px – 1023px | Stacked layout; map interaction simplified; scroll narrative linearized |
| RR-05 | < 768px | P2 — deferred; basic content accessible, animations minimal |

> Desktop-first. Mobile responsiveness is a Phase 2 deliverable.

---

## 12. Accessibility Requirements

| ID | Requirement |
|---|---|
| A11Y-01 | All images have descriptive `alt` text |
| A11Y-02 | All interactive map regions have accessible labels |
| A11Y-03 | Focus order follows visual order |
| A11Y-04 | Visible focus indicators on all interactive elements |
| A11Y-05 | `prefers-reduced-motion` disables scroll-driven animations |
| A11Y-06 | Color is never the sole differentiator for information |
| A11Y-07 | Minimum text contrast 4.5:1 (WCAG AA) |
| A11Y-08 | Page titles are descriptive and unique per route |
| A11Y-09 | Skip-to-content link available |

---

## 13. Performance Requirements

| ID | Metric | Target | Measurement |
|---|---|---|---|
| PR-01 | Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| PR-02 | First Input Delay (FID) | < 100ms | Lighthouse |
| PR-03 | Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| PR-04 | Animation frame rate | ≥ 55fps sustained | Chrome DevTools FPS meter |
| PR-05 | Total bundle size (initial) | < 500KB gzipped | Build output |
| PR-06 | Image total per page | < 2MB | DevTools Network tab |
| PR-07 | Time to Interactive (TTI) | < 3.5s | Lighthouse |
| PR-08 | SVG map complexity | < 5000 DOM nodes | Element count |

---

## 14. Future Expansion

> NOT for v1. Listed here to ensure architecture does not preclude these.

| ID | Feature | Why Deferred |
|---|---|---|
| FX-01 | Multi-language (Chinese, Japanese) | Content volume; English first |
| FX-02 | Mobile responsive | Desktop-first strategy |
| FX-03 | Tea brewing interactive simulator | Complex interaction; separate phase |
| FX-04 | Audio ambiance (music, nature sounds) | Licensing + performance |
| FX-05 | 3D tea set viewer (Three.js) | Significant scope increase |
| FX-06 | User bookmarks / favorites | Requires user accounts |
| FX-07 | Dark mode | Museum experience suits light tones |
| FX-08 | Tea region weather integration | External API dependency |

---

## 15. Constraints

| ID | Constraint |
|---|---|
| C-01 | Must work in all modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions) |
| C-02 | Must not exceed 3MB initial page weight |
| C-03 | Must not require any backend server |
| C-04 | Must not use any CSS framework that conflicts with ink-wash aesthetic (no Material UI, no Bootstrap) |
| C-05 | All content must be Chinese tea culture — no generic or unrelated content |
| C-06 | No autoplay audio or video |
| C-07 | No third-party tracking or analytics beyond privacy-respecting alternatives |
| C-08 | Must be deployable as a static site (Vite build output) |

---

## 16. Acceptance Criteria

- [ ] All P0 functional requirements are implemented and testable
- [ ] Hero animation plays on load with ink-wash landscape, fog, tea leaf, title reveal
- [ ] Scroll narrative drives at least 5 scene transitions
- [ ] SVG China map displays, highlights tea provinces, supports click-to-zoom
- [ ] Tea encyclopedia displays all teas with working filters
- [ ] Tea detail pages show all required information sections
- [ ] Tea growth timeline scrubs through all stages
- [ ] Province detail pages show teas and regional culture
- [ ] All page transitions are animated
- [ ] Performance targets met (LCP < 2.5s, stable 60fps animations)
- [ ] All A11Y requirements met
- [ ] No broken links, no dead ends in user flow

---

## 17. Dependencies

| Dependency | Description | Status |
|---|---|---|
| `00-project-overview.md` | Project identity and design philosophy | ✅ Complete |
| Tea data content | Structured data for all teas, provinces, regions | ⚠️ Pending (see `07-tea-content-system.md`) |
| SVG China map asset | Base map file with province boundaries | ⚠️ Pending (see `06-map-system.md`) |
| Visual assets | Ink-wash illustrations, textures, background art | ⚠️ Pending (see `12-assets-guide.md`) |
| Reference website analysis | Interaction patterns and animation rhythm study | ⚠️ Needs completion before Task001 |

---

## 18. Next Document

> **`02-information-architecture.md`** — Content hierarchy, page tree, navigation model, and data relationships.

---

> This document is designed for AI development agents. Every requirement ID (FR-*, NFR-*, AR-*, etc.) can be directly referenced in development tasks and acceptance criteria.
