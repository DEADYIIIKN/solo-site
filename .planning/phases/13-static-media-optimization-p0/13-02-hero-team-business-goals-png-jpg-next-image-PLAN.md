---
phase: 13-static-media-optimization-p0
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - public/assets/figma/9656-first-screen-1440/hero-image.jpg
  - public/assets/figma/9656-team-what-we-do-1440/team.jpg
  - public/assets/figma/9656-business-goals-1440/rectangle75.jpg
  - public/assets/figma/11972-showreel-1440/02-showreel.jpg
  - public/assets/figma/8969-what-we-do-card-traffic-1440/image.jpg
  - src/widgets/first-screen/model/first-screen.data.ts
  - src/widgets/first-screen/ui/first-screen-hero-1440.tsx
  - src/widgets/first-screen/ui/first-screen-hero-1024.tsx
  - src/widgets/first-screen/ui/first-screen-hero-768.tsx
  - src/widgets/first-screen/ui/first-screen-hero-480.tsx
  - src/widgets/first-screen/ui/first-screen-hero-360.tsx
  - src/widgets/team/model/team.data.ts
  - src/widgets/team/ui/*.tsx
  - src/widgets/business-goals/model/business-goals.data.ts
  - src/widgets/business-goals/ui/*.tsx
  - src/widgets/showreel/ui/*.tsx
  - package.json
autonomous: false
requirements: [PERF-02, PERF-03]
must_haves:
  truths:
    - "Hero image на главной отдаётся как AVIF с priority + fetchpriority=high"
    - "Mobile home LCP < 3.5s после deploy (полный target 2.5s — после phase 14 cache)"
    - "Один JPG-исходник на все 5 breakpoints для каждого ассета (hero/team/business-goals/showreel)"
    - "Все рендеры above-the-fold heavy media используют next/image (0 raw img / bg-url для PNG-photo)"
  artifacts:
    - path: "public/assets/figma/9656-first-screen-1440/hero-image.jpg"
      provides: "JPG исходник hero (заменяет PNG 2940 KB)"
    - path: "src/widgets/first-screen/ui/first-screen-hero-1440.tsx"
      provides: "next/image render с priority + sizes"
      contains: "priority"
  key_links:
    - from: "first-screen-hero-*.tsx"
      to: "/_next/image?url=...hero-image.jpg"
      via: "next/image with priority"
      pattern: "priority|fetchpriority"
    - from: "business-goals/team/showreel components"
      to: "/_next/image?url=...&w=..."
      via: "next/image with sizes"
      pattern: "import Image from \"next/image\""
---

# Plan 13-02: Hero / team / business-goals / showreel — PNG → JPG + next/image

**Phase:** 13 — Static Media Optimization (P0)
**REQ-IDs:** PERF-02, PERF-03
**Depends on:** none (parallel с 13-01, files_modified не пересекаются)
**Status:** ready

<objective>
Конвертировать heavy PNG-photo (~15 MB суммарно) в JPG quality 90, заменить все raw `<img>` / `bg-[url(...)]` на `next/image`, hero получает `priority` для LCP. После — удалить per-breakpoint дубликаты PNG (один JPG на все 5 viewports, srcset делает next/image).
</objective>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/research/AUDIT-PSI.md
@.planning/phases/13-static-media-optimization-p0/13-CONTEXT.md
@src/widgets/first-screen/model/first-screen.data.ts
@src/widgets/business-goals/model/business-goals.data.ts
@src/widgets/team/model/team.data.ts
@src/widgets/cases/ui/cases-section-1440.tsx
@next.config.ts

<interfaces>
Текущие пути (PNG, будут заменены):
```ts
// first-screen.data.ts
heroImage: "/assets/figma/9656-first-screen-1440/hero-image.png"     // 2940 KB
heroImage: "/assets/figma/9003-hero-screen-1024/hero-image.png"      // duplicate
// business-goals.data.ts (3 копии одного содержимого)
mobile768CardTraffic: "/assets/figma/11947-business-goals-768/rectangle75.png"
mobile480CardTraffic: "/assets/figma/11323-business-goals-480/rectangle75.png"
mobile360CardTraffic: "/assets/figma/10547-business-goals-360/rectangle75.png"
// team.data.ts
teamPhoto: "/assets/figma/9656-team-what-we-do-1440/team.png"        // 2984 KB
```

Целевые пути после конверсии (один JPG-исходник):
```ts
heroImage: "/assets/figma/9656-first-screen-1440/hero-image.jpg"
businessGoalsCardTraffic: "/assets/figma/9656-business-goals-1440/rectangle75.jpg"
teamPhoto: "/assets/figma/9656-team-what-we-do-1440/team.jpg"
showreelPoster: "/assets/figma/11972-showreel-1440/02-showreel.jpg"
```

Hero-pattern (PERF-03) — взять из cases-section-1440.tsx, добавить priority:
```tsx
<Image
  alt=""
  className="object-cover"
  fill
  priority
  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 100vw, 50vw"
  src={heroImage}
/>
```
Below-fold секции (team/business-goals/showreel) — `loading="lazy"`, БЕЗ `priority`.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Конвертировать PNG → JPG (sharp), создать единые исходники, обновить data-файлы</name>
  <files>
    package.json,
    public/assets/figma/9656-first-screen-1440/hero-image.jpg,
    public/assets/figma/9656-team-what-we-do-1440/team.jpg,
    public/assets/figma/9656-business-goals-1440/rectangle75.jpg,
    public/assets/figma/11972-showreel-1440/02-showreel.jpg,
    public/assets/figma/8969-what-we-do-card-traffic-1440/image.jpg,
    src/widgets/first-screen/model/first-screen.data.ts,
    src/widgets/business-goals/model/business-goals.data.ts,
    src/widgets/team/model/team.data.ts
  </files>
  <action>
    1. Добавить `sharp` как devDependency: `pnpm add -D sharp` (скорее всего уже транзитивная — Next.js использует, но явно нужен для CLI скрипта).
    2. Создать одноразовый скрипт `scripts/convert-png-to-jpg.mjs` (можно удалить после execution или оставить для регенерации):
       ```js
       import sharp from "sharp";
       const tasks = [
         ["public/assets/figma/9656-first-screen-1440/hero-image.png",        "public/assets/figma/9656-first-screen-1440/hero-image.jpg"],
         ["public/assets/figma/9656-team-what-we-do-1440/team.png",           "public/assets/figma/9656-team-what-we-do-1440/team.jpg"],
         ["public/assets/figma/10547-business-goals-360/rectangle75.png",     "public/assets/figma/9656-business-goals-1440/rectangle75.jpg"],
         ["public/assets/figma/11972-showreel-768/02-showreel.png",           "public/assets/figma/11972-showreel-1440/02-showreel.jpg"],
       ];
       for (const [src, dst] of tasks) {
         await sharp(src).jpeg({ quality: 90, mozjpeg: true }).toFile(dst);
         console.log(`✓ ${dst}`);
       }
       ```
       Запустить: `node scripts/convert-png-to-jpg.mjs`. Ожидаемые размеры: ~600-900 KB JPG (было 2.9 MB PNG).
    3. Для `8969-what-we-do-card-traffic-image-1024/image.jpg` — уже JPG, но 3.2 MB. Перекодировать с quality 85 → новый файл `8969-what-we-do-card-traffic-1440/image.jpg`.
    4. Обновить data-файлы:
       - `first-screen.data.ts`: `heroImage` обоих breakpoint-конфигов → `"/assets/figma/9656-first-screen-1440/hero-image.jpg"`.
       - `business-goals.data.ts`: убрать `mobile768/480/360CardTraffic`, добавить единый `cardTraffic: "/assets/figma/9656-business-goals-1440/rectangle75.jpg"`. Если эти ключи используются в business-goals UI — заменить refs на `cardTraffic`.
       - `team.data.ts`: `teamPhoto` → `.jpg` путь.
    5. Обновить refs в `business-goals/ui/*.tsx` если зависят от удалённых ключей.
  </action>
  <verify>
    <automated>node scripts/convert-png-to-jpg.mjs && ls -la public/assets/figma/9656-first-screen-1440/hero-image.jpg public/assets/figma/9656-team-what-we-do-1440/team.jpg public/assets/figma/9656-business-goals-1440/rectangle75.jpg public/assets/figma/11972-showreel-1440/02-showreel.jpg && pnpm tsc --noEmit</automated>
  </verify>
  <done>
    JPG исходники созданы (по одному на ассет), data-файлы указывают на новые JPG, ts compiles, business-goals/team/first-screen UI компилируется без ошибок.
  </done>
</task>

<task type="auto">
  <name>Task 2: Hero — next/image с priority + sizes на всех 5 breakpoints (PERF-03)</name>
  <files>
    src/widgets/first-screen/ui/first-screen-hero-1440.tsx,
    src/widgets/first-screen/ui/first-screen-hero-1024.tsx,
    src/widgets/first-screen/ui/first-screen-hero-768.tsx,
    src/widgets/first-screen/ui/first-screen-hero-480.tsx,
    src/widgets/first-screen/ui/first-screen-hero-360.tsx
  </files>
  <action>
    1. В каждом из 5 first-screen-hero-{N}.tsx найти текущий рендер heroImage (raw `<img>` или `style={{ backgroundImage: \`url(\${heroImage})\` }}`) — заменить на `next/image`:
       ```tsx
       import Image from "next/image";
       ...
       <div className="relative ...existing classes...">
         <Image
           alt=""
           className="object-cover"
           fill
           priority
           sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1440px"
           src={heroImage}
         />
       </div>
       ```
    2. Контейнер должен быть `relative` с явной высотой/aspect-ratio (если был background-image — добавить `relative` обёртку с теми же размерами).
    3. **CRITICAL:** `priority` — ТОЛЬКО на hero (above-the-fold главной). НЕ ставить на team/business-goals/showreel.
    4. Не трогать другие `<img>` в hero компонентах (geo, glow, cta — это SVG / малые декоративные).
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint src/widgets/first-screen/ui/first-screen-hero-*.tsx</automated>
  </verify>
  <done>
    Все 5 hero вариантов используют next/image с `priority` + явным `sizes`, ts/lint passing.
  </done>
</task>

<task type="auto">
  <name>Task 3: Team / business-goals / showreel — next/image lazy на всех breakpoints (PERF-02)</name>
  <files>
    src/widgets/team/ui/*.tsx,
    src/widgets/business-goals/ui/*.tsx,
    src/widgets/showreel/ui/*.tsx
  </files>
  <action>
    1. Найти все рендеры `teamPhoto`, `cardTraffic` (бывш. mobile{360/480/768}CardTraffic), showreel poster — заменить raw `<img>` / `bg-[url(...)]` на `<Image>`.
    2. Паттерн (без priority, lazy):
       ```tsx
       <Image
         alt=""
         className="object-cover"
         fill
         sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
         src={teamPhoto}
         loading="lazy"
       />
       ```
       `sizes` подбирать per-component по фактическому layout. Если карточка фикс. ширины N px — `sizes="Npx"`.
    3. Если контейнер был `style={{ backgroundImage: ... }}` — заменить на `<div className="relative ...">  <Image fill ... /> </div>`.
    4. Business-goals: после удаления per-breakpoint полей (Task 1) — рендеры всех 5 breakpoint-вариантов используют единый `cardTraffic`. Это OK — next/image отдаёт правильный размер по `sizes`.
    5. Showreel: poster image в `showreel.tsx` / `showreel-morph-overlay.tsx` (если используется как preview) → next/image lazy.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint src/widgets/team src/widgets/business-goals src/widgets/showreel</automated>
  </verify>
  <done>
    0 raw `<img>` для team.jpg / rectangle75.jpg / 02-showreel.jpg в коде, все рендерятся через next/image lazy, ts/lint passing.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>JPG-конверсия heavy PNG-photo + next/image рендеры с priority на hero (PERF-03), lazy на остальных секциях (PERF-02). Один исходник на все 5 breakpoints — next/image отдаёт responsive srcset.</what-built>
  <how-to-verify>
    1. `pnpm dev` → открыть `/` → DevTools Network → проверить:
       - hero-image грузится как `_next/image?url=...hero-image.jpg&w=...` content-type avif/webp, есть `fetchpriority="high"` на img-теге (Elements tab)
       - team / business-goals / showreel грузятся lazy при скролле, content-type avif/webp
    2. Lighthouse в DevTools локально (mobile, throttled): LCP element = hero image, метрика < 3.5s.
    3. Визуально 360 / 480 / 768 / 1024 / 1440 — все секции выглядят как раньше, нет пустых блоков, нет растянутых картинок.
    4. После deploy на demo: PSI mobile home → LCP падает с 6.2s до < 3.5s, Image bytes < 1200 KB (было 2810 KB).
  </how-to-verify>
  <resume-signal>Type "approved" если ОК, иначе опиши issues.</resume-signal>
</task>

</tasks>

<verification>
- PNG → JPG конверсия выполнена sharp quality 90, размер каждого JPG < 1 MB
- 5 hero-вариантов: next/image + priority + sizes
- team/business-goals/showreel: next/image + lazy + sizes (без priority)
- 0 raw `<img>` / `bg-[url(...)]` для heavy PNG-photo в src/
- ts + lint passing
- PSI mobile home LCP < 3.5s, Image bytes < 1200 KB
</verification>

<success_criteria>
- Mobile home Image bytes: 2810 KB → < 1000 KB
- Mobile home LCP: 6.2s → < 3.5s (full < 2.5s достигается после Phase 14 cache)
- Hero рендерит через next/image с priority+sizes на всех 5 viewports
- Один JPG-исходник на все breakpoints для hero/team/business-goals/showreel
</success_criteria>

<output>
После завершения создать `.planning/phases/13-static-media-optimization-p0/13-02-SUMMARY.md` с before/after PSI numbers, list of converted files, list of refactored components.
</output>
