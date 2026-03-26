import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

import { Container } from "@/shared/ui/container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  containerClassName?: string;
  density?: "default" | "compact";
  tone?: "default" | "dark";
  bleed?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  density = "default",
  tone = "default",
  bleed = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("section-shell", className)}
      data-density={density}
      data-tone={tone}
      {...props}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
