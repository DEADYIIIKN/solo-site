# Phase 1: Quick Wins + Stack Audit — Research

**Researched:** 2026-04-22
**Domain:** Next.js App Router (Payload CMS integration), React form components, Tailwind CSS, animation library evaluation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**FORM-01: Privacy policy link**
- D-01: Create a full `/privacy` page in site style (header + footer), managed via Payload CMS.
- D-02: Page is created with a Russian privacy policy placeholder text; real text is edited via Payload later.
- D-03: Standard Next.js App Router page (`app/privacy/page.tsx`), data fetched from Payload (same as existing pages).

**FORM-02: Checkbox + privacy link**
- D-04: Click on "Политика конфиденциальности" opens `/privacy` in a **new tab** (`target="_blank"`, `rel="noopener noreferrer"`). Checkbox does NOT toggle — requires `e.stopPropagation()` on the link.
- D-05: Click on the rest of the label text toggles checkbox as normal.
- D-06: Implemented via correct HTML structure `<label>` + nested `<a>` with `stopPropagation`.

**FORM-03: Button text centering**
- D-07: Pure CSS fix, no additional solutions — Claude's discretion on specific approach.

**AUDIT-01: Next.js App Router vs React SPA**
- D-08: Document format: comparison table (Next.js App Router vs React SPA) + mandatory clear recommendation at the end.
- D-09: Document saved in `.planning/AUDIT-STACK.md`.
- D-10: Recommendation must be specific: "Keep Next.js" or "Migrate to SPA" with reasoning.

**AUDIT-02: Animation library**
- D-11: Three options compared: current (boneyard-js + CSS transitions), GSAP, Framer Motion.
- D-12: Document format: comparison table with columns (criterion, boneyard+CSS, GSAP, Framer Motion) + clear recommendation.
- D-13: Document saved in `.planning/AUDIT-ANIMATIONS.md`.
- D-14: Recommendation must account for Safari bugs from Phase 4 (current boneyard-js + CSS transitions are problematic in Safari).

### Claude's Discretion

- FORM-03 (button centering) — specific CSS approach is Claude's call.
- Structure of the Payload collection for `/privacy` page (new collection vs pages collection) — Claude's call, guided by existing patterns.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within Phase 1 scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FORM-01 | Clicking "Политика конфиденциальности" in the form does not produce a 404 or page reload | Create `src/app/(site)/privacy/page.tsx` as an App Router page under the `(site)` route group; Payload CMS collection for content; update all 5 footer variants |
| FORM-02 | All consent label text is clickable (not just checkbox) | `<label htmlFor>` + nested `<a onClick={e.stopPropagation()}>` pattern already structurally correct; add `target="_blank" rel="noopener noreferrer"` to the link |
| FORM-03 | "Оставить заявку" button text is visually centered inside case forms | Remove asymmetric `pb-[20px] pt-[24px]` (or per-breakpoint variant) from consultation modal buttons; keep `flex items-center justify-center h-[Npx]` |
| AUDIT-01 | Written audit comparing Next.js App Router vs React SPA with clear recommendation | Produce `.planning/AUDIT-STACK.md` with comparison table + recommendation |
| AUDIT-02 | Written audit comparing boneyard-js+CSS vs GSAP vs Framer Motion with clear recommendation | Produce `.planning/AUDIT-ANIMATIONS.md`; must include Safari-compatibility as a criterion |

</phase_requirements>

---

## Summary

Phase 1 is a surgical brownfield phase with two distinct streams: three targeted bug fixes in existing React/Tailwind components and two Markdown audit documents. No layout changes are permitted; no new UI libraries are introduced.

The three form bugs (FORM-01–03) all touch well-identified, narrow code paths. FORM-01 requires creating a single new Next.js App Router page inside the existing `(site)` route group and wiring it to a new minimal Payload CMS collection. FORM-02 is a one-line HTML attribute addition — the underlying structure (`<label htmlFor>` + `<input id>`) is already correct. FORM-03 requires removing asymmetric vertical padding from submit buttons across five breakpoint-specific consultation modal files; the flex centering logic is already in place and correct.

