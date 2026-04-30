# Roadmap: SOLO Site

## Shipped Milestones

- ✅ **v1.0** (2026-04-22 → 2026-04-27) — Frontend Quality & Bug Fix · 6 phases / 27 plans · [archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1.2** (2026-04-27 → 2026-04-28) — Form Wiring + Modal Refactor + Growth & Ops · 6 phases / 14 plans · [archive](milestones/v1.1.2-ROADMAP.md)
- ✅ **v1.2** (2026-04-28 → 2026-04-30) — Performance & Delivery · 7 phases / 12 plans

## Current Milestone: v1.3 — SEO & Analytics Production Gate

**Goal:** Перевести сайт в production-ready SEO/analytics режим: `soloproduction.pro` как единственный основной домен, управляемые SEO-настройки в Payload, Яндекс Метрика и проверяемые production smoke gates.

**Started:** 2026-04-30
**Source of truth:** user decision 2026-04-30: demo domain not needed; focus on SEO + Yandex Metrika.
**Phases:** 4 phases / 4 plans

---

### Phase 20: Domain Consolidation + SEO Settings ✅

**Goal:** Убрать модель “demo как активный прод”, сделать `https://soloproduction.pro` canonical/base URL, добавить SEO/Analytics настройки в Payload.

**Requirements covered:** SEO-10, SEO-11, OPS-10, ANALYTICS-10

**Depends on:** v1.2 deployed

**Plans:**
- [x] PLAN.md `20-01-domain-seo-settings` — `soloproduction.pro` default base URL, single production compose service, Payload fields for production URL/indexing/default meta/Yandex Metrika.

**Success criteria:**
1. Default `publicSiteUrl` is `https://soloproduction.pro`.
2. `robots.txt`, `sitemap.xml`, metadataBase and canonical URLs resolve to production URL.
3. Payload `site-settings` has SEO and Yandex Metrika controls with safe defaults.
4. Deploy compose serves `soloproduction.pro` from one production service; extra prod container removed from desired compose.
5. Local/unit checks pass.

---

### Phase 21: Structured SEO Pass

**Goal:** Добить production SEO beyond canonical: OpenGraph, structured data, service page crawl rules, title/description QA.

**Plans:**
- [ ] PLAN.md `21-01-structured-seo-pass`

**Success criteria:**
1. Organization/WebSite JSON-LD present on `/`.
2. OG image absolute URLs resolve on production domain.
3. Admin/API/preview/email utility routes have intentional index/noindex behavior.
4. SEO smoke covers `/`, `/privacy`, `robots.txt`, `sitemap.xml`.

---

### Phase 22: Yandex Metrika Events

**Goal:** После подключения счетчика добавить стабильные цели для production analytics.

**Plans:**
- [ ] PLAN.md `22-01-metrika-goals`

**Success criteria:**
1. Goals fire for lead form submit success, CTA click, Telegram click, popup open/click.
2. Analytics does not run locally unless explicitly enabled.
3. Event names are documented and stable.

---

### Phase 23: Production Verification

**Goal:** Проверить `soloproduction.pro` как единственную production среду после деплоя.

**Plans:**
- [ ] PLAN.md `23-01-prod-seo-analytics-smoke`

**Success criteria:**
1. `https://soloproduction.pro` returns 200, valid SSL, expected canonical and sitemap.
2. `demo.soloproduction.pro` is no longer part of desired active production route.
3. Payload settings API returns production SEO fields.
4. Yandex Metrika script appears only when enabled.
5. PSI/SEO smoke results recorded.

---

## Backlog

### Phase 999.2: video-format-optimization — next-version backlog

**Goal:** В следующей версии уменьшить вес локального showreel video без изменения Phase 17 lazy-load поведения.
**Requirements:** TBD next version
**Plans:** 0 plans

Plans:
- [ ] Re-encode `public/assets/video/bts-ozon.mp4` to smaller web MP4 (H.264, no audio if unused, constrained resolution/bitrate, `faststart`)
- [ ] Evaluate optional WebM/AV1 secondary source, keeping MP4/H.264 as compatibility fallback

### Phase 999.1: carousel-services-arrows — extend e2e when carousel appears (BACKLOG)

**Goal:** Когда секция «Услуги» получит горизонтальную карусель (BUG-09/10 либо отдельная UX-задача), расширить `tests/e2e/carousel-services.spec.ts` проверкой arrows next/prev и смены слайдов на 360/480/820. Сейчас spec покрывает только smoke render + CTA, потому что каруселей в услугах нет ни на одном брейкпоинте.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)
