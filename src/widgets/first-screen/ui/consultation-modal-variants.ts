/**
 * Variant lookup table для unified ConsultationModal.
 *
 * Источник истины — текущие 5 файлов first-screen-consultation-modal-{360,480,768,1024,1440}.tsx.
 * Все классы — статические строки (Tailwind 4 JIT их подхватит).
 *
 * Каждое поле описывает точечное отличие между breakpoint'ами; общее
 * (rounded-[16px], bg-white, transition cubic-bezier(0.33,1,0.68,1) и т.д.)
 * живёт в самом ConsultationModal.
 */

export type ConsultationModalVariant = "360" | "480" | "768" | "1024" | "1440";

export type ConsultationModalContactLayout = "pill" | "radio";
export type ConsultationModalTitleLayout = "stacked" | "inline";
export type ConsultationModalFieldsDirection =
  | "column"
  | "row"
  | "responsive-500"; // column до min-width 500px, потом row

export type ConsultationModalVariantConfig = {
  /** Media-query selector для visibility слоя (overlay'я). */
  layerVisibility: string;
  /** Padding оборачивающего scroll-контейнера (overlay inner). */
  outerPadding: string;
  /** Выравнивание элементов колонки (крестик + карточка). */
  columnItems: string;
  /** Max-width колонки в form-state (карточка form занимает w-full колонки). */
  maxWidth: string;
  /** Max-width колонки в success-state (карточка success занимает w-full колонки). */
  maxWidthSuccess: string;
  /** Gap между крестиком и карточкой. */
  columnGap: string;
  /** Размер крестика-кнопки (квадрат) — wrapper button + сам SVG. */
  closeIconSize: 24 | 28 | 30 | 34;
  /** Padding form-card. */
  cardPadding: string;
  /** Padding success-card (на 360 он меньше — компактный). */
  successCardPadding: string;
  /** overflow для form-card (на 360 — overflow-x-clip; на остальных — overflow-visible). */
  formCardOverflow: "overflow-x-clip" | "overflow-visible";
  /** overflow для success-card (на 360 — overflow-x-clip). */
  successCardOverflow: "overflow-x-clip" | "overflow-visible";
  /** Gap между секциями form-card. */
  cardGap: string;
  /** Layout заголовка: stacked (3 строки `block`) / inline (одна строка span). */
  titleLayout: ConsultationModalTitleLayout;
  /** Font-size заголовка form (px) — применяется как inline style. */
  titleSize: number;
  /** Tailwind class для font-size body input/textarea. */
  inputTextSize: string;
  /** Направление колонки имя/телефон. */
  fieldsDirection: ConsultationModalFieldsDirection;
  /** Gap между name+phone (column-mode у 360 = 24, остальные row gap = 30). */
  fieldsRowGap: string;
  /** Gap внутреннего блока полей (form-block gap). */
  formBlockGap: string;
  /** Layout контакт-секции: радио-чипы или pill-сегменты. */
  contactLayout: ConsultationModalContactLayout;
  /** Tailwind class для текста заголовка контакт-секции ("Как удобнее связаться?"). */
  contactHeadingTextSize: string;
  /** Tailwind class для текста внутри контакт-чипа/pill. */
  contactLabelTextSize: string;
  /** Tailwind class для height textarea сообщения. */
  messageHeight: string;
  /** Tailwind class для текста consent. */
  consentTextSize: string;
  /** Tailwind class для height submit-кнопки. */
  submitButtonHeight: string;
  /** Font-size submit-кнопки (px) — inline style. */
  submitFontSize: number;
  /** Font-size success title (px) — inline через text-[Npx]. */
  successTitleSize: number;
  /** Font-size success body — inline через text-[Npx]. */
  successBodySize: number;
  /** Gap внутри success-card между текстом и кнопкой возврата. */
  successCardGap: string;
  /** Gap между title и body внутри success-text-блока. */
  successTextGap: string;
  /** Height "вернуться"-кнопки (success). */
  successButtonHeight: string;
  /** Font-size success-button (px). */
  successButtonFontSize: number;
};

export const consultationModalVariants: Record<
  ConsultationModalVariant,
  ConsultationModalVariantConfig
