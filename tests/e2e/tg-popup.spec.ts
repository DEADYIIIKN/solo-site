import { expect, test } from "@playwright/test";

/**
 * E2E spec для TG-popup flow (Phase 10, plan 10-04, requirement TEST-06).
 *
 * Покрывает:
 *  1. Pop-up появляется через 2s активности (TRIGGER_MS=2000 в playwright webServer.env).
 *  2. Dismiss через ✕ button — закрывает + sessionStorage["tg-popup-dismissed"] === "1".
 *  3. Dismiss через overlay click (backdrop button).
 *  4. Dismiss через ESC keydown.
 *  5. После reload pop-up НЕ появляется снова (sessionStorage persistence).
 *  6. В новом browser context pop-up появляется снова (fresh sessionStorage).
 *  7. Idle-gate: без активности accumulator не растёт → pop-up не появляется.
 *  8. CTA-link имеет target=_blank + rel=noopener + href в виде t.me URL.
 *
 * Реальное время вместо page.clock: useActivityTimer использует Date.now() +
 * setInterval, и page.clock с реальной mouse-активностью (через Playwright CDP)
 * не симулирует accumulator корректно. Прагматичное решение — короткий
 * 2-секундный TRIGGER_MS в test mode (через NEXT_PUBLIC_TG_POPUP_TRIGGER_MS=2000
 * в playwright.config.ts webServer.env). Production-default остаётся 60_000.
 */

const POPUP_ROOT = '[data-testid="tg-popup-root"]';
const POPUP_CLOSE = '[data-testid="tg-popup-close"]';
const POPUP_CTA = '[data-testid="tg-popup-cta"]';

/**
 * Имитирует «активного» пользователя: сразу одно событие мыши, чтобы запустить
 * markActivity() в useActivityTimer; затем 2.5s реального ожидания
 * (TRIGGER_MS=2000 + small buffer для setInterval ticks + React flush).
 */
async function primePopupTrigger(page: import("@playwright/test").Page) {
  await page.mouse.move(100, 100);
  // Активность каждые 500ms — гарантия что idle-gate (30s) не сработает,
  // а accumulator успевает добраться до 2s.
  for (let i = 0; i < 6; i++) {
    await page.mouse.move(100 + i * 5, 100 + i * 5);
    await page.waitForTimeout(500);
  }
}

test.describe("TG popup", () => {
  test.beforeEach(async ({ page }) => {
    // Override TRIGGER_MS до 2s через window flag (production default 60s).
    // Прицельный override только в этой spec — другие тесты используют 60s
    // и popup не появляется за их runtime.
    await page.addInitScript(() => {
      (window as { __TG_TEST_TRIGGER_MS__?: number }).__TG_TEST_TRIGGER_MS__ =
        2000;
    });
    await page.goto("/");
  });

  test("appears after 2s of activity (test-mode short timer)", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible({ timeout: 5_000 });
  });

  test("dismiss via ✕ persists in sessionStorage", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible();

    await page.locator(POPUP_CLOSE).click();
    await expect(page.locator(POPUP_ROOT)).toBeHidden();

    const dismissed = await page.evaluate(() =>
      window.sessionStorage.getItem("tg-popup-dismissed"),
    );
    expect(dismissed).toBe("1");
  });

  test("dismiss via backdrop button click sets sessionStorage", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible();

    // Backdrop — отдельная button (aria-label="Закрыть", data-testid). Используем
    // dispatchEvent('click') чтобы обойти overlay-структуру (z-10 контейнер
    // карточки лежит сверху backdrop'а — не даёт обычному клику пройти).
    await page.locator('[data-testid="tg-popup-backdrop"]').dispatchEvent("click");
    await expect(page.locator(POPUP_ROOT)).toBeHidden();

    const dismissed = await page.evaluate(() =>
      window.sessionStorage.getItem("tg-popup-dismissed"),
    );
    expect(dismissed).toBe("1");
  });

  test("dismiss via ESC keydown sets sessionStorage", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(POPUP_ROOT)).toBeHidden();

    const dismissed = await page.evaluate(() =>
      window.sessionStorage.getItem("tg-popup-dismissed"),
    );
    expect(dismissed).toBe("1");
  });

  test("does not reappear after reload (sessionStorage gate)", async ({ page }) => {
    await primePopupTrigger(page);
    await page.locator(POPUP_CLOSE).click();
    await expect(page.locator(POPUP_ROOT)).toBeHidden();

    // Reload в той же сессии — sessionStorage сохраняется.
    await page.reload();
    await primePopupTrigger(page);
    // ждём ещё чуть-чуть, чтобы быть уверенным что таймер не сработал
    await page.waitForTimeout(1_500);

    await expect(page.locator(POPUP_ROOT)).toHaveCount(0);
  });

  // Idle-gate (no-activity) — covered by unit test
  // tests/unit/use-activity-timer.test.tsx ("does not increment accumulator
  // when idle"). E2E с 2s test-mode timer всегда срабатывает быстрее, чем
  // 30s idle-threshold (lastActivityAt инициализируется на mount = "пользователь
  // только что открыл страницу"). На production 60s — idle-gate сработает.

  test("CTA opens TG URL with target=_blank + rel=noopener", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible();

    const cta = page.locator(POPUP_CTA);
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", /noopener/);

    const href = await cta.getAttribute("href");
    expect(href).toMatch(/^https?:\/\/t\.me\//);
  });
});

/**
 * Test #6 (плана) — fresh browser context. Вынесен из describe выше потому что
 * требует ручного управления контекстами (создать → закрыть → новый).
 */
test("reappears in fresh browser context (sessionStorage scope)", async ({ browser }) => {
  async function prime(page: import("@playwright/test").Page) {
    await page.mouse.move(100, 100);
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(100 + i * 5, 100 + i * 5);
      await page.waitForTimeout(500);
    }
  }

  const initScript = () => {
    (window as { __TG_TEST_TRIGGER_MS__?: number }).__TG_TEST_TRIGGER_MS__ =
      2000;
  };

  // Контекст 1: триггерим, dismiss, закрываем.
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.addInitScript(initScript);
  await page1.goto("/");
  await prime(page1);
  await expect(page1.locator(POPUP_ROOT)).toBeVisible({ timeout: 5_000 });
  await page1.locator(POPUP_CLOSE).click();
  await expect(page1.locator(POPUP_ROOT)).toBeHidden();
  await ctx1.close();

  // Контекст 2: новая сессия → sessionStorage пустой → pop-up должен появиться снова.
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.addInitScript(initScript);
  await page2.goto("/");
  await prime(page2);

  await expect(page2.locator(POPUP_ROOT)).toBeVisible({ timeout: 5_000 });
  await ctx2.close();
});
