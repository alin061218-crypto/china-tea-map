# 16 — QA & Testing Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Official Quality Assurance & Testing Standards**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | QA-016 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `10-development-roadmap.md`, `14-deployment-guide.md`, `04-ui-design-system.md`, `05-animation-system.md`, `08-component-specification.md` |

---

## 2. Purpose

This document defines **how Tea Atlas is tested, verified, and quality-gated** before reaching users. It is the single standard for all testing activities.

| In Scope | Out of Scope |
|---|---|
| Testing standards and philosophy | CI/CD pipeline implementation (→ `14-deployment-guide.md`) |
| Test level definitions | Per-task verification procedures (→ `10-development-roadmap.md`) |
| Manual test procedures | Deployment process (→ `14-deployment-guide.md` §16) |
| Browser compatibility matrix | Build configuration (→ `14-deployment-guide.md` §5) |
| Accessibility testing (WCAG) | Code standards (→ `15-project-rules.md`) |
| Animation verification | Animation definitions (→ `05-animation-system.md`) |
| Performance budgets and measurement | Performance optimization techniques (→ `14-deployment-guide.md` §10) |
| Visual regression checklist | Design tokens (→ `04-ui-design-system.md`) |
| Release quality gate criteria | Content validation (→ `13-content-guide.md` §12) |

---

## 3. Testing Philosophy

### 3.1 Core Principles

| ID | Principle | Description |
|---|---|---|
| **TST-P01** | **Test What Users See** | Prioritize tests that verify the rendered output, not implementation details. If a user can't see the bug, the test shouldn't fail. |
| **TST-P02** | **Critical Paths First** | The 5 critical paths (Hero → Map → Encyclopedia → Tea Detail → Province Detail) must work 100% of the time. All other paths are secondary. |
| **TST-P03** | **Automate the Repetitive** | Build, typecheck, lint, and regression checks run automatically. Manual testing is reserved for visual, experiential, and cultural quality. |
| **TST-P04** | **Ship When Confident** | The release quality gate (§15) is a hard gate. If it doesn't pass, the release doesn't ship. No exceptions for schedule pressure. |
| **TST-P05** | **One Broken Thing is a Blocker** | One P0 defect blocks release. P1 defects require documented acknowledgment. P2 defects do not block. |
| **TST-P06** | **Test Real Conditions** | Test on the slowest supported device, not the developer's machine. Test on throttled networks. Test without WebGL. Test with reduced motion. |

### 3.2 Testing Responsibility Matrix

| Activity | Human | Documentation AI | Codex | CI/CD |
|---|---|---|---|---|
| Unit test creation | — | — | ✓ | — |
| Integration test creation | — | — | ✓ | — |
| Build verification | — | — | ✓ | ✓ (auto) |
| Manual testing | ✓ | — | — | — |
| Accessibility audit | ✓ | — | — | — |
| Visual regression review | ✓ | — | — | — |
| Performance measurement | — | — | — | ✓ (auto) |
| Animation quality review | ✓ | — | — | — |
| Content accuracy review | ✓ | — | — | — |
| Release gate approval | ✓ | — | — | — |

---

## 4. Test Levels

### 4.1 Level 1 — Unit Testing

| Property | Specification |
|---|---|
| **Scope** | Individual functions, utilities, hooks |
| **Framework** | Vitest (native Vite integration) |
| **Location** | `client/src/**/__tests__/` or co-located `*.test.ts` |
| **Coverage Target** | ≥ 70% of utility code; 0% requirement for components |
| **Run Command** | `npm test` (to be added to `package.json`) |
| **CI Integration** | Runs on every PR; failure blocks merge |

#### Unit Test Targets

| Target | Examples | Priority |
|---|---|---|
| Utility functions | `getMonths()`, `spotsFor()`, `normalizeSeasonText()` | P0 |
| Data selectors | Functions that filter/search teas, provinces, stories | P0 |
| Custom hooks | `useSeason()`, filter hooks, state hooks | P1 |
| Type guards | Validation functions, enum checks | P1 |
| Formatting functions | Date/month formatters, string utilities | P1 |
| React components | — NOT unit tested (covered by integration + E2E) | — |

#### Unit Test Standards

