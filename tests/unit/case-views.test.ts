import { describe, expect, it } from "vitest";

import { hasCaseViews } from "@/widgets/cases/model/cases.data";

describe("hasCaseViews", () => {
  it("returns false when views are not set", () => {
    expect(hasCaseViews()).toBe(false);
    expect(hasCaseViews(null)).toBe(false);
    expect(hasCaseViews("")).toBe(false);
    expect(hasCaseViews("   ")).toBe(false);
  });

  it("returns true when views contain visible text", () => {
    expect(hasCaseViews("13 400")).toBe(true);
  });
});
