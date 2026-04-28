---
phase: 03-mobile-tablet-layout-820px-360px
plan: "01"
subsystem: cases-carousel
tags: [bug-fix, arrows, svg, carousel, mobile, tablet]
dependency_graph:
  requires: []
  provides: [correct-arrow-direction-cases-carousel]
  affects: [cases-section-360, cases-section-480, cases-section-768, cases-section-1024, cases-section-1440]
tech_stack:
  added: []
  patterns: [shared-ui-component, one-fix-all-breakpoints]
key_files:
  created: []
  modified:
    - src/widgets/cases/ui/cases-section-shared-ui.tsx
decisions:
  - "Single shared-ui fix covers all 5 breakpoints — no per-breakpoint changes needed"
metrics:
  duration: "~5 min"
  completed: "2026-04-22"
  tasks_completed: 1
  tasks_total: 2
  checkpoint_reached: true
requirements:
  - LY820-01
  - LY360-01
  - LY360-03
---

# Phase 3 Plan 01: Fix Cases Carousel Arrow Directions Summary

**One-liner:** Fixed swapped SVG chevron paths in CasesNavArrowIcon — back now shows left-pointing arrow, forward shows right-pointing arrow, covering all 5 breakpoints.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix cases carousel arrow directions | 0f482ba | src/widgets/cases/ui/cases-section-shared-ui.tsx |

## What Was Done

**Task 1 (LY820-01 + LY360-01):** Fixed one-line bug in `CasesNavArrowIcon` function in `cases-section-shared-ui.tsx` (line 25). The ternary expression had `CASES_ARROW_PATH_FIGMA_RIGHT_FILE` and `CASES_ARROW_PATH_FIGMA_LEFT_FILE` swapped, causing the "back" button to display a right-pointing chevron and the "forward" button to display a left-pointing chevron.

**Fix:** Swapped the two constant names in the ternary:
```
Before: variant === "back" ? CASES_ARROW_PATH_FIGMA_RIGHT_FILE : CASES_ARROW_PATH_FIGMA_LEFT_FILE
After:  variant === "back" ? CASES_ARROW_PATH_FIGMA_LEFT_FILE : CASES_ARROW_PATH_FIGMA_RIGHT_FILE
```

Since all breakpoint components (360/480/768/1024/1440) import from `cases-section-shared-ui.tsx`, this single fix corrects all breakpoints simultaneously.

**Verification passed:**
- grep confirms correct assignment in line 25
- Each constant appears exactly 2 times (declaration + usage)
- TypeScript compiles without errors

## Checkpoint: Human Verify Required

**Type:** checkpoint:human-verify (blocking)

**What was built:** Carousel arrow SVG paths have been swapped — "back" button (aria-label="Назад") now uses the left-pointing chevron, "forward" button (aria-label="Вперёд") now uses the right-pointing chevron.

**What to verify:**

1. Start dev server: `npm run dev`
2. Open browser DevTools → set viewport to **820px**
3. Navigate to the Cases section (кейсы)
4. Verify: left arrow (←) goes to previous case, right arrow (→) goes to next case
5. Switch viewport to **360px** → same check in the Cases section
6. Switch viewport to **1440px** → verify no regression (arrows still correct)
7. At **360px**: scroll to the "что мы делаем" (team section) → check if the team photo is visible
   - If photo IS visible: LY360-03 is resolved (was likely fixed in Phase 2)
   - If photo is NOT visible: describe what you see (blank space / skeleton / broken image)

**Resume signal — write one of:**
- `"approved"` — arrows correct on all breakpoints, team photo visible at 360px
- `"arrows ok, photo missing: [description]"` — arrows fixed but team photo gone
- `"issue: [description]"` — if something is wrong

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — LY360-03 (team photo at 360px) is not fixable by automation without visual browser check. Plan requires human verification to determine if it is already resolved from Phase 2 or needs additional work.

## Self-Check

- [x] Modified file exists: `src/widgets/cases/ui/cases-section-shared-ui.tsx`
- [x] Commit 0f482ba exists in git log
- [x] grep confirms correct ternary expression
- [x] TypeScript compiles without errors

## Self-Check: PASSED
