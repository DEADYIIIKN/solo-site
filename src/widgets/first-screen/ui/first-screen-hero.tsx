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

function MobileHero() {
  return (
    <div className="relative mx-auto flex min-h-[624px] max-w-[328px] flex-col items-center pb-10 pt-[84px] text-center min-[480px]:min-h-[700px] min-[480px]:max-w-[432px] min-[480px]:pt-[96px] min-[768px]:hidden">
      <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
        <span className="block text-[54px] font-normal italic leading-[0.9] tracking-[-0.04em] min-[480px]:text-[64px]">
          {firstScreenContent.titleTop}
        </span>
        <span className="mt-3 block max-w-[320px] text-[40px] font-bold leading-[0.9] tracking-[-0.04em] min-[480px]:max-w-[408px] min-[480px]:text-[48px]">
          {firstScreenContent.titleBottom}
        </span>
      </h1>

      <p className="mt-12 max-w-[296px] text-[17px] font-normal leading-[1.2] text-white min-[480px]:max-w-[320px]">
        {firstScreenContent.subtitle}
      </p>

      <div className="mt-8 size-[180px] min-[480px]:size-[196px]">
        <HeroCircleButton />
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 w-[296px] -translate-x-1/2 min-[480px]:bottom-10 min-[480px]:w-[336px]">
        <HeroGeoBlock />
      </div>
    </div>
  );
}

function TabletHero() {
  return (
    <div className="relative hidden h-[772px] min-[768px]:block min-[1024px]:hidden">
      <div className="absolute left-0 top-[76px]">
        <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
          <span className="block text-[80px] font-normal italic leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleTop}
          </span>
          <span className="mt-[2px] block max-w-[520px] text-[44px] font-bold leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleBottom}
          </span>
        </h1>
      </div>

      <p className="absolute left-[135px] top-[447px] max-w-[331px] text-[17px] font-normal leading-[1.2] text-white">
        {firstScreenContent.subtitle}
      </p>

      <div className="absolute left-[424px] top-[447px] size-[210px]">
        <HeroCircleButton />
      </div>

      <div className="absolute bottom-0 left-[195px]">
        <HeroGeoBlock />
      </div>
    </div>
  );
}

function DesktopHero1024() {
  return (
    <div className="relative hidden h-[628px] min-[1024px]:block min-[1440px]:hidden">
      <div className="absolute left-0 top-[68px]">
        <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
          <span className="block text-[70px] font-normal italic leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleTop}
          </span>
        </h1>
      </div>

      <div className="absolute left-[216px] top-[127px] w-[728px]">
        <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
          <span className="block text-[70px] font-bold leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleBottom}
          </span>
        </h1>
      </div>

      <p className="absolute left-[558px] top-[87px] max-w-[386px] text-[16px] font-normal leading-[1.2] text-white">
        {firstScreenContent.subtitle}
      </p>

      <div className="absolute left-[494px] top-[224px] size-[210px]">
        <HeroCircleButton />
      </div>

      <div className="absolute left-[564px] top-[374px] h-[214px] w-[380px] overflow-hidden rounded-[20px]">
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="380px"
          priority
          src={firstScreenAssets.heroImage}
        />
      </div>

      <div className="absolute bottom-0 left-0">
        <HeroGeoBlock />
      </div>
    </div>
  );
}

function DesktopHero1440() {
  return (
    <div className="relative hidden h-[746px] min-[1440px]:block">
      <div className="absolute left-0 top-[98px]">
        <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
          <span className="block text-[90px] font-normal italic leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleTop}
          </span>
        </h1>
      </div>

      <div className="absolute left-[227px] top-[179px] w-[933px]">
        <h1 className="m-0 font-[family-name:var(--font-family-display)] text-white">
          <span className="block text-[90px] font-bold leading-[0.9] tracking-[-0.04em]">
            {firstScreenContent.titleBottom}
          </span>
        </h1>
      </div>

      <p className="absolute left-[753px] top-[129px] w-[407px] text-[17px] font-normal leading-[1.2] text-white">
        {firstScreenContent.subtitle}
      </p>

      <div className="absolute left-[640px] top-[312px] size-[210px]">
        <HeroCircleButton />
      </div>

      <div className="absolute left-[780px] top-[452px] h-[214px] w-[380px] overflow-hidden rounded-[12px]">
        <Image
          alt=""
          className="object-cover"
          fill
          sizes="380px"
          priority
          src={firstScreenAssets.heroImage}
        />
      </div>

      <img
        alt=""
        className="absolute left-[-22px] top-[620px] h-14 w-14"
        height={56}
        src={firstScreenAssets.geoMark}
        width={56}
      />
      <p className="absolute left-[22px] top-[639px] text-[24px] font-bold leading-[1.2] text-white">
        {firstScreenContent.geoLabel}
      </p>
    </div>
  );
}

export function FirstScreenHero() {
  return (
    <div className="relative z-10">
      <div className="container-base">
        <div className="relative">
          <MobileHero />
          <TabletHero />
          <DesktopHero1024 />
          <DesktopHero1440 />
        </div>
      </div>
    </div>
  );
}
