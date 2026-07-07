# 02 — Information Architecture

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | IA-002 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-04 |
| **Related Documents** | `00-project-overview.md`, `01-product-requirements.md`, `03-site-architecture.md`, `07-tea-content-system.md` |

---

## 2. Terminology

> All subsequent documents MUST use these terms consistently. No synonyms allowed.

| Term | Definition | Do NOT Use |
|---|---|---|
| **Hero** | Fullscreen animated entrance section at page top | Intro, Splash, Landing, Banner |
| **Scene** | One discrete section within the scroll narrative | Chapter, Section, Part, Slide |
| **Camera** | The user's viewport perspective; controls zoom/pan state | View, Viewport, Screen |
| **Tea Region** | A geographic area within China that produces tea | Zone, Area, Territory |
| **Province** | A Chinese administrative province; a Tea Region may span multiple provinces or be contained within one | State, Region, District |
| **Tea Point** | A single tea variety with its own detail page | Tea Item, Tea Entry, Tea Card |
| **Ink Layer** | Background layer rendered in ink-wash style | Wash Layer, Paint Layer, Art Layer |
| **Fog Layer** | Atmospheric mist/cloud overlay | Mist Layer, Haze Layer, Cloud Layer |
| **Tea Layer** | Foreground layer containing tea-related visual elements | Object Layer, Element Layer, Asset Layer |
| **Overlay Layer** | UI elements layered above all visual content | UI Layer, Interface Layer, HUD |
| **Background Layer** | Furthest visual depth plane | Back Layer, Far Layer |
| **Map Layer** | The interactive SVG map and its children | China Map, SVG Map |
| **Timeline** | Horizontal scroll-driven tea lifecycle sequence | Growth Line, Lifecycle Bar, Progress Bar |
| **Detail Panel** | Information panel that appears on province zoom or tea selection | Info Card, Popup, Modal, Tooltip |
| **Encyclopedia** | The filterable tea collection page | Catalog, Library, Collection, Gallery |
| **Page Transition** | Animated movement between routed pages | Route Change, Navigation, Page Switch |
| **Scene Trigger** | The scroll position at which a scene begins animating | Activation Point, Start Point, Entry |

---

## 3. Content Hierarchy

```
Tea Atlas
├── 1. Homepage
│   ├── 1.1 Hero
│   ├── 1.2 Scroll Narrative
│   │   ├── 1.2.1 Scene: Ancient Tea Forests
│   │   ├── 1.2.2 Scene: Tea Mountains
│   │   ├── 1.2.3 Scene: Harvest
│   │   ├── 1.2.4 Scene: Processing
│   │   ├── 1.2.5 Scene: Tea Ceremony
│   │   └── 1.2.6 Scene: Modern Appreciation
│   ├── 1.3 Interactive Tea Map (embedded)
│   └── 1.4 Tea Growth Timeline
│
├── 2. Map Page
│   ├── 2.1 National Overview (default camera state)
│   ├── 2.2 Province Zoom (per-province camera state)
│   └── 2.3 Province Detail Panel
│
├── 3. Province Detail Page
│   ├── 3.1 Province Atmosphere
│   ├── 3.2 Regional Tea Culture
│   ├── 3.3 Famous Teas List
│   └── 3.4 Mini Location Map
│
├── 4. Encyclopedia Page
│   ├── 4.1 Filter Bar
│   │   ├── 4.1.1 Type Filter
│   │   ├── 4.1.2 Region Filter
│   │   └── 4.1.3 Flavor Filter
│   ├── 4.2 Tea Card Grid
│   └── 4.3 Empty State
│
├── 5. Tea Detail Page
│   ├── 5.1 Tea Hero Image
│   ├── 5.2 Tea Identity (name, type, region)
│   ├── 5.3 Flavor Profile
│   ├── 5.4 Origin Story
│   ├── 5.5 Brewing Guide
│   ├── 5.6 Origin Mini Map
│   └── 5.7 Related Teas
│
└── 6. Global
    ├── 6.1 Navigation Bar
    ├── 6.2 Page Transitions
    └── 6.3 Footer (minimal)
```

