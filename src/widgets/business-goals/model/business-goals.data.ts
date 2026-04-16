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
        "привлекаем аудиторию, строим комьюнити и растим узнаваемость бренда",
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
  mainImage: "/assets/figma/8967-what-we-do-card-social-media-1024/rectangle74.jpg",
  cardTrafficImage: "/assets/figma/8968-what-we-do-card-traffic-1024/image.jpg",
  cardImageImage: "/assets/figma/8972-what-we-do-card-image-1024/rectangle78.jpg",
  cardProductionImage: "/assets/figma/8976-what-we-do-card-production-1024/image.jpg",
  ctaOuter: firstScreenAssets.ctaFloatingOuter,
  ctaGlow: firstScreenAssets.ctaFloatingGlow,
  ctaDotRing: firstScreenAssets.ctaFloatingDotRing,
  ctaTextPath: firstScreenAssets.ctaFloatingTextPath,
  /** Figma 805:14096 — свечение под текстом в компактном floating CTA (360/480) */
  ctaSmallGlow: "/assets/figma/805-floating-cta-small/cta-small-glow.svg",
  mobileArrowLeft: "/assets/figma/12009-arrow/icon-arrow-left.svg",
  mobileArrowRight: "/assets/figma/12009-arrow/icon-arrow-right.svg",
  mobile768CardSocial: "/assets/figma/11947-business-goals-768/rectangle74.png",
  mobile768CardTraffic: "/assets/figma/11947-business-goals-768/rectangle75.png",
  mobile768CardImage: "/assets/figma/11947-business-goals-768/rectangle78.png",
  mobile768CardProduction: "/assets/figma/11947-business-goals-768/image.png",
  mobile480CardSocial: "/assets/figma/11323-business-goals-480/rectangle74.png",
  mobile480CardTraffic: "/assets/figma/11323-business-goals-480/rectangle75.png",
  mobile480CardImage: "/assets/figma/11323-business-goals-480/rectangle78.png",
  mobile480CardProduction: "/assets/figma/11323-business-goals-480/image.png",
  mobile360CardSocial: "/assets/figma/10547-business-goals-360/rectangle74.png",
  mobile360CardTraffic: "/assets/figma/10547-business-goals-360/rectangle75.png",
  mobile360CardImage: "/assets/figma/10547-business-goals-360/rectangle78.png",
  mobile360CardProduction: "/assets/figma/10547-business-goals-360/image.png",
} as const;
