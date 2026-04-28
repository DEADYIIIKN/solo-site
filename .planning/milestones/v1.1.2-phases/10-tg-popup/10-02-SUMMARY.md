---
phase: 10-tg-popup
plan: 02
subsystem: widgets/tg-popup
tags: [ui, modal, telegram, variants, dismiss-handlers]
requires:
  - "@/shared/lib/utils (cn)"
provides:
  - "src/widgets/tg-popup → TgPopup component, tgPopupVariants lookup"
  - "TG-02 (per-breakpoint design satisfied для 5 нод Figma)"
  - "TG-03 (dismiss flow: ✕ / overlay / ESC)"
  - "TG-04 (CTA принимает ctaHref + target=_blank rel=noopener noreferrer)"
affects: []
tech-stack:
  added: []
  patterns:
    - "Variant lookup table + base component (как в ConsultationModal)"
    - "createPortal + opacity-transition (320ms cubic-bezier)"
    - "Dismiss handlers: ESC keydown, overlay button click, ✕ button"
key-files:
  created:
    - src/widgets/tg-popup/ui/tg-popup-variants.ts
    - src/widgets/tg-popup/ui/tg-popup.tsx
    - src/widgets/tg-popup/index.ts
  modified: []
decisions:
  - "Открытие/закрытие через CSS opacity (consistency с ConsultationModal), а не Framer Motion — plan-frontmatter authoritative"
  - "Phone mockup → placeholder div с TODO(10-03) — Figma asset не выгружен"
  - "Default copy hardcoded в компоненте (D4 locked), но override через props для будущих кампаний"
metrics:
  duration: "~12 min"
  completed: 2026-04-27
---

# Phase 10 Plan 02: TG-popup UI shell Summary

UI shell pop-up'а: variant lookup table (5 breakpoints) + `TgPopup` компонент с overlay, dismiss handlers (✕ / overlay / ESC) и оранжевой CTA-кнопкой с TG-icon. Без host integration / timer / env-gate — это в 10-03.

## Что реализовано

### `tg-popup-variants.ts` (183 строки)

Exhaustive lookup для 5 breakpoints. Mapping Figma node-ids → breakpoint:

| Figma node | Breakpoint | Frame    | Layout     | Modal size    | Close ✕ | Title px | CTA       |
| ---------- | ---------- | -------- | ---------- | ------------- | ------- | -------- | --------- |
| 783:9762   | 1440       | 1440x810 | horizontal | 886x460       | 34      | 50       | 250x60    |
| 783:9750   | 1024       | 1024x700 | horizontal | 668x392       | 30      | 40       | 250x60    |
| 783:9729   | 768        | 768x700  | horizontal | 668x392       | 30      | 36       | 219x52    |
| 783:9708   | 480        | 480x700  | vertical   | 330x571       | 28      | 32       | 200x48    |
| 783:9687   | 360        | 360x640  | vertical   | 328x528       | 24      | 28       | 184x44    |

Поля variant config: `layerVisibility` (media-query), `outerPadding`, `columnItems`,
`maxWidth`, `cardMinHeight`, `columnGap`, `closeIconSize`, `cardPadding`, `layout`,
`cardInnerGap`, `textBlockGap`, `titleSize`, `subtitleSize`, `subtitleMaxWidth`,
`ctaButtonWidth`, `ctaButtonHeight`, `ctaFontSize`, `ctaIconSize`,
`imageWidth`, `imageHeight`.

`layerVisibility` сегменты не пересекаются (только одна модалка рендерится за раз):
- 360: `max-[479px]:block`
- 480: `min-[480px]:block min-[768px]:hidden`
- 768: `min-[768px]:block min-[1024px]:hidden`
- 1024: `min-[1024px]:block min-[1440px]:hidden`
- 1440: `min-[1440px]:block`

### `tg-popup.tsx` (component, ~280 строк)

Props:
```ts
{ variant, open, onDismiss, ctaHref, title?, subtitle?, ctaLabel? }
```

Behaviour (всё по паттерну `ConsultationModal`):
- `createPortal(layer, document.body)` — overlay в z-modal слое.
- `useState shouldRender + isEntered` + double rAF для плавного open transition (320ms).
- `useEffect` body `overflow:hidden` пока shouldRender=true.
- `useEffect` ESC keydown listener (вызывает onDismiss).
- Backdrop button (`bg-[#0d0300]/80`, `onClick=onDismiss`).
- Inner scroll-container с `event.target === event.currentTarget` check для click-outside.
- Card (`rounded-[16px] bg-[#fafaf7]`):
  - Title (Montserrat Bold lowercase, italic середина «эффективного»).
  - Subtitle (Montserrat Regular, leading 1.2).
  - CTA `<a target="_blank" rel="noopener noreferrer" onClick={onDismiss}>` —
    оранжевая pill `#ff5c00` (hover `#de4f00`) с TG paper-plane SVG слева + label.
  - Phone mockup placeholder (`bg-[#0d0300]/10`) — TODO(10-03) маркер.

