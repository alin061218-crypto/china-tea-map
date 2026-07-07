# 11 — Codex Master Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **AI Agent Execution Rulebook — NOT a Design Document**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | CODEX-011 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `10-development-roadmap.md`, `09-frontend-architecture.md`, `15-project-rules.md` |

---

## 2. Core Mandate

> **Codex is a scalpel, not a bulldozer. Every modification must be the minimum necessary change to satisfy one task.**

### 2.1 The Prime Directive

```
NEVER delete unless explicitly instructed.
NEVER rename unless explicitly instructed.
NEVER rebuild the project.
ALWAYS modify existing files in-place.
ALWAYS reuse existing logic.
ALWAYS keep animations consistent.
ALWAYS modify incrementally.
ALWAYS one task at a time.
```

---

## 3. Execution Principles

### 3.1 Principle Checklist

| ID | Principle | Enforcement |
|---|---|---|
| PR-01 | **One task, one turn.** Do not chain tasks. Do not start Task N+1 before Task N is confirmed complete. | BLOCKING |
| PR-02 | **No speculation.** If a task's instructions are ambiguous, STOP and ask. Do not guess. | BLOCKING |
| PR-03 | **No architecture changes.** Do not restructure directories, rename modules, or change component ownership. | BLOCKING |
| PR-04 | **Strict file boundary.** Modify ONLY files listed in `Files to Modify`. If you discover an additional file that needs changes, STOP and report it. | BLOCKING |
| PR-05 | **Additive-first.** Prefer adding new code over modifying existing code. Only modify existing code when the task explicitly requires it. | HIGH |
| PR-06 | **Preserve style.** Match existing indentation, naming, comment style, and import patterns exactly. | HIGH |
| PR-07 | **No cleanup unless tasked.** Do not fix unrelated warnings, refactor nearby code, or "improve" code outside the task scope. | BLOCKING |
| PR-08 | **Verify then report.** After every task: build, check for errors, report result. Do not assume success. | BLOCKING |

---

## 4. Task Execution Protocol

### 4.1 Task Interpretation

Every task from `10-development-roadmap.md` follows this schema. Codex must parse and respect every field.

| Task Field | How Codex Must Use It |
|---|---|
| **Task ID** | Reference in all commit messages and reports |
| **Priority** | P0 = no delay. P1 = sequential. P2 = after all P0/P1. |
| **Goal** | The ONLY outcome Codex should produce. Nothing more. |
| **Current State** | Read this BEFORE touching any file. Verify it matches reality. |
| **Target State** | The acceptance criteria encoded as a structural description. |
| **Files to Modify** | The EXACT file list. Do not touch files not on this list. |
| **Constraints** | Hard rules. Violating any constraint = task failure. |
| **Acceptance Criteria** | The checklist Codex uses to self-verify before reporting. |
| **Risk Notes** | Read before starting. Mitigations are mandatory. |
| **Dependency** | If listed, that task MUST be completed first. |

### 4.2 Execution Sequence

```
1. READ
   ├── Read the task specification fully
   ├── Read ALL files listed in "Files to Modify"
   ├── Read ALL files listed in "Dependency" (if any)
   └── Verify "Current State" matches actual code

2. PLAN
   ├── Identify the minimum set of edits
   ├── For each file: determine exact lines to change
   └── If "Current State" does NOT match code → STOP and report

3. EXECUTE
   ├── Modify ONE file at a time
   ├── After each file edit → verify syntax
   └── Do NOT edit files not in "Files to Modify"

4. VERIFY
   ├── Run: npm run build
   ├── If build fails → fix errors (files in scope only)
   ├── If build fails on unrelated file → STOP and report
   └── Run through each Acceptance Criterion

5. REPORT
   ├── State: Task ID + "COMPLETE" or "BLOCKED"
   ├── List every file modified (with line counts)
   ├── List any issues encountered
   └── Do NOT start next task
```

### 4.3 Completion Report Template

```
## TASK-XXX: [Goal] — COMPLETE

### Files Modified
- `path/to/file1.jsx` — [what changed, N lines added, M lines removed]
- `path/to/file2.js` — [what changed]

### Verification
- [x] npm run build succeeds
- [x] Acceptance Criterion 1
- [x] Acceptance Criterion 2
- [ ] Acceptance Criterion 3 — NOT MET (reason)

### Issues
- None / [describe issue]

### Status
[COMPLETE / BLOCKED / NEEDS DECISION]
```

