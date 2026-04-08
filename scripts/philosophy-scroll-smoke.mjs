/**
 * Дымовой тест: стабильность scrollY после выхода из pin + модалка не оставляет overflow на body.
 * Запуск: BASE_URL=http://127.0.0.1:3012 node scripts/philosophy-scroll-smoke.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

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

  const yPast = range.end + 150;
  await page.evaluate((y) => window.scrollTo(0, y), yPast);
  await page.waitForTimeout(350);

  const samples = [];
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(100);
    samples.push(await page.evaluate(() => window.scrollY));
  }
  const minY = Math.min(...samples);
  const maxY = Math.max(...samples);
  const drift = maxY - minY;
  console.log(
    JSON.stringify({ step: "after_pin_samples", yPast, samples, drift }, null, 2),
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("open-consultation-modal", { detail: { variant: "task" } }));
  });
  /* fixed у dialog даёт offsetParent === null — ориентируемся на rect + opacity */
  await page.waitForFunction(
    () => {
      const dialogs = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')];
      return dialogs.some((d) => {
        const r = d.getBoundingClientRect();
        const o = parseFloat(getComputedStyle(d).opacity);
        return r.width > 20 && r.height > 20 && o > 0.5;
      });
    },
    { timeout: 20_000 },
  );
  const overflowWhileOpen = await page.evaluate(() => document.body.style.overflow);
  await page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')];
    const visible = dialogs.find((d) => {
      const r = d.getBoundingClientRect();
      const o = parseFloat(getComputedStyle(d).opacity);
      return r.width > 20 && r.height > 20 && o > 0.5;
    });
    visible?.querySelector('[data-testid="consultation-modal-close"]')?.click();
  });
  await page.waitForTimeout(600);
  const overflowAfterClose = await page.evaluate(() => document.body.style.overflow);

  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(250);
  const syScroll = await page.evaluate(() => window.scrollY);

  await browser.close();

  const maxDrift = 15;
  if (drift > maxDrift) {
    console.error(`FAIL: scrollY drift after leaving pin (${drift}px > ${maxDrift}px)`);
    process.exit(1);
  }
  if (overflowWhileOpen !== "hidden") {
    console.error("FAIL: body.style.overflow should be hidden while modal open, got:", overflowWhileOpen);
    process.exit(1);
  }
  if (overflowAfterClose !== "") {
    console.error("FAIL: body overflow should be cleared after modal close, got:", JSON.stringify(overflowAfterClose));
    process.exit(1);
  }
  if (syScroll < 500) {
    console.error("FAIL: page should scroll after modal test, scrollY=", syScroll);
    process.exit(1);
  }

  console.log("OK: philosophy-scroll-smoke passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
