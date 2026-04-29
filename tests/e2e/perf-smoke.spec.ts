import { expect, test } from "@playwright/test";

const MOBILE_HOME_BUDGET_BYTES = 1_500_000;
const VIDEO_PATH = "/assets/video/bts-ozon.mp4";

test.describe("performance smoke", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  test("mobile home initial page weight stays under budget", async ({ page }) => {
    const responseBytes: number[] = [];
    const videoRequests: string[] = [];
    const useBrowserTransferSize = Boolean(process.env.E2E_BASE_URL);

    page.on("request", (request) => {
      const url = request.url();
      if (url.includes(VIDEO_PATH)) videoRequests.push(url);
    });

    page.on("response", (response) => {
      const url = response.url();
      if (url.includes("/_next/webpack-hmr")) return;
      const lengthHeader = response.headers()["content-length"];
      const bytes = lengthHeader ? Number.parseInt(lengthHeader, 10) : 0;
      if (Number.isFinite(bytes) && bytes > 0) responseBytes.push(bytes);
    });

    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1_500);

    const totalBytes = useBrowserTransferSize
      ? await page.evaluate(() => {
          const transferSize = (entry: PerformanceEntry) =>
            "transferSize" in entry && typeof entry.transferSize === "number"
              ? entry.transferSize
              : 0;
          const navigationBytes = performance
            .getEntriesByType("navigation")
            .reduce((sum, entry) => sum + transferSize(entry), 0);
          const resourceBytes = performance
            .getEntriesByType("resource")
            .filter((entry) => !entry.name.includes("/_next/webpack-hmr"))
            .reduce((sum, entry) => sum + transferSize(entry), 0);

          return navigationBytes + resourceBytes;
        })
      : responseBytes.reduce((sum, bytes) => sum + bytes, 0);

    expect(videoRequests, "showreel video must not load on initial mobile view").toEqual([]);
    expect(totalBytes, `initial response bytes: ${totalBytes}`).toBeLessThanOrEqual(
      MOBILE_HOME_BUDGET_BYTES,
    );
  });
});
