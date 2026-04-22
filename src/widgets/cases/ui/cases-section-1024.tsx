"use client";

/* eslint-disable @next/next/no-img-element -- svg стрелки и иконка просмотров */

import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { useCasesHorizontalCarousel } from "@/widgets/cases/lib/use-cases-horizontal-carousel";
import {
  getCasesPinWeights,
  CASES_PIN_SCROLL_VH,
  useCasesPinScrollProgress,
} from "@/widgets/cases/lib/use-cases-pin-scroll-progress";
import type { CasesAdCard, CasesVerticalCard } from "@/widgets/cases/model/cases.data";
import {
  cases1440Assets,
  cases1440Copy,
  casesAdCards1440,
  casesVerticalCards1440,
  type CasesSectionCardsProps,
} from "@/widgets/cases/model/cases.data";
import { CasesAdDetailModal } from "@/widgets/cases/ui/cases-ad-detail-modal";
import {
  CasesSectionArrowsNav,
  CasesSectionBackgroundGrid,
} from "@/widgets/cases/ui/cases-section-shared-ui";
import { CasesVerticalDetailModal } from "@/widgets/cases/ui/cases-vertical-detail-modal";

/** Figma 783:8585: отступ до «Вертикальный контент» = 16.67% + 28px при w=1024 → 199px; минус padding 40 → 159px колонка под «кейсы». */
const CASES_1024_EYEBROW_COL_PX = 159;

const CASES_SCROLL_GAP_PX = 12;

const VERT_CARD_W = 227;
const VERT_CARD_H = 410;

const AD_CARD_W = 466;
const AD_CARD_H = 260;

/** Макс. высота полосы вертикального карусели при collapse=0: отступ от шапки + карточка + pt/pb полосы. */
const VERTICAL_CAROUSEL_STRIP_GAP_TOP_PX = 35;
const VERTICAL_CAROUSEL_MAX_PX_1024 =
  VERTICAL_CAROUSEL_STRIP_GAP_TOP_PX + VERT_CARD_H + 12;
/** Заголовок «Рекламные кейсы» + стрелки. */
const AD_HEADER_MAX_PX_1024 = 150;
/** Лента рекламных карточек: mt под заголовком + карточка + полоса снизу. */
const AD_STRIP_GAP_TOP_PX = 45;
const AD_STRIP_MAX_PX_1024 = AD_STRIP_GAP_TOP_PX + AD_CARD_H + 8;

function CasesTitle50({
  italicPart,
  boldPart,
  className,
}: {
  italicPart: string;
  boldPart: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "max-w-[770px] text-[50px] font-bold leading-[0.9] text-white [&_span]:leading-[0.9]",
        className,
      )}
    >
      <span className="font-normal italic">{italicPart}</span>
      <span>{boldPart}</span>
    </h2>
  );
}

