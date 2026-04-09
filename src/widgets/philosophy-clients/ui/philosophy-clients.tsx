"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
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
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="philosophy-section" />;
  }

  return (
    <div id="philosophy-section">
      {layout === "360" ? <PhilosophyClients360 /> : null}
      {layout === "480" ? <PhilosophyClients480 /> : null}
      {layout === "768" ? <PhilosophyClients768 /> : null}
      {layout === "1024" ? <PhilosophyClients1024 /> : null}
      {layout === "1440" ? <PhilosophyClients1440 /> : null}
    </div>
  );
}
