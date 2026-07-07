# 17 — Contributing Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Official Contributor Onboarding & Workflow Specification**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | CNTRB-017 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `15-project-rules.md`, `11-codex-master-guide.md`, `10-development-roadmap.md`, `14-deployment-guide.md`, `16-qa-testing-guide.md` |

---

## 2. Purpose

This document defines **how contributors join, work, and deliver value** in the Tea Atlas project. It is the operational manual for every person and AI agent contributing code, content, assets, or documentation.

| In Scope | Out of Scope |
|---|---|
| Contributor role definitions | Project principles (→ `15-project-rules.md` §3) |
| Repository structure and setup | Task definitions (→ `10-development-roadmap.md`) |
| Development workflow step-by-step | Codex execution rules (→ `11-codex-master-guide.md`) |
| Branch, commit, and PR standards | Deployment procedures (→ `14-deployment-guide.md` §16) |
| Code review checklist | Testing standards (→ `16-qa-testing-guide.md` §4) |
| Contribution rules by type (docs/assets/content) | Design system (→ `04-ui-design-system.md`) |
| Common mistakes and how to avoid them | Content writing standards (→ `13-content-guide.md`) |

---

## 3. Contributor Roles

### 3.1 Role Definitions

| Role | Actor(s) | Scope | Authority | Primary Documents |
|---|---|---|---|---|
| **Project Lead** | xiaoruo | All project decisions | Supreme — can override any rule | `15-project-rules.md` |
| **Documentation AI** | ChatGPT / Claude | Write and maintain `docs/` files | Write documents; cannot approve, deploy, or execute code tasks | `00`–`18` |
| **Task AI** | Codex | Execute tasks from the roadmap | Execute assigned tasks only; cannot create tasks or modify docs | `10-development-roadmap.md`, `11-codex-master-guide.md` |
| **Research AI** | DeepSeek | Research, fact-check, validate content | Advisory only; cannot approve or deploy | `13-content-guide.md` |

### 3.2 Role Boundaries

| Action | Project Lead | Documentation AI | Task AI (Codex) | Research AI |
|---|---|---|---|---|
| Create/update documents | ✅ Approve | ✅ Write | ❌ | ❌ |
| Define tasks | ✅ | ❌ | ❌ | ❌ |
| Execute tasks | ✅ | ❌ | ✅ (assigned only) | ❌ |
| Approve PRs | ✅ | ❌ | ❌ | ❌ |
| Deploy to production | ✅ | ❌ | ❌ | ❌ |
| Modify `15-project-rules.md` | ✅ | ❌ (explicit instruction only) | ❌ | ❌ |
| Change tech stack | ✅ | ❌ | ❌ | ❌ |
| Fact-check content | ✅ | ❌ | ❌ | ✅ Advisory |
| Report ambiguity | — | ✅ STOP + ASK | ✅ STOP + ASK | ✅ STOP + ASK |

### 3.3 Communication Rules

| ID | Rule |
|---|---|
| **COM-R01** | AI agents report completion after each unit of work. Documentation AI: one document. Codex: one task. |
| **COM-R02** | AI agents never chain work. They stop after each unit and wait for human confirmation. |
| **COM-R03** | When unclear, AI agents STOP and ASK. No guessing. No assuming. |
| **COM-R04** | Human provides directional feedback ("continue", "next", "fix X"). AI interprets and acts within its role boundaries. |
| **COM-R05** | All AI output includes source references: which document section, which task field, which data source. |

---

## 4. Repository Structure

### 4.1 Top-Level Layout

