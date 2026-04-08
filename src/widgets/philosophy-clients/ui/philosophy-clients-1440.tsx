/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowTextMin1440 } from "@/shared/ui/section-eyebrow-text";
import {
  PHILOSOPHY_CARD_ENTER_OFFSET_Y,
  PHILOSOPHY_PIN_SCROLL_VH,
  philosophyCardOpacity,
  philosophyCardStackLocalT,
  usePhilosophyPinScrollProgress,
} from "@/widgets/philosophy-clients/lib/use-philosophy-stack-progress";
import {
  philosophyCard04RadialBg,
  philosophyClients1440Assets,
  philosophyClients1440Content,
  strategyBarGradient,
} from "@/widgets/philosophy-clients/model/philosophy-clients.data";
import { PhilosophyClientsMarquee1440 } from "@/widgets/philosophy-clients/ui/philosophy-clients-marquee-1440";

const CARD = "absolute overflow-hidden";
const NUM = "absolute left-[20px] top-[20px] whitespace-nowrap text-[17px] font-bold leading-[1.2]";
const BODY =
  "absolute top-[300px] w-[341px] -translate-y-full text-[17px] font-bold leading-[1.2] [&_span]:leading-[1.2]";

function SectionEyebrow({ label, top }: { label: string; top: number }) {
  return (
    <div className="absolute z-30" style={{ left: 140, top }}>
      <SectionEyebrowRow>
        <p className={sectionEyebrowTextMin1440}>
          {label}
        </p>
      </SectionEyebrowRow>
    </div>
  );
}

