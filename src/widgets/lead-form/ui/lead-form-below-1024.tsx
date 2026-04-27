"use client";

import { cn } from "@/shared/lib/utils";
import { LeadFormBulletsStacked, LeadFormTitle } from "@/widgets/lead-form/ui/lead-form-bullets";
import { LeadFormFields } from "@/widgets/lead-form/ui/lead-form-fields";

/**
 * Figma 783:10314 (360) / 783:10873 (480) — мобильный брейкпоинт (<768px).
 *
 * Структура (Figma):
 *  • Внешняя обёртка: bg-white, скруглённые нижние углы.
 *    360: px-16 pt-70 pb-120 rounded-30.  480: px-24 pt-80 pb-140 rounded-40.
 *  • Карточка #fff4ee: заполняет всю ширину обёртки (edge-to-edge), rounded-20.
 *    - Верхний контент (px-16/px-24 изнутри): заголовок, «Это бесплатно», буллеты.
 *    - Тёмная форм-карточка: тоже edge-to-edge внутри fff4ee, own px.
 *      360: px-16 pt-16 pb-24.  480: px-24 pt-24 pb-30.
 *
 * Важно: тёмная карточка НЕ вложена в padding fff4ee — она занимает полную ширину
 * fff4ee (как в Figma: dark card w=432/w=328 = ширина fff4ee). Это даёт правильную
 * ширину контента форм и исключает накопление отступов.
 */
export function LeadFormBelow1024() {
  return (
    <section
      className="lead-form-scope relative z-10 block w-full bg-[#0d0300] min-[768px]:hidden"
      id="lead-form-section-mobile"
    >
      {/* Внешняя белая обёртка: скруглённые нижние углы, внутренние отступы */}
      <div
        className={cn(
          "relative mx-auto w-full overflow-hidden bg-white",
          "rounded-bl-[30px] rounded-br-[30px] px-4 pb-[120px] pt-[70px]",
          "min-[480px]:rounded-bl-[40px] min-[480px]:rounded-br-[40px] min-[480px]:px-6 min-[480px]:pb-[140px] min-[480px]:pt-20",
        )}
      >
        {/*
          Карточка #fff4ee: занимает всю ширину белой обёртки (нет своего padding по x).
          Отступ сверху внутри — через pt верхнего контентного блока.
        */}
        <div className="flex w-full flex-col rounded-[20px] bg-[#fff4ee]">
          {/* Верхний контент на светлом фоне — заголовок, «Это бесплатно», буллеты */}
          <div
            className={cn(
              "flex flex-col gap-4 text-[#0d0300] max-[479px]:gap-3",
              "px-4 pt-6",
              "min-[480px]:px-6 min-[480px]:pt-[30px]",
            )}
          >
            {/*
              480-767px: natural — «как мы можем помочь?» при 30px ≈ 410px > 384px контейнера,
              comma-break давал бы 3 строки вместо 2; natural даёт «хотите обсудить, как мы» / «можем помочь?».
              ≤479px: comma-break — при 23px текст умещается в 296px → точный перенос как в Figma.
            */}
            <LeadFormTitle
              className={cn("hidden text-[#0d0300]", "min-[480px]:block min-[480px]:text-[30px]")}
              breakMode="natural"
            />
            <LeadFormTitle
              className={cn("block text-[23px] text-[#0d0300]", "min-[480px]:hidden")}
              breakMode="comma-break"
            />

            {/* «Это абсолютно бесплатно» */}
            <div className="flex flex-col gap-[10px]">
              <p className="m-0 text-[16px] font-bold leading-[1.3] min-[480px]:text-[18px]">
                Это абсолютно бесплатно.
              </p>
              <p className="m-0 text-[12px] font-normal leading-[1.2] min-[480px]:text-[13px]">
                Мы дадим вам понимание, как контент может приносить результат вашему бизнесу.
              </p>
            </div>

            {/* «Мы покажем:» + буллеты */}
            <div
              className={cn(
                "flex flex-col gap-4",
                /* Figma 480: gap-24 между «Мы покажем:» и списком буллетов */
                "min-[480px]:gap-6",
              )}
            >
              {/* Figma 360: text-12px; 480: text-13px */}
              <p className="m-0 text-[12px] font-normal leading-[1.2] min-[480px]:text-[13px]">
                Мы покажем:
              </p>
              {/* onDark не передаётся → текст #0d0300 на светлом fff4ee фоне */}
              <LeadFormBulletsStacked />
            </div>
          </div>

          {/*
            Разделитель между контентом и тёмной карточкой.
            Figma 480: gap-40 (fff4ee flex gap-40). Figma 360: ~30px визуально.
          */}
          <div className="h-[12px] min-[480px]:h-[40px]" />

          {/*
            Тёмная форм-карточка edge-to-edge внутри fff4ee — только поля (embedInCard).
            Ширина = полная ширина fff4ee, своё внутреннее padding.
            360: px-4 pt-4 pb-6.  480: px-6 pt-6 pb-[30px].
          */}
          <div
            className={cn(
              "w-full rounded-[20px] bg-[#0d0300]",
              "px-4 pb-6 pt-4",
              "min-[480px]:px-6 min-[480px]:pb-[30px] min-[480px]:pt-6",
            )}
          >
            <LeadFormFields contactLayout="pill" density="below1024" embedInCard source="lead-form" />
          </div>
        </div>
      </div>
    </section>
  );
}