```
tea/
├── client/                  ← Frontend SPA (React + Vite + Tailwind + D3)
│   ├── src/
│   │   ├── main.jsx         ← Entry point (ReactDOM + providers + router)
│   │   ├── App.jsx          ← Route definitions
│   │   ├── index.css        ← Global styles + CSS custom properties
│   │   ├── animations/      ← GSAP timeline definitions
│   │   ├── assets/          ← Static assets (GeoJSON, generated maps)
│   │   ├── components/      ← UI components (feature-grouped)
│   │   │   ├── Effects/     ← Ambient visual effects
│   │   │   ├── Map/         ← Map-related components
│   │   │   └── ...
│   │   ├── contexts/        ← React Context providers
│   │   ├── data/            ← Content data files (teas, stories, cultures)
│   │   ├── hooks/           ← Custom React hooks
│   │   ├── services/        ← API client (axios)
│   │   ├── styles/          ← Additional CSS modules
│   │   ├── types/           ← TypeScript type definitions
│   │   └── utils/           ← Utility functions
│   ├── public/              ← Static files copied to dist/
│   │   ├── assets/
│   │   │   ├── textures/    ← Rice paper, terrain
│   │   │   ├── images/      ← Tea illustrations, scenes
│   │   │   ├── map/         ← SVG map
│   │   │   └── fonts/       ← Self-hosted WOFF2 fonts
│   │   └── ...
│   ├── test/
│   │   └── visual-baselines/← Visual regression screenshots
│   ├── e2e/                 ← Playwright E2E tests
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                  ← Backend API (Express)
│   └── ...
│
├── reference/               ← Design references, AI prompts, generated samples
│   └── ...
│
└── .claude/                 ← Claude Code project config (if present)
```

### 4.2 Key Files Every Contributor Must Know

| File | Purpose | Who Touches It |
|---|---|---|
| `docs/15-project-rules.md` | Supreme governance | Project Lead only |
| `docs/10-development-roadmap.md` | All development tasks | Project Lead (defines), Codex (executes) |
| `docs/09-frontend-architecture.md` | Actual code structure and tech stack | All (read); Documentation AI (update when code changes) |
| `docs/07-tea-content-system.md` | Data schemas for tea/story/culture | Content contributors (read), Codex (implement) |
| `docs/12-assets-guide.md` | Asset specifications and AI prompts | Asset contributors (read/generate), Documentation AI (update) |
| `client/src/data/demoTeas.js` | Seed tea data | Codex (modify per tasks) |
| `client/package.json` | Dependencies and scripts | Codex (modify per tasks only) |
| `client/vite.config.js` | Build configuration | Codex (modify per tasks only) |

---

## 5. Getting Started

### 5.1 Prerequisites

| Tool | Minimum Version | Check Command | Required For |
|---|---|---|---|
| **Node.js** | 18.x LTS | `node --version` | All contributors |
| **npm** | 9.x | `npm --version` | All contributors |
| **Git** | 2.40+ | `git --version` | All contributors |
| **GitHub Account** | — | — | PR submission |
| **Chrome** | 90+ | — | Manual testing |
| **Firefox** | 90+ | — | Browser compatibility testing |

### 5.2 Initial Setup

```bash
# 1. Clone the repository
git clone <repo-url> tea-atlas
cd tea-atlas

# 2. Install frontend dependencies
cd client
npm install

# 3. Start development server
npm run dev
# → Opens http://localhost:5173

# 4. Run build to verify everything works
npm run build
# → Output in client/dist/

# 5. Run tests (when test scripts are added)
npm test
```

### 5.3 Environment Setup

```bash
# client/.env — created from .env.example (if template exists)
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
```

> Backend (`server/`) setup is separate. See server README if you need the API running locally.

### 5.4 First-Time Verification

After setup, verify your environment is working:

| Check | Command / Action | Expected Result |
|---|---|---|
| Dev server starts | `npm run dev` | Vite starts on port 5173. No errors in terminal. |
| App loads in browser | Open `http://localhost:5173` | Hero animation plays. Map renders. No console errors. |
| Build succeeds | `npm run build` | Output in `dist/`. No errors. Bundle size report shown. |
| Hot reload works | Edit a component, save | Browser updates without full reload. |

---

## 6. Development Workflow

### 6.1 Task-Based Development

All development follows a strict task-based model:

```
1. PICK TASK
   ├── Human assigns task from 10-development-roadmap.md
   ├── Human tells Codex: "Execute TaskXXX"
   └── Codex reads the task specification fully

2. UNDERSTAND
   ├── Read task: Goal, Current State, Target State, Files to Modify, Constraints
   ├── Read ALL files listed in "Files to Modify"
   ├── Verify "Current State" matches actual code
   └── If mismatch → STOP and report

3. EXECUTE
   ├── One file at a time
   ├── Minimum change to satisfy the task
   ├── Only touch files listed in "Files to Modify"
   └── Respect all constraints

4. VERIFY
   ├── npm run build (must pass)
   ├── Visual check (if component changed)
   └── Run through each Acceptance Criterion

5. REPORT
   ├── Completion report per template in 11-codex-master-guide.md §4.3
   ├── List all files modified
   └── STOP — do not start next task
```

