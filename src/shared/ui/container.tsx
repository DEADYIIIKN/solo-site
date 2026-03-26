import type { HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-base", className)} {...props} />;
}