---

## 4. Navigation Model

### 4.1 Primary Navigation Path

| ID | Path | Type | Priority |
|---|---|---|---|
| NAV-001 | Hero → Scroll Narrative | Scroll-driven, linear | P0 |
| NAV-002 | Scroll Narrative → Map Section | Scroll-driven, linear | P0 |
| NAV-003 | Map Section → Timeline Section | Scroll-driven, linear | P0 |
| NAV-004 | Map: National → Province Zoom | Click interaction | P0 |
| NAV-005 | Province Zoom → National Overview | Click "Back" button | P0 |
| NAV-006 | Province Zoom → Province Detail Page | Click link | P0 |
| NAV-007 | Encyclopedia → Tea Detail | Click card | P0 |
| NAV-008 | Tea Detail → Encyclopedia (back) | Click back / browser back | P0 |
| NAV-009 | Any page → Any other page | Nav bar click | P0 |

### 4.2 Secondary Navigation Paths

| ID | Path | Type | Priority |
|---|---|---|---|
| NAV-010 | Province Detail → Tea Detail | Click tea name | P0 |
| NAV-011 | Tea Detail → Province Detail | Click region link | P1 |
| NAV-012 | Tea Detail → Related Tea Detail | Click related tea | P1 |
| NAV-013 | Timeline Stage → Tea Detail | Click stage link | P1 |
| NAV-014 | Province Detail → Map (national) | Click mini map | P1 |
| NAV-015 | Encyclopedia → Map | Nav bar click | P1 |

### 4.3 Navigation Rules

| ID | Rule | Priority |
|---|---|---|
| NAV-R01 | Back navigation always restores previous scroll position on list pages | P0 |
| NAV-R02 | No navigation action causes a full page reload | P0 |
| NAV-R03 | All cross-page navigation uses animated page transitions | P0 |
| NAV-R04 | Browser back/forward buttons work correctly for all routes | P0 |
| NAV-R05 | Deep links to any tea detail or province detail are supported | P0 |
| NAV-R06 | Navigation bar is persistent but visually subtle | P0 |

---

## 5. Page Structure

### 5.1 Homepage (`/`)

| Section | Scroll Range (%) | Content Type | Priority |
|---|---|---|---|
| Hero | 0% – 15% | Animated ink-wash landscape, title, subtitle, scroll indicator | P0 |
| Scene 1: Ancient Tea Forests | 15% – 28% | Deep green/wild atmosphere, ancient trees, text overlay | P0 |
| Scene 2: Tea Mountains | 28% – 42% | Mountain terraces, mist, elevation text | P0 |
| Scene 3: Harvest | 42% – 56% | Harvest imagery, hands, baskets, season text | P0 |
| Scene 4: Processing | 56% – 70% | Processing steps illustration, craftsmanship text | P0 |
| Scene 5: Tea Ceremony | 70% – 84% | Ceremony setting, teaware, ritual text | P0 |
| Scene 6: Modern Appreciation | 84% – 95% | Modern setting, global reach, closing text | P0 |
| Map Section | 95% – 130% | Interactive embedded map, brief intro text | P0 |
| Timeline Section | 130% – 160% | Horizontal scroll scrub area | P0 |

> Scroll ranges are approximate; final values determined during animation implementation.

### 5.2 Map Page (`/map`)

| Zone | Content | Priority |
|---|---|---|
| Background | Ink-wash terrain texture | P0 |
| Map Layer | SVG China map, tea provinces highlighted, non-tea provinces muted | P0 |
| Fog Layer | Atmospheric mist overlay | P1 |
| Detail Panel | Slide-in panel on province click | P0 |
| Map Controls | Zoom in/out, reset view | P1 |
| Province Labels | Text labels on active provinces | P0 |

