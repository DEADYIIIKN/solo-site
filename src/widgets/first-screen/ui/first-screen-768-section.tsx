"use client";

import type { Dispatch, SetStateAction } from "react";

import { FirstScreenConsultationModal768 } from "@/widgets/first-screen/ui/first-screen-consultation-modal-768";
import type {
  FirstScreenConsultationFormState,
  FirstScreenConsultationModalTitleVariant
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import { FirstScreenHeader768 } from "@/widgets/first-screen/ui/first-screen-header-768";
import { FirstScreenHero768 } from "@/widgets/first-screen/ui/first-screen-hero-768";

type FirstScreen768SectionProps = {
  consultationOpen: boolean;
  modalTitleVariant: FirstScreenConsultationModalTitleVariant;
  formState: FirstScreenConsultationFormState;
  setFormState: Dispatch<SetStateAction<FirstScreenConsultationFormState>>;
  onOpenModal: (variant: FirstScreenConsultationModalTitleVariant) => void;
  onCloseModal: () => void;
  showNews: boolean;
};

export function FirstScreen768Section({
  consultationOpen,
  modalTitleVariant,
  formState,
  setFormState,
  onOpenModal,
  onCloseModal,
  showNews,
}: FirstScreen768SectionProps) {

  return (
    <>
      <FirstScreenHeader768 onCtaClick={() => onOpenModal("task")} showNews={showNews} />
      <FirstScreenHero768 onConsultationCtaClick={() => onOpenModal("consultation")} />
      <FirstScreenConsultationModal768
        formState={formState}
        onClose={onCloseModal}
        open={consultationOpen}
        setFormState={setFormState}
        titleVariant={modalTitleVariant}
      />
    </>
  );
}
