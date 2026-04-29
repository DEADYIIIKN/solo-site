"use client";

import { resolveViewportLayout, type ViewportLayout } from "@/shared/lib/use-viewport-layout";
import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";

export type SiteLoadAsset = {
  kind: "image" | "video";
  src: string;
};

function uniqueAssets(assets: SiteLoadAsset[]): SiteLoadAsset[] {
  const seen = new Set<string>();
  return assets.filter(({ src }) => {
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

function getNavbarImages(layout: ViewportLayout): string[] {
  switch (layout) {
    case "360":
      return [firstScreenAssets.navbar.logo360];
    case "480":
      return [firstScreenAssets.navbar.logo480];
    case "768":
      return [firstScreenAssets.navbar.logo768];
    case "1024":
      return [firstScreenAssets.navbar.logo1024];
    case "1440":
      return [firstScreenAssets.navbar.logo1440];
  }
}

export function getCriticalSiteLoadAssets(layout: ViewportLayout): SiteLoadAsset[] {
  const images = getNavbarImages(layout).map((src) => ({
    kind: "image" as const,
    src,
  }));

  return uniqueAssets(images);
}

export function getCriticalSiteLoadAssetsForViewport(width: number): SiteLoadAsset[] {
  return getCriticalSiteLoadAssets(resolveViewportLayout(width));
}
