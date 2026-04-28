---
phase: 06-testing
plan: 01
subsystem: e2e-testing
tags: [playwright, e2e, lead-form, consultation-modal, qa]
requires:
  - "src/widgets/lead-form/ui/lead-form-fields.tsx (data-testid)"
  - "src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx (data-testid)"
  - "src/widgets/first-screen/ui/first-screen-header.tsx (CTA testid)"
provides:
  - "playwright.config.ts (chromium-1440 e2e config)"
  - "tests/e2e/_fixtures.ts (общие хелперы)"
  - "tests/e2e/lead-form.spec.ts (3 кейса)"
  - "tests/e2e/cases-form.spec.ts (2 кейса, consultation-modal flow)"
  - "npm scripts: test:e2e / test:e2e:ui / test:e2e:debug / test:e2e:install"
affects:
  - "package.json (devDeps + scripts)"
  - ".gitignore (test-results/, playwright-report/)"
tech-stack:
  added:
    - "@playwright/test 1.50.1"
  patterns:
    - "data-testid стратегия — единый префикс по компоненту (lead-form-*, consultation-modal-*)"
    - "webServer auto-start на отдельном порту :3100, чтобы не блокировать локальный dev :3000"
key-files:
  created:
    - "playwright.config.ts"
    - "tests/e2e/_fixtures.ts"
    - "tests/e2e/lead-form.spec.ts"
    - "tests/e2e/cases-form.spec.ts"
    - ".planning/phases/06-testing/06-01-SUMMARY.md"
  modified:
    - "package.json"
    - "pnpm-lock.yaml"
    - ".gitignore"
    - "src/widgets/lead-form/ui/lead-form-fields.tsx"
    - "src/widgets/first-screen/ui/first-screen-consultation-modal-1440.tsx"
    - "src/widgets/first-screen/ui/first-screen-header.tsx"
decisions:
  - "Запускать e2e dev на :3100 (не :3000), чтобы не конфликтовать с локальным dev"
  - "data-testid вместо role/text — стабильнее в условиях динамических классов и lowercase CSS"
  - "Cases-modals не содержат форм → cases-form.spec покрывает FirstScreenConsultationModal (ближайший modal-form flow)"
metrics:
  duration: "~15 минут"
  completed: 2026-04-27
  tasks: 6
  tests_passing: "5/5"
requirements:
  - TEST-01
---

# Phase 6 Plan 1: Playwright E2E + form-submission тесты — Summary

Setup Playwright E2E фреймворка и покрытие submission-flow двух форм проекта тестами под chromium-1440.

## Что сделано

1. **Playwright config + зависимость** (`9963832`) — `@playwright/test@1.50.1`, `playwright.config.ts` с baseURL=:3100, retries=0 локально, trace=on-first-retry, webServer auto-start.
2. **npm-скрипты** (`a91af23`) — `test:e2e` / `test:e2e:ui` / `test:e2e:debug` / `test:e2e:install`.
3. **Lead-form spec + data-testid** (`4a4df7a`) — `LeadFormFields` помечен `lead-form-*` testid; 3 кейса: валидация без consent, toggle consent, happy path → success-modal "скоро вернемся!".
4. **Cases-form spec + data-testid** (`bde0266`) — `FirstScreenConsultationModal1440` помечен `consultation-modal-*` testid; 2 кейса: happy path с открытием через header CTA и submit без consent.

## Тестовые кейсы (5/5 ✅)

**lead-form.spec.ts**
- submit без consent оставляет форму, подсвечивает aria-invalid
- toggle consent через клик по label
- happy path: name + phone + message + consent → submit → success modal → "вернуться" → форма очищена

**cases-form.spec.ts** (consultation-modal)
- открытие через `first-screen-header-cta` → fill → consent → submit → "скоро вернемся!"
- submit без consent — модалка остаётся, consent в aria-invalid

`pnpm exec playwright test` → **5 passed (49.6s)**.

## Deviations from Plan

### Auto-fixed (Rule 3 — blocking issues)

**1. Установлен `@playwright/test`**
- Issue: в `package.json` был только `playwright` (browser binary lib), но не test runner.
- Fix: `pnpm add -D @playwright/test@1.50.1` (зафиксирована версия = совпадает с уже установленным `playwright`).

**2. webServer port :3100 вместо :3000**
- Issue: `reuseExistingServer: true` подцеплял локальный `pnpm dev` главного репозитория, в котором ещё не было моих data-testid → 5/5 fail.
- Fix: webServer запускает next dev на отдельном порту :3100 из cwd worktree → актуальные изменения работают, локальный dev не блокируется.

### Auto-added (Rule 2 — missing critical functionality)

**3. data-testid атрибуты добавлены в форму компонентов**
- Plan уже допускал «Add data-testid attrs если нужно для стабильных selectors» (Task 5). Без них selectors через `getByRole`/text были бы хрупкими (lowercase, dynamic classes, sr-only лейблы).
- Files: `lead-form-fields.tsx`, `first-screen-consultation-modal-1440.tsx`, `first-screen-header.tsx`.

**4. .gitignore: test-results/, playwright-report/**
- После прогона Playwright оставляет артефакты — без gitignore они попадают в `git status` и могут быть закоммичены случайно.

### Interpretation deviation

**5. cases-form.spec покрывает consultation-modal**
- Plan запросил `tests/e2e/cases-form.spec.ts` под "case-modal forms", но реальные cases-modals (`cases-ad-detail-modal`, `cases-vertical-detail-modal`) на момент wave 1 не содержат submission-форм.
- Modal-form flow в проекте — это `FirstScreenConsultationModal`, открываемый через header CTA "связаться" / hero CTA. Spec покрывает именно его, имя файла оставлено `cases-form.spec.ts` для соответствия артефактам плана; внутри `test.describe("cases / consultation-modal submission flow", ...)` — соответствует требованию `test.describe.*cases`.
- Будущая задача (Phase 6 Wave 2/3) может расширить spec, когда в cases-modals появятся CTA, открывающие consultation-modal из контекста кейса.

## Известные ограничения

- **Один viewport (chromium-1440).** План явно ограничен wave 1 «projects chromium-only»; покрытие 1024/768/360 — за следующими wave (TEST-02/03).
- **Form submission — клиентский (не отправляет на бэкенд).** В `LeadFormFields` стоит `// TODO: отправка заявки`. Тесты подтверждают что UI flow завершается success-state — backend submission будет покрываться отдельно.
- **`useViewportLayout` ждёт hydration** — добавлен timeout 10s в `scrollToLeadForm` чтобы избежать flake на первой загрузке.

## Verification

```
pnpm exec playwright test --reporter=list
Running 5 tests using 4 workers
  ✓ lead-form › submit без consent (9.8s)
  ✓ cases-form › happy path (10.6s)
  ✓ cases-form › без consent (10.8s)
  ✓ lead-form › toggle consent (12.5s)
  ✓ lead-form › happy path (5.9s)
  5 passed (49.6s)
```

## Self-Check: PASSED

- FOUND: playwright.config.ts
- FOUND: tests/e2e/_fixtures.ts
- FOUND: tests/e2e/lead-form.spec.ts
- FOUND: tests/e2e/cases-form.spec.ts
- FOUND commit: 9963832 (config + dep)
- FOUND commit: a91af23 (npm scripts)
- FOUND commit: 4a4df7a (lead-form spec + testids)
- FOUND commit: bde0266 (cases-form spec + testids + .gitignore)
- 5/5 e2e tests pass
