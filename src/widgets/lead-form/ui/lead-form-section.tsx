"use client";

import { LeadForm1024 } from "@/widgets/lead-form/ui/lead-form-1024";
import { LeadForm1440 } from "@/widgets/lead-form/ui/lead-form-1440";
import { LeadForm768 } from "@/widgets/lead-form/ui/lead-form-768";
import { LeadFormBelow1024 } from "@/widgets/lead-form/ui/lead-form-below-1024";

/** Блок лида: одна семантическая секция на странице, варианты по брейкпоинтам. */
export function LeadFormSection() {
  return (
    <div id="lead-form-section">
      <LeadForm1440 />
      <LeadForm1024 />
      <LeadForm768 />
      <LeadFormBelow1024 />
    </div>
  );
}
