# Phase 15 Context — Payload Media Optimization

## Goal

Close Payload-uploaded media performance gaps after static media and cache headers:

- Payload Media upload generates responsive AVIF/WebP variants for uploaded images.
- Existing media can be regenerated with an explicit command.
- Case and future Payload media renders use `next/image` with accurate `sizes`.

## Boundary

In scope:

- `src/cms/collections/media.ts`
- Payload Media upload image variants
- Regeneration command for existing local uploads
- Case / preview / future Payload media render audit

Out of scope:

- Static `/public/assets` cleanup — done in Phase 13
- Static cache headers — done in Phase 14
- Fonts / bundle / video lazy loading — later phases

## Current Findings

- Payload already has `sharp` wired in `src/payload.config.ts`.
- Existing `Media` allowed `image/*` and `video/*`, but did not define `imageSizes`.
- Current local DB has 8 image media docs; regenerate dry-run sees all 8.
- Case render paths already use `next/image`, but helpers choose `doc.url` before `doc.sizes`, so `15-02` still needs a dedicated render-source audit.

## Decisions

- Generate both AVIF and WebP by defining separate Payload `imageSizes` entries per format. Payload `formatOptions` accepts a single output format per size.
- Use width-only variants to preserve uploaded aspect ratio across vertical cards, advertising cards, hero-like images, and future media.
- Keep video uploads supported. Admin thumbnail is a function: it uses generated `card-360-webp` for images and returns `false` for videos.
- Regeneration is opt-in: dry-run by default, apply only with `PAYLOAD_REGENERATE_MEDIA_APPLY=1`.

