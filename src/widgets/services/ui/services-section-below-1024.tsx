"use client";

/* eslint-disable @next/next/no-img-element -- svg из public */

import { useId, type CSSProperties } from "react";

import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";
import { services1440Assets, services1440Copy } from "@/widgets/services/model/services.data";

/** Figma 783:11560 — 768. Координаты от левого верха карточки (display:contents в выгрузке). */
const U768 = {
  shell: "px-12 py-20 rounded-tl-[40px] rounded-tr-[40px] gap-[50px]",
  eyebrowText: "text-[16px]",
  cardsGap: "gap-[40px]",
  vertical: {
    card: { maxW: 672, h: 532, radius: 20 },
    gradient: { left: 10, top: 10, w: 652, h: 280, radius: 15 },
    illustration: { left: 356, top: 30, w: 286, h: 240 },
    title: { left: 30, top: 30, size: 32, track: -0.64, maxW: 598 },
    subtitle: { left: 30, top: 111, size: 14 },
    cta: { left: 30, top: 201, w: 250, h: 52, font: 15 },
    packageFrame: { left: 344, top: 199 },
    packageText: { left: 379, top: 214, size: 14 },
    gridLeft: 30,
    gridTop: 310,
    gridH: 200,
    pointFont: 12,
    points: [
      { left: 0, top: 0, w: 179 },
      { left: 228, top: 0, w: 168 },
      { left: 433, top: 0, w: 180 },
      { left: 0, top: 100, w: 167 },
      { left: 228, top: 100, w: 188 },
    ],
  },
  commercial: {
    card: { maxW: 675, h: 520, radius: 20 },
    gradient: { left: 10, top: 15, w: 652, h: 240, radius: 15 },
    /** 10 + 652 − 10 − 307: отступ иллюстрации от правого края градиента. */
    illustration: { left: 345, top: 35, w: 307, h: 209 },
    title: { left: 30, top: 30, size: 32, track: -0.64, maxW: 598 },
    subtitle: { left: 30, top: 111, size: 14 },
    cta: { left: 30, top: 171, w: 250, h: 52, font: 15 },
    gridLeft: 30,
    gridTop: 275,
    gridH: 220,
    pointFont: 12,
    points: [
      { left: 0, top: 0, w: 182 },
      { left: 228, top: 0, w: 176 },
      { left: 433, top: 0, w: 189 },
      { left: 0, top: 114, w: 167 },
      { left: 228, top: 114, w: 215 },
    ],
  },
} as const;

/** Figma 783:10935 — 480. */
const U480 = {
  shell: "px-6 py-20 gap-[60px]",
  eyebrowText: "text-[16px]",
  cardsGap: "gap-[40px]",
  vertical: {
    card: { maxW: 432, h: 620, radius: 16 },
    gradient: { left: 10, top: 10, w: 412, h: 292, radius: 12 },
    illustration: { left: 131, top: 30, w: 281, h: 235 },
    title: { left: 26, top: 26, size: 30, track: -0.6, maxW: 380 },
    subtitle: { left: 26, top: 125, size: 14, maxW: 304 },
    cta: { left: 26, top: 202, w: 250, h: 48, font: 14 },
    packageFrame: { left: 10, top: 250 },
    packageText: { left: 43, top: 267, size: 12 },
    gridLeft: 26,
    gridTop: 322,
    gridH: 280,
    pointFont: 11,
    points: [
      { left: 0, top: 0, w: 179 },
      { left: 212, top: 0, w: 168 },
      { left: 0, top: 96, w: 180 },
      { left: 212, top: 96, w: 168 },
      { left: 0, top: 190, w: 188 },
    ],
  },
  commercial: {
    card: { maxW: 432, h: 640, radius: 16 },
    gradient: { left: 10, top: 10, w: 412, h: 260, radius: 12 },
    /** 10 + 412 − 10 − 307 — внутренний отступ справа в герое. */
    illustration: { left: 105, top: 20, w: 307, h: 209 },
    title: { left: 26, top: 26, size: 30, track: -0.6, maxW: 380 },
    subtitle: { left: 26, top: 125, size: 14, maxW: 320 },
    cta: { left: 26, top: 202, w: 250, h: 48, font: 14 },
    gridLeft: 26,
    gridTop: 290,
    gridH: 320,
    pointFont: 11,
    points: [
      { left: 0, top: 0, w: 168 },
      { left: 212, top: 0, w: 168 },
      { left: 0, top: 109, w: 180 },
      { left: 212, top: 109, w: 167 },
      /** Figma 783:10983 — узкая колонка 188px, переносы как в макете. */
      { left: 0, top: 203, w: 188 },
    ],
  },
} as const;

