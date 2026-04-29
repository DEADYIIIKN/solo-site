# Plan 14-01 Summary — Static Cache Headers

**Status:** Complete  
**Requirement:** PERF-04  
**Date:** 2026-04-28

## What Changed

- Added `src/shared/config/cache-headers.ts` with shared immutable asset cache rule.
- Wired `next.config.ts` `headers()` to return that rule for `/assets/:path*`.
- Added `tests/unit/static-cache-headers.test.ts` as a guard for the exact rule and value.

## Verification

- `pnpm exec vitest run tests/unit/static-cache-headers.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- Local production server `pnpm exec next start -p 3014` — pass

Raw asset header:

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, immutable
Content-Type: image/jpeg
Content-Length: 916028
```

Optimized image smoke:

```http
HTTP/1.1 200 OK
Cache-Control: public, max-age=31536000, must-revalidate
Content-Type: image/avif
X-Nextjs-Cache: HIT
Content-Length: 74840
```

## Notes

`next start` warns that this project uses `output: "standalone"` and production deploy should run `.next/standalone/server.js`. The header behavior is still verified through Next's production server path and should be re-smoked after deploy on `demo.soloproduction.pro`.

Next.js stores image optimizer `maxAge` in generated `.next/cache/images` entries. Local smoke after changing `images.minimumCacheTTL` should clear that generated cache first; otherwise stale optimizer entries can still report their previous `max-age`.
