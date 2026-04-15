"use client";

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { mobileMenuLayout360 } from "@/widgets/first-screen/model/first-screen-mobile-menu.layout";
import { FirstScreenMobileMenu } from "@/widgets/first-screen/ui/first-screen-mobile-menu";

type FirstScreenHeader360Props = {
  onCtaClick?: () => void;
  showNews?: boolean;
};

export function FirstScreenHeader360({
  onCtaClick,
  showNews = true,
}: FirstScreenHeader360Props) {
  const surfaceTheme = useNavbarSurface(56);

  return (
    <FirstScreenMobileMenu
      layout={mobileMenuLayout360}
      onOverlayCtaClick={onCtaClick}
      showNews={showNews}
      surfaceTheme={surfaceTheme}
    />
  );
}