/** Figma 783:10377 — 360. */
const U360 = {
  shell: "px-4 py-[70px] rounded-tl-[30px] rounded-tr-[30px] gap-[30px]",
  eyebrowText: "text-[14px] leading-none",
  cardsGap: "gap-[30px]",
  vertical: {
    card: { maxW: 328, h: 545, radius: 16 },
    gradient: { left: 10, top: 10, w: 308, h: 252, radius: 12 },
    illustration: { left: 86, top: 20, w: 222, h: 186 },
    title: { left: 22, top: 22, size: 23, track: -0.46, maxW: 284 },
    subtitle: { left: 22, top: 104, size: 12, maxW: 265 },
    cta: { left: 22, top: 176, w: 284, h: 44, font: 13 },
    packageFrame: { left: 11, top: 220 },
    packageText: { left: 44, top: 237, size: 10 },
    pointFont: 11,
    textW: 254,
    /** Бейдж left 22; текст left 52 — pl-[30px] относительно строки. */
    rows: [
      { badgeTop: 282, textTop: 283 },
      { badgeTop: 328, textTop: 329 },
      { badgeTop: 374, textTop: 375 },
      { badgeTop: 420, textTop: 421 },
      { badgeTop: 479, textTop: 480 },
    ],
  },
  commercial: {
    card: { maxW: 328, h: 515, radius: 16 },
    gradient: { left: 10, top: 10, w: 308, h: 210, radius: 12 },
    illustration: { left: 46, top: 20, w: 266, h: 181 },
    title: { left: 22, top: 22, size: 23, track: -0.46, maxW: 282 },
    subtitle: { left: 22, top: 92, size: 12, maxW: 265 },
    cta: { left: 22, top: 164, w: 284, h: 44, font: 13 },
    pointFont: 11,
    textW: 254,
    rows: [
      { badgeTop: 240, textTop: 241 },
      { badgeTop: 299, textTop: 300 },
      { badgeTop: 358, textTop: 359 },
      { badgeTop: 404, textTop: 405 },
      { badgeTop: 450, textTop: 451 },
    ],
  },
} as const;

function ConsultationBtn({
  variant,
  style,
  h,
  w,
  fontPx,
}: {
  variant: "orange" | "black";
  style: CSSProperties;
  h: number;
  w: number;
  fontPx: number;
}) {
  return (
    <button
      className={cn(
        "absolute z-[4] inline-flex items-center justify-center whitespace-nowrap rounded-[50px] border-0 font-semibold leading-[1.2] text-white transition-opacity hover:opacity-92",
        variant === "orange" ? "bg-[#ff5c00]" : "bg-[#0d0300]",
      )}
      onClick={() => dispatchOpenConsultationModal("consultation")}
      style={{ ...style, height: h, width: w, fontSize: fontPx }}
      type="button"
    >
      бесплатная консультация
    </button>
  );
}

