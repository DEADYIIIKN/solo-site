/**
 * Дымовой тест: при переходе по якорю к "Контакты" navbar не должен
 * оставаться в dark-state после того, как видимый footer уже выровнялся под header.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-contacts-anchor-entry-smoke.mjs
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
    const footer = () =>
      Array.from(document.querySelectorAll('[id^="footer-"]')).find(
        (el) => el.id !== "footer-section" && getComputedStyle(el).display !== "none" && el.getClientRects().length > 0,
      );
    const headerOffset =
      window.innerWidth >= 1440 ? 82 : window.innerWidth >= 1024 ? 72 : window.innerWidth >= 768 ? 64 : window.innerWidth >= 480 ? 60 : 56;

    history.replaceState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
    await wait(1200);

    const link = Array.from(document.querySelectorAll("a")).find((anchor) => anchor.getAttribute("href") === "#footer-section");
    if (!link || !header() || !footer()) {
      return { error: "required elements not found" };
    }

    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));

    const samples = [];
    for (let i = 0; i < 120; i++) {
      await wait(25);
      samples.push({
        t: i * 25,
        active: document.documentElement.hasAttribute("data-site-anchor-navigation"),
        forced: document.documentElement.getAttribute("data-site-anchor-navbar-surface"),
        headerBg: getComputedStyle(header()).backgroundColor,
        footerTop: footer().getBoundingClientRect().top,
      });
    }

    return { headerOffset, samples };
  });

  await browser.close();

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const firstAlignedIndex = result.samples.findIndex(
    (sample) => Math.abs(sample.footerTop - result.headerOffset) <= 16,
  );
  const earlyAlignedSamples = result.samples
    .slice(Math.max(0, firstAlignedIndex - 2), firstAlignedIndex + 8)
    .map((sample) => ({ ...sample, state: classifyNavbar(sample.headerBg) }));

  console.log(
    JSON.stringify(
      {
        firstAlignedIndex,
        earlyAlignedSamples,
      },
      null,
      2,
    ),
  );

  const alignedSample = result.samples[firstAlignedIndex];
  if (!alignedSample) {
    console.error("FAIL: footer never aligned under header during Contacts anchor navigation");
    process.exit(1);
  }

  if (alignedSample.forced !== "light-surface") {
    console.error("FAIL: navbar still uses dark forced surface when Contacts footer is already aligned");
    process.exit(1);
  }

  console.log("OK: navbar-contacts-anchor-entry-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
