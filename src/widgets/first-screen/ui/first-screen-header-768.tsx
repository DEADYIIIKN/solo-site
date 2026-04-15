"use client";

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { firstScreenContent } from "@/widgets/first-screen/model/first-screen.data";
import { mobileMenuLayout768 } from "@/widgets/first-screen/model/first-screen-mobile-menu.layout";
import { FirstScreenMobileMenu } from "@/widgets/first-screen/ui/first-screen-mobile-menu";

type FirstScreenHeader768Props = {
  onCtaClick?: () => void;
  showNews?: boolean;
};

export function FirstScreenHeader768({
  onCtaClick,
  showNews = true,
}: FirstScreenHeader768Props) {
  const surfaceTheme = useNavbarSurface(64);
  const phoneColor = surfaceTheme === "light-surface" ? "#0d0300" : "#ffffff";

  return (
    <FirstScreenMobileMenu
      headerBeforeMenu={
        <a
          className="whitespace-nowrap text-right text-[17px] font-semibold leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)]"
          href="tel:+79689731168"
          style={{ color: phoneColor }}
        >
          {firstScreenContent.phone}
        </a>
      }
      layout={mobileMenuLayout768}
      onOverlayCtaClick={onCtaClick}
      showNews={showNews}
      surfaceTheme={surfaceTheme}
    />
  );
}
