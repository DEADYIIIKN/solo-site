# Codebase Concerns

**Analysis Date:** 2026-04-22

## Tech Debt

**Form submission not implemented (lead form and consultation modals):**
- Issue: All contact form submit handlers show `/* TODO: отправка заявки */` — the forms validate fields and show a success modal, but no data is ever sent anywhere
- Files: `src/widgets/lead-form/ui/lead-form-fields.tsx:212`, `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx`
- Impact: Lead capture is completely broken in production — users can submit forms and see success messages but no data reaches any backend or CRM
- Fix approach: Implement a server action or API route that receives form data (name, phone, contactMethod, message) and forwards it to a notification channel (email, Telegram bot, or n8n webhook)

**Shared types defined in a breakpoint-specific UI component:**
- Issue: `FirstScreenConsultationFormState`, `FirstScreenConsultationContactMethod`, and `FirstScreenConsultationModalTitleVariant` are defined in `first-screen-consultation-modal-1440.tsx` and imported by all other modal breakpoints, `lead-form-fields.tsx`, and `shared/lib/open-consultation-modal.ts`
- Files: `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx`, `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx`, `src/widgets/lead-form/ui/lead-form-fields.tsx`, `src/shared/lib/open-consultation-modal.ts`
- Impact: Renaming or restructuring the 1440 modal requires touching all other breakpoints; the shared lib layer takes a hard dependency on a widget's internal UI file
- Fix approach: Move the shared types into `src/widgets/first-screen/model/first-screen-consultation-form.ts` where the phone formatting logic already lives

**Five nearly-identical consultation modal components (per-breakpoint copy-paste):**
- Issue: `first-screen-consultation-modal-360.tsx` (463 lines), `first-screen-consultation-modal-480.tsx` (475 lines), `first-screen-consultation-modal-768.tsx` (464 lines), `first-screen-consultation-modal-1024.tsx` (462 lines), and `first-screen-consultation-modal-1440.tsx` (564 lines) share the same form logic, validation state, contact options, and portal rendering — differing only in pixel values and layout
- Files: `src/widgets/first-screen/ui/first-screen-consultation-modal-*.tsx`
- Impact: Any logic change (e.g., adding a new field, changing validation) must be replicated in all five files; high risk of divergence bugs
- Fix approach: Extract a shared `ConsultationModalBase` component that accepts density/layout props, similar to the existing `LeadFormFields` component which already implements this pattern

**ESLint disabled during builds:**
- Issue: `next.config.ts` sets `eslint.ignoreDuringBuilds: true` — lint errors will not block Docker image production
- Files: `next.config.ts:9`
- Impact: Linting regressions can ship silently; the only lint enforcement is the local `pnpm lint` command
- Fix approach: Run `pnpm lint` as an explicit CI step before building, or remove the flag and fix any remaining lint errors

**`getSiteSettings` uses unsafe type casting:**
- Issue: `payload.findGlobal` returns `unknown` typed as `Record<string, unknown>` via `as` cast on every field access; no schema validation or Payload-generated types are used
- Files: `src/shared/lib/get-site-settings.ts:36-43`
- Impact: A Payload schema change to `site-settings` will silently return `undefined` for any renamed field, falling back to `DEFAULTS` with no warning
- Fix approach: Use the generated `payload-types.ts` `SiteSettings` type (already generated via `generate:types`) instead of casting to `Record<string, unknown>`

**`business-goals.tsx` is 1300 lines:**
- Issue: Single component file with all breakpoint variants, animation logic, accordion state, and layout constants inlined
- Files: `src/widgets/business-goals/ui/business-goals.tsx`
- Impact: Very hard to modify — changes risk unintended side-effects across breakpoints; IDE performance and code review burden
- Fix approach: Split into per-breakpoint components (`business-goals-1440.tsx`, etc.) following the pattern used by `philosophy-clients`, `first-screen`, and `services`

**`services-section-below-1024.tsx` is 1000 lines:**
- Issue: Similar to `business-goals.tsx` — single file encodes all sub-1024 breakpoint variants
- Files: `src/widgets/services/ui/services-section-below-1024.tsx`
- Impact: Hard to review and maintain
- Fix approach: Same split-by-breakpoint pattern as other widgets

## Known Bugs

**`/privacy` page does not exist:**
- Symptoms: The consent checkbox in `LeadFormFields` links to `/privacy`. There is no `src/app/(site)/privacy/` route in the codebase.
- Files: `src/widgets/lead-form/ui/lead-form-fields.tsx:480`
- Trigger: Clicking the "Политикой конфиденциальности" link in any contact form
- Workaround: None; the link leads to a 404

**Showreel video committed to git (56 MB):**
- Symptoms: `public/assets/video/bts-ozon.mp4` is tracked in the repository at 56 MB
- Files: `public/assets/video/bts-ozon.mp4`
- Impact: Slow clone/checkout; Docker build layer bloat; GitHub repository size approaching limits
- Workaround: The path is configurable via `NEXT_PUBLIC_SHOWREEL_VIDEO` env var, so the video could be served from a CDN without committing it

## Security Considerations

