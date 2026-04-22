# Phase 3: Mobile/Tablet Layout (820px + 360px) - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Исправить 11 визуальных багов вёрстки на брейкпоинтах 820px (layout "768") и 360px (layout "360"):
- LY820-01, LY360-01: Стрелки карусели кейсов смотрят не в те стороны
- LY820-02, LY360-02: Карусель кейсов обрезает правую карточку
- LY820-03: Полосы логотипов клиентов не на всю ширину экрана
- LY820-04, LY360-05: Межстрочный интервал в карточках кейсов (Режиссер/DOP) не соответствует Figma
- LY820-05, LY360-06: Тексты в секции levels (воронка) накладываются / интервал не совпадает с Figma
- LY360-03: Пропавшее фото в секции «что мы делаем» на 360px
- LY360-04: Отступы между логотипами клиентов на 360px больше чем в Figma

Никакого рефакторинга, никаких новых фич. Минимальные изменения.

</domain>

<decisions>
## Implementation Decisions

### Карусель кейсов — стрелки (LY820-01, LY360-01)

- **D-01:** Баг локализован: `src/widgets/cases/ui/cases-section-shared-ui.tsx` строка 23 — SVG пути перепутаны между `variant="back"` и `variant="forward"`.
  - `variant === "back"` ошибочно получает `CASES_ARROW_PATH_FIGMA_RIGHT_FILE` (→ rightward)
  - `variant === "forward"` ошибочно получает `CASES_ARROW_PATH_FIGMA_LEFT_FILE` (← leftward)
  - Фикс: 1-строчный своп в тернарном выражении строки 23.
- **D-02:** Исправление в `cases-section-shared-ui.tsx` затрагивает ВСЕ брейкпоинты (768, 480, 360, 1024, 1440) — компонент используется везде. Тест: проверить что 1440px стрелки тоже корректны после фикса.

### Карусель кейсов — обрезка (LY820-02, LY360-02)

- **D-03:** Figma MCP для извлечения точной ширины карточки (Vertical: 242px при 768, 208px при 360; Advertising: 414px при 768, 242px при 360) и padding/gap контейнера. Исполнитель находит Figma-ноды секции кейсов на листе «Адаптивы актуальные» через Figma MCP и проверяет соответствие кода.
- **D-04:** Если padding контейнера недостаточен для показа последней карточки без обрезки — скорректировать padding или min-width в `cases-section-768.tsx` / `cases-section-360.tsx`. Логика прокрутки (`useCasesHorizontalCarousel`) не трогать.

### Полосы логотипов клиентов — ширина (LY820-03)

- **D-05:** `PhilosophyClientsNarrowClientsBlock` в `philosophy-clients-narrow-stack.tsx` строка ~425 имеет `overflow-x-clip` + `w-full max-w-full` внутри ограниченного контейнера (`max-w-[768px]`). Та же проблема что в Phase 2 (LY1180-01).
- **D-06:** Применить тот же 100vw breakout паттерн что в Phase 2:
  - Убрать `overflow-x-clip` с wrapper div маркизы
  - Заменить на `style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}`
- **D-07:** Этот фикс в `PhilosophyClientsNarrowClientsBlock` одновременно чинит 820px И 360px ширину (один компонент используется обоими).

### Логотипы — отступы (LY360-04)

- **D-08:** `PhilosophyClientsMarquee1024` использует `gap-[60px]` — значение из Figma 1024px. На 360px Figma показывает меньший gap.
- **D-09:** Использовать Figma MCP для извлечения точного gap значения на 360px (лист «Адаптивы актуальные», секция клиентов 360px).
- **D-10:** Добавить `gapClassName` prop (или `gapPx` число) в `PhilosophyClientsMarquee1024` чтобы передавать нужный gap из `PhilosophyClientsNarrowClientsBlock` при 360px. Минимальный API-изменение.

### Фото секции «что мы делаем» (LY360-03)

- **D-11:** `TeamSection360` использует `TeamSectionPhoto` с `variant="narrow"` и тот же `teamSectionAssets.teamPhoto` который был заменён в Phase 2. Баг скорее всего уже исправлен.
- **D-12:** Исполнитель **сначала проверяет в браузере** при viewport 360px: если фото есть — закрыть как resolved. Если всё ещё пропадает — исследовать BoneyardSkeleton bones (`philosophy-team-card-360.bones.json`) и narrow variant CSS.

### Межстрочный интервал кейсов (LY820-04, LY360-05)

- **D-13:** Использовать Figma MCP для извлечения точного line-height в строках «Режиссер / DOP» в карточках кейсов. Текущий код: `leading-[1.2]` с `mb-[6px]` / `mb-[10px]` между строками. Файлы: `cases-section-768.tsx`, `cases-section-360.tsx`.

### Межстрочный интервал levels/воронка (LY820-05, LY360-06)

- **D-14:** Секция воронки — это `levels-section-below-1024.tsx`. Компонент использует абсолютное позиционирование для текстовых меток (`absolute left-[N] top-[N]`). На узких viewport тексты могут перекрываться.
- **D-15:** Figma MCP для извлечения точных координат текстовых блоков на 768px (820px) и 360px. Проверить соответствие координат в коде с Figma.

