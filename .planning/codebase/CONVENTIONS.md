# Coding Conventions

**Analysis Date:** 2026-04-22

## Naming Patterns

**Files:**
- React components: `kebab-case.tsx` — e.g., `cases-section.tsx`, `lead-form-fields.tsx`
- Viewport-specific components: `component-name-{breakpoint}.tsx` — e.g., `cases-section-1440.tsx`, `services-section-1024.tsx`
- Data/model files: `name.data.ts` — e.g., `cases.data.ts`, `levels.data.ts`
- Utility hooks: `use-noun-verb.ts` — e.g., `use-viewport-layout.ts`, `use-navbar-surface.ts`
- Config files: `noun.ts` — e.g., `public-site-url.ts`, `site.ts`
- Payload collection configs: `collection-slug.ts` — e.g., `cases-advertising.ts`

**Functions and Components:**
- React components: `PascalCase` — e.g., `CasesSection`, `LeadFormFields`, `ServicesSection`
- Hooks: `camelCase` with `use` prefix — e.g., `useViewportLayout`, `useNavbarSurface`
- Utility functions: `camelCase` — e.g., `formatConsultationPhone`, `resolveViewportLayout`, `getSiteSettings`
- Event dispatch helpers: `camelCase` with verb prefix — e.g., `dispatchOpenConsultationModal`
- Pure helpers inside modules: `camelCase` — e.g., `leadUnderlinePadding()`, `mediaSrc()`

**Variables and Constants:**
- Constants: `SCREAMING_SNAKE_CASE` for event names and module-level config — e.g., `OPEN_CONSULTATION_MODAL_EVENT`, `CASES_VERTICAL_IMG`
- `as const` used on readonly data objects and image path maps
- Object maps for breakpoint-keyed config: `camelCase` variable names — e.g., `densityMap`, `levelsCopy`

**Types and Interfaces:**
- `PascalCase` for all types — e.g., `ViewportLayout`, `CasesVerticalCard`, `SiteSettingsData`
- Exported interfaces: `PascalCase` with `Props` suffix for component props — e.g., `ButtonProps`, `SurfaceProps`
- Union string literal types for layout/breakpoint values — e.g., `"360" | "480" | "768" | "1024" | "1440"`

## Code Style

**Formatting:**
- No Prettier config file detected — project relies on ESLint and editor defaults
- Trailing commas in multi-line expressions and function arguments
- Attributes in JSX spread across multiple lines when there are 3+ props
- Single quotes not enforced — double quotes observed throughout TypeScript/TSX files

**Linting:**
- ESLint 9 flat config at `eslint.config.mjs`
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores: `.next/**`, `node_modules/**`, `next-env.d.ts`
- ESLint skipped during `next build` (see `next.config.ts`: `ignoreDuringBuilds: true`)
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)

**TypeScript:**
- `strict: true` — no implicit any, strict null checks
- `allowJs: false` — TypeScript only in `src/`
- Path alias `@/*` → `./src/*` used throughout (e.g., `@/shared/lib/utils`, `@/widgets/cases/model/cases.data`)
- `@payload-config` alias → `./src/payload.config.ts`
- `isolatedModules: true` — no const enum or namespace merging
- Explicit return types on utility/model functions; components generally omit explicit return type

## Import Organization

**Order observed:**
1. Node built-ins (`node:path`, `node:url`, `node:fs/promises`)
2. External packages (`react`, `next/image`, `payload`, `@payloadcms/*`, `@radix-ui/*`)
3. Internal aliases starting with `@/` — shared utilities first, then feature/widget imports
4. Relative imports (rare; used in scripts)

**Path Aliases:**
- `@/` maps to `src/` — use this everywhere in application code
- `@payload-config` for Payload CMS configuration import

## Component Structure Patterns

**"use client" directive:**
- Any component using hooks, browser APIs, or event handlers starts with `"use client"` on line 1
- Server components have no directive — they fetch data (e.g., page route components calling `getPayload`)
- The pattern is: server page → passes `initialData` to `"use client"` `PreviewClient` component

