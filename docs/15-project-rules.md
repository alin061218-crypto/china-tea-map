# 15 — Project Rules

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Supreme Governance Document — All Other Documents Are Subordinate**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | GOV-015 |
| **Version** | 1.0 |
| **Status** | Active |
| **Last Updated** | 2026-07-05 |
| **Supersedes** | All other documents when rules conflict (see §19) |
| **Superseded By** | Explicit user instructions only |
| **Related Documents** | All documents 00–14 |

---

## 2. Purpose

This document is the **constitution of Tea Atlas**. It defines:

| Defines | Does NOT Define |
|---|---|
| Immutable project principles | Detailed implementation rules (→ specialized docs) |
| Development philosophy | Task sequences (→ `10-development-roadmap.md`) |
| Rule authority and conflict resolution | Component behavior (→ `08-component-specification.md`) |
| Contributor roles and responsibilities | Animation parameters (→ `05-animation-system.md`) |
| Change management process | Content writing style (→ `13-content-guide.md`) |
| AI collaboration boundaries | Deployment procedures (→ `14-deployment-guide.md`) |
| Documentation governance | Data schemas (→ `07-tea-content-system.md`) |

> **Scope:** Every document, every commit, every task, every AI agent, every human contributor. No exceptions.

---

## 3. Project Principles

These principles are **immutable**. They cannot be overridden by any other document, any task, or any agent.

| ID | Principle | Description |
|---|---|---|
| **P0-PR-001** | **Museum, Not Dashboard** | Every interaction evokes a museum gallery — slow, contemplative, respectful. No instant jumps. No data-dense tables. No utilitarian layouts. |
| **P0-PR-002** | **Atmosphere First** | Visual mood and emotional resonance take precedence over information density. Users feel before they read. |
| **P0-PR-003** | **Ink-Wash Aesthetic** | All visuals derive from Chinese ink painting. No neon, no high saturation, no glass-morphism, no 3D realism. |
| **P0-PR-004** | **Progressive Discovery** | Information unfolds as users engage. Nothing is dumped. No walls of text. No tables of raw data. |
| **P0-PR-005** | **Chinese Tea Culture Authenticity** | Every cultural claim is verifiable. No fabricated history. No orientalist framing. Respect over exoticism. |
| **P0-PR-006** | **Code is Ephemeral, Content is Eternal** | Code can be refactored. The tea data, stories, and cultural content must be correct on day one and remain correct. |
| **P0-PR-007** | **Minimum Change, Maximum Effect** | Every modification is the smallest possible change to satisfy its purpose. No cleanup piggybacking. No refactoring while adding features. |
| **P0-PR-008** | **One Source of Truth** | Every fact has exactly one canonical home. Colors in `04-ui-design-system.md`. Animations in `05-animation-system.md`. Tea data in `07-tea-content-system.md`. Nothing defined in two places. |

---

## 4. Development Philosophy

### 4.1 Core Tenets

| ID | Tenet |
|---|---|
| **DEV-01** | **Ship incrementally.** A working partial feature is better than a broken complete feature. |
| **DEV-02** | **Document before code.** Features are specified in docs/ before a single line of code is written. |
| **DEV-03** | **Task-based execution.** All development follows tasks defined in `10-development-roadmap.md`. No ad-hoc work. |
| **DEV-04** | **Verify, then proceed.** Every task is verified complete before the next task begins. No chaining. |
| **DEV-05** | **Preserve the existing.** Modify in-place. Never delete unless instructed. Never rename unless instructed. |
| **DEV-06** | **Desktop-first.** The project targets desktop browsers (≥1280px). Mobile responsiveness is deferred to Phase 2. |

### 4.2 What We Never Do

| ID | Prohibition |
|---|---|
| **NEV-01** | Never add a dependency without explicit justification in a task specification |
| **NEV-02** | Never restructure the directory tree without explicit task authorization |
| **NEV-03** | Never change the technology stack (React, Vite, Tailwind, D3) |
| **NEV-04** | Never modify `main.jsx` provider order or root configuration |
| **NEV-05** | Never add a new route without a corresponding document update |
| **NEV-06** | Never commit generated files (`dist/`, `node_modules/`) |
| **NEV-07** | Never commit secrets, API keys, or environment variables |

