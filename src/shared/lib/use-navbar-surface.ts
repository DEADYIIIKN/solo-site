"use client";

import { useEffect, useState } from "react";

export type NavbarSurface = "hero-transparent" | "dark-surface" | "light-surface";
type SectionSurface = NavbarSurface | "hero-section";
const SITE_ANCHOR_NAVIGATION_ATTR = "data-site-anchor-navigation";
const SITE_ANCHOR_NAVBAR_SURFACE_ATTR = "data-site-anchor-navbar-surface";
const SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT = "site-anchor-navigation-complete";

const DESKTOP_SURFACE_SECTIONS = [
  { id: "first-screen-section", surface: "hero-section" },
  { id: "showreel-section", surface: "dark-surface" },
  { id: "business-goals-section", surface: "light-surface" },
  { id: "what-we-do-section", surface: "light-surface" },
  { id: "philosophy-section", surface: "light-surface" },
  { id: "cases-section", surface: "dark-surface" },
  { id: "services-section", surface: "light-surface" },
  { id: "lead-form-section", surface: "light-surface" },
  { id: "footer-section", surface: "dark-surface" },
] as const satisfies ReadonlyArray<{ id: string; surface: SectionSurface }>;

const ROUNDED_LIGHT_SURFACE_GUARD_PX = 64;
const DARK_NAVBAR_ROUNDED_ENTRY_SECTION_IDS = new Set(["services-section"]);

type RgbaColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

function parseRgbColor(color: string): RgbaColor | null {
  const match = color.match(/^rgba?\(([^)]+)\)$/i);
  if (!match) return null;

  const [red = "0", green = "0", blue = "0", alpha = "1"] = match[1]
    .split(",")
    .map((part) => part.trim());

  return {
    red: Number.parseFloat(red),
    green: Number.parseFloat(green),
    blue: Number.parseFloat(blue),
    alpha: Number.parseFloat(alpha),
  };
}

function getRelativeLuminance({ red, green, blue }: RgbaColor) {
  const transform = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transform(red) + 0.7152 * transform(green) + 0.0722 * transform(blue);
}

function resolveSurfaceFromElement(element: Element | null): NavbarSurface | null {
  let current = element instanceof HTMLElement ? element : null;

  while (current && current !== document.body) {
    const backgroundColor = parseRgbColor(window.getComputedStyle(current).backgroundColor);
    if (backgroundColor && backgroundColor.alpha > 0.01) {
      return getRelativeLuminance(backgroundColor) >= 0.72 ? "light-surface" : "dark-surface";
    }

    current = current.parentElement;
  }

  return null;
}

function detectSurfaceBelowHeader(probeY: number): NavbarSurface {
  const probeX = Math.round(window.innerWidth / 2);
  const safeProbeY = Math.min(window.innerHeight - 1, Math.max(1, probeY));
  const elements = document.elementsFromPoint(probeX, safeProbeY);

  for (const element of elements) {
    const surface = resolveSurfaceFromElement(element);
    if (surface) return surface;
  }

  return "dark-surface";
}

function detectSurfaceAcrossHeaderEdge(headerHeight: number): NavbarSurface | null {
  const probeXs = [24, Math.round(window.innerWidth / 2), Math.max(24, window.innerWidth - 24)];
  const probeYs = [headerHeight + 2, headerHeight + 6, headerHeight + 10].map((probeY) =>
    Math.min(window.innerHeight - 1, Math.max(1, probeY)),
  );

  let sawLight = false;
  let sawDark = false;

  for (const probeY of probeYs) {
    for (const probeX of probeXs) {
      const elements = document.elementsFromPoint(probeX, probeY);

      for (const element of elements) {
        const surface = resolveSurfaceFromElement(element);
        if (!surface) continue;
        if (surface === "light-surface") {
          sawLight = true;
        } else {
          sawDark = true;
        }
        break;
      }
    }
  }

  if (sawDark) return "dark-surface";
  if (sawLight) return "light-surface";
  return null;
}

function isViewportLineInsideSection(sectionId: string, probeY: number) {
  const section = document.getElementById(sectionId);
  if (!section || section.getClientRects().length === 0) return false;

  const rect = section.getBoundingClientRect();
  return rect.top <= probeY && rect.bottom > probeY;
}

