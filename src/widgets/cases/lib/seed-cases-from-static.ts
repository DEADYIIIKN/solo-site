import path from "node:path";

import { getPayload } from "payload";

import config from "../../../payload.config.ts";
import {
  casesAdCards1440,
  casesVerticalCards1440,
} from "../model/cases.data.ts";

/**
 * Идемпотентно создаёт в Payload записи кейсов из статического макета (по internalKey).
 * Медиа помечаются alt `seed:<путь>`, чтобы не плодить дубликаты при повторных запусках.
 */
export async function seedCasesFromStaticIfMissing(): Promise<void> {
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 16) {
    return;
  }

  const payload = await getPayload({ config });
  const root = process.cwd();

  async function getOrCreateMediaId(
    publicPath: string,
    label?: string,
  ): Promise<string | number> {
    const rel = publicPath.replace(/^\//, "");
    const filePath = path.join(root, "public", rel);
    const seedTag = `seed:${rel}`;
    const alt = label ?? seedTag;

    const found = await payload.find({
      collection: "media",
      limit: 1,
      overrideAccess: true,
      where: { alt: { equals: seedTag } },
    });
    if (found.docs[0]?.id != null) return found.docs[0].id;

    const doc = await payload.create({
      collection: "media",
      data: { alt },
      filePath,
      overrideAccess: true,
    });
    return doc.id;
  }

  let createdV = 0;
  for (let i = 0; i < casesVerticalCards1440.length; i++) {
    const c = casesVerticalCards1440[i];
    const exists = await payload.find({
      collection: "cases-vertical",
      limit: 1,
      overrideAccess: true,
      where: { internalKey: { equals: c.id } },
    });
    if (exists.docs.length > 0) continue;

    const displayTitle = c.titleLines.join("\n");
    const imageId = await getOrCreateMediaId(c.image, `Кейс ${c.titleLines.join(" ")}`);
    await payload.create({
      collection: "cases-vertical",
      data: {
        title: displayTitle,
        internalKey: c.id,
        image: imageId,
        views: c.views,
        credits: c.credits.map((line) => ({ line })),
        detailTask: c.detailTask,
        detailResult: c.detailResult,
      },
      overrideAccess: true,
    });
    createdV += 1;
  }

  let createdA = 0;
  for (let i = 0; i < casesAdCards1440.length; i++) {
    const c = casesAdCards1440[i];
    const exists = await payload.find({
      collection: "cases-advertising",
      limit: 1,
      overrideAccess: true,
      where: { internalKey: { equals: c.id } },
    });
    if (exists.docs.length > 0) continue;

    const imageId = await getOrCreateMediaId(c.image, `Кейс ${c.title}`);
    const data: Record<string, unknown> = {
      internalKey: c.id,
      image: imageId,
      title: c.title,
      credits: c.credits.map((line) => ({ line })),
      detailTask: c.detailTask,
      detailResultLead: c.detailResultLead,
    };
    if (c.detailResultBullets?.length) {
      data.detailResultBullets = c.detailResultBullets.map((line) => ({ line }));
    }
    if (c.detailResultClosing?.trim()) {
      data.detailResultClosing = c.detailResultClosing;
    }

    await payload.create({
      collection: "cases-advertising",
      data: data as never,
      overrideAccess: true,
    });
    createdA += 1;
  }

  if (createdV > 0 || createdA > 0) {
    console.info(
      `[seed-cases] создано: вертикальные ${createdV}, рекламные ${createdA}`,
    );
  }
}
