"use client";

/* eslint-disable @next/next/no-img-element -- svg из public + маркеры */

import { useCallback, useId, useState, type CSSProperties } from "react";

import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";
import {
  SERVICES_1024_CARD2_SLIDE_PX,
  SERVICES_1024_CARD2_TOP_END_PX,
  SERVICES_1024_CARD2_TOP_START_PX,
  SERVICES_1024_COMMERCIAL_GRID_TOP_PX,
  SERVICES_1024_COMMERCIAL_POINT_LAYOUT,
  SERVICES_1024_VERTICAL_GRID_TOP_PX,
  SERVICES_1024_VERTICAL_POINT_LAYOUT,
  services1440Assets,
  services1440Copy,
} from "@/widgets/services/model/services.data";
import { LevelsUnified1024 } from "@/widgets/levels/ui/levels-section-1024";
import {
  SERVICES_CARD_ANIM_SCROLL_PX,
  useServicesPinScrollProgress,
  useServicesPinWheelClamp,
} from "@/widgets/services/lib/use-services-pin-scroll-progress";
import { useWindowInnerHeight } from "@/widgets/services/lib/use-window-inner-height";

/** Макс. высота sticky: верх карточки 02 в старте + h карточки 480px + тень (см. CommercialCard1024). */
const STICKY_H_PX = SERVICES_1024_CARD2_TOP_START_PX + 480 + 56;

const CARD_SCROLL_CAP_PX = SERVICES_CARD_ANIM_SCROLL_PX["1024"];

/** Figma 783:8494 / 783:8420 — Group 268 внутри вертикальной карточки 765×280. */
const V_HERO_1024 = {
  title: { left: 30, top: 30 },
  subtitle: { left: 30, top: 111 },
  cta: { left: 30, top: 204 },
  packageGlowFrame: { left: 310, top: 211 },
  packageText: { left: 345, top: 226 },
  illustration: { left: 469, top: 30, w: 286, h: 240 },
} as const;

/** Figma 783:8460 — карточка 785×480. Координаты в card coords (Group 268 flattened via contents). */
const C_HERO_1024 = {
  title: { left: 30, top: 30 },
  subtitle: { left: 30, top: 82 },
  cta: { left: 30, top: 169 },
  illustration: { top: 20, w: 307, h: 209, left: 458 },
} as const;

function ConsultationButton1024({
  variant,
  className,
  style,
}: {
  variant: "orange" | "black";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      className={cn(
        "absolute flex h-[56px] w-[260px] flex-col items-center justify-start whitespace-nowrap rounded-[50px] border-0 px-[40px] pb-[20px] pt-[22px] text-[16px] font-semibold leading-[1.2] text-white transition-opacity hover:opacity-92",
        variant === "orange" ? "bg-[#ff5c00]" : "bg-[#0d0300]",
        className,
      )}
      onClick={() => dispatchOpenConsultationModal("consultation")}
      style={style}
      type="button"
    >
      бесплатная консультация
    </button>
  );
}

function VerticalPointCell1024({
  left,
  top,
  width,
  num,
  lead,
  text,
}: {
  left: number;
  top: number;
  width: number;
  num: string;
  lead: string;
  text: string;
}) {
  return (
    <div className="absolute flex flex-col gap-[10px]" style={{ left, top, width }}>
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#fff4ee]">
        <span className="text-[12px] font-semibold leading-none text-[#0d0300]">{num}</span>
      </div>
      <p className="m-0 text-[12px] font-normal leading-[1.2] text-white" style={{ maxWidth: width }}>
        <span className="font-bold">{lead}</span>
        {text}
      </p>
    </div>
  );
}

function CommercialPointCell1024({
  left,
  top,
  width,
  num,
  lead,
  text,
}: {
  left: number;
  top: number;
  width: number;
  num: string;
  lead: string;
  text: string;
}) {
  /** Figma 1024: колонка — кружок сверху, текст снизу (как вертикальный блок). */
  return (
    <div className="absolute flex flex-col gap-[10px]" style={{ left, top, width }}>
      <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#0d0300]">
        <span className="text-[12px] font-semibold leading-none text-white">{num}</span>
      </div>
      <p className="m-0 text-[12px] font-normal leading-[1.2] text-[#0d0300]" style={{ maxWidth: width }}>
        <span className="font-bold">{lead}</span>
        {text}
      </p>
    </div>
  );
}

