"use client";

/* eslint-disable @next/next/no-img-element */

import type { ReactNode, TransitionEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { NavbarSurface } from "@/shared/lib/use-navbar-surface";
import { cn } from "@/shared/lib/utils";
import { SiteNavLink } from "@/shared/ui/site-nav-link";
import type { MobileMenuLayoutConfig } from "@/widgets/first-screen/model/first-screen-mobile-menu.layout";
import { MOBILE_MENU_NAV_TOPS } from "@/widgets/first-screen/model/first-screen-mobile-menu.layout";
import {
  firstScreenContent,
  getFirstScreenNavLinks,
} from "@/widgets/first-screen/model/first-screen.data";

const MENU_ICON_TRANSITION_MS = 480;
const OVERLAY_OPEN_MS = 380;
const OVERLAY_CLOSE_MS = 560;
const HEADER_THEME_TRANSITION_MS = 120;
type FirstScreenMobileMenuProps = {
  layout: MobileMenuLayoutConfig;
  surfaceTheme: NavbarSurface;
  /** Только 768: телефон в шапке слева от кнопки меню */
  headerBeforeMenu?: ReactNode;
  /** Кнопка «связаться» в открытом меню — модалка консультации (вариант «задача») */
  onOverlayCtaClick?: () => void;
  showNews?: boolean;
};

/** Оранжевый круг и белые точки — один слой с общим transform (как в Figma, без «разъезда» слоёв). */
function MenuToggleIconButton({
  ariaLabel,
  onClick,
  buttonClassName,
  iconImgClass,
  iconSrc,
  iconOpen,
  overlayExiting,
}: {
  ariaLabel: string;
  onClick: () => void;
  buttonClassName: string;
  iconImgClass: string;
  iconSrc: string;
  iconOpen: boolean;
  overlayExiting: boolean;
}) {
  const iconDurationMs = overlayExiting ? OVERLAY_CLOSE_MS : MENU_ICON_TRANSITION_MS;
  const iconEasing = overlayExiting
    ? "cubic-bezier(0.45, 0, 0.2, 1)"
    : "cubic-bezier(0.33, 1, 0.68, 1)";
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        buttonClassName,
        "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0300] focus-visible:outline-none",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "flex size-full origin-center items-center justify-center rounded-[28px] bg-[#ff5c00] transition-transform will-change-transform",
          iconOpen ? "rotate-45" : "rotate-0",
        )}
        style={{
          transitionDuration: `${iconDurationMs}ms`,
          transitionTimingFunction: iconEasing,
        }}
      >
        <img
          alt=""
          className={cn("block max-w-none object-contain", iconImgClass)}
          src={iconSrc}
        />
      </span>
    </button>
  );
}

