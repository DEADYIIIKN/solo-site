export type PayloadMediaLike =
  | {
      url?: string | null;
      sizes?: Record<string, { url?: string | null } | null> | null;
    }
  | number
  | string
  | null
  | undefined;

export const PAYLOAD_CARD_768_SIZES = [
  "card-768-avif",
  "card-768-webp",
  "card-360-avif",
  "card-360-webp",
] as const;

export const PAYLOAD_CARD_1440_SIZES = [
  "card-1440-avif",
  "card-1440-webp",
  "card-768-avif",
  "card-768-webp",
  "card-360-avif",
  "card-360-webp",
] as const;

export function payloadMediaSrc(
  media: PayloadMediaLike,
  preferredSizes: readonly string[] = PAYLOAD_CARD_1440_SIZES,
): string {
  if (!media || typeof media !== "object") return "";

  const sizes = media.sizes;
  if (sizes && typeof sizes === "object") {
    for (const sizeName of preferredSizes) {
      const size = sizes[sizeName];
      if (size && typeof size.url === "string" && size.url.length > 0) {
        return size.url;
      }
    }
  }

  return typeof media.url === "string" && media.url.length > 0 ? media.url : "";
}
