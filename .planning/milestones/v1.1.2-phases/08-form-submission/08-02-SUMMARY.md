---
phase: 08-form-submission
plan: 02
subsystem: api / leads
tags: [api, route-handler, payload, n8n, webhook, rate-limit, validation]
requires:
  - "Payload Collection «leads» (08-01)"
provides:
  - "POST /api/leads endpoint"
  - "checkRateLimit(ip) helper"
  - "validateLeadInput(raw) hand-rolled guard"
  - "forwardLeadToWebhook(data) с AbortController(10s)"
affects:
  - "src/app/api/leads/route.ts (создан)"
  - "src/lib/leads/rate-limit.ts (создан)"
  - "src/lib/leads/validation.ts (создан)"
  - "src/lib/leads/forward-webhook.ts (создан)"
tech-stack:
  added: []
  patterns:
    - "Next.js 15 App Router Route Handler (POST в route.ts)"
    - "Payload Local API через getPayload({ config }) с alias @payload-config"
    - "In-memory rate-limit Map<ip, timestamps[]> (module-level)"
    - "AbortController + setTimeout для fetch timeout"
key-files:
  created:
    - src/app/api/leads/route.ts
    - src/lib/leads/rate-limit.ts
    - src/lib/leads/validation.ts
    - src/lib/leads/forward-webhook.ts
  modified: []
decisions:
  - "Hand-rolled validation вместо zod — пакет не установлен в репозитории; добавление dep ради одной schema избыточно (Rule 3 deviation)"
  - "Импорт payload config через alias @payload-config (а не @/payload.config) — это официальный Next.js Payload convention из tsconfig paths"
  - "Rate-limit срабатывает ДО save/forward (D3 compromise) — пользователь видит success-shape, но запись в Collection НЕ создаётся. Лучше тихо отбросить дубликаты, чем заваливать админку"
  - "При сбое payload.update (после успешного create) — НЕ фейлим ответ, только логируем. Заявка уже сохранена, потеря флага forwardedToWebhook не критична"
metrics:
  duration: ~10min
  tasks_completed: 3
  files_created: 4
  files_modified: 0
  completed_at: 2026-04-27
requirements_completed:
  - FUNC-01 (форвард в n8n с timeout + capture error)
  - FUNC-02 (always-save в Collection ДО форварда)
  - FUNC-04 (server-side rate-limit per IP)
---

# Phase 8 Plan 02: API route /api/leads — validate + rate-limit + save + forward — Summary

Реализован единственный endpoint submit'а лид-формы. По LOCKED архитектуре из 08-CONTEXT.md (D1-D4): POST /api/leads делает rate-limit → validate → save в Collection (FUNC-02 always-first) → forward в n8n webhook (FUNC-01) → пользователь всегда видит success при сохранённой заявке (D4).

## Архитектурный flow

```
Browser → POST /api/leads (Next.js Route Handler)
  ├─ getClientIp(req) — x-forwarded-for[0] → x-real-ip → "unknown"
  ├─ checkRateLimit(ip)
  │   └─ если !allowed → 200 {ok:true, accepted:false, reason:"rate-limit"} (D3)
  ├─ req.json() + validateLeadInput(body)
  │   └─ если !success → 400 {ok:false, errors:[...]}
  ├─ payload.create({ collection:"leads", data:{ ..., forwardedToWebhook:false, userIp:ip } })
  │   └─ catch → 500 {ok:false, error:"server"} (D4: единственный true error)
  ├─ forwardLeadToWebhook(data) — best-effort, AbortController(10s)
  │   ├─ ok → payload.update({ id, data:{ forwardedToWebhook:true } })
  │   └─ !ok → payload.update({ id, data:{ webhookError:err.message } })
  └─ 200 {ok:true, accepted:true, leadId}
```

## Что сделано

### Task 1 — Хелперы

**`src/lib/leads/rate-limit.ts`** (45 строк)

