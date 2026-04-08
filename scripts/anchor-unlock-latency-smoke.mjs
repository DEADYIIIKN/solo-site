/**
 * Дымовой тест: якорная навигация не должна держать navbar-lock заметно дольше,
 * чем страница реально доехала до целевой секции.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/anchor-unlock-latency-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const MAX_LAG_MS = 600;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120_000 });

  const result = await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const getHeaderOffset = () =>
      window.innerWidth >= 1440 ? 82 : window.innerWidth >= 1024 ? 72 : window.innerWidth >= 768 ? 64 : window.innerWidth >= 480 ? 60 : 56;
    const resolveTarget = (href) => {
      const targetId = decodeURIComponent(href.slice(1));

      if (targetId === "footer-section") {
        return (
          Array.from(document.querySelectorAll('[id^="footer-"]')).find(
            (element) =>
              element.id !== "footer-section" &&
              getComputedStyle(element).display !== "none" &&
              element.getClientRects().length > 0,
          ) ?? document.getElementById(targetId)
        );
      }

      return document.getElementById(targetId);
    };

    const run = async (href) => {
      history.replaceState(null, "", location.pathname);
      window.scrollTo({ top: 0, behavior: "auto" });
      await wait(1200);

      const link = Array.from(document.querySelectorAll("a")).find((anchor) => anchor.getAttribute("href") === href);
      const target = resolveTarget(href);
      if (!link || !target) return { href, error: "missing" };

      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

      const headerOffset = getHeaderOffset();
      const samples = [];
      for (let i = 0; i < 320; i++) {
        await wait(25);
        samples.push({
          t: i * 25,
          active: document.documentElement.hasAttribute("data-site-anchor-navigation"),
          top: target.getBoundingClientRect().top,
          y: window.scrollY,
        });
      }

      const arrival = samples.find((sample) => Math.abs(sample.top - headerOffset) <= 16);
      const inactive = samples.find((sample) => !sample.active);

      return {
        href,
        arrivalMs: arrival?.t ?? null,
        inactiveMs: inactive?.t ?? null,
        lagAfterArrivalMs: arrival && inactive ? inactive.t - arrival.t : null,
        firstArrival: arrival ?? null,
        firstInactive: inactive ?? null,
      };
    };

    return {
      about: await run("#what-we-do-section"),
      contacts: await run("#footer-section"),
    };
  });

  await browser.close();

  console.log(JSON.stringify(result, null, 2));

  const failures = Object.values(result).filter(
    (entry) => entry.error || entry.lagAfterArrivalMs == null || entry.lagAfterArrivalMs > MAX_LAG_MS,
  );

  if (failures.length > 0) {
    const firstFailure = failures[0];
    console.error(
      `FAIL: ${firstFailure.href} kept navbar anchor-lock for ${firstFailure.lagAfterArrivalMs}ms after arrival`,
    );
    process.exit(1);
  }

  console.log("OK: anchor-unlock-latency-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
