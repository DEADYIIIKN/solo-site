# Phase 16 — Bundle & Fonts (P1) SUMMARY

**Status:** Complete locally  
**Started:** 2026-04-29  
**Completed:** 2026-04-29  
**Plans:** 2/2 complete locally  
**Requirements covered:** PERF-06 ✓ · PERF-07 ✓ · PERF-08 ✓

## Completed

### 16-01 Fonts WOFF2 subset

- Montserrat TTF files replaced with WOFF2 subset files.
- Font payload is now 320 KB, under the 350 KB budget.
- Unit guard, typecheck, and build pass.

### 16-02 Bundle analyzer / dynamic imports / console errors

- `@next/bundle-analyzer` integrated behind `ANALYZE=true`.
- `pnpm analyze` generates client/nodejs/edge reports under `.next/analyze/`.
- Consultation modal and delayed Telegram popup UI are loaded through `next/dynamic`.
- Production mobile browser smoke on `/` is clean: `logs: []`, `failed: []`.
- The previous Tailwind generated CSS warning was traced to a source comment and removed.

## Verification

- `pnpm exec vitest run tests/unit/site-font-assets.test.ts` — pass in 16-01
- `pnpm exec vitest run tests/unit/consultation-modal-dynamic-import.test.ts tests/unit/bundle-analyzer-config.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- `pnpm analyze` — pass
