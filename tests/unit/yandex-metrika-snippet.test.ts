import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/widgets/analytics/yandex-metrika.tsx"),
  "utf8",
);

describe("Yandex Metrika snippet", () => {
  it("uses the verification-friendly Yandex head snippet shape", () => {
    expect(source).toContain('strategy="beforeInteractive"');
    expect(source).toContain("https://mc.yandex.ru/metrika/tag.js?id=${counterId}");
    expect(source).toContain("ssr: true");
    expect(source).toContain('ecommerce: "dataLayer"');
    expect(source).toContain("referrer: document.referrer");
    expect(source).toContain("url: location.href");
  });
});
