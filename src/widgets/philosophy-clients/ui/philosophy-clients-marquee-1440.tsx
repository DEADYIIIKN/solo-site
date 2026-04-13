/* eslint-disable @next/next/no-img-element */

"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { philosophyMarquee1440Assets } from "@/widgets/philosophy-clients/model/philosophy-clients-marquee.data";

const MARQUEE_GAP_PX = 100;

/**
 * Слот под макет Figma: фиксированный bbox. Картинка заполняет слот с `object-fit`,
 * сами SVG в `public/.../marquee-*` с `preserveAspectRatio="xMidYMid meet"` — без перекоса.
 * `h-auto/w-auto` без явного размера давали 0×0 в части браузеров → «пустые» слоты.
 */
function MarqueeImgSlot({
  src,
  widthPx,
  heightPx,
  fit = "contain",
}: {
  src: string;
  widthPx: number;
  heightPx: number;
  fit?: "contain" | "cover";
}) {
  const w = Math.round(widthPx);
  const h = Math.round(heightPx);
  return (
    <div
      className="relative box-border shrink-0 overflow-hidden"
      style={{ height: heightPx, width: widthPx }}
    >
      <img
        alt=""
        className={
          fit === "cover"
            ? "pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
            : "pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-center"
        }
        decoding="async"
        height={h}
        src={src}
        width={w}
      />
    </div>
  );
}

/** Figma 783:9521 — иконка mi + слово (абсолютное позиционирование как в макете) */
function OrangeXiaomiMarquee() {
  const a = philosophyMarquee1440Assets.orange;
  return (
    <div className="relative h-[50px] w-[178px] shrink-0">
      <div className="absolute left-0 top-0 h-[50px] w-[49.997px] overflow-hidden">
        <div className="-scale-y-100 relative h-[50px] w-[49.997px] overflow-hidden">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
            decoding="async"
            height={50}
            src={a.miIcon}
            width={50}
          />
        </div>
      </div>
      <div className="absolute left-[63.2px] top-[16.04px] h-[18.395px] w-[114.616px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
          decoding="async"
          height={18}
          src={a.xiaomiWord}
          width={115}
        />
      </div>
    </div>
  );
}

/** Figma 783:9535 — KLAPP COSMETICS */
function OrangeKlappMarquee() {
  const a = philosophyMarquee1440Assets.orange;
  return (
    <div className="relative h-[50px] w-[139px] shrink-0">
      <div className="absolute left-0 top-0 h-[33.202px] w-[51.086px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          decoding="async"
          height={33}
          src={a.klapp1}
          width={51}
        />
      </div>
      <div className="absolute left-[52.3px] top-0 h-[33.205px] w-[86.533px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          decoding="async"
          height={33}
          src={a.klapp2}
          width={87}
        />
      </div>
      <div className="absolute left-[23.03px] top-[42.97px] h-[7.033px] w-[90.47px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
          decoding="async"
          height={7}
          src={a.klapp3}
          width={90}
        />
      </div>
    </div>
  );
}