The two audit documents (AUDIT-01, AUDIT-02) are Markdown files with no runtime component. They require research synthesis, not code changes. AUDIT-02 must explicitly address Safari compatibility because Phase 4 (Safari + Animations) depends on its recommendation.

**Primary recommendation:** Implement in task order: FORM-02 (one line, lowest risk), FORM-03 (padding removal across 5 files, medium risk), FORM-01 (new page + Payload collection, highest scope), then write AUDIT-01 and AUDIT-02.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Privacy page (`/privacy`) | Frontend Server (SSR) | Database/Storage (Payload) | App Router RSC; data fetched at request time via Payload `getPayload()` |
| Form checkbox/link fix | Browser/Client | — | Pure client-side React component (`"use client"`), no server involvement |
| Button centering fix | Browser/Client | — | CSS-only Tailwind class change in a `"use client"` modal component |
| Audit documents | — | — | Static Markdown; no runtime tier involved |
| Footer link update | Browser/Client | — | Static `href` value change inside client components |

---

## Standard Stack

### Core (already installed — no new installs needed)
[VERIFIED: package.json]

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^15.4.11 | App Router page framework | Already the project framework |
| Payload CMS | 3.82.0 | Headless CMS for page content | Already the project CMS; provides `getPayload()` |
| React | ^19.0.0 | UI components | Already the project UI library |
| Tailwind CSS | ^4.1.4 | Utility CSS | Already the project styling system |
| `@payloadcms/richtext-lexical` | 3.82.0 | Rich text field in Payload | Already in use; lexicalEditor() is configured |
| SQLite adapter (`@payloadcms/db-sqlite`) | 3.82.0 | Payload database | Already the project database |

### Supporting (for audit evaluation — not installed)
[ASSUMED: training knowledge on library capabilities]

| Library | Current Version | Purpose | Status |
|---------|----------------|---------|--------|
| GSAP | 3.x | Professional-grade scroll and timeline animations | Not installed; audit candidate |
| Framer Motion | 11.x | React-native declarative animation library | Not installed; audit candidate |
| boneyard-js | ^1.7.6 | Current skeleton/animation abstraction | Already installed |

**Installation:** No new packages needed for Phase 1 implementation tasks. Audit documents do not require installation.

---

## Architecture Patterns

### System Architecture Diagram

```
Privacy Page Request (/privacy)
          │
          ▼
  Next.js App Router
  (site)/privacy/page.tsx
          │
          ├─── Payload getPayload() ──► SQLite DB
          │         (PrivacyPage global or collection)
          │
          ▼
  RSC renders layout:
  HeaderSection + privacy content + FooterSection
          │
          ▼
  HTML delivered to browser
```

### Recommended Project Structure

New files for this phase:

```
src/
├── app/(site)/
│   └── privacy/
│       └── page.tsx              # FORM-01: new page
├── cms/
│   └── globals/                  # preferred: privacy as Global (single page)
│       └── privacy-page.ts       # new Payload Global
src/payload.config.ts             # register PrivacyPage Global
src/widgets/
├── lead-form/ui/lead-form-fields.tsx    # FORM-02: add target/rel to <a>
└── first-screen/ui/
    ├── first-screen-consultation-modal-1440.tsx  # FORM-03
    ├── first-screen-consultation-modal-1024.tsx  # FORM-03
    ├── first-screen-consultation-modal-768.tsx   # FORM-03
    ├── first-screen-consultation-modal-480.tsx   # FORM-03
    └── first-screen-consultation-modal-360.tsx   # FORM-03
src/widgets/footer/ui/
    ├── footer-1440.tsx           # FORM-01: href="/privacy"
    ├── footer-1024.tsx           # FORM-01: href="/privacy"
    ├── footer-768.tsx            # FORM-01: href="/privacy"
    ├── footer-480.tsx            # FORM-01: href="/privacy"
    └── footer-360.tsx            # FORM-01: href="/privacy"
.planning/
    ├── AUDIT-STACK.md            # AUDIT-01
    └── AUDIT-ANIMATIONS.md      # AUDIT-02
```

### Pattern 1: Payload Global for Single-Instance Content Page

**What:** Use a Payload `GlobalConfig` (not a collection) for a single page that will never have multiple instances.

