#!/usr/bin/env node
/** Скриншот секции лида при ширине 1200px (виден вариант 1024). */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = path.join(root, "lead-form-1024-capture.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.locator("#lead-form-section-1024").waitFor({ state: "visible", timeout: 15000 });
await page.locator("#lead-form-section-1024").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.locator("#lead-form-section-1024").screenshot({ path: out });
console.log("saved", out);
await browser.close();
