/**
 * Дымовой тест: после перехода по якорю к "Услуги" navbar не должен
 * становиться белым, пока у секции под шапкой видны тёмные закруглённые углы.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-services-anchor-entry-smoke.mjs
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
    const services = () => document.getElementById("services-section");

    history.replaceState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
    await wait(1200);

    const link = Array.from(document.querySelectorAll("a")).find(
      (anchor) => anchor.textContent?.trim().toLowerCase() === "услуги",
    );

    if (!link || !header() || !services()) {
      return { error: "required elements not found" };
    }

    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    const samples = [];
    for (let i = 0; i < 220; i++) {
      await wait(25);
      const bg = getComputedStyle(header()).backgroundColor;
      const rect = services().getBoundingClientRect();
      samples.push({
        t: i * 25,
        active: document.documentElement.hasAttribute("data-site-anchor-navigation"),
        forced: document.documentElement.getAttribute("data-site-anchor-navbar-surface"),
        headerBg: bg,
        servicesTop: rect.top,
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
  const postArrivalSamples = result.samples.filter(
    (sample, index) =>
      index >= firstInactiveIndex &&
      sample.t <= (result.samples[firstInactiveIndex]?.t ?? 0) + 1200 &&
      sample.servicesTop > -64,
  );

  const lightSamples = postArrivalSamples
    .map((sample) => ({ ...sample, state: classifyNavbar(sample.headerBg) }))
    .filter((sample) => sample.state === "light");

  const forcedSamples = postArrivalSamples.filter((sample) => sample.forced !== null);

  console.log(
    JSON.stringify(
      {
        firstInactiveIndex,
        postArrivalSamples: postArrivalSamples.map((sample) => ({
          ...sample,
          state: classifyNavbar(sample.headerBg),
        })),
      },
      null,
      2,
    ),
  );

  if (lightSamples.length > 0) {
    console.error(`FAIL: navbar turned light after arriving at Services while dark corners were still visible`);
    process.exit(1);
  }

  if (forcedSamples.length > 0) {
    console.error(`FAIL: forced navbar surface persisted after Services anchor arrival`);
    process.exit(1);
  }

  console.log("OK: navbar-services-anchor-entry-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
