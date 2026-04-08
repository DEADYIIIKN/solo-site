/**
 * Ловит неожиданное уменьшение scrollY при прокрутке вниз через конец pin (отталкивание вверх).
 * BASE_URL=http://127.0.0.1:3000 node scripts/philosophy-kick-detect.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const MAX_KICKBACK_PX = 3;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForSelector("[data-philosophy-pin]", { timeout: 30_000 });

  const range = await page.evaluate(() => {
    const pin = document.querySelector("[data-philosophy-pin]");
    const h = pin.offsetHeight;
    const vh = window.innerHeight;
    const start = Math.round(pin.getBoundingClientRect().top + window.scrollY);
    const end = start + Math.max(0, h - vh);
    return { start, end };
  });

  /* У конца pin — сразу за границей тоже ловим скачок */
  await page.evaluate((y) => window.scrollTo(0, y), range.end - 40);
  await page.waitForTimeout(250);

  const history = [];
  let prev = await page.evaluate(() => window.scrollY);

  /* Мелкие шаги колесом вниз — как трекпад; любой шаг вверх > порога = отталкивание */
  for (let step = 0; step < 120; step++) {
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(12);
    const y = await page.evaluate(() => window.scrollY);
    history.push(Math.round(y * 10) / 10);
    if (y < prev - MAX_KICKBACK_PX) {
      const kick = prev - y;
      console.error(
        JSON.stringify(
          {
            FAIL: "scrollY jumped up",
            step,
            prev,
            y,
            kickPx: kick,
            rangeEnd: range.end,
            sampleTail: history.slice(-16),
          },
          null,
          2,
        ),
      );
      await browser.close();
      process.exit(1);
    }
    prev = y;
  }

  await browser.close();
  const maxY = Math.max(...history);
  const minY = Math.min(...history);
  console.log(
    JSON.stringify(
      {
        OK: true,
        rangeEnd: range.end,
        finalScroll: history[history.length - 1],
        maxScroll: maxY,
        delta: maxY - minY,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
