---
plan: 02-02
phase: 02-desktop-layout-1440px-1180px
status: complete
requirements: [LY1440-03]
---

## Summary

Заменено устаревшее фото команды SOLO на актуальное. Новый файл — трое участников команды с профессиональной камерой на закате.

## What Was Built

- Файл `public/assets/figma/9656-team-what-we-do-1440/team.png` заменён (2560×1360px PNG, 2.0MB)
- Код не изменялся — путь захардкожен в `src/widgets/team/model/team.data.ts`

## Key Files

### Modified
- `public/assets/figma/9656-team-what-we-do-1440/team.png` — новое фото команды

## Verification

- [x] Файл существует по целевому пути
- [x] Формат PNG, размер 2.0MB (ненулевой)
- [x] Визуальная проверка на 1440px — новое фото отображается в секции команды (approved)
- [x] Код не изменён (team.data.ts, team-section-photo.tsx без правок)

## Self-Check: PASSED
