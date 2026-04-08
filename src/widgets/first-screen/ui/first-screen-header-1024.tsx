/* eslint-disable @next/next/no-img-element */

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { SiteNavLink } from "@/shared/ui/site-nav-link";
import {
  firstScreenAssets,
  firstScreenContent,
  firstScreenNavLinks
} from "@/widgets/first-screen/model/first-screen.data";

type FirstScreenHeader1024Props = {
  onCtaClick?: () => void;
};

export function FirstScreenHeader1024({ onCtaClick }: FirstScreenHeader1024Props) {
  const navbarSurface = useNavbarSurface(72);
  const isLightTheme = navbarSurface === "light-surface";
  const isHeroTransparent = navbarSurface === "hero-transparent";

  return (
    <header
      className="fixed inset-x-0 top-0 z-[400] h-[72px] transition-[background-color] duration-[180ms] ease-[var(--ease-standard)]"
      style={{ backgroundColor: isHeroTransparent ? "transparent" : isLightTheme ? "#ffffff" : "#0d0300" }}
    >
      <div className="mx-auto flex h-full w-[944px] items-center justify-between px-[30px] py-[15px]">
        <div className="relative h-[24px] w-[136px] shrink-0">
          <img
            alt="СОЛО"
            className={`absolute inset-0 block h-full w-full object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
              isLightTheme ? "opacity-0" : "opacity-100"
            }`}
            src={firstScreenAssets.navbar.logo1024}
          />
          <img
            alt="СОЛО"
            className={`absolute inset-0 block h-full w-full object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
              isLightTheme ? "opacity-100" : "opacity-0"
            }`}
            src={firstScreenAssets.navbar.logo360MenuDark}
          />
        </div>

        <nav
          className={`flex shrink-0 items-center justify-center gap-[16px] rounded-[10px] text-center text-[14px] font-medium lowercase leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)] ${
            isLightTheme ? "text-[#0d0300]" : "text-white"
          }`}
        >
          {firstScreenNavLinks.map((item) => (
            <SiteNavLink
              key={item.label}
              className="shrink-0 whitespace-nowrap transition-[color,opacity] duration-[180ms] ease-[var(--ease-standard)] hover:opacity-75"
              href={item.href}
            >
              {item.label}
            </SiteNavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-[16px]">
          <a
            className="whitespace-nowrap text-right text-[17px] font-semibold leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)]"
            href="tel:+79689731168"
            style={{ color: isLightTheme ? "#0d0300" : "#ffffff" }}
          >
            {firstScreenContent.phone}
          </a>
          <button
            className="flex h-[42px] w-[114px] shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] whitespace-nowrap text-center"
            onClick={onCtaClick}
            style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, color: "#ffffff" }}
            type="button"
          >
            {firstScreenContent.cta}
          </button>
        </div>
      </div>
    </header>
  );
}
