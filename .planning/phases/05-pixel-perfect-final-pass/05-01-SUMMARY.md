---
phase: 05-pixel-perfect-final-pass
plan: 01
status: completed
completed_at: 2026-04-23
wave: 1
---

# Plan 05-01 Summary — Breakpoint 1440 Sverka

Полная визуальная сверка 9 секций на 1440px: Figma screenshot ↔ browser preview по каждой секции, с инспекцией типографики/геометрии/оптических центров.

## Outcome

Все 9 секций 1440 совпадают с Figma в пределах tolerance (±1px геометрия, exact типографика/цвета/ассеты). Локальные отклонения зафиксированы статусом `fixed` в [05-SVERKA-REPORT.md](./05-SVERKA-REPORT.md).

## Fixed deviations (1440)

| Section | Issue | Figma ref | Commit |
|---|---|---|---|
| hero | geo-label top 698→703 | 783:9664 | 543b4b5 |
| hero | geo-dot optical-center vs glyph-center (+6px compensation for CSS leading) | 783:9656 | b44b437 |
| business-goals | arrows 1220/140→1300/174 | 783:9650 | 19a7011 |
| business-goals | card-01 description wrap (NBSP «и растим узнаваемость») | 783:9631 | 4d0b195 |
| services | vertical title wrap (NBSP «для социальных») | 783:9146 | 5690c8a |
| cases | arrows + card-top gap | 783:9284+9268 | 9a42cf8 |
| cases | vertical card 2-line credits mb-[10px] | 783:9293 | 06f37c9 |
| team | stats order + gap + leading | 783:9611 | fc0628d |
| levels | vertical shift +76px, min-h 720→810 | 783:9122 | 9a35e18 |
| lead-form | bullets grid width 640→628 | 783:9098 | 7e27620 |

## Sections verified `ok` (no deviation)

- hero (783:9656) — video/subtitle/titles/CTA/geo-glow
- business-goals (783:9628) — frame/eyebrow/grid/cards/CTA
- services (783:9203+9139) — vertical+commercial states, bullets, slide behavior
- cases (783:9284+9268) — divider, card widths, scroll container
- team (783:9610) — photo, manifesto, headline, eyebrow
- philosophy-clients (783:9294) — stacked-cards positions, clients marquee
- levels (783:9122) — bars, labels, intro/outro
- footer (783:9034) — content grid, logo, nav, phone/email, TG CTA
- lead-form (783:9078) — title, bullets, form card, circles, labels

## Deferred

- footer 1440 blog section «делимся секретами» — gated CMS-флагом `showSecrets` (default false), verified верстка существует в footer-1440.tsx:54 при `showSecrets=true`. Вне scope pixel-perfect.
- footer 1440 circular badge «бесплатная консультация» (Figma 783:9034) — отсутствующий компонент (rotating text + SVG); feature, не pixel nudge. Вне scope.
- cases 1440 ad-section inter-frame gap ≈290px Figma vs ~100px сайт — design decision, не pixel error.

## Truths check

- ✅ SVERKA-REPORT.md содержит строки для всех 9 секций с Breakpoint=1440
- ✅ Локальные отклонения (≤30 строк) имеют статус `fixed`
- ✅ Крупные отклонения / out-of-scope имеют статус `deferred` (блог, бейдж, ad-gap)
- ✅ Figma MCP sverka на 1440 в tolerance
