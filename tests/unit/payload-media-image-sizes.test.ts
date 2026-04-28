import { describe, expect, it } from "vitest";

import {
  getMediaAdminThumbnail,
  Media,
  payloadMediaImageSizes,
} from "@/cms/collections/media";

describe("Payload media image sizes", () => {
  it("generates AVIF and WebP variants for card and hero widths", () => {
    expect(payloadMediaImageSizes.map((size) => size.name)).toEqual([
      "card-360-avif",
      "card-360-webp",
      "card-768-avif",
      "card-768-webp",
      "card-1440-avif",
      "card-1440-webp",
      "hero-1440-avif",
      "hero-1440-webp",
    ]);

    const byName = new Map(payloadMediaImageSizes.map((size) => [size.name, size]));

    expect(byName.get("card-360-avif")).toMatchObject({
      width: 360,
      withoutEnlargement: true,
      formatOptions: { format: "avif" },
    });
    expect(byName.get("card-768-webp")).toMatchObject({
      width: 768,
      withoutEnlargement: true,
      formatOptions: { format: "webp" },
    });
    expect(byName.get("card-1440-avif")).toMatchObject({
      width: 1440,
      withoutEnlargement: true,
      formatOptions: { format: "avif" },
    });
    expect(byName.get("hero-1440-webp")).toMatchObject({
      width: 1440,
      withoutEnlargement: true,
      formatOptions: { format: "webp" },
    });
  });

  it("wires variants into the Media upload collection", () => {
    expect(Media.upload).toMatchObject({
      imageSizes: payloadMediaImageSizes,
      adminThumbnail: getMediaAdminThumbnail,
      displayPreview: true,
    });
  });

  it("uses generated card WebP as the admin thumbnail only for images", () => {
    expect(
      getMediaAdminThumbnail({
        doc: {
          mimeType: "image/jpeg",
          url: "/media/original.jpg",
          sizes: {
            "card-360-webp": { url: "/media/card.webp" },
          },
        },
      }),
    ).toBe("/media/card.webp");

    expect(
      getMediaAdminThumbnail({
        doc: {
          mimeType: "video/mp4",
          url: "/media/video.mp4",
        },
      }),
    ).toBe(false);
  });
});
