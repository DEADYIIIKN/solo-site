/**
 * Variant lookup table для TgPopup.
 *
 * Источник истины — Figma node-ids от пользователя (Phase 10 D3 locked):
 * - 783:9762  → 1440  (1440x810,  card 886x460)
 * - 783:9750  → 1024  (1024x700,  card 668x392)
 * - 783:9729  → 768   (768x700,   card 668x392)
 * - 783:9708  → 480   (480x700,   card 330x571)
 * - 783:9687  → 360   (360x640,   card 328x528)
 *
 * Архитектура: absolute positioning внутри card. Все координаты в px из Figma.
 * Title / Subtitle / Button / Phone — каждый child карточки расположен через
 * inline `style={{ position: 'absolute', left, top, width, height }}`.
 */

export type TgPopupVariant = "360" | "480" | "768" | "1024" | "1440";

export type TgPopupBoxXYW = {
  x: number;
  y: number;
  w: number;
  /** font-size (px) — используется для title/subtitle. */
  size: number;
};

export type TgPopupButtonConfig = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Расстояние между TG-icon и label внутри pill. */
  gapInner: number;
  /** Размер TG-icon (квадратный). */
  iconSize: number;
  /** Font-size label (px). */
  fontSize: number;
};

export type TgPopupPhoneConfig = {
  /** Положение FRAME outer-группы phone в координатах card.
   *  Если задан `xRight` — используется right-anchor вместо left-anchor (480/360). */
  x?: number;
  xRight?: number;
  y: number;
  /** Размер FRAME outer-группы (контейнер для центрирования rotated frame). */
  outerW: number;
  outerH: number;
  /** Положение CONTENT outer-группы (TG screenshot) в координатах card.
   *  Аналогично — left или right anchor. */
  contentX?: number;
  contentXRight?: number;
  contentY: number;
  contentOuterW: number;
  contentOuterH: number;
  /** Размер inner content area (rounded-[34px] cropped TG screen). */
  contentInnerW: number;
  contentInnerH: number;
  /** Размер inner frame box (overflow-hidden для cropping bg image). */
  frameInnerW: number;
  frameInnerH: number;
  /** Frame image scale/offset (magic numbers — общие для всех breakpoints). */
  frameImgWidth: string;
  frameImgHeight: string;
  frameImgLeft: string;
  frameImgTop: string;
  /** border-radius inner content (TG screen rounded). */
  contentRadius: number;
};

export type TgPopupVariantConfig = {
  /** Media-query selector для visibility слоя (overlay'я). */
  layerVisibility: string;
  /** Padding оборачивающего scroll-контейнера (overlay inner). */
  outerPadding: string;
  /** Выравнивание элементов колонки (крестик + карточка). */
  columnItems: string;
  /** Gap между крестиком и карточкой. */
  columnGap: string;
  /** Размер крестика-кнопки. */
  closeIconSize: 24 | 28 | 30 | 34;
  /** Размер карточки в px (фикс). */
  cardW: number;
  cardH: number;
  /** Координаты title. */
  title: TgPopupBoxXYW;
  /** Координаты subtitle. */
  subtitle: TgPopupBoxXYW;
  /** Координаты CTA-кнопки. */
  button: TgPopupButtonConfig;
  /** Координаты phone group. */
  phone: TgPopupPhoneConfig;
  /** Background pattern bg-size (px). */
  bgSize: string;
};

/**
 * Magic numbers for phone-frame.png crop — общие для всех breakpoints,
 * т.к. asset 1480x1480 квадратный, frame в нём всегда в одной пропорции.
 */
const FRAME_IMG = {
  width: "258.74%",
  height: "124.58%",
  left: "-79.37%",
  top: "-12.29%",
};

