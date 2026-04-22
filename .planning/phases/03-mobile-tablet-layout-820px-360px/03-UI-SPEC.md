---
phase: 3
slug: mobile-tablet-layout-820px-360px
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-22
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for Phase 3: Mobile/Tablet Layout (820px + 360px).
> This is a bug-fix phase — all design values come from the existing codebase and Figma "Адаптивы актуальные".
> No new design decisions are needed. The executor MUST use Figma MCP to extract px values for any value marked [FIGMA MCP].

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (no shadcn/radix) |
| Preset | not applicable |
| Component library | none — Tailwind CSS + custom CSS (globals.css) |
| Icon library | inline SVG (CasesNavArrowIcon, custom paths) |
| Font | Montserrat (--font-sans, --font-family-text) |

Source: `src/app/globals.css` @theme + :root tokens.

---

## Spacing Scale

Project uses a custom non-8pt scale defined in globals.css `--space-*` tokens.
Phase 3 does not introduce new spacing tokens — all values come from Figma.

| Token | Value | Usage in Phase 3 |
|-------|-------|------------------|
| --space-1 | 4px | Minimum inline gaps |
| --space-2 | 8px | Compact spacing |
| --space-5 | 16px | Container padding 360px (--container-padding at <480px) |
| --space-7 | 24px | — |
| --space-10 | 48px | Container padding 820px (--container-padding at >=768px) |
| FIGMA | [FIGMA MCP] | Cases card padding/gap at 768 and 360 layouts |
| FIGMA | [FIGMA MCP] | Logo marquee gap at 360px (replaces gap-[60px]) |

**Cases credits row spacing (LY820-04, LY360-05):**
Current code uses `mb-[10px]` (768) / `mb-[6px]` (360) — values will be replaced with Figma-exact values after Figma MCP. Final values not declared in advance. If Figma specifies 8px or 16px they enter the scale as multiples of 4. If Figma specifies non-standard values (e.g. 10px, 6px) — declare as explicit Exception with justification "Figma-sourced non-standard value".

Exceptions:
- Cases carousel card widths are hardcoded px values from Figma: VERT_CARD_W=242 (768), VERT_CARD_W=208 (360), AD_CARD_W=414 (768), AD_CARD_W=242 (360). Do not change these.
- Levels section uses absolute positioning with px coordinates. Coordinates for Levels768 and Levels360 must be verified against Figma via Figma MCP before touching.

Source: `src/app/globals.css` :root + breakpoint overrides; `src/widgets/cases/ui/cases-section-768.tsx`; `src/widgets/cases/ui/cases-section-360.tsx`.

---

## Typography

Phase 3 modifies only the cases credits rows (LY820-04, LY360-05). The table below covers only roles this phase changes.

| Role | Size | Weight | Line Height | Usage in Phase 3 |
|------|------|--------|-------------|-----------------|
| Cases credits (768) | 13px | 400 | [FIGMA MCP] | Режиссер/DOP rows in cases-section-768.tsx — currently leading-[1.2], may be wrong |
| Cases credits (360) | 10–11px | 400 | [FIGMA MCP] | Режиссер/DOP rows in cases-section-360.tsx — currently leading-[1.2], may be wrong |

> **Pre-existing scale — not modified in Phase 3.** The following type styles exist in the codebase and must not be changed: Cases section heading (768) 44px/700/lh-0.9; Cases section heading (360) 28px/700/lh-0.9; Levels label text (768) 12px/500/lh-0.9; Levels title text (768) 20px/700/leading-none; Levels label text (360) 10px/500/lh-0.9; Levels title text (360) 14px/700/leading-none; Eyebrow 14px/600/lh-1.2. Verify absolute positions against Figma where overlap is observed — do not change type styles.

**Key fix rule:** For LY820-04 and LY360-05 (cases credits line-height):
- Current code: `leading-[1.2]` on credits rows.
- Figma MCP MUST be used to get the exact line-height value before changing.
- Do not guess — wrong line-height causes text overlap.

Source: `src/widgets/cases/ui/cases-section-768.tsx` lines ~129-131, ~193-196; `src/widgets/cases/ui/cases-section-360.tsx` lines ~129-131, ~193-196.

---

## Color

Phase 3 does not change colors. All colors are pre-existing project tokens.

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #f8f4ef (--color-bg / --color-base-pearl) | Page background |
| Secondary (30%) | #ffffff (--color-surface) + #0d0300 (--color-surface-strong) | Cards, dark sections |
| Accent (10%) | #ff5c00 (--color-base-orange / --color-accent) | Arrow circles, CTA buttons, orange logo strip |
| Text primary | #0d0300 (--color-base-black) | Body text |
| Text muted | #9c9c9c (--color-base-gray-400) | Levels labels, credits |
| Text on dark | #ffffff (--color-base-white) | Cases section text |
| Destructive | not applicable | No destructive actions in this phase |

