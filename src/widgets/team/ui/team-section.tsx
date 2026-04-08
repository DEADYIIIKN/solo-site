"use client";

import { TeamSection1024 } from "@/widgets/team/ui/team-section-1024";
import { TeamSection1440 } from "@/widgets/team/ui/team-section-1440";
import { TeamSection360 } from "@/widgets/team/ui/team-section-360";
import { TeamSection480 } from "@/widgets/team/ui/team-section-480";
import { TeamSection768 } from "@/widgets/team/ui/team-section-768";

export function TeamSection() {
  return (
    <div id="what-we-do-section">
      <TeamSection360 />
      <TeamSection480 />
      <TeamSection768 />
      <TeamSection1024 />
      <TeamSection1440 />
    </div>
  );
}
