"use client";

/* eslint-disable @next/next/no-img-element -- svg из public + маркеры */

import { useCallback, useId, useState, type CSSProperties } from "react";

import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";
import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import {
  SERVICES_1440_COMMERCIAL_GRID_TOP_PX,
  SERVICES_1440_COMMERCIAL_POINT_LAYOUT,
  SERVICES_1440_VERTICAL_GRID_TOP_PX,
  SERVICES_1440_VERTICAL_POINT_LAYOUT,
  SERVICES_CARD2_SLIDE_PX,
  SERVICES_CARD2_TOP_END_PX,
  SERVICES_CARD2_TOP_START_PX,
  services1440Assets,
  services1440Copy,
} from "@/widgets/services/model/services.data";
import { LevelsUnified1440 } from "@/widgets/levels/ui/levels-section-1440";
import {
  SERVICES_CARD_ANIM_SCROLL_PX,
  useServicesPinScrollProgress,
  useServicesPinWheelClamp,
} from "@/widgets/services/lib/use-services-pin-scroll-progress";
import { useWindowInnerHeight } from "@/widgets/services/lib/use-window-inner-height";

/** Макс. высота sticky: верх карточки 02 в старте + h карточки 510px + тень (см. CommercialCard1440). */
const STICKY_H_PX = SERVICES_CARD2_TOP_START_PX + 510 + 56;

const CARD_SCROLL_CAP_PX = SERVICES_CARD_ANIM_SCROLL_PX["1440"];

/**
 * Координаты внутри героя 945×315 — как дочерние ноды Figma `783:9207` Group 268 (origin = левый верх 945×315).
 * Не вычитать (10,10) карточки: этот блок уже с `mx-[10px] mt-[10px]` и совпадает с Group 268.
 */
const V_HERO = {
  title: { left: 40, top: 40 },
  subtitle: { left: 40, top: 138 },
  cta: { left: 40, top: 236 },
  /**
   * Figma `783:9214`–`783:9215`: как герой 480 — фрейм 42×42, внутри `inset-[-238.1%]` + `FirstScreenGeoGlow`
   * (blur 50, r 21, dotR 4, viewBox 242×242).
   */
  packageGlowFrame: { left: 385, top: 245 },
  /** Figma `783:9213` */
  packageText: { left: 420, top: 260 },
  /** Figma `783:9208` vector 178 */
  illustration: { left: 609, top: 30, w: 326, h: 273 },
} as const;

/** Координаты внутри героя 945×280 — Figma `783:9241` Group 285 (как у V_HERO, без лишнего −10). */
const C_HERO = {
  title: { left: 40, top: 40 },
  subtitle: { left: 40, top: 102 },
  cta: { left: 40, top: 200 },
  illustration: { left: 588, top: 30, w: 347, h: 236 },
} as const;

