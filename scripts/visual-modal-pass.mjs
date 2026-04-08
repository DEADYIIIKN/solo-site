/**
 * Визуальный прогон модалки «Бесплатная консультация» на типовых ширинах.
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/visual-modal-pass.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, ".visual-run");
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";

const viewports = [
  { name: "360", width: 360, height: 900 },
  { name: "480", width: 480, height: 900 },
  { name: "768", width: 768, height: 900 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();
    try {
      await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 });
      await page.getByRole("button", { name: "Бесплатная консультация" }).click();
      await page.getByText("бесплатная", { exact: false }).first().waitFor({
        state: "visible",
        timeout: 10_000,
      });
      await page.waitForTimeout(400);

      const shell = page.locator('[role="dialog"]').first();
      const scrollable = page.locator(".overflow-y-auto").first();
      let shellBox = null;
      let scrollInfo = { scrollHeight: 0, clientHeight: 0, hasScroll: false };
      let pageScroll = { docScrollHeight: 0, innerHeight: 0, bodyHasVerticalScroll: false };
      try {
        shellBox = await shell.boundingBox();
      } catch {
        /* ignore */
      }
      try {
        scrollInfo = await scrollable.evaluate((el) => ({
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          hasScroll: el.scrollHeight > el.clientHeight + 1,
        }));
      } catch {
        /* ignore */
      }
      try {
        pageScroll = await page.evaluate(() => {
          const d = document.documentElement;
          return {
            docScrollHeight: d.scrollHeight,
            innerHeight: window.innerHeight,
            bodyHasVerticalScroll: d.scrollHeight > window.innerHeight + 1,
          };
        });
      } catch {
        /* ignore */
      }

      const path = join(outDir, `modal-consultation-${vp.name}.png`);
      await page.screenshot({ path, fullPage: true });

      report.push({
        viewport: vp.name,
        screenshot: path,
        dialogApproxHeight: shellBox?.height ?? null,
        overlayScrollable: scrollInfo,
        window: pageScroll,
      });
    } catch (e) {
      report.push({
        viewport: vp.name,
        error: String(e?.message || e),
      });
    } finally {
      await context.close();
    }
  }

  await browser.close();

  const reportPath = join(outDir, "report.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log("\nScreens + report:", outDir);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