Module-level `Map<string, number[]>`, окно 5 минут, лимит 10 запросов. На каждый вызов фильтрует timestamps старше cutoff, добавляет текущий, проверяет длину. Возвращает `{ allowed, retryAfterMs? }`. Экспортирован `__resetRateLimit()` только для unit-тестов (08-04).

**`src/lib/leads/validation.ts`** (107 строк)

Hand-rolled guard вместо zod. Поля:

| Поле            | Правило                                                             |
| --------------- | ------------------------------------------------------------------- |
| `name`          | string, trim, 1..200 chars, required                                |
| `phone`         | string, проходит `isConsultationPhoneValid` (re-use из first-screen)|
| `message`       | string optional, ≤2000 chars                                        |
| `consent`       | литерал `true`                                                      |
| `contactMethod` | enum `"call" \| "telegram" \| "whatsapp"`                           |
| `source`        | string, trim, 1..50 chars                                           |

Возвращает discriminated union `{ success: true, data } | { success: false, errors }`. Все ошибки собираются в массив (не фейл-фаст) — UX дружелюбнее.

**`src/lib/leads/forward-webhook.ts`** (66 строк)

`fetch` к `process.env.N8N_WEBHOOK_URL`, `AbortController` + `setTimeout(controller.abort, 10_000)`. Body: `{ ...lead, timestamp: ISO }`. Если URL не задан — warn один раз через module-level `warnedMissingUrl` флаг + return `{ ok:false, error:"N8N_WEBHOOK_URL not configured" }`. Любая сетевая ошибка ловится в try/catch — не throw'ится наружу.

Commit: `31fa6b8`

### Task 2 — Route handler

**`src/app/api/leads/route.ts`** (104 строки)

Next.js 15 App Router Route Handler — экспорт `POST(req: Request): Promise<Response>`. Импорт payload config через alias `@payload-config` (из tsconfig paths). Пять стадий по архитектурному flow выше. Два важных нюанса:

- payload.create + payload.update → разные `getPayload({ config })` вызовы, потому что `getPayload` кеширует instance внутри (это тот же объект, не создаётся новое подключение каждый раз)
- Если `payload.update` после форварда упал — НЕ фейлим ответ, только `console.error`. Заявка уже сохранена, важнее не потерять контакт

Commit: `1cd1afb`

### Task 3 — `.env.example` (no-op)

Документация `N8N_WEBHOOK_URL` уже была добавлена в commit `74241e3` («chore(08): document N8N_WEBHOOK_URL env var in .env.example»), нет изменений в этом плане. Verify:

```
$ grep -q "N8N_WEBHOOK_URL" .env.example && echo OK
OK
```

## Verification

| Проверка                                                       | Результат                                  |
| -------------------------------------------------------------- | ------------------------------------------ |
| `tsc --noEmit` (через node_modules главного репо)              | ✅ exit 0, без ошибок                       |
| `src/app/api/leads/route.ts` существует, экспортирует POST     | ✅                                          |
| `src/lib/leads/{rate-limit,validation,forward-webhook}.ts`     | ✅ все три созданы                          |
| `.env.example` содержит N8N_WEBHOOK_URL                        | ✅                                          |
| Smoke curl POST /api/leads                                     | ⏳ требует pnpm dev + БД с применённой схемой; deferred — пользователь проверит после schema push (handoff 08-01) |

