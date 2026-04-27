---
phase: 04-safari-animations
plan: 04
subsystem: widgets/cases
tags: [motion, reveal, boneyard-teardown, d-04, d-05, d-09]
requires:
  - 04-01 (motion dependency + global MotionConfig)
provides:
  - Cases section narrow breakpoints (360/480/768) reveal via motion.article (D-05 defaults, viewport.amount=0.15)
  - BoneyardSkeleton consumer count decreased by 3 files / 6 wrapper instances (6 remaining consumers in 4 files: cases 1024/1440, philosophy 1024/1440)
affects:
  - src/widgets/cases/ui/cases-section-360.tsx
  - src/widgets/cases/ui/cases-section-480.tsx
  - src/widgets/cases/ui/cases-section-768.tsx
tech_stack_added: []
patterns:
  - Pattern A (BoneyardSkeleton → motion fade) applied to 6 card components (2 per file × 3 files)
  - Pattern D (CSS hover transitions preserved verbatim — grayscale, mix-blend-color, transition-[filter], casesCardHoverEase)
  - No Pattern B / Pattern C needed — these files have no scroll-driven style.transform and no useCasesPinScrollProgress consumption
key_files_created: []
key_files_modified:
  - src/widgets/cases/ui/cases-section-360.tsx
  - src/widgets/cases/ui/cases-section-480.tsx
  - src/widgets/cases/ui/cases-section-768.tsx
decisions:
  - Three structurally identical files migrated symmetrically — identical diffs modulo dimension/class tokens
  - Three atomic commits (one per file) per Plan's bisect-safety requirement
  - viewport.amount=0.15 applied to cards (per Pattern A tuning for smaller elements — more of card visible before reveal)
  - useState import preserved in all three files — outer CasesSection{360|480|768} still uses it for detailCard / adDetailCard modal state
  - BoneyardSkeleton import removed from all three files; `motion` import added alphabetically between `next/image` and `react` (matches Plan 04-02 pattern)
metrics:
  tasks_completed: 3
  tasks_total: 3
  completed_date: 2026-04-22
requirements:
  - SAFARI-01
  - ANI-02
---

# Phase 04 Plan 04: Cases Sections 360/480/768 → motion.article Summary

**One-liner:** Migrated the three narrow cases breakpoints (360/480/768) from `<BoneyardSkeleton>`-wrapped `<article>` to `<motion.article>` with the D-05 fade reveal (`initial opacity:0 → whileInView opacity:1`, `viewport.once=true amount=0.15`, `transition duration=0.22 easeOut`), removing all `imageLoaded` state and `onLoad/onError` image callbacks. Three symmetric file edits, three atomic commits, no Pattern B or C needed — CSS hover (grayscale, mix-blend-color) preserved verbatim (Pattern D / D-09).

## Scope

Wave 3 of Phase 04. Depends on 04-01 (motion package + MotionConfig), and follows the narrow-widget migration pattern established in 04-02 (team-section-photo) and 04-03 (philosophy-narrow-stack team card).

Explicitly out of scope:
- cases-section-1024 / cases-section-1440 (Plan 04-05 — these consume `useCasesPinScrollProgress` and need Pattern C care)
- philosophy-clients 1024 / 1440 (Plan 04-05 — need Pattern B preservation of `style.transform`)
- `boneyard-skeleton.tsx` deletion + `package.json` cleanup (Plan 04-06 — atomic teardown)
- CSS hover behavior (D-09, preserved verbatim)
- Carousel scroll logic, modals, `SectionEyebrowRow`, background grid, nav arrows

## What Was Done

### Task 1 — Migrate cases-section-360.tsx (commit `0d51b04`)

