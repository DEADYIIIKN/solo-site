# Performance Audit — v1.2 final verification

**Date:** 2026-04-29  
**Primary target:** `demo.soloproduction.pro`  
**Local production target:** `http://127.0.0.1:3019`  
**Baseline:** `.planning/research/AUDIT-PSI.md`

## Official PSI Status

PageSpeed Insights API was rerun with an API key on 2026-04-29.

Post-deploy update, 2026-04-30:

- The stale demo blocker recorded on 2026-04-29 has been removed: the current code was deployed to demo/prod and both containers were verified healthy.
- GitHub Actions deploy completed successfully.
- A post-deploy PageSpeed Insights rerun was attempted on 2026-04-30, but Google returned API quota 429 before fresh scores were produced.
- The 2026-04-29 PSI numbers below are therefore retained as historical pre-deploy evidence and should not be treated as current deployed scores.

## Official PSI Results — Historical Pre-Deploy Demo Snapshot

| Page | Strategy | Perf | A11y | BP | SEO | LCP | TBT | FCP | SI | Total Bytes | Console | Crawlable | Canonical |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| `/` | mobile | 55 | 96 | 96 | 100 | 6.3s | 530ms | 1.8s | 7.6s | 1,327 KiB | fail | pass | pass |
| `/` | desktop | 64 | 100 | 92 | 100 | 1.5s | 640ms | 0.2s | 2.8s | 6,700 KiB | fail | pass | pass |
| `/privacy` | mobile | 57 | 100 | 100 | 61 | 5.6s | n/a | n/a | n/a | 896 KiB | fail | fail | fail |
| `/privacy` | desktop | 77 | 100 | 96 | 61 | 1.2s | 440ms | 0.3s | 1.4s | 897 KiB | pass | fail | fail |

The first mobile `/privacy` PSI request returned a transient Lighthouse 500; a retry succeeded and is recorded above.

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

## Post-Deploy Measurement Follow-Up

Phase 19 implementation, deployment, and local verification are complete. Official PSI target confirmation remains a measurement follow-up:

1. Rerun PageSpeed Insights for:
   - `https://demo.soloproduction.pro/` mobile
   - `https://demo.soloproduction.pro/` desktop
   - `https://demo.soloproduction.pro/privacy` mobile
   - `https://demo.soloproduction.pro/privacy` desktop
2. Update this file with official PSI scores from the updated demo deploy.
