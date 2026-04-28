# Phase 13: Static Media Optimization (P0) — Context

**Gathered:** 2026-04-28
**Status:** Ready for planning
**Source:** REQUIREMENTS.md + AUDIT-PSI.md (audit-driven, no separate discuss-phase)

<domain>
## Phase Boundary

Перевести **статические** медиа (всё что лежит в `/public/assets/`) на оптимизированную доставку через Next.js Image API. Включает:

1. Footer blog-cards (3 файла, 2.4 MB) — сейчас raw paths
2. Hero / team / business-goals PNG-photos (несколько файлов по 2.9–3.2 MB, плюс per-breakpoint дубликаты)
3. Hero `priority` для LCP
4. Cleanup дубликатов в `/public/assets`

**Не входит:** Payload-uploaded media (PERF-10/11 → Phase 15), кэш-хедеры (PERF-04 → Phase 14), шрифты/bundle (PERF-06/07 → Phase 16), видео (PERF-09 → Phase 17).

</domain>

<decisions>
## Implementation Decisions

### Подход к next/image

- **Использовать встроенный** `/_next/image` оптимизатор. Проверено в проде на блог-карте: 916 KB JPG → 73 KB AVIF при `?w=750&q=75`. AVIF/WebP уже включены в `next.config.ts`.
- `<Image>` компонент next.js — обязательный для всех PERF-01/02/03 кейсов. Никаких raw `<img>` для растровых медиа.
- Свойство `priority` — **только** на hero (above-the-fold), всё остальное `loading="lazy"`.
- Свойство `sizes` — обязательное для responsive layouts. Per-breakpoint точки: `(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw` (или specific для конкретного компонента).

### Источники изображений

- PNG-photo источники (rectangle75.png, hero-image.png, team.png) **конвертируем в JPG** на диске (PNG → JPG quality 90 через `sharp`/`squoosh`). Next.js затем сам отдаёт AVIF/WebP клиенту.
- AVIF-конверсия делается next/image **на лету**, на диске исходники — обычные JPG/PNG.

### Per-breakpoint дубликаты

- Удаляем дубликаты `figma/10547-business-goals-360/`, `11323-business-goals-480/`, `11947-business-goals-768/` — оставляем **один** исходник (например 1440 версию). Next.js сам выдаст 360/480/768 ширины через srcset.
- Аналогично hero: `9656-first-screen-1440/`, `9003-hero-screen-1024/`, `1440-fresh/` — один источник.
- Все компоненты per-breakpoint (мы их не трогаем как структуру) указывают на тот же файл.

### Footer blog cards

- Источник для blog-card-1/2/3 — `figma/footer-1440/` (используется в `widgets/footer/model/footer.data.ts`).
- Дубликаты в `figma/9050-...`, `figma/9052-...`, `blog/...` удалить.
- Поскольку footer ниже fold-а — обязательно `loading="lazy"`.

### Hero LCP optimization

- Hero на главной — конкретный компонент: `widgets/first-screen/ui/first-screen-hero-1440.tsx` + per-breakpoint аналоги.
- Поставить `priority` (включает `fetchpriority="high"` + preload).
- `sizes` через media queries, чтобы mobile получал минимальный размер.
- Цель: mobile LCP < 2.5s, desktop LCP < 1.0s.

### Cleanup boundary

- Удаляем только **подтверждённые дубликаты** (одинаковый контент, разные пути). НЕ удаляем уникальные файлы которые могут быть нигде не использованы — это отдельная задача.
- Перед удалением проверяем `grep -r "<filepath>"` чтобы убедиться что файл нигде не ссылается.
- Цель: `/public/assets` <  60 MB (сейчас 141 MB).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit & metrics
- `.planning/research/AUDIT-PSI.md` — Lighthouse baseline + media inventory + cache headers + код-уровневые находки

### Requirements
- `.planning/REQUIREMENTS.md` — PERF-01 / PERF-02 / PERF-03 / PERF-05 (полные тексты)
- `.planning/ROADMAP.md` — Phase 13 goal + plans breakdown

### Project conventions
- `.planning/PROJECT.md` — stack lock, per-breakpoint pattern, browser support matrix (Safari 16+ для AVIF)
- `next.config.ts` — `images.formats: ["image/avif","image/webp"]` уже включены

### Existing examples next/image (что копировать)
- `src/widgets/cases/ui/cases-section-1440.tsx` — пример next/image с priority + sizes
- `src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx` — пример next/image для marquee

</canonical_refs>

<specifics>
## Specific Ideas

### PSI baseline (что меряем)
| Page | Strategy | Perf | LCP |
|---|---|---:|---:|
| `/` | mobile | 67 | 6.2s |
| `/` | desktop | 90 | 1.2s |
| `/privacy` | mobile | 74 | 5.4s |
| `/privacy` | desktop | 99 | 1.0s |

После phase 13: target mobile home Perf 80+, LCP <3.5s (полные 90/2.5s достигаются после phase 14 immutable cache).

### Известные тяжёлые ассеты (приоритет конверсии)
1. `figma/footer-1440/blog-card-{1,2,3}.jpg` — 912/895/649 KB (PERF-01)
2. `figma/9656-first-screen-1440/hero-image.png` — 2940 KB (PERF-02)
3. `figma/9656-team-what-we-do-1440/team.png` — 2984 KB (PERF-02)
4. `figma/8969-what-we-do-card-traffic-image-1024/image.jpg` — 3172 KB (PERF-02)
5. `figma/{10547,11323,11947}-business-goals-{360,480,768}/rectangle75.png` — 3 × 3172 KB дубликаты (PERF-02 + PERF-05)
6. `figma/11972-showreel-768/02-showreel.png` — 2940 KB (PERF-02)

### Тестирование
- Vitest unit-тесты не нужны (нет логики).
- E2E (Playwright) — добавлять не в этой фазе (regression guard в phase 19).
- Verification: `curl -I -H "Accept: image/avif" "https://demo.../_next/image?url=...&w=750&q=75"` → content-type: image/avif + content-length < orig × 0.2.
- Browser smoke на demo: открыть mobile devtools, проверить что footer blog cards грузятся как `.avif`.

</specifics>

<deferred>
## Deferred Ideas

- **Динамическое preloading** через `<link rel="preload" as="image">` для hero — может быть в phase 16.
- **Blur placeholder** (`placeholder="blur"`) — UX-улучшение, не блокирует target metrics.
- **Custom loader** для CDN — отложено в Out of Scope (Traefik+immutable достаточно).
- **Удаление неиспользуемых файлов** (не дубликатов) — отдельная задача после audit `grep -r`.

</deferred>

---

*Phase: 13-static-media-optimization-p0*
*Context gathered: 2026-04-28*