### 5.3 Province Detail Page (`/province/:slug`)

| Section | Content | Priority |
|---|---|---|
| Atmosphere Hero | Full-width ink-wash province landscape | P0 |
| Province Identity | Province name (calligraphic), tea region badge | P0 |
| Culture Description | Regional tea culture text, 2-3 paragraphs | P0 |
| Famous Teas | Card list of teas from this province | P0 |
| Terroir Notes | Climate, elevation, soil notes | P1 |
| Mini Map | Small SVG map showing province location within China | P0 |
| Back Link | Return to national map or encyclopedia | P0 |

### 5.4 Encyclopedia Page (`/encyclopedia`)

| Section | Content | Priority |
|---|---|---|
| Page Header | "Tea Encyclopedia" title, subtle ink-wash background | P0 |
| Filter Bar | Type filter chips, region dropdown, flavor filter chips | P0 |
| Active Filters | Removable filter tags, "Clear All" link | P0 |
| Tea Card Grid | Responsive grid of tea cards | P0 |
| Empty State | Illustration + message when no teas match filters | P1 |
| Back to Top | Scroll-to-top button | P1 |

### 5.5 Tea Detail Page (`/tea/:slug`)

| Section | Content | Priority |
|---|---|---|
| Tea Hero | Large ink-wash illustration of the tea plant/leaves/cup | P0 |
| Identity Block | Name, Chinese name, type badge, region link, elevation | P0 |
| Flavor Wheel | Visual flavor profile indicator | P0 |
| Origin Story | Legend/history text, 1-3 paragraphs | P0 |
| Brewing Guide | Water temp, steep time, vessel, steps (structured data, not free text) | P0 |
| Origin Map | Mini map showing origin point within province | P1 |
| Related Teas | Horizontal scroll of related tea cards | P1 |
| Back Link | Return to encyclopedia (with scroll position) | P0 |

---

## 6. Data Relationships

```
Province (1) ────────────< (N) Tea Point
    │                            │
    │                            │
    ├── name                     ├── name
    ├── slug                     ├── slug
    ├── region (Tea Region)      ├── type (Tea Type)
    ├── climate                  ├── province (FK → Province)
    ├── teas[] (FK → Tea)        ├── flavor_profile
    ├── culture_text             ├── elevation
    ├── atmosphere_image         ├── origin_story
    └── map_coordinates          ├── brewing_guide
                                 ├── hero_image
                                 └── related_teas[] (FK → Tea)

Tea Type (enum)
    ├── Green
    ├── Black
    ├── Oolong
    ├── White
    ├── Yellow
    ├── Dark
    └── Pu'er

Tea Region (grouping)
    ├── Jiangnan (江南)
    ├── Jiangbei (江北)
    ├── South China (华南)
    └── Southwest (西南)

Flavor Profile (per tea)
    ├── primary_notes[] (floral, nutty, smoky, sweet, vegetal, earthy, fruity, roasted)
    ├── body (light / medium / full)
    └── finish (short / medium / long)
```

---

## 7. Sitemap

```
/
├── /map
├── /encyclopedia
├── /province/yunnan
├── /province/fujian
├── /province/zhejiang
├── /province/anhui
├── /province/sichuan
├── /province/hunan
├── /province/guangdong
├── /province/henan
├── /province/guizhou
├── /tea/longjing
├── /tea/biluochun
├── /tea/tieguanyin
├── /tea/da-hong-pao
├── /tea/pu-erh
├── /tea/keemun
├── /tea/silver-needle
├── /tea/junshan-yinzhen
├── /tea/lapsang-souchong
├── /tea/mao-feng
│   ... (20+ tea points total)
└── / (redirect: homepage fragment anchors for map/timeline sections)
```

---

## 8. Content Types

