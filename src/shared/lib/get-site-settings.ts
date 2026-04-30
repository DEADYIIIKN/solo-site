import { getPayload } from "payload";
import config from "@payload-config";

import { normalizeSiteUrl, publicSiteUrl } from "@/shared/config/public-site-url";
import { siteConfig } from "@/shared/config/site";

export type SiteSettingsData = {
  showSecrets: boolean;
  showShowreel: boolean;
  showTeam: boolean;
  showNews: boolean;
  showCases: boolean;
  showServices: boolean;
  showLevels: boolean;
  tgChannelUrl: string;
  productionBaseUrl: string;
  allowIndexing: boolean;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  yandexMetrikaEnabled: boolean;
  yandexMetrikaId: string;
  yandexMetrikaWebvisor: boolean;
  yandexMetrikaClickmap: boolean;
  yandexMetrikaTrackLinks: boolean;
  yandexMetrikaAccurateTrackBounce: boolean;
};

const DEFAULTS: SiteSettingsData = {
  showSecrets: false,
  showShowreel: true,
  showTeam: true,
  showNews: true,
  showCases: true,
  showServices: true,
  showLevels: true,
  tgChannelUrl: "https://t.me/soloproductionpro",
  productionBaseUrl: publicSiteUrl,
  allowIndexing: true,
  seoTitle: siteConfig.defaultTitle,
  seoDescription: siteConfig.description,
  ogTitle: `${siteConfig.name} Продакшн`,
  ogDescription: siteConfig.ogDescription,
  ogImageUrl: siteConfig.ogImage,
  yandexMetrikaEnabled: false,
  yandexMetrikaId: "",
  yandexMetrikaWebvisor: true,
  yandexMetrikaClickmap: true,
  yandexMetrikaTrackLinks: true,
  yandexMetrikaAccurateTrackBounce: true,
};

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function siteUrl(value: unknown, fallback: string): string {
  return normalizeSiteUrl(typeof value === "string" ? value : undefined) ?? fallback;
}

/**
 * Возвращает настройки видимости секций из Payload Global.
 * При ошибке возвращает безопасные дефолты (все секции включены, кроме secrets).
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const payload = await getPayload({ config });
    const raw = await payload.findGlobal({
      slug: "site-settings",
      overrideAccess: true,
    });
    const showNews = Boolean((raw as Record<string, unknown>).showNews ?? DEFAULTS.showNews);
    return {
      showSecrets: showNews,
      showShowreel: Boolean((raw as Record<string, unknown>).showShowreel ?? DEFAULTS.showShowreel),
      showTeam: Boolean((raw as Record<string, unknown>).showTeam ?? DEFAULTS.showTeam),
      showNews,
      showCases: Boolean((raw as Record<string, unknown>).showCases ?? DEFAULTS.showCases),
      showServices: Boolean((raw as Record<string, unknown>).showServices ?? DEFAULTS.showServices),
      showLevels: Boolean((raw as Record<string, unknown>).showLevels ?? DEFAULTS.showLevels),
      tgChannelUrl: text((raw as Record<string, unknown>).tgChannelUrl, DEFAULTS.tgChannelUrl),
      productionBaseUrl: siteUrl((raw as Record<string, unknown>).productionBaseUrl, DEFAULTS.productionBaseUrl),
      allowIndexing: Boolean((raw as Record<string, unknown>).allowIndexing ?? DEFAULTS.allowIndexing),
      seoTitle: text((raw as Record<string, unknown>).seoTitle, DEFAULTS.seoTitle),
      seoDescription: text((raw as Record<string, unknown>).seoDescription, DEFAULTS.seoDescription),
      ogTitle: text((raw as Record<string, unknown>).ogTitle, DEFAULTS.ogTitle),
      ogDescription: text((raw as Record<string, unknown>).ogDescription, DEFAULTS.ogDescription),
      ogImageUrl: text((raw as Record<string, unknown>).ogImageUrl, DEFAULTS.ogImageUrl),
      yandexMetrikaEnabled: Boolean(
        (raw as Record<string, unknown>).yandexMetrikaEnabled ?? DEFAULTS.yandexMetrikaEnabled,
      ),
      yandexMetrikaId: text((raw as Record<string, unknown>).yandexMetrikaId, DEFAULTS.yandexMetrikaId),
      yandexMetrikaWebvisor: Boolean(
        (raw as Record<string, unknown>).yandexMetrikaWebvisor ?? DEFAULTS.yandexMetrikaWebvisor,
      ),
      yandexMetrikaClickmap: Boolean(
        (raw as Record<string, unknown>).yandexMetrikaClickmap ?? DEFAULTS.yandexMetrikaClickmap,
      ),
      yandexMetrikaTrackLinks: Boolean(
        (raw as Record<string, unknown>).yandexMetrikaTrackLinks ?? DEFAULTS.yandexMetrikaTrackLinks,
      ),
      yandexMetrikaAccurateTrackBounce: Boolean(
        (raw as Record<string, unknown>).yandexMetrikaAccurateTrackBounce ??
          DEFAULTS.yandexMetrikaAccurateTrackBounce,
      ),
    };
  } catch {
    return DEFAULTS;
  }
}