Accent reserved for: carousel arrow circles, CTA buttons, orange marquee strip background, selection highlight.

Source: `src/app/globals.css` :root color tokens.

---

## Component Inventory

These are the exact components touched in Phase 3. No new components are created.

### 1. CasesNavArrowIcon — Arrow direction fix (LY820-01, LY360-01)

File: `src/widgets/cases/ui/cases-section-shared-ui.tsx` line 24

Current (broken):
```
variant === "back" ? CASES_ARROW_PATH_FIGMA_RIGHT_FILE : CASES_ARROW_PATH_FIGMA_LEFT_FILE
```

Fix (1-line swap):
```
variant === "back" ? CASES_ARROW_PATH_FIGMA_LEFT_FILE : CASES_ARROW_PATH_FIGMA_RIGHT_FILE
```

Visual contract: "back" button (aria-label="Назад") shows left-pointing chevron (←). "forward" button (aria-label="Вперёд") shows right-pointing chevron (→). Arrow circle color: #FF5C00 when active (opacity-100), #FF5C00 at opacity-30 when disabled.

Scope impact: This fix applies to ALL breakpoints (360, 480, 768, 1024, 1440). Verify 1440px arrows are still correct after fix.

### 2. Cases carousel container — Clipping fix (LY820-02, LY360-02)

Files: `src/widgets/cases/ui/cases-section-768.tsx`, `src/widgets/cases/ui/cases-section-360.tsx`

Problem: Right card clips at viewport edge when scrolled to last position.

Fix approach: Adjust container padding or wrapper min-width so the last card is fully visible.
- Use Figma MCP to read container padding values from "Адаптивы актуальные" nodes 783:12001 (768) and 783:11420 (360).
- Do NOT change `useCasesHorizontalCarousel` scroll logic.
- Card widths are fixed: VERT=242/208, AD=414/242. Do not change these.

### 3. PhilosophyClientsNarrowClientsBlock — 100vw breakout (LY820-03)

File: `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx` line ~421

Current (broken): `overflow-x-clip` inside constrained container limits marquee width.

Fix: Apply the same 100vw breakout pattern used in Phase 2 (`philosophy-clients-1024.tsx` lines 380–384):
- Remove `overflow-x-clip` from the wrapper div
- Add `style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}` to the wrapper

Visual contract: Logo strips fill the full viewport width with no visible endpoint gap. Check that this does not produce a horizontal scrollbar — if it does, audit overflow on parent elements.

Scope: `PhilosophyClientsNarrowClientsBlock` is used by both `philosophy-clients-768.tsx` and `philosophy-clients-360.tsx`. One fix covers both 820px and 360px.

### 4. PhilosophyClientsMarquee1024 — Gap fix (LY360-04)

File: `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx`

Current: `gap-[60px]` hardcoded (lines 181–182, 240–242). This gap value comes from the 1024px Figma layout. On 360px it is too large.

Fix:
1. Use Figma MCP to extract exact gap value from "Адаптивы актуальные" 360px clients section.
2. Add a `gapPx` prop (or `gapClassName` — executor chooses minimal API) to `PhilosophyClientsMarquee1024`.
3. Pass the Figma-extracted gap value from `PhilosophyClientsNarrowClientsBlock` when rendering for 360px.
4. Default value remains 60px (keeps 768px and 1024px behavior unchanged).

Visual contract: Logo gap on 360px matches Figma value (exact px from Figma MCP).

### 5. TeamSection360 — Missing photo check (LY360-03)

File: `src/widgets/team/ui/team-section-360.tsx`

Protocol: Executor first checks at viewport 360px in browser whether photo is visible.
- If photo IS visible: close LY360-03 as resolved (likely fixed by Phase 2 asset swap).
- If photo is MISSING: investigate `BoneyardSkeleton` bones file `philosophy-team-card-360.bones.json` and narrow variant CSS in `src/widgets/team/ui/team-section-photo.tsx`.

Visual contract: The "что мы делаем" team photo must be visible at 360px viewport. Photo source: `teamSectionAssets.teamPhoto` in `src/widgets/team/model/team.data.ts`.

### 6. Cases credits rows — Line-height fix (LY820-04, LY360-05)

Files: `src/widgets/cases/ui/cases-section-768.tsx` lines ~129-131, ~193-196; `src/widgets/cases/ui/cases-section-360.tsx` lines ~129-131, ~193-196

Current: `leading-[1.2]` on credits rows.