function MarqueeTrack({
  children,
  durationSec,
  stripClassName,
  /** Тот же фон, что у полосы — иначе `gap` между двумя сегментами показывает белый родитель */
  trackBgClass,
}: {
  children: React.ReactNode;
  durationSec: number;
  stripClassName: string;
  trackBgClass: string;
}) {
  const segmentRef = useRef<HTMLDivElement>(null);
  const [shiftPx, setShiftPx] = useState(0);

  useLayoutEffect(() => {
    const el = segmentRef.current;
    if (!el) return;

    let raf = 0;
    /** Стабильное значение shift: частые микро-изменения ширины перезапускают keyframes и дают дёрганье */
    const commitWidth = (rawWidth: number) => {
      const next = Math.round(rawWidth) + MARQUEE_GAP_PX;
      if (next <= MARQUEE_GAP_PX) return;
      setShiftPx((prev) => {
        if (prev === 0) return next;
        if (Math.abs(prev - next) < 3) return prev;
        return next;
      });
    };

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        commitWidth(el.getBoundingClientRect().width);
      });
    };

    measure();
    let boot2 = 0;
    const boot1 = requestAnimationFrame(() => {
      boot2 = requestAnimationFrame(measure);
    });

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(boot1);
      cancelAnimationFrame(boot2);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const style = {
    "--philosophy-marquee-duration": `${durationSec}s`,
    "--philosophy-marquee-shift": `${shiftPx}px`,
  } as React.CSSProperties;

  return (
    <div className="min-w-0 max-w-full overflow-hidden">
      <div
        className={
          shiftPx > 0
            ? `philosophy-marquee-track flex w-max gap-[100px] ${trackBgClass}`
            : `flex w-max gap-[100px] ${trackBgClass}`
        }
        style={style}
      >
        <div ref={segmentRef} className={stripClassName}>
          {children}
        </div>
        <div aria-hidden className={stripClassName}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PhilosophyClientsMarquee1440() {
  const d = philosophyMarquee1440Assets.dark;
  const o = philosophyMarquee1440Assets.orange;

  const darkStrip = useMemo(
    () => (
      <>
        <MarqueeImgSlot heightPx={30} src={d.group261} widthPx={173.92} />
        <MarqueeImgSlot heightPx={70} src={d.image41} widthPx={138.34} />
        <div className="relative h-[30px] w-[333.054px] shrink-0 overflow-hidden">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
            decoding="async"
            height={30}
            src={d.wgp}
            width={333}
          />
        </div>
        <MarqueeImgSlot heightPx={60} src={d.image39} widthPx={177.042} />
        <MarqueeImgSlot heightPx={30} src={d.layer1} widthPx={271.698} />
        <MarqueeImgSlot heightPx={60} src={d.ingos} widthPx={171.181} />
      </>
    ),
    [d],
  );

  const orangeStrip = useMemo(
    () => (
      <>
        <MarqueeImgSlot heightPx={60} src={o.baikal} widthPx={181.5} />
        <MarqueeImgSlot heightPx={40} src={o.smyssly} widthPx={272} />
        <MarqueeImgSlot heightPx={40} src={o.group} widthPx={179.152} />
        <OrangeXiaomiMarquee />
        <OrangeKlappMarquee />
        <MarqueeImgSlot heightPx={40.001} src={o.topstretch} widthPx={262.634} />
      </>
    ),
    [o],
  );

  const darkStripClass =
    "philosophy-marquee-strip relative inline-flex h-[120px] min-w-max max-w-none flex-nowrap shrink-0 items-center gap-[100px] bg-[#0d0300] px-[20px] py-[30px]";
  const orangeStripClass =
    "philosophy-marquee-strip relative inline-flex h-[120px] min-w-max max-w-none flex-nowrap shrink-0 items-center gap-[100px] bg-[#ff5c00] px-[20px] py-[30px]";

  return (
    <>
      {/* Видимое окно фиксированной ширины; трек с двумя копиями сегмента уезжает влево на один цикл (измеряется в px) */}
      <div className="absolute left-1/2 top-0 z-[8] flex h-[214.314px] w-screen max-w-[100vw] -translate-x-1/2 items-center justify-start overflow-hidden">
        <div className="philosophy-marquee-row-dark min-w-0 max-w-full flex-none">
          <MarqueeTrack durationSec={85} stripClassName={darkStripClass} trackBgClass="bg-[#0d0300]">
            {darkStrip}
          </MarqueeTrack>
        </div>
      </div>

      <div className="absolute left-1/2 top-[170.36px] z-[8] flex h-[181.069px] w-screen max-w-[100vw] -translate-x-1/2 items-center justify-start overflow-hidden">
        <div className="philosophy-marquee-row-orange min-w-0 max-w-full flex-none">
          <MarqueeTrack durationSec={72} stripClassName={orangeStripClass} trackBgClass="bg-[#ff5c00]">
            {orangeStrip}
          </MarqueeTrack>
        </div>
      </div>
    </>
  );
}
