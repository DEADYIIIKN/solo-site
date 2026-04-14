"use client";

import {
  firstScreenAssets,
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";

type FirstScreenHero1440Props = {
  onConsultationCtaClick?: () => void;
};

const copyRevealClass =
  "block opacity-0 [animation:first-screen-copy-in_760ms_cubic-bezier(0.22,1,0.36,1)_forwards]";

export function FirstScreenHero1440({ onConsultationCtaClick }: FirstScreenHero1440Props) {
  return (
    <>
      <style jsx>{`
        @keyframes first-screen-copy-in {
          from {
            opacity: 0;
            transform: translate3d(36px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
      <div className="absolute inset-0 overflow-visible">
        <div
          className="absolute left-[920px] top-[516px] z-10 h-[214px] w-[380px] overflow-clip rounded-[12px]"
          data-showreel-source="1440"
        >
          {firstScreenAssets.heroVideoPreview ? (
            <video
              aria-label="BTS Ozon"
              autoPlay
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              preload="auto"
              src={firstScreenAssets.heroVideoPreview}
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
          <span className={copyRevealClass} style={{ animationDelay: "0ms" }}>
            {firstScreenContent.titleTop}
          </span>
        </p>

        <p className="absolute left-[367px] top-[243px] m-0 text-[90px] font-bold leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
          <span className={copyRevealClass} style={{ animationDelay: "80ms" }}>
            <span className="whitespace-nowrap">под{"\u00A0"}бизнес-задачи</span>
            <br />
            бренда
          </span>
        </p>

        <p className="absolute left-[162px] top-[698px] whitespace-nowrap text-[24px] font-bold leading-[1.2] text-white">
          {firstScreenContent.geoLabel}
        </p>

        <div className="absolute left-[118px] top-[684px] size-[56px] overflow-visible">
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