| ID | Type | Fields Count | Source | Priority |
|---|---|---|---|---|
| CT-001 | Province | 8 fields | Static data file | P0 |
| CT-002 | Tea Point | 14 fields | Static data file | P0 |
| CT-003 | Scene (narrative) | 5 fields | Static data file | P0 |
| CT-004 | Timeline Stage | 4 fields | Static data file | P0 |
| CT-005 | Navigation Item | 3 fields | Static config | P0 |
| CT-006 | Filter Option | 3 fields | Derived from tea data | P0 |

---

## 9. Search & Filter Architecture

### 9.1 Encyclopedia Filters

| ID | Filter | Type | Values | Priority |
|---|---|---|---|---|
| FIL-001 | Tea Type | Multi-select chips | Green, Black, Oolong, White, Yellow, Dark, Pu'er | P0 |
| FIL-002 | Province | Dropdown or chips | All tea-producing provinces | P0 |
| FIL-003 | Flavor Profile | Multi-select chips | Floral, Nutty, Smoky, Sweet, Vegetal, Earthy, Fruity, Roasted | P1 |
| FIL-004 | Clear All | Button | Resets all active filters | P0 |

### 9.2 Filter Behavior

| ID | Behavior | Priority |
|---|---|---|
| FIL-B01 | Multiple filters within a category use OR logic | P0 |
| FIL-B02 | Filters across categories use AND logic | P0 |
| FIL-B03 | Filtering animates cards out and remaining cards reflow | P0 |
| FIL-B04 | URL query params reflect active filters | P1 |
| FIL-B05 | Filter state persists when returning from tea detail | P1 |

---

## 10. States & Edge Cases

### 10.1 Per-Page States

| Page | State | Description | Priority |
|---|---|---|---|
| Home | Loading | Hero assets loading; show subtle loading indicator | P0 |
| Home | Animating | Hero animation playing; scroll disabled until complete or skipped | P0 |
| Home | Scrollable | Normal scroll-driven navigation active | P0 |
| Encyclopedia | Populated | Cards visible | P0 |
| Encyclopedia | Filtered | Subset of cards visible; filter bar shows active filters | P0 |
| Encyclopedia | Empty | No cards match filters; show empty state illustration + suggestion | P1 |
| Encyclopedia | Loading | Tea data not yet available; show skeleton cards | P0 |
| Tea Detail | Populated | All content loaded | P0 |
| Tea Detail | Not Found | Invalid tea slug; show 404-style message with encyclopedia link | P0 |
| Province Detail | Populated | All content loaded | P0 |
| Province Detail | Not Found | Invalid province slug; show 404-style message with map link | P0 |
| Map | Default | National overview camera state | P0 |
| Map | Zoomed | Province detail camera state | P0 |
| Map | Transitioning | Camera animation in progress; interactions disabled | P0 |
| All | Error | Unexpected error; show graceful fallback with navigation | P1 |

### 10.2 Global States

| State | Description | Priority |
|---|---|---|
| First Visit | Hero animation plays; no cached state | P0 |
| Return Visit | Hero animation skipped or shortened | P1 |
| Reduced Motion | `prefers-reduced-motion` active; all animations replaced with fades | P0 |
| Offline | Static site; should work fully once loaded (no server dependency) | P1 |

---

## 11. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-IA-01 | Too many tea points make encyclopedia feel cluttered | Medium | Medium | Start with 20 teas; paginate or lazy-load beyond that |
| RISK-IA-02 | Scroll narrative + embedded map + timeline makes homepage too long | Medium | High | Design clear visual breaks; allow skip navigation |
| RISK-IA-03 | Content hierarchy too deep for casual users | Low | Low | All key content reachable within 2 clicks from nav |
| RISK-IA-04 | Province vs Tea Region confusion | Medium | Medium | Use "Tea Region" for cultural groupings, "Province" for admin boundaries; clarify in UI |
| RISK-IA-05 | Flavor profile filter too subjective to be useful | Low | Medium | Use broad, universally recognized flavor categories |
| RISK-IA-06 | Empty states not designed and feel like bugs | Medium | Low | Design all empty states in advance (see Section 10) |

