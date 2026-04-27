---
phase: 07-modal-unification
created: 2026-04-27
milestone: v1.1
discuss_mode: auto-decisions (auto-mode active, user pre-approved scope in conversation)
---

# Phase 7 — Modal Unification: Decisions

**Goal:** 5 идентичных файлов `first-screen-consultation-modal-{1440,1024,768,480,360}.tsx` (всего 2433 строки) → один источник правды без потери visual / behavioral parity.

## Codebase Scout (что нашлось)

| Факт | Файл | Импликация |
|---|---|---|
| 5 модалок, 460-570 строк каждая | `src/widgets/first-screen/ui/first-screen-consultation-modal-{360,480,768,1024,1440}.tsx` | Дубликаты JSX и формы, отличия только в Tailwind classes / icon sizes / media query selectors |
| Diff 360 vs 480: ~30 точечных отличий по классам и размерам | (см. `git diff` в conversation) | Variant-table подход реален: можно унести отличия в lookup table |
| `useViewportLayout()` хук гейтит per-breakpoint Section компонент | `src/widgets/first-screen/ui/first-screen.tsx:19,48-126` | В рантайме рендерится ровно одна модалка; «единый компонент с variant prop» = zero дополнительной нагрузки |
| 13 точек импорта `FirstScreenConsultationModalXXX` (5 sections + 8 widgets) | grep по `src/` | Названные экспорты должны остаться, иначе massive callsite changes |
| Form state shared across all 5 (`defaultFirstScreenConsultationFormState` импортируется из 1440) | `first-screen.tsx:7-9` | Consultation form state уже централизован в одном файле — Modal-1440 фактически уже хост logic |
| Playwright spec покрывает submission flow на consultation-modal | `tests/e2e/consultation-modal.spec.ts` | Visual / behavior parity guard; рефакторинг не должен ронять spec без изменений |

## Locked Decisions (auto-applied)

### D1 — Архитектура: «один компонент + variant prop» + thin re-exports

**Choice:** Создаём `ConsultationModal` (унифицированный) принимающий `variant: "360" | "480" | "768" | "1024" | "1440"`. Per-variant отличия (tailwind classes, icon size, max-width, padding, media queries) живут в `consultation-modal-variants.ts` (lookup map). Существующие именованные экспорты (`FirstScreenConsultationModal360`..`1440`) остаются как thin re-exports / wrappers с захардкоженным variant — **callsites не меняются**.

**Why:**
- Diff между 5 модалками — точечные классы, не разная разметка → variant table идеально ложится.
- Phase 8 (FUNC-01..04) хочет «один submit handler» — единый компонент даёт его естественно.
- Per-breakpoint sections рендерят модалку через `useViewportLayout()` — в рантайме всё равно одна. Стоимость условного рендеринга нулевая.
- Re-exports сохраняют 13 callsites без изменений → review surface сужается до самого base + variant config.

**Не выбрано (и почему):**
- *Base + 5 thin wrappers с дубликатами JSX* — частично решает дубли, но всё ещё 5 файлов с одинаковой разметкой. Сейчас разметка идентична (только классы) — нет выгоды.
- *CSS-only responsive (Tailwind breakpoints)* — current code использует фиксированные width/height в стилях (max-w-[360px], max-w-[384px], height-[N]px). Адаптация на media-query вариантах разорвёт SVERKA pixel-budget.

### D2 — Co-location: остаёмся в `src/widgets/first-screen/ui/`

**Choice:** Базовый компонент и variant config — рядом с существующими файлами в `src/widgets/first-screen/ui/`. Переименовываем существующие 5 файлов в thin wrappers, добавляем новые:
- `consultation-modal.tsx` — base
- `consultation-modal-variants.ts` — lookup table
- `first-screen-consultation-modal-{360,480,768,1024,1440}.tsx` — каждый превращается в `export const FirstScreenConsultationModalXXX = (props) => <ConsultationModal variant="XXX" {...props} />` (≤20 строк)

**Why:** Модалка концептуально часть first-screen feature. Перенос в новую директорию = перепрописывание импортов в 13 файлах без выгоды.

### D3 — Migration: big-bang в одной фазе

**Choice:** Вся унификация — Phase 7 atomic-commit-by-commit (1 plan = вытащить shared form state + типы; 2 plan = ввести base + variants table; 3 plan = превратить 5 файлов в thin wrappers; 4 plan = cleanup).

