# External Integrations

**Analysis Date:** 2026-04-22

## APIs & External Services

**Container Registry:**
- GitHub Container Registry (GHCR) - Stores and serves Docker images for deployment
  - Image: `ghcr.io/deadyiiikn/solo-site:latest`
  - Auth: `secrets.GITHUB_TOKEN` (auto-injected in GitHub Actions)

**n8n (co-located infrastructure):**
- The production server runs an n8n instance alongside this app (`n8n_beget-network`)
- The app shares the Docker network `n8n_n8n_beget-network` with n8n
- No direct API calls from this codebase to n8n detected; shared network implies potential future automation/webhook wiring

## Data Storage

**Databases:**
- SQLite via libSQL
  - Development: `file:./payload.db` (local file)
  - Production: Docker volume `solo_sqlite_data` mounted at `/data`, path configured via `DATABASE_URL`
  - Client: `@libsql/client` 0.14.0 + `@payloadcms/db-sqlite` 3.82.0 (Drizzle ORM)
  - Schema management: Drizzle push (`PAYLOAD_DATABASE_PUSH=1`) for development; `scripts/ensure-payload-db.ts` at container startup for production
  - Note: `.env.example` mentions a Postgres upgrade path via `@payloadcms/db-postgres` + `DATABASE_URL=postgres://...`

**File Storage:**
- Local filesystem only (no S3 or CDN detected)
  - Development: relative path (default Payload media directory)
  - Production: `/data/media` inside container, backed by Docker volume `solo_sqlite_data`
  - Configured via `PAYLOAD_UPLOAD_DIR` env var
  - Large uploads use temp files in `PAYLOAD_TEMP_UPLOAD_DIR` (default: `/tmp/payload-uploads`)
  - Upload timeout: 10 minutes (set in `src/payload.config.ts`)

**Caching:**
- GitHub Actions layer cache (`type=gha`) for Docker builds
- No in-process cache layer (Redis, Memcached) detected

## Authentication & Identity

**Auth Provider:**
- Payload CMS built-in auth (JWT-based, email/password)
  - Collection: `src/cms/collections/users.ts`
  - Admin panel: `/admin` route group (`src/app/(payload)/admin/`)
  - Secret: `PAYLOAD_SECRET` env var (>=32 chars random string)
  - No external OAuth/SSO provider detected

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Datadog, etc.)

**Logs:**
- `console.warn` / `console.error` used in instrumentation and seed scripts
- Docker container stdout/stderr (no structured logging library)

**Health Checks:**
- HTTP GET to `http://127.0.0.1:${PORT}/` — defined both in `Dockerfile` and `infra/docker-compose.solo-site.yml`
- Interval: 30s, timeout: 5s, start period: 30s, retries: 3

## CI/CD & Deployment

**Hosting:**
- VPS via Beget (SSH target configured via `secrets.DEMO_SSH_HOST/USER/KEY/PORT`)
- Domain: `demo.soloproduction.pro` (Traefik `Host()` rule)
- TLS: Traefik Let's Encrypt (`mytlschallenge` cert resolver)

**CI Pipeline:**
- GitHub Actions (`.github/workflows/docker-publish.yml`)
- Trigger: push to `main` or `master`, or manual `workflow_dispatch`
- Steps:
  1. Build multi-stage Docker image
  2. Push to GHCR as `:latest` and `:sha-{commit}`
  3. SSH into VPS and run `scripts/deploy-demo.sh` (pulls new image, restarts compose)
- Concurrency group `solo-site-docker` (cancels in-progress on new push)

**Manual deploy script:**
- `scripts/deploy-demo.sh` — used by both CI and manual deploys

## Webhooks & Callbacks

**Incoming:**
- None detected. Payload CMS REST API endpoints are mounted at `/api/[...slug]` (`src/app/(payload)/api/[...slug]/route.ts`) and handle standard Payload operations (GET, POST, PATCH, PUT, DELETE, OPTIONS). These are not externally triggered webhooks.

**Outgoing:**
- None detected. Lead form submission (`src/widgets/lead-form/ui/lead-form-fields.tsx`) has a `TODO: отправка заявки` comment — no actual outgoing HTTP request is implemented yet.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SITE_URL` - Canonical site URL for metadata and Payload live preview
- `PAYLOAD_SECRET` - Auth JWT secret (>=32 chars)
- `DATABASE_URL` - SQLite file path or Postgres connection string
- `PAYLOAD_UPLOAD_DIR` - Production media storage path
- `PORT` - HTTP port (default: 3000)
- `HOSTNAME` - Bind address (default: `0.0.0.0`)

**Optional env vars:**
- `PAYLOAD_AUTO_SEED` - Set `0` to disable dev auto-seed from static data
- `PAYLOAD_DATABASE_PUSH` - Set `1` to run Drizzle schema push on next dev start
- `PAYLOAD_TEMP_UPLOAD_DIR` - Override temp dir for large uploads
- `PAYLOAD_PUBLIC_SERVER_URL` - Alternative canonical URL (fallback for `NEXT_PUBLIC_SITE_URL`)
- `SKIP_DEV_CACHE_CLEAN` - Set `1` in `dev:fast` to skip cache cleanup

**Secrets location:**
- Local development: `.env.local` (gitignored, bootstrapped from `.env.example`)
- Production: `/opt/beget/n8n/solo-site.env.production` on the VPS host
- CI secrets: GitHub repository secrets (`DEMO_SSH_HOST`, `DEMO_SSH_PORT`, `DEMO_SSH_USER`, `DEMO_SSH_KEY`, `GITHUB_TOKEN`)

---

*Integration audit: 2026-04-22*