| ID | Rule |
|---|---|
| **UT-R01** | Tests use descriptive names: `it('returns teas filtered by province when province filter is active')` |
| **UT-R02** | One `describe` block per function/module. One `it` per behavior. |
| **UT-R03** | Tests do not depend on execution order. Each test is independent. |
| **UT-R04** | Mock external dependencies (API calls, browser APIs). Test logic, not network. |
| **UT-R05** | Edge cases: empty input, null/undefined, boundary values, invalid enum values. |

### 4.2 Level 2 — Integration Testing

| Property | Specification |
|---|---|
| **Scope** | Component interactions, data flow, route transitions |
| **Framework** | Vitest + React Testing Library |
| **Location** | `client/src/**/__tests__/` |
| **Run Command** | `npm test` (same suite, integration tests co-located) |
| **CI Integration** | Runs on every PR; failure blocks merge |

#### Integration Test Targets

| Target | Test Description | Priority |
|---|---|---|
| **Route rendering** | Every route renders without crashing | P0 |
| **Filter → Card Grid** | Changing filter updates visible cards correctly | P0 |
| **Map → Province Click** | Clicking province triggers zoom + panel | P1 |
| **Tea Card → Detail** | Clicking tea card navigates to correct detail page | P1 |
| **Season Slider → Map** | Season change updates map markers and colors | P1 |
| **Favorites Toggle** | Heart icon toggles state and persists to localStorage | P1 |
| **Search/Filter Reset** | Clear filters restores full card grid | P1 |
| **Error Boundary** | Thrown error renders fallback UI, not blank screen | P0 |

#### Integration Test Standards

| ID | Rule |
|---|---|
| **IT-R01** | Tests render the component tree, not isolated components. Test what the user sees. |
| **IT-R02** | Use `screen.getByRole()`, `getByLabelText()`, `getByText()` — accessibility-first queries. Avoid `getByTestId()`. |
| **IT-R03** | Async operations use `findBy*` queries with timeout. No `waitFor` with arbitrary delays. |
| **IT-R04** | Integration tests do not mock child components. Only mock API calls and browser APIs. |

### 4.3 Level 3 — End-to-End Testing

| Property | Specification |
|---|---|
| **Scope** | Complete user flows across multiple routes |
| **Framework** | Playwright (Chromium + Firefox + WebKit) |
| **Location** | `client/e2e/` |
| **Run Command** | `npm run test:e2e` |
| **CI Integration** | Runs on PR to `main`; advisory only (does not block merge in v1) |

#### E2E Test Scenarios

| ID | Scenario | Steps | Priority |
|---|---|---|---|
| **E2E-01** | Hero → Scenes → Map | Load page → wait for hero animation → scroll through scenes → reach map | P0 |
| **E2E-02** | Map → Province → Back | Click province → verify zoom → verify panel → click back → verify overview | P0 |
| **E2E-03** | Encyclopedia → Filter → Detail | Navigate to /encyclopedia → apply type filter → click tea card → verify detail page | P0 |
| **E2E-04** | Tea Detail → Related → Navigation | Open tea detail → click related tea → verify navigation → click back | P1 |
| **E2E-05** | Season Change | Change season slider → verify map updates → verify color overlay → verify winter snow | P1 |
| **E2E-06** | Direct URL Access | Navigate directly to /tea/longjing → verify page renders → verify back navigation works | P0 |
| **E2E-07** | 404 Page | Navigate to /nonexistent → verify 404 page renders → verify "Return Home" link works | P1 |

---

## 5. Manual Testing Checklist

### 5.1 Critical Paths (Must Pass Every Release)

| ID | Path | Steps | Pass Criteria |
|---|---|---|---|
| **MAN-01** | Hero Entrance | Load site → observe hero animation | Mountains render, fog drifts, tea leaf falls, title reveals. No visual glitches. |
| **MAN-02** | Scroll Narrative | Scroll from hero through all 6 scenes | Each scene transitions smoothly. Text fades in/out correctly. Parallax layers move at correct speeds. |
| **MAN-03** | Map Interaction | Hover provinces → click province → interact with panel | Province highlight on hover. Zoom animation smooth. Detail panel slides in. Pin drops visible. |
| **MAN-04** | Encyclopedia Browse | Navigate to encyclopedia → scroll card grid → apply filters | Cards render correctly. Filter chips toggle. Empty state shows when no results. |
| **MAN-05** | Tea Detail View | Click tea card → view detail → check all sections | Hero image loads. Flavor profile renders. Brewing guide shows steps. Origin story readable. Back navigation works. |

