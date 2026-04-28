---
phase: 16-bundle-fonts-p1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/fonts/montserrat/*
  - src/app/(site)/layout.tsx
  - tests/unit/site-font-assets.test.ts
autonomous: true
requirements: [PERF-06]
must_haves:
  truths:
    - "Site layout uses WOFF2 font sources, not TTF"
    - "Montserrat shipped font payload is <= 350 KB"
    - "RU/EN subset includes Latin, Cyrillic, punctuation, currency, and common symbols"
    - "Build and typecheck pass"
  artifacts:
    - path: "public/fonts/montserrat/*.woff2"
      provides: "subset WOFF2 Montserrat variants"
    - path: "tests/unit/site-font-assets.test.ts"
      provides: "font payload regression guard"
---

# Plan 16-01: Fonts WOFF2 subset

## Objective

Replace Montserrat TTF font files with WOFF2 RU/EN subset files and keep the shipped font payload under 350 KB.

## Tasks

1. Add failing unit guard for WOFF2-only layout sources and payload budget.
2. Convert existing Montserrat TTF files to WOFF2 subset.
3. Update `next/font/local` paths in site layout.
4. Remove tracked TTF files.
5. Verify unit test, typecheck, and build.

## Verification

```bash
pnpm exec vitest run tests/unit/site-font-assets.test.ts
pnpm exec tsc --noEmit -p tsconfig.json
pnpm build
```

