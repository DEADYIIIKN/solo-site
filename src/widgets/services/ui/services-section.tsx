"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { ServicesSectionBelow1024 } from "@/widgets/services/ui/services-section-below-1024";
import { ServicesSection1024 } from "@/widgets/services/ui/services-section-1024";
import { ServicesSection1440 } from "@/widgets/services/ui/services-section-1440";

export function ServicesSection() {
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="services-section" />;
  }

  return (
    <div id="services-section">
      {layout === "1440" ? <ServicesSection1440 /> : null}
      {layout === "1024" ? <ServicesSection1024 /> : null}
      {layout === "768" || layout === "480" || layout === "360" ? <ServicesSectionBelow1024 /> : null}
    </div>
  );
}
