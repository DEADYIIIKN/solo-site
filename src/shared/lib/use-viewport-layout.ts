"use client";

import { useEffect, useState } from "react";

export type ViewportLayout = "360" | "480" | "768" | "1024" | "1440";

export function resolveViewportLayout(width: number): ViewportLayout {
  if (width >= 1440) return "1440";
  if (width >= 1024) return "1024";
  if (width >= 768) return "768";
  if (width >= 480) return "480";
  return "360";
}

export function useViewportLayout(): ViewportLayout | null {
  const [layout, setLayout] = useState<ViewportLayout | null>(null);

  useEffect(() => {
    const updateLayout = () => {
      setLayout(resolveViewportLayout(window.innerWidth));
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  return layout;
}
