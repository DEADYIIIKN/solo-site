/**
 * Regenerates Payload imageSizes for existing local media documents.
 *
 * Dry run:
 *   pnpm payload:media:regenerate
 *
 * Apply:
 *   PAYLOAD_REGENERATE_MEDIA_APPLY=1 pnpm payload:media:regenerate
 */
import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import sharp from "sharp";

type MediaDoc = {
  id: number | string;
  alt?: null | string;
  filename?: null | string;
  mimeType?: null | string;
  sizes?: null | Record<string, { url?: null | string } | null>;
};

function hasGeneratedImageSizes(doc: MediaDoc): boolean {
  return Boolean(
    doc.sizes?.["card-360-avif"]?.url ||
      doc.sizes?.["card-360-webp"]?.url ||
      doc.sizes?.["card-768-avif"]?.url ||
      doc.sizes?.["card-768-webp"]?.url,
  );
}

async function main(): Promise<void> {
  dotenv.config({ path: ".env.local" });
  dotenv.config();

  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 16) {
    console.error("[media-regenerate] PAYLOAD_SECRET is required to initialize Payload.");
    process.exitCode = 1;
    return;
  }

  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("../src/payload.config.ts"),
  ]);

  const payload = await getPayload({ config });
  const uploadDir = process.env.PAYLOAD_UPLOAD_DIR || "media";
  const apply = process.env.PAYLOAD_REGENERATE_MEDIA_APPLY === "1";
  const force = process.env.PAYLOAD_REGENERATE_MEDIA_FORCE === "1";

  sharp.concurrency(1);
  sharp.cache(false);

  try {
    const result = await payload.find({
      collection: "media",
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    });

    let updated = 0;
    let skipped = 0;

    for (const doc of result.docs as MediaDoc[]) {
      if (!doc.mimeType?.startsWith("image/")) {
        skipped += 1;
        continue;
      }

      if (!doc.filename) {
        skipped += 1;
        continue;
      }

      if (!force && hasGeneratedImageSizes(doc)) {
        skipped += 1;
        continue;
      }

      const filePath = path.resolve(process.cwd(), uploadDir, doc.filename);
      if (!fs.existsSync(filePath)) {
        console.warn(`[media-regenerate] skip missing file: ${filePath}`);
        skipped += 1;
        continue;
      }

      if (!apply) {
        console.info(`[media-regenerate] dry-run: ${doc.id} ${doc.filename}`);
        continue;
      }

      await payload.update({
        collection: "media",
        id: doc.id,
        data: {
          alt: doc.alt || undefined,
        },
        filePath,
        overrideAccess: true,
      });
      updated += 1;
      console.info(`[media-regenerate] updated: ${doc.id} ${doc.filename}`);
    }

    console.info(
      `[media-regenerate] done: ${apply ? `${updated} updated` : "dry-run"}, ${skipped} skipped`,
    );
  } finally {
    if (typeof payload.destroy === "function") {
      await payload.destroy();
    }
  }
}

main().catch((error) => {
  console.error("[media-regenerate]", error);
  process.exitCode = 1;
});
