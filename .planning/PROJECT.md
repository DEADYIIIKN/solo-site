# SOLO Site

## What This Is

Лендинг видеопродакшн-агентства SOLO (soloproduction.pro) — Next.js 15 App Router + PayloadCMS 3 (SQLite) + Tailwind CSS 4. Per-breakpoint компоненты (360 / 480 / 768 / 1024 / 1440), Framer Motion для анимаций, Playwright + Vitest для тестов, Docker + Traefik для деплоя на demo.soloproduction.pro.

## Core Value

Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.

## Current State

✅ **Milestone v1.0 shipped** (2026-04-27) — Frontend Quality & Bug Fix

См. [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) и [v1.0-MILESTONE-AUDIT.md](v1.0-MILESTONE-AUDIT.md).

- 6 phases / 27 plans / 215 commits / 5 days
- 31/31 v1 requirements complete (с 2 override + 1 UX decision)
- 26 unit + 49 E2E (chromium + webkit + mobile-safari) — passing on main
- boneyard-js удалён, миграция на Framer Motion завершена
- 5 breakpoints прошли Figma MCP sverka (с 4 deferred design decisions)

## Next Milestone Goals (draft for /gsd-new-milestone)

Кандидаты для v1.1 / v2.0 — обсудить в новом цикле:

**Tech debt (REFAC):**
- REFAC-01: Унифицировать 5 консультационных модалей в `ConsultationModalBase`
- REFAC-02: Разбить `business-goals.tsx` (1300 строк) на per-breakpoint компоненты
- REFAC-03: Разбить `services-section-below-1024.tsx` (1000 строк)
- REFAC-04: Перенести shared form types в model-файл

**Functionality (FUNC):**
- FUNC-01: Реализовать отправку формы в CRM/Telegram/n8n (сейчас TODO)

**Deferred design decisions (из v1.0):**
- Footer blog secrets + consultation badge (CMS-flag, нужен дизайн badge)
- Lead-form 360/480 cumulative y-drift (D-19 — потенциально требует font-fix)
- Team 360 tagline wrap (Montserrat font-metrics)

**Backlog (999.x):**
- 999.1: carousel-services-arrows e2e (когда появится карусель в услугах)

## Constraints

- **Stack:** Next.js 15 + PayloadCMS 3 + Tailwind 4 + TypeScript — locked для следующего milestone (см. AUDIT-STACK.md)
- **Animations:** Framer Motion (`motion@^12.38.0`) — locked, boneyard-js удалён (см. AUDIT-ANIMATIONS.md)
- **Deploy:** Docker + Traefik, demo.soloproduction.pro — CI/CD сохраняется
- **Browsers:** Chrome (latest) + Safari (latest) + Mobile Safari (iPhone 13) — passed in v1.0
- **Breakpoints:** 360 / 480 / 768 / 1024 / 1440 — pixel-checked в v1.0
- **Component pattern:** per-breakpoint файлы

## Key Decisions

| Decision | Milestone | Rationale | Outcome |
|---|---|---|---|
| Keep Next.js App Router (не SPA) | v1.0 | Native Payload integration, ISR, единый Docker | Validated — AUDIT-STACK.md |
| Framer Motion вместо boneyard-js | v1.0 | Safari-safe scroll-driven, MotionConfig reduced-motion | Shipped — boneyard удалён в 04-06 |
| Cases pin-collapse удалить | v1.0 | UX-decision D-07 «ужасно неюзабельно» в Safari | Override on ANI-01, accepted |
| 4 design-decisions в Phase 5 deferred | v1.0 | Font-metrics, design tradeoffs, future feature gates | Documented в SVERKA-REPORT, vNext |
| Atomic commits per task | all | GSD core principle, simplifies revert/review | Sustained |

## Evolution

This document evolves at phase transitions and milestone boundaries. Last evolved at v1.0 completion (2026-04-27).

---
*Last updated: 2026-04-27 — milestone v1.0 shipped*
