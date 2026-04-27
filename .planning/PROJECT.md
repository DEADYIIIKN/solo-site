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

## Shipped (within current dev cycle)

- ✅ **v1.1** awaiting merge in [PR #5](https://github.com/DEADYIIIKN/solo-site/pull/5) — Form Wiring & Modal Refactor (3 phases / 9 plans)

## Current Milestone: v1.2 — Growth & Ops

**Goal:** Дать пользователю канал подписки на TG (lead nurturing) + базовые admin-инструменты для работы с лидами.

**Target features:**
- **TG-01** — Pop-up уведомление о TG-канале, появляется через 60s активности на сайте (sessionStorage dismiss, dismissable). Per-breakpoint dismiss модалка по дизайну Figma (783:9762 / 9750 / 9729 / 9708 / 9687)
- **TG-02** — TG channel URL через env var `NEXT_PUBLIC_TG_CHANNEL_URL` (значение от пользователя)
- **ADMIN-01** — Custom columns в Payload admin для leads list view (source, date, forwarded, contactMethod)
- **ADMIN-02** — Filter / sort в leads admin (по дате, по source, по forwarded status)
- **ADMIN-03** — CSV export — кнопка в leads list, скачивает all/filtered

**Out of scope для v1.2 (email уведомления решаются через n8n flow):**
- Email-уведомления при новом лиде (n8n берёт на себя)
- REFAC-02/03/04 (отложены — нет forcing function, см. v1.1 discuss)
- Footer blog secrets + consultation badge — отдельная feature-фаза с дизайном
- Cases 1440 gap (D-17), team 360 tagline wrap — accepted design decisions

## Backlog Candidates (for future milestones)

**Polish (deferred design decisions из v1.0/v1.1):**
- Footer blog secrets + consultation badge (нужен дизайн)
- Cases 1440 ad-section gap (D-17 accepted, можно вернуться)
- Team 360 tagline wrap (font swap)
- LF-DRIFT residual ±5..10px micro-fixes (если выявятся в реальной sverka)

**SEO & Analytics:**
- Meta-tags + Open Graph для сайта
- sitemap.xml / robots.txt / structured data
- Yandex Metrica + Google Analytics + conversion goal «отправил заявку»

**Reliability:**
- Sentry / error tracking
- Custom 404 page
- Retry-queue для failed n8n webhooks

**Tech debt (без forcing function — открыть только если появится боль):**
- REFAC-02: Разбить `business-goals.tsx` (1300 строк)
- REFAC-03: Разбить `services-section-below-1024.tsx` (1000 строк)
- REFAC-04: Shared form types в model-файл

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
