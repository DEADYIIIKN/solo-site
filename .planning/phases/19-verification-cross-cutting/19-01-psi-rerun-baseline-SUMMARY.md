# Plan 19-01 Summary — PSI rerun baseline

**Status:** Complete locally; official PSI shows demo deploy is stale  
**Requirement:** VERIFY-01  
**Date:** 2026-04-29

## What Happened

- Ran PageSpeed Insights API with an API key for `/` and `/privacy`, mobile and desktop.
- Official PSI results describe the current demo deployment, which is stale relative to this branch.
- Demo `/privacy` still returns `noindex, nofollow` and canonical to `/`, while local production verification returns `index, follow` and canonical `/privacy`.
- Attempted local Lighthouse CLI via `pnpm dlx lighthouse@latest`.
- Lighthouse refused to run because x64 Node would launch arm64 Chrome through Rosetta on Apple Silicon.
- Collected local production browser metrics with Playwright instead.

## Result

- Final PSI score confirmation remains a deploy gate.
- Local production browser verification is documented in `.planning/research/AUDIT-PSI-v1.2-final.md`.

## Key Local Signals

- Mobile `/`: 901 KB transfer, 0 console errors, 0 failed requests, 0 initial MP4 requests.
- Mobile `/privacy`: 508 KB transfer, canonical present, `index, follow`.
