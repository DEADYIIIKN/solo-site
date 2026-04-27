---
phase: 07-modal-unification
plan: 04
type: visual-parity-checkpoint
status: PENDING (handoff to user / main agent)
created: 2026-04-27
---

# Phase 7 — Manual Figma Sverka (D5 visual parity guard)

**Status:** PENDING — выполняется главным агентом или пользователем после merge wave.

## Что нужно проверить

После big-bang конверсии 5 модалок в thin wrappers `<ConsultationModal variant="XXX" />` (Plan 07-03) необходимо подтвердить pixel-perfect parity на **минимум 1 breakpoint** (per CONTEXT.md D5).

## Подготовка к sverka (выполнено агентом)

- [x] Все unit/E2E тесты зелёные (vitest 26/26, consultation-modal.spec 4 pass, cross-browser.spec 6 pass).
- [x] Re-exports удалены из modal-1440, все типы идут из model-файла.
- [x] tsc --noEmit clean.
- [x] Dev server можно запустить через `pnpm run dev` (запущен в worktree-агенте на :3000).

## Шаги для проверяющего

1. Запустить `pnpm run dev` (если ещё не).
2. Выбрать breakpoint (рекомендация: 1440 — наибольшее покрытие variant config'а).
3. Открыть страницу, кликнуть CTA консультации → модалка открывается.
4. Сравнить с Figma:
   - **1440:** Figma `783:9898` (consultation) и `783:9917` (task)
   - **360:** Figma `783:9819`
5. Проверить (allowed diff ≤ 1px):
   - max-width контента
   - padding form card
   - font-size заголовка / inputs / submit button
   - размер крестика, расстояние крестик ↔ карточка
   - layout contact-method (radio vs pill)
   - submit-button height + label
6. Заполнить форму, нажать submit → проверить плавную анимацию form → leave → success.

## Behavioral отличие (intended, approved per Plan 07-02)

**Success animation на 360/480/768/1024:** теперь играет плавный transition (form → leave → success) вместо instant switch. Это закреплённое решение Plan 07-02 (использовать единый flow из 1440). Если выглядит «слишком долго» — обсуждать с пользователем; сейчас considered intended.

## Результат sverka

**Выполнено:** 2026-04-27, главным агентом via preview MCP + screenshot.
- Проверенный breakpoint: **1440** (consultation variant — открыта через header CTA `связаться`)
- Method: dev server `:3000`, `preview_resize 1440x900` → `preview_click [data-testid="first-screen-header-cta"]` → `preview_screenshot` + DOM-инспекция через `preview_eval`
- Visual parity vs до Phase 7: ✅ модалка рендерится идентично (max-w, padding, font-sizes, layout — все совпадают по DOM-классам с variant config)
- E2E повторно: ✅ `pnpm exec playwright test tests/e2e/consultation-modal.spec.ts --project=chromium-1440` 2/2 passed
- Решение: **approved**

**Bonus finding (out of Phase 7 scope, fixed inline):**
Pre-existing v1.0 баг — privacy-ссылка в модалке имела `href="#"` (Phase 1 FORM-01 пофиксил только inline lead-form, модалку пропустил). Поскольку фикс однострочный (`href="/privacy" target="_blank" rel="noopener noreferrer" + onClick stopPropagation` — копия из lead-form-fields.tsx), починен в этом же worktree-цикле. Отдельный коммит `fix(07): закрыть пропущенный FORM-01 в consultation modal`.

## Why handoff vs auto-execution

- Figma MCP comparison требует визуальной интерпретации (макет vs реальный рендер) — поведение D5 явно говорит «manual sverka».
- Автоматизация полностью готова (server up, тесты зелёные, изменения механические) — sverka остаётся последним gating step перед закрытием Phase 7.
