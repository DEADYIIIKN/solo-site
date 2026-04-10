/**
 * Runs before `next start` in Docker (Node 22+) so SQLite schema exists in production.
 * Payload's sqlite adapter only calls pushDevSchema when NODE_ENV !== "production"
 * (see @payloadcms/db-sqlite connect.js).
 *
 * Run with: `pnpm exec node --experimental-strip-types scripts/ensure-payload-db.ts`
 * Do not use `tsx` here — it breaks `@next/env` when Payload loads.
 *
 * pushDevSchema is required from the file path to avoid the package barrel importing
 * `payload/node` (loadEnv) at module load time.
 */
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const drizzlePackageRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../node_modules/@payloadcms/drizzle",
);
const { pushDevSchema } = require(
  path.join(drizzlePackageRoot, "dist/utilities/pushDevSchema.js"),
) as { pushDevSchema: (adapter: unknown) => Promise<void> };

function hasUsersTable(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return false;
  const dbPath = url.slice("file:".length);
  const database = new DatabaseSync(dbPath);
  try {
    const row = database
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users' LIMIT 1")
      .get() as { name?: string } | undefined;
    return row?.name === "users";
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
  if (hasUsersTable()) {
    return;
  }
  process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("../src/payload.config.ts"),
  ]);

  const payload = await getPayload({ config });
  try {
    await pushDevSchema(payload.db);
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
