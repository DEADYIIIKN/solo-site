import { type Locator, type Page, expect } from "@playwright/test";

/**
 * Тестовые данные для submission flow.
 * Телефон в формате, который проходит isConsultationPhoneValid (RU: +7 ___ ___-__-__).
 */
export const validLead = {
  name: "Тест Тестов",
  /** 10 цифр после +7 — формат принимает formatConsultationPhone */
  phone: "9001234567",
  message: "Это автотестовое сообщение от Playwright e2e suite.",
} as const;

/**
 * Прокручивает к секции lead-form (она в конце страницы) и ждёт пока форма отрендерится.
 * useViewportLayout рендерит формы только после mount → ждём data-testid="lead-form".
 */
export async function scrollToLeadForm(page: Page) {
  await page.locator("#lead-form-section").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("lead-form").first()).toBeVisible({ timeout: 10_000 });
}

/**
 * Заполняет указанную форму валидными данными.
 * Работает и для главной lead-form, и для consultation-modal — оба используют data-testid="lead-form-*".
 */
export async function fillLeadFormValid(form: Locator) {
  await form.getByTestId("lead-form-name").fill(validLead.name);
  await form.getByTestId("lead-form-phone").fill(validLead.phone);
  await form.getByTestId("lead-form-message").fill(validLead.message);
}

/**
 * Cross-browser-safe toggle consent.
 *
 * `input[data-testid$="consent"]` объявлен `class="sr-only"` — Playwright считает его
 * скрытым и блокирует прямой `click`. Связанный `<label>` (через htmlFor или wrapper)
 * содержит ссылку «Политика конфиденциальности», которая в WebKit перехватывает клики
 * по inline-тексту. Это валило wave-1 тесты под webkit-1440 / mobile-safari.
 *
 * Решение: использовать `dispatchEvent('click')` напрямую на скрытом input. Этот вызов
 * Playwright выполняет через `element.dispatchEvent(new MouseEvent('click', {...}))`,
 * что: (а) не требует visibility, (б) триггерит native checkbox toggle + React onChange.
 * Стабильно работает в Chromium, WebKit, mobile-safari.
 */
export async function toggleConsent(consentInput: Locator) {
  await consentInput.dispatchEvent("click");
}
