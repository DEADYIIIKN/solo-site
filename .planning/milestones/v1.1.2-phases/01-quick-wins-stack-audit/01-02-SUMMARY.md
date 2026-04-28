---
phase: 01-quick-wins-stack-audit
plan: "02"
subsystem: database
tags: [payload-cms, sqlite, globals, richtext]

# Dependency graph
requires: []
provides:
  - "PrivacyPage Payload Global (slug: privacy-page) with richText content field"
  - "privacy_page table in payload.db (schema pushed)"
affects:
  - 01-03-plan  # /privacy Next.js page that queries this Global

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Payload GlobalConfig singleton pattern for single-page CMS content"
    - "PAYLOAD_DATABASE_PUSH=1 pnpm dev for one-shot schema push without hot-reload conflicts"

key-files:
  created:
    - src/cms/globals/privacy-page.ts
  modified:
    - src/payload.config.ts

key-decisions:
  - "Used Payload Global (not Collection) for privacy page — single-instance content that never needs multiple records"
  - "Schema push done via PAYLOAD_DATABASE_PUSH=1 flag instead of migrations — consistent with existing db adapter pattern in payload.config.ts"
  - "pnpm payload generate:types skipped — pre-existing Node.js v24 / tsx ERR_REQUIRE_ASYNC_MODULE issue blocks type generation; not introduced by this plan"

patterns-established:
  - "GlobalConfig pattern: slug, label (Russian), admin.group (Russian category), access.read: () => true, fields"
  - "Schema push pattern: PAYLOAD_DATABASE_PUSH=1 pnpm dev — start, confirm init, Ctrl+C"

requirements-completed:
  - FORM-01

# Metrics
duration: ~15min
completed: 2026-04-22
---

# Phase 1 Plan 02: Privacy Page Payload Global — Summary

**PrivacyPage Payload Global with richText content field registered in payload.config.ts and privacy_page table pushed to SQLite via PAYLOAD_DATABASE_PUSH=1**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-22
- **Completed:** 2026-04-22
- **Tasks:** 2 (1 auto, 1 human-action)
- **Files modified:** 2

## Accomplishments

- Created `src/cms/globals/privacy-page.ts` — PrivacyPage GlobalConfig with slug `privacy-page`, Russian label, admin group "Контент", public read access, and richText `content` field
- Registered PrivacyPage in `src/payload.config.ts` globals array alongside SiteSettings
- Schema push confirmed — `privacy_page` table exists in `payload.db` (verified via `sqlite3 payload.db ".tables"`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PrivacyPage Global and register in config** - `74ca0e3` (feat)
2. **Task 2: Schema push via PAYLOAD_DATABASE_PUSH=1 pnpm dev** - human-action gate (no code commit; confirmed by user "schema pushed")

## Files Created/Modified

- `src/cms/globals/privacy-page.ts` — Payload GlobalConfig for the /privacy page with richText content field
- `src/payload.config.ts` — Added PrivacyPage import and added to globals array

## Decisions Made

- Used Payload Global (not Collection) — privacy policy is a singleton; Collections are for multi-record content
- Schema push via `PAYLOAD_DATABASE_PUSH=1 pnpm dev` — consistent with the existing `shouldPushDatabase` flag pattern already in `payload.config.ts`; avoids introducing a migration system that isn't part of the project's current workflow

## Deviations from Plan

### Known Issue: pnpm payload generate:types failure

`pnpm payload generate:types` was noted as failing with `ERR_REQUIRE_ASYNC_MODULE` (Node.js v24 / tsx compatibility issue). This is a **pre-existing issue** not introduced by this plan. The PrivacyPage type will not appear in `src/payload-types.ts` until this is resolved upstream. Plan 03 must use `any` cast or avoid importing the generated type until the toolchain issue is fixed.

- **Introduced by this plan:** No
- **Impact on this plan:** None — schema push and Global registration succeed independently of type generation
- **Impact on Plan 03:** Must not depend on generated `PrivacyPage` type from `payload-types.ts`

---

**Total deviations:** 0 auto-fixes. 1 known pre-existing issue documented.

## Issues Encountered

- `pnpm payload generate:types` fails with `ERR_REQUIRE_ASYNC_MODULE` on Node.js v24 — pre-existing issue, not caused by this plan. Type generation step was skipped.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 03 (`/privacy` Next.js page) can proceed: `payload.findGlobal({ slug: "privacy-page" })` will succeed since the table exists
- Plan 03 must not import `PrivacyPage` from `payload-types.ts` until the Node.js v24 / tsx type-generation issue is resolved
- Payload admin sidebar shows "Политика конфиденциальности" under "Контент" group

---
*Phase: 01-quick-wins-stack-audit*
*Completed: 2026-04-22*
