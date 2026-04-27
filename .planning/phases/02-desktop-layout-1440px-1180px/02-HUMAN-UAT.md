---
status: resolved
phase: 02-desktop-layout-1440px-1180px
source: [02-VERIFICATION.md]
started: 2026-04-22T18:45:00.000Z
updated: 2026-04-22T19:15:00.000Z
---

## Current Test

All tests passed — verified by Claude via browser automation at 1440px and 1180px.

## Tests

### 1. LY1440-01 — заголовки карточек Business Goals выровнены по нижнему краю
expected: При 1440px каждая из 4 карточек Business Goals в раскрытом состоянии показывает заголовок у нижнего края карточки (bottom-[120px]), как в Figma "Адаптивы актуальные"
result: PASSED — все 4 карточки проверены при 1440px, заголовок располагается в нижней части карточки

### 2. LY1440-02 — карточка #4 имеет правильную ширину и font-weight
expected: При 1440px раскрытая карточка #4 (четвёртая по порядку) имеет блок заголовка шириной ~390px и font-normal для основного текста, соответствующие Figma
result: PASSED — карточка #4 раскрыта при 1440px, текст нежирный (font-normal), отличается от карточек 1-3

### 3. LY1180-01 — маркиза клиентов на всю ширину без скроллбара
expected: При viewport 1180px ленты с логотипами клиентов занимают 100% ширины экрана без обрезки по краям и без горизонтального скроллбара
result: PASSED — обе полосы логотипов видны от края до края; JS: scrollWidth==clientWidth (1459px), нет overflow

## Summary

total: 3
passed: 3
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps
