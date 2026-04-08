#!/usr/bin/env node
/**
 * Создаёт или дополняет .env.local (PAYLOAD_SECRET, DATABASE_URL), чтобы Payload и сид не требовали ручных шагов.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envLocal = path.join(root, ".env.local");

function needsSecret(content) {
  if (!content.trim()) return true;
  if (/^PAYLOAD_SECRET=\s*$/m.test(content)) return true;
  if (content.includes("replace_with_long_random")) return true;
  if (!/^PAYLOAD_SECRET=/m.test(content)) return true;
  const m = content.match(/^PAYLOAD_SECRET=(.+)$/m);
  return !m || m[1].trim().length < 32;
}

let content = fs.existsSync(envLocal) ? fs.readFileSync(envLocal, "utf8") : "";
let changed = false;

if (needsSecret(content)) {
  const secret = crypto.randomBytes(32).toString("hex");
  const lines = content
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("PAYLOAD_SECRET="));
  lines.push(`PAYLOAD_SECRET=${secret}`);
  content = lines.join("\n") + "\n";
  changed = true;
}

if (!/^DATABASE_URL=/m.test(content)) {
  content = content.trimEnd() + "\nDATABASE_URL=file:./payload.db\n";
  changed = true;
}

if (changed) {
  fs.writeFileSync(envLocal, content, "utf8");
  console.log("[ensure-env-local] обновлён .env.local (Payload / БД)");
}
