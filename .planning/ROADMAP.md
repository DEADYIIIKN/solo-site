# Roadmap: SOLO Site

## Shipped Milestones

- ✅ **v1.0** (2026-04-22 → 2026-04-27) — Frontend Quality & Bug Fix · 6 phases / 27 plans · [archive](milestones/v1.0-ROADMAP.md)

## Current Milestone — v1.1: Form Wiring & Modal Refactor

**Goal:** Заявки реально доходят до владельца + единая отправка из всех модалок без дублирования логики.

**Status:** Phase 7 + 8 complete (2/3). Phase 9 next.

### Phases

- [x] **Phase 7: Modal Unification** — REFAC-01: 5 consultation-modal → ConsultationModalBase ✅ 2026-04-27
- [x] **Phase 8: Form Submission** — FUNC-01..04 + TEST-04/05: n8n + Collection fallback + spam guard ✅ 2026-04-27
- [ ] **Phase 9: Lead-Form Pixel Cleanup** — LF-DRIFT-01: закрыть D-19 carryover (360/480 y-drift)

### Phase Details

#### Phase 7: Modal Unification (REFAC)
**Goal:** 5 идентичных файлов `first-screen-consultation-modal-{1440,1024,768,480,360}.tsx` сведены в один `ConsultationModalBase` без потери visual parity.
**Depends on:** v1.0 shipped
**Requirements:** REFAC-01, REFAC-02, REFAC-03
**Success Criteria:**
1. Существует один компонент `ConsultationModalBase` (либо одна модалка с per-breakpoint variants), используемый из всех 5 точек открытия
2. Playwright `consultation-modal.spec.ts` проходит без правок (visual / behavior parity)
3. Submit handler централизован — один callback prop / один внутренний хук
4. После рефакторинга нет дубликатов файлов `first-screen-consultation-modal-*.tsx` (либо они остаются как тонкие per-breakpoint обёртки над base)
**Plans:** TBD (определит /gsd-plan-phase 7)

#### Phase 8: Form Submission (FUNC)
**Goal:** Заявки реально доходят до владельца через выбранный канал; при сбое — сохраняются локально; пользователь видит честный success/error state.
**Depends on:** Phase 7 (один submit handler — проще обвязать FUNC-логикой)
**Requirements:** FUNC-01, FUNC-02, FUNC-03, FUNC-04, TEST-04, TEST-05
**Open questions** (решаются на discuss-phase):
- Endpoint: Telegram bot / n8n webhook / CRM API?
- Server route: Next.js API route + server action или только action?
- Persistence fallback: Payload Collection «leads» или append-only log?
- Rate limiting: in-memory (per-IP) или через Payload?
**Success Criteria:**
1. Submit happy path — заявка доставлена во внешний канал, success state показан пользователю
2. Endpoint отвалился — данные сохранены локально (Payload Collection или log), пользователь видит success (заявка не потеряна) либо retry-state (по решению на discuss)
3. Defense: client-side debounce + server-side rate limit (минимум — per-IP, конкретный лимит обсуждается)
4. E2E spec покрывает happy + failure-path (через mock endpoint)
5. Unit tests покрывают server-side handler (валидация, rate-limit, fallback)
**Plans:** 4 plans
- [ ] 08-01-PLAN.md — Payload Collection «leads» + миграция (FUNC-02)
- [ ] 08-02-PLAN.md — API route /api/leads: validate + rate-limit + Collection insert + n8n forward (FUNC-01/02/04)
- [ ] 08-03-PLAN.md — Заменить TODO в lead-form-fields.tsx на fetch /api/leads + debounce + error UI (FUNC-01/03/04)
- [ ] 08-04-PLAN.md — TEST-04 (E2E error path) + TEST-05 (unit rate-limit/validation)

#### Phase 9: Lead-Form Pixel Cleanup (LF)
**Goal:** Закрыть D-19 carryover из v1.0 — y-drift на 360/480 в shared `LeadFormFields` ≤ ±2px от Figma.
**Depends on:** Phase 8 (если submit handler перепишется — лучше делать pixel-tweaks после)
**Requirements:** LF-DRIFT-01
**Success Criteria:**
1. Y-coordinates всех элементов lead-form на 360px и 480px в пределах ±2px от Figma values из 05-SVERKA-REPORT
2. Phase 5 SVERKA не регрессит на других breakpoints (1440 / 1180 / 820)
3. E2E + visual spec на main подтверждают отсутствие сдвигов
**Plans:** 1 plan

Plans:
- [ ] 09-01-PLAN.md — targeted lead-form y-drift fix на 360/480 (discovery + fix + regression sverka)

## Progress

**Execution Order:** Phases 7 → 8 → 9 (sequential — каждая зависит от предыдущей)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Modal Unification | 4/4 | Complete | 2026-04-27 |
| 8. Form Submission | 4/4 | Complete | 2026-04-27 |
| 9. Lead-Form Pixel Cleanup | 0/1 | Planned | - |

## Backlog

### Phase 999.1: carousel-services-arrows — extend e2e when carousel appears (BACKLOG)

**Goal:** Когда секция «Услуги» получит горизонтальную карусель (BUG-09/10 либо отдельная UX-задача), расширить `tests/e2e/carousel-services.spec.ts` проверкой arrows next/prev и смены слайдов на 360/480/820. Сейчас spec покрывает только smoke render + CTA, потому что каруселей в услугах нет ни на одном брейкпоинте.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)
