# Phase 1: Quick Wins + Stack Audit — Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 13 new/modified files + 2 audit documents
**Analogs found:** 12 / 13 (audit documents have no runtime analog)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/(site)/privacy/page.tsx` | page (RSC) | request-response | `src/app/(site)/page.tsx` | exact |
| `src/cms/globals/privacy-page.ts` | config (Payload Global) | — | `src/cms/globals/site-settings.ts` | exact |
| `src/payload.config.ts` | config | — | self (modification) | self |
| `src/widgets/lead-form/ui/lead-form-fields.tsx` | component | event-driven | self (modification) | self |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx` | component | event-driven | self (modification) | self |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx` | component | event-driven | `modal-1440.tsx` | exact |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx` | component | event-driven | `modal-1440.tsx` | exact |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx` | component | event-driven | `modal-1440.tsx` | exact |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx` | component | event-driven | `modal-1440.tsx` | exact |
| `src/widgets/footer/ui/footer-1440.tsx` | component | — | self (modification) | self |
| `src/widgets/footer/ui/footer-1024.tsx` | component | — | `footer-1440.tsx` | exact |
| `src/widgets/footer/ui/footer-768.tsx` | component | — | `footer-1440.tsx` | exact |
| `src/widgets/footer/ui/footer-480.tsx` | component | — | `footer-1440.tsx` | exact |
| `src/widgets/footer/ui/footer-360.tsx` | component | — | `footer-1440.tsx` | exact |
| `.planning/AUDIT-STACK.md` | document | — | none | no analog |
| `.planning/AUDIT-ANIMATIONS.md` | document | — | none | no analog |

---

## Pattern Assignments

### `src/cms/globals/privacy-page.ts` (config, Payload Global)

**Analog:** `src/cms/globals/site-settings.ts`

**Full pattern** (lines 1–114):
```typescript
// src/cms/globals/site-settings.ts — copy this exact structure
import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Настройки сайта",
  admin: {
    group: "Настройки",
    description: "Управление видимостью секций на главной странице",
  },
  access: {
    read: () => true,   // public read, no auth
  },
  fields: [
    // ... field definitions
  ],
};
```

**Adapted form for `privacy-page.ts`:**
```typescript
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

---

### `src/payload.config.ts` (config, modification)

**Pattern — Global registration** (lines 15, 52):
```typescript
// Line 15 — existing import pattern to follow:
import { SiteSettings } from "./cms/globals/site-settings.ts";

// Add alongside it:
import { PrivacyPage } from "./cms/globals/privacy-page.ts";

// Line 52 — existing globals array:
globals: [SiteSettings],

// After modification:
globals: [SiteSettings, PrivacyPage],
```

**Critical note from codebase** (lines 68–71): `push: false` is the default in dev. After adding `PrivacyPage`, run `PAYLOAD_DATABASE_PUSH=1 pnpm dev` once to apply the schema.

---

### `src/app/(site)/privacy/page.tsx` (page/RSC, request-response)

**Analog:** `src/app/(site)/page.tsx`

**Imports pattern** (lines 1–16 of analog):
```typescript
import type { Metadata } from "next";
import { FooterSection } from "@/widgets/footer";
// + any widget imports needed for privacy layout
```

**Revalidation + metadata pattern** (lines 19–46 of analog):
```typescript
/** Обновление с CMS без полной пересборки. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных SOLO Продакшн",
  robots: { index: false, follow: false },
};
```

**Payload fetch pattern** — from `src/shared/lib/get-site-settings.ts` (lines 28–47):
```typescript
import { getPayload } from "payload";
import config from "@payload-config";

// Inside the async RSC:
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
    // fallback to static placeholder — same catch-and-default pattern as get-site-settings.ts line 44
  }
  // render ...
}
```

**Page shell pattern** (analog `page.tsx` lines 55–73):
```tsx
// Existing page uses:
return (
  <main className="app-main">
    {/* sections */}
    <FooterSection showNews={settings.showNews} showSecrets={settings.showSecrets} />
  </main>
);

// Privacy page should use the same <main> wrapper + FooterSection.
// No globally injected header exists in layout.tsx — add a back-to-home link or minimal nav.
```

**Route group constraint** (from `src/app/(site)/layout.tsx` lines 104–117): File MUST live at `src/app/(site)/privacy/page.tsx` — NOT `src/app/privacy/page.tsx` — to inherit `<html lang="ru">`, Montserrat font variable, `page-shell` body class, and `<SiteLoadOverlay />`.

---

### `src/widgets/lead-form/ui/lead-form-fields.tsx` (component, FORM-02 fix)

**Current state at lines 478–484:**
```tsx
<a
  className="underline decoration-solid [text-decoration-skip-ink:none]"
  href="/privacy"
  onClick={(e) => e.stopPropagation()}
>
  Политикой конфиденциальности
