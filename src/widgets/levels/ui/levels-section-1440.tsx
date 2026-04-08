"use client";

import { cn } from "@/shared/lib/utils";
import { levelsCopy } from "@/widgets/levels/model/levels.data";
import { useLevelsReveal } from "@/widgets/levels/lib/use-levels-reveal";
import {
  LEVELS_BAR_UNFOLD_DURATION_MS,
  LevelsBarUnfold,
} from "@/widgets/levels/ui/levels-gradient-bar";

/**
 * Полный блок «Уровни» 1440 (Figma 783:9122): интро слева, столбики и подписи уровней в одной сетке.
 * Рендер внутри белой колонки «Услуг» под карточками.
 */
export function LevelsUnified1440() {
  const { introBefore, introItalic, introAfter, outroBefore, outroItalic, outroAfter, levels } =
    levelsCopy;

  const { ref, shown, reduceMotion, delay } = useLevelsReveal();

  const baseEase = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  const revealMove = () =>
    cn(
      "levels-reveal-item transition-[opacity,transform] duration-[480ms] will-change-[opacity,transform]",
      baseEase,
      reduceMotion && "!duration-0",
      shown ? "translate-y-0 opacity-100" : "translate-y-[8px] opacity-0",
    );

  const revealFade = () =>
    cn(
      "levels-reveal-item transition-opacity duration-[480ms] will-change-opacity",
      baseEase,
      reduceMotion && "!duration-0",
      shown ? "opacity-100" : "opacity-0",
    );

  /** Старт полосы i (0,1,2): строго по очереди — вторая после окончания предыдущей. */
  const barStart = (i: number) => delay(i * LEVELS_BAR_UNFOLD_DURATION_MS);
  /** Когда завершилась полоса с индексом i (0-based). */
  const whenBarDone = (i: number) => delay((i + 1) * LEVELS_BAR_UNFOLD_DURATION_MS);

  return (
    <div
      ref={ref}
      className="relative mx-auto min-h-[720px] w-full max-w-[1440px] overflow-visible pb-4"
    >
      <p
        className={cn(
          "absolute left-[140px] top-[64px] z-[5] m-0 max-w-[726px] text-[30px] font-bold leading-none text-[#0d0300]",
          revealMove(),
        )}
        id="levels-intro-1440"
        style={{ transitionDelay: `${delay(420)}ms` }}
      >
        <span>{introBefore}</span>
        <span className="font-normal italic">{introItalic}</span>
        <span>{introAfter}</span>
      </p>

      {/*
        Полосы слева направо = уровень 1 → 2 → 3; разворачивание scale-y от верха; старт следующей после предыдущей.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[490px] overflow-visible">
        <div className="absolute left-[calc(83.33%-485px)] top-0 z-[1] flex items-start justify-center">
          <LevelsBarUnfold
            delayMs={barStart(0)}
            height={250}
            opacityPct={90}
            reduceMotion={reduceMotion}
            shown={shown}
            width={195}
          />
        </div>
        <div className="absolute left-[calc(83.33%-290px)] top-0 z-[2] flex items-start justify-center">
          <LevelsBarUnfold
            delayMs={barStart(1)}
            height={370}
            opacityPct={90}
            reduceMotion={reduceMotion}
            shown={shown}
            width={195}
          />
        </div>
        <div className="absolute left-[calc(83.33%-95px)] top-0 z-[3] flex items-start justify-center">
          <LevelsBarUnfold
            delayMs={barStart(2)}
            height={490}
            opacityPct={90}
            reduceMotion={reduceMotion}
            shown={shown}
            width={195}
          />
        </div>
      </div>

      <div
        className={cn(
          "absolute left-[calc(41.67%+35px)] top-[194px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        id="levels-step1-1440"
        style={{ transitionDelay: `${whenBarDone(0)}ms` }}
      >
        <p className="m-0 text-[16px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[0].label}</p>
        <p className="m-0 max-w-[294px] text-[24px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[0].title}
        </p>
      </div>
      <div
        className={cn(
          "absolute left-[calc(58.33%-10px)] top-[314px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        style={{ transitionDelay: `${whenBarDone(1)}ms` }}
      >
        <p className="m-0 text-[16px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[1].label}</p>
        <p className="m-0 max-w-[247px] text-[24px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[1].title}
        </p>
      </div>
      <div
        className={cn(
          "absolute left-[calc(75%-55px)] top-[432px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        style={{ transitionDelay: `${whenBarDone(2)}ms` }}
      >
        <p className="m-0 text-[16px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[2].label}</p>
        <p className="m-0 max-w-[263px] text-[24px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[2].title}
        </p>
      </div>

      <div
        className={cn(
          "absolute left-[140px] top-[654px] z-[6] w-[774px] -translate-y-full",
          revealFade(),
        )}
        style={{ transitionDelay: `${delay(3 * LEVELS_BAR_UNFOLD_DURATION_MS + 200)}ms` }}
      >
        <p className="m-0 max-w-[774px] text-[50px] font-bold leading-[1.05] text-[#0d0300]">
          <span>{outroBefore}</span>
          <span className="font-normal italic">{outroItalic}</span>
          <span>{outroAfter}</span>
        </p>
      </div>
    </div>
  );
}
