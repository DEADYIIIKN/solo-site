# Roadmap: SOLO Site

## Shipped Milestones

- ✅ **v1.0** (2026-04-22 → 2026-04-27) — Frontend Quality & Bug Fix · 6 phases / 27 plans · [archive](milestones/v1.0-ROADMAP.md)

## v1.1: Form Wiring & Modal Refactor — awaiting merge ([PR #5](https://github.com/DEADYIIIKN/solo-site/pull/5))

**Status:** ✅ All 3 phases complete (3/3). PR #5 ждёт merge → main.

- [x] **Phase 7: Modal Unification** ✅ 2026-04-27
- [x] **Phase 8: Form Submission** ✅ 2026-04-27
- [x] **Phase 9: Lead-Form Pixel Cleanup** ✅ 2026-04-27

## Current Milestone — v1.1.2: Growth & Ops

**Goal:** Дать пользователю канал подписки на TG (lead nurturing) + базовые admin-инструменты для работы с лидами.

**Status:** Planned (3 phases).

### Phases

- [ ] **Phase 10: TG Pop-up** — TG-01..04 + TEST-06/07: per-breakpoint pop-up уведомление о канале с 60s-trigger
- [ ] **Phase 11: Leads Admin List View** — ADMIN-01/02: custom columns + filter/sort
- [ ] **Phase 12: Leads CSV Export** — ADMIN-03: «Export to CSV» в leads list

### Phase Details

#### Phase 10: TG Pop-up
**Goal:** На сайте появляется pop-up с предложением подписаться на TG-канал после 60s активности. Per-breakpoint (5 brkp), dismiss → sessionStorage.
**Depends on:** v1.1 shipped (Phase 7 ConsultationModal pattern переиспользуется)
**Requirements:** TG-01, TG-02, TG-03, TG-04, TEST-06, TEST-07
**Figma:** 783:9762 (1440) / 783:9750 (?) / 783:9729 (?) / 783:9708 (?) / 783:9687 (?) — точное breakpoint mapping уточнится через Figma MCP
**Open questions resolved** (см. 10-CONTEXT.md):
- Activity detection: scroll/mousemove/keydown/touchstart/pointermove + idle 30s + visibility gate (D1)
- Silent skip когда NEXT_PUBLIC_TG_CHANNEL_URL пустой (D5)
- Компонент живёт в src/widgets/tg-popup/ (D6 — отдельная widget-директория)
**Success Criteria:**
1. Pop-up появляется ровно через 60s активности (timer + activity events)
2. Дизайн совпадает с Figma на всех 5 breakpoints (Figma MCP sverka на 1 брейкпоинте)
3. Dismiss через ✕ / overlay click / ESC; повторно не показывается до закрытия вкладки (sessionStorage)
4. Кнопка «Подписаться» открывает t.me/... в новой вкладке
5. Если `NEXT_PUBLIC_TG_CHANNEL_URL` не задана — pop-up НЕ инициализируется (silent skip)
6. E2E + unit покрывают timer / dismiss / sessionStorage
**Plans:** 4 plans
- [ ] 10-01-PLAN.md — useActivityTimer хук + unit тесты (TG-01 foundation, TEST-07)
- [ ] 10-02-PLAN.md — tg-popup-variants.ts + TgPopup base component (TG-02, TG-03, TG-04 UI)
- [ ] 10-03-PLAN.md — TgPopupHost integration + layout register + footer env-var refactor (TG-01..04 wiring)
- [ ] 10-04-PLAN.md — E2E spec для timer/dismiss/sessionStorage (TEST-06)

#### Phase 11: Leads Admin List View
**Goal:** В Payload admin → Заявки видны кастомные columns + filter/sort, не нужно открывать каждую запись.
**Depends on:** v1.1 shipped (Collection «leads» создан в Phase 8)
**Requirements:** ADMIN-01, ADMIN-02
**Success Criteria:**
1. Columns в list view: name, phone, source, contactMethod, forwardedToWebhook, createdAt
2. Sort по дате (default: newest first)
3. Filter по source (dropdown), forwardedToWebhook (3 states), createdAt (range или preset «сегодня/неделя/месяц»)
**Plans:** TBD (определит /gsd-plan-phase 11)

#### Phase 12: Leads CSV Export
**Goal:** Кнопка «Export to CSV» в leads list скачивает CSV (всех или filtered).
**Depends on:** Phase 11 (filter работает — exporter должен respect-ить filter state)
**Requirements:** ADMIN-03
**Success Criteria:**
1. Кнопка видна в leads list view (Payload custom view component)
2. Скачивает CSV-файл с колонками: id, name, phone, message, contactMethod, consent, source, forwardedToWebhook, webhookError, createdAt
3. Учитывает active filter (если применён)
4. UTF-8 BOM для корректного открытия в Excel русских букв
**Plans:** TBD (определит /gsd-plan-phase 12)

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

**Execution Order:** v1.1 (7→8→9) → ship → v1.1.2 (10 → 11 → 12, последовательно)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Modal Unification | 4/4 | Complete | 2026-04-27 |
| 8. Form Submission | 4/4 | Complete | 2026-04-27 |
| 9. Lead-Form Pixel Cleanup | 1/1 | Complete | 2026-04-27 |
| 10. TG Pop-up | 0/4 | Planned | - |
| 11. Leads Admin List View | 0/? | Planned | - |
| 12. Leads CSV Export | 0/? | Planned | - |

## Backlog

### Phase 999.1: carousel-services-arrows — extend e2e when carousel appears (BACKLOG)

**Goal:** Когда секция «Услуги» получит горизонтальную карусель (BUG-09/10 либо отдельная UX-задача), расширить `tests/e2e/carousel-services.spec.ts` проверкой arrows next/prev и смены слайдов на 360/480/820. Сейчас spec покрывает только smoke render + CTA, потому что каруселей в услугах нет ни на одном брейкпоинте.
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd-review-backlog when ready)