function ConsultationButton({
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
        "absolute inline-flex h-[60px] w-[300px] items-center justify-center whitespace-nowrap rounded-[50px] border-0 px-10 text-[16px] font-semibold leading-[1.2] text-white transition-opacity hover:opacity-92",
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

function VerticalPointCell({
  badgeLeft,
  top,
  num,
  lead,
  text,
  maxTextPx,
}: {
  badgeLeft: number;
  top: number;
  num: string;
  lead: string;
  text: string;
  maxTextPx: number;
}) {
  return (
    <div className="absolute flex gap-2.5" style={{ left: badgeLeft, top }}>
      <div
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#fff4ee]"
        style={{ minHeight: 30, minWidth: 30 }}
      >
        <span className="text-[17px] font-semibold leading-[1.2] text-[#0d0300]">{num}</span>
      </div>
      <p
        className="m-0 text-[14px] font-normal leading-[1.2] text-white"
        style={{ width: maxTextPx, maxWidth: maxTextPx }}
      >
        <span className="font-bold">{lead}</span>
        {text}
      </p>
    </div>
  );
}

function CommercialPointCell({
  badgeLeft,
  top,
  num,
  lead,
  text,
  maxTextPx,
}: {
  badgeLeft: number;
  top: number;
  num: string;
  lead: string;
  text: string;
  maxTextPx: number;
}) {
  return (
    <div className="absolute flex gap-2.5" style={{ left: badgeLeft, top }}>
      <div
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#0d0300]"
        style={{ minHeight: 30, minWidth: 30 }}
      >
        <span className="text-[17px] font-semibold leading-[1.2] text-white">{num}</span>
      </div>
      <p
        className="m-0 text-[14px] font-normal leading-[1.2] text-[#0d0300]"
        style={{ width: maxTextPx, maxWidth: maxTextPx }}
      >
        <span className="font-bold">{lead}</span>
        {text}
      </p>
    </div>
  );
}

/** «Пакеты…» — Figma 783:9214/9215: inline SVG halo (FirstScreenGeoGlow, blur=50, r=21) + sharp dot из dotR=4. */
function Services1440PackageRow() {
  const rawId = useId().replace(/:/g, "");
  const filterId = `services-pkg-glow-${rawId}`;
  return (
    <div
      className="pointer-events-none absolute z-[2] size-[42px] overflow-visible"
      data-services-package-glow=""
      style={{
        left: V_HERO.packageGlowFrame.left,
        top: V_HERO.packageGlowFrame.top,
      }}
    >
      <div className="absolute inset-[-238.1%] overflow-visible">
        <FirstScreenGeoGlow
          blur={30}
          cx={121}
          cy={121}
          dotR={4}
          filterId={filterId}
          pulse={false}
          r={21}
          size={242}
        />
      </div>
    </div>
  );
}

function Services1440PackageCaption({
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
      className="absolute z-[3] m-0 whitespace-nowrap text-[16px] font-normal leading-[1.2] text-white"
      style={style}
    >
      <span>{packageLead}</span>
      <span className="font-bold">{packageBold}</span>
      <span>{packageTrail}</span>
    </p>
  );
}

function VerticalCard1440() {
  const v = services1440Copy.vertical;
  const points = [...v.points];

  return (
    <article className="relative h-[550px] w-[965px] shrink-0 overflow-hidden rounded-[30px] bg-[#0d0300]">
      <div
        className="relative z-[1] mx-[10px] mt-[10px] h-[315px] w-[945px] overflow-visible rounded-[25px]"
        data-services-hero="vertical"
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 rounded-[25px] bg-gradient-to-b from-[#424242] to-[#141414] opacity-70"
        />
        <div
          className="pointer-events-none absolute z-[1] h-[273px] w-[326px]"
          style={{
            left: V_HERO.illustration.left,
            top: V_HERO.illustration.top,
          }}
        >
          <img
            alt=""
            className="block h-full w-full object-contain object-right"
            height={V_HERO.illustration.h}
            src={services1440Assets.verticalIllustration}
            width={V_HERO.illustration.w}
          />
        </div>
        <p
          className="absolute z-[3] m-0 w-[838px] text-[40px] font-bold leading-[0.9] tracking-[-0.8px] text-white"
          style={{ left: V_HERO.title.left, top: V_HERO.title.top }}
        >
          <span className="font-normal italic">{v.titleItalic}</span>
          <span>{v.titleBold}</span>
        </p>
        <p
          className="absolute z-[3] m-0 max-w-[838px] whitespace-nowrap text-[17px] font-normal leading-[1.2] text-white"
          style={{ left: V_HERO.subtitle.left, top: V_HERO.subtitle.top }}
        >
          {v.subtitle}
        </p>
        <ConsultationButton
          style={{ left: V_HERO.cta.left, top: V_HERO.cta.top }}
          variant="orange"
        />
        <Services1440PackageRow />
        <Services1440PackageCaption
          packageBold={v.packageBold}
          packageLead={v.packageLead}
          packageTrail={v.packageTrail}
          style={{ left: V_HERO.packageText.left, top: V_HERO.packageText.top }}
        />
      </div>

      <div
        className="pointer-events-none absolute left-0 right-0 z-[1]"
        style={{ top: SERVICES_1440_VERTICAL_GRID_TOP_PX, height: 185 }}
      >
        <div className="pointer-events-auto relative h-full w-[965px]">
          {points.map((p, i) => {
            const lay = SERVICES_1440_VERTICAL_POINT_LAYOUT[i];
            if (!lay) return null;
            return (
              <VerticalPointCell
                key={p.n}
                badgeLeft={lay.badgeLeft}
                lead={p.lead}
                maxTextPx={p.maxTextPx}
                num={p.n}
                text={p.text}
                top={lay.top}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

function CommercialCard1440() {
  const c = services1440Copy.commercial;
  const points = [...c.points];

  return (
    <article className="relative h-[510px] w-[965px] shrink-0 overflow-hidden rounded-[30px] bg-[#fff4ee] shadow-[0_-8px_40px_rgba(13,3,0,0.12)]">
      <div
        className="relative z-[1] mx-[10px] mt-[10px] h-[280px] w-[945px] overflow-hidden rounded-[25px]"
        data-services-hero="commercial"
      >
        <div
          aria-hidden
          className="absolute inset-0 z-0 rounded-[25px] bg-gradient-to-t from-[#ff5c00] from-[19%] to-[rgba(255,154,68,0.3)] opacity-70"
        />
        <div
          className="pointer-events-none absolute z-[1] h-[236px] w-[347px]"
          style={{
            left: C_HERO.illustration.left,
            top: C_HERO.illustration.top,
          }}
        >
          <img
            alt=""
            className="block h-full w-full object-contain object-right"
            height={C_HERO.illustration.h}
            src={services1440Assets.commercialIllustration}
            width={C_HERO.illustration.w}
          />
        </div>
        <p
          className="absolute z-[3] m-0 w-[838px] text-[40px] font-bold leading-[0.9] tracking-[-0.8px] text-[#0d0300]"
          style={{ left: C_HERO.title.left, top: C_HERO.title.top }}
        >
          <span className="font-normal italic">{c.titleItalic}</span>
          <span>
            {c.titleBoldLine1}
            {c.titleBoldLine2}
          </span>
        </p>
        <p
          className="absolute z-[3] m-0 max-w-[838px] whitespace-nowrap text-[17px] font-normal leading-[1.2] text-[#0d0300]"
          style={{ left: C_HERO.subtitle.left, top: C_HERO.subtitle.top }}
        >
          {c.subtitle}
        </p>
        <ConsultationButton
          style={{ left: C_HERO.cta.left, top: C_HERO.cta.top }}
          variant="black"
        />
      </div>

      <div
        className="pointer-events-none absolute left-0 right-0 z-[1]"
        style={{ top: SERVICES_1440_COMMERCIAL_GRID_TOP_PX, height: 180 }}
      >
        <div className="pointer-events-auto relative h-full w-[965px]">
          {points.map((p, i) => {
            const lay = SERVICES_1440_COMMERCIAL_POINT_LAYOUT[i];
            if (!lay) return null;
            return (
              <CommercialPointCell
                key={p.n}
                badgeLeft={lay.badgeLeft}
                lead={p.lead}
                maxTextPx={p.maxTextPx}
                num={p.n}
                text={p.text}
                top={lay.top}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function ServicesSection1440() {
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const setPinRef = useCallback((node: HTMLDivElement | null) => {
    setPinEl(node);
  }, []);

  const { slideProgress } = useServicesPinScrollProgress(pinEl, "1440");
  useServicesPinWheelClamp(pinEl, "1440");
  const slidePx = (1 - slideProgress) * SERVICES_CARD2_SLIDE_PX;
  const vh = useWindowInnerHeight();
  /** Документная высота pin = vh + CAP — стабильно для getServicesPinScrollRange. */
  const pinTotalPx = vh + CARD_SCROLL_CAP_PX;
  /** Сжимаем sticky по мере анимации — иначе под карточкой остаётся ~460px пустого белого. */
  const stickyHPx = Math.round(STICKY_H_PX - SERVICES_CARD2_SLIDE_PX * slideProgress);
  const spacerPx = Math.max(0, pinTotalPx - stickyHPx);

  return (
    <section
      className="services-section-scope relative z-10 hidden w-full bg-[#0d0300] min-[1440px]:block [overscroll-behavior-y:contain]"
      data-services-pin=""
      id="services-section-1440"
    >
      {/*
       * Белая колонка: sticky + спейсер + «Уровни» — один непрерывный bg-white, без зазора #0d0300 между пином и уровнями.
       * data-services-pin-root только на треке анимации (высота = хук), не на всей колонке.
       */}
      <div className="relative w-full min-w-0">
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-t-[60px] bg-white" />
        <div
          data-services-white-column=""
          className="relative isolate mx-auto flex w-full max-w-[1440px] flex-col"
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
                <div className="absolute left-[140px] top-[160px] z-30">
                  <SectionEyebrowRow align="end" dotClassName="self-center" gapClassName="gap-[8px]">
                    <p className="m-0 whitespace-nowrap text-[17px] font-semibold lowercase leading-[1.2] text-[#0d0300]">
                      {services1440Copy.eyebrow}
                    </p>
                  </SectionEyebrowRow>
                </div>

                <div className="absolute left-[335px] top-[120px] z-[1]">
                  <VerticalCard1440 />
                </div>

                <div
                  className="absolute left-[335px] z-[5] will-change-transform"
                  style={{
                    top: SERVICES_CARD2_TOP_END_PX,
                    transform: `translate3d(0, ${slidePx}px, 0)`,
                  }}
                >
                  <CommercialCard1440 />
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
              id="levels-section-1440"
            >
              <LevelsUnified1440 />
            </section>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
