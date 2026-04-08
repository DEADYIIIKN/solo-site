/**
 * Аудит модалки консультации: размеры и отступы vs Figma.
 * Эталоны: 783:9819 (360), 783:9841 (480), 783:9860 (768), 783:9879 (1024), 783:9898 (1440).
 *
 * Два входа (как на сайте):
 * - consultation — круглый CTA «Бесплатная консультация» (hero);
 * - task — шапка «связаться» (1024/1440) или меню → «связаться» (360–768).
 *
 * Запуск: BASE_URL=http://127.0.0.1:3000 node scripts/consultation-modal-audit.mjs
 * Выход: 0 — все проверки в допуске, 1 — есть расхождения.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, ".visual-run");
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";

const T = 2; // px допуск для геометрии
const TF = 1; // px для font-size

/** @typedef {{ figma: string; close: number; gapCloseCard: number; cardPadX: number; cardPadY: number | { min: number; max: number }; columnMaxW: number; titlePx: number; submitH: number; submitFontPx: number; textareaH: number; consentPx: number; overlayNoScroll: boolean }} ViewportSpec */

/** Ожидаемая ширина белой карточки: min(columnMaxW, viewport − padding shell). */
function expectedCardWidth(vpName, viewportWidth) {
  const shellPadX = {
    "360": 32,
    "480": 48,
    "768": 32,
    "1024": 32,
    "1440": 32,
  };
  const columnMaxW = {
    "360": 360,
    "480": 480,
    "768": 504,
    "1024": 616,
    "1440": 686,
  };
  return Math.min(
    columnMaxW[vpName],
    viewportWidth - shellPadX[vpName],
  );
}

/** @type {Record<string, ViewportSpec>} */
const SPEC = {
  "360": {
    figma: "783:9819",
    close: 24,
    gapCloseCard: 10,
    cardPadX: 16,
    cardPadY: 24,
    columnMaxW: 360,
    titlePx: 23,
    submitH: 44,
    submitFontPx: 13,
    textareaH: 80,
    consentPx: 11,
    overlayNoScroll: true,
  },
  "480": {
    figma: "783:9841",
    close: 28,
    gapCloseCard: 10,
    cardPadX: 20,
    cardPadY: 24,
    columnMaxW: 480,
    titlePx: 30,
    submitH: 48,
    submitFontPx: 14,
    textareaH: 80,
    consentPx: 12,
    overlayNoScroll: true,
  },
  "768": {
    figma: "783:9860",
    close: 30,
    gapCloseCard: 10,
    cardPadX: 24,
    cardPadY: 24,
    columnMaxW: 504,
    titlePx: 32,
    submitH: 52,
    submitFontPx: 15,
    textareaH: 80,
    consentPx: 14,
    overlayNoScroll: true,
  },
  "1024": {
    figma: "783:9879",
    close: 34,
    gapCloseCard: 10,
    cardPadX: 30,
    cardPadY: 30,
    columnMaxW: 616,
    titlePx: 38,
    submitH: 56,
    submitFontPx: 16,
    textareaH: 80,
    consentPx: 16,
    overlayNoScroll: true,
  },
  "1440": {
    figma: "783:9898",
    close: 34,
    gapCloseCard: 20,
    cardPadX: 30,
    cardPadY: 30,
    columnMaxW: 686,
    titlePx: 40,
    submitH: 60,
    submitFontPx: 17,
    textareaH: 100,
    consentPx: 16,
    overlayNoScroll: true,
  },
};

