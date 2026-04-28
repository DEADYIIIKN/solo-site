export const ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";
export const NEXT_IMAGE_MINIMUM_CACHE_TTL_SECONDS = 60;

export type StaticHeaderRule = {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
};

export const staticAssetHeaders: StaticHeaderRule[] = [
  {
    source: "/assets/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: ASSET_CACHE_CONTROL,
      },
    ],
  },
];
