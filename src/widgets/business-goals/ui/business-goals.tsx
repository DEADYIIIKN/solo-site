/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
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
  cardId: string;
  imageLeftPercent: string;
  imageSrc: string;
  imageWidthPercent: string;
  label: string;
  onClick: () => void;
  topPx: number;
};

function AccordionCard({
  active,
  cardId,
  imageLeftPercent,
  imageSrc,
  imageWidthPercent,
  label,
  onClick,
  topPx,
}: AccordionCardProps) {
  const labelBoxHeightById: Record<string, string> = {
    "01": "h-[174px]",
    "02": "h-[159px]",
    "03": "h-[153px]",
    "04": "h-[223px]",
  };
  const labelBoxHeight = labelBoxHeightById[cardId] ?? "h-[159px]";

  return (
    <button
      className={`relative h-full w-full overflow-hidden text-left ${topPx === 214 ? "rounded-[20px]" : "rounded-[12px]"} ${
        active ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute top-0 h-full max-w-none"
            src={imageSrc}
            style={{
              height: "100%",
              left: imageLeftPercent,
              maxWidth: "none",
              width: imageWidthPercent,
            }}
          />
        </div>
        <p
          className="absolute w-[47px] text-center text-[17px] font-bold leading-none text-white"
          style={{ left: topPx === 214 ? "20px" : "10px", top: topPx === 214 ? "30px" : "20px" }}
        >
          {cardId}
        </p>
        <div
          className={`absolute flex w-[28px] -translate-y-full items-center justify-center ${labelBoxHeight}`}
          style={{ left: topPx === 214 ? "27px" : "20px", top: topPx === 214 ? "470px" : "380px" }}
        >
          <p className="-rotate-90 whitespace-nowrap text-[40px] font-bold lowercase leading-none tracking-[-0.4px] text-white">
            {label}
          </p>
        </div>
      </div>
    </button>
  );
}

function ExpandedOverlay({
  card,
  imageClass,
  imageSrc,
  imageStyle,
  leftPx,
  topPx,
  widthPx,
  is1024,
  transition,
}: {
  card: (typeof businessGoalsContent.cards)[number];
  imageClass: string;
  imageSrc: string;
  imageStyle: { height: string; maxWidth: "none"; width: string };
  leftPx: number;
  topPx: number;
  widthPx: number;
  is1024: boolean;
  transition: string;
}) {
  return (
    <div
      className="absolute z-20 overflow-hidden bg-[#0d0300]"
      style={{
        borderRadius: `${is1024 ? 12 : 20}px`,
        left: `${leftPx}px`,
        top: `${topPx}px`,
        width: `${widthPx}px`,
        height: `${is1024 ? 400 : 500}px`,
        transition: `left ${transition}, width ${transition}`,
        willChange: "left,width",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0"
          style={{ willChange: "auto" }}
        >
          <div
            className={`absolute ${is1024 ? "left-[20px] top-[20px] w-[460px] text-[40px] tracking-[-0.4px]" : "left-[30px] top-[30px] w-[470px] text-[50px] tracking-[-0.5px]"} lowercase leading-[0.9] text-white`}
          >
            <p className="m-0 font-bold">{card.titlePrimary}</p>
            <p className="m-0 font-normal italic">{card.titleAccent}</p>
            {"titleSuffix" in card && card.titleSuffix ? (
              <p className="m-0 font-bold">{card.titleSuffix}</p>
            ) : null}
          </div>
          <p className={`absolute ${is1024 ? "right-[20px] top-[20px]" : "right-[30px] top-[30px]"} text-[17px] font-bold leading-none text-white`}>
            {card.id}
          </p>
          <p className={`absolute ${is1024 ? "bottom-[30px] left-[20px] w-[287px] text-[16px]" : "bottom-[30px] left-[30px] w-[292px] text-[17px]"} font-normal leading-[1.2] text-white`}>
            {card.description}
          </p>
          <img
            alt=""
            className={imageClass}
            src={imageSrc}
            style={imageStyle}
          />
        </div>
      </div>
    </div>
  );
}

function MobileBusinessGoals({
  activeIndex,
  cardHeight,
  cardWidth,
  containerWidth,
  gap,
  horizontalPadding,
  id,
  imageSources,
  onNext,
  onPrev,
  textSizeClass,
  titleClassName,
}: {
  activeIndex: number;
  cardHeight: number;
  cardWidth: number;
  containerWidth: number;
  gap: number;
  horizontalPadding: number;
  id: string;
  imageSources: [string, string, string, string];
  onNext: () => void;
  onPrev: () => void;
  textSizeClass: string;
  titleClassName: string;
}) {
  const trackShift = useMemo(
    () => -(activeIndex * (cardWidth + gap)),
    [activeIndex, cardWidth, gap],
  );
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === businessGoalsContent.cards.length - 1;
  const visibleWidth = containerWidth - horizontalPadding * 2;
  const padX = horizontalPadding === 16 ? 12 : 16;
  const bottomPad = horizontalPadding === 16 ? 24 : 24;
  const titleTopPx = [Math.round((cardHeight * 182) / 302), 12] as const;

  return (
    <div className="relative bg-white" id={id}>
      <div
        className="mx-auto"
        style={{ width: `${containerWidth}px`, padding: "0" }}
      >
        <div
          className="flex items-start justify-between gap-3"
          style={{ padding: `${horizontalPadding === 24 ? 80 : 70}px ${horizontalPadding}px 0` }}
        >
          <SectionEyebrowRow
            align="start"
            className="min-w-0 flex-1"
            dotClassName={horizontalPadding === 24 ? "mt-[4px]" : "mt-[3px]"}
          >
            <p className={cn(titleClassName, "min-w-0 flex-1")}>{businessGoalsContent.sectionTitle}</p>
          </SectionEyebrowRow>
          <div className={`flex shrink-0 items-center ${horizontalPadding === 24 ? "gap-[10px]" : "gap-[10px]"}`}>
            <button
              aria-disabled={isFirst}
              className={`inline-flex items-center justify-center rounded-full transition-colors duration-300 ${
                horizontalPadding === 24 ? "size-[44px]" : "size-[30px]"
              } ${isFirst ? "cursor-default bg-[#ffd8c2]" : "bg-[#ff5c00]"}`}
              disabled={isFirst}
              onClick={onPrev}
              type="button"
            >
              <img
                alt="Назад"
                className={`max-w-none ${horizontalPadding === 24 ? "size-[40px]" : "size-[30px]"} ${isFirst ? "opacity-40" : "opacity-100"}`}
                src={businessGoalsAssets.mobileArrowLeft}
                style={{
                  height: horizontalPadding === 24 ? "40px" : "30px",
                  maxWidth: "none",
                  transform: "scaleX(-1)",
                  width: horizontalPadding === 24 ? "40px" : "30px",
                }}
              />
            </button>
            <button
              aria-disabled={isLast}
              className={`inline-flex items-center justify-center rounded-full transition-colors duration-300 ${
                horizontalPadding === 24 ? "size-[44px]" : "size-[30px]"
              } ${isLast ? "cursor-default bg-[#ffd8c2]" : "bg-[#ff5c00]"}`}
              disabled={isLast}
              onClick={onNext}
              type="button"
            >
              <img
                alt="Вперед"
                className={`max-w-none ${horizontalPadding === 24 ? "size-[40px]" : "size-[30px]"} ${isLast ? "opacity-40" : "opacity-100"}`}
                src={businessGoalsAssets.mobileArrowLeft}
                style={{
                  height: horizontalPadding === 24 ? "40px" : "30px",
                  maxWidth: "none",
                  width: horizontalPadding === 24 ? "40px" : "30px",
                }}
              />
            </button>
          </div>
        </div>

        <div style={{ padding: `${horizontalPadding === 24 ? 40 : 30}px ${horizontalPadding}px 0` }}>
          <div className="overflow-hidden" style={{ width: `${visibleWidth}px` }}>
            <div
              className="flex items-start"
              style={{
                columnGap: `${gap}px`,
                transform: `translate3d(${trackShift}px,0,0)`,
                transition: "transform 620ms cubic-bezier(0.2,0.9,0.25,1)",
                width: `${businessGoalsContent.cards.length * cardWidth + (businessGoalsContent.cards.length - 1) * gap}px`,
                willChange: "transform",
              }}
            >
              {businessGoalsContent.cards.map((card, index) => {
                const titleBlock = (
                  <>
                    <p className={`${textSizeClass} m-0 font-bold lowercase leading-[0.9] tracking-[-0.2px] text-white`}>
                      {card.titlePrimary}
                    </p>
                    <p className={`${textSizeClass} m-0 font-normal lowercase italic leading-[0.9] tracking-[-0.2px] text-white`}>
                      {card.titleAccent}
                    </p>
                    {"titleSuffix" in card && card.titleSuffix ? (
                      <p className={`${textSizeClass} m-0 font-bold lowercase leading-[0.9] tracking-[-0.2px] text-white`}>
                        {card.titleSuffix}
                      </p>
                    ) : null}
                  </>
                );

                const gradientClass =
                  index === 1 || index === 3
                    ? "bg-gradient-to-t from-[35%] from-transparent via-[rgba(13,3,0,0.15)] to-[rgba(13,3,0,0.55)]"
                    : "bg-gradient-to-b from-[35%] from-transparent via-[rgba(13,3,0,0.08)] to-[rgba(13,3,0,0.62)]";

                return (
                <div
                  className={`relative shrink-0 overflow-hidden bg-[#0d0300] ${horizontalPadding === 16 ? "rounded-[8px]" : "rounded-[12px]"}`}
                  key={card.id}
                  style={{ height: `${cardHeight}px`, width: `${cardWidth}px` }}
                >
                  {index === 0 ? (
                    <img
                      alt=""
                      className="absolute left-0 top-[-17.5%] h-[142.5%] max-w-none w-full"
                      src={imageSources[index]}
                      style={{ height: "142.5%", maxWidth: "none", width: "100%" }}
                    />
                  ) : index === 1 ? (
                    <img
                      alt=""
                      className="absolute max-w-none object-cover"
                      src={imageSources[index]}
                      style={{
                        height: "118%",
                        left: "-9%",
                        maxWidth: "none",
                        objectPosition: "center 38%",
                        top: "-9%",
                        width: "118%",
                      }}
                    />
                  ) : index === 2 ? (
                    <img
                      alt=""
                      className="absolute left-0 top-[-17.5%] max-w-none w-full object-cover"
                      src={imageSources[index]}
                      style={{
                        height: "142.5%",
                        maxWidth: "none",
                        objectPosition: "center 22%",
                        width: "100%",
                      }}
                    />
                  ) : index === 3 ? (
                    <img
                      alt=""
                      className="absolute max-w-none object-cover"
                      src={imageSources[index]}
                      style={{
                        height: "118%",
                        left: "-9%",
                        maxWidth: "none",
                        objectPosition: "center 40%",
                        top: "-9%",
                        width: "118%",
                      }}
                    />
                  ) : null}
                  <div className={`pointer-events-none absolute inset-0 ${gradientClass}`} />
                  {index === 0 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{ left: padX, right: padX, top: `${titleTopPx[0]}px` }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className="absolute m-0 text-[11px] font-normal leading-[1.2] text-white"
                        style={{ bottom: bottomPad, left: padX, right: padX }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : index === 1 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{ left: padX, right: padX, top: `${titleTopPx[1]}px` }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className="absolute m-0 text-[11px] font-normal leading-[1.2] text-white"
                        style={{ bottom: bottomPad, left: padX, right: padX }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : index === 2 ? (
                    <>
                      <div
                        className="absolute text-left"
                        style={{ left: padX, right: padX, top: "calc(50% + 26px)" }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className="absolute m-0 text-[11px] font-normal leading-[1.2] text-white"
                        style={{ bottom: bottomPad, left: padX, right: padX }}
                      >
                        {card.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute text-left"
                        style={{ left: padX, right: padX, top: `${titleTopPx[1]}px` }}
                      >
                        {titleBlock}
                      </div>
                      <p
                        className="absolute m-0 text-[11px] font-normal leading-[1.2] text-white"
                        style={{ bottom: bottomPad, left: padX, right: padX }}
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
  const [ctaVisible, setCtaVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex1024, setActiveIndex1024] = useState(0);
  const [activeIndex768, setActiveIndex768] = useState(0);
  const [activeIndex480, setActiveIndex480] = useState(0);
  const [activeIndex360, setActiveIndex360] = useState(0);
  const accordionGapPx = 10;
  const accordionTransition = "620ms cubic-bezier(0.2,0.9,0.25,1)";
  const accordionOverlayTransition = "680ms cubic-bezier(0.2,0.9,0.25,1)";

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
    const collapsed = [88, 87, 88, 87];
    const active = [868, 867, 868, 867];
    return businessGoalsContent.cards
      .map((_, index) => (index === activeIndex ? active[index] : collapsed[index]))
      .map((px) => `${px}px`)
      .join(" ");
  }, [activeIndex]);

  const overlayLeft1440 = useMemo(() => {
    const collapsed = [88, 87, 88, 87];
    let left = 140;
    for (let i = 0; i < activeIndex; i += 1) left += collapsed[i] + accordionGapPx;
    return left;
  }, [activeIndex, accordionGapPx]);

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
    const collapsed = [68, 68, 67, 68];
    const active = [705, 704, 705, 704];
    return businessGoalsContent.cards
      .map((_, index) => (index === activeIndex1024 ? active[index] : collapsed[index]))
      .map((px) => `${px}px`)
      .join(" ");
  }, [activeIndex1024]);

  const overlayLeft1024 = useMemo(() => {
    const collapsed = [68, 68, 67, 68];
    let left = 40;
    for (let i = 0; i < activeIndex1024; i += 1) left += collapsed[i] + accordionGapPx;
    return left;
  }, [activeIndex1024, accordionGapPx]);

  function changeActiveCard(nextIndex: number) {
    if (nextIndex === activeIndex) return;
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

  function changeActiveCard1024(nextIndex: number) {
    if (nextIndex === activeIndex1024) return;
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

  useEffect(() => {
    const preload = [
      businessGoalsAssets.mainImage,
      businessGoalsAssets.cardTrafficImage,
      businessGoalsAssets.cardImageImage,
      businessGoalsAssets.cardProductionImage,
    ];

    preload.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      if ("decode" in img) {
        img.decode().catch(() => {
          // Ignore decode errors for unavailable cache/network states.
        });
      }
    });
  }, []);

  useEffect(() => {
    function updateCtaVisibility() {
      const section = document.getElementById("business-goals-section");
      if (!section) {
        setCtaVisible(false);
        return;
      }

      const sectionTop = section.offsetTop;
      const viewportBottom = window.scrollY + window.innerHeight;
      setCtaVisible(viewportBottom >= sectionTop);
    }

    updateCtaVisibility();
    window.addEventListener("scroll", updateCtaVisibility, { passive: true });
    window.addEventListener("resize", updateCtaVisibility);

    return () => {
      window.removeEventListener("scroll", updateCtaVisibility);
      window.removeEventListener("resize", updateCtaVisibility);
    };
  }, []);

  return (
    <section className="relative overflow-x-clip bg-[#0d0300]" id="business-goals-section">
      <div className="hidden w-full min-[1440px]:block">
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
              cardId={card.id}
              imageLeftPercent={visual.narrowImageLeftPercent}
              imageSrc={visual.mainImage}
              imageWidthPercent={visual.narrowImageWidthPercent}
              label={card.label}
              onClick={() => changeActiveCard(index)}
              topPx={214}
            />
          ))}
        </div>
        <ExpandedOverlay
          card={businessGoalsContent.cards[activeIndex]}
          imageClass={cardVisuals[activeIndex].mainImageClass}
          imageSrc={cardVisuals[activeIndex].mainImage}
          imageStyle={cardVisuals[activeIndex].mainImageStyle}
          is1024={false}
          leftPx={overlayLeft1440}
          topPx={214}
          transition={accordionOverlayTransition}
          widthPx={[868, 867, 868, 867][activeIndex]}
        />

        <div
          className={`fixed bottom-[30px] left-[calc(50%+540px)] z-[320] size-[120px] transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

      <div className="hidden w-full min-[1024px]:block min-[1440px]:hidden">
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
              cardId={card.id}
              imageLeftPercent={
                index === 0
                  ? "-97.83%"
                  : index === 1
                    ? "-491.24%"
                    : index === 2
                      ? "-235.42%"
                      : "-430.83%"
              }
              imageSrc={visual.mainImage}
              imageWidthPercent={
                index === 0
                  ? "330.88%"
                  : index === 1
                    ? "1394.34%"
                    : index === 2
                      ? "335.82%"
                      : "844.77%"
              }
              label={card.label}
              onClick={() => changeActiveCard1024(index)}
              topPx={181}
            />
          ))}
        </div>
        <ExpandedOverlay
          card={businessGoalsContent.cards[activeIndex1024]}
          imageClass={
            activeIndex1024 === 0 || activeIndex1024 === 2
              ? "absolute right-[70px] top-0 h-[400px] w-[236px] object-cover"
              : "absolute right-[20px] top-[152px] h-[228px] w-[407px] object-cover"
          }
          imageSrc={cardVisuals[activeIndex1024].mainImage}
          imageStyle={
            activeIndex1024 === 0 || activeIndex1024 === 2
              ? { height: "400px", maxWidth: "none", width: "236px" }
              : { height: "228px", maxWidth: "none", width: "407px" }
          }
          is1024={true}
          leftPx={overlayLeft1024}
          topPx={181}
          transition={accordionOverlayTransition}
          widthPx={[705, 704, 705, 704][activeIndex1024]}
        />

        <div
          className={`fixed bottom-[30px] left-[calc(50%+422px)] z-[320] size-[120px] transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

      <div className="hidden min-[768px]:block min-[1024px]:hidden">
        <MobileBusinessGoals
          activeIndex={activeIndex768}
          cardHeight={400}
          cardWidth={320}
          containerWidth={768}
          gap={16}
          horizontalPadding={24}
          id="business-goals-section-768"
          imageSources={[
            businessGoalsAssets.mobile768CardSocial,
            businessGoalsAssets.mobile768CardTraffic,
            businessGoalsAssets.mobile768CardImage,
            businessGoalsAssets.mobile768CardProduction,
          ]}
          onNext={() => setActiveIndex768((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex768((prev) => Math.max(prev - 1, 0))}
          textSizeClass="text-[26px]"
          titleClassName={sectionEyebrowText480To1439Wrap}
        />
      </div>

      <div className="hidden min-[480px]:block min-[768px]:hidden">
        <MobileBusinessGoals
          activeIndex={activeIndex480}
          cardHeight={400}
          cardWidth={320}
          containerWidth={480}
          gap={16}
          horizontalPadding={24}
          id="business-goals-section-480"
          imageSources={[
            businessGoalsAssets.mobile480CardSocial,
            businessGoalsAssets.mobile480CardTraffic,
            businessGoalsAssets.mobile480CardImage,
            businessGoalsAssets.mobile480CardProduction,
          ]}
          onNext={() => setActiveIndex480((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex480((prev) => Math.max(prev - 1, 0))}
          textSizeClass="text-[26px]"
          titleClassName={sectionEyebrowText480To1439Wrap}
        />
      </div>

      <div className="min-[480px]:hidden">
        <MobileBusinessGoals
          activeIndex={activeIndex360}
          cardHeight={302}
          cardWidth={242}
          containerWidth={360}
          gap={15}
          horizontalPadding={16}
          id="business-goals-section-360"
          imageSources={[
            businessGoalsAssets.mobile360CardSocial,
            businessGoalsAssets.mobile360CardTraffic,
            businessGoalsAssets.mobile360CardImage,
            businessGoalsAssets.mobile360CardProduction,
          ]}
          onNext={() => setActiveIndex360((prev) => Math.min(prev + 1, businessGoalsContent.cards.length - 1))}
          onPrev={() => setActiveIndex360((prev) => Math.max(prev - 1, 0))}
          textSizeClass="text-[20px]"
          titleClassName={sectionEyebrowTextMax479Wrap}
        />
      </div>

      <div
        className={cn(
          "fixed z-[320] hidden min-[768px]:max-[1023px]:block",
          "bottom-[30px] right-[24px] size-[120px] transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          ctaVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-[18px] scale-90 opacity-0",
        )}
      >
        <BusinessGoalsFloatingCta />
      </div>

      <div
        className={cn(
          "fixed z-[320] hidden max-[767px]:block",
          "bottom-[20px] right-4 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[480px]:bottom-[24px] min-[480px]:right-6",
          ctaVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[12px] opacity-0",
        )}
      >
        <BusinessGoalsFloatingCtaSmall />
      </div>
    </section>
  );
}
