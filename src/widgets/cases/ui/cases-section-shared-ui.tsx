/* eslint-disable @next/next/no-img-element -- svg стрелки */

import { cn } from "@/shared/lib/utils";
import { DarkSurfaceGrid } from "@/shared/ui/dark-surface-grid";

export function CasesSectionBackgroundGrid({ className }: { className?: string }) {
  return <DarkSurfaceGrid className={className} />;
}

const CASES_ARROW_FILL_ORANGE = "#FF5C00";
const CASES_ARROW_FILL_WHITE = "#FFFFFF";
const CASES_ARROW_CIRCLE =
  "M34 17C34 26.3888 26.3888 34 17 34C7.61116 34 0 26.3888 0 17C0 7.61116 7.61116 0 17 0C26.3888 0 34 7.61116 34 17Z";
const CASES_ARROW_PATH_FIGMA_LEFT_FILE =
  "M21.7036 16.3649C22.0432 16.7347 22.0432 17.2653 21.7036 17.6351L15.4703 24.4213C15.0749 24.8518 14.361 24.9164 13.8758 24.5657C13.3906 24.2149 13.3177 23.5816 13.7131 23.1512L19.3631 17L13.7131 10.8488C13.3177 10.4184 13.3906 9.78507 13.8758 9.43433C14.361 9.0836 15.0749 9.14822 15.4703 9.57867L21.7036 16.3649Z";
const CASES_ARROW_PATH_FIGMA_RIGHT_FILE =
  "M12.2964 17.6351C11.9568 17.2653 11.9568 16.7347 12.2964 16.3649L18.5297 9.57867C18.9251 9.14822 19.639 9.0836 20.1242 9.43433C20.6094 9.78507 20.6823 10.4184 20.2869 10.8488L14.6369 17L20.2869 23.1512C20.6823 23.5816 20.6094 24.2149 20.1242 24.5657C19.639 24.9164 18.9251 24.8518 18.5297 24.4213L12.2964 17.6351Z";

function CasesNavArrowIcon({
  active,
  variant,
}: {
  active: boolean;
  variant: "back" | "forward";
}) {
  const d =
    variant === "back" ? CASES_ARROW_PATH_FIGMA_RIGHT_FILE : CASES_ARROW_PATH_FIGMA_LEFT_FILE;
  const chevron = (
    <path clipRule="evenodd" d={d} fill={CASES_ARROW_FILL_WHITE} fillRule="evenodd" />
  );

  return (
    <svg aria-hidden className="size-[34px] shrink-0" fill="none" height="34" viewBox="0 0 34 34" width="34" xmlns="http://www.w3.org/2000/svg">
      <g
        className={cn(
          "transition-opacity duration-300 ease-out",
          active ? "opacity-100" : "opacity-30",
        )}
      >
        <path d={CASES_ARROW_CIRCLE} fill={CASES_ARROW_FILL_ORANGE} />
        {chevron}
      </g>
    </svg>
  );
}

export function CasesSectionArrowsNav({
  className,
  nextDisabled,
  onNext,
  onPrev,
  prevDisabled,
}: {
  className?: string;
  nextDisabled: boolean;
  onNext: () => void;
  onPrev: () => void;
  prevDisabled: boolean;
}) {
  return (
    <div
      className={cn("flex h-[34px] w-[80px] shrink-0 flex-row items-center gap-[12px]", className)}
      dir="ltr"
    >
      <button
        aria-disabled={prevDisabled}
        aria-label="Назад"
        className={cn(
          "inline-flex size-[34px] items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity duration-300",
          prevDisabled ? "cursor-default" : "cursor-pointer hover:opacity-90",
        )}
        disabled={prevDisabled}
        onClick={onPrev}
        type="button"
      >
        <CasesNavArrowIcon active={!prevDisabled} variant="back" />
      </button>
      <button
        aria-disabled={nextDisabled}
        aria-label="Вперёд"
        className={cn(
          "inline-flex size-[34px] items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity duration-300",
          nextDisabled ? "cursor-default" : "cursor-pointer hover:opacity-90",
        )}
        disabled={nextDisabled}
        onClick={onNext}
        type="button"
      >
        <CasesNavArrowIcon active={!nextDisabled} variant="forward" />
      </button>
    </div>
  );
}
