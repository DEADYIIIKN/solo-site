/**
 * Runs before `next start` in Docker (Node 22+) so SQLite schema exists in production.
 * Payload's sqlite adapter only calls pushDevSchema when NODE_ENV !== "production"
 * (see @payloadcms/db-sqlite connect.js).
 *
 * Run with: `pnpm exec node --experimental-strip-types scripts/ensure-payload-db.ts`
 * Do not use `tsx` here — it breaks `@next/env` when Payload loads.
 */
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { DrizzleAdapter } from "@payloadcms/drizzle";

/**
 * Дублирующий лог в файл рядом с БД — CI deploy log обрезает stdout
 * после ~2s, post-mortem без SSH невозможен.
 */
function logFilePath(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return null;
  const dbPath = url.slice("file:".length);
  return `${dirname(dbPath)}/ensure-payload-db.log`;
}

function log(line: string): void {
  const stamped = `[${new Date().toISOString()}] ${line}`;
  console.log(stamped);
  const lp = logFilePath();
  if (lp) {
    try {
      mkdirSync(dirname(lp), { recursive: true });
      appendFileSync(lp, stamped + "\n");
    } catch {
      /* best-effort */
    }
  }
}

/**
 * Last-resort fallback DDL для критичных таблиц если drizzle-kit push
 * не отработал. Сгенерировано из локальной payload.db (Phase 12).
 * Только idempotent CREATE IF NOT EXISTS / ALTER ADD COLUMN.
 */
