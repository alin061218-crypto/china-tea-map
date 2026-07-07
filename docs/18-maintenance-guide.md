# 18 — Maintenance Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Official Ongoing Maintenance & Stewardship Specification**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | MNT-018 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `14-deployment-guide.md`, `16-qa-testing-guide.md`, `15-project-rules.md`, `10-development-roadmap.md`, `17-contributing-guide.md` |

---

## 2. Purpose

This document defines **how Tea Atlas is maintained, monitored, and sustained** after launch. It is the operational manual for the ongoing health of the project.

| In Scope | Out of Scope |
|---|---|
| Scheduled maintenance tasks and cadences | Initial deployment (→ `14-deployment-guide.md`) |
| Dependency update policy | Build configuration (→ `14-deployment-guide.md` §5) |
| Content refresh and expiration | Content writing standards (→ `13-content-guide.md`) |
| Performance monitoring and tuning | Performance budgets (→ `16-qa-testing-guide.md` §10) |
| Incident response procedures | Release process (→ `14-deployment-guide.md` §16) |
| Backup and recovery | Rollback procedures (→ `14-deployment-guide.md` §17) |
| Technical debt management | Code standards (→ `15-project-rules.md` §7) |
| Knowledge transfer and handoff | Contributor workflow (→ `17-contributing-guide.md`) |
| Project health metrics | Quality gates (→ `16-qa-testing-guide.md` §15) |

---

## 3. Maintenance Philosophy

### 3.1 Core Principles

| ID | Principle | Description |
|---|---|---|
| **MNT-P01** | **Prevention Over Reaction** | Scheduled maintenance catches issues before users report them. A 30-minute weekly check prevents a 4-hour emergency fix. |
| **MNT-P02** | **Stability Over Novelty** | Dependency upgrades are evaluated for risk before benefit. A working old version is better than a broken new version. |
| **MNT-P03** | **Document Everything** | Every incident, every upgrade, every content change is recorded. Future maintainers should never ask "why was this done?" |
| **MNT-P04** | **Automate the Routine** | Repetitive checks are scripted. Human attention is reserved for decisions and exceptions. |
| **MNT-P05** | **Rotate Knowledge** | No single person holds all operational knowledge. Processes are documented, access is shared, handoff is practiced. |

### 3.2 Maintenance Cadence Overview

| Cadence | Duration | Activities | Owner |
|---|---|---|---|
| **Daily** (automated) | Continuous | Uptime monitoring, error tracking, performance metrics | Monitoring tools |
| **Weekly** | 30 minutes | Review dashboards, triage errors, check dependencies | Project Lead |
| **Monthly** | 2 hours | Content review, dependency audit, performance baseline, backup verification | Project Lead |
| **Quarterly** | 4 hours | Content refresh, dependency upgrades, security audit, tech debt review | Project Lead |
| **Annual** | 1 day | Full project health review, strategy planning, major version consideration | Project Lead |

---

## 4. Scheduled Maintenance Tasks

### 4.1 Weekly Tasks

| ID | Task | Action | Duration | Pass Criteria |
|---|---|---|---|---|
| **W-01** | Error review | Check Sentry dashboard. Triage new errors. | 10 min | 0 new P0 errors. All P1 errors assigned. |
| **W-02** | Performance check | Check Vercel Analytics Web Vitals. | 5 min | LCP ≤ 2.5s, CLS ≤ 0.1. No regression from baseline. |
| **W-03** | Uptime check | Verify site loads. Navigate 5 critical paths. | 5 min | All paths respond. No errors. |
| **W-04** | Dependency check | `npm outdated`. Review changelogs. | 5 min | Note any new major versions. Decide if upgrade is warranted. |
| **W-05** | Storage check | Verify asset hosting and CDN are operational. | 5 min | All images load. No broken asset URLs. |

### 4.2 Monthly Tasks

