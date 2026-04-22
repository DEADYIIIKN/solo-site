"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { BoneyardSkeleton } from "@/shared/ui/boneyard-skeleton";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { useCasesHorizontalCarousel } from "@/widgets/cases/lib/use-cases-horizontal-carousel";
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

/** Figma 783:11420 — 360. Без pin-scroll и без разделителя: вертикаль и реклама в одной колонке с зазорами из макета. */
const CASES_SCROLL_GAP_PX = 16;

const VERT_CARD_W = 208;
const VERT_CARD_H = 376;
const AD_CARD_W = 242;
const AD_CARD_H = 135;

const casesCardHoverEase = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

function CasesTitle28({
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
        "min-w-0 max-w-[min(100%,260px)] text-[28px] font-bold leading-[0.9] text-white [&_span]:leading-[0.9]",
        className,
      )}
    >
      <span className="font-normal italic">{italicPart}</span>
      <span>{boldPart}</span>
    </h2>
  );
}

function VerticalCard360({
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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <BoneyardSkeleton loading={!imageLoaded} name="cases-vertical-card-360">
    <article
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[#0d0300]"
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
        onError={() => setImageLoaded(true)}
        onLoad={() => setImageLoaded(true)}
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
        <div className="flex min-h-[32px] flex-col justify-center text-[18px] font-bold uppercase leading-[0.9]">
          {titleLines.map((line) => (
            <p className="m-0 leading-[0.9]" key={line}>
              {line}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img
            alt=""
            className="block h-[14px] w-[20px] shrink-0 object-contain"
            height="14"
            src={cases1440Assets.viewsIcon}
            width="20"
          />
          <p className="m-0 text-[30px] font-bold lowercase leading-[1.2]">{views}</p>
        </div>
        <div className="flex min-h-[28px] flex-col justify-end text-[11px] font-normal leading-[1.2]">
          {credits.map((line, i) => (
            <p className={cn("m-0", i < credits.length - 1 && "mb-[6px]")} key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
    </BoneyardSkeleton>
  );
}

function AdCard360({
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
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <BoneyardSkeleton loading={!imageLoaded} name="cases-ad-card-360">
    <article
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[4px] bg-[#0d0300]"
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
        onError={() => setImageLoaded(true)}
        onLoad={() => setImageLoaded(true)}
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
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-4 py-3.5 text-center text-white">
        <div className="h-[16px] shrink-0 opacity-0" aria-hidden />
        <p className="m-0 max-w-full text-[18px] font-bold uppercase leading-[0.9]">{title}</p>
        <div className="flex min-h-[18px] max-w-[220px] flex-col justify-end text-[10px] font-normal leading-[1.2]">
          {credits.map((line, i) => (
            <p className={cn("m-0 leading-[1.2]", i < credits.length - 1 && "mb-[6px]")} key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </article>
    </BoneyardSkeleton>
  );
}

export function CasesSection360({
  verticalCards = casesVerticalCards1440,
  adCards = casesAdCards1440,
}: CasesSectionCardsProps = {}) {
  const [detailCard, setDetailCard] = useState<CasesVerticalCard | null>(null);
  const [adDetailCard, setAdDetailCard] = useState<CasesAdCard | null>(null);
  const vScroll = useCasesHorizontalCarousel(VERT_CARD_W, CASES_SCROLL_GAP_PX);
  const aScroll = useCasesHorizontalCarousel(AD_CARD_W, CASES_SCROLL_GAP_PX);

  return (
    <section className="cases-section-scope relative z-10 w-full bg-[#0d0300]" dir="ltr" id="cases-section-360">
      <CasesVerticalDetailModal
        card={detailCard}
        layout="360"
        onClose={() => setDetailCard(null)}
        open={detailCard != null}
      />
      <CasesAdDetailModal
        card={adDetailCard}
        layout="360"
        onClose={() => setAdDetailCard(null)}
        open={adDetailCard != null}
      />
      <CasesSectionBackgroundGrid />
      <div className="relative mx-auto w-full max-w-[360px] pb-[120px]">
        <div className="relative z-[1] flex flex-col gap-[100px] px-4 pt-[70px]">
          <div className="flex flex-col items-center gap-[50px]">
            <SectionEyebrowRow align="end" dotClassName="self-center" gapClassName="gap-2">
              <p className="m-0 whitespace-nowrap text-[14px] font-semibold lowercase leading-[1.2] text-white">
                {cases1440Copy.eyebrow}
              </p>
            </SectionEyebrowRow>

            <div className="flex w-full min-w-0 flex-col gap-10">
              <div className="flex w-full min-w-0 items-end justify-between gap-3">
                <CasesTitle28
                  boldPart={cases1440Copy.verticalTitleRest}
                  italicPart={cases1440Copy.verticalTitleItalic}
                />
                <div className="shrink-0 pb-0.5">
                  <CasesSectionArrowsNav
                    nextDisabled={vScroll.nextDisabled}
                    onNext={vScroll.onNext}
                    onPrev={vScroll.onPrev}
                    prevDisabled={vScroll.prevDisabled}
                  />
                </div>
              </div>
              <div
                className="flex min-w-0 gap-4 overflow-x-auto overflow-y-hidden pb-1 pt-2 no-scrollbar"
                dir="ltr"
                ref={vScroll.scrollRef}
              >
                {verticalCards.map((c) => (
                  <VerticalCard360
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
          </div>

          <div className="flex min-w-0 flex-col gap-10">
            <div className="flex w-full min-w-0 items-end justify-between gap-3">
              <CasesTitle28
                boldPart={cases1440Copy.adTitleRest}
                italicPart={cases1440Copy.adTitleItalic}
              />
              <div className="shrink-0 pb-0.5">
                <CasesSectionArrowsNav
                  nextDisabled={aScroll.nextDisabled}
                  onNext={aScroll.onNext}
                  onPrev={aScroll.onPrev}
                  prevDisabled={aScroll.prevDisabled}
                />
              </div>
            </div>
            <div
              className="flex min-w-0 gap-4 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar"
              dir="ltr"
              ref={aScroll.scrollRef}
            >
              {adCards.map((c) => (
                <AdCard360
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
    </section>
  );
}
