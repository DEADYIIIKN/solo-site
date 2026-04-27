"use client";

import type { Dispatch, SetStateAction, TransitionEvent } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/shared/lib/utils";
import {
  formatConsultationPhoneBackspace,
  formatConsultationPhone,
  isConsultationPhoneValid,
} from "@/widgets/first-screen/model/first-screen-consultation-form";

import type {
  FirstScreenConsultationContactMethod,
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";

type FirstScreenConsultationModal1024Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};
const contactOptions: { id: FirstScreenConsultationContactMethod; label: string }[] = [
  { id: "call", label: "Позвонить" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
];

const MODAL_TRANSITION_MS = 320;

function CloseIcon() {
  return (
    <svg
      aria-hidden
      className="size-[34px] shrink-0 text-white"
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

function CheckboxCheckIcon() {
  return (
    <svg
      aria-hidden
      className="size-[14px] text-white"
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 7.2 5.4 10 11.5 3.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Figma 783:9879 — поп-ап 1024×700, карточка 616px */
export function FirstScreenConsultationModal1024({
  open,
  onClose,
  formState,
  setFormState,
  titleVariant = "task",
}: FirstScreenConsultationModal1024Props) {
  const titleId = useId();
  const successTitleId = useId();
  const [shouldRender, setShouldRender] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const exitUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const { name, phone, message, contactMethod, consent } = formState;
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nameError = submitAttempted && !name.trim();
  const phoneError = submitAttempted && !isConsultationPhoneValid(phone);
  const consentError = submitAttempted && !consent;

  useEffect(() => {
    if (open) {
      setSubmitAttempted(false);
      setIsSuccess(false);
    }
  }, [open]);

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

  const layer = (
    <div
      aria-labelledby={isSuccess ? successTitleId : titleId}
      aria-modal="true"
      className={`fixed inset-0 z-[var(--z-modal)] hidden overflow-x-clip min-[1024px]:block min-[1440px]:hidden transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[opacity] ${
        isEntered ? "opacity-100" : "opacity-0"
      }`}
      onTransitionEnd={handleShellTransitionEnd}
      role="dialog"
      style={{ transitionDuration: `${MODAL_TRANSITION_MS}ms` }}
    >
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-[#0d0300]/80"
        onClick={onClose}
        type="button"
      />

      {/* Figma 783:9881: колонка по центру, gap 10px */}
      <div
        className="absolute inset-0 z-10 flex min-h-0 min-w-0 items-center justify-center overflow-x-clip overflow-y-auto px-4 py-2"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="relative flex w-full max-w-[616px] flex-col items-center gap-[10px]">
          <button
            className="inline-flex size-[34px] shrink-0 self-end items-center justify-center rounded-[8px] border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
            data-testid="consultation-modal-close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>

          {isSuccess ? (
            <div className="first-screen-consultation-modal font-sans flex w-full max-w-[490px] flex-col gap-[40px] overflow-visible rounded-[16px] bg-white px-[30px] pb-[35px] pt-[30px] shadow-none">
              <div className="flex w-full flex-col items-start gap-[24px] text-center text-[#0d0300]">
                <p
                  className="w-full text-[32px] font-bold lowercase leading-[1.1]"
                  id={successTitleId}
                >
                  скоро вернемся!
                </p>
                <p className="w-full text-[17px] font-normal leading-[1.2]">
                  Мы получили вашу заявку и скоро свяжемся с вами, чтобы
                  обсудить детали
                </p>
              </div>
              <button
                className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
                onClick={onClose}
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
                type="button"
              >
                вернуться
              </button>
            </div>
          ) : (
            <form
              className="first-screen-consultation-modal font-sans flex w-full max-w-[616px] flex-col gap-[30px] overflow-visible rounded-[16px] bg-white p-[30px] shadow-none"
              data-testid="consultation-modal-card"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitAttempted(true);
                if (
                  !name.trim() ||
                  !isConsultationPhoneValid(phone) ||
                  !consent
                )
                  return;
                setIsSuccess(true);
              }}
            >
            <p
              className="w-full text-[38px] font-bold lowercase leading-[0.9] text-[#0d0300]"
              id={titleId}
            >
              {titleVariant === "consultation" ? (
                <>
                  <span>бесплатная </span>
                  <span className="font-normal italic">консультация </span>
                  <span>по{"\u00A0"}вашему проекту</span>
                </>
              ) : (
                <>
                  <span>поможем </span>
                  <span className="font-normal italic">с решением </span>
                  <span>вашей задачи</span>
                </>
              )}
            </p>

            <div className="flex w-full flex-col gap-[36px]">
              <div className="flex w-full flex-col gap-[30px] min-[500px]:flex-row">
                <label
                  className={cn(
                    "flex min-h-0 min-w-0 flex-1 flex-col border-b border-solid pb-[20px] pt-[10px]",
                    nameError
                      ? "border-[#e63a24]"
                      : "border-[#9c9c9c] focus-within:border-[#0d0300]",
                  )}
                >
                  <span className="sr-only">Ваше имя</span>
                  <input
                    aria-invalid={nameError}
                    autoComplete="name"
                    className={cn(
                      "w-full bg-transparent text-[16px] font-normal leading-[1.2] outline-none focus-visible:outline-none focus-visible:outline-offset-0",
                      nameError
                        ? "text-[#e63a24] placeholder:text-[#e63a24]/70"
                        : "text-[#0d0300] placeholder:text-[#9c9c9c]",
                    )}
                    name="name"
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ваше имя"
                    type="text"
                    value={name}
                  />
                </label>
                <label
                  className={cn(
                    "flex min-h-0 min-w-0 flex-1 flex-col border-b border-solid pb-[20px] pt-[10px]",
                    phoneError
                      ? "border-[#e63a24]"
                      : "border-[#9c9c9c] focus-within:border-[#0d0300]",
                  )}
                >
                  <span className="sr-only">Номер телефона</span>
                  <input
                    aria-invalid={phoneError}
                    autoComplete="tel"
                    className={cn(
                      "w-full bg-transparent text-[16px] font-normal leading-[1.2] outline-none focus-visible:outline-none focus-visible:outline-offset-0",
                      phoneError
                        ? "text-[#e63a24] placeholder:text-[#e63a24]/70"
                        : "text-[#0d0300] placeholder:text-[#9c9c9c]",
                    )}
                    inputMode="tel"
                    maxLength={18}
                    name="phone"
                    onKeyDown={(e) => {
                      if (e.key !== "Backspace") return;
                      if (
                        e.currentTarget.selectionStart !==
                        e.currentTarget.selectionEnd
                      )
                        return;
                      const nextPhone = formatConsultationPhoneBackspace(
                        phone,
                        e.currentTarget.selectionStart ?? 0,
                      );
                      if (nextPhone == null) return;
                      e.preventDefault();
                      setFormState((prev) => ({ ...prev, phone: nextPhone }));
                    }}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        phone: formatConsultationPhone(e.target.value),
                      }))
                    }
                    placeholder="Номер телефона"
                    type="tel"
                    value={phone}
                  />
                </label>
              </div>

              <div className="flex w-full flex-col gap-[12px]">
                <p className="text-[16px] font-bold leading-[1.25] text-[#0d0300]">
                  Как удобнее связаться?
                </p>
                <div className="flex flex-nowrap gap-[16px]">
                  {contactOptions.map((opt) => {
                    const selected = contactMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-[12px] rounded-[8px] border border-solid border-[#9c9c9c] p-[10px]",
                          "hover:bg-[rgba(13,3,0,0.04)]",
                        )}
                      >
                        <input
                          checked={selected}
                          className="sr-only"
                          name="contact-method"
                          onChange={() =>
                            setFormState((prev) => ({
                              ...prev,
                              contactMethod: opt.id,
                            }))
                          }
                          type="radio"
                          value={opt.id}
                        />
                        <span
                          className={cn(
                            "size-[14px] shrink-0 rounded-full",
                            selected ? "bg-[#ff5c00]" : "bg-[#9c9c9c]",
                          )}
                        />
                        <span className="flex flex-col justify-center leading-[0]">
                          <span className="whitespace-nowrap text-[14px] font-normal leading-[1.2] text-[#0d0300]">
                            {opt.label}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="flex h-[80px] w-full flex-col box-border border-b border-solid border-[#9c9c9c] pb-[30px] pt-[10px] focus-within:border-[#0d0300]">
                <span className="sr-only">Описание задачи</span>
                <textarea
                  className="min-h-0 w-full flex-1 resize-none bg-transparent text-[16px] font-normal leading-[1.2] text-[#0d0300] outline-none placeholder:text-[#9c9c9c] focus-visible:outline-none focus-visible:outline-offset-0"
                  name="message"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Если хотите, опишите задачу — так мы сможем подготовиться к разговору"
                  value={message}
                />
              </label>

              <label className="flex min-w-0 cursor-pointer items-center gap-[12px] leading-[0]">
                <input
                  aria-invalid={consentError}
                  checked={consent}
                  className="sr-only"
                  name="consent"
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, consent: e.target.checked }))
                  }
                  type="checkbox"
                />
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-solid",
                    consentError
                      ? "border-[#e63a24] bg-transparent"
                      : consent
                        ? "border-[#ff5c00] bg-[#ff5c00]"
                        : "border-[#9c9c9c] bg-transparent",
                  )}
                >
                  {consent ? <CheckboxCheckIcon /> : null}
                </span>
                <span className="min-w-0 flex-1 text-[16px] font-normal leading-[1.2] text-[#0d0300] opacity-90">
                  Согласен(на) на обработку персональных данных в соответствии
                  с {" "}
                  <a
                    className="underline decoration-solid [text-decoration-skip-ink:none]"
                    href="#"
                  >
                    Политикой конфиденциальности
                  </a>
                </span>
              </label>
            </div>

            <button
              className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
              type="submit"
            >
              оставить заявку
            </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}
