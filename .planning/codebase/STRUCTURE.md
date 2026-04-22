# Codebase Structure

**Analysis Date:** 2026-04-22

## Directory Layout

```
solo-site/
├── src/
│   ├── app/
│   │   ├── (payload)/          # CMS admin route group
│   │   │   ├── admin/          # Admin panel pages + importMap
│   │   │   ├── api/            # Payload REST/GraphQL catch-all
│   │   │   ├── custom.scss     # Admin UI overrides
│   │   │   └── layout.tsx      # Payload RootLayout wrapper
│   │   ├── (site)/             # Public site route group
│   │   │   ├── preview/        # CMS live preview routes
│   │   │   │   ├── cases-advertising/[id]/
│   │   │   │   └── cases-vertical/[id]/
│   │   │   ├── layout.tsx      # Site HTML shell, fonts, SiteLoadOverlay
│   │   │   └── page.tsx        # Homepage — data fetch + section composition
│   │   ├── globals.css         # Global CSS (design tokens, Tailwind base)
│   │   ├── robots.ts           # Robots meta
│   │   └── sitemap.ts          # XML sitemap
│   ├── bones/                  # Boneyard skeleton JSON + registry (auto-generated)
│   ├── cms/
│   │   ├── collections/        # Payload collection configs
│   │   ├── components/         # Custom Payload admin field components
│   │   └── globals/            # Payload global configs (SiteSettings)
│   ├── entities/               # FSD entities layer (currently empty, reserved)
│   ├── features/
│   │   └── lead-modal/         # Consultation modal feature
│   ├── shared/
│   │   ├── assets/             # Shared static assets (currently empty)
│   │   ├── config/             # Site constants (siteConfig, publicSiteUrl)
│   │   ├── lib/                # Hooks and utilities
│   │   └── ui/                 # Primitive UI components
│   ├── widgets/                # Full page sections
│   │   ├── business-goals/
│   │   ├── cases/
│   │   ├── first-screen/       # Hero + navbar + consultation modal
│   │   ├── footer/
│   │   ├── lead-form/
│   │   ├── levels/
│   │   ├── philosophy-clients/
│   │   ├── services/
│   │   ├── showreel/
│   │   ├── site-load/          # Loading overlay (first paint)
│   │   └── team/
│   ├── instrumentation.ts      # Next.js server hook (dev seed)
│   └── payload.config.ts       # Payload CMS configuration
├── public/
│   ├── assets/
│   │   ├── blog/               # Blog section assets (breakpoint exports)
│   │   └── figma/              # Figma design exports (organized by node ID + breakpoint)
│   └── fonts/                  # Montserrat font files (TTF)
├── scripts/                    # Dev/ops scripts (smoke tests, seed, deploy helpers)
├── infra/                      # Infrastructure configs (deploy, Docker)
├── docs/                       # Internal documentation
├── patches/                    # pnpm patch files for dependency overrides
├── .deploy/                    # Deploy configuration files
├── .github/workflows/          # CI/CD workflows
├── next.config.ts              # Next.js config (standalone output, withPayload)
├── payload.config.ts           # Re-exported via src/payload.config.ts
├── tsconfig.json               # TypeScript config
├── boneyard.config.json        # Skeleton/shimmer animation config
├── package.json
└── pnpm-lock.yaml
```

## Directory Purposes

**`src/widgets/`:**
- Purpose: Self-contained page sections. Each widget maps 1:1 to a visual section on the homepage.
- Contains: `index.ts` (public barrel), `model/` (data types + static data), `ui/` (React components per breakpoint), `lib/` (widget-specific hooks)
- Key files: Each widget has a root component (e.g., `cases-section.tsx`) that uses `useViewportLayout` to delegate to a breakpoint variant

**`src/shared/ui/`:**
- Purpose: Design system primitives — no domain knowledge, used across all layers
- Key files: `button.tsx`, `modal.tsx`, `typography.tsx`, `surface.tsx`, `grid.tsx`, `container.tsx`, `section.tsx`, `field.tsx`

**`src/shared/lib/`:**
- Purpose: Hooks and utilities shared across layers
- Key files:
  - `use-viewport-layout.ts` — breakpoint resolver hook (critical)
  - `get-site-settings.ts` — Payload global fetch with fallback
  - `open-consultation-modal.ts` — custom event dispatcher for cross-section modal trigger
  - `use-navbar-surface.ts` — navbar transparency/surface state hook
  - `utils.ts` — `cn()` (clsx + tailwind-merge)
  - `ensure-payload-schema.ts` — dev DB schema push utility

**`src/shared/config/`:**
- Purpose: Static site configuration constants
- Key files:
  - `site.ts` — `siteConfig` (name, description, OG data, locale, theme color)
  - `public-site-url.ts` — `publicSiteUrl` derived from `NEXT_PUBLIC_SITE_URL` env var

**`src/cms/collections/`:**
- Purpose: Payload collection definitions (schema + admin config + access rules)
- Key files: `cases-advertising.ts`, `cases-vertical.ts`, `media.ts`, `secrets-post.ts`, `users.ts`

**`src/bones/`:**
- Purpose: Shimmer skeleton animation definitions for loading states
- Contains: `*.bones.json` per widget per breakpoint; `registry.js` (auto-generated — do not edit)
- Generated: Yes, by `npx boneyard-js build`
- Committed: Yes

