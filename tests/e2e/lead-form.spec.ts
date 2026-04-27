import { expect, test } from "@playwright/test";

import { fillLeadFormValid, scrollToLeadForm, toggleConsent, validLead } from "./_fixtures";

/**
 * E2E spec для главной lead-form (LeadFormSection в конце страницы).
 * Покрывает:
 *  - валидация (submit пустой формы → ошибка, форма не закрывается)
 *  - happy path: name + phone + message + consent → submit → success modal "скоро вернемся!"
 *  - toggle consent — checkbox state синхронизируется
 */
test.describe("lead-form / submission flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await scrollToLeadForm(page);
  });

  test("submit без consent оставляет форму открытой и подсвечивает ошибку", async ({ page }) => {
    const form = page.getByTestId("lead-form").first();
    await form.getByTestId("lead-form-name").fill(validLead.name);
    await form.getByTestId("lead-form-phone").fill(validLead.phone);
    await form.getByTestId("lead-form-submit").click();

    // success-модалка не должна появиться
    await expect(page.getByText("скоро вернемся!", { exact: false })).toHaveCount(0);
    // consent в состоянии invalid — aria-invalid выставляется при submitAttempted без consent
    await expect(form.getByTestId("lead-form-consent")).toHaveAttribute("aria-invalid", "true");
  });

  test("toggle consent через клик по label — state переключается", async ({ page }) => {
    const form = page.getByTestId("lead-form").first();
    const consent = form.getByTestId("lead-form-consent");

    await expect(consent).not.toBeChecked();
    // input скрыт (sr-only) → кликаем напрямую с force (cross-browser-safe, см. _fixtures).
    await toggleConsent(consent);
    await expect(consent).toBeChecked();
  });

  test("happy path — форма отправляется, появляется success modal", async ({ page }) => {
    const form = page.getByTestId("lead-form").first();
    await fillLeadFormValid(form);

    // toggle consent (cross-browser-safe)
    await toggleConsent(form.getByTestId("lead-form-consent"));
    await expect(form.getByTestId("lead-form-consent")).toBeChecked();

    await form.getByTestId("lead-form-submit").click();

    // success-modal Radix: title "скоро вернемся!"
    await expect(page.getByText("скоро вернемся!").first()).toBeVisible({ timeout: 5_000 });
    await expect(
      page.getByText("Мы получили вашу заявку и скоро свяжемся с вами").first(),
    ).toBeVisible();

    // форма очищена для следующего использования
    await page.getByRole("button", { name: /вернуться/i }).first().click();
    await expect(form.getByTestId("lead-form-name")).toHaveValue("");
  });
});
