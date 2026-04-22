# Testing Patterns

**Analysis Date:** 2026-04-22

## Test Framework

**Unit/Integration Runner:**
- Not present — no Jest, Vitest, or other unit test runner is configured
- No `jest.config.*`, `vitest.config.*`, or test runner scripts in `package.json`

**Visual/E2E Runner:**
- Playwright `1.50.1` (devDependency)
- No `playwright.config.*` file — scripts invoke Playwright directly via `chromium.launch()`
- `pngjs 7.0.0` used for screenshot pixel comparison in some scripts

**Run Commands:**
```bash
# Visual audit scripts (require dev server running at BASE_URL)
BASE_URL=http://127.0.0.1:3000 node scripts/visual-modal-pass.mjs
BASE_URL=http://127.0.0.1:3000 node scripts/consultation-modal-audit.mjs
BASE_URL=http://127.0.0.1:3000 node scripts/philosophy-pin-audit.mjs
BASE_URL=http://127.0.0.1:3000 node scripts/services-1440-check.mjs
BASE_URL=http://127.0.0.1:3000 node scripts/services-scroll-smoke.mjs

# npm script wrappers
pnpm audit:modals       # runs consultation-modal-audit.mjs
pnpm visual:modals      # runs visual-modal-pass.mjs
pnpm verify:modals      # runs both modal scripts
pnpm audit:philosophy   # runs philosophy-pin-audit.mjs
pnpm audit:levels       # runs levels-layout-audit.mjs

# TypeScript check
pnpm typecheck          # tsc --noEmit

# Lint
pnpm lint               # eslint .
```

## Test File Organization

**Location:**
- No co-located `*.test.*` or `*.spec.*` files anywhere in `src/`
- All automated checks live in `scripts/` as standalone `.mjs` scripts
- Screenshot outputs written to `.visual-run/` (gitignored)

**Naming:**
- Smoke tests: `{feature}-smoke.mjs` — e.g., `philosophy-scroll-smoke.mjs`, `services-scroll-smoke.mjs`
- Audit/measurement scripts: `{feature}-audit.mjs` — e.g., `consultation-modal-audit.mjs`, `levels-layout-audit.mjs`
- Verification scripts: `{feature}-verify-all.mjs` — e.g., `philosophy-verify-all.mjs`
- Visual capture scripts: `capture-{feature}.mjs`, `visual-modal-pass.mjs`

## Test Structure

**Script Organization:**
All Playwright audit scripts follow this pattern:

```javascript
/**
 * Description of what is being checked.
 * Figma references: 783:XXXX (breakpoint name).
 *
 * Run: BASE_URL=http://127.0.0.1:3000 node scripts/script-name.mjs
 * Exit: 0 — all checks pass, 1 — discrepancies found.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const browser = await chromium.launch({ headless: true });
// ... test logic
await browser.close();
process.exit(failures > 0 ? 1 : 0);
```

**Viewport Coverage:**
Scripts systematically test multiple breakpoints, matching the five layout breakpoints used in the app:
```javascript
const viewports = [
  { name: "360", width: 360, height: 900 },
  { name: "480", width: 480, height: 900 },
  { name: "768", width: 768, height: 900 },
  { name: "1024", width: 1024, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];
```

**Measurement Tolerance:**
Geometry checks use pixel tolerance constants, not exact equality:
```javascript
const T = 2;   // px tolerance for layout dimensions
const TF = 1;  // px tolerance for font-size
// Usage: Math.abs(actual - expected) <= T
```

## Mocking

**Framework:** None — scripts run against a live dev server

**Patterns:**
- Scripts target `http://127.0.0.1:3000` (or `BASE_URL` env override)
- No network mocking; full stack must be running (Next.js + Payload CMS)
- `reducedMotion: "no-preference"` emulated to allow animations to run: `page.emulateMedia({ reducedMotion: "no-preference" })`
- Smooth scroll disabled via injected CSS to make scroll positions deterministic:
  ```javascript
  await page.addStyleTag({
    content: "html { scroll-behavior: auto !important; } body { overflow-anchor: none !important; }"
  });
  ```
