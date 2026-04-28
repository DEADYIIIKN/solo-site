# Milestone v1.2 Requirements — Performance & Delivery

**Started:** 2026-04-28
**Goal:** Lighthouse Perf 90+ на всех брейкпоинтах для `/` и `/privacy`. Mobile LCP < 2.5s, desktop LCP < 1.0s. Снизить mobile home weight с 3.8 MB до < 1.2 MB. Все статические и Payload-uploaded медиа автоматически отдаются в AVIF/WebP с правильным размером per-device.

**Source of truth:** `.planning/research/AUDIT-PSI.md` (PageSpeed Insights baseline + media inventory)

---

## v1 Requirements

### Performance — Static Media (P0)

- [x] **PERF-01**: Footer blog cards рендерятся через `next/image` с AVIF и lazy-loading. Текущий вес 2.4 MB (3 файла) → ожидаемый ~250 KB. LCP не блокируется.
- [x] **PERF-02**: Hero / team / business-goals / showreel PNG-photos конвертированы в JPG исходники + рендерятся через `next/image` (AVIF). Дубликаты per-breakpoint удалены — `next/image` отдаёт responsive srcset из одного исходника.
- [x] **PERF-03**: Hero image на главной — `priority` prop + явный `sizes`. Mobile LCP < 2.5s, desktop LCP < 1.0s (измеряется PSI).
- [x] **PERF-04**: Static `/assets/*` отдаются с `Cache-Control: public, max-age=31536000, immutable`. Решение: либо `headers()` в next.config, либо Traefik labels. Repeat-visit FCP < 0.5s.
- [x] **PERF-05**: Cleanup: удалены дубликаты медиа в `/public/assets/figma/footer-1440/`, `/public/assets/figma/9050-...`, `/public/assets/blog/...`. Phase 13 довела `/public/assets` до 26 MB; Phase 17 вернула локальный video по продукт-требованию, поэтому общий inventory снова выше 60 MB, но initial page weight защищён lazy-load.

### Performance — Payload Media (P0.5)

- [x] **PERF-10**: `Media` collection в Payload получает `imageSizes` config (как минимум: `card-360`, `card-768`, `card-1440`, `hero-1440`). Upload автоматически генерирует resized variants. Старые загруженные media — миграция/regenerate command.
- [x] **PERF-11**: Все рендеры Payload media (cases, secrets-posts, future leads attachments) идут через `next/image` с правильным `sizes` атрибутом. Audit нашёл 0 raw `<img>` для Payload media — нет регрессии.

### Performance — Bundle & Fonts (P1)

- [x] **PERF-06**: Шрифты переведены с TTF на woff2 + RU/EN subsetting через `next/font/local`. Total fonts weight 680 KB → ≤ 350 KB. Нет визуальной регрессии (Cyrillic + Latin рендерятся как раньше).
- [x] **PERF-07**: `@next/bundle-analyzer` интегрирован. Unused JS уменьшен локально через dynamic imports тяжёлых модалок (consultation, tg-popup); финальное PSI-подтверждение < 30 KB — Phase 19.
- [x] **PERF-08**: 3× `ERR_CONNECTION_FAILED` в console на главной — локальный production smoke чист. Console на mobile home: 0 errors / 0 failed requests; LH audit confirmation — Phase 19.
- [x] **PERF-09**: Локальный `bts-ozon.mp4` грузится lazy. На мобайле не предзагружается при initial pageload; начинает запрашиваться после scroll toward showreel. External host не используется в v1.2 по продукт-требованию.

### A11y / SEO (P2)

- [x] **A11Y-01**: Серый foreground text в footer/privacy/levels приведён к WCAG AA contrast 4.5:1. Lighthouse a11y score final confirmation — Phase 19.
- [x] **SEO-01**: `/privacy` имеет `<link rel="canonical">`, `index, follow` и sitemap entry. Lighthouse SEO final confirmation — Phase 19.

### Verification (cross-cutting)

- [ ] **VERIFY-01**: PSI audit повторно запущен после всех фаз. Все 4 страницы (`/` × `/privacy` × mobile + desktop) достигают целевых метрик из таблицы выше.
- [ ] **VERIFY-02**: E2E тест `tests/e2e/perf-smoke.spec.ts` падает если total page weight > 1.5 MB на mobile (regression guard).

---

## Out of Scope (deferred)

| Item | Reason | Where |
|---|---|---|
| Sentry / error tracking | Reliability — отдельный milestone | future v1.3 |
| Yandex Metrica / Google Analytics + conversion goals | Analytics — отдельный milestone | future v1.3 |
| Custom CDN (Cloudflare / Bunny) | Traefik + immutable headers покрывают текущий traffic | future v2.x |
| Sitemap.xml / structured data | SEO — отдельный milestone | future v1.3 |
| Custom 404 page | Polish — не блокирует perf | future v1.3 |
| Apple HEIC support | AVIF покрывает 95% кейсов | n/a |
| ISR / cache invalidation strategy | Static + payload-data — sufficient на текущей нагрузке | future v2.x |

---

## Traceability

| REQ-ID | Phase | Status |
|---|---|---|
| PERF-01 | Phase 13 — Static Media Optimization | Complete |
| PERF-02 | Phase 13 — Static Media Optimization | Complete |
| PERF-03 | Phase 13 — Static Media Optimization | Complete locally; final PSI in Phase 19 |
| PERF-05 | Phase 13 — Static Media Optimization | Complete |
| PERF-04 | Phase 14 — Cache & Delivery Layer | Complete locally; demo smoke pending deploy |
| PERF-10 | Phase 15 — Payload Media Optimization | Complete locally; existing upload apply command documented |
| PERF-11 | Phase 15 — Payload Media Optimization | Complete locally |
| PERF-06 | Phase 16 — Bundle & Fonts | Complete locally |
| PERF-07 | Phase 16 — Bundle & Fonts | Complete locally; final PSI in Phase 19 |
| PERF-08 | Phase 16 — Bundle & Fonts | Complete locally; final Lighthouse console audit in Phase 19 |
| PERF-09 | Phase 17 — Video Lazy Loading | Complete locally |
| A11Y-01 | Phase 18 — A11y & SEO Hygiene | Complete locally; final Lighthouse in Phase 19 |
| SEO-01 | Phase 18 — A11y & SEO Hygiene | Complete locally; final Lighthouse in Phase 19 |
| VERIFY-01 | Phase 19 — Verification | Pending |
| VERIFY-02 | Phase 19 — Verification | Pending |

**Coverage:** 15/15 requirements mapped (13 v1 features + 2 verify) ✓
