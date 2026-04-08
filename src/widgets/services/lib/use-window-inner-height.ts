"use client";

import { useLayoutEffect, useState } from "react";

/** Для расчёта pin (vh + CAP) без SSR-рассинхрона после гидрации. */
export function useWindowInnerHeight(fallback = 900): number {
  const [h, setH] = useState(fallback);

  useLayoutEffect(() => {
    const read = () => setH(window.innerHeight);
    read();
    window.addEventListener("resize", read, { passive: true });
    return () => window.removeEventListener("resize", read);
  }, []);

  return h;
}
