#!/usr/bin/env node
/**
 * Удаляет артефакты dev-сборки, из‑за которых Next/webpack часто ломаются с
 * __webpack_modules__[moduleId] is not a function после правок / HMR.
 *
 * Пропуск: SKIP_DEV_CACHE_CLEAN=1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

if (process.env.SKIP_DEV_CACHE_CLEAN === "1") {
  console.log("[clean-dev-cache] SKIP_DEV_CACHE_CLEAN=1 — очистка пропущена");
  process.exit(0);
}

const dirs = [".next", path.join("node_modules", ".cache")];

for (const rel of dirs) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log("[clean-dev-cache] удалено:", rel);
  }
}