| ID | Task | Action | Duration | Pass Criteria |
|---|---|---|---|---|
| **M-01** | Content accuracy spot-check | Review 3 random tea profiles for accuracy. | 20 min | No factual errors found. Source links still valid. |
| **M-02** | Dependency audit | `npm audit`. Review all advisories. | 15 min | 0 high/critical. Patch-level fixes applied. |
| **M-03** | Performance baseline | Run Lighthouse on 5 critical pages. Compare to baseline. | 20 min | All scores ≥ baseline. No regression. |
| **M-04** | Visual regression check | Run visual regression suite. Compare screenshots. | 15 min | Diff ≤ 1%. No unexpected visual changes. |
| **M-05** | Browser compatibility | Smoke test on latest Chrome + Firefox + Safari. | 20 min | All critical paths render correctly. |
| **M-06** | Backup verification | Verify content data is backed up (Git + external). | 10 min | Data files accessible. Backup copy current. |
| **M-07** | Broken link check | Scan for broken internal links and asset references. | 10 min | 0 broken links. 0 missing assets. |
| **M-08** | Log review | Review server logs for errors, warnings, anomalies. | 10 min | No unexplained patterns. No security anomalies. |

### 4.3 Quarterly Tasks

| ID | Task | Action | Duration | Pass Criteria |
|---|---|---|---|---|
| **Q-01** | Dependency upgrade | Upgrade non-breaking dependencies. Test thoroughly. | 60 min | All tests pass. Build succeeds. Visual regression ≤ 1%. |
| **Q-02** | Security audit | Full `npm audit`. Review CSP headers. Check TLS expiry. Check API security. | 30 min | 0 high/critical. Headers present. TLS valid ≥ 30 days. |
| **Q-03** | Content refresh | Review all tea profiles for accuracy. Add 2–3 new teas if planned. Update outdated references. | 60 min | All content verified. New content passes validation. |
| **Q-04** | Performance tuning | Analyze bundle. Remove unused code. Optimize critical assets. | 45 min | Bundle size ≤ baseline + 10%. LCP stable or improved. |
| **Q-05** | Tech debt review | Review `TODO`/`FIXME` comments. Assess known issues. Prioritize for next roadmap. | 30 min | All tech debt items triaged. Top 3 added to roadmap. |
| **Q-06** | Documentation sync | Verify all docs match current code behavior. Update outdated claims. | 30 min | No document-code discrepancies. |
| **Q-07** | Knowledge transfer | Update maintenance docs. Ensure backup maintainer can perform all tasks. | 15 min | Second person completes weekly checklist independently. |

### 4.4 Annual Tasks

| ID | Task | Action | Duration | Pass Criteria |
|---|---|---|---|---|
| **A-01** | Full project audit | Review all docs, all code, all content, all assets. Identify accumulated issues. | 3 hours | Comprehensive audit report written. |
| **A-02** | Strategy review | Assess project health. Decide: continue, expand, archive, or hand off. | 1 hour | Strategy document updated. |
| **A-03** | Major version consideration | Evaluate if a major version bump (2.0) is warranted. | 30 min | Decision documented with rationale. |
| **A-04** | Dependency major upgrades | Plan and execute any major version upgrades deferred from quarterly. | 2 hours | Upgrades complete or decision to defer documented. |
| **A-05** | Archive and backup | Create full project archive. Store off-platform. | 30 min | Archive verified restorable. |

---

## 5. Dependency Management

### 5.1 Dependency Categories

| Category | Examples | Update Frequency | Risk Level | Testing Required |
|---|---|---|---|---|
| **Framework** | `react`, `react-dom`, `react-router-dom` | Quarterly (patch), Annual (major) | High | Full regression + visual + E2E |
| **Build** | `vite`, `tailwindcss`, `postcss`, `autoprefixer` | Quarterly | Medium | Build + visual regression |
| **Visualization** | `d3`, `d3-geo`, `three` | Quarterly (patch), Annual (major) | High | Map interaction + WebGL + visual |
| **Animation** | `framer-motion` | Quarterly | Medium | Animation verification checklist |
| **Utilities** | `axios`, `react-hot-toast` | Monthly (patch), Quarterly (minor) | Low | Integration tests |
| **Dev** | `@types/*`, TypeScript | Monthly | Low | TypeCheck passes |

### 5.2 Dependency Update Procedure

