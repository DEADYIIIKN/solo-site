/* eslint-disable @next/next/no-img-element */

import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";

type CtaDefaultMode = "composed" | "single";
type CtaComposedAssetSet = {
  outer: string;
  glow: string;
  dot: string;
  text: string;
};

type FirstScreenCtaProps = {
  sizeClass: string;
  defaultMode: CtaDefaultMode;
  defaultComposedAssetSet?: CtaComposedAssetSet;
  defaultSingleAsset?: string;
  defaultSingleInsetClass?: string;
  hoverInsetClass?: string;
  hoverScale?: number;
  onClick?: () => void;
};

function ComposedLayer({
  hover,
  defaultAssets,
}: {
  hover: boolean;
  defaultAssets?: CtaComposedAssetSet;
}) {
  const outer = hover
    ? firstScreenAssets.ctaHoverOuter
    : (defaultAssets?.outer ?? firstScreenAssets.ctaOuter);
  const glow = hover
    ? firstScreenAssets.ctaHoverGlow
    : (defaultAssets?.glow ?? firstScreenAssets.ctaGlow);
  const dot = hover
    ? firstScreenAssets.ctaHoverDot
    : (defaultAssets?.dot ?? firstScreenAssets.ctaDotRing);
  const text = hover
    ? firstScreenAssets.ctaHoverTextPath
    : (defaultAssets?.text ?? firstScreenAssets.ctaTextPath);

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        <img alt="" className="absolute block size-full max-w-none" src={outer} />
      </div>
      <div className="absolute left-1/2 top-1/2 h-[26.6667%] w-[26.6667%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
        <div className="absolute inset-[-178.57%] overflow-visible">
          <img alt="" className="block size-full max-w-none" src={glow} />
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 h-[5.7143%] w-[5.7143%] -translate-x-1/2 -translate-y-1/2">
        <img alt="" className="absolute block size-full max-w-none" src={dot} />
      </div>
      <div className="first-screen-cta-text-orbit absolute inset-0">
        <div className="absolute left-[5.7143%] top-[7.1429%] h-[85.7143%] w-[89.0476%]">
          <img alt="" className="absolute block size-full max-w-none" src={text} />
        </div>
      </div>
    </div>
  );
}

export function FirstScreenCta({
  sizeClass,
  defaultMode,
  defaultComposedAssetSet,
  defaultSingleAsset,
  defaultSingleInsetClass,
  hoverInsetClass,
  hoverScale = 1,
  onClick
}: FirstScreenCtaProps) {
  return (
    <button
      aria-label="Бесплатная консультация"
      className={`group/cta relative ${sizeClass} block shrink-0 overflow-visible rounded-full`}
      onClick={onClick}
      type="button"
    >
      <div className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ease-out group-hover/cta:opacity-0">
        {defaultMode === "composed" ? (
          <ComposedLayer defaultAssets={defaultComposedAssetSet} hover={false} />
        ) : (
          <div className={`first-screen-cta-text-orbit absolute ${defaultSingleInsetClass ?? "inset-0"}`}>
            <img alt="" className="block size-full max-w-none" src={defaultSingleAsset} />
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-200 ease-out group-hover/cta:opacity-100"
        style={{ transform: `scale(${hoverScale})`, transformOrigin: "50% 50%" }}
      >
        {defaultMode === "single" ? (
          <div className={`absolute ${hoverInsetClass ?? defaultSingleInsetClass ?? "inset-0"}`}>
            <ComposedLayer hover />
          </div>
        ) : (
          <ComposedLayer defaultAssets={defaultComposedAssetSet} hover />
        )}
      </div>
    </button>
  );
}