function PackageGlow({ left, top, filterId }: { left: number; top: number; filterId: string }) {
  return (
    <div
      className="pointer-events-none absolute z-[2] size-[42px] overflow-visible"
      data-services-package-glow=""
      style={{ left, top }}
    >
      <div className="absolute inset-[-238.1%] overflow-visible">
        <FirstScreenGeoGlow
          blur={50}
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

function PackageCaption({
  lead,
  bold,
  trail,
  style,
  className,
}: {
  lead: string;
  bold: string;
  trail: string;
  style: CSSProperties;
  className?: string;
}) {
  return (
    <p className={cn("absolute z-[3] m-0 text-white", className)} style={style}>
      <span>{lead}</span>
      <span className="font-bold">{bold}</span>
      <span>{trail}</span>
    </p>
  );
}

function PointCol({
  num,
  lead,
  text,
  left,
  top,
  width,
  fontPx,
  theme,
}: {
  num: string;
  lead: string;
  text: string;
  left: number;
  top: number;
  width: number;
  fontPx: number;
  theme: "vertical" | "commercial";
}) {
  /** Figma 768/480: коммерция — колонка «бейдж сверху, текст снизу», как у тёмной карточки. */
  const isCommercial = theme === "commercial";
  return (
    <div className="absolute flex flex-col gap-[10px]" style={{ left, top, width }}>
      <div
        className={cn(
          "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full",
          isCommercial ? "bg-[#0d0300]" : "bg-[#fff4ee]",
        )}
      >
        <span
          className={cn(
            "font-semibold leading-none",
            isCommercial ? "text-white" : "text-[#0d0300]",
          )}
          style={{ fontSize: fontPx }}
        >
          {num}
        </span>
      </div>
      <p
        className={cn(
          "m-0 font-normal leading-[1.2]",
          isCommercial ? "text-[#0d0300]" : "text-white",
        )}
        style={{ fontSize: fontPx, maxWidth: width }}
      >
        <span className="font-bold">{lead}</span>
        {text}
      </p>
    </div>
  );
}

type GridSpec = { left: number; top: number; w: number };

function PointsGrid({
  points,
  layout,
  gridLeft,
  gridTop,
  gridH,
  cardW,
  fontPx,
  theme,
}: {
  points: readonly { n: string; lead: string; text: string }[];
  layout: readonly GridSpec[];
  gridLeft: number;
  gridTop: number;
  gridH: number;
  cardW: number;
  fontPx: number;
  theme: "vertical" | "commercial";
}) {
  const gridW = Math.max(0, cardW - gridLeft - 16);
  return (
    <div
      className="pointer-events-none absolute z-[1]"
      style={{
        left: gridLeft,
        top: gridTop,
        width: gridW,
        minHeight: gridH,
      }}
    >
      <div className="pointer-events-auto relative w-full">
        {points.map((p, i) => {
          const lay = layout[i];
          if (!lay) return null;
          /** Всегда `lay.w` из Figma — на 480 коммерция п.05: 188px, переносы как в макете. */
          return (
            <PointCol
              key={p.n}
              fontPx={fontPx}
              lead={p.lead}
              left={lay.left}
              num={p.n}
              text={p.text}
              theme={theme}
              top={lay.top}
              width={lay.w}
            />
          );
        })}
      </div>
    </div>
  );
}

function Points360({
  points,
  rows,
  textW,
  fontPx,
  theme,
}: {
  points: readonly { n: string; lead: string; text: string }[];
  rows: readonly { badgeTop: number; textTop: number }[];
  textW: number;
  fontPx: number;
  theme: "vertical" | "commercial";
}) {
  const textCls = theme === "vertical" ? "text-white" : "text-[#0d0300]";
  return (
    <>
      {points.map((p, i) => {
        const row = rows[i];
        if (!row) return null;
        return (
          <div key={p.n}>
            <div
              className={cn(
                "pointer-events-auto absolute left-[22px] z-[1] flex h-[22px] w-[22px] items-center justify-center rounded-full",
                theme === "vertical" ? "bg-[#fff4ee]" : "bg-[#0d0300]",
              )}
              style={{ top: row.badgeTop }}
            >
              <span
                className={cn(
                  "font-semibold leading-none",
                  theme === "vertical" ? "text-[#0d0300]" : "text-white",
                )}
                style={{ fontSize: fontPx }}
              >
                {p.n}
              </span>
            </div>
            <p
              className={cn("pointer-events-auto absolute left-[52px] z-[1] m-0 font-normal leading-[1.2]", textCls)}
              style={{ top: row.textTop, fontSize: fontPx, maxWidth: textW }}
            >
              <span className="font-bold">{p.lead}</span>
              {p.text}
            </p>
          </div>
        );
      })}
    </>
  );
}

function VerticalCard768() {
  const rawId = useId().replace(/:/g, "");
  const v = services1440Copy.vertical;
  const s = U768.vertical;
  const pkgId = `svc768-v-pkg-${rawId}`;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#0d0300]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-b from-[#424242] to-[#141414] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.verticalIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-bold leading-[0.9] text-white"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span className="font-normal italic">{v.titleItalic}</span>
        <span>{v.titleBold}</span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-white whitespace-nowrap"
        style={{ left: s.subtitle.left, top: s.subtitle.top, fontSize: s.subtitle.size }}
      >
        {v.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="orange"
        w={s.cta.w}
      />
      <PackageGlow filterId={pkgId} left={s.packageFrame.left} top={s.packageFrame.top} />
      <PackageCaption
        bold={v.packageBold}
        className="max-w-[220px] whitespace-normal leading-[1.2]"
        lead={v.packageLead}
        style={{ left: s.packageText.left, top: s.packageText.top, fontSize: s.packageText.size }}
        trail={v.packageTrail}
      />
      <PointsGrid
        cardW={cw}
        fontPx={s.pointFont}
        gridH={s.gridH}
        gridLeft={s.gridLeft}
        gridTop={s.gridTop}
        layout={s.points}
        points={v.points}
        theme="vertical"
      />
    </article>
  );
}

function CommercialCard768() {
  const c = services1440Copy.commercial;
  const s = U768.commercial;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#fff4ee] shadow-[0_-8px_40px_rgba(13,3,0,0.12)]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-t from-[#ff5c00] from-[19%] to-[rgba(255,154,68,0.3)] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.commercialIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-bold leading-[0.9] text-[#0d0300]"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span className="font-normal italic">{c.titleItalic}</span>
        <span>
          {c.titleBoldLine1}
          {c.titleBoldLine2}
        </span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-[#0d0300] whitespace-nowrap"
        style={{ left: s.subtitle.left, top: s.subtitle.top, fontSize: s.subtitle.size }}
      >
        {c.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="black"
        w={s.cta.w}
      />
      <PointsGrid
        cardW={cw}
        fontPx={s.pointFont}
        gridH={s.gridH}
        gridLeft={s.gridLeft}
        gridTop={s.gridTop}
        layout={s.points}
        points={c.points}
        theme="commercial"
      />
    </article>
  );
}

function VerticalCard480() {
  const rawId = useId().replace(/:/g, "");
  const v = services1440Copy.vertical;
  const s = U480.vertical;
  const pkgId = `svc480-v-pkg-${rawId}`;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#0d0300]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-b from-[#424242] to-[#141414] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.verticalIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-bold leading-[0.9] text-white"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span className="font-normal italic">{v.titleItalic}</span>
        <span>{v.titleBold}</span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-white"
        style={{
          left: s.subtitle.left,
          top: s.subtitle.top,
          fontSize: s.subtitle.size,
          maxWidth: s.subtitle.maxW,
        }}
      >
        {v.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="orange"
        w={s.cta.w}
      />
      <PackageGlow filterId={pkgId} left={s.packageFrame.left} top={s.packageFrame.top} />
      <PackageCaption
        bold={v.packageBold}
        className="whitespace-nowrap leading-[1.2]"
        lead={v.packageLead}
        style={{ left: s.packageText.left, top: s.packageText.top, fontSize: s.packageText.size }}
        trail={v.packageTrail}
      />
      <PointsGrid
        cardW={cw}
        fontPx={s.pointFont}
        gridH={s.gridH}
        gridLeft={s.gridLeft}
        gridTop={s.gridTop}
        layout={s.points}
        points={v.points}
        theme="vertical"
      />
    </article>
  );
}

function CommercialCard480() {
  const c = services1440Copy.commercial;
  const s = U480.commercial;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#fff4ee] shadow-[0_-8px_40px_rgba(13,3,0,0.12)]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-t from-[#ff5c00] from-[19%] to-[rgba(255,154,68,0.3)] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.commercialIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-normal italic leading-[0.9] text-[#0d0300]"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span>{c.titleItalic}</span>
        <span className="font-bold not-italic">
          {c.titleBoldLine1}
          {c.titleBoldLine2}
        </span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-[#0d0300]"
        style={{
          left: s.subtitle.left,
          top: s.subtitle.top,
          fontSize: s.subtitle.size,
          maxWidth: s.subtitle.maxW,
        }}
      >
        {c.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="black"
        w={s.cta.w}
      />
      <PointsGrid
        cardW={cw}
        fontPx={s.pointFont}
        gridH={s.gridH}
        gridLeft={s.gridLeft}
        gridTop={s.gridTop}
        layout={s.points}
        points={c.points}
        theme="commercial"
      />
    </article>
  );
}

function VerticalCard360() {
  const rawId = useId().replace(/:/g, "");
  const v = services1440Copy.vertical;
  const s = U360.vertical;
  const pkgId = `svc360-v-pkg-${rawId}`;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#0d0300]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-b from-[#424242] to-[#141414] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.verticalIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-bold leading-[0.9] text-white"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span className="font-normal italic">{v.titleItalic}</span>
        <span>{v.titleBold}</span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-white"
        style={{
          left: s.subtitle.left,
          top: s.subtitle.top,
          fontSize: s.subtitle.size,
          maxWidth: s.subtitle.maxW,
        }}
      >
        {v.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="orange"
        w={s.cta.w}
      />
      <PackageGlow filterId={pkgId} left={s.packageFrame.left} top={s.packageFrame.top} />
      <PackageCaption
        bold={v.packageBold}
        className="whitespace-nowrap leading-[1.2]"
        lead={v.packageLead}
        style={{ left: s.packageText.left, top: s.packageText.top, fontSize: s.packageText.size }}
        trail={v.packageTrail}
      />
      <Points360
        fontPx={s.pointFont}
        points={v.points}
        rows={s.rows}
        textW={s.textW}
        theme="vertical"
      />
    </article>
  );
}

function CommercialCard360() {
  const c = services1440Copy.commercial;
  const s = U360.commercial;
  const cw = s.card.maxW;

  return (
    <article
      className="relative w-full shrink-0 overflow-hidden bg-[#fff4ee] shadow-[0_-8px_40px_rgba(13,3,0,0.12)]"
      style={{ maxWidth: cw, height: s.card.h, borderRadius: s.card.radius }}
    >
      <div
        aria-hidden
        className="absolute z-0 bg-gradient-to-t from-[#ff5c00] from-[19%] to-[rgba(255,154,68,0.3)] opacity-70"
        style={{
          left: s.gradient.left,
          top: s.gradient.top,
          width: s.gradient.w,
          height: s.gradient.h,
          borderRadius: s.gradient.radius,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          left: s.illustration.left,
          top: s.illustration.top,
          width: s.illustration.w,
          height: s.illustration.h,
        }}
      >
        <img
          alt=""
          className="block h-full w-full object-contain object-right"
          height={s.illustration.h}
          src={services1440Assets.commercialIllustration}
          width={s.illustration.w}
        />
      </div>
      <p
        className="absolute z-[3] m-0 font-normal italic leading-[0.9] text-[#0d0300]"
        style={{
          left: s.title.left,
          top: s.title.top,
          fontSize: s.title.size,
          letterSpacing: s.title.track,
          maxWidth: s.title.maxW,
        }}
      >
        <span>{c.titleItalic}</span>
        <span className="font-bold not-italic">
          {c.titleBoldLine1}
          {c.titleBoldLine2}
        </span>
      </p>
      <p
        className="absolute z-[3] m-0 font-normal leading-[1.2] text-[#0d0300]"
        style={{
          left: s.subtitle.left,
          top: s.subtitle.top,
          fontSize: s.subtitle.size,
          maxWidth: s.subtitle.maxW,
        }}
      >
        {c.subtitle}
      </p>
      <ConsultationBtn
        fontPx={s.cta.font}
        h={s.cta.h}
        style={{ left: s.cta.left, top: s.cta.top }}
        variant="black"
        w={s.cta.w}
      />
      <Points360
        fontPx={s.pointFont}
        points={c.points}
        rows={s.rows}
        textW={s.textW}
        theme="commercial"
      />
    </article>
  );
}

export function ServicesSectionBelow1024() {
  return (
    <section className="services-section-scope relative z-10 w-full bg-[#0d0300] min-[1024px]:hidden" id="services-section-sm">
      <div className="flex w-full justify-center">
        {/* 768–1023: full-bleed белый, контент в max-w */}
        <div
          className={cn(
            "hidden w-full flex-col bg-white",
            "min-[768px]:max-[1023px]:flex",
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-[768px] flex-col",
              U768.shell,
              U768.cardsGap,
            )}
          >
          <div className="flex w-[110px] shrink-0 flex-col items-end">
            <SectionEyebrowRow align="end" dotClassName="self-center" gapClassName="gap-[8px]">
              <p
                className={cn(
                  "m-0 whitespace-nowrap font-semibold lowercase leading-[1.2] text-[#0d0300]",
                  U768.eyebrowText,
                )}
              >
                {services1440Copy.eyebrow}
              </p>
            </SectionEyebrowRow>
          </div>
          <div className={cn("flex w-full flex-col items-stretch", U768.cardsGap)}>
            <VerticalCard768 />
            <CommercialCard768 />
          </div>
          </div>
        </div>

        {/* 480–767 */}
        <div
          className={cn(
            "hidden w-full flex-col items-center bg-white",
            "min-[480px]:max-[767px]:flex",
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-[480px] flex-col items-center",
              U480.shell,
              U480.cardsGap,
            )}
          >
          <SectionEyebrowRow align="center" className="w-full justify-center" dotClassName="self-center" gapClassName="gap-[8px]">
            <p
              className={cn(
                "m-0 whitespace-nowrap font-semibold lowercase leading-[1.2] text-[#0d0300]",
                U480.eyebrowText,
              )}
            >
              {services1440Copy.eyebrow}
            </p>
          </SectionEyebrowRow>
          <div className={cn("flex w-full flex-col items-center", U480.cardsGap)}>
            <VerticalCard480 />
            <CommercialCard480 />
          </div>
          </div>
        </div>

        {/* &lt;480 */}
        <div
          className={cn(
            "flex w-full flex-col items-center bg-white",
            "max-[479px]:flex min-[480px]:hidden",
          )}
        >
          <div
            className={cn(
              "mx-auto flex w-full max-w-[360px] flex-col items-center",
              U360.shell,
              U360.cardsGap,
            )}
          >
          <SectionEyebrowRow align="start" dotClassName="self-center" gapClassName="gap-[8px]">
            <p className={cn("m-0 whitespace-nowrap font-semibold lowercase text-[#0d0300]", U360.eyebrowText)}>
              {services1440Copy.eyebrow}
            </p>
          </SectionEyebrowRow>
          <div className={cn("flex w-full flex-col items-center", U360.cardsGap)}>
            <VerticalCard360 />
            <CommercialCard360 />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