### 5.2 Secondary Paths (Must Pass — P1)

| ID | Path | Steps | Pass Criteria |
|---|---|---|---|
| **MAN-06** | Season Slider | Drag season slider through all 4 seasons | Color overlay changes. Map markers update. Winter shows snow particles. |
| **MAN-07** | Timeline Scrub | Scroll to timeline section → horizontal scrub | Stages advance. Illustrations bloom. Progress line draws. |
| **MAN-08** | Province Detail Page | Navigate to /province/zhejiang | Atmosphere image loads. Tea list renders. Cultural content displays. |
| **MAN-09** | Favorites | Click heart on tea → check collection | Heart fills. Count updates. Persists after page reload. |
| **MAN-10** | Keyboard Navigation | Tab through interactive elements | Focus ring visible. Tab order logical. Enter/Space activates. Escape closes panels. |

### 5.3 Edge Cases

| ID | Scenario | Expected Behavior |
|---|---|---|
| **MAN-11** | Rapid clicks on province | No double-zoom. No duplicate panels. No state corruption. |
| **MAN-12** | Scroll during animation | Animation completes or exits gracefully. No visual tearing. |
| **MAN-13** | Browser back/forward | Page transitions trigger correctly. Scroll position restored on list pages. |
| **MAN-14** | Slow network (3G throttle) | Hero image loads progressively. Text content renders before images. No layout shift. |
| **MAN-15** | Resize window during map zoom | Map re-centers. Camera state remains valid. No visual artifacts. |
| **MAN-16** | Zero teas in filter result | Empty state renders. Message is helpful. Reset filter link works. |

---

## 6. Regression Testing Strategy

### 6.1 Regression Test Suite

| Suite | Contents | Run Trigger | Execution Time Budget |
|---|---|---|---|
| **Quick** | Unit tests + build + typecheck | Every push | ≤ 2 min |
| **Full** | Quick + integration tests | Every PR | ≤ 5 min |
| **Visual** | Screenshot comparison of 5 critical paths | PR to main | ≤ 3 min |
| **E2E** | Playwright scenarios (E2E-01 – E2E-07) | Pre-release | ≤ 10 min |

### 6.2 Regression Risk Areas

| Area | Risk Level | Mitigation |
|---|---|---|
| Map camera (D3 zoom/pan) | **High** | Province click + zoom test in integration suite |
| GSAP timelines | **High** | Animation verification checklist (§11) |
| Three.js WebGL (TeaBloomLayer) | **High** | Memory leak check (Task014 from roadmap) |
| Season state (SeasonContext) | **Medium** | Season slider integration test |
| Filter logic (Encyclopedia) | **Medium** | Filter → card grid integration test |
| Route transitions | **Medium** | Direct URL access E2E tests |
| CSS custom properties | **Medium** | Visual regression screenshots |
| Font loading (FOUT/CLS) | **Low** | Visual check on throttled network |

### 6.3 Regression Rules

| ID | Rule |
|---|---|
| **REG-R01** | Full regression suite runs on every PR. Must pass before merge. |
| **REG-R02** | Visual regression compares screenshots of 5 critical paths against baseline. Diff > 1% fails. |
| **REG-R03** | Baseline screenshots are updated only when visual changes are intentional and approved. |
| **REG-R04** | E2E suite runs before every release. Failures block release unless explicitly acknowledged. |
| **REG-R05** | When a bug is found in production, a regression test is added for that specific scenario before the fix is merged. |

---

## 7. Browser Compatibility Matrix

### 7.1 Supported Browsers

| Browser | Minimum Version | Priority | Testing Method |
|---|---|---|---|
| **Chrome** | 90+ | P0 | Automated (Playwright Chromium) + Manual |
| **Firefox** | 90+ | P0 | Automated (Playwright Firefox) + Manual |
| **Safari** | 15+ | P0 | Automated (Playwright WebKit) + Manual (macOS) |
| **Edge** | 90+ | P1 | Manual (Edge is Chromium-based; Chrome tests cover 95%) |

### 7.2 Browser-Specific Risk Areas

