import path from "node:path";
import { fileURLToPath } from "node:url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { CasesAdvertising } from "./cms/collections/cases-advertising.ts";
import { CasesVertical } from "./cms/collections/cases-vertical.ts";
import { Media } from "./cms/collections/media.ts";
import { SecretsPost } from "./cms/collections/secrets-post.ts";
import { Users } from "./cms/collections/users.ts";
import { SiteSettings } from "./cms/globals/site-settings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const sqliteClient = {
  url: process.env.DATABASE_URL || "file:./payload.db",
};

const shouldPushDatabase = process.env.PAYLOAD_DATABASE_PUSH === "1";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "— СОЛО Продакшн",
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const base = "http://localhost:3000";
        const slug = collectionConfig?.slug;
        const id = data?.id;
        if (!id) return base;
        if (slug === "cases-vertical") return `${base}/preview/cases-vertical/${id}`;
        if (slug === "cases-advertising") return `${base}/preview/cases-advertising/${id}`;
        return base;
      },
      collections: ["cases-vertical", "cases-advertising"],
      breakpoints: [
        { label: "Карточка", name: "card", width: 420, height: 660 },
        { label: "Модалка", name: "modal", width: 900, height: 700 },
      ],
    },
  },
  collections: [Users, Media, CasesVertical, CasesAdvertising, SecretsPost],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  /**
   * В development по умолчанию push: false — иначе после правок схемы/hot reload
   * drizzle снова шлёт CREATE INDEX, а индексы уже в payload.db → SQLITE "already exists",
   * в логе ошибки и HTTP может висеть десятки секунд.
   * Нужно применить схему к БД вручную: `PAYLOAD_DATABASE_PUSH=1 pnpm dev` (один раз).
   */
  db: sqliteAdapter(
    shouldPushDatabase
      ? {
          client: sqliteClient,
          push: true,
        }
      : { client: sqliteClient },
  ),
  sharp,
  plugins: [],
});
