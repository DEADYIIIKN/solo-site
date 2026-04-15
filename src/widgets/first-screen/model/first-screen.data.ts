import { showreelVideoSrc } from "@/widgets/showreel/model/showreel.data";

export const firstScreenNavItems = [
  "об агенстве",
  "кейсы",
  "услуги",
  "Новости",
  "Контакты"
] as const;

export const firstScreenNavLinks = [
  { label: "об агенстве", href: "#what-we-do-section" },
  { label: "кейсы", href: "#cases-section" },
  { label: "услуги", href: "#services-section" },
  { label: "Новости", href: "/news" },
  { label: "Контакты", href: "#footer-section" },
] as const;

export function getFirstScreenNavLinks(showNews: boolean) {
  return firstScreenNavLinks.filter((item) => showNews || item.label !== "Новости");
}

export const firstScreenContent = {
  phone: "+7 (968) 973-11-68",
  email: "info@soloproduction.pro",
  cta: "связаться",
  ctaCircle: "бесплатная консультация",
  titleTop: "видеоконтент",
  titleBottom: "под\u00A0бизнес-задачи бренда",
  subtitle:
    "Создаем систему видеоконтента, которая увеличивает охваты, вовлеченность и заявки.",
  geoLabel: "Работаем по\u00A0всей России"
} as const;

export const firstScreenAssets = {
  backgroundGrid: "/assets/figma/10106-background-grid/rectangle173.png",
  firstScreen1440: {
    grid: "/assets/figma/9656-first-screen-1440/rectangle173.png",
    logo: "/assets/figma/9656-first-screen-1440/logo.svg",
    heroImage: "/assets/figma/9656-first-screen-1440/hero-image.png",
    geo: "/assets/figma/9656-first-screen-1440/geo.svg"
  },
  navbar: {
    logo360: "/assets/figma/7408-navbar-360/logo.svg",
    logo360MenuDark: "/assets/figma/7408-navbar-360/logo-menu-dark.svg",
    logo480: "/assets/figma/7529-navbar-480/logo.svg",
    logo768: "/assets/figma/11985-navbar-768/group1381.svg",
    logo1024: "/assets/figma/11985-navbar-768/group1381.svg",
    logo1024Dark: "/assets/figma/7764-navbar-1024/logo.svg",
    logo1440: "/assets/figma/9656-first-screen-1440/logo.svg",
    logo1440Dark: "/assets/figma/7893-navbar-1440/logo.svg",
    menu360: "/assets/figma/7408-navbar-360/menu.svg",
    menu480: "/assets/figma/7529-navbar-480/menu.svg",
    menu768: "/assets/figma/11985-navbar-768/group349.svg"
  },
  cta360: "/assets/figma/10586-cta-button-360/cta.svg",
  cta480: "/assets/figma/11354-cta-button-480/cta.svg",
  geo360Ellipse110: "/assets/figma/10582-hero-geo-360/ellipse110.svg",
  geo360Ellipse113: "/assets/figma/10582-hero-geo-360/ellipse113.svg",
  geo480Ellipse110: "/assets/figma/11363-hero-geo-480/ellipse110.png",
  geo480Ellipse113: "/assets/figma/11363-hero-geo-480/ellipse113.png",
  ctaOuter: "/assets/figma/1440-cta/ellipse112.svg",
  ctaGlow: "/assets/figma/1440-cta/ellipse110.svg",
  ctaDotRing: "/assets/figma/1440-cta/ellipse111.svg",
  ctaTextPath: "/assets/figma/1440-cta/vector.svg",
  cta1024Outer: "/assets/figma/9015-cta-button-1024/ellipse112.svg",
  cta1024Glow: "/assets/figma/9015-cta-button-1024/ellipse110.svg",
  cta1024DotRing: "/assets/figma/9015-cta-button-1024/ellipse111.svg",
  cta1024TextPath: "/assets/figma/9015-cta-button-1024/vector.svg",
  ctaHoverOuter: "/assets/figma/10000-cta-hover/ellipse112.svg",
  ctaHoverGlow: "/assets/figma/10000-cta-hover/ellipse110.svg",
  ctaHoverDot: "/assets/figma/10000-cta-hover/ellipse111.svg",
  ctaHoverTextPath: "/assets/figma/10000-cta-hover/vector.svg",
  ctaFloatingOuter: "/assets/figma/10005-cta-button/cta-outer.svg",
  ctaFloatingGlow: "/assets/figma/10005-cta-button/cta-glow.svg",
  ctaFloatingDotRing: "/assets/figma/10005-cta-button/cta-dotring.svg",
  ctaFloatingTextPath: "/assets/figma/10005-cta-button/cta-text.svg",
  heroVideoPreview: showreelVideoSrc,
  heroImage: "/assets/figma/9003-hero-screen-1024/hero-image.png",
  geoMark: "/assets/figma/9010-hero-geo-block-1024/geo-mark.svg"
} as const;
