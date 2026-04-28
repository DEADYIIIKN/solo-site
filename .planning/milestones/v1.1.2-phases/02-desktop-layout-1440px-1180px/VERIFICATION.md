---
phase: 02-desktop-layout-1440px-1180px
verified: 2026-04-27T00:00:00Z
status: passed
score: 6/6 must-haves verified
overrides_applied: 0
requirements: [LY1440-01, LY1440-02, LY1440-03, LY1180-01]
re_verification:
  previous_status: human_needed
  previous_score: 6/6 (3 human-needed)
  gaps_closed:
    - "LY1440-01: bottom-aligned card titles на 1440 — подтверждено Figma MCP sverka в 05-01"
    - "LY1440-02: card #4 ширина/font-weight — подтверждено Figma MCP sverka в 05-01"
    - "LY1180-01: marquee 100vw без horizontal overflow — подтверждено Figma MCP sverka в 05-02"
  gaps_remaining: []
  regressions: []
---

# Phase 02: Desktop Layout 1440px/1180px — Re-verification Report

**Phase Goal:** Брейкпоинты 1440px и 1180px визуально совпадают с Figma — выравнивание сервисных карточек, рендеринг шрифтов, фото команды и полосы лого клиентов корректны.
**Verified:** 2026-04-27
**Status:** passed
**Re-verification:** Yes — после прохождения Phase 5 (Pixel-Perfect sverka)

## Status

Все 4 требования фазы (LY1440-01, LY1440-02, LY1440-03, LY1180-01) выполнены. Три ранее открытых human-verification пункта закрыты Figma MCP sverka в Phase 5 (планы 05-01 для 1440 и 05-02 для 1180). Артефакты в коде сохранены без регрессий.

## Requirements coverage

| Requirement | Plan | Описание | Status | Evidence |
|-------------|------|----------|--------|----------|
| LY1440-01 | 02-01 | Названия услуг 1440 выровнены по нижнему краю карточки | SATISFIED | `business-goals.tsx:288` — `width: ${[415,646,415,646][cardIndex]}px` + bottom-positioning ветка. Phase 5 SVERKA-REPORT 1440 (05-01-SUMMARY) фиксирует business-goals секцию как `ok` после правок (card-01 description wrap, arrows). PX-01 = Complete. |
| LY1440-02 | 02-01 | Карточка №4 на 1440 — корректные ширина фрейма и font-weight | SATISFIED | `business-goals.tsx:299` — `cardIndex === 3 ? "font-normal" : "font-bold"`; `:340` — индивидуальные width per-index `[281,243,292,248]px`. Phase 5 sverka 1440 подтвердила business-goals в tolerance. |
| LY1440-03 | 02-02 | Фото команды на 1440 — актуальная версия | SATISFIED | `public/assets/figma/9656-team-what-we-do-1440/team.png` присутствует (3.0MB, modified 2026-04-23). Path использован в `team.data.ts`. Phase 5 sverka team секция = `ok` (стат-блок откорректирован, фото без замечаний). |
| LY1180-01 | 02-03 | Маркиза клиентов 1180 на полную ширину viewport | SATISFIED | `philosophy-clients-1024.tsx:395-396` — `width: "100vw"` + `marginLeft: "calc(50% - 50vw)"` присутствуют. Phase 5 sverka 1180 (05-02-SUMMARY) фиксирует philosophy-clients секцию как `ok` (Figma 783:8605). PX-02 = Complete. |

**Orphaned requirements:** нет.

## Artifacts (Levels 1–4)

| Artifact | Exists | Substantive | Wired | Data Flows | Status |
|----------|--------|-------------|-------|-----------|--------|
| `src/widgets/business-goals/ui/business-goals.tsx` (cardIndex prop, font-normal для idx=3, per-index width) | Yes | Yes (~1300 строк, реальная логика) | Yes (`cardIndex={index}` передаётся при рендере) | Yes (статический контент из data-файла) | VERIFIED |
| `public/assets/figma/9656-team-what-we-do-1440/team.png` | Yes (3.0MB) | Yes | Yes (`team.data.ts` ссылается на путь) | Yes | VERIFIED |
| `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` (100vw breakout) | Yes | Yes (`width:100vw + marginLeft:calc(50%-50vw)`) | Yes (применено к marquee wrapper) | Yes | VERIFIED |

## Critical gaps

Нет.

## Non-critical gaps / tech debt

- **REFAC-02 (v2 backlog):** `business-goals.tsx` — 1300+ строк с встроенной логикой по брейкпоинтам и cardIndex-ветками. Не блокирует Phase 2, запланировано к декомпозиции в v2.
- Значения `bottom-[120px]` / `w-[390px]` / `font-normal` изначально были выведены без Figma (Figma MCP unavailable во worktree). Это формально tech-debt в комментариях SUMMARY 02-01, но Phase 5 sverka подтвердила соответствие Figma → tech-debt исчерпан.

## Anti-patterns found

Нет. TODO/FIXME в правленых файлах не обнаружены, hardcoded empty values отсутствуют, stub-паттернов нет. Все правки — реальные CSS/JSX-изменения с прохождением TypeScript-проверки.

## Notes

- Все 3 human-verification пункта из 02-VERIFICATION.md (initial verification) закрыты Figma MCP sverka в Phase 5 — прямой контракт с PX-01 (1440) и PX-02 (1180).
- Phase 5 SVERKA-REPORT.md для 1440/1180 не зафиксировал регрессии в правках Phase 2 (business-goals секция в tolerance, philosophy-clients marquee `ok`).
- Старый файл `02-VERIFICATION.md` сохранён для историчности; этот отчёт (`VERIFICATION.md`) — финальный re-verification после Phase 5.
- ROADMAP.md помечает Phase 2 как Complete (2026-04-22); REQUIREMENTS.md traceability table помечает LY1440-* / LY1180-01 как Pending — это устаревшее поле (фактический статус закрыт через PX-01/PX-02 = Complete и Phase 5 sverka).

---

*Verified: 2026-04-27*
*Verifier: Claude (gsd-verifier)*
