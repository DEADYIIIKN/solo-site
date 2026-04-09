"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { TeamSection1024 } from "@/widgets/team/ui/team-section-1024";
import { TeamSection1440 } from "@/widgets/team/ui/team-section-1440";
import { TeamSection360 } from "@/widgets/team/ui/team-section-360";
import { TeamSection480 } from "@/widgets/team/ui/team-section-480";
import { TeamSection768 } from "@/widgets/team/ui/team-section-768";

export function TeamSection() {
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="what-we-do-section" />;
  }

  return (
    <div id="what-we-do-section">
      {layout === "360" ? <TeamSection360 /> : null}
      {layout === "480" ? <TeamSection480 /> : null}
      {layout === "768" ? <TeamSection768 /> : null}
      {layout === "1024" ? <TeamSection1024 /> : null}
      {layout === "1440" ? <TeamSection1440 /> : null}
    </div>
  );
}