---

## 5. Forbidden Actions

### 5.1 Absolute Prohibitions

These actions are **never** allowed. No exceptions. No judgment calls.

| ID | Forbidden Action | Consequence if Violated |
|---|---|---|
| FORB-01 | Delete any file not listed in `Files to Modify` **with** an explicit "Delete" action | Rollback required |
| FORB-02 | Rename any file or directory | Rollback required |
| FORB-03 | Run `npm install` to add a new package unless explicitly instructed | Rollback required |
| FORB-04 | Create a new React component unless the task explicitly requires it | Rollback required |
| FORB-05 | Add a new data field to `demoTeas.js` | Schema corruption |
| FORB-06 | Change any CSS custom property value (reorder/rename only if tasked) | Visual regression |
| FORB-07 | Modify `package.json` scripts beyond what the task specifies | Build breakage |
| FORB-08 | Add or change React Router routes | Navigation breakage |
| FORB-09 | Modify GSAP animation files unless TASK-004 explicitly chooses Option B | Dead code activation |
| FORB-10 | Change `main.jsx` provider order | State corruption |
| FORB-11 | Remove any `data-*` attribute, `aria-*` attribute, or accessibility feature | A11Y regression |
| FORB-12 | Run `npm audit fix` or any dependency upgrade | Version drift |

### 5.2 Conditional Prohibitions

These actions require explicit user confirmation before executing.

| ID | Action | Confirmation Required |
|---|---|---|
| COND-01 | Deleting a file that is NOT in the task's "Files to Modify" with "Delete" action | "I found file X which appears unused. Delete it?" |
| COND-02 | Modifying a file in more than 3 locations within one task | "This task touches file X in 4 places. Proceed?" |
| COND-03 | A change that affects a component imported by files outside the task scope | "This change to X will affect Y and Z. Proceed?" |
| COND-04 | Removing an `export` from any module | "Removing export X from Y will break imports in Z. Proceed?" |

---

## 6. File Modification Rules

### 6.1 Editing Rules

| ID | Rule |
|---|---|
| EDIT-01 | Edit files in-place. Never create a new version of a file alongside the old one. |
| EDIT-02 | When extracting a function (e.g., `getMonths` → `utils/`), the original file keeps the import — the function is REMOVED from the original, not duplicated. |
| EDIT-03 | When moving code, verify all imports are updated before considering the task done. |
| EDIT-04 | Preserve all existing comments unless they become incorrect after the edit. |
| EDIT-05 | Preserve blank lines between logical sections. Do not collapse or expand whitespace. |
| EDIT-06 | When adding an import, place it in the correct group (see TASK-015 convention). |

### 6.2 Import Rules

| ID | Rule |
|---|---|
| IMP-01 | All imports use relative paths (`../../utils/season.js`), not aliases. |
| IMP-02 | Do not add path aliases (`@/utils`) unless the task explicitly configures them. |
| IMP-03 | Named imports preferred over default imports for utility functions. |
| IMP-04 | Do not re-export from barrel files unless the barrel already exists. |

---

## 7. State Management Rules

| ID | Rule |
|---|---|
| STATE-01 | Do not lift component-local state to Context unless a task explicitly requires it. |
| STATE-02 | Do not add new Context providers. |
| STATE-03 | Do not change the provider hierarchy in `main.jsx`. |
| STATE-04 | Do not convert `useState` to `useReducer` or any other state pattern. |
| STATE-05 | Do not add external state libraries (Redux, Zustand, Jotai). |
| STATE-06 | If a component needs state that another component has, lift to `MapPage` — do not create a new Context. |

---

## 8. Animation Rules

| ID | Rule |
|---|---|
| ANIM-01 | Do not add new animation code to any component. |
| ANIM-02 | Do not change existing framer-motion `transition` values. |
| ANIM-03 | Do not change D3 zoom `scaleExtent` or `duration` values. |
| ANIM-04 | Do not add CSS `@keyframes` to `index.css`. |
| ANIM-05 | If an animation is broken by a code change, STOP and report — do not attempt to fix it. |

---

## 9. Styling Rules

