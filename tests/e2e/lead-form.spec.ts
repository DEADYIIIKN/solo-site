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

/**
 * TEST-04: error path и silent webhook failure через Playwright `page.route` mock.
 * Эти тесты не зависят от живого `/api/leads` — мы перехватываем запрос и фулфиллим
 * нужным статусом, чтобы покрыть три ветки UX:
 *  1. happy: 200 → success modal
 *  2. true server error: 500 → inline error UI, success modal не открывается
 *  3. silent webhook failure (D4 compromise): сервер вернул 200 даже если webhook упал
 *     (lead сохранён локально) → клиент видит обычный success modal
 *
 * NB: route mock устанавливается ДО goto(), чтобы перехватить любой submit.
 */
test.describe("lead-form / submission flow — mocked /api/leads (TEST-04)", () => {
  test("happy path with mocked 200 — success modal появляется", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, accepted: true, leadId: "e2e-mock-1" }),
      }),
    );
    await page.goto("/");
    await scrollToLeadForm(page);

    const form = page.getByTestId("lead-form").first();
    await fillLeadFormValid(form);
    await toggleConsent(form.getByTestId("lead-form-consent"));
    await form.getByTestId("lead-form-submit").click();

    await expect(page.getByText("скоро вернемся!").first()).toBeVisible({ timeout: 5_000 });
    // inline-ошибка не должна появляться при mocked 200
    await expect(form.getByTestId("lead-form-error")).toHaveCount(0);
  });

  test("true 500 → inline error, success modal НЕ открывается", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "server" }),
      }),
    );
    await page.goto("/");
    await scrollToLeadForm(page);

    const form = page.getByTestId("lead-form").first();
    await fillLeadFormValid(form);
    await toggleConsent(form.getByTestId("lead-form-consent"));
    await form.getByTestId("lead-form-submit").click();

    // inline error UI: data-testid="lead-form-error" с текстом из lead-form-fields.tsx:246
    await expect(form.getByTestId("lead-form-error")).toBeVisible({ timeout: 5_000 });
    await expect(form.getByTestId("lead-form-error")).toContainText(
      "Не удалось отправить заявку",
    );
    // success modal не должна появиться
    await expect(page.getByText("скоро вернемся!", { exact: false })).toHaveCount(0);
  });

  test("silent webhook failure (D4) — сервер всё равно 200, user видит success", async ({ page }) => {
    // D4 compromise: API route возвращает 200 даже при сбое webhook (lead сохранён
    // локально в Collection). Клиент видит ровно тот же 200, что и happy path.
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          accepted: true,
          leadId: "e2e-fallback-1",
          // server-side флаг про webhook не передаётся клиенту по дизайну (D4)
        }),
      }),
    );
    await page.goto("/");
    await scrollToLeadForm(page);

    const form = page.getByTestId("lead-form").first();
    await fillLeadFormValid(form);
    await toggleConsent(form.getByTestId("lead-form-consent"));
    await form.getByTestId("lead-form-submit").click();

    await expect(page.getByText("скоро вернемся!").first()).toBeVisible({ timeout: 5_000 });
    await expect(form.getByTestId("lead-form-error")).toHaveCount(0);
  });
});
