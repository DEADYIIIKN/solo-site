"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Высота зоны pin-скролла (vh): длина «лока» документного скролла под анимацию.
 * 220 ≈2.2 экрана: все 5 карточек проходят быстрее и равномерно,
 * без ощущения, что последняя «дотягивается» отдельным длинным скроллом.
 */
export const PHILOSOPHY_PIN_SCROLL_VH = 220;

const CARD_COUNT = 5;

/**
 * Глобальный прогресс скролла (0…1) режем на CARD_COUNT отрезков: карточка i
 * двигается только на i-м отрезке, затем остаётся в финале.
 *
 * Линейно по отрезку: ease-out давал малую d(progress)/d(scroll) у конца сегмента — при скролле
 * вверх казалось «липким» и затем резко догоняло (рывок). Вниз и вверх симметричны.
 */
export function philosophyCardStackLocalT(globalProgress: number, cardIndex: number): number {
  const g = Math.min(1, Math.max(0, globalProgress));
  const start = cardIndex / CARD_COUNT;
  const end = (cardIndex + 1) / CARD_COUNT;
  if (g <= start) return 0;
  if (g >= end) return 1;
  return (g - start) / (end - start);
}

/**
 * Scroll-linked вертикальный сдвиг карточки без fade:
 * карточка стартует из своей pre-stack позиции и линейно доезжает в финальную точку
 * только на своём сегменте pin-скролла.
 */
export function philosophyCardEnterTranslateY(
  globalProgress: number,
  cardIndex: number,
  initialOffsetY: number,
): number {
  return (1 - philosophyCardStackLocalT(globalProgress, cardIndex)) * initialOffsetY;
}

export type PhilosophyPinPhase = "before" | "active" | "after" | "static";

/**
 * Интерактивный pin для секции 1440: на практике нужен не только при `matchMedia(1440)`.
 * — Окна 1024–1439: pin при ширине ≥1024 (см. tick); 1280–1439: типичные ноутбуки без matchMedia 1440.
 * — Окно ~1440 с вертикальным скроллбаром: учитываем max(inner, client, visualViewport).
 */
export function philosophyPinViewportAllowsScrollPin(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(min-width: 1440px)").matches) return true;
  const iw = window.innerWidth;
  const cw = document.documentElement.clientWidth;
  const vv = window.visualViewport?.width;
  const w = Math.max(iw, cw, vv ?? 0);
  if (w >= 1024) return true;
  return (iw >= 1320 && iw < 1440) || (cw >= 1320 && cw < 1440);
}

/** Диапазон document scrollY, в котором растёт progress (как в `tick`) */
export function getPhilosophyPinScrollRange(pinEl: HTMLElement): { start: number; end: number } {
  const rect = pinEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  const elTop = scrollY + rect.top;
  const h = pinEl.offsetHeight;
  const vh = window.innerHeight;
  /* Целые px — меньше рассинхрона границы active/after и wheel-clamp */
  const start = Math.round(elTop);
  const baseSpan = Math.max(0, h - vh);
  const maxSpanPx = (PHILOSOPHY_PIN_SCROLL_VH / 100) * vh;
  const span = Math.min(baseSpan, maxSpanPx);
  const end = Math.round(start + span);
  return { start, end };
}

/**
 * Прогресс 0→1 только пока скроллим «высоту» pin-блока (макет 1440).
 * `pinPhase`: `active` — кадр через `position:fixed` к viewport.
 * Анимация и pin только если {@link philosophyPinViewportAllowsScrollPin}; иначе — `prefers-reduced-motion` или
 * узкий viewport: `progress` 1 и фаза `static` (финальная стопка без скролл-анимации).
 */
export function usePhilosophyPinScrollProgress(pinElement: HTMLElement | null) {
  const [progress, setProgress] = useState(0);
  /** Начало «before», не «static»: static в паре с progress 1 = финальная стопка; до первого tick путаницы меньше */
  const [pinPhase, setPinPhase] = useState<PhilosophyPinPhase>("before");
  const lastProgressRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<PhilosophyPinPhase>("before");

  useLayoutEffect(() => {
    if (!pinElement) return;

    let alive = true;
    let tickRafId = 0;
    let tickCoalesced = false;
    let rangeStart = 0;
    let rangeEnd = 0;
    let rangeReady = false;

    const applyProgress = (next: number) => {
      const prev = lastProgressRef.current;
      /* Порог мельче — меньше «ступенек» при скролле; без лишних setState при совпадении */
      if (prev !== null && Math.abs(prev - next) < 1e-5) return;
      lastProgressRef.current = next;
      setProgress(next);
    };

    const setPhase = (next: PhilosophyPinPhase) => {
      if (lastPhaseRef.current === next) return;
      lastPhaseRef.current = next;
      setPinPhase(next);
    };

    const recalculateRange = () => {
      if (!alive) return;
      if (pinElement.offsetHeight < 2) return;
      const { start, end } = getPhilosophyPinScrollRange(pinElement);
      rangeStart = start;
      rangeEnd = end;
      rangeReady = true;
    };

    const tick = () => {
      if (!alive) return;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !philosophyPinViewportAllowsScrollPin()
      ) {
        applyProgress(1);
        setPhase("static");
        return;
      }

      const el = pinElement;
      const scrollY = window.scrollY;
      if (el.offsetHeight < 2) return;

      if (!rangeReady) {
        recalculateRange();
      }

      const start = rangeStart;
      const end = rangeEnd;

      if (end <= start + 1) {
        applyProgress(1);
        setPhase(scrollY > end ? "after" : "before");
        return;
      }

      const nextPhase: PhilosophyPinPhase =
        scrollY < start ? "before" : scrollY > end ? "after" : "active";
      setPhase(nextPhase);

      /* Линейный 0…1 по документному скроллу. Карточки по сегментам — линейно (см. philosophyCardStackLocalT). */
      const rawLinear = (scrollY - start) / (end - start);
      applyProgress(Math.min(1, Math.max(0, rawLinear)));
    };

    /** Один tick на кадр: иначе ResizeObserver + cancelAnimationFrame «голодали» RAF в dev */
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
    vv?.addEventListener("resize", scheduleTick, { passive: true });
    /* Один scheduleTick на кадр при resize layout — без лавины вызовов от RO */
    let roRaf = false;
    const ro = new ResizeObserver(() => {
      if (roRaf) return;
      roRaf = true;
      requestAnimationFrame(() => {
        roRaf = false;
        recalculateRange();
        scheduleTick();
      });
    });
    ro.observe(pinElement);

    recalculateRange();

    return () => {
      alive = false;
      tickCoalesced = false;
      cancelAnimationFrame(tickRafId);
      window.removeEventListener("scroll", scheduleTick);
      window.removeEventListener("resize", scheduleTick);
      vv?.removeEventListener("resize", scheduleTick);
      ro.disconnect();
      lastProgressRef.current = null;
      lastPhaseRef.current = "before";
    };
  }, [pinElement]);

  return { progress, pinPhase };
}
