/* eslint-disable @next/next/no-img-element */

import Image from "next/image";

import {
  firstScreenAssets,
  firstScreenContent
} from "@/widgets/first-screen/model/first-screen.data";

function HeroCircleButton() {
  return (
    <button
      aria-label={firstScreenContent.ctaCircle}
      className="relative block shrink-0 rounded-full"
      type="button"
    >
      <img
        alt=""
        className="block size-full"
        height={210}
        src={firstScreenAssets.ctaOuter}
        width={210}
      />
      <img
        alt=""
        className="absolute left-1/2 top-1/2 w-[56px] -translate-x-1/2 -translate-y-1/2"
        height={56}
        src={firstScreenAssets.ctaGlow}
        width={56}
      />
      <img
        alt=""
        className="absolute left-1/2 top-1/2 w-3 -translate-x-1/2 -translate-y-1/2"
        height={12}
        src={firstScreenAssets.ctaDotRing}
        width={12}
      />
      <img
        alt=""
        className="absolute left-1/2 top-1/2 w-[187px] -translate-x-1/2 -translate-y-1/2"
        height={180}
        src={firstScreenAssets.ctaTextPath}
        width={187}
      />
    </button>
  );
}

function HeroGeoBlock() {
  return (
    <div className="flex items-center gap-4 min-[768px]:gap-5">
      <img
        alt=""
        className="h-14 w-14 shrink-0"
        height={56}
        src={firstScreenAssets.geoMark}
        width={56}
      />
      <p className="text-[24px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>
    </div>
  );
}

export function FirstScreenHero() {
  return (
    <div className="relative z-10">
      <div className="container-base">
        <div className="relative min-h-[680px] pb-10 pt-[84px] min-[480px]:min-h-[760px] min-[480px]:pt-[96px] min-[768px]:min-h-[836px] min-[768px]:pb-20 min-[768px]:pt-[116px] min-[1024px]:min-h-[612px] min-[1024px]:pb-[28px] min-[1024px]:pt-[52px] min-[1440px]:min-h-[714px] min-[1440px]:pb-10 min-[1440px]:pt-[74px]">
          <div className="relative mx-auto flex max-w-[328px] flex-col items-center text-center min-[480px]:max-w-[432px] min-[768px]:max-w-none min-[1024px]:mx-0 min-[1024px]:block min-[1024px]:text-left">
            <div className="flex flex-col items-center min-[1024px]:absolute min-[1024px]:left-0 min-[1024px]:top-[22px] min-[1024px]:items-start">
              <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
                <span className="block text-center text-[54px] font-normal italic leading-[0.9] tracking-[-0.04em] min-[480px]:text-[64px] min-[768px]:text-[80px] min-[1024px]:text-left min-[1024px]:text-[86px] min-[1440px]:text-[120px]">
                  {firstScreenContent.titleTop}
                </span>
                <span className="mt-3 block max-w-[320px] text-center text-[40px] font-bold leading-[0.9] tracking-[-0.04em] min-[480px]:max-w-[408px] min-[480px]:text-[48px] min-[768px]:mt-5 min-[768px]:max-w-[466px] min-[768px]:text-[44px] min-[1024px]:mt-[-2px] min-[1024px]:max-w-[635px] min-[1024px]:text-left min-[1024px]:text-[69px] min-[1440px]:max-w-[760px] min-[1440px]:text-[86px]">
                  {firstScreenContent.titleBottom}
                </span>
              </h1>
            </div>

            <p className="mt-12 max-w-[296px] text-[17px] font-normal leading-[1.2] text-white min-[480px]:max-w-[320px] min-[768px]:ml-[70px] min-[768px]:mt-[120px] min-[768px]:self-start min-[768px]:text-left min-[1024px]:absolute min-[1024px]:left-[555px] min-[1024px]:top-[27px] min-[1024px]:m-0 min-[1024px]:max-w-[385px] min-[1024px]:text-[17px] min-[1440px]:left-[701px] min-[1440px]:top-[48px] min-[1440px]:max-w-[442px] min-[1440px]:text-[18px]">
              {firstScreenContent.subtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-10 min-[768px]:mt-[-6px] min-[768px]:flex-row min-[768px]:items-start min-[768px]:justify-center min-[768px]:gap-[58px] min-[1024px]:hidden">
            <div className="size-[180px] min-[480px]:size-[196px] min-[768px]:size-[210px]">
              <HeroCircleButton />
            </div>
          </div>

          <div className="hidden min-[1024px]:absolute min-[1024px]:left-[502px] min-[1024px]:top-[184px] min-[1024px]:block min-[1440px]:left-[704px] min-[1440px]:top-[201px]">
            <div className="size-[210px]">
              <HeroCircleButton />
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-[18px] min-[1024px]:absolute min-[1024px]:bottom-[12px] min-[1024px]:right-0 min-[1024px]:block min-[1024px]:h-[214px] min-[1024px]:w-[380px] min-[1024px]:rounded-[20px] min-[1440px]:bottom-[40px] min-[1440px]:h-[260px] min-[1440px]:w-[463px]">
            <Image
              alt=""
              className="h-full w-full object-cover"
              height={260}
              priority
              src={firstScreenAssets.heroImage}
              width={463}
            />
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 w-[296px] -translate-x-1/2 min-[480px]:bottom-10 min-[480px]:w-[336px] min-[768px]:bottom-10 min-[768px]:w-auto min-[1024px]:bottom-[15px] min-[1024px]:left-[31px] min-[1024px]:translate-x-0 min-[1440px]:bottom-[48px] min-[1440px]:left-[31px]">
            <HeroGeoBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
