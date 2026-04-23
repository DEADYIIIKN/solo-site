# Phase 5 — Sverka Report

**Figma sheet:** «Адаптивы актуальные» (см. PROJECT.md §Figma)
**Tolerance:** ±1px геометрия (D-07). Типографика/цвета/ассеты — exact (D-08/D-09/D-10).
**Status legend:** `fixed` | `deferred` | `ok` (нет отклонения)

## Breakpoint 1440px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|
| 1440 | hero | size | geo label top=703 | top=698 → 703 | src/widgets/first-screen/ui/first-screen-hero-1440.tsx:55 | fixed |
| 1440 | hero | typography | geo dot optical-center vs text glyph-center (Figma визуально центрирует dot на тексте «Работаем по всей России»; CSS leading-1.2 смещает глиф-центр на +5.4px от Figma-координаты y=712) | top 684 → 690 (dot-center=718 ↔ glyph-center=717.4, Δ=0.6px) | src/widgets/first-screen/ui/first-screen-hero-1440.tsx:59 | fixed |
| 1440 | hero | — | video/subtitle/titles/CTA/geo-glow match Figma 783:9656 | matches | src/widgets/first-screen/ui/first-screen-hero-1440.tsx | ok |
| 1440 | business-goals | size | arrows left=1300 top=174 (Figma 783:9650) | left=1220 top=140 → 1300/174 | src/widgets/business-goals/ui/business-goals.tsx:1026 | fixed |
| 1440 | business-goals | — | frame 1440×810, eyebrow 140/162, grid 140/214/1160×500, cards 868/87/88/87 gap=10, CTA float match Figma 783:9628 | matches | src/widgets/business-goals/ui/business-goals.tsx | ok |
| 1440 | services | — | vertical 335/120/965×550 inner 945×315 hero{title 40/40, subtitle 40/138, cta 40/236, pkg-glow 385/245, pkg-text 420/260, illustr 609/30/326×273}; commercial 965×510 inner 945×280 hero{title 40/40, subtitle 40/102, cta 40/200, illustr 588/30/347×236}; eyebrow 140/160; grids 365/330 badges {40,362,664/684} top {0,87}; card2 slide 710→250 match Figma 783:9203+783:9139 | matches | src/widgets/services/ui/services-section-1440.tsx | ok |
| 1440 | services | typography | vertical title wrap: Figma 783:9146 переносит на «видеоконтент / для социальных сетей», браузер без фикса переносил «видеоконтент для / социальных сетей» | NBSP между «для» и «социальных» закрепил пару → wrap совпал | src/widgets/services/model/services.data.ts:16 | fixed |
| 1440 | cases | size | vertical arrows x=1300 y=162 (Figma 783:9284) | mt-2→mt-[42px] + translate-x-[80px]; verified x=1300 y=162 | src/widgets/cases/ui/cases-section-1440.tsx:386 | fixed |
| 1440 | cases | size | ad arrows x=1300 y=897 (Figma 783:9268) | mt-2→mt-[42px] + translate-x-[80px]; verified x=1300 y=897 | src/widgets/cases/ui/cases-section-1440.tsx:429 | fixed |
| 1440 | cases | size | vertical scroll flex: pt-2→0 (убирает лишний зазор) | pt-2 removed | src/widgets/cases/ui/cases-section-1440.tsx:398 | fixed |
| 1440 | cases | size | ad scroll flex: pt-2→0 | pt-2 removed | src/widgets/cases/ui/cases-section-1440.tsx:443 | fixed |
| 1440 | cases | size | card-top gap after arrow row: mt-12→mt-[26px] (−22 компенсация роста row от mt-[42px]) | gap arrow→cards=60px match Figma | src/widgets/cases/ui/cases-section-1440.tsx:396,443 | fixed |
| 1440 | cases | typography | vertical card 2-line credits: mb-[10px] between non-last lines (Figma 783:9293) — строки шли встык | added mb-[10px] for i < credits.length-1 | src/widgets/cases/ui/cases-section-1440.tsx:206 | fixed |
| 1440 | cases | — | ad-секция inter-frame gap ≈290px в Figma (два артборда по 810) vs ~100px на сайте | design decision, не pixel error | — | deferred |
| 1440 | team | size | stats columns: визуальный порядок Figma 783:9611 = 5+@0, 3+@322, 30+@654, 177@945 (w=193/213/182/214); код использовал justify-between → 30+/177 swapped + uniform gaps | replaced with absolute left+width per Figma 783:9611 | src/widgets/team/ui/team-section-1440.tsx:10,54 | fixed |
| 1440 | team | typography | stat-value line-height: leading-none → leading-[1.4] (Figma 783:9613) | fixed | src/widgets/team/ui/team-section-1440.tsx:64 | fixed |
| 1440 | team | size | stats gap между value и label: gap-[8px] → gap-[16px] (Figma) | fixed | src/widgets/team/ui/team-section-1440.tsx:60 | fixed |
| 1440 | team | — | photo 1160×400 rounded-12, manifesto 50px italic mix, headline 40px 3-span construction, eyebrow row 80/140 — match Figma 783:9610/9607 | matches | src/widgets/team/ui/team-section-1440.tsx | ok |
| 1440 | philosophy-clients | — | card positions {0:433/90, 1:563/171, 2:140/252, 3:325/333, 4:660/414} ×640/340 radius 20; eyebrow top=130/left=140; pre-stack 458 / hidden 930 соответствуют Figma 783:9294 | matches | src/widgets/philosophy-clients/ui/philosophy-clients-1440.tsx | ok |
| 1440 | levels | size | intro y=140, step-labels {270, 390, 508}, outro bottom=730, frame h=810 (Figma 783:9122) — были смещены на −76px | shifted +76px; min-h 720→810 | src/widgets/levels/ui/levels-section-1440.tsx:47,51,100,113,125,138 | fixed |
| 1440 | levels | — | bars left {715, 910, 1105} h {250, 370, 490} w=195 (Figma 783:9124) | matches | src/widgets/levels/ui/levels-section-1440.tsx:65-96 | ok |
| 1440 | footer | — | frame 1440×1243, content px-140 py-120, gap-200 blog↔bottom, gridCols 575/380 gap-205, rowGap 120, logo 136×24, nav 380×24 justify-between {100/53/57/70}, phone/email fontSize 40/leading-none, TG CTA 250×60, blog cards 480×270+title 24px leading-0.9 — match Figma 783:9034 | matches | src/widgets/footer/ui/footer-1440.tsx | ok |
| 1440 | footer | — | line-box vs Figma glyph-bbox render: subtitle 17/leading-1.2 ~20.4 vs Figma h=12, phone/email 40/leading-none ~40 vs Figma h=28 (sub-pixel D-11) | — | — | ok |
| 1440 | lead-form | size | bullets col-2 label x=504 (Figma 783:9112) | grid w-full (640) → w-[628px]: col2 shifted 511→505 (Δ=+1 within ±1px tolerance) | src/widgets/lead-form/ui/lead-form-bullets.tsx:130 | fixed |
| 1440 | lead-form | — | title top=150/left=140/w=640, «Мы покажем:» top=310, bullets rows top 352/424, inputs card 470×608 top=120/left=830, circles 30/gap-10/labels 17px leading-1.2 — match Figma 783:9078 | matches | src/widgets/lead-form/ui/lead-form-1440.tsx | ok |

