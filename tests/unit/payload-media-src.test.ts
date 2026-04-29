import { describe, expect, it } from "vitest";

import {
  PAYLOAD_CARD_768_SIZES,
  payloadMediaSrc,
} from "@/shared/lib/payload-media";

describe("payloadMediaSrc", () => {
  it("prefers generated Payload size URLs over original upload URLs", () => {
    expect(
      payloadMediaSrc({
        url: "/media/original.jpg",
        sizes: {
          "card-1440-webp": { url: "/media/card-1440.webp" },
          "card-768-avif": { url: "/media/card-768.avif" },
        },
      }),
    ).toBe("/media/card-1440.webp");
  });

  it("uses caller-provided size preference order", () => {
    expect(
      payloadMediaSrc(
        {
          url: "/media/original.jpg",
          sizes: {
            "card-1440-webp": { url: "/media/card-1440.webp" },
            "card-768-avif": { url: "/media/card-768.avif" },
          },
        },
        PAYLOAD_CARD_768_SIZES,
      ),
    ).toBe("/media/card-768.avif");
  });

  it("falls back to original URL for videos or non-regenerated images", () => {
    expect(payloadMediaSrc({ url: "/media/video.mp4" })).toBe("/media/video.mp4");
    expect(payloadMediaSrc("1")).toBe("");
    expect(payloadMediaSrc(null)).toBe("");
  });
});