</a>
```

**Required change — add two attributes only:**
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

**IMPORTANT:** Do NOT touch the submit button in this file (lines 489–498). It uses `min-h-[...]` (not fixed `h-[...]`) and has no asymmetric padding — it is already correctly centered.

---

### `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx` (FORM-03)

**Current button className at lines 501 and 543:**
```tsx
className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[24px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

**Fix — remove `pb-[20px] pt-[24px]`:**
```tsx
className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

Both button occurrences at lines 501 and 543 have the same padding pattern and both need the fix.

---

### `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx` (FORM-03)

**Current button className at lines 222 and 443:**
```tsx
className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[22px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

**Fix — remove `pb-[20px] pt-[22px]`:**
```tsx
className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

---

### `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx` (FORM-03)

**Pattern:** Same as 1024 variant. Per RESEARCH.md, lines 222 and 445.

**Fix — remove `pb-[20px] pt-[19px]` from `h-[52px]` buttons:**
```tsx
// Before:
className="flex h-[52px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[19px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"

// After:
className="flex h-[52px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

---

### `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx` (FORM-03)

**Pattern:** Same as 1024/768 variants. Per RESEARCH.md, lines 222 and 456.

**Fix — remove `pb-[20px] pt-[19px]` from `h-[48px]` buttons:**
```tsx
// Before:
className="flex h-[48px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[19px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"

// After:
className="flex h-[48px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

---

### `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx` (FORM-03)

**Confirmed pattern at lines 222 and 443 (read from codebase):**
```tsx
// Line 222 (success state button):
className="flex h-[44px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[17px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"

// Line 443 (form submit button):
className="flex h-[44px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[17px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

**Fix — remove `pb-[20px] pt-[17px]` from both:**
```tsx
className="flex h-[44px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
```

---

### Footer files — `footer-1440.tsx`, `footer-1024.tsx`, `footer-768.tsx`, `footer-480.tsx`, `footer-360.tsx` (FORM-01)

**Current state (confirmed in codebase — footer-1440.tsx line 229, footer-360.tsx line 216):**
```tsx
<a
  className="self-start font-normal leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70"
  href="#"
  style={{ color: "#9c9c9c" }}
>
  {footerContent.privacy}
</a>
```

**Fix — change `href="#"` to `href="/privacy"` in all 5 files:**
```tsx
<a
  className="self-start font-normal leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70"
  href="/privacy"
  style={{ color: "#9c9c9c" }}
>
  {footerContent.privacy}
</a>
```

All 5 footer files are independent components with the same hardcoded `href="#"` value. Update all 5 as a batch.

---

## Shared Patterns

### Payload Global definition
**Source:** `src/cms/globals/site-settings.ts` (lines 1–114)
**Apply to:** `src/cms/globals/privacy-page.ts`

Key elements to copy:
- `import type { GlobalConfig } from "payload"` — named export, not default
- `access: { read: () => true }` — public read
- `admin.group` — groups item in Payload admin sidebar

### Payload Global fetch (RSC)
**Source:** `src/shared/lib/get-site-settings.ts` (lines 28–47)
**Apply to:** `src/app/(site)/privacy/page.tsx`

Key elements:
- `import { getPayload } from "payload"` + `import config from "@payload-config"`
- `const payload = await getPayload({ config })`
- `await payload.findGlobal({ slug: "...", overrideAccess: true })`
- `catch {}` block returning safe defaults (never throw from RSC page data fetch)

### RSC page structure
**Source:** `src/app/(site)/page.tsx` (lines 1–74)
**Apply to:** `src/app/(site)/privacy/page.tsx`

Key elements:
- `export const revalidate = 60` — ISR, matches all existing pages
- `export const metadata: Metadata` — Next.js Metadata object export
- `export default async function` — async RSC, not `"use client"`
- `<FooterSection>` rendered explicitly (no shared footer in layout)

### Button centering pattern (the correct pattern)
**Source:** `src/widgets/lead-form/ui/lead-form-fields.tsx` (lines 489–498)
**Apply to:** All 5 consultation modal files (reference, not copy)

```tsx
// This is the CORRECT already-fixed pattern (do NOT modify):
className={cn(
  "flex w-full items-center justify-center rounded-[50px] border-0 bg-[#ff5c00] px-10 font-semibold lowercase text-white transition-colors hover:bg-[#de4f00]",
  d.btn,
  d.btnH,
)}
```
Note: uses `min-h-[...]` via density class, no asymmetric padding.

---

## FORM-03 Padding Removal Reference Table

| File | Lines | Height | Padding to Remove |
|------|-------|--------|------------------|
| `modal-1440.tsx` | 501, 543 | `h-[60px]` | `pb-[20px] pt-[24px]` |
| `modal-1024.tsx` | 222, 443 | `h-[56px]` | `pb-[20px] pt-[22px]` |
| `modal-768.tsx` | 222, 445 | `h-[52px]` | `pb-[20px] pt-[19px]` |
| `modal-480.tsx` | 222, 456 | `h-[48px]` | `pb-[20px] pt-[19px]` |
| `modal-360.tsx` | 222, 443 | `h-[44px]` | `pb-[20px] pt-[17px]` |

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.planning/AUDIT-STACK.md` | document | — | Static Markdown audit; no runtime analog exists |
| `.planning/AUDIT-ANIMATIONS.md` | document | — | Static Markdown audit; no runtime analog exists |

For these files, the planner should use the format specified in RESEARCH.md decisions D-08/D-12: comparison table with columns + explicit recommendation section.

---

## Metadata

**Analog search scope:** `src/app/(site)/`, `src/cms/globals/`, `src/widgets/lead-form/`, `src/widgets/first-screen/`, `src/widgets/footer/`, `src/shared/lib/`
**Files read:** 12 source files
**Pattern extraction date:** 2026-04-22