**`public/assets/figma/`:**
- Purpose: Exported assets from Figma, organized by Figma node ID and breakpoint label
- Pattern: `{node-id}-{description}-{breakpoint}/` — e.g., `7408-navbar-360/`
- Committed: Yes (static assets for production)

**`scripts/`:**
- Purpose: Developer utilities — smoke tests (Playwright-style), seed scripts, visual audits
- Key files: `seed-cases-if-missing.ts`, `ensure-payload-db.ts`

## Key File Locations

**Entry Points:**
- `src/app/(site)/page.tsx`: Homepage — fetches CMS data, renders all sections
- `src/app/(site)/layout.tsx`: Site HTML shell, font loading, metadata base
- `src/app/(payload)/layout.tsx`: CMS admin shell, schema initialization
- `src/payload.config.ts`: Payload CMS configuration (collections, DB, admin, upload)
- `src/instrumentation.ts`: Dev-only server startup hook (case seeding)

**Configuration:**
- `next.config.ts`: Next.js build config (standalone output, Payload integration)
- `boneyard.config.json`: Skeleton animation config (breakpoints, colors, timing)
- `tsconfig.json`: TypeScript config with path alias `@/` → `src/`
- `.env.example`: Required environment variables template

**Core Logic:**
- `src/shared/lib/use-viewport-layout.ts`: Breakpoint hook — used by every widget
- `src/widgets/cases/lib/get-cases-for-site.ts`: CMS data fetch with static fallback
- `src/shared/lib/get-site-settings.ts`: CMS global settings fetch with fallback
- `src/shared/lib/open-consultation-modal.ts`: Cross-section modal event bus

**CMS Collections:**
- `src/cms/collections/cases-vertical.ts`
- `src/cms/collections/cases-advertising.ts`
- `src/cms/globals/site-settings.ts`

**Testing:**
- `scripts/*.mjs`: Smoke tests for scroll behavior, anchor navigation, modals, visual layout

## Naming Conventions

**Files:**
- Widget UI components: `{widget-name}-{breakpoint}.tsx` — e.g., `cases-section-1440.tsx`, `footer-768.tsx`
- Widget root orchestrator: `{widget-name}.tsx` — e.g., `cases-section.tsx`, `footer-section.tsx`
- Data/model files: `{name}.data.ts` — e.g., `cases.data.ts`, `first-screen.data.ts`
- Widget-level hooks: `use-{name}.ts` — e.g., `use-cases-horizontal-carousel.ts`
- CMS collections: kebab-case matching Payload slug — e.g., `cases-advertising.ts`

**Directories:**
- Widgets: kebab-case matching section name — e.g., `first-screen`, `philosophy-clients`
- Widget subdirs: always one of `ui/`, `model/`, `lib/`
- Bones: kebab-case with breakpoint suffix — e.g., `cases-ad-card-1024.bones.json`

**React components:**
- PascalCase named exports — e.g., `CasesSection`, `CasesSection1440`
- Breakpoint variants: append breakpoint number as suffix — e.g., `CasesSection1440`, `FooterSection480`

**TypeScript types:**
- Exported from `model/*.data.ts` — e.g., `CasesVerticalCard`, `CasesAdCard`, `SiteSettingsData`

## Where to Add New Code

**New page section (widget):**
- Create `src/widgets/{section-name}/` with subdirs: `ui/`, `model/`, `lib/` (if needed)
- Add `src/widgets/{section-name}/index.ts` as public barrel export
- Create `src/widgets/{section-name}/model/{section-name}.data.ts` with types and static fallback data
- Create breakpoint components: `src/widgets/{section-name}/ui/{section-name}-{breakpoint}.tsx` for each of 360, 480, 768, 1024, 1440
- Create root orchestrator: `src/widgets/{section-name}/ui/{section-name}.tsx` using `useViewportLayout`
- Import and render in `src/app/(site)/page.tsx`

**New shared primitive:**
- Add to `src/shared/ui/{component-name}.tsx`
- Use `cva` + `cn` pattern matching `button.tsx` and `surface.tsx`

**New shared hook:**
- Add to `src/shared/lib/use-{name}.ts`

**New CMS collection:**
- Add collection config to `src/cms/collections/{slug}.ts`
- Register in `src/payload.config.ts` `collections` array
- Create a data fetcher in the relevant widget's `lib/` or in `src/shared/lib/`

**New feature (cross-widget interactive behavior):**
- Add to `src/features/{feature-name}/ui/{feature-name}.tsx`

**New skeleton definition:**
- Add `{name}-{breakpoint}.bones.json` to `src/bones/` OR run `npx boneyard-js build`
- Register in `src/bones/registry.js` (auto-generated, re-run build)

**New script:**
- Add to `scripts/{purpose}.mjs` or `scripts/{purpose}.ts`

## Special Directories

**`src/bones/`:**
- Purpose: Auto-generated skeleton animation registry
- Generated: Yes (via `boneyard-js build`)
- Committed: Yes — `registry.js` and all `.bones.json` files are committed

**`src/app/(payload)/admin/importMap.js`:**
- Purpose: Payload admin import map (auto-generated by `payload generate:importmap`)
- Generated: Yes
- Committed: Yes

**`.deploy/`:**
- Purpose: Deployment configuration (Docker Compose, Traefik, environment templates)
- Generated: No
- Committed: Yes

**`public/assets/figma/`:**
- Purpose: Static design exports, served as-is
- Generated: No (manually exported from Figma)
- Committed: Yes

---

*Structure analysis: 2026-04-22*