const casesCardHoverEase = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Figma 783:8587 — вертикальная карточка 227×410, радиус 8px */
function VerticalCard1024({
  image,
  titleLines,
  views,
  credits,
  overlayLight,
  onOpenDetail,
}: {
  image: string;
  titleLines: readonly string[];
  views: string;
  credits: readonly string[];
  overlayLight?: boolean;
  onOpenDetail?: () => void;
}) {
  return (
    <motion.article
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[8px] bg-[#0d0300]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (!onOpenDetail) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      role={onOpenDetail ? "button" : undefined}
      style={{ height: VERT_CARD_H, width: VERT_CARD_W }}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <Image
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
          casesCardHoverEase,
        )}
        fill
        sizes={`${VERT_CARD_W}px`}
        src={image}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[#0d0300] mix-blend-color transition-opacity",
          casesCardHoverEase,
          overlayLight ? "opacity-20" : "opacity-100 group-hover:opacity-20",
        )}
      />
      <div className="pointer-events-none absolute inset-px flex h-[calc(100%-2px)] flex-col justify-between px-3 py-5 text-center text-white">
        <div className="flex min-h-[32px] flex-col justify-center text-[20px] font-bold uppercase leading-[0.9]">
          {titleLines.map((line) => (
            <p className="m-0 leading-[0.9]" key={line}>
              {line}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img
            alt=""
            className="block h-[18px] w-[26px] shrink-0 object-contain"
            height="18"
            src={cases1440Assets.viewsIcon}
            width="26"
          />
          <p className="m-0 text-[34px] font-bold lowercase leading-[1.2]">{views}</p>
        </div>
        <div className="flex min-h-[32px] flex-col justify-end text-[13px] font-normal leading-[1.2]">
          {credits.map((line) => (
            <p className="m-0" key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/** Figma 783:8576 — рекламная карточка 466×260 */
function AdCard1024({
  image,
  title,
  credits,
  onOpenDetail,
}: {
  image: string;
  title: string;
  credits: readonly string[];
  onOpenDetail?: () => void;
}) {
  return (
    <motion.article
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[8px] bg-[#0d0300]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (!onOpenDetail) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      role={onOpenDetail ? "button" : undefined}
      style={{ height: AD_CARD_H, width: AD_CARD_W }}
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <Image
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
          casesCardHoverEase,
        )}
        fill
        sizes={`${AD_CARD_W}px`}
        src={image}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[#0d0300] mix-blend-color opacity-20 transition-opacity",
          casesCardHoverEase,
          "group-hover:opacity-10",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-10 py-5 text-center text-white">
        <div className="h-[25px] shrink-0 opacity-0" aria-hidden />
        <p className="m-0 max-w-full text-[34px] font-bold uppercase leading-[0.9]">{title}</p>
        <div className="flex min-h-[25px] max-w-[340px] flex-col justify-end text-[13px] font-normal leading-[1.2]">
          {credits.map((line, i) => (
            <p className={cn("m-0 leading-[1.2]", i < credits.length - 1 && "mb-[10px]")} key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Figma 783:8585 (вертикальный ряд) + 783:8569 (реклама): «Кейсы» 1024.
 * Логика показа/сворачивания слайдеров — как на 1440: pin-scroll + {@link getCasesPinWeights}.
 */
export function CasesSection1024({
  verticalCards = casesVerticalCards1440,
  adCards = casesAdCards1440,
}: CasesSectionCardsProps = {}) {
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [detailCard, setDetailCard] = useState<CasesVerticalCard | null>(null);
  const [adDetailCard, setAdDetailCard] = useState<CasesAdCard | null>(null);
  const setPinRef = useCallback((node: HTMLDivElement | null) => {
    setPinEl(node);
  }, []);

  const { collapseProgress } = useCasesPinScrollProgress(pinEl);
  const w = getCasesPinWeights(collapseProgress);

  const vScroll = useCasesHorizontalCarousel(VERT_CARD_W, CASES_SCROLL_GAP_PX);
  const aScroll = useCasesHorizontalCarousel(AD_CARD_W, CASES_SCROLL_GAP_PX);

  const vertStripH = w.vertStrip * VERTICAL_CAROUSEL_MAX_PX_1024;
  const vertMt = w.vertStrip * 48;
  const vertOpacity = w.vertStrip < 0.02 ? 0 : Math.min(1, w.vertStrip * 1.05);
  const vertPointer = w.vertStrip > 0.08;

  const adHeaderMaxH = w.adHeader * AD_HEADER_MAX_PX_1024;
  const adHeaderOpacity = w.adHeader < 0.02 ? 0 : Math.min(1, w.adHeader * 1.05);

  const adStripMaxH = w.adStrip * AD_STRIP_MAX_PX_1024;
  const adStripOpacity = w.adStrip < 0.02 ? 0 : Math.min(1, w.adStrip * 1.05);
  const adStripPointer = w.adStrip > 0.12;

  const gridCols = `${CASES_1024_EYEBROW_COL_PX}px minmax(0, 1fr) auto`;

  return (
    <section className="cases-section-scope relative z-10 w-full bg-[#0d0300]" dir="ltr" id="cases-section-1024">
      {/* Модалки деталей — та же вёрстка, что на 1440 (`layout="1024"` в компонентах модалок). */}
      <CasesVerticalDetailModal
        card={detailCard}
        layout="1024"
        onClose={() => setDetailCard(null)}
        open={detailCard != null}
      />
      <CasesAdDetailModal
        card={adDetailCard}
        layout="1024"
        onClose={() => setAdDetailCard(null)}
        open={adDetailCard != null}
      />
      <div
        ref={setPinRef}
        className="relative w-full"
        data-cases-pin=""
        style={{ minHeight: `${CASES_PIN_SCROLL_VH}vh` }}
      >
        <div className="sticky top-0 z-[1] relative flex min-h-screen w-full justify-center">
          <CasesSectionBackgroundGrid />
          <div className="relative min-h-screen w-full max-w-[1024px] overflow-x-clip pb-10">
            <div className="relative z-[1] px-10">
              <div
                className="grid items-start pt-[120px]"
                style={{ gridTemplateColumns: gridCols }}
              >
                <div className="flex min-w-0 justify-start">
                  <SectionEyebrowRow align="end" dotClassName="self-center" gapClassName="gap-2">
                    <p className="m-0 whitespace-nowrap text-[16px] font-semibold lowercase leading-[1.2] text-white">
                      {cases1440Copy.eyebrow}
                    </p>
                  </SectionEyebrowRow>
                </div>
                <div className="min-w-0 justify-self-start pr-4">
                  <CasesTitle50
                    boldPart={cases1440Copy.verticalTitleRest}
                    italicPart={cases1440Copy.verticalTitleItalic}
                  />
                </div>
                <div
                  className="mt-[5px] shrink-0 justify-self-end"
                  style={{
                    opacity: w.vertArrows,
                    pointerEvents: vertPointer ? "auto" : "none",
                  }}
                >
                  <CasesSectionArrowsNav
                    nextDisabled={vScroll.nextDisabled}
                    onNext={vScroll.onNext}
                    onPrev={vScroll.onPrev}
                    prevDisabled={vScroll.prevDisabled}
                  />
                </div>
              </div>

              <div
                className="relative z-[1] overflow-hidden"
                style={{
                  marginTop: vertMt,
                  maxHeight: vertStripH,
                  opacity: vertOpacity,
                  pointerEvents: vertPointer ? "auto" : "none",
                }}
              >
                <div
                  className="mt-[35px] flex min-w-0 gap-3 overflow-x-auto overflow-y-hidden pb-1 pt-2 no-scrollbar"
                  dir="ltr"
                  ref={vScroll.scrollRef}
                >
                  {verticalCards.map((c) => (
                    <VerticalCard1024
                      credits={c.credits}
                      image={c.image}
                      key={c.id}
                      onOpenDetail={() => setDetailCard(c)}
                      overlayLight={c.overlayLight}
                      titleLines={c.titleLines}
                      views={c.views}
                    />
                  ))}
                </div>
              </div>

              <div
                className="relative z-[1] overflow-hidden"
                style={{
                  maxHeight: w.divider * 56,
                  opacity: w.divider,
                  paddingTop: 50 * w.divider,
                }}
              >
                <div className="h-px w-full bg-white/25" aria-hidden />
              </div>

              <div
                className="relative z-[1] overflow-hidden"
                style={{
                  maxHeight: adHeaderMaxH,
                  opacity: adHeaderOpacity,
                }}
              >
                <div
                  className="grid items-start pt-10"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <span className="min-h-px min-w-0 select-none" aria-hidden />
                  <div className="min-w-0 justify-self-start pr-4">
                    <CasesTitle50
                      boldPart={cases1440Copy.adTitleRest}
                      italicPart={cases1440Copy.adTitleItalic}
                    />
                  </div>
                  <div
                    className="mt-[5px] shrink-0 justify-self-end"
                    style={{
                      maxWidth: w.adArrows > 0.08 ? 88 : 0,
                      opacity: w.adArrows,
                      overflow: "hidden",
                      pointerEvents: adStripPointer ? "auto" : "none",
                    }}
                  >
                    <CasesSectionArrowsNav
                      className="shrink-0"
                      nextDisabled={aScroll.nextDisabled}
                      onNext={aScroll.onNext}
                      onPrev={aScroll.onPrev}
                      prevDisabled={aScroll.prevDisabled}
                    />
                  </div>
                </div>
              </div>

              <div
                className="relative z-[1] overflow-hidden"
                style={{
                  maxHeight: adStripMaxH,
                  opacity: adStripOpacity,
                  pointerEvents: adStripPointer ? "auto" : "none",
                }}
              >
                <div
                  className="mt-[45px] flex min-w-0 gap-3 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar"
                  dir="ltr"
                  ref={aScroll.scrollRef}
                >
                  {adCards.map((c) => (
                    <AdCard1024
                      credits={c.credits}
                      image={c.image}
                      key={c.id}
                      onOpenDetail={() => setAdDetailCard(c)}
                      title={c.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
