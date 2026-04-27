/* eslint-disable @next/next/no-img-element */

import { createPortal } from "react-dom";

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { SiteNavLink } from "@/shared/ui/site-nav-link";
import {
  getFirstScreenNavLinks,
  firstScreenAssets,
  firstScreenContent,
} from "@/widgets/first-screen/model/first-screen.data";

type FirstScreenHeader1440Props = {
  onCtaClick?: () => void;
  showNews?: boolean;
};

export function FirstScreenHeader1440({
  onCtaClick,
  showNews = true,
}: FirstScreenHeader1440Props) {
  const navbarSurface = useNavbarSurface(82);
  const isLightTheme = navbarSurface === "light-surface";
  const navLinks = getFirstScreenNavLinks(showNews);

  /* Figma 783:9669: 1440 navbar 1160×82. Подложки в Figma нет, но применяем
     тот же gray-translucent + backdrop-blur паттерн. Rounded-bl/br-24
     (progressive scale: 12→16→20→20→24). */
  const header = (
    <header
      className="fixed inset-x-0 top-0 z-[800] hidden h-[82px] min-[1440px]:block bg-transparent"
    >
      <div className="mx-auto flex h-full w-[1160px] items-center justify-between rounded-bl-[24px] rounded-br-[24px] bg-[#9c9c9c]/[0.12] px-[40px] backdrop-blur-[4px]">
        <div className="relative h-[24px] w-[283px] shrink-0">
          <div className="absolute left-0 top-0 h-[24px] w-[136px]">
            <img
              alt="СОЛО"
              className={`absolute inset-0 block h-full w-full max-w-none object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
                isLightTheme ? "opacity-0" : "opacity-100"
              }`}
              src={firstScreenAssets.navbar.logo1440}
              style={{ height: "24px", maxWidth: "none", width: "136px" }}
            />
            <img
              alt="СОЛО"
              className={`absolute inset-0 block h-full w-full max-w-none object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
                isLightTheme ? "opacity-100" : "opacity-0"
              }`}
              src={firstScreenAssets.navbar.logo1440Dark}
              style={{ height: "24px", maxWidth: "none", width: "136px" }}
            />
          </div>
        </div>

        <nav
          className={`flex shrink-0 items-center justify-center gap-[24px] rounded-[10px] text-center text-[14px] font-medium lowercase leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)] ${
            isLightTheme ? "text-[#0d0300]" : "text-white"
          }`}
        >
          {navLinks.map((item) => (
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
            className={`whitespace-nowrap text-right text-[17px] font-semibold leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)] ${
              isLightTheme ? "text-[#0d0300]" : "text-white"
            }`}
            href="tel:+79689731168"
            style={{ color: isLightTheme ? "#0d0300" : "#ffffff" }}
          >
            {firstScreenContent.phone}
          </a>
          <button
            data-testid="first-screen-header-cta"
            className="flex h-[42px] w-[114px] shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] whitespace-nowrap text-center lowercase"
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

  if (typeof document === "undefined") return null;
  return createPortal(header, document.body);
}
