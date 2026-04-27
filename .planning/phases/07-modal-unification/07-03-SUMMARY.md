---
phase: 07-modal-unification
plan: 03
subsystem: first-screen-modal
tags: [refactor, big-bang, thin-wrapper, visual-parity]
requires:
  - 07-02 (ConsultationModal base + variant table)
provides:
  - 5 thin wrappers — все breakpoints делегируют в unified ConsultationModal
affects:
  - 13 callsites (импорты не меняются — backwards-compat через named re-exports)
tech-stack:
  added: []
  patterns: [variant-prop-delegation, big-bang-conversion]
key-files:
  created: []
  modified:
    - src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx (560 → 31)
    - src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx (462 → 23)
    - src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx (464 → 23)
    - src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx (475 → 23)
    - src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx (463 → 23)
decisions:
  - D3 honored — big-bang конверсия в одном PR (2 атомарных коммита: 1440 источник правды + остальные 4)
  - 1440 сохранил re-exports types/const для backwards compat (type, defaultFirstScreenConsultationFormState) — удалит Plan 07-04
  - submit handler shape без изменений (D4)
  - visual parity guard прошёл без правок variant table
metrics:
  duration: ~10 min
  tasks_completed: 3
  files_modified: 5
  loc_before: 2424
  loc_after: 123
  loc_reduction: 2301 (-95%)
  completed: 2026-04-27
---

# Phase 7 Plan 3: Big-bang конверсия в thin wrappers — Summary

Конвертировал все 5 файлов `first-screen-consultation-modal-{360,480,768,1024,1440}.tsx` в thin wrappers, делегирующие рендер в unified `ConsultationModal` (variant prop). 2424 → 123 строки (-95%); E2E + cross-browser + unit zero regression.

## Tasks

### Task 1: modal-1440 → thin wrapper (источник правды)
- 560 → 31 строка
- Сохранены re-exports: type `FirstScreenConsultationContactMethod`, `FirstScreenConsultationFormState`, `FirstScreenConsultationModalTitleVariant`, value `defaultFirstScreenConsultationFormState`
- **Commit:** `d2dd95c`

### Task 2: modal-{1024,768,480,360} → thin wrappers
- Каждый файл 23 строки, единый шаблон, отличается только `variant="NNN"` и именем функции
- **Commit:** `df9921d`

### Task 3: Visual + behavior parity guard
Все проверки пройдены **в worktree** через основной `node_modules` (`/Users/a_savinkov/solo-site/node_modules/.bin/...`):

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `eslint src/widgets/first-screen/ui` | clean |
| `playwright test consultation-modal.spec.ts` | 4 passed, 2 skipped (skipped — chromium-1024/mobile-safari config — не зависят от изменений) |
| `playwright test cross-browser.spec.ts` | 6 passed (chromium, webkit, mobile-safari) |
| `vitest run phone-format lead-form-validation` | 22 passed |

**Команды запускались из основного репо** (`cd /Users/a_savinkov/solo-site && pnpm exec playwright …`) — worktree не имеет своего `node_modules`. Это согласовано с инструкцией plan'а (parallel_execution note).

## Sanity grep результаты

```
grep -rn 'first-screen-consultation-modal-1440"' src/
```
Все 6 импортов используют только public API:
- `FirstScreenConsultationModal1440` (named export)
- `FirstScreenConsultationModalTitleVariant` (re-exported type — нужен в `open-consultation-modal.ts` и section-файлах)

Никто не импортирует исчезнувшие internal helpers (`CloseIcon`, `contactOptions`, `MODAL_TRANSITION_MS`, `CheckboxCheckIcon` и т.д.) — конверсия безопасна.

## LOC summary

| File | Before | After |
|---|---:|---:|
| consultation-modal.tsx (base, 07-02) | — | 754 |
| consultation-modal-variants.ts (07-02) | — | 255 |
| modal-1440 | 560 | 31 |
| modal-1024 | 462 | 23 |
| modal-768 | 464 | 23 |
| modal-480 | 475 | 23 |
| modal-360 | 463 | 23 |
| **Total wrappers** | **2424** | **123** |
| **Total subsystem** (incl. base + variants) | **2424** | **1132** |

## Deviations from Plan

None — plan executed exactly as written. Никаких авто-фиксов / правок variant table не потребовалось: visual parity guard прошёл с первой попытки.

## Ready-state для Plan 07-04

- Cleanup tasks для 07-04:
  - Удалить re-exports из `first-screen-consultation-modal-1440.tsx` (строки 11-17) после конверсии импортов в `open-consultation-modal.ts` и section-файлах на прямой путь `@/widgets/first-screen/model/first-screen-consultation-form-state`
  - Manual Figma sverka на всех 5 breakpoints
- Все unit/E2E зелёные → 07-04 может работать на стабильной базе

## Self-Check

- [x] modal-1440.tsx exists, 31 line
- [x] modal-{1024,768,480,360}.tsx exist, 23 lines each
- [x] commit `d2dd95c` exists (modal-1440 wrapper)
- [x] commit `df9921d` exists (modal-{1024,768,480,360} wrappers)
- [x] tsc + eslint clean
- [x] E2E + cross-browser + unit pass

## Self-Check: PASSED
