# Phase 17 Context — Video Lazy Loading

## Scope

Phase 17 implements lazy loading for the local showreel video.

The previous Phase 13 env-only decision was superseded by product requirement on 2026-04-29: the showreel video must remain available as a local asset. Therefore `NEXT_PUBLIC_SHOWREEL_VIDEO` remains supported as an override, but the default source is local:

- `/assets/video/bts-ozon.mp4`

## Constraints

- Mobile initial pageload must not request `/assets/video/bts-ozon.mp4`.
- The local video may load after user scrolls toward the showreel.
- Video format/codec optimization is not part of v1.2 Phase 17. It is backlog for the next version.
- Because the original local MP4 is 56 MB, `/public/assets` is currently above the prior `<60 MB` inventory target. Initial page weight is protected by lazy loading; file-size optimization is deferred to the next version.

## Verification Signals

- Unit guard: `tests/unit/showreel-video-lazy-loading.test.ts`
- Unit guard: `tests/unit/showreel-video-src.test.ts`
- Production browser smoke:
  - initial mobile load: `videoRequests: []`
  - after scroll: `/assets/video/bts-ozon.mp4` requested