function Services1024PackageRow() {
  return (
    <div
      className="pointer-events-none absolute z-[3] size-[8px] rounded-full bg-[#ff5c00]"
      data-services-package-glow=""
      style={{
        left: V_HERO_1024.packageGlowFrame.left + 17,
        top: V_HERO_1024.packageGlowFrame.top + 20,
        boxShadow: "0 0 12px 4px rgba(255, 92, 0, 0.9), 0 0 24px 8px rgba(255, 92, 0, 0.5)",
      }}
    />
  );
}

function Services1024PackageCaption({
  packageBold,
  packageLead,
  packageTrail,
  style,
}: {
  packageBold: string;
  packageLead: string;
  packageTrail: string;
  style: CSSProperties;
}) {
  return (
    <p
      className="absolute z-[3] m-0 whitespace-nowrap text-[14px] font-normal leading-[1.2] text-white"
      style={style}
    >
      <span>{packageLead}</span>
      <span className="font-bold">{packageBold}</span>
      <span>{packageTrail}</span>
    </p>
  );
}

function VerticalCard1024() {
  const v = services1440Copy.vertical;
  const points = [...v.points];

  return (
    <article
      className="relative h-[520px] w-[785px] shrink-0 overflow-hidden rounded-[20px] bg-[#0d0300]"
      data-services-hero="vertical"
    >
      <div
        aria-hidden
        className="absolute left-[10px] top-[10px] z-[0] h-[280px] w-[765px] overflow-hidden rounded-[20px] bg-gradient-to-b from-[#424242] to-[#141414] opacity-70"
      />
      <div
        className="pointer-events-none absolute z-[1] h-[240px] w-[286px]"
        style={{
          left: V_HERO_1024.illustration.left,
          top: V_HERO_1024.illustration.top,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={V_HERO_1024.illustration.h}
          src={services1440Assets.verticalIllustration}
          width={V_HERO_1024.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 max-w-[681px] text-[32px] font-bold leading-[0.9] tracking-[-0.64px] text-white"
        style={{ left: V_HERO_1024.title.left, top: V_HERO_1024.title.top }}
      >
        <span className="font-normal italic">{v.titleItalic}</span>
        <span>{v.titleBold}</span>
      </p>
      <p
        className="absolute z-[3] m-0 max-w-[681px] text-[16px] font-normal leading-[1.2] text-white"
        style={{ left: V_HERO_1024.subtitle.left, top: V_HERO_1024.subtitle.top }}
      >
        {v.subtitle}
      </p>
      <ConsultationButton1024
        style={{ left: V_HERO_1024.cta.left, top: V_HERO_1024.cta.top }}
        variant="orange"
      />
      <Services1024PackageRow />
      <Services1024PackageCaption
        packageBold={v.packageBold}
        packageLead={v.packageLead}
        packageTrail={v.packageTrail}
        style={{ left: V_HERO_1024.packageText.left, top: V_HERO_1024.packageText.top }}
      />

      <div
        className="pointer-events-none absolute left-[30px] z-[1] w-[725px]"
        style={{ top: SERVICES_1024_VERTICAL_GRID_TOP_PX, height: 176 }}
      >
        <div className="pointer-events-auto relative h-full w-full">
          {points.map((p, i) => {
            const lay = SERVICES_1024_VERTICAL_POINT_LAYOUT[i];
            if (!lay) return null;
            return (
              <VerticalPointCell1024
                key={p.n}
                lead={p.lead}
                left={lay.left}
                num={p.n}
                text={p.text}
                top={lay.top}
                width={lay.w}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

function CommercialCard1024() {
  const c = services1440Copy.commercial;
  const points = [...c.points];

  return (
    <article
      className="relative h-[480px] w-[785px] shrink-0 overflow-hidden rounded-[20px] bg-[#fff4ee] shadow-[0_-8px_40px_rgba(13,3,0,0.12)]"
      data-services-hero="commercial"
    >
      <div
        aria-hidden
        className="absolute left-[10px] top-[15px] z-[0] h-[240px] w-[765px] overflow-hidden rounded-[20px] bg-gradient-to-t from-[#ff5c00] from-[19%] to-[rgba(255,154,68,0.3)] opacity-70"
      />
      <div
        className="pointer-events-none absolute z-[1] h-[209px] w-[307px] overflow-hidden"
        style={{
          top: C_HERO_1024.illustration.top,
          left: C_HERO_1024.illustration.left,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={C_HERO_1024.illustration.h}
          src={services1440Assets.commercialIllustration}
          width={C_HERO_1024.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 max-w-[681px] text-[32px] font-bold leading-[0.9] tracking-[-0.64px] text-[#0d0300]"
        style={{ left: C_HERO_1024.title.left, top: C_HERO_1024.title.top }}
      >
        <span className="font-normal italic">{c.titleItalic}</span>
        <span>
          {c.titleBoldLine1}
          {c.titleBoldLine2}
        </span>
      </p>
      <p
        className="absolute z-[3] m-0 max-w-[681px] text-[16px] font-normal leading-[1.2] text-[#0d0300]"
        style={{ left: C_HERO_1024.subtitle.left, top: C_HERO_1024.subtitle.top }}
      >
        {c.subtitle}
      </p>
      <ConsultationButton1024
        style={{ left: C_HERO_1024.cta.left, top: C_HERO_1024.cta.top }}
        variant="black"
      />

      <div
        className="pointer-events-none absolute left-[30px] z-[1] w-[725px]"
        style={{ top: SERVICES_1024_COMMERCIAL_GRID_TOP_PX, minHeight: 176 }}
      >
        <div className="pointer-events-auto relative h-full w-full">
          {points.map((p, i) => {
            const lay = SERVICES_1024_COMMERCIAL_POINT_LAYOUT[i];
            if (!lay) return null;
            return (
              <CommercialPointCell1024
                key={p.n}
                lead={p.lead}
                left={lay.left}
                num={p.n}
                text={p.text}
                top={lay.top}
                width={lay.w}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function ServicesSection1024() {
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const setPinRef = useCallback((node: HTMLDivElement | null) => {
    setPinEl(node);
  }, []);

  const { slideProgress } = useServicesPinScrollProgress(pinEl, "1024");
  useServicesPinWheelClamp(pinEl, "1024");
  const slidePx = (1 - slideProgress) * SERVICES_1024_CARD2_SLIDE_PX;
  const vh = useWindowInnerHeight();
  const pinTotalPx = vh + CARD_SCROLL_CAP_PX;
  const stickyHPx = Math.round(STICKY_H_PX - SERVICES_1024_CARD2_SLIDE_PX * slideProgress);
  const spacerPx = Math.max(0, pinTotalPx - stickyHPx);

  return (
    <section
      className="services-section-scope relative z-10 hidden w-full bg-[#0d0300] min-[1024px]:block min-[1440px]:hidden [overscroll-behavior-y:contain]"
      data-services-pin=""
      id="services-section-1024"
    >
      <div className="relative w-full min-w-0">
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-t-[60px] bg-white" />
        <div
          data-services-white-column=""
          className="relative isolate mx-auto flex w-full max-w-[1024px] flex-col"
        >
        <div
          ref={setPinRef}
          data-services-pin-root=""
          className="relative w-full shrink-0"
          style={{ minHeight: pinTotalPx }}
        >
          <div
            data-services-sticky-panel=""
            className="sticky top-0 z-30 w-full overflow-hidden rounded-t-[60px] bg-white"
            style={{ minHeight: stickyHPx }}
          >
            <div
              className="relative flex w-full flex-col overflow-hidden"
              style={{ minHeight: stickyHPx }}
            >
              <div
                className="pointer-events-none shrink-0"
                style={{ minHeight: stickyHPx }}
                aria-hidden
              />

              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-[40px] top-[150px] z-30">
                  <SectionEyebrowRow align="end" dotClassName="self-center" gapClassName="gap-[8px]">
                    <p className="m-0 whitespace-nowrap text-[15px] font-semibold lowercase leading-[1.2] text-[#0d0300]">
                      {services1440Copy.eyebrow}
                    </p>
                  </SectionEyebrowRow>
                </div>

                <div className="absolute left-[199px] top-[90px] z-[1]">
                  <VerticalCard1024 />
                </div>

                <div
                  className="absolute left-[199px] z-[5] will-change-transform"
                  style={{
                    top: SERVICES_1024_CARD2_TOP_END_PX,
                    transform: `translate3d(0, ${slidePx}px, 0)`,
                  }}
                >
                  <CommercialCard1024 />
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none relative z-0 shrink-0 bg-white"
            style={{ minHeight: spacerPx }}
            aria-hidden
          />
        </div>

        <div data-services-levels-wrap="" className="relative z-0 w-full overflow-visible">
          <div className="overflow-visible rounded-bl-[60px] rounded-br-[60px] bg-white pb-8 pt-0">
            <section
              className="levels-section-scope relative z-0 w-full pt-0"
              id="levels-section-1024"
            >
              <LevelsUnified1024 />
            </section>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
