import type { MetadataRoute } from "next";

import { publicSiteUrl } from "@/shared/config/public-site-url";
import { getSiteSettings } from "@/shared/lib/get-site-settings";

export const revalidate = 60;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = settings.productionBaseUrl || publicSiteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: settings.allowIndexing ? "/" : undefined,
        disallow: settings.allowIndexing ? ["/admin", "/api", "/preview"] : "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
