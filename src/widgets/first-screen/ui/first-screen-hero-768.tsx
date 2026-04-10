import {
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";

type FirstScreenHero768Props = {
  onConsultationCtaClick?: () => void;
};

export function FirstScreenHero768({ onConsultationCtaClick }: FirstScreenHero768Props) {
  return (
    <div className="absolute inset-0 z-10 overflow-visible">
      {/* title "видеоконтент": centered, 65,180 w638 */}
      <p
        className="absolute left-1/2 top-[180px] m-0 w-[638px] -translate-x-1/2 text-center text-[0px] leading-[0] text-white"
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        <span className="text-[80px] font-normal italic leading-[0.9]">
          {firstScreenContent.titleTop}
        </span>
        <span className="text-[80px] leading-[0.9]">{" "}</span>
      </p>

      {/* title "под бизнес-задачи бренда": 147,256 w466 centered */}
      <p
        className="absolute left-[calc(50%-4px)] top-[256px] m-0 w-[466px] -translate-x-1/2 text-center text-[44px] font-bold leading-[0.9] text-white"
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        под{"\u00A0"}бизнес-задачи бренда
      </p>

      {/* subtitle: 135,447 w331 */}
      <p className="absolute left-[135px] top-[447px] w-[331px] text-[17px] font-normal leading-[1.2] text-white" style={{ letterSpacing: 0 }}>
        {firstScreenContent.subtitle}
      </p>

      {/* CTA: 424,447 210x210 */}
      <div className="absolute left-[424px] top-[447px] z-20 size-[210px] overflow-visible">
        <FirstScreenCta defaultMode="composed" onClick={onConsultationCtaClick} sizeClass="size-[210px]" />
      </div>

      {/* geo label: 239,783 */}
      <p className="absolute left-[239px] top-[778px] whitespace-nowrap text-[24px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>

      {/* geo glow: 195,764 56x56 */}
      <div className="absolute left-[195px] top-[764px] size-[56px] overflow-visible">
        <div className="absolute inset-[-214.29%] overflow-visible">
          <FirstScreenGeoGlow blur={60} cx={148} cy={148} filterId="geo-blur-768" r={28} size={296} />
        </div>
      </div>
    </div>
  );
}
