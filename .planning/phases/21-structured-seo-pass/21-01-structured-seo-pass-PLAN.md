# Phase 21 / Plan 01 — Structured SEO Pass

## Goal

Add production structured data and make service route index/noindex behavior explicit.

## Scope

- Add JSON-LD for Organization, WebSite and ProfessionalService on the home page.
- Use production base URL and Payload settings in structured data.
- Add noindex headers to email utility HTML/download routes.
- Preserve existing noindex metadata for Payload admin and preview pages.
- Add SEO unit smoke tests.

## Acceptance

- Home page renders `application/ld+json` with Organization/WebSite/ProfessionalService.
- JSON-LD URLs resolve against `https://soloproduction.pro`.
- Email utility routes include `X-Robots-Tag: noindex, nofollow`.
- Admin and preview pages remain noindex/nofollow.
- Typecheck and SEO unit smoke pass.
