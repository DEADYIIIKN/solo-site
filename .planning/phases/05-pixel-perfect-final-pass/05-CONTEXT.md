# Phase 5: Pixel-Perfect Final Pass — Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Финальный pixel-perfect проход по всем секциям страницы на 4 брейкпоинтах (1440 / 1180 / 820 / 360) против Figma листа «Адаптивы актуальные». Цель — закрыть PX-01..PX-04 так, чтобы Figma MCP sverka на каждом брейкпоинте не находила визуальных отклонений сверх tolerance.

**В scope:**
- Сверка всех секций (hero, business-goals, services, cases, team, philosophy-clients, levels, footer, форма) на всех 4 брейкпоинтах
- Static-состояние секций (default visual, как на Figma)
- Параметры сверки: размеры/отступы, типографика, цвета/тени, изображения/ассеты
- Фиксы найденных отклонений прямо в этой фазе

**Вне scope:**
- Hover / focus / open-modal / scroll-прогресс состояния (это animations/interactions)
- Рефакторинг компонентов
- Новые секции / capabilities
- Анимации (они в Phase 4)
- Крупные фиксы требующие >30 строк изменений в одном месте → backlog / отдельная фаза

</domain>

<decisions>
## Implementation Decisions

### Методология sverka

- **D-01:** **Порядок обхода — по брейкпоинтам.** Сначала все секции на 1440px → затем 1180px → 820px → 360px. Преимущество: `preview_resize` держится длительно на одном viewport, меньше переключений контекста между viewport-специфичными компонентами.
- **D-02:** **Формат сравнения — Figma MCP + preview_screenshot + get_variable_defs.** Для каждой секции на каждом брейкпоинте:
  1. `mcp__Figma__get_screenshot` на соответствующий Figma-нод (лист «Адаптивы актуальные»)
  2. `mcp__Figma__get_variable_defs` / `get_design_context` для точных числовых значений (gap, padding, font-size, color tokens)
  3. `preview_start` → `preview_resize` на нужную ширину → `preview_screenshot` секции в dev-сервере
  4. Визуальное сравнение screenshots + сверка кода против извлечённых из Figma значений
- **D-03:** **Охват — все секции страницы.** Не только те что тронули в Phase 2-4. Цель фазы — закрыть success criteria «no visual deviations» по всему сайту, не только по изменённым секциям.
- **D-04:** **Sverka только static-состояния.** Hover / open-modal / scroll-прогресс / focus — вне scope. Если Figma показывает hover-вариант карточки — игнорируем (это может быть отдельной фазой позже).

### Output

- **D-05:** **Единый `05-SVERKA-REPORT.md`** в директории фазы. Формат — таблица отклонений с колонками: `Breakpoint | Section | Type (size/typography/color/asset) | Figma value | Current code value | File:line | Status (fixed/deferred/backlog)`. Один файл даёт единый источник истины по всем 4 брейкпоинтам и упрощает трекинг.
- **D-06:** Отчёт обновляется инкрементально по мере прохождения брейкпоинтов. После завершения фазы — отчёт финализируется и остаётся как артефакт фазы.

### Tolerance и что считается отклонением

- **D-07:** **Tolerance — ±1px (строго)** для размеров/отступов/позиций. Разница более 1px — отклонение, требующее фикса или обоснованного deferral.
- **D-08:** **Типографика — точное соответствие.** font-size, font-weight, line-height, letter-spacing, font-family должны совпадать с Figma байт-в-байт (px и unitless значения).
- **D-09:** **Цвета и тени — точное соответствие.** background, color, border, box-shadow, border-radius — точные hex / rgb / оттенки из Figma variables.
- **D-10:** **Изображения/ассеты — сверка по наличию и корректности.** Проверка что правильные SVG-пути используются (особенно после свопа стрелок в Phase 3), фотографии актуальные, иконки соответствуют Figma.
- **D-11:** **Note по sub-pixel rendering:** браузерный render может давать суб-пиксельные различия при одинаковом CSS — это НЕ отклонение. Отклонение — это когда значение в коде отличается от значения в Figma. Visual screenshot diff используется для обнаружения, но источник истины для фикса — это число из Figma vs число в коде.

### Sverka lessons-learned (из Wave 2, 1180 breakpoint)

