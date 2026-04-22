---
phase: 01-quick-wins-stack-audit
verified: 2026-04-22T00:00:00Z
status: human_needed
score: 9/9 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Navigate to /privacy in the browser"
    expected: "Page renders with dark background, Montserrat font, Russian privacy policy placeholder text, back-to-home link, and footer. No 404."
    why_human: "RSC page existence and Payload wiring are verified, but actual render with layout inheritance requires browser."
  - test: "Open a consultation modal (any breakpoint) and inspect the 'оставить заявку' button"
    expected: "Button text is visually centered — no top-shift caused by asymmetric padding."
    why_human: "CSS visual centering cannot be confirmed programmatically; requires browser render."
  - test: "Click 'Политикой конфиденциальности' in the consent checkbox label"
    expected: "Link opens /privacy in a new tab; the checkbox does NOT toggle."
    why_human: "stopPropagation + target=_blank are confirmed in code, but real browser event flow needs manual check."
  - test: "Click the consent label text (not the privacy link) outside the <a> element"
    expected: "The checkbox toggles."
    why_human: "htmlFor wiring verifiable in code but label interaction requires browser to confirm."
---

# Phase 1: Quick Wins + Stack Audit — Verification Report

**Phase Goal:** Users can interact with forms without hitting broken links or layout glitches, and the team has documented decisions on Next.js vs SPA and animation library choices
**Verified:** 2026-04-22
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Clicking 'Политикой конфиденциальности' opens /privacy in a new tab without toggling the checkbox | VERIFIED | lead-form-fields.tsx L478–486: `target="_blank"`, `rel="noopener noreferrer"`, `onClick={(e) => e.stopPropagation()}` all present on the `<a>`. Label `htmlFor` means non-link label text toggles checkbox. |
| 2 | Clicking the rest of the consent label text toggles the checkbox | VERIFIED | `<label htmlFor={consentId}>` at L456 — clicking anywhere in the label (except the `<a>` which stops propagation) toggles the checkbox. |
| 3 | The 'оставить заявку' button text is visually centered in all five consultation modal breakpoints | VERIFIED | All 10 button instances confirmed (grep): `h-[60px]/[56px]/[52px]/[48px]/[44px]` with `flex items-center justify-center` — no `pb-[Npx] pt-[Npx]` asymmetric padding on any button element. Remaining `pb-[20px]` occurrences are on form field wrappers, not buttons. |
| 4 | Navigating to /privacy returns a rendered page — not a 404 | VERIFIED | `src/app/(site)/privacy/page.tsx` exists at the correct (site) route group path. `export default async function PrivacyPage()` — valid RSC default export. |
| 5 | The page inherits site layout: Montserrat font, dark background, footer | VERIFIED | File is inside `src/app/(site)/privacy/` — inherits (site) layout with Montserrat and SiteLoadOverlay. `bg-[#0d0300]` on outer div. `FooterSection` imported and rendered at L82. |
| 6 | The page renders placeholder Russian privacy policy text when no CMS content is set | VERIFIED | `PLACEHOLDER` const (L16–34) with 6-section Russian text. Rendered in `richTextContent == null` branch (L70–79). `catch {}` ensures Payload errors fall through to placeholder. |
| 7 | All five footer variants link to /privacy instead of # | VERIFIED | grep confirms `href="/privacy"` with `{footerContent.privacy}` in: footer-1440.tsx (L229), footer-1024.tsx (L229), footer-768.tsx (L221), footer-480.tsx (L216), footer-360.tsx (L216). Zero `href="#"` on privacy links. |
| 8 | A written comparison of Next.js App Router vs React SPA exists with a concrete recommendation | VERIFIED | `.planning/AUDIT-STACK.md` exists. Contains 8-criterion Markdown table. `## Recommendation` section with unambiguous verdict: "оставить Next.js App Router — миграция на React SPA нецелесообразна." |
| 9 | A written comparison of boneyard-js+CSS vs GSAP vs Framer Motion exists with a concrete recommendation; Safari named as criterion; recommendations are unambiguous | VERIFIED | `.planning/AUDIT-ANIMATIONS.md` exists. 9-criterion 4-column table. Safari is a named row with explicit coverage of `scroll-timeline` Safari < 18 gap. `## Recommendation` section: "перейти на Framer Motion (пакет `motion`)." |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/widgets/lead-form/ui/lead-form-fields.tsx` | Privacy link with target=_blank + rel=noopener | VERIFIED | L482: `target="_blank"`, L483: `rel="noopener noreferrer"`, L481: `onClick={(e) => e.stopPropagation()}` |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx` | Submit button without asymmetric padding at h-[60px] | VERIFIED | L501 and L543: `h-[60px] w-full shrink-0 items-center justify-center` — no pb/pt padding tokens |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx` | Submit button without asymmetric padding at h-[44px] | VERIFIED | L222 and L443: `h-[44px] w-full shrink-0 items-center justify-center` — no pb/pt padding tokens |
| `src/cms/globals/privacy-page.ts` | Payload GlobalConfig for privacy page with richText content field | VERIFIED | slug: "privacy-page", label: "Политика конфиденциальности", admin.group: "Контент", access.read: () => true, fields[content: richText] |
| `src/payload.config.ts` | PrivacyPage registered in globals array | VERIFIED | L16: import statement, L53: `globals: [SiteSettings, PrivacyPage]` |
| `src/app/(site)/privacy/page.tsx` | Next.js App Router RSC page fetching Payload 'privacy-page' Global | VERIFIED | Exists at correct (site) route group path. L8: revalidate=60, L10–14: metadata with robots, L41–44: findGlobal, L82: FooterSection |
| `src/widgets/footer/ui/footer-1440.tsx` | Footer with href=/privacy on privacy link | VERIFIED | L229: `href="/privacy"` |
| `src/widgets/footer/ui/footer-360.tsx` | Footer with href=/privacy on privacy link (narrowest breakpoint) | VERIFIED | L216: `href="/privacy"` |
| `.planning/AUDIT-STACK.md` | Next.js vs SPA comparison table + recommendation | VERIFIED | Exists. Has `## Recommendation` with unambiguous "Keep Next.js App Router" verdict. 8-criterion table. |
| `.planning/AUDIT-ANIMATIONS.md` | boneyard+CSS vs GSAP vs Framer Motion comparison + Safari criterion + recommendation | VERIFIED | Exists. Has `## Recommendation` (Framer Motion). Safari is a named table row. 9-criterion table. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| lead-form-fields.tsx `<a onClick={stopPropagation}>` | /privacy new tab | target="_blank" + rel=noopener noreferrer | WIRED | Both attributes present at L482–483 alongside stopPropagation at L481 |
| consultation modal button className | flex centering | removal of pb-[Npx] pt-[Npx] | WIRED | All 10 button instances across 5 files confirm: no pb-[Npx] pt-[Npx] on button elements; h-[Npx] + flex items-center justify-center intact |
| src/payload.config.ts globals array | src/cms/globals/privacy-page.ts | `import { PrivacyPage } from "./cms/globals/privacy-page.ts"` | WIRED | L16: import present; L53: PrivacyPage in globals array |
| src/app/(site)/privacy/page.tsx | Payload privacy-page Global | payload.findGlobal({ slug: 'privacy-page' }) | WIRED | L41–44: `payload.findGlobal({ slug: "privacy-page", overrideAccess: true })` with catch block |
| src/app/(site)/privacy/page.tsx | FooterSection | `import { FooterSection } from @/widgets/footer` | WIRED | L5: import present; L82: `<FooterSection showNews={false} showSecrets={false} />` |
| AUDIT-ANIMATIONS.md recommendation | Phase 4 Safari + Animations planning | Safari named as criterion with explicit API gap documentation | WIRED | Safari row in comparison table with explicit `scroll-timeline`/`animation-timeline` Safari < 18 coverage |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/app/(site)/privacy/page.tsx` | richTextContent | `payload.findGlobal({ slug: "privacy-page" })` | Yes — live Payload query; falls back to PLACEHOLDER const on error | FLOWING (with intentional static fallback) |

**Note:** When `richTextContent != null` (CMS content is set by admin), the current code renders "Политика конфиденциальности в процессе подготовки." instead of the actual rich text content. This is a documented intentional stub — rendering Payload's LexicalRichText requires a client boundary and was out of scope for Phase 1. Documented in 01-03-SUMMARY.md under "Known Stubs." The null branch (showing PLACEHOLDER) works correctly.

---

### Behavioral Spot-Checks

Step 7b: SKIPPED for dev-server-dependent checks (no running server available). File existence and wiring verified programmatically.

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FORM-01 | 01-02, 01-03 | Clicking privacy link doesn't cause page reload — create /privacy | SATISFIED | /privacy page exists at (site) route group; footer hrefs updated; Payload Global registered |
| FORM-02 | 01-01 | All consent label text is clickable; privacy link opens without toggling checkbox | SATISFIED | `htmlFor` on label; `stopPropagation` on link; `target="_blank"` present |
| FORM-03 | 01-01 | "Оставить заявку" button text centered in form | SATISFIED | Asymmetric pb/pt removed from all 10 button instances across 5 breakpoints |
| AUDIT-01 | 01-04 | Documented rationale: Next.js vs React SPA | SATISFIED | AUDIT-STACK.md exists with table and unambiguous recommendation |
| AUDIT-02 | 01-04 | Documented animation approach recommendation: boneyard-js+CSS vs GSAP vs Framer Motion | SATISFIED | AUDIT-ANIMATIONS.md exists with Safari criterion and unambiguous Framer Motion recommendation |

**Orphaned requirements check:** REQUIREMENTS.md maps FORM-01, FORM-02, FORM-03, AUDIT-01, AUDIT-02 to Phase 1. All five are claimed by plans and verified above. No orphaned requirements.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/app/(site)/privacy/page.tsx` L61–69 | When `richTextContent != null`, renders static "в процессе подготовки" message instead of actual CMS content | Warning | CMS-managed content not rendered when set by admin — but this is documented as intentional out-of-scope. Follow-up plan needed to wire LexicalRichText renderer. |

