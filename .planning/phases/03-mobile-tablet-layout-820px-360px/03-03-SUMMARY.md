---
phase: 03-mobile-tablet-layout-820px-360px
plan: "03"
subsystem: philosophy-clients
tags:
  - marquee
  - layout
  - 100vw-breakout
  - gap
  - 360px
  - 820px
dependency_graph:
  requires: []
  provides:
    - PhilosophyClientsMarquee1024 with gapPx prop (default=60)
    - PhilosophyClientsNarrowClientsBlock with 100vw breakout and marqueeGapPx prop
  affects:
    - philosophy-clients-768.tsx (uses NarrowClientsBlock — now 100vw breakout, gap=60 unchanged)
    - philosophy-clients-360.tsx (uses NarrowClientsBlock with marqueeGapPx=20)
tech_stack:
  added: []
  patterns:
    - 100vw breakout (width:100vw + marginLeft:calc(50%-50vw)) — same as Phase 2 philosophy-clients-1024.tsx
    - gapPx prop with numeric default for runtime-configurable CSS gap
key_files:
  created: []
  modified:
    - src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx
    - src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx
    - src/widgets/philosophy-clients/ui/philosophy-clients-360.tsx
decisions:
  - "gapPx prop added as number (not className string) — cleaner than gap-[Npx] dynamic Tailwind"
  - "marqueeGapPx added to PhilosophyClientsNarrowClientsBlock with default=60 so 768px behavior unchanged"
  - "MARQUEE_GAP_360_PX=20 used for 360px — Figma MCP unavailable, value inferred from design proportions (p-[20px] padding in same component); requires visual verification"
metrics:
  duration_seconds: 512
  completed_date: "2026-04-22"
  tasks_completed: 2
  files_modified: 3
---

# Phase 03 Plan 03: Marquee Width (820px) and Gap (360px) Summary

PhilosophyClientsNarrowClientsBlock gets 100vw breakout replacing overflow-x-clip, and PhilosophyClientsMarquee1024 receives configurable gapPx prop with 20px for 360px viewport and default 60px for all others.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Add gapPx prop to PhilosophyClientsMarquee1024 and MarqueeTrack | 7e9b63e | philosophy-clients-marquee-1024.tsx |
| 2 | Apply 100vw breakout and marqueeGapPx prop in NarrowClientsBlock | b74c692 | philosophy-clients-narrow-stack.tsx, philosophy-clients-360.tsx |

## What Was Built

### Task 1 — gapPx prop in MarqueeTrack and PhilosophyClientsMarquee1024

- Added `gapPx?: number` prop to `MarqueeTrack` with `default=60`
- Replaced hardcoded `gap-[60px]` className string with `style={{ gap: gapPx }}` in the track div
- Updated `commitWidth` calculation to use `gapPx` instead of removed constant `MARQUEE_GAP_PX`
- Added `gapPx?: number` prop to exported `PhilosophyClientsMarquee1024` with `default=60`
- Removed `gap-[60px]` from `darkStripClass` and `orangeStripClass` string literals
- Passed `gapPx` to both `MarqueeTrack` calls inside `PhilosophyClientsMarquee1024`
- Exported `MARQUEE_GAP_360_PX = 20` constant for 360px viewport

### Task 2 — 100vw breakout and marqueeGapPx prop

- Replaced `overflow-x-clip w-full max-w-full` on marquee wrapper in `PhilosophyClientsNarrowClientsBlock` with `style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}`
- Added `marqueeGapPx?: number` prop to `PhilosophyClientsNarrowClientsBlock` with `default=60` (preserves 768px/820px behavior)
- Passed `marqueeGapPx` to `PhilosophyClientsMarquee1024 gapPx` prop
- Updated `PhilosophyClients360` to import `MARQUEE_GAP_360_PX` and pass `marqueeGapPx={MARQUEE_GAP_360_PX}` to `PhilosophyClientsNarrowClientsBlock`
- `PhilosophyClients768` (820px layout) unchanged — gets `marqueeGapPx=60` by default

## Verification Results

1. `npx tsc --noEmit` — passed, no errors
2. `grep 100vw narrow-stack.tsx` — present (line 432)
3. `grep overflow-x-clip narrow-stack.tsx` — absent in marquee wrapper
4. `grep gapPx marquee-1024.tsx` — 8 occurrences: prop in MarqueeTrack, type, 2× logic, style, prop in Marquee1024, 2× MarqueeTrack calls
5. `grep marqueeGapPx narrow-stack.tsx` — 3 occurrences: prop, type, usage
6. Visual verification at 820px and 360px — requires browser testing (no preview server in worktree)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added marqueeGapPx prop to PhilosophyClientsNarrowClientsBlock**

- **Found during:** Task 2 implementation
- **Issue:** Plan instructed to pass `gapPx={GAP_360}` directly in `PhilosophyClientsNarrowClientsBlock`. However, `PhilosophyClientsNarrowClientsBlock` is used by BOTH `PhilosophyClients768` (820px, should keep gap=60) and `PhilosophyClients360` (360px, needs gap=20). Hardcoding `MARQUEE_GAP_360_PX` would break 820px gap.
- **Fix:** Added `marqueeGapPx?: number` prop with `default=60` to `PhilosophyClientsNarrowClientsBlock`. Updated `PhilosophyClients360` to pass `MARQUEE_GAP_360_PX`. `PhilosophyClients768` uses default=60, unchanged.
- **Files modified:** philosophy-clients-narrow-stack.tsx, philosophy-clients-360.tsx
- **Commit:** b74c692

**2. [Note - Figma MCP Unavailable] MARQUEE_GAP_360_PX = 20 (inferred, not Figma-extracted)**

- **Issue:** Plan requires Figma MCP to extract exact gap for 360px clients section. Figma MCP tools were not available in this agent (upstream tool restriction), and no FIGMA_TOKEN found in project environment files.
- **Value chosen:** 20px — rationale: (a) same as `p-[20px]` padding in the marquee strip itself, (b) proportionally consistent with 360px viewport vs 60px for 1024px viewport, (c) standard mobile marquee gap convention.
- **Action required:** Visual verification at 360px. If gap looks wrong, update `MARQUEE_GAP_360_PX` in `philosophy-clients-marquee-1024.tsx` line 12 with Figma-exact value.

## Known Stubs

None — all code paths wired with real values. `MARQUEE_GAP_360_PX=20` is a real value (not a placeholder), but requires visual confirmation as noted in Deviations.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundary changes. Pure CSS layout modification.

## Self-Check: PASSED

- [x] `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx` — FOUND
- [x] `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` — FOUND
- [x] `src/widgets/philosophy-clients/ui/philosophy-clients-360.tsx` — FOUND
- [x] Commit 7e9b63e — FOUND in git log
- [x] Commit b74c692 — FOUND in git log
- [x] TypeScript: no errors
- [x] `100vw` in narrow-stack.tsx: present
- [x] `overflow-x-clip` in marquee wrapper: absent
- [x] `gapPx` in marquee-1024.tsx: 8 occurrences (MarqueeTrack prop+type+logic×2+style, Marquee1024 prop+2×calls)
