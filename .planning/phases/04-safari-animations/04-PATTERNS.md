# Phase 04: Safari + Animations — Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 11 modified (10 BoneyardSkeleton consumers + 1 layout registry import) + 3 deleted
**Analogs found:** 11 / 11 — все паттерны копируются из уже существующего кода фазы; новых файлов нет

---

## Scope Recap

Phase 4 — это **refactor/cleanup** без новых файлов. Весь объём — механическая замена `<BoneyardSkeleton>` → `<motion.*>` плюс удаление пакета. Поэтому «analog» для каждого модифицируемого файла — **он сам в текущем виде** (форма props, структура JSX, loading state pattern), а «новый pattern» — единая замена, задаваемая D-05.

---

## File Classification

| File (modified / deleted) | Role | Data Flow | Closest Analog | Match Quality |
|---------------------------|------|-----------|----------------|---------------|
| `src/widgets/cases/ui/cases-section-1440.tsx` | widget (client component) | scroll-driven + reveal | self + cases-section-1024 | exact |
| `src/widgets/cases/ui/cases-section-1024.tsx` | widget (client component) | scroll-driven + reveal | cases-section-1440 | exact |
| `src/widgets/cases/ui/cases-section-768.tsx` | widget (client component) | reveal | cases-section-360/480 (identical structure) | exact |
| `src/widgets/cases/ui/cases-section-480.tsx` | widget (client component) | reveal | cases-section-360/768 (identical structure) | exact |
| `src/widgets/cases/ui/cases-section-360.tsx` | widget (client component) | reveal | cases-section-480/768 (identical structure) | exact |
| `src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx` | widget (client component) | pin-scroll + reveal | philosophy-clients-1024 | exact |
| `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` | widget (client component) | pin-scroll + reveal | philosophy-clients-1440 | exact |
| `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` | widget (client component) | reveal (`useInViewOnce`) | self — уже использует `useInViewOnce` для reveal | role-match |
| `src/widgets/team/ui/team-section-photo.tsx` | shared UI (client) | reveal (image load) | self | exact (simplest — start here per D-04) |
| `src/shared/ui/boneyard-skeleton.tsx` | shared UI wrapper | — | — | **DELETED in final task** |
| `src/app/(site)/layout.tsx` | Next.js layout | config | self (strip `import "@/bones/registry.js"`) | — |
| `src/bones/` (directory: registry.js + 15 `.bones.json`) | build artifact | — | — | **DELETED in final task** |
| `package.json` | config | — | — | remove `boneyard-js`, add `motion@^12.38.0` |

---

## Shared Patterns (cross-cutting — apply to ALL consumers)

### Pattern A — BoneyardSkeleton → motion fade (DEFAULT per D-05)

**Source of truth:** CONTEXT.md §D-05, RESEARCH.md §Pattern 1, Example 1.
**Apply to:** all 10 BoneyardSkeleton consumers.

**Import (add):**
```tsx
import { motion } from "motion/react";
```

**Import (remove):**
```tsx
import { BoneyardSkeleton } from "@/shared/ui/boneyard-skeleton";
```

**Default motion props:**
```tsx
initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
viewport={{ once: true, amount: 0.1 }}   // 0.15 for cases cards, 0.1 for philosophy/team (tuning per-file)
transition={{ duration: 0.22, ease: "easeOut" }}
```

**Transform:** меняется тег внутреннего элемента (`<article>` / `<div>`) на `motion.article` / `motion.div`. Wrapping `<BoneyardSkeleton>` убирается. Локальные `useState` для `imageLoaded` / `teamCardLoaded` + `onLoad`/`onError` колбэки **удаляются** (reveal больше не gated by image load).

### Pattern B — preserve `style` + animate `opacity` separately

**Source:** RESEARCH.md §Example 2 note, motion.dev/docs/performance.
**Apply to:** philosophy-clients-1024/1440 (карточка 03 / Команда) — там уже есть inline `transform: translate3d(...)` из scroll hook.

`style.transform` **остаётся** (не анимируем), `opacity` идёт через `whileInView`. Motion не конфликтует: разные properties.

### Pattern C — keep scroll hook untouched (D-06)

**Source:** CONTEXT.md §D-06, D-07; RESEARCH.md §Pattern 3.
**Apply to:** `use-cases-pin-scroll-progress.ts` — **НЕ трогать** в default path. Drop-in через `useScroll({ target, offset })` активируется **только** если Safari UAT выявит рассинхрон pin-зоны.

### Pattern D — keep CSS hover transitions (D-09)

**Source:** CONTEXT.md §D-09.
**Apply to:** все `group-hover:` / `transition-[filter]` / `transition-opacity` классы на `<Image>` и overlay внутри cases карточек — **не переводить** на `whileHover`. Copy pattern из существующего кода как есть:

