# Plan 19-02 Summary — Perf smoke E2E

**Status:** Complete locally  
**Requirement:** VERIFY-02  
**Date:** 2026-04-29

## What Changed

- Added `tests/e2e/perf-smoke.spec.ts`.
- Added `pnpm test:e2e:perf`.
- Updated Playwright config so `E2E_BASE_URL` disables the built-in dev-server startup and runs against an existing server.

## Guard Coverage

- Fails if mobile home initial page weight exceeds `1,500,000` bytes.
- Fails if `/assets/video/bts-ozon.mp4` is requested on initial mobile view.

## Verification

- `pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari` — pass
- `E2E_BASE_URL=http://127.0.0.1:3019 pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari` — pass
