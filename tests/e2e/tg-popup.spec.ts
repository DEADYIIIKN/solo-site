import { expect, test } from "@playwright/test";

/**
 * E2E spec для TG-popup flow (Phase 10, plan 10-04, requirement TEST-06).
 *
 * Покрывает:
 *  1. Pop-up появляется через 60s виртуального времени активности (page.clock).
 *  2. Dismiss через ✕ button — закрывает + sessionStorage["tg-popup-dismissed"] === "1".
 *  3. Dismiss через overlay click (backdrop button).
 *  4. Dismiss через ESC keydown.
 *  5. После reload pop-up НЕ появляется снова (sessionStorage persistence).
 *  6. В новом browser context pop-up появляется снова (fresh sessionStorage).
 *  7. Idle 30+ виртуальных секунд без активности → таймер не движется → pop-up НЕ появляется.
 *  8. CTA-link имеет target=_blank + rel=noopener + href в виде t.me URL.
 *
 * Silent skip (NEXT_PUBLIC_TG_CHANNEL_URL пустой) — out-of-scope для E2E,
 * покрыт manual verification в 10-03 SUMMARY (compile-time inline в Next.js).
 *
 * Trick с page.clock:
 *   - install({ time }) ДО goto() — мокает Date.now / setInterval / setTimeout.
 *   - useActivityTimer считает только при активности → mousemove обновляет
 *     lastActivityAt в виртуальном Date.now(). Без mousemove fastForward
 *     не двигает accumulator (idle gate).
 *   - Дополнительный mousemove ПОСЛЕ fastForward нужен для пробуждения React
 *     event-loop под mocked-таймером (иначе setOpen может ещё не примениться).
 */

const POPUP_ROOT = '[data-testid="tg-popup-root"]';
const POPUP_CLOSE = '[data-testid="tg-popup-close"]';
const POPUP_CTA = '[data-testid="tg-popup-cta"]';
const TRIGGER_MS = 60_000;
const VIRTUAL_START = "2026-04-27T10:00:00Z";

/**
 * Имитирует «активного» пользователя в виртуальном времени:
 *   - 12 циклов × (mousemove + fastForward 5s) = 60s виртуального времени
 *     с активностью каждые 5s (idle gate < 30s, accumulator растёт).
 *
 * Пример использования:
 *   await primePopupTrigger(page);
 *   await expect(page.locator(POPUP_ROOT)).toBeVisible();
 */
async function primePopupTrigger(page: import("@playwright/test").Page) {
  for (let i = 0; i < 12; i++) {
    await page.mouse.move(100 + i, 100 + i);
    await page.clock.fastForward(5_000);
  }
  // Финальный mousemove — fresh activity ping чтобы последний tick точно
  // прошёл idle-gate, плюс «дёргаем» React-flush.
  await page.mouse.move(200, 200);
}

test.describe("TG popup", () => {
  test.beforeEach(async ({ page }) => {
    // page.clock.install() ДО goto чтобы мок применился до первой синхронизации.
    await page.clock.install({ time: new Date(VIRTUAL_START) });
    await page.goto("/");
  });

  test("appears after 60s of activity (page.clock fastForward)", async ({ page }) => {
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

  test("dismiss via overlay click sets sessionStorage", async ({ page }) => {
    await primePopupTrigger(page);
    await expect(page.locator(POPUP_ROOT)).toBeVisible();

    // Backdrop button покрывает весь viewport (absolute inset-0). Клик мимо
    // карточки — в верхний-левый угол (точно НЕ внутри card).
    await page.mouse.click(5, 5);
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
    // Прогоняем активность ещё раз — pop-up НЕ должен появиться.
    await primePopupTrigger(page);
    await page.clock.fastForward(5_000);

    await expect(page.locator(POPUP_ROOT)).toHaveCount(0);
  });

  test("does NOT appear when user idle (no activity events)", async ({ page }) => {
    // Никаких mousemove — только fastForward на 90 виртуальных секунд.
    // useActivityTimer должен не пройти idle gate (30s) → accumulator = 0.
    await page.clock.fastForward(90_000);
    // Дёргаем event-loop минимальной активностью ПОСЛЕ idle, чтобы React
    // успел отреагировать (но без накопления — последняя активность только
    // что произошла, а 60s ещё не прошло).
    await page.mouse.move(50, 50);
    await page.clock.fastForward(2_000);

    await expect(page.locator(POPUP_ROOT)).toHaveCount(0);
  });

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
  // Контекст 1: триггерим, dismiss, закрываем.
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.clock.install({ time: new Date(VIRTUAL_START) });
  await page1.goto("/");

  for (let i = 0; i < 12; i++) {
    await page1.mouse.move(100 + i, 100 + i);
    await page1.clock.fastForward(5_000);
  }
  await page1.mouse.move(200, 200);
  await expect(page1.locator(POPUP_ROOT)).toBeVisible({ timeout: 5_000 });
  await page1.locator(POPUP_CLOSE).click();
  await expect(page1.locator(POPUP_ROOT)).toBeHidden();
  await ctx1.close();

  // Контекст 2: новая сессия → sessionStorage пустой → pop-up должен появиться снова.
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.clock.install({ time: new Date(VIRTUAL_START) });
  await page2.goto("/");

  for (let i = 0; i < 12; i++) {
    await page2.mouse.move(100 + i, 100 + i);
    await page2.clock.fastForward(5_000);
  }
  await page2.mouse.move(200, 200);

  await expect(page2.locator(POPUP_ROOT)).toBeVisible({ timeout: 5_000 });
  await ctx2.close();
});
