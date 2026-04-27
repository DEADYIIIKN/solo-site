"use client";

import type { Dispatch, SetStateAction } from "react";

import {
  FirstScreenConsultationModal1024
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1024";
import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant
} from "@/widgets/first-screen/model/first-screen-consultation-form-state";
import { FirstScreenHeader1024 } from "@/widgets/first-screen/ui/first-screen-header-1024";
import { FirstScreenHero1024 } from "@/widgets/first-screen/ui/first-screen-hero-1024";

type FirstScreen1024SectionProps = {
  consultationOpen: boolean;
  modalTitleVariant: FirstScreenConsultationModalTitleVariant;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  onOpenModal: (variant: FirstScreenConsultationModalTitleVariant) => void;
  onCloseModal: () => void;
  showNews: boolean;
};

export function FirstScreen1024Section({
  consultationOpen,
  modalTitleVariant,
  formState,
  setFormState,
  onOpenModal,
  onCloseModal,
  showNews,
}: FirstScreen1024SectionProps) {

  return (
    <>
      <FirstScreenHeader1024 onCtaClick={() => onOpenModal("task")} showNews={showNews} />
      <FirstScreenHero1024 onConsultationCtaClick={() => onOpenModal("consultation")} />
      <FirstScreenConsultationModal1024
        formState={formState}
        onClose={onCloseModal}
        open={consultationOpen}
        setFormState={setFormState}
        titleVariant={modalTitleVariant}
      />
    </>
  );
}
