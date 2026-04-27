import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — Phase 6 Wave 1 (TEST-01).
 *
 * Цели:
 * - Локальный запуск через `npm run test:e2e` (chromium-only).
 * - Auto-start dev server на :3000 (reuseExistingServer, чтобы не блокировать локального dev).
 * - retries=0 локально, =1 в CI; trace = on-first-retry.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    /**
     * Поднимаем dev на :3100, чтобы не конфликтовать с локальным dev (:3000).
     * Включаем reuseExistingServer — если предыдущий запуск оставил сервер, его переиспользуем.
     */
    command: "pnpm exec next dev --turbopack -p 3100 -H 0.0.0.0",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
