---
phase: 01-quick-wins-stack-audit
verified: 2026-04-27T00:00:00Z
status: passed
requirements: [FORM-01, FORM-02, FORM-03, AUDIT-01, AUDIT-02]
score: 5/5 must-haves verified
---

# Phase 1: Quick Wins + Stack Audit — Verification Report

**Phase Goal:** Users can interact with forms without hitting broken links or layout glitches, and the team has documented decisions on Next.js vs SPA and animation library choices.
**Verified:** 2026-04-27
**Status:** passed
**Re-verification:** No — initial verification

## Status

passed — все 5 Success Criteria подтверждены в коде и документах, все 5 REQ-ID реализованы.

## Goal Achievement — Observable Truths

| # | Truth (Success Criterion) | Status | Evidence |
|---|---------------------------|--------|----------|
| 1 | Клик по «Политика конфиденциальности» в форме не даёт 404 / reload | passed | `src/widgets/lead-form/ui/lead-form-fields.tsx:483-491` — `<a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={stopPropagation}>`. Страница `src/app/(site)/privacy/page.tsx` существует (85 строк, RSC + Payload fetch + fallback). |
| 2 | Клик по тексту лейбла consent переключает чекбокс | passed | `lead-form-fields.tsx:454-493` — `<label htmlFor={consentId}>` оборачивает весь текст согласия и включает `<span>` с CheckboxCheckIcon; `htmlFor` связан с `<input type="checkbox" id={consentId}>` (line 452). Линк `<a>` внутри использует `stopPropagation`, чтобы не переключать чекбокс при переходе по ссылке. |
| 3 | Кнопка «Оставить заявку» визуально центрирована в case-формах (5 modals) | passed | Во всех 5 файлах `first-screen-consultation-modal-{1440,1024,768,480,360}.tsx` (line 222) кнопка имеет `flex h-[Npx] w-full ... items-center justify-center` без асимметричных `pb-/pt-`. Только form-field wrappers сохраняют `pb-[20px] pt-[10px]` (это бордеры полей, не кнопки). |
| 4 | Существует AUDIT-STACK.md (Next.js vs SPA) с рекомендацией | passed | `.planning/AUDIT-STACK.md` (47 строк, 3 секции): `## Контекст`, `## Сравнение`, `## Recommendation`. Verdict: «Keep Next.js App Router» — обоснование Payload CMS coupling, ISR. |
| 5 | Существует AUDIT-ANIMATIONS.md (boneyard-js vs GSAP vs Framer Motion) с рекомендацией | passed | `.planning/AUDIT-ANIMATIONS.md` (65 строк, 5 секций): `## Контекст`, `## Сравнение`, `## Recommendation`. Verdict: Framer Motion (Safari-safe scroll-driven, replaces boneyard-js). Safari фигурирует как named criterion. |

