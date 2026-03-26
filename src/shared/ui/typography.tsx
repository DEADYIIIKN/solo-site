import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const headingVariants = cva("font-[family-name:var(--font-family-display)] font-bold lowercase", {
  variants: {
    level: {
      hero: "text-[44px] leading-[var(--leading-tightest)] tracking-[var(--tracking-tight)] md:text-[80px] xl:text-[120px]",
      display: "text-[32px] leading-[var(--leading-tightest)] tracking-[var(--tracking-tight)] md:text-[50px] xl:text-[60px]",
      section: "text-[26px] leading-[var(--leading-tightest)] tracking-[var(--tracking-tight)] md:text-[40px]",
      card: "text-[24px] leading-[var(--leading-tightest)] md:text-[38px]",
      title: "text-[24px] leading-[var(--leading-normal)]"
    },
    tone: {
      default: "text-[var(--color-text)]",
      subtle: "text-[var(--color-text-muted)]",
      inverse: "text-[var(--color-text-on-dark)]",
      accent: "text-[var(--color-accent)]"
    }
  },
  defaultVariants: {
    level: "section",
    tone: "default"
  }
});

const textVariants = cva("font-[family-name:var(--font-family-text)]", {
  variants: {
    size: {
      xs: "text-[12px] leading-[var(--leading-snug)]",
      sm: "text-[14px] leading-[var(--leading-snug)]",
      md: "text-[16px] leading-[var(--leading-snug)]",
      body: "text-[17px] leading-[var(--leading-snug)]",
      lg: "text-[18px] leading-[var(--leading-relaxed)]"
    },
    tone: {
      default: "text-[var(--color-text)]",
      muted: "text-[var(--color-text-muted)]",
      subtle: "text-[var(--color-text-subtle)]",
      inverse: "text-[var(--color-text-on-dark)]"
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    transform: {
      none: "",
      caps: "uppercase tracking-[var(--tracking-caps)]"
    }
  },
  defaultVariants: {
    size: "body",
    tone: "default",
    weight: "regular",
    transform: "none"
  }
});

interface HeadingProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof headingVariants> {
  as?: ElementType;
  accent?: ReactNode;
}

export function Heading({
  accent,
  as: Component = "h2",
  children,
  className,
  level,
  tone,
  ...props
}: HeadingProps) {
  return (
    <Component className={cn(headingVariants({ level, tone }), className)} {...props}>
      {accent ? <span className="font-normal italic">{accent}</span> : null}
      {accent && children ? " " : null}
      {children}
    </Component>
  );
}

interface TextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType;
}

export function Text({
  as: Component = "p",
  children,
  className,
  size,
  tone,
  transform,
  weight,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ size, tone, transform, weight }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
