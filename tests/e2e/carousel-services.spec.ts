import { expect, test } from "@playwright/test";

/**
 * Services section — cross-browser layout smoke (TEST-02).
 *
 * NOTE: На момент Phase 6 Wave 2 секция «Услуги» не имеет каруселей ни на одном
 * брейкпоинте (1440 / 1024 / 768 / 480 / 360) — на десктопе вёрстка плиточная,
 * на мобильных — вертикальный список карточек (`services-section-below-1024.tsx`,
 * id="services-section-sm"). BUG-09 / BUG-10 (см. PROJECT.md) о «стрелках карусели
 * услуг на 820/360» относятся к будущей правке, поэтому сейчас этот spec покрывает
 * smoke-render: услуги загружаются и видны cross-browser на 360/480/820.
 * Когда карусель появится — сюда добавляются проверки arrows next/prev.
 *
 * Запускается на всех projects (chromium-1440, webkit-1440, mobile-safari).
 * Только chromium/webkit гонят 360/480/820 viewport overrides, mobile-safari использует
 * свой нативный viewport (iPhone 13 ≈ 390x844 → layout '480').
 */

const SERVICES_VIEWPORTS = [
  { name: "360", width: 360, height: 800 },
  { name: "480", width: 480, height: 900 },
  { name: "820", width: 820, height: 1180 },
] as const;

test.describe("services › cross-browser smoke", () => {
  for (const vp of SERVICES_VIEWPORTS) {
    test(`секция «Услуги» рендерится на ${vp.name}px`, async ({ page, browserName }) => {
      // mobile-safari фиксирован на iPhone 13 — пропускаем явные viewport overrides не из своего набора.
      // Чтобы покрытие оставалось — на mobile-safari проверяем только 360 (ближайший).
      if (browserName === "webkit" && vp.name !== "360") {
        // webkit может быть как desktop-safari (mutable viewport), так и mobile-safari (fixed).
        // mobile-safari — viewport устанавливается из device. setViewportSize всё равно работает.
      }
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      // wrapper всегда в DOM
      await expect(page.locator("#services-section")).toBeAttached();

      // На 360 / 480 / 820 (layout '768' / '480' / '360') — рендерится below-1024 вариант.
      const servicesSm = page.locator("#services-section-sm");
      await servicesSm.scrollIntoViewIfNeeded();
      await expect(servicesSm).toBeVisible({ timeout: 10_000 });

      // На below-1024 у каждой карточки услуги есть CTA «бесплатная консультация».
      // Проверяем что хотя бы одна CTA отрендерилась — значит данные подгружены.
      const ctaButton = servicesSm
        .getByRole("button", { name: /бесплатная консультация/i })
        .first();
      await expect(ctaButton).toBeVisible();
    });
  }

  test("CTA «бесплатная консультация» в услугах кликабельна (открывает модал)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const servicesSm = page.locator("#services-section-sm");
    await servicesSm.scrollIntoViewIfNeeded();
    await expect(servicesSm).toBeVisible({ timeout: 10_000 });

    const cta = servicesSm
      .getByRole("button", { name: /бесплатная консультация/i })
      .first();
    await cta.click();

    // dispatchOpenConsultationModal('consultation') открывает FirstScreenConsultationModal,
    // в любом per-breakpoint modal присутствует data-testid="consultation-modal-card".
    await expect(page.getByTestId("consultation-modal-card").first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
