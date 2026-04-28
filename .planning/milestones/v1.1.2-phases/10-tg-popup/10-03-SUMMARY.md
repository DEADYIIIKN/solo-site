---
phase: 10-tg-popup
plan: 03
subsystem: tg-popup
tags: [integration, layout, env-var, sessionStorage, refactor]
requires:
  - src/shared/lib/use-activity-timer.ts (10-01)
  - src/widgets/tg-popup/ui/tg-popup.tsx (10-02)
  - src/shared/lib/use-viewport-layout.ts
provides:
  - src/widgets/tg-popup/ui/tg-popup-host.tsx
  - "<TgPopupHost /> в src/app/(site)/layout.tsx"
affects:
  - src/widgets/footer/ui/footer-1440.tsx
  - src/widgets/footer/ui/footer-1024.tsx
  - src/widgets/footer/ui/footer-768.tsx
  - src/widgets/footer/ui/footer-480.tsx
  - src/widgets/footer/ui/footer-360.tsx
tech-stack:
  added: []
  patterns:
    - "Two-component gate pattern (outer gates + inner active component) для безусловного вызова useActivityTimer (Rules of Hooks)"
    - "sessionStorage gate с null-state до mount чтобы избежать SSR mismatch"
key-files:
  created:
    - src/widgets/tg-popup/ui/tg-popup-host.tsx
  modified:
    - src/widgets/tg-popup/index.ts
    - src/app/(site)/layout.tsx
    - src/widgets/footer/ui/footer-1440.tsx
    - src/widgets/footer/ui/footer-1024.tsx
    - src/widgets/footer/ui/footer-768.tsx
    - src/widgets/footer/ui/footer-480.tsx
    - src/widgets/footer/ui/footer-360.tsx
decisions:
  - "Inner-component gate (TgPopupHostActive) вместо передачи Infinity в useActivityTimer — explicit и совместим с Rules of Hooks"
  - "sessionStorage error fallback → setDismissed(false) — приватный режим Safari не блокирует pop-up, но dismiss не персистится"
  - "Footer fallback на hardcoded https://t.me/soloproduction в `??` — поведение не меняется при отсутствии env var"
metrics:
  duration: ~10min
  completed: 2026-04-27
---

# Phase 10 Plan 03: TgPopupHost Integration Summary

Wiring foundation (10-01 useActivityTimer) и UI (10-02 TgPopup) в работающий feature: глобальный `TgPopupHost` с env/session/variant gating, регистрация в site layout, рефактор 5 footer файлов на единый env var источник TG-канала URL.

## What Shipped

### Task 1: TgPopupHost component
**Files:** `src/widgets/tg-popup/ui/tg-popup-host.tsx`, `src/widgets/tg-popup/index.ts`
**Commit:** `2a89194`

Двухкомпонентная архитектура для соблюдения Rules of Hooks:
- **Outer `TgPopupHost`** — три early-return гейта (env / sessionStorage / viewport variant). Если любой не пройден — `null`, никаких хуков активности.
- **Inner `TgPopupHostActive`** — рендерится только когда все гейты прошли; безусловно вызывает `useActivityTimer(60_000, ...)`.

Gate logic:
1. **Env gate** — `process.env.NEXT_PUBLIC_TG_CHANNEL_URL ?? ""` — если пусто, silent skip (TG-04).
2. **Session gate** — `sessionStorage["tg-popup-dismissed"] === "1"` — если dismissed, skip до закрытия вкладки (TG-03).
3. **Variant gate** — `useViewportLayout()` возвращает `null` до mount → ждём.

Dismiss handler: `setOpen(false)` + `sessionStorage.setItem("tg-popup-dismissed", "1")`. Safari private mode protected через `try/catch`.

### Task 2: Layout integration + .env.example
**Files:** `src/app/(site)/layout.tsx`
**Commit:** `bbd6415`

`<TgPopupHost />` зарегистрирован после `<SiteLoadOverlay />` внутри `<SiteMotionConfig>`. `.env.example` уже содержал нужный блок (закомментированную `NEXT_PUBLIC_TG_CHANNEL_URL=https://t.me/your_channel`) — изменений не потребовалось.

### Task 3: Footer refactor (single source of truth)
**Files:** 5 footer файлов (1440/1024/768/480/360)
**Commit:** `1278560`

Hardcoded `href="https://t.me/soloproduction"` заменено на `href={process.env.NEXT_PUBLIC_TG_CHANNEL_URL ?? "https://t.me/soloproduction"}`. Поведение по умолчанию идентично, но теперь единый env var управляет URL во всех footer'ах И в pop-up.

## Verification

- `npx tsc --noEmit` — clean (run после каждой таски).
- `grep -c NEXT_PUBLIC_TG_CHANNEL_URL src/widgets/footer/ui/footer-*.tsx` → 1 в каждом из 5 файлов.
- `grep TgPopupHost src/app/\(site\)/layout.tsx` → импорт + JSX render.

## Manual Verification Handoff (для главного агента)

Worktree dev-server недоступен → preview MCP проверка делается главным агентом после merge. Чек-лист:

1. **60s trigger** — открыть localhost, активно скроллить/двигать мышь 60s → pop-up появляется.
2. **Dismiss persistence** — закрыть pop-up (✕ / overlay / ESC / CTA) → `window.sessionStorage.getItem("tg-popup-dismissed")` === `"1"` → reload страницы → pop-up НЕ появляется снова.
3. **Tab reopen** — закрыть вкладку, переоткрыть → sessionStorage очищен → pop-up снова появляется через 60s.
4. **Silent skip** — убрать/не задавать `NEXT_PUBLIC_TG_CHANNEL_URL` в `.env.local` → restart dev → pop-up не показывается, никаких listeners не регистрируется.
5. **Footer regression** — все 5 footer breakpoints (1440/1024/768/480/360) — TG-кнопка кликабельна, ведёт на t.me/soloproduction (default fallback) либо на значение env var.
6. **Idle pause** — установить env var → пробыть idle 30+ s (не двигаясь) → таймер не должен накапливать время в idle (D1 в 10-CONTEXT.md).
7. **Background tab** — переключиться в другую вкладку на 60s → pop-up не должен срабатывать пока вкладка hidden (D1 visibility check).

## Deviations from Plan

None — план выполнен точно как написан. Использован «второй вариант» (clean inner-gate) из task 1 spec, как и рекомендовал планнер.

## Self-Check

- File `src/widgets/tg-popup/ui/tg-popup-host.tsx`: FOUND
- File `src/widgets/tg-popup/index.ts`: FOUND (TgPopupHost export added)
- File `src/app/(site)/layout.tsx`: FOUND (TgPopupHost import + render)
- File `.env.example`: FOUND (NEXT_PUBLIC_TG_CHANNEL_URL documented)
- 5 footer files: FOUND (env var в каждом)
- Commit `2a89194`: FOUND
- Commit `bbd6415`: FOUND
- Commit `1278560`: FOUND

## Self-Check: PASSED
