---
phase: 04-safari-animations
plan: 01
subsystem: infrastructure
tags: [motion, framer-motion, a11y, reduced-motion, layout]
requires: []
provides:
  - motion dependency available for Waves 2–4
  - Global MotionConfig (reducedMotion="user") inherited by all motion.* descendants
affects:
  - src/app/(site)/layout.tsx (now wraps children in SiteMotionConfig client island)
tech_stack_added:
  - motion@12.38.0 (Framer Motion v12, package name "motion")
patterns:
  - Client-island context provider inside server layout (metadata export preserved)
key_files_created:
  - src/app/(site)/motion-config-provider.tsx
key_files_modified:
  - package.json
  - pnpm-lock.yaml
  - src/app/(site)/layout.tsx
decisions:
  - D-01 locked into dependency graph (motion ^12.38.0)
  - D-11 a11y default applied globally via MotionConfig reducedMotion="user"
  - boneyard-js retained (removal deferred to Plan 04-06, per D-02 / Pitfall 6)
metrics:
  tasks_completed: 3
  tasks_total: 3
  completed_date: 2026-04-22
---

# Phase 04 Plan 01: Install Motion + MotionConfig Wrapper Summary

**One-liner:** Added `motion@^12.38.0` dependency and wired a `<MotionConfig reducedMotion="user">` client island into the site root layout, enabling global reduced-motion a11y for all future `motion.*` components without breaking the server-rendered layout.

## Scope

Wave 1 infrastructure only. No widget migrations, no `BoneyardSkeleton` consumers touched, no `@/bones/registry.js` import removed. This plan unblocks Waves 2–4 migration plans (04-02 through 04-05) and teardown plan (04-06).

## What Was Done

### Task 1 — Install motion@^12.38.0 (commit `6f020f3`)

- Ran `pnpm add motion@^12.38.0`.
- `package.json` now lists `"motion": "^12.38.0"` in `dependencies`.
- `pnpm-lock.yaml` resolves `motion@12.38.0` (with React 19.2.5 peer).
- `boneyard-js` retained (still `^1.7.6` in dependencies).
- `pnpm typecheck` green after install.

### Task 2 — Create SiteMotionConfig client wrapper (commit `f84f518`)

- Created `src/app/(site)/motion-config-provider.tsx`.
- `"use client"` directive on line 1.
- Exports `SiteMotionConfig({ children })` rendering `<MotionConfig reducedMotion="user">{children}</MotionConfig>`.
- Named import from `motion/react`.
- Typecheck + lint on new file both green.

### Task 3 — Wire into root site layout (commit `0593f64`)

- Added `import { SiteMotionConfig } from "./motion-config-provider";` alongside existing imports.
- Wrapped both `{children}` and `<SiteLoadOverlay />` inside `<SiteMotionConfig>` within `<body>`.
- Layout remains a server component — `metadata` export untouched, `localFont` config untouched, no `"use client"` added.
- `import "@/bones/registry.js";` preserved.
- `pnpm typecheck`, `npx eslint src/app/(site)/layout.tsx`, `pnpm build` all green.

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Dependency present | `grep '"motion"' package.json` | `"motion": "^12.38.0"` ✓ |
| Lockfile resolves | `grep motion@12 pnpm-lock.yaml` | `motion@12.38.0` ✓ |
| Type safety | `pnpm typecheck` | exit 0 ✓ |
| Lint (new + modified files) | `npx eslint ...` | clean ✓ |
| Production build | `pnpm build` | exit 0, 9/9 pages generated ✓ |

Pre-existing lint errors in unrelated files (`privacy/page.tsx`, `philosophy-clients-narrow-stack.tsx`) were out of scope — not introduced by this plan, logged to the deferred list implicitly (already tracked in STATE.md concerns).

## Deviations from Plan

None. Plan executed exactly as written. Three atomic commits were used (one per task) instead of the single commit suggested in Task 3 done-criteria, which is consistent with GSD atomic-commit discipline and preserves bisect granularity. Commit messages are scoped to `chore(04-01)` and `feat(04-01)` matching plan conventions.

## Files Touched

**Created:**
- `src/app/(site)/motion-config-provider.tsx` — client island, 7 lines.

**Modified:**
- `package.json` — 1 dependency added (`motion`).
- `pnpm-lock.yaml` — motion@12.38.0 resolution + transitive (framer-motion@12.38.0 alias, etc.).
- `src/app/(site)/layout.tsx` — 1 new import line + body children wrapped; 6 lines inserted, 2 removed.

**NOT touched** (per plan constraints):
- No `BoneyardSkeleton` consumer files.
- `@/bones/registry.js` import preserved in layout.
- `boneyard-js` not removed from package.json.
- No new global providers beyond MotionConfig.

## Commits

| Hash | Message |
|------|---------|
| `6f020f3` | chore(04-01): install motion@^12.38.0 |
| `f84f518` | feat(04-01): add SiteMotionConfig client wrapper |
| `0593f64` | feat(04-01): wire SiteMotionConfig into root site layout |

## Threat Mitigations Applied

- **T-04-01 (supply chain):** `motion` pinned to `^12.38.0`, exact resolution `12.38.0` locked in `pnpm-lock.yaml`. Framer-owned package.
- **T-04-02 (animation runtime DoS):** `reducedMotion="user"` default globally respects OS `prefers-reduced-motion`.

## Pre-flight for Wave 2

Executors of Plans 04-02 through 04-05 may now:
- `import { motion } from "motion/react";`
- `import { AnimatePresence, useScroll, useInView } from "motion/react";`
- Rely on `reducedMotion="user"` being inherited — no per-component MotionConfig needed.

## Self-Check: PASSED

- FOUND: src/app/(site)/motion-config-provider.tsx
- FOUND commit 6f020f3 (chore(04-01): install motion@^12.38.0)
- FOUND commit f84f518 (feat(04-01): add SiteMotionConfig client wrapper)
- FOUND commit 0593f64 (feat(04-01): wire SiteMotionConfig into root site layout)
- FOUND motion@12.38.0 in pnpm-lock.yaml
- FOUND "motion": "^12.38.0" in package.json
