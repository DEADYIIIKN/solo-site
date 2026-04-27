import type { FirstScreenConsultationModalTitleVariant } from "@/widgets/first-screen/model/first-screen-consultation-form-state";

export const OPEN_CONSULTATION_MODAL_EVENT = "open-consultation-modal" as const;

export function dispatchOpenConsultationModal(
  variant: FirstScreenConsultationModalTitleVariant = "task",
) {
  window.dispatchEvent(
    new CustomEvent(OPEN_CONSULTATION_MODAL_EVENT, {
      detail: { variant },
    }),
  );
}
