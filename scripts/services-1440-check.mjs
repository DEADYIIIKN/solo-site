/**
 * Проверка блока услуг 1440: нет uppercase у заголовка, CTA в одну строку.
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/services-1440-check.mjs
 * (сервер должен быть поднят: pnpm dev)
 */
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#services-section-1440", { timeout: 30_000 });
  await page.locator("#services-section-1440").evaluate((el) => {
    el.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);

  const report = await page.evaluate(() => {
    const section = document.querySelector("#services-section-1440");
    if (!section) return { ok: false, error: "section missing" };

    const articles = [...section.querySelectorAll("article")];
    const titleRows = articles.map((art) => {
      const z3 = art.querySelector(".z-\\[3\\]");
      if (!z3?.firstElementChild) return null;
      const el = z3.firstElementChild;
      const cs = getComputedStyle(el);
      return {
        textTransform: cs.textTransform,
        fontSize: cs.fontSize,
        sample: (el.textContent ?? "").slice(0, 80),
      };
    });

    const ctaButtons = [...section.querySelectorAll("button")].filter((b) =>
      (b.textContent ?? "").toLowerCase().includes("консультац"),
    );

    const cta = ctaButtons.map((btn) => {
      const cs = getComputedStyle(btn);
      const nowrap = cs.whiteSpace === "nowrap" || cs.whiteSpace === "pre";
      const fitsWidth = btn.scrollWidth <= btn.clientWidth + 1;
      const range = document.createRange();
      range.selectNodeContents(btn);
      const lineBoxes = range.getClientRects().length;
      return {
        scrollWidth: btn.scrollWidth,
        clientWidth: btn.clientWidth,
        whiteSpace: cs.whiteSpace,
        nowrap,
        fitsWidth,
        textLineBoxes: lineBoxes,
      };
    });

    const badges = [...section.querySelectorAll("article")].map((art, i) => {
      const nums = [...art.querySelectorAll("span")].filter(
        (s) => /^(0[1-5])$/.test((s.textContent ?? "").trim()),
      );
      return { card: i, stepLabels: [...new Set(nums.map((s) => s.textContent?.trim()))] };
    });

    return {
      ok: true,
      titleRows,
      cta,
      badges,
    };
  });

  console.log(JSON.stringify(report, null, 2));

  const titlesOk = report.titleRows?.every(
    (r) => r && r.textTransform === "none" && r.fontSize === "40px",
  );
  const ctaOk = report.cta?.every((c) => c.nowrap && c.fitsWidth && c.textLineBoxes <= 1);
  const fiveEach = report.badges?.every((b) => {
    const set = new Set(b.stepLabels);
    return ["01", "02", "03", "04", "05"].every((n) => set.has(n));
  });

  let failed = false;
  if (!titlesOk) {
    console.error("FAIL: title text-transform must be none, font-size 40px");
    failed = true;
  }
  if (!ctaOk) {
    console.error("FAIL: CTA must be nowrap, one line, no horizontal overflow");
    failed = true;
  }
  if (!fiveEach) {
    console.error("FAIL: expected step badges 01–05 on each card", report.badges);
    failed = true;
  }

  if (!failed) {
    console.log("OK: services 1440 typography + CTA + badges");
  } else {
    process.exitCode = 1;
  }
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await browser.close();
}
