"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type SiteNavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
const SITE_ANCHOR_NAVIGATION_ATTR = "data-site-anchor-navigation";
const SITE_ANCHOR_NAVBAR_SURFACE_ATTR = "data-site-anchor-navbar-surface";
const SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT = "site-anchor-navigation-complete";
const ANCHOR_NAVIGATION_FALLBACK_MS = 5000;
const ANCHOR_NAVIGATION_POLL_MS = 50;
const ANCHOR_ALIGNMENT_TOLERANCE_PX = 16;
const ANCHOR_STABLE_POLLS_REQUIRED = 2;
const FOOTER_REALIGN_STABLE_POLLS_REQUIRED = 2;

type NavbarSurface = "dark-surface" | "light-surface";
const INITIAL_HASH_NAVBAR_SURFACES: Partial<Record<string, NavbarSurface>> = {
  "#what-we-do-section": "light-surface",
  "#philosophy-section": "light-surface",
  "#lead-form-section": "light-surface",
  "#showreel-section": "dark-surface",
  "#cases-section": "dark-surface",
  "#services-section": "dark-surface",
  "#footer-section": "light-surface",
};
const FINAL_HASH_TARGET_SURFACES: Partial<Record<string, NavbarSurface>> = {
  "#what-we-do-section": "light-surface",
  "#philosophy-section": "light-surface",
  "#lead-form-section": "light-surface",
  "#showreel-section": "dark-surface",
  "#cases-section": "dark-surface",
  "#services-section": "dark-surface",
  "#footer-section": "light-surface",
};

