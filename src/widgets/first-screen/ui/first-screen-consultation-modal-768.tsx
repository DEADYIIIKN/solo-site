"use client";

import type { Dispatch, SetStateAction } from "react";

import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
import { ConsultationModal } from "@/widgets/first-screen/ui/consultation-modal";

type FirstScreenConsultationModal768Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};

export function FirstScreenConsultationModal768(
  props: FirstScreenConsultationModal768Props,
) {
  return <ConsultationModal variant="768" {...props} />;
}