export function FirstScreenMobileMenu({
  layout,
  surfaceTheme,
  headerBeforeMenu,
  onOverlayCtaClick,
  showNews = true,
}: FirstScreenMobileMenuProps) {
  const { header, overlay, visibilityClass } = layout;
  const navLinks = getFirstScreenNavLinks(showNews);
  const [isOpen, setIsOpen] = useState(false);
  const [overlayEntered, setOverlayEntered] = useState(false);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const closingRef = useRef(false);
  const closeFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseFallback() {
    if (closeFallbackTimerRef.current != null) {
      clearTimeout(closeFallbackTimerRef.current);
      closeFallbackTimerRef.current = null;
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    setOverlayEntered(false);
    setIconOpen(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlayEntered(true);
        setIconOpen(true);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => () => clearCloseFallback(), []);

  function handleOpenMenu() {
    closingRef.current = false;
    clearCloseFallback();
    setOverlayExiting(false);
    setIsOpen(true);
  }

  function finalizeClose() {
    clearCloseFallback();
    setOverlayExiting(false);
    setIsOpen(false);
    closingRef.current = false;
  }

  function handleCloseMenu() {
    clearCloseFallback();
    closingRef.current = true;
    setIconOpen(false);
    setOverlayExiting(true);
    setOverlayEntered(false);
    closeFallbackTimerRef.current = setTimeout(() => {
      if (!closingRef.current) return;
      finalizeClose();
    }, Math.max(MENU_ICON_TRANSITION_MS, OVERLAY_CLOSE_MS) + 150);
  }

  function handleOverlayTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "opacity") return;
    if (!closingRef.current) return;
    finalizeClose();
  }

  function handleMenuButtonClick() {
    if (isOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  }

  const menuButton = (
    <MenuToggleIconButton
      ariaLabel={isOpen ? "Закрыть меню" : "Открыть меню"}
      buttonClassName={header.menuButtonClass}
      iconImgClass={header.menuIconImgClass}
      iconOpen={iconOpen}
      iconSrc={header.menuIconSrc}
      onClick={handleMenuButtonClick}
      overlayExiting={overlayExiting}
    />
  );

  const isLightSurface = surfaceTheme === "light-surface";

  const layer = (
    <>
      <header
        className={cn(
          header.className,
          /* Header сам прозрачный — surface (bg-blur + rounded) живёт
             в `innerClassName` (Figma 803:13630 / 783:10591 — gray 12%
             opacity + backdrop-blur 4px + rounded-b-12). */
          "bg-transparent",
        )}
      >
        <div className={header.innerClassName}>
          <div className={header.logoClass}>
            <img
              alt="СОЛО"
              className={`absolute block size-full max-w-none object-contain transition-opacity ease-[var(--ease-standard)] ${
                isLightSurface ? "opacity-0" : "opacity-100"
              }`}
              src={header.logoClosedSrc}
              style={{ transitionDuration: `${HEADER_THEME_TRANSITION_MS}ms` }}
            />
            <img
              alt="СОЛО"
              className={`absolute block size-full max-w-none object-contain transition-opacity ease-[var(--ease-standard)] ${
                isLightSurface ? "opacity-100" : "opacity-0"
              }`}
              src={overlay.logoMenuDarkSrc}
              style={{ transitionDuration: `${HEADER_THEME_TRANSITION_MS}ms` }}
            />
          </div>
          {headerBeforeMenu ? (
            <div className="flex shrink-0 items-center justify-end gap-[24px]">
              {headerBeforeMenu}
              {menuButton}
            </div>
          ) : (
            menuButton
          )}
        </div>
      </header>

      {isOpen ? (
        <div
          className={`${visibilityClass} fixed inset-0 z-[810] bg-[#0d0300] transition-[opacity,transform] will-change-[opacity,transform] ${
            overlayEntered
              ? "translate-y-0 opacity-100"
              : `${overlayExiting ? "translate-y-0" : "translate-y-3"} opacity-0`
          }`}
          onTransitionEnd={handleOverlayTransitionEnd}
          style={{
            transitionDuration: `${
              overlayExiting && !overlayEntered ? OVERLAY_CLOSE_MS : OVERLAY_OPEN_MS
            }ms`,
            transitionTimingFunction:
              overlayExiting && !overlayEntered
                ? "cubic-bezier(0.45, 0, 0.2, 1)"
                : "cubic-bezier(0.33, 1, 0.68, 1)"
          }}
        >
          <div className={overlay.topBarClass} />
          <div className={overlay.whitePanelClass} />

          {navLinks.map((item, i) => (
            <SiteNavLink
              key={item.label}
              className={`absolute left-1/2 w-[188px] -translate-x-1/2 text-center text-[16px] font-medium lowercase leading-[1.2] text-[#0d0300] ${MOBILE_MENU_NAV_TOPS[i]}`}
              href={item.href}
              onClick={() => {
                handleCloseMenu();
              }}
            >
              {item.label}
            </SiteNavLink>
          ))}

          <button
            className="absolute left-1/2 top-[359px] flex h-[48px] w-[156px] -translate-x-1/2 items-center justify-center rounded-[50px] bg-[#ff5c00] whitespace-nowrap text-center lowercase"
            onClick={() => {
              onOverlayCtaClick?.();
              handleCloseMenu();
            }}
            style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, color: "#ffffff" }}
            type="button"
          >
            {firstScreenContent.cta}
          </button>

          <a
            className="absolute left-1/2 top-[454px] -translate-x-1/2 whitespace-nowrap text-center text-[36px] font-semibold leading-[1.2] text-[#0d0300] scale-[0.56] origin-top"
            href={`tel:${firstScreenContent.phone.replace(/[^\d+]/g, "")}`}
          >
            {firstScreenContent.phone}
          </a>

          <a
            className="absolute left-1/2 top-[509px] -translate-x-1/2 whitespace-nowrap text-center text-[20px] font-semibold leading-[1.2] text-[#0d0300]"
            href={`mailto:${firstScreenContent.email}`}
          >
            {firstScreenContent.email}
          </a>

          <div className={overlay.navBarRowClass}>
            <div className={overlay.navBarInnerClassName}>
              <div className={overlay.logoMenuDarkClass}>
                <img
                  alt="СОЛО"
                  className="absolute block size-full max-w-none object-contain"
                  src={overlay.logoMenuDarkSrc}
                />
              </div>
              <MenuToggleIconButton
                ariaLabel="Закрыть меню"
                buttonClassName={overlay.closeButtonClass}
                iconImgClass={header.menuIconImgClass}
                iconOpen={iconOpen}
                iconSrc={header.menuIconSrc}
                onClick={handleCloseMenu}
                overlayExiting={overlayExiting}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );

  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}
