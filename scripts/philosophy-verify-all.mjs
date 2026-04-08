/**
 * Полная проверка секции «философия» без ручного подъёма сервера:
 * next build → next start на свободном порту → philosophy-pin-audit + philosophy-scroll-smoke → остановка сервера.
 *
 * Порт: VERIFY_PORT (по умолчанию 3013).
 */

import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(fileURLToPath(new URL(".", import.meta.url)), "..");
const PORT = process.env.VERIFY_PORT ?? "3013";
const BASE = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttpOk(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await sleep(400);
  }
  throw new Error(`Server at ${url} did not respond in time`);
}

let server;

try {
  console.log("→ pnpm run build\n");
  execSync("pnpm run build", { cwd: root, stdio: "inherit" });

  console.log(`→ next start -p ${PORT}\n`);
  server = spawn("pnpm", ["exec", "next", "start", "-p", PORT], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env },
  });

  server.stderr?.on("data", (d) => process.stderr.write(d));
  server.stdout?.on("data", (d) => process.stdout.write(d));

  await waitForHttpOk(`${BASE}/`, 120_000);

  const env = { ...process.env, BASE_URL: BASE };
  console.log(`→ philosophy-pin-audit (${BASE})\n`);
  execSync("node scripts/philosophy-pin-audit.mjs", { cwd: root, stdio: "inherit", env });

  console.log(`→ philosophy-scroll-smoke (${BASE})\n`);
  execSync("node scripts/philosophy-scroll-smoke.mjs", { cwd: root, stdio: "inherit", env });

  console.log("\nOK: verify:philosophy — всё прошло.");
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  if (server && !server.killed) {
    server.kill("SIGTERM");
    await sleep(400);
    try {
      server.kill("SIGKILL");
    } catch {
      /* ignore */
    }
  }
}

process.exit(process.exitCode ?? 0);
