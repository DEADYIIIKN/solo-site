"use client";

import type { Dispatch, SetStateAction } from "react";

import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
import { ConsultationModal } from "@/widgets/first-screen/ui/consultation-modal";

type FirstScreenConsultationModal480Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};

export function FirstScreenConsultationModal480(
  props: FirstScreenConsultationModal480Props,
) {
  return <ConsultationModal variant="480" {...props} />;
}
