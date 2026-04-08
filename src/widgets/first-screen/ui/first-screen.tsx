"use client";

import { useEffect, useState } from "react";

import { OPEN_CONSULTATION_MODAL_EVENT } from "@/shared/lib/open-consultation-modal";
import {
  defaultFirstScreenConsultationFormState
} from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import type { FirstScreenConsultationModalTitleVariant } from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";
import { FirstScreen360Section } from "@/widgets/first-screen/ui/first-screen-360-section";
import { FirstScreen480Section } from "@/widgets/first-screen/ui/first-screen-480-section";
import { FirstScreen768Section } from "@/widgets/first-screen/ui/first-screen-768-section";
import { FirstScreen1440Section } from "@/widgets/first-screen/ui/first-screen-1440-section";
import { FirstScreen1024Section } from "@/widgets/first-screen/ui/first-screen-1024-section";
import { ShowreelMorphOverlay } from "@/widgets/showreel";

export function FirstScreen() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [modalTitleVariant, setModalTitleVariant] =
    useState<FirstScreenConsultationModalTitleVariant>("task");
  const [consultationFormState, setConsultationFormState] = useState(
    defaultFirstScreenConsultationFormState,
  );

  function openConsultationModal(variant: FirstScreenConsultationModalTitleVariant) {
    setModalTitleVariant(variant);
    setConsultationOpen(true);
  }

  useEffect(() => {
    function handleExternalModalOpen(event: Event) {
      const customEvent = event as CustomEvent<{ variant?: FirstScreenConsultationModalTitleVariant }>;
      setModalTitleVariant(customEvent.detail?.variant ?? "consultation");
      setConsultationOpen(true);
    }

    window.addEventListener(OPEN_CONSULTATION_MODAL_EVENT, handleExternalModalOpen as EventListener);
    return () => {
      window.removeEventListener(
        OPEN_CONSULTATION_MODAL_EVENT,
        handleExternalModalOpen as EventListener,
      );
    };
  }, []);

  return (
    <section className="relative z-20 overflow-x-clip" id="first-screen-section">
      {/* 360: низ гео-строки ~548px + отступ до шоурила как в макете (~36px), без огромной пустой сетки */}
      <div className="relative mx-auto h-[584px] w-[360px] min-[480px]:hidden">
        <FirstScreen360Section
          consultationOpen={consultationOpen}
          formState={consultationFormState}
          modalTitleVariant={modalTitleVariant}
          onCloseModal={() => setConsultationOpen(false)}
          onOpenModal={openConsultationModal}
          setFormState={setConsultationFormState}
        />
      </div>

      {/* 480: низ гео ~639px + отступ до шоурила ~36px */}
      <div className="relative mx-auto hidden h-[676px] w-[480px] min-[480px]:block min-[768px]:hidden">
        <FirstScreen480Section
          consultationOpen={consultationOpen}
          formState={consultationFormState}
          modalTitleVariant={modalTitleVariant}
          onCloseModal={() => setConsultationOpen(false)}
          onOpenModal={openConsultationModal}
          setFormState={setConsultationFormState}
        />
      </div>

      {/* 768: низ гео ~807px + отступ до шоурила ~36px */}
      <div className="relative mx-auto hidden h-[843px] w-[768px] min-[768px]:block min-[1024px]:hidden">
        <FirstScreen768Section
          consultationOpen={consultationOpen}
          formState={consultationFormState}
          modalTitleVariant={modalTitleVariant}
          onCloseModal={() => setConsultationOpen(false)}
          onOpenModal={openConsultationModal}
          setFormState={setConsultationFormState}
        />
      </div>

      {/* 1024 version: 1024–1439 */}
      <div className="relative mx-auto hidden h-[700px] w-[1024px] min-[1024px]:block min-[1440px]:hidden">
        <FirstScreen1024Section
          consultationOpen={consultationOpen}
          formState={consultationFormState}
          modalTitleVariant={modalTitleVariant}
          onCloseModal={() => setConsultationOpen(false)}
          onOpenModal={openConsultationModal}
          setFormState={setConsultationFormState}
        />
      </div>

      {/* 1440 version: 1440+ */}
      <div className="relative mx-auto hidden h-[810px] w-[1440px] min-[1440px]:block">
        <FirstScreen1440Section
          consultationOpen={consultationOpen}
          formState={consultationFormState}
          modalTitleVariant={modalTitleVariant}
          onCloseModal={() => setConsultationOpen(false)}
          onOpenModal={openConsultationModal}
          setFormState={setConsultationFormState}
        />
      </div>

      <ShowreelMorphOverlay />
    </section>
  );
}
