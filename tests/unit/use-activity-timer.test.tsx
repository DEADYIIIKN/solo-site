/**
 * Unit tests для useActivityTimer (TG-popup foundation, TEST-07).
 *
 * Покрытие:
 *  - happy path: onElapsed вызывается после durationMs накопленной активности
 *  - idle gate: 30+ секунд без событий — accumulator паузится
 *  - visibility gate: document.visibilityState === "hidden" — accumulator паузится
 *  - cleanup: при unmount listeners и interval удалены
 *  - accumulator persistence: после idle и возобновления активности
 *    таймер продолжает с того же места
 *
 * D1 locked (см. .planning/phases/10-tg-popup/10-CONTEXT.md):
 *  - Activity events: scroll / mousemove / keydown / touchstart / pointermove
 *  - Idle threshold: 30s
 *  - Tick: 1s
 *  - Visibility gate: document.visibilityState === "hidden" → пауза
 */
import { act, render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useActivityTimer } from "@/shared/lib/use-activity-timer";

const ACTIVITY_EVENTS = [
  "scroll",
  "mousemove",
  "keydown",
  "touchstart",
  "pointermove",
] as const;

function Probe({
  durationMs,
  onElapsed,
}: {
  durationMs: number;
  onElapsed: () => void;
}) {
  useActivityTimer(durationMs, onElapsed);
  return null;
}

function ProbeWithEffect({
  durationMs,
  onElapsed,
  onMount,
}: {
  durationMs: number;
  onElapsed: () => void;
  onMount: () => void;
}) {
  useActivityTimer(durationMs, onElapsed);
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
}

let addSpy: ReturnType<typeof vi.spyOn> | null = null;
let removeSpy: ReturnType<typeof vi.spyOn> | null = null;

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", {
    value: state,
    configurable: true,
  });
}

function dispatchActivity(eventName: string = "mousemove") {
  act(() => {
    window.dispatchEvent(new Event(eventName));
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  // baseline system time — для Date.now()
  vi.setSystemTime(new Date("2026-04-27T12:00:00Z"));
  setVisibility("visible");
  addSpy = vi.spyOn(window, "addEventListener");
  removeSpy = vi.spyOn(window, "removeEventListener");
});

afterEach(() => {
  vi.useRealTimers();
  addSpy?.mockRestore();
  removeSpy?.mockRestore();
});

describe("useActivityTimer", () => {
  it("вызывает onElapsed после durationMs накопленной активности (happy path)", () => {
    const onElapsed = vi.fn();
    render(<Probe durationMs={5_000} onElapsed={onElapsed} />);

    // 5 тиков по 1s, перед каждым — активность чтобы accumulator не паузился
    for (let i = 0; i < 5; i += 1) {
      dispatchActivity("mousemove");
      advance(1_000);
    }

    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it("НЕ вызывает onElapsed если 30+ секунд нет активности (idle gate)", () => {
    const onElapsed = vi.fn();
    render(<Probe durationMs={5_000} onElapsed={onElapsed} />);

    // Один раз отметим активность чтобы lastActivityAt был свежим
    dispatchActivity("mousemove");

    // Прокручиваем 60s БЕЗ событий — система должна войти в idle после 30s
    // Накопленный за первые ~30s tick'ов время не должен достичь 5s
    // потому что после первого тика idleMs быстро превысит 30s.
    // Точная проверка: за 60s без активности onElapsed не вызывается.
    advance(60_000);

    expect(onElapsed).not.toHaveBeenCalled();
  });

  it("НЕ вызывает onElapsed если document.visibilityState === 'hidden' (visibility gate)", () => {
    const onElapsed = vi.fn();
    setVisibility("hidden");
    render(<Probe durationMs={5_000} onElapsed={onElapsed} />);

    // Активность есть, но page hidden — accumulator не растёт
    for (let i = 0; i < 10; i += 1) {
      dispatchActivity("mousemove");
      advance(1_000);
    }

    expect(onElapsed).not.toHaveBeenCalled();
  });

  it("очищает все listeners и interval при unmount (no leaks)", () => {
    const onElapsed = vi.fn();
    const onMount = vi.fn();
    const { unmount } = render(
      <ProbeWithEffect
        durationMs={5_000}
        onElapsed={onElapsed}
        onMount={onMount}
      />
    );

    expect(onMount).toHaveBeenCalled();

    // Каждый из ACTIVITY_EVENTS должен быть зарегистрирован
    for (const evt of ACTIVITY_EVENTS) {
      expect(addSpy).toHaveBeenCalledWith(
        evt,
        expect.any(Function),
        expect.objectContaining({ passive: true })
      );
    }

    unmount();

    // После unmount — каждый listener должен быть удалён
    for (const evt of ACTIVITY_EVENTS) {
      expect(removeSpy).toHaveBeenCalledWith(evt, expect.any(Function));
    }

    // Interval должен быть очищен — даже после большой прокрутки таймера
    // onElapsed не должен вызываться (потому что хук размонтирован)
    for (let i = 0; i < 10; i += 1) {
      dispatchActivity("mousemove");
      advance(1_000);
    }
    expect(onElapsed).not.toHaveBeenCalled();
  });

  it("после возобновления активности accumulator продолжает (не сбрасывается)", () => {
    const onElapsed = vi.fn();
    render(<Probe durationMs={5_000} onElapsed={onElapsed} />);

    // Фаза 1: 3 тика активности — accumulator = 3s (< 5s, не fired)
    for (let i = 0; i < 3; i += 1) {
      dispatchActivity("mousemove");
      advance(1_000);
    }
    expect(onElapsed).not.toHaveBeenCalled();

    // Фаза 2: idle 60s — accumulator паузится, не сбрасывается
    advance(60_000);
    expect(onElapsed).not.toHaveBeenCalled();

    // Фаза 3: возобновление активности — нужно ещё 2 тика чтобы достичь 5s
    for (let i = 0; i < 2; i += 1) {
      dispatchActivity("mousemove");
      advance(1_000);
    }

    expect(onElapsed).toHaveBeenCalledTimes(1);
  });
});
