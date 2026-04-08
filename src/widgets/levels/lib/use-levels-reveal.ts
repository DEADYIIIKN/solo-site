"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Однократное появление блока «Уровни» при входе в вьюпорт + учёт prefers-reduced-motion.
 */
export function useLevelsReveal(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const threshold = options?.threshold ?? 0.14;
  const rootMargin = options?.rootMargin ?? "0px 0px -8% 0px";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const delay = useMemo(
    () => (ms: number) => (reduceMotion ? 0 : ms),
    [reduceMotion],
  );

  return { ref, shown, reduceMotion, delay };
}
