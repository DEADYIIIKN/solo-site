import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/widgets/business-goals/ui/business-goals.tsx"),
  "utf8",
);

describe("business goals desktop collapsed images", () => {
  it("uses object-cover so 1024/1440 collapsed cards crop instead of squeezing images", () => {
    expect(source).toContain('className="absolute top-0 h-full max-w-none object-cover"');
  });

  it("rotates collapsed card labels with transform instead of Safari-unsafe sideways writing mode", () => {
    expect(source).not.toContain('writingMode: "sideways-lr"');
    expect(source).toContain('rotate(-90deg)');
    expect(source).toContain('transformOrigin: "left center"');
  });
});
