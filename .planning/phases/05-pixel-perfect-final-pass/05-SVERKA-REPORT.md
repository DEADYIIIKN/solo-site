# Phase 5 — Sverka Report

**Figma sheet:** «Адаптивы актуальные» (см. PROJECT.md §Figma)
**Tolerance:** ±1px геометрия (D-07). Типографика/цвета/ассеты — exact (D-08/D-09/D-10).
**Status legend:** `fixed` | `deferred` | `ok` (нет отклонения)

## Breakpoint 1440px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|
| 1440 | hero | size | geo label top=703 | top=698 → 703 | src/widgets/first-screen/ui/first-screen-hero-1440.tsx:55 | fixed |
| 1440 | hero | — | video/subtitle/titles/CTA/geo-glow match Figma 783:9656 | matches | src/widgets/first-screen/ui/first-screen-hero-1440.tsx | ok |
| 1440 | business-goals | size | arrows left=1300 top=174 (Figma 783:9650) | left=1220 top=140 → 1300/174 | src/widgets/business-goals/ui/business-goals.tsx:1026 | fixed |
| 1440 | business-goals | — | frame 1440×810, eyebrow 140/162, grid 140/214/1160×500, cards 868/87/88/87 gap=10, CTA float match Figma 783:9628 | matches | src/widgets/business-goals/ui/business-goals.tsx | ok |
| 1440 | services | — | vertical 335/120/965×550 inner 945×315 hero{title 40/40, subtitle 40/138, cta 40/236, pkg-glow 385/245, pkg-text 420/260, illustr 609/30/326×273}; commercial 965×510 inner 945×280 hero{title 40/40, subtitle 40/102, cta 40/200, illustr 588/30/347×236}; eyebrow 140/160; grids 365/330 badges {40,362,664/684} top {0,87}; card2 slide 710→250 match Figma 783:9203+783:9139 | matches | src/widgets/services/ui/services-section-1440.tsx | ok |
| 1440 | cases | size | vertical arrows x=1300 y=162 (Figma 783:9284) | mt-2→mt-[42px] + translate-x-[80px]; verified x=1300 y=162 | src/widgets/cases/ui/cases-section-1440.tsx:386 | fixed |
| 1440 | cases | size | ad arrows x=1300 y=897 (Figma 783:9268) | mt-2→mt-[42px] + translate-x-[80px]; verified x=1300 y=897 | src/widgets/cases/ui/cases-section-1440.tsx:429 | fixed |
| 1440 | cases | size | vertical scroll flex: pt-2→0 (убирает лишний зазор) | pt-2 removed | src/widgets/cases/ui/cases-section-1440.tsx:398 | fixed |
| 1440 | cases | size | ad scroll flex: pt-2→0 | pt-2 removed | src/widgets/cases/ui/cases-section-1440.tsx:443 | fixed |
| 1440 | cases | size | card-top gap after arrow row: mt-12→mt-[26px] (−22 компенсация роста row от mt-[42px]) | gap arrow→cards=60px match Figma | src/widgets/cases/ui/cases-section-1440.tsx:396,443 | fixed |
| 1440 | cases | — | ad-секция inter-frame gap ≈290px в Figma (два артборда по 810) vs ~100px на сайте | design decision, не pixel error | — | deferred |

## Breakpoint 1180px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|

## Breakpoint 820px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|

## Breakpoint 360px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|

## Deferred Items Summary

| Breakpoint | Section | Reason (>30 lines / pattern-wide) | Tracked in |
|------------|---------|-----------------------------------|-----------|
