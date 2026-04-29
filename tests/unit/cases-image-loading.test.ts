import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const casesSectionFiles = [
  "src/widgets/cases/ui/cases-section-360.tsx",
  "src/widgets/cases/ui/cases-section-480.tsx",
  "src/widgets/cases/ui/cases-section-768.tsx",
  "src/widgets/cases/ui/cases-section-1024.tsx",
  "src/widgets/cases/ui/cases-section-1440.tsx",
] as const;

describe("cases image loading", () => {
  it("keeps referenced local raster assets pre-optimized", () => {
    const sourceFiles: string[] = [];
    const collectSourceFiles = (dir: string) => {
      for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
        const relativePath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collectSourceFiles(relativePath);
        } else if (/\.(ts|tsx|js|jsx|css|json)$/.test(entry.name)) {
          sourceFiles.push(relativePath);
        }
      }
    };
    collectSourceFiles("src");

    const refs = new Set<string>();
    const assetRefPattern = /["'](\/assets\/[^"'\s)]+)["']/g;
    for (const file of sourceFiles) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      let match: RegExpExecArray | null;
      while ((match = assetRefPattern.exec(source)) !== null) {
        refs.add(match[1]);
      }
    }

    const heavyRasterRefs = [...refs]
      .filter((assetPath) => /\.(png|jpe?g|webp|avif)$/i.test(assetPath))
      .filter((assetPath) => {
        const fullPath = path.join(root, "public", assetPath);
        return fs.existsSync(fullPath) && fs.statSync(fullPath).size > 150 * 1024;
      });

    expect(heavyRasterRefs).toEqual([]);
  });

  it("uses prebuilt AVIF card assets instead of heavy source exports", () => {
    const source = fs.readFileSync(
      path.join(root, "src/widgets/cases/model/cases.data.ts"),
      "utf8",
    );
    const caseImagePaths = [...source.matchAll(/"\/assets\/figma\/cases-1440\/[^"]+"/g)].map(
      ([path]) => path,
    );

    expect(caseImagePaths).toEqual(
      expect.arrayContaining([
        '"/assets/figma/cases-1440/optimized/vertical-callebaut.avif"',
        '"/assets/figma/cases-1440/optimized/ad-trs-motors-1.avif"',
      ]),
    );
    expect(caseImagePaths.filter((path) => path.includes("/optimized/"))).toHaveLength(8);
    expect(caseImagePaths.some((path) => path.includes("/vertical/"))).toBe(false);
    expect(caseImagePaths.some((path) => path.includes("/advertising/"))).toBe(false);
  });

  it("serves local case card images directly instead of waiting on Next image optimization", () => {
    for (const file of casesSectionFiles) {
      const source = fs.readFileSync(path.join(root, file), "utf8");
      const localCaseImageCount = [...source.matchAll(/<Image[\s\S]*?src=\{image\}/g)].length;
      const directImageCount = [...source.matchAll(/<Image[\s\S]*?unoptimized[\s\S]*?src=\{image\}/g)]
        .length;

      expect(directImageCount, file).toBe(localCaseImageCount);
    }
  });
});
