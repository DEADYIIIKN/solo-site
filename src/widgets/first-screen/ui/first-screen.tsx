import type { CSSProperties } from "react";

import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";
import { FirstScreenHeader } from "@/widgets/first-screen/ui/first-screen-header";
import { FirstScreenHero } from "@/widgets/first-screen/ui/first-screen-hero";

export function FirstScreen() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-base-black)]"
      style={
        {
          ["--first-screen-grid-image" as string]: `url("${firstScreenAssets.backgroundGrid}")`
        } as CSSProperties
      }
    >
      <div className="first-screen-grid absolute inset-0 z-0" />
      <div className="first-screen-glow first-screen-glow--left absolute z-0" />
      <div className="first-screen-glow first-screen-glow--center absolute z-0" />
      <div className="first-screen-glow first-screen-glow--cta absolute z-0 hidden min-[768px]:block" />

      <FirstScreenHeader />
      <FirstScreenHero />
    </section>
  );
}