### 6.2 Non-Task Contributions

Some contributions don't go through the task workflow:

| Contribution Type | Workflow | Who |
|---|---|---|
| **New document** | Human asks Documentation AI → AI writes → Human reviews → Approved | Documentation AI + Project Lead |
| **Document update** | Human asks Documentation AI → AI edits → Human reviews → Approved | Documentation AI + Project Lead |
| **Content addition** (tea/story/culture) | Author drafts per `13-content-guide.md` → validation checklist → PR → Human merges | Content contributor + Project Lead |
| **Asset generation** | Generate per `12-assets-guide.md` prompts → quality checklist → PR → Human merges | Asset contributor + Project Lead |
| **Bug fix (non-task)** | Issue → PR → CI → Code review → Human merges | Any developer + Project Lead |

### 6.3 Daily Workflow (AI Agents)

```
Session Start:
  1. Human: "Continue with the next document/task."
  2. AI: Reads progress from tea-atlas-docs-progress.md (memory)
  3. AI: Executes one unit of work
  4. AI: Reports completion + updates progress
  5. AI: STOPS and waits

Session Middle:
  1. Human: provides feedback or says "continue" / "next"
  2. AI: acts on feedback within role boundaries
  3. AI: reports result
  4. AI: STOPS and waits

Session End:
  - Progress saved in tea-atlas-docs-progress.md
  - Next session resumes from the recovery note
```

---

## 7. Branch Strategy

### 7.1 Branch Types

| Branch Type | Pattern | Purpose | Example |
|---|---|---|---|
| **Main** | `main` | Production-ready code. Always deployable. | `main` |
| **Task** | `task/NNN-short-desc` | Codex task execution | `task/001-remove-echarts` |
| **Feature** | `feature/short-desc` | Non-task feature work | `feature/add-search` |
| **Fix** | `fix/short-desc` | Bug fixes | `fix/map-zoom-jitter` |
| **Docs** | `docs/short-desc` | Documentation-only changes | `docs/update-tea-schema` |
| **Content** | `content/short-desc` | Content additions/updates | `content/add-biluochun` |
| **Asset** | `asset/short-desc` | Asset additions/updates | `asset/spring-overlay` |

### 7.2 Branch Rules

| ID | Rule |
|---|---|
| **BRN-R01** | Branch from `main`. Never branch from another feature branch. |
| **BRN-R02** | Branch names are lowercase, hyphen-separated, ASCII only. |
| **BRN-R03** | One branch = one task / one feature / one fix. No omnibus branches. |
| **BRN-R04** | Delete branch after merge. Keep repository clean. |
| **BRN-R05** | Keep branches short-lived. Merge within 1–3 days. Stale branches (>7 days) should be closed or refreshed. |

---

## 8. Commit Message Convention

### 8.1 Commit Format

```
<type>(<scope>): <imperative summary>

[optional body — what and why, not how]

[optional footer — references, breaking changes]
```

### 8.2 Type Values

| Type | Usage | Example |
|---|---|---|
| `task` | Codex task execution | `task(T001): remove echarts dependency` |
| `feat` | New feature (non-task) | `feat(map): add province hover glow` |
| `fix` | Bug fix | `fix(map): prevent double-zoom on rapid click` |
| `docs` | Documentation only | `docs(15): add versioning policy section` |
| `content` | Content data change | `content(tea): add Bi Luo Chun entry` |
| `asset` | Asset addition or update | `asset(spring): add spring color overlay` |
| `style` | Formatting, whitespace (no logic change) | `style(css): sort custom properties alphabetically` |
| `refactor` | Code refactor (no behavior change) | `refactor(utils): extract season helpers` |
| `test` | Test addition or update | `test(map): add province click integration test` |
| `chore` | Build, config, dependencies | `chore(deps): bump vite to 6.0.2` |

### 8.3 Scope Values

