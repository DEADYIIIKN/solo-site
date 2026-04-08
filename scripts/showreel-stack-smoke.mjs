/**
 * Smoke-тест для стэкинга hero/showreel wrapper:
 * верхняя общая зона должна создавать свой stacking context,
 * чтобы showreel не всплывал поверх следующего блока страницы.
 *
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/showreel-stack-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForSelector("#showreel-section", { timeout: 30_000 });
    await page.waitForSelector("#business-goals-section", { timeout: 30_000 });

    const report = await page.evaluate(() => {
      const showreel = document.querySelector("#showreel-section");
      const businessGoals = document.querySelector("#business-goals-section");
      const sharedWrapper = showreel?.parentElement;

      if (!showreel || !businessGoals || !sharedWrapper) {
        return {
          ok: false,
          error: "required sections missing",
        };
      }

      const wrapperStyles = getComputedStyle(sharedWrapper);
      const showreelStyles = getComputedStyle(showreel);

      return {
        ok: true,
        wrapperIsolation: wrapperStyles.isolation,
        wrapperPosition: wrapperStyles.position,
        wrapperZIndex: wrapperStyles.zIndex,
        showreelZIndex: showreelStyles.zIndex,
      };
    });

    console.log(JSON.stringify(report, null, 2));

    if (!report.ok) {
      console.error("FAIL:", report.error);
      process.exit(1);
    }

    if (report.wrapperIsolation !== "isolate") {
      console.error("FAIL: shared hero/showreel wrapper must create stacking context via isolation:isolate");
      process.exit(1);
    }

    if (report.wrapperPosition !== "relative") {
      console.error("FAIL: shared wrapper must stay position:relative");
      process.exit(1);
    }

    console.log("OK: hero/showreel wrapper isolates stacking.");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
