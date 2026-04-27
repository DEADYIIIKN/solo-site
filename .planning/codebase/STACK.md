# Technology Stack

**Analysis Date:** 2026-04-22

## Languages

**Primary:**
- TypeScript 5.8.x - All source code in `src/`, strict mode enabled, `allowJs: false`

**Secondary:**
- JavaScript (`.mjs`) - Audit/smoke-test scripts in `scripts/`, run with Node directly

## Runtime

**Environment:**
- Node.js >=22.0.0 (enforced via `engines` in `package.json`)
- Docker base image: `node:22-bookworm-slim`

**Package Manager:**
- pnpm 10.6.5 (pinned via `packageManager` field and `corepack`)
- Lockfile: `pnpm-lock.yaml` present and frozen in CI/Docker builds

## Frameworks

**Core:**
- Next.js ^15.4.11 (App Router) - Full-stack web framework, output: `standalone`
- React ^19.0.0 - UI library, JSX mode: `preserve`
- Payload CMS 3.82.0 - Headless CMS embedded inside Next.js via `@payloadcms/next`

**Rich Text:**
- `@payloadcms/richtext-lexical` 3.82.0 - Lexical-based rich text editor in Payload admin

**Testing/Audit:**
- Playwright 1.50.1 - Browser automation for visual smoke tests and audit scripts in `scripts/`
- pngjs 7.0.0 - PNG pixel comparison in audit scripts

**Build/Dev:**
- Turbopack (default dev mode via `next dev --turbopack`)
- Webpack (fallback: `dev:webpack` script)
- cross-env 10.1.0 - Cross-platform env var injection in scripts

## Key Dependencies

**Critical:**
- `payload` 3.82.0 - CMS core, defines collections/globals, REST/GraphQL API
- `@payloadcms/db-sqlite` 3.82.0 - SQLite adapter via Drizzle ORM for Payload
- `@libsql/client` 0.14.0 - Low-level libSQL client used by the SQLite adapter
- `@payloadcms/drizzle` 3.82.0 - Drizzle ORM integration layer
- `sharp` ^0.34.5 - Image processing for Payload media uploads (required for Next.js image optimization too)
- `graphql` ^16.13.2 - GraphQL runtime (Payload exposes a GraphQL endpoint)

**UI:**
- `@radix-ui/react-dialog` ^1.1.15 - Accessible dialog primitives (`src/shared/ui/modal.tsx`)
- `tailwindcss` ^4.1.4 - Utility-first CSS (PostCSS plugin: `@tailwindcss/postcss`)
- `tailwind-merge` ^3.3.0 - Merges Tailwind classes safely
- `class-variance-authority` ^0.7.1 - Component variant management
- `clsx` ^2.1.1 - Conditional className helper
- `sonner` ^2.0.7 - Toast notifications
- `boneyard-js` ^1.7.6 - Skeleton/loading placeholder generation (`boneyard.config.json` + `src/bones/`)

**Live Preview:**
- `@payloadcms/live-preview-react` 3.82.0 - Real-time CMS preview in Next.js

**Utilities:**
- `dotenv` ^17.4.1 - Env file loading in standalone scripts

**Patched:**
- `@payloadcms/ui@3.82.0` - Local patch applied via `patches/@payloadcms__ui@3.82.0.patch`

## Configuration

**Environment:**
- Local: `.env.local` (created from `.env.example`)
- Production: `/opt/beget/n8n/solo-site.env.production` (mounted via `env_file` in compose)
- Key required vars:
  - `NEXT_PUBLIC_SITE_URL` - Public canonical URL (e.g. `https://demo.soloproduction.pro`)
  - `PAYLOAD_SECRET` - JWT secret for Payload auth (>=32 chars)
  - `DATABASE_URL` - SQLite path (`file:./payload.db`) or Postgres URL for production scale-up
  - `PAYLOAD_UPLOAD_DIR` - Media upload directory (production: `/data/media`)
  - `PAYLOAD_AUTO_SEED` - Seed cases from static on dev start (default: enabled, set `0` to disable)
  - `PAYLOAD_DATABASE_PUSH` - Set `1` once after schema changes to run Drizzle push
  - `PAYLOAD_TEMP_UPLOAD_DIR` - Temp dir for large file uploads (default: `/tmp/payload-uploads`)

**Build:**
- `tsconfig.json` - TypeScript compiler config, path aliases `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`
- `next.config.ts` - Wraps config with `withPayload`, enables `standalone` output, AVIF/WebP image formats
- `postcss.config.mjs` - PostCSS config using `@tailwindcss/postcss`
- `eslint.config.mjs` - ESLint flat config extending `next/core-web-vitals` + `next/typescript`
- `boneyard.config.json` - Skeleton animation config for `boneyard-js` (breakpoints: 360, 480, 768, 1024, 1440)
- ESLint is disabled during Next.js builds (`ignoreDuringBuilds: true`) to avoid memory/time issues in Docker

## Platform Requirements

**Development:**
- Node.js 22+, pnpm 10.6.5
- SQLite database file at `./payload.db`
- Run `PAYLOAD_DATABASE_PUSH=1 pnpm dev` once after schema changes
- `predev` script runs `ensure-env-local.mjs` and `clean-dev-cache.mjs` automatically

**Production:**
- Docker (multi-stage build: `base → deps → prod-deps → builder → runner`)
- Container image published to `ghcr.io/deadyiiikn/solo-site`
- Traefik reverse proxy handles TLS via Let's Encrypt (`mytlschallenge`)
- SQLite data persisted in Docker volume `solo_sqlite_data` at `/opt/beget/n8n/solo_sqlite_data`
- Resource limits: 512 MB RAM, 0.5 CPU, 200 PIDs
- Healthcheck: HTTP GET `/` every 30s

---

*Stack analysis: 2026-04-22*
