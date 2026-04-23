"use client";

/* eslint-disable @next/next/no-img-element -- svg стрелки и иконка просмотров */

import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { DarkSurfaceGrid } from "@/shared/ui/dark-surface-grid";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import type { CasesAdCard, CasesVerticalCard } from "@/widgets/cases/model/cases.data";
import {
  cases1440Assets,
  cases1440Copy,
  casesAdCards1440,
  casesVerticalCards1440,
  type CasesSectionCardsProps,
} from "@/widgets/cases/model/cases.data";
import { CasesAdDetailModal } from "@/widgets/cases/ui/cases-ad-detail-modal";
import { CasesVerticalDetailModal } from "@/widgets/cases/ui/cases-vertical-detail-modal";

function CasesTitle60({
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
        "max-w-[770px] text-[60px] font-bold leading-[0.9] text-white [&_span]:leading-[0.9]",
        className,
      )}
    >
      <span className="font-normal italic">{italicPart}</span>
      <span>{boldPart}</span>
    </h2>
  );
}

const CASES_SCROLL_GAP_PX = 10;
const CASES_SCROLL_EDGE_EPS_PX = 2;

const CASES_ARROW_FILL_ORANGE = "#FF5C00";
const CASES_ARROW_FILL_WHITE = "#FFFFFF";

const CASES_ARROW_CIRCLE =
  "M34 17C34 26.3888 26.3888 34 17 34C7.61116 34 0 26.3888 0 17C0 7.61116 7.61116 0 17 0C26.3888 0 34 7.61116 34 17Z";
const CASES_ARROW_PATH_FIGMA_LEFT_FILE =
  "M21.7036 16.3649C22.0432 16.7347 22.0432 17.2653 21.7036 17.6351L15.4703 24.4213C15.0749 24.8518 14.361 24.9164 13.8758 24.5657C13.3906 24.2149 13.3177 23.5816 13.7131 23.1512L19.3631 17L13.7131 10.8488C13.3177 10.4184 13.3906 9.78507 13.8758 9.43433C14.361 9.0836 15.0749 9.14822 15.4703 9.57867L21.7036 16.3649Z";
const CASES_ARROW_PATH_FIGMA_RIGHT_FILE =
  "M12.2964 17.6351C11.9568 17.2653 11.9568 16.7347 12.2964 16.3649L18.5297 9.57867C18.9251 9.14822 19.639 9.0836 20.1242 9.43433C20.6094 9.78507 20.6823 10.4184 20.2869 10.8488L14.6369 17L20.2869 23.1512C20.6823 23.5816 20.6094 24.2149 20.1242 24.5657C19.639 24.9164 18.9251 24.8518 18.5297 24.4213L12.2964 17.6351Z";

function CasesNavArrowIcon({
  active,
  variant,
}: {
  active: boolean;
  variant: "back" | "forward";
}) {
  const d =
    variant === "back" ? CASES_ARROW_PATH_FIGMA_RIGHT_FILE : CASES_ARROW_PATH_FIGMA_LEFT_FILE;
  const chevron = (
    <path clipRule="evenodd" d={d} fill={CASES_ARROW_FILL_WHITE} fillRule="evenodd" />
  );

  return (
    <svg aria-hidden className="size-[34px] shrink-0" fill="none" height="34" viewBox="0 0 34 34" width="34" xmlns="http://www.w3.org/2000/svg">
      <g
        className={cn(
          "transition-opacity duration-300 ease-out",
          active ? "opacity-100" : "opacity-30",
        )}
      >
        <path d={CASES_ARROW_CIRCLE} fill={CASES_ARROW_FILL_ORANGE} />
        {chevron}
      </g>
    </svg>
  );
}