```
1. CHECK
   ├── npm outdated → list all outdated packages
   ├── Review changelog for each package
   └── Categorize: PATCH (safe), MINOR (review), MAJOR (plan)

2. PLAN
   ├── PATCH: batch update, single PR
   ├── MINOR: one package at a time, review changelog
   └── MAJOR: create a task in the roadmap, schedule quarterly

3. UPDATE
   ├── npm install package@version
   ├── Run build: npm run build
   ├── Run tests: npm test
   └── Visual check: critical paths

4. VERIFY
   ├── Lighthouse: no performance regression
   ├── Visual regression: diff ≤ 1%
   └── Manual smoke test: 5 critical paths

5. COMMIT
   ├── chore(deps): update {package} from {old} to {new}
   ├── Include changelog link in commit body
   └── PR → review → merge
```

### 5.3 Dependency Rules

| ID | Rule |
|---|---|
| **DEP-R01** | Patch versions: update monthly. Minor versions: update quarterly. Major versions: update annually or when security-critical. |
| **DEP-R02** | Never update a dependency without running the build and tests. |
| **DEP-R03** | Major version upgrades get their own task in the development roadmap. |
| **DEP-R04** | If a dependency introduces a regression, roll back immediately. Do not "fix forward" with workarounds. |
| **DEP-R05** | Dependencies with known vulnerabilities (high/critical) are patched within 7 days. |
| **DEP-R06** | New runtime dependencies require explicit justification (see `15-project-rules.md` NEV-01). Dev dependencies are at maintainer discretion. |

---

## 6. Content Maintenance

### 6.1 Content Refresh Cycle

| Content Type | Review Frequency | Refresh Trigger | Action |
|---|---|---|---|
| **Tea profiles** | Quarterly | New information, seasonal accuracy | Update data fields, verify against sources |
| **Origin stories** | Annual | New scholarship, translation improvements | Review for accuracy, improve prose |
| **Cultural topics** | Annual | Cultural events, new references | Update, expand, or add new topics |
| **Brewing guides** | Quarterly | Community feedback, parameter refinement | Adjust parameters if consensus changes |
| **Flavor profiles** | Annual | Tasting notes evolve | Refine descriptors if needed |
| **Scene narratives** | Annual | Visual updates, new scenes | Refresh prose to match updated visuals |
| **UI microcopy** | As-needed | User confusion, feedback | Clarify, simplify, translate |
| **Metadata (SEO)** | Quarterly | Search performance data | Optimize titles and descriptions |

### 6.2 Content Expiration

| Content Type | Expiration Signal | Action |
|---|---|---|
| **Seasonal references** ("Spring 2026") | Date passed | Update to current or remove year |
| **Event-based content** | Event concluded | Archive or update with retrospective |
| **"New" or "Coming soon" labels** | Feature shipped | Remove label |
| **External links** | Link broken (404) | Update URL or remove reference |
| **Cited sources** | Source updated or retracted | Re-verify claim against current source |

### 6.3 Content Addition Process

```
1. IDENTIFY gap — which tea/province/story is missing?
2. RESEARCH — Tier 1–2 sources per 13-content-guide.md §3.3
3. DRAFT — follow schema from 07-tea-content-system.md
4. VALIDATE — pass content validation checklist (13-content-guide.md §12)
5. GENERATE assets — use prompts from 12-assets-guide.md §6
6. PR with content + assets + updated documentation
7. REVIEW by Project Lead for cultural accuracy
8. MERGE and deploy
```

### 6.4 Content Rules

| ID | Rule |
|---|---|
| **CON-R01** | Content accuracy is verified against 2+ Tier 1–2 sources before publication. |
| **CON-R02** | Every content change includes the date of verification in commit metadata. |
| **CON-R03** | Outdated content is updated or archived. Don't leave "as of 2024" claims unverified. |
| **CON-R04** | New tea entries include all P0 fields + hero image + brewing guide. No partial entries. |
| **CON-R05** | Tea IDs are never changed after v1 launch. New teas get new IDs. |

---

## 7. Performance Monitoring

### 7.1 Monitoring Dashboard