const FALLBACK_DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS leads (
    id integer PRIMARY KEY NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    message text,
    contact_method text DEFAULT 'call' NOT NULL,
    consent integer DEFAULT 0 NOT NULL,
    source text,
    forwarded_to_webhook integer DEFAULT 0,
    webhook_error text,
    user_ip text,
    updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS leads_updated_at_idx ON leads (updated_at)`,
  `CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at)`,
  `CREATE TABLE IF NOT EXISTS email_templates (
    id integer PRIMARY KEY NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    subject text NOT NULL,
    preheader text,
    headline text NOT NULL,
    body text NOT NULL,
    button_text text DEFAULT 'Оставить заявку',
    button_url text DEFAULT '/#lead-form-section',
    header_logo_id integer REFERENCES media(id) ON DELETE SET NULL,
    hero_image_id integer REFERENCES media(id) ON DELETE SET NULL,
    footer_logo_id integer REFERENCES media(id) ON DELETE SET NULL,
    footer_site_label text DEFAULT 'наш сайт',
    footer_site_url text DEFAULT '/',
    footer_email text DEFAULT 'info@soloproduction.pro',
    footer_phone text DEFAULT '+7 968 973 11-68',
    footer_telegram_label text DEFAULT '@mskfosage',
    footer_telegram_url text DEFAULT 'https://t.me/mskfosage',
    updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS email_templates_slug_idx ON email_templates (slug)`,
  `CREATE INDEX IF NOT EXISTS email_templates_updated_at_idx ON email_templates (updated_at)`,
  `CREATE INDEX IF NOT EXISTS email_templates_created_at_idx ON email_templates (created_at)`,
  `CREATE INDEX IF NOT EXISTS email_templates_header_logo_idx ON email_templates (header_logo_id)`,
  `CREATE INDEX IF NOT EXISTS email_templates_hero_image_idx ON email_templates (hero_image_id)`,
  `CREATE INDEX IF NOT EXISTS email_templates_footer_logo_idx ON email_templates (footer_logo_id)`,
];

const FALLBACK_RELS_COLUMNS: Array<{ table: string; column: string; ddl: string }> = [
  {
    table: "payload_locked_documents_rels",
    column: "leads_id",
    ddl: "ALTER TABLE payload_locked_documents_rels ADD COLUMN leads_id integer REFERENCES leads(id) ON DELETE CASCADE",
  },
  {
    table: "payload_preferences_rels",
    column: "leads_id",
    ddl: "ALTER TABLE payload_preferences_rels ADD COLUMN leads_id integer REFERENCES leads(id) ON DELETE CASCADE",
  },
  {
    table: "payload_locked_documents_rels",
    column: "email_templates_id",
    ddl: "ALTER TABLE payload_locked_documents_rels ADD COLUMN email_templates_id integer REFERENCES email_templates(id) ON DELETE CASCADE",
  },
  {
    table: "payload_preferences_rels",
    column: "email_templates_id",
    ddl: "ALTER TABLE payload_preferences_rels ADD COLUMN email_templates_id integer REFERENCES email_templates(id) ON DELETE CASCADE",
  },
];

const FALLBACK_RELS_INDEXES: string[] = [
  `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_leads_id_idx ON payload_locked_documents_rels (leads_id)`,
  `CREATE INDEX IF NOT EXISTS payload_preferences_rels_leads_id_idx ON payload_preferences_rels (leads_id)`,
  `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_email_templates_id_idx ON payload_locked_documents_rels (email_templates_id)`,
  `CREATE INDEX IF NOT EXISTS payload_preferences_rels_email_templates_id_idx ON payload_preferences_rels (email_templates_id)`,
];

const MEDIA_IMAGE_SIZE_NAMES = [
  "card_360_avif",
  "card_360_webp",
  "card_768_avif",
  "card_768_webp",
  "card_1440_avif",
  "card_1440_webp",
  "hero_1440_avif",
  "hero_1440_webp",
] as const;

const MEDIA_IMAGE_SIZE_FIELDS = [
  { suffix: "url", type: "text" },
  { suffix: "width", type: "numeric" },
  { suffix: "height", type: "numeric" },
  { suffix: "mime_type", type: "text" },
  { suffix: "filesize", type: "numeric" },
  { suffix: "filename", type: "text" },
] as const;

/**
 * Список всех Payload Collection slugs которые должны существовать как
 * SQLite таблицы. Расширять при добавлении новых Collections.
 *
 * Если ХОТЬ ОДНА таблица или колонка отсутствует — запускаем pushDevSchema (idempotent).
 */
const EXPECTED_TABLES = [
  "users",
  "media",
  "cases_advertising",
  "cases_vertical",
  "secrets_posts",
  "leads",
  "email_templates",
];

/**
 * Колонки которые должны существовать в конкретных таблицах.
 * Добавлять при добавлении новых Collections — они добавляют FK-колонки в rels-таблицы.
 */
const EXPECTED_COLUMNS: Array<{ table: string; column: string }> = [
  { table: "payload_locked_documents_rels", column: "leads_id" },
  { table: "payload_preferences_rels", column: "leads_id" },
  { table: "payload_locked_documents_rels", column: "email_templates_id" },
  { table: "payload_preferences_rels", column: "email_templates_id" },
  { table: "media", column: "sizes_card_360_avif_url" },
  { table: "media", column: "sizes_card_360_webp_url" },
  { table: "media", column: "sizes_card_768_avif_url" },
  { table: "media", column: "sizes_card_768_webp_url" },
  { table: "media", column: "sizes_card_1440_avif_url" },
  { table: "media", column: "sizes_card_1440_webp_url" },
  { table: "media", column: "sizes_hero_1440_avif_url" },
  { table: "media", column: "sizes_hero_1440_webp_url" },
];

function getMissingTables(): string[] {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return [];
  const dbPath = url.slice("file:".length);
  const database = new DatabaseSync(dbPath);
  try {
    const tableStmt = database.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    );
    const missing: string[] = [];
    for (const table of EXPECTED_TABLES) {
      const row = tableStmt.get(table) as { name?: string } | undefined;
      if (row?.name !== table) missing.push(table);
    }
    for (const { table, column } of EXPECTED_COLUMNS) {
      const tableExists = (tableStmt.get(table) as { name?: string } | undefined)?.name === table;
      if (!tableExists) continue;
      const cols = database
        .prepare(`PRAGMA table_info(${table})`)
        .all() as { name: string }[];
      if (!cols.some((c) => c.name === column)) {
        missing.push(`${table}.${column}`);
      }
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

function quoteIdent(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function applyFallbackDDL(): { tableCreated: boolean; columnsAdded: string[] } {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return { tableCreated: false, columnsAdded: [] };
  const dbPath = url.slice("file:".length);
  const db = new DatabaseSync(dbPath);
  const columnsAdded: string[] = [];
  let tableCreated = false;
  try {
    const before = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'")
      .get() as { name?: string } | undefined;
    for (const stmt of FALLBACK_DDL) db.exec(stmt);
    const after = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='leads'")
      .get() as { name?: string } | undefined;
    tableCreated = !before?.name && after?.name === "leads";

    for (const { table, column, ddl } of FALLBACK_RELS_COLUMNS) {
      const tableExists = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
        .get(table) as { name?: string } | undefined;
      if (!tableExists?.name) continue;
      const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
      if (!cols.some((c) => c.name === column)) {
        db.exec(ddl);
        columnsAdded.push(`${table}.${column}`);
      }
    }
    for (const idx of FALLBACK_RELS_INDEXES) {
      try {
        db.exec(idx);
      } catch (e) {
        log(`[ensure-payload-db] fallback index skipped: ${(e as Error).message}`);
      }
    }

    const mediaTableExists = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='media'")
      .get() as { name?: string } | undefined;
    if (mediaTableExists?.name) {
      const mediaCols = new Set(
        (db.prepare("PRAGMA table_info(media)").all() as { name: string }[]).map((c) => c.name),
      );
      for (const size of MEDIA_IMAGE_SIZE_NAMES) {
        for (const field of MEDIA_IMAGE_SIZE_FIELDS) {
          const column = `sizes_${size}_${field.suffix}`;
          if (!mediaCols.has(column)) {
            db.exec(`ALTER TABLE media ADD COLUMN ${quoteIdent(column)} ${field.type}`);
            mediaCols.add(column);
            columnsAdded.push(`media.${column}`);
          }
        }
      }

      for (const size of MEDIA_IMAGE_SIZE_NAMES) {
        const column = `sizes_${size}_filename`;
        const indexName = `media_sizes_${size}_sizes_${size}_filename_idx`;
        try {
          db.exec(
            `CREATE INDEX IF NOT EXISTS ${quoteIdent(indexName)} ON media (${quoteIdent(column)})`,
          );
        } catch (e) {
          log(`[ensure-payload-db] fallback media index skipped: ${(e as Error).message}`);
        }
      }
    }
  } finally {
    db.close();
  }
  return { tableCreated, columnsAdded };
}

async function main(): Promise<void> {
  if (!shouldEnsureSchema()) {
    return;
  }
  const missing = getMissingTables();
  if (missing.length === 0) {
    log(`[ensure-payload-db] all expected tables/columns present — skip`);
    return;
  }
  log(
    `[ensure-payload-db] missing: ${missing.join(", ")} — пробуем drizzle pushSQLiteSchema`,
  );
  process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

  let drizzleOk = false;
  try {
    const [{ getPayload }, { default: config }, drizzleKit] = await Promise.all([
      import("payload"),
      import("../src/payload.config.ts"),
      import("drizzle-kit/api"),
    ]);

    const payload = await getPayload({ config });
    try {
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
        log(`[ensure-payload-db] drizzle warnings (auto-accept): ${warnings.join("; ")}`);
      }
      if (hasDataLoss) {
        log(`[ensure-payload-db] WARNING hasDataLoss=true — продолжаем`);
      }
      log(`[ensure-payload-db] drizzle statementsToExecute=${statementsToExecute.length}`);
      for (const s of statementsToExecute.slice(0, 20)) {
        log(`[ensure-payload-db]   SQL: ${s.replace(/\s+/g, " ").slice(0, 200)}`);
      }
      await apply();
      log(`[ensure-payload-db] drizzle apply() OK`);
      drizzleOk = true;
    } finally {
      if (typeof payload.destroy === "function") {
        await payload.destroy();
      }
    }
  } catch (err) {
    log(`[ensure-payload-db] drizzle path FAILED: ${(err as Error).message}`);
  }

  // Re-check after drizzle attempt — если что-то ещё missing, врубаем raw fallback.
  const stillMissing = getMissingTables();
  if (stillMissing.length === 0) {
    log(`[ensure-payload-db] post-drizzle: всё на месте (drizzleOk=${drizzleOk})`);
    return;
  }
  log(
    `[ensure-payload-db] post-drizzle still missing: ${stillMissing.join(", ")} — запускаю raw-SQL fallback`,
  );
  const result = applyFallbackDDL();
  log(
    `[ensure-payload-db] fallback: leads_table_created=${result.tableCreated}, columns_added=[${result.columnsAdded.join(", ")}]`,
  );

  const finalMissing = getMissingTables();
  if (finalMissing.length === 0) {
    log(`[ensure-payload-db] fallback closed all gaps — OK`);
  } else {
    log(`[ensure-payload-db] FATAL: still missing after fallback: ${finalMissing.join(", ")}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[ensure-payload-db]", error);
  process.exit(1);
});
