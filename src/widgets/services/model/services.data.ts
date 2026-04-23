/**
 * Figma 783:9203 «9 Услуги - 1» + 783:9139 «10 Услуги - 2» (финальное положение карточки 02).
 * Ассеты — выгрузка с ноды 9203.
 */
export const services1440Assets = {
  /** Из Figma как vector — файл SVG (не PNG). */
  verticalIllustration: "/assets/figma/services-1440/vertical-illustration.svg",
  commercialIllustration: "/assets/figma/services-1440/commercial-illustration.svg",
} as const;

export const services1440Copy = {
  eyebrow: "услуги",
  vertical: {
    titleItalic: "Вертикальный",
    /** Figma 783:9146: wrap после «видеоконтент», «для» переносится на строку 2. NBSP между «для» и «социальных» закрепляет пару. */
    titleBold: " видеоконтент для\u00a0социальных сетей",
    subtitle:
      "Регулярный контент для брендов, которым важен стабильный результат.",
    packageLead: "Пакеты ",
    packageBold: "от 10 видео в месяц",
    packageTrail: " под разный бюджет",
    cta: "бесплатная консультация",
    /** max-w текста в px — Figma 783:9218–783:9222 */
    points: [
      {
        n: "01",
        lead: "Посмотрим",
        text: " ролики конкурентов, чтобы понять, что\u00a0сработает лучше всего",
        maxTextPx: 222,
      },
      {
        n: "02",
        lead: "Превратим",
        text: " ваши задачи в\u00a0интересные истории, которые хочется смотреть",
        maxTextPx: 195,
      },
      {
        n: "03",
        lead: "Сделаем",
        text: " ролики, которые легко вирусятся и\u00a0вызывают интерес с\u00a0первых секунд",
        maxTextPx: 231,
      },
      {
        n: "04",
        lead: "Настроим",
        text: " видео под алгоритмы каждой соцсети, чтобы охваты и\u00a0вовлеченность росли",
        maxTextPx: 260,
      },
      {
        n: "05",
        lead: "Проанализируем",
        text: " статистику и\u00a0улучшим каждый новый ролик для\u00a0большей эффективности",
        maxTextPx: 254,
      },
    ] as const,
  },
  commercial: {
    titleItalic: "Крупные ",
    titleBoldLine1: "коммерческие ",
    titleBoldLine2: "видеопроекты",
    subtitle:
      "Масштабный и\u00a0высококачественный визуальный контент для\u00a0брендов.",
    cta: "бесплатная консультация",
    /** max-w текста в px — Figma 783:9248–783:9252 */
    points: [
      {
        n: "01",
        lead: "Сделаем",
        text: " рекламные ролики для таргета, сайта и\u00a0внешних экранов, которые привлекают клиентов",
        maxTextPx: 258,
      },
      {
        n: "02",
        lead: "Создадим",
        text: " имиджевые видео для соцсетей и\u00a0презентаций, чтобы укрепить доверие к бренду",
        maxTextPx: 248,
      },
      {
        n: "03",
        lead: "Снимем",
        text: " контент с\u00a0мероприятий, который сохраняет важные моменты",
        maxTextPx: 211,
      },
      {
        n: "04",
        lead: "Подготовим",
        text: " видео в разных форматах, чтобы использовать на\u00a0всех площадках",
        maxTextPx: 260,
      },
      {
        n: "05",
        lead: "Добавим",
        text: " 3D, motion и анимацию для наглядной подачи продукта и\u00a0привлечения внимания аудитории",
        maxTextPx: 274,
      },
    ] as const,
  },
} as const;

/** Верх карточки «Коммерческие» в начале скролла (Figma 783:9239 y=710). */
export const SERVICES_CARD2_TOP_START_PX = 710;
/** Верх карточки «Коммерческие» в конце (Figma 783:9173 y=250). */
export const SERVICES_CARD2_TOP_END_PX = 250;

export const SERVICES_CARD2_SLIDE_PX =
  SERVICES_CARD2_TOP_START_PX - SERVICES_CARD2_TOP_END_PX;

/**
 * Позиции пунктов от левого края карточки 965px, top — от верха контейнера сетки
 * (Figma 783:9217 / 783:9247).
 */
export const SERVICES_1440_VERTICAL_POINT_LAYOUT = [
  { badgeLeft: 40, top: 0, textLeft: 80 },
  { badgeLeft: 362, top: 0, textLeft: 402 },
  { badgeLeft: 664, top: 0, textLeft: 704 },
  { badgeLeft: 40, top: 87, textLeft: 80 },
  { badgeLeft: 362, top: 87, textLeft: 402 },
] as const;

export const SERVICES_1440_COMMERCIAL_POINT_LAYOUT = [
  { badgeLeft: 40, top: 0, textLeft: 80 },
  { badgeLeft: 362, top: 0, textLeft: 402 },
  { badgeLeft: 684, top: 0, textLeft: 724 },
  { badgeLeft: 40, top: 87, textLeft: 80 },
  { badgeLeft: 362, top: 87, textLeft: 402 },
] as const;

/** Верх блока пунктов от верха article (Figma). */
export const SERVICES_1440_VERTICAL_GRID_TOP_PX = 365;
export const SERVICES_1440_COMMERCIAL_GRID_TOP_PX = 330;

/** Figma 783:8494 «9 Услуги - 2» (y=650) и 783:8420 «10 Услуги - 3» (y=190). */
export const SERVICES_1024_CARD2_TOP_START_PX = 650;
export const SERVICES_1024_CARD2_TOP_END_PX = 190;
export const SERVICES_1024_CARD2_SLIDE_PX =
  SERVICES_1024_CARD2_TOP_START_PX - SERVICES_1024_CARD2_TOP_END_PX;

export const SERVICES_1024_VERTICAL_GRID_TOP_PX = 310;
export const SERVICES_1024_COMMERCIAL_GRID_TOP_PX = 275;

/**
 * Ячейки относительно контейнера сетки (левый верх Group 293 в карточке 785px).
 * Колонка: бейдж сверху, текст снизу (Figma 783:8520).
 */
export const SERVICES_1024_VERTICAL_POINT_LAYOUT = [
  { left: 0, top: 0, w: 196 },
  { left: 276, top: 0, w: 184 },
  { left: 524, top: 0, w: 201 },
  { left: 0, top: 103, w: 232 },
  { left: 276, top: 103, w: 254 },
] as const;

export const SERVICES_1024_COMMERCIAL_POINT_LAYOUT = [
  { left: 0, top: 0, w: 236 },
  { left: 273, top: 0, w: 230 },
  { left: 540, top: 0, w: 195 },
  { left: 0, top: 103, w: 237 },
  { left: 273, top: 103, w: 277 },
] as const;
