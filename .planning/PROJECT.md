# SOLO Site

## What This Is

Лендинг видеопродакшн-агентства SOLO (soloproduction.pro) — Next.js 15 App Router + PayloadCMS 3 (SQLite) + Tailwind CSS 4. Per-breakpoint компоненты (360 / 480 / 768 / 1024 / 1440), Framer Motion для анимаций, Playwright + Vitest для тестов, Docker + Traefik для деплоя на demo.soloproduction.pro.

## Core Value

Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.

## Current State

✅ **Milestone v1.0 shipped** (2026-04-27) — Frontend Quality & Bug Fix
✅ **Milestone v1.1.2 shipped** (2026-04-28) — Form Wiring + Modal Refactor + Growth & Ops

**v1.1.2 highlights:**
- 6 phases (7-12) / 14 plans / 89 commits / 2 days
- 17/17 v1 requirements satisfied
- 45 unit + 79 E2E (chromium + webkit + mobile-safari) — passing on main
- Form submission live: n8n webhook + Payload Collection fallback + rate-limit
- 5 consultation modals → 1 ConsultationModal (−2336 LOC дубликатов)
- TG popup per-breakpoint (1440/1024/768/480/360) Figma 1:1
- Leads admin: custom columns + filter/sort + CSV export
- Navbar surface unified (gray translucent + backdrop-blur) на всех 5 viewports

См. [milestones/v1.1.2-ROADMAP.md](milestones/v1.1.2-ROADMAP.md), [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md).

## Current Milestone: v1.2 — Performance & Delivery

**Goal:** Lighthouse Performance **90+ на всех брейкпоинтах** (mobile / tablet / desktop) для `/` и `/privacy`. Mobile LCP < 2.5s, desktop LCP < 1.0s. Снизить вес mobile home с 3.8 MB до < 1.2 MB. Все статические и Payload-uploaded медиа автоматически отдаются в AVIF/WebP с правильным размером per-device.

**Target features (по результатам аудита 2026-04-28, см. `.planning/research/AUDIT-PSI.md`):**

**P0 — Performance (highest ROI):**
- **PERF-01** Footer blog cards (3 × 900KB JPG) → next/image AVIF — экономия ~2.2 MB
- **PERF-02** Hero / team / business-goals PNG (3.2MB×3 копий) → next/image AVIF — экономия ~80%
- **PERF-03** Hero LCP < 2.5s mobile / < 1.0s desktop (priority + responsive srcset)
- **PERF-04** Кэш-хедеры на static `/assets/*` — `max-age=0` → `immutable max-age=31536000`
- **PERF-05** Cleanup duplicate media в `/public/assets` (~10–20 MB в репе)

**P0.5 — Payload media optimization:**
- **PERF-10** Payload Media collection `imageSizes` config — server-side resize on upload (AVIF/WebP per breakpoint)
- **PERF-11** Audit все Payload-media рендеры → next/image с правильным `sizes` атрибутом

**P1 — Optimization:**
- **PERF-06** Шрифты TTF → woff2 + RU/EN subsetting — 680 KB → ~340 KB
- **PERF-07** Bundle: убрать unused JS 86 KB через @next/bundle-analyzer
- **PERF-08** Console errors `ERR_CONNECTION_FAILED` (3 шт) — найти и починить
- **PERF-09** bts-ozon.mp4 (57 MB) — lazy + poster-кадр; optionally вынести на внешний хостинг

**P2 — A11y / SEO hygiene:**
- **A11Y-01** Контраст `text-[#9c9c9c]` 10–11px — повысить до WCAG AA 4.5:1
- **SEO-01** `/privacy` — canonical link + проверка `is-crawlable=true`

**Out of scope для v1.2:**
- Sentry / error tracking — отдельный milestone "Reliability"
- Yandex Metrica / Google Analytics — отдельный milestone "Analytics"
- Apple/Android specific media (HEIC) — preview AVIF покроет 95% кейсов
- Custom CDN — Traefik + immutable cache достаточно для текущей нагрузки

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
*Last updated: 2026-04-28 — milestone v1.2 started (Performance & Delivery)*
