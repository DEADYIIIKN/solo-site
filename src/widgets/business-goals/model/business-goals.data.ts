import {
  firstScreenAssets,
  firstScreenContent,
  firstScreenNavItems,
} from "@/widgets/first-screen/model/first-screen.data";

export const businessGoalsContent = {
  sectionTitle: "решаем бизнес-задачи с\u00a0помощью видео",
  cards: [
    {
      id: "01",
      label: "Соцсети",
      titlePrimary: "Система видеоконтента",
      titleAccent: "для соцсетей",
      description:
        "привлекаем аудиторию, строим комьюнити и\u00a0растим\u00a0узнаваемость бренда",
    },
    {
      id: "02",
      label: "Трафик",
      titlePrimary: "Видео для",
      titleAccent: "контекстной и таргетированной",
      titleSuffix: "рекламы",
      description: "привлекаем внимание, повышаем клики и заявки",
    },
    {
      id: "03",
      label: "Имидж",
      titlePrimary: "Крупные",
      titleAccent: "рекламные и имиджевые",
      titleSuffix: "ролики",
      description: "показываем бренд и продукт максимально убедительно",
    },
    {
      id: "04",
      label: "Продакшн",
      titlePrimary: "Полный цикл:",
      titleAccent: "стратегия, креатив, съемка, аналитика",
      description: "каждое видео продумано для результата",
    },
  ] as const,
} as const;

export const businessGoalsAssets = {
  logo: firstScreenAssets.navbar.logo1440,
  phone: firstScreenContent.phone,
  ctaText: firstScreenContent.cta,
  navItems: firstScreenNavItems,
  arrowLeft: "/assets/figma/9274-arrow-1440/icon-arrow-left.svg",
  arrowRight: "/assets/figma/9274-arrow-1440/icon-arrow-right.svg",
  mainImage: "/assets/figma/optimized/business-goals-social.avif",
  cardTrafficImage: "/assets/figma/optimized/business-goals-traffic.avif",
  cardImageImage: "/assets/figma/optimized/business-goals-image.avif",
  cardProductionImage: "/assets/figma/optimized/business-goals-production.avif",
  ctaOuter: firstScreenAssets.ctaFloatingOuter,
  ctaGlow: firstScreenAssets.ctaFloatingGlow,
  ctaDotRing: firstScreenAssets.ctaFloatingDotRing,
  ctaTextPath: firstScreenAssets.ctaFloatingTextPath,
  /** Figma 805:14096 — свечение под текстом в компактном floating CTA (360/480) */
  ctaSmallGlow: "/assets/figma/805-floating-cta-small/cta-small-glow.svg",
  mobileArrowLeft: "/assets/figma/12009-arrow/icon-arrow-left.svg",
  mobileArrowRight: "/assets/figma/12009-arrow/icon-arrow-right.svg",
  mobile768CardSocial: "/assets/figma/optimized/business-goals-social.avif",
  mobile768CardTraffic: "/assets/figma/optimized/business-goals-traffic.avif",
  mobile768CardImage: "/assets/figma/optimized/business-goals-image.avif",
  mobile768CardProduction: "/assets/figma/optimized/business-goals-production.avif",
  mobile480CardSocial: "/assets/figma/optimized/business-goals-social.avif",
  mobile480CardTraffic: "/assets/figma/optimized/business-goals-traffic.avif",
  mobile480CardImage: "/assets/figma/optimized/business-goals-image.avif",
  mobile480CardProduction: "/assets/figma/optimized/business-goals-production.avif",
  mobile360CardSocial: "/assets/figma/optimized/business-goals-social.avif",
  mobile360CardTraffic: "/assets/figma/optimized/business-goals-traffic.avif",
  mobile360CardImage: "/assets/figma/optimized/business-goals-image.avif",
  mobile360CardProduction: "/assets/figma/optimized/business-goals-production.avif",
} as const;
