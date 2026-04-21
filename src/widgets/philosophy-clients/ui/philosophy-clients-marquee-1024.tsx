/* eslint-disable @next/next/no-img-element */

"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { philosophyMarquee1440Assets } from "@/widgets/philosophy-clients/model/philosophy-clients-marquee.data";

/** Figma 783:8703 / 783:8785 — gap между логотипами 60px, полоса 90px, padding 20px */
const MARQUEE_GAP_PX = 60;

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

/** Figma 783:8832 — mi + xiaomi */
function OrangeXiaomiMarquee1024() {
  const a = philosophyMarquee1440Assets.orange;
  return (
    <div className="relative h-[30px] w-[107.673px] shrink-0">
      <div className="absolute left-0 top-0 h-[30px] w-[29.998px] overflow-hidden">
        <div className="-scale-y-100 relative h-[30px] w-[29.998px] overflow-hidden">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
            decoding="async"
            height={30}
            src={a.miIcon}
            width={30}
          />
        </div>
      </div>
      <div className="absolute left-[37.92px] top-[9.62px] h-[11.037px] w-[68.769px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
          decoding="async"
          height={11}
          src={a.xiaomiWord}
          width={69}
        />
      </div>
    </div>
  );
}

/** Figma 783:8846 — KLAPP */
function OrangeKlappMarquee1024() {
  const a = philosophyMarquee1440Assets.orange;
  return (
    <div className="relative h-[32.889px] w-[84.299px] shrink-0">
      <div className="absolute left-0 top-0 h-[19.921px] w-[30.652px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          decoding="async"
          height={20}
          src={a.klapp1}
          width={31}
        />
      </div>
      <div className="absolute left-[31.38px] top-0 h-[19.923px] w-[51.92px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain"
          decoding="async"
          height={20}
          src={a.klapp2}
          width={52}
        />
      </div>
      <div className="absolute left-[13.82px] top-[25.78px] h-[4.22px] w-[54.282px] overflow-hidden">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
          decoding="async"
          height={4}
          src={a.klapp3}
          width={54}
        />
      </div>
    </div>
  );
}

function MarqueeTrack({
  children,
  durationSec,
  stripClassName,
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
            ? `philosophy-marquee-track flex w-max gap-[60px] ${trackBgClass}`
            : `flex w-max gap-[60px] ${trackBgClass}`
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

/** Figma 783:8703 / 783:8785 — ленты «клиенты» для брейкпоинта 1024 */
export function PhilosophyClientsMarquee1024() {
  const d = philosophyMarquee1440Assets.dark;
  const o = philosophyMarquee1440Assets.orange;

  const darkStrip = useMemo(
    () => (
      <>
        <MarqueeImgSlot heightPx={24} src={d.group261} widthPx={139.136} />
        <MarqueeImgSlot heightPx={50} src={d.image41} widthPx={99} />
        <div className="relative h-[24.001px] w-[266.443px] shrink-0 overflow-hidden">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 block size-full max-w-none object-contain object-left"
            decoding="async"
            height={24}
            src={d.wgp}
            width={266}
          />
        </div>
        <MarqueeImgSlot heightPx={40} src={d.image39} widthPx={118} />
        <MarqueeImgSlot heightPx={24} src={d.layer1} widthPx={217} />
        <MarqueeImgSlot heightPx={40} src={d.ingos} widthPx={114} />
      </>
    ),
    [d],
  );

  const orangeStrip = useMemo(
    () => (
      <>
        <MarqueeImgSlot heightPx={40} src={o.baikal} widthPx={121} />
        <MarqueeImgSlot heightPx={30} src={o.smyssly} widthPx={204} />
        <MarqueeImgSlot heightPx={24} src={o.group} widthPx={107.491} />
        <OrangeXiaomiMarquee1024 />
        <OrangeKlappMarquee1024 />
        <MarqueeImgSlot heightPx={30} src={o.topstretch} widthPx={196.975} />
      </>
    ),
    [o],
  );

  const darkStripClass =
    "philosophy-marquee-strip relative inline-flex h-[90px] min-w-max max-w-none flex-nowrap shrink-0 items-center gap-[60px] bg-[#0d0300] p-[20px]";
  const orangeStripClass =
    "philosophy-marquee-strip relative inline-flex h-[90px] min-w-max max-w-none flex-nowrap shrink-0 items-center gap-[60px] bg-[#ff5c00] p-[20px]";

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-[8] flex h-[157.577px] w-full max-w-full items-center justify-start overflow-hidden">
        <div className="philosophy-marquee-row-dark min-w-0 max-w-full flex-none">
          <MarqueeTrack durationSec={85} stripClassName={darkStripClass} trackBgClass="bg-[#0d0300]">
            {darkStrip}
          </MarqueeTrack>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[121px] z-[8] flex h-[130.41px] w-full max-w-full items-center justify-start overflow-hidden">
        <div className="philosophy-marquee-row-orange min-w-0 max-w-full flex-none">
          <MarqueeTrack durationSec={72} stripClassName={orangeStripClass} trackBgClass="bg-[#ff5c00]">
            {orangeStrip}
          </MarqueeTrack>
        </div>
      </div>
    </>
  );
}
