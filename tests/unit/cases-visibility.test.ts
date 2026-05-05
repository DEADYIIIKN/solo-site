import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

const verticalCollection = fs.readFileSync(
  path.join(root, "src/cms/collections/cases-vertical.ts"),
  "utf8",
);
const advertisingCollection = fs.readFileSync(
  path.join(root, "src/cms/collections/cases-advertising.ts"),
  "utf8",
);
const getCasesForSite = fs.readFileSync(
  path.join(root, "src/widgets/cases/lib/get-cases-for-site.ts"),
  "utf8",
);

describe("cases visibility toggle", () => {
  it("exposes a visible toggle in both Payload case lists", () => {
    for (const source of [verticalCollection, advertisingCollection]) {
      expect(source).toContain('name: "isVisible"');
      expect(source).toContain('defaultValue: true');
      expect(source).toContain('"isVisible"');
      expect(source).toContain('label: "Показывать на сайте"');
    }
  });

  it("keeps the editable title column first so Payload list rows can open records", () => {
    expect(verticalCollection).toContain('defaultColumns: ["title", "isVisible", "image", "updatedAt"]');
    expect(advertisingCollection).toContain('defaultColumns: ["title", "isVisible", "image", "updatedAt"]');
  });

  it("keeps hidden cases out of the public homepage query", () => {
    expect(getCasesForSite).toContain("where: visibleCasesWhere");
    expect(getCasesForSite).toContain('isVisible: { not_equals: false }');
  });
});
