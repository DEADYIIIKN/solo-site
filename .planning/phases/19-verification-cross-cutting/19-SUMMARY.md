# Phase 19 — Verification (cross-cutting) SUMMARY

**Status:** Complete locally; official PSI shows demo deploy is stale  
**Started:** 2026-04-29  
**Completed:** 2026-04-29  
**Plans:** 2/2 complete locally  
**Requirements covered:** VERIFY-01 official PSI attempted + local verification · VERIFY-02 ✓

## Completed

### 19-01 PSI rerun baseline

- PageSpeed Insights rerun completed with an API key for all required pages/strategies.
- Official PSI shows the current demo deployment is stale relative to this branch (`/privacy` still has `noindex, nofollow` and wrong canonical).
- Local Lighthouse CLI is blocked by x64 Node / arm64 Chrome mismatch.
- Local production browser verification was collected and written to `.planning/research/AUDIT-PSI-v1.2-final.md`.

### 19-02 Perf smoke E2E

- Added mobile initial page-weight e2e guard.
- Added no-initial-MP4-request guard.
- Verified in dev-server and production-server modes.

## Verification

- `pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari` — pass
- `E2E_BASE_URL=http://127.0.0.1:3019 pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari` — pass

## External Follow-Up

After deploying this branch to demo, rerun official PageSpeed Insights for `/` and `/privacy` mobile/desktop and update `.planning/research/AUDIT-PSI-v1.2-final.md`.
