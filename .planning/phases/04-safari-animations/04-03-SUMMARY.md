---
phase: 04-safari-animations
plan: 03
subsystem: widgets/philosophy-clients
tags: [motion, reveal, boneyard-teardown, d-04, d-05, d-09]
requires:
  - 04-01 (motion dependency + global MotionConfig)
provides:
  - Philosophy narrow-stack card 03 (team) reveal via motion.div (per D-05 defaults)
  - BoneyardSkeleton consumer count decreased by 1 (9 remaining)
affects:
  - src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx
tech_stack_added: []
patterns:
  - Pattern A (BoneyardSkeleton → motion fade) applied to ONE card only
  - D-04 minimum-diff — two reveal systems intentionally coexist in this file
  - D-09-style conservatism — useInViewOnce + CSS REVEAL classes left untouched
key_files_created: []
key_files_modified:
  - src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx
decisions:
  - Card 03 alone gets motion.div; cards 01/02/04/05 keep CSS-class reveal via useInViewOnce (D-04/D-09)
  - useState import removed (teamCardLoaded was the sole consumer)
  - viewport.amount=0.1 used per plan guidance for philosophy/team cards
metrics:
  tasks_completed: 1
  tasks_total: 1
  completed_date: 2026-04-22
requirements:
  - SAFARI-01
  - ANI-02
---

# Phase 04 Plan 03: Philosophy Narrow-Stack Team Card → motion.div Summary

**One-liner:** Replaced the sole `<BoneyardSkeleton>` wrapper (around card 03 «Команда») in `philosophy-clients-narrow-stack.tsx` with a `<motion.div>` opacity fade using the D-05 canonical props, while leaving the file's own `useInViewOnce` + `REVEAL/REVEAL_ON/REVEAL_OFF` CSS reveal system for surrounding cards untouched (D-04 minimum-diff).

## Scope

Wave 2. Single file, single surgical edit. Depends on Plan 04-01 (motion dependency + MotionConfig already wired globally).

Explicitly NOT in scope (D-04):
- Migrating the file's `useInViewOnce` + CSS-class reveal to motion (deferred — stable as-is)
- Touching cards 01, 02, 04, 05
- Touching hover transitions, `transition-*` Tailwind classes (D-09)

## What Was Done

### Task 1 — Migrate card 03 (team) to motion.div fade (commit `52011de`)

**Edits to `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx`:**

1. Removed `import { useState } from "react";` (sole consumer `teamCardLoaded` removed below)
2. Removed `import { BoneyardSkeleton } from "@/shared/ui/boneyard-skeleton";`
3. Added `import { motion } from "motion/react";`
4. Removed `const [teamCardLoaded, setTeamCardLoaded] = useState(false);`
5. Replaced the `<BoneyardSkeleton loading={!teamCardLoaded} name=...>` wrapper + its inner `<div className={cn(cardBox, "bg-[#0d0300]", h)}>` with a single `<motion.div>` carrying the D-05 reveal props:
   ```tsx
   <motion.div
     className={cn(cardBox, "bg-[#0d0300]", h)}
     initial={{ opacity: 0 }}
     whileInView={{ opacity: 1 }}
     viewport={{ once: true, amount: 0.1 }}
     transition={{ duration: 0.22, ease: "easeOut" }}
   >
   ```
6. Removed `onLoad={() => setTeamCardLoaded(true)}` and `onError={() => setTeamCardLoaded(true)}` from the team-photo `<Image>`.

Diff size: 8 insertions, 11 deletions, 1 file.

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Type safety | `pnpm typecheck` | exit 0 (clean) |
| Lint (modified file) | `npx eslint src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` | 0 errors (1 pre-existing warning — see below) |
| Production build | `pnpm build` | exit 0, 9/9 pages generated |
| Post-commit deletion check | `git diff --diff-filter=D --name-only HEAD~1 HEAD` | empty (no deletions) |

**Pre-existing lint warning** (out of scope per plan note):
`21:3  warning  'MARQUEE_GAP_360_PX' is defined but never used` — same unused-import warning noted in 04-01 SUMMARY; not introduced by this plan.

## What Was Intentionally Left Untouched (D-04 / D-09)

Per PATTERNS.md §philosophy-clients-narrow-stack:

- `useInViewOnce` hook — used by outer `<div ref={stackRef}>` and drives cards 01/02/03/04/05 reveal via CSS classes.
- `REVEAL` / `REVEAL_ON` / `REVEAL_OFF` class constants (lines 28–36) — stable on Safari in current production behavior.
- `cardReveal()` helper and `cardRevealStyle(index)` helper — unchanged, still wrap card 03 externally (the `motion.div` is nested inside that wrapper).
- Cards 01, 02, 04, 05 JSX — not touched.
- `PhilosophyClientsNarrowClientsBlock` (clients marquee block) — not touched.

**Dual reveal observation (T-04-06 mitigation):**
Card 03 is now wrapped by two reveals that compose cleanly:
1. Outer `<div className={cardReveal()} style={cardRevealStyle(2)}>` — CSS transform+opacity on stack entry (useInViewOnce).
2. Inner `<motion.div>` — opacity-only on motion's own viewport trigger.

Both animate opacity, but the outer pipeline delays ~260ms via `cardRevealStyle(2)` while inner motion fades in 220ms. End state is opacity=1 in both, so there is no sustained conflict. Safari UAT (Plan 04-05 D-11 checklist item #1) will confirm no visual artifacts.

## Deviations from Plan

None. Plan executed exactly as written. Commit prefix used `refactor(04-03):` per plan instructions (addendum in additional_context overrode the `refactor(04):` pattern shown in done-criteria).

## Files Touched

**Modified:**
- `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` — 3 import adjustments, 1 useState removal, 1 wrapper swap, 2 Image handler removals.

**NOT touched:**
- No other file modified in this plan.

## Commits

| Hash | Message |
|------|---------|
| `52011de` | refactor(04-03): migrate philosophy-narrow-stack team card to motion.div fade |

## Threat Mitigations Applied

- **T-04-06 (dual reveal coexistence):** Mitigated by isolation — motion.div reveal is applied ONLY to the inner card 03 container. The outer useInViewOnce+REVEAL class system operates on a separate wrapping `<div>`. Manual Safari verification deferred to Plan 04-05 D-11.
- **T-04-07 (observer cost):** Mitigated by `viewport.once: true` — motion observer disconnects after the single trigger.

## Pre-flight for Wave 2 continuation

After this plan, remaining BoneyardSkeleton consumers:
- `src/widgets/cases/ui/cases-section-{360,480,768,1024,1440}.tsx`
- `src/widgets/philosophy-clients/ui/philosophy-clients-{1024,1440}.tsx`
- `src/widgets/team/ui/team-section-photo.tsx`

Teardown (delete `boneyard-skeleton.tsx`, `src/bones/`, `boneyard-js` dep) is Plan 04-06 — do NOT run before all consumers are migrated.

## Self-Check: PASSED

- FOUND: src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx (modified)
- FOUND: commit 52011de in git log
- CONFIRMED: no BoneyardSkeleton import in modified file
- CONFIRMED: motion imported from motion/react in modified file
- CONFIRMED: useInViewOnce + REVEAL class constants present and unchanged (lines 10, 27–34)
- CONFIRMED: pnpm typecheck exit 0, pnpm build exit 0, eslint 0 errors on file
