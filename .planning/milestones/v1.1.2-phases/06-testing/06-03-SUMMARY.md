---
phase: 06-testing
plan: 03
subsystem: testing
tags: [unit, vitest, jsdom, testing-library]
requires:
  - 06-02 (Playwright e2e baseline)
provides:
  - "Vitest unit harness (jsdom + RTL)"
  - "Phone format / form validation / useInViewOnce coverage"
affects:
  - vitest.config.ts
  - tests/unit/
tech-stack:
  added:
    - vitest@4.1.5
    - jsdom@29.1.0
    - "@vitest/ui@4.1.5"
    - "@testing-library/react@16.3.2"
    - "@testing-library/jest-dom@6.9.1"
    - "@testing-library/dom@10.4.1"
    - "@vitejs/plugin-react@6.0.1"
  patterns:
    - "Mock IntersectionObserver via vi.stubGlobal for hook tests"
    - "Pure-function rule mirror for submit-guard validation"
key-files:
  created:
    - vitest.config.ts
    - tests/unit/setup.ts
    - tests/unit/phone-format.test.ts
    - tests/unit/lead-form-validation.test.ts
    - tests/unit/use-in-view-once.test.tsx
  modified:
    - package.json
decisions:
  - "Vitest 4 (rolldown-vite) требует @vitejs/plugin-react для TSX — esbuild.jsx config alone недостаточно"
  - "Submit-guard валидация тестируется через зеркальную чистую функцию canSubmitLeadForm — оригинал inline в JSX (lead-form-fields.tsx:212), извлекать ради тестов overkill"
metrics:
  duration_minutes: 4
  tasks_completed: 7
  files_changed: 6
  tests_added: 26
  completed_date: 2026-04-27
---

# Phase 6 Plan 3: Unit Testing (Vitest + jsdom) Summary

Vitest harness с jsdom поднят; 26 unit-тестов покрывают phone formatting, lead-form submit guard и `useInViewOnce` (включая защиту от refire).

## Tasks

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Install vitest + RTL deps | `00b57c8` | package.json, pnpm-lock.yaml |
| 2-3 | vitest.config.ts + npm scripts | `f0fadd4` | vitest.config.ts, tests/unit/setup.ts, package.json |
| 4 | Phone format tests (14) | `13e86d0` | tests/unit/phone-format.test.ts |
| 5 | Lead-form validation tests (8) | `dc71435` | tests/unit/lead-form-validation.test.ts |
| 6 | useInViewOnce hook tests (4) + plugin-react | `b991a73` | tests/unit/use-in-view-once.test.tsx, vitest.config.ts |

## Test Coverage

### `tests/unit/phone-format.test.ts` (14 cases)
- `formatConsultationPhone`: empty input, progressive typing (`9` → `+7 (9`, `7912` → `+7 (912)`, full 11 digits → `+7 (912) 345-67-89`), `8`-prefix normalisation, paste-of-formatted, 10-digit-no-country fallback, 11+ digit truncation.
- `formatConsultationPhoneBackspace`: caret-at-zero, caret-after-digit (let browser handle), caret-after-non-digit (delete nearest left digit), caret near country code.
- `isConsultationPhoneValid`: 11-digit + leading 7/8 only.

### `tests/unit/lead-form-validation.test.ts` (8 cases)
Mirror of submit guard at `src/widgets/lead-form/ui/lead-form-fields.tsx:212` — `canSubmitLeadForm` requires trimmed name + valid phone + consent. Cases: all-valid, empty/whitespace name, empty/short phone, unchecked consent, all-invalid, leading-8 phone.

### `tests/unit/use-in-view-once.test.tsx` (4 cases)
- Initial state `inView=false`; observer's `observe()` invoked once.
- Triggering `isIntersecting: true` flips `inView=true`.
- Subsequent `isIntersecting: false` events do **not** flip `inView` back (the once-only guarantee).
- Observer disconnected on unmount.

`IntersectionObserver` мокается через `vi.stubGlobal` — сохраняем callback для контролируемых триггеров.

## NPM Scripts

```json
"test:unit": "vitest run",
"test:unit:watch": "vitest",
"test:unit:ui": "vitest --ui"
```

## Verification

```
$ pnpm run test:unit
 Test Files  3 passed (3)
      Tests  26 passed (26)
   Duration  1.47s
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] JSX transform under Vitest 4**
- **Found during:** Task 6 (hook test).
- **Issue:** Vitest 4 использует rolldown-vite по умолчанию; одного `esbuild.jsx: "automatic"` недостаточно — TSX-файлы фейлят парсер при `<div ref={ref} />`.
- **Fix:** Добавлен `@vitejs/plugin-react@6.0.1` в devDeps, подключён в `plugins: [react()]`.
- **Files modified:** vitest.config.ts, package.json.
- **Commit:** `b991a73`.

**2. [Rule 3 — Blocking] First-true assertion в hook тесте**
- **Found during:** Task 6.
- **Issue:** Initial render emits `inView=false` через `useEffect`-проба → `expect(states).not.toContain(false)` фейлится.
- **Fix:** Изменил утверждение на «после первой `true` — все эмиссии остаются `true`» (`tail.every(v => v === true)`), что точнее отражает контракт хука.
- **Commit:** `b991a73`.

### Deferred / Notes
- `formatConsultationPhone("7912")` → `+7 (912)` (закрывающая скобка добавляется на 3-м символе) — поведение зафиксировано тестом, но косметически курсор после `(912)` иногда воспринимается странно. Это existing behaviour, не задача этого плана.
- Submit-guard остаётся inline в JSX. Зеркальная функция в тесте поддерживает rule, но при изменении оригинала тест и оригинал нужно править параллельно. Извлечение в `lib/lead-form-validation.ts` — кандидат для следующей рефакторинг-волны.

## Self-Check

- [x] vitest.config.ts существует
- [x] tests/unit/phone-format.test.ts существует
- [x] tests/unit/lead-form-validation.test.ts существует
- [x] tests/unit/use-in-view-once.test.tsx существует
- [x] `pnpm run test:unit` exit 0 (3 files, 26 tests)
- [x] Все task-коммиты в git log: 00b57c8, f0fadd4, 13e86d0, dc71435, b991a73

## Self-Check: PASSED