- `VerticalCard360`: `<article>` → `<motion.article>` with D-05 props (viewport.amount=0.15). Removed `const [imageLoaded, setImageLoaded] = useState(false);` and the surrounding `<BoneyardSkeleton loading={!imageLoaded} name="cases-vertical-card-360">` wrapper. Removed `onLoad` / `onError` on `<Image>`.
- `AdCard360`: identical transformation (AD_CARD_W=242, AD_CARD_H=135; overlay `opacity-20 group-hover:opacity-10`). Removed `imageLoaded` state, `<BoneyardSkeleton>` wrapper, `onLoad`/`onError`.
- Imports: removed `BoneyardSkeleton` from `@/shared/ui/boneyard-skeleton`; added `import { motion } from "motion/react";` between `next/image` and `react` (matches 04-02 import ordering).
- `useState` import preserved — outer `CasesSection360` uses it for `detailCard` / `adDetailCard`.

### Task 2 — Migrate cases-section-480.tsx (commit `3009300`)

- Same transformation as Task 1. `VerticalCard480` (VERT_CARD_W=208, VERT_CARD_H=376, rounded-[6px]) and `AdCard480` (AD_CARD_W=320, AD_CARD_H=178) now use `<motion.article>` with identical D-05 + viewport.amount=0.15 props.
- All hover classes (grayscale, mix-blend-color, opacity-20/group-hover:opacity-10, casesCardHoverEase) preserved verbatim.
- Imports updated identically to Task 1.

### Task 3 — Migrate cases-section-768.tsx (commit `3110fce`)

- Same transformation as Tasks 1 and 2. `VerticalCard768` (VERT_CARD_W=242, VERT_CARD_H=437, rounded-[8px]) and `AdCard768` (AD_CARD_W=414, AD_CARD_H=231).
- D-05 motion props + viewport.amount=0.15 applied; hover/mix-blend classes preserved.
- Full project `pnpm build` run as final validation — completed successfully.

## Verification

- `pnpm typecheck`: green after each task (no TS errors anywhere).
- `pnpm lint` on the three modified files: no new warnings or errors from these files. Pre-existing unrelated issues (`src/app/(site)/privacy/page.tsx` no-html-link-for-pages; `philosophy-clients-narrow-stack.tsx` unused `MARQUEE_GAP_360_PX`) are untouched — logged here for awareness but out of scope per Rule "SCOPE BOUNDARY".
- `pnpm build`: Next.js production build succeeded in 21.9s after Task 3. All 9 static pages generated. Route `/` first-load 241 kB.
- `grep` confirms: zero `BoneyardSkeleton` / `imageLoaded` / `setImageLoaded` / `onLoad` / `onError` references remain in the three files. Six `motion.article` occurrences across the three files (open+close tags × 2 cards × 3 files = 12 grep hits; 6 semantic instances).

## Deviations from Plan

None - plan executed exactly as written. Pattern A + Pattern D applied to all 6 card components. No Rule 1/2/3 auto-fixes triggered. No Rule 4 architectural questions.

## Deferred Issues

The `pnpm lint` output surfaces two pre-existing issues **not caused by this plan** — logged to phase's deferred items rather than fixed here (SCOPE BOUNDARY):

- `src/app/(site)/privacy/page.tsx:54` — `<a>` should be `<Link />` (unrelated file).
- `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx:21` — unused `MARQUEE_GAP_360_PX` constant (pre-existing from 04-03; likely harmless cleanup for a future pass).

## Threat Surface Audit

No new network endpoints, auth paths, or trust-boundary schema changes introduced. `onClick` / `onKeyDown` handlers on `motion.article` preserve identical semantics to the previous `<article>` (T-04-10 accept disposition from plan). No `threat_flag` entries needed.

## Self-Check: PASSED

- **Files exist:**
  - src/widgets/cases/ui/cases-section-360.tsx — FOUND
  - src/widgets/cases/ui/cases-section-480.tsx — FOUND
  - src/widgets/cases/ui/cases-section-768.tsx — FOUND
- **Commits exist:**
  - 0d51b04 (cases-section-360) — FOUND
  - 3009300 (cases-section-480) — FOUND
  - 3110fce (cases-section-768) — FOUND
- **Grep invariants hold:**
  - 0 BoneyardSkeleton / imageLoaded references in the 3 files
  - 6 semantic motion.article instances across the 3 files
- **Build:** pnpm typecheck + pnpm build both green.
