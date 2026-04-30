import fs from "node:fs";
import path from "node:path";

import { describe, expect, it, vi } from "vitest";

import { publicSiteUrl } from "@/shared/config/public-site-url";

vi.mock("@/shared/lib/get-site-settings", () => ({
  getSiteSettings: async () => ({
    productionBaseUrl: publicSiteUrl,
    allowIndexing: true,
  }),
}));

const root = process.cwd();

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Phase 18 a11y and SEO hygiene", () => {
  it("uses AA-safe foreground greys instead of #9c9c9c text", () => {
    const files = [
      "src/widgets/footer/ui/footer-360.tsx",
      "src/widgets/footer/ui/footer-480.tsx",
      "src/widgets/footer/ui/footer-768.tsx",
      "src/widgets/footer/ui/footer-1024.tsx",
      "src/widgets/footer/ui/footer-1440.tsx",
      "src/widgets/levels/ui/levels-section-below-1024.tsx",
      "src/widgets/levels/ui/levels-section-1024.tsx",
      "src/widgets/levels/ui/levels-section-1440.tsx",
      "src/app/(site)/privacy/page.tsx",
    ];

    for (const file of files) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      expect(source, file).not.toContain("text-[#9c9c9c]");
      expect(source, file).not.toContain('color: "#9c9c9c"');
    }

    expect(contrastRatio("#c8c3bf", "#0d0300")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#5e524d", "#fff8f2")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#5e524d", "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });

  it("makes /privacy crawlable and canonical", async () => {
    const privacySource = fs.readFileSync(
      path.join(root, "src/app/(site)/privacy/page.tsx"),
      "utf8",
    );

    expect(privacySource).toContain('canonical: "/privacy"');
    expect(privacySource).toContain("robots: { index: true, follow: true }");
    const { default: sitemap } = await import("@/app/sitemap");
    expect((await sitemap()).map((entry) => entry.url)).toContain(`${publicSiteUrl}/privacy`);
  });
});
