"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Верхний предел длины сегмента скролла (px) вместе с {@link SERVICES_CARD_ANIM_SCROLL_PX}. */
export const SERVICES_PIN_SCROLL_VH = 200;

export type ServicesPinViewport = "1440" | "1024";

/**
 * Длина документного скролла (px), на котором анимация карточки 02 идёт 0→1.
 */
export const SERVICES_CARD_ANIM_SCROLL_PX: Record<ServicesPinViewport, number> = {
  /** Короче трек = меньше документного span при той же высоте pin (см. services-section-* pinTotalPx). */
  "1440": 480,
  "1024": 420,
};

const SITE_ANCHOR_NAVIGATION_ATTR = "data-site-anchor-navigation";

function isAnchorNavigationActive() {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute(SITE_ANCHOR_NAVIGATION_ATTR);
}

export function servicesPinViewportAllowsPin(viewport: ServicesPinViewport = "1440"): boolean {
  if (typeof window === "undefined") return false;
  if (viewport === "1024") {
    return (
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(min-width: 1440px)").matches
    );
  }
  if (window.matchMedia("(min-width: 1440px)").matches) return true;
  const iw = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  const vv = window.visualViewport?.width;
  return Math.max(iw, cw, vv ?? 0) >= 1440;
}

/** Совпадает с `hidden`/`min-[…]:block` у ServicesSection1024 / 1440 — не крутить pin у скрытой вёрстки. */
export function isServicesLayoutActiveForPin(viewport: ServicesPinViewport): boolean {
  if (typeof window === "undefined") return false;
  if (viewport === "1440") {
    return window.matchMedia("(min-width: 1440px)").matches;
  }
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(min-width: 1440px)").matches
  );
}

/**
 * Диапазон window.scrollY, в котором растёт прогресс (как {@link getPhilosophyPinScrollRange}):
 * физическая длина скролла по pin = `offsetHeight - vh`, плюс потолок vh и длина анимации карточки.
 */
export function getServicesPinScrollRange(
  pinEl: HTMLElement,
  viewport: ServicesPinViewport = "1440",
): { start: number; end: number; span: number } {
  const rect = pinEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  const elTop = scrollY + rect.top;
  const vh = window.innerHeight;
  const h = pinEl.offsetHeight;
  const start = Math.round(elTop);
  const baseSpan = Math.max(0, h - vh);
  const maxSpanPx = (SERVICES_PIN_SCROLL_VH / 100) * vh;
  const span = Math.min(baseSpan, maxSpanPx, SERVICES_CARD_ANIM_SCROLL_PX[viewport]);
  const end = Math.round(start + span);
  return { start, end, span };
}

/** Прогресс 0→1 сближения карточек по документному скроллу (1 = карточка 02 «прилипла» к финишу, как в Figma 783:9139). */
export function getServicesPinStickProgress(
  scrollY: number,
  pinEl: HTMLElement,
  viewport: ServicesPinViewport,
): number {
  const { start, end } = getServicesPinScrollRange(pinEl, viewport);
  const span = end - start;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (scrollY - start) / span));
}

/** Допуск: разблокировка скролла вниз только при полном прилипании (референс — конец анимации). */
const SERVICES_PIN_STICK_COMPLETE = 1 - 1e-3;

export function isServicesPinStickComplete(
  scrollY: number,
  pinEl: HTMLElement,
  viewport: ServicesPinViewport,
): boolean {
  const { start, end } = getServicesPinScrollRange(pinEl, viewport);
  if (end <= start + 1) return true;
  const p = getServicesPinStickProgress(scrollY, pinEl, viewport);
  if (p >= SERVICES_PIN_STICK_COMPLETE) return true;
  /* На случай рассинхрона округления start/end и scrollY */
  return scrollY >= end - 1;
}

/**
 * Разблокировать нативный скролл только после прохождения полного отрезка анимации по документу.
 * Источник истины — математика scrollY, не React-атрибут (иначе гонка кадра с transform).
 */
