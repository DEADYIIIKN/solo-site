---
phase: 19-verification-cross-cutting
plan: 01
type: verify
wave: 1
depends_on: [13, 14, 15, 16, 17, 18]
files_modified:
  - .planning/research/AUDIT-PSI-v1.2-final.md
autonomous: true
requirements: [VERIFY-01]
must_haves:
  truths:
    - "Attempt PageSpeed Insights rerun for all required pages/strategies"
    - "Record external PSI blocker if the API is unavailable"
    - "Record local production verification signals"
  artifacts:
    - path: ".planning/research/AUDIT-PSI-v1.2-final.md"
      provides: "final local audit and external PSI blocker record"
---

# Plan 19-01: PSI rerun baseline

## Objective

Rerun or attempt final performance verification for `/` and `/privacy` across mobile and desktop, then document results.

## Tasks

1. Attempt PageSpeed Insights API for all 4 combinations.
2. Record PSI quota blocker if API is unavailable.
3. Attempt local Lighthouse CLI and record environment blocker if it cannot produce valid numbers.
4. Collect local production browser transfer/SEO/console signals.
5. Write `.planning/research/AUDIT-PSI-v1.2-final.md`.

## Verification

- PSI API attempted — blocked by `429 RESOURCE_EXHAUSTED`.
- Lighthouse CLI attempted — blocked by x64 Node / arm64 Chrome guard.
- Playwright local production browser metrics collected.
