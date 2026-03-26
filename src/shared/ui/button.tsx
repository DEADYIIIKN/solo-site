import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-pill)] border text-center text-[14px] font-semibold leading-[var(--leading-snug)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--color-accent)] text-[var(--color-text-on-dark)] shadow-[var(--shadow-card)] hover:bg-[var(--color-accent-strong)]",
        secondary:
          "border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]",
        inverse:
          "border-white/20 bg-[var(--color-surface-strong)] text-[var(--color-text-on-dark)] hover:bg-[#1a0b07]"
      },
      size: {
        sm: "min-h-11 px-5 py-[13px]",
        md: "min-h-12 px-5 py-[15px]",
        lg: "min-h-[52px] px-6 py-4"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, type = "button", variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ size, variant }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
