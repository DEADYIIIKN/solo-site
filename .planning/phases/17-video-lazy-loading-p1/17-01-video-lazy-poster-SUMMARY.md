# Plan 17-01 Summary — Local video lazy loading

**Status:** Complete locally  
**Requirement:** PERF-09  
**Date:** 2026-04-29

## What Changed

- Restored local showreel video at `public/assets/video/bts-ozon.mp4`.
- Changed default showreel source back to local `/assets/video/bts-ozon.mp4`; `NEXT_PUBLIC_SHOWREEL_VIDEO` still overrides it.
- Removed video from `SiteLoadOverlay` critical preload assets.
- Changed hero video elements to `preload="none"` and withheld `src` on mobile hidden desktop layouts.
- Changed showreel section video to render only after user scroll + section intersection.
- Changed morph overlay to set video `src` only after morph progress starts.
- Added unit regression guards for local fallback and lazy-loading behavior.

## Result

- Mobile initial production load does not request `/assets/video/bts-ozon.mp4`.
- After a small scroll, the local MP4 starts loading.
- Browser console smoke is clean.

## Verification

- `pnpm exec vitest run tests/unit/showreel-video-src.test.ts tests/unit/showreel-video-lazy-loading.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- Production mobile smoke initial load — pass, `logs: []`, `failed: []`, `videoRequests: []`
- Production mobile smoke after scroll — pass, `/assets/video/bts-ozon.mp4` requested

## Notes

Video format/codec optimization is intentionally not part of Phase 17. It is tracked in roadmap backlog for the next version.
