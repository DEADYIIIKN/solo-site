---
phase: 07-modal-unification
plan: 01
subsystem: widgets/first-screen
tags: [refactor, model-extract, types, no-behavior-change]
requires:
  - "src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx (источник types)"
provides:
  - "src/widgets/first-screen/model/first-screen-consultation-form-state.ts (shared types + default state)"
affects:
  - "src/widgets/first-screen/ui/first-screen-consultation-modal-{360,480,768,1024,1440}.tsx"
  - "src/widgets/first-screen/ui/first-screen.tsx"
  - "src/widgets/lead-form/ui/lead-form-fields.tsx"
tech-stack:
  added: []
  patterns:
    - "Co-located model file: shared types + default const рядом с UI слоем (D2 из CONTEXT.md)"
    - "Temporary re-exports в modal-1440 для backward-compat sections и open-consultation-modal (cleanup в 07-04)"
key-files:
  created:
    - "src/widgets/first-screen/model/first-screen-consultation-form-state.ts"
  modified:
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx"
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx"
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx"
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx"
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx"
    - "src/widgets/first-screen/ui/first-screen.tsx"
    - "src/widgets/lead-form/ui/lead-form-fields.tsx"
decisions:
  - "modal-1440 НЕ импортирует defaultFirstScreenConsultationFormState внутри (он там не использовался) — импорт нужен только чтобы re-export'нуть для sections/open-consultation-modal"
  - "Sections (5 файлов) и src/shared/lib/open-consultation-modal.ts оставлены на re-exports modal-1440 — план явно скоупил 7 файлов, очистка sections планируется в Plan 07-04 после конверсии в thin wrappers"
metrics:
  duration: ~10min
  completed: 2026-04-27
requirements:
  - REFAC-01
---

# Phase 7 Plan 1: Extract Shared Form-State Types Summary

Чистый рефакторинг подготовки: вынес 4 экспорта (`FirstScreenConsultationContactMethod`, `FirstScreenConsultationFormState`, `FirstScreenConsultationModalTitleVariant`, `defaultFirstScreenConsultationFormState`) из `first-screen-consultation-modal-1440.tsx` в новый файл `src/widgets/first-screen/model/first-screen-consultation-form-state.ts`. 7 целевых файлов теперь импортируют types/const из model-файла напрямую. Никаких поведенческих или визуальных изменений.

## Что сделано

### Task 1: Создать model-файл (commit `6c231f9`)

Создан `src/widgets/first-screen/model/first-screen-consultation-form-state.ts` (24 строки):
- `export type FirstScreenConsultationModalTitleVariant = "task" | "consultation"`
- `export type FirstScreenConsultationContactMethod = "call" | "telegram" | "whatsapp"`
- `export type FirstScreenConsultationFormState` (5 полей: name, phone, message, contactMethod, consent)
- `export const defaultFirstScreenConsultationFormState`

JSDoc-комментарий к `TitleVariant` сохранён без изменений. Никакой логики, hooks, "use client" — pure types/const.

### Task 2: Переключить потребителей (commit `c6ca00b`)

**modal-1440.tsx:**
- Удалены 4 локальных экспорта (строки 15-35).
- Добавлен импорт types + default из нового model-файла.
- Добавлены re-exports types и const для backward-compat — sections и `open-consultation-modal.ts` через них продолжают разрешать имена. Будут удалены в Plan 07-04.

**modal-360/480/768/1024.tsx:**
- Только import path: `from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440"` → `from "@/widgets/first-screen/model/first-screen-consultation-form-state"`. Тело модалок не трогалось (это Plan 07-03).

**first-screen.tsx:**
- Объединены два импорта (`defaultFirstScreenConsultationFormState` + `type FirstScreenConsultationModalTitleVariant`) в один из model-файла.

**lead-form-fields.tsx:**
- Path меняется на model-файл, форма импорта (mixed type/value) сохранена.

## Verification

- `tsc --noEmit` — zero errors.
- `vitest run` — 26/26 tests passing (3 файла: phone-format, lead-form-validation, и др.).
- `git diff --stat` — 7 файлов modified + 1 файл created, как и требовал план.
- Sanity grep `from ".../first-screen-consultation-modal-1440"` показывает только sections (5) и open-consultation-modal — это компонент-импорт + temporary re-exported types, скоуп Plan 07-04.

### E2E (deferred)

`pnpm exec playwright test tests/e2e/consultation-modal.spec.ts` не запускался в worktree — у worktree нет своих node_modules, webServer (`pnpm exec next dev`) падает с exit 254 ("next not found"). Запустится автоматически в основном репозитории после merge wave (Plan 07-04 содержит full test suite, в т.ч. consultation-modal.spec). Изменения чисто механические (move types в отдельный файл + update import paths), behavior identical.

## Deviations from Plan

**None** — план выполнен точно как написан.

Минимальное уточнение: план в Task 2 сказал «лишний импорт `defaultFirstScreenConsultationFormState` не оставлять, если modal-1440 его не использует». Modal-1440 действительно не использует const внутри тела — но он нужен в импорте чтобы re-export'нуть для backward-compat (sections и `open-consultation-modal.ts` импортируют его через modal-1440). Импорт + re-export — стандартный паттерн TS, не unused. Решение сохранено.

## Что осталось на следующие планы

- **Plan 07-02:** ввести `consultation-modal.tsx` (base) + `consultation-modal-variants.ts` (variant lookup table).
- **Plan 07-03:** превратить 5 modal-XXX файлов в thin wrappers `<ConsultationModal variant="XXX" />`.
- **Plan 07-04:** удалить re-exports из modal-1440, переключить sections (5) и `open-consultation-modal.ts` на прямой импорт из model-файла, прогнать full test suite + Figma sverka на 1 breakpoint.

## Self-Check: PASSED

- `src/widgets/first-screen/model/first-screen-consultation-form-state.ts` — FOUND.
- Commit `6c231f9` (Task 1) — FOUND in git log.
- Commit `c6ca00b` (Task 2) — FOUND in git log.
- 7 файлов изменены + 1 создан — verified `git diff --stat HEAD~2..HEAD`.
- tsc --noEmit — zero errors.
- vitest run — 26/26 passing.
