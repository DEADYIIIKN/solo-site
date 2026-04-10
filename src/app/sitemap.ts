import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/shared/config/public-site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: publicSiteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