```tsx
className={cn(
  "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
  casesCardHoverEase,
)}
```

### Pattern E — atomic final teardown task

**Source:** RESEARCH.md §Pitfall 6, CONTEXT.md §D-02.
**Apply to:** финальная задача фазы.
Single atomic commit:
1. Delete `src/shared/ui/boneyard-skeleton.tsx`.
2. Delete `src/bones/` (весь каталог: `registry.js` + 15 `*.bones.json`).
3. Remove `import "@/bones/registry.js";` from `src/app/(site)/layout.tsx` (line 7).
4. `package.json`: `pnpm remove boneyard-js`.
5. `pnpm typecheck && pnpm lint && pnpm build` — должны пройти ДО коммита.

---

## Pattern Assignments (per-file)

### `src/widgets/team/ui/team-section-photo.tsx` (Wave 1 — start here per D-04, simplest)

**Analog:** self (lines 1-79).

**Current shape (lines 32-78):**
```tsx
const [loaded, setLoaded] = useState(false);
return (
  <BoneyardSkeleton
    loading={!loaded}
    name={narrow ? "team-section-photo-narrow" : "team-section-photo-default"}
  >
    <div className={cn("relative overflow-hidden", /* ... */)} style={style}>
      {narrow ? (/* wrapper with Image onLoad */) : (/* Image onLoad */)}
    </div>
  </BoneyardSkeleton>
);
```

**Target (apply Pattern A):**
```tsx
// Remove: const [loaded, setLoaded] = useState(false);
return (
  <motion.div
    className={cn("relative overflow-hidden", /* ... */)}
    style={style}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
  >
    {narrow ? (
      <div className={cn("absolute inset-y-0 left-[-9%] w-[118%]", imageWrapperClassName)}>
        <Image /* remove onLoad/onError, keep everything else */ />
      </div>
    ) : (
      <Image /* remove onLoad/onError */ />
    )}
  </motion.div>
);
```

**Removes:** `useState` import (if sole user), `loaded` state, `onLoad`/`onError` callbacks. Optionally keep `onLoad` empty for future.

---

### `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` (Wave 1)

**Analog:** self — уже использует `useInViewOnce` + CSS reveal (lines 28-36, 230-234).

**Key insight:** этот файл УЖЕ имеет свой reveal (REVEAL/REVEAL_ON/REVEAL_OFF classes + `useInViewOnce`). `BoneyardSkeleton` wrapping (lines 286-325) — **только для одной карточки «Команда»** — независим от reveal анимации.

**Action:** snip the `<BoneyardSkeleton>` wrapper around card 03 (lines 286-325), remove `teamCardLoaded` state (line 210), remove `onLoad`/`onError` from Image (lines 304-305). **НЕ трогать** `useInViewOnce` reveal — оставить как есть (D-09-style reasoning: работает стабильно).

**Decision note:** можно (но не обязательно) в будущем мигрировать `useInViewOnce` + CSS класс pattern тоже на motion — но это OUT OF SCOPE Phase 4 per D-04 (минимальный diff per widget).

---

### `src/widgets/cases/ui/cases-section-360.tsx`, `-480.tsx`, `-768.tsx` (Wave 2 — identical structure)

**Analog (internal):** эти три файла — структурные копии. Различаются только размерами карточек / классами Tailwind. Мигрировать **синхронно** одинаковыми правками.

**Anchor 1 — VerticalCard (lines 74-140, cases-section-360.tsx):**
```tsx
// BEFORE — line 74-77:
const [imageLoaded, setImageLoaded] = useState(false);
return (
  <BoneyardSkeleton loading={!imageLoaded} name="cases-vertical-card-360">
    <article className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[#0d0300]" ...>

// AFTER:
return (
  <motion.article
    className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[#0d0300]"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
    onClick={onOpenDetail}
    onKeyDown={...}
    role={onOpenDetail ? "button" : undefined}
    style={{ height: VERT_CARD_H, width: VERT_CARD_W }}
    tabIndex={onOpenDetail ? 0 : undefined}
  >
    <Image /* remove onLoad/onError, keep grayscale/transition-[filter] classes per Pattern D */ />
    {/* overlay + inner content unchanged */}
  </motion.article>
);
```

**Anchor 2 — AdCard (lines 142-204):** identical transform applied, swap `article` → `motion.article`, remove `imageLoaded` state, keep hover transitions.

**Apply identically to:** cases-section-480.tsx (lines 74-138 vertical, 153-202 ad), cases-section-768.tsx (same ranges — verified by grep).

---

### `src/widgets/cases/ui/cases-section-1024.tsx` and `cases-section-1440.tsx` (Wave 3)

