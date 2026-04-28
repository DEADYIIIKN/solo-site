import { describe, expect, it } from "vitest";

import {
  ASSET_CACHE_CONTROL,
  NEXT_IMAGE_MINIMUM_CACHE_TTL_SECONDS,
  staticAssetHeaders,
} from "@/shared/config/cache-headers";

describe("static asset cache headers", () => {
  it("marks /assets/* responses as immutable for one year", () => {
    expect(staticAssetHeaders).toEqual([
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: ASSET_CACHE_CONTROL,
          },
        ],
      },
    ]);
    expect(ASSET_CACHE_CONTROL).toBe("public, max-age=31536000, immutable");
  });

  it("keeps optimized next/image responses CDN-friendly", () => {
    expect(NEXT_IMAGE_MINIMUM_CACHE_TTL_SECONDS).toBeGreaterThanOrEqual(60);
  });
});
