import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

describe("Payload media render audit", () => {
  it("uses the shared Payload media source helper instead of local url-first helpers", () => {
    const files = [
      "src/widgets/cases/lib/get-cases-for-site.ts",
      "src/app/(site)/preview/cases-advertising/[id]/PreviewClient.tsx",
      "src/app/(site)/preview/cases-vertical/[id]/PreviewClient.tsx",
    ];

    for (const file of files) {
      const source = read(file);
      expect(source).toContain("payloadMediaSrc");
      expect(source).not.toContain("function mediaSrc");
      expect(source).not.toContain("type MediaLike");
    }
  });

  it("keeps Payload case images on next/image without unoptimized preview bypasses", () => {
    const previewFiles = [
      "src/app/(site)/preview/cases-advertising/[id]/PreviewClient.tsx",
      "src/app/(site)/preview/cases-vertical/[id]/PreviewClient.tsx",
    ];

    for (const file of previewFiles) {
      const source = read(file);
      expect(source).toContain("from \"next/image\"");
      expect(source).toContain("src={card.image}");
      expect(source).not.toContain("src={card.image}\n          unoptimized");
    }
  });
});
