# Phase 5: Pixel-Perfect Final Pass — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 05-pixel-perfect-final-pass
**Areas discussed:** Методология sverka (единственная выбранная зона)

---

## Gray Area Selection

Presented 4 gray areas; user selected only «Методология sverka». Остальные (Tolerance и типы отклонений, Discovery vs Fix scope, Out-of-scope и fix budget) были покрыты follow-up вопросами в рамках выбранной зоны.

| Area | Selected |
|------|----------|
| Методология sverka | ✓ |
| Tolerance и типы отклонений | — (покрыто в follow-up) |
| Discovery vs Fix scope | — (покрыто в follow-up) |
| Out-of-scope и fix budget | — (покрыто в follow-up) |

---

## Методология sverka

### Q1: Порядок обхода при sverka?

| Option | Description | Selected |
|--------|-------------|----------|
| По брейкпоинтам | Все секции 1440 → 1180 → 820 → 360. preview_resize держится длительно на одном viewport. | ✓ |
| По секциям | Одна секция на всех 4 брейкпоинтах, потом следующая. | |

**User's choice:** По брейкпоинтам (рекомендованная опция)

### Q2: Как выполняется сравнение?

| Option | Description | Selected |
|--------|-------------|----------|
| Figma MCP + preview_screenshot | get_screenshot + preview_screenshot + get_variable_defs | ✓ |
| Только Figma MCP данные | variable_defs + design_context, без визуальных скриншотов | |

**User's choice:** Figma MCP + preview_screenshot (рекомендованная опция)

### Q3: Куда записываем findings?

| Option | Description | Selected |
|--------|-------------|----------|
| Один SVERKA-REPORT.md | Единая таблица отклонений | ✓ |
| По findings-файлу на брейкпоинт | 4 отдельных файла | |

**User's choice:** Один SVERKA-REPORT.md (рекомендованная опция)

### Q4: Секции для обхода?

| Option | Description | Selected |
|--------|-------------|----------|
| Все секции страницы | hero, business-goals, services, cases, team, philosophy-clients, levels, footer | ✓ |
| Только тронутые в Phases 2-4 | Фокус на изменённых секциях | |

**User's choice:** Все секции страницы (рекомендованная опция)

### Q5: Discovery vs Fix в Phase 5?

| Option | Description | Selected |
|--------|-------------|----------|
| Discovery + Fix в одной фазе | Найти → сразу фиксить, крупные правки (>30 строк) → backlog | ✓ |
| Только Discovery | Документировать, фиксить в 5.1 / backlog | |

**User's choice:** Discovery + Fix в одной фазе (рекомендованная опция)

### Q6: Tolerance для pixel-perfect?

| Option | Description | Selected |
|--------|-------------|----------|
| ±2px (рекомендовано) | Разница до 2px игнорируется | |
| ±1px (строго) | Даже 1px — отклонение | ✓ |
| ±4px (мягко) | Быстрее, пропустит визуальные баги | |

**User's choice:** ±1px (строго) — **отклонение от рекомендации; пользователь выбрал более строгий порог, согласно цели pixel-perfect**

### Q7: Что входит в сверку? (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| Размеры и отступы | gap, padding, margin, width, height, absolute позиции | ✓ |
| Типографика | font-size, font-weight, line-height, letter-spacing, font-family | ✓ |
| Цвета и тени | background, color, border, box-shadow, border-radius | ✓ |
| Изображения/ассеты | наличие и корректность фото, svg-пути | ✓ |

**User's choice:** Все четыре категории (maximum scope)

### Q8: Сверка динамических состояний?

| Option | Description | Selected |
|--------|-------------|----------|
| Только static состояние | Default state, без hover/focus/modal | ✓ |
| Включая hover/open-modal | Больше работы, сверка и states | |

**User's choice:** Только static состояние (рекомендованная опция)

---

## Claude's Discretion

- Точное количество plan-файлов внутри каждого брейкпоинта
- Какие конкретно Figma-ноды соответствуют каждой секции (executor ищет через MCP)
- Нужен ли [BLOCKING] checkpoint для UAT после каждого брейкпоинта

## Deferred Ideas

- Hover / focus / open-modal / scroll-прогресс sverka — вне scope Phase 5
- Крупные рефакторинги (>30 строк в одном месте) — backlog / отдельная фаза
- Автоматизация visual regression (Playwright screenshot diff) — возможно в Phase 6