| Metric | Tool | Check Frequency | Alert Threshold | Action on Alert |
|---|---|---|---|---|
| **LCP** | Vercel Analytics | Weekly | > 3.0s (from ≤ 2.5s budget) | Audit hero image size, font loading, render-blocking resources |
| **CLS** | Vercel Analytics | Weekly | > 0.15 (from ≤ 0.1 budget) | Check font loading, image dimensions, dynamic content insertion |
| **FID** | Vercel Analytics | Weekly | > 150ms (from ≤ 100ms) | Audit JS bundle size, main-thread blocking |
| **TTFB** | Vercel Analytics | Weekly | > 1.0s (from ≤ 600ms) | Check CDN cache hit rate, edge function performance |
| **Error rate** | Sentry | Daily | > 0.1% of sessions | Triage errors, determine root cause, fix or rollback |
| **Bundle size** | `vite build` report | Monthly | JS > 450KB or CSS > 55KB | Audit chunk composition, remove unused imports |
| **Memory** | Chrome DevTools | Quarterly | > 200MB after 5 min idle | Check Three.js cleanup, GSAP tween leaks, event listener leaks |
| **API latency** | Server monitoring | Weekly | P95 > 500ms | Optimize queries, add caching, scale resources |

### 7.2 Performance Regression Protocol

```
1. DETECT — monitoring tool flags metric over threshold
2. ISOLATE — when did the regression start? Which deploy?
3. COMPARE — diff the deploy before and after regression
4. IDENTIFY — which change caused the regression?
5. FIX — if obvious, fix forward. If unclear, rollback and investigate.
6. DOCUMENT — record: metric, threshold, cause, fix, date
```

### 7.3 Performance Rules

| ID | Rule |
|---|---|
| **PRF-R01** | Performance regressions over 20% of budget trigger immediate investigation. |
| **PRF-R02** | Bundle size is checked on every build. A >10% increase triggers a review. |
| **PRF-R03** | New third-party scripts or tags require performance impact assessment before addition. |
| **PRF-R04** | Performance baselines are updated after intentional changes that affect metrics (e.g., new hero image). |

---

## 8. Incident Response

### 8.1 Incident Severity Levels

| Severity | Definition | Response Time | Resolution Time | Example |
|---|---|---|---|---|
| **P0 — Critical** | Site down. Users cannot access any content. | Immediate (any hour) | ≤ 1 hour | Blank page on all routes, 500 on all API calls |
| **P1 — Major** | Core feature broken. Significant user impact. | ≤ 4 hours (business hours) | ≤ 24 hours | Map not interactive, encyclopedia returns no results |
| **P2 — Minor** | Non-critical feature broken. Workaround exists. | ≤ 24 hours | ≤ 7 days | Season slider glitch, single tea detail page broken |
| **P3 — Cosmetic** | Visual issue. No functional impact. | ≤ 7 days | Next release | Typo, spacing glitch, color mismatch |

### 8.2 Incident Response Procedure

```
1. DETECT
   ├── Automated: Sentry alert, uptime monitor, performance alert
   └── Manual: user report, team member notices

2. TRIAGE
   ├── Assign severity (P0–P3)
   ├── Notify: P0 → immediate all-hands; P1 → team channel; P2/P3 → issue tracker
   └── Create incident record (date, severity, symptom, detector)

3. MITIGATE
   ├── P0/P1: ROLLBACK FIRST (see 14-deployment-guide.md §17)
   │   └── Restore last known-good deployment
   ├── P2: assess if rollback or hotfix is appropriate
   └── P3: create issue, fix in next release

4. RESOLVE
   ├── Deploy fix (or confirm rollback restored service)
   ├── Verify: smoke test 5 critical paths
   ├── Monitor: watch Sentry + Analytics for 30 minutes
   └── Close incident record

5. POST-MORTEM
   ├── What happened? (timeline)
   ├── Why did it happen? (root cause)
   ├── How was it detected? (monitoring gap?)
   ├── How was it fixed? (resolution)
   └── How do we prevent recurrence? (action items)
```

### 8.3 Post-Mortem Template

```markdown
## Incident Post-Mortem: {title}

| Field | Value |
|---|---|
| **Incident ID** | INC-YYYY-NNN |
| **Date** | YYYY-MM-DD |
| **Severity** | P0 / P1 / P2 / P3 |
| **Duration** | {start} – {end} ({total minutes}) |
| **Detected By** | Sentry / User report / Team |
| **Resolved By** | {name} |

### Timeline
- HH:MM — Incident began (cause)
- HH:MM — Detected (how)
- HH:MM — Response started
- HH:MM — Mitigated (rollback / hotfix)
- HH:MM — Verified resolved
- HH:MM — Incident closed

### Root Cause
{1–2 paragraphs}

### Resolution
{What was done to fix it}

### Impact
- Users affected: {count or % of sessions}
- Duration: {minutes}
- Data loss: {none / description}

### Prevention
- [ ] Action item 1
- [ ] Action item 2
- [ ] Update monitoring to detect this earlier

### Lessons Learned
{1–2 paragraphs}
```

