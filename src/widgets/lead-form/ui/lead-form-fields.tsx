"use client";

import { useId, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Modal } from "@/shared/ui/modal";
import {
  formatConsultationPhone,
  formatConsultationPhoneBackspace,
  isConsultationPhoneValid,
} from "@/widgets/first-screen/model/first-screen-consultation-form";
import {
  type FirstScreenConsultationContactMethod,
  type FirstScreenConsultationFormState,
  defaultFirstScreenConsultationFormState,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";

const contactOptions: {
  id: FirstScreenConsultationContactMethod;
  label: string;
}[] = [
  { id: "call", label: "Позвонить" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
];

/** Как в FirstScreenConsultationModal — белая галочка на оранжевом фоне */
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

export type LeadFormFieldsDensity =
  | "1440"
  | "1024"
  | "768"
  | "480"
  | "360"
  /** Один столбец до 1023px: типографика через max-width breakpoints */
  | "below1024";

/** Figma: 783:9087/9088 (1440), 783:8372/8373 (1024), 783:10346 (mobile) — Interface element: pb 20 pt 10.
 *  09-01 LF-DRIFT-01: на below1024 (≤767px) Figma 783:10314 (input h=38) / 783:10873 (input h=40)
 *  требуют меньшего вертикального padding — pb=14 pt=6 даёт total ≈ text 1.2em + 20 ≈ 38..40px. */
function leadUnderlinePadding(density: LeadFormFieldsDensity): string {
  if (density === "below1024" || density === "480" || density === "360") {
    return "pb-[14px] pt-[6px]";
  }
  return "pb-[20px] pt-[10px]";
}

/** Figma: 783:9092–9094 (1440), 783:8377–8379 (1024) — p-[10px] */
function leadRadioChipPadding(): string {
  return "p-[10px]";
}

const densityMap: Record<
  LeadFormFieldsDensity,
  {
    formTitle: string;
    body: string;
    input: string;
    contactQ: string;
    contactOpt: string;
    messageH: string;
    consent: string;
    btn: string;
    btnH: string;
  }
> = {
  "1440": {
    formTitle: "text-[24px]",
    body: "text-[16px]",
    input: "text-[16px]",
    contactQ: "text-[16px]",
    contactOpt: "text-[14px]",
    messageH: "h-[100px]",
    consent: "text-[14px]",
    btn: "text-[16px]",
    btnH: "min-h-[59px]",
  },
  "1024": {
    formTitle: "text-[20px]",
    body: "text-[14px]",
    input: "text-[16px]",
    contactQ: "text-[16px]",
    contactOpt: "text-[14px]",
    messageH: "h-[100px]",
    consent: "text-[14px]",
    btn: "text-[16px]",
    /* Figma 783:8382: высота кнопки 56px; padding по вертикали через flex + h-[56px] */
    btnH: "h-[56px] min-h-[56px]",
  },
  "768": {
    formTitle: "text-[18px]",
    body: "text-[13px]",
    input: "text-[14px]",
    contactQ: "text-[16px]",
    contactOpt: "text-[14px]",
    messageH: "h-[100px]",
    consent: "text-[13px]",
    btn: "text-[16px]",
    btnH: "min-h-[52px]",
  },
  "480": {
    formTitle: "text-[16px]",
    body: "text-[12px]",
    input: "text-[12px]",
    contactQ: "text-[12px]",
    contactOpt: "text-[12px]",
    messageH: "h-[80px]",
    consent: "text-[11px]",
    btn: "text-[13px]",
    btnH: "min-h-[44px]",
  },
  "360": {
    formTitle: "text-[16px]",
    body: "text-[12px]",
    input: "text-[12px]",
    contactQ: "text-[12px]",
    contactOpt: "text-[12px]",
    messageH: "h-[80px]",
    consent: "text-[11px]",
    btn: "text-[13px]",
    btnH: "min-h-[44px]",
  },
  below1024: {
    formTitle: "text-[18px] max-[479px]:text-[16px]",
    body: "text-[13px] max-[479px]:text-[12px]",
    input: "text-[14px] max-[479px]:text-[12px]",
    contactQ: "text-[16px] max-[479px]:text-[12px]",
    contactOpt: "text-[14px] max-[479px]:text-[12px]",
    messageH: "h-[100px] max-[479px]:h-[80px]",
    consent: "text-[13px] max-[479px]:text-[11px]",
    btn: "text-[16px] max-[479px]:text-[13px]",
    btnH: "min-h-[52px] max-[479px]:min-h-[44px]",
  },
};

export function LeadFormFields({
  density,
  contactLayout,
  className,
  /** Только поля: без шапки «Это бесплатно» и без внешней тёмной карточки (Figma 783:10315 / 783:10874). */
  embedInCard = false,
  source,
}: {
  density: LeadFormFieldsDensity;
  contactLayout: "radio" | "pill";
  className?: string;
  embedInCard?: boolean;
  /**
   * Источник заявки для аналитики, передаётся в API /api/leads.
   * Примеры: "lead-form", "hero-cta", "header-cta", "services-cta", "consultation-modal".
   */
  source: string;
}) {
  const d = densityMap[density];
  const consentId = useId();
  const [formState, setFormState] = useState<FirstScreenConsultationFormState>(
    defaultFirstScreenConsultationFormState,
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { name, phone, message, contactMethod, consent } = formState;

  const nameError = submitAttempted && !name.trim();
  const phoneError = submitAttempted && !isConsultationPhoneValid(phone);
  const consentError = submitAttempted && !consent;

  return (
    <form
      data-testid="lead-form"
      className={cn(
      !embedInCard &&
        cn(
          "flex min-h-0 flex-col bg-[#0d0300]",
          /* Figma 783:11522 (768): gap-30 между шапкой и полями (нет justify-between, нет фикс. высоты).
             Остальные: justify-between + h-full (1024: h-550, 1440: min-h-608). */
          density === "768" ? "gap-[30px]" : "h-full justify-between",
        ),
      /* rounded: 783:9081→30, 783:8366→20, 783:11522→20, below1024→30 */
      !embedInCard && density === "1440" && "rounded-[30px]",
      !embedInCard && density === "1024" && "rounded-[20px]",
      !embedInCard && density === "768" && "rounded-[20px]",
      !embedInCard && density === "below1024" && "rounded-[30px]",
      embedInCard && "flex w-full min-h-0 flex-col justify-start gap-0 bg-transparent",
      /* Figma 783:9081 p 30; 783:8366 1024: pt 24 px 24 pb 36; 783:11522 768: px 20 pt 20 pb 24 */
      !embedInCard &&
        density === "1440" &&
        "min-h-[608px] w-full max-w-[470px] gap-[30px] p-[30px]",
      !embedInCard &&
        density === "1024" &&
        /* Figma 783:8366: h 550, pt 24 px 24 pb 36; gap между полями — во внутреннем столбце 783:8370, не на form */
        "h-[550px] w-full max-w-[466px] flex-col px-6 pb-9 pt-6",
      !embedInCard &&
        density === "768" &&
        /* Figma 783:11522: w 360 px 20 pt 20 pb 24 */
        "w-full px-[20px] pb-[24px] pt-[20px]",
      !embedInCard &&
        density === "below1024" &&
        /* 09-01 LF-DRIFT-01: max-[479px] gap-4 (16px) уменьшает cumulative drift на 360
           между header «Это бесплатно» и middle-column (Figma «Это бесплатно» → name ≈ 60px,
           что включает «Мы дадим...» body text 14.4 + gap-10 + name padding). */
        "w-full max-w-[520px] gap-6 p-6 max-[767px]:max-w-none max-[479px]:gap-4 max-[479px]:p-4",
        className,
      )}
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitAttempted(true);
        if (!name.trim() || !isConsultationPhoneValid(phone) || !consent) return;
        if (submitting) return;
        setSubmitting(true);
        setSubmitError(null);
        // Client-side debounce (D3): защита от двойного клика; разлочиваем через 5с минимум.
        const debounceTimer = setTimeout(() => setSubmitting(false), 5000);
        try {
          const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              phone,
              message,
              consent,
              contactMethod,
              source,
            }),
          });
          if (res.ok) {
            // 2xx — success даже если accepted:false (rate-limit) per D4 compromise
            setSuccessOpen(true);
            setFormState(defaultFirstScreenConsultationFormState);
            setSubmitAttempted(false);
          } else {
            // 4xx/5xx — true error UX (D4: только 500 реально показывается на проде)
            setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.");
          }
        } catch {
          setSubmitError("Проблема со связью. Попробуйте ещё раз.");
        } finally {
          clearTimeout(debounceTimer);
          setSubmitting(false);
        }
      }}
    >
      {!embedInCard && (
        <div
          className={cn(
            "flex flex-col text-white",
            /* Figma 783:9082 (1440) gap-12; 783:8367 (1024) gap-12; 783:11523 (768) gap-10;
               09-01: below1024 — gap-10 matches Figma 783:10314 / 783:10873 (mobile) */
            density === "768" ||
            density === "480" ||
            density === "360" ||
            density === "below1024"
              ? "gap-[10px]"
              : "gap-[12px]",
          )}
        >
          <p className={cn("m-0 font-bold leading-[1.3]", d.formTitle)}>
            Это абсолютно бесплатно.{" "}
          </p>
          <p className={cn("m-0 font-normal leading-[1.2]", d.body)}>
            Мы дадим вам понимание, как контент может приносить результат вашему бизнесу.
          </p>
        </div>
      )}

      <div
        className={cn(
          "flex min-h-0 flex-col",
          /* 783:9085 gap 30 (1440); 783:8370 gap 24 (1024).
             09-01: below1024 на ≤479px — gap уменьшен до 20px для устранения cumulative drift
             (Figma 783:10314 имеет более плотную упаковку rows). */
            embedInCard
              ? density === "below1024"
                ? "gap-6 max-[479px]:gap-5"
                : "gap-6"
              : density === "1440"
                ? "gap-[30px]"
                : density === "below1024"
                  ? "gap-6 max-[479px]:gap-5"
                  : "gap-6",
        )}
      >
        <div
          className={cn(
            "flex w-full max-[1023px]:flex-col max-[1023px]:gap-6",
            embedInCard ? "gap-6" : density === "1440" ? "gap-[30px]" : "gap-6",
          )}
        >
          <label
            className={cn(
              "flex min-h-0 min-w-0 flex-1 flex-col border-b border-solid transition-colors duration-150",
              leadUnderlinePadding(density),
              nameError ? "border-[#e63a24]" : "border-[#9c9c9c] focus-within:border-white",
            )}
          >
            <span className="sr-only">Ваше имя</span>
            <input
              data-testid="lead-form-name"
              aria-invalid={nameError}
              autoComplete="name"
              className={cn(
                /* h-[1.2em]: UA-стайлшит растягивает input до ~24px; фиксируем высоту = line-height (Figma pb=20 → зазор от текста до линии = 20px) */
                "m-0 h-[1.2em] w-full border-0 bg-transparent p-0 font-normal leading-[1.2] outline-none placeholder:text-[#9c9c9c] focus-visible:outline-none focus-visible:outline-offset-0",
                d.input,
                nameError ? "text-[#e63a24] placeholder:text-[#e63a24]/70" : "text-white",
              )}
              name="lead-name"
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
              "flex min-h-0 min-w-0 flex-1 flex-col border-b border-solid transition-colors duration-150",
              leadUnderlinePadding(density),
              phoneError ? "border-[#e63a24]" : "border-[#9c9c9c] focus-within:border-white",
            )}
          >
            <span className="sr-only">Номер телефона</span>
            <input
              data-testid="lead-form-phone"
              aria-invalid={phoneError}
              autoComplete="tel"
              className={cn(
                "m-0 h-[1.2em] w-full border-0 bg-transparent p-0 font-normal leading-[1.2] outline-none placeholder:text-[#9c9c9c] focus-visible:outline-none focus-visible:outline-offset-0",
                d.input,
                phoneError ? "text-[#e63a24] placeholder:text-[#e63a24]/70" : "text-white",
              )}
              inputMode="tel"
              maxLength={18}
              name="lead-phone"
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  phone: formatConsultationPhone(e.target.value),
                }))
              }
              onKeyDown={(e) => {
                if (e.key !== "Backspace") return;
                if (e.currentTarget.selectionStart !== e.currentTarget.selectionEnd) return;
                const next = formatConsultationPhoneBackspace(
                  phone,
                  e.currentTarget.selectionStart ?? 0,
                );
                if (next == null) return;
                e.preventDefault();
                setFormState((prev) => ({ ...prev, phone: next }));
              }}
              placeholder="Номер телефона"
              type="tel"
              value={phone}
            />
          </label>
        </div>

        <div className="flex flex-col gap-[12px]">
          <p className={cn("m-0 font-bold leading-[1.25] text-white", d.contactQ)}>
            Как удобнее связаться?
          </p>
          {contactLayout === "radio" ? (
            <div
              className={cn(
                "flex flex-nowrap max-[1023px]:flex-wrap max-[1023px]:gap-3",
                /* 783:9091 gap 16; 783:8376 gap 12 */
                density === "1024" ? "gap-3" : "gap-4",
              )}
            >
              {contactOptions.map((opt) => {
                const selected = contactMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-[8px] border border-solid border-[#9c9c9c] transition-colors duration-150",
                      leadRadioChipPadding(),
                      "hover:bg-white/[0.06]",
                    )}
                  >
                    <input
                      checked={selected}
                      className="sr-only"
                      name="lead-contact"
                      onChange={() =>
                        setFormState((prev) => ({ ...prev, contactMethod: opt.id }))
                      }
                      type="radio"
                      value={opt.id}
                    />
                    <span
                      className={cn(
                        "size-[14px] shrink-0 rounded-full transition-colors duration-150",
                        selected ? "bg-[#ff5c00]" : "bg-[#9c9c9c]",
                      )}
                    />
                    <span className="flex flex-col justify-center leading-[0]">
                      <span
                        className={cn(
                          "whitespace-nowrap leading-[1.2] text-white",
                          d.contactOpt,
                        )}
                      >
                        {opt.label}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="flex w-full flex-nowrap gap-3">
              {contactOptions.map((opt) => {
                const selected = contactMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={cn(
                      /* Figma 783:10351–783:10355 px 12 py 14; py-13 (не 14) — компенсация border 1px:
                         Figma border = inside-stroke (не влияет на frame), browser border-box добавляет 2px к height.
                         13+13.8×1.2+13+2 ≈ 44.8px = Figma 45px */
                      "whitespace-nowrap rounded-[6px] border px-3 py-[13px] font-normal transition-colors duration-150",
                      d.contactOpt,
                      /* leading после text-size: иначе tailwind-merge v3 удаляет leading (см. leading vs text-[*] conflict) */
                      "leading-[1.2]",
                      selected
                        ? "border-[#ff5c00] bg-[#ff5c00] text-white"
                        : "border-[#9c9c9c] bg-transparent text-white hover:bg-white/[0.06]",
                    )}
                    onClick={() =>
                      setFormState((prev) => ({ ...prev, contactMethod: opt.id }))
                    }
                    type="button"
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label
          className={cn(
            "flex w-full flex-col box-border border-b border-solid border-[#9c9c9c] transition-colors duration-150 focus-within:border-white",
            /* 09-01 LF-DRIFT-01: below1024/480/360 — Figma textarea-end → checkbox gap≈24..29
               (783:10314 textarea y=683+80=763, checkbox y=787 → 24).
               Уменьшаем pb на mobile, чтобы не накапливать drift. */
            density === "below1024" || density === "480" || density === "360"
              ? "pb-[14px] pt-[6px]"
              : "pb-[30px] pt-[10px]",
            d.messageH,
          )}
        >
          <span className="sr-only">Описание задачи</span>
          <textarea
            data-testid="lead-form-message"
            className={cn(
              "m-0 min-h-0 w-full flex-1 resize-none border-0 bg-transparent p-0 font-normal leading-[1.2] text-white outline-none placeholder:text-[#9c9c9c] focus-visible:outline-none focus-visible:outline-offset-0",
              d.input,
            )}
            name="lead-message"
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Если хотите, опишите задачу — так мы сможем подготовиться к разговору"
            value={message}
          />
        </label>

        {/* input снаружи label — иначе часть инструментов/а11и дублирует имя подписи; Figma 783:9096 — items-center */}
        <div
          className={cn(
            "flex min-w-0 gap-[12px]",
            density === "1440" || density === "1024" || density === "768" || density === "below1024"
              ? "items-center"
              : "items-start",
          )}
        >
          <input
            data-testid="lead-form-consent"
            aria-invalid={consentError}
            checked={consent}
            className="sr-only"
            id={consentId}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, consent: e.target.checked }))
            }
            type="checkbox"
          />
          <label
            className={cn(
              "flex min-w-0 flex-1 cursor-pointer gap-[12px]",
              density === "1440" || density === "1024" || density === "768" || density === "below1024"
                ? "items-center"
                : "items-start",
            )}
            htmlFor={consentId}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-solid transition-colors duration-150",
                density !== "1440" &&
                  density !== "1024" &&
                  density !== "768" &&
                  density !== "below1024" &&
                  "mt-0.5",
                consentError
                  ? "border-[#e63a24] bg-transparent"
                  : consent
                    ? "border-[#ff5c00] bg-[#ff5c00]"
                    : "border-[#9c9c9c] bg-transparent",
              )}
            >
              {consent ? <CheckboxCheckIcon /> : null}
            </span>
            <span className={cn("min-w-0 leading-[1.2] text-white opacity-90", d.consent)}>
              Согласен(на) на обработку персональных данных в соответствии с{" "}
              <a
                className="underline decoration-solid [text-decoration-skip-ink:none]"
                href="/privacy"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Политикой конфиденциальности
              </a>
            </span>
          </label>
        </div>

        {submitError && (
          <p
            role="alert"
            data-testid="lead-form-error"
            className={cn("m-0 leading-[1.2] text-[#e63a24]", d.consent)}
          >
            {submitError}
          </p>
        )}

        <button
          data-testid="lead-form-submit"
          disabled={submitting}
          className={cn(
            "flex w-full items-center justify-center rounded-[50px] border-0 bg-[#ff5c00] px-10 font-semibold lowercase text-white transition-colors hover:bg-[#de4f00]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            d.btn,
            d.btnH,
          )}
          type="submit"
        >
          {submitting ? "отправляем…" : "оставить заявку"}
        </button>
      </div>

      <Modal
        description="Мы получили вашу заявку и скоро свяжемся с вами, чтобы обсудить детали"
        onOpenChange={setSuccessOpen}
        open={successOpen}
        title="скоро вернемся!"
      >
        <button
          className="flex h-[56px] w-full shrink-0 items-center justify-center rounded-[50px] border-0 bg-[#ff5c00] px-[40px] pb-[20px] pt-[22px] text-center text-[16px] font-semibold lowercase leading-[1.2] text-white transition-colors hover:bg-[#de4f00]"
          onClick={() => setSuccessOpen(false)}
          type="button"
        >
          вернуться
        </button>
      </Modal>
    </form>
  );
}
