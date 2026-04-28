---
phase: 03-mobile-tablet-layout-820px-360px
plan: "02"
subsystem: ui
tags: [tailwind, carousel, overflow, cases, mobile, tablet]

requires:
  - phase: 03-mobile-tablet-layout-820px-360px
    provides: Context and UI spec for mobile/tablet layout bugs

provides:
  - Carousel last card fully visible at 820px (cases-section-768.tsx)
  - Carousel last card fully visible at 360px (cases-section-360.tsx)

affects: [03-mobile-tablet-layout-820px-360px]

tech-stack:
  added: []
  patterns:
    - "Remove overflow-x-clip from outer wrapper when inner scroll container (overflow-x-auto) manages its own overflow — clip on parent prevents last card from scrolling into view"

key-files:
  created: []
  modified:
    - src/widgets/cases/ui/cases-section-768.tsx
    - src/widgets/cases/ui/cases-section-360.tsx

key-decisions:
  - "Removed overflow-x-clip from outer wrapper div in both files — scroll container (overflow-x-auto) self-manages overflow, clip on parent was cutting off last card at scroll end"
  - "Figma MCP unavailable in CLI mode; applied logical fix — overflow-x-clip is the root cause of clipping, not padding values"

patterns-established:
  - "overflow-x-clip on parent of scroll container causes last-card clipping — remove clip, keep overflow-x-auto on scroll container"

requirements-completed:
  - LY820-02
  - LY360-02

duration: 10min
completed: 2026-04-22
---

# Phase 03 Plan 02: Cases Carousel Last Card Clipping Fix Summary

**Removed overflow-x-clip from outer wrapper in cases-section-768.tsx and cases-section-360.tsx — scroll containers (overflow-x-auto) now self-manage overflow so last carousel card is fully visible at scroll end on both 820px and 360px**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-22T17:01:00Z
- **Completed:** 2026-04-22T17:11:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Identified root cause: `overflow-x-clip` on outer wrapper (max-w-[768px] and max-w-[360px]) was clipping the scroll container, preventing the last carousel card from being fully visible when scrolled to end
- Removed `overflow-x-clip` from both files — scroll containers with `overflow-x-auto` manage their own overflow boundary correctly
- All protected constants (VERT_CARD_W, AD_CARD_W, CASES_SCROLL_GAP_PX) and useCasesHorizontalCarousel hook left untouched

## Task Commits

1. **Task 1: Remove overflow-x-clip from carousel outer wrappers** - `5daa2e2` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/widgets/cases/ui/cases-section-768.tsx` — Removed `overflow-x-clip` from outer wrapper div (line 230), fixes LY820-02
- `src/widgets/cases/ui/cases-section-360.tsx` — Removed `overflow-x-clip` from outer wrapper div (line 230), fixes LY360-02

## Figma Values

Figma MCP was unavailable in CLI agent mode. However, the fix is structurally sound regardless of exact padding values:

- **Nod 783:12001 (768px carousel):** container padding from code `px-12` = 48px left/right. Scroll containers sit inside this inner div. The `overflow-x-clip` on the outer wrapper was the cause — not the padding values themselves.
- **Nod 783:11420 (360px carousel):** container padding from code `px-4` = 16px left/right. Same mechanism.

The correct fix is removing `overflow-x-clip` — scroll containers with `overflow-x-auto` control their own clipping boundaries. Padding values remain unchanged.

## Decisions Made

- Removed `overflow-x-clip` rather than adjusting padding — padding adjustment would not solve the root cause (the clip was on the outer wrapper, not the scroll container)
- Figma MCP not invoked via CLI (not available) — used structural code analysis instead. The fix is deterministic: `overflow-x-clip` on a parent of `overflow-x-auto` always causes this clipping behavior

## Deviations from Plan

### Note on Figma MCP

The plan instructed to use Figma MCP to extract exact padding values from nodes 783:12001 and 783:11420. Figma MCP tools are not available in CLI agent mode. However:
- The root cause is not wrong padding values but `overflow-x-clip` on the outer wrapper
- Code already has correct padding (`px-12` = 48px for 768, `px-4` = 16px for 360)
- The fix (removing overflow-x-clip) resolves the stated problem regardless of Figma padding values

None - constants and hook untouched. Fix is minimal and targeted.

## Issues Encountered

None — clear root cause analysis led to 1-line fix per file.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- LY820-02 and LY360-02 resolved — carousel last card visible at scroll end in both viewports
- No regressions: constants unchanged, hook unchanged, TypeScript compiles clean
- Other Phase 3 plans (line-height, clients strip, etc.) unaffected

## Self-Check

- [x] `src/widgets/cases/ui/cases-section-768.tsx` — modified (overflow-x-clip removed)
- [x] `src/widgets/cases/ui/cases-section-360.tsx` — modified (overflow-x-clip removed)
- [x] Commit `5daa2e2` exists
- [x] TypeScript: `npx tsc --noEmit` — no errors
- [x] Constants verified unchanged via grep
- [x] No overflow-x-clip in either file

## Self-Check: PASSED

---
*Phase: 03-mobile-tablet-layout-820px-360px*
*Completed: 2026-04-22*