`data-testid`: `tg-popup-root`, `tg-popup-card`, `tg-popup-close`, `tg-popup-cta`,
`tg-popup-image-placeholder`.

### `index.ts` (barrel)

Exports: `TgPopup`, `TgPopupProps`, `tgPopupVariants`, `TgPopupVariant`,
`TgPopupVariantConfig`, `TgPopupLayout`.

## Что закладывалось vs реальная реализация

| Спека | Реализовано | Заметки |
| --- | --- | --- |
| Variant lookup для 5 breakpoints | ✅ Все 5 | Размеры из orchestrator brief + size hints из Figma frames |
| `TgPopup` overlay + dismiss | ✅ ✕ / overlay click / ESC | Полный паттерн ConsultationModal |
| Open/close transitions | ✅ Opacity 320ms cubic-bezier | Plan говорит «через opacity (consistency с ConsultationModal)»; orchestrator brief упоминал Framer Motion — выбрал plan (authoritative) |
| CTA с TG-icon | ✅ Inline paper-plane SVG | Скопирован шаблон, не из существующего проекта |
| Phone mockup asset | ⚠ Placeholder | Asset из Figma 783:9772/9773 не выгружен — TODO маркер для 10-03 |
| Default copy «секреты *эффективного* видео» | ✅ Hardcoded в DEFAULT_TITLE_* | Override через `title` prop |
| Brand orange CTA #ff5c00 | ✅ | Соответствует другим CTA в проекте (footer / consult submit) |
| Background `#fafaf7` | ✅ | По screenshot — cream/off-white |

## Деviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocker] Plan упоминает Figma MCP для извлечения exact значений; MCP недоступен**
- **Found during:** Task 1
- **Issue:** Researcher (через Figma MCP) должен был извлечь dimensions / colors / typography. Текущий агент Figma MCP не имеет.
- **Fix:** Использованы значения из orchestrator brief (frame sizes, modal dimensions, button sizes — все 5 нод задокументированы), плюс baseline-пропорции из плана. Точная сверка через Figma MCP запланирована в 10-03 при integration smoke (researcher / planner может уточнить значения).
- **Files modified:** `tg-popup-variants.ts` (значения внесены в variant config)
- **Commit:** a5a347b

**2. [Rule 2 - Critical] Phone mockup asset отсутствует**
- **Found during:** Task 2
- **Issue:** Figma node 783:9772/9773 (phone screenshot) не выгружен в репо; layout требует image-блок справа/снизу.
- **Fix:** Поставлен neutral placeholder div `bg-[#0d0300]/10 rounded-[16px]` с правильными размерами из variant config + явный TODO(10-03) маркер с указанием Figma node-ids и target path `public/assets/figma/tg-popup/`. Это handoff для 10-03 / пользователя.
- **Files modified:** `tg-popup.tsx` (placeholder + комментарий)
- **Commit:** 25890cd

**3. [Rule 3 - Blocker] Orchestrator brief vs plan: Framer Motion vs CSS opacity**
- **Found during:** Task 2
- **Issue:** Brief упоминает «Открытие/закрытие через Framer Motion (паттерн ConsultationModal)», но реальный ConsultationModal использует CSS opacity transition + double rAF (не Framer). Plan must_haves говорят: «Open/close транзишн через opacity (consistency с ConsultationModal pattern)».
- **Fix:** Выбрал plan-frontmatter (authoritative) + реальный паттерн ConsultationModal — CSS opacity 320ms cubic-bezier. Это даёт consistency с существующей модалкой и не вводит новый паттерн.
- **Files modified:** `tg-popup.tsx`
- **Commit:** 25890cd

## Verification

- `npx tsc --noEmit` — `EXIT=0`
- `npm run lint -- --quiet src/widgets/tg-popup` — `LINT=0` (предсуществующий error в `privacy/page.tsx` — не trigger'ится тэгом widget directory; вне scope)
- `npm run test:unit` — 6 files, 45 tests, all pass

## Known Stubs

- **Phone mockup asset placeholder** в `tg-popup.tsx` (helper `<div data-testid="tg-popup-image-placeholder">`) — закрывается в 10-03 после экспорта Figma asset. Документировано TODO маркером.

## Self-Check: PASSED

- ✅ `src/widgets/tg-popup/ui/tg-popup-variants.ts` — FOUND
- ✅ `src/widgets/tg-popup/ui/tg-popup.tsx` — FOUND
- ✅ `src/widgets/tg-popup/index.ts` — FOUND
- ✅ Commit a5a347b — FOUND
- ✅ Commit 25890cd — FOUND
