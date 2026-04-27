# Phase 04: Safari + Animations — Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** `--auto` (recommended options auto-selected; см. DISCUSSION-LOG.md для полного аудита)

<domain>
## Phase Boundary

Все анимации и transitions сайта работают **идентично в Safari (latest) и Chrome** — без мерцания, без пропущенных состояний, с плавным easing. Scroll-driven анимация секции кейсов (ANI-01) корректно отрабатывает pin/collapse между вертикальным слайдером и рекламной лентой в обоих браузерах.

**В scope:**
- Миграция reveal-анимаций с `boneyard-js` на Framer Motion (`motion`)
- Safari-верификация ANI-01 (cases pin-scroll transition)
- Устранение мерцаний и некорректных финальных состояний CSS transitions в Safari
- Smooth easing всех оставшихся анимаций (hover, fade-in, carousel motion)

**Вне scope:**
- Новые анимации/эффекты, которых нет в текущей реализации (scope creep)
- Полный редизайн cases section (ANI-01 остаётся функционально такой же)
- Pixel-perfect Figma sverka — это Phase 5

</domain>

<decisions>
## Implementation Decisions

### Animation Library (locked by AUDIT-ANIMATIONS.md)

- **D-01:** Целевая библиотека — **Framer Motion** (пакет `motion`, бывший `framer-motion`). Установка: `pnpm add motion`. Причина: Safari-совместимость через Motion Values + `requestAnimationFrame` (не зависит от CSS `animation-timeline`, которого нет в Safari < 18); декларативный React-first API; размер ~17–25 KB gzip при tree-shaking.
- **D-02:** **boneyard-js выводится из проекта** после миграции. Пакет удаляется из `package.json` на финальной задаче phase. Все 11 потребителей `BoneyardSkeleton` (см. `<code_context>`) мигрируются на `motion.div` с `initial={{ opacity: 0 }}` + `whileInView={{ opacity: 1 }}`.
- **D-03:** **GSAP не используется** — избыточен для лендинга и императивный API создаёт friction в React 19 с concurrent features.

### Migration Strategy

- **D-04:** **Инкрементальная миграция по виджетам** (не big-bang). Порядок: philosophy-clients → cases → team → shared/ui/boneyard-skeleton (последним, когда не осталось импортов). Причина: снижает blast radius, позволяет верифицировать Safari-парность повиджетно и коммитить атомарно.
- **D-05:** Reveal-анимации заменяются **упрощённым opacity-fade** (`initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.22, ease: "easeOut" }}`), без воспроизведения shimmer-плейсхолдера boneyard. Причина: shimmer не критичен для UX на лендинге (данные SSR-rendered), упрощённый fade решает задачу reveal без дополнительной сложности.

### ANI-01 (Cases Scroll Transition)