function isServicesPinScrollUnlocked(
  scrollY: number,
  pinEl: HTMLElement,
  viewport: ServicesPinViewport,
): boolean {
  const { start, end } = getServicesPinScrollRange(pinEl, viewport);
  if (end <= start + 1) return true;
  return scrollY >= end;
}

export type ServicesPinPhase = "before" | "active" | "after" | "static";

/**
 * Wheel + scroll: инерция трекпада двигает документ без повторных `wheel` — по `scroll` откатываем
 * «перелёт» за `end`, если предыдущая позиция ещё не прошла весь отрезок анимации.
 * См. {@link useServicesPinScrollProgress}.
 */
export function useServicesPinWheelClamp(
  pinElement: HTMLElement | null,
  viewport: ServicesPinViewport = "1440",
) {
  useLayoutEffect(() => {
    if (!pinElement) return;

    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (!isServicesLayoutActiveForPin(viewport)) {
        lastY = y;
        return;
      }
      if (isAnchorNavigationActive()) {
        lastY = y;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lastY = y;
        return;
      }
      if (!servicesPinViewportAllowsPin(viewport)) {
        lastY = y;
        return;
      }

      const { start, end } = getServicesPinScrollRange(pinElement, viewport);
      const span = end - start;
      if (span <= 1) {
        lastY = y;
        return;
      }

      const prevClamped = Math.min(Math.max(lastY, start), end);
      const prevP = (prevClamped - start) / span;

      if (y > end && prevP < SERVICES_PIN_STICK_COMPLETE) {
        window.scrollTo({ top: end, left: 0, behavior: "auto" });
        lastY = end;
        pinElement.setAttribute("data-services-slide-progress", "1.0000");
        return;
      }

      lastY = y;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isServicesLayoutActiveForPin(viewport)) return;
      if (isAnchorNavigationActive()) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!servicesPinViewportAllowsPin(viewport)) return;

      const { start, end } = getServicesPinScrollRange(pinElement, viewport);
      if (end <= start + 1) return;

      const y = window.scrollY;
      const dy = e.deltaY;
      const tentative = y + dy;

      if (isServicesPinScrollUnlocked(y, pinElement, viewport)) {
        return;
      }

      /* Вверх: выход из зоны пина — браузер */
      if (dy < 0 && tentative < start) {
        return;
      }

      /* Ещё до секции сверху */
      if (y < start && tentative < start) {
        return;
      }

      /* До прилипания перехватываем жест и крутим только документ в пределах анимации */
      e.preventDefault();
      const next = Math.min(end, Math.max(start, tentative));
      window.scrollTo({ top: next, left: 0, behavior: "auto" });
      const span = end - start;
      if (span > 0) {
        const p = Math.min(1, Math.max(0, (next - start) / span));
        pinElement.setAttribute("data-services-slide-progress", p.toFixed(4));
      }
    };

    const isEditableTarget = (n: EventTarget | null) => {
      if (!(n instanceof HTMLElement)) return false;
      const tag = n.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (n.isContentEditable) return true;
      return Boolean(n.closest("[contenteditable='true']"));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || isEditableTarget(e.target)) return;
      if (e.key === " " && e.target instanceof HTMLElement) {
        if (e.target.closest("button, a[href], [role='button']")) return;
      }
      if (e.key !== " " && e.key !== "PageDown" && e.key !== "ArrowDown") return;
      if (!isServicesLayoutActiveForPin(viewport)) return;
      if (isAnchorNavigationActive()) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!servicesPinViewportAllowsPin(viewport)) return;

      const { start, end } = getServicesPinScrollRange(pinElement, viewport);
      if (end <= start + 1) return;

      const y = window.scrollY;
      if (isServicesPinScrollUnlocked(y, pinElement, viewport)) return;

      const step =
        e.key === "PageDown"
          ? Math.max(120, Math.round(window.innerHeight * 0.85))
          : e.key === " "
            ? Math.max(120, Math.round(window.innerHeight * 0.85))
            : 80;
      const tentative = y + step;

      if (y < start && tentative < start) return;
      if (tentative < start) return;

      e.preventDefault();
      const next = Math.min(end, Math.max(start, tentative));
      window.scrollTo({ top: next, left: 0, behavior: "auto" });
      const span = end - start;
      if (span > 0) {
        const p = Math.min(1, Math.max(0, (next - start) / span));
        pinElement.setAttribute("data-services-slide-progress", p.toFixed(4));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pinElement, viewport]);
}

