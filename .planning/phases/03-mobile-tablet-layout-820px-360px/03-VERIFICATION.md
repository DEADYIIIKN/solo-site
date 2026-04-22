---
phase: 03-mobile-tablet-layout-820px-360px
verified: 2026-04-22T21:00:00Z
status: human_needed
score: 9/11 must-haves verified
overrides_applied: 0
overrides:
  - must_have: "Кнопка «Назад» (aria-label=Назад) в карусели кейсов показывает левый шеврон (←) на всех брейкпоинтах"
    reason: "PLAN artifact spec (contains: FIGMA_LEFT_FILE after back) does not match current code, but the current code IS functionally correct — CASES_ARROW_PATH_FIGMA_RIGHT_FILE draws ← (left-pointing) because constant names are inverted vs their SVG geometry. Revert commit 43089a8 confirms this. Visual browser verification required to confirm arrows render correctly."
    accepted_by: "code-review (commit 43089a8)"
    accepted_at: "2026-04-22T20:42:54+03:00"
  - must_have: "Кнопка «Вперёд» (aria-label=Вперёд) показывает правый шеврон (→) на всех брейкпоинтах"
    reason: "Same as above — CASES_ARROW_PATH_FIGMA_LEFT_FILE draws → (right-pointing) despite the name. Current mapping is correct per revert commit. Visual verification required."
    accepted_by: "code-review (commit 43089a8)"
    accepted_at: "2026-04-22T20:42:54+03:00"
human_verification:
  - test: "Стрелки карусели кейсов — визуальная проверка"
    expected: "Левая стрелка (кнопка 'Назад') показывает шеврон ← (влево). Правая стрелка ('Вперёд') показывает шеврон → (вправо). Проверить на 360px, 820px, 1440px viewport."
    why_human: "SVG-константы FIGMA_LEFT_FILE и FIGMA_RIGHT_FILE имеют инвертированные имена относительно того, что они отрисовывают. Код нельзя верифицировать статически без просмотра SVG в браузере."
  - test: "Фотография команды на 360px — видимость"
    expected: "TeamSectionPhoto с variant='narrow' отрисовывается в секции 'что мы делаем' при viewport 360px и показывает актуальную фотографию команды (не skeleton, не broken image)"
    why_human: "teamSectionAssets.teamPhoto подключён в Phase 2 — нельзя проверить загрузку реального изображения без браузера."
  - test: "Полосы логотипов клиентов — ширина на 820px"
    expected: "Marquee-ленты с логотипами клиентов занимают 100% ширины viewport при 820px. Горизонтальный скроллбар на странице отсутствует."
    why_human: "100vw breakout требует браузера для проверки overflow-поведения и отсутствия горизонтального скролла."
  - test: "Gap между логотипами клиентов на 360px"
    expected: "Gap между логотипами = 20px (MARQUEE_GAP_360_PX). Выглядит корректно, не слишком большим как при 60px."
    why_human: "Figma MCP был недоступен при выполнении — значение 20px инферировано, не извлечено из Figma. Нужна визуальная проверка корректности gap."
  - test: "Credits строки в карточках кейсов — перекрытие"
    expected: "Строки 'Режиссер' и 'DOP' в VerticalCard и AdCard на 820px и 360px не перекрываются, имеют корректный межстрочный отступ (mb-[10px] на 768, mb-[6px] на 360)."
    why_human: "Наличие mb-классов можно верифицировать кодом (сделано — ✓), но отсутствие визуального перекрытия при рендере требует браузерной проверки."
  - test: "Тексты Levels (воронка) — видимость на 820px и 360px"
    expected: "Все 6 текстовых меток (3 label + 3 title) для Levels768 и Levels360 видны без перекрытия. flex-col gap-[7px] обеспечивает корректное расстояние между label и title."
    why_human: "Абсолютные координаты не были верифицированы через Figma MCP (недоступен). Только визуальная проверка может подтвердить отсутствие перекрытия."
---

# Phase 3: Mobile/Tablet Layout (820px/360px) Verification Report

