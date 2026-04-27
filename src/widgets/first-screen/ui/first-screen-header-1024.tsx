/* eslint-disable @next/next/no-img-element */

import { createPortal } from "react-dom";

import { useNavbarSurface } from "@/shared/lib/use-navbar-surface";
import { SiteNavLink } from "@/shared/ui/site-nav-link";
import {
  getFirstScreenNavLinks,
  firstScreenAssets,
  firstScreenContent,
} from "@/widgets/first-screen/model/first-screen.data";

type FirstScreenHeader1024Props = {
  onCtaClick?: () => void;
  showNews?: boolean;
};

export function FirstScreenHeader1024({
  onCtaClick,
  showNews = true,
}: FirstScreenHeader1024Props) {
  const navbarSurface = useNavbarSurface(72);
  const isLightTheme = navbarSurface === "light-surface";
  const navLinks = getFirstScreenNavLinks(showNews);

  /* Figma 783:9016: 1024 navbar 944×72. Подложки в Figma нет, но применяем
     тот же gray-translucent + backdrop-blur паттерн как у mobile. Размеры из
     Figma element size: rounded-bl/br-20 (по progressive scale между 768→1440). */
  const header = (
    <header
      className="fixed inset-x-0 top-0 z-[800] hidden h-[72px] min-[1024px]:block min-[1440px]:hidden bg-transparent"
    >
      <div className="mx-auto flex h-full w-[944px] items-center justify-between rounded-bl-[20px] rounded-br-[20px] bg-[#9c9c9c]/[0.12] px-[30px] py-[15px] backdrop-blur-[4px]">
        <div className="relative h-[24px] w-[136px] shrink-0">
          <img
            alt="СОЛО"
            className={`absolute inset-0 block h-full w-full max-w-none object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
              isLightTheme ? "opacity-0" : "opacity-100"
            }`}
            src={firstScreenAssets.navbar.logo1024}
            style={{ height: "24px", maxWidth: "none", width: "136px" }}
          />
          <img
            alt="СОЛО"
            className={`absolute inset-0 block h-full w-full max-w-none object-contain object-left transition-opacity duration-[180ms] ease-[var(--ease-standard)] ${
              isLightTheme ? "opacity-100" : "opacity-0"
            }`}
            src={firstScreenAssets.navbar.logo1024Dark}
            style={{ height: "24px", maxWidth: "none", width: "136px" }}
          />
        </div>

        <nav
          className={`flex shrink-0 items-center justify-center gap-[16px] rounded-[10px] text-center text-[14px] font-medium lowercase leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)] ${
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
            className="whitespace-nowrap text-right text-[17px] font-semibold leading-[1.2] transition-[color] duration-[180ms] ease-[var(--ease-standard)]"
            href="tel:+79689731168"
            style={{ color: isLightTheme ? "#0d0300" : "#ffffff" }}
          >
            {firstScreenContent.phone}
          </a>
          <button
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
