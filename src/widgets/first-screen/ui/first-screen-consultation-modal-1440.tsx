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

/** «связаться» в шапке — задача; круглый CTA — бесплатная консультация */
export type FirstScreenConsultationModalTitleVariant = "task" | "consultation";
export type FirstScreenConsultationContactMethod =
  | "call"
  | "telegram"
  | "whatsapp";
export type FirstScreenConsultationFormState = {
  name: string;
  phone: string;
  message: string;
  contactMethod: FirstScreenConsultationContactMethod;
  consent: boolean;
};

export const defaultFirstScreenConsultationFormState: FirstScreenConsultationFormState =
  {
    name: "",
    phone: "",
    message: "",
    contactMethod: "call",
    consent: false,
  };

type FirstScreenConsultationModal1440Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  /** default: задача (как в макете первого варианта) */
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};

const contactOptions: { id: FirstScreenConsultationContactMethod; label: string }[] = [
  { id: "call", label: "Позвонить" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
];

const MODAL_TRANSITION_MS = 320;
/** Плавная смена формы → экран успеха (без «рывка» и мигания) */
const FORM_SUCCESS_LEAVE_MS = 380;
const FORM_SUCCESS_ENTER_MS = 400;
const FORM_SUCCESS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

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

/** Figma 783:10085 — белая галочка на оранжевом фоне */
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

/** Figma: «бесплатная консультация…» — 783:9898; «поможем с задачей» — 783:9917 (колонка крестик + карточка gap 20px). */
export function FirstScreenConsultationModal1440({
  open,
  onClose,
  formState,
  setFormState,
  titleVariant = "task",
}: FirstScreenConsultationModal1440Props) {
  const titleId = useId();
  const successTitleId = useId();
  const [shouldRender, setShouldRender] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const exitUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const { name, phone, message, contactMethod, consent } = formState;
  const [submitAttempted, setSubmitAttempted] = useState(false);
  /** form → leave (fade out) → success (fade in) */
  const [successStep, setSuccessStep] = useState<"form" | "leave" | "success">(
    "form",
  );
  const [successEntered, setSuccessEntered] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nameError = submitAttempted && !name.trim();
  const phoneError = submitAttempted && !isConsultationPhoneValid(phone);
  const consentError = submitAttempted && !consent;

  useEffect(() => {
    if (open) {
      setSubmitAttempted(false);
      setSuccessStep("form");
      setSuccessEntered(false);
    }
  }, [open]);

  useEffect(() => {
    if (successStep !== "leave") return;
    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      setSuccessStep("success");
    }, FORM_SUCCESS_LEAVE_MS);
    return () => {
      if (leaveTimerRef.current != null) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
    };
  }, [successStep]);

  useEffect(() => {
    if (successStep === "form") {
      setSuccessEntered(false);
      return;
    }
    if (successStep === "success") {
      /* Уже показали на leave — не сбрасывать opacity (иначе мигание) */
      setSuccessEntered(true);
      return;
    }
    setSuccessEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSuccessEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [successStep]);

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
      aria-labelledby={
        successStep === "form" ? titleId : successTitleId
      }
      aria-modal="true"
      className={`fixed inset-0 z-[var(--z-modal)] hidden overflow-x-clip min-[1440px]:block transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[opacity] ${
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

      {/* Figma 783:9900 / 783:9919 / 783:9812: колонка по центру, gap 20px между крестиком и карточкой */}
      <div
        className="absolute inset-0 z-10 flex min-h-0 min-w-0 items-center justify-center overflow-x-clip overflow-y-auto px-4 py-2"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className={cn(
            "relative flex w-full flex-col items-center gap-[20px] transition-[max-width]",
            successStep !== "form" ? "max-w-[490px]" : "max-w-[686px]",
          )}
          style={{
            transitionDuration: `${FORM_SUCCESS_ENTER_MS}ms`,
            transitionTimingFunction: FORM_SUCCESS_EASE,
          }}
        >
          <button
            className="inline-flex size-[34px] shrink-0 self-end items-center justify-center rounded-[8px] border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
            data-testid="consultation-modal-close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>

          <div className="grid w-full [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:min-w-0">
            {(successStep === "form" || successStep === "leave") && (
              <form
                className={cn(
                  "first-screen-consultation-modal relative z-0 font-sans flex w-full flex-col gap-[36px] overflow-visible rounded-[16px] bg-white p-[30px] shadow-none will-change-[opacity]",
                  "transition-opacity",
                  successStep === "leave"
                    ? "pointer-events-none opacity-0"
                    : "opacity-100",
                )}
                style={{
                  transitionDuration: `${FORM_SUCCESS_LEAVE_MS}ms`,
                  transitionTimingFunction: FORM_SUCCESS_EASE,
                }}
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
                  setSuccessStep("leave");
                }}
              >
              <p
                className="w-full text-[40px] font-bold lowercase leading-[0.9] text-[#0d0300]"
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

              <div className="flex w-full flex-col gap-[40px]">
                <div className="flex w-full flex-col gap-[30px] min-[500px]:flex-row">
                  {/* Figma 783:10047 Default / 783:10045 Filled / 783:10043 Error */}
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
                            "flex cursor-pointer items-center gap-[12px] rounded-[8px] border border-solid border-[#9c9c9c] p-[10px] transition-colors duration-150",
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
                          {/* Figma 783:10091 Default — серый круг; 783:10094 Selected — оранжевый */}
                          <span
                            className={cn(
                              "size-[14px] shrink-0 rounded-full transition-colors duration-150",
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

                <label className="flex h-[100px] w-full flex-col box-border border-b border-solid border-[#9c9c9c] pb-[30px] pt-[10px] focus-within:border-[#0d0300]">
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

                {/* Figma 783:10080 Default / 783:10085 Selected (оранжевый + галочка) */}
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
                      "flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-solid transition-colors duration-150",
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
                className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[24px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
                style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
                type="submit"
              >
                оставить заявку
              </button>
            </form>
            )}

            {(successStep === "leave" || successStep === "success") && (
              <div
                className={cn(
                  "first-screen-consultation-modal z-10 flex w-full flex-col gap-[40px] self-start overflow-visible rounded-[16px] bg-white px-[30px] pb-[35px] pt-[30px] shadow-none will-change-[opacity,transform]",
                  "transition-[opacity,transform]",
                  successEntered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1.5 opacity-0",
                )}
                style={{
                  transitionDuration: `${FORM_SUCCESS_ENTER_MS}ms`,
                  transitionTimingFunction: FORM_SUCCESS_EASE,
                }}
              >
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
                  className="flex h-[60px] w-full shrink-0 items-center justify-center rounded-[50px] bg-[#ff5c00] px-[40px] pb-[20px] pt-[24px] text-center lowercase text-white transition-colors hover:bg-[#de4f00]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                  type="button"
                  onClick={onClose}
                >
                  вернуться
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return null;
  return createPortal(layer, document.body);
}