**When to use:** The privacy page is a singleton — there is only ever one privacy policy. Globals are simpler than collections for this case (no `findOne` by slug needed).

**Example (following `src/cms/globals/site-settings.ts` pattern):**
[VERIFIED: codebase — site-settings.ts, payload.config.ts]

```typescript
// src/cms/globals/privacy-page.ts
import type { GlobalConfig } from "payload";

export const PrivacyPage: GlobalConfig = {
  slug: "privacy-page",
  label: "Политика конфиденциальности",
  admin: {
    group: "Контент",
    description: "Содержимое страницы /privacy",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "content",
      type: "richText",
      label: "Содержимое политики",
    },
  ],
};
```

Register in `payload.config.ts` by adding `PrivacyPage` to the `globals` array alongside `SiteSettings`.

### Pattern 2: Fetching a Payload Global in an RSC Page

**What:** Use `getPayload({ config })` inside an async RSC to fetch global content.

**When to use:** Any new page that needs CMS-managed content.

**Example (following `src/shared/lib/get-site-settings.ts` pattern):**
[VERIFIED: codebase — get-site-settings.ts]

```typescript
// src/app/(site)/privacy/page.tsx
import { getPayload } from "payload";
import config from "@payload-config";

export const revalidate = 60; // matches main page pattern

export const metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных SOLO Продакшн",
  robots: { index: false, follow: false },
};

export default async function PrivacyPage() {
  let content = null;
  try {
    const payload = await getPayload({ config });
    const raw = await payload.findGlobal({
      slug: "privacy-page",
      overrideAccess: true,
    });
    content = raw.content ?? null;
  } catch {
    // fallback to static placeholder
  }

  return (
    <main>
      <HeaderSection />
      <div className="mx-auto max-w-[800px] px-6 py-[80px] pb-[120px]">
        {/* render content or placeholder */}
      </div>
      <FooterSection showNews={false} showSecrets={false} />
    </main>
  );
}
```

### Pattern 3: FORM-02 — Link Inside Label with stopPropagation

**What:** Nested `<a>` inside `<label htmlFor>` with `onClick={e => e.stopPropagation()}` prevents the link click from bubbling up to the label and toggling the checkbox.

**When to use:** Any "consent + link" pattern where the link should navigate but not toggle the input.

**Current state (already mostly correct):**
[VERIFIED: codebase — lead-form-fields.tsx lines 449–486]

The existing code already has:
- `<input type="checkbox" id={consentId} className="sr-only" />`
- `<label htmlFor={consentId}>` wrapper
- `<a href="/privacy" onClick={(e) => e.stopPropagation()}>` nested link

**Only missing:** `target="_blank"` and `rel="noopener noreferrer"` on the `<a>` (decision D-04).

```tsx
<a
  className="underline decoration-solid [text-decoration-skip-ink:none]"
  href="/privacy"
  onClick={(e) => e.stopPropagation()}
  target="_blank"
  rel="noopener noreferrer"
>
  Политикой конфиденциальности
</a>
```

### Pattern 4: FORM-03 — Button Centering Fix

**What:** Remove asymmetric vertical padding from buttons that already use `flex items-center justify-center` with a fixed height.

**Root cause (VERIFIED: codebase — first-screen-consultation-modal-*.tsx):**
Each modal file has submit buttons with `flex items-center justify-center h-[Npx]` PLUS explicit `pb-[20px] pt-[Npx]` padding. The padding overrides the flex centering, shifting text downward.

**Per-file specifics (VERIFIED: codebase grep):**

| File | Height | Padding to remove |
|------|--------|------------------|
| `modal-1440.tsx` (lines 501, 543) | `h-[60px]` | `pb-[20px] pt-[24px]` |
| `modal-1024.tsx` (lines 222, 443) | `h-[56px]` | `pb-[20px] pt-[22px]` |
| `modal-768.tsx` (lines 222, 445) | `h-[52px]` | `pb-[20px] pt-[19px]` |
| `modal-480.tsx` (lines 222, 456) | `h-[48px]` | `pb-[20px] pt-[19px]` |
| `modal-360.tsx` (lines 222, 443) | `h-[44px]` | `pb-[20px] pt-[17px]` |

