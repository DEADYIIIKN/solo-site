"use client";

import type { TransitionEvent } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";

import {
  type TgPopupVariant,
  tgPopupVariants,
} from "./tg-popup-variants";

export type TgPopupProps = {
  variant: TgPopupVariant;
  open: boolean;
  onDismiss: () => void;
  /**
   * URL TG-канала. Хост (10-03) подтягивает из NEXT_PUBLIC_TG_CHANNEL_URL и
   * передаёт сюда. Если URL пустой — host вообще не рендерит TgPopup.
   */
  ctaHref: string;
  /** Override default copy (по умолчанию — Figma локированный текст). */
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
};

const MODAL_TRANSITION_MS = 320;

function CloseIcon({ size }: { size: 24 | 28 | 30 | 34 }) {
  const sizeClass =
    size === 24
      ? "size-[24px]"
      : size === 28
        ? "size-[28px]"
        : size === 30
          ? "size-[30px]"
          : "size-[34px]";
  return (
    <svg
      aria-hidden
      className={cn(sizeClass, "shrink-0 text-white")}
      fill="none"
      viewBox="0 0 34 34"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 9l16 16M25 9L9 25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseButtonWrapperClass(size: 24 | 28 | 30 | 34) {
  return size === 24
    ? "size-[24px]"
    : size === 28
      ? "size-[28px]"
      : size === 30
        ? "size-[30px]"
        : "size-[34px]";
}

function TelegramIcon({ size }: { size: number }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      alt=""
      aria-hidden
      className="shrink-0"
      height={size}
      src="/assets/figma/tg-popup/tg-icon.svg"
      style={{ maxWidth: "none" }}
      width={size}
    />
  );
}

const DEFAULT_TITLE_PREFIX = "секреты ";
const DEFAULT_TITLE_ITALIC = "эффективного ";
const DEFAULT_TITLE_SUFFIX = "видео";
const DEFAULT_SUBTITLE =
  "Делимся кейсами и приемами эффективного видеомаркетинга.";
const DEFAULT_CTA_LABEL = "перейти в канал";

/**
 * TG-канал pop-up. UI shell с absolute-positioned детьми внутри card,
 * 1:1 матчящие Figma координаты per-breakpoint (см. tg-popup-variants.ts).
 *
 * Behaviour:
 * - Open / close через opacity transition (320ms cubic-bezier).
 * - Dismiss: ✕ button / overlay click / ESC keydown — все три триггерят onDismiss.
 * - CTA — `<a target="_blank" onClick={onDismiss}>`, открывает канал в новой
 *   вкладке + закрывает popup.
 *
 * Контент по умолчанию (Figma D4 locked):
 *   «секреты *эффективного* видео» + subtitle + «перейти в канал».
 */
export function TgPopup({
  variant,
  open,
  onDismiss,
  ctaHref,
  title,
  subtitle = DEFAULT_SUBTITLE,
  ctaLabel = DEFAULT_CTA_LABEL,
}: TgPopupProps) {
  const config = tgPopupVariants[variant];

  const titleId = useId();
  const [shouldRender, setShouldRender] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const exitUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setIsEntered(false);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!open || !shouldRender) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onDismiss, shouldRender]);

  const clearExitUnmountTimer = useCallback(() => {
    if (exitUnmountTimerRef.current != null) {
      clearTimeout(exitUnmountTimerRef.current);
      exitUnmountTimerRef.current = null;
    }
  }, []);

  const unmountAfterClose = useCallback(() => {
    clearExitUnmountTimer();
    setShouldRender(false);
  }, [clearExitUnmountTimer]);

  function handleShellTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "opacity") return;
    if (open) return;
    unmountAfterClose();
  }

  useEffect(() => {
    if (open || !shouldRender) return;
    clearExitUnmountTimer();
    exitUnmountTimerRef.current = setTimeout(() => {
      unmountAfterClose();
    }, MODAL_TRANSITION_MS + 120);
    return () => clearExitUnmountTimer();
  }, [open, shouldRender, unmountAfterClose, clearExitUnmountTimer]);

  useEffect(
    () => () => {
      clearExitUnmountTimer();
    },
    [clearExitUnmountTimer],
  );

  if (!shouldRender) return null;

  const closeWrapperSize = CloseButtonWrapperClass(config.closeIconSize);

  // Если title не передан — рендерим Figma-locked layout с italic середины.
  const titleNode = title ? (
    <span style={{ display: "inline-block", lineHeight: 0.9 }}>{title}</span>
  ) : (
    <>
      <span style={{ display: "inline", lineHeight: 0.9 }}>
        {DEFAULT_TITLE_PREFIX}
      </span>
      <span
        className="font-normal italic"
        style={{ display: "inline", lineHeight: 0.9 }}
      >
        {DEFAULT_TITLE_ITALIC}
      </span>
      <span style={{ display: "inline", lineHeight: 0.9 }}>
        {DEFAULT_TITLE_SUFFIX}
      </span>
    </>
  );

  const { title: t, subtitle: s, button: b, phone: p } = config;
  const fontFamily = "var(--font-montserrat), Montserrat, sans-serif";

  const layer = (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[var(--z-modal)] hidden overflow-x-clip transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[opacity]",
        config.layerVisibility,
        isEntered ? "opacity-100" : "opacity-0",
      )}
      data-testid="tg-popup-root"
      onTransitionEnd={handleShellTransitionEnd}
      role="dialog"
      style={{ transitionDuration: `${MODAL_TRANSITION_MS}ms` }}
    >
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-[#0d0300]/80"
        data-testid="tg-popup-backdrop"
        onClick={onDismiss}
        type="button"
      />

      <div
        className={cn(
          "absolute inset-0 z-10 flex min-h-0 min-w-0 items-center justify-center overflow-x-clip overflow-y-auto",
          config.outerPadding,
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onDismiss();
          }
        }}
      >
        <div
          className={cn(
            "relative flex min-w-0 flex-col",
            config.columnItems,
            config.columnGap,
          )}
          style={{ width: config.cardW }}
        >
          <button
            className={cn(
              "inline-flex shrink-0 self-end items-center justify-center rounded-[8px] border-0 bg-transparent p-0 transition-opacity hover:opacity-80",
              closeWrapperSize,
            )}
            data-testid="tg-popup-close"
            onClick={onDismiss}
            type="button"
          >
            <CloseIcon size={config.closeIconSize} />
          </button>

          {/* Card — фиксированный размер W×H из Figma, absolute children. */}
          <div
            className="relative overflow-hidden rounded-[16px] bg-[#fafaf7] shadow-none"
            data-testid="tg-popup-card"
            style={{ width: config.cardW, height: config.cardH }}
          >
            {/* Grid pattern via CSS gradients — чистые 30×30 cells.
                rgba(13,3,0,0.06) — Figma color #0d0300 с 6% прозрачностью
                встроен прямо в линии (без opacity на wrapper). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(13, 3, 0, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 3, 0, 0.06) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
                backgroundPosition: "0 0",
              }}
            />

            {/* Title */}
            <p
              className="absolute m-0 font-bold lowercase text-[#0d0300]"
              id={titleId}
              style={{
                left: t.x,
                top: t.y,
                width: t.w,
                fontFamily,
                fontSize: t.size,
                lineHeight: 0.9,
              }}
            >
              {titleNode}
            </p>

            {/* Subtitle */}
            <p
              className="absolute m-0 font-normal text-[#0d0300]"
              style={{
                left: s.x,
                top: s.y,
                width: s.w,
                fontFamily,
                fontSize: s.size,
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </p>

            {/* CTA pill — Figma 783:9769: outer rounded-[50px] pill, inner
                KingButton flex w-full items-center с left-aligned icon+text. */}
            <a
              className="absolute flex flex-col items-center justify-center rounded-[50px] bg-[#0d0300] px-[5px] lowercase transition-colors hover:bg-[#1a0d05]"
              data-testid="tg-popup-cta"
              href={ctaHref}
              onClick={onDismiss}
              rel="noopener noreferrer"
              style={{
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                color: "#ffffff",
                fontFamily,
                fontSize: b.fontSize,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
              target="_blank"
            >
              <span
                className="flex w-full shrink-0 items-center overflow-hidden"
                style={{ gap: b.gapInner }}
              >
                <TelegramIcon size={b.iconSize} />
                <span className="whitespace-nowrap">{ctaLabel}</span>
              </span>
            </a>

            {/* Phone — content layer (TG screenshot inside rounded crop).
                Position via left (1440/1024/768) или right (480/360 — Figma). */}
            <div
              aria-hidden
              className="absolute"
              style={{
                ...(p.contentXRight !== undefined
                  ? { right: p.contentXRight }
                  : { left: p.contentX }),
                top: p.contentY,
                width: p.contentOuterW,
                height: p.contentOuterH,
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex-none rotate-[1.68deg]">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: p.contentInnerW,
                      height: p.contentInnerH,
                      borderRadius: p.contentRadius,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      src="/assets/figma/optimized/tg-phone-content.avif"
                      style={{ maxWidth: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone — frame layer (1480×1480 PNG cropped via magic numbers). */}
            <div
              aria-hidden
              className="absolute"
              data-testid="tg-popup-image"
              style={{
                ...(p.xRight !== undefined
                  ? { right: p.xRight }
                  : { left: p.x }),
                top: p.y,
                width: p.outerW,
                height: p.outerH,
              }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex-none rotate-[1.68deg]">
                  <div
                    className="relative"
                    style={{ width: p.frameInnerW, height: p.frameInnerH }}
                  >
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="absolute"
                        src="/assets/figma/optimized/tg-phone-frame.avif"
                        style={{
                          width: p.frameImgWidth,
                          height: p.frameImgHeight,
                          left: p.frameImgLeft,
                          top: p.frameImgTop,
                          maxWidth: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}
