import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { publicSiteUrl } from "@/shared/config/public-site-url";
import { getHomeStructuredData } from "@/shared/lib/site-structured-data";
import type { SiteSettingsData } from "@/shared/lib/get-site-settings";

const root = process.cwd();

const settings: SiteSettingsData = {
  showSecrets: true,
  showShowreel: true,
  showTeam: true,
  showNews: true,
  showCases: true,
  showServices: true,
  showLevels: true,
  tgChannelUrl: "https://t.me/soloproductionpro",
  productionBaseUrl: publicSiteUrl,
  allowIndexing: true,
  seoTitle: "Видеопродакшн для брендов и рекламы",
  seoDescription: "SEO description",
  ogTitle: "СОЛО Продакшн",
  ogDescription: "OG description",
  ogImageUrl: "/favicon.png",
  yandexMetrikaEnabled: false,
  yandexMetrikaId: "",
  yandexMetrikaWebvisor: true,
  yandexMetrikaClickmap: true,
  yandexMetrikaTrackLinks: true,
  yandexMetrikaAccurateTrackBounce: true,
};

describe("Phase 21 structured SEO pass", () => {
  it("builds Organization, WebSite and ProfessionalService JSON-LD for production URL", () => {
    const data = getHomeStructuredData(settings);
    const types = data.map((item) => item["@type"]);

    expect(types).toEqual(["Organization", "WebSite", "ProfessionalService"]);
    expect(data[0]).toMatchObject({
      "@id": `${publicSiteUrl}/#organization`,
      url: publicSiteUrl,
      sameAs: ["https://t.me/soloproductionpro"],
    });
    expect(data[1]).toMatchObject({
      "@id": `${publicSiteUrl}/#website`,
      publisher: { "@id": `${publicSiteUrl}/#organization` },
    });
    expect(data[2]).toMatchObject({
      "@id": `${publicSiteUrl}/#professional-service`,
      provider: { "@id": `${publicSiteUrl}/#organization` },
    });
  });

  it("marks email utility route responses as noindex", () => {
    const files = [
      "src/app/(site)/email/[slug]/route.ts",
      "src/app/(site)/email/[slug]/html/route.ts",
      "src/app/(site)/email/[slug]/download/route.ts",
    ];

    for (const file of files) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      expect(source, file).toContain('"X-Robots-Tag": "noindex, nofollow"');
      expect(source, file).toContain('"Cache-Control": "no-store"');
    }
  });

  it("keeps admin and preview pages out of search index", () => {
    const files = [
      "src/app/(payload)/layout.tsx",
      "src/app/(site)/preview/cases-advertising/[id]/page.tsx",
      "src/app/(site)/preview/cases-vertical/[id]/page.tsx",
    ];

    for (const file of files) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      expect(source, file).toContain("index: false");
      expect(source, file).toContain("follow: false");
    }
  });
});
