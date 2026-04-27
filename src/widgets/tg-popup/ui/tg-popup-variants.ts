/**
 * Variant lookup table для TgPopup.
 *
 * Источник истины — Figma node-ids от пользователя (Phase 10 D3 locked):
 * - 783:9762  → 1440  (1440x810,  modal 886x460,  layout horizontal — image right)
 * - 783:9750  → 1024  (1024x700,  modal 668x392,  layout horizontal)
 * - 783:9729  → 768   (768x700,   modal 668x392,  layout horizontal)
 * - 783:9708  → 480   (480x700,   modal 330x571,  layout vertical   — image bottom)
 * - 783:9687  → 360   (360x640,   modal 328x528,  layout vertical)
 *
 * Контент (одинаковый на всех breakpoints):
 *   Title:     «секреты эффективного видео»
 *              Montserrat Bold lowercase, «эффективного» — italic + font-normal.
 *   Subtitle:  «Делимся кейсами и приемами эффективного видеомаркетинга.»
 *              Montserrat Regular.
 *   CTA pill:  TG paper-plane icon + «перейти в канал» — оранжевый bg #ff5c00.
 *   Image:     phone mockup со скриншотом канала (Figma 783:9772/9773 —
 *              asset не выгружен; вёрстка ставит placeholder, см. TODO в .tsx).
 *
 * Все классы — статические строки (Tailwind 4 JIT их подхватит).
 * layerVisibility подобран по паттерну ConsultationModal (см.
 * `consultation-modal-variants.ts`) — сегменты не пересекаются.
 */

export type TgPopupVariant = "360" | "480" | "768" | "1024" | "1440";

export type TgPopupLayout = "horizontal" | "vertical";

export type TgPopupVariantConfig = {
  /** Media-query selector для visibility слоя (overlay'я). */
  layerVisibility: string;
  /** Padding оборачивающего scroll-контейнера (overlay inner). */
  outerPadding: string;
  /** Выравнивание элементов колонки (крестик + карточка). */
  columnItems: string;
  /** Max-width колонки. Карточка занимает w-full колонки. */
  maxWidth: string;
  /** Min-height карточки (под Figma — карточка фиксированной высоты). */
  cardMinHeight: string;
  /** Gap между крестиком и карточкой. */
  columnGap: string;
  /** Размер крестика-кнопки (квадрат). Поддерживаемые значения совпадают с ConsultationModal. */
  closeIconSize: 24 | 28 | 30 | 34;
  /** Padding карточки. */
  cardPadding: string;
  /** Layout карточки: horizontal (image справа) / vertical (image снизу). */
  layout: TgPopupLayout;
  /** Gap между текстовой колонкой и image-блоком внутри карточки. */
  cardInnerGap: string;
  /** Gap между title / subtitle / CTA в text-блоке. */
  textBlockGap: string;
  /** Font-size заголовка (px) — inline style. */
  titleSize: number;
  /** Font-size subtitle (px) — inline style. */
  subtitleSize: number;
  /** Tailwind class для max-width subtitle (ограничивает ширину строки). */
  subtitleMaxWidth: string;
  /** Tailwind class для width CTA-кнопки. */
  ctaButtonWidth: string;
  /** Tailwind class для height CTA-кнопки. */
  ctaButtonHeight: string;
  /** Font-size CTA-label (px) — inline style. */
  ctaFontSize: number;
  /** Размер TG-icon в CTA (px). */
  ctaIconSize: number;
  /** Width image placeholder (phone mockup). */
  imageWidth: string;
  /** Height image placeholder (phone mockup). */
  imageHeight: string;
};

