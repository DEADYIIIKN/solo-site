/**
 * Runs before `next start` in Docker (Node 22+) so SQLite schema exists in production.
 * Payload's sqlite adapter only calls pushDevSchema when NODE_ENV !== "production"
 * (see @payloadcms/db-sqlite connect.js).
 *
 * Run with: `pnpm exec node --experimental-strip-types scripts/ensure-payload-db.ts`
 * Do not use `tsx` here — it breaks `@next/env` when Payload loads.
 */
import { DatabaseSync } from "node:sqlite";
import type { DrizzleAdapter } from "@payloadcms/drizzle";

/**
 * Список всех Payload Collection slugs которые должны существовать как
 * SQLite таблицы. Расширять при добавлении новых Collections.
 *
 * Если ХОТЬ ОДНА таблица отсутствует — запускаем pushDevSchema (idempotent).
 * Это ловит migrations добавления новых collections (Phase 8 leads, etc.).
 */
const EXPECTED_TABLES = [
  "users",
  "media",
  "cases_advertising",
  "cases_vertical",
  "secrets_posts",
  "leads",
];

function getMissingTables(): string[] {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return [];
  const dbPath = url.slice("file:".length);
  const database = new DatabaseSync(dbPath);
  try {
    const stmt = database.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    );
    const missing: string[] = [];
    for (const table of EXPECTED_TABLES) {
      const row = stmt.get(table) as { name?: string } | undefined;
      if (row?.name !== table) missing.push(table);
    }
    return missing;
  } finally {
    database.close();
  }
}

function shouldEnsureSchema(): boolean {
  if (process.env.PAYLOAD_DATABASE_PUSH === "1") return true;
  return process.env.NODE_ENV === "production";
}

async function main(): Promise<void> {
  if (!shouldEnsureSchema()) {
    return;
  }
  const missing = getMissingTables();
  if (missing.length === 0) {
    return;
  }
  console.warn(
    `[ensure-payload-db] missing tables: ${missing.join(", ")} — running drizzle pushSQLiteSchema`,
  );
  process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

  const [{ getPayload }, { default: config }, drizzleKit] = await Promise.all([
    import("payload"),
    import("../src/payload.config.ts"),
    import("drizzle-kit/api"),
  ]);

  const payload = await getPayload({ config });
  try {
    /**
     * Прямой вызов drizzle-kit pushSQLiteSchema вместо Payload's pushDevSchema —
     * последний использует `prompts` для confirmation на warnings, что в
     * non-TTY container hangs/cancels (и schema не пушится).
     * Здесь мы всегда auto-accept warnings и вызываем apply().
     */
    const adapter = payload.db as unknown as DrizzleAdapter & {
      schema: Record<string, unknown>;
      drizzle: unknown;
    };
    const { apply, hasDataLoss, warnings, statementsToExecute } =
      await drizzleKit.pushSQLiteSchema(
        adapter.schema,
        adapter.drizzle as Parameters<typeof drizzleKit.pushSQLiteSchema>[1],
      );

    if (warnings.length > 0) {
      console.warn(
        `[ensure-payload-db] drizzle warnings (auto-accepting): ${warnings.join("; ")}`,
      );
    }
    if (hasDataLoss) {
      console.warn(
        `[ensure-payload-db] WARNING: hasDataLoss=true — продолжаем т.к. цель добавить новые таблицы`,
      );
    }
    console.log(
      `[ensure-payload-db] выполняем ${statementsToExecute.length} SQL statements`,
    );
    await apply();
    console.log(`[ensure-payload-db] schema push успешно применён`);
  } finally {
    if (typeof payload.destroy === "function") {
      await payload.destroy();
    }
  }
}

main().catch((error) => {
  console.error("[ensure-payload-db]", error);
  process.exit(1);
});