| Feature | Chrome | Firefox | Safari | Risk | Mitigation |
|---|---|---|---|---|---|
| WebGL (Three.js) | ✅ Full | ✅ Full | ⚠️ Performance | Medium | Test TeaBloomLayer on Safari; fallback to CSS if needed |
| WebP images | ✅ | ✅ | ✅ (15.4+) | Low | Safari 15+ supports WebP |
| CSS `backdrop-filter` | ✅ | ✅ | ✅ (15.4+) | Low | Frosted glass effect works on all targets |
| CSS `mix-blend-mode` | ✅ | ✅ | ⚠️ Rendering | Medium | Test seasonal overlays on all browsers |
| SVG `foreignObject` | ✅ | ✅ | ⚠️ Buggy | Low | Not used in current code |
| `IntersectionObserver` | ✅ | ✅ | ✅ | Low | Used for scroll triggers |
| `prefers-reduced-motion` | ✅ | ✅ | ✅ | Low | All browsers support |
| WOFF2 fonts | ✅ | ✅ | ✅ | Low | All browsers support |
| `scroll-behavior: smooth` | ✅ | ✅ | ✅ (15.4+) | Low | Fallback: Lenis handles scroll smoothing |

### 7.3 Unsupported Browsers

| Browser | Reason |
|---|---|
| Internet Explorer (all versions) | EOL. No WebGL. No CSS custom properties. |
| Safari < 15 | < 1% market share. No WebP. |
| Opera Mini | Extreme data-saving mode breaks SPA. Not a target audience. |

### 7.4 Browser Testing Rules

| ID | Rule |
|---|---|
| **BRO-R01** | Every release is manually smoke-tested on Chrome + Firefox + Safari |
| **BRO-R02** | Automated E2E runs on Chromium + Firefox + WebKit |
| **BRO-R03** | A P0 defect on any supported browser blocks release |
| **BRO-R04** | A P1 defect on a single browser requires documented acknowledgment |

---

## 8. Responsive Testing

### 8.1 Supported Viewports

| Breakpoint | Width Range | Priority | Testing |
|---|---|---|---|
| **XL Desktop** | ≥ 1440px | P0 — Primary target | Manual + visual regression |
| **L Desktop** | 1280px – 1439px | P0 | Visual regression |
| **M Laptop** | 1024px – 1279px | P1 | Manual check |
| **S Tablet** | 768px – 1023px | P2 | Advisory only |
| **XS Mobile** | < 768px | P2 | Advisory only |

### 8.2 Responsive Checklist

| ID | Check | Viewports | Pass Criteria |
|---|---|---|---|
| **RES-01** | No horizontal scrollbar | XL, L, M | Content fits viewport width. No overflow. |
| **RES-02** | Map is fully visible | XL, L, M | China outline fully visible. No province cut off. |
| **RES-03** | Card grid columns adjust | XL (4), L (3), M (2) | Grid switches at correct breakpoints. |
| **RES-04** | Navigation bar not truncated | L, M | All nav items visible. No text overflow. |
| **RES-05** | Detail panel not overflowing | XL, L, M | Panel fits within viewport. Scroll if content exceeds. |
| **RES-06** | Font sizes remain readable | All | Minimum 14px body text. No text smaller than 11px. |
| **RES-07** | Touch targets ≥ 44×44px | S, XS | Buttons, chips, map pins have adequate touch area. |

---

## 9. Accessibility Testing

### 9.1 Accessibility Standards

| Standard | Target | Priority |
|---|---|---|
| **WCAG 2.1 Level AA** | All pages and components | P0 |
| **Keyboard Navigation** | All interactive elements reachable and operable via keyboard | P0 |
| **Screen Reader** | Semantic HTML, ARIA labels, alt text on all content images | P1 |
| **Color Contrast** | ≥ 4.5:1 for body text, ≥ 3:1 for large text (≥24px) | P0 |
| **Reduced Motion** | `prefers-reduced-motion` disables non-essential animations | P0 |
| **Focus Indicators** | Visible focus ring on all interactive elements | P0 |

### 9.2 Accessibility Checklist

