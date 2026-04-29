import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const fontsDir = path.join(root, "public/fonts/montserrat");
const siteLayoutPath = path.join(root, "src/app/(site)/layout.tsx");

function fontBytes(extension: string): number {
  return fs
    .readdirSync(fontsDir)
    .filter((file) => file.endsWith(extension))
    .reduce((total, file) => total + fs.statSync(path.join(fontsDir, file)).size, 0);
}

describe("site font assets", () => {
  it("uses WOFF2 Montserrat sources in the site layout", () => {
    const source = fs.readFileSync(siteLayoutPath, "utf8");

    expect(source).toContain(".woff2");
    expect(source).not.toContain(".ttf");
  });

  it("keeps shipped Montserrat font payload under the Phase 16 budget", () => {
    expect(fontBytes(".woff2")).toBeGreaterThan(0);
    expect(fontBytes(".ttf")).toBe(0);
    expect(fontBytes(".woff2")).toBeLessThanOrEqual(350 * 1024);
  });
});
