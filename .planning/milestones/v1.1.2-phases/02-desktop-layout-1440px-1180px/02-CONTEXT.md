# Phase 2: Desktop Layout (1440px + 1180px) - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix 4 specific visual bugs on the 1440px and 1180px breakpoints to match the Figma "Адаптивы актуальные" sheet:
- LY1440-01: Business Goals card titles bottom-aligned (currently jump to top)
- LY1440-02: Business Goals card #4 — text frame width and font weight match Figma
- LY1440-03: Team photo replaced with current version (file in repo is stale)
- LY1180-01: Client logo marquee strips span full viewport width with no visible clipping

No new capabilities. No refactoring beyond what's needed to fix these 4 bugs.

</domain>

<decisions>
## Implementation Decisions

### LY1440-01 — Business Goals card title bottom-alignment
- **D-01:** The section with jumping card titles is the **Business Goals** widget (`src/widgets/business-goals/ui/business-goals.tsx`), NOT the Services cards (Vertical/Commercial). The executor must look in business-goals.tsx for the card grid.
- **D-02:** Use **Figma MCP** to extract exact values for the bottom-alignment fix. No visual-only guessing — pull px coordinates from the Figma node for 1440px layout.

### LY1440-02 — Business Goals card #4 text frame + font weight
- **D-03:** "Card #4" means the fourth card in the Business Goals grid by DOM order. Exact identification left to executor using Figma MCP + visual inspection.
- **D-04:** Use **Figma MCP** to extract exact text frame width (px) and font weight value. The executor identifies the correct Figma node automatically (no node ID provided in advance).

### LY1440-03 — Team photo replacement
- **D-05:** The file `/public/assets/figma/9656-team-what-we-do-1440/team.png` is stale — the actual photo in the repo is an old version.
- **D-06:** **User will provide the new file.** The plan must include a [BLOCKING] checkpoint: "Provide the updated team.png file and confirm its path" before the executor copies it into place.
- **D-07:** No cache invalidation work needed — the problem is the file itself, not caching. Once the file is replaced, Next.js Image will serve the new version on next build.

### LY1180-01 — Client logo marquee full viewport width
- **D-08:** The problem: marquee strips are **clipped on both left and right sides** — a parent element higher in the tree has `overflow-hidden` that clips the strips before they reach the viewport edge. The 1180px breakpoint uses `philosophy-clients-marquee-1024.tsx` (1024px component handles 1024–1439px range).
- **D-09:** Fix approach: **Claude's Discretion** — user deferred to executor judgment. Preferred approach is **100vw breakout** (width: 100vw + negative side margins to escape the constrained parent) since it avoids touching parent layout structure. If that creates a horizontal scrollbar, fall back to finding and removing the `overflow-hidden` from the clipping ancestor.
- **D-10:** Do NOT add extra logos to pad the segment — this is a layout constraint issue, not a content-length issue.

### Figma MCP workflow
- **D-11:** For LY1440-01 and LY1440-02, the executor uses Figma MCP **automatically** (no manual node IDs). The executor searches by component name/section name in the "Адаптивы актуальные" sheet. This is the preferred pattern for Phase 2 (and future phases with "UI hint: yes").

### Claude's Discretion
- Marquee fix approach (D-09): 100vw breakout preferred, but executor decides based on what the DOM shows
- Business Goals card #4 identification (D-03): executor identifies by DOM order + Figma comparison

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Business Goals (LY1440-01, LY1440-02)
- `src/widgets/business-goals/ui/business-goals.tsx` — Single 1300-line file containing ALL breakpoints for business goals cards. The 1440px card grid is inside this file. Read it carefully before editing.

### Team Photo (LY1440-03)
- `src/widgets/team/ui/team-section-photo.tsx` — Shared photo component used by all breakpoints; `src` comes from `teamSectionAssets.teamPhoto`
- `src/widgets/team/model/team.data.ts` — Defines `teamSectionAssets.teamPhoto = "/assets/figma/9656-team-what-we-do-1440/team.png"`

### Client Logo Marquee (LY1180-01)
- `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx` — The marquee component used at 1180px (1024 component serves 1024–1439px range)
- `src/widgets/philosophy-clients/ui/philosophy-clients-1024.tsx` — Parent wrapper that places the marquee — check for `overflow-hidden` or `max-w` constraints here

### Figma
- Figma file: "Адаптивы актуальные" sheet — used by Figma MCP for LY1440-01/02 node extraction
- No external ADR/spec documents for Phase 2

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TeamSectionPhoto` component (`team-section-photo.tsx`): shared across all breakpoints, `src` driven by `teamSectionAssets.teamPhoto` constant — replacing the static file fixes all breakpoints at once
- `MarqueeTrack` component inside `philosophy-clients-marquee-1024.tsx`: uses ResizeObserver to measure segment width and animate; the measurement logic is correct — the issue is in the containing parent, not the marquee itself

### Established Patterns
- Figma MCP pattern: existing codebase has Figma node IDs as inline comments (e.g., `Figma 783:9521`, `Figma 783:9203`) — use these as anchors when searching Figma MCP
- Absolute positioning: business-goals.tsx uses absolute layout matching Figma pixel values — any title alignment fix must use `position: absolute; bottom: Npx` or equivalent, not flexbox rearrangement
- Static assets in `public/assets/figma/`: convention is per-section subdirectory named after the Figma section

### Integration Points
- `philosophy-clients-1024.tsx` → `PhilosophyClientsMarquee1024` import: find where the marquee is placed and what ancestors clip it
- `business-goals.tsx` line ~1300: large monolith — edit carefully, prefer minimal changes, test adjacent cards visually after edit

</code_context>

<specifics>
## Specific Ideas

- Team photo: user will provide the file; the plan needs a human-action checkpoint to receive it
- Marquee: user described "you can see on both left and right how the lines are cut off" — this is bilateral clipping, confirming the overflow-hidden ancestor theory
- Business Goals card titles: Figma MCP identifies exact bottom coordinates; executor maps to CSS `bottom: Npx` or `padding-bottom`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-desktop-layout-1440px-1180px*
*Context gathered: 2026-04-22*
