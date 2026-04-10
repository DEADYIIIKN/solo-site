# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
COPY scripts ./scripts
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# Build-time only; runtime uses env from docker-compose / .env.solo-site
RUN PAYLOAD_SECRET=buildplaceholder012345678901234567890123456789012345678901234567890abcdef \
    DATABASE_URL=file:/tmp/payload-build.db \
    pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./
RUN mkdir -p /app/media
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD node -e "fetch(`http://127.0.0.1:${process.env.PORT || 3000}/`).then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"
CMD ["sh", "-c", "node --experimental-strip-types scripts/ensure-payload-db.ts && node --experimental-strip-types scripts/seed-cases-if-missing.ts && exec node server.js"]