**`PAYLOAD_SECRET` falls back to empty string:**
- Risk: `payload.config.ts` uses `process.env.PAYLOAD_SECRET || ""` — if the env var is missing in a deployment, Payload CMS signs JWT tokens with an empty secret, making admin sessions trivially forgeable
- Files: `src/payload.config.ts:54`
- Current mitigation: The seed script checks for a minimum 16-char secret before running; Docker build uses a well-known placeholder that differs from runtime secret
- Recommendation: Throw or exit early if `PAYLOAD_SECRET` is missing or too short at runtime

**Preview routes bypass Payload access control:**
- Risk: `overrideAccess: true` is used in both preview pages, which means any user who knows a document ID can view unpublished/draft cases through `/preview/cases-vertical/[id]` and `/preview/cases-advertising/[id]`
- Files: `src/app/(site)/preview/cases-vertical/[id]/page.tsx:32`, `src/app/(site)/preview/cases-advertising/[id]/page.tsx:32`
- Current mitigation: Preview routes set `robots: { index: false }` in metadata; routes are not linked from the public site
- Recommendation: Add authentication check (e.g., verify Payload session cookie) before serving preview content

**Deploy keys committed to the repository:**
- Risk: `.deploy/github-actions-demo-deploy-key` and `.deploy/github-actions-demo-deploy-key.pub` are tracked in git
- Files: `/Users/a_savinkov/solo-site/.deploy/github-actions-demo-deploy-key`, `/Users/a_savinkov/solo-site/.deploy/github-actions-demo-deploy-key.pub`
- Current mitigation: The `.deploy/` directory is not in `.gitignore` — these files are in the repository
- Recommendation: Rotate the key, add `.deploy/` to `.gitignore`, and use only GitHub Actions secrets for SSH key material

**`SecretsPost` collection has `read: () => true` (public read access):**
- Risk: All published and unpublished "secrets" articles are readable via the Payload REST/GraphQL API without authentication
- Files: `src/cms/collections/secrets-post.ts:18`
- Current mitigation: The collection is gated by `showSecrets` feature flag on the frontend
- Recommendation: Add a `published: { equals: true }` filter in the access rule if unauthenticated access to drafts is unintended

## Performance Bottlenecks

**56 MB video in git and served from `/public`:**
- Problem: The showreel video is committed to git and served as a static file; every Next.js deploy copies it into the Docker image layer
- Files: `public/assets/video/bts-ozon.mp4`
- Cause: No CDN or external media storage for video
- Improvement path: Store in an object storage bucket (S3-compatible), reference via `NEXT_PUBLIC_SHOWREEL_VIDEO`, remove from git

**SQLite in production (single-writer bottleneck):**
- Problem: The production deployment uses SQLite via `@payloadcms/db-sqlite` with the database stored on a local Docker volume
- Files: `src/payload.config.ts`, `infra/docker-compose.solo-site.yml`
- Cause: SQLite does not support concurrent writes; under media upload or admin edits, the site's SSR requests may be queued behind DB locks
- Improvement path: `.env.example` already documents migration path — switch to `@payloadcms/db-postgres` and `DATABASE_URL=postgres://...`

**`getCasesForSite` runs two uncached Payload queries on every page render:**
- Problem: The home page has `revalidate = 60` but `getCasesForSite` calls `payload.find()` for both collections on each revalidation cycle; there is no per-query caching
- Files: `src/widgets/cases/lib/get-cases-for-site.ts`, `src/app/(site)/page.tsx:49`
- Cause: Next.js ISR (`revalidate = 60`) means the page is rebuilt at most once per minute, but the DB calls are not memoized within a request
- Improvement path: This is acceptable for the current traffic level; would become a concern at higher load or if query latency increases

**`willChange: "grid-template-columns"` on accordion animations:**
- Problem: `willChange` is applied to grid-template-columns transitions, which creates a compositing layer but provides minimal GPU benefit for layout properties
- Files: `src/widgets/business-goals/ui/business-goals.tsx:1040`, `src/widgets/business-goals/ui/business-goals.tsx:1144`
- Cause: Grid column animations run on the main thread regardless of `willChange`
- Improvement path: Remove `willChange` or replace with transform-based animation

## Fragile Areas

**Anchor scroll navigation system:**
- Files: `src/shared/ui/site-nav-link.tsx`
- Why fragile: Custom polling loop (50ms interval, 5s timeout) detects when scroll settles; relies on DOM attribute `data-site-anchor-navigation` for cross-component state; module-level mutable variables (`pendingAnchorCleanupTimer`, `removeForcedSurfaceReleaseListeners`) break on hot reload; navbar surface lookup tables (`INITIAL_HASH_NAVBAR_SURFACES`, `FINAL_HASH_TARGET_SURFACES`) must be kept in sync manually as sections are added or reordered
- Safe modification: Always update both lookup tables when adding new section anchors; do not rename section IDs without updating the tables
- Test coverage: Covered by several Playwright smoke scripts in `/scripts/` but no automated unit tests