**Fix:** Remove `pb-[20px] pt-[Npx]` from button className strings in all 5 files. The `flex items-center justify-center` + fixed `h-[Npx]` already provides correct centering.

**IMPORTANT: Do NOT touch `lead-form-fields.tsx` button** — that button uses only `flex items-center justify-center` with `min-h-[...]`, no asymmetric padding, and is already correctly centered.

### Anti-Patterns to Avoid

- **Do not use `<label>` wrapping both checkbox `<input>` AND a navigating `<a>`** without `stopPropagation` — the label's default behavior fires a click on the associated `<input>` on any click, which would toggle the checkbox when the user clicks the link.
- **Do not use a Payload Collection for the privacy page** — the privacy policy is a singleton; a Global is the correct Payload abstraction. Collections create list UIs and require slug-based routing.
- **Do not add `py-*` or vertical padding to already-centered flex buttons with fixed heights** — padding inside `flex items-center justify-center` with a `h-[Npx]` container creates visual misalignment because the padding collapses the available flex space asymmetrically.
- **Do not break the `(site)` route group nesting** — the `src/app/(site)/` group provides the shared `layout.tsx` (fonts, html/body). New pages must be created inside this group to inherit the layout.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CMS-managed text content | Custom flat-file or env-var approach | Payload Global with `richText` field | Already the project pattern; admin UI is already set up |
| Rich text rendering | Custom HTML renderer | Payload's `@payloadcms/richtext-lexical` `RichText` component | Handles all lexical node types correctly |
| Page revalidation | Manual cache busting | `export const revalidate = 60` | Next.js ISR handles it; matches existing pages |

---

## Common Pitfalls

### Pitfall 1: Payload `db.push` Required After Schema Change
**What goes wrong:** Adding a new Global to `payload.config.ts` without running `PAYLOAD_DATABASE_PUSH=1 pnpm dev` once causes Payload to fail silently or log SQLite schema errors at dev startup.
**Why it happens:** The project deliberately sets `push: false` by default in dev (comment in `payload.config.ts` lines 68–71) to avoid `CREATE INDEX already exists` errors on hot reload.
**How to avoid:** After adding the `PrivacyPage` Global and registering it in `payload.config.ts`, run `PAYLOAD_DATABASE_PUSH=1 pnpm dev` once to apply the schema change.
**Warning signs:** Payload admin shows no "Политика конфиденциальности" menu item; `payload.findGlobal({ slug: "privacy-page" })` throws a table-not-found error.

### Pitfall 2: Footer `href="#"` vs `href="/privacy"` — All 5 Variants
**What goes wrong:** Updating only `footer-1440.tsx` and missing the other four breakpoint variants (`footer-1024.tsx`, `footer-768.tsx`, `footer-480.tsx`, `footer-360.tsx`).
**Why it happens:** The breakpoint-per-file pattern means each footer is an independent component with its own hardcoded `href="#"` on the privacy link.
**How to avoid:** The canonical refs list in CONTEXT.md explicitly names all five files. Treat all five as a batch update.
**Warning signs:** Privacy link works on 1440px desktop but 404s or does nothing on narrower breakpoints.

### Pitfall 3: `text-center` Does Not Fix Miscentering Caused by Asymmetric Padding
**What goes wrong:** Adding `text-center` to the button fails to visually center the text when `pb-[20px] pt-[24px]` is still present.
**Why it happens:** `text-center` aligns text horizontally within inline flow, not vertically within a flex container. The vertical misalignment is caused by padding consuming the flex space asymmetrically.
**How to avoid:** Remove the padding entirely; rely on `flex items-center justify-center` + fixed height alone.

### Pitfall 4: `(site)` Route Group Placement for New Page
**What goes wrong:** Creating `src/app/privacy/page.tsx` instead of `src/app/(site)/privacy/page.tsx` results in the page not inheriting the site layout (Montserrat font, html/body classes).
**Why it happens:** Next.js route groups (`(site)`) apply the sibling `layout.tsx` to all routes nested under them. A page outside the group gets no layout.
**How to avoid:** Always create new site-visible pages under `src/app/(site)/`.

