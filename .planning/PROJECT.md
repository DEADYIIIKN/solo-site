# SOLO Site

## What This Is

Лендинг видеопродакшн-агентства SOLO (soloproduction.pro) — Next.js 15 App Router + PayloadCMS 3 (SQLite) + Tailwind CSS 4. Per-breakpoint компоненты (360 / 480 / 768 / 1024 / 1440), Framer Motion для анимаций, Playwright + Vitest для тестов, Docker + Traefik для деплоя на soloproduction.pro.

## Core Value

Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.

## Current State

✅ **Milestone v1.0 shipped** (2026-04-27) — Frontend Quality & Bug Fix
✅ **Milestone v1.1.2 shipped** (2026-04-28) — Form Wiring + Modal Refactor + Growth & Ops
✅ **Milestone v1.2 shipped** (2026-04-30) — Performance & Delivery

**v1.2 highlights:**
- Static and Payload media optimized for AVIF/WebP responsive delivery
- Local showreel video lazy-loads instead of loading on initial mobile page load
- Font bundle reduced with woff2 subsets
- SEO/a11y hygiene for `/privacy`
- Perf smoke guard added for mobile page weight and no initial MP4 request

См. [ROADMAP.md](ROADMAP.md), [milestones/v1.1.2-ROADMAP.md](milestones/v1.1.2-ROADMAP.md), [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md).

## Current Milestone: v1.3 — SEO & Analytics Production Gate

**Goal:** Перевести сайт в production-ready SEO/analytics режим: `soloproduction.pro` как единственный основной домен, управляемые SEO-настройки в Payload, Яндекс Метрика и проверяемые production smoke gates.

**Target features:**

- **SEO-10** `soloproduction.pro` as canonical/base production URL.
- **SEO-11** Payload-managed SEO defaults: production URL, indexing, title, description, OG image.
- **ANALYTICS-10** Payload-managed Yandex Metrika counter settings.
- **ANALYTICS-11** Stable analytics goals for lead form, CTA, Telegram and popup interactions.
- **OPS-10** Single active production runtime; local remains test environment.
- **VERIFY-10** Production smoke for domain, robots, sitemap, analytics script and SEO head.

**Out of scope для v1.3:**
- Google Analytics unless explicitly requested.
- Full CDN migration.
- New visual redesign.

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
- **Deploy:** Docker + Traefik, soloproduction.pro — CI/CD сохраняется
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
| `soloproduction.pro` is the only active production domain | v1.3 | Local environment is the test environment; `demo.soloproduction.pro` no longer needed | Phase 20 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-04-30 — milestone v1.3 started (SEO & Analytics Production Gate)*
