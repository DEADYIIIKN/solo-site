# Requirements: SOLO Site — v1.1 Form Wiring & Modal Refactor

**Defined:** 2026-04-27
**Milestone Goal:** Заявки реально доходят до владельца + единая отправка из всех модалок без дублирования логики.

## v1.1 Requirements

### Form Submission (FUNC)

- [ ] **FUNC-01**: При успешной отправке формы данные доставляются во внешний канал (Telegram bot / n8n webhook / CRM — выбор endpoint обсуждается на discuss-phase)
- [ ] **FUNC-02**: При недоступности внешнего endpoint данные сохраняются локально (server-side fallback log / Payload Collection) — заявки не теряются
- [ ] **FUNC-03**: На клиенте после успешной отправки показывается success state (модалка / inline-сообщение); при ошибке — error state с возможностью retry
- [ ] **FUNC-04**: Защита от спама/повторных отправок: rate limiting на API route + client-side debounce submit-кнопки

### Modal Refactor (REFAC)

- [ ] **REFAC-01**: 5 файлов `first-screen-consultation-modal-{1440,1024,768,480,360}.tsx` унифицированы в один `ConsultationModalBase` компонент с per-breakpoint variants через props или CSS
- [ ] **REFAC-02**: Все 5 точек открытия модалки используют единый компонент; visual parity сохранена (Playwright `consultation-modal.spec.ts` проходит без правок)
- [ ] **REFAC-03**: Submit handler централизован — один источник правды для всех 5 контекстов вызова (header CTA, hero CTA, services CTA, etc.)

### Lead-Form Pixel Cleanup (LF)

- [ ] **LF-DRIFT-01**: Lead-form на 360px и 480px не имеет y-drift отклонения от Figma больше ±2px (закрыть D-19 carryover из v1.0)

### Testing (TEST — расширение покрытия)

- [ ] **TEST-04**: E2E spec покрывает submit happy path + error path (mock endpoint failure → user видит retry)
- [ ] **TEST-05**: Unit-тесты на server-side submit handler (валидация, rate-limit, fallback log)

## Out of Scope

| Feature | Reason |
|---|---|
| REFAC-02..04 (business-goals / services / shared types) | Большие рефакторинги — отложены в v1.2 «Tech Debt» |
| Footer blog secrets + consultation badge | Нужен дизайн badge + content strategy — отдельная feature-фаза |
| Cases 1440 ad-section gap (D-17) | Accepted design decision из v1.0 |
| Team 360 tagline wrap | Fundamental font-metrics issue, требует font swap |
| Carousel-services arrows e2e (999.1) | Триггер не наступил — каруселей в услугах нет |
| Полная переработка модалок (новый UX) | v1.1 — только унификация существующих, не редизайн |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FUNC-01 | TBD | Pending |
| FUNC-02 | TBD | Pending |
| FUNC-03 | TBD | Pending |
| FUNC-04 | TBD | Pending |
| REFAC-01 | TBD | Pending |
| REFAC-02 | TBD | Pending |
| REFAC-03 | TBD | Pending |
| LF-DRIFT-01 | TBD | Pending |
| TEST-04 | TBD | Pending |
| TEST-05 | TBD | Pending |

**Coverage:**
- v1.1 requirements: 10 total
- Mapped to phases: pending roadmap creation
- Unmapped: 10 (will be assigned by /gsd-new-milestone roadmapper)

---
*Requirements defined: 2026-04-27 (milestone v1.1 kickoff)*
