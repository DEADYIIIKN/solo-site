/**
 * Дымовой тест: hash-навигация не должна дёргать страницу серией принудительных scrollTo.
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/hash-nav-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const CHECKS = [
  { label: "кейсы", expectedHash: "#cases-section", maxCalls: 2 },
  { label: "услуги", expectedHash: "#services-section", maxCalls: 2 },
  { label: "контакты", expectedHash: "#footer-section", maxCalls: 3 },
];

async function inspectAnchor(page, check) {
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(150);

  const result = await page.evaluate(async ({ label }) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const originalScrollTo = window.scrollTo.bind(window);
    const calls = [];

    window.scrollTo = (...args) => {
      calls.push(args[0]);
      return originalScrollTo(...args);
    };

    const link = Array.from(document.querySelectorAll("a")).find(
      (anchor) => anchor.textContent?.trim().toLowerCase() === label,
    );

    if (!link) {
      window.scrollTo = originalScrollTo;
      return { error: `link not found: ${label}` };
    }

    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    await wait(2500);

    window.scrollTo = originalScrollTo;

    return {
      hash: window.location.hash,
      scrollY: window.scrollY,
      calls,
    };
  }, check);

  if (result.error) {
    return { ok: false, ...result, label: check.label };
  }

  const smoothCalls = result.calls.filter((call) => call?.behavior === "smooth").length;
  const autoCalls = result.calls.filter((call) => call?.behavior === "auto").length;
  const totalCalls = result.calls.length;
  const hashOk = result.hash === check.expectedHash;
  const callCountOk = totalCalls <= check.maxCalls;

  return {
    ok: hashOk && callCountOk && smoothCalls >= 1,
    label: check.label,
    hash: result.hash,
    scrollY: result.scrollY,
    totalCalls,
    smoothCalls,
    autoCalls,
    maxCalls: check.maxCalls,
    calls: result.calls,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = [];
  for (const check of CHECKS) {
    results.push(await inspectAnchor(page, check));
  }

  await browser.close();

  console.log(JSON.stringify({ results }, null, 2));

  const failed = results.find((result) => !result.ok);
  if (failed) {
    console.error(
      `FAIL: "${failed.label}" produced ${failed.totalCalls} scroll calls (limit ${failed.maxCalls}), hash=${failed.hash}`,
    );
    process.exit(1);
  }

  console.log("OK: hash-nav-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