- **D-06:** **Существующий хук `use-cases-pin-scroll-progress.ts` сохраняется как основа**. Он уже не использует CSS `animation-timeline` — это JS-based скролл-прогресс через `scrollY` + `smootherstep01`, архитектурно Safari-совместимый. Phase 4 задача — верифицировать его работу в Safari и устранить найденные глитчи, НЕ переписывать.
- **D-07:** Если верификация в Safari выявит рассинхронизацию pin-зоны (частая Safari-проблема — `position: sticky` + `transform` на родителе), использовать `motion` `useScroll({ target })` с `offset` как drop-in замену расчёта прогресса внутри хука — остальная логика весов/переходов не меняется.
- **D-08:** Opacity/translate переходы внутри cases section (vertStrip, divider, adHeader, adStrip) могут остаться на CSS transitions с weights из хука ИЛИ мигрировать на `motion.div` с `animate={{ opacity: weights.x }}`. Решение per-file при реализации — оставляется на усмотрение planner/executor (Claude's Discretion).

### CSS Hover Transitions

- **D-09:** **Hover-эффекты на Tailwind CSS остаются как есть** (не мигрируют на `whileHover`). Причина: нативные CSS hover transitions работают стабильно в Safari (подтверждено на фазах 2–3); миграция создаёт риск регрессий без выигрыша. Исключение — только если конкретный hover мерцает в Safari (тогда точечный фикс через `motion`).

### Safari Verification

- **D-10:** **Верификация — ручной прогон в Safari latest** на macOS для phase 4 UAT (по аналогии с Chrome UAT в phases 2–3). Автоматизация через Playwright WebKit откладывается в Phase 6 (Testing). Причина: Phase 6 дедикейтед на тесты; дублировать setup в Phase 4 создаёт scope creep.
- **D-11:** Контрольный список для Safari: (1) reveal-анимации фэйдят без мерцания; (2) ANI-01 pin держит позицию без прыжков, прогресс синхронизирован со скроллом; (3) hover-переходы без flash; (4) scroll-плавность на Safari ≥ Chrome без визуальных глитчей.

### Claude's Discretion

- Конкретный API вариант для каждого виджета (`motion.div` vs `useInView` hook vs `AnimatePresence`) — выбирается planner/executor per-file, руководствуясь D-05 (упрощённый fade) как дефолтом.
- Нужно ли точечно мигрировать отдельный hover на `whileHover` — решается при обнаружении конкретного Safari-глитча.
- Решение по D-08 (оставить CSS или мигрировать) — per-widget при реализации.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit & decisions (locked)
- `.planning/AUDIT-ANIMATIONS.md` — полный audit boneyard vs GSAP vs Framer Motion; блокирует D-01/D-02/D-03.
- `.planning/AUDIT-STACK.md` — Next.js App Router подтверждён; Framer Motion совместим с React 19 + App Router.

### Requirements & roadmap
- `.planning/REQUIREMENTS.md` §SAFARI-01, §SAFARI-02, §ANI-01, §ANI-02 — критерии приёмки Phase 4.
- `.planning/ROADMAP.md` §Phase 4 — success criteria и goal.

### Existing code (read before modifying)
- `src/widgets/cases/lib/use-cases-pin-scroll-progress.ts` — ядро ANI-01 scroll-progress. `smootherstep01`, `getCasesPinWeights`, константы `CASES_PIN_SCROLL_VH`, `CASES_PIN_HOLD_END_FRAC`.
- `src/shared/ui/boneyard-skeleton.tsx` — wrapper для миграции.
- `src/bones/registry.js` — регистр boneyard skeletons (проверить при миграции).

### State context
- `.planning/STATE.md` — зафиксированный concern: «boneyard-js + CSS transitions may need Safari-specific vendor prefix audit before Phase 4». Решение: D-01 (миграция на Framer Motion) закрывает этот риск.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`use-cases-pin-scroll-progress.ts`** — архитектурно Safari-совместимый JS-хук; сохраняется как основа ANI-01 (D-06).
- **Tailwind CSS transitions** — hover/fade базовые transitions (стабильны в Safari, D-09).
- **`BoneyardSkeleton` потребители (11 файлов):** philosophy-clients-1024/1440/narrow-stack, cases-section-360/480/768/1024/1440, team-section-photo, + `src/bones/registry.js`. Все мигрируются на `motion`.

### Established Patterns
- **Per-breakpoint компоненты** (widget-NNN.tsx) — миграцию делать отдельным файлом на брейкпоинт для минимизации diff’а.
- **JS-based scroll progress** — проект уже не полагается на CSS scroll-timeline (у cases свой hook), что упрощает Safari-парность.
- **`"use client"`** директивы на анимационных виджетах — совместимо с Framer Motion, который требует client components.

### Integration Points
- **package.json** — добавить `motion`, удалить `boneyard-js` (финальная задача phase).
- **layout.tsx / providers** — Framer Motion не требует global provider; `motion.*` компоненты самодостаточны.
- **Safari UAT** — повторить UAT-процедуру из phase 3 (браузерная проверка), но на Safari вместо Chrome.

</code_context>

<specifics>
## Specific Ideas

- D-06 важен: planner не должен переписывать `use-cases-pin-scroll-progress.ts` «на всякий случай». Трогать только при подтверждённом Safari-глитче — тогда drop-in через `useScroll` из `motion`.
- D-05 упрощение reveal: не пытаться воспроизвести shimmer — опасность оверинжиниринга ради косметики.
- Порядок миграции (D-04) критичен: `boneyard-skeleton.tsx` удаляется ПОСЛЕДНИМ, иначе TS/build ломается.

</specifics>

<deferred>
## Deferred Ideas

- **Playwright WebKit автоматизация** — Phase 6 (Testing). Уже в ROADMAP как TEST-02.
- **Pixel-perfect Safari vs Chrome sverka** — Phase 5. Phase 4 проверяет корректность поведения, не пиксельную идентичность.
- **Миграция CSS hover → `whileHover`** глобально — deferred, делать только при обнаружении точечных Safari-глитчей.
- **Новые анимации / enrichment reveal** (staggered children, spring physics) — out of scope, feature backlog.

</deferred>

---

*Phase: 04-safari-animations*
*Context gathered: 2026-04-22*