### 8.4 Incident Response Rules

| ID | Rule |
|---|---|
| **INC-R01** | P0 incidents: rollback first, investigate second. Restore service before finding root cause. |
| **INC-R02** | Every P0/P1 incident gets a post-mortem within 48 hours. |
| **INC-R03** | Post-mortems are blameless. Focus on process improvement, not individual fault. |
| **INC-R04** | Action items from post-mortems are added to the development roadmap within 1 week. |
| **INC-R05** | Incident records are kept for the project lifetime. Review quarterly for patterns. |

---

## 9. Backup & Recovery

### 9.1 What Is Backed Up

| Asset | Backup Method | Frequency | Retention | Recovery Verification |
|---|---|---|---|---|
| **Source code** | Git (GitHub) | Every push | Permanent | Clone and build |
| **Documentation** | Git (GitHub) | Every push | Permanent | Read from repo |
| **Content data** | Git (GitHub) + export to JSON | Every push + monthly export | Permanent | Parse and validate |
| **Assets (images)** | Git (LFS or cloud storage) | Every addition | Permanent | Verify all asset paths resolve |
| **Environment config** | Vercel Dashboard + `.env.example` in repo | On change | Permanent | Recreate from `.env.example` |
| **DNS records** | DNS provider export | Quarterly | 1 year | Verify resolution |
| **Analytics data** | Platform-native retention | Automatic | Per platform policy | — |

### 9.2 Recovery Procedures

| Scenario | Recovery Method | Expected Time | Document Reference |
|---|---|---|---|
| **Accidental code deletion** | `git checkout` or `git revert` | ≤ 5 min | `14-deployment-guide.md` §17 |
| **Bad deploy** | Vercel instant rollback | ≤ 2 min | `14-deployment-guide.md` §17.2 |
| **Data corruption** | `git checkout` content files from last known-good commit | ≤ 15 min | — |
| **Asset loss** | Regenerate from `12-assets-guide.md` prompts | 1–4 hours | `12-assets-guide.md` §6 |
| **Domain/SSL issue** | Vercel auto-renew + DNS verification | ≤ 30 min | `14-deployment-guide.md` §9 |
| **Full platform loss** | Redeploy from repo to new Vercel project | ≤ 2 hours | `14-deployment-guide.md` §3, §8 |
| **Repository loss** | Clone from local backup or secondary remote | ≤ 1 hour | — |

### 9.3 Backup Rules

| ID | Rule |
|---|---|
| **BAK-R01** | The Git repository is the primary backup. Push regularly. Never keep un-pushed work. |
| **BAK-R02** | A secondary remote (e.g., GitLab mirror) is maintained for disaster recovery. |
| **BAK-R03** | Content data is exported as standalone JSON monthly, stored outside the repository. |
| **BAK-R04** | Recovery procedures are tested quarterly — not just documented, but EXECUTED. |
| **BAK-R05** | Environment variable values (not just keys) are stored in a secure, access-controlled location. |

---

## 10. Technical Debt Management

### 10.1 Technical Debt Inventory

| Category | Examples | Detection | Tracking |
|---|---|---|---|
| **Code debt** | Duplicated logic, unclear naming, missing types | Code review, lint rules | GitHub Issues with `tech-debt` label |
| **Architecture debt** | Component doing too much, wrong layer crossing | Architecture review (quarterly) | Roadmap tasks |
| **Dependency debt** | Outdated packages, unmaintained dependencies | `npm outdated`, `npm audit` | Dependency update schedule (§5) |
| **Test debt** | Missing tests, flaky tests, low coverage | Coverage report, test failure rate | QA document update |
| **Documentation debt** | Docs out of sync with code, missing sections | Doc-code diff review (quarterly) | Documentation PR |
| **Content debt** | Outdated tea profiles, missing translations, broken links | Content audit (quarterly) | Content PR |
| **Performance debt** | Slow pages, large bundles, memory leaks | Performance monitoring (§7) | Performance task in roadmap |

