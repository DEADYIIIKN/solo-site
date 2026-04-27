import { expect, test } from "@playwright/test";

import { validLead } from "./_fixtures";

/**
 * E2E spec для модальной формы (consultation modal), открываемой из header CTA первого экрана.
 *
 * Прим. cases-modals (cases-ad-detail-modal, cases-vertical-detail-modal) на момент wave 1
 * не содержат собственных submission-форм; modal-flow в проекте — это
 * FirstScreenConsultationModal, который открывается через header CTA «связаться» / hero CTA.
 * Эта спека покрывает именно его submission flow (см. SUMMARY.md → Deviations).
 *
 * Покрывает:
 *  - открытие consultation-modal через header CTA "связаться"
 *  - заполнение полей name/phone/message
 *  - toggle consent
 *  - submit → плавный переход на экран "скоро вернемся!"
 *  - закрытие модалки
 */
test.describe("cases / consultation-modal submission flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // ждём пока первый экран отрендерится (useViewportLayout → hydrate)
    await expect(page.getByTestId("first-screen-header-cta")).toBeVisible({ timeout: 10_000 });
  });

  test("happy path: открыть модалку → заполнить → submit → success", async ({ page }) => {
    // 1. Открыть модалку
    await page.getByTestId("first-screen-header-cta").click();
    await expect(page.getByTestId("consultation-modal-card")).toBeVisible({ timeout: 5_000 });

    // 2. Заполнить
    const card = page.getByTestId("consultation-modal-card");
    await card.getByTestId("consultation-modal-name").fill(validLead.name);
    await card.getByTestId("consultation-modal-phone").fill(validLead.phone);
    await card.getByTestId("consultation-modal-message").fill(validLead.message);

    // 3. Toggle consent (input sr-only → клик по тексту лейбла)
    await card.getByText("Согласен(на) на обработку").click();
    await expect(card.getByTestId("consultation-modal-consent")).toBeChecked();

    // 4. Submit → success step
    await card.getByTestId("consultation-modal-submit").click();
    await expect(page.getByText("скоро вернемся!").first()).toBeVisible({ timeout: 5_000 });
    await expect(
      page.getByText("Мы получили вашу заявку и скоро свяжемся с вами").first(),
    ).toBeVisible();

    // 5. Закрыть
    await page.getByTestId("consultation-modal-close").click();
    await expect(page.getByTestId("consultation-modal-card")).toHaveCount(0);
  });

  test("submit без consent — модалка остаётся, форма не уходит в success", async ({ page }) => {
    await page.getByTestId("first-screen-header-cta").click();
    const card = page.getByTestId("consultation-modal-card");
    await expect(card).toBeVisible();

    await card.getByTestId("consultation-modal-name").fill(validLead.name);
    await card.getByTestId("consultation-modal-phone").fill(validLead.phone);
    await card.getByTestId("consultation-modal-submit").click();

    // не должна появиться success-надпись
    await expect(page.getByText("скоро вернемся!")).toHaveCount(0);
    await expect(card.getByTestId("consultation-modal-consent")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
