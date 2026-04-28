---
phase: 1
slug: quick-wins-stack-audit
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-22
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no jest/vitest/playwright config found in project root (Phase 6 adds tests) |
| **Config file** | None — no Wave 0 installs needed |
| **Quick run command** | `pnpm build` (TypeScript compile check) |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build` to confirm TypeScript still compiles
- **After every plan wave:** Run `pnpm build` + manual browser smoke-check
- **Before `/gsd-verify-work`:** `pnpm build` must be green; manual browser checks complete
- **Max feedback latency:** ~30 seconds (build) + ~5 minutes (manual smoke)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-FORM02 | 01 | 1 | FORM-02 | — | N/A | manual smoke | `pnpm build` | ✅ | ⬜ pending |
| 1-FORM03 | 01 | 1 | FORM-03 | — | N/A | manual visual | `pnpm build` | ✅ | ⬜ pending |
| 1-FORM01-global | 02 | 1 | FORM-01 | — | Public read access | manual smoke | `pnpm build` | ❌ W0 | ⬜ pending |
| 1-FORM01-page | 02 | 1 | FORM-01 | — | N/A | manual smoke | `pnpm build` | ❌ W0 | ⬜ pending |
| 1-FORM01-footer | 02 | 1 | FORM-01 | — | N/A | manual smoke | `pnpm build` | ✅ | ⬜ pending |
| 1-AUDIT01 | 03 | 2 | AUDIT-01 | — | N/A | file existence | `test -f .planning/AUDIT-STACK.md` | ❌ W0 | ⬜ pending |
| 1-AUDIT02 | 03 | 2 | AUDIT-02 | — | N/A | file existence | `test -f .planning/AUDIT-ANIMATIONS.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/cms/globals/privacy-page.ts` — new Payload Global (created by execution, not pre-existing)
- [ ] `src/app/(site)/privacy/page.tsx` — new App Router page (created by execution)
- [ ] `.planning/AUDIT-STACK.md` — created by AUDIT-01 task
- [ ] `.planning/AUDIT-ANIMATIONS.md` — created by AUDIT-02 task

*No test framework installation required — automated tests deferred to Phase 6.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/privacy` returns 200 and renders content | FORM-01 | No test framework in Phase 1 | Open `http://localhost:3000/privacy` in Chrome and Safari; confirm page loads with placeholder text and footer |
| Clicking "Политика конфиденциальности" opens new tab | FORM-02 | UI interaction; no test framework | Open form, click privacy link — new tab must open, checkbox must NOT toggle |
| Clicking consent label text toggles checkbox | FORM-02 | UI interaction | Click anywhere on label text except the link — checkbox must toggle |
| "Оставить заявку" button text is visually centered | FORM-03 | Visual verification | Open consultation modal at each breakpoint (1440, 1024, 768, 480, 360px); text must be vertically centered in button |
| Footer `/privacy` links work on all breakpoints | FORM-01 | Visual + navigation | Resize to each breakpoint; click footer privacy link — must navigate to `/privacy` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
