---
phase: 08-form-submission
created: 2026-04-27
milestone: v1.1
discuss_mode: discuss (4 направленных вопроса через AskUserQuestion)
---

# Phase 8 — Form Submission: Decisions

**Goal:** Заявки доходят до владельца через n8n webhook + локальный fallback в Payload Collection. Rate limiting + спам-защита. Тестовое покрытие happy + failure path.

## User Decisions (locked)

### D1 — Endpoint: n8n webhook

**Choice:** Submit POST на n8n webhook URL.

**Why:** Гибкая автоматизация — n8n flow раскидывает заявку дальше (TG-уведомление + email + CRM в одном workflow), не лочит проект на одну CRM или один канал.

**Implications для researcher / planner:**
- Нужна env var: `N8N_WEBHOOK_URL` (передаётся в Docker через secrets, не коммитится)
- Webhook ожидает JSON shape: `{ name, phone, message, consent, contactMethod, source, timestamp }` (researcher уточнит финальный shape когда n8n flow будет готов — для MVP planner закладывает основные поля и оставляет shape расширяемым)
- Pre-pre-fly check на старте сервера (или first-request): warn если `N8N_WEBHOOK_URL` не задан, но НЕ падать — fallback в Collection всё равно работает

### D2 — Fallback: Payload Collection «leads»

**Choice:** Если webhook вернул не-2xx или timeout — заявка сохраняется в новую Payload Collection `leads`. Все заявки видны в admin UI, можно экспортировать.

**Why:** Видимость через admin UI > append-only log (не нужно SSH чтобы прочитать). Patterns для миграции Collection в проекте уже есть (`secrets-post.ts`, `cases-advertising.ts` etc.) — стоимость минимальная.

**Implications:**
- Новая Collection в `src/cms/collections/leads.ts` (модель тех же полей + meta: `forwardedToWebhook: boolean`, `webhookError?: string`, `createdAt`)
- Регистрация в `payload.config.ts` (рядом с существующими collections)
- Schema push необходим (`PAYLOAD_DATABASE_PUSH=1` cycle) — это checkpoint для пользователя если в проде используется persistent SQLite

### D3 — Rate limiting: in-memory per-IP + client debounce

**Choice:** Двухслойная защита:
1. **Server-side:** in-memory `Map<ip, [timestamp, ...]>` с TTL (10 запросов / 5 минут per IP). Сбрасывается при рестарте Docker — приемлемо для лендинга.
2. **Client-side:** disable submit-кнопку на 5с после клика (UX-debounce + защита от двойного клика).

**Why:** Battle-tested simple; persistent rate-limit (через Payload Collection) — overkill для текущего объёма (~10 заявок/день). 10 строк кода вместо 30+ с миграцией.

**Implications:**
- Module-level `Map` в API route — выживает пока процесс жив, обнуляется при HMR в dev (приемлемо)
- При hit limit: respond 429 + retry-after header (но D4 говорит UX пользователю не показывает ошибку — увидит generic «success» state, заявка не пойдёт)
- ⚠️ Конфликт с D4: rate-limited запрос НЕ сохраняется в Collection (это спам, не реальная заявка). Но D4 говорит «success» при сбое webhook'а. Resolution: rate-limit срабатывает ДО фактического сохранения — пользователь видит success state, но в Collection и в webhook ничего не уходит. Это compromise: лучше тихо отбросить дубликаты, чем заваливать админку.

### D4 — UX при сбое webhook'а: всегда success state

**Choice:** Если заявка попала в Collection (фолбек сработал) — пользователь видит обычный success modal. Никаких retry-button или error UI.

**Why:** «Не пугать клиента техническими проблемами» — заявка реально сохранилась, ты её увидишь в админке. Riski потери заявки нет (D2 покрывает).

**Implications:**
- API route returns 2xx во ВСЕХ случаях когда заявка хотя бы локально сохранилась
- 500 (true server error — БД упала и webhook упал) — единственный случай, когда показываем retry. Это критическая инфраструктурная проблема, fail-fast разумно.
- Rate-limit (429) НЕ показывается пользователю как ошибка — отображается success (см. D3 compromise)

## Codebase Scout

| Факт | Файл | Импликация |
|---|---|---|
| Submit handler уже централизован | `src/widgets/lead-form/ui/lead-form-fields.tsx:209-217` | Один TODO на 213. Этот же handler используется во ВСЕХ местах (header CTA, hero CTA, services CTA, lead-form section, 5 consultation modals) |
| Существующий паттерн Payload Collections | `src/cms/collections/{cases-advertising,cases-vertical,media,secrets-post,users}.ts` | Шаблон для `leads.ts` — глянуть `secrets-post.ts` (~simple shape) как best fit |
| Payload registered globals | `src/payload.config.ts:53` `globals: [SiteSettings, PrivacyPage]` | Новая Collection `leads` добавляется в `collections: [...]` (не globals) |
| Schema push toggle | `process.env.PAYLOAD_DATABASE_PUSH === "1"` (`payload.config.ts:25`) | Новая миграция требует pushing — нужен checkpoint в плане |
| API routes структура | `src/app/(payload)/api/...` (Payload routes) | Пользовательский API endpoint живёт отдельно: `src/app/api/leads/route.ts` (Next.js App Router convention, вне `(payload)` group) |
| `lead-form-fields.tsx` Form HTML | line 209: `<form onSubmit={...}>` | Submit handler — один. Замена TODO → fetch к `/api/leads`. |
| Test coverage exists | `tests/e2e/lead-form.spec.ts`, `tests/e2e/consultation-modal.spec.ts` | Happy path покрыт. TEST-04 требует расширить spec на error path (mock fetch failure → проверить, что user всё ещё видит success per D4) |

