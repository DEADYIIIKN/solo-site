import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";

/**
 * Раскладка мобильного меню (оверлей + шапка) по брейкпоинтам.
 * Контент списка и контактов совпадает с макетом 360 (node 783:8293); отличаются размеры шапки и кнопки.
 */
export type MobileMenuLayoutConfig = {
  header: {
    className: string;
    logoClass: string;
    logoClosedSrc: string;
    /** Обёртка кнопки: без фона — оранжевый круг внутри вращается вместе с иконкой */
    menuButtonClass: string;
    menuIconImgClass: string;
    menuIconSrc: string;
  };
  overlay: {
    whitePanelClass: string;
    navBarRowClass: string;
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
  header: {
    className:
      "fixed left-1/2 top-0 z-20 flex h-[56px] w-[328px] -translate-x-1/2 items-end justify-between px-[16px]",
    logoClass: "relative h-[20px] w-[113px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo360,
    menuButtonClass:
      "relative size-[44px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[18px]",
    menuIconSrc: firstScreenAssets.navbar.menu360
  },
  overlay: {
    whitePanelClass: "absolute right-0 top-0 h-[575px] w-full bg-white",
    navBarRowClass:
      "absolute left-1/2 top-0 flex h-[56px] w-[328px] -translate-x-1/2 items-end justify-between px-[16px]",
    logoMenuDarkClass: "relative h-[20px] w-[113px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[44px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};

export const mobileMenuLayout480: MobileMenuLayoutConfig = {
  header: {
    className:
      "fixed left-1/2 top-0 z-20 flex h-[60px] w-[432px] -translate-x-1/2 items-end justify-between px-[24px]",
    logoClass: "relative h-[22px] w-[124px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo480,
    menuButtonClass:
      "relative size-[52px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[20px]",
    menuIconSrc: firstScreenAssets.navbar.menu480
  },
  overlay: {
    whitePanelClass: "absolute right-0 top-0 h-[575px] w-full bg-white",
    navBarRowClass:
      "absolute left-1/2 top-0 flex h-[60px] w-[432px] -translate-x-1/2 items-end justify-between px-[24px]",
    logoMenuDarkClass: "relative h-[22px] w-[124px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[52px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};

export const mobileMenuLayout768: MobileMenuLayoutConfig = {
  header: {
    className:
      "fixed left-1/2 top-0 z-20 flex h-[64px] w-[672px] -translate-x-1/2 items-end justify-between px-[30px]",
    logoClass: "relative h-[24px] w-[136px] shrink-0",
    logoClosedSrc: firstScreenAssets.navbar.logo768,
    menuButtonClass:
      "relative size-[56px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0",
    menuIconImgClass: "size-[24px]",
    menuIconSrc: firstScreenAssets.navbar.menu768
  },
  overlay: {
    whitePanelClass: "absolute right-0 top-0 h-[575px] w-full bg-white",
    navBarRowClass:
      "absolute left-1/2 top-0 flex h-[64px] w-[672px] -translate-x-1/2 items-end justify-between px-[30px]",
    logoMenuDarkClass: "relative h-[24px] w-[136px] shrink-0",
    logoMenuDarkSrc: logoMenuDarkShared,
    closeButtonClass:
      "relative size-[56px] shrink-0 overflow-hidden rounded-[28px] border-0 bg-transparent p-0"
  }
};

