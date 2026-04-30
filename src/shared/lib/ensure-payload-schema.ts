import { createClient } from "@libsql/client";
import { pushDevSchema } from "@payloadcms/drizzle";

import config from "@payload-config";
import { getPayload } from "payload";

let schemaInitPromise: Promise<void> | null = null;

const EXPECTED_COLUMNS: Array<{ table: string; column: string }> = [
  { table: "media", column: "sizes_card_360_avif_url" },
  { table: "media", column: "sizes_card_360_webp_url" },
  { table: "media", column: "sizes_card_768_avif_url" },
  { table: "media", column: "sizes_card_768_webp_url" },
  { table: "media", column: "sizes_card_1440_avif_url" },
  { table: "media", column: "sizes_card_1440_webp_url" },
  { table: "media", column: "sizes_hero_1440_avif_url" },
  { table: "media", column: "sizes_hero_1440_webp_url" },
  { table: "payload_locked_documents_rels", column: "leads_id" },
  { table: "payload_preferences_rels", column: "leads_id" },
  { table: "email_templates", column: "slug" },
  { table: "site_settings", column: "tg_channel_url" },
  { table: "site_settings", column: "production_base_url" },
  { table: "site_settings", column: "allow_indexing" },
  { table: "site_settings", column: "seo_title" },
  { table: "site_settings", column: "seo_description" },
  { table: "site_settings", column: "og_title" },
  { table: "site_settings", column: "og_description" },
  { table: "site_settings", column: "og_image_url" },
  { table: "site_settings", column: "yandex_metrika_enabled" },
  { table: "site_settings", column: "yandex_metrika_id" },
  { table: "site_settings", column: "yandex_metrika_webvisor" },
  { table: "site_settings", column: "yandex_metrika_clickmap" },
  { table: "site_settings", column: "yandex_metrika_track_links" },
  { table: "site_settings", column: "yandex_metrika_accurate_track_bounce" },
  { table: "payload_locked_documents_rels", column: "email_templates_id" },
  { table: "payload_preferences_rels", column: "email_templates_id" },
];

async function hasExpectedSchema(): Promise<boolean> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return false;

  const client = createClient({ url });
  try {
    const users = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users' LIMIT 1",
    );
    const userRow = users.rows[0] as { name?: string } | undefined;
    if (userRow?.name !== "users") return false;

    for (const { table, column } of EXPECTED_COLUMNS) {
      const tableResult = await client.execute({
        sql: "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
        args: [table],
      });
      const tableRow = tableResult.rows[0] as { name?: string } | undefined;
      if (tableRow?.name !== table) return false;

      const columns = await client.execute(`PRAGMA table_info(${table})`);
      if (!columns.rows.some((row) => (row as { name?: unknown }).name === column)) {
        return false;
      }
    }

    return true;
  } finally {
    client.close();
  }
}

export async function ensurePayloadSchema(): Promise<void> {
  if (process.env.PAYLOAD_DATABASE_PUSH !== "1") return;
  if (await hasExpectedSchema()) return;

  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";
      const payload = await getPayload({ config });
      await pushDevSchema(payload.db as unknown as Parameters<typeof pushDevSchema>[0]);
    })().catch((error) => {
      schemaInitPromise = null;
      throw error;
    });
  }

  await schemaInitPromise;
}
