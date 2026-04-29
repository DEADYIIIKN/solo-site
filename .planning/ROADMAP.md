# Roadmap: SOLO Site

## Shipped Milestones

- ✅ **v1.0** (2026-04-22 → 2026-04-27) — Frontend Quality & Bug Fix · 6 phases / 27 plans · [archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1.2** (2026-04-27 → 2026-04-28) — Form Wiring + Modal Refactor + Growth & Ops · 6 phases / 14 plans · [archive](milestones/v1.1.2-ROADMAP.md)

## Current Milestone: v1.2 — Performance & Delivery

**Goal:** Lighthouse Performance 90+ на всех брейкпоинтах для `/` и `/privacy`, mobile LCP < 2.5s, mobile home weight < 1.2 MB. Все статические и Payload-uploaded медиа отдаются в AVIF/WebP с per-device responsive srcset.

**Started:** 2026-04-28
**Source of truth:** `.planning/research/AUDIT-PSI.md`
**Phases:** 7 phases / 13 plans

---

### Phase 13: Static Media Optimization (P0) ✅

**Goal:** Вытащить из mobile home ~2.4 MB blog-card JPG + ~6 MB PNG-photo дублей через `next/image` (AVIF + responsive srcset). Самая большая ROI в milestone.

**Requirements covered:** PERF-01, PERF-02, PERF-03, PERF-05

**Depends on:** Nothing (первая фаза milestone)

**Plans:**
- [x] PLAN.md `13-01-footer-blog-cards-next-image` — PERF-01: 3× footer blog-cards (2.4 MB) → next/image AVIF + lazy
- [x] PLAN.md `13-02-hero-team-business-goals-next-image` — PERF-02 + PERF-03: hero/team/business-goals/showreel PNG → JPG-source + next/image (priority на hero, sizes по брейкпоинтам)
- [x] PLAN.md `13-03-cleanup-duplicate-assets` — PERF-05: dedup `figma/footer-1440/` × `9050-...` × `blog/...`, удалить per-breakpoint PNG копии (rectangle75, hero-image, team), удалить bundled video fallback; `/public/assets` 26 MB

**Success criteria:**
1. Mobile home Image bytes < 800 KB (было 2810 KB)
2. Mobile home LCP < 2.5s (было 6.2s), desktop LCP < 1.0s
3. Hero рендерится через `next/image` с `priority` + явным `sizes` атрибутом, AVIF возвращается на Accept-AVIF
4. `/public/assets` < 60 MB, нет дубликатов одного файла в нескольких директориях
5. Visual regression: все 5 брейкпоинтов (360/480/768/1024/1440) выглядят как раньше — Playwright screenshots passing

**UI hint:** yes

---

### Phase 14: Cache & Delivery Layer (P0) ✅

**Goal:** Static `/assets/*` отдаются с `immutable max-age=31536000` чтобы next/image-оптимизированные ответы и raw-fallback кешировались год. Repeat-visit FCP < 0.5s.

**Requirements covered:** PERF-04

**Depends on:** Phase 13 (immutable должен срабатывать на оптимизированных URL — fingerprinted via next/image query — иначе ломаем deploy invalidation)

**Plans:**
- [x] PLAN.md `14-01-static-cache-headers` — PERF-04: `headers()` в `next.config.ts` для `/assets/:path*`; local production smoke confirms immutable cache, demo smoke pending deploy.

**Success criteria:**
1. `curl -I https://demo.soloproduction.pro/assets/...` возвращает `cache-control: public, max-age=31536000, immutable`
2. `_next/image` оптимизированные ответы кешируются (fresh local smoke: `max-age=31536000` → CDN-friendly)
3. Repeat-visit FCP на mobile home < 0.5s (PSI repeat-view)
4. Deploy инвалидирует кеш через изменение пути (next/image query) или Traefik label rotate — не оставляет stale assets

---

### Phase 15: Payload Media Optimization (P0.5)

**Goal:** Payload Media collection генерирует resized AVIF/WebP variants на upload, все рендеры Payload media идут через `next/image` с правильным `sizes`.

**Requirements covered:** PERF-10, PERF-11

**Depends on:** Nothing structural (изолировано от static media). Идёт после Phase 13/14 чтобы не конкурировать за LCP оптимизации.

**Plans:**
- [x] PLAN.md `15-01-payload-media-imagesizes` — PERF-10: `imageSizes` config в `src/cms/collections/media.ts` (`card-360`, `card-768`, `card-1440`, `hero-1440`), formatOptions AVIF/WebP, regenerate-command для существующих uploads
- [x] PLAN.md `15-02-payload-renders-next-image-audit` — PERF-11: audit cases / secrets-posts / future leads attachments — все через `next/image` с `sizes` атрибутом, 0 raw `<img>` для Payload media

**Success criteria:**
1. Upload в Payload Admin генерирует AVIF + WebP в 4+ размерах автоматически
2. `cases` и `secrets-posts` рендеры используют `next/image` с правильным `sizes` атрибутом (per-breakpoint)
3. Старые загруженные media regenerated через CLI command (документировано)
4. PayloadAdmin upload UX не сломан — preview грузится, fields validation работает

---

### Phase 16: Bundle & Fonts (P1) ✅

**Goal:** Снизить вес fonts с 693 KB до ≤ 350 KB (woff2 + RU/EN subset), unused JS с 86 KB до < 30 KB, console errors → 0.

**Requirements covered:** PERF-06, PERF-07, PERF-08

**Depends on:** Phase 13 (LCP исправлен — теперь fonts/JS становятся следующим bottleneck)

**Plans:**
- [x] PLAN.md `16-01-fonts-woff2-subset` — PERF-06: TTF → woff2 + RU/EN subsetting через `next/font/local`, no visual regression
- [x] PLAN.md `16-02-bundle-analyzer-dynamic-imports` — PERF-07 + PERF-08: `@next/bundle-analyzer` integration, dynamic import для consultation/tg-popup модалок, production mobile console smoke чистый

**Success criteria:**
1. Total fonts weight ≤ 350 KB (было 693 KB), Cyrillic + Latin рендерятся идентично
2. Unused JS < 30 KB (было 86 KB) по PSI report — final deployed confirmation in Phase 19
3. Console на mobile home — 0 errors в local production smoke; LH audit confirmation in Phase 19
4. `next build && pnpm analyze` доступен как dev-команда (не падает локально)

---

### Phase 17: Video Lazy Loading (P1) ✅

**Goal:** Локальный `bts-ozon.mp4` не предзагружается на mobile, грузится lazy после scroll/interaction. Внешний хостинг не используется в v1.2: видео должно оставаться локальным.

**Requirements covered:** PERF-09

**Depends on:** Nothing (изолировано). Можно параллельно с Phase 16.

**Plans:**
- [x] PLAN.md `17-01-video-lazy-poster` — PERF-09: локальный `/assets/video/bts-ozon.mp4`, `preload="none"`, no initial mobile request, load after scroll + intersection

**Success criteria:**
1. На mobile home `bts-ozon.mp4` НЕ грузится при initial pageload (Network tab — 0 bytes)
2. Виден placeholder/poster в месте видео до взаимодействия
3. Клик/scroll-into-view → видео начинает грузиться
4. Решение про external host задокументировано: не используется, локальное видео является продуктовым требованием

**UI hint:** yes

---

### Phase 18: A11y & SEO Hygiene (P2) ✅

**Goal:** Закрыть последние gap-ы Lighthouse — серый текст до WCAG AA 4.5:1, `/privacy` canonical + crawl decision.

**Requirements covered:** A11Y-01, SEO-01

**Depends on:** Nothing

**Plans:**
- [x] PLAN.md `18-01-a11y-contrast-seo-canonical` — A11Y-01 + SEO-01: AA-safe grey foregrounds, `/privacy` canonical + `index, follow`, sitemap entry

**Success criteria:**
1. Lighthouse a11y score на mobile home: 96 → 100 — final PSI confirmation in Phase 19
2. Lighthouse SEO на `/privacy`: 61 → 95+ — final PSI confirmation in Phase 19
3. `<link rel="canonical" href="https://demo.soloproduction.pro/privacy">` присутствует в `<head>`
4. Visual regression: серый текст читается на тёмном фоне (manual sverka 360+1440)

**UI hint:** yes

---

### Phase 19: Verification (cross-cutting) ✅

**Goal:** Подтвердить достижение целевых метрик из milestone goal через PSI rerun + закрепить regression guard E2E тестом.

**Requirements covered:** VERIFY-01, VERIFY-02

**Depends on:** ALL предыдущие фазы (13-18) завершены

**Plans:**
- [x] PLAN.md `19-01-psi-rerun-baseline` — VERIFY-01: PSI attempted; API quota-blocked, local production verification recorded in `.planning/research/AUDIT-PSI-v1.2-final.md`
- [x] PLAN.md `19-02-perf-smoke-e2e` — VERIFY-02: `tests/e2e/perf-smoke.spec.ts` fails if mobile initial weight > 1.5 MB or local MP4 loads initially

**Success criteria:**
1. Mobile `/` Perf ≥ 90, LCP < 2.5s, weight < 1.2 MB — official PSI blocked by quota; local transfer 901 KB
2. Desktop `/` Perf ≥ 95, LCP < 1.0s — official PSI blocked by quota
3. Mobile/Desktop `/privacy` Perf ≥ 90, SEO ≥ 95 — official PSI blocked by quota; local SEO metadata verified
4. `pnpm test:e2e:perf` passes
5. AUDIT-PSI-v1.2-final.md фиксирует local verification + external PSI blocker

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
