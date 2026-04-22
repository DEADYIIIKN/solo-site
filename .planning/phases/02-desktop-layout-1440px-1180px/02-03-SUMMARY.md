---
phase: 02-desktop-layout-1440px-1180px
plan: "03"
subsystem: philosophy-clients
tags: [layout, marquee, breakout, 1024px, 1180px, overflow]
dependency_graph:
  requires: []
  provides: [LY1180-01]
  affects: [philosophy-clients-1024]
tech_stack:
  added: []
  patterns: [100vw-breakout]
key_files:
  created: []
  modified:
    - src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx
decisions:
  - "100vw breakout (width: 100vw + marginLeft: calc(50% - 50vw)) вместо overflow-x-clip — стандартный CSS breakout pattern без изменения DOM-структуры"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-22T15:44:41Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 02 Plan 03: Marquee 100vw Breakout for philosophy-clients-1024 Summary

**One-liner:** Applied 100vw CSS breakout on marquee wrapper to escape the rigid 1024px container constraint, fixing logo strip clipping on 1024-1439px viewports (LY1180-01).

## What Was Built

Fixed `PhilosophyClients1024` component: the logo marquee strips were clipped to 1024px on wider viewports (1180px, 1280px) because the wrapper had `overflow-x-clip` and was nested inside a `w-[1024px] min-w-[1024px]` container. Replaced with a 100vw breakout using `width: 100vw` + `marginLeft: calc(50% - 50vw)`.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Apply 100vw breakout for marquee wrapper | e884df2 | philosophy-clients-1024.tsx |

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- TypeScript: `npx tsc --noEmit` — no errors
- Build: `npm run build` — passed, all 9 static pages generated
- No file deletions in commit

## Known Stubs

None.

## Threat Flags

None — pure CSS layout change with no security surface.

## Self-Check: PASSED

- [x] `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` — modified, exists
- [x] Commit e884df2 exists in git log
- [x] TypeScript clean
- [x] Build clean
