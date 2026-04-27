"use client";

import type { Dispatch, SetStateAction } from "react";

import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
import { ConsultationModal } from "@/widgets/first-screen/ui/consultation-modal";

// Re-exports для обратной совместимости. Удалить в Plan 07-04 после конверсии всех импортов.
export type {
  FirstScreenConsultationContactMethod,
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
export { defaultFirstScreenConsultationFormState } from "@/widgets/first-screen/model/first-screen-consultation-form-state";

type FirstScreenConsultationModal1440Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};

export function FirstScreenConsultationModal1440(
  props: FirstScreenConsultationModal1440Props,
) {
  return <ConsultationModal variant="1440" {...props} />;
}
