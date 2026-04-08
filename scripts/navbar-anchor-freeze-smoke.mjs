/**
 * Дымовой тест: во время программного anchor-scroll navbar не должен менять тему
 * по пролетаемым секциям. Допускается только один стабильный theme-state на весь период
 * активного data-site-anchor-navigation, а после завершения перехода navbar должен сам
 * обновиться до итоговой темы целевой секции без ручного скролла.
 *
 * Запуск:
 * BASE_URL=http://127.0.0.1:3000 node scripts/navbar-anchor-freeze-smoke.mjs
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

    window.scrollTo({ top: 0, behavior: "auto" });
    await wait(1200);

    const link = Array.from(document.querySelectorAll("a")).find(
      (anchor) => anchor.textContent?.trim().toLowerCase() === "услуги",
    );
    if (!link) return { error: "services anchor not found" };

    let started = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
      await wait(120);
      if (
        document.documentElement.hasAttribute("data-site-anchor-navigation") ||
        window.location.hash === "#services-section"
      ) {
        started = true;
        break;
      }
      await wait(180);
    }

    if (!started) {
      return { error: "services anchor navigation did not start" };
    }

    const samples = [];
    for (let i = 0; i < 180; i++) {
      await wait(25);
      const active = document.documentElement.hasAttribute("data-site-anchor-navigation");
      const bg = header() ? getComputedStyle(header()).backgroundColor : null;
      samples.push({ t: i * 25, active, bg, y: window.scrollY });
    }

    return {
      hash: window.location.hash,
      samples,
    };
  });

  await browser.close();

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const activeSamples = result.samples.filter((sample) => sample.active);
  const activeStates = activeSamples
    .map((sample) => classifyNavbar(sample.bg))
    .filter((state) => state !== "mid" && state !== "unknown");
  const uniqueStates = [...new Set(activeStates)];
  const inactiveSamplesAfterActive = result.samples.filter(
    (sample, index) => !sample.active && index > 0 && result.samples[index - 1]?.active,
  );
  const settledInactiveSamples = result.samples.filter(
    (sample) => !sample.active && sample.t >= (inactiveSamplesAfterActive[0]?.t ?? 0) + 400,
  );
  const finalSettledSample =
    settledInactiveSamples.at(-1) ?? inactiveSamplesAfterActive.at(-1) ?? result.samples.at(-1) ?? null;
  const finalState = classifyNavbar(finalSettledSample?.bg ?? null);

  console.log(
    JSON.stringify(
      {
        hash: result.hash,
        activeSampleCount: activeSamples.length,
        uniqueStates,
        finalState,
        settledInactiveCount: settledInactiveSamples.length,
        firstActiveSamples: activeSamples.slice(0, 12),
        finalSettledSample,
      },
      null,
      2,
    ),
  );

  if (uniqueStates.length > 1) {
    console.error(`FAIL: navbar changed theme during active anchor navigation: ${uniqueStates.join(" -> ")}`);
    process.exit(1);
  }

  if (finalState !== "dark") {
    console.error(`FAIL: navbar did not refresh to final section theme after anchor navigation, got ${finalState}`);
    process.exit(1);
  }

  console.log("OK: navbar-anchor-freeze-smoke passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
