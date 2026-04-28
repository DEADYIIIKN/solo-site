---
phase: 14-cache-delivery-layer-p0
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - next.config.ts
  - src/shared/config/cache-headers.ts
  - tests/unit/static-cache-headers.test.ts
autonomous: true
requirements: [PERF-04]
must_haves:
  truths:
    - "Raw /assets/* responses return Cache-Control: public, max-age=31536000, immutable"
    - "_next/image optimized responses still return AVIF/WebP and remain CDN-friendly"
    - "Cache header rule is covered by a unit test"
    - "next build passes"
  artifacts:
    - path: "src/shared/config/cache-headers.ts"
      provides: "shared cache header rule used by next.config.ts and unit tests"
      contains: "public, max-age=31536000, immutable"
    - path: "next.config.ts"
      provides: "Next.js headers() integration for /assets/:path*"
      contains: "headers()"
---

# Plan 14-01: Static Cache Headers

**Phase:** 14 — Cache & Delivery Layer (P0)  
**REQ-IDs:** PERF-04  
**Depends on:** Phase 13 complete  
**Status:** complete

## Objective

Configure app-owned static assets under `/assets/*` to be cached for one year with `immutable`, while preserving Next.js optimized image behavior for `/_next/image`.

## Tasks

### Task 1: Add RED unit guard

Create `tests/unit/static-cache-headers.test.ts` asserting the `/assets/:path*` rule and exact `Cache-Control` value.

### Task 2: Implement cache header rule

Create `src/shared/config/cache-headers.ts` with `ASSET_CACHE_CONTROL` and `staticAssetHeaders`, then wire it into `next.config.ts` via `headers()`.

### Task 3: Verify locally

Run:

```bash
pnpm exec vitest run tests/unit/static-cache-headers.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm build
pnpm exec next start -p 3014
curl -I http://127.0.0.1:3014/assets/figma/footer-1440/blog-card-1.jpg
curl -I -H 'Accept: image/avif' 'http://127.0.0.1:3014/_next/image?url=%2Fassets%2Ffigma%2Ffooter-1440%2Fblog-card-1.jpg&w=750&q=75'
```

## Success Criteria

- `/assets/figma/footer-1440/blog-card-1.jpg` returns `Cache-Control: public, max-age=31536000, immutable`
- `_next/image?...blog-card-1.jpg...` returns `Content-Type: image/avif`
- Unit test, typecheck, and production build pass
