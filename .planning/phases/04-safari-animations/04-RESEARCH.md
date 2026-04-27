# Phase 4: Safari + Animations — Research

**Researched:** 2026-04-22
**Domain:** Cross-browser animation migration (boneyard-js → motion), Safari parity, scroll-driven animation verification
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Целевая библиотека — **Framer Motion** (пакет `motion`, бывший `framer-motion`). Установка: `pnpm add motion`. Причина: Safari-совместимость через Motion Values + `requestAnimationFrame` (не зависит от CSS `animation-timeline`, которого нет в Safari < 18); декларативный React-first API; размер ~17–25 KB gzip при tree-shaking.
- **D-02:** **boneyard-js выводится из проекта** после миграции. Пакет удаляется из `package.json` на финальной задаче phase. Все потребители `BoneyardSkeleton` мигрируются на `motion.div` с `initial={{ opacity: 0 }}` + `whileInView={{ opacity: 1 }}`.
- **D-03:** **GSAP не используется** — избыточен для лендинга и императивный API создаёт friction в React 19 с concurrent features.
- **D-04:** **Инкрементальная миграция по виджетам** (не big-bang). Порядок: philosophy-clients → cases → team → shared/ui/boneyard-skeleton (последним).
- **D-05:** Reveal-анимации заменяются **упрощённым opacity-fade** (`initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.22, ease: "easeOut" }}`), без воспроизведения shimmer-плейсхолдера.
- **D-06:** Существующий хук `use-cases-pin-scroll-progress.ts` сохраняется как основа. Phase 4 задача — верифицировать его работу в Safari и устранить найденные глитчи, НЕ переписывать.
- **D-07:** Если верификация в Safari выявит рассинхронизацию pin-зоны, использовать `motion` `useScroll({ target })` с `offset` как drop-in замену расчёта прогресса внутри хука.
- **D-08:** Opacity/translate переходы внутри cases section могут остаться на CSS transitions ИЛИ мигрировать на `motion.div`. Решение per-file (Claude's Discretion).
- **D-09:** **Hover-эффекты на Tailwind CSS остаются как есть** (не мигрируют на `whileHover`).
- **D-10:** Верификация — ручной прогон в Safari latest на macOS. Автоматизация через Playwright WebKit откладывается в Phase 6.
- **D-11:** Safari checklist: (1) reveal фэйды без мерцания; (2) ANI-01 pin держит позицию; (3) hover без flash; (4) scroll-плавность на уровне Chrome.

### Claude's Discretion

- Конкретный API вариант для каждого виджета (`motion.div` vs `useInView` hook vs `AnimatePresence`) — выбирается per-file, руководствуясь D-05 как дефолтом.
- Нужно ли точечно мигрировать отдельный hover на `whileHover` — решается при обнаружении конкретного Safari-глитча.
- Решение по D-08 (CSS или `motion.div` для ANI-01 weights) — per-widget.

### Deferred Ideas (OUT OF SCOPE)

- Playwright WebKit автоматизация — Phase 6 (TEST-02).
- Pixel-perfect Safari vs Chrome sverka — Phase 5.
- Миграция CSS hover → `whileHover` глобально — только точечно.
- Новые анимации / enrichment reveal (staggered children, spring physics) — feature backlog.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAFARI-01 | Анимации и CSS transitions работают в Safari идентично Chrome | Common Pitfalls §Safari, Pattern 1–3, миграция shimmer на opacity-fade (D-05) устраняет нестабильность boneyard-js в Safari |
| SAFARI-02 | Scroll-анимации и sticky-элементы работают в Safari идентично Chrome | Common Pitfalls §sticky + transform ancestor, существующий хук на JS + rAF архитектурно совместим, D-07 drop-in через `useScroll` |
| ANI-01 | Анимация секции с кейсами работает корректно | Hook `use-cases-pin-scroll-progress.ts` сохраняется; верификация через Safari DevTools Timeline, drop-in fallback `useScroll({ target })` |
| ANI-02 | Все анимации сайта имеют плавный easing (нет рывков, мерцания) | Audit списка transition-[filter]/transition-opacity (36 файлов), проверка mix-blend-mode + grayscale Safari-специфики |
</phase_requirements>

## Summary

Phase 4 — это не разработка новых анимаций, а **инкрементальная миграция reveal-анимаций с boneyard-js на motion (v12.38.0)**, подтверждение Safari-парности существующего scroll-driven хука ANI-01 и аудит CSS transitions на Safari-специфичные глитчи. Выбор motion зафиксирован в AUDIT-ANIMATIONS.md; исследование подтверждает, что motion 12.38.0 стабильно работает с Next.js 15 App Router + React 19 через `"use client"` директиву или импорт `motion/react-client`. [VERIFIED: npm view motion@12.38.0 — peerDeps react ^18.0.0 || ^19.0.0]

Обнаружено **12 инстансов использования `BoneyardSkeleton` в 10 файлах** (реестр `src/bones/registry.js` также удаляется вместе с пакетом). Существующий хук `use-cases-pin-scroll-progress.ts` архитектурно Safari-совместим — он использует `scrollY + requestAnimationFrame`, не полагается на CSS `animation-timeline`, корректно обрабатывает `prefers-reduced-motion`. Наибольший Safari-риск — комбинация `position: sticky` с `transform` на предке (карточки philosophy и cases section используют `translate3d` на ancestor-элементах, что может ломать sticky в Safari). [CITED: motion.dev/docs/react-installation, BrowserStack sticky guide]

Наиболее Safari-чувствительные CSS фичи проекта: `mix-blend-mode: color` на overlay в cases карточках, `grayscale` filter transitions, `backdrop-filter` в модалях (7 файлов), комбинация `overflow-x-clip + translate3d` в philosophy-clients. [VERIFIED: grep по кодовой базе]

**Primary recommendation:** Установить `motion@^12.38.0`, мигрировать по 1 файлу за раз в порядке D-04, начав с наиболее изолированных (team-section-photo) → philosophy-clients → cases. Использовать `motion/react-client` импорт (не добавлять лишнюю `"use client"` граница — клиентские границы уже есть). Для cases-section-1440 протестировать Safari ДО любых изменений в хуке — если pin работает корректно, хук не трогаем (D-06).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Reveal-анимации (fade-in при входе в viewport) | Browser / Client | — | `whileInView` использует `IntersectionObserver` в браузере; SSR отдаёт `initial` состояние |
| Scroll-driven pin (ANI-01) | Browser / Client | — | Существующий JS-хук читает `window.scrollY` + `requestAnimationFrame`; невозможно на сервере |
| CSS hover transitions | Browser / Client (CSS) | — | Чистые CSS, не требуют JS; остаются в Tailwind классах (D-09) |
| SSR initial state | Frontend Server (SSR) | Browser / Client | Next.js 15 рендерит `motion.div` с `initial` значением на сервере; клиент гидратирует и запускает анимацию |
| Package management | Build | — | `pnpm add motion` + `pnpm remove boneyard-js` на финальной задаче |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion` | `^12.38.0` | Reveal-анимации, `useInView`, scroll fallback (`useScroll`) | Locked by AUDIT-ANIMATIONS.md; Safari-совместимость через `requestAnimationFrame`, декларативный React-first API, совместим с React 19 App Router [VERIFIED: npm view motion@12.38.0, modified 2026-03-17] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `motion/react-client` | included in `motion` | Импорт для уменьшения client bundle в Next.js App Router | Использовать, когда файл НЕ имеет `"use client"`, но нужен `motion.div` [CITED: motion.dev/docs/react-installation] |
| `motion/react-m` (`m.*`) + `LazyMotion` | included in `motion` | Tree-shaken bundle (~4.6 KB вместо ~34 KB) | Optional optimisation; deferred — первичная цель phase не bundle size, а Safari-парность |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion` package | `framer-motion` (old name) | Эквивалентно; `motion` — актуальное имя пакета с 2024 [VERIFIED: motion.dev/docs] |
| `motion.div` повсеместно | `m.div` + `LazyMotion` | Меньше bundle, но добавляет complexity (provider). Откладывается в v2 — сейчас цель phase Safari-корректность |

**Installation:**

```bash
pnpm add motion
# (in final task of phase, after all BoneyardSkeleton consumers migrated:)
pnpm remove boneyard-js
```

**Version verification:**
- `motion@12.38.0` — published 2026-03-17, peer deps `react ^18.0.0 || ^19.0.0` [VERIFIED: `npm view motion version peerDependencies`]
- `boneyard-js@1.7.9` — текущая установленная `^1.7.6`; версия неважна, пакет удаляется [VERIFIED: npm view boneyard-js version]

## Architecture Patterns

### System Architecture Diagram

```
User scrolls page
       │
       ▼
┌─────────────────────────────────────────┐
│  Next.js 15 App Router (SSR)            │
│  renders `motion.*` with `initial` prop │─── Server component tree
│  → HTML with initial opacity:0 inline   │
└─────────────────────────────────────────┘
       │
       ▼ Hydration boundary ("use client" or motion/react-client)
┌─────────────────────────────────────────┐
│  motion runtime (client, ~34 KB)        │
│  ├─ whileInView → IntersectionObserver  │── Reveal path (all widgets except cases pin)
│  │    → animate opacity 0→1             │
│  ├─ Tailwind CSS hover transitions      │── Hover path (kept as-is, D-09)
│  └─ useCasesPinScrollProgress (JS hook) │── Pin path (ANI-01, D-06)
│       ├─ scroll listener + rAF          │
│       ├─ smootherstep01 → weights       │
│       └─ inline style opacity/maxHeight │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Safari/Chrome render                   │
│  Risk points:                           │
│   · sticky + transform ancestor         │── verify manually (SAFARI-02)
│   · mix-blend-mode repaint              │── verify hover (ANI-02)
│   · grayscale filter Safari jank        │── verify hover (ANI-02)
│   · backdrop-filter (modals)            │── secondary risk
└─────────────────────────────────────────┘
```

### Recommended Project Structure (no changes — keep existing FSD layout)

```
src/
├── shared/ui/
│   └── boneyard-skeleton.tsx         # DELETED in final task of phase
├── widgets/cases/lib/
│   └── use-cases-pin-scroll-progress.ts  # KEPT AS-IS (D-06)
├── widgets/<widget>/ui/
│   └── <widget-NNNN>.tsx             # BoneyardSkeleton → motion.div replacements
└── bones/                            # DELETED in final task (registry + 15 .bones.json files)
```

### Pattern 1: Replace BoneyardSkeleton with motion.div fade (default per D-05)

**What:** Заменить `<BoneyardSkeleton loading={!loaded} name="...">` на `motion.div` с fade-in.
**When to use:** Везде, где сейчас `BoneyardSkeleton` — 12 инстансов в 10 файлах.
**Example:**

```tsx
// Source: motion.dev/docs/react-installation, motion.dev/docs/vue-scroll-animations
"use client"; // already present in all target files

import { motion } from "motion/react";

// BEFORE:
<BoneyardSkeleton loading={!imageLoaded} name="cases-vertical-card-1440">
  <article className="...">
    <Image onLoad={() => setImageLoaded(true)} ... />
  </article>
</BoneyardSkeleton>

// AFTER:
<motion.article
  className="..."
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.22, ease: "easeOut" }}
>
  <Image onLoad={() => {/* no-op; loading state no longer gates render */}} ... />
</motion.article>
```

**Note on loading state:** текущий `loading={!imageLoaded}` перестаёт быть нужен — `motion.div` фэйдит independently от загрузки картинки. `useState<boolean>(imageLoaded)` и `onLoad` handler можно удалить. Next.js `<Image>` сам обрабатывает progressive loading через placeholder. [CITED: motion.dev/docs; D-05 упрощение]

### Pattern 2: Conditional render with AnimatePresence (only if needed)

**What:** Для компонентов, которые монтируются/размонтируются условно (модали).
**When to use:** НЕ применяется к reveal в рамках phase 4 — все `BoneyardSkeleton` — всегда в DOM.
**Skip unless:** discovered a case where mount/unmount animation needed.

### Pattern 3: Drop-in useScroll fallback for cases pin (only if Safari reveals issue)

**What:** Заменить расчёт `scrollY` + ramp внутри `use-cases-pin-scroll-progress.ts` на `useScroll({ target, offset })`. Выходные типы хука (`collapseProgress`, `pinPhase`) НЕ меняются.
**When to use:** Только если manual Safari UAT показывает рассинхрон pin / прыжки. По умолчанию — НЕ делать (D-06).
**Example:**

```tsx
// Source: motion.dev/docs/react-use-scroll
// Only apply IF Safari verification fails
import { useScroll, useMotionValueEvent } from "motion/react";

const { scrollYProgress } = useScroll({
  target: pinRef,
  offset: ["start start", "end start"],
});

useMotionValueEvent(scrollYProgress, "change", (t) => {
  applyProgress(computeCasesPinCollapseProgress(t));
});
```

**Preserve:** `smootherstep01`, `CASES_PIN_SCROLL_VH`, `CASES_PIN_HOLD_END_FRAC`, `getCasesPinWeights`, `computeCasesPinCollapseProgress`, `prefers-reduced-motion` check, `casesPinViewportAllowsPin`. Меняется только источник `t`.

### Anti-Patterns to Avoid

- **Big-bang миграция всех 10 файлов за одну задачу** — нарушает D-04, высокий blast radius. Атомарный коммит на файл.
- **Воспроизведение shimmer placeholder через motion** — overengineering; D-05 явно разрешает упрощение до opacity fade.
- **Переписывание `use-cases-pin-scroll-progress.ts` «на всякий случай»** — нарушает D-06. Сначала Safari UAT, потом решение.
- **Добавление `"use client"` в файлы, где его нет** — все 10 файлов с `BoneyardSkeleton` УЖЕ имеют `"use client"` [VERIFIED: grep]; не нужно плодить client boundaries.
- **Миграция CSS hover transitions → `whileHover`** — нарушает D-09; нативный CSS стабильнее, меньше JS overhead.
- **Удаление `boneyard-js` из `package.json` до удаления последнего импорта** — сломает build. Удалять последней задачей phase.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fade-in при появлении в viewport | Кастомный `IntersectionObserver` + `useState` + CSS transition | `motion.div` с `whileInView + viewport={{ once: true }}` | Motion уже правильно обрабатывает rootMargin, once, amount; меньше edge-cases с unmount [CITED: motion.dev/docs/vue-scroll-animations] |
| Scroll-driven progress (если понадобится fallback) | Свой `scrollY` listener + `rAF` | `useScroll({ target, offset })` — только для drop-in D-07 | Motion обрабатывает container + window scrolling, respects `offset` keywords |
| Placeholder / skeleton во время загрузки | Shimmer через boneyard-js или кастом | Просто `opacity: 0` initial + Next.js `<Image placeholder="blur">` | D-05 локирует упрощение; shimmer не критичен для UX |
| Safari-specific vendor prefixes | Руками писать `-webkit-` префиксы | Tailwind + motion автоматически поставят нужные transforms | Motion animates через `transform` string, GPU-accelerated [CITED: motion.dev/docs/performance] |

**Key insight:** В phase 4 не решается ни одной новой задачи, для которой motion нужно бы «hand-roll». Весь объём — механическая замена + верификация.

## Runtime State Inventory

**Trigger:** Phase 4 включает удаление пакета `boneyard-js` и директории `src/bones/` — refactor/cleanup характер.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | None — boneyard-js не хранит данные в runtime storage. Reгистр `src/bones/registry.js` — это **build-time generated** (`npx boneyard-js build`), не runtime. [VERIFIED: содержимое registry.js] | Удалить весь каталог `src/bones/` и его импорт из корневого layout (если есть) |
| Live service config | None — анимация клиент-сайд, нет external service | None |
| OS-registered state | None | None |
| Secrets/env vars | None — boneyard-js не читает env | None |
| Build artifacts | `src/bones/*.bones.json` (15 файлов) + `src/bones/registry.js` — сгенерированы командой `npx boneyard-js build`. После удаления пакета эти файлы становятся orphaned. [VERIFIED: `// Auto-generated by npx boneyard-js build — do not edit` в registry.js] | Удалить всю папку `src/bones/` в финальной задаче phase; убрать любой импорт `@/bones/registry` (нужно проверить в layout/page/client providers) |

**Additional grep needed by planner:** найти импорты `@/bones/registry` или `./registry` из `/src/bones/` — текущий поиск показал только сам registry.js; подтвердить, что нет import-сайта, или зарегистрировать задачу на его удаление тоже.

## Common Pitfalls

### Pitfall 1: Safari `position: sticky` ломается из-за `transform` на предке

**What goes wrong:** В Safari (в т.ч. latest) при наличии `transform`, `will-change`, `filter`, `perspective` на **любом ancestor-элементе** sticky-ребёнка — sticky теряет "прилипание" или прыгает.
**Why it happens:** Safari создаёт новый stacking context / containing block для transformed ancestors, что меняет scope sticky containing-block.
**How to avoid:** Перед верификацией ANI-01 в Safari:
1. Пройти по DOM-цепочке от `[data-cases-pin]` до `<body>` и найти предков с `transform` / `translate3d` / `will-change: transform`.
2. В cases-section-1440.tsx sticky-элемент находится внутри `.relative w-full` (без transform) → родитель pin-зоны чист [VERIFIED: чтение cases-section-1440.tsx]. НО: `.philosophy-scroll-card` использует `translate3d` — это НЕ ancestor для cases pin, но если cases когда-то станет ребёнком philosophy — прыжок.
3. Если Safari показывает баг — применить D-07 (drop-in useScroll) ИЛИ убрать `will-change` у промежуточных элементов.

**Warning signs:** В Safari pin-элемент прыгает вверх при начале sticky lock, content "отваливается" в момент unpin, содержимое карусели clips/shows differently в Safari vs Chrome. [CITED: browserstack.com/guide/why-css-position-sticky-is-not-working]

### Pitfall 2: `mix-blend-mode` в Safari вызывает repaint / flicker

**What goes wrong:** `mix-blend-mode: color` на overlay в cases карточках может мерцать при hover-transition в Safari. [VERIFIED: найдено 9 файлов с `mix-blend`; в cases-section-1440.tsx применяется `mix-blend-color` с transition-opacity]
**Why it happens:** Safari менее агрессивно кэширует composited layers с blend-modes; при изменении `opacity` на blended элементе может происходить полный repaint родителя.
**How to avoid:**
1. Добавить `will-change: opacity` на overlay (Tailwind `will-change-[opacity]`) — только для этих элементов.
2. Если мерцание остаётся — fallback: вынести overlay в отдельный child-элемент без blend-mode, применять затемнение через rgba вместо blend.
3. Не менять изоляцию (`isolation: isolate`) если не подтверждён баг.

**Warning signs:** Flash цвета в первом кадре hover-анимации в Safari; "прыжок" насыщенности при hover-in / hover-out.

### Pitfall 3: `grayscale` filter transitions jank в Safari

**What goes wrong:** Transitioning `filter: grayscale(1) → grayscale(0)` в Safari может давать stuttering (особенно на больших изображениях `fill` в cases карточках). [VERIFIED: cases-section-1440.tsx использует `grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0`]
**Why it happens:** Filter — composited property, но Safari реже promotes filtered elements в отдельный слой без явной подсказки.
**How to avoid:** `will-change-[filter]` уже есть — проверить эффективность в Safari UAT. Если jank остаётся — уменьшить duration с 300ms на 200ms ИЛИ использовать `backdrop-filter` на overlay вместо прямого filter на Image.
**Warning signs:** Прерывистый переход цвет↔ч/б в Safari при наведении на cases card.

### Pitfall 4: Next.js 15 `<Image onLoad>` + removal of `loading={!imageLoaded}` state

**What goes wrong:** После удаления `BoneyardSkeleton` wrapper, если remove `imageLoaded` state полностью, то при первичной загрузке картинки может быть FOUC (вспышка пустого бэкграунда `bg-[#0d0300]` до рендера картинки).
**Why it happens:** Next.js `<Image>` сам не имеет fade-in; `motion.article` с `whileInView` срабатывает один раз при входе в viewport, не коррелирует с `onLoad`.
**How to avoid:** Использовать Next.js `<Image placeholder="blur" blurDataURL="...">` ИЛИ оставить `onLoad` callback для fade image внутри (отдельный `motion.img animate={{ opacity: loaded ? 1 : 0 }}`). Per D-05 — начать с простого варианта без placeholder, проверить UX. [CITED: Next.js Image docs]
**Warning signs:** Чёрный/цветной flash на месте cases card при первой загрузке до появления картинки.

### Pitfall 5: `motion/react-client` import vs `"use client"` directive — mutual exclusion

**What goes wrong:** Смешивание `motion/react-client` импорта и `"use client"` directive — избыточно, но не ошибка. Если в файле уже стоит `"use client"`, импорт `motion/react-client` эквивалентен `motion/react`.
**How to avoid:** Все 10 файлов-потребителей `BoneyardSkeleton` уже `"use client"` [VERIFIED: grep]. Использовать стандартный `import { motion } from "motion/react"`. [CITED: motion.dev/docs/react-installation]

### Pitfall 6: Удаление `boneyard-js` до удаления всех импортов = build break

**What goes wrong:** `pnpm remove boneyard-js` до замены последнего `import { Skeleton } from "boneyard-js/react"` → `next build` падает с module not found.
**How to avoid:** Финальная задача phase — single atomic commit:
1. Удалить `src/shared/ui/boneyard-skeleton.tsx`
2. Удалить `src/bones/` целиком (проверить grep `@/bones`)
3. Убрать из `package.json` → `pnpm install`
4. `pnpm typecheck` + `pnpm lint` ДО коммита.

## Code Examples

### Example 1: Migrate `VerticalCard` in cases-section-1440.tsx

```tsx
// Source: motion.dev/docs/vue-scroll-animations, D-05 fade pattern
"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";

function VerticalCard({ image, titleLines, views, credits, overlayLight, onOpenDetail }: Props) {
  return (
    <motion.article
      className="group relative h-[510px] w-[283px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#0d0300]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (!onOpenDetail) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenDetail(); }
      }}
      role={onOpenDetail ? "button" : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <Image
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
          casesCardHoverEase,
        )}
        fill
        sizes="283px"
        src={image}
      />
      {/* rest unchanged */}
    </motion.article>
  );
}
```

### Example 2: Migrate team card in philosophy-clients-1440.tsx (wrapping existing div)

```tsx
// Source: motion.dev/docs/vue-scroll-animations
// BEFORE: <BoneyardSkeleton loading={!teamCardLoaded} name="philosophy-team-card-1440">
//           <div data-philosophy-card="2" ...>
//             <Image onLoad={() => setTeamCardLoaded(true)} ... />
//           </div>
//         </BoneyardSkeleton>

// AFTER:
<motion.div
  data-philosophy-card="2"
  className={`${CARD} z-[3] bg-[#0d0300]`}
  style={{
    left: 140, top: 252, width: 640, height: 340, borderRadius: 20,
    transform: `translate3d(0, ${enterY(2)}px, 0)`,
    pointerEvents: isCardInteractive(2) ? "auto" : "none",
  }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.22, ease: "easeOut" }}
>
  {/* children unchanged; remove setTeamCardLoaded state */}
</motion.div>
```

**Note:** `motion.div` принимает `style` prop с `transform`, но если мы одновременно используем `animate={{ transform: ... }}`, будет конфликт. В этом файле `transform` — не анимируемый (вычисляется из scroll hook), а `opacity` — анимируемый (`whileInView`). Motion не конфликтует: `transform` приходит из `style`, `opacity` — из анимации. [VERIFIED: motion.dev/docs/performance — combined transform string через style работает; opacity animated отдельно]

### Example 3: Drop-in `useScroll` replacement (only if Safari UAT fails for ANI-01)

```tsx
// Source: motion.dev/docs/react-use-scroll
// DO NOT APPLY unless Safari verification reveals pin desync (D-06 / D-07)

"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

export function useCasesPinScrollProgressMotion(pinRef: RefObject<HTMLElement | null>) {
  const [pinPhase, setPinPhase] = useState<CasesPinPhase>("before");
  const [collapseProgress, setCollapseProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (t <= 0) { setPinPhase("before"); setCollapseProgress(0); return; }
    if (t >= 1) { setPinPhase("after"); setCollapseProgress(1); return; }
    setPinPhase("active");
    setCollapseProgress(computeCasesPinCollapseProgress(t));
  });

  return { collapseProgress, pinPhase };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` (renamed) | 2024 | Same library, new npm name. Use `motion` for new installs. [CITED: motion.dev] |
| CSS `animation-timeline: scroll()` | JS-driven `useScroll` + `requestAnimationFrame` | Safari < 18 not supporting | Project уже на JS-hooks — Safari-safe by construction [VERIFIED: use-cases-pin-scroll-progress.ts] |
| `BoneyardSkeleton` shimmer reveal | `motion.div` opacity fade | Phase 4 milestone | Меньше bundle, лучше Safari parity, проще код |
| `"use client"` на каждый `motion.*` файл | Опционально `motion/react-client` для "server with client parts" | motion v11+ | В нашем случае все файлы уже `"use client"` — не актуально [CITED: motion.dev/docs/react-installation] |

**Deprecated/outdated:**
- `boneyard-js@1.7.x` — low community activity; в проекте удаляется полностью.
- CSS `@apply animate-pulse` как fallback для boneyard — в `boneyard-skeleton.tsx` удаляется вместе с компонентом.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Удаление `onLoad`-gated state (`imageLoaded`) не даст FOUC при первой загрузке на медленных сетях, так как Next.js `<Image>` сам обрабатывает placeholder | Pitfall 4, Example 1 | Возможен черный flash на месте cases карточек до загрузки картинки → требуется `placeholder="blur"` или сохранение state. Планеру: запланировать UAT на медленной сети и fallback-задачу. |
| A2 | `mix-blend-mode: color` с `transition-opacity` в cases карточках не даёт visible flicker в Safari latest на M1/M2 Mac | Pitfall 2 | Если flicker подтверждён — потребуется точечный `motion.div` overlay с кастомным easing. Планеру: включить эту проверку в Safari UAT чек-лист. |
| A3 | Существующий `use-cases-pin-scroll-progress.ts` работает в Safari без рассинхрона (архитектурно совместим) | Pattern 3, D-06 | Если Safari показывает прыжки pin — применить D-07 drop-in. Планеру: явный таск "Safari UAT cases pin" ДО любых изменений в хуке. |
| A4 | `motion.article` с `whileInView` корректно применяет opacity к SSR-rendered `<article>` без двойной гидратации в React 19 Strict Mode | Pattern 1, Architecture Diagram | React 19 Strict Mode вызывает effects дважды в dev; motion спроектирован под это [CITED: AUDIT-ANIMATIONS.md], но в production важно проверить нет ли "вспышки" при hydration. UAT-чек: открыть prod-build в Safari, смотреть первый paint. |
| A5 | `src/bones/` директория не импортируется из корневого layout.tsx или providers; registry.js вызывается где-то централизованно | Runtime State Inventory | Если есть import `@/bones/registry` в layout — его удаление без замены даст build break. Планеру: включить grep-проверку в финальную задачу. |
| A6 | 12 инстансов `BoneyardSkeleton` в 10 файлах — полный scope миграции | Summary | Если существуют динамические импорты или условный рендер boneyard — scope больше. Risk: missed file после удаления пакета. Mitigation: final build должен падать на unresolved imports — это гарантирует выявление. |

## Open Questions

1. **Используется ли `@/bones/registry` в root layout или providers?**
   - What we know: `src/bones/registry.js` существует и auto-generated; импортирует `registerBones` и `configureBoneyard` из `boneyard-js`.
   - What's unclear: вызывается ли `registry.js` откуда-то (sideeffect import) — без этого `configureBoneyard` не сработает, но компонент `<Skeleton>` всё равно работает с defaults. Grep показал только сам файл как матч `boneyard-js`, но не его импорт.
   - Recommendation: planner добавляет early-task: `grep -r "bones/registry" src/` — если есть импорт в `app/layout.tsx` или `providers.tsx`, его удалить в финальной задаче вместе с директорией.

2. **Safari на iOS (iPhone) vs Safari desktop — scope UAT?**
   - What we know: D-10 specifies "Safari latest на macOS".
   - What's unclear: распространяется ли UAT на iOS Safari (iPhone/iPad real devices)? Pin-анимация на iOS touch-scrolling имеет специфические quirks (momentum scroll + sticky).
   - Recommendation: считать iOS вне scope phase 4 (следуя D-10 буквально); iOS-специфика — в Phase 6 (Playwright WebKit).

3. **Нужно ли включать `prefers-reduced-motion` в новые `motion.div` reveal?**
   - What we know: motion library автоматически уважает `prefers-reduced-motion` через `MotionConfig` или `useReducedMotion`; в текущих хуках есть ручная проверка.
   - What's unclear: без явной настройки motion по умолчанию просто уменьшает / отключает physics, но `whileInView` с `opacity` всё равно запустится.
   - Recommendation: добавить `<MotionConfig reducedMotion="user">` в root layout ИЛИ использовать `useReducedMotion()` для skip fade. Claude's Discretion — решается planner'ом; дефолт — просто включить `<MotionConfig reducedMotion="user">` в layout (одна строчка, закрывает a11y).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `pnpm` | Install motion | ✓ | `10.6.5` | — [VERIFIED: package.json `packageManager`] |
| Node.js ≥ 22 | Next 15 build | ✓ | project engines `>=22.0.0` | — |
| Safari (macOS latest) | Manual UAT D-10 | ✓ (user-provided) | — | — |
| Next.js 15 App Router | motion integration | ✓ | `^15.4.11` | — [VERIFIED: package.json] |
| React 19 | motion peer dep | ✓ | `^19.0.0` | — [VERIFIED: motion peer deps `^18 || ^19`] |
| Playwright WebKit | Automated Safari tests | ✓ installed but out of scope | `1.50.1` devDep | Deferred to Phase 6 per D-10 |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None for unit tests — проект сейчас без Jest/Vitest; Playwright 1.50.1 установлен для E2E smoke scripts |
| Config file | `playwright.config.ts` — **not found** in repo root (планеру: проверить наличие; если нет — существующие `scripts/*.mjs` используют Playwright programmatically) |
| Quick run command | `pnpm typecheck && pnpm lint` (закрывает регрессии типов после удаления `BoneyardSkeleton` типа) |
| Full suite command | `pnpm build` — финальная проверка перед удалением `boneyard-js` из package.json |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SAFARI-01 | CSS transitions + reveal fades не мерцают в Safari | manual-only | `open -a Safari http://localhost:3000` + чек-лист D-11 | — manual per D-10 |
| SAFARI-02 | Sticky + scroll-driven идентично Chrome | manual-only | Safari DevTools Timeline запись прокрутки cases section | — manual per D-10 |
| ANI-01 | Cases pin transition корректный | manual-only (Safari) + smoke script | Существующий `scripts/services-scroll-smoke.mjs` — паттерн для cases; планеру: можно добавить `scripts/cases-pin-scroll-smoke.mjs` для Chromium baseline | ❌ Wave 0 (optional) |
| ANI-02 | Smooth easing everywhere | manual-only | Safari DevTools Animations panel: нет "chopping", нет flash | — manual per D-10 |
| Meta: build integrity | После удаления boneyard-js build проходит | automated | `pnpm build && pnpm typecheck && pnpm lint` | ✓ commands exist in package.json |

### Sampling Rate

- **Per task commit:** `pnpm typecheck` — быстро (<10s) ловит сломанные типы `BoneyardSkeleton`
- **Per wave merge:** `pnpm build` — полный Next.js production build; ловит missing module если `boneyard-js` удалён рано
- **Phase gate:** полный Safari UAT прогон по D-11 чек-листу + `pnpm build` зелёный

### Wave 0 Gaps

- [ ] Нет gaps — инфраструктура типов (`tsc`) и lint (`eslint`) уже есть; unit-тесты для reveal-анимаций не требуются в scope (manual UAT покрывает D-11).
- [ ] Опционально: `scripts/cases-pin-scroll-smoke.mjs` — Chromium baseline через Playwright; нужен только если планер хочет автоматизированную проверку "до/после" миграции. Deferred к Phase 6 per D-10.

**Итог:** Phase 4 — UAT-driven phase, не unit-test-driven. Sampling: typecheck+lint на каждом таске, manual Safari UAT на phase gate.

## Security Domain

Phase 4 — чисто фронтенд-анимации, нет изменений в auth, input validation, crypto, storage. `security_enforcement` контрольный аудит:

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | — (не трогаем формы) |
| V6 Cryptography | no | — |
| V14 Config | marginal | `pnpm remove boneyard-js` — стандартный npm lifecycle; нет security implications |

### Known Threat Patterns for motion library

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Supply chain (compromised npm package) | Tampering | `motion@12.38.0` — well-maintained, 10M+ downloads/month, Framer-owned; lockfile через pnpm-lock.yaml |
| Client-side DoS via animation complexity | Denial-of-service | `prefers-reduced-motion` respected (via MotionConfig); `viewport={{ once: true }}` prevents repeated triggering |

**Nothing security-sensitive in phase 4 scope.**

## Sources

### Primary (HIGH confidence)

- Context7 `/websites/motion_dev` — fetched topics: "Next.js App Router use client", "whileInView useInView", "useScroll target offset", "bundle size LazyMotion", "safari hardware acceleration"
- https://motion.dev/docs/react-installation — App Router + `use client` + `motion/react-client`
- https://motion.dev/docs/react-use-scroll — `useScroll({ target, offset })` API
- https://motion.dev/docs/vue-scroll-animations — `whileInView` + `inViewOptions.once` (API shared across React/Vue)
- https://motion.dev/docs/react-reduce-bundle-size — bundle ~34 KB default, ~4.6 KB with `m` + `LazyMotion`
- https://motion.dev/docs/performance — hardware acceleration notes
- `npm view motion@12.38.0` — version + peerDeps verified 2026-04-22

### Secondary (MEDIUM confidence)

- `.planning/AUDIT-ANIMATIONS.md` — project-local audit, source of library decision
- https://www.browserstack.com/guide/why-css-position-sticky-is-not-working — Safari sticky + transform ancestor
- https://weblogtrips.com/technology/css-grid-breaking-mobile-safari-fix-2026/ — Safari layout quirks (2026 post)
- Codebase grep results — 10 BoneyardSkeleton consumers, 9 mix-blend files, 7 backdrop-filter files, 7 prefers-reduced-motion usages

### Tertiary (LOW confidence)

- Общие эмпирические Safari-glitch patterns для `grayscale` / `mix-blend-mode` transitions — основано на training + CanIUse; точная проверка только через manual UAT в Safari (D-10)

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — Context7 + npm registry + AUDIT-ANIMATIONS.md все align на motion@12.38.0
- Architecture: **HIGH** — patterns проверены в motion docs; существующие хуки прочитаны и cross-referenced
- Pitfalls: **MEDIUM** — Safari-specific bugs задокументированы в industry sources, но точная reproduction в этом проекте проверяется только UAT в Phase 4 execution
- Migration scope (12 instances in 10 files): **HIGH** — verified grep

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (30 дней — motion stable, React 19 / Next 15 stable)
