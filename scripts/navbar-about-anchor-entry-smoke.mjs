/**
 * Дымовой тест: после перехода по якорю к "Об агентстве" navbar должен
 * стать светлым сразу после завершения anchor-scroll.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-about-anchor-entry-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function parseRgb(color) {
  const match = color?.match(/^rgba?\(([^)]+)\)$/i);
  if (!match) return null;
  const [r = "0", g = "0", b = "0"] = match[1].split(",").map((part) => part.trim());
  return [Number.parseFloat(r), Number.parseFloat(g), Number.parseFloat(b)];
}

function luminance(rgb) {
  if (!rgb) return null;
  const transform = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * transform(rgb[0]) + 0.7152 * transform(rgb[1]) + 0.0722 * transform(rgb[2]);
}

function classifyNavbar(color) {
  const lum = luminance(parseRgb(color));
  if (lum == null) return "unknown";
  if (lum >= 0.72) return "light";
  if (lum <= 0.18) return "dark";
  return "mid";
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120_000 });

  const result = await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const header = () => Array.from(document.querySelectorAll("header")).find((el) => el.getClientRects().length > 0);
    const target = () => document.getElementById("what-we-do-section");

    history.replaceState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
    await wait(2000);

    const link = Array.from(document.querySelectorAll("a")).find((anchor) => anchor.getAttribute("href") === "#what-we-do-section");

    if (!link || !header() || !target()) {
      return { error: "required elements not found" };
    }

    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    const samples = [];
    for (let i = 0; i < 180; i++) {
      await wait(25);
      const bg = getComputedStyle(header()).backgroundColor;
      samples.push({
        t: i * 25,
        active: document.documentElement.hasAttribute("data-site-anchor-navigation"),
        forced: document.documentElement.getAttribute("data-site-anchor-navbar-surface"),
        headerBg: bg,
        targetTop: target().getBoundingClientRect().top,
      });
    }

    return { samples };
  });

  await browser.close();

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const firstInactiveIndex = result.samples.findIndex((sample) => !sample.active);
  const settledSample = result.samples
    .slice(firstInactiveIndex)
    .find((sample) => classifyNavbar(sample.headerBg) === "light");

  console.log(
    JSON.stringify(
      {
        firstInactiveIndex,
        afterInactive: result.samples.slice(firstInactiveIndex, firstInactiveIndex + 24).map((sample) => ({
          ...sample,
          state: classifyNavbar(sample.headerBg),
        })),
      },
      null,
      2,
    ),
  );

  if (!settledSample) {
    console.error("FAIL: navbar did not switch to light after arriving at About section");
    process.exit(1);
  }

  console.log("OK: navbar-about-anchor-entry-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