| Scope | Applies To |
|---|---|
| `hero` | Hero section components and animations |
| `map` | Map module: TeaMap, province interaction, camera |
| `encyclopedia` | Encyclopedia page, card grid, filters |
| `detail` | Tea detail page components |
| `province` | Province detail page components |
| `timeline` | Tea growth timeline |
| `animation` | `animations/` directory |
| `styles` | CSS, Tailwind config, design tokens |
| `data` | `data/` directory: teas, stories, cultures |
| `utils` | `utils/` directory |
| `build` | Build config, Vite, PostCSS |
| `ci` | CI/CD pipeline |
| `docs` | Documentation files |
| `assets` | Static assets, images, textures, fonts |

### 8.4 Commit Rules

| ID | Rule |
|---|---|
| **CMT-R01** | Summary line uses imperative mood: "add" not "added", "fix" not "fixed." |
| **CMT-R02** | Summary line ≤ 72 characters. |
| **CMT-R03** | Body explains WHAT changed and WHY. Not HOW (the diff shows how). |
| **CMT-R04** | One logical change per commit. Don't mix a bug fix with a refactor. |
| **CMT-R05** | Reference task IDs, issue numbers, or document sections in the body. |
| **CMT-R06** | No commit of generated files, secrets, or environment files (`.gitignore` enforced). |

### 8.5 Examples

```
# ✅ Good
task(T001): remove echarts dependency

Removed echarts from package.json. No component imports it.
Verified build passes with npm run build.
Task T001 complete.

# ✅ Good
fix(map): prevent province click during camera transition

Added `isTransitioning` guard in `handleProvinceClick`.
Rapid clicks during zoom animation now ignored.
Fixes visual glitch where two panels would appear.

# ❌ Bad — passive voice, no context
fixed the map bug

# ❌ Bad — mixed changes
added tea card variant and fixed a typo in the footer
```

---

## 9. Pull Request Requirements

### 9.1 PR Template

```markdown
## Description
<!-- What does this PR do? One paragraph. -->

## Type
- [ ] Task execution (TaskXXX)
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Content / Asset

## Related
- Task: TASK-XXX (if applicable)
- Documents: `XX-something.md` (if doc changes)
- Issues: #XXX (if any)

## Changes
<!-- List key changes — files modified, what changed -->
- `path/to/file1` — what changed
- `path/to/file2` — what changed

## Verification
- [ ] `npm run build` passes
- [ ] No console errors
- [ ] Visual check performed (if component changes)
- [ ] Tests pass (if test infrastructure exists)

## Screenshots
<!-- If visual change: before/after screenshots -->

## Checklist
- [ ] Only touched files in scope
- [ ] No unrelated cleanup or refactoring
- [ ] No new dependencies without approval
- [ ] Commit messages follow convention (§8)
```

### 9.2 PR Rules

| ID | Rule |
|---|---|
| **PR-R01** | Every PR has a description. No description-only PRs with empty body. |
| **PR-R02** | PR title matches the primary commit's summary line. |
| **PR-R03** | One PR = one concern. Don't bundle a task, a bug fix, and a refactor in one PR. |
| **PR-R04** | PRs from Codex reference the task ID in title and body. |
| **PR-R05** | CI must pass before human review. Green build + typecheck + lint + test. |
| **PR-R06** | At least one human review required before merge. |
| **PR-R07** | Documentation-only PRs skip visual verification and screenshot requirements. |
| **PR-R08** | Squash merge to `main`. One squashed commit per PR. |

---

## 10. Code Review Checklist

### 10.1 Reviewer Responsibilities

The reviewer (Project Lead) checks every PR against this checklist.

