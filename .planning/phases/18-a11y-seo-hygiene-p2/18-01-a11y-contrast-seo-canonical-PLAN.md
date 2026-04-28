---
phase: 18-a11y-seo-hygiene-p2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/globals.css
  - src/app/(site)/privacy/page.tsx
  - src/app/sitemap.ts
  - src/widgets/footer/ui/footer-*.tsx
  - src/widgets/levels/ui/levels-section-*.tsx
  - tests/unit/a11y-seo-hygiene.test.ts
autonomous: true
requirements: [A11Y-01, SEO-01]
must_haves:
  truths:
    - "Small foreground grey text in footer/levels/privacy no longer uses #9c9c9c"
    - "Replacement foreground greys meet WCAG AA 4.5:1 against their surfaces"
    - "/privacy has canonical metadata"
    - "/privacy is crawlable and appears in sitemap"
  artifacts:
    - path: "tests/unit/a11y-seo-hygiene.test.ts"
      provides: "a11y/SEO regression guard"
---

# Plan 18-01: A11y contrast and privacy canonical

## Objective

Improve remaining a11y/SEO Lighthouse hygiene by replacing weak grey text and making `/privacy` crawlable with canonical metadata.

## Tasks

1. Add a failing unit guard for AA-safe grey text and `/privacy` SEO metadata.
2. Add the on-dark grey token.
3. Replace weak grey footer/privacy text with `#c8c3bf`.
4. Replace weak grey levels labels on light surfaces with `#5e524d`.
5. Set `/privacy` canonical to `/privacy` and robots to index/follow.
6. Add `/privacy` to sitemap.
7. Verify unit test, typecheck, build, and production metadata smoke.

## Verification

```bash
pnpm exec vitest run tests/unit/a11y-seo-hygiene.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm build
```

Production smoke:

- `/privacy` canonical resolves to `https://demo.soloproduction.pro/privacy`
- `/privacy` robots meta is `index, follow`
- `/sitemap.xml` includes `/privacy`