**Analog (internal):** друг друга; плюс тот же pattern что и 360/480/768 для VerticalCard/AdCard. Дополнительно — эти два файла потребляют `useCasesPinScrollProgress` (см. Pattern C — hook не трогаем).

**Anchor — cases-section-1440.tsx VerticalCard (lines 158-224) и AdCard (lines 237-285):** копия той же трансформации, что в Wave 2. Hook-related классы (`transition-[filter]`, grayscale) сохраняются (Pattern D).

**ANI-01 note:** после миграции карточек прогнать Safari UAT чек-лист D-11. **Не менять** weights logic или pinPhase — это зона Pattern C.

---

### `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` и `-1440.tsx` (Wave 3)

**Analog (internal):** друг друга. `BoneyardSkeleton` используется **один раз** в каждом — оборачивает карточку 03 «Команда» (1440: lines 226-260; 1024: lines 240-274).

**Anchor — philosophy-clients-1440.tsx (lines 226-260):**
```tsx
// BEFORE:
<BoneyardSkeleton loading={!teamCardLoaded} name="philosophy-team-card-1440">
  <div
    data-philosophy-card="2"
    className={`${CARD} z-[3] bg-[#0d0300]`}
    style={{
      left: 140, top: 252, width: 640, height: 340, borderRadius: 20,
      transform: `translate3d(0, ${enterY(2)}px, 0)`,
      pointerEvents: isCardInteractive(2) ? "auto" : "none",
    }}
  >
    {/* Image with onLoad={() => setTeamCardLoaded(true)} */}
    {/* ... */}
  </div>
</BoneyardSkeleton>

// AFTER (Pattern A + Pattern B — preserve style.transform, animate opacity):
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
  {/* Image — remove onLoad/onError */}
  {/* rest unchanged */}
</motion.div>
```

**Remove:** `const [teamCardLoaded, setTeamCardLoaded] = useState(false);` (line 86 in 1440, line 102 in 1024) — не используется больше.

**Critical — Pattern B:** `style.transform` **не трогать** — приходит из `enterY(2)` scroll hook (`usePhilosophyPinScrollProgress`). Motion animates ТОЛЬКО `opacity`. Проверено в RESEARCH.md §Example 2 note.

**Same treatment for 1024 file:** lines 240-274, + `setTeamCardLoaded` removal (line 102).

---

### `src/app/(site)/layout.tsx` (Final teardown task only)

**Analog:** self line 7.

**Current:**
```tsx
import "@/bones/registry.js";
```

**Target:** remove this line entirely. Removes side-effect call `configureBoneyard(...)` and `registerBones(...)` — они больше не нужны, пакет удаляется.

---

## No Analog Needed

Нет новых файлов в scope Phase 4 — все pattern'ы self-reference или cross-reference между sibling widgets. Это ожидаемо для refactor-phase.

---

## Wave Plan (recommended grouping for planner)

| Wave | Files | Rationale |
|------|-------|-----------|
| Wave 1 (isolated, low-risk) | `team-section-photo.tsx`, `philosophy-clients-narrow-stack.tsx` | Простейший файл + narrow stack (уже имеет свой reveal) — быстрая проверка паттерна без скролл-логики. |
| Wave 2 (narrow cases — identical structure) | `cases-section-360.tsx`, `cases-section-480.tsx`, `cases-section-768.tsx` | Три структурно идентичных файла, синхронные правки. |
| Wave 3 (pin + wide cases — ANI-01 exposure) | `cases-section-1024.tsx`, `cases-section-1440.tsx`, `philosophy-clients-1024.tsx`, `philosophy-clients-1440.tsx` | Требуют preservation style.transform (Pattern B) и Safari UAT на pin-зону (Pattern C). |
| Wave 4 (final teardown — atomic) | `layout.tsx` + `src/bones/*` delete + `src/shared/ui/boneyard-skeleton.tsx` delete + `package.json` | Single commit per Pattern E. |

Каждая Wave заканчивается `pnpm typecheck && pnpm lint`; Wave 3 additionally — Safari UAT checklist (D-11).

---

## Metadata

**Analog search scope:**
- `src/widgets/cases/ui/` — 5 cases-section-*.tsx files
- `src/widgets/philosophy-clients/ui/` — 3 philosophy-*.tsx files
- `src/widgets/team/ui/team-section-photo.tsx`
- `src/shared/ui/boneyard-skeleton.tsx`
- `src/widgets/cases/lib/use-cases-pin-scroll-progress.ts`
- `src/bones/registry.js`
- `src/app/(site)/layout.tsx` (via grep `@/bones`)
- `package.json`

**Files scanned:** 12
**Pattern extraction date:** 2026-04-22
**Phase directory:** `.planning/phases/04-safari-animations/`
