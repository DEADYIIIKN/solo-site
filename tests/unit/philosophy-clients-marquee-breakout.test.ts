import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

const philosophy1440 = fs.readFileSync(
  path.join(root, "src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx"),
  "utf8",
);
const philosophy1024 = fs.readFileSync(
  path.join(root, "src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx"),
  "utf8",
);
const philosophyNarrowStack = fs.readFileSync(
  path.join(root, "src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx"),
  "utf8",
);

describe("philosophy clients marquee breakout", () => {
  it("uses 100vw breakout for client logo strips across responsive layouts", () => {
    for (const source of [philosophy1440, philosophy1024, philosophyNarrowStack]) {
      expect(source).toContain('width: "100vw"');
      expect(source).toContain('marginLeft: "calc(50% - 50vw)"');
    }
  });

  it("does not clip the 1440 client marquee to the fixed 1440px container", () => {
    expect(philosophy1440).not.toContain('h-[400px] w-full max-w-full overflow-x-clip');
  });
});
