---
phase: 19-verification-cross-cutting
plan: 02
type: execute
wave: 1
depends_on: [19-01-psi-rerun-baseline]
files_modified:
  - playwright.config.ts
  - package.json
  - tests/e2e/perf-smoke.spec.ts
autonomous: true
requirements: [VERIFY-02]
must_haves:
  truths:
    - "E2E perf smoke fails if mobile initial bytes exceed 1.5 MB"
    - "E2E perf smoke fails if local showreel MP4 loads on initial mobile view"
    - "Spec can run against dev server or explicit E2E_BASE_URL production server"
  artifacts:
    - path: "tests/e2e/perf-smoke.spec.ts"
      provides: "mobile page-weight regression guard"
---

# Plan 19-02: Perf smoke E2E

## Objective

Add an automated regression guard for mobile home initial page weight and accidental eager video loading.

## Tasks

1. Add `tests/e2e/perf-smoke.spec.ts`.
2. Add `test:e2e:perf` script.
3. Let Playwright skip auto-starting dev server when `E2E_BASE_URL` is provided.
4. Verify the spec in dev-server mode.
5. Verify the spec against production server via `E2E_BASE_URL`.

## Verification

```bash
pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari
E2E_BASE_URL=http://127.0.0.1:3019 pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari
```