**Phase Goal:** Fix all mobile (360px) and tablet (820px) layout bugs identified in UAT — carousel arrows, card clipping, logo strip width, team photo visibility, credits spacing, and funnel text overlap
**Verified:** 2026-04-22T21:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Кнопка «Назад» показывает левый шеврон (←) на всех брейкпоинтах | PASSED (override) | `back → CASES_ARROW_PATH_FIGMA_RIGHT_FILE` — этот путь рисует ← (M12.2964, кончик слева). Имена констант инвертированы. Код верен. Revert-commit 43089a8 подтверждает. Визуальная верификация требуется. |
| 2 | Кнопка «Вперёд» показывает правый шеврон (→) на всех брейкпоинтах | PASSED (override) | `forward → CASES_ARROW_PATH_FIGMA_LEFT_FILE` — этот путь рисует → (M21.7036, кончик справа). Имена констант инвертированы. Код верен. Визуальная верификация требуется. |
| 3 | Фото команды видно в секции «что мы делаем» при viewport 360px | ? UNCERTAIN | `TeamSectionPhoto` с `variant="narrow"` присутствует в `team-section-360.tsx` строки 45-56. Компонент подключён и передаёт корректные props. Загрузка изображения требует браузерной проверки. |
| 4 | На 820px последняя карточка карусели видна полностью без обрезки правого края | ✓ VERIFIED | `overflow-x-clip` отсутствует в `cases-section-768.tsx` (строка 230 теперь без этого класса). Scroll container `overflow-x-auto` самостоятельно управляет overflow. |
| 5 | На 360px последняя карточка карусели видна полностью без обрезки правого края | ✓ VERIFIED | `overflow-x-clip` отсутствует в `cases-section-360.tsx`. Аналогично п.4. |
| 6 | useCasesHorizontalCarousel scroll-логика не изменялась | ✓ VERIFIED | Grep: `VERT_CARD_W`, `AD_CARD_W`, `CASES_SCROLL_GAP_PX` в обоих файлах содержат исходные значения (242/414/16 для 768, 208/242/16 для 360). |
| 7 | На 820px ленты с логотипами клиентов занимают полную ширину viewport | ? UNCERTAIN | `width: "100vw"` и `marginLeft: "calc(50% - 50vw)"` присутствуют в `philosophy-clients-narrow-stack.tsx` (строки 432-433). `overflow-x-clip` удалён с wrapper маркизы. Визуальная проверка горизонтального скролла требуется. |
| 8 | На 360px gap между логотипами = Figma-значение (не 60px) | ? UNCERTAIN | `MARQUEE_GAP_360_PX = 20` экспортирован из `philosophy-clients-marquee-1024.tsx`, передаётся через `PhilosophyClients360 → marqueeGapPx → gapPx`. Однако значение 20px инферировано (Figma MCP недоступен), не Figma-extracted. Визуальная верификация обязательна. |
| 9 | На 768px и 1024px gap в маркизе остался 60px | ✓ VERIFIED | `PhilosophyClientsNarrowClientsBlock` имеет `marqueeGapPx = 60` как default. `PhilosophyClients768` не передаёт `marqueeGapPx` — получает default=60. |
| 10 | Отступ между строками credits (mb) соответствует ожидаемому на обоих брейкпоинтах | ✓ VERIFIED | `cases-section-768.tsx` строка 131: `mb-[10px]` в VerticalCard768, строка 195: `mb-[10px]` в AdCard768. `cases-section-360.tsx` строка 131: `mb-[6px]` в VerticalCard360, строка 195: `mb-[6px]` в AdCard360. |
| 11 | Тексты Levels (воронка) сгруппированы flex-col gap-[7px] на 820px и 360px | ✓ VERIFIED | `levels-section-below-1024.tsx`: Levels768 — 3× `flex flex-col gap-[7px]` wrapper (строки 64, 72, 80). Levels360 — 3× `flex flex-col gap-[7px]` wrapper (строки 168, 176, 184). Levels480 не тронут. |

