# Requirements: SOLO Site

## v1.1 Requirements (shipped — awaiting merge in PR #5)

### Form Submission (FUNC)

- [x] **FUNC-01**: При успешной отправке формы данные доставляются во внешний канал (n8n webhook)
- [x] **FUNC-02**: При недоступности webhook'а данные сохраняются в Payload Collection «leads» — заявки не теряются
- [x] **FUNC-03**: На клиенте после успешной отправки показывается success state; при 5xx — inline error с retry
- [x] **FUNC-04**: Spam guard — in-memory per-IP rate-limit (10 req / 5 min) + client-side debounce 5s

### Modal Refactor (REFAC)

- [x] **REFAC-01**: 5 файлов consultation-modal унифицированы в один `ConsultationModal` компонент с variant lookup
- [x] **REFAC-02**: Все 5 точек открытия модалки используют единый компонент; visual parity сохранена
- [x] **REFAC-03**: Submit handler централизован

### Lead-Form Pixel Cleanup (LF)

- [x] **LF-DRIFT-01**: Lead-form на 360px и 480px y-drift ≤ ±2px от Figma (D-19 carryover из v1.0 closed)

### Testing (TEST)

- [x] **TEST-04**: E2E spec покрывает submit happy path + error path (mock 500 + silent webhook failure)
- [x] **TEST-05**: Unit-тесты на rate-limit + validation

---

## v1.1.2 Requirements

**Defined:** 2026-04-27
**Milestone Goal:** Дать пользователю канал подписки на TG (lead nurturing) + базовые admin-инструменты для работы с лидами.

### TG Pop-up (TG)

- [x] **TG-01**: На сайте появляется pop-up уведомление с предложением подписаться на TG-канал. Триггер: 60 секунд активности пользователя на сайте (page focused + scroll/mousemove activity).
- [x] **TG-02**: Pop-up использует per-breakpoint дизайн из Figma (783:9762 / 9750 / 9729 / 9708 / 9687 — 5 breakpoints). Реализован по тому же паттерну, что и `ConsultationModal` (variant lookup + base component).
- [x] **TG-03**: Pop-up dismiss-аем через крестик / клик по overlay / ESC. После dismiss — больше не показывается в этой сессии браузера (sessionStorage).
- [x] **TG-04**: Кнопка «Подписаться» открывает TG-канал в новой вкладке. URL берётся из env var `NEXT_PUBLIC_TG_CHANNEL_URL` (значение от пользователя). Если переменная пустая — pop-up НЕ показывается вообще (тихий fallback).

### Admin: Leads Management (ADMIN)

- [ ] **ADMIN-01**: В Payload admin → Заявки list view отображаются columns: name, phone, source, contactMethod, forwardedToWebhook, createdAt. Поля видны без открытия каждой записи.
- [ ] **ADMIN-02**: В leads list view доступен filter / sort: по дате (newest/oldest), по source, по forwardedToWebhook (yes/no/error).
- [ ] **ADMIN-03**: В leads list view есть кнопка «Export to CSV» — скачивает CSV-файл со всеми (или filtered) leads. Колонки: id, name, phone, message, contactMethod, consent, source, forwardedToWebhook, webhookError, createdAt.

### Testing (TEST)

- [x] **TEST-06**: E2E spec для TG pop-up: после 60s активности pop-up появляется → click «Подписаться» открывает t.me URL → click ✕ закрывает + sessionStorage установлен.
- [x] **TEST-07**: Unit-тест activity tracker (60s timer + activity detection: scroll/mousemove/keydown).

## Out of Scope (v1.1.2)

| Feature | Reason |
|---|---|
| Email уведомления о новом лиде | Пользователь сам сделает в n8n flow если захочет |
| Retry-queue для failed webhooks | Можно добавить в v1.3 reliability milestone |
| REFAC-02/03/04 (business-goals / services / shared types) | Нет forcing function, признано yak-shaving |
| Footer blog secrets + consultation badge | Нужен дизайн badge — отдельная feature-фаза |
| Cases 1440 ad-section gap (D-17) | Accepted design decision из v1.0 |
| Team 360 tagline wrap | Fundamental font-metrics, нужен font swap |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| TG-01 | 10 | Satisfied |
| TG-02 | 10 | Satisfied |
| TG-03 | 10 | Satisfied |
| TG-04 | 10 | Satisfied |
| ADMIN-01 | 11 | Pending |
| ADMIN-02 | 11 | Pending |
| ADMIN-03 | 12 | Pending |
| TEST-06 | 10 | Satisfied |
| TEST-07 | 10 | Satisfied |

**Coverage v1.1.2:**
- 9 requirements total
- Mapped to phases 10/11/12
- Unmapped: 0 ✓

---
*v1.1.2 Requirements defined: 2026-04-27*
