import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  eslint: {
    // Сборка образа не должна зависать на полном ESLint (CI/Docker, ограничение по памяти/времени).
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withPayload(nextConfig);
