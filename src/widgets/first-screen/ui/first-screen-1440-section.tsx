"use client";

import type { Dispatch, SetStateAction } from "react";

import {
  FirstScreenConsultationModal1440,
  type FirstScreenConsultationFormState,
  type FirstScreenConsultationModalTitleVariant
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import { FirstScreenHeader1440 } from "@/widgets/first-screen/ui/first-screen-header";
import { FirstScreenHero1440 } from "@/widgets/first-screen/ui/first-screen-hero-1440";

type FirstScreen1440SectionProps = {
  consultationOpen: boolean;
  modalTitleVariant: FirstScreenConsultationModalTitleVariant;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  onOpenModal: (variant: FirstScreenConsultationModalTitleVariant) => void;
  onCloseModal: () => void;
};

export function FirstScreen1440Section({
  consultationOpen,
  modalTitleVariant,
  formState,
  setFormState,
  onOpenModal,
  onCloseModal
}: FirstScreen1440SectionProps) {

  return (
    <>
      <FirstScreenHeader1440 onCtaClick={() => onOpenModal("task")} />
      <FirstScreenHero1440 onConsultationCtaClick={() => onOpenModal("consultation")} />
      <FirstScreenConsultationModal1440
        formState={formState}
        onClose={onCloseModal}
        open={consultationOpen}
        setFormState={setFormState}
        titleVariant={modalTitleVariant}
      />
    </>
  );
}
