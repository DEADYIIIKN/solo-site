import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-12", className)}
      {...props}
    />
  );
}