| ID | Check | What to Look For |
|---|---|---|
| **REV-01** | **Scope compliance** | Only files listed in the task or PR description are modified. No scope creep. |
| **REV-02** | **No unrelated changes** | No cleanup of nearby code. No "while I was here" refactors. No formatting changes to unmodified files. |
| **REV-03** | **Build integrity** | `npm run build` passes. No new warnings introduced. |
| **REV-04** | **Import hygiene** | New imports use relative paths. No path aliases. No unused imports. |
| **REV-05** | **No hardcoded values** | Colors, spacing, z-index use design tokens. No magic numbers. No `#FFF` or `#000`. |
| **REV-06** | **Animation boundaries** | No GSAP/framer-motion in component files. Components only reference ANIM-IDs. |
| **REV-07** | **State boundaries** | No new Context without authorization. State at lowest possible level. |
| **REV-08** | **Accessibility preserved** | No `data-*` or `aria-*` attributes removed. Focus handling intact. |
| **REV-09** | **No dead code** | No commented-out code. No `console.log`. No unused variables. |
| **REV-10** | **Commit quality** | Messages follow convention (§8). One logical change per commit. |
| **REV-11** | **Visual check** | If component changed: does it look right? No layout regression? |
| **REV-12** | **Documentation updated** | If the change affects a documented rule/schema/component, is the relevant doc updated? |

### 10.2 Review Outcome

| Outcome | Meaning | Action |
|---|---|---|
| **Approved** | No issues found. Ready to merge. | Squash merge to `main`. |
| **Changes Requested** | Issues found. Must fix before re-review. | Contributor fixes issues. Re-request review. |
| **Comment** | Suggestions or questions. Not blocking. | Contributor addresses at their discretion. |

---

## 11. Documentation Contribution Rules

### 11.1 Who Contributes Documentation

| Contributor | What They Do | How |
|---|---|---|
| **Documentation AI** | Writes new documents. Updates existing documents. | Human asks → AI writes → Human reviews. One document per turn. |
| **Project Lead** | Reviews, approves, and sets document status. | Approves Draft → Review → Approved transitions. |
| **Codex** | Does NOT modify documents. | Reports discrepancies between docs and code. |

### 11.2 Document Standards

| ID | Rule |
|---|---|
| **DOC-R01** | Every document uses the standard template: Document Info → Content → Constraints → Acceptance Criteria → Dependencies → Risks → Open Questions → Implementation Checklist → Next Document. |
| **DOC-R02** | Rules use globally unique IDs (e.g., `CLR-R01`, `ANIM-020`, `GIT-R01`). No duplicate IDs across documents. |
| **DOC-R03** | Tables preferred over prose. Checklists close every section. |
| **DOC-R04** | No code in documents. Documents describe WHAT and WHY. Tasks describe HOW. |
| **DOC-R05** | Document version updated in §1 on every change. Date set to day of change. |
| **DOC-R06** | When a code change invalidates a document claim, the document is updated in the same PR. |

### 11.3 Documentation Lifecycle

```
Draft → Review → Approved → Active → Superseded → Archived
```

| State | Meaning | Who Can Change |
|---|---|---|
| **Draft** | AI-written, not yet reviewed | Documentation AI |
| **Review** | Submitted for human review | Nobody (locked pending review) |
| **Approved** | Human-approved | Project Lead |
| **Active** | In effect, governs development | Project Lead (via change management) |
| **Superseded** | Replaced by newer version | — (read-only) |
| **Archived** | Historical record | — (read-only) |

---

## 12. Asset Contribution Rules

### 12.1 Who Contributes Assets

| Contributor | What They Do | How |
|---|---|---|
| **Asset contributor** | Generates images/textures using AI prompts from `12-assets-guide.md` | Generate → quality checklist → PR |
| **Documentation AI** | Updates `12-assets-guide.md` with new asset specs | Human asks → AI updates → Human reviews |
| **Codex** | Does NOT generate or modify assets | — |

### 12.2 Asset Standards

| ID | Rule |
|---|---|
| **AST-R01** | Assets follow specifications in `12-assets-guide.md`. No asset outside the inventory. |
| **AST-R02** | File naming follows convention from `12-assets-guide.md` §7. |
| **AST-R03** | Asset passes quality checklist (`12-assets-guide.md` §17.2) before PR. |
| **AST-R04** | Raster images: WebP. Vector: SVG. No JPEG, no PNG (except favicon). |
| **AST-R05** | File size within budget per `12-assets-guide.md` §3.1. |
| **AST-R06** | AI-generated assets use the universal style header from `12-assets-guide.md` §6.2. |
| **AST-R07** | PR includes both the asset file and an update to `12-assets-guide.md` if it's a new asset ID. |

### 12.3 Asset Directory Placement

