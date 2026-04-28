import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("bundle analyzer config", () => {
  it("exposes an analyze script and wires @next/bundle-analyzer", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");

    expect(pkg.scripts?.analyze).toBe("ANALYZE=true next build");
    expect(pkg.devDependencies).toHaveProperty("@next/bundle-analyzer");
    expect(nextConfig).toContain("@next/bundle-analyzer");
    expect(nextConfig).toContain("enabled: process.env.ANALYZE === \"true\"");
  });
});
