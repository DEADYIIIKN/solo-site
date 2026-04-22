/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import {
  sectionEyebrowText480To1439,
  sectionEyebrowText480To1439Wrap,
  sectionEyebrowTextMax479Wrap,
  sectionEyebrowTextMin1440,
} from "@/shared/ui/section-eyebrow-text";
import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";
import {
  businessGoalsAssets,
  businessGoalsContent,
} from "@/widgets/business-goals/model/business-goals.data";

const accordionGapPx = 10;
const accordionTransition = "540ms cubic-bezier(0.22,1,0.36,1)";
const hoverIntentDelayMs = 130;
const hoverUnblockDistancePx = 8;
const collapsedWidths1440 = [88, 87, 88, 87] as const;
const activeWidths1440 = [868, 867, 868, 867] as const;
const collapsedWidths1024 = [68, 68, 67, 68] as const;
const activeWidths1024 = [705, 704, 705, 704] as const;

/** Figma 805:14096–805:14097 — плавающая кнопка 90×36 для 360/480 */
function BusinessGoalsFloatingCtaSmall() {
  return (
    <button
      aria-label="Бесплатная консультация"
      className="group/cta-sm relative h-9 w-[90px] shrink-0 overflow-hidden rounded-[8px] border-[0.5px] border-solid border-white/30 bg-[#0d0300] transition-colors duration-200 ease-out hover:border-[#ff5c00] hover:bg-[#ff5c00]"
      onClick={() => {
        dispatchOpenConsultationModal("consultation");
      }}
      type="button"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[6px] w-[62px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out group-hover/cta-sm:opacity-0">
        <div className="absolute inset-[-266.67%_-25.81%]">
          <img
            alt=""
            className="block size-full max-w-none"
            src={businessGoalsAssets.ctaSmallGlow}
            style={{ height: "100%", maxWidth: "none", width: "100%" }}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[calc(50%-8px)] w-full max-w-[90px] -translate-x-1/2 text-center text-[9px] font-medium leading-none text-white">
        <p className="m-0 leading-none">бесплатная</p>
        <p className="m-0 leading-none">консультация</p>
      </div>
    </button>
  );
}

function BusinessGoalsFloatingCta() {
  function renderComposedLayer({
    outer,
    glow,
    dot,
    text,
  }: {
    outer: string;
    glow: string;
    dot: string;
    text: string;
  }) {
    return (
      <>
        <div className="absolute inset-0">
          <img
            alt=""
            className="block size-full max-w-none"
            src={outer}
            style={{ height: "100%", maxWidth: "none", width: "100%" }}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 size-[30px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-[-200%]">
            <img
              alt=""
              className="block size-full max-w-none"
              src={glow}
              style={{ height: "100%", maxWidth: "none", width: "100%" }}
            />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 size-[8px] -translate-x-1/2 -translate-y-1/2">
          <img
            alt=""
            className="block size-full max-w-none"
            src={dot}
            style={{ height: "100%", maxWidth: "none", width: "100%" }}
          />
        </div>
        <div className="first-screen-cta-text-orbit absolute left-1/2 top-1/2 h-[100px] w-[104px] -translate-x-1/2 -translate-y-1/2">
          <img
            alt=""
            className="block size-full max-w-none"
            src={text}
            style={{
              height: "100%",
              maxWidth: "none",
              width: "100%",
            }}
          />
        </div>
      </>
    );
  }

  return (
    <button
      aria-label="Бесплатная консультация"
      className="group/cta relative size-[120px] rounded-full"
      onClick={() => {
        dispatchOpenConsultationModal("consultation");
      }}
      type="button"
    >
      <div className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ease-out group-hover/cta:opacity-0">
        {renderComposedLayer({
          outer: businessGoalsAssets.ctaOuter,
          glow: businessGoalsAssets.ctaGlow,
          dot: businessGoalsAssets.ctaDotRing,
          text: businessGoalsAssets.ctaTextPath,
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-200 ease-out group-hover/cta:opacity-100">
        {renderComposedLayer({
          outer: firstScreenAssets.ctaHoverOuter,
          glow: firstScreenAssets.ctaHoverGlow,
          dot: firstScreenAssets.ctaHoverDot,
          text: firstScreenAssets.ctaHoverTextPath,
        })}
      </div>
    </button>
  );
}

type AccordionCardProps = {
  active: boolean;
  card: (typeof businessGoalsContent.cards)[number];
  cardIndex?: number;
  expandedImageClass: string;
  expandedImageStyle: { height: string; maxWidth: "none"; width: string };
  collapsedImageLeftPx: number;
  imageSrc: string;
  collapsedImageWidthPx: number;
  is1024?: boolean;
  motionDirection?: -1 | 1;
  onClick: () => void;
  onFocusCard?: () => void;
  onHoverCancel?: () => void;
  onHover?: () => void;
  topPx: number;
};

function AccordionCard({
  active,
  card,
  cardIndex,
  collapsedImageLeftPx,
  collapsedImageWidthPx,
  expandedImageClass,
  expandedImageStyle,
  imageSrc,
  is1024 = false,
  motionDirection = 1,
  onClick,
  onFocusCard,
  onHoverCancel,
  onHover,
  topPx,
}: AccordionCardProps) {
  const premiumEase = "cubic-bezier(0.16,1,0.3,1)";
  const [showCollapsedVisual, setShowCollapsedVisual] = useState(!active);
  const [showExpandedImage, setShowExpandedImage] = useState(active);
  const entryDirection = motionDirection;
  const exitDirection = (motionDirection * -1) as -1 | 1;
  const collapsedHideClip =
    entryDirection > 0 ? "inset(0 100% 0 0 round 0px)" : "inset(0 0 0 100% round 0px)";
  const horizontalOffsetPx = entryDirection > 0 ? -8 : 8;
  const verticalLabelOffsetPx = entryDirection > 0 ? -6 : 6;
  const expandedExitOffsetPx = exitDirection > 0 ? 18 : -18;
  const expandedImageExitOffsetPx = exitDirection > 0 ? 28 : -28;

  useEffect(() => {
    let collapsedTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let expandedTimeoutId: ReturnType<typeof setTimeout> | null = null;

    if (active) {
      setShowExpandedImage(true);
      collapsedTimeoutId = setTimeout(() => {
        setShowCollapsedVisual(false);
      }, 70);
    } else {
      setShowCollapsedVisual(true);
      expandedTimeoutId = setTimeout(() => {
        setShowExpandedImage(false);
      }, 180);
    }

    return () => {
      if (collapsedTimeoutId != null) clearTimeout(collapsedTimeoutId);
      if (expandedTimeoutId != null) clearTimeout(expandedTimeoutId);
    };
  }, [active]);

  return (
    <button
      className={`relative h-full w-full overflow-hidden bg-[#0d0300] text-left ${topPx === 214 ? "rounded-[20px]" : "rounded-[12px]"}`}
      onClick={onClick}
      onFocus={onFocusCard}
      onMouseLeave={onHoverCancel}
      onMouseEnter={onHover}
      type="button"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath:
              active || !showCollapsedVisual ? collapsedHideClip : "inset(0 0% 0 0 round 0px)",
            transition: `clip-path 520ms ${premiumEase}, transform 520ms ${premiumEase}`,
            transform:
              active || !showCollapsedVisual
                ? `translate3d(${horizontalOffsetPx}px,0,0)`
                : "translate3d(0,0,0)",
            willChange: "clip-path,transform",
          }}
        >
          <img
            alt=""
            className="absolute top-0 h-full max-w-none"
            src={imageSrc}
            style={{
              height: "100%",
              left: `${collapsedImageLeftPx}px`,
              maxWidth: "none",
              width: `${collapsedImageWidthPx}px`,
            }}
          />
        </div>
        <p
          className={`absolute z-20 w-[47px] text-center text-[17px] font-bold leading-none text-white ${active ? (is1024 ? "right-[20px]" : "right-[30px]") : ""}`}
          style={
            active
              ? { top: is1024 ? "20px" : "30px" }
              : { left: topPx === 214 ? "20px" : "10px", top: topPx === 214 ? "30px" : "20px" }
          }
        >
          {card.id}
        </p>
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 overflow-visible"
          style={{
            opacity: active ? 0 : 1,
            transform: active
              ? `translate3d(calc(-50% + ${verticalLabelOffsetPx}px),-50%,0)`
              : "translate3d(-50%,-50%,0)",
            transition: `opacity 180ms ease-out, transform 420ms ${premiumEase}`,
            willChange: "opacity,transform",
          }}
        >
          <p className="m-0 -rotate-90 whitespace-nowrap text-[40px] font-bold lowercase leading-none tracking-[-0.4px] text-white">
            {card.label}
          </p>
        </div>
        <div
          className="absolute inset-0"
          style={{
            transform: active || showExpandedImage ? "translate3d(0,0,0)" : "translate3d(0,8px,0)",
            opacity: active || showExpandedImage ? 1 : 0,
            transition: `transform 520ms ${premiumEase}, opacity 240ms ease-out`,
            willChange: "transform,opacity",
          }}
        >
          <div
            className={`absolute ${is1024 ? "left-[20px] top-[20px] w-[460px] text-[40px] tracking-[-0.4px]" : `left-[30px] bottom-[120px] ${cardIndex === 3 ? "w-[390px]" : "w-[470px]"} text-[50px] tracking-[-0.5px]`} lowercase leading-[0.9] text-white`}
            style={{
              opacity: active ? 1 : 0,
              transform: active
                ? "translate3d(0,0,0)"
                : `translate3d(${expandedExitOffsetPx}px,0,0)`,
              transition: `transform 460ms ${premiumEase} 40ms, opacity 220ms ease-out 40ms`,
              willChange: "transform,opacity",
            }}
          >
            <p className={`m-0 ${!is1024 && cardIndex === 3 ? "font-normal" : "font-bold"}`}>{card.titlePrimary}</p>
            <p className="m-0 font-normal italic">{card.titleAccent}</p>
            {"titleSuffix" in card && card.titleSuffix ? <p className="m-0 font-bold">{card.titleSuffix}</p> : null}
          </div>
          <p
            className={`absolute ${is1024 ? "bottom-[30px] left-[20px] w-[287px] text-[16px]" : "bottom-[30px] left-[30px] w-[292px] text-[17px]"} font-normal leading-[1.2] text-white`}
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translate3d(0,0,0)" : "translate3d(0,10px,0)",
              transition: `transform 420ms ${premiumEase} 90ms, opacity 200ms ease-out 90ms`,
              willChange: "transform,opacity",
            }}
          >
            {card.description}
          </p>
          <img
            alt=""
            className={expandedImageClass}
            src={imageSrc}
            style={{
              ...expandedImageStyle,
              transform:
                active || showExpandedImage
                  ? "translate3d(0,0,0) scale(1)"
                  : `translate3d(${expandedImageExitOffsetPx}px,0,0) scale(1.025)`,
              opacity: active || showExpandedImage ? 1 : 0,
              transformOrigin: "center center",
              transition: `transform 560ms ${premiumEase} 30ms, opacity 220ms ease-out 30ms`,
              willChange: "transform,opacity",
            }}
          />
        </div>
      </div>
    </button>
  );
}

function MobileBusinessGoals({
  activeIndex,
  containerWidth,
  id,
  imageSources,
  onNext,
  onPrev,
  titleClassName,
}: {
  activeIndex: number;
  containerWidth: number;
  id: string;
  imageSources: [string, string, string, string];
  onNext: () => void;
  onPrev: () => void;
  titleClassName: string;
}) {
  const variant = containerWidth === 768 ? "768" : containerWidth === 480 ? "480" : "360";
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === businessGoalsContent.cards.length - 1;

  const config =
    variant === "768"
      ? {
          topPad: 80,
          bottomPad: 80,
          headerBottomGap: 50,
          horizontalPadding: 48,
          headerWidth: 672,
          headerItemsAlign: "items-end",
          titleWidthClass: "w-auto whitespace-nowrap",
          arrowGap: 10,
          arrowButtonSize: 30,
          arrowIconSize: 30,
          visibleWidth: 672,
          trackGap: 16,
          cardWidths: [414, 414, 414, 414] as const,
          cardHeights: [518, 518, 518, 518] as const,
          radiusClass: "rounded-[12px]",
          titleFontClass: "text-[32px] tracking-[-0.32px]",
          bodyFontClass: "text-[14px]",
          titleLeft: 20,
          descLeft: 20,
          cards: [
            { titleTop: 361, titleWidth: 292, descWidth: 374, overlayClass: "bg-gradient-to-b from-[53.614%] from-transparent to-[rgba(13,3,0,0.6)]" },
            { titleTop: 20, titleWidth: 339, descWidth: 201, overlayClass: "bg-gradient-to-b from-[rgba(13,3,0,0.6)] via-1/2 via-transparent to-transparent" },
            { titleTop: 332, titleWidth: 254, descWidth: 216, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
            { titleTop: 378, titleWidth: 351, descWidth: 333, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
          ] as const,
        }
      : variant === "480"
        ? {
            topPad: 80,
            bottomPad: 80,
            headerBottomGap: 40,
            horizontalPadding: 24,
            headerWidth: 432,
            headerItemsAlign: "items-center",
            titleWidthClass: "w-[206px]",
            arrowGap: 10,
            arrowButtonSize: 44,
            arrowIconSize: 40,
            visibleWidth: 432,
            trackGap: 16,
            cardWidths: [320, 320, 318, 320] as const,
            cardHeights: [400, 400, 398, 400] as const,
            radiusClass: "rounded-[12px]",
            titleFontClass: "text-[26px] tracking-[-0.26px]",
            bodyFontClass: "text-[12px]",
            titleLeft: 16,
            descLeft: 16,
            cards: [
              { titleTop: 266, titleWidth: 213, descWidth: 273, overlayClass: "bg-gradient-to-b from-[53.614%] from-transparent to-[rgba(13,3,0,0.6)]" },
              { titleTop: 16, titleWidth: 282, descWidth: 192, overlayClass: "bg-gradient-to-b from-[rgba(13,3,0,0.6)] via-1/2 via-transparent to-transparent" },
              { titleTop: 245, titleWidth: 188, descWidth: 216, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
              { titleTop: 280, titleWidth: 287, descWidth: 275, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
            ] as const,
          }
        : {
            topPad: 70,
            bottomPad: 70,
            headerBottomGap: 30,
            horizontalPadding: 16,
            headerWidth: 328,
            headerItemsAlign: "items-start",
            titleWidthClass: "w-[179px]",
            arrowGap: 10,
            arrowButtonSize: 30,
            arrowIconSize: 30,
            visibleWidth: 328,
            trackGap: 15,
            cardWidths: [242, 242, 242, 242] as const,
            cardHeights: [302, 302, 302, 302] as const,
            radiusClass: "rounded-[8px]",
            titleFontClass: "text-[20px] tracking-[-0.2px]",
            bodyFontClass: "text-[11px]",
            titleLeft: 12,
            descLeft: 12,
            cards: [
              { titleTop: 182, titleWidth: 171, descWidth: 182, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
              { titleTop: 12, titleWidth: 218, descWidth: 161, overlayClass: "bg-gradient-to-t from-[35.096%] from-transparent to-[rgba(13,3,0,0.2)]" },
              { titleTop: 177, titleWidth: 147, descWidth: 216, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
              { titleTop: 195, titleWidth: 218, descWidth: 218, overlayClass: "bg-gradient-to-b from-[35.096%] from-transparent to-[rgba(13,3,0,0.6)]" },
            ] as const,
          };

  const trackOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    config.cardWidths.forEach((width, index) => {
      offsets.push(acc);
      acc += width + (index === config.cardWidths.length - 1 ? 0 : config.trackGap);
    });
    return offsets;
  }, [config.cardWidths, config.trackGap]);

  const trackShift = -trackOffsets[activeIndex];
  const trackWidth =
    config.cardWidths.reduce((sum, width) => sum + width, 0) +
    config.trackGap * (config.cardWidths.length - 1);

  return (
    <div className="relative bg-white overflow-x-clip" id={id}>
      <div
        className="mx-auto"
        style={{
          paddingBottom: `${config.bottomPad}px`,
          width: `${containerWidth}px`,
        }}
      >
        <div
          className={cn("flex justify-between", config.headerItemsAlign)}
          style={{
            padding: `${config.topPad}px ${config.horizontalPadding}px 0`,
            width: `${config.headerWidth + config.horizontalPadding * 2}px`,
          }}
        >
          <SectionEyebrowRow
            align="start"
            className="min-w-0 flex-1"
            dotClassName={variant === "360" ? "mt-[3px]" : variant === "480" ? "mt-[4px]" : undefined}
          >
            <p className={cn(titleClassName, "min-w-0 shrink-0", config.titleWidthClass)}>
              {businessGoalsContent.sectionTitle}
            </p>
          </SectionEyebrowRow>
          <div className="flex shrink-0 items-center" style={{ gap: `${config.arrowGap}px` }}>
            <button
              aria-disabled={isFirst}
              className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors duration-300",
                isFirst ? "cursor-default bg-[#ffd8c2]" : "bg-[#ff5c00]",
              )}
              disabled={isFirst}
              onClick={onPrev}
              style={{
                height: `${config.arrowButtonSize}px`,
                width: `${config.arrowButtonSize}px`,
              }}
              type="button"
            >
              <img
                alt="Назад"
                className={cn("max-w-none", isFirst ? "opacity-40" : "opacity-100")}
                src={businessGoalsAssets.mobileArrowRight}
                style={{
                  height: `${config.arrowIconSize}px`,
                  maxWidth: "none",
                  width: `${config.arrowIconSize}px`,
                }}
              />
            </button>
            <button
              aria-disabled={isLast}
              className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors duration-300",
                isLast ? "cursor-default bg-[#ffd8c2]" : "bg-[#ff5c00]",
              )}
              disabled={isLast}
              onClick={onNext}
              style={{
                height: `${config.arrowButtonSize}px`,
                width: `${config.arrowButtonSize}px`,
              }}
              type="button"
            >
              <img
                alt="Вперед"
                className={cn("max-w-none", isLast ? "opacity-40" : "opacity-100")}
                src={businessGoalsAssets.mobileArrowLeft}
                style={{
                  height: `${config.arrowIconSize}px`,
                  maxWidth: "none",
                  width: `${config.arrowIconSize}px`,
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ padding: `${config.headerBottomGap}px ${config.horizontalPadding}px 0` }}>
          <div className="overflow-visible" style={{ width: `${config.visibleWidth}px` }}>
            <div
              className="flex items-start"
              style={{
                columnGap: `${config.trackGap}px`,
                transform: `translate3d(${trackShift}px,0,0)`,
                transition: "transform 620ms cubic-bezier(0.2,0.9,0.25,1)",
                width: `${trackWidth}px`,
                willChange: "transform",
              }}
            >
              {businessGoalsContent.cards.map((card, index) => {
                const cardCfg = config.cards[index];
                const titleBlock = (
                  <>
                    <p className={cn(config.titleFontClass, "m-0 font-bold lowercase leading-[0.9] text-white")}>
                      {card.titlePrimary}
                    </p>
                    <p className={cn(config.titleFontClass, "m-0 font-normal lowercase italic leading-[0.9] text-white")}>
                      {card.titleAccent}
                    </p>
                    {"titleSuffix" in card && card.titleSuffix ? (
                      <p className={cn(config.titleFontClass, "m-0 font-bold lowercase leading-[0.9] text-white")}>
                        {card.titleSuffix}
                      </p>
                    ) : null}
                  </>
                );

                return (
                <div
                  className={cn("relative shrink-0 overflow-hidden bg-[#0d0300]", config.radiusClass)}
                  key={card.id}
                  style={{
                    height: `${config.cardHeights[index]}px`,
                    width: `${config.cardWidths[index]}px`,
                  }}
                >
                  {index === 0 ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fetchPriority={index === activeIndex ? "high" : "low"}
                      fill
                      loading={index === activeIndex ? "eager" : "lazy"}
                      sizes={`${config.cardWidths[index]}px`}
                      src={imageSources[index]}
                      style={{ objectPosition: "center top" }}
                    />
                  ) : index === 1 ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fetchPriority={index === activeIndex ? "high" : "low"}
                      fill
                      loading={index === activeIndex ? "eager" : "lazy"}
                      sizes={`${config.cardWidths[index]}px`}
                      src={imageSources[index]}
                      style={{ objectPosition: "center 38%" }}
                    />
                  ) : index === 2 ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fetchPriority={index === activeIndex ? "high" : "low"}
                      fill
                      loading={index === activeIndex ? "eager" : "lazy"}
                      sizes={`${config.cardWidths[index]}px`}
                      src={imageSources[index]}
                      style={{ objectPosition: "center 22%" }}
                    />
                  ) : index === 3 ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fetchPriority={index === activeIndex ? "high" : "low"}
                      fill
                      loading={index === activeIndex ? "eager" : "lazy"}
                      sizes={`${config.cardWidths[index]}px`}
                      src={imageSources[index]}
                      style={{ objectPosition: "center 40%" }}
                    />
                  ) : null}
                  <div className={cn("pointer-events-none absolute inset-0", cardCfg.overlayClass)} />
                  {index === 0 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{
                          left: `${config.titleLeft}px`,
                          top: `${cardCfg.titleTop}px`,
                          width: `${cardCfg.titleWidth}px`,
                        }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className={cn("absolute m-0 font-normal leading-[1.2] text-white", config.bodyFontClass)}
                        style={{
                          bottom: "24px",
                          left: `${config.descLeft}px`,
                          width: `${cardCfg.descWidth}px`,
                        }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : index === 1 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{
                          left: `${config.titleLeft}px`,
                          top: `${cardCfg.titleTop}px`,
                          width: `${cardCfg.titleWidth}px`,
                        }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className={cn("absolute m-0 font-normal leading-[1.2] text-white", config.bodyFontClass)}
                        style={{
                          bottom: "24px",
                          left: `${config.descLeft}px`,
                          width: `${cardCfg.descWidth}px`,
                        }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : index === 2 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{
                          left: `${config.titleLeft}px`,
                          top: `${cardCfg.titleTop}px`,
                          width: `${cardCfg.titleWidth}px`,
                        }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className={cn("absolute m-0 font-normal leading-[1.2] text-white", config.bodyFontClass)}
                        style={{
                          bottom: "24px",
                          left: `${config.descLeft}px`,
                          width: `${cardCfg.descWidth}px`,
                        }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute text-left"
                        style={{
                          left: `${config.titleLeft}px`,
                          top: `${cardCfg.titleTop}px`,
                          width: `${cardCfg.titleWidth}px`,
                        }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className={cn("absolute m-0 font-normal leading-[1.2] text-white", config.bodyFontClass)}
                        style={{
                          bottom: "24px",
                          left: `${config.descLeft}px`,
                          width: `${cardCfg.descWidth}px`,
                        }}
                      >
                        {card.description}
                      </p>
                    </>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessGoals() {
  const layout = useViewportLayout();
  const [ctaVisible, setCtaVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex1024, setActiveIndex1024] = useState(0);
  const [activeDirection, setActiveDirection] = useState<-1 | 1>(1);
  const [activeDirection1024, setActiveDirection1024] = useState<-1 | 1>(1);
  const [activeIndex768, setActiveIndex768] = useState(0);
  const [activeIndex480, setActiveIndex480] = useState(0);
  const [activeIndex360, setActiveIndex360] = useState(0);
  const hoverIntentRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverIntent1024Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverBlockedRef = useRef(false);
  const hoverBlocked1024Ref = useRef(false);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointer1024Ref = useRef<{ x: number; y: number } | null>(null);

  const cardVisuals = useMemo(
    () => [
      {
        mainImage: businessGoalsAssets.mainImage,
        mainImageClass: "absolute right-[80px] top-0 h-[500px] w-[280px] object-cover",
        mainImageStyle: { height: "500px", maxWidth: "none", width: "280px" } as const,
        narrowImageLeftPercent: "-96.93%",
        narrowImageWidthPercent: "319.6%",
        narrowLabelBoxHeight: "h-[174px]",
      },
      {
        mainImage: businessGoalsAssets.cardTrafficImage,
        mainImageClass: "absolute right-[30px] top-[190px] h-[280px] w-[500px] object-cover",
        mainImageStyle: { height: "280px", maxWidth: "none", width: "500px" } as const,
        narrowImageLeftPercent: "-383.82%",
        narrowImageWidthPercent: "1089.83%",
        narrowLabelBoxHeight: "h-[159px]",
      },
      {
        mainImage: businessGoalsAssets.cardImageImage,
        mainImageClass: "absolute right-[80px] top-0 h-[500px] w-[280px] object-cover",
        mainImageStyle: { height: "500px", maxWidth: "none", width: "280px" } as const,
        narrowImageLeftPercent: "-218.38%",
        narrowImageWidthPercent: "319.6%",
        narrowLabelBoxHeight: "h-[153px]",
      },
      {
        mainImage: businessGoalsAssets.cardProductionImage,
        mainImageClass: "absolute right-[30px] top-[190px] h-[280px] w-[500px] object-cover",
        mainImageStyle: { height: "280px", maxWidth: "none", width: "500px" } as const,
        narrowImageLeftPercent: "-424.73%",
        narrowImageWidthPercent: "825.35%",
        narrowLabelBoxHeight: "h-[223px]",
      },
    ],
    [],
  );

  const accordionCards = useMemo(
    () =>
      businessGoalsContent.cards.map((card, index) => ({
        card,
        index,
        isActive: index === activeIndex,
        visual: cardVisuals[index],
      })),
    [activeIndex, cardVisuals],
  );

  const columns1440 = useMemo(() => {
    return businessGoalsContent.cards
      .map((_, index) => (index === activeIndex ? activeWidths1440[index] : collapsedWidths1440[index]))
      .map((px) => `${px}px`)
      .join(" ");
  }, [activeIndex]);

  const accordionCards1024 = useMemo(
    () =>
      businessGoalsContent.cards.map((card, index) => ({
        card,
        index,
        isActive: index === activeIndex1024,
        visual: cardVisuals[index],
      })),
    [activeIndex1024, cardVisuals],
  );

  const columns1024 = useMemo(() => {
    return businessGoalsContent.cards
      .map((_, index) => (index === activeIndex1024 ? activeWidths1024[index] : collapsedWidths1024[index]))
      .map((px) => `${px}px`)
      .join(" ");
  }, [activeIndex1024]);

  function changeActiveCard(nextIndex: number) {
    clearHoverIntent();
    if (nextIndex === activeIndex) return;
    setActiveDirection(nextIndex > activeIndex ? 1 : -1);
    hoverBlockedRef.current = true;
    setActiveIndex(nextIndex);
  }

  function handlePrev() {
    if (activeIndex === 0) return;
    changeActiveCard(activeIndex - 1);
  }

  function handleNext() {
    if (activeIndex === businessGoalsContent.cards.length - 1) return;
    changeActiveCard(activeIndex + 1);
  }

  function clearHoverIntent() {
    if (hoverIntentRef.current != null) {
      clearTimeout(hoverIntentRef.current);
      hoverIntentRef.current = null;
    }
  }

  function scheduleHoverCard(nextIndex: number) {
    if (hoverBlockedRef.current) return;
    if (nextIndex === activeIndex) return;
    clearHoverIntent();
    hoverIntentRef.current = setTimeout(() => {
      hoverIntentRef.current = null;
      changeActiveCard(nextIndex);
    }, hoverIntentDelayMs);
  }

  function changeActiveCard1024(nextIndex: number) {
    clearHoverIntent1024();
    if (nextIndex === activeIndex1024) return;
    setActiveDirection1024(nextIndex > activeIndex1024 ? 1 : -1);
    hoverBlocked1024Ref.current = true;
    setActiveIndex1024(nextIndex);
  }

  function handlePrev1024() {
    if (activeIndex1024 === 0) return;
    changeActiveCard1024(activeIndex1024 - 1);
  }

  function handleNext1024() {
    if (activeIndex1024 === businessGoalsContent.cards.length - 1) return;
    changeActiveCard1024(activeIndex1024 + 1);
  }

  function clearHoverIntent1024() {
    if (hoverIntent1024Ref.current != null) {
      clearTimeout(hoverIntent1024Ref.current);
      hoverIntent1024Ref.current = null;
    }
  }

  function scheduleHoverCard1024(nextIndex: number) {
    if (hoverBlocked1024Ref.current) return;
    if (nextIndex === activeIndex1024) return;
    clearHoverIntent1024();
    hoverIntent1024Ref.current = setTimeout(() => {
      hoverIntent1024Ref.current = null;
      changeActiveCard1024(nextIndex);
    }, hoverIntentDelayMs);
  }

  function handlePointerMove(clientX: number, clientY: number) {
    const prev = pointerRef.current;
    pointerRef.current = { x: clientX, y: clientY };
    if (!hoverBlockedRef.current || prev == null) return;

    if (
      Math.abs(clientX - prev.x) >= hoverUnblockDistancePx ||
      Math.abs(clientY - prev.y) >= hoverUnblockDistancePx
    ) {
      hoverBlockedRef.current = false;
    }
  }

  function handlePointerMove1024(clientX: number, clientY: number) {
    const prev = pointer1024Ref.current;
    pointer1024Ref.current = { x: clientX, y: clientY };
    if (!hoverBlocked1024Ref.current || prev == null) return;

    if (
      Math.abs(clientX - prev.x) >= hoverUnblockDistancePx ||
      Math.abs(clientY - prev.y) >= hoverUnblockDistancePx
    ) {
      hoverBlocked1024Ref.current = false;
    }
  }

  function resetHoverState() {
    clearHoverIntent();
    hoverBlockedRef.current = false;
    pointerRef.current = null;
  }

  function resetHoverState1024() {
    clearHoverIntent1024();
    hoverBlocked1024Ref.current = false;
    pointer1024Ref.current = null;
  }

  useEffect(() => {
    if (!layout) {
      setCtaVisible(false);
      return;
    }

    let frameId = 0;

    function updateCtaVisibility() {
      const section = document.getElementById("business-goals-section");
      if (!section || section.getClientRects().length === 0) {
        setCtaVisible(false);
        return;
      }

      const rect = section.getBoundingClientRect();
      setCtaVisible(rect.top <= window.innerHeight && rect.bottom > 0);
    }

    function scheduleUpdate() {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateCtaVisibility();
      });
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, [layout]);

  useEffect(() => {
    return () => {
      clearHoverIntent();
      clearHoverIntent1024();
      hoverBlockedRef.current = false;
      hoverBlocked1024Ref.current = false;
      pointerRef.current = null;
      pointer1024Ref.current = null;
    };
  }, []);

  return (
    <section className="relative overflow-x-clip bg-[#0d0300]" id="business-goals-section">
      {layout === "1440" ? (
      <div className="w-full">
        <div className="relative overflow-hidden rounded-t-[60px] bg-white">
          <div className="relative mx-auto h-[810px] w-[1440px]">
        <div className="absolute left-[140px] top-[162px] z-20">
          <SectionEyebrowRow>
            <p className={sectionEyebrowTextMin1440}>
              {businessGoalsContent.sectionTitle}
            </p>
          </SectionEyebrowRow>
        </div>

        <div className="absolute left-[1220px] top-[140px] z-20 flex h-[34px] w-[80px] items-center gap-[12px]">
          <button
            aria-disabled={activeIndex === 0}
            className={`inline-flex size-[34px] items-center justify-center rounded-full border-0 p-0 transition-colors duration-300 ${
              activeIndex === 0
                ? "cursor-default bg-[#ffd8c2]"
                : "bg-[#ff5c00]"
            }`}
            disabled={activeIndex === 0}
            onClick={handlePrev}
            type="button"
          >
            <img
              alt="Назад"
              className={`size-[34px] max-w-none -scale-x-100 transition-opacity duration-300 ${
                activeIndex === 0 ? "opacity-40" : "opacity-100"
              }`}
              src={businessGoalsAssets.arrowLeft}
              style={{ height: "34px", maxWidth: "none", width: "34px" }}
            />
          </button>
          <button
            aria-disabled={activeIndex === businessGoalsContent.cards.length - 1}
            className={`inline-flex size-[34px] items-center justify-center rounded-full border-0 p-0 transition-colors duration-300 ${
              activeIndex === businessGoalsContent.cards.length - 1
                ? "cursor-default bg-[#ffd8c2]"
                : "bg-[#ff5c00]"
            }`}
            disabled={activeIndex === businessGoalsContent.cards.length - 1}
            onClick={handleNext}
            type="button"
          >
            <img
              alt="Вперед"
              className={`size-[34px] max-w-none transition-opacity duration-300 ${
                activeIndex === businessGoalsContent.cards.length - 1
                  ? "opacity-40"
                  : "opacity-100"
              }`}
              src={businessGoalsAssets.arrowLeft}
              style={{ height: "34px", maxWidth: "none", width: "34px" }}
            />
          </button>
        </div>

        <div
          className="absolute left-[140px] top-[214px] grid h-[500px] w-[1160px] items-start"
          onMouseLeave={resetHoverState}
          onMouseMove={(event) => handlePointerMove(event.clientX, event.clientY)}
          style={{
            columnGap: `${accordionGapPx}px`,
            gridTemplateColumns: columns1440,
            transition: `grid-template-columns ${accordionTransition}`,
            willChange: "grid-template-columns",
          }}
        >
          {accordionCards.map(({ card, index, isActive, visual }) => (
            <AccordionCard
              key={card.id}
              active={isActive}
              card={card}
              cardIndex={index}
              collapsedImageLeftPx={
                (collapsedWidths1440[index] * Number.parseFloat(visual.narrowImageLeftPercent)) / 100
              }
              collapsedImageWidthPx={
                (collapsedWidths1440[index] * Number.parseFloat(visual.narrowImageWidthPercent)) / 100
              }
              expandedImageClass={visual.mainImageClass}
              expandedImageStyle={visual.mainImageStyle}
              imageSrc={visual.mainImage}
              motionDirection={activeDirection}
              onClick={() => changeActiveCard(index)}
              onFocusCard={() => changeActiveCard(index)}
              onHover={() => scheduleHoverCard(index)}
              onHoverCancel={clearHoverIntent}
              topPx={214}
            />
          ))}
        </div>

        <div
          className={`fixed bottom-[30px] left-[calc(50%+540px)] z-[320] size-[120px] transform-gpu transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            ctaVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-[18px] scale-90 opacity-0"
          }`}
        >
          <BusinessGoalsFloatingCta />
        </div>
          </div>
        </div>
      </div>
      ) : null}

      {layout === "1024" ? (
      <div className="w-full">
        <div className="relative overflow-hidden rounded-t-[60px] bg-white">
          <div className="relative mx-auto h-[700px] w-[1024px]">
        <div className="absolute left-[40px] top-[130px] z-20">
          <SectionEyebrowRow>
            <p className={sectionEyebrowText480To1439}>
              {businessGoalsContent.sectionTitle}
            </p>
          </SectionEyebrowRow>
        </div>

        <div className="absolute left-[914px] top-[111px] z-20 flex h-[30px] w-[70px] items-center gap-[10px]">
          <button
            aria-disabled={activeIndex1024 === 0}
            className={`inline-flex size-[30px] items-center justify-center rounded-full border-0 p-0 transition-colors duration-300 ${
              activeIndex1024 === 0 ? "cursor-default bg-[#ffd8c2]" : "bg-[#ff5c00]"
            }`}
            disabled={activeIndex1024 === 0}
            onClick={handlePrev1024}
            type="button"
          >
            <img
              alt="Назад"
              className={`size-[30px] max-w-none -scale-x-100 transition-opacity duration-300 ${
                activeIndex1024 === 0 ? "opacity-40" : "opacity-100"
              }`}
              src={businessGoalsAssets.arrowLeft}
              style={{ height: "30px", maxWidth: "none", width: "30px" }}
            />
          </button>
          <button
            aria-disabled={activeIndex1024 === businessGoalsContent.cards.length - 1}
            className={`inline-flex size-[30px] items-center justify-center rounded-full border-0 p-0 transition-colors duration-300 ${
              activeIndex1024 === businessGoalsContent.cards.length - 1
                ? "cursor-default bg-[#ffd8c2]"
                : "bg-[#ff5c00]"
            }`}
            disabled={activeIndex1024 === businessGoalsContent.cards.length - 1}
            onClick={handleNext1024}
            type="button"
          >
            <img
              alt="Вперед"
              className={`size-[30px] max-w-none transition-opacity duration-300 ${
                activeIndex1024 === businessGoalsContent.cards.length - 1
                  ? "opacity-40"
                  : "opacity-100"
              }`}
              src={businessGoalsAssets.arrowLeft}
              style={{ height: "30px", maxWidth: "none", width: "30px" }}
            />
          </button>
        </div>

        <div
          className="absolute left-[40px] top-[181px] grid h-[400px] w-[938px] items-start"
          onMouseLeave={resetHoverState1024}
          onMouseMove={(event) => handlePointerMove1024(event.clientX, event.clientY)}
          style={{
            columnGap: `${accordionGapPx}px`,
            gridTemplateColumns: columns1024,
            transition: `grid-template-columns ${accordionTransition}`,
            willChange: "grid-template-columns",
          }}
        >
          {accordionCards1024.map(({ card, index, isActive, visual }) => (
            <AccordionCard
              key={card.id}
              active={isActive}
              card={card}
              collapsedImageLeftPx={
                (collapsedWidths1024[index] *
                  Number.parseFloat(
                    index === 0
                      ? "-97.83%"
                      : index === 1
                        ? "-491.24%"
                        : index === 2
                          ? "-235.42%"
                          : "-430.83%",
                  )) /
                100
              }
              collapsedImageWidthPx={
                (collapsedWidths1024[index] *
                  Number.parseFloat(
                    index === 0
                      ? "330.88%"
                      : index === 1
                        ? "1394.34%"
                        : index === 2
                          ? "335.82%"
                          : "844.77%",
                  )) /
                100
              }
              expandedImageClass={
                index === 0 || index === 2
                  ? "absolute right-[70px] top-0 h-[400px] w-[236px] object-cover"
                  : "absolute right-[20px] top-[152px] h-[228px] w-[407px] object-cover"
              }
              expandedImageStyle={
                index === 0 || index === 2
                  ? { height: "400px", maxWidth: "none", width: "236px" }
                  : { height: "228px", maxWidth: "none", width: "407px" }
              }
              imageSrc={visual.mainImage}
              is1024={true}
              motionDirection={activeDirection1024}
              onClick={() => changeActiveCard1024(index)}
              onFocusCard={() => changeActiveCard1024(index)}
              onHover={() => scheduleHoverCard1024(index)}
              onHoverCancel={clearHoverIntent1024}
              topPx={181}
            />
          ))}
        </div>

        <div
          className={`fixed bottom-[30px] left-[calc(50%+422px)] z-[320] size-[120px] transform-gpu transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            ctaVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-[18px] scale-90 opacity-0"
          }`}
        >
          <BusinessGoalsFloatingCta />
        </div>
          </div>
        </div>
      </div>
      ) : null}

      {layout === "768" ? (
      <div>
        <MobileBusinessGoals
          activeIndex={activeIndex768}
          containerWidth={768}
          id="business-goals-section-768"
          imageSources={[
            businessGoalsAssets.mobile768CardSocial,
            businessGoalsAssets.mobile768CardTraffic,
            businessGoalsAssets.mobile768CardImage,
            businessGoalsAssets.mobile768CardProduction,
          ]}
          onNext={() => setActiveIndex768((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex768((prev) => Math.max(prev - 1, 0))}
          titleClassName={sectionEyebrowText480To1439Wrap}
        />
      </div>
      ) : null}

      {layout === "480" ? (
      <div>
        <MobileBusinessGoals
          activeIndex={activeIndex480}
          containerWidth={480}
          id="business-goals-section-480"
          imageSources={[
            businessGoalsAssets.mobile480CardSocial,
            businessGoalsAssets.mobile480CardTraffic,
            businessGoalsAssets.mobile480CardImage,
            businessGoalsAssets.mobile480CardProduction,
          ]}
          onNext={() => setActiveIndex480((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex480((prev) => Math.max(prev - 1, 0))}
          titleClassName={sectionEyebrowText480To1439Wrap}
        />
      </div>
      ) : null}

      {layout === "360" ? (
      <div>
        <MobileBusinessGoals
          activeIndex={activeIndex360}
          containerWidth={360}
          id="business-goals-section-360"
          imageSources={[
            businessGoalsAssets.mobile360CardSocial,
            businessGoalsAssets.mobile360CardTraffic,
            businessGoalsAssets.mobile360CardImage,
            businessGoalsAssets.mobile360CardProduction,
          ]}
          onNext={() => setActiveIndex360((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex360((prev) => Math.max(prev - 1, 0))}
          titleClassName={sectionEyebrowTextMax479Wrap}
        />
      </div>
      ) : null}

      {layout === "768" ? (
      <div
        className={cn(
          "fixed z-[320]",
          "bottom-[30px] right-[24px] size-[120px] transform-gpu transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          ctaVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-[18px] scale-90 opacity-0",
        )}
      >
        <BusinessGoalsFloatingCta />
      </div>
      ) : null}

      {layout === "360" || layout === "480" ? (
      <div
        className={cn(
          "fixed z-[320]",
          "bottom-[20px] right-4 transform-gpu transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[480px]:bottom-[24px] min-[480px]:right-6",
          ctaVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[12px] opacity-0",
        )}
      >
        <BusinessGoalsFloatingCtaSmall />
      </div>
      ) : null}
    </section>
  );
}
