# Phase 20 / Plan 01 — Domain Consolidation + SEO Settings

## Goal

Make `https://soloproduction.pro` the single production domain and move SEO/analytics controls into Payload site settings.

## Scope

- Change default public site URL from `demo.soloproduction.pro` to `soloproduction.pro`.
- Update production compose so the desired active service routes `soloproduction.pro` / `www.soloproduction.pro`.
- Add Payload fields for production URL, indexing, SEO defaults, OpenGraph defaults and Yandex Metrika options.
- Render Yandex Metrika only when enabled and configured.
- Keep local/dev analytics off by default.
- Add schema fallback columns for production SQLite.

## Acceptance

- `publicSiteUrl` defaults to `https://soloproduction.pro`.
- `robots.txt`, `sitemap.xml`, metadataBase and canonical URLs use production URL.
- Payload Admin exposes SEO and Yandex Metrika settings.
- Desired compose has one active production runtime for `soloproduction.pro`.
- Typecheck and SEO unit tests pass.
