/**
 * Figma 783:9284 — вертикальные карточки: выгрузки rectangle74–78 с ноды макета.
 * Figma 783:9268 — рекламные кейсы: изображения с нод 783:9276 / I783:9282 / I783:9283.
 */
const CASES_VERTICAL_IMG = {
  callebaut: "/assets/figma/cases-1440/optimized/vertical-callebaut.avif",
  titoPov: "/assets/figma/cases-1440/optimized/vertical-tito-pov.avif",
  titoDetstvo: "/assets/figma/cases-1440/optimized/vertical-tito-detstvo.avif",
  badGallery: "/assets/figma/cases-1440/optimized/vertical-bad-gallery.avif",
  ogBuda: "/assets/figma/cases-1440/optimized/vertical-og-buda.avif",
} as const;

const CASES_AD_IMG = {
  trsMotors1: "/assets/figma/cases-1440/optimized/ad-trs-motors-1.avif",
  trsMotors2: "/assets/figma/cases-1440/optimized/ad-trs-motors-2.avif",
  gloryPartners: "/assets/figma/cases-1440/optimized/ad-glory-partners.avif",
} as const;

export const cases1440Assets = {
  /** Иконка просмотров — group126 из Figma 783:9284 */
  viewsIcon: "/assets/figma/cases-1440/views-icon-figma.svg",
} as const;

export type Cases1440Mode = "vertical" | "advertising";

export type CasesVerticalCard = {
  id: string;
  image: string;
  /** Строки заголовка карточки (верх), капс в вёрстке */
  titleLines: readonly string[];
  views: string;
  credits: readonly string[];
  /** Первый кадр в макете — лёгкий затемняющий слой */
  overlayLight?: boolean;
  /** Модалка: видео по кнопке play (URL из Media в CMS) */
  detailVideoUrl?: string;
  /** Модалка «описание кейса»: блоки Задача / Результат */
  detailTask: string;
  detailResult: string;
};

export const casesVerticalCards1440: readonly CasesVerticalCard[] = [
  {
    id: "v1",
    image: CASES_VERTICAL_IMG.callebaut,
    titleLines: ["Callebaut"],
    views: "13 400",
    credits: ["Режиссер: Софья Лопатина", "DOP: Виталий Каминский"],
    overlayLight: true,
    detailTask:
      "Снять вертикальное видео для социальных сетей международного бренда Callebaut с участием амбассадора от России — Андрея Канакина. Важно было раскрыть личность шефа, показать его путь, мотивацию и источник вдохновения, связав это с философией бренда.",
    detailResult:
      "Формат показал высокую вовлеченность и высокий уровень конверсии в заявку на обучение.",
  },
  {
    id: "v2",
    image: CASES_VERTICAL_IMG.titoPov,
    titleLines: ["Tito", "POV"],
    views: "10 100",
    credits: ["Режиссер: Кира Писоцкая"],
    detailTask:
      "Серия вертикальных роликов в формате POV: динамика, присутствие зрителя в кадре и честный тон бренда.",
    detailResult: "Ролики набрали стабильный охват и удержание в ленте.",
  },
  {
    id: "v3",
    image: CASES_VERTICAL_IMG.titoDetstvo,
    titleLines: ["Tito", "Детство"],
    views: "16 400",
    credits: ["Режиссер: Кира Писоцкая"],
    detailTask:
      "Историческое вертикальное видео с эмоциональной подачей и узнаваемым визуальным кодом.",
    detailResult: "Сильный отклик аудитории и рост вовлечённости в комментариях.",
  },
  {
    id: "v4",
    image: CASES_VERTICAL_IMG.badGallery,
    titleLines: ["Bad", "gallery"],
    views: "6 513",
    credits: ["Режиссер: Кира Писоцкая"],
    detailTask:
      "Контрастная подача для галереи: ритм монтажа, крупные планы и характерный саунд.",
    detailResult: "Повысили узнаваемость проекта в нише и долю сохранений.",
  },
  {
    id: "v5",
    image: CASES_VERTICAL_IMG.ogBuda,
    titleLines: ["OG Buda"],
    views: "200 000",
    credits: ["Режиссер: Кира Писоцкая"],
    detailTask:
      "Масштабный релиз вертикального контента с упором на атмосферу и узнаваемые кадры.",
    detailResult: "Охват и просмотры вышли на целевой уровень для запуска кампании.",
  },
] as const;

/** Пропсы каруселей кейсов (данные из CMS или fallback). */
export type CasesSectionCardsProps = {
  verticalCards?: readonly CasesVerticalCard[];
  adCards?: readonly CasesAdCard[];
};

export type CasesAdCard = {
  id: string;
  image: string;
  title: string;
  credits: readonly string[];
  /** Модалка: видео по кнопке play */
  detailVideoUrl?: string;
  detailTask: string;
  detailResultLead: string;
  detailResultBullets?: readonly string[];
  detailResultClosing?: string;
};

const TRS_AD_DETAIL = {
  detailTask:
    "Создать теплый, эмоциональный ролик, который будет вызывать доверие, ассоциировать сервис с заботой и надежностью и работать на широкую аудиторию, включая семейные пары.",
  detailResultLead:
    "По сюжету механик относится к машине клиента так же бережно, как к автомобилю своей семьи, думая о своих близких в процессе работы.",
  detailResultBullets: [
    "Сняли 4 ролика с единой сюжетной концепцией,",
    "Адаптировали под 4 разные машины – BMW, Dodge, Mercedes, Jeep.",
  ] as const,
  detailResultClosing: "Все ролики снимались параллельно, в ускоренном темпе.",
} as const;

export const casesAdCards1440: readonly CasesAdCard[] = [
  {
    id: "a1",
    image: CASES_AD_IMG.trsMotors1,
    title: "TRS Motors & Mercedes",
    credits: ["Режиссер: Софья Лопатина", "DOP: Виталий Каминский"],
    ...TRS_AD_DETAIL,
  },
  {
    id: "a2",
    image: CASES_AD_IMG.trsMotors2,
    title: "TRS Motors & Mercedes",
    credits: ["Режиссер: Кира Писоцкая"],
    ...TRS_AD_DETAIL,
  },
  {
    id: "a3",
    image: CASES_AD_IMG.gloryPartners,
    title: "Glory Partners",
    credits: ["Видеомейкер: Дмитрий Генералов"],
    detailTask:
      "Показать партнёрскую программу как понятный и выгодный инструмент для бизнеса в динамичном ритме.",
    detailResultLead:
      "Ролик объяснил механику программы, усилил доверие к бренду и стал основой для performance-кампании.",
  },
] as const;

export const cases1440Copy = {
  eyebrow: "кейсы",
  verticalTitleItalic: "Вертикальный",
  verticalTitleRest: " контент",
  adTitleItalic: "Рекламные",
  adTitleRest: " кейсы",
} as const;