/**
 * Прогресс 0→1 от документного скролла; совместно с {@link useServicesPinWheelClamp}.
 */
export function useServicesPinScrollProgress(
  pinElement: HTMLElement | null,
  viewport: ServicesPinViewport = "1440",
) {
  const [pinPhase, setPinPhase] = useState<ServicesPinPhase>("before");
  const [slideProgress, setSlideProgress] = useState(0);
  const lastPhaseRef = useRef<ServicesPinPhase>("before");

  useLayoutEffect(() => {
    if (!pinElement) return;

    pinElement.setAttribute("data-services-slide-progress", "0.0000");

    let alive = true;
    let tickRafId = 0;
    let tickCoalesced = false;
    let lastProgressWritten = -1;

    const setPhase = (next: ServicesPinPhase) => {
      if (lastPhaseRef.current === next) return;
      lastPhaseRef.current = next;
      setPinPhase(next);
    };

    const applyProgress = (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      if (Math.abs(clamped - lastProgressWritten) < 1e-5) return;
      lastProgressWritten = clamped;
      setSlideProgress(clamped);
      pinElement.setAttribute("data-services-slide-progress", clamped.toFixed(4));
    };

    const tick = () => {
      if (!alive) return;

      if (!isServicesLayoutActiveForPin(viewport)) {
        return;
      }

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !servicesPinViewportAllowsPin(viewport)
      ) {
        applyProgress(1);
        setPhase("static");
        return;
      }

      const el = pinElement;
      const scrollY = window.scrollY;
      if (el.offsetHeight < 2) {
        applyProgress(0);
        return;
      }

      const { start, end } = getServicesPinScrollRange(el, viewport);

      if (end <= start + 1) {
        applyProgress(1);
        setPhase(scrollY > end ? "after" : "before");
        return;
      }

      const nextPhase: ServicesPinPhase =
        scrollY < start ? "before" : scrollY > end ? "after" : "active";
      setPhase(nextPhase);

      const rawLinear = (scrollY - start) / (end - start);
      applyProgress(rawLinear);
    };

    const scheduleTick = () => {
      if (tickCoalesced) return;
      tickCoalesced = true;
      tickRafId = requestAnimationFrame(() => {
        tickCoalesced = false;
        tick();
      });
    };

    tick();
    requestAnimationFrame(() => {
      requestAnimationFrame(tick);
    });

    window.addEventListener("scroll", scheduleTick, { passive: true });
    window.addEventListener("resize", scheduleTick, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", scheduleTick, { passive: true });
    vv?.addEventListener("resize", scheduleTick, { passive: true });

    let roRaf = false;
    const ro = new ResizeObserver(() => {
      if (roRaf) return;
      roRaf = true;
      requestAnimationFrame(() => {
        roRaf = false;
        scheduleTick();
      });
    });
    ro.observe(pinElement);

    return () => {
      alive = false;
      tickCoalesced = false;
      cancelAnimationFrame(tickRafId);
      pinElement.removeAttribute("data-services-slide-progress");
      window.removeEventListener("scroll", scheduleTick);
      window.removeEventListener("resize", scheduleTick);
      vv?.removeEventListener("scroll", scheduleTick);
      vv?.removeEventListener("resize", scheduleTick);
      ro.disconnect();
      lastPhaseRef.current = "before";
    };
  }, [pinElement, viewport]);

  return { pinPhase, slideProgress };
}
