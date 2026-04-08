/* eslint-disable @next/next/no-img-element */

import {
  firstScreenAssets,
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";

type FirstScreenHero360Props = {
  onConsultationCtaClick?: () => void;
};

export function FirstScreenHero360({ onConsultationCtaClick }: FirstScreenHero360Props) {
  return (
    <div className="absolute inset-0 z-10 overflow-visible">
      <p className="absolute left-1/2 top-[120px] m-0 w-[328px] -translate-x-1/2 text-center text-[0px] leading-[0] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        <span className="text-[44px] font-normal italic leading-[0.9]">{firstScreenContent.titleTop}</span>
        <span className="text-[44px] leading-[0.9]">{" "}</span>
      </p>

      <p className="absolute left-[180px] top-[167px] m-0 w-[328px] -translate-x-1/2 text-center text-[24px] font-bold leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        под{"\u00A0"}бизнес-задачи бренда
      </p>

      <p className="absolute left-[26px] top-[276px] w-[256px] text-[13px] font-normal leading-[1.2] text-white" style={{ letterSpacing: 0 }}>
        {firstScreenContent.subtitle}
      </p>

      <div className="absolute left-[194px] top-[317px] z-20 size-[140px] overflow-visible">
        <FirstScreenCta
          defaultMode="single"
          defaultSingleAsset={firstScreenAssets.cta360}
          defaultSingleInsetClass="inset-[-22.86%_-23.57%_-23.57%_-22.86%]"
          hoverInsetClass="inset-0"
          onClick={onConsultationCtaClick}
          sizeClass="size-[140px]"
        />
      </div>

      <div className="absolute left-[66px] top-[518px] size-[42px] overflow-visible">
        <div className="first-screen-geo-recording-pulse absolute inset-[-238.1%] overflow-visible">
          <img alt="" className="block size-full max-w-none object-contain" src={firstScreenAssets.geo360Ellipse110} />
        </div>
      </div>

      <div className="absolute left-[83px] top-[535px] size-[8px]">
        <div className="first-screen-geo-recording-pulse size-full">
          <img alt="" className="block size-full max-w-none object-contain" src={firstScreenAssets.geo360Ellipse113} />
        </div>
      </div>

      <p className="absolute left-[99px] top-[531px] whitespace-nowrap text-[14px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>
    </div>
  );
}