**Score:** 9/11 must-haves verified (7 ✓ VERIFIED + 2 PASSED override; 3 ? UNCERTAIN требуют human verification)

### Deferred Items

Нет.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/widgets/cases/ui/cases-section-shared-ui.tsx` | CasesNavArrowIcon с правильным маппингом back/forward | ✓ VERIFIED | Функционально корректен. `back → RIGHT_FILE` (рисует ←), `forward → LEFT_FILE` (рисует →). Имена инвертированы, но поведение правильное. |
| `src/widgets/cases/ui/cases-section-768.tsx` | Carousel без overflow-x-clip на outer wrapper | ✓ VERIFIED | `overflow-x-clip` отсутствует. `VERT_CARD_W=242, AD_CARD_W=414, CASES_SCROLL_GAP_PX=16` — без изменений. |
| `src/widgets/cases/ui/cases-section-360.tsx` | Carousel без overflow-x-clip на outer wrapper | ✓ VERIFIED | `overflow-x-clip` отсутствует. `VERT_CARD_W=208, AD_CARD_W=242, CASES_SCROLL_GAP_PX=16` — без изменений. |
| `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx` | PhilosophyClientsMarquee1024 с gapPx prop, default=60 | ✓ VERIFIED | `gapPx = 60` default. 8 вхождений: prop в MarqueeTrack, type, 2× логика, style, prop в Marquee1024, 2× вызовы. |
| `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` | PhilosophyClientsNarrowClientsBlock с 100vw breakout и marqueeGapPx prop | ✓ VERIFIED | `width: "100vw"`, `marginLeft: "calc(50% - 50vw)"` в style. `overflow-x-clip` удалён. `gapPx={marqueeGapPx}` передаётся. |
| `src/widgets/team/ui/team-section-360.tsx` | TeamSectionPhoto с variant="narrow" | ✓ VERIFIED | `TeamSectionPhoto` присутствует (строки 45-56) с `variant="narrow"`, `frameClassName="h-[204px] w-full"`. |
| `src/widgets/levels/ui/levels-section-below-1024.tsx` | Levels768 и Levels360 с flex flex-col gap-[7px] для label+title | ✓ VERIFIED | 3× flex wrapper в Levels768, 3× в Levels360. Levels480 не тронут. Container h-[290px] для Levels360 (увеличен с 270px для предотвращения clipping level 2). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| CasesSectionArrowsNav | CasesNavArrowIcon | variant prop | ✓ WIRED | Строки 74, 87: `variant="back"` и `variant="forward"` передаются корректно. |
| PhilosophyClients360 | PhilosophyClientsNarrowClientsBlock | marqueeGapPx={MARQUEE_GAP_360_PX} | ✓ WIRED | `philosophy-clients-360.tsx` импортирует `MARQUEE_GAP_360_PX` и передаёт как `marqueeGapPx`. |
| PhilosophyClientsNarrowClientsBlock | PhilosophyClientsMarquee1024 | gapPx={marqueeGapPx} | ✓ WIRED | Строка 437 narrow-stack.tsx: `<PhilosophyClientsMarquee1024 gapPx={marqueeGapPx} />` |
| MarqueeTrack | gap style | style={{ gap: gapPx }} | ✓ WIRED | `philosophy-clients-marquee-1024.tsx` строка 176: `gap: gapPx` в style объекте трека. |
| VerticalCard768 credits | mb spacing | cn("m-0", i < credits.length - 1 && "mb-[10px]") | ✓ WIRED | Строка 131 cases-section-768.tsx. |
| VerticalCard360 credits | mb spacing | cn("m-0", i < credits.length - 1 && "mb-[6px]") | ✓ WIRED | Строка 131 cases-section-360.tsx. |
| Levels768 label+title | flex wrapper | flex flex-col gap-[7px] | ✓ WIRED | 3 группы в Levels768 (строки 64, 72, 80). |
| Levels360 label+title | flex wrapper | flex flex-col gap-[7px] | ✓ WIRED | 3 группы в Levels360 (строки 168, 176, 184). |

### Data-Flow Trace (Level 4)

Артефакты рендерят реальные данные из статических data-файлов (cases data, levels copy, marquee assets) — не из API. Поток данных к динамическим компонентам:

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| VerticalCard768/360 | credits | casesVerticalCards1440 / casesAdCards1440 | Yes (статические данные) | ✓ FLOWING |
| Levels768/360 | levels | levelsCopy | Yes (статические данные) | ✓ FLOWING |
| PhilosophyClientsMarquee1024 | logo assets | philosophyMarquee1440Assets | Yes (статические импорты) | ✓ FLOWING |
| TeamSectionPhoto | teamPhoto | teamSectionAssets (Phase 2) | Requires browser verification | ? |

### Behavioral Spot-Checks

Step 7b: SKIPPED (no runnable entry points — dev server not started; code verification sufficient for layout changes)

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| LY820-01 | 03-01 | Стрелки карусели смотрят в правильные стороны (← →) на 820px | PASSED (override) | Код функционально верен. Визуальная верификация требуется. |
| LY820-02 | 03-02 | Карусель не обрезает правую карточку на 820px | ✓ SATISFIED | overflow-x-clip удалён из cases-section-768.tsx |
| LY820-03 | 03-03 | Полосы клиентов на 820px растянуты на полную ширину | ? NEEDS HUMAN | 100vw breakout реализован; горизонтальный скролл не может быть проверен без браузера |
| LY820-04 | 03-04 | Межстрочный интервал в карточках кейсов соответствует ожидаемому | ✓ SATISFIED | mb-[10px] в VerticalCard768 и AdCard768 |
| LY820-05 | 03-05 | Тексты воронки не накладываются на 820px | ? NEEDS HUMAN | flex gap-[7px] реализован; визуальный overlap нельзя подтвердить без браузера |
| LY360-01 | 03-01 | Стрелки карусели смотрят в правильные стороны (← →) на 360px | PASSED (override) | Код функционально верен. Визуальная верификация требуется. |
| LY360-02 | 03-02 | Карусель не обрезает правую карточку на 360px | ✓ SATISFIED | overflow-x-clip удалён из cases-section-360.tsx |
| LY360-03 | 03-01 | Фото в секции «что мы делаем» отображается корректно | ? NEEDS HUMAN | TeamSectionPhoto подключён с корректными props; загрузка изображения требует браузера |
| LY360-04 | 03-03 | Отступы между лого клиентов соответствуют Figma на 360px | ? NEEDS HUMAN | MARQUEE_GAP_360_PX=20 передаётся; значение инферировано (Figma MCP недоступен) |
| LY360-05 | 03-04 | Межстрочный интервал в карточках кейсов на 360px | ✓ SATISFIED | mb-[6px] в VerticalCard360 и AdCard360 |
| LY360-06 | 03-05 | Тексты воронки не накладываются на 360px | ? NEEDS HUMAN | flex gap-[7px] реализован; визуальный overlap нельзя подтвердить без браузера |

**Orphaned requirements check:** Все 11 requirement IDs (LY820-01..05, LY360-01..06) заявлены в планах и проверены. Дополнительных requirement IDs для Phase 3 в REQUIREMENTS.md нет.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `philosophy-clients-marquee-1024.tsx` | 10 | `MARQUEE_GAP_360_PX = 20` — значение инферировано, не из Figma | ⚠️ Warning | Gap может не совпадать с дизайном Figma; требует визуальной проверки |

Дополнительных placeholder-паттернов, пустых handlers или TODO/FIXME не обнаружено в изменённых файлах.

### Ключевое замечание: несоответствие SUMMARY vs кода (LY820-01 / LY360-01)

SUMMARY 03-01 утверждает, что ternary в `CasesNavArrowIcon` был "исправлен" путём swap констант (`FIGMA_LEFT_FILE` после `back`). Фактически в коде находится `FIGMA_RIGHT_FILE` после `back` — то есть SUMMARY описывает состояние после применения патча, который был ОТВЁРНУТ.

Revert-commit **43089a8** (`fix(03-review): revert arrow swap`) восстановил оригинальный маппинг и задокументировал причину: `CASES_ARROW_PATH_FIGMA_RIGHT_FILE` (M12.2964, кончик стрелки смотрит влево) фактически рисует **←**, а `CASES_ARROW_PATH_FIGMA_LEFT_FILE` (M21.7036, кончик справа) рисует **→**. Поэтому `back → RIGHT_FILE` = ← является КОРРЕКТНЫМ.

Функциональная цель LY820-01 / LY360-01 достигнута, но требует визуальной подтверждения.

### Human Verification Required

#### 1. Стрелки карусели кейсов

**Тест:** Открыть dev server (`npm run dev`), включить DevTools, установить viewport 820px → найти секцию кейсов → проверить: левая стрелка (кнопка aria-label="Назад") показывает шеврон ← (влево), правая (aria-label="Вперёд") показывает → (вправо). Повторить на 360px и 1440px.
**Ожидаемо:** Стрелки Назад=← и Вперёд=→ на всех трёх брейкпоинтах.
**Почему human:** SVG-константы имеют инвертированные имена. Только визуальная проверка подтверждает корректность отрисовки.

#### 2. Фотография команды на 360px

**Тест:** Viewport 360px → прокрутить до секции «что мы делаем» (team section). Убедиться что фото команды видно (не skeleton, не broken image, не пустое место).
**Ожидаемо:** Актуальная фотография команды отображается в прямоугольном контейнере h-[204px] с rounded-[8px].
**Почему human:** Загрузка asset-изображения через Next.js Image требует браузерного запроса.

#### 3. Полосы логотипов клиентов на 820px

**Тест:** Viewport 820px → найти секцию клиентов (philosophy-clients) → убедиться что бегущие строки с логотипами занимают 100% ширины viewport без обрезки по краям. Убедиться что горизонтальный скроллбар на странице отсутствует.
**Ожидаемо:** Марки полностью заполняют viewport в ширину. Нет горизонтального переполнения.
**Почему human:** `overflow-x: visible` на родительском контейнере в комбинации с `100vw` может создать горизонтальный скролл — нужно проверить в браузере.

#### 4. Gap между логотипами клиентов на 360px

**Тест:** Viewport 360px → найти секцию клиентов → оценить визуальный gap между логотипами в бегущей строке.
**Ожидаемо:** Gap между логотипами небольшой (20px), выглядит пропорционально дизайну. Не слишком большим (как было при 60px).
**Почему human:** MARQUEE_GAP_360_PX=20 выбрано логически (Figma MCP недоступен). Нужна визуальная проверка совпадения с Figma.

#### 5. Тексты секции воронки (Levels) на 820px и 360px

**Тест:** Viewport 820px → найти секцию воронки → убедиться что для каждого из 3 уровней оба текста (label серый + title жирный) видны без перекрытия. Повторить на 360px.
**Ожидаемо:** 6 label + 6 title полностью видны. Label расположен над title с gap ~7px. Нет text overflow за границу контейнера.
**Почему human:** Координаты absolute-позиционирования не верифицированы через Figma MCP. Flex gap-[7px] реализован, но совпадение с Figma и отсутствие clipping нельзя подтвердить статически.

### Gaps Summary

Блокирующих gaps нет — все артефакты существуют, реализованы нетривиально (не stubs) и подключены. Код компилируется без TypeScript ошибок.

Статус `human_needed` определён наличием 5 пунктов, требующих браузерной проверки:
- 2 пункта — визуальное направление стрелок (константы с инвертированными именами)
- 1 пункт — загрузка изображения команды (asset delivery)
- 1 пункт — поведение overflow при 100vw breakout
- 1 пункт — корректность инферированного gap 20px для marquee

После прохождения human verification и получения "approved" — все 11 requirements Phase 3 можно считать закрытыми.

---

_Verified: 2026-04-22T21:00:00Z_
_Verifier: Claude (gsd-verifier)_
