import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Cases section — vertical + ad carousels (TEST-02).
 *
 * Каждый брейкпоинт ниже 1440 рендерит две горизонтальные карусели:
 * - vertical (9:16 кейсы) — секция #cases-section-${LAYOUT}
 * - ad (рекламные кейсы) — следом, в той же секции
 *
 * Каждая карусель использует useCasesHorizontalCarousel + CasesSectionArrowsNav
 * с двумя кнопками: aria-label="Назад" / "Вперёд" (disabled на границах).
 *
 * Цель: убедиться, что на 360/480/820 в Chromium и WebKit:
 * - стрелка «Назад» disabled при загрузке (мы в начале)
 * - клик «Вперёд» сдвигает scroll (scrollLeft увеличивается)
 * - клик «Назад» возвращает scroll к началу
 */

const LAYOUT_BY_WIDTH: Record<number, "768" | "480" | "360"> = {
  820: "768", // resolveViewportLayout: width >= 768 → '768'
  480: "480",
  360: "360",
};

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 480, height: 900 },
  { width: 820, height: 1180 },
] as const;

async function goCases(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const layout = LAYOUT_BY_WIDTH[width];
  const sectionId = `#cases-section-${layout}`;
  const section = page.locator(sectionId);
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible({ timeout: 10_000 });
  return section;
}

/**
 * Берёт scrollLeft контейнера карусели (родителя у списка карточек).
 * В разметке: первый sibling после блока с заголовком/стрелками — это flex-row с overflow-x-auto.
 */
async function readScrollLeft(scroller: Locator): Promise<number> {
  return scroller.evaluate((el) => (el as HTMLElement).scrollLeft);
}

test.describe("cases › horizontal carousels (vertical + ad) cross-browser", () => {
  for (const vp of VIEWPORTS) {
    test(`vertical carousel: arrows next/prev меняют scroll на ${vp.width}px`, async ({ page }) => {
      const section = await goCases(page, vp.width, vp.height);

      const prev = section.getByRole("button", { name: "Назад" }).first();
      const next = section.getByRole("button", { name: "Вперёд" }).first();

      await expect(prev).toBeVisible();
      await expect(next).toBeVisible();

      // На старте «Назад» disabled (scrollLeft=0).
      await expect(prev).toBeDisabled();

      // Скроллер — это первый element с класс .overflow-x-auto в этой секции (vertical carousel).
      const scroller = section.locator(".overflow-x-auto").first();
      await expect(scroller).toBeAttached();
      const startLeft = await readScrollLeft(scroller);

      // Клик «Вперёд» — увеличивает scrollLeft.
      await next.click();
      await expect
        .poll(async () => readScrollLeft(scroller), { timeout: 5_000 })
        .toBeGreaterThan(startLeft);

      // После сдвига «Назад» становится enabled.
      await expect(prev).toBeEnabled();

      // Клик «Назад» — возвращает scroll ближе к началу.
      const afterNextLeft = await readScrollLeft(scroller);
      await prev.click();
      await expect
        .poll(async () => readScrollLeft(scroller), { timeout: 5_000 })
        .toBeLessThan(afterNextLeft);
    });

    test(`ad carousel: arrows next/prev меняют scroll на ${vp.width}px`, async ({ page }) => {
      const section = await goCases(page, vp.width, vp.height);

      // Ad carousel — вторая пара стрелок в секции (после vertical).
      const prevAll = section.getByRole("button", { name: "Назад" });
      const nextAll = section.getByRole("button", { name: "Вперёд" });
      const prev = prevAll.nth(1);
      const next = nextAll.nth(1);

      await prev.scrollIntoViewIfNeeded();
      await expect(prev).toBeVisible();
      await expect(next).toBeVisible();
      await expect(prev).toBeDisabled();

      const scroller = section.locator(".overflow-x-auto").nth(1);
      await expect(scroller).toBeAttached();
      const startLeft = await readScrollLeft(scroller);

      await next.click();
      await expect
        .poll(async () => readScrollLeft(scroller), { timeout: 5_000 })
        .toBeGreaterThan(startLeft);

      await expect(prev).toBeEnabled();

      const afterNextLeft = await readScrollLeft(scroller);
      await prev.click();
      await expect
        .poll(async () => readScrollLeft(scroller), { timeout: 5_000 })
        .toBeLessThan(afterNextLeft);
    });
  }
});
