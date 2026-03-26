import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const surfaceVariants = cva("border transition-colors duration-[var(--motion-base)] ease-[var(--ease-standard)]", {
  variants: {
    variant: {
      default: "border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]",
      muted: "border-transparent bg-[var(--color-surface-muted)] shadow-none",
      dark: "border-white/10 bg-[var(--color-surface-strong)] text-[var(--color-text-on-dark)] shadow-[var(--shadow-card)]"
    },
    radius: {
      md: "rounded-[var(--radius-md)]",
      lg: "rounded-[var(--radius-lg)]",
      xl: "rounded-[var(--radius-xl)]"
    },
    padding: {
      none: "p-0",
      md: "p-5 md:p-6",
      lg: "p-6 md:p-8"
    }
  },
  defaultVariants: {
    variant: "default",
    radius: "md",
    padding: "md"
  }
});

interface SurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

export function Surface({ className, padding, radius, variant, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(surfaceVariants({ padding, radius, variant }), className)}
      {...props}
    />
  );
}
