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
