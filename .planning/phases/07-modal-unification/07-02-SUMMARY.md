---
phase: 07-modal-unification
plan: 02
subsystem: widgets/first-screen
tags: [refactor, modal-unification, base-component, variant-table, no-callsite-changes]
requires:
  - "src/widgets/first-screen/model/first-screen-consultation-form-state.ts (от Plan 07-01)"
  - "Текущие 5 модалок first-screen-consultation-modal-{360,480,768,1024,1440}.tsx (источник exhaustive variant config'а)"
provides:
  - "src/widgets/first-screen/ui/consultation-modal-variants.ts (variant lookup table + types)"
  - "src/widgets/first-screen/ui/consultation-modal.tsx (unified ConsultationModal base — пока ни к чему не подключён)"
affects: []
tech-stack:
  added: []
  patterns:
    - "Lookup-table per-variant config (D1 из CONTEXT.md): все отличия 5 breakpoints вынесены в Record<ConsultationModalVariant, ConsultationModalVariantConfig>"
    - "Статические Tailwind строки в variant config (нет интерполяции `text-[${size}px]`) — JIT их подхватит без safelist"
    - "Inline style для font-size где значение чисто числовое (titleSize, submitFontSize, successTitleSize, successBodySize, successButtonFontSize) — единственный path к произвольным числам без интерполяции класса"
    - "CloseIcon принимает size prop с union-литералом 24|28|30|34 → статический size-[Npx] класс через if-цепочку (4 варианта, JIT-safe)"
    - "Form/leave/success animation flow (cubic-bezier(0.22,1,0.36,1), таймеры 320/380/400) единообразен для всех 5 variant'ов — раньше 360/480/768/1024 имели instant-switch (isSuccess boolean), теперь fade-out → fade-in. CONTEXT.md D5 явно допускает это (transition не pixel-метрика)."
key-files:
  created:
    - "src/widgets/first-screen/ui/consultation-modal-variants.ts (255 строк)"
    - "src/widgets/first-screen/ui/consultation-modal.tsx (754 строки)"
  modified: []
decisions:
  - "Поле maxWidthSuccess добавлено для каждого variant'а — не у всех success-card шире/уже form-card (1440 form 686 → success 490, 480 form 480 → success 384, 1024/768 form ≠ success). Отдельное поле явное и легче поддерживать чем условный switch внутри base."
  - "Поле successCardPadding выделено отдельно от cardPadding: на 360 success имеет компактный `px-[12px] pt-[12px] pb-[16px]` (отличается от p-form), на остальных — единый `px-[30px] pt-[30px] pb-[35px]`."
  - "Поля successCardOverflow / formCardOverflow: 360 form/success — overflow-x-clip (защита от long-text overflow в узкой колонке), 480 form тоже overflow-x-clip, остальные — overflow-visible. Заведено как explicit поле, чтобы не было сюрпризов на переключении."
  - "fieldsDirection union-литерал ('column'|'row'|'responsive-500') а не tailwind-строка: безопаснее для Type union'а, конвертируется в tailwind через локальный helper fieldsDirectionClass(). Класс `flex-col min-[500px]:flex-row` остаётся статичным."
  - "Title для variant 360 / 480 (stacked layout) применяет fontSize через inline style на каждом span, поскольку leading у block-spans тоже разный (0.9). Это identical с текущей разметкой 360/480."
  - "Container max-w задаётся на колонке (а не на самом form/success), как в 1440 — это позволяет иметь transition-[max-width] между form и success step с разной шириной. Для 360/480/768/1024 column-max == form-max, так что визуально parity."
metrics:
  duration: ~25min
  completed: 2026-04-27
requirements:
  - REFAC-01
  - REFAC-02
---

# Phase 7 Plan 2: Unified Modal Base + Variant Lookup Summary

Создан unified `ConsultationModal` (754 строки) + exhaustive variant lookup table `consultation-modal-variants.ts` (255 строк) для всех 5 breakpoints (360/480/768/1024/1440). Per-CONTEXT.md D1 — «один компонент + variant prop». Компонент пока не подключён ни к одному callsite — это Plan 07-03. Старые 5 модалок остаются нетронутыми и работающими.

## Что сделано

### Task 1: variant lookup table (commit `a51ad75`)

`src/widgets/first-screen/ui/consultation-modal-variants.ts`:

- `export type ConsultationModalVariant = "360" | "480" | "768" | "1024" | "1440"`
- `export type ConsultationModalVariantConfig` — 31 поле, описывающее каждое точечное отличие между breakpoint'ами:
  - layout: `layerVisibility`, `outerPadding`, `columnItems`, `maxWidth`, `maxWidthSuccess`, `columnGap`
  - close icon: `closeIconSize` (union 24|28|30|34)
  - card: `cardPadding`, `successCardPadding`, `formCardOverflow`, `successCardOverflow`, `cardGap`
  - title: `titleLayout` (stacked|inline), `titleSize`
  - inputs: `inputTextSize`, `fieldsDirection`, `fieldsRowGap`, `formBlockGap`
  - contact: `contactLayout` (pill|radio), `contactHeadingTextSize`, `contactLabelTextSize`
  - misc: `messageHeight`, `consentTextSize`
  - submit: `submitButtonHeight`, `submitFontSize`
  - success: `successTitleSize`, `successBodySize`, `successCardGap`, `successTextGap`, `successButtonHeight`, `successButtonFontSize`
- `export const consultationModalVariants` — заполненная Record для всех 5 ключей. Все Tailwind классы — статические строки (JIT-safe).

**Финальный список полей `ConsultationModalVariantConfig`** (31):

