"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  firstScreenAssets,
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";

type FirstScreenHero1440Props = {
  onConsultationCtaClick?: () => void;
};

export function FirstScreenHero1440({ onConsultationCtaClick }: FirstScreenHero1440Props) {
  // Poster JPG отдаётся как LCP element до момента готовности видео — закрывается onCanPlay.
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (!firstScreenAssets.heroVideoPreview) return;
    const media = window.matchMedia("(min-width: 1440px)");
    const update = () => setShouldLoadVideo(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <>
      <div className="absolute inset-0 overflow-visible">
        <div
          className="absolute left-[920px] top-[516px] z-10 h-[214px] w-[380px] overflow-clip rounded-[12px]"
          data-showreel-source="1440"
        >
          {!videoReady ? (
            <Image
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
              fill
              priority
              sizes="380px"
              src={firstScreenAssets.firstScreen1440.heroImage}
            />
          ) : null}
          {firstScreenAssets.heroVideoPreview ? (
            <video
              aria-label="BTS Ozon"
              autoPlay
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              loop
              muted
              onCanPlay={() => setVideoReady(true)}
              playsInline
              poster={firstScreenAssets.firstScreen1440.heroImage}
              preload="none"
              src={shouldLoadVideo ? firstScreenAssets.heroVideoPreview : undefined}
            />
          ) : (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#1a1410]"
            />
          )}
        </div>

        <p className="absolute left-[893px] top-[193px] w-[407px] text-[17px] font-normal leading-[1.2] text-white" style={{ letterSpacing: 0 }}>
          {firstScreenContent.subtitle}
        </p>

        <p className="absolute left-[140px] top-[162px] m-0 whitespace-nowrap text-[90px] font-normal italic leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
          {firstScreenContent.titleTop}
        </p>

        <p className="absolute left-[367px] top-[243px] m-0 text-[90px] font-bold leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
          <span className="whitespace-nowrap">под{"\u00A0"}бизнес-задачи</span>
          <br />
          бренда
        </p>

        <p className="absolute left-[162px] top-[703px] whitespace-nowrap text-[24px] font-bold leading-[1.2] text-white">
          {firstScreenContent.geoLabel}
        </p>

        <div className="absolute left-[118px] top-[690px] size-[56px] overflow-visible">
          <div className="absolute inset-[-214.29%] overflow-visible">
            <FirstScreenGeoGlow blur={60} cx={148} cy={148} filterId="geo-blur-1440" r={28} size={296} />
          </div>
        </div>

        <div className="absolute left-[780px] top-[376px] z-[320] size-[210px] overflow-visible">
          <FirstScreenCta defaultMode="composed" onClick={onConsultationCtaClick} sizeClass="size-[210px]" />
        </div>
      </div>
    </>
  );
}
