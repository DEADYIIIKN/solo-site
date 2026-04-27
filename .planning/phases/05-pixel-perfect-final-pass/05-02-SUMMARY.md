---
phase: 05-pixel-perfect-final-pass
plan: 02
status: completed
completed_at: 2026-04-23
wave: 2
---

# Plan 05-02 Summary — Breakpoint 1180 Sverka

Визуальная сверка 9 секций на 1180px (сервится `*-1024.tsx` файлами) против Figma листа «Адаптивы актуальные», колонка x=8968. Исправление локальных отклонений, документация deferred.

## Outcome

Все 9 секций 1180 совпадают с Figma в пределах tolerance (±1px геометрия, exact типографика/цвета/ассеты). Локальные отклонения исправлены в `*-1024.tsx` файлах. Deferred (footer blog/badge) унаследованы из 1440-sverka.

## Fixed deviations (1180)

| Section | Issue | Figma ref | Commit |
|---|---|---|---|
| team | stats 48→38px font, leading-none→leading-[1.4], gap 6→16, grid→flex justify-between | 783:8923 | dbf6390 |
| services | vertical hero title 28→32px tracking -0.56→-0.64; subtitle 15→16px (wrap «Вертикальный видеоконтент / для социальных сетей») | 783:8503/8502 | 3a57758 |
| services | CTA text 14→16/px-8→40, '02' right 10→20 | 783:8467/8463 | 4469837 |
| services | CTA vertical padding pt-22/pb-20, '02' right→0 post-restructure | 783:8467/8463 | 83034ab |
| services | commercial card restructure (title/subtitle/button/SVG в card coords, D-16) | 783:8460 | 125709a |
| services | vertical card restructure (title/subtitle/button/SVG/package в card coords) | 783:8421 | 1c30905 |
| cases | inter-frame bottom pb-10→pb-120 (D-17) | 783:8569 | e0b2a66 |

## Lessons learned (propagated to 05-CONTEXT.md)

- **D-16:** Figma `display:contents` flattening — дети `<div className="absolute contents">` frame в coords родителя, не local. Sverka должна сверять DOM positions от корня article, не inner wrapper.
- **D-17:** Inter-frame bottom padding — `frame.height - last-content.bottom` = legitimate section pb, не canvas artifact. Probe обязателен.
- **D-18:** Overlap-scenario gap probe — секции с pin-scroll / translate overlap требуют DOM probe видимого зазора после scroll в pin-end.
- **D-19:** CSS line-box vs Figma glyph-bbox для многострочных заголовков с tight leading (~6-8px diff); при gap ≤20px — визуальный probe глифов.

## Sections verified `ok` (no deviation)

- hero — video/subtitles/titles/CTA/geo-label match (без отдельного Figma ID — проверено визуально)
- business-goals — eyebrow/arrows/accordion cards columns layout match
- services — frame/eyebrow/grids/bullets/CTA match Figma 783:8494
- cases — vertical+ad cards, arrows, titles match Figma 783:8585+8569
- team — headline/photo/manifesto match (stats зафиксированы, остальное ok)
- philosophy-clients — stacked-cards (5 шт) + marquee match Figma 783:8605
- levels — intro/bars/labels/outro match Figma 783:8404
- footer — logo/nav/phone/email/TG CTA match Figma 783:8318 (blog/badge deferred)
- lead-form — title/bullets/form card/circles match Figma 783:8362

## Deferred

- **footer 1180 blog «делимся секретами»** — gated CMS-флагом `showSecrets=false` (унаследовано из 1440). Вне scope pixel-perfect.
- **footer 1180 circular badge «бесплатная консультация»** — компонент не реализован (rotating text + SVG). Feature, не pixel nudge. Вне scope.

## Truths check

- ✅ SVERKA-REPORT.md содержит строки для всех 9 секций с Breakpoint=1180 (12 строк: 9 секций + services 2-я row + footer 2-я row как deferred)
- ✅ Локальные отклонения (team stats, services title/subtitle) зафиксированы статусом `fixed`
- ✅ Крупные/out-of-scope (footer blog/badge) имеют статус `deferred` и запись в Deferred Items Summary
- ✅ Figma MCP sverka на 1180 в tolerance
- ✅ Редактированы только *-1024.tsx / shared-tsx, 1440/768/480/360 файлы не тронуты