| ID | Check | Tool / Method | Pass Criteria |
|---|---|---|---|
| **A11Y-01** | Color contrast audit | Lighthouse / axe DevTools | 0 contrast violations |
| **A11Y-02** | Keyboard navigation | Manual: Tab through entire app | Every interactive element reachable. Focus order logical. No focus traps. |
| **A11Y-03** | Skip-to-content link | Manual: Tab on page load | First focusable element is a skip link (if implemented) |
| **A11Y-04** | Image alt text | axe DevTools + manual audit | All `<img>` have `alt`. Content images: descriptive. Decorative: `alt=""`. |
| **A11Y-05** | Form labels | axe DevTools | All inputs have associated `<label>` or `aria-label` |
| **A11Y-06** | Heading hierarchy | Manual + axe | One `<h1>` per page. No skipped heading levels. |
| **A11Y-07** | Landmark regions | Manual | `<main>`, `<nav>`, `<header>`, `<footer>` used appropriately |
| **A11Y-08** | ARIA attributes | axe DevTools | No invalid ARIA roles. No missing required ARIA children. |
| **A11Y-09** | Reduced motion | Manual: enable in OS settings | Animations disabled or downgraded to instant fades |
| **A11Y-10** | Screen reader announcement | Manual: VoiceOver (macOS) / NVDA (Windows) | Route changes announced. Dynamic content updates announced (aria-live). |
| **A11Y-11** | Zoom to 200% | Manual: browser zoom | Content not truncated. No horizontal scroll at 200%. |
| **A11Y-12** | Focus indicator visible | Manual: Tab through | 2px `Tea.50` outline visible on every focused element |

### 9.3 Accessibility Rules

| ID | Rule |
|---|---|
| **A11Y-R01** | No `aria-*` or `data-*` attributes may be removed from existing components |
| **A11Y-R02** | New interactive components must include focus handling + ARIA label |
| **A11Y-R03** | Color is never the sole indicator of information — always paired with icon or text |
| **A11Y-R04** | Lighthouse accessibility score must be ≥ 95 on all pages |
| **A11Y-R05** | `axe DevTools` scan passes with 0 violations before release |
| **A11Y-R06** | Reduced motion fallback verified before release |

---

## 10. Performance Testing

### 10.1 Performance Budgets

| Metric | Budget | Measurement Tool | Priority |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | Lighthouse | P0 |
| **FID** (First Input Delay) | ≤ 100ms | Lighthouse | P0 |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Lighthouse | P0 |
| **TTFB** (Time to First Byte) | ≤ 600ms | Lighthouse / Vercel Analytics | P0 |
| **Total JS (gzipped)** | ≤ 400 KB | `vite build` + `rollup-plugin-visualizer` | P0 |
| **Total CSS (gzipped)** | ≤ 50 KB | `vite build` | P0 |
| **Font Load (total)** | ≤ 150 KB | Lighthouse / Network tab | P0 |
| **Animation FPS** | ≥ 55 fps sustained | Chrome DevTools Performance panel | P1 |
| **Memory (after 5 min idle)** | ≤ 150 MB | Chrome DevTools Memory panel | P1 |

### 10.2 Performance Test Scenarios

| ID | Scenario | Steps | Pass Criteria |
|---|---|---|---|
| **PRF-01** | First load (cold cache) | Open incognito → load homepage | LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1 |
| **PRF-02** | First load (3G throttle) | Throttle to "Fast 3G" → load homepage | LCP ≤ 4.0s. Text content visible within 2s. |
| **PRF-03** | Route navigation | Navigate between 5 routes | Each transition ≤ 500ms. No jank. |
| **PRF-04** | Scroll performance | Scroll through all 6 scenes → map → timeline | Consistent 60fps. No frame drops during parallax. |
| **PRF-05** | Map interaction | Zoom in/out 5 provinces rapidly | Smooth camera transitions. No layout shift. |
| **PRF-06** | Memory over time | Idle on homepage for 5 minutes | No continuous memory growth. GC stabilizes ≤ 150MB. |
| **PRF-07** | Animation stress | Trigger all ambient animations simultaneously | ≤ 30 concurrent GSAP tweens. FPS ≥ 55. |
| **PRF-08** | Bundle size budget | `npm run build` | All chunks under budget. No chunk > 500KB. |

### 10.3 Performance Rules

| ID | Rule |
|---|---|
| **PRF-R01** | Build fails if any JS chunk exceeds 500KB (warning threshold) |
| **PRF-R02** | Build fails if total CSS exceeds 50KB gzipped |
| **PRF-R03** | Lighthouse CI runs on every PR. Score < 90 on desktop blocks merge. |
| **PRF-R04** | Animation FPS is measured in the Performance panel before release. Drops below 55fps require investigation. |
| **PRF-R05** | New dependencies must justify their size impact. ≥ 10KB gzipped requires explicit approval. |