function CardBodyText({
  parts,
  inverted,
}: {
  parts: readonly { text: string; emphasis: "none" | "italic" }[];
  inverted?: boolean;
}) {
  return (
    <p className={`m-0 text-[17px] font-bold ${inverted ? "text-white" : "text-[#0d0300]"}`}>
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

const STRATEGY_BARS = [
  { bottom: 0, left: 0, h: 60, w: 107, top: undefined as number | undefined },
  { left: 107, top: 220, h: 120, w: 106, bottom: undefined },
  { left: 213, top: 150, h: 190, w: 108, bottom: undefined },
  { left: 321, top: 105, h: 235, w: 106, bottom: undefined },
  { left: 427, top: 68, h: 272, w: 107, bottom: undefined },
  { left: 534, bottom: 0, h: 320, w: 106, top: undefined },
] as const;

export function PhilosophyClients1440() {
  const [c1, c2, c3, c4, c5] = philosophyClients1440Content.cards;
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const setPinRef = useCallback((node: HTMLDivElement | null) => {
    setPinEl(node);
  }, []);
  const { progress, pinPhase } = usePhilosophyPinScrollProgress(pinEl);

  const enterY = (i: number) =>
    (1 - philosophyCardStackLocalT(progress, i)) * PHILOSOPHY_CARD_ENTER_OFFSET_Y[i];
  const cardOp = (i: number) => philosophyCardOpacity(progress, i);

  return (
    /* Без overflow-x на этом предке — иначе ломается pin; горизонталь — у .page-shell на узкой ширине */
    <div className="w-full min-w-0">
      <section
        className="philosophy-clients-scope relative block w-full overflow-visible bg-[#0d0300]"
        id="philosophy-clients-1440"
      >
      <div className="w-full rounded-bl-[60px] rounded-br-[60px] bg-white">
      {/* Макет 1440px: на узких экранах — горизонтальный скролл через внешнюю обёртку */}
      <div className="relative mx-auto w-[1440px] min-w-[1440px]">
        {/*
          Pin = min-height зона скролла. Слой карточек — sticky top-0 внутри pin: без смены fixed↔absolute,
          иначе при выходе из «лока» браузер даёт подкрутку scrollY (отталкивание вверх).
          Перехват wheel убран — не конфликтует с нативным скроллом.
        */}
        <div
          ref={setPinRef}
          data-philosophy-pin=""
          className="relative w-full bg-white"
          style={{ minHeight: `${PHILOSOPHY_PIN_SCROLL_VH}vh` }}
        >
          {/*
           * Figma 783:9294: низ карточки 05 — y=754, низ области карточек — 854, «клиенты» — y=954.
           * min-h-[100dvh] на sticky давал лишнюю пустоту под стопкой — как на 1024, высота = слой карточек.
           */}
          <div
            className={cn(
              "w-full bg-white",
              pinPhase === "static" && "relative z-20",
              pinPhase !== "static" &&
                "sticky top-0 z-[40] flex min-h-[854px] w-full max-w-[min(100vw,1440px)] flex-col",
            )}
          >
            <div className="relative min-h-[854px] w-full flex-1 overflow-hidden bg-white">
              <SectionEyebrow label={philosophyClients1440Content.philosophyEyebrow} top={130} />

        {/* 01 Креатив */}
        <div
          data-philosophy-card="0"
          className={`${CARD} z-[1] bg-[#0d0300]`}
          style={{
            left: 433,
            top: 90,
            width: 640,
            height: 340,
            borderRadius: 20,
            transform: `translate3d(0, ${enterY(0)}px, 0)`,
            opacity: cardOp(0),
            pointerEvents: cardOp(0) > 0 ? "auto" : "none",
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[calc(50%+222.82px)] top-[calc(50%-222.82px)] flex size-[808px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="-rotate-45">
                <div className="h-[571px] w-[572px] rounded-[401px] bg-[#e63a24] blur-[15px]" />
              </div>
            </div>
            <div className="absolute left-[calc(50%-221.82px)] top-[calc(50%+221.83px)] flex size-[808px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="-rotate-45">
                <div className="h-[571px] w-[572px] rounded-[401px] bg-[#e63a24] blur-[15px]" />
              </div>
            </div>
            <div className="absolute left-[calc(50%+210.45px)] top-[calc(50%-210.45px)] flex size-[676px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="rotate-[135deg]">
                <div
                  className="h-[479px] w-[477px] rounded-[401px] blur-[5px]"
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
                  className="h-[479px] w-[477px] rounded-[401px] blur-[5px]"
                  style={{
                    background:
                      "radial-gradient(ellipse at 70% 30%, rgba(255,154,68,0.95) 0%, rgba(255,154,68,0) 65%)",
                  }}
                />
              </div>
            </div>
          </div>
          <p className={`${NUM} text-white`}>{c1.id}</p>
          <p className="absolute left-[calc(50%+280px)] top-[40px] -translate-x-full whitespace-nowrap text-right text-[50px] font-bold leading-[0.9] tracking-[-1px] text-white">
            {c1.title}
          </p>
          <div className={`${BODY} left-[calc(50%-290px)] w-[570px] text-white`}>
            <CardBodyText inverted parts={c1.body.parts} />
          </div>
        </div>

        {/* 02 Стратегия */}
        <div
          data-philosophy-card="1"
          className={`${CARD} z-[2] bg-[#fff4ee]`}
          style={{
            left: 563,
            top: 171,
            width: 640,
            height: 340,
            borderRadius: 20,
            transform: `translate3d(0, ${enterY(1)}px, 0)`,
            opacity: cardOp(1),
            pointerEvents: cardOp(1) > 0 ? "auto" : "none",
          }}
        >
          {STRATEGY_BARS.map((b, i) => (
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
          <p className="absolute left-[calc(50%-240px)] top-[40px] whitespace-nowrap text-[50px] font-bold leading-[0.9] tracking-[-1px] text-[#0d0300]">
            {c2.title}
          </p>
          <div className={`${BODY} left-[calc(50%-61px)] w-[341px]`}>
            <CardBodyText parts={c2.body.parts} />
          </div>
        </div>

        {/* 03 Команда */}
        <div
          data-philosophy-card="2"
          className={`${CARD} z-[3] bg-[#0d0300]`}
          style={{
            left: 140,
            top: 252,
            width: 640,
            height: 340,
            borderRadius: 20,
            transform: `translate3d(0, ${enterY(2)}px, 0)`,
            opacity: cardOp(2),
            pointerEvents: cardOp(2) > 0 ? "auto" : "none",
          }}
        >
          <div className="absolute left-[calc(50%-91.5px)] top-[calc(50%-4px)] h-[460px] w-[823px] -translate-x-1/2 -translate-y-1/2">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={philosophyClients1440Assets.teamPhoto}
            />
          </div>
          <p className={`${NUM} z-[1] text-white`}>{c3.id}</p>
          <p className="absolute left-[calc(50%-84px)] top-[30px] z-[1] whitespace-nowrap text-[50px] font-bold leading-[0.9] tracking-[-1px] text-white">
            {c3.title}
          </p>
          <div className={`${BODY} left-[calc(50%-84px)] z-[1] w-[374px] text-white`} style={{ top: 310 }}>
            <CardBodyText inverted parts={c3.body.parts} />
          </div>
        </div>

        {/* 04 Прозрачность */}
        <div
          data-philosophy-card="3"
          className={`${CARD} z-[4]`}
          style={{
            left: 325,
            top: 333,
            width: 640,
            height: 340,
            borderRadius: 20,
            backgroundImage: philosophyCard04RadialBg,
            backgroundSize: "100% 100%",
            transform: `translate3d(0, ${enterY(3)}px, 0)`,
            opacity: cardOp(3),
            pointerEvents: cardOp(3) > 0 ? "auto" : "none",
          }}
        >
          <p className={`${NUM} text-white`}>{c4.id}</p>
          <p className="absolute left-1/2 top-[40px] -translate-x-1/2 whitespace-nowrap text-center text-[50px] font-bold leading-[0.9] tracking-[-1px] text-white opacity-95">
            {c4.title}
          </p>
          <div className={`${BODY} left-1/2 w-[442px] -translate-x-1/2 text-center text-white`}>
            <CardBodyText inverted parts={c4.body.parts} />
          </div>
        </div>

        {/* 05 Аутентичность */}
        <div
          data-philosophy-card="4"
          className={`${CARD} z-[5] bg-[#0d0300]`}
          style={{
            left: 660,
            top: 414,
            width: 640,
            height: 340,
            borderRadius: 20,
            transform: `translate3d(0, ${enterY(4)}px, 0)`,
            opacity: cardOp(4),
            pointerEvents: cardOp(4) > 0 ? "auto" : "none",
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
          {/* Figma 783:9386–783:9389 — четыре одинаковых бруска 12.925×93.06px, общий центр ~ (169.6, 57.5) */}
          <div className="pointer-events-none absolute inset-0 overflow-visible">
            <div
              className="absolute bg-[#ff5c00]"
              style={{ height: "93.06px", left: "163.33px", top: "11px", width: "12.925px" }}
            />
            <div
              className="absolute flex items-center justify-center"
              style={{ height: "74.942px", left: "132.31px", top: "20.47px", width: "74.942px" }}
            >
              <div
                className="-rotate-45 shrink-0 bg-[#ff5c00]"
                style={{ height: "93.06px", width: "12.925px" }}
              />
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{ height: "74.942px", left: "132.16px", top: "20.31px", width: "74.942px" }}
            >
              <div
                className="rotate-45 shrink-0 bg-[#ff5c00]"
                style={{ height: "93.06px", width: "12.925px" }}
              />
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{ height: "12.925px", left: "123px", top: "50.81px", width: "93.06px" }}
            >
              <div
                className="rotate-90 shrink-0 bg-[#ff5c00]"
                style={{ height: "93.06px", width: "12.925px" }}
              />
            </div>
          </div>
          <p className={`${NUM} z-[1] text-white`}>{c5.id}</p>
          <p className="absolute left-[calc(50%+290px)] top-[40px] z-[1] -translate-x-full text-right text-[50px] font-normal italic leading-[0.9] tracking-[-1px] text-white">
            {c5.title}
          </p>
          <div className={`${BODY} left-[calc(50%-290px)] z-[1] w-[580px] text-white`}>
            <CardBodyText inverted parts={c5.body.parts} />
          </div>
        </div>
            </div>
          </div>
        </div>

        {/*
         * Figma 783:9294: низ области карточек 854px → заголовок «клиенты» 954px = 100px воздуха.
         */}
        <div className="h-[100px] w-full shrink-0 bg-white" aria-hidden />

        {/*
         * «клиенты» y=954, ленты ~973 → ~20px; заголовок и ленты в потоке (не absolute top-48 + mt-6).
         */}
        <div className="relative z-[5] w-full overflow-hidden rounded-bl-[60px] rounded-br-[60px] bg-white pb-10">
          <div className="pl-[140px]">
            <SectionEyebrowRow>
              <p className={sectionEyebrowTextMin1440}>
                {philosophyClients1440Content.clientsEyebrow}
              </p>
            </SectionEyebrowRow>
          </div>
          <div className="relative mt-5 h-[400px] w-full">
            <PhilosophyClientsMarquee1440 />
          </div>
        </div>
      </div>
      </div>
    </section>
    </div>
  );
}
