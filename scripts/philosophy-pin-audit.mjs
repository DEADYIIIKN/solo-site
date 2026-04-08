/**
 * Проверка: прогресс стопки карточек «философия» растёт при скролле по pin-зоне.
 * Прогоняет несколько ширин viewport (1440 / 1366 / 1280) — типичные десктопы, где раньше ломался matchMedia(1440).
 *
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/philosophy-pin-audit.mjs
 * (сервер: pnpm dev)
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const VIEWPORT_WIDTHS = [1440, 1366, 1280];

async function runForWidth(browser, width) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.goto(BASE, { waitUntil: "networkidle", timeout: 120_000 });
  await page.addStyleTag({
    content:
      "html { scroll-behavior: auto !important; overflow-anchor: none !important; } " +
      "body { overflow-anchor: none !important; }",
  });
  await page.waitForSelector("[data-philosophy-pin]", { timeout: 30_000 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  async function measurePinRange() {
    return page.evaluate(() => {
      const pin = document.querySelector("[data-philosophy-pin]");
      if (!pin) return null;
      const h = pin.offsetHeight;
      const vh = window.innerHeight;
      const start = pin.getBoundingClientRect().top + window.scrollY;
      const endScroll = start + Math.max(0, h - vh);
      return { pinHeight: h, viewportH: vh, scrollStart: start, scrollEnd: endScroll };
    });
  }

  async function alignPinStartToViewport() {
    await page.evaluate(() => {
      const pin = document.querySelector("[data-philosophy-pin]");
      if (!pin) return;
      document.documentElement.style.scrollBehavior = "auto";
      for (let i = 0; i < 24; i++) {
        const top = pin.getBoundingClientRect().top;
        if (Math.abs(top) < 1.5) break;
        window.scrollBy(0, top);
        window.dispatchEvent(new Event("scroll"));
      }
    });
    await page.waitForTimeout(350);
  }

  const metrics = await measurePinRange();

  if (!metrics || metrics.pinHeight < 100) {
    console.error(`FAIL [${width}px]: pin not measured`, metrics);
    await page.close();
    return false;
  }

  await alignPinStartToViewport();

  async function sampleAt(scrollY) {
    const y = Math.round(scrollY);
    await page.evaluate((target) => {
      document.documentElement.style.scrollBehavior = "auto";
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;
      window.scrollTo(0, target);
      for (let i = 0; i < 4; i++) {
        window.dispatchEvent(new Event("scroll", { bubbles: true }));
      }
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve(undefined));
        });
      });
    }, y);
    await page
      .waitForFunction((target) => Math.abs(window.scrollY - target) <= 2, y, { timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(600);
    return page.evaluate(() => {
      function ty(t) {
        if (!t || t === "none") return 0;
        const m = t.match(/matrix\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(",").map((s) => parseFloat(s.trim()));
          if (p.length === 6) return p[5];
        }
        const m2 = t.match(/translate3d\(([^)]+)\)/);
        if (m2) {
          const p = m2[1].split(",").map((s) => parseFloat(s.trim()));
          if (p.length >= 2) return p[1];
        }
        return NaN;
      }
      const pin = document.querySelector("[data-philosophy-pin]");
      const card = document.querySelector('[data-philosophy-card="0"]');
      if (!pin || !card) return null;
      const pinTop = pin.getBoundingClientRect().top;
      const translateY = ty(getComputedStyle(card).transform);
      return { scrollY: window.scrollY, pinTop, translateY };
    });
  }

  const range = (await measurePinRange()) ?? metrics;
  const entry = await sampleAt(range.scrollStart);
  const entryOpacities = await page.evaluate(() =>
    [0, 1, 2, 3, 4].map((i) => {
      const el = document.querySelector(`[data-philosophy-card="${i}"]`);
      return el ? parseFloat(window.getComputedStyle(el).opacity) : -1;
    }),
  );
  const mid = await sampleAt(range.scrollStart + (range.scrollEnd - range.scrollStart) * 0.45);
  const end = await sampleAt(range.scrollEnd);

  await page.close();

  const out = { viewportWidth: width, ...range, entry, entryOpacities, mid, end };
  console.log(JSON.stringify(out, null, 2));

  if (entryOpacities.some((o) => o < 0)) {
    console.error(`FAIL [${width}px]: missing [data-philosophy-card] nodes`, entryOpacities);
    return false;
  }
  const visibleAtEntry = entryOpacities.filter((o) => o > 0.05).length;
  if (visibleAtEntry !== 1 || (entryOpacities[0] ?? 0) < 0.5) {
    console.error(`FAIL [${width}px]: at pin entry expect only card 01 visible`, entryOpacities);
    return false;
  }
  for (let i = 1; i <= 4; i += 1) {
    if ((entryOpacities[i] ?? 1) > 0.05) {
      console.error(`FAIL [${width}px]: cards 02–05 must be opacity 0 at pin entry`, entryOpacities);
      return false;
    }
  }

  const e = entry?.translateY ?? NaN;
  const m = mid?.translateY ?? NaN;
  const endTy = end?.translateY ?? NaN;

  if (!(e > 180)) {
    console.error(`FAIL [${width}px]: card 01 should start with large translateY`, e);
    return false;
  }
  if (!(m < e - 40)) {
    console.error(`FAIL [${width}px]: translateY should decrease mid-scroll`, { e, m, end: endTy });
    return false;
  }
  if (!(Math.abs(endTy) < 2)) {
    console.error(`FAIL [${width}px]: card 01 should end ~translateY 0`, endTy);
    return false;
  }

  console.log(`OK [${width}px]: philosophy pin stack scroll behaves as expected.`);
  return true;
}

async function main() {
  const browser = await chromium.launch();

  for (const w of VIEWPORT_WIDTHS) {
    const ok = await runForWidth(browser, w);
    if (!ok) {
      await browser.close();
      process.exit(1);
    }
  }

  await browser.close();
  console.log("OK: all viewport widths passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
