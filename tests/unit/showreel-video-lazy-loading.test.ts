import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  getCriticalSiteLoadAssetsForViewport,
  type SiteLoadAsset,
} from "@/widgets/site-load/model/site-load-critical-assets";

const root = process.cwd();

describe("showreel video lazy loading", () => {
  it("keeps video out of critical site-load preloads", () => {
    for (const width of [360, 480, 768, 1024, 1440]) {
      const assets = getCriticalSiteLoadAssetsForViewport(width);

      expect(assets.some((asset: SiteLoadAsset) => asset.kind === "video")).toBe(false);
      expect(assets.map((asset: SiteLoadAsset) => asset.src)).not.toContain(
        "/assets/video/bts-ozon.mp4",
      );
    }
  });

  it("does not render showreel video src before intersection gate opens", () => {
    const showreelSource = fs.readFileSync(
      path.join(root, "src/widgets/showreel/ui/showreel.tsx"),
      "utf8",
    );
    const heroPosterSource = fs.readFileSync(
      path.join(root, "src/widgets/first-screen/ui/first-screen-hero-video-poster.tsx"),
      "utf8",
    );

    expect(showreelSource).toContain("IntersectionObserver");
    expect(showreelSource).toContain("hasUserScrolled");
    expect(showreelSource).toContain("shouldLoad={isVideoInView}");
    expect(showreelSource).toContain('preload="none"');
    expect(heroPosterSource).toContain("shouldLoadVideo ? videoSrc : undefined");
    expect(heroPosterSource).toContain('preload="none"');
  });
});