**Services and Philosophy pin-scroll progress hooks:**
- Files: `src/widgets/services/lib/use-services-pin-scroll-progress.ts` (404 lines), `src/widgets/philosophy-clients/lib/use-philosophy-stack-progress.ts`
- Why fragile: Pixel values are hardcoded per viewport; logic depends on `window.innerWidth`, `document.documentElement.clientWidth`, and `window.visualViewport?.width` to detect layout switches; any CSS breakpoint change in the component must be mirrored in the hook
- Safe modification: When changing pinned section heights or breakpoints, update both the CSS/JSX and the corresponding scroll range constants in the hook

**`ensure-payload-schema.ts` uses `PAYLOAD_FORCE_DRIZZLE_PUSH` internal env var:**
- Files: `src/shared/lib/ensure-payload-schema.ts`
- Why fragile: `PAYLOAD_FORCE_DRIZZLE_PUSH` is an undocumented internal Payload/Drizzle env var; it may break or change behavior on Payload version upgrades
- Safe modification: Test the schema migration path after any Payload version bump

## Scaling Limits

**SQLite single-node constraint:**
- Current capacity: Single Docker container, 512 MB RAM limit, 0.5 CPU (`docker-compose.solo-site.yml`)
- Limit: SQLite write-locks the entire database; cannot run more than one container replica; no horizontal scaling
- Scaling path: Migrate to PostgreSQL (`@payloadcms/db-postgres`) and a managed DB service; then multiple container replicas become viable

**Media uploads stored on a local Docker volume:**
- Current capacity: Bounded by the VPS disk at `/opt/beget/n8n/solo_sqlite_data`
- Limit: No automatic cleanup; large video uploads accumulate without size enforcement; volume is not replicated
- Scaling path: Use `PAYLOAD_UPLOAD_DIR` pointing to an S3-compatible mount or integrate Payload's cloud storage plugin

## Dependencies at Risk

**`@payloadcms/ui` is patched with a local patch file:**
- Risk: `patches/@payloadcms__ui@3.82.0.patch` modifies the distributed build of Payload's UI package (adds `useId`, `useConfig` imports and MIME type filtering); this patch must be re-applied or re-verified on every Payload version upgrade
- Impact: If the patch fails to apply (e.g., after upstream refactors the patched file), the build breaks or media upload fields behave incorrectly
- Migration plan: Open an upstream issue/PR for the MIME type upload filter feature; remove the patch once merged and released

**`playwright` as a devDependency (v1.50.1) used only for ad-hoc audit scripts:**
- Risk: Playwright bundles Chromium; it adds significant disk usage and install time to the dev environment without a formal test suite
- Impact: No automated regression tests exist despite the tooling; audit scripts in `/scripts/` must be run manually
- Migration plan: Either invest in a proper Playwright test suite (`tests/` directory, CI integration) or replace the audit scripts with lighter alternatives

## Missing Critical Features

**No form submission backend:**
- Problem: The consultation modal and lead form collect name, phone, and contact preference but have no submission endpoint. The `/* TODO: отправка заявки */` comment marks the gap.
- Blocks: Lead generation — the primary commercial purpose of the site
- Files: `src/widgets/lead-form/ui/lead-form-fields.tsx:212`

**No privacy policy page:**
- Problem: The consent checkbox links to `/privacy` which does not exist as a route
- Blocks: Legal compliance for personal data processing consent (required under Russian data protection law)
- Files: `src/widgets/lead-form/ui/lead-form-fields.tsx:480`

**No blog/news frontend pages:**
- Problem: `SecretsPost` collection is defined in the CMS and the feature flag `showSecrets` exists, but there are no frontend pages for displaying posts
- Blocks: Publishing blog/news content to site visitors
- Files: `src/cms/collections/secrets-post.ts`

## Test Coverage Gaps

**Zero automated tests:**
- What's not tested: All widgets, form validation, scroll hooks, CMS data fetching, API routes
- Files: Entire `src/` directory — no `.test.ts` or `.spec.ts` files found
- Risk: Any refactoring or dependency upgrade can break rendering, scroll behavior, or form validation with no automated detection
- Priority: High

**Form validation logic has no unit tests:**
- What's not tested: `formatConsultationPhone`, `formatConsultationPhoneBackspace`, `isConsultationPhoneValid` in `first-screen-consultation-form.ts`
- Files: `src/widgets/first-screen/model/first-screen-consultation-form.ts`
- Risk: Phone formatting edge cases (backspace handling, paste, partial input) can break silently
- Priority: High

**Scroll hooks have no tests:**
- What's not tested: `useServicesPinScrollProgress`, `usePhilosophyStackProgress`, `useCasesPinScrollProgress`, `useCasesHorizontalCarousel`
- Files: `src/widgets/services/lib/use-services-pin-scroll-progress.ts`, `src/widgets/philosophy-clients/lib/use-philosophy-stack-progress.ts`, `src/widgets/cases/lib/use-cases-pin-scroll-progress.ts`, `src/widgets/cases/lib/use-cases-horizontal-carousel.ts`
- Risk: Pixel calculations and viewport detection logic can regress invisibly
- Priority: Medium

---

*Concerns audit: 2026-04-22*
