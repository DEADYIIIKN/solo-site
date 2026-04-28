# Plan 13-02 Summary — Hero Team Business Goals Next Image

**Status:** Complete  
**Requirements:** PERF-02, PERF-03  
**Commits:** `b46247e`, `c0a2099`, `bac08a6`

## What Changed

- Converted heavy hero/team/business-goals PNG sources to smaller JPG sources.
- Repointed data files to the new JPG assets.
- Implemented hero poster overlay with `next/image` priority/fetch priority for LCP.
- Extracted `HeroVideoPoster` client subcomponent so the 1024 hero stays server-rendered where possible.

## Files Changed

- `public/assets/figma/9656-first-screen-1440/hero-image.jpg`
- `public/assets/figma/9656-team-what-we-do-1440/team.jpg`
- `public/assets/figma/9656-business-goals-1440/rectangle75.jpg`
- `src/widgets/first-screen/model/first-screen.data.ts`
- `src/widgets/first-screen/ui/first-screen-hero-1024.tsx`
- `src/widgets/first-screen/ui/first-screen-hero-1440.tsx`
- `src/widgets/first-screen/ui/first-screen-hero-video-poster.tsx`
- `src/widgets/team/model/team.data.ts`
- `src/widgets/business-goals/model/business-goals.data.ts`

## Verification

- TypeScript passed during Phase 13 verification.
- Follow-up build fixes landed in `c5f43f9` and `bac08a6`.
