"use client";

import { ServicesSectionBelow1024 } from "@/widgets/services/ui/services-section-below-1024";
import { ServicesSection1024 } from "@/widgets/services/ui/services-section-1024";
import { ServicesSection1440 } from "@/widgets/services/ui/services-section-1440";

export function ServicesSection() {
  return (
    <div id="services-section">
      <ServicesSectionBelow1024 />
      <ServicesSection1024 />
      <ServicesSection1440 />
    </div>
  );
}
