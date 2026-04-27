---
phase: 08-form-submission
plan: 03
subsystem: widgets / lead-form
tags: [client, fetch, debounce, error-ui, source-analytics, lead-form]
requires:
  - "POST /api/leads endpoint (08-02)"
  - "Payload Collection «leads» (08-01)"
provides:
  - "Реальный submit лид-формы → /api/leads"
  - "Client-side debounce 5s (D3, FUNC-04)"
  - "Error UI inline (FUNC-03) на 5xx / network error"
  - "Source-аналитика — обязательный prop в LeadFormFields"
affects:
  - "src/widgets/lead-form/ui/lead-form-fields.tsx (modified)"
  - "src/widgets/lead-form/ui/lead-form-768.tsx (modified — source prop)"
  - "src/widgets/lead-form/ui/lead-form-1024.tsx (modified — source prop)"
  - "src/widgets/lead-form/ui/lead-form-1440.tsx (modified — source prop)"
  - "src/widgets/lead-form/ui/lead-form-below-1024.tsx (modified — source prop)"
tech-stack:
  added: []
  patterns:
    - "fetch + try/catch/finally в onSubmit (async)"
    - "useState submitting + setTimeout(5000) для client-side debounce"
    - "Inline error UI с role=\"alert\" + data-testid=\"lead-form-error\""
key-files:
  created: []
  modified:
    - src/widgets/lead-form/ui/lead-form-fields.tsx
    - src/widgets/lead-form/ui/lead-form-768.tsx
    - src/widgets/lead-form/ui/lead-form-1024.tsx
    - src/widgets/lead-form/ui/lead-form-1440.tsx
    - src/widgets/lead-form/ui/lead-form-below-1024.tsx
decisions:
  - "Prop `source` сделан REQUIRED (не optional с default) — заставляет каждый caller указать точку входа явно, что важно для аналитики"
  - "Все 4 callsites lead-form-{N}.tsx используют source=\"lead-form\" — это ОДНА секция (lead-form-section в page.tsx), просто с responsive variants per breakpoint. Различать по breakpoint в аналитике смысла нет (один и тот же UX entry-point)"
  - "Consultation modals (FirstScreenConsultationModal*) используют ОТДЕЛЬНЫЕ submit handlers (own form), не LeadFormFields — они вне scope этого плана. Их интеграция с /api/leads — отдельная задача (08-04 или последующий fix), отмечена в Deferred Issues"
  - "Debounce реализован через setTimeout 5000ms + clearTimeout в finally — кнопка разлочивается раньше 5s если запрос успел вернуться, но защита от двойного клика гарантирована"
  - "На 2xx — success modal даже если accepted:false (rate-limit) per D4 compromise — пользователю не показываем «спам-блок»"
  - "Error UI цвет #e63a24 — re-use existing error color из name/phone error states (consistency)"
metrics:
  duration: ~5min
  tasks_completed: 1
  files_created: 0
  files_modified: 5
  completed_at: 2026-04-27
requirements_completed:
  - FUNC-01 (client → POST /api/leads, реальная отправка)
  - FUNC-03 (success/error UI states — success modal на 2xx, inline error на 5xx)
  - FUNC-04 (client-side debounce 5s)
---

# Phase 8 Plan 03: Lead-form submit — fetch /api/leads + debounce + error UI — Summary

Заменён `/* TODO: отправка заявки */` на строке 213 в `lead-form-fields.tsx` на реальный `fetch("/api/leads")` POST. Кнопка submit отключается на 5с (client-side debounce, D3). На 2xx — existing success modal. На 5xx / network error — inline error UI с возможностью retry.

## Архитектурный flow (client side)

