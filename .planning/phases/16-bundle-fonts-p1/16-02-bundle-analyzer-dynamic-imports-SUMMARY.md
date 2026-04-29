# Plan 16-02 Summary — Bundle analyzer / dynamic imports / console errors

**Status:** Complete locally  
**Requirements:** PERF-07, PERF-08  
**Date:** 2026-04-29

## What Changed

- Added `@next/bundle-analyzer` and `pnpm analyze`.
- Wrapped `next.config.ts` with analyzer support enabled only when `ANALYZE=true`.
- Split the shared consultation modal behind `next/dynamic` in all 5 breakpoint wrappers.
- Split delayed `TgPopup` UI behind `next/dynamic` from `TgPopupHost`.
- Added unit guards for analyzer wiring and modal bundle splitting.
- Removed a Tailwind scanner false positive from a source comment that generated `.min-[…]:block` CSS warning.

## Result

- `pnpm analyze` generates:
  - `.next/analyze/client.html`
  - `.next/analyze/nodejs.html`
  - `.next/analyze/edge.html`
- Production mobile smoke on `/` reports 0 browser console warnings/errors and 0 failed requests.
- `pnpm build` no longer emits the prior Tailwind `.min-[…]:block` warning.

## Verification

- `pnpm exec vitest run tests/unit/consultation-modal-dynamic-import.test.ts tests/unit/bundle-analyzer-config.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- `pnpm analyze` — pass
- Playwright production mobile smoke (`http://127.0.0.1:3016/`) — pass, `logs: []`, `failed: []`

## Notes

PSI unused-JS confirmation remains part of Phase 19 final audit because it requires a fresh deployed URL measurement, not only local analyzer output.
