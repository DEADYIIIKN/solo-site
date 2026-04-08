"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.12, ...options },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, inView] as const;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(target: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let cancelled = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs, enabled]);

  return value;
}

export function TeamStatValue({
  target,
  format,
  suffix,
  active,
}: {
  target: number;
  format: "plus-suffix" | "plus-only" | "plain";
  suffix: string;
  active: boolean;
}) {
  const n = useCountUp(target, 1600, active);

  if (format === "plain") {
    return <span className="tabular-nums">{n}</span>;
  }
  if (format === "plus-only") {
    return (
      <span className="tabular-nums">
        {n}
        +
      </span>
    );
  }
  return (
    <span className="tabular-nums">
      {n}+{suffix}
    </span>
  );
}