| Asset Type | Directory | Document Reference |
|---|---|---|
| Textures | `client/public/assets/textures/` | `12-assets-guide.md` §16 |
| Images (tea, scenes, provinces) | `client/public/assets/images/` | `12-assets-guide.md` §16 |
| Map SVGs | `client/public/assets/map/` | `12-assets-guide.md` §16 |
| Icons | `client/public/assets/icons/` | `04-ui-design-system.md` §14 |
| Fonts | `client/public/assets/fonts/` | `12-assets-guide.md` §16 |
| Logo | `client/public/assets/logo/` | `12-assets-guide.md` §16 |

---

## 13. Content Contribution Rules

### 13.1 Who Contributes Content

| Contributor | What They Do | How |
|---|---|---|
| **Content contributor** | Authors tea profiles, stories, cultural topics | Research → draft per `13-content-guide.md` → validation checklist → PR |
| **Research AI** | Fact-checks historical and cultural claims | Advisory: verifies claims against Tier 1–2 sources |
| **Project Lead** | Final authority on cultural accuracy | Reviews all content PRs |
| **Codex** | Does NOT author content | — |

### 13.2 Content Standards

| ID | Rule |
|---|---|
| **CON-R01** | Content follows schemas in `07-tea-content-system.md`. No field outside the schema. |
| **CON-R02** | Prose follows writing standards in `13-content-guide.md` §9. |
| **CON-R03** | Content passes validation checklist (`13-content-guide.md` §12) before PR. |
| **CON-R04** | Cultural claims are verifiable. Source cited. Tier 1–2 sources only. |
| **CON-R05** | English is the source language. Chinese translation is required for all content entities. |
| **CON-R06** | Tea IDs are immutable after v1 launch. Choose carefully. |
| **CON-R07** | A new tea entry includes: all P0 fields, hero image, thumbnail image, flavor profile, origin story, brewing guide. |

---

## 14. Testing Before Merge

### 14.1 Automated Checks (CI)

Every PR triggers these checks automatically:

| Check | What It Verifies | Blocks Merge? |
|---|---|---|
| **Build** (`npm run build`) | Vite build succeeds. No errors. | ✅ Yes |
| **TypeCheck** (`tsc --noEmit`) | TypeScript types are valid. No `any` escapes. | ✅ Yes (when TS infra exists) |
| **Lint** | Code style conventions. No unused vars. | ✅ Yes (when linting infra exists) |
| **Test** (`npm test`) | Unit + integration tests pass. | ✅ Yes (when test infra exists) |
| **Audit** (`npm audit`) | No high/critical vulnerabilities. | ✅ Yes |

### 14.2 Manual Checks (Contributor)

Before requesting review:

| Check | Action | Pass Criteria |
|---|---|---|
| **Dev server** | `npm run dev` → open browser | App loads. No console errors. |
| **Critical paths** | Navigate hero → map → encyclopedia → tea detail | All render correctly. No blank pages. |
| **No regression** | Compare against `main` branch behavior | No new visual glitches or broken interactions. |
| **Commit quality** | Review own commits | Messages follow convention. One concern per commit. |

### 14.3 Testing Rules

| ID | Rule |
|---|---|
| **TST-R01** | CI must be green before requesting human review. |
| **TST-R02** | Manual smoke test of critical paths required for all code PRs. |
| **TST-R03** | Documentation-only PRs skip manual smoke test. |
| **TST-R04** | If a PR fails CI, contributor fixes before re-requesting review. |

---

## 15. Common Mistakes

### 15.1 By AI Agents (Codex)

| Mistake | Why It Happens | How to Prevent |
|---|---|---|
| **Scope creep** | "While I'm here, I'll also fix..." | Read `Files to Modify`. Touch ONLY those files. |
| **Task chaining** | "Task N is done, let me start Task N+1" | STOP after reporting. Wait for human. |
| **Undocumented changes** | Changing a file not in the task's scope | If discovery requires touching another file, STOP and report. |
| **Style "improvements"** | Refactoring code that works | "Additive-first" (PR-05). No cleanup unless tasked. |
| **Guessing** | Task is ambiguous, but AI proceeds anyway | STOP and ASK. PR-02. |
| **Import cascade** | Moving one function updates imports in 6 files | COND-02: if >3 files affected, ask first. |
| **Unverified completion** | "Build probably passes" | VERIFY. `npm run build`. Always. |

