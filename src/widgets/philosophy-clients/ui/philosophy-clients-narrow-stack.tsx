"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439, sectionEyebrowTextMax479 } from "@/shared/ui/section-eyebrow-text";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";
import {
  philosophyCard04RadialBg360,
  philosophyCard04RadialBg432,
  philosophyClients1440Assets,
  philosophyClients1440Content,
  STRATEGY_BARS_360,
  STRATEGY_BARS_432,
  strategyBarGradient,
} from "@/widgets/philosophy-clients/model/philosophy-clients.data";
import { PhilosophyClientsMarquee1024 } from "@/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024";

type NarrowSize = "432" | "360";

/** Как в team-section: появление при первом входе в вьюпорт */
export const philosophyNarrowRevealTransition =
  "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity]";
export const philosophyNarrowRevealOn = "translate-y-0 opacity-100";
export const philosophyNarrowRevealOff = "translate-y-6 opacity-0";

const REVEAL = philosophyNarrowRevealTransition;
const REVEAL_ON = philosophyNarrowRevealOn;
const REVEAL_OFF = philosophyNarrowRevealOff;

function CardBodyParts({
  parts,
  inverted,
  bodyClass,
}: {
  parts: readonly { text: string; emphasis: "none" | "italic" }[];
  inverted?: boolean;
  bodyClass: string;
}) {
  return (
    <p
      className={cn(
        "m-0 font-bold leading-[1.2] [&_span]:leading-[1.2]",
        bodyClass,
        inverted ? "text-white" : "text-[#0d0300]",
      )}
    >
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

function AuthenticityStar432() {
  return (
    <div className="pointer-events-none absolute left-[75px] top-[19.82px] contents">
      <div
        className="absolute bg-[#ff5c00]"
        style={{ height: "48.799px", left: "96.15px", top: "19.82px", width: "6.778px" }}
      />
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "39.299px", left: "79.88px", top: "24.78px", width: "39.299px" }}
      >
        <div className="-rotate-45 shrink-0 bg-[#ff5c00]" style={{ height: "48.799px", width: "6.778px" }} />
      </div>
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "39.299px", left: "79.8px", top: "24.7px", width: "39.299px" }}
      >
        <div className="rotate-45 shrink-0 bg-[#ff5c00]" style={{ height: "48.799px", width: "6.778px" }} />
      </div>
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "6.778px", left: "75px", top: "40.69px", width: "48.799px" }}
      >
        <div className="rotate-90 shrink-0 bg-[#ff5c00]" style={{ height: "48.799px", width: "6.778px" }} />
      </div>
    </div>
  );
}

function AuthenticityStar360() {
  return (
    <div className="pointer-events-none absolute left-[56px] top-[19.19px] contents">
      <div
        className="absolute bg-[#ff5c00]"
        style={{ height: "42.475px", left: "74.41px", top: "19.19px", width: "5.899px" }}
      />
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "34.206px", left: "60.25px", top: "23.51px", width: "34.206px" }}
      >
        <div className="-rotate-45 shrink-0 bg-[#ff5c00]" style={{ height: "42.475px", width: "5.899px" }} />
      </div>
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "34.206px", left: "60.18px", top: "23.44px", width: "34.206px" }}
      >
        <div className="rotate-45 shrink-0 bg-[#ff5c00]" style={{ height: "42.475px", width: "5.899px" }} />
      </div>
      <div
        className="absolute flex items-center justify-center"
        style={{ height: "5.899px", left: "56px", top: "37.36px", width: "42.475px" }}
      >
        <div className="rotate-90 shrink-0 bg-[#ff5c00]" style={{ height: "42.475px", width: "5.899px" }} />
      </div>
    </div>
  );
}

function CreativeBg432() {
  return (
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
  );
}

function CreativeBg360() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[calc(50%+159.66px)] top-[calc(50%-159.66px)] flex size-[578.683px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="-rotate-45">
          <div className="h-[408.709px] w-[409.673px] rounded-[401.538px] bg-[#e63a24] blur-[15px]" />
        </div>
      </div>
      <div className="absolute left-[calc(50%-158.66px)] top-[calc(50%+158.66px)] flex size-[578.683px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="-rotate-45">
          <div className="h-[408.709px] w-[409.673px] rounded-[401.538px] bg-[#e63a24] blur-[15px]" />
        </div>
      </div>
      <div className="absolute left-[calc(50%+150.8px)] top-[calc(50%-150.8px)] flex size-[483.94px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="rotate-[135deg]">
          <div
            className="h-[343.161px] w-[341.233px] rounded-[401.538px] blur-[5px]"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(255,154,68,0.95) 0%, rgba(255,154,68,0) 65%)",
            }}
          />
        </div>
      </div>
      <div className="absolute left-[calc(50%-150.91px)] top-[calc(50%+152.31px)] flex size-[483.94px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="-rotate-45">
          <div
            className="h-[343.161px] w-[341.233px] rounded-[401.538px] blur-[5px]"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(255,154,68,0.95) 0%, rgba(255,154,68,0) 65%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Карточки философии без pin: Figma 783:11849 (768), 783:11225 (480), 783:10450 (360).
 * 768 и 480 — одна сетка 432×270; 360 — 328×220.
 */