### Pitfall 5: FORM-03 Affects Consultation Modals Only, Not Lead Form
**What goes wrong:** Accidentally removing padding from the submit button in `lead-form-fields.tsx`, which is correct and does not have the miscentering bug.
**Why it happens:** The lead form button looks similar but uses `min-h-[...]` (not fixed `h-[...]`) and has no asymmetric padding — it is already correctly centered.
**How to avoid:** FORM-03 scope is strictly the five `first-screen-consultation-modal-*.tsx` files. Do not touch `lead-form-fields.tsx` for FORM-03.

---

## Code Examples

### Payload Global Registration
[VERIFIED: codebase — payload.config.ts]

```typescript
// In src/payload.config.ts — add PrivacyPage to globals array
import { PrivacyPage } from "./cms/globals/privacy-page.ts";

export default buildConfig({
  // ...existing config...
  globals: [SiteSettings, PrivacyPage],  // add PrivacyPage here
});
```

### Footer Privacy Link Fix (same pattern in all 5 files)
[VERIFIED: codebase — footer-1440.tsx line 227–233]

```tsx
// Before (all 5 footer files):
<a className="self-start font-normal ..." href="#" style={{ color: "#9c9c9c" }}>
  {footerContent.privacy}
</a>

// After:
<a className="self-start font-normal ..." href="/privacy" style={{ color: "#9c9c9c" }}>
  {footerContent.privacy}
</a>
```

### Button Centering Fix (per-breakpoint)
[VERIFIED: codebase — first-screen-consultation-modal-*.tsx]

