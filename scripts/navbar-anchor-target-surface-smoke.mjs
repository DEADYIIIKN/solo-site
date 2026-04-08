/**
 * Дымовой тест: якорные ссылки navbar должны сразу задавать корректную тему
 * целевой секции, а не уходить в общий dark-state по умолчанию.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-anchor-target-surface-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const CHECKS = [
  { href: "#what-we-do-section", expectedForced: "light-surface" },
  { href: "#cases-section", expectedForced: "dark-surface" },
  { href: "#services-section", expectedForced: "dark-surface" },
  { href: "#footer-section", expectedForced: "light-surface" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120_000 });

  const results = [];
  for (const check of CHECKS) {
    const result = await page.evaluate(
      async ({ href, expectedForced }) => {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        history.replaceState(null, "", location.pathname);
        window.scrollTo({ top: 0, behavior: "auto" });
        await wait(1200);

        const link = Array.from(document.querySelectorAll("a")).find((anchor) => anchor.getAttribute("href") === href);
        if (!link) return { href, expectedForced, error: "link not found" };

        link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
        await wait(25);

        return {
          href,
          expectedForced,
          actualForced: document.documentElement.getAttribute("data-site-anchor-navbar-surface"),
          active: document.documentElement.hasAttribute("data-site-anchor-navigation"),
        };
      },
      check,
    );

    results.push(result);
  }

  await browser.close();

  console.log(JSON.stringify({ results }, null, 2));

  const failed = results.find((result) => result.error || result.actualForced !== result.expectedForced || !result.active);
  if (failed) {
    console.error(
      `FAIL: ${failed.href} expected forced=${failed.expectedForced}, got forced=${failed.actualForced}, active=${failed.active}`,
    );
    process.exit(1);
  }

  console.log("OK: navbar-anchor-target-surface-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