---

## 11. Animation Verification

### 11.1 Animation Test Categories

| Category | ANIM-IDs | Test Method | Pass Criteria |
|---|---|---|---|
| **Hero Entrance** | ANIM-020 – ANIM-030 | Manual observation + frame count | All elements render. Sequence timing correct. No visual glitches. |
| **Scroll Narrative** | ANIM-040 – ANIM-048 | Manual scroll + frame rate check | Parallax layers move smoothly. Scene transitions trigger at correct scroll positions. |
| **Map Camera** | ANIM-060 – ANIM-072 | Manual: click provinces + frame count | Zoom to province: ≤ 1200ms (DUR-05). Fog reduces during zoom. Pins drop after zoom. |
| **Micro-interactions** | ANIM-001 – ANIM-019 | Manual: hover/click all interactive elements | Hover ≤ 150ms response. Press feedback visible. Transitions smooth. |
| **Timeline** | ANIM-080 – ANIM-087 | Manual horizontal scroll | Stages advance with scroll. Illustrations bloom. Progress line draws. |
| **Page Transitions** | ANIM-100 – ANIM-108 | Manual navigation | Exit + enter ≤ 1200ms total. Overlap visible. No flash of white. |
| **Ambient** | ANIM-120 – ANIM-125 | Manual observation over 60s | Fog drifts continuously. No looping artifacts. Particles within bounds. |

### 11.2 Animation Checklist

| ID | Check | Pass Criteria |
|---|---|---|
| **ANM-01** | Hero animation completes without user interaction | All ANIM-020–026 play in sequence. Total duration ≤ 5s. |
| **ANM-02** | Scroll during hero skips animation gracefully | Elements fade out (ANIM-027). No jarring cut. |
| **ANM-03** | Parallax rates correct | Background 0.3×, Midground 0.6×, Foreground 1.0× scroll speed. |
| **ANM-04** | Map zoom centers on clicked province | Camera moves to province centroid. No province cut off. |
| **ANM-05** | Map zoom out returns to national overview | Full China map visible. Camera at default position. |
| **ANM-06** | Fog drifts continuously without reset jump | Smooth infinite loop. No visible seam. Direction consistent. |
| **ANM-07** | GSAP tweens cleaned up on route change | No orphaned tweens. Memory stable after navigation. |
| **ANM-08** | Reduced motion: all animations downgraded | Hero: static frame. Scroll: instant. Parallax: disabled. Map zoom: instant. |
| **ANM-09** | Animation frame rate ≥ 55fps throughout | No drops during hero, parallax, or map zoom. |
| **ANM-10** | No concurrent animation conflicts | Multiple animations on same element don't fight each other. |

---

## 12. Visual Regression Checklist

### 12.1 Visual Baseline

Visual regression compares the current build against an approved baseline screenshot of each critical page.

| ID | Page | Viewport | Baseline Elements Checked |
|---|---|---|---|
| **VIS-01** | Homepage — Hero (after animation) | 1440×900 | Title position, fog opacity, mountain layers, scroll indicator |
| **VIS-02** | Homepage — Map Section | 1440×900 | China outline, province colors, map markers, fog |
| **VIS-03** | Encyclopedia — Card Grid | 1440×900 | Card layout, filter bar, badge colors, grid spacing |
| **VIS-04** | Tea Detail — Full Page | 1440×900 | Hero image, flavor wheel, brewing guide, spacing |
| **VIS-05** | Province Detail | 1440×900 | Atmosphere image, tea list, cultural content, layout |

### 12.2 Visual Regression Rules

| ID | Rule |
|---|---|
| **VIS-R01** | Visual regression runs on every PR to `main`. Diff > 1% pixel difference fails. |
| **VIS-R02** | Intentional visual changes require baseline update in the same PR. Reviewer confirms the diff is expected. |
| **VIS-R03** | Baselines are stored in `client/test/visual-baselines/`. Git-tracked. |
| **VIS-R04** | Visual regression does not block merge for documentation-only PRs. |

### 12.3 Manual Visual Checklist

