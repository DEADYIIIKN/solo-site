import * as React from "react";

import { cn } from "@/shared/lib/utils";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  hint?: string;
  error?: string;
  label?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ className, error, hint, label, ...props }, ref) => {
    const message = error ?? hint;

    return (
      <label className="flex w-full flex-col gap-2">
        {label ? (
          <span className="text-[14px] font-semibold leading-[var(--leading-snug)] text-[var(--color-text)]">
            {label}
          </span>
        ) : null}
        <span
          className={cn(
            "flex items-center border-b border-[var(--color-base-gray-400)] pb-5 pt-[10px] transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
            error ? "border-[var(--color-accent)]" : "focus-within:border-[var(--color-accent)]"
          )}
        >
          <input
            ref={ref}
            className={cn(
              "w-full border-0 bg-transparent p-0 text-[16px] leading-[var(--leading-snug)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:outline-none",
              className
            )}
            {...props}
          />
        </span>
        {message ? (
          <span
            className={cn(
              "text-[14px] leading-[var(--leading-snug)]",
              error ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
            )}
          >
            {message}
          </span>
        ) : null}
      </label>
    );
  }
);

Field.displayName = "Field";
