# Phase 1: Quick Wins + Stack Audit - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Исправить 3 UX-бага формы, которые блокируют реальных пользователей (FORM-01, FORM-02, FORM-03) + создать два документа аудита стека с чёткими рекомендациями (AUDIT-01, AUDIT-02). Никаких изменений вёрстки, никаких новых фич. Аудит — только документация, стек не меняется в этой фазе.

</domain>

<decisions>
## Implementation Decisions

### FORM-01: Ссылка на политику конфиденциальности

- **D-01:** Создать полноценную страницу `/privacy` в стиле сайта (шапка + футер), управляемую через Payload CMS.
- **D-02:** Страница создаётся с типовым заполнителем текста российской политики конфиденциальности — реальный текст редактируется через Payload позже.
- **D-03:** Страница должна быть обычной Next.js App Router страницей (`app/privacy/page.tsx`), данные тянутся из Payload (как существующие страницы).

### FORM-02: Чекбокс + ссылка на политику

- **D-04:** Клик по тексту «Политика конфиденциальности» открывает `/privacy` в **новой вкладке** (`target="_blank"`, `rel="noopener noreferrer"`). Чекбокс при этом **не переключается** — нужен `e.stopPropagation()` на ссылке.
- **D-05:** Клик по остальному тексту лейбла («Даю согласие на обработку...») переключает чекбокс как обычно.
- **D-06:** Реализуется через правильную HTML-структуру `<label>` + вложенная `<a>` с `stopPropagation`.

### FORM-03: Центровка текста кнопки

- **D-07:** Чистый CSS-фикс, без дополнительных решений — Claude на своё усмотрение.

### AUDIT-01: Next.js App Router vs React SPA

- **D-08:** Формат документа: сравнительная таблица (Next.js App Router vs React SPA) + обязательная чёткая рекомендация в конце.
- **D-09:** Документ сохраняется в `.planning/AUDIT-STACK.md`.
- **D-10:** Рекомендация должна быть конкретной: «Оставить Next.js» или «Мигрировать на SPA» с обоснованием.

### AUDIT-02: Библиотека анимаций

- **D-11:** Сравниваются три варианта: текущий (boneyard-js + CSS transitions), GSAP, Framer Motion.
- **D-12:** Формат документа: сравнительная таблица с колонками (критерий, boneyard+CSS, GSAP, Framer Motion) + чёткая рекомендация.
- **D-13:** Документ сохраняется в `.planning/AUDIT-ANIMATIONS.md`.
- **D-14:** Рекомендация должна учитывать Safari-баги из Фазы 4 (нынешний boneyard-js + CSS transitions проблематичны в Safari).

### Claude's Discretion

- FORM-03 (центровка кнопки) — выбор конкретного CSS-подхода на усмотрение.
- Структура Payload-коллекции для страницы `/privacy` (new collection vs pages collection) — на усмотрение, ориентируясь на существующие паттерны в проекте.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Форма и компоненты

- `src/widgets/lead-form/ui/lead-form-fields.tsx` — единый компонент полей формы, используется на всех брейкпоинтах; ссылка на `/privacy` на строке ~480, логика чекбокса тут же
- `src/widgets/footer/model/footer.data.ts` — данные футера (для понимания структуры shared-данных)

### Payload CMS

- `src/payload.config.ts` — конфигурация Payload, покажет как устроены существующие коллекции/страницы
- `app/` — структура Next.js App Router страниц проекта

### Существующие аналоги страниц

- `src/widgets/footer/ui/footer-1440.tsx` — содержит ссылку на политику, нужно обновить если URL меняется

### Roadmap (для контекста аудита)

- `.planning/ROADMAP.md` — Фаза 4 (Safari + Animations) зависит от результатов AUDIT-02
- `.planning/REQUIREMENTS.md` — требования AUDIT-01, AUDIT-02, FORM-01–03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `src/widgets/lead-form/ui/lead-form-fields.tsx` — единственный файл, который нужно изменить для FORM-01, FORM-02, FORM-03. Все брейкпоинты используют его через `LeadFormFieldsDensity`.
- `src/shared/ui/boneyard-skeleton.tsx` — текущая анимационная абстракция для аудита AUDIT-02.

### Established Patterns

- Breakpoint-per-file паттерн: каждый брейкпоинт — отдельный файл в `ui/`. Новая страница `/privacy` должна следовать этому паттерну если нужна адаптивная типографика.
- Данные сайта хранятся в Payload и фетчатся на уровне страницы — новая `/privacy` page должна делать то же самое.

### Integration Points

- `app/` — сюда добавляется `app/privacy/page.tsx`
- `src/widgets/lead-form/ui/lead-form-fields.tsx` строка ~480 — точка изменения ссылки

</code_context>

<specifics>
## Specific Ideas

- Страница `/privacy` должна управляться через Payload — контент редактируется без деплоя.
- Аудитные документы — это артефакты для команды, не для пользователей. Формат: Markdown-файлы в `.planning/`.
- AUDIT-02 должен явно упомянуть Safari-совместимость как критерий сравнения (это напрямую влияет на Фазу 4).

</specifics>

<deferred>
## Deferred Ideas

Нет — обсуждение оставалось в рамках скоупа Фазы 1.

</deferred>

---

*Phase: 01-quick-wins-stack-audit*
*Context gathered: 2026-04-22*
