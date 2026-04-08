"use client";

import { PhilosophyClients1024 } from "@/widgets/philosophy-clients/ui/philosophy-clients-1024";
import { PhilosophyClients1440 } from "@/widgets/philosophy-clients/ui/philosophy-clients-1440";
import { PhilosophyClients360 } from "@/widgets/philosophy-clients/ui/philosophy-clients-360";
import { PhilosophyClients480 } from "@/widgets/philosophy-clients/ui/philosophy-clients-480";
import { PhilosophyClients768 } from "@/widgets/philosophy-clients/ui/philosophy-clients-768";

/**
 * <480: Figma 783:10450.
 * 480–767: Figma 783:11225.
 * 768–1023: Figma 783:11849.
 * 1024–1439: Figma 783:8605.
 * ≥1440: Figma 783:9294.
 */
export function PhilosophyClients() {
  return (
    <div id="philosophy-section">
      <div className="hidden max-[479px]:block">
        <PhilosophyClients360 />
      </div>
      <div className="hidden min-[480px]:max-[767px]:block">
        <PhilosophyClients480 />
      </div>
      <div className="hidden min-[768px]:max-[1023px]:block">
        <PhilosophyClients768 />
      </div>
      <div className="hidden min-[1024px]:max-[1439px]:block">
        <PhilosophyClients1024 />
      </div>
      <div className="hidden min-[1440px]:block">
        <PhilosophyClients1440 />
      </div>
    </div>
  );
}