let pendingAnchorCleanupTimer: number | null = null;
let removeForcedSurfaceReleaseListeners: (() => void) | null = null;

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getHeaderOffset() {
  if (typeof window === "undefined") return 0;

  if (window.innerWidth >= 1440) return 82;
  if (window.innerWidth >= 1024) return 72;
  if (window.innerWidth >= 768) return 64;
  if (window.innerWidth >= 480) return 60;

  return 56;
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clearPendingAnchorNavigationEffects() {
  if (pendingAnchorCleanupTimer != null) {
    window.clearTimeout(pendingAnchorCleanupTimer);
    pendingAnchorCleanupTimer = null;
  }

  removeForcedSurfaceReleaseListeners?.();
  removeForcedSurfaceReleaseListeners = null;
}

function setForcedAnchorNavbarSurface(surface: NavbarSurface | null) {
  if (typeof document === "undefined") return;

  if (surface) {
    document.documentElement.setAttribute(SITE_ANCHOR_NAVBAR_SURFACE_ATTR, surface);
    return;
  }

  document.documentElement.removeAttribute(SITE_ANCHOR_NAVBAR_SURFACE_ATTR);
}

function setAnchorNavigationActive(active: boolean, initialSurface: NavbarSurface | null = "dark-surface") {
  if (typeof document === "undefined") return;

  if (active) {
    document.documentElement.setAttribute(SITE_ANCHOR_NAVIGATION_ATTR, "true");
    setForcedAnchorNavbarSurface(initialSurface);
    return;
  }

  document.documentElement.removeAttribute(SITE_ANCHOR_NAVIGATION_ATTR);
}

function scheduleForcedSurfaceReleaseOnInteraction() {
  if (typeof window === "undefined") return;

  removeForcedSurfaceReleaseListeners?.();

  const release = () => {
    removeForcedSurfaceReleaseListeners?.();
    removeForcedSurfaceReleaseListeners = null;
    setForcedAnchorNavbarSurface(null);
    window.dispatchEvent(new CustomEvent(SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT));
  };

  const onInteraction = () => {
    release();
  };

  window.addEventListener("wheel", onInteraction, { once: true, passive: true });
  window.addEventListener("touchmove", onInteraction, { once: true, passive: true });
  window.addEventListener("keydown", onInteraction, { once: true });
  window.addEventListener("pointerdown", onInteraction, { once: true, passive: true });

  removeForcedSurfaceReleaseListeners = () => {
    window.removeEventListener("wheel", onInteraction);
    window.removeEventListener("touchmove", onInteraction);
    window.removeEventListener("keydown", onInteraction);
    window.removeEventListener("pointerdown", onInteraction);
  };
}

function scheduleAnchorNavigationCleanup(hash: string) {
  if (typeof window === "undefined") return;

  if (pendingAnchorCleanupTimer != null) {
    window.clearTimeout(pendingAnchorCleanupTimer);
  }

  const startedAt = window.performance.now();
  let alignedPolls = 0;
  let stablePolls = 0;
  let lastScrollY = window.scrollY;
  let footerRealignAttempted = false;

  const finalize = () => {
    const finalSurface = FINAL_HASH_TARGET_SURFACES[hash] ?? null;
    clearPendingAnchorNavigationEffects();
    setAnchorNavigationActive(false);
    setForcedAnchorNavbarSurface(finalSurface);
    if (finalSurface) {
      scheduleForcedSurfaceReleaseOnInteraction();
    }
    window.dispatchEvent(new CustomEvent(SITE_ANCHOR_NAVIGATION_COMPLETE_EVENT));
  };

  const tick = () => {
    pendingAnchorCleanupTimer = null;

    const target = resolveHashTarget(hash);
    const headerOffset = getHeaderOffset();
    const targetTop = target?.getBoundingClientRect().top ?? null;
    const isAligned =
      targetTop != null && Math.abs(targetTop - headerOffset) <= ANCHOR_ALIGNMENT_TOLERANCE_PX;

    if (
      hash === "#footer-section" &&
      targetTop != null &&
      targetTop <= headerOffset + ANCHOR_ALIGNMENT_TOLERANCE_PX
    ) {
      setForcedAnchorNavbarSurface("light-surface");
    }

    if (isAligned) {
      alignedPolls += 1;
    } else {
      alignedPolls = 0;
    }

    const scrollDelta = Math.abs(window.scrollY - lastScrollY);
    if (scrollDelta <= 2) {
      stablePolls += 1;
    } else {
      stablePolls = 0;
    }
    lastScrollY = window.scrollY;

    if (
      hash === "#footer-section" &&
      !footerRealignAttempted &&
      !isAligned &&
      stablePolls >= FOOTER_REALIGN_STABLE_POLLS_REQUIRED
    ) {
      footerRealignAttempted = true;
      alignHashTarget(hash);
    }

    if (isAligned && stablePolls >= ANCHOR_STABLE_POLLS_REQUIRED && alignedPolls >= ANCHOR_STABLE_POLLS_REQUIRED) {
      finalize();
      return;
    }

    if (window.performance.now() - startedAt >= ANCHOR_NAVIGATION_FALLBACK_MS) {
      finalize();
      return;
    }

    pendingAnchorCleanupTimer = window.setTimeout(tick, ANCHOR_NAVIGATION_POLL_MS);
  };

  pendingAnchorCleanupTimer = window.setTimeout(tick, ANCHOR_NAVIGATION_POLL_MS);
}

function resolveHashTarget(hash: string) {
  const targetId = decodeURIComponent(hash.slice(1));

  if (targetId === "footer-section") {
    const visibleFooter = Array.from(document.querySelectorAll<HTMLElement>('[id^="footer-"]')).find((element) => {
      if (element.id === "footer-section") return false;
      return window.getComputedStyle(element).display !== "none";
    });

    if (visibleFooter) return visibleFooter;
  }

  return document.getElementById(targetId);
}

function alignHashTarget(hash: string) {
  const target = resolveHashTarget(hash);
  if (!target) return;

  const targetTop = target.getBoundingClientRect().top;
  const headerOffset = getHeaderOffset();

  if (Math.abs(targetTop - headerOffset) <= ANCHOR_ALIGNMENT_TOLERANCE_PX) return;

  const absoluteTop = window.scrollY + targetTop;
  window.scrollTo({
    top: Math.max(0, absoluteTop - headerOffset),
    behavior: "auto",
  });
}

function scrollToHashTarget(hash: string) {
  if (typeof window === "undefined" || !hash.startsWith("#")) return false;

  const target = resolveHashTarget(hash);

  if (!target) return false;

  const absoluteTop = window.scrollY + target.getBoundingClientRect().top;
  const nextTop = Math.max(0, absoluteTop - getHeaderOffset());
  const initialSurface = INITIAL_HASH_NAVBAR_SURFACES[hash] ?? "dark-surface";

  clearPendingAnchorNavigationEffects();
  setAnchorNavigationActive(true, initialSurface);
  window.history.pushState(null, "", hash);
  window.scrollTo({
    top: nextTop,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  scheduleAnchorNavigationCleanup(hash);

  return true;
}

export function SiteNavLink({ href, onClick, ...props }: SiteNavLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      !href ||
      !href.startsWith("#") ||
      isModifiedEvent(event) ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (!scrollToHashTarget(href)) {
      window.location.hash = href;
    }
  }

  return <a {...props} href={href} onClick={handleClick} />;
}
