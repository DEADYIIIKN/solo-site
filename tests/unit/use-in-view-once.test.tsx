/**
 * Hook from src/widgets/team/ui/team-shared.tsx — fires inView=true
 * once when IntersectionObserver reports isIntersecting, and never refires
 * (state set to true; subsequent intersections cannot flip it back).
 */
import { act, render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInViewOnce } from "@/widgets/team/ui/team-shared";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let lastCallback: ObserverCallback | null = null;
let observeCalls = 0;
let disconnectCalls = 0;

class MockIntersectionObserver {
  callback: ObserverCallback;
  constructor(cb: ObserverCallback) {
    this.callback = cb;
    lastCallback = cb;
  }
  observe() {
    observeCalls += 1;
  }
  unobserve() {}
  disconnect() {
    disconnectCalls += 1;
  }
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

beforeEach(() => {
  lastCallback = null;
  observeCalls = 0;
  disconnectCalls = 0;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function Probe({ onState }: { onState: (inView: boolean) => void }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  useEffect(() => {
    onState(inView);
  }, [inView, onState]);
  return <div ref={ref} />;
}

describe("useInViewOnce", () => {
  it("starts as inView=false and does not fire before observer triggers", () => {
    const states: boolean[] = [];
    render(<Probe onState={(v) => states.push(v)} />);
    expect(states).toEqual([false]);
    expect(observeCalls).toBe(1);
  });

  it("flips inView=true once when entry.isIntersecting", () => {
    const states: boolean[] = [];
    render(<Probe onState={(v) => states.push(v)} />);
    expect(lastCallback).not.toBeNull();

    act(() => {
      lastCallback!([{ isIntersecting: true }]);
    });

    expect(states[states.length - 1]).toBe(true);
  });

  it("does not refire / flip back when intersection later becomes false", () => {
    const states: boolean[] = [];
    render(<Probe onState={(v) => states.push(v)} />);

    act(() => {
      lastCallback!([{ isIntersecting: true }]);
    });
    const firstTrueIdx = states.indexOf(true);
    expect(firstTrueIdx).toBeGreaterThanOrEqual(0);

    // Subsequent non-intersecting events MUST NOT flip inView back to false
    act(() => {
      lastCallback!([{ isIntersecting: false }]);
      lastCallback!([{ isIntersecting: true }]);
      lastCallback!([{ isIntersecting: false }]);
    });

    // After first true emission, no false should ever be observed again
    const tail = states.slice(firstTrueIdx);
    expect(tail.every((v) => v === true)).toBe(true);
    expect(states[states.length - 1]).toBe(true);
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<Probe onState={() => {}} />);
    unmount();
    expect(disconnectCalls).toBe(1);
  });
});
