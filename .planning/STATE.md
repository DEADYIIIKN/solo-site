---
gsd_state_version: 1.0
milestone: v1.3
milestone_name: "SEO & Analytics Production Gate"
last_shipped: v1.2
status: v1.3-phase-21-complete-local
stopped_at: Phase 21 implemented locally; next Phase 22 Yandex Metrika goals
last_updated: "2026-04-30T00:00:00.000+03:00"
last_activity: 2026-04-30 -- Phase 21 structured SEO pass implemented locally: JSON-LD, service noindex headers, SEO unit smoke
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 4
  completed_plans: 2
  percent: 50
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.
**Current focus:** v1.3 — SEO & Analytics Production Gate

## Current Position

Last shipped: **v1.2** (2026-04-30)
Active milestone: **v1.3 — SEO & Analytics Production Gate**
Phase: 21 complete locally — Structured SEO Pass
Next: Phase 22 — Yandex Metrika Events
Last activity: 2026-04-30 -- JSON-LD added for home page, email utility routes marked noindex, SEO smoke tests added

Progress: 2/4 plans complete locally. Phase 21 code is implemented; full build/lint and deploy remain next.

## Performance Metrics

**Velocity:**

- Total plans completed: 12
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | - | - |
| 02 | 3 | - | - |

**Recent Trend:**

- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 04 P01 | fast | 3 tasks | 3 files |
| Phase 04 P02 | 5m | 1 tasks | 1 files |
| Phase 04 P03 | 497s | 1 tasks | 1 files |
| Phase 04 P04 | short | 3 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Init: Start with bug fixes (form + audit), not pixel-perfect — bugs block users now
- Init: Figma MCP will be used for sverka in phases 2, 3, 5
- Init: Stack not changed in this milestone scope (audit is documentation only)
- Card 03 alone migrated to motion.div; useInViewOnce CSS reveal preserved for other cards (D-04)

### Pending Todos

- Run full verification for Phase 21 (`typecheck`, unit, build, lint).
- Deploy desired compose with one active `solo-site` production service for `soloproduction.pro`.
- Decide whether `demo.soloproduction.pro` should remain unserved or become a 301 redirect later.

### Blockers/Concerns

- No active implementation blocker.
- Production verification must confirm Traefik routes only the intended domain and that existing demo data volume is the desired production data source.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Tech Debt | Unify 5 consultation modal components (REFAC-01) | v2 | Init |
| Tech Debt | Split business-goals.tsx per-breakpoint (REFAC-02) | v2 | Init |
| Tech Debt | Split services-section-below-1024.tsx (REFAC-03) | v2 | Init |
| Tech Debt | Move shared form types to model file (REFAC-04) | v2 | Init |
| Feature | Form submission to CRM/Telegram/n8n (FUNC-01) | v2 | Init |

## Session Continuity

Last session: 2026-04-30
Stopped at: Phase 21 implemented locally
Resume file: --resume-file

**Planned Phase:** 22 (metrika-goals)
