---
phase: 01-quick-wins-stack-audit
plan: "01"
subsystem: ui
tags: [react, tailwind, next.js, forms, accessibility]

requires: []
provides:
  - "Privacy link opens in new tab without toggling consent checkbox (FORM-02)"
  - "Submit button text visually centered across all 5 consultation modal breakpoints (FORM-03)"
affects:
  - "01-02"
  - "01-03"

tech-stack:
  added: []
  patterns:
    - "Privacy links with stopPropagation use target=_blank + rel=noopener noreferrer"
    - "Fixed-height flex buttons (h-[Npx] items-center justify-center) need no vertical padding for centering"

key-files:
  created: []
  modified:
    - src/widgets/lead-form/ui/lead-form-fields.tsx
    - src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx
    - src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx
    - src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx
    - src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx
    - src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx

key-decisions:
  - "Removed only pb-[Npx] pt-[Npx] from button classNames; retained h-[Npx] + flex items-center justify-center which provide correct centering without padding"
  - "stopPropagation preserved on privacy link to prevent checkbox toggle when following link"

patterns-established:
  - "Pattern 1: Fixed-height buttons use flex centering — asymmetric padding overrides the centering and must be absent"
  - "Pattern 2: Privacy links in consent labels need stopPropagation + target=_blank so the link opens a new tab without toggling the checkbox"

requirements-completed:
  - FORM-02
  - FORM-03

duration: 8min
completed: 2026-04-22
---

# Phase 1 Plan 01: Form UX Bug Fixes Summary

**Privacy policy link opens in new tab without checkbox toggle (target=_blank + stopPropagation); submit button text centered in all 5 consultation modal breakpoints by removing asymmetric pb/pt padding**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-22T00:00:00Z
- **Completed:** 2026-04-22T00:08:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- FORM-02 fixed: privacy link in consent checkbox label now opens `/privacy` in a new tab (`target="_blank"` + `rel="noopener noreferrer"`) while `e.stopPropagation()` prevents the click from toggling the checkbox
- FORM-03 fixed: all 10 submit button occurrences across 5 consultation modal breakpoints (1440, 1024, 768, 480, 360px) have asymmetric `pb-[20px] pt-[Npx]` removed; fixed height + flex centering now works as intended
- TypeScript compilation passes with zero errors after both changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix FORM-02 — Add target=_blank and rel=noopener noreferrer to privacy link** - `43ff6b2` (fix)
2. **Task 2: Fix FORM-03 — Remove asymmetric padding from consultation modal submit buttons** - `cbebc8c` (fix)

## Files Created/Modified

- `src/widgets/lead-form/ui/lead-form-fields.tsx` — Added `target="_blank"` and `rel="noopener noreferrer"` to privacy `<a>` element
- `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx` — Removed `pb-[20px] pt-[24px]` from both button occurrences
- `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx` — Removed `pb-[20px] pt-[22px]` from both button occurrences
- `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx` — Removed `pb-[20px] pt-[19px]` from both button occurrences
- `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx` — Removed `pb-[20px] pt-[19px]` from both button occurrences
- `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx` — Removed `pb-[20px] pt-[17px]` from both button occurrences

## Decisions Made

- Retained `e.stopPropagation()` on the privacy link — this is the correct mechanism to prevent the click event from bubbling up to the `<label>` which would toggle the checkbox. Without it, clicking the link would also check/uncheck the box.
- Removed only the asymmetric `pb-[Npx] pt-[Npx]` pairs from button classNames. The existing `h-[Npx]` fixed height plus `flex items-center justify-center` already provides correct vertical centering — the explicit padding was overriding that centering.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

The `grep pb-[20px]` verification returned matches in non-button elements (form field wrappers with `border-b border-solid pb-[20px] pt-[10px]`). Confirmed these are intentional and unrelated to the button centering fix — only button classNames with the specific asymmetric padding pattern were modified.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- FORM-02 and FORM-03 are resolved; no regressions introduced
- TypeScript compilation clean
- Plans 01-02 (FORM-01 privacy page) and 01-03 (audit) can proceed independently

---
*Phase: 01-quick-wins-stack-audit*
*Completed: 2026-04-22*
