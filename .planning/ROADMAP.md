# Roadmap: SOLO Site — Frontend Quality & Bug Fix

## Overview

Brownfield bug-fix and quality milestone for the SOLO video production agency landing page. The work starts with quick wins that unblock real users (form bugs, stack audit), then proceeds breakpoint by breakpoint from desktop to mobile, addresses Safari cross-browser compatibility and animation correctness, finishes with a pixel-perfect Figma pass across all breakpoints, and closes with automated test coverage. Each phase delivers a coherent, verifiable improvement to the live site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Quick Wins + Stack Audit** - Fix all form bugs blocking users, document stack and animation audit decisions
- [ ] **Phase 2: Desktop Layout (1440px + 1180px)** - Align desktop and iPad-horizontal breakpoints with Figma
- [ ] **Phase 3: Mobile/Tablet Layout (820px + 360px)** - Align tablet-portrait and mobile breakpoints with Figma
- [ ] **Phase 4: Safari + Animations** - Make animations and transitions work identically in Safari and Chrome
- [ ] **Phase 5: Pixel-Perfect Final Pass** - Full Figma sverka across all four breakpoints
- [ ] **Phase 6: Testing** - E2E, cross-browser, and unit test coverage for forms and animations

## Phase Details

### Phase 1: Quick Wins + Stack Audit
**Goal**: Users can interact with forms without hitting broken links or layout glitches, and the team has documented decisions on Next.js vs SPA and animation library choices
**Depends on**: Nothing (first phase)
**Requirements**: FORM-01, FORM-02, FORM-03, AUDIT-01, AUDIT-02
**Success Criteria** (what must be TRUE):
  1. Clicking "Политика конфиденциальности" in any form does not produce a 404 or page reload
  2. Clicking anywhere on the consent label text toggles the checkbox
  3. The "Оставить заявку" button text is visually centered in its container inside case forms
  4. A written audit document exists comparing Next.js App Router vs React SPA for this landing, with a clear recommendation
  5. A written audit document exists comparing boneyard-js + CSS vs GSAP / Framer Motion, with a clear recommendation
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Fix FORM-02 (privacy link new tab) and FORM-03 (button centering in 5 consultation modals)
- [x] 01-02-PLAN.md — Create Payload Global privacy-page.ts, register in payload.config.ts, run schema push [BLOCKING checkpoint]
- [x] 01-03-PLAN.md — Create /privacy Next.js page, update all 5 footer files to href=/privacy
- [x] 01-04-PLAN.md — Write AUDIT-STACK.md and AUDIT-ANIMATIONS.md with comparison tables and recommendations

### Phase 2: Desktop Layout (1440px + 1180px)
**Goal**: The 1440px and 1180px breakpoints match Figma visually — service card alignment, font rendering, team photo, and client logo strips are correct
**Depends on**: Phase 1
**Requirements**: LY1440-01, LY1440-02, LY1440-03, LY1180-01
**Success Criteria** (what must be TRUE):
  1. Service card titles on 1440px are all bottom-aligned as in Figma (no titles jumping to top)
  2. Service card #4 on 1440px has the correct text frame width and font weight matching Figma
  3. The team photo section on 1440px displays the current photo (not a stale cached image)
  4. The client logo marquee on 1180px spans the full viewport width with no visible endpoint gap
**Plans**: TBD
**UI hint**: yes

### Phase 3: Mobile/Tablet Layout (820px + 360px)
**Goal**: The 820px and 360px breakpoints work correctly — carousel arrows point the right way, carousels don't clip content, client strips fill the screen, line-heights match Figma, and the missing photo is restored
**Depends on**: Phase 2
**Requirements**: LY820-01, LY820-02, LY820-03, LY820-04, LY820-05, LY360-01, LY360-02, LY360-03, LY360-04, LY360-05, LY360-06
**Success Criteria** (what must be TRUE):
  1. Services carousel arrows on 820px and 360px point left (←) and right (→) in the correct directions
  2. The services carousel on 820px and 360px shows the right card fully without clipping
  3. Client logo strips on 820px fill the full viewport width with no visible endpoint
  4. The "что мы делаем" photo on 360px is visible (no missing image)
  5. Line-height in case cards (Режиссер / DOP rows) and funnel section text on 820px and 360px matches Figma — no text overlap
**Plans**: TBD
**UI hint**: yes

### Phase 4: Safari + Animations
**Goal**: All animations and transitions run identically in Safari and Chrome, and the cases scroll animation works correctly
**Depends on**: Phase 3
**Requirements**: SAFARI-01, SAFARI-02, ANI-01, ANI-02
**Success Criteria** (what must be TRUE):
  1. CSS transitions and animations on the site trigger and complete correctly in Safari (latest) without flickering or missing states
  2. Scroll-driven animations and sticky elements behave identically in Safari and Chrome
  3. The cases section scroll transition animates correctly (scroll-based case switching works without visual glitches)
  4. All site animations use smooth easing — no jarring jumps, flickers, or incorrect final states visible in either browser
**Plans**: TBD

### Phase 5: Pixel-Perfect Final Pass
**Goal**: Every visible section on all four breakpoints matches the Figma "Адаптивы актуальные" sheet at pixel level after Figma MCP sverka
**Depends on**: Phase 4
**Requirements**: PX-01, PX-02, PX-03, PX-04
**Success Criteria** (what must be TRUE):
  1. A Figma MCP sverka pass on 1440px finds no visual deviations beyond accepted tolerance
  2. A Figma MCP sverka pass on 1180px finds no visual deviations beyond accepted tolerance
  3. A Figma MCP sverka pass on 820px finds no visual deviations beyond accepted tolerance
  4. A Figma MCP sverka pass on 360px finds no visual deviations beyond accepted tolerance
**Plans**: TBD
**UI hint**: yes

### Phase 6: Testing
**Goal**: Key user journeys and components are covered by automated tests that will catch regressions in CI
**Depends on**: Phase 5
**Requirements**: TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. Playwright E2E tests cover form submission flow: field entry, checkbox toggle, and submit button state — and pass in CI
  2. Playwright multi-browser tests run against Safari and Chrome and pass for the main page load and carousel interactions
  3. Unit tests cover form validation functions (phone formatting, backspace handling, submit guard) and animation hooks
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Quick Wins + Stack Audit | 0/4 | Not started | - |
| 2. Desktop Layout (1440px + 1180px) | 0/TBD | Not started | - |
| 3. Mobile/Tablet Layout (820px + 360px) | 0/TBD | Not started | - |
| 4. Safari + Animations | 0/TBD | Not started | - |
| 5. Pixel-Perfect Final Pass | 0/TBD | Not started | - |
| 6. Testing | 0/TBD | Not started | - |
