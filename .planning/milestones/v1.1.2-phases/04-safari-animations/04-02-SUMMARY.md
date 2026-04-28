---
phase: 04-safari-animations
plan: 02
subsystem: widgets/team
tags: [refactor, animation, motion, safari, reveal]
requires:
  - motion@^12.38.0 (installed in 04-01)
  - MotionConfig provider (wired in 04-01)
provides:
  - Team photo reveal via motion.div (Pattern A / D-05)
affects:
  - src/widgets/team/ui/team-section-photo.tsx
tech-stack:
  added: []
  patterns:
    - "Pattern A: BoneyardSkeleton → motion.div opacity fade (D-05 canonical reveal)"
    - "Pattern D: CSS hover transitions preserved (N/A here — no hovers on this component)"
key-files:
  created: []
  modified:
    - src/widgets/team/ui/team-section-photo.tsx
decisions:
  - "Applied Pattern A exactly as specified in 04-PATTERNS.md (D-05 reveal: initial opacity 0 → whileInView 1, viewport once amount 0.1, 220ms easeOut)"
  - "Did NOT add placeholder='blur' to <Image> — kept change minimal per plan A1 deferral note; FOUC risk on slow networks documented for Safari UAT in 04-05"
  - "Both default and narrow variants share the single motion.div root (no variant-specific reveal logic)"
requirements:
  - SAFARI-01
  - ANI-02
metrics:
  duration: ~5 minutes
  completed: 2026-04-22T21:09:03Z
  tasks_completed: 1
  files_changed: 1
commit: cb6cb5f
---

# Phase 04 Plan 02: Team Section Photo Migration Summary

Migrated `src/widgets/team/ui/team-section-photo.tsx` from `<BoneyardSkeleton>` wrapper + `useState` loaded gate to a single `<motion.div>` fade-in using the canonical D-05 reveal pattern, validating Pattern A end-to-end on the simplest BoneyardSkeleton consumer before Wave 3 touches scroll-hook-coupled widgets.

## What Was Done

**Task 1 — Replace BoneyardSkeleton with motion.div fade** (commit `cb6cb5f`)

- Removed `useState` import, `BoneyardSkeleton` import, `const [loaded, setLoaded] = useState(false)`, both `onLoad`/`onError` handlers on `<Image>`.
- Added `import { motion } from "motion/react"` and replaced the wrapper `<div>` with `<motion.div>`.
- Applied canonical motion props verbatim from Pattern A:
  - `initial={{ opacity: 0 }}`
  - `whileInView={{ opacity: 1 }}`
  - `viewport={{ once: true, amount: 0.1 }}`
  - `transition={{ duration: 0.22, ease: "easeOut" }}`
- Preserved `className` composition order, `style` prop pass-through, `variant` branching, all `<Image>` sizing/src/className props exactly.
- `TeamSectionPhotoProps` and `TeamSectionPhoto` export signatures unchanged.
- File size: 79 → 67 lines (-12 lines, removed state plumbing).

## Patterns Applied

- **Pattern A (D-05)** — canonical reveal. Applied unchanged.
- **Pattern B** — N/A (no pre-existing `style.transform` on this component).
- **Pattern D (D-09)** — N/A (this component has no hover transitions to preserve).

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `pnpm typecheck` — exits 0. No type errors.
- `npx eslint src/widgets/team/ui/team-section-photo.tsx` — clean, zero warnings/errors on modified file.
- `pnpm build` — exits 0. Full production build succeeds; `/` route static-prerendered (page consuming TeamSectionPhoto).

**Pre-existing lint errors in other files** (privacy/page.tsx `<a>` tag, philosophy-clients-narrow-stack.tsx undefined BoneyardSkeleton / unused motion import, next-env.d.ts triple-slash) were **observed but out of scope** — none are caused by this plan's changes, and plan scope is strictly `src/widgets/team/ui/team-section-photo.tsx`. They will be resolved by later plans in Wave 2 (04-03 philosophy-narrow-stack) and Wave 4 (04-06 final teardown).

## Deferred / Known Risks

- **A1 FOUC risk** (from 04-RESEARCH.md): removing the `onLoad`-gated `loaded` state may expose black `bg-[#0d0300]` flash on slow networks before `<Image>` decodes. Deliberately not mitigated in this plan (plan body line 186 instructs "Do NOT add placeholder here — keep the change minimal"). Will be re-evaluated during Safari UAT in Plan 04-05; mitigation path is `placeholder="blur"` on `<Image>`.

## Must-Haves Compliance

- [x] Team photo section fades in from opacity 0 → 1 once when it enters the viewport (Safari + Chrome behavior equivalent via motion's RAF-based animation).
- [x] No shimmer placeholder, no `<BoneyardSkeleton>` wrapper, no loaded state gate.
- [x] Both variants (default and narrow) use the same motion reveal.
- [x] Artifact `src/widgets/team/ui/team-section-photo.tsx` contains `motion.div`.
- [x] Key link: `import { motion } from "motion/react"` present.

## Self-Check: PASSED

- FOUND: src/widgets/team/ui/team-section-photo.tsx
- FOUND commit: cb6cb5f
