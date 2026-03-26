import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

export function Grid({ className, cols = 12, style, ...props }: GridProps) {
  return (
    <div
      className={cn("grid-12", className)}
      style={{
        ...style,
        ["--grid-columns" as string]: cols
      }}
      {...props}
    />
  );
}