function CasesArrowsNav({
  className,
  nextDisabled,
  onNext,
  onPrev,
  prevDisabled,
}: {
  className?: string;
  nextDisabled: boolean;
  onNext: () => void;
  onPrev: () => void;
  prevDisabled: boolean;
}) {
  return (
    <div
      className={cn("flex h-[34px] w-[80px] shrink-0 flex-row items-center gap-[12px]", className)}
      dir="ltr"
    >
      <button
        aria-disabled={prevDisabled}
        aria-label="Назад"
        className={cn(
          "inline-flex size-[34px] items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity duration-300",
          prevDisabled ? "cursor-default" : "cursor-pointer hover:opacity-90",
        )}
        disabled={prevDisabled}
        onClick={onPrev}
        type="button"
      >
        <CasesNavArrowIcon active={!prevDisabled} variant="back" />
      </button>
      <button
        aria-disabled={nextDisabled}
        aria-label="Вперёд"
        className={cn(
          "inline-flex size-[34px] items-center justify-center rounded-full border-0 bg-transparent p-0 transition-opacity duration-300",
          nextDisabled ? "cursor-default" : "cursor-pointer hover:opacity-90",
        )}
        disabled={nextDisabled}
        onClick={onNext}
        type="button"
      >
        <CasesNavArrowIcon active={!nextDisabled} variant="forward" />
      </button>
    </div>
  );
}

const casesCardHoverEase = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

function VerticalCard({
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
      className="group relative h-[510px] w-[283px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#0d0300]"
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
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <Image
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
          casesCardHoverEase,
        )}
        fill
        sizes="283px"
        src={image}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[#0d0300] mix-blend-color transition-opacity",
          casesCardHoverEase,
          overlayLight ? "opacity-20" : "opacity-100 group-hover:opacity-20",
        )}
      />
      <div className="pointer-events-none absolute inset-px flex h-[calc(100%-2px)] flex-col justify-between p-5 text-center text-white">
        <div className="flex min-h-[40px] flex-col justify-center text-[24px] font-bold uppercase leading-[0.9]">
          {titleLines.map((line) => (
            <p className="m-0 leading-[0.9]" key={line}>
              {line}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img
            alt=""
            className="block h-[21px] w-[31px] max-h-[21px] max-w-[31px] shrink-0 object-contain"
            height="21"
            src={cases1440Assets.viewsIcon}
            style={{ height: "21px", maxHeight: "21px", maxWidth: "31px", width: "31px" }}
            width="31"
          />
          <p className="m-0 text-[40px] font-bold lowercase leading-[1.2]">{views}</p>
        </div>
        <div className="flex min-h-[37px] flex-col justify-end text-[14px] font-normal leading-[1.2]">
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

function AdCard({
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
      className="group relative h-[320px] w-[575px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#0d0300]"
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
      tabIndex={onOpenDetail ? 0 : undefined}
    >
      <Image
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover grayscale transition-[filter] will-change-[filter] group-hover:grayscale-0",
          casesCardHoverEase,
        )}
        fill
        sizes="575px"
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
        <div className="h-[34px] shrink-0 opacity-0" aria-hidden />
        <p className="m-0 max-w-full text-[40px] font-bold uppercase leading-[0.9]">{title}</p>
        <div className="flex min-h-[34px] max-w-[340px] flex-col justify-end text-[14px] font-normal leading-[1.2]">
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

type CarouselMode = "vertical" | "advertising";

function useCasesCarouselScroll(mode: CarouselMode) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const stepPx =
    mode === "vertical" ? 283 + CASES_SCROLL_GAP_PX : 575 + CASES_SCROLL_GAP_PX;

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { clientWidth, scrollWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    const x = el.scrollLeft;
    const atStart = x <= CASES_SCROLL_EDGE_EPS_PX;
    const atEnd = maxScroll <= CASES_SCROLL_EDGE_EPS_PX || x >= maxScroll - CASES_SCROLL_EDGE_EPS_PX;
    setPrevDisabled(atStart);
    setNextDisabled(atEnd);
  }, []);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    const ro = new ResizeObserver(() => {
      sync();
    });
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      ro.disconnect();
    };
  }, [sync]);

  const onPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = el.scrollLeft;
    setNextDisabled(false);
    if (x - stepPx <= CASES_SCROLL_EDGE_EPS_PX) {
      setPrevDisabled(true);
    }
    el.scrollBy({ left: -stepPx, behavior: "smooth" });
  }, [stepPx]);

  const onNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const x = el.scrollLeft;
    setPrevDisabled(false);
    if (x + stepPx >= maxScroll - CASES_SCROLL_EDGE_EPS_PX) {
      setNextDisabled(true);
    }
    el.scrollBy({ left: stepPx, behavior: "smooth" });
  }, [stepPx]);

  return { nextDisabled, onNext, onPrev, prevDisabled, scrollRef };
}

