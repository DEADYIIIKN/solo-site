import { createClient } from "@libsql/client";
import { pushDevSchema } from "@payloadcms/drizzle";

import config from "@payload-config";
import { getPayload } from "payload";

let schemaInitPromise: Promise<void> | null = null;

async function hasUsersTable(): Promise<boolean> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("file:")) return false;

  const client = createClient({ url });
  try {
    const result = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users' LIMIT 1",
    );
    const row = result.rows[0] as { name?: string } | undefined;
    return row?.name === "users";
  } finally {
    client.close();
  }
}

export async function ensurePayloadSchema(): Promise<void> {
  if (process.env.PAYLOAD_DATABASE_PUSH !== "1") return;
  if (await hasUsersTable()) return;

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
