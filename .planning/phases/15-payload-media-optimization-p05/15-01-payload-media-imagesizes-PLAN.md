---
phase: 15-payload-media-optimization-p05
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/cms/collections/media.ts
  - scripts/regenerate-payload-media-sizes.ts
  - package.json
  - tests/unit/payload-media-image-sizes.test.ts
autonomous: true
requirements: [PERF-10]
must_haves:
  truths:
    - "Payload Media upload defines responsive AVIF and WebP image variants"
    - "Variants cover card-360, card-768, card-1440, and hero-1440 widths"
    - "Existing local uploads can be regenerated with an explicit dry-run/apply command"
    - "Video uploads remain supported and do not use broken image thumbnails"
  artifacts:
    - path: "src/cms/collections/media.ts"
      provides: "Payload imageSizes config and admin thumbnail guard"
    - path: "scripts/regenerate-payload-media-sizes.ts"
      provides: "existing upload regeneration command"
    - path: "tests/unit/payload-media-image-sizes.test.ts"
      provides: "unit guard for variants and upload wiring"
---

# Plan 15-01: Payload Media imageSizes

## Objective

Configure Payload Media to generate responsive AVIF/WebP variants on image upload, and provide a safe command to regenerate existing local uploads.

## Tasks

1. Add exported `payloadMediaImageSizes` with AVIF/WebP variants:
   - `card-360`
   - `card-768`
   - `card-1440`
   - `hero-1440`
2. Wire those variants into `Media.upload.imageSizes`.
3. Add admin thumbnail behavior that works for images and safely ignores videos.
4. Add `pnpm payload:media:regenerate` dry-run/apply command for existing uploads.
5. Add unit coverage and run typecheck/build.

## Verification

```bash
pnpm exec vitest run tests/unit/payload-media-image-sizes.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm payload:media:regenerate
pnpm build
```

