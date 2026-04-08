/**
 * Единые классы подписи рядом с `SectionTitleDot` / `SectionEyebrowRow` по ширине вьюпорта.
 * Использовать везде, чтобы eyebrow не расходился между секциями на одном брейкпоинте.
 */
export const sectionEyebrowTextMax479 =
  "m-0 whitespace-nowrap text-[14px] font-semibold lowercase leading-none text-[#0d0300]";

export const sectionEyebrowText480To1439 =
  "m-0 whitespace-nowrap text-[16px] font-semibold lowercase leading-[1.2] text-[#0d0300]";

export const sectionEyebrowTextMin1440 =
  "m-0 whitespace-nowrap text-[17px] font-semibold lowercase leading-[1.2] text-[#0d0300]";

/** Без `nowrap` — когда eyebrow в одной строке с кнопками/стрелками (напр. business-goals mobile). */
export const sectionEyebrowTextMax479Wrap =
  "m-0 text-[14px] font-semibold lowercase leading-none text-[#0d0300]";

export const sectionEyebrowText480To1439Wrap =
  "m-0 text-[16px] font-semibold lowercase leading-[1.2] text-[#0d0300]";
