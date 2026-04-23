import { cn } from "@/shared/lib/utils";
import { levelsGradient } from "@/widgets/levels/model/levels.data";

/** Длительность разворачивания одной полосы; следующая стартует после этой по таймлайну в секциях. */
export const LEVELS_BAR_UNFOLD_DURATION_MS = 520;

/**
 * Скрыто: нижний inset 100% — видимой области нет.
 * Показ: inset(0) — при анимации нижняя граница опускается → полоса «расправляется» сверху вниз.
 * (С inset(100% 0 0 0) двигается верхняя граница снизу вверх — выглядело как рост снизу.)
 */
const CLIP_BAR_HIDDEN = "inset(0 0 100% 0)";
const CLIP_BAR_SHOWN = "inset(0 0 0 0)";

/**
 * Расправление полосы сверху вниз по очереди.
 * Раньше был scale-y на обёртке — он конфликтовал с scale-y-[-1] у градиента и давал «моргание».
 * clip-path inset анимируется предсказуемо и визуально совпадает с «расправлением».
 */
export function LevelsBarUnfold({
  width,
  height,
  opacityPct = 90,
  shown,
  reduceMotion,
  delayMs,
  className,
}: {
  width: number;
  height: number;
  opacityPct?: number;
  shown: boolean;
  reduceMotion: boolean;
  delayMs: number;
  className?: string;
}) {
  const open = shown;
  const clip = open ? CLIP_BAR_SHOWN : CLIP_BAR_HIDDEN;

  return (
    <div
      className={cn(
        "levels-reveal-item flex justify-center overflow-hidden",
        className,
      )}
      style={{
        width,
        height,
        clipPath: clip,
        WebkitClipPath: clip,
        transitionProperty: "clip-path, -webkit-clip-path",
        transitionDuration: reduceMotion ? "0ms" : `${LEVELS_BAR_UNFOLD_DURATION_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delayMs}ms`,
      }}
    >
      <LevelsGradientBar width={width} height={height} opacityPct={opacityPct} />
    </div>
  );
}

export function LevelsGradientBar({
  width,
  height,
  className,
  opacityPct = 90,
}: {
  width: number;
  height: number;
  className?: string;
  /** 90 как 1440, 70 как 768/ниже. */
  opacityPct?: number;
}) {
  return (
    <div
      className={cn("pointer-events-none shrink-0 overflow-hidden", className)}
      style={{ width, height }}
    >
      <div
        className="h-full w-full scale-y-[-1]"
        style={{
          opacity: opacityPct / 100,
          backgroundImage: levelsGradient,
        }}
      />
    </div>
  );
}
