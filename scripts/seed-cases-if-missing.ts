/**
 * Идемпотентно наполняет Payload кейсами из `cases.data` (как в dev через instrumentation).
 * В production выполняется перед `next start`.
 * Отключить: PAYLOAD_AUTO_SEED=0
 */
import path from "node:path";

type PayloadInstance = Awaited<ReturnType<typeof import("payload")["getPayload"]>>;

async function main(): Promise<void> {
  if (process.env.PAYLOAD_AUTO_SEED === "0") {
    return;
  }

  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 16) {
    return;
  }

  const [{ getPayload }, { default: config }, { casesAdCards1440, casesVerticalCards1440 }] =
    await Promise.all([
      import("payload"),
      import("../src/payload.config.ts"),
      import("../src/widgets/cases/model/cases.data.ts"),
    ]);

  const payload = await getPayload({ config });

  try {
    const root = process.cwd();

    async function getOrCreateMediaId(
      instance: PayloadInstance,
      publicPath: string,
      label?: string,
    ): Promise<string | number> {
      const rel = publicPath.replace(/^\//, "");
      const filePath = path.join(root, "public", rel);
      const seedTag = `seed:${rel}`;
      const alt = label ?? seedTag;

      const found = await instance.find({
        collection: "media",
        limit: 1,
        overrideAccess: true,
        where: { alt: { equals: seedTag } },
      });

      if (found.docs[0]?.id != null) {
        return found.docs[0].id;
      }

      const doc = await instance.create({
        collection: "media",
        data: { alt },
        filePath,
        overrideAccess: true,
      });

      return doc.id;
    }

    let createdVertical = 0;

    for (const card of casesVerticalCards1440) {
      const exists = await payload.find({
        collection: "cases-vertical",
        limit: 1,
        overrideAccess: true,
        where: { internalKey: { equals: card.id } },
      });

      if (exists.docs.length > 0) {
        continue;
      }

      const imageId = await getOrCreateMediaId(
        payload,
        card.image,
        `Кейс ${card.titleLines.join(" ")}`,
      );

      await payload.create({
        collection: "cases-vertical",
        data: {
          title: card.titleLines.join("\n"),
          internalKey: card.id,
          image: imageId,
          views: card.views,
          credits: card.credits.map((line) => ({ line })),
          detailTask: card.detailTask,
          detailResult: card.detailResult,
        },
        overrideAccess: true,
      });

      createdVertical += 1;
    }

    let createdAdvertising = 0;

    for (const card of casesAdCards1440) {
      const exists = await payload.find({
        collection: "cases-advertising",
        limit: 1,
        overrideAccess: true,
        where: { internalKey: { equals: card.id } },
      });

      if (exists.docs.length > 0) {
        continue;
      }

      const imageId = await getOrCreateMediaId(payload, card.image, `Кейс ${card.title}`);
      const data: Record<string, unknown> = {
        internalKey: card.id,
        image: imageId,
        title: card.title,
        credits: card.credits.map((line) => ({ line })),
        detailTask: card.detailTask,
        detailResultLead: card.detailResultLead,
      };

      if (card.detailResultBullets?.length) {
        data.detailResultBullets = card.detailResultBullets.map((line) => ({ line }));
      }

      if (card.detailResultClosing?.trim()) {
        data.detailResultClosing = card.detailResultClosing;
      }

      await payload.create({
        collection: "cases-advertising",
        data: data as never,
        overrideAccess: true,
      });

      createdAdvertising += 1;
    }

    if (createdVertical > 0 || createdAdvertising > 0) {
      console.info(
        `[seed-cases] создано: вертикальные ${createdVertical}, рекламные ${createdAdvertising}`,
      );
    }
  } catch (error) {
    console.error("[seed-cases-if-missing]", error);
  } finally {
    if (typeof payload.destroy === "function") {
      await payload.destroy();
    }
  }
}

main().catch((error) => {
  console.error("[seed-cases-if-missing]", error);
});
