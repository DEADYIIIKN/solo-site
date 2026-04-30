import { publicSiteUrl } from "@/shared/config/public-site-url";
import { siteConfig } from "@/shared/config/site";
import type { SiteSettingsData } from "@/shared/lib/get-site-settings";

type JsonLd = Record<string, unknown>;

function absoluteUrl(pathOrUrl: string, baseUrl: string): string {
  return new URL(pathOrUrl, `${baseUrl}/`).toString();
}

export function getHomeStructuredData(settings: SiteSettingsData): JsonLd[] {
  const baseUrl = settings.productionBaseUrl || publicSiteUrl;
  const logoUrl = absoluteUrl(siteConfig.ogImage, baseUrl);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: `${siteConfig.name} Продакшн`,
      alternateName: siteConfig.shortName,
      url: baseUrl,
      logo: logoUrl,
      sameAs: [settings.tgChannelUrl],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: ["ru"],
          url: `${baseUrl}/#lead-form-section`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: `${siteConfig.name} Продакшн`,
      url: baseUrl,
      inLanguage: "ru-RU",
      publisher: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${baseUrl}/#professional-service`,
      name: `${siteConfig.name} Продакшн`,
      url: baseUrl,
      image: logoUrl,
      description: settings.seoDescription,
      areaServed: {
        "@type": "Country",
        name: "Россия",
      },
      serviceType: ["Видеопродакшн", "Рекламные ролики", "Контент для брендов"],
      provider: {
        "@id": `${baseUrl}/#organization`,
      },
    },
  ];
}
