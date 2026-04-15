"use client";

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { mobileMenuLayout480 } from "@/widgets/first-screen/model/first-screen-mobile-menu.layout";
import { FirstScreenMobileMenu } from "@/widgets/first-screen/ui/first-screen-mobile-menu";

type FirstScreenHeader480Props = {
  onCtaClick?: () => void;
  showNews?: boolean;
};

export function FirstScreenHeader480({
  onCtaClick,
  showNews = true,
}: FirstScreenHeader480Props) {
  const surfaceTheme = useNavbarSurface(60);

  return (
    <FirstScreenMobileMenu
      layout={mobileMenuLayout480}
      onOverlayCtaClick={onCtaClick}
      showNews={showNews}
      surfaceTheme={surfaceTheme}
    />
  );
}