### 15.2 By Documentation AI

| Mistake | Why It Happens | How to Prevent |
|---|---|---|
| **Duplicating content** | Writing rules already in another document | Check related documents before writing. Reference, don't repeat. |
| **Writing implementation** | Mixing HOW into a WHAT/WHY document | "No code in documents" (DOC-R04). |
| **Inconsistent rule IDs** | Inventing IDs that overlap with existing ones | Check existing ID prefixes in `15-project-rules.md` and other docs. |
| **Missing Acceptance Criteria** | Writing prose without verifiable checkboxes | Every document ends with checkable AC items. |
| **Chaining documents** | Writing doc N+1 before human confirms doc N | One document per turn. STOP and wait. |

### 15.3 By Human Contributors

| Mistake | Why It Happens | How to Prevent |
|---|---|---|
| **Skipping review** | "It's a small change" | All PRs reviewed. No exceptions. PR-R06. |
| **Merging with failing CI** | "The failure is unrelated" | GTE-R01: CI green required. Fix or document the bypass. |
| **Direct push to main** | "It's just a typo" | Git-R05: all changes via PR + CI + review. |
| **Unspecified task** | "Just add X feature" without a task document | DEV-03: all work follows tasks from the roadmap. |
| **Mixing concerns** | "While I'm adding X, let me also fix Y" | PR-R03: one PR = one concern. |

---

## 16. Contribution Checklist

### 16.1 Before Starting

- [ ] I understand my role and its boundaries (§3)
- [ ] I have read the relevant documents for my contribution type
- [ ] My environment is set up and verified (§5.4)
- [ ] I am working from a branch off `main` (§7)
- [ ] I have a clear task, issue, or specification to work from

### 16.2 During Work

- [ ] I am making the minimum change necessary
- [ ] I am not touching files outside my scope
- [ ] I am not mixing unrelated changes
- [ ] I am using design tokens, not hardcoded values
- [ ] I am referencing ANIM-IDs, not writing inline animations
- [ ] I am following commit message conventions (§8)

### 16.3 Before PR

- [ ] `npm run build` passes
- [ ] Manual smoke test of critical paths complete (§14.2)
- [ ] All commits are clean (no WIP, no debug code, no console.log)
- [ ] PR description complete using template (§9.1)
- [ ] If visual change: screenshots attached
- [ ] If document change: version and date updated
- [ ] If content change: validation checklist passed (`13-content-guide.md` §12)
- [ ] If asset change: quality checklist passed (`12-assets-guide.md` §17.2)

### 16.4 After Merge

- [ ] Branch deleted
- [ ] Deployment verified (if auto-deploy is configured)
- [ ] Related tasks marked complete (if applicable)
- [ ] Progress updated in `tea-atlas-docs-progress.md` (if doc was created)

---

## 17. References

| Document | Relationship |
|---|---|
| `15-project-rules.md` | Supreme governance — all contribution rules derive from this |
| `10-development-roadmap.md` | Task definitions — what Codex executes |
| `11-codex-master-guide.md` | Codex execution rules — how Codex executes tasks |
| `09-frontend-architecture.md` | Code structure — what files exist and where |
| `07-tea-content-system.md` | Content schemas — structure for content contributions |
| `12-assets-guide.md` | Asset specifications — standards for asset contributions |
| `13-content-guide.md` | Writing standards — how to write content |
| `14-deployment-guide.md` | CI/CD pipeline — what runs on PR and merge |
| `16-qa-testing-guide.md` | Testing standards — what tests to run and how |
| `18-maintenance-guide.md` | Ongoing maintenance and operations |

---

## 18. Next Document

> **`18-maintenance-guide.md`** — Ongoing maintenance procedures, dependency updates, content refresh cycles, performance monitoring, incident response, and long-term project stewardship.

---

> This document is the on-ramp to Tea Atlas. Every contributor — human or AI — starts here. It defines who does what, how work flows, and what quality looks like. When someone doesn't know the process, this document tells them. When something goes wrong in the workflow, this document is updated so it doesn't happen again.
