"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { LeadForm1024 } from "@/widgets/lead-form/ui/lead-form-1024";
import { LeadForm1440 } from "@/widgets/lead-form/ui/lead-form-1440";
import { LeadForm768 } from "@/widgets/lead-form/ui/lead-form-768";
import { LeadFormBelow1024 } from "@/widgets/lead-form/ui/lead-form-below-1024";

/** Блок лида: одна семантическая секция на странице, варианты по брейкпоинтам. */
export function LeadFormSection() {
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="lead-form-section" />;
  }

  return (
    <div id="lead-form-section">
      {layout === "1440" ? <LeadForm1440 /> : null}
      {layout === "1024" ? <LeadForm1024 /> : null}
      {layout === "768" ? <LeadForm768 /> : null}
      {layout === "480" || layout === "360" ? <LeadFormBelow1024 /> : null}
    </div>
  );
}
