"use client";

import type { TransitionEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";
import { dispatchOpenConsultationModal } from "@/shared/lib/open-consultation-modal";
import type { CasesAdCard } from "@/widgets/cases/model/cases.data";
import { CaseModalVideoBlock } from "@/widgets/cases/ui/case-modal-video-block";

const MODAL_MS = 320;

/** `1024` — та же вёрстка, что и `1440` (секция кейсов 1024–1439). */
export type CasesAdDetailLayout = "1440" | "1024" | "768" | "480" | "360";

type CasesAdDetailModalProps = {
  open: boolean;
  onClose: () => void;
  card: CasesAdCard | null;
  layout: CasesAdDetailLayout;
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

function AdResultBlock({ card, textClass }: { card: CasesAdCard; textClass: string }) {
  return (
    <div className={cn("font-normal", textClass)}>
      <p className="mb-[10px] leading-[1.2]">{card.detailResultLead}</p>
      {card.detailResultBullets && card.detailResultBullets.length > 0 ? (
        <ul className="mb-[10px] list-disc ps-6">
          {card.detailResultBullets.map((b) => (
            <li key={b} className="mb-2 leading-[1.2] last:mb-0">
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      {card.detailResultClosing ? (
        <p className="leading-[1.2]">{card.detailResultClosing}</p>
      ) : null}
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

function AdModalTaskResult1440({ card }: { card: CasesAdCard }) {
  return (
    <div className="flex w-full flex-col gap-[30px] text-[16px] leading-[1.2] text-[#0d0300]">
      <div className="flex gap-4">
        <p className="m-0 w-[95px] shrink-0 font-bold leading-[1.2]">Задача:</p>
        <p className="m-0 min-w-0 flex-1 font-normal leading-[1.2]">{card.detailTask}</p>
      </div>
      <div className="flex gap-4">
        <p className="m-0 w-[95px] shrink-0 font-bold leading-[1.2]">Результат:</p>
        <div className="min-w-0 flex-1">
          <AdResultBlock card={card} textClass="text-[16px] leading-[1.2]" />
        </div>
      </div>
    </div>
  );
}

function AdModalTaskResultStacked({
  card,
  textClass,
  gapSection = "gap-6",
}: {
  card: CasesAdCard;
  textClass: string;
  gapSection?: string;
}) {
  return (
    <div className={cn("flex flex-col", gapSection, textClass)}>
      <div className="flex flex-col gap-2">
        <p className="m-0 font-bold">Задача:</p>
        <p className="m-0 font-normal">{card.detailTask}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="m-0 font-bold">Результат:</p>
        <AdResultBlock card={card} textClass={cn("font-normal", textClass)} />
      </div>
    </div>
  );
}

export function CasesAdDetailModal({ open, onClose, card, layout }: CasesAdDetailModalProps) {
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
  const closeSize = layout === "1440" || layout === "1024" ? 34 : layout === "768" ? 30 : 28;

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
            <div className="w-full rounded-[24px] bg-white p-10 text-[#0d0300]">
              <div className="flex w-full gap-[30px]">
                <div className="flex min-h-[260px] min-w-0 flex-1 flex-col justify-between">
                  <div className="flex flex-col gap-[30px]">
                    <p
                      className="m-0 max-w-[380px] text-[34px] font-bold uppercase leading-[0.9]"
                      id={titleId}
                    >
                      {card.title}
                    </p>
                    <div className="flex flex-wrap gap-x-[30px] gap-y-2 text-[16px] leading-[1.3]">
                      {card.credits.map((line) => (
                        <CreditLine key={line} text={line} />
                      ))}
                    </div>
                  </div>
                  <OrderButton className="h-[59px] w-[290px] text-[16px]" onClick={handleOrderProject} />
                </div>
                <CaseModalVideoBlock
                  className="h-[260px] w-[463px] shrink-0"
                  imageSizes="463px"
                  modalOpen={open}
                  playSize={playSize}
                  posterSrc={card.image}
                  videoLabel={`Видео: ${card.title}`}
                  videoUrl={card.detailVideoUrl}
                />
              </div>
              <div className="mt-8">
                <AdModalTaskResult1440 card={card} />
              </div>
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
            <div className="w-full rounded-[24px] bg-white p-6 text-[#0d0300]">
              <div className="flex w-full gap-6">
                <div className="flex min-h-[180px] min-w-0 flex-1 flex-col justify-between gap-6">
                  <div className="flex flex-col gap-6">
                    <p
                      className="m-0 max-w-[320px] text-[28px] font-bold uppercase leading-[0.9]"
                      id={titleId}
                    >
                      {card.title}
                    </p>
                    <div className="flex flex-col gap-3 text-[14px] leading-[1.3]">
                      {card.credits.map((line) => (
                        <CreditLine key={line} text={line} />
                      ))}
                    </div>
                  </div>
                  <OrderButton className="h-[52px] w-full max-w-full text-[16px]" onClick={handleOrderProject} />
                </div>
                <CaseModalVideoBlock
                  className="h-[180px] w-[320px] shrink-0"
                  imageSizes="320px"
                  modalOpen={open}
                  playSize={playSize}
                  posterSrc={card.image}
                  videoLabel={`Видео: ${card.title}`}
                  videoUrl={card.detailVideoUrl}
                />
              </div>
              <div className="mt-6">
                <AdModalTaskResultStacked card={card} textClass="text-[14px] leading-[1.2]" />
              </div>
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
                className="aspect-[463/260] w-full"
                imageSizes="(max-width:480px) 100vw, 432px"
                modalOpen={open}
                playSize={40}
                posterSrc={card.image}
                videoLabel={`Видео: ${card.title}`}
                videoUrl={card.detailVideoUrl}
              />
              <div className="flex flex-col gap-9">
                <div className="flex flex-col gap-6">
                  <p
                    className="m-0 max-w-[240px] text-[26px] font-bold uppercase leading-[0.9]"
                    id={titleId}
                  >
                    {card.title}
                  </p>
                  <div className="flex flex-col gap-3 text-[14px] leading-[1.3]">
                    {card.credits.map((line) => (
                      <CreditLine key={line} text={line} />
                    ))}
                  </div>
                </div>
                <AdModalTaskResultStacked
                  card={card}
                  gapSection="gap-7"
                  textClass="text-[14px] leading-[1.2]"
                />
                <OrderButton
                  className="h-12 w-full rounded-[50px] text-[14px] font-semibold"
                  onClick={handleOrderProject}
                />
              </div>
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
                className="aspect-[463/260] w-full"
                imageSizes="(max-width:360px) 100vw, 328px"
                modalOpen={open}
                playSize={40}
                posterSrc={card.image}
                videoLabel={`Видео: ${card.title}`}
                videoUrl={card.detailVideoUrl}
              />
              <div className="flex flex-col gap-9">
                <div className="flex flex-col gap-6">
                  <p
                    className="m-0 max-w-[220px] text-[23px] font-bold uppercase leading-[0.9]"
                    id={titleId}
                  >
                    {card.title}
                  </p>
                  <div className="flex flex-col gap-3 text-[12px] leading-[1.3]">
                    {card.credits.map((line) => (
                      <CreditLine key={line} text={line} />
                    ))}
                  </div>
                </div>
                <AdModalTaskResultStacked
                  card={card}
                  gapSection="gap-[30px]"
                  textClass="text-[12px] leading-[1.2]"
                />
                <OrderButton
                  className="h-11 w-full rounded-[50px] text-[13px] font-semibold"
                  onClick={handleOrderProject}
                />
              </div>
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
