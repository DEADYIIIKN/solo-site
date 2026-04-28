---
phase: 01-quick-wins-stack-audit
plan: "04"
subsystem: planning-docs
tags: [audit, stack, animations, safari, next.js, framer-motion]
dependency_graph:
  requires: []
  provides:
    - .planning/AUDIT-STACK.md
    - .planning/AUDIT-ANIMATIONS.md
  affects:
    - Phase 4 (Safari + Animations) — animation library choice feeds directly into Phase 4 planning
tech_stack:
  added: []
  patterns:
    - Markdown audit documents with comparison tables and unambiguous recommendations
key_files:
  created:
    - .planning/AUDIT-STACK.md
    - .planning/AUDIT-ANIMATIONS.md
  modified: []
decisions:
  - "Keep Next.js App Router: Payload CMS server-side dependency makes SPA migration not feasible"
  - "Use Framer Motion (motion package) for animations in Phase 4: Safari-safe scroll-driven API, React 19 native, replaces boneyard-js"
metrics:
  duration: ~10 minutes
  completed: 2026-04-22
---

# Phase 1 Plan 04: Stack + Animation Audit Summary

**One-liner:** Next.js App Router kept (Payload CMS hard dependency); Framer Motion chosen over GSAP and boneyard-js for Safari-safe scroll-driven animations in Phase 4.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write AUDIT-STACK.md — Next.js App Router vs React SPA | 3068495 | .planning/AUDIT-STACK.md |
| 2 | Write AUDIT-ANIMATIONS.md — boneyard-js+CSS vs GSAP vs Framer Motion | b2dc6be | .planning/AUDIT-ANIMATIONS.md |

## Decisions Made

### AUDIT-01: Stack Decision — Keep Next.js App Router

**Verdict:** Keep Next.js App Router. Migration to React SPA is not recommended.

**Key reasons:**
- `getPayload()` is called directly in Server Components (RSC) — Payload CMS and Next.js are tightly coupled in a single monorepo. Separating them into a SPA + API server requires significant infrastructure work with no user-visible benefit.
- ISR (`revalidate = 60`) works out of the box — the site gets fresh CMS content without full rebuilds.
- Zero migration cost vs 2–4 days of infrastructure work with new deployment risks.
- The site being single-page is not a reason to abandon Next.js — App Router is appropriate for single-page sites too.

### AUDIT-02: Animation Decision — Migrate to Framer Motion

**Verdict:** Replace boneyard-js with Framer Motion (`motion` package) in Phase 4.

**Key reasons:**
- boneyard-js uses Intersection Observer + CSS transitions which are reliable for basic reveal, but CSS `scroll-timeline`/`animation-timeline` (required for ANI-01 scroll-driven cases animation) are **not supported in Safari < 18** — directly causing SAFARI-01/SAFARI-02 bugs.
- Framer Motion's `useScroll()`/`useTransform()` use Motion Values + `requestAnimationFrame` — no dependency on CSS Scroll-Driven Animations API, so Safari-safe.
- Framer Motion is React 19-native with declarative JSX API (`whileInView`, `animate`, `useScroll`) — no `useRef` + imperative `gsap.to()` overhead.
- GSAP was considered but rejected: imperative API creates friction in React 19 concurrent mode, ScrollTrigger adds ~39 KB vs ~25 KB Motion with tree-shaking, and GSAP's power is overkill for this landing page.
- boneyard-js has low maintenance activity (v1.7.6, niche package) — Phase 4 should not rely on it for cross-browser animation.

**Phase 4 migration path:** `pnpm add motion`, migrate `BoneyardSkeleton` → `motion.div whileInView`, implement ANI-01 via `useScroll`/`useTransform`.

## Deviations from Plan

None — plan executed exactly as written.

The only non-obvious finding: AUDIT-STACK.md was initially written to `/Users/a_savinkov/solo-site/.planning/AUDIT-STACK.md` (main repo working tree) rather than the worktree's `.planning/` directory. Corrected immediately before commit — no functional impact.

## Known Stubs

None. Both documents are complete standalone audit artifacts.

## Threat Flags

None. Both files are static Markdown planning documents with no runtime attack surface (per plan threat model T-04-01: accepted).

## Self-Check: PASSED

- [x] `.planning/AUDIT-STACK.md` exists in worktree — commit 3068495
- [x] `.planning/AUDIT-ANIMATIONS.md` exists in worktree — commit b2dc6be
- [x] AUDIT-STACK.md has `## Recommendation` section with unambiguous "Keep Next.js App Router" verdict
- [x] AUDIT-ANIMATIONS.md has `## Recommendation` section with unambiguous "Framer Motion" verdict
- [x] Safari appears as named criterion row in AUDIT-ANIMATIONS.md table (9 matches)
- [x] Both documents have ≥ 3 `##` sections (AUDIT-STACK: 3, AUDIT-ANIMATIONS: 5)
- [x] Both commits exist in git log