## Locked Architecture

```
Browser (lead-form-fields onSubmit)
  ↓ POST /api/leads
Next.js API route (src/app/api/leads/route.ts)
  ├─ rate-limit check (in-memory Map per-IP)
  │   └─ if exceeded: return 200 {ok: true, accepted: false, reason: "rate-limit"}
  │       (UX: success state per D4 compromise)
  ├─ validate payload (zod or hand-rolled — phone/name/consent required)
  │   └─ if invalid: return 400 (но client-side уже валидирует)
  ├─ save to Payload Collection "leads" (always-first, fallback if webhook fails)
  ├─ POST to N8N_WEBHOOK_URL (timeout 10s)
  │   ├─ if 2xx: mark Collection entry forwardedToWebhook=true
  │   └─ if fail: log webhookError to entry, but still 2xx response
  └─ return 200 {ok: true}

Browser:
  ├─ on 2xx: show success modal (existing flow)
  ├─ on 500: show error toast + retry button (rare — БД упала)
  └─ on network error: same as 500
```

## Open Questions → Resolved

| Question | Resolution |
|---|---|
| Куда отправлять? | n8n webhook (D1) |
| Что если webhook 5xx? | Payload Collection «leads» (D2) |
| Защита от спама? | In-memory per-IP + client debounce (D3) |
| UX при сбое webhook? | Success всегда, если заявка хоть локально сохранена (D4) |

## Open Questions для researcher (если возникнут)

- Нужен ли Cloudflare Turnstile / hCaptcha для дополнительной защиты от ботов? — на текущем масштабе нет, but flag для будущего
- Honeypot field в форме (скрытое поле, заполненное ботом → отбрасываем)? — простая мера, можно добавить если researcher найдёт паттерн в проекте, иначе пропускаем
- Хранить ли IP/User-Agent в Collection? — да (для рейт-лимит дебага в случае спам-атаки), но обрабатывать как PII (не показывать в публичных эндпоинтах)

## Deferred Ideas (вне Phase 8)

- **Captcha / Turnstile** — если появится реальный спам, отдельный фикс
- **Retry queue для failed webhooks** (cron / background job) — сейчас webhookError просто фиксируется в Collection, для retry можно отправить руками из админки
- **Analytics events** на submit — не входит в FUNC scope, потенциально v1.2
- **i18n для error messages** — сейчас RU only, проект и так RU-only

## Constraints для Researcher / Planner

**Researcher should investigate:**
- Точный shape API route в Next.js 15 App Router (Route Handlers — `route.ts` с `POST` export)
- Payload Collection schema syntax (см. `secrets-post.ts` как образец)
- Schema push workflow для новой Collection (нужен ли мануальный step / автомат через `PAYLOAD_DATABASE_PUSH=1`)
- Best practice для in-memory rate limit в Next.js (нюанс: один процесс или несколько в Docker scaled mode? — для текущего setup один)
- Тестирование fetch в Next.js API routes (Playwright + MSW? Vitest + msw? Простой `fetch.mockReturnValueOnce`?)
- env var management — где живёт `N8N_WEBHOOK_URL` (`.env.local` для dev, Docker secrets для прода)

**Planner should NOT re-ask user about:**
- Endpoint выбор (D1 locked)
- Fallback strategy (D2 locked)
- Rate limit подход (D3 locked)
- UX при сбое (D4 locked)

**Plans expected:**
1. **08-01:** Создать Payload Collection `leads` + schema push checkpoint + миграция БД
2. **08-02:** Создать API route `/api/leads` (validate + rate-limit + save → Collection + forward → webhook)
3. **08-03:** Заменить TODO в `lead-form-fields.tsx:213` на fetch к `/api/leads` + client-side debounce 5с + error handling
4. **08-04:** TEST-04 + TEST-05 — E2E spec error path (mock webhook failure), unit tests на rate-limit / validation / Collection insert

## Success Criteria (mirror to PLAN must-haves)

1. POST `/api/leads` принимает заявки, сохраняет в Payload Collection `leads`, форвардит в n8n
2. При недоступности webhook'а заявка всё равно сохраняется в Collection (видно в admin UI)
3. Rate limit отбрасывает дубликаты от одного IP (>10 за 5 мин)
4. Client-side: submit-кнопка отключается на 5с после клика
5. Пользователь всегда видит success state (если БД жива)
6. E2E happy path + error path (mock webhook failure) — passing
7. Unit tests на rate-limit, validation, Collection insert — passing
8. `N8N_WEBHOOK_URL` настраивается через env var, не коммитится в репо
