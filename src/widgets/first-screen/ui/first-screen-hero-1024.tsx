import {
  firstScreenAssets,
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenCta } from "@/widgets/first-screen/ui/first-screen-cta";
import { FirstScreenGeoGlow } from "@/widgets/first-screen/ui/first-screen-geo-glow";
import { FirstScreenHeroVideoPoster } from "@/widgets/first-screen/ui/first-screen-hero-video-poster";

type FirstScreenHero1024Props = {
  onConsultationCtaClick?: () => void;
};

export function FirstScreenHero1024({ onConsultationCtaClick }: FirstScreenHero1024Props) {
  return (
    <div className="absolute inset-0 overflow-visible">
      {/* image: 604,446 380x214 r12 */}
      <div
        className="absolute left-[604px] top-[446px] z-10 h-[214px] w-[380px] overflow-clip rounded-[12px]"
        data-showreel-source="1024"
      >
        <FirstScreenHeroVideoPoster
          ariaLabel="BTS Ozon"
          posterSrc={firstScreenAssets.heroImage}
          sizes="380px"
          videoSrc={firstScreenAssets.heroVideoPreview}
        />
      </div>

      {/* subtitle: 598,159 w386 */}
      <p className="absolute left-[598px] top-[159px] w-[386px] text-[16px] font-normal leading-[1.2] text-white" style={{ letterSpacing: 0 }}>
        {firstScreenContent.subtitle}
      </p>

      {/* title "видеоконтент": 40,140 */}
      <p className="absolute left-[40px] top-[140px] m-0 whitespace-nowrap text-[70px] font-normal italic leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        {firstScreenContent.titleTop}
      </p>

      {/* title "под бизнес-задачи бренда": 256,199 w728 */}
      <p className="absolute left-[256px] top-[199px] m-0 w-[728px] text-[70px] font-bold leading-[0.9] text-white" style={{ fontFamily: "var(--font-family-display)" }}>
        <span className="whitespace-nowrap">под{" "}бизнес-задачи</span>
        <br />
        бренда
      </p>

      {/* geo label: 84,603 */}
      <p className="absolute left-[84px] top-[598px] whitespace-nowrap text-[24px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>

      {/* geo glow: 40,584 56x56, inset-[-214.29%] */}
      <div className="absolute left-[40px] top-[584px] size-[56px] overflow-visible">
        <div className="absolute inset-[-214.29%] overflow-visible">
          <FirstScreenGeoGlow blur={60} cx={148} cy={148} filterId="geo-blur-1024" r={28} size={296} />
        </div>
      </div>

      {/* CTA: 534,296 210x210 */}
      <div className="absolute left-[534px] top-[296px] z-[320] size-[210px] overflow-visible">
        <FirstScreenCta defaultMode="composed" onClick={onConsultationCtaClick} sizeClass="size-[210px]" />
      </div>
    </div>
  );
}
