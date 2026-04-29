# Phase 18 Context — A11y & SEO Hygiene

## Scope

Phase 18 closes the remaining Lighthouse hygiene gaps before final verification:

- Small grey text must meet WCAG AA contrast.
- `/privacy` must have canonical metadata and be crawlable.

## Decisions

- Keep existing visual hierarchy but replace weak foreground grey:
  - On dark footer/privacy surfaces: `#c8c3bf`
  - On light level cards: `#5e524d`
- `/privacy` is indexable in v1.2, with canonical `/privacy`.
- `/privacy` is included in sitemap.

## Verification Signals

- `tests/unit/a11y-seo-hygiene.test.ts`
- Production browser smoke for `/privacy`:
  - canonical: `https://demo.soloproduction.pro/privacy`
  - robots: `index, follow`
  - logs/failed requests: empty
