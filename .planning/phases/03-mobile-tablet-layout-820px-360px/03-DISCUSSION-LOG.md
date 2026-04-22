# Phase 3: Mobile/Tablet Layout (820px + 360px) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 03-mobile-tablet-layout-820px-360px
**Areas discussed:** Стрелки карусели, Фото 360px, Полосы клиентов 820px, Figma MCP подход

---

## Стрелки карусели

| Option | Description | Selected |
|--------|-------------|----------|
| Figma MCP (обрезка) | Получить точные размеры из дизайна | ✓ |
| Браузер + визуал | Найти причину обрезки через DevTools | |
| Claude's Discretion | Исполнитель решает сам | |

**User's choice:** Figma MCP для фикса обрезки карточки; стрелки — 1-строчный своп SVG путей

**Notes:** Карусель оказалась в `cases` виджете, не в `services`. Баг стрелок локализован в `cases-section-shared-ui.tsx:23` — перепутаны `CASES_ARROW_PATH_FIGMA_RIGHT_FILE` и `CASES_ARROW_PATH_FIGMA_LEFT_FILE`.

---

## Фото 360px

| Option | Description | Selected |
|--------|-------------|----------|
| Проверить в браузере первым | Может быть уже исправлено Phase 2 | ✓ |
| Считать решённым | Phase 2 заменила файл — достаточно | |

**User's choice:** Проверить в браузере при 360px сначала

**Notes:** TeamSection360 использует тот же `teamSectionAssets.teamPhoto` что заменили в Phase 2. Скорее всего баг исправлен автоматически.

---

## Полосы клиентов 820px

| Option | Description | Selected |
|--------|-------------|----------|
| Да, один фикс | 100vw breakout в PhilosophyClientsNarrowClientsBlock | ✓ |
| Нет, раздельные фиксы | Отдельные правки для 820px и 360px | |

**User's choice:** Один фикс в PhilosophyClientsNarrowClientsBlock для обоих брейкпоинтов

**Notes:** Та же проблема что в Phase 2 (LY1180-01): `overflow-x-clip` + `w-full max-w-full` внутри `max-w-[768px]` контейнера. LY360-04 (gap логотипов) — отдельный вопрос: нужен Figma MCP для точного значения + gap prop.

---

## Figma MCP подход

| Option | Description | Selected |
|--------|-------------|----------|
| Для всех чисел | Figma MCP для любых pixel значений | ✓ |
| Только для неясных | Figma MCP только когда код не даёт ответа | |

**User's choice:** Figma MCP для всех числовых значений в Phase 3

**Notes:** Roadmap имеет UI hint: yes. Figma MCP предпочтительна для line-height, gap, координат позиционирования.

---

## Claude's Discretion

- Способ добавления gap prop в PhilosophyClientsMarquee1024 (gapPx prop vs gapClassName vs CSS override)
- Если 100vw breakout создаёт scrollbar — проверить overflow предков (паттерн из Phase 2)

## Deferred Ideas

Нет — обсуждение не вышло за рамки фазы.
