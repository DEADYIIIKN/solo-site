import { getPayload } from "payload";

import config from "@payload-config";
import {
  PAYLOAD_CARD_1440_SIZES,
  PAYLOAD_CARD_768_SIZES,
  payloadMediaSrc,
  type PayloadMediaLike,
} from "@/shared/lib/payload-media";
import type { CasesAdCard, CasesVerticalCard } from "@/widgets/cases/model/cases.data";
import {
  casesAdCards1440,
  casesVerticalCards1440,
} from "@/widgets/cases/model/cases.data";

/**
 * Данные кейсов для главной: из Payload, при ошибке или пустых коллекциях — статический fallback.
 */
export async function getCasesForSite(): Promise<{
  verticalCards: readonly CasesVerticalCard[];
  adCards: readonly CasesAdCard[];
}> {
  try {
    const payload = await getPayload({ config });

    const [verticalRes, adRes] = await Promise.all([
      payload.find({
        collection: "cases-vertical",
        depth: 1,
        limit: 100,
        sort: "_order",
      }),
      payload.find({
        collection: "cases-advertising",
        depth: 1,
        limit: 100,
        sort: "_order",
      }),
    ]);

    const verticalMapped: CasesVerticalCard[] = verticalRes.docs
      .map((doc, index) => {
        const image =
          payloadMediaSrc(doc.image as PayloadMediaLike, PAYLOAD_CARD_768_SIZES) ||
          casesVerticalCards1440[index]?.image ||
          "";
        if (!image) return null;
        const titleLines = String(doc.title ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        const credits = (doc.credits as { line?: string }[] | undefined)
          ?.map((r) => r.line)
          .filter((x): x is string => Boolean(x));
        if (!titleLines.length || !credits?.length) return null;
        const videoUrl = payloadMediaSrc(doc.detailVideo as PayloadMediaLike);
        const card: CasesVerticalCard = {
          id: String(doc.id),
          image,
          titleLines,
          views: String(doc.views ?? ""),
          credits,
          overlayLight: true,
          detailTask: String(doc.detailTask ?? ""),
          detailResult: String(doc.detailResult ?? ""),
          ...(videoUrl ? { detailVideoUrl: videoUrl } : {}),
        };
        return card;
      })
      .filter((x): x is CasesVerticalCard => x !== null);

    const adMapped: CasesAdCard[] = adRes.docs
      .map((doc, index) => {
        const image =
          payloadMediaSrc(doc.image as PayloadMediaLike, PAYLOAD_CARD_1440_SIZES) ||
          casesAdCards1440[index]?.image ||
          "";
        if (!image) return null;
        const credits = (doc.credits as { line?: string }[] | undefined)
          ?.map((r) => r.line)
          .filter((x): x is string => Boolean(x));
        if (!credits?.length) return null;
        const bulletsRaw = doc.detailResultBullets as { line?: string }[] | undefined;
        const detailResultBullets = bulletsRaw
          ?.map((b) => b.line)
          .filter((x): x is string => Boolean(x));
        const adVideoUrl = payloadMediaSrc(doc.detailVideo as PayloadMediaLike);
        const card: CasesAdCard = {
          id: String(doc.id),
          image,
          title: String(doc.title ?? ""),
          credits,
          detailTask: String(doc.detailTask ?? ""),
          detailResultLead: String(doc.detailResultLead ?? ""),
          ...(adVideoUrl ? { detailVideoUrl: adVideoUrl } : {}),
        };
        const closing = doc.detailResultClosing;
        if (typeof closing === "string" && closing.trim()) {
          card.detailResultClosing = closing;
        }
        if (detailResultBullets?.length) {
          card.detailResultBullets = detailResultBullets;
        }
        return card;
      })
      .filter((x): x is CasesAdCard => x != null);

    return {
      verticalCards: verticalMapped.length > 0 ? verticalMapped : casesVerticalCards1440,
      adCards: adMapped.length > 0 ? adMapped : casesAdCards1440,
    };
  } catch {
    return {
      verticalCards: casesVerticalCards1440,
      adCards: casesAdCards1440,
    };
  }
}
