---
phase: 07-modal-unification
plan: 04
subsystem: widgets/first-screen
tags: [refactor, cleanup, bwd-compat-removal, traceability, phase-close]
requires:
  - 07-01 (model-файл)
  - 07-02 (base + variants)
  - 07-03 (thin wrappers)
provides:
  - "modal-1440 финальный thin wrapper без re-exports (23 строки)"
  - ".planning/phases/07-modal-unification/07-SVERKA.md (preparation document для manual Figma sverka)"
affects:
  - "src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx (re-exports removed)"
  - "src/widgets/first-screen/ui/first-screen-{360,480,768,1024,1440}-section.tsx (импорты types на model-файл)"
  - "src/shared/lib/open-consultation-modal.ts (импорт types на model-файл)"
  - ".planning/REQUIREMENTS.md (REFAC-01/02/03 → Satisfied)"
tech-stack:
  added: []
  patterns:
    - "Direct model-file imports (no re-export indirection): все потребители types/const берут из @/widgets/first-screen/model/first-screen-consultation-form-state"
key-files:
  created:
    - .planning/phases/07-modal-unification/07-SVERKA.md
    - .planning/phases/07-modal-unification/deferred-items.md
    - .planning/phases/07-modal-unification/07-04-SUMMARY.md
  modified:
    - src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx
    - src/widgets/first-screen/ui/first-screen-360-section.tsx
    - src/widgets/first-screen/ui/first-screen-480-section.tsx
    - src/widgets/first-screen/ui/first-screen-768-section.tsx
    - src/widgets/first-screen/ui/first-screen-1024-section.tsx
    - src/widgets/first-screen/ui/first-screen-1440-section.tsx
    - src/shared/lib/open-consultation-modal.ts
    - .planning/REQUIREMENTS.md
decisions:
  - "Manual Figma sverka — handoff главному агенту/пользователю. Дев-сервер можно поднять, но визуальное сличение Figma macет ↔ браузер требует human evaluation. Документ 07-SVERKA.md описывает шаги."
  - "ROADMAP.md / STATE.md не трогаются — это работа оркестратора (per success_criteria)."
  - "Pre-existing eslint issues (privacy/page.tsx no-html-link, philosophy-clients unused var) deferred — out of scope Phase 7."
metrics:
  duration: ~7min
  tasks_completed: 2 (Task 1 auto + Task 3 docs; Task 2 checkpoint = handoff)
  files_modified: 7 (code) + 1 (REQUIREMENTS) + 3 (planning docs)
  loc_delta: -8 (re-export tail убран из modal-1440)
  completed: 2026-04-27
requirements:
  - REFAC-01
  - REFAC-02
  - REFAC-03
---

# Phase 7 Plan 4: Cleanup + REFAC traceability close — Summary

Финальный cleanup Phase 7. Удалены backwards-compat re-exports types из `first-screen-consultation-modal-1440.tsx` (введённые в Plan 07-01 как переходный bridge), все 6 потребителей переключены на прямой импорт из model-файла. REFAC-01/02/03 закрыты в REQUIREMENTS.md. Manual Figma sverka — handoff пользователю.

## Что сделано

### Task 1: Удаление re-exports + переключение потребителей (commit `495e411`)

**modal-1440.tsx (23 → 23 строки, БЕЗ re-export tail):**
- Удалены строки 11-17 — `export type { ... }` и `export { defaultFirstScreen... }` из model-файла.
- Файл соответствует target shape из плана: pure thin wrapper делегирует в `<ConsultationModal variant="1440" {...props} />`.

**6 потребителей переключены на прямой импорт `@/widgets/first-screen/model/first-screen-consultation-form-state`:**
- `src/shared/lib/open-consultation-modal.ts` — `FirstScreenConsultationModalTitleVariant`
- `src/widgets/first-screen/ui/first-screen-360-section.tsx` — types
- `src/widgets/first-screen/ui/first-screen-480-section.tsx` — types
- `src/widgets/first-screen/ui/first-screen-768-section.tsx` — types
- `src/widgets/first-screen/ui/first-screen-1024-section.tsx` — types
- `src/widgets/first-screen/ui/first-screen-1440-section.tsx` — types (component-import остался на modal-1440)

### Task 2: Manual Figma sverka — HANDOFF (no commit)

Файл `.planning/phases/07-modal-unification/07-SVERKA.md` создан как preparation document. **Sverka сама не выполнялась агентом** — это manual gating step требующий visual evaluation (CONTEXT.md D5 явно говорит «manual sverka»).

Подготовка для проверяющего:
- Все автоматические gates зелёные.
- Dev server можно поднять `pnpm run dev`.
- Документ 07-SVERKA.md описывает breakpoints и Figma node-id, что проверять, и шаблон фиксации результата.

**Главный агент / пользователь:** выполните manual sverka на 1 breakpoint (рекомендация — 1440), заполните «Результат sverka» в 07-SVERKA.md.

### Task 3: Traceability обновление (включается в финальный commit)

