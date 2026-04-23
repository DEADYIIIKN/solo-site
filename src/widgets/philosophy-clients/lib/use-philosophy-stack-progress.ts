"use client";

import { useMotionValue, type MotionValue } from "motion/react";
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
 *
 * Safari-parity (D-07 motion-value drop-in): `progress` — `MotionValue<number>`, не React state.
 * Иначе каждый кадр скролла = setState = полный ре-рендер поддерева потребителя, Safari'овский
 * event loop не справляется (в отличие от Chrome compositor), и все 5 карточек + ленты под ними
 * дергаются. MotionValue обновляется через rAF и пишется в DOM (transform) напрямую.
 *
 * `pinPhase`: `active` — слой через `position:sticky`. Смена фазы — дискретное событие, остаётся React state.
 * Если `prefers-reduced-motion` или узкий viewport: `progress` 1 и фаза `static` (финальная стопка).
 */
export function usePhilosophyPinScrollProgress(pinElement: HTMLElement | null): {
  progress: MotionValue<number>;
  pinPhase: PhilosophyPinPhase;
} {
  const progress = useMotionValue(0);
  /** Начало «before», не «static»: static в паре с progress 1 = финальная стопка; до первого tick путаницы меньше */
  const [pinPhase, setPinPhase] = useState<PhilosophyPinPhase>("before");
  const lastPhaseRef = useRef<PhilosophyPinPhase>("before");

  useLayoutEffect(() => {
    if (!pinElement) return;

    let alive = true;
    let rafId = 0;
    let rangeStart = 0;
    let rangeEnd = 0;
    let rangeReady = false;
    /**
     * Safari-parity: pin виден (грубо — ±1 экран). Continuous rAF, но tick делает работу
     * только когда pin в окрестности вьюпорта, чтобы не жечь CPU вне секции.
     */
    let nearViewport = true;

    const applyProgress = (next: number) => {
      progress.set(next);
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
      rafId = requestAnimationFrame(tick);

      if (!nearViewport) return;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !philosophyPinViewportAllowsScrollPin()
      ) {
        applyProgress(1);
        setPhase("static");
        return;
      }

      const el = pinElement;
      if (el.offsetHeight < 2) return;
      if (!rangeReady) recalculateRange();

      const scrollY = window.scrollY;
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

      const rawLinear = (scrollY - start) / (end - start);
      applyProgress(Math.min(1, Math.max(0, rawLinear)));
    };

    /**
     * Safari-parity (D-07 revision 2): читаем `window.scrollY` каждый кадр через continuous rAF,
     * не через `scroll`-event. Safari во время inertial/momentum-скролла батчит scroll-events
     * (иногда 1 событие на ~5 кадров), из-за чего MotionValue обновлялся рывками. Continuous rAF
     * читает сразу позицию композитора — tick всегда идёт в такт дисплея, плавность как в Chrome.
     * IntersectionObserver гейтит работу: вне окрестности pin rAF-loop крутится, но ничего не делает.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting;
      },
      { rootMargin: "200% 0px 200% 0px" },
    );
    io.observe(pinElement);

    let roRaf = false;
    const ro = new ResizeObserver(() => {
      if (roRaf) return;
      roRaf = true;
      requestAnimationFrame(() => {
        roRaf = false;
        recalculateRange();
      });
    });
    ro.observe(pinElement);

    const onResize = () => recalculateRange();
    window.addEventListener("resize", onResize, { passive: true });
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onResize, { passive: true });

    recalculateRange();
    rafId = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onResize);
      lastPhaseRef.current = "before";
    };
  }, [pinElement, progress]);

  return { progress, pinPhase };
}
