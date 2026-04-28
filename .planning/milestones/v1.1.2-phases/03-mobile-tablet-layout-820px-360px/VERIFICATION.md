---
phase: 03-mobile-tablet-layout-820px-360px
verified: 2026-04-22T21:00:00Z
reverified: 2026-04-27T00:00:00Z
status: passed
score: 11/11 must-haves verified
overrides_applied: 2
overrides:
  - must_have: "Кнопка «Назад» (aria-label=Назад) в карусели кейсов показывает левый шеврон (←) на всех брейкпоинтах"
    reason: "Имена SVG-констант инвертированы относительно геометрии (CASES_ARROW_PATH_FIGMA_RIGHT_FILE рисует ←). Маппинг back→RIGHT_FILE функционально корректен. Подтверждено DOM-инспекцией 22-04 (M12.2964 — кончик слева) и Phase 5 sverka 820/360."
    accepted_by: "code-review (commit 43089a8) + Phase 5 sverka (05-03/05-04)"
    accepted_at: "2026-04-22T20:42:54+03:00"
  - must_have: "Кнопка «Вперёд» (aria-label=Вперёд) показывает правый шеврон (→) на всех брейкпоинтах"
    reason: "Аналогично — CASES_ARROW_PATH_FIGMA_LEFT_FILE рисует → (M21.7036). Маппинг forward→LEFT_FILE функционально корректен. Подтверждено DOM 22-04 + Phase 5 sverka."
    accepted_by: "code-review (commit 43089a8) + Phase 5 sverka (05-03/05-04)"
    accepted_at: "2026-04-22T20:42:54+03:00"
re_verification:
  previous_status: human_needed
  previous_score: 11/11 (human verification awaited)
  gaps_closed:
    - "Стрелки карусели кейсов — визуальная проверка (закрыто DOM-инспекцией 22-04 + Phase 5 sverka 820/360 «cases — matches»)"
    - "Фотография команды на 360px — видимость (Phase 5 sverka 05-04: TeamSectionPhoto рендерится; team-section-360 «matches»)"
    - "Полосы логотипов клиентов — ширина на 820px (Phase 5 sverka 05-03: philosophy-clients 820 «matches»)"
    - "Gap между логотипами клиентов на 360px (Phase 5 sverka 05-04: philosophy-clients 360 «matches»)"
    - "Credits в карточках кейсов — перекрытие (Phase 5 sverka: cases 820/360 «matches»; mb-[10px]/mb-[6px] подтверждены)"
    - "Тексты Levels — видимость на 820/360 (Phase 5 sverka: levels 820 fixed leading; levels 360 «matches»)"
  gaps_remaining: []
  regressions: []
---

# Phase 3: Mobile/Tablet Layout (820px/360px) Verification Report

**Phase Goal:** The 820px and 360px breakpoints work correctly — carousel arrows point the right way, carousels don't clip content, client strips fill the screen, line-heights match Figma, and the missing photo is restored.

**Verified:** 2026-04-22T21:00:00Z
**Re-verified:** 2026-04-27T00:00:00Z
**Status:** passed
**Re-verification:** Yes — после закрытия human-verification items через Phase 5 sverka

## Status

Все 11 must-haves (LY820-01..05 + LY360-01..06) подтверждены:
- 9 ✓ VERIFIED через статический анализ (Phase 3 verifier 22-04)
- 2 PASSED (override) — направление стрелок (имена констант инвертированы, поведение корректное)
- Все 5 пунктов human verification из первичной верификации закрыты:
  - DOM-инспекция 22-04 22:00 (стрелки/marquee/levels/team photo)
  - Phase 5 sverka 820 (05-03 PLAN, см. SVERKA-REPORT)
  - Phase 5 sverka 360 (05-04 PLAN, см. SVERKA-REPORT)
  - Phase 5 finalize (05-06, ROADMAP отмечает Phase 5 как complete 27-04)