No blocker anti-patterns. The privacy-page rich text rendering gap is documented, intentional, and does not block any Phase 1 success criteria (the page is reachable and renders placeholder correctly).

---

### Human Verification Required

#### 1. /privacy page browser render

**Test:** Start dev server (`pnpm dev`), navigate to `http://localhost:3000/privacy`
**Expected:** Page renders with dark `#0d0300` background, Montserrat font (inherited from (site) layout), "← На главную" back link, Russian privacy policy placeholder text in a `<pre>` block, and footer. HTTP 200, not 404.
**Why human:** RSC page existence and Payload fetch wiring confirmed in code, but actual layout inheritance from (site) route group requires browser render to confirm fonts and dark background are applied.

#### 2. Consultation modal button visual centering

**Test:** Open any consultation modal (click CTA on main page), inspect the "оставить заявку" button across screen sizes
**Expected:** Button text is visually centered — no vertical top-shift
**Why human:** CSS flex centering with fixed height is verified in code (asymmetric pb/pt removed, h-[Npx] + flex items-center justify-center intact), but visual confirmation of centering requires browser render at each breakpoint.

#### 3. Privacy link behavior in consent checkbox

**Test:** In any lead form, click the "Политикой конфиденциальности" link text
**Expected:** /privacy opens in a new browser tab; the consent checkbox does NOT toggle state
**Why human:** `stopPropagation` + `target="_blank"` verified in code, but actual browser event bubbling behavior must be confirmed interactively.

#### 4. Consent label text clickability

**Test:** In any lead form, click the consent label text ("Согласен(на) на обработку...") outside the privacy link
**Expected:** The consent checkbox toggles
**Why human:** `htmlFor` wiring is confirmed in code but label interaction UX requires browser.

---

### Gaps Summary

No gaps found. All 9 must-have truths are verified in the codebase. All 5 required artifacts exist with substantive content and correct wiring. All 5 requirement IDs (FORM-01, FORM-02, FORM-03, AUDIT-01, AUDIT-02) are satisfied.

Status is `human_needed` (not `passed`) because four items require browser-level interaction to fully confirm: visual centering, layout inheritance, and form event behavior. These are standard post-implementation checks that cannot be verified by static code analysis.

---

_Verified: 2026-04-22_
_Verifier: Claude (gsd-verifier)_
