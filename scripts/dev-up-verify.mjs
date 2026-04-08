#!/usr/bin/env node
/**
 * Освобождает :3000, чистит .next / node_modules/.cache, поднимает next dev (Turbopack)
 * в фоне и ждёт HTTP 200 на http://127.0.0.1:3000/
 *
 * Использование: npm run dev:up
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function sh(cmd) {
  return new Promise((resolve, reject) => {
    const p = spawn("sh", ["-c", cmd], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`exit ${code}: ${cmd}`)),
    );
  });
}

async function main() {
  try {
    const probe = await fetch("http://127.0.0.1:3000/");
    if (probe.status === 200) {
      console.log("[dev:up] уже отвечает HTTP 200 — http://localhost:3000/");
      process.exit(0);
    }
    console.log(`[dev:up] порт занят, но HTTP ${probe.status} — перезапускаю…`);
  } catch {
    console.log("[dev:up] :3000 не отвечает — поднимаю dev…");
  }

  console.log("[dev:up] освобождаю :3000…");
  try {
    await sh("lsof -ti :3000 | xargs kill -9 2>/dev/null || true");
  } catch {
    /* ignore */
  }

  console.log("[dev:up] чищу кэш dev…");
  await sh("node scripts/clean-dev-cache.mjs");

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  console.log("[dev:up] запускаю next dev (фон)…");
  const child = spawn(
    npmCmd,
    ["run", "dev:fast"],
    {
      cwd: root,
      detached: true,
      stdio: "ignore",
      env: process.env,
    },
  );
  child.unref();

  const url = "http://127.0.0.1:3000/";
  const maxAttempts = 45;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`[dev:up] готово: ${url} → HTTP ${res.status}`);
        process.exit(0);
      }
      console.log(`[dev:up] попытка ${i + 1}/${maxAttempts} → HTTP ${res.status}`);
    } catch {
      console.log(`[dev:up] попытка ${i + 1}/${maxAttempts} → ещё не слушает`);
    }
  }

  console.error(
    "[dev:up] таймаут: сервер не ответил 200. Смотрите лог, запустите вручную: npm run dev:rescue",
  );
  process.exit(1);
}

if (!existsSync(path.join(root, "package.json"))) {
  console.error("[dev:up] package.json не найден рядом со скриптом");
  process.exit(1);
}

main().catch((e) => {
  console.error("[dev:up]", e);
  process.exit(1);
});
