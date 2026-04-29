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
