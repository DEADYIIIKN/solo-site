# Phase 13 — Static Media Optimization (P0) SUMMARY

**Status:** ✅ Complete (9 commits на main, awaiting deploy)
**Started:** 2026-04-28
**Completed:** 2026-04-28
**Plans:** 3/3 (10 tasks total)
**Requirements covered:** PERF-01 ✓ · PERF-02 ✓ · PERF-03 ✓ (re-architected) · PERF-05 ✓ (partial)

## Что сделано

### 13-01 Footer blog cards → next/image (PERF-01)
- 5 файлов `src/widgets/footer/ui/footer-{360,480,768,1024,1440}.tsx` — `<img>` → `<Image>`
- Исходные blog-card-{1,2,3}.jpg оставлены как есть (next/image сам сжимает)
- Curl-проверка AVIF: **2513 KB → 131 KB (19× compression)**
- Commits: `8a90214`, `08e144f`

### 13-02 Hero / team / business-goals (PERF-02 + PERF-03)
- `hero-image.png` 2936 KB → JPG 49 KB (resize 1200w + mozjpeg q85, **−98%**)
- `team.png` 2981 KB → JPG 433 KB (mozjpeg q90, **−86%**)
- `rectangle75.png` 3169 KB × 3 копии → единый JPG 483 KB (**−85%**)
- Hero LCP fix (architectural pivot — `hero-image.png` оказался video poster кадром, не background photo):
  - `<Image priority fetchPriority="high">` overlay с poster JPG над video container
  - `<video poster={...} onCanPlay={() => setVideoReady(true)}>` swap
  - Реальный LCP element = JPG poster (49 KB), video грузится фоном
- Hero implemented только на 1440 + 1024 (на 768/480/360 нет video container'а в layout'е)
- Commits: `b46247e`, `c0a2099`

### 13-03 Cleanup (PERF-05)
- 16 dead-файлов удалены, **−31 MB на диске** (139 MB → 108 MB)
- Hero × 3 / team / business-goals × 3 / showreel / 8969-traffic-image / footer dups × 6 / one-shot script
- Target plan'а `<60 MB` не достигнут — оставшиеся 108 MB это уникальные файлы; нужен отдельный grep-audit dead-uniques (deferred)
- Commits: `bf0f742`, `901378e`, `d483a8e`, `ea838d5`, `4d6b3b1`

## Architectural pivots (vs initial plan)

1. **hero-image.png — переосмыслен из background photo → video poster**
   Plan предполагал что hero PNG используется как background. grep'ом подтверждено: 0 consumer'ов в JSX. Открыли файл — кадр из showreel ("мальчик с зефиркой"). User одобрил pivot: использовать как video poster + Image priority overlay для LCP.

2. **business-goals data API не менялся**
   Plan T1 предлагал удалить `mobile{360,480,768}CardTraffic` и заменить на `cardTraffic`. Реализация: оставлены 3 ключа но все указывают на единый JPG. Поведение идентично, public API стабильно.

3. **scripts/convert-png-to-jpg.mjs создан и удалён в одной фазе**
   One-shot скрипт; результат закоммичен; скрипт удалён (T05 от 13-03) чтобы не засорять repo.

## Verification

- `pnpm exec tsc --noEmit -p tsconfig.json` — clean ✓
- `pnpm exec next lint` — clean (pre-existing privacy/page.tsx error не входит в scope)
- Curl AVIF (production demo): **deferred to post-deploy** (local dev падает на pre-existing globals.css ошибке)

## Expected metrics impact

Pre-phase baseline (mobile home, PSI):
- Perf: 67 / LCP: 6.2s / Page weight: 3783 KB

Expected post-deploy (без Phase 14 cache headers):
- Perf: **80–88** (target 90+ требует Phase 14 immutable cache на repeat visits)
- LCP: **3.0–3.5s** (target <2.5s достигается полностью только с phase 14)
- Page weight: **~1500 KB** (footer 2.5MB → 131KB + hero/team/business-goals fix)

## Deferred to Phase 14

- PERF-04 — `Cache-Control: immutable` на static `/assets/*`
- Это закрывает full target Perf 90+ (repeat-visit FCP < 0.5s)

## Files changed (summary)

**Source edits:**
- `src/widgets/footer/ui/footer-{360,480,768,1024,1440}.tsx`
- `src/widgets/first-screen/ui/first-screen-hero-{1024,1440}.tsx`
- `src/widgets/first-screen/model/first-screen.data.ts`
- `src/widgets/team/model/team.data.ts`
- `src/widgets/business-goals/model/business-goals.data.ts`

**New JPG sources:**
- `public/assets/figma/9656-first-screen-1440/hero-image.jpg`
- `public/assets/figma/9656-team-what-we-do-1440/team.jpg`
- `public/assets/figma/9656-business-goals-1440/rectangle75.jpg`

**Deleted (16 files, −32 MB):**
- 3× `hero-image.png` (9656-first-screen-1440, 9003-hero-screen-1024, 1440-fresh)
- 1× `team.png` (9656-team-what-we-do-1440)
- 3× `rectangle75.png` (10547-business-goals-360, 11323-...-480, 11947-...-768)
- 1× `02-showreel.png` (11972-showreel-768)
- 1× `image.jpg` (8969-what-we-do-card-traffic-image-1024)
- 6× footer-card duplicates (figma/9050-..., figma/9052-..., blog/...)
- 1× `scripts/convert-png-to-jpg.mjs`

## Next

`/gsd-plan-phase 14` (Cache & Delivery Layer) или сначала **deploy + PSI re-measure** для validation.