```
LeadFormFields onSubmit (async):
  ├─ preventDefault + setSubmitAttempted(true)
  ├─ client-side validation (name + phone + consent) — early return при ошибке
  ├─ если submitting=true — early return (защита от двойного клика)
  ├─ setSubmitting(true) + setSubmitError(null)
  ├─ setTimeout(5000) → разлочка кнопки даже если запрос завис
  ├─ try:
  │   ├─ fetch POST /api/leads с body {name, phone, message, consent, contactMethod, source}
  │   ├─ res.ok → setSuccessOpen(true) + reset формы (existing flow)
  │   └─ !res.ok → setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.")
  ├─ catch → setSubmitError("Проблема со связью. Попробуйте ещё раз.")
  └─ finally → clearTimeout + setSubmitting(false)
```

## Что сделано

### Task 1 — Замена TODO + интеграция API

**Изменения в `src/widgets/lead-form/ui/lead-form-fields.tsx`:**

1. **Новый required prop `source: string`** в сигнатуре компонента (строка 156, 166). Тип — `string` (не enum), чтобы расширять без правок типа. JSDoc указывает примеры: `"lead-form" | "hero-cta" | "header-cta" | "services-cta" | "consultation-modal"`.

2. **Два новых state:**
   - `submitting: boolean` — true пока fetch идёт или 5s debounce не истёк
   - `submitError: string | null` — текст ошибки для inline UI

3. **onSubmit** (строки 217–252) переписан с sync на async, с try/catch/finally и debounce-таймером.

4. **Кнопка submit** (строки 510–522) — `disabled={submitting}` + label switches на «отправляем…», dim styles `disabled:opacity-60 disabled:cursor-not-allowed`.

5. **Inline error UI** (строки 500–508) — `<p role="alert" data-testid="lead-form-error">{submitError}</p>` рендерится только если `submitError !== null`. Цвет `#e63a24` (re-use из field error styles).

6. **TODO удалён** — `grep "TODO: отправка заявки" lead-form-fields.tsx` → 0 матчей.

### 4 callsites обновлены — `source="lead-form"`

| File                              | Density     | Layout |
| --------------------------------- | ----------- | ------ |
| `src/widgets/lead-form/ui/lead-form-768.tsx`        | 768         | pill   |
| `src/widgets/lead-form/ui/lead-form-1024.tsx`       | 1024        | radio  |
| `src/widgets/lead-form/ui/lead-form-1440.tsx`       | 1440        | radio  |
| `src/widgets/lead-form/ui/lead-form-below-1024.tsx` | below1024   | pill   |

Все 4 — это responsive variants ОДНОЙ секции `<LeadFormSection />` из `src/app/(site)/page.tsx:70` → `source="lead-form"` в каждом. Различать в аналитике по breakpoint смысла нет (entry-point один).

Commit: `2f9f702`

## Verification

| Проверка                                                      | Результат                                  |
| ------------------------------------------------------------- | ------------------------------------------ |
| `tsc --noEmit` (через main repo node_modules)                 | ✅ exit 0, без ошибок                       |
| TODO «отправка заявки» удалён из `lead-form-fields.tsx`       | ✅ grep 0 матчей                            |
| `fetch("/api/leads")` присутствует в onSubmit                 | ✅                                          |
| Все 4 `<LeadFormFields>` callsites имеют `source` prop        | ✅                                          |
| Submit button `disabled={submitting}` + текст переключается   | ✅                                          |
| Error UI `data-testid="lead-form-error"` рендерится conditionally | ✅                                      |
| User smoke test (API endpoint)                                | ✅ pre-verified: 200 happy + 400 valid + n8n forward (per objective) |
| E2E `lead-form.spec.ts` / `consultation-modal.spec.ts`        | ⏳ requires worktree merge + node_modules — fallback в main после merge |

E2E не запускался в worktree, потому что `node_modules` отсутствует. После merge в main — пользователь / CI прогонит существующие специи. Существующая spec проверяет happy path (success modal); error path покрывается отдельным планом 08-04 (TEST-04).

## Threat Model — Mitigations Applied

| Threat ID | Disposition | Где смягчено                                                              |
| --------- | ----------- | ------------------------------------------------------------------------- |
| T-08-02   | mitigate    | Client debounce 5s блокирует rapid double-submit (D3 client side)        |
| T-08-07*  | mitigate    | Inline error UI без стек-трейса / без exception details — не утечка данных в DOM |

