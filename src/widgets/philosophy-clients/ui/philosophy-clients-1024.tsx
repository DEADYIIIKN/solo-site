"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { BoneyardSkeleton } from "@/shared/ui/boneyard-skeleton";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439 } from "@/shared/ui/section-eyebrow-text";
import {
  PHILOSOPHY_PIN_SCROLL_VH,
  philosophyCardEnterTranslateY,
  philosophyCardStackLocalT,
  usePhilosophyPinScrollProgress,
} from "@/widgets/philosophy-clients/lib/use-philosophy-stack-progress";
import {
  PHILOSOPHY_STACK_MIN_H_PX_1024,
  philosophyCard04RadialBg1024,
  philosophyClients1440Assets,
  philosophyClients1440Content,
  strategyBarGradient,
} from "@/widgets/philosophy-clients/model/philosophy-clients.data";
import { PhilosophyClientsMarquee1024 } from "@/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024";

/** Figma 783:8605 — карточки 478×270, radius 12 */
const CW = 478;
const CH = 270;
const BR = 12;

const CARD = "philosophy-scroll-card absolute overflow-hidden";
const NUM = "absolute left-[16px] top-[16px] whitespace-nowrap text-[17px] font-bold leading-[1.2]";

function SectionEyebrow1024({ label, top }: { label: string; top: number }) {
  return (
    <div className="absolute z-30" style={{ left: 40, top }}>
      <SectionEyebrowRow>
        <p className={sectionEyebrowText480To1439}>
          {label}
        </p>
      </SectionEyebrowRow>
    </div>
  );
}