| ID | Rule |
|---|---|
| STYLE-01 | Do not add new CSS classes to `index.css`. |
| STYLE-02 | Do not change Tailwind class names on existing elements unless the element's behavior changed. |
| STYLE-03 | Do not add inline `style` props to components that don't already use them. |
| STYLE-04 | If a visual regression is noticed, STOP and report — do not attempt to fix with CSS changes. |
| STYLE-05 | TASK-010 is the ONLY task authorized to modify CSS custom properties. |

---

## 10. Build & Verification Protocol

### 10.1 Mandatory Verification After Every Task

```
1. npm run build
   ├── Exit code MUST be 0
   ├── Warnings: report but do not block (unless task specifically targets warnings)
   └── Errors: BLOCKING — fix or report

2. npm run dev (if task changes component behavior)
   ├── App must render without console errors
   ├── No React key warnings
   └── No "undefined" or "null" access errors

3. Visual check (conceptual)
   ├── If task involves component rendering changes, describe expected visual result
   └── If task is structural (utils, types, config), visual check is optional
```

### 10.2 Build Error Protocol

| Scenario | Action |
|---|---|
| Build error in a file modified by this task | Fix it (within task scope only) |
| Build error in a file NOT modified by this task | STOP and report — do not touch unrelated files |
| Build error that existed BEFORE the task | Report it but do not fix — pre-existing issues are out of scope |
| Build warning (not error) | Report it; do not fix unless the task targets warnings |

---

## 11. Failure Modes

### 11.1 Common Failure Patterns

| Failure Mode | Symptom | Prevention |
|---|---|---|
| **Scope creep** | Task says "extract `getMonths`" — Codex also extracts `spotsFor`, renames variables, and adds JSDoc | Read `Files to Modify`. Touch ONLY those files. |
| **Cross-task implementation** | Task004 (GSAP removal) is in progress — Codex also starts cleaning up `animations/` directory | Each task is atomic. STOP after task completion. |
| **Constraint ignorance** | Task's `Constraints` table says "Do NOT change function signature" — Codex changes parameter names anyway | Read ALL constraints before editing. |
| **Speculative fixes** | Build succeeds, but Codex notices a "better" way to structure the code and refactors it | PR-07: No cleanup unless tasked. |
| **Import cascade** | Moving one function triggers updating imports in 6 files, but only 2 are in `Files to Modify` | COND-02: If >3 files need import updates, ask first. |
| **Silent visual regression** | CSS change looks fine in code but breaks layout at certain viewports | Verify visually when task touches components. |

### 11.2 Failure Response Protocol

```
If Codex realizes it has violated a rule:
  1. STOP immediately
  2. Revert the violating change (if possible)
  3. Report: which rule was violated, why, what was reverted
  4. Re-evaluate the task scope
  5. Resume from the last valid state

If Codex is unsure whether an action is allowed:
  1. STOP
  2. Ask the user
  3. Wait for confirmation
  4. Do NOT proceed without explicit approval
```

---

## 12. Task-Specific Execution Notes

### 12.1 TASK-004 (GSAP) — Decision Required

| Option | Codex Action |
|---|---|
| **User says "Option A"** | Delete 4 files. Check `package.json` for `gsap`, remove if present. |
| **User says "Option B"** | Do NOT proceed without additional instructions. GSAP integration requires a separate detailed task. |
| **User hasn't decided** | Ask. Do not execute either option. |

### 12.2 TASK-005 (Navbar) — Decision Required

| Option | Codex Action |
|---|---|
| **User says "Option A"** | Add `import Navbar` + `<Navbar />` to `App.jsx`. Place above `<Routes>`. |
| **User says "Option B"** | Delete `Navbar.jsx`. Verify no other file imports it. |
| **User hasn't decided** | Ask. |

### 12.3 TASK-014 (Memory Leak) — Extra Caution

- Do NOT change any Three.js animation logic
- Add ONLY the `disposed` flag + guard
- Do NOT refactor the `animate()` function
- Do NOT change material/geometry disposal logic

### 12.4 TASK-020 (Verification) — Report-Only

- This task is read-only
- Do NOT modify any files
- Output goes to `VERIFICATION-REPORT.md`
- If issues found: list them, do not fix them

---

## 13. Communication Protocol

### 13.1 When to STOP and Ask

