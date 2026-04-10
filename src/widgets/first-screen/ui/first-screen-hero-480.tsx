import {
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";

type FirstScreenHero480Props = {
  onConsultationCtaClick?: () => void;
};

export function FirstScreenHero480({ onConsultationCtaClick }: FirstScreenHero480Props) {
  return (
    <div className="absolute inset-0 z-10 overflow-visible">
      {/* title "видеоконтент": centered, top 140, w432 */}
      <p className="absolute left-1/2 top-[140px] m-0 w-[432px] -translate-x-1/2 text-center text-[0px] leading-[0] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        <span className="text-[55px] font-normal italic leading-[0.9]">{firstScreenContent.titleTop}</span>
        <span className="text-[55px] leading-[0.9]">{" "}</span>
      </p>

      {/* title "под бизнес-задачи бренда": centered, top 195, w328 */}
      <p className="absolute left-[calc(50%-4px)] top-[195px] m-0 w-[328px] -translate-x-1/2 text-center text-[30px] font-bold leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        под{"\u00A0"}бизнес-задачи бренда
      </p>

      {/* subtitle: 54,323 w270 */}
      <p className="absolute left-[54px] top-[323px] w-[270px] text-[15px] font-normal leading-[1.2] text-white" style={{ letterSpacing: 0 }}>
        {firstScreenContent.subtitle}
      </p>

      {/* CTA: 246,370 180x180 — raster image */}
      <div className="absolute left-[246px] top-[370px] z-20 size-[180px] overflow-visible">
        <FirstScreenCta
          defaultMode="composed"
          onClick={onConsultationCtaClick}
          sizeClass="size-[180px]"
        />
      </div>

      {/* geo glow: 112,608 42x42, inset-[-238.1%] */}
      <div className="absolute left-[112px] top-[608px] size-[42px] overflow-visible">
        <div className="absolute inset-[-238.1%] overflow-visible">
          <FirstScreenGeoGlow blur={50} cx={121} cy={121} dotR={4} filterId="geo-blur-480" r={21} size={242} />
        </div>
      </div>

      {/* geo label: 145,625 */}
      <p className="absolute left-[145px] top-[620px] whitespace-nowrap text-[16px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>
    </div>
  );
}
