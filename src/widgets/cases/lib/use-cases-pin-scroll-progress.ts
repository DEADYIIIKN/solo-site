"use client";

import { useMotionValue, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Высота pin-зоны (vh): больше значение — дольше и мягче проход по переходу при том же жесте скролла.
 */
export const CASES_PIN_SCROLL_VH = 125;

/**
 * Доля скролла внутри pin, пока collapse = 0: вертикальный слайдер + разделитель + «Рекламные кейсы»
 * уже видны; дальше скролл увеличивает {@link CasesPinCollapseProgress} → сворачивается вертикаль, открывается реклама.
 */
export const CASES_PIN_HOLD_END_FRAC = 0.18;

/** Perlin-style smoother step — мягче, чем linear ramp, для скролл-анимаций. */
function smootherstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function ramp(t: number, a: number, b: number): number {
  if (b <= a) return t >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (t - a) / (b - a)));
}

export type CasesPinWeights = {
  /** Видимость полосы вертикального карусели (0…1) */
  vertStrip: number;
  /** Стрелки у вертикального блока */
  vertArrows: number;
  /** Разделительная линия */
  divider: number;
  /** Заголовок «Рекламные кейсы» (стрелки — отдельно, см. adArrows) */
  adHeader: number;
  /** Горизонтальная лента рекламных карточек (позже в таймлайне) */
  adStrip: number;
  /** Стрелки рекламного слайдера — только когда видна горизонтальная лента */
  adArrows: number;
};

/** 0 = «как при первом показе секции»; 1 = вертикаль убрана, рекламная лента раскрыта. */
export type CasesPinCollapseProgress = number;

/**
 * collapse 0: вертикальный слайдер, линия и блок «Рекламные кейсы» сразу в полной видимости (без «раскрытия»).
 * Рост collapse: вертикаль и рекламная лента **перекрываются по времени**, без «пустого» зазора под заголовком.
 */
export function getCasesPinWeights(collapseProgress: CasesPinCollapseProgress): CasesPinWeights {
  const c = Math.min(1, Math.max(0, collapseProgress));

  /* Короче проход по пину: vertical уходит раньше, advertising раскрывается быстрее. */
  const vertGone = smootherstep01(ramp(c, 0.04, 0.5));
  const vertStrip = 1 - vertGone;
  const vertArrows = vertStrip;

  const divider = 1;
  const adHeader = 1;

  const adStrip = smootherstep01(ramp(c, 0.01, 0.42));
  const adArrows = adStrip;

  return {
    vertStrip,
    vertArrows,
    divider,
    adHeader,
    adStrip,
    adArrows,
  };
}

/** Pin-scroll только там, где смонтированы 1024/1440 (не на мобильных ветках 360–768). */
export function casesPinViewportAllowsPin(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function getCasesPinScrollRange(pinEl: HTMLElement): { start: number; end: number } {
  const rect = pinEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  const elTop = scrollY + rect.top;
  const h = pinEl.offsetHeight;
  const vh = window.innerHeight;
  const start = Math.round(elTop);
  const baseSpan = Math.max(0, h - vh);
  const maxSpanPx = (CASES_PIN_SCROLL_VH / 100) * vh;
  const span = Math.min(baseSpan, maxSpanPx);
  const end = Math.round(start + span);
  return { start, end };
}

export type CasesPinPhase = "before" | "active" | "after" | "static";

/** t ∈ [0,1] — позиция скролла внутри pin: до {@link CASES_PIN_HOLD_END_FRAC} collapse = 0, затем 0→1 по smootherstep. */
export function computeCasesPinCollapseProgress(t: number): CasesPinCollapseProgress {
  const x = Math.min(1, Math.max(0, t));
  const tHoldEnd = CASES_PIN_HOLD_END_FRAC;
  if (x <= tHoldEnd) return 0;
  const denom = 1 - tHoldEnd;
  const k = denom > 0 ? (x - tHoldEnd) / denom : 1;
  return smootherstep01(Math.min(1, Math.max(0, k)));
}

/**
 * Safari-parity (D-07 motion-value drop-in): `collapseProgress` возвращается как `MotionValue<number>`,
 * а не React state. Pin-зона получает десятки обновлений в секунду при скролле; React setState на каждом кадре
 * заставляет Safari'овский JS-event-loop ре-рендерить всё поддерево потребителя (карусели, заголовки,
 * вся секция), и анимация «заедает». MotionValue обновляется через rAF и пишет в DOM напрямую без React
 * re-render — так же как Chrome compositor вытягивает плавность сам.
 *
 * `pinPhase` остаётся React state: смена фазы — дискретное событие (3–4 раза за сессию), ре-рендер тут уместен.
 */
export function useCasesPinScrollProgress(pinElement: HTMLElement | null): {
  collapseProgress: MotionValue<number>;
  pinPhase: CasesPinPhase;
} {
  const collapseProgress = useMotionValue(0);
  const [pinPhase, setPinPhase] = useState<CasesPinPhase>("before");
  const lastPhaseRef = useRef<CasesPinPhase>("before");

  useLayoutEffect(() => {
    if (!pinElement) return;

    let alive = true;
    let tickRafId = 0;
    let tickCoalesced = false;
    let rangeStart = 0;
    let rangeEnd = 0;
    let rangeReady = false;

    const setPhase = (next: CasesPinPhase) => {
      if (lastPhaseRef.current === next) return;
      lastPhaseRef.current = next;
      setPinPhase(next);
    };

    const applyProgress = (next: number) => {
      /* MotionValue.set внутренне deduplицирует одинаковые значения; не нужен эпсилон-фильтр как раньше. */
      collapseProgress.set(next);
    };

    const applySnap = (target: number) => {
      applyProgress(target);
    };

    const recalculateRange = () => {
      if (!alive) return;
      if (pinElement.offsetHeight < 2) return;

      const { start, end } = getCasesPinScrollRange(pinElement);
      rangeStart = start;
      rangeEnd = end;
      rangeReady = true;
    };

    const tick = () => {
      if (!alive) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !casesPinViewportAllowsPin()) {
        setPhase("static");
        applySnap(1);
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
        const after = scrollY > end;
        setPhase(after ? "after" : "before");
        applySnap(after ? 1 : 0);
        return;
      }

      if (scrollY < start) {
        setPhase("before");
        applySnap(0);
        return;
      }
      if (scrollY > end) {
        setPhase("after");
        applySnap(1);
        return;
      }

      setPhase("active");
      const span = Math.max(1, end - start);
      const t = (scrollY - start) / span;
      applyProgress(computeCasesPinCollapseProgress(t));
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
    vv?.addEventListener("resize", scheduleTick, { passive: true });

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
      lastPhaseRef.current = "before";
    };
  }, [pinElement, collapseProgress]);

  return { collapseProgress, pinPhase };
}
