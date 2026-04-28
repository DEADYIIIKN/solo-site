# Performance Audit — v1.2 baseline

**Date:** 2026-04-28
**Tool:** PageSpeed Insights API + manual /public/assets inventory + curl HEAD on prod
**Target:** demo.soloproduction.pro

## Lighthouse scores (baseline)

| Page | Strategy | Perf | A11y | BP | SEO | LCP | TBT | FCP | SI |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | desktop | 90 | 100 | 92 | 100 | 1.2s | 120ms | 0.3s | 2.4s |
| `/` | mobile | **67** | 96 | 96 | 100 | **6.2s** | 130ms | 2.0s | 8.1s |
| `/privacy` | desktop | 99 | 95 | 96 | 61 | 1.0s | 30ms | 0.3s | 0.6s |
| `/privacy` | mobile | 74 | 100 | 100 | 61 | 5.4s | 50ms | 1.4s | 6.1s |

## Mobile home — bytes by type

```
Image     2810 KB  ← главный жирок (75% страницы)
Font       693 KB  ← 8 файлов TTF
Script     249 KB
Stylesheet  17 KB
Document    12 KB
TOTAL     3783 KB
```

## Top heavy assets

| Size | URL |
|---:|---|
| 912 KB | `/assets/figma/footer-1440/blog-card-3.jpg` |
| 895 KB | `/assets/figma/footer-1440/blog-card-1.jpg` |
| 649 KB | `/assets/figma/footer-1440/blog-card-2.jpg` |
| 105 KB | `/assets/figma/7830-philosophy-clients-1440/marquee-dark-d-i...png` |

## Cache headers (production)

```
GET /assets/figma/footer-1440/blog-card-1.jpg
cache-control: public, max-age=0   ← НЕТ КЭША
content-length: 916028
```

```
GET /_next/static/media/2d2dcc5c3fdc2743-s.p.ttf
cache-control: public, max-age=31536000, immutable   ← ПРАВИЛЬНО
content-length: 180068
```

## Next/Image optimizer test

```
GET /_next/image?url=%2Fassets%2Ffigma%2Ffooter-1440%2Fblog-card-1.jpg&w=750&q=75
Accept: image/avif,image/webp,*/*

content-type: image/avif
content-length: 73910      ← 916 KB → 73 KB = 12.4× compression
cache-control: public, max-age=60, must-revalidate
x-nextjs-cache: MISS
```

`/_next/image` работает в проде. Просто никто не использует.

## /public/assets inventory

```
PNG: 55 файлов / 44 MB  ← PNG для фото — главная ошибка
JPG: 47 файлов / 38 MB
SVG: 167 файлов / 1.2 MB
MP4:  1 файл  / 57 MB  (bts-ozon.mp4)
TOTAL: 141 MB
```

**Top: PNG-photos (должны быть JPG/AVIF):**
- `image.jpg` 3.2MB × 2 копий
- `rectangle75.png` 3.2MB × 3 копий (per-breakpoint директории 360/480/768)
- `hero-image.png` 2.9MB × 3 копий (1440-fresh, 9656-..., 9003-...)
- `team.png` 2.9MB
- `02-showreel.png` 2.9MB
- `image.png` 2.8MB

**Дубли** (одна и та же блог-карта в 3 директориях): `figma/footer-1440/`, `figma/9050-footer-...`, `blog/...`.

## Code-level findings

- `src/cms/collections/media.ts` — **нет `imageSizes` config**, Payload upload хранит только original. Все uploaded media грузятся в полный размер.
- `src/widgets/footer/model/footer.data.ts` — пути на blog-card-{1,2,3}.jpg, рендерятся как raw `<img>` или `bg-[url(...)]`
- 13 импортов `next/image` (cases / philosophy / preview) — точечно
- 7 raw `<img>` тегов (first-screen geo + cta — могут быть SVG/малые, не критично)

## Other findings

**Console errors (mobile home):**
- 3× `Failed to load resource: net::ERR_CONNECTION_FAILED` — источник неизвестен, надо найти

**A11y contrast (mobile home):**
- `<button>` с `text-[#9c9c9c]` 10-11px на тёмном фоне — ниже WCAG AA 4.5:1

**SEO (`/privacy`):**
- `is-crawlable: fail` (заблокирован для индексации — robots или meta noindex)
- Нет `<link rel="canonical">`

**Unused JS:**
- 38 KB / 50 KB в `chunks/7626-...`
- 28 KB / 52 KB в `chunks/app/(site)/page-...`
- 20 KB / 44 KB в `chunks/7592-...`
- Total ~86 KB removable

## Targets v1.2

| Metric | Now | Target |
|---|---:|---:|
| Mobile home Perf | 67 | 90+ |
| Mobile home LCP | 6.2s | <2.5s |
| Mobile home weight | 3783 KB | <1200 KB |
| Mobile /privacy Perf | 74 | 90+ |
| Desktop home Perf | 90 | 95+ |
| Desktop home LCP | 1.2s | <1.0s |
| Repo /public/assets | 141 MB | <60 MB (после dedup + format conversion) |