| ID | Check | Pass Criteria |
|---|---|---|
| **VIS-M01** | Color consistency | All colors match design tokens. No `#FFF` or `#000` visible anywhere. |
| **VIS-M02** | Typography consistency | Font families correct. No fallback font visible (no FOUT). Line heights proportional. |
| **VIS-M03** | Spacing consistency | Padding/margins match tokens. Grid gutters even. No collapsed or doubled spacing. |
| **VIS-M04** | No visual glitches | No flickering. No misaligned elements. No overlapping text. No clipped content. |
| **VIS-M05** | Dark elements on dark backgrounds | Check all badges, chips, and labels against their backgrounds. Text must be readable. |
| **VIS-M06** | White space maintained | Minimum 20% negative space on every viewport. No content crowding. |

---

## 13. Error Handling Verification

### 13.1 Error Scenario Testing

| ID | Scenario | Expected Behavior | Priority |
|---|---|---|---|
| **ERR-01** | API server unreachable | Graceful degradation. Content shows cached/placeholder state. Error toast appears. No white screen. | P0 |
| **ERR-02** | Invalid route (/nonexistent) | 404 page renders. "Return Home" link works. No console errors. | P0 |
| **ERR-03** | Invalid tea slug (/tea/nonexistent) | 404 or redirect to encyclopedia. No blank detail page. | P0 |
| **ERR-04** | JavaScript runtime error | Error boundary catches. Fallback UI renders. Reload button works. Error reported to Sentry. | P0 |
| **ERR-05** | WebGL not supported | TeaBloomLayer hidden. No crash. No error toast. Fallback to CSS gradient. | P1 |
| **ERR-06** | Image fails to load | Broken image icon replaced with placeholder. Alt text still visible. Layout doesn't collapse. | P1 |
| **ERR-07** | Font fails to load | System font fallback. Text remains readable. No layout shift after timeout. | P1 |
| **ERR-08** | localStorage full/quota exceeded | Favorites gracefully degrade. Error toast appears. App continues functioning. | P2 |

### 13.2 Error Handling Rules

| ID | Rule |
|---|---|
| **ERR-R01** | Every API call has error handling. Unhandled promise rejections are P0 bugs. |
| **ERR-R02** | Error boundary covers entire app. No uncaught render error reaches the user. |
| **ERR-R03** | Error messages are user-facing: say what went wrong and what to do next. No stack traces. No "Error 500." |
| **ERR-R04** | Network errors show a retry option. Non-retryable errors show a "go home" option. |
| **ERR-R05** | Console errors in production are monitored via Sentry. 0 console errors is the target. |

---

## 14. Acceptance Criteria

- [ ] Testing philosophy: 6 principles + responsibility matrix (10 rows × 4 roles)
- [ ] Unit testing: 6 targets with priorities, 5 standards (UT-R01 – UT-R05)
- [ ] Integration testing: 8 targets with priorities, 4 standards (IT-R01 – IT-R04)
- [ ] End-to-end testing: 7 scenarios with steps and priorities (E2E-01 – E2E-07)
- [ ] Manual testing: 5 critical paths, 5 secondary paths, 6 edge cases — all with pass criteria
- [ ] Regression testing: 4 suites with triggers and time budgets, 8 risk areas with mitigations, 5 rules
- [ ] Browser compatibility: 4 browsers with minimum versions, 9 feature risk areas, 4 rules
- [ ] Responsive testing: 6 breakpoints with priorities, 7 checklist items with pass criteria
- [ ] Accessibility: 6 standards, 12 checklist items, 6 rules
- [ ] Performance: 9 budget metrics with measurement tools, 8 test scenarios, 5 rules
- [ ] Animation verification: 7 categories mapped to ANIM-ID ranges, 10 checklist items
- [ ] Visual regression: 5 baseline pages, 4 rules, 6-item manual visual checklist
- [ ] Error handling: 8 scenarios with expected behavior, 5 rules
- [ ] All rule IDs (TST-P*, UT-R*, IT-R*, REG-R*, BRO-R*, A11Y-R*, PRF-R*, VIS-R*, ERR-R*) are globally unique and verifiable
- [ ] No duplication of `14-deployment-guide.md` (CI/CD, release process) or `10-development-roadmap.md` (per-task verification)
- [ ] Every checklist item has measurable pass/fail criteria

---

## 15. Release Quality Gate

### 15.1 Quality Gate Criteria

