"use client";

/**
 * useActivityTimer — accumulator-based activity timer для TG-popup (Phase 10).
 *
 * Считает время **активного** пребывания пользователя на странице. Когда
 * накопленное время достигает `durationMs` — вызывает `onElapsed` ровно один
 * раз. Не считает время:
 *   - в idle (30+ секунд без событий активности),
 *   - когда вкладка скрыта (`document.visibilityState === "hidden"`).
 *
 * Activity events (D1 locked, см. .planning/phases/10-tg-popup/10-CONTEXT.md):
 *   scroll / mousemove / keydown / touchstart / pointermove.
 *
 * Tick: 1 секунда. После fire больше не вызывает onElapsed.
 *
 * Пример:
 *   useActivityTimer(60_000, () => setTgPopupOpen(true));
 */
import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS = [
  "scroll",
  "mousemove",
  "keydown",
  "touchstart",
  "pointermove",
] as const;

const IDLE_THRESHOLD_MS = 30_000;
const TICK_MS = 1_000;

export function useActivityTimer(
  durationMs: number,
  onElapsed: () => void
): void {
  // onElapsed может пересоздаваться на каждом render — кладём в ref чтобы
  // избежать пересборки эффекта (и сброса accumulator).
  const onElapsedRef = useRef(onElapsed);
  onElapsedRef.current = onElapsed;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let accumulatedMs = 0;
    let lastActivityAt = Date.now();
    let fired = false;

    const markActivity = () => {
      lastActivityAt = Date.now();
    };

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, markActivity, { passive: true });
    }

    const intervalId = window.setInterval(() => {
      if (fired) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      const idleMs = Date.now() - lastActivityAt;
      if (idleMs >= IDLE_THRESHOLD_MS) return;
      accumulatedMs += TICK_MS;
      if (accumulatedMs >= durationMs) {
        fired = true;
        onElapsedRef.current();
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, markActivity);
      }
    };
  }, [durationMs]);
}
