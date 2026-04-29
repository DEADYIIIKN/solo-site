# Phase 17 — Video Lazy Loading (P1) SUMMARY

**Status:** Complete locally  
**Started:** 2026-04-29  
**Completed:** 2026-04-29  
**Plans:** 1/1 complete locally  
**Requirements covered:** PERF-09 ✓

## Completed

### 17-01 Local video lazy loading

- Local `public/assets/video/bts-ozon.mp4` restored as the default showreel video.
- `NEXT_PUBLIC_SHOWREEL_VIDEO` remains an override, not the only source.
- Critical preload no longer includes video.
- Mobile initial load does not request the MP4.
- Showreel video starts loading after scroll toward the section.

## Verification

- `pnpm exec vitest run tests/unit/showreel-video-src.test.ts tests/unit/showreel-video-lazy-loading.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- Production mobile smoke initial load — `logs: []`, `failed: []`, `videoRequests: []`
- Production mobile smoke after scroll — `/assets/video/bts-ozon.mp4` requested

## Deferred To Next Version

- Re-encode local video to a smaller web MP4.
- Consider optional secondary WebM/AV1 source for browsers where it is safe.
- Keep MP4/H.264 as the compatibility baseline unless next-version requirements say otherwise.
