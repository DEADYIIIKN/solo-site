# Plan 18-01 Summary — A11y contrast and privacy canonical

**Status:** Complete locally  
**Requirements:** A11Y-01, SEO-01  
**Date:** 2026-04-29

## What Changed

- Added `--color-base-gray-300: #c8c3bf` for text on dark surfaces.
- Replaced weak footer/privacy grey text with `#c8c3bf`.
- Replaced weak levels labels on light surfaces with `#5e524d`.
- Added `/privacy` canonical metadata.
- Changed `/privacy` robots metadata to `index, follow`.
- Added `/privacy` to sitemap.
- Added `tests/unit/a11y-seo-hygiene.test.ts` for contrast and SEO regression coverage.

## Verification

- `pnpm exec vitest run tests/unit/a11y-seo-hygiene.test.ts` — pass
- `pnpm exec tsc --noEmit -p tsconfig.json` — pass
- `pnpm build` — pass
- Production `/privacy` browser smoke — pass:
  - canonical: `https://demo.soloproduction.pro/privacy`
  - robots: `index, follow`
  - `logs: []`, `failed: []`
- Production `/sitemap.xml` smoke — pass, includes `/privacy`

## Notes

Final Lighthouse a11y/SEO score confirmation remains in Phase 19 PSI verification.