/**
 * Phase 4 UAT (2026-04-23): pin-scroll collapse сняли — обе ленты всегда видны,
 * анимируется только reveal-фэйд отдельных карточек через `motion.article`.
 */
export function CasesSection1440({
  verticalCards = casesVerticalCards1440,
  adCards = casesAdCards1440,
}: CasesSectionCardsProps = {}) {
  const [detailCard, setDetailCard] = useState<CasesVerticalCard | null>(null);
  const [adDetailCard, setAdDetailCard] = useState<CasesAdCard | null>(null);

  const vScroll = useCasesCarouselScroll("vertical");
  const aScroll = useCasesCarouselScroll("advertising");

  return (
    <section className="cases-section-scope relative z-10 w-full bg-[#0d0300]" dir="ltr" id="cases-section-1440">
      <CasesVerticalDetailModal
        card={detailCard}
        layout="1440"
        onClose={() => setDetailCard(null)}
        open={detailCard != null}
      />
      <CasesAdDetailModal
        card={adDetailCard}
        layout="1440"
        onClose={() => setAdDetailCard(null)}
        open={adDetailCard != null}
      />
      <div className="relative flex w-full justify-center">
        <DarkSurfaceGrid />
        <div className="relative w-full max-w-[1440px] overflow-x-clip pb-6">
          <div className="relative z-[1] grid grid-cols-[195px_minmax(0,1fr)_auto] items-start px-[140px] pt-[120px]">
            <SectionEyebrowRow align="end" dotClassName="self-center">
              <p className="m-0 whitespace-nowrap text-[17px] font-semibold lowercase leading-[1.2] text-white">
                {cases1440Copy.eyebrow}
              </p>
            </SectionEyebrowRow>
            <div className="min-w-0 justify-self-start pr-4">
              <CasesTitle60
                boldPart={cases1440Copy.verticalTitleRest}
                italicPart={cases1440Copy.verticalTitleItalic}
              />
            </div>
            <div className="mt-[42px] translate-x-[80px]">
              <CasesArrowsNav
                nextDisabled={vScroll.nextDisabled}
                onNext={vScroll.onNext}
                onPrev={vScroll.onPrev}
                prevDisabled={vScroll.prevDisabled}
              />
            </div>
          </div>

          <div className="relative z-[1] mt-[26px] px-[140px]">
            <div
              className="flex min-w-0 w-full gap-2.5 overflow-x-auto overflow-y-hidden no-scrollbar"
              dir="ltr"
              ref={vScroll.scrollRef}
            >
              {verticalCards.map((c) => (
                <VerticalCard
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

          <div className="relative z-[1] pt-[50px] px-[140px]">
            <div className="ml-[195px] h-px w-full max-w-[1105px] bg-white/25" aria-hidden />
          </div>

          <div className="relative z-[1] px-[140px]">
            <div className="grid grid-cols-[195px_minmax(0,1fr)_auto] items-start pt-[50px]">
              <span className="min-h-px min-w-0 select-none" aria-hidden />
              <div className="min-w-0 justify-self-start pr-4">
                <CasesTitle60
                  boldPart={cases1440Copy.adTitleRest}
                  italicPart={cases1440Copy.adTitleItalic}
                />
              </div>
              <div className="mt-[42px] shrink-0 justify-self-end translate-x-[80px]">
                <CasesArrowsNav
                  className="shrink-0"
                  nextDisabled={aScroll.nextDisabled}
                  onNext={aScroll.onNext}
                  onPrev={aScroll.onPrev}
                  prevDisabled={aScroll.prevDisabled}
                />
              </div>
            </div>
          </div>

          <div className="relative z-[1] px-[140px]">
            <div
              className="mt-[26px] flex min-w-0 w-full justify-start gap-2.5 overflow-x-auto overflow-y-hidden pb-1 no-scrollbar"
              dir="ltr"
              ref={aScroll.scrollRef}
            >
              {adCards.map((c) => (
                <AdCard
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