### 10.2 Technical Debt Triage

| Severity | Definition | Action Timeline | Example |
|---|---|---|---|
| **Critical** | Causing production issues or blocking development | Fix this quarter | Memory leak causing crashes |
| **High** | Will cause issues within 6 months | Fix within 2 quarters | Dependency 6 months EOL |
| **Medium** | Slowing development but not blocking | Schedule when adjacent work happens | Untyped utility function touched often |
| **Low** | Cosmetic or minor inefficiency | Fix when opportunity arises | Inconsistent variable naming |

### 10.3 Technical Debt Rules

| ID | Rule |
|---|---|
| **DEB-R01** | Technical debt is tracked in GitHub Issues with the `tech-debt` label. No invisible debt. |
| **DEB-R02** | Critical debt items become roadmap tasks within the current quarter. |
| **DEB-R03** | When modifying a file with known debt, fix the debt in that file (and only that file) as part of the change. |
| **DEB-R04** | Quarterly tech debt review produces a prioritized list. Top 3 items become tasks. |

---

## 11. Security Maintenance

### 11.1 Security Schedule

| Task | Frequency | Tool / Method | Action on Finding |
|---|---|---|---|
| **Dependency vulnerability scan** | Weekly (automated) | `npm audit` / Dependabot | Patch within 7 days (high/critical) |
| **CSP header review** | Quarterly | Manual + securityheaders.com | Update CSP if new scripts/styles added |
| **TLS certificate check** | Monthly | Vercel Dashboard (auto-renew) | Verify expiry ≥ 30 days |
| **Environment variable audit** | Quarterly | Vercel Dashboard | Rotate if exposed. Remove unused. |
| **Access control review** | Quarterly | GitHub repository settings | Remove ex-contributors. Audit deploy access. |
| **Penetration test** | Annual | Manual or automated tool | Fix findings by severity. |
| **Security headers check** | Quarterly | `curl -I` + securityheaders.com | All headers from `14-deployment-guide.md` §14 present |

### 11.2 Security Rules

| ID | Rule |
|---|---|
| **SEC-R01** | High/critical vulnerabilities are patched within 7 days. |
| **SEC-R02** | Secrets are never stored in the repository. Rotated immediately if exposed. |
| **SEC-R03** | Access to production deploy is limited to the Project Lead + one designated backup. |
| **SEC-R04** | Security incidents follow the incident response procedure (§8). P0 for data breaches. |

---

## 12. Knowledge Transfer

### 12.1 Knowledge Distribution

| Knowledge Area | Primary Owner | Documented In | Backup Owner |
|---|---|---|---|
| **Project vision and principles** | Project Lead | `00-project-overview.md`, `15-project-rules.md` | — (must transfer before departure) |
| **Codebase architecture** | Project Lead | `09-frontend-architecture.md`, `03-site-architecture.md` | Codex (can navigate) |
| **Deployment and infrastructure** | Project Lead | `14-deployment-guide.md` | Designated backup maintainer |
| **Content and cultural accuracy** | Project Lead | `07-tea-content-system.md`, `13-content-guide.md` | Research AI (can verify) |
| **Design system** | Project Lead | `04-ui-design-system.md` | Documentation AI (can reference) |
| **Animation system** | Project Lead | `05-animation-system.md` | Codex (can execute) |

### 12.2 Handoff Procedure

```
1. PREPARE (2 weeks before departure)
   ├── Verify all documents are up to date
   ├── Ensure backup maintainer can perform all weekly tasks independently
   ├── Transfer account access (Vercel, GitHub, domain, Sentry, analytics)
   └── Document any unwritten knowledge

2. HANDOFF (1 week before departure)
   ├── Walk through all maintenance procedures with successor
   ├── Successor performs weekly + monthly checklists independently
   ├── Successor performs a mock incident response drill
   └── Q&A session

3. TRANSITION (departure day)
   ├── Transfer project ownership (GitHub, Vercel, domain)
   ├── Remove departing maintainer's access
   ├── Announce transition to team/stakeholders
   └── Archive handoff checklist as completed
```

### 12.3 Knowledge Transfer Rules