---

## 5. Documentation Rules

### 5.1 Document Hierarchy

```
15-project-rules.md          ← SUPREME (this document)
    │
    ├── 00-project-overview.md
    ├── 01-product-requirements.md
    ├── 02-information-architecture.md
    ├── 03-site-architecture.md
    ├── 04-ui-design-system.md
    ├── 05-animation-system.md
    ├── 06-map-system.md
    ├── 07-tea-content-system.md
    ├── 08-component-specification.md
    ├── 09-frontend-architecture.md
    ├── 10-development-roadmap.md
    ├── 11-codex-master-guide.md
    ├── 12-assets-guide.md
    ├── 13-content-guide.md
    ├── 14-deployment-guide.md
    ├── 16-qa-testing-guide.md
    ├── 17-contributing-guide.md
    └── 18-maintenance-guide.md
```

### 5.2 Documentation Standards

| ID | Rule |
|---|---|
| **DOC-R01** | Every document has a unique Document ID (e.g., `GOV-015`, `PRD-001`) |
| **DOC-R02** | Every section that defines rules uses globally unique rule IDs (e.g., `CLR-R01`, `ANIM-020`, `DATA-C01`) |
| **DOC-R03** | Rule IDs are never reused, even if the rule is deleted |
| **DOC-R04** | All documents use the standard template: Document Information → Content → Constraints → Acceptance Criteria → Dependencies → Risks → Open Questions → References → Implementation Checklist → Next Document |
| **DOC-R05** | Tables preferred over prose. Checklists close every document. |
| **DOC-R06** | Documents describe WHAT and WHY. They never describe HOW (that's what tasks are for). |
| **DOC-R07** | Documents are living. When code changes, the relevant document is updated in the same PR. |
| **DOC-R08** | Every document references its dependencies. Every document is referenced by its dependents. No orphan documents. |
| **DOC-R09** | AI generates documents. Human reviews and approves. Neither deploys code without the other. |

### 5.3 Document Lifecycle

```
Draft → Review → Approved → Active → Superseded → Archived
```

| State | Meaning | Who Can Change |
|---|---|---|
| **Draft** | Work in progress, not yet approved | AI (author) |
| **Review** | Submitted for human review | Human (reviewer) |
| **Approved** | Human-approved, ready for implementation | Human |
| **Active** | In effect, governing active development | Human (via change management) |
| **Superseded** | Replaced by a newer version | — (read-only) |
| **Archived** | Historical record only | — (read-only) |

---

## 6. Architecture Rules

| ID | Rule | Authority |
|---|---|---|
| **ARC-R01** | The six-layer architecture defined in `03-site-architecture.md` is the canonical structure. Layers may not be added, removed, or merged. | → `03-site-architecture.md` |
| **ARC-R02** | The tech stack (React 18 + Vite 6 + Tailwind 3 + D3 7) is locked. Changes require a new document version and explicit human approval. | → `09-frontend-architecture.md` |
| **ARC-R03** | The directory structure defined in `09-frontend-architecture.md` §4 is canonical. New directories require document update. | → `09-frontend-architecture.md` |
| **ARC-R04** | Separation of concerns: Components own UI. Animation files own motion. Data files own content. No layer crossing. | → `03-site-architecture.md` |
| **ARC-R05** | The frontend (`client/`) and backend (`server/`) are deployed independently. They share no code, no types, no config. | → `14-deployment-guide.md` |

---

## 7. Coding Rules

| ID | Rule | Authority |
|---|---|---|
| **COD-R01** | All production code is JavaScript (JSX) or TypeScript. No CoffeeScript, no ReasonML, no Elm. | — |
| **COD-R02** | New files default to TypeScript (`.ts` / `.tsx`). Existing `.js`/`.jsx` files are migrated only when a task explicitly requires it. | → `11-codex-master-guide.md` |
| **COD-R03** | Imports use relative paths. No path aliases unless explicitly configured by a task. | → `11-codex-master-guide.md` |
| **COD-R04** | Component files export one primary component. Named exports only for utilities, types, and constants. | → `08-component-specification.md` |
| **COD-R05** | Console logs, debug statements, and commented-out code are removed before merge. | — |
| **COD-R06** | No `any` type in TypeScript files. Use `unknown` and narrow. | — |
| **COD-R07** | Build output (`dist/`) is gitignored. Never committed. | → `14-deployment-guide.md` |
| **COD-R08** | All code changes go through tasks defined in `10-development-roadmap.md`. No off-roadmap coding. | → `10-development-roadmap.md` |
| **COD-R09** | ESLint and Prettier config (if added) are project-level, not per-editor. | — |

---

## 8. Component Rules

| ID | Rule | Authority |
|---|---|---|
| **CMP-R01** | Every component is specified in `08-component-specification.md` before implementation. | → `08-component-specification.md` |
| **CMP-R02** | Components consume design tokens from `04-ui-design-system.md`. No hardcoded colors, spacing, or z-index values. | → `04-ui-design-system.md` |
| **CMP-R03** | Components reference ANIM-IDs from `05-animation-system.md`. No component defines its own animation. | → `05-animation-system.md` |
| **CMP-R04** | All interactive components handle: Default, Hover, Focus, Disabled. See state matrix in `04-ui-design-system.md` §12. | → `04-ui-design-system.md` |
| **CMP-R05** | New components must have an entry in `08-component-specification.md` before code is written. | → `08-component-specification.md` |
| **CMP-R06** | Components are feature-grouped, not type-grouped. No `components/buttons/`, `components/cards/` directories. | → `03-site-architecture.md` |

---

## 9. State Management Rules

| ID | Rule | Authority |
|---|---|---|
| **STA-R01** | State lives as low as possible. Component-local `useState` is the default. | — |
| **STA-R02** | Lift state to `MapPage` when multiple siblings need it. Do not create a new Context without explicit authorization. | → `11-codex-master-guide.md` |
| **STA-R03** | The provider hierarchy in `main.jsx` is immutable without a task + document update. | → `09-frontend-architecture.md` |
| **STA-R04** | No external state libraries (Redux, Zustand, Jotai). React built-in hooks only. | — |
| **STA-R05** | State shape must match the data schema in `07-tea-content-system.md`. No ad-hoc state structures that mirror data. | → `07-tea-content-system.md` |
| **STA-R06** | URL state (query params, path params) is the source of truth for navigation and filters. Component state is derived. | — |

---

## 10. Styling Rules

| ID | Rule | Authority |
|---|---|---|
| **STY-R01** | All styling uses Tailwind utility classes. Custom CSS only in `index.css` for Tailwind-inaccessible properties. | → `09-frontend-architecture.md` |
| **STY-R02** | Design tokens are CSS custom properties on `:root`. Component styles reference tokens, not raw values. | → `04-ui-design-system.md` |
| **STY-R03** | No inline `style` props except for dynamically computed values (e.g., `transform` from JS). | → `04-ui-design-system.md` |
| **STY-R04** | Colors: no `#FFFFFF`, no `#000000`. Use design tokens exclusively. | → `04-ui-design-system.md` §8 |
| **STY-R05** | Z-index values come from the layer system in `04-ui-design-system.md` §13. No ad-hoc z-index. | → `04-ui-design-system.md` |
| **STY-R06** | Responsive breakpoints follow `04-ui-design-system.md` §16. Desktop-first. Mobile is Phase 2. | → `04-ui-design-system.md` |

---

## 11. Animation Rules

| ID | Rule | Authority |
|---|---|---|
| **ANI-R01** | All animation code lives in `animations/`. Zero exceptions. | → `05-animation-system.md` |
| **ANI-R02** | Components reference ANIM-IDs. They never import GSAP, framer-motion, or Three.js animation utilities directly. | → `05-animation-system.md` |
| **ANI-R03** | All animations decompose into motion primitives (MP-01 through MP-10). | → `05-animation-system.md` §3 |
| **ANI-R04** | No animation exceeds 2000ms for timed animations. Scroll-driven animations use scrub. | → `05-animation-system.md` |
| **ANI-R05** | GSAP timelines must be killed on component unmount. No animation memory leaks. | → `05-animation-system.md` |
| **ANI-R06** | `prefers-reduced-motion` disables non-essential animations. | → `05-animation-system.md` §10.3 |

---

## 12. Asset Rules

| ID | Rule | Authority |
|---|---|---|
| **AST-R01** | All visual assets are specified in `12-assets-guide.md` before generation. | → `12-assets-guide.md` |
| **AST-R02** | Raster images: WebP format. Vector graphics: SVG format. No JPEG, no PNG (except favicon). | → `12-assets-guide.md` §8 |
| **AST-R03** | No asset exceeds 512KB. Assets that exceed are split or compressed. | → `12-assets-guide.md` §10 |
| **AST-R04** | All AI-generated images use the universal style header + negative prompt from `12-assets-guide.md` §6. | → `12-assets-guide.md` |
| **AST-R05** | No text in AI-generated images. All text is CSS/HTML. | → `12-assets-guide.md` |
| **AST-R06** | Fonts are self-hosted in WOFF2 format. No Google Fonts CDN. | → `12-assets-guide.md` §16 |

---

## 13. Content Rules

| ID | Rule | Authority |
|---|---|---|
| **CON-R01** | All tea data follows schemas in `07-tea-content-system.md`. No field outside the schema. No schema-circumventing data. | → `07-tea-content-system.md` |
| **CON-R02** | All prose follows the writing standards in `13-content-guide.md` §9. | → `13-content-guide.md` |
| **CON-R03** | Cultural claims must be verifiable against Tier 1–2 sources (see `13-content-guide.md` §3.3). No fabricated history. | → `13-content-guide.md` |
| **CON-R04** | English is the source language. Chinese is a translation. Both are required for all content entities. | → `13-content-guide.md` §8 |
| **CON-R05** | Content validation checklist (`13-content-guide.md` §12) must pass before any content is merged. | → `13-content-guide.md` |
| **CON-R06** | Tea entity IDs are immutable after v1 launch. | → `07-tea-content-system.md` |

---

## 14. Git & Branch Rules

| ID | Rule |
|---|---|
| **GIT-R01** | `main` branch is always deployable. Broken builds on `main` are a P0 incident. |
| **GIT-R02** | Feature branches branch from `main`. Naming: `task/NNN-short-description` or `fix/short-description`. |
| **GIT-R03** | Commits are atomic. One logical change per commit. Messages are imperative: "Add Longjing flavor profile" not "Added Longjing flavor profile." |
| **GIT-R04** | Squash merge to `main`. One PR = one squashed commit. |
| **GIT-R05** | No direct pushes to `main`. All changes go through PR + CI + review. |
| **GIT-R06** | PRs must pass CI (build + typecheck + audit) before review. |
| **GIT-R07** | Generated files, environment files, and secrets are in `.gitignore`. Never committed. |

---

## 15. AI Collaboration Rules

### 15.1 Role Definitions

| Role | Actor | Responsibilities | Authority |
|---|---|---|---|
| **Human** | xiaoruo (Technical Lead) | Final decision-maker. Reviews all AI outputs. Approves documents and tasks. Defines project direction. | Supreme — can override any rule, any AI output. |
| **Documentation AI** | ChatGPT / Claude | Writes documentation (docs/). Follows document templates. Outputs one document per session turn. Stops after each document for human review. | Writes — cannot approve. Cannot deploy. Cannot execute tasks. |
| **Task AI** | Codex | Executes development tasks from `10-development-roadmap.md`. Follows `11-codex-master-guide.md`. Reports after each task. | Executes assigned tasks only. Cannot create new tasks. Cannot modify documents. |
| **Research AI** | DeepSeek | Assists with research, verification, and content validation. Supports Documentation AI and Human with fact-checking. | Advisory only. Cannot approve. Cannot deploy. |

### 15.2 AI Collaboration Rules

| ID | Rule |
|---|---|
| **AI-R01** | Human reviews all AI-generated documents before they become Active. No document enters Active state without human approval. |
| **AI-R02** | Documentation AI writes ONE document per turn. Stops. Waits for human confirmation before proceeding. |
| **AI-R03** | Codex executes ONE task per turn. Reports completion. Stops. Never chains tasks. |
| **AI-R04** | AI agents never modify `15-project-rules.md`. Changes to this document require explicit human instruction. |
| **AI-R05** | AI agents never modify the technology stack or architecture without explicit human instruction. |
| **AI-R06** | AI agents report ambiguity — they never guess. If a task or instruction is unclear, STOP and ASK. |
| **AI-R07** | AI agents never deploy to production. Deployment is human-authorized only. |
| **AI-R08** | AI agents cite their sources. For content: which tier and reference. For code: which document section authorized the change. |
| **AI-R09** | Documentation AI writes all docs in the same session. Memory persists across sessions via `tea-atlas-docs-progress.md`. |
| **AI-R10** | If an AI agent detects a rule conflict, it reports the conflict and stops. It does not choose which rule to follow. |

### 15.3 AI Output Standards

| ID | Standard |
|---|---|
| **AI-OUT-01** | Documentation output follows the standard template (Document Information → Content → Constraints → Acceptance Criteria → Dependencies → Risks → Open Questions → Implementation Checklist → Next Document). |
| **AI-OUT-02** | Task execution reports follow the template in `11-codex-master-guide.md` §4.3. |
| **AI-OUT-03** | All output is in English. Chinese terms use correct characters. |
| **AI-OUT-04** | Tables preferred over prose. Data over adjectives. Checklists close every output. |

---

## 16. Human Review Rules

| ID | Rule |
|---|---|
| **REV-R01** | Human reviews every document before it moves from Draft → Approved. |
| **REV-R02** | Human reviews every PR before it merges to `main`. |
| **REV-R03** | Human approves every production deployment. No auto-deploy without human OK (staging/preview auto-deploy is acceptable). |
| **REV-R04** | Human is the final authority on cultural accuracy. If an AI-generated cultural claim seems questionable, the human decision is final. |
| **REV-R05** | Human defines task priorities (P0/P1/P2). AI may recommend; human decides. |
| **REV-R06** | Human conducts the production smoke test after deployment (see `14-deployment-guide.md` §16.3). |

---

## 17. Change Management

### 17.1 Change Process

```
1. PROPOSE
   ├── Identify the change (document update, new feature, bug fix, refactor)
   ├── Determine which documents/tasks are affected
   └── Create a proposal (can be a conversation with Documentation AI)

2. SPECIFY
   ├── Update affected documents (Documentation AI)
   ├── Add/modify tasks in 10-development-roadmap.md (Human approves)
   └── Update document version numbers

3. APPROVE
   ├── Human reviews all document changes
   ├── Human approves task specifications
   └── Documents move from Review → Approved

4. IMPLEMENT
   ├── Codex executes tasks one by one (→ 11-codex-master-guide.md)
   ├── Human reviews each task completion
   └── Human runs verification

5. CLOSE
   ├── All acceptance criteria verified
   ├── Build passes
   ├── Documents marked Active
   └── Change recorded in changelog (→ 14-deployment-guide.md §16.4)
```

### 17.2 Change Impact Analysis

| Change Type | Documents to Check | Example |
|---|---|---|
| New component | `03`, `04`, `08`, `09` | Adding TeaCard variant |
| New data field | `07`, `08`, `09`, `13` | Adding harvestSeason to Tea schema |
| New animation | `04`, `05`, `08`, `13` | Adding province pin drop animation |
| New dependency | `09`, `10`, `14` | Adding react-query |
| Style change | `04`, `08`, `12` | Changing color tokens |
| Content change | `07`, `13` | Adding a tea entry |
| Build/deploy change | `09`, `14` | Changing Vite config |

---

## 18. Versioning Policy

### 18.1 Document Versioning

| Change | Version Bump | Example |
|---|---|---|
| Typo fix, formatting, clarification | 1.0 → 1.0.1 (patch) | "Fixed table alignment in §5" |
| New section, new rules, expanded scope | 1.0 → 1.1 (minor) | "Added §14: Mobile Responsiveness" |
| Breaking change to rules, architecture, or principles | 1.0 → 2.0 (major) | "Switched from Vite to Next.js" |

### 18.2 Project Versioning

Project version matches the `version` field in `client/package.json`.

| Version Bump | Criteria |
|---|---|
| **Patch** (1.0.0 → 1.0.1) | Bug fixes, content corrections, typo fixes, minor asset updates. No new features. |
| **Minor** (1.0.0 → 1.1.0) | New tea entries, new province pages, new scenes, new features. Backward compatible. |
| **Major** (1.0.0 → 2.0.0) | Architecture changes, breaking URL changes, tech stack migration, complete redesign. Human decision only. |

### 18.3 Document Version Tracking

| ID | Rule |
|---|---|
| **VER-R01** | Every document version change updates the `Last Updated` date and `Version` field in §1. |
| **VER-R02** | Major document version changes are recorded in the project changelog. |
| **VER-R03** | This document (`15-project-rules.md`) starts at 1.0 and is expected to stay at 1.x for the project lifetime. |

---

## 19. Rule Priority & Conflict Resolution

### 19.1 Authority Hierarchy

```
Level 0: Explicit Human Instructions     ← SUPREME — overrides everything
    │
Level 1: 15-project-rules.md             ← Project governance
    │
Level 2: 00-project-overview.md          ← Project identity + design philosophy
    │
Level 3: Domain-Specific Documents       ← 01–14 (peer level — see §19.2)
    │
Level 4: AI Agent Judgement              ← Only when no rule covers the situation
```

### 19.2 Domain Document Precedence

When two domain documents conflict on a specific issue, the more specialized document wins for that issue:

| Issue Domain | Primary Authority | Secondary (if primary is silent) |
|---|---|---|
| Visual design (colors, spacing, typography) | `04-ui-design-system.md` | `03-site-architecture.md` |
| Animation behavior | `05-animation-system.md` | `04-ui-design-system.md` §15 |
| Map behavior | `06-map-system.md` | `05-animation-system.md` §5.2.4 |
| Data schemas | `07-tea-content-system.md` | `02-information-architecture.md` |
| Component props and states | `08-component-specification.md` | `04-ui-design-system.md` §11–12 |
| Code structure and imports | `09-frontend-architecture.md` | `03-site-architecture.md` |
| Task execution | `10-development-roadmap.md` | `11-codex-master-guide.md` |
| Asset specifications | `12-assets-guide.md` | `04-ui-design-system.md` |
| Content writing | `13-content-guide.md` | `07-tea-content-system.md` |
| Deployment | `14-deployment-guide.md` | `09-frontend-architecture.md` |

### 19.3 Conflict Resolution Protocol

```
1. IDENTIFY
   ├── Two rules appear to require different actions
   └── Note both rule IDs and their source documents

2. CHECK HIERARCHY
   ├── If one rule is from a higher-level document → higher level wins
   ├── If same level → more specialized document wins for that domain
   └── If same document → higher-numbered rule wins (later rule = deliberate override)

3. RESOLVE
   ├── AI reports the conflict to Human with both rules cited
   ├── AI does NOT choose which rule to follow
   ├── Human resolves the conflict
   └── The losing rule is updated or deprecated in its source document

4. RECORD
   ├── Document the resolution in the affected documents
   └── No silent overrides — every conflict leaves a paper trail
```

### 19.4 Conflicting Rule Resolution Table

| If this rule... | Conflicts with this rule... | Resolution |
|---|---|---|
| P0-PR-* (project principle) | Any other rule | P0-PR-* wins. Project principles are immutable. |
| Any rule in this document (§4–§18) | Any rule in 00–14 | This document wins. |
| Domain document rule | Another domain document rule | Specialized document wins for its domain. |
| AI agent's judgement | Any documented rule | Documented rule wins. AI judgement is Level 4. |
| Human instruction | Any documented rule | Human instruction wins. Update the rule afterward. |

---

## 20. Acceptance Criteria

- [ ] 8 immutable project principles defined (P0-PR-001 through P0-PR-008)
- [ ] Development philosophy: 6 tenets + 7 prohibitions
- [ ] Documentation hierarchy established (this document at top)
- [ ] 9 documentation rules (DOC-R01 through DOC-R09)
- [ ] Document lifecycle: 6 states with change authority
- [ ] Architecture rules: 5 rules referencing 03, 09, 14
- [ ] Coding rules: 9 rules referencing 08, 09, 10, 11
- [ ] Component rules: 6 rules referencing 03, 04, 05, 08
- [ ] State management rules: 6 rules referencing 07, 09, 11
- [ ] Styling rules: 6 rules referencing 04, 09
- [ ] Animation rules: 6 rules referencing 05
- [ ] Asset rules: 6 rules referencing 12
- [ ] Content rules: 6 rules referencing 07, 13
- [ ] Git rules: 7 rules for branch, commit, PR, merge
- [ ] AI collaboration: 4 roles defined with responsibilities + 10 rules + 4 output standards
- [ ] Human review: 6 rules
- [ ] Change management: 5-step process + impact analysis table
- [ ] Versioning: document versioning (semver) + project versioning (semver) + 3 tracking rules
- [ ] Rule priority: 4-level hierarchy + domain document precedence table + 4-step conflict protocol
- [ ] All rule IDs (P0-PR-*, DEV-*, NEV-*, DOC-R*, ARC-R*, COD-R*, CMP-R*, STA-R*, STY-R*, ANI-R*, AST-R*, CON-R*, GIT-R*, AI-R*, REV-R*, VER-R*) are globally unique and verifiable
- [ ] No rule duplicated from another document — all references point to source documents
- [ ] Document is technology-independent where possible (only ARC-R02 names specific technologies)
- [ ] Human, ChatGPT/Claude, DeepSeek, and Codex roles and boundaries are clear

---

## 21. References

| Document | Relationship |
|---|---|
| `00-project-overview.md` | Project identity and design philosophy — Level 2 authority |
| `01-product-requirements.md` | Functional and non-functional requirements |
| `02-information-architecture.md` | Terminology, content hierarchy, navigation |
| `03-site-architecture.md` | Six-layer architecture, component ownership |
| `04-ui-design-system.md` | Design tokens, component library, state matrix |
| `05-animation-system.md` | Motion primitives, ANIM-ID catalog, scroll system |
| `06-map-system.md` | Map architecture, camera, province interactions |
| `07-tea-content-system.md` | Tea/Story/Culture schemas, enums, data files |
| `08-component-specification.md` | Component props, states, behavior |
| `09-frontend-architecture.md` | Actual code structure, tech stack, imports |
| `10-development-roadmap.md` | Task definitions, dependencies, priorities |
| `11-codex-master-guide.md` | AI agent execution rules (Codex-specific) |
| `12-assets-guide.md` | Asset inventory, AI prompts, file conventions |
| `13-content-guide.md` | Writing standards, cultural rules, localization |
| `14-deployment-guide.md` | Build, deploy, CI/CD, release process |

---

> **This document is the constitution of Tea Atlas. It stands above every other document, every line of code, and every AI agent. It changes rarely, and only by human hand. When rules conflict, this document decides. When ambiguity arises, this document clarifies. When an agent does not know what to do, this document tells it to stop and ask.**
>
> **The project lives by these rules. There are no exceptions.**
