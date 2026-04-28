# Phase 04: Safari + Animations — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Решения зафиксированы в `04-CONTEXT.md` — этот лог хранит альтернативы и обоснования.

**Date:** 2026-04-22
**Phase:** 04-safari-animations
**Mode:** `--auto` (recommended options auto-selected, no interactive questioning)
**Areas discussed:** Animation library, Migration strategy, ANI-01 approach, CSS hover policy, Safari verification

---

## Animation Library

| Option | Description | Selected |
|--------|-------------|----------|
| Framer Motion (`motion`) | React-first declarative, Motion Values для scroll, Safari-compat через rAF | ✓ |
| GSAP + ScrollTrigger | Императивный, бандл ~39 KB, требует `@gsap/react` | |
| Keep boneyard-js + CSS | Не покрывает Safari < 18 scroll-timeline риски | |

**Auto-selected:** Framer Motion (`motion`).
**Notes:** Зафиксировано аудитом `.planning/AUDIT-ANIMATIONS.md`. Safari-совместимость — главный критерий Phase 4. Декларативный API снижает риск утечек в React 19 Strict Mode.

---

## Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Incremental per-widget | Мигрировать один виджет за раз, атомарные коммиты, боковой `BoneyardSkeleton` снимается последним | ✓ |
| Big-bang replace | Один PR меняет все 11 потребителей сразу | |
| Parallel coexistence | boneyard + motion живут параллельно до v2 | |

**Auto-selected:** Incremental per-widget.
**Notes:** Минимизирует blast radius, позволяет верифицировать Safari-парность повиджетно.

---

## ANI-01 Approach (Cases Pin Scroll)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep existing JS hook, verify Safari, fix only on glitch | `use-cases-pin-scroll-progress` уже rAF-based, не зависит от CSS scroll-timeline | ✓ |
| Rewrite fully on `useScroll`/`useTransform` | Полная миграция scroll-логики на motion Values | |
| Rewrite on GSAP ScrollTrigger | Индустриальный стандарт, но требует GSAP установки | |

**Auto-selected:** Keep + verify + targeted fix.
**Notes:** Существующий хук архитектурно Safari-совместим. Переписывание = ненужный риск. Если Safari покажет рассинхрон pin/scroll — точечная замена расчёта прогресса через `useScroll` как drop-in (D-07).

---

## CSS Hover Transitions Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Tailwind CSS transitions as-is | Нативные CSS hover стабильны в Safari, проверено на phases 2–3 | ✓ |
| Migrate all hovers to `whileHover` | Унифицировать через motion | |
| Migrate только глитчащие | Точечно при обнаружении Safari-проблемы | (fallback) |

**Auto-selected:** Keep as-is (с точечным fallback при Safari-глитче).
**Notes:** Миграция работающих hover’ов = регрессионный риск без выигрыша.

---

## Safari Verification Method

| Option | Description | Selected |
|--------|-------------|----------|
| Manual Safari latest on macOS (UAT) | По аналогии с Chrome UAT из phases 2–3 | ✓ |
| Playwright WebKit автоматизация | Полноценный CI cross-browser тест | (Phase 6) |
| Only visual diff screenshots | Pixel-diff вместо поведенческой проверки | |

**Auto-selected:** Manual Safari UAT в Phase 4, автоматизация — в Phase 6 (TEST-02).
**Notes:** Дубль setup Playwright в Phase 4 = scope creep. Phase 6 уже дедикейтед на тесты.

---

## Claude's Discretion

- Конкретный motion API per-widget (`motion.div` inline vs `useInView` hook vs `AnimatePresence`) — выбирается при реализации.
- Нужна ли точечная `whileHover`-миграция — решается при обнаружении конкретного Safari-глитча.
- Для ANI-01 per-element переходы (vertStrip/divider/adHeader) — оставить CSS с весами из хука ИЛИ перейти на `motion.div animate={{ opacity: weights.x }}` — per-file.

## Deferred Ideas

- Playwright WebKit — Phase 6 (TEST-02).
- Pixel-perfect Safari vs Chrome — Phase 5.
- Глобальная миграция hover → `whileHover`.
- Stagger children / spring physics enrichment reveal-анимаций.