```tsx
// Before (1440 example, lines 501 and 543):
className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[24px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"

// After:
className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

---

## Runtime State Inventory

> This is a greenfield page addition + targeted bug fix phase. No rename/refactor/migration involved.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — new Global has no prior records | Run `PAYLOAD_DATABASE_PUSH=1 pnpm dev` once after schema change to create table |
| Live service config | None | — |
| OS-registered state | None | — |
| Secrets/env vars | None | — |
| Build artifacts | None | — |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Payload 2.x (REST-only) | Payload 3.x (Next.js native, `getPayload()`) | Payload v3 (2024) | Pages fetch data server-side without extra HTTP calls; `@payload-config` alias resolves to config |
| `framer-motion` dominant (React animations) | Framer Motion still dominant, but GSAP gaining for scroll/complex | Ongoing (2023–2025) | Both are valid; choice depends on project needs |

**Deprecated/outdated:**
- Payload `req.payload` pattern from v2: replaced by `getPayload({ config })` in v3 [ASSUMED: based on Payload v3 docs pattern observed in codebase]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Payload Global is preferable to Collection for the privacy page singleton | Architecture Patterns | Low — either works; Global is simpler but Collection would also function |
| A2 | GSAP current version is 3.x | Standard Stack (Supporting) | Low — version doesn't affect audit content; capabilities are well-documented |
| A3 | Framer Motion current version is 11.x | Standard Stack (Supporting) | Low — audit covers capabilities, not installation |
| A4 | `getPayload()` + `findGlobal()` is the correct Payload v3 server-side fetch pattern | Code Examples | Low — directly observed in `get-site-settings.ts` in this codebase; high confidence |

---

## Open Questions

1. **Does the privacy page need Header/Nav or just Footer?**
   - What we know: `src/app/(site)/layout.tsx` provides `<html>`/`<body>` but no shared header — the main page (`page.tsx`) renders `FooterSection` explicitly. There is no shared `<HeaderSection>` in the layout.
   - What's unclear: Whether to render a nav/header on the privacy page, or just content + footer.
   - Recommendation: Match the site structure. The main page doesn't use a globally injected header (it's part of `<FirstScreen>`). The privacy page should render at minimum a footer and a back-to-home link. The UI-SPEC says "header + footer" — check whether a simple nav bar component exists separately from `FirstScreen`.

2. **Does the `PrivacyPage` Global need the `payload-types.ts` type to be regenerated?**
   - What we know: `typescript.outputFile` is set in `payload.config.ts`; types are auto-generated.
   - What's unclear: Whether the plan should include an explicit `pnpm payload generate:types` step.
   - Recommendation: Include it. Adding a Global changes `payload-types.ts`; TypeScript compilation will fail without regeneration.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js dev server | [ASSUMED: yes — project is in active development] | — | — |
| pnpm | Package manager | [ASSUMED: yes — pnpm-lock.yaml present] | — | — |
| SQLite DB file (`payload.db`) | Payload CMS | [ASSUMED: yes — dev env running] | — | Schema push creates it |

Step 2.6: No new external dependencies introduced in this phase.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config.*, vitest.config.*, or playwright.config.* found in project root |
| Config file | None — Wave 0 must create if tests are required |
| Quick run command | N/A |
| Full suite command | N/A |

**Note:** `nyquist_validation` is enabled in config. However, Phase 1 requirements (FORM-01–03) are UI interaction fixes and document creation — they are best validated by manual browser verification rather than automated unit tests. Automated tests are scoped to Phase 6 (TEST-01, TEST-02, TEST-03). Wave 0 gap for this phase: none required. The planner should include manual verification steps (browser spot-check) rather than automated test creation.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FORM-01 | `/privacy` returns 200, renders placeholder text | manual smoke | N/A — no test framework | ❌ Phase 6 |
| FORM-02 | Link opens new tab, checkbox state unchanged | manual smoke | N/A | ❌ Phase 6 |
| FORM-03 | Button text visually centered | manual visual | N/A | ❌ Phase 6 |
| AUDIT-01 | `.planning/AUDIT-STACK.md` exists with table + recommendation | file existence check | `test -f .planning/AUDIT-STACK.md` | ❌ Wave 0 |
| AUDIT-02 | `.planning/AUDIT-ANIMATIONS.md` exists with table + recommendation | file existence check | `test -f .planning/AUDIT-ANIMATIONS.md` | ❌ Wave 0 |

### Wave 0 Gaps

- No test framework to install — Phase 6 handles this.
- AUDIT-01 and AUDIT-02 verification is a file existence check, not a test framework concern.

---

## Security Domain

> ASVS categories applicable to Phase 1 changes:

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | Privacy page uses Payload `access: { read: () => true }` — public read, no auth required |
| V5 Input Validation | no | No new user inputs introduced |
| V6 Cryptography | no | — |

**Notable:** The `/privacy` page is intentionally public. `robots: { index: false, follow: false }` is set until real content is in place (from UI-SPEC). No security concerns introduced by this phase.

---

## Sources

### Primary (HIGH confidence)
- Codebase: `src/widgets/lead-form/ui/lead-form-fields.tsx` — FORM-02 current state, FORM-03 button pattern
- Codebase: `src/widgets/first-screen/ui/first-screen-consultation-modal-*.tsx` — FORM-03 root cause (5 files)
- Codebase: `src/widgets/footer/ui/footer-*.tsx` (5 files) — FORM-01 footer link `href="#"`
- Codebase: `src/cms/globals/site-settings.ts` — Payload Global pattern
- Codebase: `src/shared/lib/get-site-settings.ts` — `getPayload()` + `findGlobal()` fetch pattern
- Codebase: `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx` — route group structure, page pattern
- Codebase: `src/payload.config.ts` — Global registration, SQLite adapter, push behavior
- `.planning/phases/01-quick-wins-stack-audit/01-UI-SPEC.md` — design contract, exact file paths, button padding values

### Secondary (MEDIUM confidence)
- `.planning/CONTEXT.md` decisions D-01 through D-14 — locked user decisions
- `.planning/REQUIREMENTS.md` — requirement definitions

---

## Metadata

**Confidence breakdown:**
- FORM-01 (privacy page): HIGH — exact Payload pattern confirmed in codebase; exact file structure confirmed
- FORM-02 (checkbox link): HIGH — current HTML structure inspected; change is a 2-attribute addition
- FORM-03 (button centering): HIGH — asymmetric padding values confirmed in all 5 files; fix approach confirmed by UI-SPEC
- AUDIT-01/02 content: MEDIUM — requires synthesis research; animation library comparison involves ASSUMED library feature knowledge
- Architecture patterns: HIGH — all patterns verified against existing codebase code

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable stack, 30-day validity)
