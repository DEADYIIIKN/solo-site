"use client";

import type { Dispatch, SetStateAction } from "react";

import { FirstScreenConsultationModal360 } from "@/widgets/first-screen/ui/first-screen-consultation-modal-360";
import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import { FirstScreenHeader360 } from "@/widgets/first-screen/ui/first-screen-header-360";
import { FirstScreenHero360 } from "@/widgets/first-screen/ui/first-screen-hero-360";

type FirstScreen360SectionProps = {
  consultationOpen: boolean;
  modalTitleVariant: FirstScreenConsultationModalTitleVariant;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  onOpenModal: (variant: FirstScreenConsultationModalTitleVariant) => void;
  onCloseModal: () => void;
};

export function FirstScreen360Section({
  consultationOpen,
  modalTitleVariant,
  formState,
  setFormState,
  onOpenModal,
  onCloseModal
}: FirstScreen360SectionProps) {

  return (
    <>
      <FirstScreenHeader360 onCtaClick={() => onOpenModal("task")} />
      <FirstScreenHero360 onConsultationCtaClick={() => onOpenModal("consultation")} />
      <FirstScreenConsultationModal360
        formState={formState}
        onClose={onCloseModal}
        open={consultationOpen}
        setFormState={setFormState}
        titleVariant={modalTitleVariant}
      />
    </>
  );
}
