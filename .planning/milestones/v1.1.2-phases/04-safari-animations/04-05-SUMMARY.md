---
phase: 04-safari-animations
plan: 05
subsystem: widgets/cases + widgets/philosophy-clients
tags: [motion, reveal, pattern-a, pattern-b, pattern-d, safari-parity, d-07, d-11]
requires:
  - 04-01 (motion dependency + global MotionConfig)
  - 04-02 / 04-03 (narrow-widget migrations)
  - 04-04 (cases 360/480/768)
provides:
  - Cases 1024/1440 reveal via motion.article (Pattern A + D)
  - Philosophy-clients 1024/1440 team card reveal via motion.div (Pattern B — style.transform preserved)
  - Safari scroll-linked parity for philosophy pin (continuous rAF + IntersectionObserver gate)
  - Safari scroll-linked parity for services pin (same continuous rAF refactor)
  - Cases section UX cleanup: pin-collapse animation removed at 1024/1440 — both vertical and ad strips always visible
affects:
  - src/widgets/cases/ui/cases-section-1024.tsx
  - src/widgets/cases/ui/cases-section-1440.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx
  - src/widgets/philosophy-clients/lib/use-philosophy-stack-progress.ts
  - src/widgets/services/lib/use-services-pin-scroll-progress.ts
tech_stack_added: []
patterns:
  - Pattern A applied to cases VerticalCard + AdCard (1024, 1440)
  - Pattern B applied to philosophy team card (1024, 1440) — motion.div animates opacity only, style.transform preserved
  - Pattern D preserved (grayscale, mix-blend-color, casesCardHoverEase)
  - Continuous rAF + IntersectionObserver gating (D-07 variant) applied to philosophy + services pin hooks for Safari inertial-scroll parity
key_files_created:
  - .planning/phases/04-safari-animations/04-05-UAT.md
key_files_modified:
  - src/widgets/cases/ui/cases-section-1024.tsx
  - src/widgets/cases/ui/cases-section-1440.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx
  - src/widgets/philosophy-clients/lib/use-philosophy-stack-progress.ts
  - src/widgets/services/lib/use-services-pin-scroll-progress.ts
decisions:
  - Cases pin-collapse scroll behaviour stripped entirely at 1024/1440 (UX call — "ужасно неюзабельно"). Both carousels always visible. `useCasesPinScrollProgress` / `getCasesPinWeights` / `CASES_PIN_SCROLL_VH` no longer consumed in these two files.
  - Philosophy Safari parity achieved without D-07 useScroll drop-in — `usePhilosophyPinScrollProgress` refactored to continuous `requestAnimationFrame` loop reading `window.scrollY` every display frame, gated by an IntersectionObserver with `rootMargin: "200% 0px 200% 0px"` to keep CPU low outside the section.
  - Same rAF + IO refactor applied to `useServicesPinScrollProgress` after user requested same smoothness everywhere. `useServicesPinWheelClamp` (wheel/keyboard interceptor) was intentionally left alone — it is a discrete input gate, not a scroll-linked animation.
  - Discrete-state consumers (`business-goals` CTA visibility bool, `use-navbar-surface` enum) deliberately NOT refactored — rAF-every-frame is wrong tool for enum toggles.
  - UAT item 2 (ANI-01 pin holds position) marked N/A because cases pin was removed in the same session; items 1/3/4 human-verified PASS.
metrics:
  tasks_completed: 5
  tasks_total: 6
  completed_date: 2026-04-23
  commits:
    - 717203a refactor(04-05): migrate cases-section-1024 cards to motion.article fade
    - 34f1b43 refactor(04-05): migrate cases-section-1440 cards to motion.article fade
    - 26396db refactor(04-05): migrate philosophy-clients-1024 team card to motion.div (Pattern B)
    - 5ea1b2e refactor(04-05): migrate philosophy-clients-1440 team card to motion.div (Pattern B)
    - c4820fd docs(04-05): Safari UAT checklist — awaiting human verification
requirements:
  - SAFARI-01
  - SAFARI-02
  - ANI-01
  - ANI-02
---

# Phase 04 Plan 04-05: Cases + Philosophy 1024/1440 Safari Parity Summary

**One-liner:** Migrated cases 1024/1440 to `motion.article` reveal and philosophy-clients 1024/1440 team card to `motion.div` reveal (Pattern B — `style.transform` preserved). Safari inertial-scroll jitter on philosophy + services pins eliminated by converting their scroll-linked hooks from scroll-event-driven `tick` to continuous `requestAnimationFrame` gated by IntersectionObserver. Cases pin-collapse animation was stripped entirely per user UX decision during UAT — both vertical and ad strips always render. D-07 `useScroll` drop-in skipped (ANI-01 obsolete once pin removed).

## Scope

Wave 4 of Phase 04 — the final migration plan before teardown (04-06).

Covered:
- Cases `VerticalCard` + `AdCard` at 1024 and 1440 migrated to `motion.article` (Pattern A)
- Philosophy-clients team card at 1024 and 1440 migrated to `motion.div` (Pattern B)
- Cases pin-collapse UX removed (out-of-scope UX call executed in-place)
- Safari scroll-linked parity fixed on philosophy + services pins

## Deviations from plan

- **Task 6 (D-07 useScroll drop-in)** skipped. Philosophy jitter solved by continuous rAF + IO gating; ANI-01 obsolete after cases pin removal.
- **Cases pin-collapse removal** was not in the original Plan but was executed in the same pass on user UX direction.
- **Services rAF refactor** was bonus scope — propagated the smoothness fix per user request.
- **Team photo swap** — binary swap between `7830-philosophy-clients-1440/team-card.jpg` and `9656-team-what-we-do-1440/team.png` (correction of earlier misplacement in commit `b094756`).

## UAT outcome

`04-05-UAT.md`: PASS (Алекс, 2026-04-23, Darwin 25.1.0, Safari latest).
- Item 1 Reveal fades without flicker: PASS at 1440/1024/768/480/360
- Item 2 ANI-01 pin holds position: N/A (cases pin removed)
- Item 3 Hover transitions without flash: PASS
- Item 4 Scroll playback parity vs Chrome: PASS

## Follow-ups handed to next plan

Wave 5 / Plan 04-06 (teardown) can now proceed — all `BoneyardSkeleton` consumers are removed from widget code.
