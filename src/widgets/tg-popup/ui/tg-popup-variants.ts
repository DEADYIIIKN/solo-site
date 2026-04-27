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
  /** Положение outer-группы phone в координатах card. */
  x: number;
  y: number;
  /** Размер outer-группы (контейнер flexbox для центрирования rotated content). */
  outerW: number;
  outerH: number;
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
    title: { x: 31, y: 31, w: 314, size: 36 },
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
    title: { x: 31, y: 31, w: 314, size: 36 },
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
    title: { x: 16, y: 16, w: 296, size: 32 },
    subtitle: { x: 16, y: 131, w: 277, size: 14 },
    button: {
      x: 16,
      y: 188,
      w: 200,
      h: 48,
      gapInner: 10,
      iconSize: 42,
      fontSize: 15,
    },
    phone: {
      x: 95,
      y: 254,
      outerW: 227,
      outerH: 452,
      contentInnerW: 198,
      contentInnerH: 391,
      frameInnerW: 214,
      frameInnerH: 446,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 24,
    },
    bgSize: "289.8px 502.0px",
  },
  "360": {
    layerVisibility: "max-[479px]:block",
    outerPadding: "px-[16px] py-[24px]",
    columnItems: "items-end",
    columnGap: "gap-[10px]",
    closeIconSize: 24,
    cardW: 328,
    cardH: 528,
    title: { x: 16, y: 16, w: 296, size: 28 },
    subtitle: { x: 16, y: 112, w: 215, size: 13 },
    button: {
      x: 16,
      y: 162,
      w: 184,
      h: 44,
      gapInner: 10,
      iconSize: 38,
      fontSize: 14,
    },
    phone: {
      x: 108,
      y: 234,
      outerW: 215,
      outerH: 428,
      contentInnerW: 187,
      contentInnerH: 370,
      frameInnerW: 203,
      frameInnerH: 422,
      frameImgWidth: FRAME_IMG.width,
      frameImgHeight: FRAME_IMG.height,
      frameImgLeft: FRAME_IMG.left,
      frameImgTop: FRAME_IMG.top,
      contentRadius: 22,
    },
    bgSize: "288.0px 464.0px",
  },
};
