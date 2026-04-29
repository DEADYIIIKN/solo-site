---
phase: 15-payload-media-optimization-p05
plan: 02
type: execute
wave: 2
depends_on: [15-01]
files_modified:
  - src/shared/lib/payload-media.ts
  - src/widgets/cases/lib/get-cases-for-site.ts
  - src/app/(site)/preview/cases-advertising/[id]/PreviewClient.tsx
  - src/app/(site)/preview/cases-vertical/[id]/PreviewClient.tsx
  - tests/unit/payload-media-src.test.ts
  - tests/unit/payload-media-render-audit.test.ts
autonomous: true
requirements: [PERF-11]
must_haves:
  truths:
    - "Payload image render helpers prefer generated size URLs over original uploads"
    - "Cases and preview cards render Payload images through next/image with explicit sizes"
    - "Video media keeps original URL for video playback"
    - "Raw img in cases remains limited to static SVG view icons, not Payload media"
  artifacts:
    - path: "src/shared/lib/payload-media.ts"
      provides: "shared Payload media URL selection"
    - path: "tests/unit/payload-media-render-audit.test.ts"
      provides: "static regression audit for Payload media render paths"
---

# Plan 15-02: Payload renders next/image audit

## Objective

Ensure Payload media render paths use generated responsive variants intentionally and stay on `next/image` with explicit `sizes`.

## Tasks

1. Replace local `mediaSrc` helpers with a shared `payloadMediaSrc`.
2. Prefer `card-768-*` for vertical cards and `card-1440-*` for advertising cards.
3. Keep video media on original URL fallback.
4. Remove preview `unoptimized` bypasses for Payload images.
5. Add unit/static audit coverage.

## Verification

```bash
pnpm exec vitest run tests/unit/payload-media-image-sizes.test.ts tests/unit/payload-media-src.test.ts tests/unit/payload-media-render-audit.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm build
```