**`.planning/REQUIREMENTS.md`:**
- Чекбоксы `[ ]` → `[x]` для REFAC-01, REFAC-02, REFAC-03.
- Traceability table: `Pending` → `Satisfied`, Phase → `7`.

**ROADMAP.md / STATE.md** — НЕ трогается (per objective: оркестратор это делает).

## Test Suite Results

Запускалось из основного репо (`/Users/a_savinkov/solo-site`):

| Check | Result |
|---|---|
| `pnpm exec tsc --noEmit` | clean |
| `pnpm exec vitest run` | **26/26 pass** (3 файла) |
| `pnpm exec playwright test consultation-modal.spec.ts` | **4 pass / 2 skipped** (chromium+webkit-1440; mobile-safari skipped — config) |
| `pnpm exec playwright test cross-browser.spec.ts` | **6 pass** (chromium + webkit + mobile-safari) |
| `pnpm exec eslint src/` | 1 error + 1 warning, **оба pre-existing вне Phase 7 scope** (privacy/page.tsx, philosophy-clients) |

## Финальная статистика Phase 7

**LOC reduction (consultation-modal subsystem):**
- Before Phase 7: 2424 строки в 5 идентичных файлах
- After Phase 7: 1124 строки total (754 base + 255 variants + 5×23 thin wrappers)
- Wrappers только: 115 строк (-95%)
- Net reduction subsystem: 2424 → 1124 (-54% при добавленной model-файле)

**Файлы созданные за Phase 7:**
- `src/widgets/first-screen/model/first-screen-consultation-form-state.ts` (24 строки, Plan 07-01)
- `src/widgets/first-screen/ui/consultation-modal.tsx` (754 строки, Plan 07-02)
- `src/widgets/first-screen/ui/consultation-modal-variants.ts` (255 строк, Plan 07-02)
- `.planning/phases/07-modal-unification/07-SVERKA.md` (Plan 07-04)

**Файлы изменённые за Phase 7:**
- 5 thin wrappers `first-screen-consultation-modal-{360,480,768,1024,1440}.tsx`
- 5 sections `first-screen-{360,480,768,1024,1440}-section.tsx`
- `first-screen.tsx`, `lead-form-fields.tsx`, `open-consultation-modal.ts`
- `REQUIREMENTS.md`

**Commits Phase 7 (10 total):**
- 07-01: `6c231f9`, `c6ca00b`, merge `c93a810`
- 07-02: `a51ad75`, `3717499`, docs `0dd7298`, merge `4ea571f`
- 07-03: `d2dd95c`, `df9921d`, docs `bb0da54`, merge `b8759dd`
- 07-04: `495e411` (this plan, Task 1)

**Time:**
- 07-01: ~10min
- 07-02: ~25min
- 07-03: ~10min
- 07-04: ~7min (без manual sverka)
- **Total agent time: ~52min**

## Key decisions honored

- **D1 (variant prop):** ✓ один `ConsultationModal` принимающий `variant: "360"|...|"1440"`.
- **D2 (co-location):** ✓ всё живёт в `src/widgets/first-screen/`.
- **D3 (big-bang):** ✓ конверсия 5 файлов в одном Plan 07-03 (2 commit'а).
- **D4 (submit shape unchanged):** ✓ callback prop pattern сохранён, FUNC-01..04 — Phase 8.
- **D5 (Figma sverka):** ⏳ PENDING — handoff пользователю/главному агенту через 07-SVERKA.md.

## Behavioral disclosure

Success-step animation теперь играет flow `form → leave → success` на breakpoints 360/480/768/1024 (раньше — instant switch на boolean). Approved через Plan 07-02 design decision. E2E тесты прошли с этим поведением.

## Готовность к Phase 8

- Один submit handler в одном месте (`consultation-modal.tsx`).
- FUNC-01..04 (form submission wiring) могут быть централизованы в одной точке.
- Phase 8 разблокирован.

## Deviations from Plan

**None** — план выполнен как написан. Нюанс: Task 2 (manual Figma sverka) — handoff, что соответствует CONTEXT.md D5 и objective этого выполнения.

## Manual Figma Sverka — HANDOFF (явное уведомление)

⚠️ **Главный агент / пользователь:** sverka не выполнялась агентом-исполнителем worktree. Dev server поднимался для проверки автоматизации (HTTP 200), но визуальное сличение Figma макета и браузерного рендера требует human evaluation. Шаги и Figma node-id описаны в `07-SVERKA.md`. Заполните секцию «Результат sverka» после проверки.

## Self-Check: PASSED

- `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx` — 23 lines, no re-exports, FOUND.
- `grep "from.*first-screen-consultation-modal-1440" src/` → only component-import in `first-screen-1440-section.tsx`. No type imports remaining.
- Commit `495e411` (Task 1) — FOUND in git log.
- `tsc --noEmit` — zero errors.
- `vitest run` — 26/26 passing.
- `consultation-modal.spec.ts` — 4 passed, 2 skipped (config).
- `cross-browser.spec.ts` — 6 passed.
- REQUIREMENTS.md: REFAC-01/02/03 marked `[x]` and `Satisfied`.
- 07-SVERKA.md FOUND.