## Breakpoint 1180px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|
| 1180 | hero | — | header 944 max-width, hero title italic 70px + bold 70px, subtitle 16px/386w, video 604/446 380×214 r12, CTA 534/296 210×210, geo label+glow 40/584..603 — visual match Figma column x=8968 y~3904 | matches | src/widgets/first-screen/ui/first-screen-hero-1024.tsx | ok |
| 1180 | business-goals | — | eyebrow 40/130, arrows 914/111 30×30, accordion grid 40/181 938×400 columns 68/705 gap=10, card hover/slide behavior matches — visual match Figma business-goals column | matches | src/widgets/business-goals/ui/business-goals.tsx (ветка layout="1024") | ok |
| 1180 | services | typography | vertical hero title 32px tracking -0.64 leading-0.9 (Figma 783:8503); subtitle 16px (Figma 783:8502) | было text-[28px] tracking-[-0.56px]/text-[15px] → text-[32px] tracking-[-0.64px]/text-[16px]; wrap теперь «Вертикальный видеоконтент / для социальных сетей» match Figma | src/widgets/services/ui/services-section-1024.tsx:217,224 | fixed |
| 1180 | services | — | frame 1024×700, eyebrow 40/150, vertical+commercial cards 199/90 785×520 и 199/650 785×480, bullets grids, CTA 30/204 260×56 match Figma 783:8494 | matches | src/widgets/services/ui/services-section-1024.tsx | ok |
| 1180 | cases | — | vertical 4 cards 40/205 227×410 gap=12, title 199/120 + arrow 983/155; ad-cases 40/320 466×260 (Figma 783:8585+8569) | matches | src/widgets/cases/ui/cases-section-1024.tsx | ok |
| 1180 | team | typography/size | stats value 38px bold leading-1.4 tracking-[-0.76], label 14px, gap 16, justify-between (Figma 783:8923) | было text-[48px] leading-none grid-cols-4 gap-x-3 → 38px leading-[1.4] tracking-[-0.76px] flex justify-between gap-[16px] | src/widgets/team/ui/team-section-1024.tsx:52-64 | fixed |
| 1180 | team | — | headline 32px bold/italic mix, photo 320px, manifesto 36px italic mix — matches Figma pattern | matches | src/widgets/team/ui/team-section-1024.tsx | ok |
| 1180 | philosophy-clients | — | stacked-cards 5 шт 478×270 diagonal, eyebrow 40/120 «наша философия» + 40/810 «клиенты», marquee-row оранж+чёрный — visual match Figma 783:8605 | matches | src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx + philosophy-clients-marquee-1024.tsx | ok |
| 1180 | levels | — | intro «Мы в SOLO…» top-left, 3 bars bottom-right ascending, 3 level labels {level1/level2/level3}, outro «Видеоконтент — это основа…» (Figma 783:8404) | matches | src/widgets/levels/ui/levels-section-1024.tsx | ok |
| 1180 | footer | — | frame 1024×1137, content px-40 py-120, logo+nav row, phone/email col, TG CTA 250×60, legal row; blog section «делимся секретами» gated CMS-флагом showSecrets=false | matches (blog/badge deferred вне scope) | src/widgets/footer/ui/footer-1024.tsx | ok |
| 1180 | footer | — | blog section «делимся секретами» 3 cards и floating badge «бесплатная консультация» присутствуют в Figma 783:8318 | feature gated / компонент не реализован — вне scope pixel-perfect | — | deferred |
| 1180 | lead-form | — | frame 1024×700, title 40/124 425w, bullets col 4 items top=246..426, inputs card 518/100 466×550, circle illustr overlapping bottom — visual match Figma 783:8362 | matches | src/widgets/lead-form/ui/lead-form-1024.tsx | ok |

## Breakpoint 820px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|

## Breakpoint 360px

| Breakpoint | Section | Type | Figma value | Current code value | File:line | Status |
|------------|---------|------|-------------|--------------------|-----------|--------|

## Deferred Items Summary

| Breakpoint | Section | Reason (>30 lines / pattern-wide) | Tracked in |
|------------|---------|-----------------------------------|-----------|
| 1180 | footer | blog section «делимся секретами» gated CMS-флагом showSecrets=false + floating circular badge «бесплатная консультация» — feature, не pixel nudge | 05-CONTEXT.md §Deferred Ideas (наследует 1440) |
