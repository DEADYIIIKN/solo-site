# Plan 13-03 Summary — Cleanup Public Assets Duplicates

**Status:** Complete  
**Requirement:** PERF-05  
**Commits:** `bf0f742`, `901378e`, `d483a8e`, `ea838d5`, `4d6b3b1`

## What Changed

- Removed the initial 16 dead or duplicated media files.
- Repointed mobile production-card assets to the desktop canonical JPG and deleted the duplicate PNG/JPG copies.
- Removed unused duplicate blog, ad-case/modal, footer-v2, and benefit-team exports.
- Removed bundled `public/assets/video/bts-ozon.mp4`; showreel video now comes only from `NEXT_PUBLIC_SHOWREEL_VIDEO`, with placeholder fallback when unset.
- Reduced `/public/assets` to **26 MB**, satisfying the `<60 MB` criterion.

## Removed Groups

- Hero PNG duplicates
- Team/showreel/traffic-image large sources replaced by optimized sources
- Per-breakpoint `rectangle75.png` duplicates
- Footer blog-card duplicate sources
- One-shot conversion script

## Verification

- `du -sm public/assets` now reports 108 MB.
- `du -sm public/assets public/assets/figma` reports `26 / 26`.
- `pnpm exec vitest run tests/unit/showreel-video-src.test.ts` passes.
- `pnpm exec tsc --noEmit -p tsconfig.json` passes.
- `pnpm build` passes.
