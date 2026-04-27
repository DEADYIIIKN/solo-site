"use client";

import { cn } from "@/shared/lib/utils";
import { levelsCopy } from "@/widgets/levels/model/levels.data";
import { useLevelsReveal } from "@/widgets/levels/lib/use-levels-reveal";
import {
  LEVELS_BAR_UNFOLD_DURATION_MS,
  LevelsBarUnfold,
} from "@/widgets/levels/ui/levels-gradient-bar";

/** Полный блок «Уровни» 1024 — в одной сетке с Figma. */
export function LevelsUnified1024() {
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

  const barStart = (i: number) => delay(i * LEVELS_BAR_UNFOLD_DURATION_MS);
  const whenBarDone = (i: number) => delay((i + 1) * LEVELS_BAR_UNFOLD_DURATION_MS);

  return (
    <div
      ref={ref}
      className="relative mx-auto min-h-[700px] w-full max-w-[1024px] overflow-visible pb-4"
    >
      <p
        className={cn(
          "absolute left-[40px] top-[140px] z-[5] m-0 max-w-[575px] text-[24px] font-bold leading-[0.9] text-[#0d0300]",
          revealMove(),
        )}
        id="levels-intro-1024"
        style={{ transitionDelay: `${delay(420)}ms` }}
      >
        <span>{introBefore}</span>
        <span className="font-normal italic">{introItalic}</span>
        <span>{introAfter}</span>
      </p>

      {/* Flex-ряд убирает субпиксельные щели между барами (positions были .75px). Размеры 1:1 с Figma 783:8404. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[415px] overflow-visible">
        <div className="absolute left-[438px] top-0 flex items-start">
          <div className="relative z-[1]">
            <LevelsBarUnfold
              delayMs={barStart(0)}
              height={235}
              opacityPct={90}
              reduceMotion={reduceMotion}
              shown={shown}
              width={182}
            />
          </div>
          <div className="relative z-[2]">
            <LevelsBarUnfold
              delayMs={barStart(1)}
              height={321}
              opacityPct={90}
              reduceMotion={reduceMotion}
              shown={shown}
              width={182}
            />
          </div>
          <div className="relative z-[3]">
            <LevelsBarUnfold
              delayMs={barStart(2)}
              height={415}
              opacityPct={90}
              reduceMotion={reduceMotion}
              shown={shown}
              width={182}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute left-[391px] top-[245px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        style={{ transitionDelay: `${whenBarDone(0)}ms` }}
      >
        <p className="m-0 text-[14px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[0].label}</p>
        <p className="m-0 max-w-[256px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[0].title}
        </p>
      </div>
      <div
        className={cn(
          "absolute left-[556px] top-[331px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        style={{ transitionDelay: `${whenBarDone(1)}ms` }}
      >
        <p className="m-0 text-[14px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[1].label}</p>
        <p className="m-0 max-w-[224px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[1].title}
        </p>
      </div>
      <div
        className={cn(
          "absolute left-[721px] top-[415px] z-[6] flex flex-col gap-[7px]",
          revealMove(),
        )}
        style={{ transitionDelay: `${whenBarDone(2)}ms` }}
      >
        <p className="m-0 text-[14px] font-medium leading-[0.9] text-[#9c9c9c]">{levels[2].label}</p>
        <p className="m-0 max-w-[263px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
          {levels[2].title}
        </p>
      </div>

      <div
        className={cn("absolute bottom-[80px] left-[40px] z-[6] max-w-[774px]", revealFade())}
        style={{ transitionDelay: `${delay(3 * LEVELS_BAR_UNFOLD_DURATION_MS + 200)}ms` }}
      >
        <p className="m-0 text-[40px] font-bold leading-[1.05] text-[#0d0300]">
          <span>{outroBefore}</span>
          <span className="font-normal italic">{outroItalic}</span>
          <span>{outroAfter}</span>
        </p>
      </div>
    </div>
  );
}
