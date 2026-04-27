import { expect, test } from "@playwright/test";

/**
 * Cross-browser smoke (TEST-02).
 *
 * Запускается на всех projects (chromium-1440, webkit-1440, mobile-safari).
 * Проверяет, что главная страница успешно рендерит ключевые секции
 * (hero / business-goals / team / philosophy / cases / services / levels / lead-form / footer)
 * и не падает с гидратацией ни в Chromium, ни в WebKit.
 *
 * Идеология: agnostic-проверки по data-id корневых секций — конкретная вёрстка
 * (1440 / 1024 / 768 / 480 / 360) проверяется на других уровнях (carousel-*.spec).
 */

test.describe("cross-browser › main page smoke", () => {
  test("главная страница рендерит все ключевые секции", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
    });

    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok(), "главная отвечает 2xx").toBeTruthy();

    // hero / first-screen — корневая секция всегда смонтирована (#first-screen-section).
    await expect(page.locator("#first-screen-section")).toBeVisible();

    // business-goals — общий wrapper, без useViewportLayout.
    await expect(page.locator("#business-goals-section")).toBeAttached();

    // useViewportLayout: ждём пока «зашунтированные» секции домаунтятся (data-testid появится после mount).
    await expect(page.locator("#what-we-do-section")).toBeAttached();
    await expect(page.locator("#philosophy-section")).toBeAttached();
    await expect(page.locator("#cases-section")).toBeAttached();
    await expect(page.locator("#services-section")).toBeAttached();
    await expect(page.locator("#lead-form-section")).toBeAttached();
    await expect(page.locator("#footer-section")).toBeAttached();

    // lead-form domounted (data-testid появляется после useViewportLayout resolve).
    await expect(page.getByTestId("lead-form").first()).toBeVisible({ timeout: 10_000 });

    // Никаких runtime-ошибок в консоли (часто бывают разные между Chromium/WebKit).
    // Известные exception-исключения добавляем сюда. Сейчас — пусто.
    const fatalErrors = errors.filter((e) => !e.includes("favicon"));
    expect(fatalErrors, `runtime errors: ${fatalErrors.join("\n")}`).toHaveLength(0);
  });

  test("главная грузится на мобильном viewport (360-эквивалент)", async ({ page, viewport }) => {
    // mobile-safari project задаёт iPhone 13 (≈390x844). На desktop projects — форсируем 360.
    if (!viewport || viewport.width > 768) {
      await page.setViewportSize({ width: 360, height: 800 });
    }

    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator("#first-screen-section")).toBeVisible();
    await expect(page.getByTestId("lead-form").first()).toBeVisible({ timeout: 10_000 });
    // На мобильном секция footer должна тоже отрендериться после mount.
    await expect(page.locator("#footer-section")).toBeAttached();
  });
});