export const tgPopupVariants: Record<TgPopupVariant, TgPopupVariantConfig> = {
  "1440": {
    layerVisibility: "min-[1440px]:block",
    outerPadding: "px-4 py-2",
    columnItems: "items-center",
    columnGap: "gap-[20px]",
    closeIconSize: 34,
    cardW: 886,
    cardH: 460,
    title: { x: 39.5, y: 40.5, w: 431, size: 50 },
    subtitle: { x: 39.5, y: 205, w: 386, size: 17 },
    button: {
      x: 39.5,
      y: 336.5,
      w: 250,
      h: 60,
      gapInner: 14,
      iconSize: 51,
      fontSize: 18,
    },
    phone: {
      x: 521.5,
      y: 28.5,
      outerW: 315,
      outerH: 625,
      contentX: 535.29,
      contentY: 44.65,
      contentOuterW: 290,
      contentOuterH: 548,
      contentInnerW: 274,
      contentInnerH: 540,
      frameInnerW: 297,
      frameInnerH: 617,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 34,
    },
    bgSize: "778.2px 415.8px",
  },
  "1024": {
    layerVisibility: "min-[1024px]:block min-[1440px]:hidden",
    outerPadding: "px-[40px] py-[32px]",
    columnItems: "items-center",
    columnGap: "gap-[16px]",
    closeIconSize: 30,
    cardW: 668,
    cardH: 392,
    title: { x: 31, y: 31, w: 314, size: 38 },
    subtitle: { x: 31, y: 156, w: 314, size: 14 },
    button: {
      x: 30,
      y: 272,
      w: 250,
      h: 60,
      gapInner: 14,
      iconSize: 51,
      fontSize: 18,
    },
    phone: {
      x: 388,
      y: 32,
      outerW: 263,
      outerH: 523,
      contentX: 399.6,
      contentY: 45.6,
      contentOuterW: 242,
      contentOuterH: 459,
      contentInnerW: 229,
      contentInnerH: 452,
      frameInnerW: 248,
      frameInnerH: 516,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 28,
    },
    bgSize: "586.4px 313.5px",
  },
  "768": {
    layerVisibility: "min-[768px]:block min-[1024px]:hidden",
    outerPadding: "px-[32px] py-[24px]",
    columnItems: "items-center",
    columnGap: "gap-[12px]",
    closeIconSize: 30,
    cardW: 668,
    cardH: 392,
    title: { x: 31, y: 31, w: 314, size: 38 },
    subtitle: { x: 31, y: 156, w: 314, size: 13 },
    button: {
      x: 30,
      y: 280,
      w: 219,
      h: 52,
      gapInner: 12,
      iconSize: 46,
      fontSize: 16,
    },
    phone: {
      x: 388,
      y: 32,
      outerW: 263,
      outerH: 523,
      contentX: 399.6,
      contentY: 45.6,
      contentOuterW: 242,
      contentOuterH: 459,
      contentInnerW: 229,
      contentInnerH: 452,
      frameInnerW: 248,
      frameInnerH: 516,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 28,
    },
    bgSize: "586.4px 313.5px",
  },
  "480": {
    layerVisibility: "min-[480px]:block min-[768px]:hidden",
    outerPadding: "px-[24px] py-[32px]",
    columnItems: "items-center",
    columnGap: "gap-[10px]",
    closeIconSize: 28,
    cardW: 330,
    cardH: 571,
    title: { x: 16, y: 16, w: 296, size: 38 },
    subtitle: { x: 16, y: 131, w: 277, size: 14 },
    button: {
      x: 16,
      y: 188,
      w: 200,
      h: 48,
      gapInner: 10,
      iconSize: 42,
      fontSize: 14,
    },
    phone: {
      /* Figma 783:9716: right-[20.14px] top-[254.5px] w-[227.77px] h-[452.146px] */
      xRight: 20.14,
      y: 254.5,
      outerW: 227.77,
      outerH: 452.146,
      /* Figma 783:9717 (content outer): right-[28.19px] top-[266.17px] w-[209.753] h-[395.999] */
      contentXRight: 28.19,
      contentY: 266.17,
      contentOuterW: 209.753,
      contentOuterH: 395.999,
      /* Figma 783:9717 inner (rotated): w-[198.365] h-[390.338] rounded-[34px] */
      contentInnerW: 198.365,
      contentInnerH: 390.338,
      /* Figma 783:9718 inner: w-[214.753] h-[446.026] */
      frameInnerW: 214.753,
      frameInnerH: 446.026,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 34,
    },
    bgSize: "778.2px 415.8px",
  },
  "360": {
    layerVisibility: "max-[479px]:block",
    outerPadding: "px-[16px] py-[24px]",
    columnItems: "items-end",
    columnGap: "gap-[10px]",
    closeIconSize: 24,
    cardW: 328,
    cardH: 528,
    title: { x: 16, y: 16, w: 296, size: 32 },
    /* Figma 783:9693: text-[12px] (не 13). */
    subtitle: { x: 16, y: 112, w: 215, size: 12 },
    button: {
      x: 16,
      y: 162,
      w: 184,
      h: 44,
      /* Figma 783:9699: gap-[6px] (не 10). */
      gapInner: 6,
      iconSize: 38,
      fontSize: 14,
    },
    phone: {
      /* Figma 783:9695: right-[15.78px] top-[234px] w-[215.806] h-[428.394] */
      xRight: 15.78,
      y: 234,
      outerW: 215.806,
      outerH: 428.394,
      /* Figma 783:9696 (content outer): right-[23.41] top-[245.06] w-[198.734] h-[375.197] */
      contentXRight: 23.41,
      contentY: 245.06,
      contentOuterW: 198.734,
      contentOuterH: 375.197,
      /* Figma 783:9696 inner: w-[187.945] h-[369.833] rounded-[34px] */
      contentInnerW: 187.945,
      contentInnerH: 369.833,
      /* Figma 783:9697 inner: w-[203.472] h-[422.596] */
      frameInnerW: 203.472,
      frameInnerH: 422.596,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 34,
    },
    bgSize: "778.2px 415.8px",
  },
};
