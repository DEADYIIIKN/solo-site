"use client";

import dynamic from "next/dynamic";
import type { Dispatch, SetStateAction } from "react";

import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant,
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
import type { ConsultationModalProps } from "@/widgets/first-screen/ui/consultation-modal";

const ConsultationModal = dynamic<ConsultationModalProps>(
  () =>
    import("@/widgets/first-screen/ui/consultation-modal").then((module) => ({
      default: module.ConsultationModal,
    })),
  { ssr: false },
);

type FirstScreenConsultationModal360Props = {
  open: boolean;
  onClose: () => void;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  titleVariant?: FirstScreenConsultationModalTitleVariant;
};

export function FirstScreenConsultationModal360(
  props: FirstScreenConsultationModal360Props,
) {
  return <ConsultationModal variant="360" {...props} />;
}