**Viewport-driven rendering:**
- `useViewportLayout()` returns `"360" | "480" | "768" | "1024" | "1440" | null`
- Returns `null` during SSR/hydration — render a minimal placeholder `<div id="section-id" />` in that case
- Each breakpoint renders a dedicated sub-component: `ServicesSection1440`, `ServicesSection1024`, `ServicesSectionBelow1024`
- Breakpoints can be combined: `layout === "768" || layout === "480" || layout === "360"` → single component

**CVA (class-variance-authority) pattern:**
- Used for components with multiple visual variants: `Button`, `Surface`, `Heading`, `Text`, `Typography`
- Define `const variants = cva(baseClasses, { variants: {...} })` then `cn(variants({ ...props }), className)`
- Always accept `className` prop and merge with `cn()` from `@/shared/lib/utils`
- Expose `VariantProps<typeof variants>` via interface extending the HTML element props

**Density maps:**
- Breakpoint-specific typography/sizing stored as `densityMap: Record<BreakpointType, {...}>` object
- Keyed by breakpoint string `"360" | "480" | ...` — accessed as `densityMap[density]`
- Used in forms and cards that must match exact Figma pixel values per viewport

## Data Patterns

**Static data files (`*.data.ts`):**
- Figma node IDs documented in JSDoc at the top of the file — e.g., `/** Figma 783:9284 — ... */`
- Image paths defined as `as const` objects, then referenced by key
- Exported data arrays use `readonly` — e.g., `export const casesVerticalCards1440: readonly CasesVerticalCard[]`
- Type definitions co-located with data in the same file

**Model functions (pure logic):**
- Phone formatting, validation in `src/widgets/first-screen/model/first-screen-consultation-form.ts`
- No side effects in model files — pure transformations only
- Internal helpers not exported (e.g., `normalizeConsultationPhoneDigits`)

## Error Handling

**Patterns:**
- Server data fetching wraps Payload calls in `try/catch` — returns safe defaults on failure
- Example from `get-site-settings.ts`: `try { ... } catch { return DEFAULTS; }` (empty catch, no binding)
- Route handlers use `notFound()` from `next/navigation` when Payload throws on `findByID`
- Client form validation: `submitAttempted` flag + derived error booleans (`nameError`, `phoneError`) — no thrown errors
- Live preview data mapping uses defensive casting: `String(doc.title ?? "")`, `Boolean(raw?.field ?? default)`

## Comments

**When to Comment:**
- Figma references always documented: `/** Figma 783:9284 — ... */` on data objects and layout helpers
- Complex CSS/layout decisions commented inline: `/* Figma 783:8366: h 550, pt 24 px 24 pb 36 */`
- Non-obvious browser behavior explained: `/* h-[1.2em]: UA-стайлшит растягивает input ... */`
- `TODO:` comments used for stub behavior: `/* TODO: отправка заявки */`
- Auto-generated files marked: `// Auto-generated by ... — do not edit`
- JSDoc on exported utility functions in `src/shared/lib/`

**Language:** Russian for business-logic comments and Payload field labels; English for technical code comments.

## Module Design

**Exports:**
- Named exports only — no default exports from component files (except Next.js page routes, which require `export default`)
- Re-export barrel files not used — each module imported directly by path
- Payload collection configs export a single named constant matching the collection label: `export const CasesAdvertising: CollectionConfig`

**Feature-Sliced Design (FSD) layer structure:**
- `src/shared/` — reusable primitives: `ui/`, `lib/`, `config/`, `assets/`
- `src/widgets/` — self-contained page sections with `ui/`, `model/`, `lib/` sub-layers
- `src/features/` — user-facing features (e.g., `lead-modal/`)
- `src/entities/` — domain entity types (currently empty/minimal)
- `src/cms/` — Payload CMS collections, globals, admin components
- `src/app/` — Next.js App Router pages and layouts
- `src/bones/` — Boneyard.js animation registry (auto-generated, do not edit manually)

---

*Convention analysis: 2026-04-22*
