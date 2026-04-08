/**
 * Дымовой тест: navbar не должен становиться белым, пока под его нижней кромкой
 * в скруглённых углах секции ещё виден тёмный фон.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-rounded-surface-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const VIEWPORTS = [
  { name: "1024", width: 1024, height: 768, headerHeight: 72 },
  { name: "1440", width: 1440, height: 900, headerHeight: 82 },
];

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

async function inspectViewport(browser, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 120_000 });

  const result = await page.evaluate(async ({ headerHeight }) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const section = document.getElementById("services-section");
    const header = Array.from(document.querySelectorAll("header")).find((el) => el.getClientRects().length > 0);
    if (!section || !header) return { error: "required elements not found" };

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const xs = [24, Math.round(window.innerWidth / 2), window.innerWidth - 24];
    const probeYs = [headerHeight + 2, headerHeight + 6, headerHeight + 10];

    const readMixedState = () => {
      const probes = probeYs.map((probeY) => ({
        probeY,
        colors: xs.map((x) =>
          document
            .elementsFromPoint(x, probeY)
            .map((el) => getComputedStyle(el).backgroundColor)
            .find((color) => color && color !== "rgba(0, 0, 0, 0)") ?? null,
        ),
      }));

      const hasMixedLine = probes.some((probe) => {
        const unique = [...new Set(probe.colors)];
        return unique.length > 1;
      });

      return {
        probes,
        hasMixedLine,
        headerBg: getComputedStyle(header).backgroundColor,
        scrollY: window.scrollY,
      };
    };

    window.scrollTo({ top: Math.max(0, sectionTop - 40), behavior: "auto" });
    await wait(1000);

    for (let offset = 160; offset >= 20; offset -= 5) {
      window.scrollTo({ top: Math.max(0, sectionTop - offset), behavior: "auto" });
      await wait(70);
      const state = readMixedState();
      if (!state.hasMixedLine) continue;
      await wait(900);
      return readMixedState();
    }

    return { error: "mixed rounded-corner state not found" };
  }, { headerHeight: viewport.headerHeight });

  await page.close();
  return { viewport: viewport.name, ...result };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of VIEWPORTS) {
    results.push(await inspectViewport(browser, viewport));
  }

  await browser.close();

  console.log(JSON.stringify({ results }, null, 2));

  const failed = results.find((result) => {
    if (result.error) return true;
    const headerLum = luminance(parseRgb(result.headerBg));
    return headerLum == null || headerLum > 0.2;
  });

  if (failed) {
    console.error(
      `FAIL: navbar should stay dark during mixed rounded-corner state (${failed.viewport}), got ${failed.headerBg ?? failed.error}`,
    );
    process.exit(1);
  }

  console.log("OK: navbar-rounded-surface-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