> = {
  "360": {
    layerVisibility: "max-[479px]:block",
    outerPadding: "px-[16px] py-0",
    columnItems: "items-end",
    maxWidth: "max-w-[360px]",
    maxWidthSuccess: "max-w-[360px]",
    columnGap: "gap-[10px]",
    closeIconSize: 24,
    cardPadding: "px-[16px] py-[24px]",
    successCardPadding: "px-[12px] pt-[12px] pb-[16px]",
    formCardOverflow: "overflow-x-clip",
    successCardOverflow: "overflow-x-clip",
    cardGap: "gap-[30px]",
    titleLayout: "stacked",
    titleSize: 23,
    inputTextSize: "text-[12px]",
    fieldsDirection: "column",
    fieldsRowGap: "gap-[24px]",
    formBlockGap: "gap-[24px]",
    contactLayout: "pill",
    contactHeadingTextSize: "text-[12px]",
    contactLabelTextSize: "text-[12px]",
    messageHeight: "h-[80px]",
    consentTextSize: "text-[11px]",
    submitButtonHeight: "h-[44px]",
    submitFontSize: 13,
    successTitleSize: 23,
    successBodySize: 12,
    successCardGap: "gap-[40px]",
    successTextGap: "gap-[12px]",
    successButtonHeight: "h-[44px]",
    successButtonFontSize: 13,
  },
  "480": {
    layerVisibility: "min-[480px]:block min-[768px]:hidden",
    outerPadding: "px-[24px] py-2",
    columnItems: "items-center",
    maxWidth: "max-w-[480px]",
    maxWidthSuccess: "max-w-[384px]",
    columnGap: "gap-[10px]",
    closeIconSize: 28,
    cardPadding: "px-[20px] py-[24px]",
    successCardPadding: "px-[30px] pt-[30px] pb-[35px]",
    formCardOverflow: "overflow-x-clip",
    successCardOverflow: "overflow-visible",
    cardGap: "gap-[30px]",
    titleLayout: "stacked",
    titleSize: 30,
    inputTextSize: "text-[14px]",
    fieldsDirection: "row",
    fieldsRowGap: "gap-[30px]",
    formBlockGap: "gap-[36px]",
    contactLayout: "radio",
    contactHeadingTextSize: "text-[16px]",
    contactLabelTextSize: "text-[14px]",
    messageHeight: "h-[80px]",
    consentTextSize: "text-[12px]",
    submitButtonHeight: "h-[48px]",
    submitFontSize: 14,
    successTitleSize: 28,
    successBodySize: 14,
    successCardGap: "gap-[40px]",
    successTextGap: "gap-[16px]",
    successButtonHeight: "h-[48px]",
    successButtonFontSize: 14,
  },
  "768": {
    layerVisibility: "min-[768px]:block min-[1024px]:hidden",
    outerPadding: "px-4 py-2",
    columnItems: "items-center",
    maxWidth: "max-w-[504px]",
    maxWidthSuccess: "max-w-[490px]",
    columnGap: "gap-[10px]",
    closeIconSize: 30,
    cardPadding: "p-[24px]",
    successCardPadding: "px-[30px] pt-[30px] pb-[35px]",
    formCardOverflow: "overflow-visible",
    successCardOverflow: "overflow-visible",
    cardGap: "gap-[30px]",
    titleLayout: "inline",
    titleSize: 32,
    inputTextSize: "text-[16px]",
    fieldsDirection: "row",
    fieldsRowGap: "gap-[30px]",
    formBlockGap: "gap-[36px]",
    contactLayout: "radio",
    contactHeadingTextSize: "text-[16px]",
    contactLabelTextSize: "text-[14px]",
    messageHeight: "h-[80px]",
    consentTextSize: "text-[14px]",
    submitButtonHeight: "h-[52px]",
    submitFontSize: 15,
    successTitleSize: 30,
    successBodySize: 14,
    successCardGap: "gap-[40px]",
    successTextGap: "gap-[24px]",
    successButtonHeight: "h-[52px]",
    successButtonFontSize: 15,
  },
  "1024": {
    layerVisibility: "min-[1024px]:block min-[1440px]:hidden",
    outerPadding: "px-4 py-2",
    columnItems: "items-center",
    maxWidth: "max-w-[616px]",
    maxWidthSuccess: "max-w-[490px]",
    columnGap: "gap-[10px]",
    closeIconSize: 34,
    cardPadding: "p-[30px]",
    successCardPadding: "px-[30px] pt-[30px] pb-[35px]",
    formCardOverflow: "overflow-visible",
    successCardOverflow: "overflow-visible",
    cardGap: "gap-[30px]",
    titleLayout: "inline",
    titleSize: 38,
    inputTextSize: "text-[16px]",
    fieldsDirection: "responsive-500",
    fieldsRowGap: "gap-[30px]",
    formBlockGap: "gap-[36px]",
    contactLayout: "radio",
    contactHeadingTextSize: "text-[16px]",
    contactLabelTextSize: "text-[14px]",
    messageHeight: "h-[80px]",
    consentTextSize: "text-[16px]",
    submitButtonHeight: "h-[56px]",
    submitFontSize: 16,
    successTitleSize: 32,
    successBodySize: 17,
    successCardGap: "gap-[40px]",
    successTextGap: "gap-[24px]",
    successButtonHeight: "h-[56px]",
    successButtonFontSize: 16,
  },
  "1440": {
    layerVisibility: "min-[1440px]:block",
    outerPadding: "px-4 py-2",
    columnItems: "items-center",
    maxWidth: "max-w-[686px]",
    maxWidthSuccess: "max-w-[490px]",
    columnGap: "gap-[20px]",
    closeIconSize: 34,
    cardPadding: "p-[30px]",
    successCardPadding: "px-[30px] pt-[30px] pb-[35px]",
    formCardOverflow: "overflow-visible",
    successCardOverflow: "overflow-visible",
    cardGap: "gap-[36px]",
    titleLayout: "inline",
    titleSize: 40,
    inputTextSize: "text-[16px]",
    fieldsDirection: "responsive-500",
    fieldsRowGap: "gap-[30px]",
    formBlockGap: "gap-[40px]",
    contactLayout: "radio",
    contactHeadingTextSize: "text-[16px]",
    contactLabelTextSize: "text-[14px]",
    messageHeight: "h-[100px]",
    consentTextSize: "text-[16px]",
    submitButtonHeight: "h-[60px]",
    submitFontSize: 17,
    successTitleSize: 32,
    successBodySize: 17,
    successCardGap: "gap-[40px]",
    successTextGap: "gap-[24px]",
    successButtonHeight: "h-[60px]",
    successButtonFontSize: 16,
  },
};