- **D-16:** **Figma `display:contents` flattening.** Если `get_design_context` обёртывает frame как `<div className="absolute contents ...">`, то координаты всех детей **в coords родителя этого frame**, не в local. Метаданные `x=30, y=30` в таком child — это координаты в родительской карточке, не в wrapping inner container. Обязательно сверять DOM positions от **корня article**, не от inner wrapper. Пример: services 1024 commercial card — title/subtitle/button были внутри `mx-10 mt-15` inner, рендерились со сдвигом `(+10,+15)` от Figma coords, и sverka это пропустила.
- **D-17:** **Inter-frame bottom padding.** Figma frames имеют фиксированную `height` с пустым местом ПОСЛЕ контента (пример: frame 8 h=700, cards заканчиваются на y=580 → 120px design gap до следующего frame). Это legitimate design intent, не canvas artifact. Sverka должна включать probe: `frame.height - last-content.bottom = intended section pb` и сверять с CSS padding-bottom секции.
- **D-18:** **Overlap-scenario gap probe.** Секции с pin-scroll / translate-based card overlap (services, levels) требуют явного probe видимого зазора между элементами в финальном (after-slide) положении: `next-card.top - prev-card.last-visible-content.bottom`. Визуальная сверка screenshot этого не ловит — нужен DOM probe после scroll в pin-end.
- **D-19:** **CSS line-box vs Figma glyph-bbox для многострочных заголовков.** `leading < 1.0` + multiline → CSS line-box на 6-8px выше Figma `height` (из-за ascender/descender padding). `getBoundingClientRect().height` ≠ Figma h. Если gap в макете ≤20px (title bottom → next element top), **обязателен визуальный probe глифов**, не line-box. Применять ко всем многострочным заголовкам с tight leading, не только footer.

### Discovery + Fix flow

- **D-12:** **Discovery и Fix в одной фазе.** Найденное отклонение сразу фиксится в том же wave/plan, если правка локальная (одно свойство CSS, одна константа, один SVG path). Фаза закрывается только когда все 4 success criteria TRUE на живом сайте.
- **D-13:** **Fix budget для одной правки — до 30 строк изменений в одном файле.** Если фикс требует большего (например рефакторинг absolute позиций всей секции levels) — отклонение документируется в `05-SVERKA-REPORT.md` со статусом `deferred`, заводится запись в «Deferred Ideas» и предлагается отдельная фаза / backlog item. Не тащим рефакторинг в Phase 5.
- **D-14:** **Если критическая находка требует изменения паттерна** (например все карточки на 820px используют неверный token) — `[BLOCKING] checkpoint`: исполнитель останавливается, сообщает пользователю, пользователь принимает решение «фиксим сейчас / выносим».

### Порядок плана (structure, не обязательно wave count)

- **D-15:** **Логическое разбиение по брейкпоинтам** (4 плана минимум: по одному на брейкпоинт) — так легче атомарно коммитить прогресс и откатывать при проблемах. Planner может добавить отдельный план на финальное обновление `05-SVERKA-REPORT.md` и verification.

### Claude's Discretion

