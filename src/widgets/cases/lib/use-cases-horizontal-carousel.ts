"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CASES_SCROLL_EDGE_EPS_PX = 2;

/**
 * Горизонтальная карусель карточек «Кейсы»: шаг = ширина карточки + зазор (как 1024/1440).
 */
export function useCasesHorizontalCarousel(cardWidthPx: number, gapPx: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const stepPx = cardWidthPx + gapPx;

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { clientWidth, scrollWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    const x = el.scrollLeft;
    const atStart = x <= CASES_SCROLL_EDGE_EPS_PX;
    const atEnd = maxScroll <= CASES_SCROLL_EDGE_EPS_PX || x >= maxScroll - CASES_SCROLL_EDGE_EPS_PX;
    setPrevDisabled(atStart);
    setNextDisabled(atEnd);
  }, []);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    const ro = new ResizeObserver(() => {
      sync();
    });
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      ro.disconnect();
    };
  }, [sync]);

  const onPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = el.scrollLeft;
    setNextDisabled(false);
    if (x - stepPx <= CASES_SCROLL_EDGE_EPS_PX) {
      setPrevDisabled(true);
    }
    el.scrollBy({ left: -stepPx, behavior: "smooth" });
  }, [stepPx]);

  const onNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const x = el.scrollLeft;
    setPrevDisabled(false);
    if (x + stepPx >= maxScroll - CASES_SCROLL_EDGE_EPS_PX) {
      setNextDisabled(true);
    }
    el.scrollBy({ left: stepPx, behavior: "smooth" });
  }, [stepPx]);

  return { nextDisabled, onNext, onPrev, prevDisabled, scrollRef };
}