| ID | Rule |
|---|---|
| **KNO-R01** | Every operational procedure is documented. If it's only in someone's head, it doesn't exist. |
| **KNO-R02** | At least one backup person can perform every critical maintenance task. |
| **KNO-R03** | Account credentials and access tokens are stored in a shared, secure location — not individual accounts. |
| **KNO-R04** | Handoff is practiced annually, even if no departure is planned. |
| **KNO-R05** | Unwritten knowledge discovered during handoff is documented immediately. |

---

## 13. Project Health Metrics

### 13.1 Health Dashboard

| Metric | Target | Measurement | Review Frequency |
|---|---|---|---|
| **Uptime** | ≥ 99.9% | Vercel Analytics / uptime monitor | Monthly |
| **Error rate** | ≤ 0.1% of sessions | Sentry | Weekly |
| **LCP** | ≤ 2.5s (P75) | Vercel Analytics | Weekly |
| **Open P0 bugs** | 0 | GitHub Issues | Weekly |
| **Open P1 bugs** | ≤ 3 | GitHub Issues | Weekly |
| **Dependency vulnerabilities** | 0 high/critical | `npm audit` | Weekly |
| **Documentation freshness** | All docs updated within 6 months | Manual review (last-updated dates) | Quarterly |
| **Content freshness** | All tea profiles verified within 12 months | Manual audit | Quarterly |
| **Test coverage** | ≥ 70% utilities (when infra exists) | Coverage report | Monthly |
| **Bus factor** | ≥ 2 people can deploy and maintain | Knowledge transfer check | Quarterly |

### 13.2 Project Health Review

Quarterly, the Project Lead reviews all health metrics and answers:

1. **Is the project healthy?** (metrics within targets?)
2. **Is the project maintainable?** (docs current? knowledge shared?)
3. **Is the project growing?** (new content? new users? new features?)
4. **Is the project secure?** (no vulnerabilities? access controlled?)
5. **What is the top risk?** (and what's being done about it?)
6. **Should the project continue as-is, expand, wind down, or be handed off?**

---

## 14. Acceptance Criteria

- [ ] Maintenance philosophy: 5 principles + cadence overview table (5 tiers)
- [ ] Weekly tasks: 5 tasks with durations and pass criteria (W-01 – W-05)
- [ ] Monthly tasks: 8 tasks with durations and pass criteria (M-01 – M-08)
- [ ] Quarterly tasks: 7 tasks with durations and pass criteria (Q-01 – Q-07)
- [ ] Annual tasks: 5 tasks with durations and pass criteria (A-01 – A-05)
- [ ] Dependency management: 6 categories with risk levels, 5-step update procedure, 6 rules
- [ ] Content maintenance: refresh cycle table (8 types), expiration signals (5 types), 4-step addition process, 5 rules
- [ ] Performance monitoring: 8-metric dashboard with thresholds and alert actions, regression protocol, 4 rules
- [ ] Incident response: 4 severity levels, 5-step procedure, post-mortem template, 5 rules
- [ ] Backup & recovery: 7-row backup inventory, 7 recovery scenarios with time estimates, 5 rules
- [ ] Technical debt: 7 categories, 4 severity levels, 4 rules
- [ ] Security maintenance: 7-row schedule, 4 rules
- [ ] Knowledge transfer: 6 knowledge areas with owners, handoff procedure (3 phases), 5 rules
- [ ] Project health: 10 metrics with targets, 6 quarterly review questions
- [ ] All rule IDs (MNT-P*, DEP-R*, CON-R*, PRF-R*, INC-R*, BAK-R*, DEB-R*, SEC-R*, KNO-R*) are globally unique
- [ ] No duplication of `14-deployment-guide.md` (rollback, release), `16-qa-testing-guide.md` (testing, quality gates), or `17-contributing-guide.md` (workflow)

---

## 15. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| **RISK-MNT-01** | Sole maintainer (bus factor = 1) — project stalls if unavailable | High | Medium | Knowledge transfer (§12). Backup maintainer designated. |
| **RISK-MNT-02** | Dependency rot — unmaintained packages accumulate vulnerabilities | Medium | Medium | Monthly `npm audit`. Quarterly upgrades. Dependabot alerts. |
| **RISK-MNT-03** | Content staleness — tea data becomes outdated or inaccurate | Medium | Medium | Quarterly content review. Source verification on each check. |
| **RISK-MNT-04** | Performance degradation — incremental changes erode speed | Medium | High | Weekly performance checks. Regression protocol (§7.2). |
| **RISK-MNT-05** | Vercel platform change — pricing, API, or feature deprecation | Low | Low | Annual platform review. Documented alternative (Netlify, Cloudflare Pages). |
| **RISK-MNT-06** | AI image regeneration inconsistency — cannot reproduce exact asset style | Medium | Low | All prompts saved in `12-assets-guide.md`. Original assets backed up. |
| **RISK-MNT-07** | Knowledge loss — undocumented decisions and context evaporate | High | Medium | "Document everything" (MNT-P03). Handoff practiced annually. |

---

## 16. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| **MNT-Q01** | Who is the designated backup maintainer? | Bus factor risk | Before launch |
| **MNT-Q02** | What is the budget for paid tools (Sentry, analytics, monitoring) after free tiers exhaust? | Monitoring coverage | Before free tier limit reached |
| **MNT-Q03** | What is the long-term hosting strategy if Vercel free tier is insufficient? | Cost and migration planning | Before traffic exceeds 100GB/month |
| **MNT-Q04** | Should content updates (new teas, stories) follow the task-based workflow or a separate content workflow? | Process clarity | Before first post-launch content addition |
| **MNT-Q05** | What is the archival strategy if the project is ever discontinued? | Historical preservation | Not urgent, but document before any wind-down |

---

## 17. References

| Document | Relationship |
|---|---|
| `14-deployment-guide.md` | Rollback procedure (§17), release process (§16), CI/CD (§15), security headers (§14) |
| `16-qa-testing-guide.md` | Quality gates (§15), testing standards (§4), performance budgets (§10) |
| `17-contributing-guide.md` | Branch strategy, commit conventions, PR requirements |
| `15-project-rules.md` | Governance, rule priority, change management |
| `10-development-roadmap.md` | Task definitions for tech debt and improvement work |
| `12-assets-guide.md` | Asset regeneration prompts, directory structure |
| `13-content-guide.md` | Content validation checklist, writing standards |
| `07-tea-content-system.md` | Data schemas for content maintenance |

---

## 18. Implementation Checklist

- [ ] MNT-IMPL-001: Set up weekly Sentry + Vercel Analytics review routine
- [ ] MNT-IMPL-002: Configure Dependabot for automated dependency alerts
- [ ] MNT-IMPL-003: Set up uptime monitoring (Vercel Analytics or external)
- [ ] MNT-IMPL-004: Configure `npm audit` in CI pipeline
- [ ] MNT-IMPL-005: Create GitHub Issue labels: `tech-debt`, `incident`, `maintenance`
- [ ] MNT-IMPL-006: Create incident post-mortem template in project wiki or docs
- [ ] MNT-IMPL-007: Document all environment variables in secure shared storage
- [ ] MNT-IMPL-008: Designate backup maintainer + verify access
- [ ] MNT-IMPL-009: Set up secondary Git remote (GitLab mirror)
- [ ] MNT-IMPL-010: Create monthly content export script (`npm run export-content`)
- [ ] MNT-IMPL-011: Schedule recurring calendar events for weekly/monthly/quarterly checks
- [ ] MNT-IMPL-012: Create project health dashboard (GitHub project board or similar)
- [ ] MNT-IMPL-013: Perform first quarterly review within 3 months of launch
- [ ] MNT-IMPL-014: Archive initial backup of all assets to off-platform storage

---

## 19. Documentation Phase Complete

> **The Tea Atlas documentation suite (00–18) is complete.** These 19 documents define every aspect of the project: identity, requirements, architecture, design, animation, data, components, development, assets, content, deployment, governance, QA, contribution, and maintenance.
>
> **Next phase:** Implementation by Codex according to `10-development-roadmap.md`.
>
> No further specification documents are created unless new project requirements are introduced. Existing documents are updated in-place when code changes, requirements evolve, or errors are found.

---

> This document is the long-term care plan for Tea Atlas. Projects don't die from bad code — they die from neglect. Weekly checks, monthly audits, quarterly reviews, and annual reflection keep the project alive, healthy, and trustworthy. The maintenance guide ensures that Tea Atlas is not just built well, but sustained well.
