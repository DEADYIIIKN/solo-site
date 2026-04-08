/* eslint-disable @next/next/no-img-element */
"use client";

import { LeadFormBullets1024, LeadFormTitle } from "@/widgets/lead-form/ui/lead-form-bullets";
import { LeadFormFields } from "@/widgets/lead-form/ui/lead-form-fields";

/**
 * Figma 783:8362 — левая колонка одним потоком (не несколько absolute top):
 * иначе при переносе заголовка «Мы покажем:» и буллеты оказываются между строками h2.
 * Заголовок — two-line как контролируемый перенос; отступы 33px / 12px под 215px и 246px в макете.
 */
export function LeadForm1024() {
  return (
    <section
      className="lead-form-scope relative z-10 hidden w-full bg-[#0d0300] min-[1024px]:block min-[1440px]:hidden"
      id="lead-form-section-1024"
    >
      <div className="w-full overflow-hidden rounded-bl-[60px] rounded-br-[60px] bg-white">
        <div className="relative isolate mx-auto box-border h-[700px] w-full max-w-[1024px]">
        {/*
          Дуга: 25%×1024+51 = 307px от левого края карты (783:8364).
        */}
        <div className="first-screen-cta-text-orbit pointer-events-none absolute bottom-[-140px] left-[307px] z-0 flex size-[490px] items-center justify-center">
          <div className="-rotate-90 flex-none">
            <div className="relative size-[490px]">
              <img
                alt=""
                className="absolute inset-0 size-full max-w-none"
                height={490}
                src="/assets/figma/lead-form-1440/arc-base.svg"
                width={490}
              />
              <div className="absolute left-1/2 top-1/2 flex h-[461px] w-[457px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div className="rotate-[1.7deg]">
                  <img
                    alt=""
                    className="h-[448px] w-[444px] max-w-none"
                    height={448}
                    src="/assets/figma/lead-form-1440/arc-vector.svg"
                    width={444}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-10 top-[124px] z-[2] flex w-[425px] flex-col">
          <LeadFormTitle
            breakMode="two-line"
            className="max-w-full text-[32px]"
          />
          {/*
            globals.css сбрасывает margin у :where(p) → margin-top игнорируется.
            Используем padding-top: визуальный результат идентичен (top текста = 124+58+33 = 215px, Figma 783:8403).
          */}
          <p className="pt-[33px] text-[16px] font-normal leading-[1.2] text-[#0d0300]">
            Мы покажем:
          </p>
          <div className="mt-3">
            <LeadFormBullets1024 />
          </div>
        </div>

        <div className="absolute right-10 top-[100px] z-[2] w-[466px] shrink-0">
          <LeadFormFields contactLayout="radio" density="1024" />
        </div>
        </div>
      </div>
    </section>
  );
}