## Goal Achievement — Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Кнопка «Назад» показывает ← на всех брейкпоинтах | PASSED (override) | DOM 22-04: M12.2964 при innerWidth 360/820/1440. Phase 5 sverka cases 820/360 «matches». |
| 2 | Кнопка «Вперёд» показывает → на всех брейкпоинтах | PASSED (override) | DOM 22-04: M21.7036. Phase 5 sverka cases 820/360 «matches». |
| 3 | Фото команды видно на 360px | ✓ VERIFIED | Phase 5 sverka 05-04: team-section-360 «matches»; TeamSectionPhoto variant=narrow подключён, h-[204px]. team.png 2MB. |
| 4 | На 820px последняя карточка карусели не обрезается | ✓ VERIFIED | overflow-x-clip удалён из cases-section-768. Phase 5 sverka cases 820 «matches». |
| 5 | На 360px последняя карточка карусели не обрезается | ✓ VERIFIED | overflow-x-clip удалён из cases-section-360. Phase 5 sverka 05-04: cases 360 fixed (gap-[20px]/gap-[30px]), card1 (32,215) и (16,776) EXACT. |
| 6 | useCasesHorizontalCarousel scroll-логика не изменялась | ✓ VERIFIED | Константы VERT_CARD_W/AD_CARD_W/CASES_SCROLL_GAP_PX без изменений. |
| 7 | На 820px полосы клиентов = 100vw | ✓ VERIFIED | DOM 22-04: width=100vw + marginLeft=calc(50%-50vw). Phase 5 sverka philosophy-clients 820 «matches». |
| 8 | На 360px gap логотипов = Figma | ✓ VERIFIED | DOM 22-04: getComputedStyle gap=20px. Phase 5 sverka 05-04 philosophy-clients 360 «matches». |
| 9 | На 768/1024 gap маркизы = 60px | ✓ VERIFIED | gapPx default=60 в philosophy-clients-marquee-1024.tsx; PhilosophyClients768 использует default. |
| 10 | mb credits в карточках кейсов | ✓ VERIFIED | mb-[10px] в 768, mb-[6px] в 360. Phase 5 sverka cases «matches». |
| 11 | Levels тексты flex-col gap-[7px] на 820/360 | ✓ VERIFIED | 3+3 wrappers. Phase 5 sverka levels 820 fixed leading-[1.1]; 360 «matches». |

**Score:** 11/11 must-haves verified (9 ✓ + 2 override).

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| LY820-01 | 03-01 | Стрелки 820px ← → | ✓ SATISFIED | DOM 22-04 + sverka 820 cases «matches» |
| LY820-02 | 03-02 | Карусель 820 не обрезает | ✓ SATISFIED | overflow-x-clip удалён + sverka «matches» |
| LY820-03 | 03-03 | Полосы клиентов 820 на полную ширину | ✓ SATISFIED | 100vw breakout + sverka «matches» |
| LY820-04 | 03-04 | Межстрочный интервал кейсов 820 | ✓ SATISFIED | mb-[10px] + sverka «matches» |
| LY820-05 | 03-05 | Тексты воронки 820 не накладываются | ✓ SATISFIED | flex-col gap-[7px] + sverka 820 levels fixed |
| LY360-01 | 03-01 | Стрелки 360px ← → | ✓ SATISFIED | DOM 22-04 + sverka 360 cases «matches» |
| LY360-02 | 03-02 | Карусель 360 не обрезает | ✓ SATISFIED | overflow-x-clip удалён + sverka 05-04 fixed |
| LY360-03 | 03-01 | Фото «что мы делаем» 360 | ✓ SATISFIED | TeamSectionPhoto variant=narrow + sverka 05-04 «matches» |
| LY360-04 | 03-03 | Gap логотипов 360 | ✓ SATISFIED | MARQUEE_GAP_360_PX=20 + DOM 22-04 + sverka «matches» |
| LY360-05 | 03-04 | Межстрочный интервал кейсов 360 | ✓ SATISFIED | mb-[6px] + sverka «matches» |
| LY360-06 | 03-05 | Тексты воронки 360 не накладываются | ✓ SATISFIED | flex-col gap-[7px] + sverka 360 levels «matches» |

**Orphaned requirements check:** Все 11 requirement IDs (LY820-01..05, LY360-01..06) заявлены в планах и проверены. Дополнительных requirements для Phase 3 в REQUIREMENTS.md нет.

## Critical Gaps

Нет.

## Non-Critical Notes

- Override #1, #2 (стрелки): имена SVG-констант FIGMA_LEFT_FILE/FIGMA_RIGHT_FILE инвертированы относительно геометрии. Поведение корректное, но при будущем рефакторинге желательно переименовать константы для устранения cognitive load (revert-commit 43089a8 — задокументированная ловушка).
- MARQUEE_GAP_360_PX=20 был инферирован при отсутствии Figma MCP в Phase 3, подтверждён Phase 5 sverka 360.

## Anti-Patterns Found

Нет блокирующих или новых anti-patterns. Дополнительных placeholder-паттернов, пустых handlers или TODO/FIXME в изменённых Phase 3 файлах не обнаружено.

## Notes

- Re-verification: Phase 5 (Pixel-Perfect Final Pass) подтвердил соответствие 820/360 Figma sverka — это закрывает все 5 пунктов human verification из первичной Phase 3 VERIFICATION.md.
- ROADMAP: Phase 3 — Complete 2026-04-22; Phase 5 — Complete 2026-04-27.
- Артефакты файлов: cases-section-768.tsx, cases-section-360.tsx, cases-section-shared-ui.tsx, philosophy-clients-marquee-1024.tsx, philosophy-clients-narrow-stack.tsx, philosophy-clients-360.tsx, team-section-360.tsx, levels-section-below-1024.tsx — все верифицированы (exists + substantive + wired + flowing).

---

_Verified: 2026-04-22T21:00:00Z_
_Re-verified: 2026-04-27T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
