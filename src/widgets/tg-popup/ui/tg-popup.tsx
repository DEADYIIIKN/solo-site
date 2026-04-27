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
  // Статические классы — Tailwind JIT их подхватит.
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

/**
 * Telegram paper-plane icon. Используется внутри CTA-кнопки.
 * Простая inline-SVG, заливается currentColor (наследует text-white от button).
 */
function TelegramIcon({ size, color = "currentColor" }: { size: number; color?: string }) {
  return (
    <svg
      aria-hidden
      className="shrink-0"
      fill={color}
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.426 1.443a1 1 0 0 0-1.052-.114L1.46 9.823a1 1 0 0 0 .054 1.834l4.86 1.892 1.964 6.41a1 1 0 0 0 1.752.302l3.092-3.834 5.07 3.747a1 1 0 0 0 1.582-.604l3.122-16.5a1 1 0 0 0-.422-1.05Zm-3.7 4.142L9.06 13.49a1 1 0 0 0-.292.578l-.43 2.962-1.222-3.99 10.61-7.455Z" />
    </svg>
  );
}

const DEFAULT_TITLE_PREFIX = "секреты ";
const DEFAULT_TITLE_ITALIC = "эффективного ";
const DEFAULT_TITLE_SUFFIX = "видео";
const DEFAULT_SUBTITLE =
  "Делимся кейсами и приемами эффективного видеомаркетинга.";
const DEFAULT_CTA_LABEL = "перейти в канал";

/**
 * TG-канал pop-up. UI shell — overlay + dismiss handlers + CTA.
 *
 * Behaviour:
 * - Open / close через opacity transition (320ms cubic-bezier, тот же что в ConsultationModal).
 * - Dismiss: ✕ button / overlay click / ESC keydown — все три триггерят onDismiss.
 * - CTA — `<a href={ctaHref} target="_blank" rel="noopener noreferrer" onClick={onDismiss}>`,
 *   открывает канал в новой вкладке + закрывает popup (D2 — single dismiss event).
 *
 * Контент по умолчанию (Figma D4 locked):
 *   «секреты *эффективного* видео» + subtitle + «перейти в канал».
 *
 * Per-breakpoint dimensions берутся из `tgPopupVariants[variant]`.
 *
 * Phone mockup asset (правый/нижний блок) — placeholder; экспорт ассета из
 * Figma 783:9772/9773 → public/assets/figma/tg-popup/ запланирован в 10-03.
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
    <span>{title}</span>
  ) : (
    <>
      <span>{DEFAULT_TITLE_PREFIX}</span>
      <span className="font-normal italic">{DEFAULT_TITLE_ITALIC}</span>
      <span>{DEFAULT_TITLE_SUFFIX}</span>
    </>
  );

  const layout = config.layout;

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
            "relative flex w-full min-w-0 flex-col",
            config.columnItems,
            config.columnGap,
            config.maxWidth,
          )}
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

          <div
            className={cn(
              "relative z-0 flex w-full min-w-0 rounded-[16px] bg-[#fafaf7] shadow-none",
              layout === "horizontal"
                ? "flex-row items-center"
                : "flex-col items-center",
              config.cardMinHeight,
              config.cardPadding,
              config.cardInnerGap,
            )}
            data-testid="tg-popup-card"
          >
            {/* Subtle grid pattern (Figma Rectangle 173) — opacity 6%, clipped к card border */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px] opacity-[0.06]"
              style={{
                backgroundImage:
                  "url('/assets/figma/tg-popup/card-grid-bg.png')",
                backgroundSize: "780px auto",
                backgroundPosition: "top left",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div
              className={cn(
                "flex min-w-0 flex-col",
                layout === "horizontal"
                  ? "flex-1 items-start text-left"
                  : "items-center text-center",
                config.textBlockGap,
              )}
            >
              <p
                className="font-bold lowercase leading-[0.9] text-[#0d0300]"
                id={titleId}
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: config.titleSize,
                }}
              >
                {titleNode}
              </p>
              <p
                className={cn(
                  "font-normal leading-[1.2] text-[#0d0300]",
                  config.subtitleMaxWidth,
                )}
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: config.subtitleSize,
                }}
              >
                {subtitle}
              </p>
              <a
                className={cn(
                  "inline-flex shrink-0 items-center justify-center gap-[10px] rounded-[50px] bg-[#0d0300] text-center lowercase transition-colors hover:bg-[#1a0d05]",
                  config.ctaButtonWidth,
                  config.ctaButtonHeight,
                )}
                data-testid="tg-popup-cta"
                href={ctaHref}
                onClick={onDismiss}
                rel="noopener noreferrer"
                style={{
                  color: "#ffffff",
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: config.ctaFontSize,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
                target="_blank"
              >
                <TelegramIcon size={config.ctaIconSize} color="#ff5c00" />
                <span>{ctaLabel}</span>
              </a>
            </div>

            {/* Phone mockup — phone-frame.png (1480x1480 asset с phone в центре
                и прозрачными полями) cropped через positioned <img> поверх
                phone-content.jpg (TG screenshot) внутри screen area.
                Положение копирует Figma 783:9773 (frame) + 783:9772 (content).
                Tilt 1.68deg на родительском div. */}
            <div
              aria-hidden
              className={cn(
                "shrink-0 relative overflow-hidden",
                config.imageWidth,
                config.imageHeight,
              )}
              data-testid="tg-popup-image"
              style={{ transform: "rotate(1.68deg)" }}
            >
              {/* Screen content под рамкой — 87% wide × 86% tall, центрирован */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute rounded-[28px] object-cover object-top"
                src="/assets/figma/tg-popup/phone-content.jpg"
                style={{
                  width: "87%",
                  height: "86%",
                  left: "6.5%",
                  top: "7%",
                }}
              />
              {/* Phone frame — asset 1480x1480, scaled and positioned to show
                  только phone portion (Figma magic numbers: w=258.74%, h=124.58%,
                  left=-79.37%, top=-12.29%). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute pointer-events-none max-w-none"
                src="/assets/figma/tg-popup/phone-frame.png"
                style={{
                  width: "258.74%",
                  height: "124.58%",
                  left: "-79.37%",
                  top: "-12.29%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}