function CardBodyText1024({
  parts,
  inverted,
}: {
  parts: readonly { text: string; emphasis: "none" | "italic" }[];
  inverted?: boolean;
}) {
  return (
    <p className={`m-0 text-[16px] font-bold leading-[1.2] [&_span]:leading-[1.2] ${inverted ? "text-white" : "text-[#0d0300]"}`}>
      {parts.map((part, i) =>
        part.emphasis === "italic" ? (
          <span className="font-normal italic" key={i}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

/** Figma 783:8618 — столбики стратегии */
const STRATEGY_BARS_1024 = [
  { bottom: 0, left: 0, h: 51, w: 80, top: undefined as number | undefined },
  { left: 80, top: 169, h: 101, w: 79, bottom: undefined },
  { left: 159, top: 110, h: 160, w: 81, bottom: undefined },
  { left: 240, top: 71, h: 199, w: 79, bottom: undefined },
  { left: 319, top: 41, h: 229, w: 80, bottom: undefined },
  { left: 399, bottom: 0, h: 270, w: 79, top: undefined },
] as const;

/**
 * Позиции карточек (x, y) — Figma 783:8609…783:8637 относительно белого столбца 1024px.
 */
const CARD_XY = [
  { left: 279, top: 90 },
  { left: 362, top: 160 },
  { left: 40, top: 230 },
  { left: 273, top: 300 },
  { left: 506, top: 370 },
] as const;

const PRESTACK_SECOND_TOP_1024 = 384;
const HIDDEN_START_TOP_1024 = 760;
const CARD_ENTER_OFFSET_Y_1024 = [
  0,
  PRESTACK_SECOND_TOP_1024 - CARD_XY[1].top,
  HIDDEN_START_TOP_1024 - CARD_XY[2].top,
  HIDDEN_START_TOP_1024 - CARD_XY[3].top,
  HIDDEN_START_TOP_1024 - CARD_XY[4].top,
] as const;

/** Figma 783:8605 */
export function PhilosophyClients1024() {
  const [c1, c2, c3, c4, c5] = philosophyClients1440Content.cards;
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [teamCardLoaded, setTeamCardLoaded] = useState(false);
  const setPinRef = useCallback((node: HTMLDivElement | null) => {
    setPinEl(node);
  }, []);
  const { progress, pinPhase } = usePhilosophyPinScrollProgress(pinEl);

  const enterY = (i: number) => philosophyCardEnterTranslateY(progress, i, CARD_ENTER_OFFSET_Y_1024[i]);
  const isCardInteractive = (i: number) => i < 2 || philosophyCardStackLocalT(progress, i) > 0;

  return (
    <div className="w-full min-w-0">
      <section
        className="philosophy-clients-scope relative block w-full overflow-visible bg-[#0d0300]"
        id="philosophy-clients-1024"
      >
        <div className="w-full rounded-bl-[60px] rounded-br-[60px] bg-white">
          <div className="relative mx-auto w-[1024px] min-w-[1024px]">
          <div
            ref={setPinRef}
            data-philosophy-pin=""
            className="relative w-full bg-white"
            style={{ minHeight: `${PHILOSOPHY_PIN_SCROLL_VH}vh` }}
          >
            {/*
             * Высота стопки ≥ PHILOSOPHY_STACK_MIN_H_PX_1024: при въезде карточек translateY до ~167px сверху
             * и ~41px снизу для 05-й — иначе overflow-hidden обрезает слайды и ленты «подъезжают» раньше ощущения финала.
             * После стопки — как на 1440: 100px воздуха, затем «клиенты» и ленты (без скачка от h-10).
             */}
            <div
              className={cn(
                "w-full bg-white",
                pinPhase === "static" && "relative z-20",
                pinPhase !== "static" &&
                  "sticky top-0 z-[40] flex w-full max-w-[min(100vw,1024px)] flex-col",
              )}
              style={{ minHeight: PHILOSOPHY_STACK_MIN_H_PX_1024 }}
            >
              <div
                className="relative w-full flex-1 overflow-hidden bg-white"
                style={{ minHeight: PHILOSOPHY_STACK_MIN_H_PX_1024 }}
              >
                <SectionEyebrow1024 label={philosophyClients1440Content.philosophyEyebrow} top={120} />

                {/* 01 Креатив — 783:8609 */}
                <div
                  data-philosophy-card="0"
                  className={`${CARD} z-[1] bg-[#0d0300]`}
                  style={{
                    left: CARD_XY[0].left,
                    top: CARD_XY[0].top,
                    width: CW,
                    height: CH,
                    borderRadius: BR,
                    transform: `translate3d(0, ${enterY(0)}px, 0)`,
                    pointerEvents: isCardInteractive(0) ? "auto" : "none",
                  }}
                >
                  <div className="philosophy-scroll-card-layer pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-[calc(50%+222.82px)] top-[calc(50%-222.82px)] flex size-[808px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <div className="-rotate-45">
                        <div className="philosophy-scroll-card-blur-strong h-[571px] w-[572px] rounded-[401px] bg-[#e63a24] blur-[15px]" />
                      </div>
                    </div>
                    <div className="absolute left-[calc(50%-221.82px)] top-[calc(50%+221.83px)] flex size-[808px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <div className="-rotate-45">
                        <div className="philosophy-scroll-card-blur-strong h-[571px] w-[572px] rounded-[401px] bg-[#e63a24] blur-[15px]" />
                      </div>
                    </div>
                    <div className="absolute left-[calc(50%+210.45px)] top-[calc(50%-210.45px)] flex size-[676px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <div className="rotate-[135deg]">
                        <div
                          className="philosophy-scroll-card-blur-soft h-[479px] w-[477px] rounded-[401px] blur-[5px]"
                          style={{
                            background:
                              "radial-gradient(ellipse at 70% 30%, rgba(255,154,68,0.95) 0%, rgba(255,154,68,0) 65%)",
                          }}
                        />
                      </div>
                    </div>
                    <div className="absolute left-[calc(50%-211px)] top-[calc(50%+212.95px)] flex size-[676px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <div className="-rotate-45">
                        <div
                          className="philosophy-scroll-card-blur-soft h-[479px] w-[477px] rounded-[401px] blur-[5px]"
                          style={{
                            background:
                              "radial-gradient(ellipse at 70% 30%, rgba(255,154,68,0.95) 0%, rgba(255,154,68,0) 65%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className={`${NUM} text-white`}>{c1.id}</p>
                  <p className="absolute right-[30px] top-[30px] whitespace-nowrap text-right text-[38px] font-bold leading-[0.9] tracking-[-0.76px] text-white">
                    {c1.title}
                  </p>
                  <div className="absolute bottom-[30px] left-[20px] w-[438px] text-white">
                    <CardBodyText1024 inverted parts={c1.body.parts} />
                  </div>
                </div>

                {/* 02 Стратегия — 783:8617 */}
                <div
                  data-philosophy-card="1"
                  className={`${CARD} z-[2] bg-[#fff4ee]`}
                  style={{
                    left: CARD_XY[1].left,
                    top: CARD_XY[1].top,
                    width: CW,
                    height: CH,
                    borderRadius: BR,
                    transform: `translate3d(0, ${enterY(1)}px, 0)`,
                    pointerEvents: isCardInteractive(1) ? "auto" : "none",
                  }}
                >
                  {STRATEGY_BARS_1024.map((b, i) => (
                    <div
                      className="absolute opacity-90"
                      key={i}
                      style={{
                        left: b.left,
                        top: b.top,
                        bottom: b.bottom,
                        height: b.h,
                        width: b.w,
                        backgroundImage: strategyBarGradient,
                      }}
                    />
                  ))}
                  <p className={`${NUM} text-[#0d0300]`}>{c2.id}</p>
                  <p className="absolute left-[76px] top-[30px] whitespace-nowrap text-[38px] font-bold leading-[0.9] tracking-[-0.76px] text-[#0d0300]">
                    {c2.title}
                  </p>
                  <div className="absolute bottom-[30px] left-[20px] w-[438px] text-[#0d0300]">
                    <CardBodyText1024 parts={c2.body.parts} />
                  </div>
                </div>

                {/* 03 Команда — 783:8628 */}
                <BoneyardSkeleton loading={!teamCardLoaded} name="philosophy-team-card-1024">
                  <div
                    data-philosophy-card="2"
                    className={`${CARD} z-[3] bg-[#0d0300]`}
                    style={{
                      left: CARD_XY[2].left,
                      top: CARD_XY[2].top,
                      width: CW,
                      height: CH,
                      borderRadius: BR,
                      transform: `translate3d(0, ${enterY(2)}px, 0)`,
                      pointerEvents: isCardInteractive(2) ? "auto" : "none",
                    }}
                  >
                    <div className="absolute left-[calc(50%-10.5px)] top-[calc(50%-6.5px)] h-[319px] w-[571px] -translate-x-1/2 -translate-y-1/2">
                      <Image
                        alt=""
                        className="pointer-events-none object-cover"
                        fill
                        loading="lazy"
                        onError={() => setTeamCardLoaded(true)}
                        onLoad={() => setTeamCardLoaded(true)}
                        sizes="571px"
                        src={philosophyClients1440Assets.teamPhoto}
                      />
                    </div>
                    <p className={`${NUM} z-[1] text-white`}>{c3.id}</p>
                    <p className="absolute left-[239px] top-[30px] z-[1] whitespace-nowrap text-[38px] font-bold leading-[0.9] tracking-[-0.76px] text-white">
                      {c3.title}
                    </p>
                    <div className="absolute bottom-[30px] left-[20px] z-[1] w-[371px] text-white">
                      <CardBodyText1024 inverted parts={c3.body.parts} />
                    </div>
                  </div>
                </BoneyardSkeleton>

                {/* 04 Прозрачность — 783:8633 */}
                <div
                  data-philosophy-card="3"
                  className={`${CARD} z-[4]`}
                  style={{
                    left: CARD_XY[3].left,
                    top: CARD_XY[3].top,
                    width: CW,
                    height: CH,
                    borderRadius: BR,
                    backgroundImage: philosophyCard04RadialBg1024,
                    backgroundSize: "100% 100%",
                    transform: `translate3d(0, ${enterY(3)}px, 0)`,
                    pointerEvents: isCardInteractive(3) ? "auto" : "none",
                  }}
                >
                  <p className={`${NUM} text-white`}>{c4.id}</p>
                  <p className="absolute left-1/2 top-[30px] -translate-x-1/2 whitespace-nowrap text-center text-[38px] font-bold leading-[0.9] tracking-[-0.76px] text-white opacity-95">
                    {c4.title}
                  </p>
                  <div className="absolute bottom-[30px] left-1/2 w-[414px] -translate-x-1/2 text-center text-white">
                    <CardBodyText1024 inverted parts={c4.body.parts} />
                  </div>
                </div>

                {/* 05 Аутентичность — 783:8637 */}
                <div
                  data-philosophy-card="4"
                  className={`${CARD} z-[5] bg-[#0d0300]`}
                  style={{
                    left: CARD_XY[4].left,
                    top: CARD_XY[4].top,
                    width: CW,
                    height: CH,
                    borderRadius: BR,
                    transform: `translate3d(0, ${enterY(4)}px, 0)`,
                    pointerEvents: isCardInteractive(4) ? "auto" : "none",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage: `url(${philosophyClients1440Assets.patternGrid})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 overflow-visible">
                    <div
                      className="absolute bg-[#ff5c00]"
                      style={{ height: "64.435px", left: "116.92px", top: "12px", width: "8.949px" }}
                    />
                    <div
                      className="absolute flex items-center justify-center"
                      style={{ height: "51.89px", left: "95.44px", top: "18.56px", width: "51.89px" }}
                    >
                      <div
                        className="-rotate-45 shrink-0 bg-[#ff5c00]"
                        style={{ height: "64.435px", width: "8.949px" }}
                      />
                    </div>
                    <div
                      className="absolute flex items-center justify-center"
                      style={{ height: "51.89px", left: "95.34px", top: "18.44px", width: "51.89px" }}
                    >
                      <div
                        className="rotate-45 shrink-0 bg-[#ff5c00]"
                        style={{ height: "64.435px", width: "8.949px" }}
                      />
                    </div>
                    <div
                      className="absolute flex items-center justify-center"
                      style={{ height: "8.949px", left: "89px", top: "39.56px", width: "64.435px" }}
                    >
                      <div
                        className="rotate-90 shrink-0 bg-[#ff5c00]"
                        style={{ height: "64.435px", width: "8.949px" }}
                      />
                    </div>
                  </div>
                  <p className={`${NUM} z-[1] text-white`}>{c5.id}</p>
                  <p className="absolute right-[30px] top-[30px] z-[1] whitespace-nowrap text-right text-[38px] font-normal italic leading-[0.9] tracking-[-0.76px] text-white">
                    {c5.title}
                  </p>
                  <div className="absolute bottom-[30px] left-[20px] z-[1] w-[440px] text-white">
                    <CardBodyText1024 inverted parts={c5.body.parts} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Как 1440 (783:9294): 100px воздуха после стопки, затем плавно блок «клиенты» + ленты */}
          <div className="h-[100px] w-full shrink-0 bg-white" aria-hidden />

          <div className="relative z-[5] w-full overflow-x-visible overflow-y-visible rounded-bl-[60px] rounded-br-[60px] bg-white pb-10">
            <div className="pl-10">
              <SectionEyebrowRow>
                <p className={sectionEyebrowText480To1439}>
                  {philosophyClients1440Content.clientsEyebrow}
                </p>
              </SectionEyebrowRow>
            </div>
            <div className="relative mt-5 h-[400px] w-full max-w-full overflow-x-clip">
              <PhilosophyClientsMarquee1024 />
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
