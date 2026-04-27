"use client";

import { LeadFormBullets768, LeadFormTitle } from "@/widgets/lead-form/ui/lead-form-bullets";
import { LeadFormFields } from "@/widgets/lead-form/ui/lead-form-fields";

/**
 * Figma 783:11496 — 768px: белая внешняя карточка, два столбца.
 * Левый (w-248): «Мы покажем:» + буллеты (text-15px).
 * Правый (w-360): тёмная форм-карточка (gap-30, px-20 pt-20 pb-24).
 * Внешний отступ: py-80 px-48 (py-20 px-12 в Tailwind).
 */
export function LeadForm768() {
  return (
    <section
      className="lead-form-scope relative z-10 hidden w-full bg-[#0d0300] min-[768px]:block min-[1024px]:hidden"
      id="lead-form-section-768"
    >
      {/*
        Figma 783:11496: bg-white rounded-bl-40 rounded-br-40 py-80 px-48.
        Внешний слой — белый на всю ширину; контент — max-w 768.
      */}
      <div className="w-full overflow-hidden rounded-bl-[40px] rounded-br-[40px] bg-white">
        <div className="relative mx-auto w-full max-w-[768px] px-12 py-20">
        <div className="flex flex-col gap-[50px]">
          {/* Figma 783:11497: заголовок 40px, full-width; comma-break = перенос после «обсудить,» */}
          <LeadFormTitle className="text-[40px]" breakMode="comma-break" />

          {/* Figma 783:11498: два столбца gap-64 */}
          <div className="flex w-full items-start gap-16">
            {/* Левый столбец — Figma 783:11499: w-248, flex-col gap-20 */}
            <div className="flex w-[248px] shrink-0 flex-col gap-5">
              {/* Figma 783:11500: «Мы покажем:» text-16px */}
              <p className="m-0 text-[16px] font-normal leading-[1.2] text-[#0d0300]">
                Мы покажем:
              </p>
              <LeadFormBullets768 />
            </div>

            {/* Правый столбец — Figma 783:11522: w-360, тёмная форм-карточка */}
            <div className="w-[360px] shrink-0">
              <LeadFormFields contactLayout="pill" density="768" source="lead-form" />
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
