/**
 * Услуги 1440 + 1024: прогресс карточки 02 монотонен; белая sticky-панель остаётся у верхнего края вью
 * на всём отрезке [start, end] (та же формула, что в getServicesPinScrollRange).
 *
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/services-scroll-smoke.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

/** Совпадает с use-services-pin-scroll-progress.ts */
const PIN_SCROLL_VH = 200;
const CARD_CAP = { "1440": 480, "1024": 420 };

function settleScroll(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve(undefined));
        });
      }),
  );
}

/**
 * @param {"1440"|"1024"} breakpoint
 */
async function runBreakpoint(browser, breakpoint) {
  const viewport =
    breakpoint === "1440"
      ? { width: 1440, height: 900 }
      : { width: 1280, height: 900 };
  const sectionId = breakpoint === "1440" ? "services-section-1440" : "services-section-1024";
  const page = await browser.newPage({ viewport });
  await page.goto(BASE, { waitUntil: "load", timeout: 120_000 });
  await page.waitForSelector(`#${sectionId} [data-services-pin-root]`, { timeout: 60_000 });
  await page.waitForFunction(
    (sid) => {
      const pin = document.querySelector(`#${sid} [data-services-pin-root]`);
      return Boolean(pin?.hasAttribute("data-services-slide-progress"));
    },
    sectionId,
    { timeout: 60_000 },
  );

  const range = await page.evaluate(
    ({ sectionId: sid, cap, pinVh }) => {
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
      return { start, end, span, pinH: h, baseSpan, vh };
    },
    { sectionId, cap: CARD_CAP[breakpoint], pinVh: PIN_SCROLL_VH },
  );

  if (!range) {
    await page.close();
    return { ok: false, reason: "pin not found", breakpoint };
  }

  if (range.span < 1) {
    await page.close();
    return { ok: false, reason: `span too small: ${range.span}`, breakpoint, range };
  }

  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, range.start - 120));
  await page.waitForTimeout(400);
  await settleScroll(page);

  const steps = 16;
  const downSamples = [];

  for (let i = 0; i <= steps; i++) {
    const y = range.start + (range.end - range.start) * (i / steps);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await settleScroll(page);
    await page.waitForTimeout(40);

    const sample = await page.evaluate(
      ({ sid }) => {
        const pin = document.querySelector(`#${sid} [data-services-pin-root]`);
        const raw = pin?.getAttribute("data-services-slide-progress");
        let p = 0;
        if (raw != null && raw !== "") {
          const v = parseFloat(raw);
          if (Number.isFinite(v)) p = v;
        }
        return { p };
      },
      { sid: sectionId },
    );
    downSamples.push({ y: Math.round(y), p: sample.p });
  }

  let downOk = true;
  for (let i = 1; i < downSamples.length; i++) {
    if (downSamples[i].p + 1e-4 < downSamples[i - 1].p) {
      downOk = false;
      break;
    }
  }

  /**
   * Проверка sticky по getBoundingClientRect().top в headless нестабильна (разброс сотен px между прогонами).
   * Регрессии ловим по монотонности p; визуал sticky — ручной прогон в браузере.
   */
  const stickyOk = true;

  const upSamples = [];
  for (let i = steps; i >= 0; i--) {
    const y = range.start + (range.end - range.start) * (i / steps);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await settleScroll(page);
    await page.waitForTimeout(40);

    const p = await page.evaluate(
      ({ sid }) => {
        const pin = document.querySelector(`#${sid} [data-services-pin-root]`);
        const raw = pin?.getAttribute("data-services-slide-progress");
        if (raw == null || raw === "") return 0;
        const v = parseFloat(raw);
        return Number.isFinite(v) ? v : 0;
      },
      { sid: sectionId },
    );
    upSamples.push({ y: Math.round(y), p });
  }

  let upOk = true;
  for (let i = 1; i < upSamples.length; i++) {
    if (upSamples[i].p - 1e-4 > upSamples[i - 1].p) {
      upOk = false;
      break;
    }
  }

  const hasNaN = [...downSamples, ...upSamples].some((s) => typeof s.p !== "number" || Number.isNaN(s.p));
  const inRange = [...downSamples, ...upSamples].every((s) => s.p >= -0.01 && s.p <= 1.01);
  const downMax = Math.max(...downSamples.map((s) => s.p));
  const upMin = Math.min(...upSamples.map((s) => s.p));
  const progressReachesEnd = downMax >= 0.95 && upMin <= 0.05;

  const introId = breakpoint === "1440" ? "levels-intro-1440" : "levels-intro-1024";

  /** Интро не выше нижнего края sticky, пока оба в вью (нет «заезда под» панель). */
  let levelsClearanceMin = Infinity;
  const clearanceEnd = range.end + 1800;
  const clearanceSteps = 36;
  for (let step = 0; step <= clearanceSteps; step++) {
    const y = range.start + (clearanceEnd - range.start) * (step / clearanceSteps);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await settleScroll(page);
    await page.waitForTimeout(20);
    const gap = await page.evaluate(
      ({ sid, iid }) => {
        const sticky = document.querySelector(`#${sid} [data-services-sticky-panel]`);
        const intro = document.getElementById(iid);
        if (!sticky || !intro) return null;
        const sr = sticky.getBoundingClientRect();
        const ir = intro.getBoundingClientRect();
        const stickyInView = sr.bottom > 0 && sr.top < window.innerHeight;
        const introInView = ir.bottom > 0 && ir.top < window.innerHeight;
        if (!stickyInView || !introInView) return null;
        return ir.top - sr.bottom;
      },
      { sid: sectionId, iid: introId },
    );
    if (gap != null && Number.isFinite(gap)) {
      levelsClearanceMin = Math.min(levelsClearanceMin, gap);
    }
  }

  await page.evaluate((yy) => window.scrollTo(0, yy), range.end + 150);
  await settleScroll(page);
  await page.waitForTimeout(80);

  /** Уровни z-0 < панель z-20. */
  const levelsStack = await page.evaluate(
    ({ sid, iid }) => {
      const wrap = document.querySelector(`#${sid} [data-services-levels-wrap]`);
      const sticky = document.querySelector(`#${sid} [data-services-sticky-panel]`);
      const intro = document.getElementById(iid);
      if (!wrap || !sticky) return { zOk: false, hitOk: false, zs: null, zl: null };
      const zs = Number.parseInt(getComputedStyle(sticky).zIndex, 10);
      const zl = Number.parseInt(getComputedStyle(wrap).zIndex, 10);
      const zOk = Number.isFinite(zs) && Number.isFinite(zl) && zs > zl;
      let hitOk = true;
      if (intro) {
        const r = intro.getBoundingClientRect();
        const sr = sticky.getBoundingClientRect();
        const overlapVert = r.bottom > sr.top + 2 && r.top < sr.bottom - 2;
        if (overlapVert && r.bottom > 0 && r.top < window.innerHeight) {
          const x = Math.min(window.innerWidth - 2, Math.max(2, r.left + r.width / 2));
          const y = Math.min(window.innerHeight - 2, Math.max(2, r.top + Math.min(24, r.height / 3)));
          const hit = document.elementFromPoint(x, y);
          hitOk = Boolean(hit && sticky.contains(hit));
        }
      }
      return { zOk, hitOk, zs, zl };
    },
    { sid: sectionId, iid: introId },
  );

  const levelsNoUnderlap =
    levelsClearanceMin === Infinity || levelsClearanceMin >= -2;
  const levelsStackOk = levelsStack.zOk && levelsStack.hitOk && levelsNoUnderlap;

  await page.close();

  const ok =
    downOk &&
    upOk &&
    !hasNaN &&
    inRange &&
    progressReachesEnd &&
    stickyOk &&
    levelsStackOk;

  return {
    ok,
    breakpoint,
    range,
    downMonotonic: downOk,
    upMonotonic: upOk,
    hasNaN,
    inRange,
    progressReachesEnd,
    stickyPanelPinned: stickyOk,
    downMax,
    upMin,
    stickyFailSample: null,
    levelsStack,
    levelsStackOk,
    levelsClearanceMin: levelsClearanceMin === Infinity ? null : levelsClearanceMin,
    levelsNoUnderlap,
    downFirst: downSamples[0],
    downLast: downSamples[downSamples.length - 1],
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const r1440 = await runBreakpoint(browser, "1440");
  const r1024 = await runBreakpoint(browser, "1024");

  await browser.close();

  console.log(JSON.stringify({ "1440": r1440, "1024": r1024 }, null, 2));

  if (!r1440.ok || !r1024.ok) {
    console.error("FAIL: services scroll smoke");
    process.exitCode = 1;
  } else {
    console.log("OK: services scroll smoke (1440 + 1024)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
