/* eslint-disable @next/next/no-img-element -- локальные svg из public */
"use client";

import { LeadFormBullets1440, LeadFormTitle } from "@/widgets/lead-form/ui/lead-form-bullets";
import { LeadFormFields } from "@/widgets/lead-form/ui/lead-form-fields";

/**
 * Figma 783:9078 — «12 Форма» 1440: белая колонка, слева оффер + 2×2 пункты, справа тёмная карточка, декор дуги.
 */
export function LeadForm1440() {
  return (
    <section
      className="lead-form-scope relative z-10 hidden w-full bg-[#0d0300] min-[1440px]:block"
      id="lead-form-section-1440"
    >
      <div className="w-full overflow-hidden rounded-bl-[60px] rounded-br-[60px] bg-white">
        <div className="relative mx-auto min-h-[810px] w-full max-w-[1440px]">
        <div className="first-screen-cta-text-orbit first-screen-cta-text-orbit-reverse pointer-events-none absolute bottom-[-231px] left-[-110px] z-0 size-[490px]">
          <img
            alt=""
            className="absolute inset-0 size-full max-w-none"
            height={490}
            src="/assets/figma/lead-form-1440/arc-base.svg"
            width={490}
          />
          <div className="absolute left-1/2 top-1/2 flex h-[461px] w-[457px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              alt=""
              className="h-[448px] w-[444px] max-w-none"
              height={448}
              src="/assets/figma/lead-form-1440/arc-vector.svg"
              width={444}
            />
          </div>
        </div>

        {/*
          Figma 783:9078: левая колонка — заголовок с top 150; форма — карточка с top 120 (разные pt у колонок).
          После заголовка: 310 − 150 − высота заголовка; при ~3 строках leading 0.9 ≈ 25–32px.
        */}
        <div className="relative z-[1] flex flex-row items-start justify-start gap-[50px] px-[140px] pb-[96px] pt-0">
          <div className="flex w-[640px] shrink-0 flex-col pt-[150px]">
            <LeadFormTitle className="text-[50px]" />
            <div className="mt-[70px] flex flex-col gap-6">
              <p className="m-0 text-[17px] font-normal leading-[1.2] text-[#0d0300]">
                Мы покажем:
              </p>
              <LeadFormBullets1440 />
            </div>
          </div>
          <div className="w-[470px] shrink-0 self-start pt-[120px]">
            <LeadFormFields contactLayout="radio" density="1440" />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
