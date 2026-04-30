# Phase 20 / Plan 01 — Domain Consolidation + SEO Settings SUMMARY

**Status:** Complete locally  
**Completed:** 2026-04-30  

## Completed

- `publicSiteUrl` now defaults to `https://soloproduction.pro`.
- Payload `site-settings` includes SEO controls:
  - production base URL
  - indexing toggle
  - SEO title/description
  - OpenGraph title/description/image URL
- Payload `site-settings` includes Yandex Metrika controls:
  - enabled toggle
  - counter ID
  - webvisor
  - click map
  - external link tracking
  - accurate bounce tracking
- Site layout reads settings for metadata and renders Yandex Metrika only when enabled and configured.
- `robots.txt` and `sitemap.xml` read production URL/indexing from settings with safe fallbacks.
- Desired docker compose removes the separate `solo-site-prod` service and routes `solo-site` to `soloproduction.pro` / `www.soloproduction.pro`.
- SQLite schema guards include new `site_settings` columns.

## Verification

- `pnpm typecheck` — pass
- `pnpm exec vitest run tests/unit/a11y-seo-hygiene.test.ts` — pass

## Follow-Up

- Run full build/lint before deploy.
- Deploy and verify Traefik routes and current production data source.
