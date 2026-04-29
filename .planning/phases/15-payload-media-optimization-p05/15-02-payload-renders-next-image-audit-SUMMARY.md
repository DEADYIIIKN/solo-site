# Plan 15-02 Summary — Payload renders next/image audit

**Status:** Complete locally  
**Requirement:** PERF-11  
**Date:** 2026-04-28

## What Changed

- Added `src/shared/lib/payload-media.ts` with shared Payload media source selection.
- Case data mapping now prefers generated Payload variants:
  - vertical cards: `card-768-avif` → `card-768-webp` → smaller fallbacks
  - advertising cards: `card-1440-avif` → `card-1440-webp` → smaller fallbacks
- Video media still falls back to original uploaded URL.
- Preview clients now use the shared helper and no longer set `unoptimized` on Payload card images.
- Added unit tests for source preference and static render audit.

## Audit Result

- Case card images render through `next/image` with explicit `sizes`.
- Case modal posters use `CaseModalVideoBlock`, which renders poster images through `next/image` with explicit `imageSizes`.
- Remaining raw `<img>` tags in cases are static SVG view icons, not Payload media.
- `secrets-posts` has a Payload `cover` field, but no public render path currently consumes it.

## Verification

- `pnpm exec vitest run tests/unit/payload-media-image-sizes.test.ts tests/unit/payload-media-src.test.ts tests/unit/payload-media-render-audit.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass

