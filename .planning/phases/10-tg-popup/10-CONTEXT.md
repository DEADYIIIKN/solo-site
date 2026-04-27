---
phase: 10-tg-popup
created: 2026-04-27
milestone: v1.2
discuss_mode: discuss (4 направленных вопроса через AskUserQuestion + Figma node-ids от пользователя)
---

# Phase 10 — TG Pop-up: Decisions

**Goal:** На сайте появляется pop-up уведомление с предложением подписаться на TG-канал после 60s активности пользователя. Per-breakpoint дизайн (5 вариантов из Figma). Реализован по тому же паттерну, что и `ConsultationModal` (variant lookup + base component).

## User Decisions (locked)

### D1 — Trigger: 60 секунд активности на сайте

**Choice:** Pop-up появляется когда пользователь был **активен** на сайте 60 секунд.

**Activity definition (locked, sane defaults):**
- Активность = любое из событий: `scroll`, `mousemove`, `keydown`, `touchstart`, `pointermove`
- Не активность = idle (нет событий 30+ секунд) или page hidden (`document.visibilityState === "hidden"`)
- Таймер: накопительный — считает только время активности (idle / hidden НЕ засчитывается)

**Implication:** реализуется через `useEffect` хук + `setInterval` 1s tick + activity listeners. После 60 секунд накопленной активности — открыть pop-up.

### D2 — Frequency: один раз за сессию браузера (sessionStorage)

**Choice:** После показа (или dismiss) pop-up в текущей вкладке/сессии больше не появляется. `sessionStorage.setItem("tg-popup-dismissed", "1")`.

**Why:** sessionStorage сбрасывается при закрытии вкладки. Если юзер закрыл вкладку и вернулся через час — увидит снова. Менее навязчиво чем «один раз навсегда» (localStorage), но не спамит каждый reload.

**Implication:** перед запуском timer'а проверить `sessionStorage.getItem("tg-popup-dismissed")` — если есть, не запускать timer вообще.

### D3 — Design: per-breakpoint Figma макеты (5 нод)

**Choice:** Реализовать по тому же паттерну, что и `ConsultationModal` в Phase 7 — единый `TgPopup` компонент с `variant: "1440" | "1024" | "768" | "480" | "360"` и lookup table `tg-popup-variants.ts`.

**Figma node-ids от пользователя:**
- `783:9762`
- `783:9750`
- `783:9729`
- `783:9708`
- `783:9687`

**TODO для researcher (через Figma MCP):**
- Открыть каждый node-id и определить, какому breakpoint он соответствует (1440 / 1024 / 768 / 480 / 360)
- Извлечь точные значения: width / max-width / padding / heading font-size / body font-size / button height / icon sizes / colors
- Запонить variant lookup table

### D4 — Content: «Подписаться на TG-канал»

**Choice:** Содержимое pop-up'а — по Figma макету. Логически ожидается:
- Заголовок (что-то типа «Подписывайтесь на наш TG-канал» или название канала)
- 1-2 строки обоснования / preview контента
- Кнопка «Подписаться» (или «Открыть канал») → external link на `t.me/...` в новой вкладке
- Крестик ✕ в углу для dismiss

**Если в Figma больше деталей** (preview постов, фото канала, bullets) — researcher отрефлексирует это в variant config.

### D5 — TG channel URL: env var `NEXT_PUBLIC_TG_CHANNEL_URL`

**Choice:** URL подсасывается из `process.env.NEXT_PUBLIC_TG_CHANNEL_URL`. Если переменная пустая или не задана — pop-up **НЕ показывается вообще** (silent skip — даже timer не запускается).

**Default value (от пользователя):** `https://t.me/soloproduction` (тот же URL, что в footer hardcoded в 5 местах). Зашит в `.env.local` (gitignored), placeholder в `.env.example`.

**Implication:**
- Pop-up не доступен в SSR/RSC (нужен `"use client"` boundary с проверкой env)
- Сначала проверка env var → потом sessionStorage check → потом timer setup
- Если URL пустой в проде — никаких побочных эффектов, no DOM

**Bonus refactor opportunity:** Footer-{1440,1024,768,480,360}.tsx сейчас имеют hardcoded `https://t.me/soloproduction`. Phase 10 МОЖЕТ заменить эти 5 hardcode'ов на чтение из той же env var. Но это **не обязательно** — отметить как opt-in micro-task в плане.

### D6 — Reuse modal pattern: НЕ выносить shared base сейчас

**Choice:** `TgPopup` создаётся как отдельный компонент с собственной variant lookup table и собственным `<dialog>`-like overlay. **НЕ** пытаться извлечь shared `ModalBase` из `ConsultationModal` сейчас.

**Why:** ConsultationModal имеет специфичную логику (form-state, success-step animation, submit handler). TG-popup проще (no form, just CTA). Извлечение shared base = yak-shaving при двух модалках. Если появится третья — рассмотрим в v1.3.

**Implication:** TG-popup может скопировать структурные паттерны из ConsultationModal (overlay, transition, dismiss handlers, ESC + click outside) — но как код, не через shared base.

## Codebase Scout

| Факт | Файл | Импликация |
|---|---|---|
| TG URL hardcoded в 5 footer'ах | `src/widgets/footer/ui/footer-{1440,1024,768,480,360}.tsx` | Bonus: можно заменить на env var в Phase 10 (opt-in) |
| ConsultationModal паттерн | `src/widgets/first-screen/ui/consultation-modal.tsx` + `consultation-modal-variants.ts` | Шаблон для TgPopup структуры — overlay, transition, dismiss, ESC, variant lookup |
| `useViewportLayout()` хук | `src/shared/lib/use-viewport-layout.ts` | Используется для гейтинга per-breakpoint компонентов — TgPopup тоже использует |
| activity hooks в проекте | grep — пока нет | Создать `useActivityTimer(seconds, onElapsed)` в `src/shared/lib/` |
| sessionStorage не используется в проекте | grep — нет | Простой паттерн `useState(() => sessionStorage.getItem("..."))` + защита `typeof window !== "undefined"` |

## Locked Architecture

```
<TgPopupHost> (renders in app/(site)/layout.tsx — глобально)
  ├─ early return if NEXT_PUBLIC_TG_CHANNEL_URL пустой
  ├─ early return if sessionStorage["tg-popup-dismissed"] === "1"
  ├─ useViewportLayout() → variant
  ├─ useActivityTimer(60_000, () => setOpen(true))
  │   ├─ event listeners: scroll/mousemove/keydown/touchstart
  │   ├─ document.visibilityState gate
  │   └─ accumulator timer (1s tick)
  └─ if open: <TgPopup variant onDismiss />
       ├─ overlay (click → dismiss)
       ├─ ESC handler
       ├─ ✕ button (click → dismiss)
       ├─ content (heading + body) — per-variant config
       └─ <a href={NEXT_PUBLIC_TG_CHANNEL_URL} target="_blank">Подписаться</a>

dismiss():
  setOpen(false)
  sessionStorage.setItem("tg-popup-dismissed", "1")
```

## Open Questions → Resolved

| Question | Resolution |
|---|---|
| Триггер открытия | 60s активности с idle/visibility gate (D1) |
| Частота показа | 1 раз за сессию (sessionStorage) (D2) |
| Дизайн? | Per-breakpoint Figma 5 нод (D3) |
| URL TG | env var, default `t.me/soloproduction` (D5) |
| Извлекать shared ModalBase? | Нет, не сейчас (D6) |

## Open Questions для researcher

- Точный mapping `783:9762..9687` → breakpoint (1440/1024/768/480/360) через Figma MCP (researcher определит)
- Уточнение точных классов (gap, padding, icon size, colors) для variant config
- Использовать ли `motion/react` (Framer Motion) для open/close transitions, как в ConsultationModal? — Recommended yes, consistency
- Кадровая частота тика timer: 1s достаточно? — Yes, 60 ticks per minute не нагрузит
- Дополнительный bonus task: footer hardcoded URL → env var? — Researcher / planner решит включать ли

## Deferred Ideas (вне Phase 10)

- **Множественные кампании TG-popup** (A/B test разных текстов) — не нужно для v1.2
- **Shared ModalBase из ConsultationModal + TgPopup** — yak-shaving, отложить до 3-й модалки
- **Timer на подключение через WebSocket** (триггер от сервера) — overkill
- **Локализация контента** — RU only

## Constraints для Researcher / Planner

**Researcher should investigate:**
- Figma node-ids → exhaustive variant lookup (max-width, padding, heading-size, body-size, button-height, icon-size, colors per breakpoint)
- Activity tracker patterns в React — best practice для accumulator timer с idle/visibility detection
- Footer hardcoded URLs — определить, делать ли вместе с Phase 10 (opt-in)
- ConsultationModal код как reference (transition timings, ESC handler, click-outside)

**Planner should NOT re-ask user about:**
- Trigger choice (D1 locked)
- Frequency (D2 locked)
- Design source (D3 locked — Figma)
- URL handling (D5 locked)
- Shared base decision (D6 locked)

**Plans expected (предполагаемая декомпозиция):**
1. **10-01:** `useActivityTimer` хук + sessionStorage check + env var gate (testable foundation)
2. **10-02:** `tg-popup-variants.ts` (lookup) + `TgPopup` base component (UI shell — overlay/dismiss/CTA)
3. **10-03:** `TgPopupHost` интеграция в layout + behavior (timer → setOpen → render)
4. **10-04:** TEST-06 (E2E timer + dismiss + sessionStorage) + TEST-07 (unit activity tracker)
5. **(opt 10-05):** Footer hardcoded URL → env var (если researcher определит, что это безопасный bonus)

## Success Criteria (mirror to PLAN must-haves)

1. Pop-up появляется ровно через 60s активности (timer + activity events работают)
2. Если пользователь idle 30+s — таймер не движется
3. Если page hidden — таймер не движется (visibility detection)
4. Дизайн совпадает с Figma на любом 1 breakpoint (manual sverka)
5. Dismiss через ✕ / overlay click / ESC — все три работают
6. После dismiss pop-up не появляется снова в этой же вкладке (sessionStorage gate)
7. Кнопка «Подписаться» открывает `NEXT_PUBLIC_TG_CHANNEL_URL` в новой вкладке
8. Если `NEXT_PUBLIC_TG_CHANNEL_URL` не задан — никакого pop-up'а вообще (no DOM, no timer)
9. E2E spec покрывает timer (через `page.clock` API Playwright или manual mock) + dismiss flow + sessionStorage state
10. Unit test покрывает activity tracker логику (idle detection, accumulator)
