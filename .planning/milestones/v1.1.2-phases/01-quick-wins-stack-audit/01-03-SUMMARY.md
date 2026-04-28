---
phase: 01-quick-wins-stack-audit
plan: "03"
subsystem: frontend
tags: [nextjs, payload-cms, privacy-page, footer, rsc]

# Dependency graph
requires:
  - "01-02"  # PrivacyPage Payload Global + privacy_page SQLite table
provides:
  - "src/app/(site)/privacy/page.tsx — /privacy RSC page with Payload fetch and Russian placeholder"
  - "All five footer breakpoints link to /privacy instead of #"
affects:
  - FORM-01  # Clicking privacy link in footer/forms now navigates to real page

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "RSC page with payload.findGlobal + catch-block fallback to static placeholder"
    - "robots: {index:false, follow:false} on soft-launch pages"
    - "revalidate=60 ISR pattern for CMS-driven content"

key-files:
  created:
    - src/app/(site)/privacy/page.tsx
  modified:
    - src/widgets/footer/ui/footer-1440.tsx
    - src/widgets/footer/ui/footer-1024.tsx
    - src/widgets/footer/ui/footer-768.tsx
    - src/widgets/footer/ui/footer-480.tsx
    - src/widgets/footer/ui/footer-360.tsx

key-decisions:
  - "Placed page at src/app/(site)/privacy/page.tsx (inside (site) route group) to inherit Montserrat font and dark layout — NOT src/app/privacy/page.tsx"
  - "robots: {index:false, follow:false} — prevents search indexing until real CMS content is added by client"
  - "catch {} silently falls back to PLACEHOLDER string — RSC page never throws, 500 avoided"
  - "Did not import PrivacyPage type from payload-types.ts — pre-existing Node.js v24 ERR_REQUIRE_ASYNC_MODULE blocks generate:types (documented in 01-02 SUMMARY)"

requirements-completed:
  - FORM-01

# Metrics
duration: ~10min
completed: 2026-04-22
---

# Phase 1 Plan 03: Privacy Page + Footer Links — Summary

**Next.js /privacy RSC page fetching Payload privacy-page Global with Russian placeholder fallback, plus all five footer breakpoints updated from href=# to href=/privacy**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-22
- **Completed:** 2026-04-22
- **Tasks:** 2 (both auto)
- **Files created:** 1
- **Files modified:** 5

## Accomplishments

- Created `src/app/(site)/privacy/page.tsx` inside the (site) route group — inherits Montserrat font, dark background, and SiteLoadOverlay from layout.tsx
- Page fetches `payload.findGlobal({ slug: "privacy-page" })` with `overrideAccess: true`; catches all Payload errors and renders a static Russian privacy policy placeholder
- `robots: { index: false, follow: false }` prevents search indexing until real CMS content is in place
- `export const revalidate = 60` — ISR consistent with main page pattern
- Back-to-home `← На главную` link since no global header exists in (site) layout
- `FooterSection showNews={false} showSecrets={false}` — minimal footer appropriate for a legal page
- Updated all five footer breakpoint files (1440, 1024, 768, 480, 360) — `href="#"` → `href="/privacy"` on the privacy link element; only the href attribute was changed, all classNames and content preserved

## Task Commits

1. **Task 1: Create /privacy RSC page** — `1f6604e` (feat)
2. **Task 2: Update five footer breakpoints** — `84fcd67` (fix)

## Files Created/Modified

- `src/app/(site)/privacy/page.tsx` — new RSC page (85 lines)
- `src/widgets/footer/ui/footer-1440.tsx` — privacy link href fixed
- `src/widgets/footer/ui/footer-1024.tsx` — privacy link href fixed
- `src/widgets/footer/ui/footer-768.tsx` — privacy link href fixed
- `src/widgets/footer/ui/footer-480.tsx` — privacy link href fixed
- `src/widgets/footer/ui/footer-360.tsx` — privacy link href fixed

## Decisions Made

- Page placed at `src/app/(site)/privacy/page.tsx` — required to inherit the (site) group layout (Montserrat, dark background, SiteLoadOverlay). Placing it at `src/app/privacy/page.tsx` would lose these styles.
- `robots: {index:false}` — soft-launch pattern: page is reachable but not indexed until client approves final copy
- `catch {}` fallback — RSC must never throw; Payload may be unavailable in some environments (preview, build-time)
- Did not use generated `PrivacyPage` type from `payload-types.ts` — pre-existing `ERR_REQUIRE_ASYNC_MODULE` on Node.js v24 blocks type generation; used `Record<string, unknown>` cast instead (same pattern as `get-site-settings.ts`)

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed without bugs, missing dependencies, or architectural changes.

## TypeScript Verification

`npx tsc --noEmit` — exited 0, no errors introduced.

## Known Stubs

- When `richTextContent != null` (CMS content is set), the page renders "Политика конфиденциальности в процессе подготовки." rather than actual rich text. This is intentional: rendering Payload's LexicalRichText component requires a client boundary and was not in scope for this plan. When the client adds content in Payload admin, a follow-up plan should wire up the rich text renderer. The current branch (richTextContent == null) renders the full static placeholder correctly.

## Threat Flags

No new threat surface introduced beyond the plan's threat model. The `/privacy` route is a public read-only RSC with no user input.

---

*Phase: 01-quick-wins-stack-audit*
*Completed: 2026-04-22*
