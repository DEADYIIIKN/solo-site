import type { FirstScreenConsultationModalTitleVariant } from "@/widgets/first-screen/ui/first-screen-consultation-modal-1440";

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