const viewports = [
  { name: "360", width: 360, height: 900 },
  { name: "480", width: 480, height: 900 },
  { name: "768", width: 768, height: 900 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

function near(actual, expected, tol) {
  return Math.abs(actual - expected) <= tol;
}

function padOk(actual, spec) {
  if (typeof spec === "number") return near(actual, spec, T);
  return actual >= spec.min - T && actual <= spec.max + T;
}

/** Вход: вариант «бесплатная консультация» (hero). */
async function openConsultationModal(page) {
  await page.getByRole("button", { name: "Бесплатная консультация" }).first().click();
  await page.locator('[role="dialog"]').waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(400);
}

/** Вход: вариант «поможем с задачей» — шапка или меню. */
async function openTaskModal(page, vpName) {
  if (vpName === "1024" || vpName === "1440") {
    await page.getByRole("button", { name: "связаться" }).click();
  } else {
    await page.getByRole("button", { name: "Открыть меню" }).click();
    await page.getByRole("button", { name: "связаться" }).waitFor({
      state: "visible",
      timeout: 10_000,
    });
    await page.waitForTimeout(450);
    await page.getByRole("button", { name: "связаться" }).click();
  }
  await page.locator('[role="dialog"]').waitFor({ state: "visible", timeout: 10_000 });
  await page.waitForTimeout(400);
}

const VARIANTS = [
  { id: "consultation", open: openConsultationModal },
  { id: "task", open: openTaskModal },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const report = [];

  for (const vp of viewports) {
    const spec = SPEC[vp.name];

    for (const variant of VARIANTS) {
      const context = await browser.newContext({ viewport: vp });
      const page = await context.newPage();
      const row = {
        viewport: vp.name,
        variant: variant.id,
        figma: spec.figma,
        checks: [],
        ok: true,
      };

      try {
        await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 });
        if (variant.id === "consultation") {
          await variant.open(page);
        } else {
          await variant.open(page, vp.name);
        }

      const data = await page.evaluate(() => {
        const close = document.querySelector(
          '[data-testid="consultation-modal-close"]',
        );
        const card = document.querySelector(
          '[data-testid="consultation-modal-card"]',
        );
        const submit = card?.querySelector('button[type="submit"]');
        const titleP =
          card?.querySelector("p[id]") ?? card?.querySelector("p");

        const titleSpan = titleP?.querySelector("span");
        const titleFont = titleSpan
          ? parseFloat(getComputedStyle(titleSpan).fontSize)
          : titleP
            ? parseFloat(getComputedStyle(titleP).fontSize)
            : 0;

        const consentLabel = [...(card?.querySelectorAll("label") ?? [])].find(
          (l) => l.querySelector('input[type="checkbox"]'),
        );
        const consentEl =
          consentLabel?.querySelector("p") ??
          consentLabel?.querySelector("span.flex-1") ??
          consentLabel?.querySelector("span.min-w-0");

        const textareaWrap = [...(card?.querySelectorAll("label") ?? [])].find(
          (l) => l.querySelector("textarea"),
        );

        const scrollable = document.querySelector(
          '[role="dialog"] .overflow-y-auto',
        );
        let overlayScroll = { scrollHeight: 0, clientHeight: 0, hasScroll: false };
        if (scrollable) {
          overlayScroll = {
            scrollHeight: scrollable.scrollHeight,
            clientHeight: scrollable.clientHeight,
            hasScroll: scrollable.scrollHeight > scrollable.clientHeight + 1,
          };
        }

        if (!close || !card || !submit || !titleP) {
          return { error: "missing nodes" };
        }

        const cr = close.getBoundingClientRect();
        const fr = card.getBoundingClientRect();
        const gapCloseCard = fr.top - cr.bottom;
        const padX = parseFloat(getComputedStyle(card).paddingLeft);
        const padY = parseFloat(getComputedStyle(card).paddingTop);
        const submitFont = parseFloat(getComputedStyle(submit).fontSize);
        const consentFont = consentEl
          ? parseFloat(getComputedStyle(consentEl).fontSize)
          : 0;

        let textareaH = 0;
        if (textareaWrap) {
          textareaH = textareaWrap.getBoundingClientRect().height;
        }

        const titleText = (titleP?.textContent ?? "").replace(/\s+/g, " ").trim();

        return {
          closeW: cr.width,
          closeH: cr.height,
          gapCloseCard,
          cardW: fr.width,
          cardMaxInner: fr.width,
          padX,
          padY,
          titleFont,
          titleText,
          submitH: submit.getBoundingClientRect().height,
          submitFont,
          textareaH,
          consentFont,
          overlayScroll,
        };
      });

      if (data.error) {
        row.ok = false;
        row.checks.push({ name: "dom", pass: false, detail: data.error });
        failures.push(`${vp.name} ${variant.id}: ${data.error}`);
        report.push(row);
        await context.close();
        continue;
      }

      function check(name, pass, actual, expected, unit = "px") {
        row.checks.push({
          name,
          pass,
          actual,
          expected,
          unit,
        });
        if (!pass) row.ok = false;
      }

      const consultationTitle =
        /бесплатная|консультация/i.test(data.titleText ?? "");
      const taskTitle = /поможем|задач/i.test(data.titleText ?? "");
      check(
        variant.id === "consultation" ? "заголовок (консультация)" : "заголовок (задача)",
        variant.id === "consultation" ? consultationTitle : taskTitle,
        (data.titleText ?? "").slice(0, 72),
        variant.id === "consultation" ? "бесплатная / консультация" : "поможем / задача",
        "text",
      );

      check(
        "close",
        near(data.closeW, spec.close, T) && near(data.closeH, spec.close, T),
        `${Math.round(data.closeW)}×${Math.round(data.closeH)}`,
        spec.close,
      );
      check(
        "gap(close→card)",
        near(data.gapCloseCard, spec.gapCloseCard, T),
        Math.round(data.gapCloseCard * 10) / 10,
        spec.gapCloseCard,
      );
      const expCardW = expectedCardWidth(vp.name, vp.width);
      check(
        "card width (column vs shell pad)",
        near(data.cardW, expCardW, T),
        Math.round(data.cardW * 10) / 10,
        expCardW,
      );
      check(
        "card padding-x",
        near(data.padX, spec.cardPadX, T),
        Math.round(data.padX * 10) / 10,
        spec.cardPadX,
      );
      check(
        "card padding-y",
        padOk(data.padY, spec.cardPadY),
        Math.round(data.padY * 10) / 10,
        spec.cardPadY,
      );
      check(
        "title font-size",
        near(data.titleFont, spec.titlePx, TF),
        Math.round(data.titleFont * 10) / 10,
        spec.titlePx,
      );
      check(
        "submit height",
        near(data.submitH, spec.submitH, T),
        Math.round(data.submitH * 10) / 10,
        spec.submitH,
      );
      check(
        "submit font-size",
        near(data.submitFont, spec.submitFontPx, TF),
        Math.round(data.submitFont * 10) / 10,
        spec.submitFontPx,
      );
      check(
        "textarea block height",
        near(data.textareaH, spec.textareaH, T),
        Math.round(data.textareaH * 10) / 10,
        spec.textareaH,
      );
      check(
        "consent font-size",
        near(data.consentFont, spec.consentPx, TF),
        Math.round(data.consentFont * 10) / 10,
        spec.consentPx,
      );
      if (spec.overlayNoScroll && data.overlayScroll) {
        check(
          "overlay без лишнего скролла",
          !data.overlayScroll.hasScroll,
          data.overlayScroll.hasScroll
            ? `scroll ${data.overlayScroll.scrollHeight}>${data.overlayScroll.clientHeight}`
            : "ok",
          "no overflow",
        );
      }

      if (!row.ok) {
        failures.push(
          `${vp.name} ${variant.id} (Figma ${spec.figma}): ${row.checks.filter((c) => !c.pass).map((c) => c.name).join(", ")}`,
        );
      }
    } catch (e) {
      row.ok = false;
      row.error = String(e?.message || e);
      failures.push(`${vp.name} ${variant.id}: ${row.error}`);
    }

    report.push(row);
    await context.close();
    }
  }

  await browser.close();

  const reportPath = join(outDir, "modal-audit-report.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log("\nОтчёт:", reportPath);

  if (failures.length) {
    console.error("\nОшибки аудита:\n", failures.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
