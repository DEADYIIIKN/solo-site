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