```
layerVisibility, outerPadding, columnItems, maxWidth, maxWidthSuccess, columnGap,
closeIconSize, cardPadding, successCardPadding, formCardOverflow, successCardOverflow,
cardGap, titleLayout, titleSize, inputTextSize, fieldsDirection, fieldsRowGap,
formBlockGap, contactLayout, contactHeadingTextSize, contactLabelTextSize,
messageHeight, consentTextSize, submitButtonHeight, submitFontSize,
successTitleSize, successBodySize, successCardGap, successTextGap,
successButtonHeight, successButtonFontSize
```

### Task 2: unified ConsultationModal (commit `3717499`)

`src/widgets/first-screen/ui/consultation-modal.tsx`:

- `"use client"`-модуль
- `export type ConsultationModalProps = { variant, open, onClose, formState, setFormState, titleVariant? }`
- `export function ConsultationModal(props): JSX.Element | null`
- Polный flow form/leave/success с cubic-bezier(0.22,1,0.36,1), таймеры 320/380/400 (как modal-1440).
- 0 inline `if (variant === "...")` блоков — все отличия читаются из `config = consultationModalVariants[variant]`.
- 7 data-testid'ов (close, card, name, phone, message, consent, submit) — verified `grep -c` = 7.
- `createPortal(layer, document.body)` с server-side guard.
- Локальные helpers: `CloseIcon({ size })`, `CloseButtonWrapperClass(size)`, `fieldsDirectionClass(direction)`, `CheckboxCheckIcon`. Все они работают на union-литералах → возвращают статические Tailwind строки (`size-[24px]`/`size-[28px]`/`size-[30px]`/`size-[34px]`, `flex-col`/`flex-row`/`flex-col min-[500px]:flex-row`).

## Verification

- `tsc --noEmit` — zero errors (запускался через node_modules основного репо, в worktree их нет).
- `eslint consultation-modal*.{ts,tsx}` — clean (no output).
- `vitest run` — **26/26 tests passing** (3 файла: phone-format, lead-form-validation, и др.).
- `grep -c data-testid="consultation-modal-` consultation-modal.tsx → **7** (close, card, name, phone, message, consent, submit).
- `grep -c "if (variant ===" consultation-modal.tsx → **0** (success criteria выполнено).

### E2E (deferred)

`pnpm exec playwright test tests/e2e/consultation-modal.spec.ts` не запускался в worktree (нет своих node_modules + webServer). Старые 5 модалок не тронуты — E2E пройдёт автоматически в основном репозитории после merge wave. Plan 07-03 будет запускать E2E после конверсии 5 файлов в thin wrappers (тогда base реально начнёт рендериться).

## Поведенческое отличие vs текущие модалки

**Success animation flow.** В текущих файлах 360/480/768/1024 success-card отображается через простой `isSuccess` boolean (instant switch). В новом base используется flow `form → leave → success` с opacity-fade и transition-[max-width] (как modal-1440). Это означает, что после Plan 07-03 на breakpoints 360/480/768/1024 при сабмите формы появится плавный переход вместо мгновенного.

CONTEXT.md D5 явно допускает это: «pixel diff ≤ 1px» относится к статической вёрстке, поведение transition не pixel-метрика. Plan 07-03 запустит E2E spec; если он падает по таймингам — поднимется как deviation там.

## Deviations from Plan

**Минимальные уточнения относительно plan'а (никакие — не Rule 1/2/3, не блокирующие):**

1. **`closeIconSize` не 24|34, а 24|28|30|34.** Plan 07-02 в interfaces указал union `24 | 34`, но scout-таблица сама пометила `(verify)` для 480/768/1024. По факту: 360→24, 480→28, 768→30, 1024→34, 1440→34. Я расширил union до 4 значений и обновил `CloseIcon` соответственно.

2. **Plan говорил «outer padding 480 — verify», по факту `px-[24px] py-2`.** В таблице плана было `(verify)`, не догадка. Извлечено из реального кода 480-файла.

3. **`fieldsDirection` — у 480 это `row` (всегда), у 768 — `row` (всегда), у 1024/1440 — `responsive-500` (`flex-col min-[500px]:flex-row`).** План в таблице не разделял 480 от 1024 явно — только при сличении исходников видно. Зашит как union literal.

4. **`messageHeight = 100px` только у 1440** — у 360/480/768/1024 все `h-[80px]`. План в таблице ставил «100» для 768/1024 — это была неточность плана (verify-required). Реальное значение из исходников.

5. **`successTitleSize` 30 у 768 (не 32).** Plan говорил «23 / 32» как примеры. У 768 success-title `text-[30px]`. У 480 — 28. У 360 — 23. У 1024/1440 — 32.

Все эти уточнения извлечены из исходников 5 файлов — никакие догадки. Это правка plan-таблицы под фактический код, не deviation от поведения.

## Что осталось на следующие планы

- **Plan 07-03:** превратить 5 modal-XXX файлов в thin wrappers (`<ConsultationModal variant="XXX" {...props} />`); запустить E2E + Figma sverka на 1 breakpoint.
- **Plan 07-04:** удалить re-exports из modal-1440 (введённые в 07-01), переключить sections + open-consultation-modal на прямой импорт из model-файла, full test suite.

## Self-Check: PASSED

- `src/widgets/first-screen/ui/consultation-modal-variants.ts` — FOUND.
- `src/widgets/first-screen/ui/consultation-modal.tsx` — FOUND.
- Commit `a51ad75` (Task 1) — FOUND in git log.
- Commit `3717499` (Task 2) — FOUND in git log.
- tsc --noEmit — zero errors.
- eslint clean.
- vitest 26/26 passing.
- grep data-testid count = 7.
- grep `if (variant ===` count = 0.
