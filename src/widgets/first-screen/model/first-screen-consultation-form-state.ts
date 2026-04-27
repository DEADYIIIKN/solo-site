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
