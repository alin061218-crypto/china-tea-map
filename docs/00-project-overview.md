# 00 — Project Overview

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Tea Atlas |
| **Subtitle** | Interactive Chinese Tea Culture Digital Museum |
| **Type** | Interactive Digital Museum (Frontend Web Application) |
| **Genre** | Cultural Experience / Immersive Storytelling |
| **Target Audience** | Global users interested in Chinese tea culture; tourists, educators, designers, tea enthusiasts |
| **Language** | English (primary); extensible to Chinese |

---

## 2. Elevator Pitch

Tea Atlas is a browser-based interactive digital museum that invites users into an immersive journey through China's tea culture. Through cinematic scroll-driven storytelling, hand-drawn ink-wash aesthetics, and a navigable SVG map of China, users explore tea-growing regions, discover famous tea varieties, and witness the lifecycle of tea — all without leaving the browser. The experience prioritizes atmosphere, emotion, and discovery over information density.

---

## 3. Core Experience

1. **Hero Entrance** — A fullscreen ink-wash landscape animation introduces the user to the world of Chinese tea. Fog rolls, mountains fade in, and a single tea leaf descends.
2. **Scroll-driven Narrative** — As the user scrolls, the page tells a story: from ancient tea forests to modern tea ceremonies. GSAP + ScrollTrigger + Lenis drive all motion.
3. **Interactive Tea Map** — An SVG map of China highlights tea-growing provinces. Clicking a province reveals its tea culture, famous teas, and regional character. The map has camera states: zoom-out (China overview) and zoom-in (province detail).
4. **Tea Encyclopedia** — A card-based, filterable collection of famous Chinese teas. Each tea has a detail page with origin map point, flavor profile, legend, and brewing tips.
5. **Tea Growth Timeline** — A horizontal scrub animation that walks through the lifecycle: seed → sprout → bush → harvest → processing → cup.
6. **Province Detail Pages** — Dedicated pages for each tea-producing province with regional atmosphere, tea varieties, and cultural notes.

---

## 4. Design Philosophy

| Principle | Description |
|---|---|
| **Atmosphere First** | Visual mood and emotional resonance take precedence over information architecture. Users should *feel* China before they *read* about it. |
| **Museum, Not Dashboard** | Every interaction should evoke walking through a physical museum gallery — slow, contemplative, respectful. |
| **Ink-Wash Aesthetic** | All visuals derive from Chinese ink painting (水墨画): low saturation, rice-paper textures, fog gradients, calligraphic touches. |
| **Scroll as Camera** | Scrolling is the primary navigation mechanic. It moves the "camera" through scenes, not jump-cuts between pages. |
| **Progressive Discovery** | Information unfolds as the user engages. Nothing is dumped in a table or a wall of text. |
| **Restraint** | White space is a deliberate design element. Every pixel must earn its place. |

---

## 5. Visual Identity Keywords

水墨 (Ink Wash) · 宣纸 (Rice Paper) · 留白 (Negative Space) · 茶山 (Tea Mountains) · 云雾 (Mist & Cloud) · 自然 (Nature) · 诗意 (Poetic) · 东方 (Oriental) · 慢 (Slow) · 柔和 (Soft)

---

## 6. Reference & Inspiration

The project draws interaction and structural inspiration from an immersive floral-themed website. The reference is used for:

- **Interaction patterns** — how scroll drives scene changes
- **Animation rhythm** — timing, easing, and sequencing of animations
- **Page structure** — hero → map → encyclopedia → detail flow
- **Camera motion** — zoom, pan, and focal transitions
- **Overall artistic direction** — immersive, atmospheric, narrative-driven

All content, thematics, and visual assets are original and centered on Chinese tea culture. No content is copied from the reference.

---

## 7. Technical Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18+ |
| **Build Tool** | Vite |
| **Language** | TypeScript (incremental migration; existing code may be JS/JSX) |
| **Animation** | GSAP (GreenSock Animation Platform) |
| **Scroll** | ScrollTrigger (GSAP plugin) + Lenis (smooth scrolling) |
| **Map** | SVG-based interactive map of China |
| **Canvas** | Optional, for particle/fog effects |
| **Routing** | React Router v6 |
| **Styling** | CSS Modules or Tailwind CSS (based on existing project) |
| **State** | React Context + hooks; no external state library unless needed |

---

## 8. Project Constraints

1. **Incremental development only.** Never rebuild the project from scratch.
2. **All existing code is preserved** unless explicitly instructed to remove.
3. **Animations must be consistent** — same easing curves, similar durations, unified rhythm.
4. **Every task targets one specific outcome.** No multi-scope changes in a single task.
5. **The project is a museum, not a CMS.** No admin panels, no user accounts, no e-commerce.
6. **Mobile is secondary.** Desktop-first design. Mobile responsiveness is a later phase.
7. **Current phase is frontend-only.** The active product work is the React/Vite visual experience in `client/`. Backend database tables, CRUD systems, authentication, and admin workflows are deferred unless explicitly reopened by a later task.

---

## 9. Document Map

This file is the root of the Tea Atlas documentation system. Every subsequent document serves a specific role in the development lifecycle:

| Document | Purpose |
|---|---|
| `00-project-overview.md` | High-level project identity, vision, and constraints (this file) |
| `01-product-requirements.md` | Functional and non-functional requirements |
| `02-information-architecture.md` | Content hierarchy, page tree, navigation model |
| `03-site-architecture.md` | URL structure, routing table, data flow between pages |
| `04-ui-design-system.md` | Colors, typography, spacing, textures, components |
| `05-animation-system.md` | Animation principles, GSAP patterns, easing, timing |
| `06-map-system.md` | SVG map architecture, camera states, province interaction |
| `07-tea-content-system.md` | Tea data schema, content types, filtering logic |
| `08-component-specification.md` | Every component: props, states, behavior, accessibility |
| `09-frontend-architecture.md` | Folder structure, module boundaries, data flow |
| `10-development-roadmap.md` | Task-by-task development plan (Task001–Task020+) |
| `11-codex-master-guide.md` | AI coding agent rules: never-delete, incremental, consistency |
| `12-assets-guide.md` | Asset specifications, textures, AI image prompts |
| `13-content-guide.md` | Writing standards, cultural rules, localization, content validation |
| `14-deployment-guide.md` | Build, deploy, CI/CD, Vercel, release process |
| `15-project-rules.md` | Supreme governance, rule priority, AI collaboration, change management |
| `16-qa-testing-guide.md` | Testing standards, quality gates, browser matrix, accessibility |
| `17-contributing-guide.md` | Onboarding, workflow, branch/commit/PR standards |
| `18-maintenance-guide.md` | Ongoing maintenance, monitoring, incidents, knowledge transfer |

---

## 10. Acceptance Criteria

- [ ] All 19 main documents (00–18) exist and are internally consistent
- [ ] Every document references related documents where appropriate
- [ ] No document contains code (React, CSS, TypeScript)
- [ ] Every document uses Github-flavored Markdown
- [ ] Development roadmap contains 20+ discrete, actionable tasks
- [ ] Codex guide contains explicit "never" rules
- [ ] Assets guide contains AI image prompt templates

---

## 11. Notes

- This is a living document system. As the project evolves, documents should be updated to reflect reality.
- The documents are designed to be consumed by AI coding agents (Claude Code, Cursor, Codex). Write for that audience.
- Consistency across documents is critical. A change to the animation system must be reflected in the component spec, the roadmap, and the animation timeline.
- All documents assume the reader has context from this overview. Cross-reference abundantly.

---

> **Next:** `01-product-requirements.md` — Functional and non-functional requirements for the Tea Atlas experience.
