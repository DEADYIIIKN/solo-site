# Performance Audit — v1.2 final local verification

**Date:** 2026-04-29  
**Primary target:** `demo.soloproduction.pro`  
**Local production target:** `http://127.0.0.1:3019`  
**Baseline:** `.planning/research/AUDIT-PSI.md`

## External PSI Status

PageSpeed Insights API could not be rerun from this environment.

All 4 requested combinations (`/` and `/privacy`, mobile and desktop) returned:

```text
429 RESOURCE_EXHAUSTED
Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
quota_limit_value: 0
```

Because the external PSI API is quota-blocked, final Lighthouse scores must be rerun after deploy from an environment/API key with PageSpeed quota.

## Local Lighthouse CLI Status

`pnpm dlx lighthouse@latest` could not run valid local Lighthouse measurements on this machine:

```text
Launching Chrome on Mac Silicon (arm64) from an x64 Node installation results in Rosetta translating the Chrome binary...
```

The CLI correctly refused to produce misleading performance numbers. Local score-like Lighthouse values are therefore not recorded.

## Local Production Browser Verification

Collected with Playwright Chromium against production build served at `http://127.0.0.1:3019`.

| Page | Strategy | Transfer | Encoded | Scripts | Images | CSS | Console | Failed Requests | Video Initial |
|---|---|---:|---:|---:|---:|---:|---|---|---|
| `/` | mobile | 901 KB | 891 KB | 254 KB | 316 KB | 17 KB | 0 | 0 | 0 requests |
| `/` | desktop | 6,431 KB | 6,418 KB | 254 KB | 5,840 KB | 17 KB | 0 | video aborts on close | requested |
| `/privacy` | mobile | 508 KB | 507 KB | 135 KB | 42 KB | 17 KB | 0 | 0 | 0 requests |
| `/privacy` | desktop | 515 KB | 507 KB | 135 KB | 42 KB | 17 KB | 0 | 0 | 0 requests |

## SEO Verification

| Page | Canonical | Robots |
|---|---|---|
| `/` | `https://demo.soloproduction.pro` | `index, follow` |
| `/privacy` | `https://demo.soloproduction.pro/privacy` | `index, follow` |

`/sitemap.xml` includes `https://demo.soloproduction.pro/privacy`.

## Regression Guard

Added `tests/e2e/perf-smoke.spec.ts`.

The guard asserts:

- Mobile home initial load does not request `/assets/video/bts-ozon.mp4`.
- Mobile home initial response/transfer bytes stay under `1,500,000`.

Verification:

```bash
pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari
E2E_BASE_URL=http://127.0.0.1:3019 pnpm exec playwright test tests/e2e/perf-smoke.spec.ts --project=mobile-safari
```

Both passed in this phase.

## Baseline Comparison

| Metric | Baseline | Final Local Signal | Status |
|---|---:|---:|---|
| Mobile `/` weight | 3,783 KB | 901 KB | Improved; under 1.2 MB local target |
| Mobile `/` initial video | 57 MB possible | 0 requests | Fixed |
| Mobile `/privacy` transfer | not separately itemized | 508 KB | Under 1.2 MB |
| `/privacy` SEO crawlable | fail | `index, follow` | Fixed locally |
| `/privacy` canonical | missing | present | Fixed locally |
| Console errors | 3× failed resources | 0 on mobile `/` and `/privacy` | Fixed locally |

## Remaining External Gate

Phase 19 local verification is complete, but final PSI scores remain an external deploy/API gate:

1. Deploy current branch to demo.
2. Rerun PageSpeed Insights for:
   - `https://demo.soloproduction.pro/` mobile
   - `https://demo.soloproduction.pro/` desktop
   - `https://demo.soloproduction.pro/privacy` mobile
   - `https://demo.soloproduction.pro/privacy` desktop
3. Update this file with official PSI scores once quota is available.
