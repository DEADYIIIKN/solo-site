# Phase 16 — Bundle & Fonts (P1) SUMMARY

**Status:** In progress  
**Started:** 2026-04-29  
**Plans:** 1/2 complete locally  
**Requirements covered:** PERF-06 ✓ · PERF-07 pending · PERF-08 pending

## Completed

### 16-01 Fonts WOFF2 subset

- Montserrat TTF files replaced with WOFF2 subset files.
- Font payload is now 320 KB, under the 350 KB budget.
- Unit guard, typecheck, and build pass.

## Remaining

### 16-02 Bundle analyzer / dynamic imports / console errors

- Add `pnpm analyze` / bundle analyzer path.
- Identify remaining unused JS opportunities.
- Investigate and remove `ERR_CONNECTION_FAILED` console errors.
- Re-check existing Tailwind generated CSS warning if it comes from shipped code.