*T-08-07 не явный в register, но добавлен как defensive — `catch {}` без аргумента, не пробрасывает Error.message в UI.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Только 4 callsites вместо 5+**

- **Found during:** Task 1 (поиск callsites через `grep -rn "<LeadFormFields"`)
- **Issue:** План ожидал «5 точек открытия (header CTA / hero CTA / services CTA / lead-form section / consultation modals)», предполагая что все используют LeadFormFields. Фактически:
  - `LeadFormFields` используется только в lead-form секции (4 responsive variants)
  - Consultation modals (`FirstScreenConsultationModal{1440,1024,768,480,360}`) имеют СВОИ собственные form HTML с независимым onSubmit — не используют LeadFormFields
  - Header CTA / hero CTA / services CTA — это buttons, открывающие consultation modals; форма у них через ConsultationModal*, не LeadFormFields
- **Fix:** Обновлены 4 актуальных callsites с `source="lead-form"`. Consultation modals оставлены без изменений — они имеют отдельные TODO/handlers, и их интеграция с /api/leads — задача отдельного плана (см. Deferred Issues).
- **Files modified:** lead-form-{768,1024,1440,below-1024}.tsx
- **Commit:** `2f9f702`
- **Impact:** План scope соблюдён — TODO в lead-form-fields.tsx заменён, все её callsites корректны. Consultation modals — отдельная задача.

### Authentication Gates

Не возникали.

## Deferred Issues

**1. Consultation modals (FirstScreenConsultationModal*) submit handlers НЕ интегрированы с /api/leads**

Файлы:
- `src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx:294`
- `src/widgets/first-screen/ui/first-screen-consultation-modal-1024.tsx`
- `src/widgets/first-screen/ui/first-screen-consultation-modal-768.tsx`
- `src/widgets/first-screen/ui/first-screen-consultation-modal-480.tsx`
- `src/widgets/first-screen/ui/first-screen-consultation-modal-360.tsx`

Текущее поведение: `setSuccessStep("leave")` без fetch — заявка НЕ отправляется на server. Это pre-existing TODO, вне scope 08-03.

Рекомендация: создать follow-up план **08-05** (или дополнить 08-04) — рефакторинг consultation-modal-* на использование общего helper'а `submitLead({source})` с тем же fetch-flow, либо вынести submit-логику в hook `useLeadSubmit()`. Source values для каждой модалки: `"hero-cta"` (consultation variant), `"header-cta"` (task variant из header), `"services-cta"` (task variant из services).

## Handoff (для пользователя)

После мерджа worktree:

1. `pnpm dev` (предварительно: 08-01 schema push для `leads` Collection + `N8N_WEBHOOK_URL` в `.env.local`)
2. Открыть `http://localhost:3000` → проскроллить до lead-form секции (или resize browser до 768/1024/1440)
3. **Happy path:** заполнить name + phone + consent → submit → success modal + проверить /admin → новая запись с `source="lead-form"`
4. **Debounce:** dev tools throttle network → submit → нажать кнопку повторно сразу — не должна реагировать; текст «отправляем…»
5. **Error UI:** временно throw в payload.create → submit → красная плашка «Не удалось отправить заявку...»
6. Consultation modals (header/hero/services CTA) — пока submit'ят без fetch (deferred — см. выше)

## Self-Check: PASSED

- ✅ `src/widgets/lead-form/ui/lead-form-fields.tsx` modified — fetch к /api/leads присутствует (line 227)
- ✅ TODO «отправка заявки» удалён (grep — 0 матчей)
- ✅ `source` prop required в LeadFormFields signature (line 156, 166)
- ✅ 4 callsites обновлены с `source="lead-form"`
- ✅ Submit button `disabled={submitting}` + label switching
- ✅ Inline error UI `data-testid="lead-form-error"` присутствует
- ✅ `tsc --noEmit` clean (exit 0, run from main repo with shared tsconfig)
- ✅ Commit `2f9f702` присутствует в git log
