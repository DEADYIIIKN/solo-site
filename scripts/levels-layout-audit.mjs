/**
 * Аудит стыка «Услуги» / «Уровни» 1440: нет чёрной полосы, интро не «висит» с огромным воздухом сверху.
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/levels-layout-audit.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#services-section-1440", { timeout: 30_000 });

  await page.evaluate(() => {
    document.querySelector("#levels-section-1440")?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(500);

  const audit = await page.evaluate(() => {
    const intro = document.querySelector("#levels-intro-1440");
    const levels = document.querySelector("#levels-step1-1440");
    const services = document.querySelector("#services-section-1440");
    const pin = services?.querySelector("[data-services-pin]")?.parentElement ?? services;

    const sampleRow = (y) => {
      const x = 720;
      const el = document.elementFromPoint(x, y);
      if (!el) return { y, tag: null, bg: null };
      let n = el;
      let bg = "";
      for (let i = 0; i < 8 && n; i++) {
        bg = getComputedStyle(n).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") break;
        n = n.parentElement;
      }
      return { y, tag: el.tagName, bg };
    };

    const ir = intro?.getBoundingClientRect();
    const lr = levels?.getBoundingClientRect();

    let gapIntroToLevels = null;
    if (ir && lr) {
      gapIntroToLevels = Math.round(lr.top - ir.bottom);
    }

    const midY = Math.floor(window.innerHeight * 0.85);
    const midSample = sampleRow(midY);

    const isDark = (bg) => {
      if (!bg || bg === "transparent") return false;
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      const r = +m[1],
        g = +m[2],
        b = +m[3];
      return r + g + b < 80;
    };

    return {
      introTop: ir ? Math.round(ir.top) : null,
      introBottom: ir ? Math.round(ir.bottom) : null,
      levelsTop: lr ? Math.round(lr.top) : null,
      gapIntroToLevels,
      sampleMid: midSample,
      midLooksBlack: isDark(midSample.bg),
      pinHeight: pin ? pin.offsetHeight : null,
    };
  });

  console.log(JSON.stringify(audit, null, 2));

  let fail = false;
  if (audit.introTop == null) {
    console.error("FAIL: #levels-intro-1440 not found");
    fail = true;
  }
  if (audit.levelsTop == null) {
    console.error("FAIL: #levels-step1-1440 not found");
    fail = true;
  }
  if (audit.gapIntroToLevels != null && audit.introTop != null && audit.introTop >= 0 && audit.gapIntroToLevels > 80) {
    console.error(
      "FAIL: too much vertical gap between intro and first level block",
      audit.gapIntroToLevels,
    );
    fail = true;
  }
  if (audit.midLooksBlack) {
    console.error("FAIL: viewport ~85% looks black (expected white continuation)", audit.sampleMid);
    fail = true;
  }

  if (!fail) {
    console.log("OK: levels layout audit");
  } else {
    process.exitCode = 1;
  }

  const shot = path.join(__dirname, "levels-audit-1440.png");
  await page.screenshot({ path: shot, fullPage: false });
  console.log("Screenshot:", shot);
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await browser.close();
}