Smoke-тест не выполнен в worktree, потому что:
1. Worktree не имеет `node_modules` (нет установленных зависимостей)
2. Schema push для Collection «leads» — это checkpoint главного репо (см. 08-01-SUMMARY § Handoff)
3. После мерджа worktree → release/v1.1 → main + `PAYLOAD_DATABASE_PUSH=1 pnpm dev` пользователь может прогнать:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H 'Content-Type: application/json' \
     -d '{"name":"тест","phone":"+7 (900) 000-00-00","consent":true,"contactMethod":"call","source":"smoke"}'
   ```
   Ожидаемый ответ: `{"ok":true,"accepted":true,"leadId":...}`. Запись видна в `/admin` → группа «Заявки».

## Threat Model — Mitigations Applied

| Threat ID | Disposition | Где смягчено                                                              |
| --------- | ----------- | ------------------------------------------------------------------------- |
| T-08-01   | mitigate    | `validateLeadInput` отбрасывает любые поля кроме whitelist                |
| T-08-02   | mitigate    | `checkRateLimit` 10 req / 5 min per IP                                    |
| T-08-03   | accept      | `userIp` записан в Collection (sidebar), `access.read: () => true` для leads приемлем — Payload Local API авторизуется через session, фронт-чтения не существует |
| T-08-04   | accept      | Trust Traefik для x-forwarded-for; в worst case без прокси rate-limit работает как глобальный (ip="unknown" — все pop в один bucket) |
| T-08-05   | mitigate    | `AbortController` + 10s timeout в forwardLeadToWebhook                    |
| T-08-06   | accept      | timestamp + userIp + source в Collection — достаточно для дебага         |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Hand-rolled validation вместо zod**

- **Found during:** Task 1
- **Issue:** План указывал использовать zod (`import { z } from "zod"`), но zod отсутствует в `package.json` dependencies. Worktree не имеет установленного `node_modules`, поэтому `pnpm add zod` без эффекта (нечего обновлять). Добавление новой зависимости ради одной schema из 6 полей — overkill (плановое допущение в `<implementation_notes>`: «нет — добавь как dep, или ручной guard если zod overkill»).
- **Fix:** Реализован hand-rolled `validateLeadInput(raw): { success, data | errors }` с теми же правилами, что у `leadSchema`. Тип `LeadInput` экспортируется явно. Поведение эквивалентно zod safeParse: success-discriminated union, все ошибки собираются массивом.
- **Files modified:** `src/lib/leads/validation.ts`
- **Commit:** `31fa6b8`
- **Impact:** Никакого. tsc clean, типы экспортируются, behavior идентичен. Если позже понадобится zod — миграция тривиальна (signature совпадает).

**2. [Rule 3 — Blocking] Импорт payload config через `@payload-config`, не `@/payload.config`**

- **Found during:** Task 2
- **Issue:** План показывал `import config from "@/payload.config"`, но в `tsconfig.json` определён отдельный alias `"@payload-config": ["./src/payload.config.ts"]` — это официальный Payload Next.js convention.
- **Fix:** Использован `import config from "@payload-config"` — соответствует существующему паттерну проекта.
- **Files modified:** `src/app/api/leads/route.ts`
- **Commit:** `1cd1afb`

### Authentication Gates

Не возникали — endpoint публичный по дизайну (lead форма без login).

## Handoff (для пользователя)

После мерджа worktree:

1. Проверить, что schema push для Collection «leads» уже выполнен (handoff 08-01)
2. Задать `N8N_WEBHOOK_URL` в `.env.local` (если есть готовый n8n flow)
3. `pnpm dev` → проверить smoke curl выше
4. Без `N8N_WEBHOOK_URL`: smoke curl всё равно вернёт 200 + leadId, в Collection запись будет с `webhookError="N8N_WEBHOOK_URL not configured"` (это OK — D4)
5. Frontend интеграция (TODO на `lead-form-fields.tsx:213`) — отдельный план **08-03**

## Self-Check: PASSED

- ✅ `src/app/api/leads/route.ts` существует (104 строки, exports `POST`)
- ✅ `src/lib/leads/rate-limit.ts` существует (45 строк, exports `checkRateLimit`)
- ✅ `src/lib/leads/validation.ts` существует (107 строк, exports `validateLeadInput`, `LeadInput`)
- ✅ `src/lib/leads/forward-webhook.ts` существует (66 строк, exports `forwardLeadToWebhook`)
- ✅ Commit `31fa6b8` (helpers) присутствует в git log
- ✅ Commit `1cd1afb` (route) присутствует в git log
- ✅ `tsc --noEmit` clean (exit 0)
- ✅ `.env.example` содержит документированный `N8N_WEBHOOK_URL`