export function PhilosophyNarrowCardStack({ size }: { size: NarrowSize }) {
  const [stackRef, stackInView] = useInViewOnce<HTMLDivElement>();
  const [c1, c2, c3, c4, c5] = philosophyClients1440Content.cards;
  const is360 = size === "360";

  const cardBox = is360 ? "relative w-[328px] shrink-0 overflow-hidden rounded-[8px]" : "relative w-[432px] shrink-0 overflow-hidden rounded-[12px]";
  const h = is360 ? "h-[220px]" : "h-[270px]";
  const bodyCls = is360 ? "text-[12px]" : "text-[15px]";
  const titleCls = is360 ? "text-[28px] font-bold leading-[0.9] tracking-[-0.56px]" : "text-[38px] font-bold leading-[0.9] tracking-[-0.76px]";
  const numSm = is360 ? "text-[12px] font-bold leading-[1.2]" : "text-[15px] font-bold leading-[1.2]";
  const numLg = is360 ? "text-[12px] font-bold leading-[1.2]" : "text-[17px] font-bold leading-[1.2]";
  const topTitle = is360 ? "top-[24px]" : "top-[30px]";
  const b1 = is360 ? "bottom-[24px]" : "bottom-[28px]";
  const bRest = is360 ? "bottom-[24px]" : "bottom-[30px]";
  const radial04 = is360 ? philosophyCard04RadialBg360 : philosophyCard04RadialBg432;
  const bars = is360 ? STRATEGY_BARS_360 : STRATEGY_BARS_432;

  const padLeftClass = is360 ? "left-[12px]" : "left-[16px]";
  const padRightClass = is360 ? "right-[12px]" : "right-[16px]";
  const numTop = is360 ? "top-[12px]" : "top-[16px]";

  const cardReveal = () => cn(REVEAL, stackInView ? REVEAL_ON : REVEAL_OFF, "w-full max-w-none");

  const cardRevealStyle = (index: number): CSSProperties => ({
    transitionDelay: stackInView ? `${80 + index * 90}ms` : "0ms",
  });

  return (
    <div ref={stackRef} className={cn("flex flex-col gap-[24px]", is360 && "gap-4")}>
      {/* 01 */}
      <div className={cardReveal()} style={cardRevealStyle(0)}>
        <div className={cn(cardBox, "bg-[#0d0300]", h)}>
          {is360 ? <CreativeBg360 /> : <CreativeBg432 />}
          <p className={cn("absolute text-white", padLeftClass, numTop, numSm)}>{c1.id}</p>
          <p className={cn("absolute text-right text-white", padRightClass, topTitle, titleCls)}>{c1.title}</p>
          <div className={cn("absolute text-white", padLeftClass, b1, is360 ? "w-[304px]" : "w-[380px]")}>
            <CardBodyParts bodyClass={bodyCls} inverted parts={c1.body.parts} />
          </div>
        </div>
      </div>

      {/* 02 */}
      <div className={cardReveal()} style={cardRevealStyle(1)}>
        <div className={cn(cardBox, "bg-[#fff4ee]", h)}>
        {bars.map((b, i) => (
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
        <p className={cn("absolute text-[#0d0300]", padLeftClass, numTop, numSm)}>{c2.id}</p>
        <p
          className={cn(
            "absolute whitespace-nowrap text-[#0d0300]",
            topTitle,
            is360 ? "right-[241px] translate-x-full" : "right-[323px] translate-x-full",
            titleCls,
          )}
        >
          {c2.title}
        </p>
        <div className={cn("absolute text-[#0d0300]", padLeftClass, b1, is360 ? "w-[298px]" : "w-[394px]")}>
          <CardBodyParts bodyClass={bodyCls} parts={c2.body.parts} />
        </div>
        </div>
      </div>

      {/* 03 */}
      <div className={cardReveal()} style={cardRevealStyle(2)}>
        <div className={cn(cardBox, "bg-[#0d0300]", h)}>
        <div
          className={cn(
            "absolute -translate-x-1/2",
            is360
              ? "left-[calc(50%-10.5px)] top-1/2 h-[244px] w-[439px] -translate-y-1/2"
              : "left-[calc(50%-10.5px)] top-[calc(50%-6.5px)] h-[319px] w-[571px] -translate-y-1/2",
          )}
        >
          <Image
            alt=""
            className="pointer-events-none object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 479px) 439px, 571px"
            src={philosophyClients1440Assets.teamPhoto}
          />
        </div>
        <p className={cn("absolute z-[1] text-white", padLeftClass, numTop, numLg)}>{c3.id}</p>
        <p
          className={cn(
            "absolute z-[1] whitespace-nowrap text-white",
            topTitle,
            is360 ? "right-[156px] translate-x-full" : "right-[208px] translate-x-full",
            titleCls,
          )}
        >
          {c3.title}
        </p>
        <div className={cn("absolute z-[1] text-white", padLeftClass, bRest, is360 ? "w-[291px]" : "w-[371px]")}>
          <CardBodyParts bodyClass={bodyCls} inverted parts={c3.body.parts} />
        </div>
        </div>
      </div>

      {/* 04 */}
      <div className={cardReveal()} style={cardRevealStyle(3)}>
        <div
          className={cn(cardBox, "font-bold text-white", h)}
          style={{
            backgroundImage: radial04,
            backgroundSize: "100% 100%",
          }}
        >
        <p className={cn("absolute text-white", padLeftClass, numTop, numLg)}>{c4.id}</p>
        <p className={cn("absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-white opacity-95", topTitle, titleCls)}>
          {c4.title}
        </p>
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 text-center text-white",
            bRest,
            is360 ? "w-[258px]" : "w-[392px]",
          )}
        >
          <CardBodyParts bodyClass={bodyCls} inverted parts={c4.body.parts} />
        </div>
        </div>
      </div>

      {/* 05 */}
      <div className={cardReveal()} style={cardRevealStyle(4)}>
        <div className={cn(cardBox, "bg-[#0d0300]", h)}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url(${philosophyClients1440Assets.patternGrid})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        {is360 ? <AuthenticityStar360 /> : <AuthenticityStar432 />}
        <p className={cn("absolute z-[1] text-white", padLeftClass, numTop, numLg)}>{c5.id}</p>
        <p
          className={cn(
            "absolute z-[1] whitespace-nowrap text-right text-white",
            padRightClass,
            topTitle,
            is360 ? "text-[28px] font-normal italic leading-[0.9] tracking-[-0.56px]" : "text-[38px] font-normal italic leading-[0.9] tracking-[-0.76px]",
          )}
        >
          {c5.title}
        </p>
        <div className={cn("absolute z-[1] text-white", padLeftClass, bRest, is360 ? "w-[279px]" : "w-[364px]")}>
          <CardBodyParts bodyClass={bodyCls} inverted parts={c5.body.parts} />
        </div>
        </div>
      </div>
    </div>
  );
}

/** Заголовок «клиенты» + ленты — в потоке под карточками, как на 1024 */
export function PhilosophyClientsNarrowClientsBlock({
  eyebrowPlClassName,
  clientsEyebrowStyle = "default",
}: {
  eyebrowPlClassName: string;
  /** `narrow` — подпись 14px; точка та же 10×10, что и везде (`SectionTitleDot`) */
  clientsEyebrowStyle?: "default" | "narrow";
}) {
  const [clientsRef, clientsInView] = useInViewOnce<HTMLDivElement>();

  return (
    <>
      <div className="h-10 w-full shrink-0 bg-white" aria-hidden />
      <div
        ref={clientsRef}
        className="relative z-[5] w-full overflow-hidden rounded-bl-[60px] rounded-br-[60px] bg-white pb-10"
      >
        <div
          className={cn(
            eyebrowPlClassName,
            REVEAL,
            clientsInView ? REVEAL_ON : REVEAL_OFF,
          )}
        >
          <SectionEyebrowRow>
            <p
              className={cn(
                clientsEyebrowStyle === "narrow"
                  ? sectionEyebrowTextMax479
                  : sectionEyebrowText480To1439,
              )}
            >
              {philosophyClients1440Content.clientsEyebrow}
            </p>
          </SectionEyebrowRow>
        </div>
        <div
          className={cn(
            "relative mt-8 h-[400px] w-full",
            REVEAL,
            clientsInView ? REVEAL_ON : REVEAL_OFF,
          )}
          style={{ transitionDelay: clientsInView ? "100ms" : "0ms" }}
        >
          <PhilosophyClientsMarquee1024 />
        </div>
      </div>
    </>
  );
}
