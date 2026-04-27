import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";

/**
 * Раскладка мобильного меню (оверлей + шапка) по брейкпоинтам.
 * Контент списка и контактов совпадает с макетом 360 (node 783:8293); отличаются размеры шапки и кнопки.
 */
export type MobileMenuLayoutConfig = {
  visibilityClass: string;
  header: {
    className: string;
    innerClassName: string;
    logoClass: string;
    logoClosedSrc: string;
    /** Обёртка кнопки: без фона — оранжевый круг внутри вращается вместе с иконкой */
    menuButtonClass: string;
    menuIconImgClass: string;
    menuIconSrc: string;
  };
  overlay: {
    topBarClass: string;
    whitePanelClass: string;
    navBarRowClass: string;
    navBarInnerClassName: string;
    logoMenuDarkClass: string;
    logoMenuDarkSrc: string;
    /** Те же размеры/отступы, что и menuButtonClass в header */
    closeButtonClass: string;
  };
};

export const MOBILE_MENU_NAV_TOPS = [
  "top-[96px]",
  "top-[139px]",
  "top-[182px]",
  "top-[225px]",
  "top-[268px]"
] as const;

/** Тёмный логотип в открытом меню: в экспортах 480/768 отдельного файла нет — тот же SVG, что в 360. */
const logoMenuDarkShared = firstScreenAssets.navbar.logo360MenuDark;

export const mobileMenuLayout360: MobileMenuLayoutConfig = {
  visibilityClass: "hidden max-[479px]:block",
  header: {
    className: "fixed inset-x-0 top-0 z-[800] hidden h-[56px] max-[479px]:block",
    innerClassName: "mx-auto flex h-full w-[328px] items-center justify-between px-[16px]",
    logoClass: "relative h-[18px] w-[102px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo360,
    menuButtonClass:
      "relative size-[40px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[18px]",
    menuIconSrc: firstScreenAssets.navbar.menu360
  },
  overlay: {
    topBarClass: "absolute inset-x-0 top-0 h-[56px] bg-white",
    whitePanelClass: "absolute inset-x-0 top-0 bottom-0 bg-white",
    navBarRowClass: "absolute inset-x-0 top-0 h-[56px]",
    navBarInnerClassName: "mx-auto flex h-full w-[328px] items-center justify-between px-[16px]",
    logoMenuDarkClass: "relative h-[20px] w-[113px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[44px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};

export const mobileMenuLayout480: MobileMenuLayoutConfig = {
  visibilityClass: "hidden min-[480px]:block min-[768px]:hidden",
  header: {
    className: "fixed inset-x-0 top-0 z-[800] hidden h-[60px] min-[480px]:block min-[768px]:hidden",
    innerClassName: "mx-auto flex h-full w-[432px] items-center justify-between px-[24px]",
    logoClass: "relative h-[22px] w-[124px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo480,
    menuButtonClass:
      "relative size-[52px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[20px]",
    menuIconSrc: firstScreenAssets.navbar.menu480
  },
  overlay: {
    topBarClass: "absolute inset-x-0 top-0 h-[60px] bg-white",
    whitePanelClass: "absolute inset-x-0 top-0 bottom-0 bg-white",
    navBarRowClass: "absolute inset-x-0 top-0 h-[60px]",
    navBarInnerClassName: "mx-auto flex h-full w-[432px] items-center justify-between px-[24px]",
    logoMenuDarkClass: "relative h-[22px] w-[124px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[52px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};

export const mobileMenuLayout768: MobileMenuLayoutConfig = {
  visibilityClass: "hidden min-[768px]:block min-[1024px]:hidden",
  header: {
    className: "fixed inset-x-0 top-0 z-[800] hidden h-[64px] min-[768px]:block min-[1024px]:hidden",
    innerClassName: "mx-auto flex h-full w-[672px] items-center justify-between px-[30px]",
    logoClass: "relative h-[24px] w-[136px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo768,
    menuButtonClass:
      "relative size-[56px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[24px]",
    menuIconSrc: firstScreenAssets.navbar.menu768
  },
  overlay: {
    topBarClass: "absolute inset-x-0 top-0 h-[64px] bg-white",
    whitePanelClass: "absolute inset-x-0 top-0 bottom-0 bg-white",
    navBarRowClass: "absolute inset-x-0 top-0 h-[64px]",
    navBarInnerClassName: "mx-auto flex h-full w-[672px] items-center justify-between px-[30px]",
    logoMenuDarkClass: "relative h-[24px] w-[136px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[56px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};
