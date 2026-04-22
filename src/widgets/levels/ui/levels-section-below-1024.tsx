"use client";

import { cn } from "@/shared/lib/utils";
import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { levelsCopy } from "@/widgets/levels/model/levels.data";
import { LevelsGradientBar } from "@/widgets/levels/ui/levels-gradient-bar";

function IntroText({
  className,
  textClassName,
}: {
  className: string;
  textClassName: string;
}) {
  const { introBefore, introItalic, introAfter } = levelsCopy;
  return (
    <p className={cn("m-0 text-[0px] font-bold leading-[0] text-[#0d0300]", className)}>
      <span className={cn("leading-none", textClassName)}>{introBefore}</span>
      <span className={cn("font-normal italic leading-none", textClassName)}>{introItalic}</span>
      <span className={cn("leading-none", textClassName)}>{introAfter}</span>
    </p>
  );
}

function OutroText({
  className,
  textClassName,
}: {
  className: string;
  textClassName: string;
}) {
  const { outroBefore, outroItalic, outroAfter } = levelsCopy;
  return (
    <p className={cn("m-0 text-[0px] font-bold leading-[0] text-[#0d0300]", className)}>
      <span className={cn("leading-none", textClassName)}>{outroBefore}</span>
      <span className={cn("font-normal italic leading-none", textClassName)}>{outroItalic}</span>
      <span className={cn("leading-none", textClassName)}>{outroAfter}</span>
    </p>
  );
}

/** Figma 783:11542 — 768. */
function Levels768() {
  const { levels } = levelsCopy;
  return (
    <div
      className={cn(
        "hidden w-full max-w-[768px] flex-col gap-[70px] px-12 py-20",
        "min-[768px]:max-[1023px]:flex",
      )}
    >
      <div className="flex w-full flex-col gap-[30px]">
        <IntroText className="max-w-[515px]" textClassName="text-[28px]" />
        <div className="relative h-[400px] w-full max-w-[672px]">
          <div className="absolute left-[258px] top-0 z-[1]">
            <LevelsGradientBar height={153} opacityPct={70} width={139} />
          </div>
          <div className="absolute left-[397px] top-0 z-[2]">
            <LevelsGradientBar height={277} opacityPct={70} width={136} />
          </div>
          <div className="absolute left-[533px] top-0 z-[3]">
            <LevelsGradientBar height={400} opacityPct={70} width={139} />
          </div>
          <div className="absolute left-[86px] top-[69px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[12px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[0].label}
            </p>
            <p className="m-0 max-w-[242px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[0].title}
            </p>
          </div>
          <div className="absolute left-[258px] top-[193px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[12px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[1].label}
            </p>
            <p className="m-0 max-w-[201px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[1].title}
            </p>
          </div>
          <div className="absolute left-[431px] top-[316px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[12px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[2].label}
            </p>
            <p className="m-0 max-w-[225px] text-[20px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[2].title}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-end text-right">
        <OutroText className="w-full max-w-[672px]" textClassName="text-[32px]" />
      </div>
    </div>
  );
}

/** Figma 783:10918 — 480. */
function Levels480() {
  const { levels } = levelsCopy;
  return (
    <div
      className={cn(
        "hidden w-full max-w-[480px] flex-col gap-[90px] px-6 py-20",
        "min-[480px]:max-[767px]:flex",
      )}
    >
      <div className="flex w-full flex-col gap-[30px]">
        <IntroText className="w-full max-w-[432px]" textClassName="text-[23px]" />
        <div className="relative h-[310px] w-full max-w-[432px]">
          <div className="absolute left-[112px] top-0 z-[1]">
            <LevelsGradientBar height={115} opacityPct={70} width={107} />
          </div>
          <div className="absolute left-[219px] top-0 z-[2]">
            <LevelsGradientBar height={208} opacityPct={70} width={106} />
          </div>
          <div className="absolute left-[325px] top-0 z-[3]">
            <LevelsGradientBar height={300} opacityPct={70} width={107} />
          </div>
          <p className="absolute left-0 top-[82px] z-[6] m-0 text-[11px] font-medium leading-[0.9] text-[#9c9c9c]">
            {levels[0].label}
          </p>
          <p className="absolute left-0 top-[98px] z-[6] m-0 max-w-[181px] text-[16px] font-bold leading-none lowercase text-[#0d0300]">
            {levels[0].title}
          </p>
          <p className="absolute left-[112px] top-[175px] z-[6] m-0 text-[11px] font-medium leading-[0.9] text-[#9c9c9c]">
            {levels[1].label}
          </p>
          <p className="absolute left-[112px] top-[191px] z-[6] m-0 max-w-[164px] text-[16px] font-bold leading-none lowercase text-[#0d0300]">
            {levels[1].title}
          </p>
          <p className="absolute left-[224px] top-[267px] z-[6] m-0 text-[11px] font-medium leading-[0.9] text-[#9c9c9c]">
            {levels[2].label}
          </p>
          <p className="absolute left-[224px] top-[283px] z-[6] m-0 max-w-[172px] text-[16px] font-bold leading-none lowercase text-[#0d0300]">
            {levels[2].title}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center text-center">
        <OutroText className="w-full max-w-[432px]" textClassName="text-[32px]" />
      </div>
    </div>
  );
}

/** Figma 783:10360 — 360. */
function Levels360() {
  const { levels } = levelsCopy;
  return (
    <div
      className={cn(
        "flex w-full max-w-[360px] flex-col gap-[70px] px-4 py-[70px]",
        "max-[479px]:flex min-[480px]:hidden",
      )}
    >
      <div className="flex w-full flex-col gap-5">
        <IntroText className="w-full max-w-[328px]" textClassName="text-[20px]" />
        <div className="relative h-[290px] w-full max-w-[328px]">
          <div className="absolute left-[86px] top-0 z-[1]">
            <LevelsGradientBar height={100} opacityPct={70} width={81} />
          </div>
          <div className="absolute left-[167px] top-0 z-[2]">
            <LevelsGradientBar height={180} opacityPct={70} width={80} />
          </div>
          <div className="absolute left-[247px] top-0 z-[3]">
            <LevelsGradientBar height={260} opacityPct={70} width={81} />
          </div>
          <div className="absolute left-0 top-[73px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[10px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[0].label}
            </p>
            <p className="m-0 max-w-[159px] text-[14px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[0].title}
            </p>
          </div>
          <div className="absolute left-[86px] top-[153px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[10px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[1].label}
            </p>
            <p className="m-0 max-w-[143px] text-[14px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[1].title}
            </p>
          </div>
          <div className="absolute left-[172px] top-[233px] z-[6] flex flex-col gap-[7px]">
            <p className="m-0 text-[10px] font-medium leading-[0.9] text-[#9c9c9c]">
              {levels[2].label}
            </p>
            <p className="m-0 max-w-[149px] text-[14px] font-bold leading-none lowercase text-[#0d0300]">
              {levels[2].title}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center text-center">
        <OutroText className="w-full max-w-[328px]" textClassName="text-[23px]" />
      </div>
    </div>
  );
}

export function LevelsSectionBelow1024() {
  const layout = useViewportLayout();

  if (!layout || (layout !== "768" && layout !== "480" && layout !== "360")) {
    return null;
  }

  return (
    <section
      className="levels-section-scope relative z-10 w-full bg-white"
      id="levels-section-sm"
    >
      <div className="flex w-full justify-center">
        {layout === "768" ? <Levels768 /> : null}
        {layout === "480" ? <Levels480 /> : null}
        {layout === "360" ? <Levels360 /> : null}
      </div>
    </section>
  );
}