- `waitForSelector` and `waitForTimeout` used for settling animations before measurement

## Fixtures and Factories

**Test Data:**
- No fixtures or factories — scripts rely on real app state and CMS data
- Default Payload DB (`payload.db`) with seeded data via `scripts/seed-cases-if-missing.ts`
- `ensure-payload-schema.ts` in `src/shared/lib/` for schema readiness checks

**Location:**
- `scripts/seed-cases-if-missing.ts` — seeds cases collections if empty
- `.visual-run/` — screenshot output directory (created at runtime, not committed)

## Coverage

**Requirements:** None enforced — no coverage tooling configured

**View Coverage:**
- Not applicable (no unit test runner)

## Test Types

**Unit Tests:**
- Not used — no unit test framework present
- Business logic functions (phone formatting, viewport resolution) are untested by automated units

**Smoke Tests (Visual):**
- Playwright scripts that open the page, interact with UI elements, and verify visible state
- Assert: element exists, is visible, has expected computed CSS values
- Example: `navbar-anchor-freeze-smoke.mjs`, `showreel-stack-smoke.mjs`

**Audit Tests (Pixel Measurement):**
- Playwright scripts that measure `getBoundingClientRect()` / `getComputedStyle()` output
- Compare against Figma spec values with `T=2px` / `TF=1px` tolerance
- Report all discrepancies with expected vs actual values
- Exit code `1` if any check fails — suitable for CI
- Example: `consultation-modal-audit.mjs`, `levels-layout-audit.mjs`

**Visual Screenshot Tests:**
- `visual-modal-pass.mjs` captures screenshots at each breakpoint to `.visual-run/`
- Used for manual visual review, not automated pixel-diff assertion (no baseline comparison)

## Common Patterns

**Navigation and Interaction:**
```javascript
// Wait for page load
await page.goto(BASE, { waitUntil: "networkidle", timeout: 120_000 });

// Click and wait for UI to settle
await page.getByRole("button", { name: "Бесплатная консультация" }).click();
await page.getByText("бесплатная").first().waitFor({ state: "visible", timeout: 10_000 });
await page.waitForTimeout(400); // settle animation
```

**Measuring Layout (Figma comparison):**
```javascript
const box = await page.locator('[role="dialog"]').boundingBox();
if (Math.abs(box.width - expectedWidth) > T) {
  failures++;
  console.log(`FAIL width: expected ${expectedWidth}, got ${box.width}`);
}
```

**CSS Property Checks:**
```javascript
const result = await page.evaluate(() => {
  const el = document.querySelector("#services-section-1440 article");
  const cs = getComputedStyle(el.firstElementChild);
  return { textTransform: cs.textTransform, fontSize: cs.fontSize };
});
if (result.textTransform !== "none") { /* FAIL */ }
```

**Scroll-Based Testing:**
```javascript
// Disable smooth scroll, scroll to element, dispatch events
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  const pin = document.querySelector("[data-philosophy-pin]");
  const top = pin.getBoundingClientRect().top;
  window.scrollBy(0, top);
  window.dispatchEvent(new Event("scroll"));
});
await page.waitForTimeout(350);
```

## Notes on Testing Strategy

**Current approach:** Pixel-accurate visual audits against a live server replace unit tests. Correctness is defined by matching Figma pixel values at each of the five breakpoints (`360`, `480`, `768`, `1024`, `1440`).

**Gaps:** No unit tests for pure logic functions (`formatConsultationPhone`, `resolveViewportLayout`, `getSiteSettings`). No automated pixel-diff baseline comparisons — screenshots require manual review. No CI configuration detected to run these scripts automatically.

**Adding new tests:** Create a new `.mjs` script in `scripts/` following the audit pattern. Add an npm script entry in `package.json` under `"scripts"`. Set `BASE_URL` env var to target a running server.

---

*Testing analysis: 2026-04-22*
