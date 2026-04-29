# Plan 15-01 Summary — Payload Media imageSizes

**Status:** Complete locally  
**Requirement:** PERF-10  
**Date:** 2026-04-28

## What Changed

- Added Payload Media responsive image variants:
  - `card-360-avif`
  - `card-360-webp`
  - `card-768-avif`
  - `card-768-webp`
  - `card-1440-avif`
  - `card-1440-webp`
  - `hero-1440-avif`
  - `hero-1440-webp`
- Wired variants into `Media.upload.imageSizes`.
- Enabled Media admin preview and safe generated thumbnail for images.
- Kept video uploads supported; videos return no generated image thumbnail.
- Added `pnpm payload:media:regenerate`.
  - Dry-run: `pnpm payload:media:regenerate`
  - Apply: `PAYLOAD_REGENERATE_MEDIA_APPLY=1 pnpm payload:media:regenerate`
- Added unit coverage for variant names, formats, widths, and upload wiring.

## Verification

- `pnpm exec vitest run tests/unit/payload-media-image-sizes.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm payload:media:regenerate` — pass, dry-run found 8 local image media docs

## Next

Run `15-02-payload-renders-next-image-audit`: choose Payload size URLs intentionally in render helpers and verify there are 0 raw `<img>` regressions for Payload media.

