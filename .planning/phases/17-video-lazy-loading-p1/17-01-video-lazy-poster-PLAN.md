---
phase: 17-video-lazy-loading-p1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/assets/video/bts-ozon.mp4
  - src/widgets/showreel/model/showreel.data.ts
  - src/widgets/showreel/ui/showreel.tsx
  - src/widgets/showreel/ui/showreel-morph-overlay.tsx
  - src/widgets/first-screen/ui/first-screen-hero-video-poster.tsx
  - src/widgets/first-screen/ui/first-screen-hero-1440.tsx
  - src/widgets/site-load/model/site-load-critical-assets.ts
  - tests/unit/showreel-video-src.test.ts
  - tests/unit/showreel-video-lazy-loading.test.ts
autonomous: true
requirements: [PERF-09]
must_haves:
  truths:
    - "Default showreel video source is local /assets/video/bts-ozon.mp4"
    - "Mobile initial pageload does not request the local MP4"
    - "Video begins loading after user scrolls toward the showreel"
    - "Critical site-load preloader never preloads video"
  artifacts:
    - path: "public/assets/video/bts-ozon.mp4"
      provides: "local showreel video asset"
    - path: "tests/unit/showreel-video-lazy-loading.test.ts"
      provides: "lazy-loading regression guard"
---

# Plan 17-01: Local video lazy loading

## Objective

Restore the local showreel video as the default source while preventing it from being requested during mobile initial pageload.

## Tasks

1. Restore `public/assets/video/bts-ozon.mp4`.
2. Update showreel source fallback to local asset while preserving `NEXT_PUBLIC_SHOWREEL_VIDEO` override.
3. Remove video from critical site-load preload assets.
4. Prevent hidden desktop hero video from receiving a `src` on mobile.
5. Gate showreel video rendering behind user scroll + intersection.
6. Gate morph-overlay video `src` assignment until morph progress starts.
7. Add unit tests for local fallback and lazy-load contract.
8. Verify production browser behavior on mobile.

## Verification

```bash
pnpm exec vitest run tests/unit/showreel-video-src.test.ts tests/unit/showreel-video-lazy-loading.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm build
```

Production smoke:

- Initial mobile load: `logs: []`, `failed: []`, `videoRequests: []`
- After scroll: `videoRequests` includes `/assets/video/bts-ozon.mp4`
