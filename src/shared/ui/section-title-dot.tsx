import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/utils";

export type SectionTitleDotProps = {
  className?: string;
};

/**
 * Оранжевая точка у eyebrow (Ellipse 135 в Figma). Всегда круг **10×10px** — один вид на всём сайте;
 * отдельные `variant` / `size` убраны, чтобы не путать с узким эллипсом из старых мобильных макетов.
 * `span` + заливка, не `<img>` (в flex с preserveAspectRatio картинка превращалась в полоску).
 */
const BOX =
  "box-border block h-[10px] w-[10px] min-h-[10px] min-w-[10px] max-h-[10px] max-w-[10px] shrink-0 flex-none overflow-hidden rounded-full bg-[var(--color-accent)]";

const PIXEL_LOCK: CSSProperties = {
  width: 10,
  height: 10,
  minWidth: 10,
  minHeight: 10,
  maxWidth: 10,
  maxHeight: 10,
};

export function SectionTitleDot({ className }: SectionTitleDotProps) {
  return (
    <span
      aria-hidden
      data-section-title-dot=""
      className={cn(BOX, className)}
      style={PIXEL_LOCK}
    />
  );
}