A release MAY NOT proceed unless ALL of the following pass:

| Gate | Criteria | Verified By |
|---|---|---|
| **GATE-01** | CI pipeline green: build + typecheck + lint + unit tests + integration tests | CI/CD |
| **GATE-02** | `npm audit` reports 0 high or critical vulnerabilities | CI/CD |
| **GATE-03** | E2E suite passes (E2E-01 through E2E-07) | CI/CD + Human |
| **GATE-04** | Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90 | Lighthouse CI |
| **GATE-05** | Visual regression diff ≤ 1% on all 5 critical pages | Visual regression tool |
| **GATE-06** | Bundle size within budget (JS ≤ 400KB, CSS ≤ 50KB, no chunk > 500KB) | `vite build` report |
| **GATE-07** | Manual smoke test: 5 critical paths pass (MAN-01 – MAN-05) | Human |
| **GATE-08** | Browser compatibility: Chrome + Firefox + Safari manual check passes | Human |
| **GATE-09** | Accessibility: axe DevTools 0 violations, Lighthouse A11Y ≥ 95 | Human + tool |
| **GATE-10** | Animation verification: ANM-01 through ANM-10 all pass | Human |
| **GATE-11** | Content validation checklist passes for all new/modified content | Human (→ `13-content-guide.md` §12) |
| **GATE-12** | No P0 defects open. P1 defects documented and acknowledged. | Human |

### 15.2 Gate Bypass Rules

| ID | Rule |
|---|---|
| **GTE-R01** | No gate may be bypassed without explicit human approval. |
| **GTE-R02** | A bypassed gate must be documented: which gate, why bypassed, risk accepted, who approved, date. |
| **GTE-R03** | GATE-01 (CI green) may never be bypassed. |
| **GTE-R04** | GATE-07 (smoke test) may never be bypassed. |
| **GTE-R05** | A release with bypassed gates is marked as a "conditional release" in the changelog. |

### 15.3 Gate Status Report Template

```
## Release Quality Gate Report — v{version}

| Gate | Status | Notes |
|---|---|---|
| GATE-01 CI Pipeline | ✅ PASS | All checks green |
| GATE-02 npm audit | ✅ PASS | 0 vulnerabilities |
| GATE-03 E2E Suite | ✅ PASS | 7/7 scenarios |
| GATE-04 Lighthouse | ✅ PASS | P98, A100, B92 |
| GATE-05 Visual Regression | ✅ PASS | Diff 0.3% |
| GATE-06 Bundle Size | ✅ PASS | JS 342KB, CSS 38KB |
| GATE-07 Manual Smoke Test | ✅ PASS | 5/5 paths |
| GATE-08 Browser Compat | ✅ PASS | Chrome/Firefox/Safari |
| GATE-09 Accessibility | ✅ PASS | 0 axe violations |
| GATE-10 Animation | ✅ PASS | 10/10 checks |
| GATE-11 Content | ✅ PASS | All validated |
| GATE-12 Defects | ✅ PASS | 0 P0, 0 P1 open |

**Verdict: APPROVED** — Release may proceed.
```

---

## 16. References

| Document | Relationship |
|---|---|
| `04-ui-design-system.md` | Design tokens for visual regression baselines; color contrast requirements |
| `05-animation-system.md` | ANIM-ID catalog for animation verification; performance constraints |
| `06-map-system.md` | Map camera behavior for integration tests |
| `08-component-specification.md` | Component states for interaction testing |
| `10-development-roadmap.md` | Per-task verification procedures; Task020 (integration test) |
| `11-codex-master-guide.md` | Build verification protocol (§10) |
| `12-assets-guide.md` | Asset formats for image load testing |
| `13-content-guide.md` | Content validation checklist |
| `14-deployment-guide.md` | CI/CD pipeline; release process; smoke test; rollback triggers |
| `15-project-rules.md` | P0-PR-008 (One Source of Truth); AI role boundaries |

---

## 17. Next Document

> **`17-contributing-guide.md`** — Contributor onboarding, development environment setup, code review standards, PR template, and community guidelines for Tea Atlas contributors.

---

> This document is the quality constitution of Tea Atlas. Every release passes through these gates. Every bug that reaches production represents a failure of this document's processes — not a failure of the developer. When a bug ships, the first question is: which gate should have caught this, and why didn't it?
