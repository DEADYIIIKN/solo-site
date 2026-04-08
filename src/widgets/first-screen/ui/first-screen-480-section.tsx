"use client";

import type { Dispatch, SetStateAction } from "react";

import { FirstScreenConsultationModal480 } from "@/widgets/first-screen/ui/first-screen-consultation-modal-480";
import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import { FirstScreenHeader480 } from "@/widgets/first-screen/ui/first-screen-header-480";
import { FirstScreenHero480 } from "@/widgets/first-screen/ui/first-screen-hero-480";

type FirstScreen480SectionProps = {
  consultationOpen: boolean;
  modalTitleVariant: FirstScreenConsultationModalTitleVariant;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  onOpenModal: (variant: FirstScreenConsultationModalTitleVariant) => void;
  onCloseModal: () => void;
};

export function FirstScreen480Section({
  consultationOpen,
  modalTitleVariant,
  formState,
  setFormState,
  onOpenModal,
  onCloseModal
}: FirstScreen480SectionProps) {

  return (
    <>
      <FirstScreenHeader480 onCtaClick={() => onOpenModal("task")} />
      <FirstScreenHero480 onConsultationCtaClick={() => onOpenModal("consultation")} />
      <FirstScreenConsultationModal480
        formState={formState}
        onClose={onCloseModal}
        open={consultationOpen}
        setFormState={setFormState}
        titleVariant={modalTitleVariant}
      />
    </>
  );
}
