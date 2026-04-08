import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { SectionTitleDot } from "@/shared/ui/section-title-dot";

type EyebrowAlign = "center" | "start" | "end";

const alignClass: Record<EyebrowAlign, string> = {
  center: "items-center",
  start: "items-start",
  end: "items-end",
};

/**
 * Точка + подпись секции в один ряд. Маркер — всегда `SectionTitleDot` (10×10), без вариантов формы/размера.
 * По умолчанию `items-center`. Не использовать `align="end"` для точки+текста — перекос относительно строчных букв.
 */
export function SectionEyebrowRow({
  children,
  className,
  gapClassName = "gap-[8px]",
  dotClassName,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  gapClassName?: string;
  dotClassName?: string;
  align?: EyebrowAlign;
}) {
  return (
    <div className={cn("flex shrink-0 flex-row", alignClass[align], gapClassName, className)}>
      <SectionTitleDot className={dotClassName} />
      {children}
    </div>
  );
}
