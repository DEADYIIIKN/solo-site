import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  path.join(process.cwd(), "src/widgets/analytics/yandex-metrika.tsx"),
  "utf8",
);
const layoutSource = fs.readFileSync(path.join(process.cwd(), "src/app/(site)/layout.tsx"), "utf8");

describe("Yandex Metrika snippet", () => {
  it("renders the verification-friendly Yandex snippet directly in head", () => {
    expect(source).not.toContain("next/script");
    expect(source).toContain("<script");
    expect(source).toContain("dangerouslySetInnerHTML");
    expect(source).toContain("https://mc.yandex.ru/metrika/tag.js?id=${counterId}");
    expect(source).toContain("ssr:true");
    expect(source).toContain('ecommerce:"dataLayer"');
    expect(source).toContain("referrer: document.referrer");
    expect(source).toContain("url: location.href");
    expect(layoutSource).toContain("<head>");
    expect(layoutSource).toContain("<YandexMetrikaHead settings={settings} />");
  });
});
