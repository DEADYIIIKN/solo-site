"use client";

/* eslint-disable @next/next/no-img-element */

import type { TransitionEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";
import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import type { CasesVerticalCard } from "@/widgets/cases/model/cases.data";
import { cases1440Assets } from "@/widgets/cases/model/cases.data";
import { CaseModalVideoBlock } from "@/widgets/cases/ui/case-modal-video-block";

const MODAL_MS = 320;

/** `1024` — та же вёрстка, что и `1440` (секция кейсов 1024–1439). */
export type CasesVerticalDetailLayout = "1440" | "1024" | "768" | "480" | "360";

type CasesVerticalDetailModalProps = {
  open: boolean;
  onClose: () => void;
  card: CasesVerticalCard | null;
  layout: CasesVerticalDetailLayout;
};

function ModalCloseIcon({ sizePx }: { sizePx: number }) {
  return (
    <svg
      aria-hidden
      className="shrink-0 text-white"
      fill="none"
      height={sizePx}
      viewBox="0 0 34 34"
      width={sizePx}
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

function CreditLine({ className, text }: { className?: string; text: string }) {
  const i = text.indexOf(":");
  if (i === -1) {
    return <p className={cn("m-0", className)}>{text}</p>;
  }
  return (
    <p className={cn("m-0", className)}>
      <span className="font-bold">{text.slice(0, i + 1)}</span>
      {text.slice(i + 1)}
    </p>
  );
}

function modalTitle(card: CasesVerticalCard): string {
  return card.titleLines.join(" ");
}

export function CasesVerticalDetailModal({
  open,
  onClose,
  card,
  layout,
}: CasesVerticalDetailModalProps) {
  const titleId = useId();
  const [shouldRender, setShouldRender] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, shouldRender]);

  function clearExit() {
    if (exitTimerRef.current != null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }

  function unmount() {
    setShouldRender(false);
  }

  function handleShellEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || e.propertyName !== "opacity" || open) return;
    unmount();
  }

  useEffect(() => {
    if (open || !shouldRender) return;
    clearExit();
    exitTimerRef.current = setTimeout(unmount, MODAL_MS + 80);
    return () => clearExit();
  }, [open, shouldRender]);

  useEffect(
    () => () => {
      clearExit();
    },
    [],
  );

  function handleOrderProject() {
    onClose();
    dispatchOpenConsultationModal("task");
  }

  if (!shouldRender || !card) return null;

  const playSize = layout === "1440" || layout === "1024" || layout === "768" ? 60 : 40;
  const closeSize =
    layout === "1440" || layout === "1024" ? 34 : layout === "768" ? 30 : 28;

  const shell = (() => {
    switch (layout) {
      case "1440":
      case "1024":
        return (
          <div className="flex w-full max-w-[930px] flex-col items-end gap-5">
            <button
              aria-label="Закрыть"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 transition-opacity hover:opacity-85"
              onClick={onClose}
              type="button"
            >
              <ModalCloseIcon sizePx={closeSize} />
            </button>
            <div className="flex w-full gap-[30px] rounded-[24px] bg-white p-10 text-[#0d0300]">
              <CaseModalVideoBlock
                className="h-[510px] w-[290px] shrink-0"
                imageSizes="290px"
                modalOpen={open}
                playSize={playSize}
                posterSrc={card.image}
                videoLabel={`Видео: ${modalTitle(card)}`}
                videoUrl={card.detailVideoUrl}
              />
              <ModalBodyDesktop card={card} onOrderProject={handleOrderProject} titleId={titleId} />
            </div>
          </div>
        );
      case "768":
        return (
          <div className="flex w-full max-w-[672px] flex-col items-end gap-5">
            <button
              aria-label="Закрыть"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 transition-opacity hover:opacity-85"
              onClick={onClose}
              type="button"
            >
              <ModalCloseIcon sizePx={closeSize} />
            </button>
            <div className="flex w-full gap-6 rounded-[24px] bg-white p-6 text-[#0d0300]">
              <CaseModalVideoBlock
                className="h-[440px] w-[250px] shrink-0"
                imageSizes="250px"
                modalOpen={open}
                playSize={playSize}
                posterSrc={card.image}
                videoLabel={`Видео: ${modalTitle(card)}`}
                videoUrl={card.detailVideoUrl}
              />
              <ModalBodyTablet card={card} onOrderProject={handleOrderProject} titleId={titleId} />
            </div>
          </div>
        );
      case "480":
        return (
          <div className="flex w-full max-w-[480px] flex-col items-end gap-5 px-6 py-5">
            <button
              aria-label="Закрыть"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 transition-opacity hover:opacity-85"
              onClick={onClose}
              type="button"
            >
              <ModalCloseIcon sizePx={28} />
            </button>
            <div className="flex w-full flex-col gap-6 rounded-[24px] bg-white p-6 text-[#0d0300]">
              <CaseModalVideoBlock
                className="h-[324px] w-[184px] shrink-0"
                imageSizes="184px"
                modalOpen={open}
                playSize={40}
                posterSrc={card.image}
                videoLabel={`Видео: ${modalTitle(card)}`}
                videoUrl={card.detailVideoUrl}
              />
              <ModalBodyMobile card={card} onOrderProject={handleOrderProject} size="480" titleId={titleId} />
            </div>
          </div>
        );
      case "360":
        return (
          <div className="flex w-full max-w-[360px] flex-col items-end gap-5 px-4 py-5">
            <button
              aria-label="Закрыть"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 transition-opacity hover:opacity-85"
              onClick={onClose}
              type="button"
            >
              <ModalCloseIcon sizePx={28} />
            </button>
            <div className="flex w-full flex-col gap-6 rounded-[24px] bg-white p-4 text-[#0d0300]">
              <CaseModalVideoBlock
                className="h-[246px] w-[140px] shrink-0"
                imageSizes="140px"
                modalOpen={open}
                playSize={40}
                posterSrc={card.image}
                videoLabel={`Видео: ${modalTitle(card)}`}
                videoUrl={card.detailVideoUrl}
              />
              <ModalBodyMobile card={card} onOrderProject={handleOrderProject} size="360" titleId={titleId} />
            </div>
          </div>
        );
    }
  })();

  const layer = (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[var(--z-modal)] overflow-x-clip transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[opacity]",
        isEntered ? "opacity-100" : "opacity-0",
      )}
      onTransitionEnd={handleShellEnd}
      role="dialog"
      style={{ transitionDuration: `${MODAL_MS}ms` }}
    >
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-[#0d0300]/60"
        onClick={onClose}
        type="button"
      />
      <div
        className="absolute inset-0 z-10 flex min-h-0 min-w-0 items-center justify-center overflow-x-clip overflow-y-auto py-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        {shell}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}

function ModalBodyDesktop({
  titleId,
  card,
  onOrderProject,
}: {
  titleId: string;
  card: CasesVerticalCard;
  onOrderProject: () => void;
}) {
  return (
    <div className="flex min-h-[510px] min-w-0 flex-1 flex-col justify-between text-[#0d0300]">
      <div className="flex flex-col gap-[30px]">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="m-0 max-w-[380px] text-[34px] font-bold uppercase leading-[0.9]" id={titleId}>
            {modalTitle(card)}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <img
              alt=""
              className="h-[22px] w-[32px] object-contain brightness-0"
              height="22"
              src={cases1440Assets.viewsIcon}
              width="32"
            />
            <p className="m-0 text-[34px] font-bold lowercase leading-[1.2]">{card.views}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-[30px] gap-y-2 text-[16px] leading-[1.3]">
          {card.credits.map((line) => (
            <CreditLine key={line} text={line} />
          ))}
        </div>
      </div>
      <ModalTaskResult card={card} className="mt-8" textClass="text-[16px] leading-[1.2]" />
      <OrderButton className="mt-8 h-[59px] w-[290px] text-[16px]" onClick={onOrderProject} />
    </div>
  );
}

function ModalBodyTablet({
  titleId,
  card,
  onOrderProject,
}: {
  titleId: string;
  card: CasesVerticalCard;
  onOrderProject: () => void;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between text-[#0d0300]">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-start justify-between gap-3">
          <p className="m-0 max-w-[215px] text-[28px] font-bold uppercase leading-[0.9]" id={titleId}>
            {modalTitle(card)}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <img
              alt=""
              className="h-[14px] w-5 object-contain brightness-0"
              height="14"
              src={cases1440Assets.viewsIcon}
              width="20"
            />
            <p className="m-0 text-[28px] font-bold lowercase leading-[1.2]">{card.views}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 text-[14px] leading-[1.3]">
          {card.credits.map((line) => (
            <CreditLine key={line} text={line} />
          ))}
        </div>
      </div>
      <ModalTaskResult card={card} className="mt-6 min-h-0 overflow-y-auto" textClass="text-[14px] leading-[1.2]" />
      <OrderButton className="mt-6 h-[52px] w-full text-[16px]" onClick={onOrderProject} />
    </div>
  );
}

function ModalBodyMobile({
  titleId,
  card,
  onOrderProject,
  size,
}: {
  titleId: string;
  card: CasesVerticalCard;
  onOrderProject: () => void;
  size: "480" | "360";
}) {
  const titlePx = size === "480" ? "text-[26px]" : "text-[23px]";
  const viewsPx = size === "480" ? "text-[26px]" : "text-[23px]";
  const metaPx = size === "480" ? "text-[14px]" : "text-[12px]";
  const bodyPx = size === "480" ? "text-[14px]" : "text-[12px]";
  const btnPx = size === "480" ? "text-[14px] h-12" : "text-[13px] h-11";
  const iconH = size === "480" ? 18 : 12;
  const iconW = size === "480" ? 26 : 16;

  return (
    <div className="flex w-full flex-col gap-9">
      <div className="flex flex-col gap-6">
        <div className="flex w-full items-start justify-between gap-2">
          <p
            className={cn("m-0 max-w-[240px] font-bold uppercase leading-[0.9]", titlePx)}
            id={titleId}
          >
            {modalTitle(card)}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <img
              alt=""
              className="object-contain brightness-0"
              height={iconH}
              src={cases1440Assets.viewsIcon}
              style={{ height: iconH, width: iconW }}
              width={iconW}
            />
            <p className={cn("m-0 font-bold lowercase leading-[1.2]", viewsPx)}>{card.views}</p>
          </div>
        </div>
        <div className={cn("flex flex-col gap-3 leading-[1.3]", metaPx)}>
          {card.credits.map((line) => (
            <CreditLine key={line} text={line} />
          ))}
        </div>
      </div>
      <ModalTaskResult card={card} textClass={cn("leading-[1.2]", bodyPx)} gapSection={size === "360" ? "gap-[30px]" : "gap-7"} />
      <OrderButton className={cn("w-full rounded-[50px] font-semibold", btnPx)} onClick={onOrderProject} />
    </div>
  );
}

function ModalTaskResult({
  card,
  textClass,
  gapSection = "gap-[30px]",
  className,
}: {
  card: CasesVerticalCard;
  textClass: string;
  gapSection?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", gapSection, textClass, className)}>
      <div className="flex flex-col gap-2">
        <p className="m-0 font-bold">Задача:</p>
        <p className="m-0 font-normal">{card.detailTask}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 font-bold">Результат:</p>
        <p className="m-0 font-normal">{card.detailResult}</p>
      </div>
    </div>
  );
}

function OrderButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-[56px] shrink-0 items-center justify-center rounded-[50px] border-0 bg-[#ff5c00] px-[40px] pb-[20px] pt-[22px] text-center lowercase text-white transition-opacity hover:opacity-92",
        className,
      )}
      onClick={onClick}
      style={{
        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
      type="button"
    >
      заказать проект
    </button>
  );
}
