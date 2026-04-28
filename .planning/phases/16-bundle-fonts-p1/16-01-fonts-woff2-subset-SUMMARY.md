# Plan 16-01 Summary — Fonts WOFF2 subset

**Status:** Complete locally  
**Requirement:** PERF-06  
**Date:** 2026-04-29

## What Changed

- Converted 8 Montserrat TTF files to subset WOFF2 files.
- Updated `src/app/(site)/layout.tsx` to use `.woff2` sources through `next/font/local`.
- Removed tracked TTF files.
- Added `tests/unit/site-font-assets.test.ts` to prevent TTF regression and enforce the 350 KB budget.

## Result

- Before: Montserrat TTF directory total was **1.4 MB**.
- After: Montserrat WOFF2 directory total is **320 KB**.

## Verification

- `pnpm exec vitest run tests/unit/site-font-assets.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass

## Notes

Build still reports the existing Tailwind generated CSS warning for `.min-[…]:block`. That warning is not caused by the font conversion and remains in scope for 16-02 if it maps to shipped source.