function isAbsoluteLineInsideSection(sectionId: string, absoluteY: number) {
  const section = document.getElementById(sectionId);
  if (!section || section.getClientRects().length === 0) return false;

  const rect = section.getBoundingClientRect();
  const top = window.scrollY + rect.top;
  const bottom = top + rect.height;

  return absoluteY >= top && absoluteY < bottom;
}

function shouldHoldDarkForRoundedLightSection(sectionId: string) {
  if (!DARK_NAVBAR_ROUNDED_ENTRY_SECTION_IDS.has(sectionId)) return false;

  const section = document.getElementById(sectionId);
  if (!section || section.getClientRects().length === 0) return false;

  const rect = section.getBoundingClientRect();
  return rect.top > -ROUNDED_LIGHT_SURFACE_GUARD_PX;
}

function createNavbarSurfaceHook(options?: {
  lightSectionIds?: readonly string[];
  darkSectionIds?: readonly string[];
  sectionSurfaces?: readonly { id: string; surface: SectionSurface }[];
}) {
  return function useResolvedNavbarSurface(headerHeight: number): NavbarSurface {
    const [surface, setSurface] = useState<NavbarSurface>("hero-transparent");

    useEffect(() => {
      let frameId = 0;
      const probeOffset = 24;
      const probeY = headerHeight + probeOffset;

      const updateSurface = () => {
        frameId = 0;
        const forcedAnchorSurface =
          document.documentElement.getAttribute(SITE_ANCHOR_NAVBAR_SURFACE_ATTR) as NavbarSurface | null;
        if (forcedAnchorSurface) {
          setSurface(forcedAnchorSurface);
          return;
        }

        const absoluteProbeY = window.scrollY + probeY;
        const edgeSurface = detectSurfaceAcrossHeaderEdge(headerHeight);

        const firstScreen = document.getElementById("first-screen-section");
        if (firstScreen) {
          const firstScreenRect = firstScreen.getBoundingClientRect();
          if (firstScreenRect.top <= 0 && firstScreenRect.bottom > probeY) {
            setSurface(window.scrollY <= 12 ? "hero-transparent" : "dark-surface");
            return;
          }
        }

        const sectionSurface = options?.sectionSurfaces?.find(({ id }) =>
          isAbsoluteLineInsideSection(id, absoluteProbeY),
        );
        if (sectionSurface) {
          if (sectionSurface.surface === "light-surface" && shouldHoldDarkForRoundedLightSection(sectionSurface.id)) {
            setSurface("dark-surface");
            return;
          }

          setSurface(
            sectionSurface.surface === "hero-section"
              ? window.scrollY <= 12
                ? "hero-transparent"
                : "dark-surface"
              : sectionSurface.surface,
          );
          return;
        }

        if (options?.darkSectionIds?.some((sectionId) => isViewportLineInsideSection(sectionId, probeY))) {
          setSurface("dark-surface");
          return;
        }

        if (options?.lightSectionIds?.some((sectionId) => isViewportLineInsideSection(sectionId, probeY))) {
          setSurface("light-surface");
          return;
        }

        setSurface(edgeSurface ?? detectSurfaceBelowHeader(probeY));
      };

      const scheduleUpdate = () => {
        if (frameId !== 0) return;
        frameId = window.requestAnimationFrame(updateSurface);
      };

      const handleAnchorNavigationComplete = () => {
        if (frameId !== 0) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        updateSurface();
      };

      updateSurface();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      window.addEventListener("orientationchange", scheduleUpdate);
      window.addEventListener(SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT, handleAnchorNavigationComplete);

      return () => {
        if (frameId !== 0) {
          window.cancelAnimationFrame(frameId);
        }
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        window.removeEventListener("orientationchange", scheduleUpdate);
        window.removeEventListener(SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT, handleAnchorNavigationComplete);
      };
    }, [headerHeight]);

    return surface;
  };
}

export const useNavbarSurface = createNavbarSurfaceHook({
  sectionSurfaces: DESKTOP_SURFACE_SECTIONS,
});