---

## 12. Constraints

| ID | Constraint |
|---|---|
| IA-C01 | Maximum navigation depth: 3 levels (Home → Page → Detail) |
| IA-C02 | Maximum teas in encyclopedia v1: 25 |
| IA-C03 | Maximum provinces with detail pages v1: 10 |
| IA-C04 | Maximum scenes in scroll narrative: 6 |
| IA-C05 | Every page must be reachable via nav bar, not just via scroll |
| IA-C06 | No orphan pages — every detail page must have a parent list or map view |
| IA-C07 | URL structure must be stable — slugs must not change after v1 launch |
| IA-C08 | Homepage total scroll length must not exceed 10 viewport heights |

---

## 13. Acceptance Criteria

- [ ] All pages listed in Section 5 have defined content sections
- [ ] Navigation model covers all user flows with no dead ends
- [ ] Sitemap covers all routes with no missing pages
- [ ] Data relationships are complete: Province ↔ Tea Point, Tea Type enum, Flavor Profile structure
- [ ] All states (Section 10) are documented per page
- [ ] Filter architecture (Section 9) covers all required filter dimensions with AND/OR logic defined
- [ ] No page requires more than 2 clicks to reach from the nav bar
- [ ] URL structure is RESTful and uses stable slugs
- [ ] All risks have mitigation strategies
- [ ] Terminology section is complete and will be enforced across all documents

---

## 14. Open Questions

| ID | Question | Potential Impact | Resolution Needed By |
|---|---|---|---|
| IA-Q01 | Should the embedded map on the homepage be the full interactive map, or a simplified preview? | Homepage scroll length and bundle size | Before Task: Homepage Map Section |
| IA-Q02 | How many teas should we launch with? 20? 25? | Content production effort | Before Task: Encyclopedia |
| IA-Q03 | Should the flavor profile filter use OR or AND within its category? | Filter UX behavior | Before Task: Encyclopedia Filters |
| IA-Q04 | Should province detail pages list teas inline, or link to encyclopedia with province pre-filtered? | Page structure, URL design | Before Task: Province Detail |
| IA-Q05 | Should the timeline section be on the homepage, a separate page, or both? | Homepage scroll length vs discoverability | Before Task: Timeline |

---

## 15. Implementation Checklist

- [ ] IA-001: Content hierarchy approved
- [ ] IA-002: Navigation model approved
- [ ] IA-003: All page structures defined
- [ ] IA-004: Data relationships modeled
- [ ] IA-005: Sitemap with all routes finalized
- [ ] IA-006: Content types defined with field counts
- [ ] IA-007: Filter architecture designed
- [ ] IA-008: All states and edge cases documented
- [ ] IA-009: Risk register reviewed
- [ ] IA-010: Open questions resolved

---

## 16. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Product requirements define page list and features | `01-product-requirements.md` | ✅ Complete |
| Data schema defines exact field types and relationships | `16-data-schema.md` | ⚠️ Pending |
| Site architecture defines URL patterns and routing | `03-site-architecture.md` | ⚠️ Next |

---

## 17. References

| Document | Relationship |
|---|---|
| `01-product-requirements.md` | FR-* requirements define what each page must do |
| `03-site-architecture.md` | Translates IA into URL structure and route logic |
| `07-tea-content-system.md` | Defines the actual tea data that populates this structure |
| `16-data-schema.md` | Formal schema for all content types defined here |

---

## 18. Next Document

> **`03-site-architecture.md`** — URL structure, routing table, data flow between pages, state architecture, and module boundaries.

---

> This document defines the structural backbone of Tea Atlas. Every page, every route, every data relationship flows from decisions made here. Changes to this document must propagate to all downstream documents.