export const tgPopupVariants: Record<TgPopupVariant, TgPopupVariantConfig> = {
  "360": {
    layerVisibility: "max-[479px]:block",
    outerPadding: "px-[16px] py-[24px]",
    columnItems: "items-end",
    maxWidth: "max-w-[328px]",
    cardMinHeight: "min-h-[528px]",
    columnGap: "gap-[10px]",
    closeIconSize: 24,
    cardPadding: "px-[20px] pt-[28px] pb-[24px]",
    layout: "vertical",
    cardInnerGap: "gap-[24px]",
    textBlockGap: "gap-[16px]",
    titleSize: 28,
    subtitleSize: 13,
    subtitleMaxWidth: "max-w-[280px]",
    ctaButtonWidth: "w-[184px]",
    ctaButtonHeight: "h-[44px]",
    ctaFontSize: 13,
    ctaIconSize: 18,
    imageWidth: "w-[215px]",
    imageHeight: "h-[428px]",
  },
  "480": {
    layerVisibility: "min-[480px]:block min-[768px]:hidden",
    outerPadding: "px-[24px] py-[32px]",
    columnItems: "items-center",
    maxWidth: "max-w-[330px]",
    cardMinHeight: "min-h-[571px]",
    columnGap: "gap-[10px]",
    closeIconSize: 28,
    cardPadding: "px-[24px] pt-[32px] pb-[28px]",
    layout: "vertical",
    cardInnerGap: "gap-[28px]",
    textBlockGap: "gap-[18px]",
    titleSize: 32,
    subtitleSize: 14,
    subtitleMaxWidth: "max-w-[280px]",
    ctaButtonWidth: "w-[200px]",
    ctaButtonHeight: "h-[48px]",
    ctaFontSize: 14,
    ctaIconSize: 20,
    imageWidth: "w-[227px]",
    imageHeight: "h-[452px]",
  },
  "768": {
    layerVisibility: "min-[768px]:block min-[1024px]:hidden",
    outerPadding: "px-[32px] py-[24px]",
    columnItems: "items-center",
    maxWidth: "max-w-[668px]",
    cardMinHeight: "min-h-[392px]",
    columnGap: "gap-[12px]",
    closeIconSize: 30,
    cardPadding: "p-[28px]",
    layout: "horizontal",
    cardInnerGap: "gap-[24px]",
    textBlockGap: "gap-[20px]",
    titleSize: 36,
    subtitleSize: 14,
    subtitleMaxWidth: "max-w-[300px]",
    ctaButtonWidth: "w-[219px]",
    ctaButtonHeight: "h-[52px]",
    ctaFontSize: 15,
    ctaIconSize: 22,
    imageWidth: "w-[263px]",
    imageHeight: "h-[523px]",
  },
  "1024": {
    layerVisibility: "min-[1024px]:block min-[1440px]:hidden",
    outerPadding: "px-[40px] py-[32px]",
    columnItems: "items-center",
    maxWidth: "max-w-[668px]",
    cardMinHeight: "min-h-[392px]",
    columnGap: "gap-[16px]",
    closeIconSize: 30,
    cardPadding: "p-[32px]",
    layout: "horizontal",
    cardInnerGap: "gap-[28px]",
    textBlockGap: "gap-[20px]",
    titleSize: 40,
    subtitleSize: 15,
    subtitleMaxWidth: "max-w-[320px]",
    ctaButtonWidth: "w-[250px]",
    ctaButtonHeight: "h-[60px]",
    ctaFontSize: 16,
    ctaIconSize: 24,
    imageWidth: "w-[263px]",
    imageHeight: "h-[523px]",
  },
  "1440": {
    layerVisibility: "min-[1440px]:block",
    outerPadding: "px-4 py-2",
    columnItems: "items-center",
    maxWidth: "max-w-[886px]",
    cardMinHeight: "min-h-[460px]",
    columnGap: "gap-[20px]",
    closeIconSize: 34,
    cardPadding: "p-[40px]",
    layout: "horizontal",
    cardInnerGap: "gap-[40px]",
    textBlockGap: "gap-[24px]",
    titleSize: 50,
    subtitleSize: 17,
    subtitleMaxWidth: "max-w-[380px]",
    ctaButtonWidth: "w-[250px]",
    ctaButtonHeight: "h-[60px]",
    ctaFontSize: 17,
    ctaIconSize: 24,
    imageWidth: "w-[315px]",
    imageHeight: "h-[625px]",
  },
};