### Figma MCP — общий принцип

- **D-16:** Figma MCP используется для ВСЕХ числовых значений в Phase 3: line-height, gap, padding, координаты абсолютного позиционирования. Предпочтительнее guessing по коду.
- **D-17:** Исполнитель ищет ноды в Figma через имя секции/компонента в листе «Адаптивы актуальные», не через hardcoded node IDs.

### Claude's Discretion

- Способ передачи gap в PhilosophyClientsMarquee1024 (prop vs CSS override) — на усмотрение исполнителя, предпочтительно минимальный API.
- Если 100vw breakout в PhilosophyClientsNarrowClientsBlock создаст горизонтальный scrollbar — проверить overflow родительских элементов (паттерн из Phase 2).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Карусель кейсов (стрелки + обрезка)
- `src/widgets/cases/ui/cases-section-shared-ui.tsx` — `CasesSectionArrowsNav` и `CasesNavArrowIcon` с перепутанными SVG путями (строка 23). Единая точка изменения для всех брейкпоинтов.
- `src/widgets/cases/ui/cases-section-768.tsx` — Cases carousel at 820px: `VERT_CARD_W=242`, `AD_CARD_W=414`, `CASES_SCROLL_GAP_PX=16`
- `src/widgets/cases/ui/cases-section-360.tsx` — Cases carousel at 360px: `VERT_CARD_W=208`, `AD_CARD_W=242`
- `src/widgets/cases/lib/use-cases-horizontal-carousel.ts` — Scroll hook: не трогать логику, только layout

### Логотипы клиентов
- `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` — `PhilosophyClientsNarrowClientsBlock` строка ~425: wrapper с `overflow-x-clip`; здесь применяется 100vw breakout
- `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx` — Marquee component: `gap-[60px]` (строки 181-182, 240-242). Добавить gap prop для 360px значения из Figma.

### Фото 360px
- `src/widgets/team/ui/team-section-360.tsx` — Использует `TeamSectionPhoto variant="narrow"`
- `src/widgets/team/ui/team-section-photo.tsx` — narrow variant: `imageWrapperClassName` override pattern
- `src/widgets/team/model/team.data.ts` — `teamSectionAssets.teamPhoto` путь к файлу

### Line-height кейсов
- `src/widgets/cases/ui/cases-section-768.tsx` — Credits строки: `leading-[1.2]`, `mb-[10px]` (строки ~129-131, ~193-196)
- `src/widgets/cases/ui/cases-section-360.tsx` — Credits строки: `leading-[1.2]`, `mb-[6px]`

### Levels/воронка
- `src/widgets/levels/ui/levels-section-below-1024.tsx` — Абсолютно позиционированные тексты для 768px (`Levels768`) и 360px

### Из Phase 2 (паттерны)
- `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` строки 380-384 — Пример применённого 100vw breakout паттерна

### Figma
- Figma file: «Адаптивы актуальные» — 820px (layout "768") и 360px секции кейсов, клиентов, levels

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CasesSectionArrowsNav` в `cases-section-shared-ui.tsx` — shared компонент для всех брейкпоинтов карусели
- `useCasesHorizontalCarousel` hook — scroll/prev/next logic, не трогать
- `PhilosophyClientsMarquee1024` — используется и на 820px (через NarrowClientsBlock), нужен gap prop
- `TeamSectionPhoto` — shared компонент, narrow variant уже правильно подключён в 360px

### Established Patterns
- **100vw breakout**: `width: "100vw"`, `marginLeft: "calc(50% - 50vw)"` — применялся в Phase 2 для philosophy-clients-1024.tsx; тот же паттерн для NarrowClientsBlock
- **Figma MCP workflow**: executor ищет ноды через имя секции в «Адаптивы актуальные», извлекает px значения, маппит на Tailwind классы
- **Брейкпоинт маппинг**: `viewport >= 768 && < 1024` → layout `"768"` (serves ~820px); `viewport < 480` → layout `"360"`
- **Per-breakpoint файлы**: отдельные файлы для каждого брейкпоинта (`cases-section-768.tsx`, `cases-section-360.tsx`) — не смешивать

### Integration Points
- `cases-section-shared-ui.tsx` фикс стрелок затрагивает ВСЕ брейкпоинты: 360, 480, 768, 1024, 1440
- `PhilosophyClientsNarrowClientsBlock` используется в `philosophy-clients-768.tsx` (820px) и `philosophy-clients-360.tsx` (360px) — фикс ширины в нём затрагивает оба

</code_context>

<specifics>
## Specific Ideas

- Стрелки: буквально 1-строчный своп в `CasesNavArrowIcon` — нет нужды в сложном рефакторинге
- 100vw breakout для NarrowClientsBlock: убрать `overflow-x-clip` из wrapper div на строке ~425, добавить `style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}` как в Phase 2
- Gap логотипов 360px: сначала Figma MCP, потом `gapPx` prop в PhilosophyClientsMarquee1024

</specifics>

<deferred>
## Deferred Ideas

None — обсуждение не вышло за рамки фазы.

</deferred>

---

*Phase: 03-mobile-tablet-layout-820px-360px*
*Context gathered: 2026-04-22*
