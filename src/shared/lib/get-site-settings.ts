import { getPayload } from "payload";
import config from "@payload-config";

export type SiteSettingsData = {
  showSecrets: boolean;
  showShowreel: boolean;
  showTeam: boolean;
  showNews: boolean;
  showCases: boolean;
  showServices: boolean;
  showLevels: boolean;
};

const DEFAULTS: SiteSettingsData = {
  showSecrets: false,
  showShowreel: true,
  showTeam: true,
  showNews: true,
  showCases: true,
  showServices: true,
  showLevels: true,
};

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
    };
  } catch {
    return DEFAULTS;
  }
}
