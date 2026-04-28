# Phase 14 Context — Cache & Delivery Layer

## Goal

Close PERF-04 after Phase 13 image optimization by making raw static assets cacheable for repeat visits:

- `/assets/*` responses: `Cache-Control: public, max-age=31536000, immutable`
- `/_next/image` responses: keep Next.js optimized image cache behavior (fresh local optimized response inherits `/assets/*` one-year cache and remains CDN-friendly)

## Decision

Use `headers()` in `next.config.ts` for `/assets/:path*`.

Rationale:
- The repo already owns static assets under `public/assets`.
- The behavior is app-level and testable in `next build` / `next start`.
- It does not require Traefik-specific deploy config for local parity.

## Verification Target

Local production server:

```bash
curl -I http://127.0.0.1:3014/assets/figma/footer-1440/blog-card-1.jpg
```

Expected:

```http
Cache-Control: public, max-age=31536000, immutable
```

Optimized image smoke:

```bash
curl -I -H 'Accept: image/avif' 'http://127.0.0.1:3014/_next/image?url=%2Fassets%2Ffigma%2Ffooter-1440%2Fblog-card-1.jpg&w=750&q=75'
```

Expected:

```http
Content-Type: image/avif
Cache-Control: public, max-age=31536000, must-revalidate
```
