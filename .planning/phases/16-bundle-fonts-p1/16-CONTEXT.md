# Phase 16 Context — Bundle & Fonts

## Goal

Reduce font payload and JavaScript overhead after image and cache phases:

- PERF-06: Montserrat TTF → WOFF2 RU/EN subset through `next/font/local`.
- PERF-07: Add bundle analyzer and reduce unused JS where practical.
- PERF-08: Find and remove `ERR_CONNECTION_FAILED` console noise from the home page.

## Current Findings

- Site layout uses `next/font/local` in `src/app/(site)/layout.tsx`.
- Before 16-01, Montserrat shipped as 8 TTF files, total **1.4 MB** on disk.
- No local WOFF2 converter was available; temporary `fonttools` + `brotli` were installed under `/private/tmp/solo-fonttools` for one-shot conversion.
- Build still emits an existing Tailwind generated CSS warning for `.min-[…]:block`; this is tracked for 16-02 cleanup if it maps to shipped code.

## Boundary

Phase 16-01 changes only font assets and layout font source paths.
Phase 16-02 handles analyzer / dynamic imports / console errors.

