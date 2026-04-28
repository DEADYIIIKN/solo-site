import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const variants = ["360", "480", "768", "1024", "1440"] as const;

describe("consultation modal bundle split", () => {
  it("loads breakpoint consultation modals through next/dynamic", () => {
    for (const variant of variants) {
      const file = `src/widgets/first-screen/ui/first-screen-consultation-modal-${variant}.tsx`;
      const source = fs.readFileSync(path.join(root, file), "utf8");

      expect(source).toContain("next/dynamic");
      expect(source).toContain("import(\"@/widgets/first-screen/ui/consultation-modal\")");
      expect(source).not.toContain(
        "import { ConsultationModal } from \"@/widgets/first-screen/ui/consultation-modal\"",
      );
    }
  });

  it("loads the delayed Telegram popup through next/dynamic", () => {
    const source = fs.readFileSync(
      path.join(root, "src/widgets/tg-popup/ui/tg-popup-host.tsx"),
      "utf8",
    );

    expect(source).toContain("next/dynamic");
    expect(source).toContain("import(\"./tg-popup\")");
    expect(source).not.toContain("import { TgPopup } from \"./tg-popup\"");
  });
});