| Situation | Action |
|---|---|
| Task instructions are ambiguous | STOP. Ask for clarification. |
| "Current State" in task does not match actual code | STOP. Report the discrepancy. |
| File listed in "Files to Modify" does not exist | STOP. Report the missing file. |
| Change affects more files than listed | STOP. Report which additional files would be affected. |
| Build fails on an unrelated file | STOP. Report the error. Do not fix unrelated files. |
| A constraint seems impossible to satisfy | STOP. Explain the conflict. |
| Task completed but one AC cannot be verified | STOP. Report which AC and why. |

### 13.2 When NOT to Ask

| Situation | Action |
|---|---|
| Import path needs updating after a function move | Just fix it — this is within task scope |
| A blank line needs adjusting to match file style | Just fix it |
| Build succeeds with a pre-existing warning | Report it in the completion report; do not ask |
| Task is clear, all files exist, all constraints are satisfiable | EXECUTE |

---

## 14. Quick Reference Checklist

### Pre-Task

- [ ] Read full task specification
- [ ] Read ALL files in "Files to Modify"
- [ ] Verify "Current State" matches actual code
- [ ] Confirm dependency tasks are complete (if any)
- [ ] Confirm any Option A/B decisions with user (if applicable)

### During Task

- [ ] Edit one file at a time
- [ ] Only touch files in "Files to Modify"
- [ ] Respect all constraints
- [ ] No cleanup of unrelated code
- [ ] No new features
- [ ] No new dependencies

### Post-Task

- [ ] `npm run build` succeeds
- [ ] All Acceptance Criteria met
- [ ] No files modified beyond those listed
- [ ] Completion report written
- [ ] STOP — do not start next task

---

## 15. Constraints

| ID | Constraint |
|---|---|
| CODEX-C01 | This document overrides all other instructions when there is a conflict |
| CODEX-C02 | Codex may not reinterpret, relax, or ignore any rule in this document |
| CODEX-C03 | When in doubt between "do it" and "ask" — ASK |
| CODEX-C04 | Every task execution must produce a completion report |
| CODEX-C05 | Tasks must be executed in numerical order (TASK-001 → TASK-020) unless a dependency chain allows parallel execution |
| CODEX-C06 | After Task020, Codex must not propose Task021+ without explicit user request |

---

## 16. Acceptance Criteria

- [ ] 8 execution principles defined (PR-01 through PR-08)
- [ ] Task interpretation guide covers all 9 task fields
- [ ] 5-step execution sequence defined (READ → PLAN → EXECUTE → VERIFY → REPORT)
- [ ] Completion report template provided
- [ ] 12 absolutely forbidden actions (FORB-01 through FORB-12)
- [ ] 4 conditional prohibitions (COND-01 through COND-04)
- [ ] 6 file editing rules (EDIT-01 through EDIT-06)
- [ ] 6 state management rules (STATE-01 through STATE-06)
- [ ] 5 animation rules (ANIM-01 through ANIM-05)
- [ ] 5 styling rules (STYLE-01 through STYLE-05)
- [ ] Build error protocol covers 4 scenarios
- [ ] 6 failure modes documented with prevention strategies
- [ ] Task-specific notes for TASK-004, TASK-005, TASK-014, TASK-020
- [ ] When-to-STOP vs when-NOT-to-ask table
- [ ] Quick reference checklist (pre/during/post task)

---

## 17. Dependencies

| Dependency | Document | Status |
|---|---|---|
| Task definitions | `10-development-roadmap.md` | ✅ Complete |
| Frontend architecture (file paths, import rules) | `09-frontend-architecture.md` | ✅ Complete |
| Global project rules | `15-project-rules.md` | ✅ Complete |

---

## 18. References

| Document | Relationship |
|---|---|
| `10-development-roadmap.md` | All tasks governed by this guide |
| `09-frontend-architecture.md` | Import rules, dependency rules, state ownership |
| `15-project-rules.md` | Global rules that supplement this guide |

---

## 19. Next Document

> **`12-assets-guide.md`** — Asset specifications: textures, ink-wash images, tea illustrations, map assets, AI image prompt templates, file naming conventions, and format requirements.

---

> This document is a contract between the developer and the AI agent. Every rule is enforceable. Every violation is detectable. Codex's only job is to execute tasks within these boundaries — not to design, not to improve, not to speculate.