**Why:**
- Тесты (Playwright `consultation-modal.spec.ts` + Vitest `phone-format`/`lead-form-validation`) уже покрывают behavior — есть страховка от регрессий.
- Прогрессивная миграция (один breakpoint per PR) растянет процесс на 5 PR с одинаковой логикой review — затраты выше выгоды.
- Phase 8 ждёт единый submit handler — раздельная миграция блокировала бы её.

### D4 — Submit handler shape — without changes (для Phase 7)

**Choice:** Оставляем текущий callback prop pattern (`onCloseModal`, `setFormState`, etc. через props из Section). **Никакого нового hook / context provider в Phase 7.**

**Why:** Phase 7 = чистый рефакторинг (no functional change). Изменение submit shape — задача Phase 8 (FUNC-01..04). Миксовать рефакторинг и new functionality нарушает «small atomic changes» принцип.

### D5 — Visual parity guard

**Choice:** После каждого шага миграции обязательный прогон:
- `pnpm exec playwright test tests/e2e/consultation-modal.spec.ts` (E2E behaviour)
- `pnpm exec playwright test tests/e2e/cross-browser.spec.ts` (smoke render)
- Manual sverka на 1 breakpoint (любом) — Figma diff ≤ 1px

**Why:** Тесты покрывают behavior, но pixel-perfect parity (D1 risk) — только Figma sverka. На 1 breakpoint достаточно: variant table работает либо для всех, либо ни для кого.

## Open Questions → Resolved

| Question | Resolution |
|---|---|
| Variant prop vs CSS-only responsive? | Variant prop (D1) — фикс размеры в текущем коде, Tailwind responsive разорвал бы pixel-budget |
| Где живёт base? | `src/widgets/first-screen/ui/consultation-modal.tsx` (D2) |
| Big-bang vs progressive migration? | Big-bang (D3) — есть тестовое покрытие, Phase 8 зависит |
| Менять submit shape сейчас? | Нет (D4) — Phase 8 это сделает |
| Visual regression risk? | Mitigated (D5) — Playwright + manual sverka 1 breakpoint |

## Deferred Ideas (вне Phase 7)

- **REFAC-02/03/04** (`business-goals.tsx`, `services-section-below-1024.tsx`, shared form types) — отложены в v1.2 «Tech Debt», подтверждено в milestone scope.
- **Полный редизайн модалки** — не v1.1, отдельный feature-cycle.
- **Animation rework** (open/close transitions) — текущие cubic-bezier transitions работают, не трогаем без причины.

## Constraints для Researcher / Planner

**Researcher should investigate:**
- Точечный diff between 5 modal files — собрать exhaustive variant table (max-width, icon size, padding, font-sizes, gap, media query selectors).
- Existing form-state contract из `first-screen-consultation-modal-1440.tsx` — какие именно типы экспортируются (`FirstScreenConsultationModalTitleVariant`, `defaultFirstScreenConsultationFormState`), что нужно сохранить.
- Tailwind безопасность — убедиться что lookup-table classes не выпадут из tailwind safelist (статические строки в config).

**Planner should NOT re-ask user about:**
- Архитектурный выбор (D1 locked).
- Расположение файлов (D2 locked).
- Стратегия миграции (D3 locked).
- Submit shape (D4 — это Phase 8).

**Plans expected:**
1. Extract shared types + form-state utility from modal-1440 → `consultation-modal-state.ts` (preparation, no behavior change).
2. Create `consultation-modal-variants.ts` (variant lookup) + base `consultation-modal.tsx`.
3. Convert 5 existing modal files to thin wrappers `<ConsultationModal variant="XXX" {...} />`.
4. Cleanup unused imports, run full test suite, manual Figma sverka on one breakpoint.

## Success Criteria (mirror to PLAN must-haves)

1. Один файл `consultation-modal.tsx` содержит весь shared JSX + form logic.
2. `consultation-modal-variants.ts` exhaustive — никаких inline if/else по variant в base.
3. 5 файлов `first-screen-consultation-modal-XXX.tsx` сократились до thin wrappers (≤20 строк каждый, только default props + re-export).
4. 13 callsites не изменились (импорты по старым именам работают).
5. `pnpm run test:e2e` + `pnpm run test:unit` zero regression.
6. Manual Figma sverka на 1 breakpoint — pixel diff ≤ 1px.
