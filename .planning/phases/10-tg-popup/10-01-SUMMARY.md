---
phase: 10-tg-popup
plan: 01
subsystem: shared/lib
tags: [hook, timer, activity-tracking, tg-popup, tdd]
requires: []
provides:
  - "useActivityTimer хук — accumulator timer с idle/visibility gate (D1 locked)"
  - "TEST-07 — unit-тесты activity tracker"
affects: []
tech-stack:
  added: []
  patterns:
    - "useEffect + useRef для onElapsed callback (стабильность между рендерами)"
    - "passive event listeners для скролла"
    - "vi.useFakeTimers + vi.setSystemTime для unit-теста timer-логики"
key-files:
  created:
    - src/shared/lib/use-activity-timer.ts
    - tests/unit/use-activity-timer.test.tsx
  modified: []
decisions:
  - "onElapsed хранится в useRef — эффект пересоздаётся только при изменении durationMs (избегаем сброса accumulator при каждом render)"
  - "visibility check через typeof document !== 'undefined' — defensive для SSR/edge"
  - "Single-fire через локальный fired флаг — onElapsed гарантированно вызывается ровно один раз"
metrics:
  tasks: 1
  duration_minutes: 5
  completed: 2026-04-27
requirements:
  - TG-01 (foundation, full requirement closes в 10-03)
  - TEST-07
---

# Phase 10 Plan 01: useActivityTimer hook + unit tests Summary

Created testable foundation для TG-popup: хук `useActivityTimer(durationMs, onElapsed)` с idle (30s) и visibility gating per D1 locked, плюс 5 unit-тестов покрывающих все ветки логики.

## Artifact

**`src/shared/lib/use-activity-timer.ts`** (78 строк)

API:
```typescript
useActivityTimer(durationMs: number, onElapsed: () => void): void
```

Поведение (D1 locked):
- Activity events: `scroll`, `mousemove`, `keydown`, `touchstart`, `pointermove` (passive)
- Tick: 1 секунда (`setInterval`)
- Idle gate: если `Date.now() - lastActivityAt >= 30_000` — accumulator не растёт
- Visibility gate: если `document.visibilityState === "hidden"` — accumulator не растёт
- Single-fire: `onElapsed` вызывается ровно один раз когда accumulator достигает `durationMs`
- Cleanup: `clearInterval` + `removeEventListener` на unmount

## Behaviors Covered (TEST-07)

| # | Test | Что проверяет |
|---|------|---------------|
| 1 | happy path | onElapsed вызывается через durationMs накопленной активности |
| 2 | idle gate | НЕ вызывает onElapsed когда 30+ секунд без событий |
| 3 | visibility gate | НЕ вызывает onElapsed когда document.visibilityState === "hidden" |
| 4 | cleanup | На unmount все 5 listeners удалены, interval очищен (нет leak'ов) |
| 5 | accumulator persistence | После idle и возобновления активности — accumulator продолжает с того же места, не сбрасывается |

## Test Commands

```bash
# Только этот файл
npx vitest run tests/unit/use-activity-timer.test.tsx

# Полный unit-suite (verify regression)
npm run test:unit
```

Результат: **5/5 tests pass**, full suite **45/45 pass**, `tsc --noEmit` clean.

## Deviations from Plan

None — plan executed exactly как написан с одной микро-корректировкой test fixtures:

В тестах (idle gate, accumulator persistence) пришлось увеличить `durationMs` (5s → 120s) и шкалу прогрева, потому что под `vi.useFakeTimers()` `Date.now()` синхронен с timer'ом и первые ~30 тиков idle всё ещё проходят idle gate (idleMs<30s). Это совпадает с реальным поведением хука в проде — D1 предполагает `durationMs=60_000` (60s), что больше idle threshold. Логика хука корректна; тесты просто отражают реальный сценарий использования.

## Commits

- `92e6cfa` — test(10-01): RED — failing тесты
- `c4092a4` — feat(10-01): GREEN — реализация хука + tests pass

## Self-Check: PASSED

- [x] `src/shared/lib/use-activity-timer.ts` exists (78 lines, exports `useActivityTimer`)
- [x] `tests/unit/use-activity-timer.test.tsx` exists (206 lines, 5 tests pass)
- [x] Commits `92e6cfa` (RED), `c4092a4` (GREEN) present in `git log`
- [x] All success criteria met (хук, тесты, TypeScript clean, cleanup)