Fix:
1. Use Figma MCP to extract exact line-height for Режиссер/DOP credits text from "Адаптивы актуальные" at 768 and 360.
2. Update `leading-[1.2]` to the Figma-correct value.
3. Verify `mb-[10px]` (768) and `mb-[6px]` (360) spacing between credit rows against Figma — replace with Figma-exact values (see Spacing section above).

Visual contract: Credits text (Режиссер / DOP) has no text overlap. Line-height and row spacing match Figma pixel-perfectly.

### 7. Levels section — Absolute position fix (LY820-05, LY360-06)

File: `src/widgets/levels/ui/levels-section-below-1024.tsx`

`Levels768` absolute positions (current code):
- Level 0 label: `left-[86px] top-[69px]`, title: `left-[86px] top-[89px]`
- Level 1 label: `left-[258px] top-[193px]`, title: `left-[258px] top-[213px]`
- Level 2 label: `left-[431px] top-[316px]`, title: `left-[431px] top-[336px]`

`Levels360` absolute positions (current code):
- Level 0 label: `left-0 top-[73px]`, title: `left-0 top-[86px]`
- Level 1 label: `left-[86px] top-[153px]`, title: `left-[86px] top-[166px]`
- Level 2 label: `left-[172px] top-[233px]`, title: `left-[172px] top-[246px]`

Fix:
1. Use Figma MCP to read exact left/top coordinates for each text label from "Адаптивы актуальные" Figma nodes 783:11542 (768) and 783:10360 (360).
2. Update only the values that deviate from Figma — do not touch values that match.
3. Text overlap is a clear signal that top values are wrong.

Visual contract: All levels text labels are visible without overlap at both 768 and 360 layouts. Positions match Figma coordinates.

---

## Breakpoint Mapping

| Viewport range | Layout name | File suffix |
|---------------|-------------|-------------|
| >= 768px and < 1024px | "768" | -768.tsx |
| < 480px | "360" | -360.tsx |

Note: The 820px test viewport falls into the "768" layout slot. The 360px test viewport falls into the "360" layout slot.

---

## Figma MCP Protocol

**Mandatory for Phase 3.** All numeric values must come from Figma, not guessing.

1. Find nodes by section name in "Адаптивы актуальные" sheet — do not use hardcoded node IDs.
2. Known Figma node IDs (from CONTEXT.md):
   - Cases 768: 783:12001
   - Cases 360: 783:11420
   - Levels 768: 783:11542
   - Levels 360: 783:10360
3. Values to extract via Figma MCP before editing:
   - Cases carousel container padding and visible-last-card padding (LY820-02, LY360-02)
   - Cases credits line-height (LY820-04, LY360-05)
   - Cases credits row spacing mb value (LY820-04, LY360-05)
   - Logo marquee gap at 360px (LY360-04)
   - Levels text label and title absolute coordinates where current code causes overlap (LY820-05, LY360-06)

---

## Interaction States

This phase does not add new interaction patterns. Existing patterns carry over:

| Element | Active state | Disabled state |
|---------|-------------|----------------|
| Arrow button (back/forward) | opacity-100 on icon circle | opacity-30 on icon circle + `disabled` attr |
| Arrow button hover | opacity-90 (hover:opacity-90) | no hover effect when disabled |

Touch targets: Arrow buttons are 34×34px (`size-[34px]`). This is below the 44px recommended minimum. Do not change — matches Figma exactly. Note for Phase 6 accessibility tests.

---

## Copywriting Contract

Phase 3 is a layout bug-fix phase. No new copy is written.

| Element | Copy |
|---------|------|
| Primary CTA | Not applicable — no new CTAs in this phase |
| Empty state | Not applicable — no new data states |
| Error state | Not applicable — no forms or async operations |
| Destructive actions | None — no destructive actions in this phase |

Existing aria-labels on carousel buttons (already correct, do not change):
- Back button: `aria-label="Назад"`
- Forward button: `aria-label="Вперёд"`

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not applicable |
| third-party | none | not applicable |

No component registry used. All components are project-local.

---

## Regression Guard

Phase 3 changes that affect multiple breakpoints:

| Fix | Breakpoints affected | Must verify |
|-----|---------------------|-------------|
| Arrow swap in cases-section-shared-ui.tsx | ALL: 360, 480, 768, 1024, 1440 | Check 1440px arrows still correct after swap |
| 100vw breakout in PhilosophyClientsNarrowClientsBlock | 360 + 768 (via same component) | No horizontal scrollbar on either breakpoint |
| gapPx prop in PhilosophyClientsMarquee1024 | 360 only (new prop, default=60 keeps others unchanged) | 768 and 1024 marquee gap unchanged |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (no copy changes — N/A)
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS (no color changes — N/A)
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS (no registry — N/A)

**Approval:** pending
