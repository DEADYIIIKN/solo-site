import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import {
  NEXT_IMAGE_MINIMUM_CACHE_TTL_SECONDS,
  staticAssetHeaders,
} from "./src/shared/config/cache-headers";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  eslint: {
    // Сборка образа не должна зависать на полном ESLint (CI/Docker, ограничение по памяти/времени).
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: NEXT_IMAGE_MINIMUM_CACHE_TTL_SECONDS,
  },
  async headers() {
    return staticAssetHeaders;
  },
};

export default withPayload(nextConfig);
