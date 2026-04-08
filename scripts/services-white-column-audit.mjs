/**
 * Услуги 1440 + 1024: скриншоты viewport + сэмпл пикселей (белая колонка; низ пина без полосы #0d0300).
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/services-white-column-audit.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const OUT_DIR = path.join(process.cwd(), ".cursor", "services-white-audit");

const SECTION_BG = { r: 13, g: 3, b: 0 };

const CONFIGS = [
  { label: "1440", sectionId: "services-section-1440", viewport: { width: 1440, height: 900 }, cardCap: 480 },
  { label: "1024", sectionId: "services-section-1024", viewport: { width: 1280, height: 900 }, cardCap: 420 },
];

function nearWhite(r, g, b, thr = 42) {
  return r > 255 - thr && g > 255 - thr && b > 255 - thr;
}

function dominantSectionBg(r, g, b, thr = 35) {
  return (
    Math.abs(r - SECTION_BG.r) < thr &&
    Math.abs(g - SECTION_BG.g) < thr &&
    Math.abs(b - SECTION_BG.b) < thr
  );
}

function pickRgb(png, x, y) {
  const ix = Math.max(0, Math.min(png.width - 1, Math.floor(x)));
  const iy = Math.max(0, Math.min(png.height - 1, Math.floor(y)));
  const idx = (png.width * iy + ix) << 2;
  const d = png.data;
  return { r: d[idx], g: d[idx + 1], b: d[idx + 2] };
}

/**
 * @param {import('playwright').Page} page
 * @param {{ label: string, sectionId: string, cardCap: number }} cfg
 */
async function runOne(page, cfg) {
  const failures = [];

  const PIN_SCROLL_VH = 200;

  const range = await page.evaluate(
    ({ sid, cap, pinVh }) => {
      const pin = document.querySelector(`#${sid} [data-services-pin-root]`);
      if (!pin) return null;
      const rect = pin.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elTop = scrollY + rect.top;
      const vh = window.innerHeight;
      const h = pin.offsetHeight;
      const start = Math.round(elTop);
      const baseSpan = Math.max(0, h - vh);
      const maxSpanPx = (pinVh / 100) * vh;
      const span = Math.min(baseSpan, maxSpanPx, cap);
      const end = Math.round(start + span);
      return { start, end, span, pinH: h, vh };
    },
    { sid: cfg.sectionId, cap: cfg.cardCap, pinVh: PIN_SCROLL_VH },
  );

  if (!range || range.span < 1) {
    return { ok: false, reason: `invalid pin range ${JSON.stringify(range)}`, failures: [`${cfg.label}: bad range`] };
  }

  const shots = [
    { name: "pin-start", y: Math.max(0, range.start - 40) },
    { name: "pin-mid", y: Math.round(range.start + range.span * 0.5) },
    { name: "pin-end", y: range.end },
  ];

  for (const { name, y } of shots) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)));
        }),
    );

    const geom = await page.evaluate((sid) => {
      const col = document.querySelector(`#${sid} [data-services-white-column]`);
      const sticky = document.querySelector(`#${sid} [data-services-sticky-panel]`);
      const cr = col?.getBoundingClientRect();
      const sr = sticky?.getBoundingClientRect();
      const vh = window.innerHeight;
      return {
        col: cr ? { left: cr.left, top: cr.top, right: cr.right, bottom: cr.bottom, width: cr.width } : null,
        stickyBottom: sr?.bottom ?? NaN,
        vh,
      };
    }, cfg.sectionId);

    const buf = await page.screenshot({ fullPage: false, type: "png" });
    const pngPath = path.join(OUT_DIR, `${cfg.label}-${name}.png`);
    fs.writeFileSync(pngPath, buf);

    const png = PNG.sync.read(buf);
    const h = png.height;

    if (!geom.col) {
      failures.push(`${cfg.label}/${name}: white column not found`);
      continue;
    }

    const cx = geom.col.left + geom.col.width / 2;
    const colTop = geom.col.top;
    const colBot = geom.col.bottom;

    const topSampleY = Math.max(0, Math.min(h - 1, colTop + 6));
    const topRgb = pickRgb(png, cx, topSampleY);

    const viewportBottomY = h - 10;
    const spacerProbeY = Math.min(h - 8, Math.max(geom.stickyBottom + 24, viewportBottomY - 4));
    const bottomRgb = pickRgb(png, cx, Math.max(0, Math.min(h - 1, spacerProbeY)));

    const midBelowRgb = pickRgb(
      png,
      cx,
      Math.max(0, Math.min(h - 1, Math.floor((geom.stickyBottom + viewportBottomY) / 2))),
    );

    const topVisible = colTop < h - 8 && colBot > 12;
    const topOk = !topVisible || nearWhite(topRgb.r, topRgb.g, topRgb.b);
    const bottomOk =
      nearWhite(bottomRgb.r, bottomRgb.g, bottomRgb.b) || !dominantSectionBg(bottomRgb.r, bottomRgb.g, bottomRgb.b);
    const midOk =
      nearWhite(midBelowRgb.r, midBelowRgb.g, midBelowRgb.b) ||
      !dominantSectionBg(midBelowRgb.r, midBelowRgb.g, midBelowRgb.b);

    console.log(
      JSON.stringify({
        label: cfg.label,
        name,
        scrollY: y,
        cx,
        colTop,
        topSampleY,
        spacerProbeY,
        topRgb,
        bottomRgb,
        midBelowRgb,
        topOk,
        bottomOk,
        midOk,
      }),
    );

    if (!topOk) failures.push(`${cfg.label}/${name}: top of white column not white-ish`);
    if (name === "pin-mid" || name === "pin-end") {
      if (dominantSectionBg(bottomRgb.r, bottomRgb.g, bottomRgb.b)) {
        failures.push(`${cfg.label}/${name}: spacer / bottom band dominated by section bg`);
      }
      if (dominantSectionBg(midBelowRgb.r, midBelowRgb.g, midBelowRgb.b)) {
        failures.push(`${cfg.label}/${name}: mid-below-sticky band dominated by section bg`);
      }
    }
  }

  return { ok: failures.length === 0, failures };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: CONFIGS[0].viewport });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 180_000 });

  const allFailures = [];

  for (let i = 0; i < CONFIGS.length; i++) {
    const cfg = CONFIGS[i];
    if (i > 0) {
      await page.setViewportSize(cfg.viewport);
      await page.reload({ waitUntil: "domcontentloaded", timeout: 180_000 });
    }

    await page.waitForSelector(`#${cfg.sectionId} [data-services-pin-root]`, { timeout: 90_000 });
    await page.waitForFunction(
      (sid) => {
        const pin = document.querySelector(`#${sid} [data-services-pin-root]`);
        return Boolean(pin?.hasAttribute("data-services-slide-progress"));
      },
      cfg.sectionId,
      { timeout: 90_000 },
    );

    const result = await runOne(page, cfg);
    if (result.failures?.length) {
      allFailures.push(...result.failures);
    }
    if (result.ok === false && result.reason) {
      allFailures.push(`${cfg.label}: ${result.reason}`);
    }
  }

  await browser.close();

  if (allFailures.length) {
    console.error("FAIL:", allFailures.join(" | "));
    process.exitCode = 1;
  } else {
    console.log("OK — screenshots:", OUT_DIR);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
