"use client";

import { useEffect, useState } from "react";

import { OPEN_CONSULTATION_MODAL_EVENT } from "@/shared/lib/open-consultation-modal";
import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
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
  const layout = useViewportLayout();
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

  if (!layout) {
    return (
      <section className="relative z-20 overflow-x-clip" id="first-screen-section">
        <ShowreelMorphOverlay />
      </section>
    );
  }

  return (
    <section className="relative z-20 overflow-x-clip" id="first-screen-section">
      {layout === "360" ? (
        <div className="relative mx-auto h-[584px] w-[360px]">
          <FirstScreen360Section
            consultationOpen={consultationOpen}
            formState={consultationFormState}
            modalTitleVariant={modalTitleVariant}
            onCloseModal={() => setConsultationOpen(false)}
            onOpenModal={openConsultationModal}
            setFormState={setConsultationFormState}
          />
        </div>
      ) : null}

      {layout === "480" ? (
        <div className="relative mx-auto h-[676px] w-[480px]">
          <FirstScreen480Section
            consultationOpen={consultationOpen}
            formState={consultationFormState}
            modalTitleVariant={modalTitleVariant}
            onCloseModal={() => setConsultationOpen(false)}
            onOpenModal={openConsultationModal}
            setFormState={setConsultationFormState}
          />
        </div>
      ) : null}

      {layout === "768" ? (
        <div className="relative mx-auto h-[843px] w-[768px]">
          <FirstScreen768Section
            consultationOpen={consultationOpen}
            formState={consultationFormState}
            modalTitleVariant={modalTitleVariant}
            onCloseModal={() => setConsultationOpen(false)}
            onOpenModal={openConsultationModal}
            setFormState={setConsultationFormState}
          />
        </div>
      ) : null}

      {layout === "1024" ? (
        <div className="relative mx-auto h-[700px] w-[1024px]">
          <FirstScreen1024Section
            consultationOpen={consultationOpen}
            formState={consultationFormState}
            modalTitleVariant={modalTitleVariant}
            onCloseModal={() => setConsultationOpen(false)}
            onOpenModal={openConsultationModal}
            setFormState={setConsultationFormState}
          />
        </div>
      ) : null}

      {layout === "1440" ? (
        <div className="relative mx-auto h-[810px] w-[1440px]">
          <FirstScreen1440Section
            consultationOpen={consultationOpen}
            formState={consultationFormState}
            modalTitleVariant={modalTitleVariant}
            onCloseModal={() => setConsultationOpen(false)}
            onOpenModal={openConsultationModal}
            setFormState={setConsultationFormState}
          />
        </div>
      ) : null}

      <ShowreelMorphOverlay />
    </section>
  );
}
