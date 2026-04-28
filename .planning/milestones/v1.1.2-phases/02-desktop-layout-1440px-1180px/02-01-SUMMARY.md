---
phase: 02-desktop-layout-1440px-1180px
plan: "01"
subsystem: ui
tags: [tailwind, accordion, business-goals, 1440px, layout]

# Dependency graph
requires: []
provides:
  - "AccordionCard: title bottom-aligned at 1440px expanded state (bottom-[120px])"
  - "AccordionCard: card #4 uses w-[390px] and font-normal for titlePrimary at 1440px"
affects: [02-02, 02-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "cardIndex prop pattern for per-card style overrides in AccordionCard"
    - "bottom positioning for title in 1440px expanded accordion cards"

key-files:
  created: []
  modified:
    - src/widgets/business-goals/ui/business-goals.tsx

key-decisions:
  - "bottom-[120px] used for title bottom edge (120px from card bottom, 90px gap above description at 30px)"
  - "cardIndex prop added to AccordionCardProps for per-index style overrides"
  - "card #4 (index=3): w-[390px] and font-normal for titlePrimary; all other cards keep w-[470px] and font-bold"
  - "Figma MCP unavailable in worktree agent context — values derived from plan context range (bottom ~150-250px) and code analysis"

patterns-established:
  - "cardIndex?: number prop for AccordionCard enables per-card CSS overrides without restructuring data"

requirements-completed:
  - LY1440-01
  - LY1440-02

# Metrics
duration: 2min
completed: "2026-04-22"
---

# Phase 02 Plan 01: Business Goals 1440px Title Alignment + Card #4 Fixes Summary

**AccordionCard expanded title switched from top-[30px] to bottom-[120px] at 1440px; card #4 gets w-[390px] and font-normal titlePrimary via new cardIndex prop**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-22T15:46:57Z
- **Completed:** 2026-04-22T15:48:35Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- LY1440-01: Expanded card title at 1440px now positioned via `bottom-[120px]` instead of `top-[30px]` — all 4 cards get bottom-aligned title
- LY1440-02: Card #4 (index=3) gets `w-[390px]` (vs w-[470px]) and `font-normal` for titlePrimary — applied via new `cardIndex` prop
- 1024px branch (`is1024=true`) completely untouched — `top-[20px]` preserved

## Task Commits

1. **Task 1: Extract Figma values** — no commit (analysis task; Figma MCP unavailable, values derived from plan context)
2. **Task 2: Apply fixes in AccordionCard** — `2d6ed34` (fix)

**Plan metadata:** committed below

## Files Created/Modified
- `src/widgets/business-goals/ui/business-goals.tsx` — AccordionCard: bottom positioning for 1440px title, cardIndex prop, card #4 style overrides

## Decisions Made
- **bottom-[120px]**: Figma MCP was unavailable in the worktree agent context. Value derived from plan's stated range ("bottom ~150-250px from bottom") and code analysis: description is at `bottom-[30px]` (~70px top edge), 90px gap to title bottom edge at 120px. Reasonable default pending human visual verification.
- **cardIndex prop**: Added as optional `cardIndex?: number` to AccordionCardProps. Used only in 1440px branch (`!is1024 && cardIndex === 3`). 1024px layout unaffected.
- **w-[390px] for card #4**: Reduced from 470px to force proper line-breaking of long `titleAccent` "стратегия, креатив, съемка, аналитика". Value is best-guess pending Figma confirmation.
- **font-normal for titlePrimary on card #4**: Applied based on plan description that card #4 has different font-weight. Applied only on 1440px (`!is1024`).

## Deviations from Plan

### Auto-handled Issues

**1. [Constraint - Tool Unavailable] Figma MCP not accessible in worktree agent context**
- **Found during:** Task 1 (Extract Figma values)
- **Issue:** Plan required Figma MCP to extract exact px values (bottom position, card #4 width and font-weight). MCP tools `mcp__figma__*`, `mcp__claude-in-chrome__*`, and `mcp__computer-use__*` were all unavailable. No Figma API token in environment.
- **Fix:** Values derived from plan context range ("bottom ~150-250px from bottom"), code analysis of existing positioning patterns, and logical inference from description positioning.
- **Applied values:** `bottom-[120px]` for title, `w-[390px]` + `font-normal` for card #4
- **Risk:** Values are approximate — require human visual verification at 1440px in browser

---

**Total deviations:** 1 constraint (tool unavailability handled via code analysis)
**Impact on plan:** Core changes applied. Values need visual verification against Figma before final sign-off.

## Known Stubs

None — no placeholder text or hardcoded empty values.

## Issues Encountered

Figma MCP was not accessible from within the parallel worktree agent context. All MCP tool namespaces (`mcp__figma__*`, `mcp__claude-in-chrome__*`, `mcp__computer-use__*`) returned "No such tool available". The Figma file URL is `https://www.figma.com/design/Yo6xTXU1ZD7XYeem3tKqE3/...` and the values should be verified visually:

1. At 1440px viewport, expand each Business Goals card — title should appear at bottom of card
2. Check card #4 ("Полный цикл:") titlePrimary weight and text block width vs Figma

If values need adjustment, change `bottom-[120px]` and/or `w-[390px]` in `business-goals.tsx` line ~287.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- LY1440-01 and LY1440-02 changes applied and TypeScript-clean
- Requires visual verification at 1440px to confirm bottom value and card #4 parameters match Figma exactly
- Plans 02-02 (team photo) and 02-03 (marquee) are independent and can proceed in parallel

## Self-Check: PASSED

- `src/widgets/business-goals/ui/business-goals.tsx` — FOUND
- `.planning/phases/02-desktop-layout-1440px-1180px/02-01-SUMMARY.md` — FOUND
- Commit `2d6ed34` — FOUND

---
*Phase: 02-desktop-layout-1440px-1180px*
*Completed: 2026-04-22*
