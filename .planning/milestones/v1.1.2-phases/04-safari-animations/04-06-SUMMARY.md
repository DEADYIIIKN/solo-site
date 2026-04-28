---
phase: 04-safari-animations
plan: 06
subsystem: teardown
tags: [boneyard-teardown, pattern-e, atomic-commit, phase-close]
requires:
  - 04-01 (motion dependency)
  - 04-02..04-05 (all BoneyardSkeleton consumers migrated)
provides:
  - Zero `boneyard-js` runtime dependency
  - Zero `BoneyardSkeleton` references in source
  - Zero `src/bones/` build artifacts
  - Phase 4 closed
affects:
  - src/shared/ui/boneyard-skeleton.tsx (deleted)
  - src/bones/ (deleted — 15 .bones.json + registry.js)
  - src/app/(site)/layout.tsx (1 import line removed)
  - package.json (boneyard-js removed)
  - pnpm-lock.yaml (boneyard-js + transitive deps removed)
tech_stack_added: []
patterns:
  - Pattern E (single atomic teardown commit — never an intermediate broken state)
key_files_created: []
key_files_modified:
  - src/app/(site)/layout.tsx
  - package.json
  - pnpm-lock.yaml
key_files_deleted:
  - src/shared/ui/boneyard-skeleton.tsx
  - src/bones/cases-ad-card-1024.bones.json
  - src/bones/cases-ad-card-1440.bones.json
  - src/bones/cases-ad-card-360.bones.json
  - src/bones/cases-ad-card-480.bones.json
  - src/bones/cases-ad-card-768.bones.json
  - src/bones/cases-vertical-card-1024.bones.json
  - src/bones/cases-vertical-card-1440.bones.json
  - src/bones/cases-vertical-card-360.bones.json
  - src/bones/cases-vertical-card-480.bones.json
  - src/bones/cases-vertical-card-768.bones.json
  - src/bones/philosophy-team-card-1024.bones.json
  - src/bones/philosophy-team-card-1440.bones.json
  - src/bones/philosophy-team-card-360.bones.json
  - src/bones/philosophy-team-card-432.bones.json
  - src/bones/registry.js
  - src/bones/team-section-photo-default.bones.json
decisions:
  - Task 1 pre-flight grep confirmed zero unexpected residual references outside teardown targets and `.planning/` documentation.
  - `pnpm remove boneyard-js` used (not manual JSON edit) to guarantee lockfile consistency (T-04-18).
  - `pnpm build` is the authoritative missing-consumer detector per RESEARCH.md A6 — green build confirms all 10 consumers migrated correctly.
  - Lint shows 3 errors + 2 warnings that are pre-existing (confirmed via git-stash sanity check) — unrelated to teardown. Not treated as blockers.
metrics:
  tasks_completed: 5
  tasks_total: 5
  completed_date: 2026-04-23
  files_deleted_total: 17
  lines_removed: 1048
  commits: 1
requirements:
  - SAFARI-01
  - SAFARI-02
  - ANI-01
  - ANI-02
---

# Phase 04 Plan 04-06: Atomic Boneyard Teardown Summary

**One-liner:** Single atomic commit (Pattern E) that excises `boneyard-js` from the project: deletes `BoneyardSkeleton` component, `src/bones/` build artifacts directory (15 `.bones.json` + `registry.js`), removes the layout-side-effect import, and strips the dependency from `package.json` + `pnpm-lock.yaml`. Build green post-teardown, confirming all 10 consumers were correctly migrated in 04-02..04-05.

## Scope

Wave 5 / final plan of Phase 04. Depends on every preceding plan having migrated its consumers cleanly.

## Result

- 17 files deleted, 3 files modified, 1048 lines removed.
- Single commit: `a610b3e refactor(04): atomic teardown — remove boneyard-js, BoneyardSkeleton, and src/bones`.
- `pnpm typecheck` green.
- `pnpm build` green (A6 gap check authoritative).
- `pnpm lint` shows 3 errors + 2 warnings pre-dating this plan (verified via git-stash toggle).

## Phase 04 closure checklist

- [x] SAFARI-01 — motion reveal parity in Safari (UAT item 1 PASS, 04-05).
- [x] SAFARI-02 — pin-scroll parity (continuous rAF refactor in philosophy + services; cases pin was removed in 04-05 per UX call).
- [x] ANI-01 — cases scroll transition correct (UAT item 2 N/A — cases pin removed).
- [x] ANI-02 — smooth easing preserved (Pattern D hover + 220ms easeOut reveal; UAT item 3 PASS).
- [x] `boneyard-js` fully removed from runtime.

## Follow-ups for orchestrator

- Check off Phase 4 in `.planning/ROADMAP.md`.
- Update `.planning/STATE.md` to reflect Phase 4 complete.
- Pre-existing lint errors in `src/app/(site)/privacy/page.tsx:54` and `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx:21` are out of scope for this phase but should be queued as cleanup tickets.