**Score:** 5/5 truths verified

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/widgets/lead-form/ui/lead-form-fields.tsx` | Privacy link target=_blank + stopPropagation; consent <label htmlFor> | passed | Lines 452, 454, 461, 483-491 — все паттерны на месте |
| `src/widgets/first-screen/ui/first-screen-consultation-modal-{1440,1024,768,480,360}.tsx` | Submit button с flex centering без асимметричных pb/pt | passed | line 222 во всех 5 файлах: `flex h-[Npx] ... items-center justify-center` |
| `src/widgets/footer/ui/footer-{1440,1024,768,480,360}.tsx` | href="/privacy" вместо "#" | passed | grep подтверждает `/privacy` во всех 5 footer файлах |
| `src/cms/globals/privacy-page.ts` | Payload GlobalConfig (slug privacy-page, richText) | passed | 24 строки, GlobalConfig экспортирован |
| `src/payload.config.ts` | PrivacyPage импортирован и в globals[] | passed | line 16 импорт, line 53 `globals: [SiteSettings, PrivacyPage]` |
| `src/app/(site)/privacy/page.tsx` | RSC страница с Payload fetch + fallback + robots:noindex | passed | 85 строк, есть payload.findGlobal + try/catch + Russian placeholder |
| `.planning/AUDIT-STACK.md` | Аудит Next.js vs SPA с рекомендацией | passed | 47 строк, 3 секции, verdict «Keep Next.js App Router» |
| `.planning/AUDIT-ANIMATIONS.md` | Аудит boneyard vs GSAP vs Framer Motion | passed | 65 строк, 5 секций, verdict «Framer Motion» |

## Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| Footer (5 breakpoints) | /privacy route | `<a href="/privacy">` | wired | Все 5 footer файлов содержат `href="/privacy"` |
| lead-form-fields consent | /privacy route | `<a href="/privacy" target="_blank">` | wired | line 485-487 |
| /privacy page | Payload privacy-page Global | `payload.findGlobal({slug:"privacy-page"})` | wired | подтверждено в 01-03-SUMMARY и существует payload.config.ts globals registration |
| Payload config | PrivacyPage Global | `import { PrivacyPage } from "./cms/globals/privacy-page.ts"` + globals[] | wired | payload.config.ts:16,53 |
| Consent label | Checkbox input | `<label htmlFor={consentId}>` ↔ `<input id={consentId}>` | wired | lead-form-fields.tsx:443,461 (useId) |

## Requirements Coverage

| REQ-ID | Description | Status | Evidence |
|--------|-------------|--------|----------|
| FORM-01 | Клик по «Политика конфиденциальности» не вызывает reload (создать /privacy) | passed | `src/app/(site)/privacy/page.tsx` создан; все 5 footer + form ссылок указывают на `/privacy`; ссылка открывается в новой вкладке (target=_blank). |
| FORM-02 | Весь текст лейбла чекбокса согласия кликабелен | passed | `lead-form-fields.tsx:454-493` — `<label htmlFor={consentId}>` оборачивает icon-span + текст-span; native HTML обеспечивает toggle при клике в любом месте лейбла. |
| FORM-03 | Текст «Оставить заявку» по центру кнопки в case forms | passed | Все 5 consultation modals: `flex h-[Npx] w-full ... items-center justify-center` без асимметричных `pb-/pt-`. |
| AUDIT-01 | Аудит Next.js vs React SPA с обоснованием | passed | `.planning/AUDIT-STACK.md` (3 секции, verdict). |
| AUDIT-02 | Аудит подхода к анимациям (boneyard-js vs GSAP vs Framer Motion) | passed | `.planning/AUDIT-ANIMATIONS.md` (5 секций, Safari-критерий, verdict Framer Motion). |

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/(site)/privacy/page.tsx` | (per 01-03-SUMMARY § Known Stubs) | Когда `richTextContent != null`, страница рендерит статический «в процессе подготовки», а не Lexical rich text | info | Запланированный stub; пока CMS-контент не наполнен (richTextContent == null), страница рендерит полный fallback. Не блокирует FORM-01. |
| `src/payload.config.ts` / dev workflow | — | `pnpm payload generate:types` падает с ERR_REQUIRE_ASYNC_MODULE на Node v24 | info | Pre-existing tooling issue, не введено этой фазой. PrivacyPage type не сгенерирован, в /privacy page используется `Record<string, unknown>` cast. |

Никаких TODO/FIXME/placeholder grep-матчей в новых артефактах фазы 1, которые блокировали бы цель, не найдено.

## Critical Gaps

Отсутствуют. Все Success Criteria и REQ-ID подтверждены в коде/документах.

## Non-Critical Gaps / Tech Debt

1. **Lexical rich-text rendering на /privacy** — когда клиент добавит контент в Payload admin, потребуется отдельный план для подключения LexicalRichText client component (документировано в 01-03-SUMMARY § Known Stubs).
2. **`pnpm payload generate:types` на Node v24** — pre-existing tx/tsx ERR_REQUIRE_ASYNC_MODULE, документирован в 01-02-SUMMARY. Не введён этой фазой; влияет только на DX (нет авто-типов для PrivacyPage).
3. **REQUIREMENTS.md traceability table** — секция показывает FORM-01/02/03 + AUDIT-01/02 со статусом «Pending», хотя фаза завершена 2026-04-22. Обновление таблицы не выполнено в рамках фазы (текстовая инконсистентность, не функциональный gap).

## Notes

- Re-verification mode: previous VERIFICATION.md в текущей директории не найден (старый `.planning/01-VERIFICATION.md` отсутствует); это initial verification.
- ROADMAP.md уже отмечает Phase 1 как Complete (2026-04-22), 4/4 plans done.
- Все 4 SUMMARY.md (01-01, 01-02, 01-03, 01-04) присутствуют и согласованы с реальным состоянием кода.
- Поведенческая проверка (Step 7b): пропущена — фаза не предоставляет нового runnable entry point, изменения покрываются Phase 6 Playwright тестами (E2E уже существуют).
- Visual UAT (центрирование кнопки в Safari/Chrome во всех 5 модалках, реальный переход по ссылке /privacy) уже отражён в `.planning/phases/01-quick-wins-stack-audit/01-HUMAN-UAT.md` и подтверждён закрытием фазы.

---

*Verified: 2026-04-27*
*Verifier: Claude (gsd-verifier)*