- Точное количество и группировка plan-файлов внутри каждого брейкпоинта — planner решает (может быть один plan per breakpoint, или разбиение по кластерам секций).
- Какие конкретно Figma-ноды соответствуют каждой секции — executor находит через Figma MCP по имени секции/компонента в листе «Адаптивы актуальные» (паттерн из Phases 2-3).
- Нужен ли [BLOCKING] checkpoint перед переходом к следующему брейкпоинту (чтобы пользователь подтвердил отчёт) — planner решает; рекомендуется для UAT after каждого breakpoint.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` §Pixel-Perfect (Figma) — критерии PX-01..PX-04
- `.planning/ROADMAP.md` §Phase 5 — goal и success criteria (Figma MCP sverka на 4 брейкпоинтах)
- `.planning/PROJECT.md` — общий контекст проекта, Figma URL

### Прошлые фазы (паттерны и контекст)
- `.planning/phases/02-desktop-layout-1440px-1180px/02-CONTEXT.md` — установленный паттерн Figma MCP sverka (D-11 «UI hint: yes» = auto Figma MCP), примеры фиксов 1440/1180
- `.planning/phases/03-mobile-tablet-layout-820px-360px/03-CONTEXT.md` — паттерн 100vw breakout, gap-props, Figma MCP для числовых значений
- `.planning/phases/02-desktop-layout-1440px-1180px/02-*-SUMMARY.md` — summary прошлых фиксов 1440/1180
- `.planning/phases/03-mobile-tablet-layout-820px-360px/03-*-SUMMARY.md` — summary прошлых фиксов 820/360
- `.planning/phases/04-safari-animations/04-CONTEXT.md` — motion/framer-motion миграция, текущее состояние анимаций

### Figma
- Лист «Адаптивы актуальные» в Figma файле проекта (URL в `.planning/PROJECT.md` §Figma)
- Figma MCP tools: `mcp__Figma__get_screenshot`, `mcp__Figma__get_variable_defs`, `mcp__Figma__get_design_context`, `mcp__Figma__get_metadata`

### Исходный код (ключевые виджеты для sverka)
- `src/widgets/` — все виджеты сайта (hero, business-goals, services, cases, team, philosophy-clients, levels)
- `src/shared/` — shared UI-компоненты
- `src/app/` — layout и root page
- Breakpoint-специфичные файлы (паттерн проекта): `*-1440.tsx`, `*-1024.tsx` (обслуживает 1180), `*-768.tsx` (обслуживает 820), `*-360.tsx`, иногда `*-480.tsx`

### Preview tools
- `preview_start`, `preview_resize`, `preview_screenshot`, `preview_snapshot`, `preview_inspect` — для live dev-сервера и сравнения с Figma

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Figma MCP workflow** — уже установлен в Phases 2-3: executor ищет ноды по имени секции в листе «Адаптивы актуальные», не по hardcoded node IDs.
- **preview tools** — доступны для запуска dev-сервера и скриншотов.
- **Breakpoint компоненты** — per-breakpoint файлы уже есть для всех секций. Правки локальны в конкретном `*-1440.tsx` / `*-1024.tsx` / `*-768.tsx` / `*-360.tsx` файле.
- **Figma node ID комментарии** — во многих местах кода inline-комментарии (`// Figma 783:9521`) — используются как anchor для Figma MCP поиска.

### Established Patterns
- **Абсолютное позиционирование** — business-goals, levels секции используют `absolute left-[Npx] top-[Npx]` матчащие Figma координаты. Отклонение = число не совпадает с Figma.
- **Per-breakpoint components** — НЕ переключать компоненты между брейкпоинтами, править внутри соответствующего файла.
- **100vw breakout** для full-width элементов (из Phase 2 D-09, Phase 3 D-06) — паттерн для client logo marquee и подобных.
- **Tailwind arbitrary values** — `gap-[60px]`, `mb-[10px]`, `leading-[1.2]` — основной способ задания точных значений.

### Integration Points
- Все правки локальны в виджет-файлах — нет изменений в layout / routing / page structure.
- Нет изменений в `payload.config.ts` / PayloadCMS схеме — Phase 5 чисто frontend.
- Нет зависимостей от Phase 4 motion-миграции кроме того что анимации не должны мешать sverka (static state должно быть стабильно).

</code_context>

<specifics>
## Specific Ideas

- **Figma лист:** «Адаптивы актуальные» — единственный источник истины для Phase 5. Не заглядывать в другие листы (prototype, old designs).
- **Брейкпоинт → компонент mapping (из PROJECT.md и прошлых фаз):**
  - 1440px → `*-1440.tsx` файлы
  - 1180px → `*-1024.tsx` файлы (обслуживают 1024-1439 диапазон)
  - 820px → `*-768.tsx` файлы (обслуживают 768-1023)
  - 360px → `*-360.tsx` файлы (иногда `*-480.tsx` для 480-767)
- **Tolerance edge case:** sub-pixel rendering (0.5px визуальные различия в screenshot при одинаковом CSS) — НЕ отклонение. Источник истины — число в коде vs число в Figma.

</specifics>

<deferred>
## Deferred Ideas

- **Hover / focus / open-modal / scroll-прогресс sverka** — вне scope Phase 5 (D-04). Если нужно — отдельная фаза / backlog.
- **Крупные рефакторинги (>30 строк) необходимые для фикса** — в backlog / отдельную фазу (D-13).
- **Автоматизация visual regression (Playwright screenshot diff)** — отдельная тема, возможно в Phase 6 Testing.
- **Sverka print / email стилей, OG-изображений** — если такие есть в Figma, но не на веб-странице — вне scope.

</deferred>

---

*Phase: 05-pixel-perfect-final-pass*
*Context gathered: 2026-04-23*
