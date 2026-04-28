---
phase: 13-static-media-optimization-p0
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/widgets/footer/ui/footer-360.tsx
  - src/widgets/footer/ui/footer-480.tsx
  - src/widgets/footer/ui/footer-768.tsx
  - src/widgets/footer/ui/footer-1024.tsx
  - src/widgets/footer/ui/footer-1440.tsx
autonomous: true
requirements: [PERF-01]
must_haves:
  truths:
    - "Footer blog cards грузятся как AVIF (Accept: image/avif) на demo"
    - "Total bytes 3 footer blog cards < 300 KB на mobile (было 2456 KB raw JPG)"
    - "Footer blog cards lazy-loaded — не блокируют initial pageload и LCP"
    - "Все 5 breakpoints (360/480/768/1024/1440) визуально не сломаны"
  artifacts:
    - path: "src/widgets/footer/ui/footer-1440.tsx"
      provides: "next/image render для blog cards"
      contains: "next/image"
  key_links:
    - from: "src/widgets/footer/ui/footer-*.tsx"
      to: "/_next/image?url=...&w=...&q=75"
      via: "next/image runtime"
      pattern: "import Image from \"next/image\""
---

# Plan 13-01: Footer blog cards → next/image AVIF

**Phase:** 13 — Static Media Optimization (P0)
**REQ-IDs:** PERF-01
**Depends on:** none
**Status:** ready

<objective>
Заменить raw `<img>` теги для footer blog cards (3 файла, ~2.4 MB JPG) на `next/image` с lazy-loading и явным `sizes` атрибутом во всех 5 footer-вариантах. Получаем AVIF на лету через `/_next/image` (12× compression в проде, проверено).
</objective>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/phases/13-static-media-optimization-p0/13-CONTEXT.md
@src/widgets/footer/model/footer.data.ts
@src/widgets/footer/ui/footer-1440.tsx
@src/widgets/cases/ui/cases-section-1440.tsx

<interfaces>
Источник данных (footer.data.ts):
```ts
export const footerBlogPosts = [
  { id: 1, image: "/assets/figma/footer-1440/blog-card-1.jpg", titleParts: [...] },
  { id: 2, image: "/assets/figma/footer-1440/blog-card-2.jpg", titleParts: [...] },
  { id: 3, image: "/assets/figma/footer-1440/blog-card-3.jpg", titleParts: [...] },
] as const;
```

Текущий рендер (одинаковая структура во всех 5 footer-{N}.tsx):
```tsx
<div className="relative h-[270px] w-full overflow-hidden rounded-[12px]">
  <img alt="" className="absolute inset-0 size-full object-cover" height={270} src={post.image} width={480} />
</div>
```

Целевой паттерн (взять из cases-section-1440.tsx):
```tsx
<Image
  alt=""
  className="absolute inset-0 h-full w-full object-cover"
  fill
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 480px"
  src={post.image}
  loading="lazy"
/>
```
Контейнер уже `relative` с фикс. высотой → `fill` корректно работает.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Заменить raw img на next/image в footer-1440.tsx и footer-1024.tsx</name>
  <files>src/widgets/footer/ui/footer-1440.tsx, src/widgets/footer/ui/footer-1024.tsx</files>
  <action>
    1. Добавить `import Image from "next/image";` в оба файла.
    2. Найти блок blog cards (`{footerBlogPosts.map((post) => ...`) — заменить `<img alt="" className="absolute inset-0 size-full object-cover" height={270} src={post.image} width={480} />` на:
       ```tsx
       <Image
         alt=""
         className="object-cover"
         fill
         sizes="(max-width: 1024px) 50vw, 480px"
         src={post.image}
         loading="lazy"
       />
       ```
    3. Контейнер `<div className="relative h-[270px] w-full overflow-hidden rounded-[12px]">` уже подходит для `fill` (относительное позиционирование + фикс высота) — НЕ менять.
    4. Не трогать logo / arrows / tg-icon img-теги — это SVG/маленькие иконки, в scope только blog-cards.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint src/widgets/footer/ui/footer-1440.tsx src/widgets/footer/ui/footer-1024.tsx</automated>
  </verify>
  <done>
    next/image импортирован в обоих файлах, blog cards рендерятся через `<Image fill sizes=... loading="lazy">`, ts/lint passing.
  </done>
</task>

<task type="auto">
  <name>Task 2: Заменить raw img на next/image в footer-768.tsx, footer-480.tsx, footer-360.tsx</name>
  <files>src/widgets/footer/ui/footer-768.tsx, src/widgets/footer/ui/footer-480.tsx, src/widgets/footer/ui/footer-360.tsx</files>
  <action>
    1. Аналогично Task 1: добавить `import Image from "next/image";` в каждый файл.
    2. Заменить blog-card `<img>` на `<Image fill sizes="..." loading="lazy" />`.
    3. `sizes` per-breakpoint:
       - footer-768: `sizes="(max-width: 768px) 100vw, 480px"`
       - footer-480: `sizes="100vw"`
       - footer-360: `sizes="100vw"`
    4. Контейнер с `relative` + фикс. высотой не менять.
  </action>
  <verify>
    <automated>pnpm tsc --noEmit && pnpm lint src/widgets/footer/ui/footer-768.tsx src/widgets/footer/ui/footer-480.tsx src/widgets/footer/ui/footer-360.tsx</automated>
  </verify>
  <done>
    Все 3 mobile/tablet footers рендерят blog cards через next/image, ts/lint passing.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>5 footer вариантов рендерят blog cards через next/image. AVIF будет отдаваться `/_next/image` после deploy (next.config.ts уже имеет formats: ["image/avif","image/webp"]).</what-built>
  <how-to-verify>
    1. `pnpm dev` локально → открыть http://localhost:3000/ → DevTools Network → scroll до footer → blog cards грузятся как `_next/image?url=...blog-card-...&w=...&q=75`, content-type `image/avif` (или webp в Safari < 16).
    2. Проверить визуально 360 / 480 / 768 / 1024 / 1440 — карточки выглядят как раньше, не сломан layout, gap-ы и rounded corners сохранены.
    3. После deploy на demo: `curl -I -H "Accept: image/avif" "https://demo.soloproduction.pro/_next/image?url=%2Fassets%2Ffigma%2Ffooter-1440%2Fblog-card-1.jpg&w=750&q=75"` → `content-type: image/avif`, `content-length` < 100 KB.
  </how-to-verify>
  <resume-signal>Type "approved" если ОК, иначе опиши issues.</resume-signal>
</task>

</tasks>

<verification>
- 5 footer файлов используют `next/image`, 0 raw `<img>` для blog-cards
- ts + lint passing
- Network tab: blog cards идут через `/_next/image`, грузятся lazy
- AVIF возвращается при `Accept: image/avif`
</verification>

<success_criteria>
- 3 footer blog card images отдаются ~50-100 KB AVIF (было 649-912 KB JPG)
- Total footer media bytes на mobile < 300 KB
- Не блокируют LCP (lazy + below-fold)
- Visual parity на всех 5 breakpoints
</success_criteria>

<output>
После завершения создать `.planning/phases/13-static-media-optimization-p0/13-01-SUMMARY.md` с before/after byte savings, list of modified files и подтверждение AVIF доставки на demo.
</output>
