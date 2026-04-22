---
phase: 03-mobile-tablet-layout-820px-360px
reviewed: 2026-04-22T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/widgets/cases/ui/cases-section-360.tsx
  - src/widgets/cases/ui/cases-section-768.tsx
  - src/widgets/cases/ui/cases-section-shared-ui.tsx
  - src/widgets/levels/ui/levels-section-below-1024.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-360.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx
  - src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx
findings:
  critical: 0
  warning: 5
  info: 4
  total: 9
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-22
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Reviewed seven files introduced or modified in the mobile/tablet layout phase. The changes cover three widget areas: Cases horizontal carousel (360px and 768px breakpoints), Levels below-1024 layout switcher, and Philosophy-Clients narrow stack with marquee animation.

The most significant finding is a confirmed arrow direction bug in `cases-section-shared-ui.tsx`: the SVG path constants are named with inverted semantics relative to what they actually draw, causing the "back" button to render a right-pointing chevron and the "forward" button to render a left-pointing chevron. The marquee `useLayoutEffect` dependency array is missing `gapPx`, which can cause the animation shift to silently use a stale gap value when the prop changes at runtime. Several accessibility and React key-prop issues round out the warnings.

---

## Warnings

### WR-01: Arrow chevrons are visually swapped — "back" shows right-pointing, "forward" shows left-pointing

**File:** `src/widgets/cases/ui/cases-section-shared-ui.tsx:12-25`

**Issue:** `CASES_ARROW_PATH_FIGMA_LEFT_FILE` encodes a chevron whose tip is at x≈21.7 (rightmost x in the viewBox) and whose opening faces left — this is a **right-pointing** chevron. `CASES_ARROW_PATH_FIGMA_RIGHT_FILE` has its tip at x≈12.3 (leftmost), opening facing right — a **left-pointing** chevron. The names are inverted relative to what the paths actually draw.

`CasesNavArrowIcon` then maps `variant === "back"` to `FIGMA_LEFT_FILE` (the right-pointing path), so clicking "Назад" (back) shows an arrow pointing right, and "Вперёд" (forward) shows an arrow pointing left. Both carousel instances on 360 and 768 are affected.

**Fix:** Swap the constant names to match their visual direction, or swap the assignment in the icon function:

```tsx
// Option A — fix the assignment in CasesNavArrowIcon (minimal change):
const d =
  variant === "back" ? CASES_ARROW_PATH_FIGMA_RIGHT_FILE : CASES_ARROW_PATH_FIGMA_LEFT_FILE;

// Option B — rename constants to reflect what they draw:
const CASES_ARROW_PATH_RIGHT =   // was FIGMA_LEFT_FILE
  "M21.7036 16.3649...";
const CASES_ARROW_PATH_LEFT =    // was FIGMA_RIGHT_FILE
  "M12.2964 17.6351...";
```

---

### WR-02: `useLayoutEffect` in `MarqueeTrack` is missing `gapPx` in its dependency array

**File:** `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx:132-171`

**Issue:** `useLayoutEffect` captures `gapPx` in the `commitWidth` closure but its dependency array is `[]` (line 171). If `gapPx` changes after mount (e.g., on viewport resize when the parent passes a different value), `shiftPx` will be computed with the stale original gap. The animation loop will then use the wrong translate value, causing visual discontinuity in the marquee loop point.

In practice `gapPx` is currently passed as a constant (`MARQUEE_GAP_360_PX = 20` vs default `60`), but the prop is typed as runtime-configurable and the missing dep is a latent bug.

**Fix:**

```tsx
// Line 171 — add gapPx to the dependency array:
}, [gapPx]);
```

Also update `commitWidth` to reference the current `gapPx` rather than the closed-over one (it already does since it's in the same closure scope, but the effect re-running on `gapPx` change is what ensures freshness).

---

### WR-03: `article` elements with `role="button"` are missing `aria-label` — screen readers announce no name

**File:** `src/widgets/cases/ui/cases-section-360.tsx:78-139`, `src/widgets/cases/ui/cases-section-768.tsx:77-140`

**Issue:** `VerticalCard360`, `AdCard360`, `VerticalCard768`, and `AdCard768` all render `<article role="button" tabIndex={0}>` when `onOpenDetail` is provided. The `article` element itself has no `aria-label` or `aria-labelledby`. Screen readers will either announce nothing or fall back to the element's full text content run together (title + views count + credits as one string), which is confusing. The title text inside the card is not programmatically associated with the interactive role.

**Fix:** Add an `aria-label` built from the card's title/name:

```tsx
// VerticalCard360 — add to article props:
aria-label={titleLines.join(" ")}

// AdCard360 — add to article props:
aria-label={title}
```

Apply the same pattern to the 768 variants.

---

### WR-04: `PhilosophyNarrowCardStack` uses array index as React `key` for card body parts

**File:** `src/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack.tsx:55-65`

**Issue:** `CardBodyParts` maps `parts` using `key={i}` (the array index). If `parts` is ever reordered or filtered at runtime, React will reconcile incorrectly, potentially reusing DOM nodes with stale content and suppressing animations. While the data is currently static, the pattern is fragile and was flagged as a risk area in the phase 03 focus.

**Fix:** Use the part text as key if it is unique, or add a stable `id` field to the `parts` type:

```tsx
// Quick fix using text content (works if parts text is unique per card):
parts.map((part, i) => (
  <span className={...} key={part.text}>
    {part.text}
  </span>
))
```

If duplicate text is possible, add `id: string` to the part type and use that as key.

---

### WR-05: `useCasesHorizontalCarousel` — optimistic arrow state can desync from scroll position

**File:** `src/widgets/cases/lib/use-cases-horizontal-carousel.ts:46-67` (consumed by `cases-section-360.tsx:212-213` and `cases-section-768.tsx:212-213`)

**Issue:** `onPrev` and `onNext` eagerly update `prevDisabled`/`nextDisabled` before `scrollBy` completes. If the browser clamps the scroll (e.g., the container is narrower than one card step, or the user is at a near-boundary position), the arrow may be visually disabled while more scroll is still possible — or enabled while no more scroll exists. The `sync` callback fired by the `scroll` event handler will eventually self-correct, but there is a visible flash of the wrong arrow state on slow scroll animations.

This is most noticeable on 360px where `VERT_CARD_W=208` and the container is `max-w-[360px]` with `px-4` (16px each side = 328px visible), meaning each step is 224px — just within range, but edge cases can trigger the desync.

**Fix:** Remove the optimistic state mutations from `onPrev`/`onNext` and rely solely on `sync` via the `scroll` event, which is already passive and correct:

```ts
const onPrev = useCallback(() => {
  const el = scrollRef.current;
  if (!el) return;
  el.scrollBy({ left: -stepPx, behavior: "smooth" });
}, [stepPx]);

const onNext = useCallback(() => {
  const el = scrollRef.current;
  if (!el) return;
  el.scrollBy({ left: stepPx, behavior: "smooth" });
}, [stepPx]);
```

The `scroll` event listener calls `sync` on each frame, keeping arrow state accurate without speculation.

---

## Info

### IN-01: `OrangeXiaomiMarquee1024` uses `-scale-y-100` — likely intended `-scale-x-100`

**File:** `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx:52`

**Issue:** The mi-icon wrapper applies `-scale-y-100` (vertical flip). From the Figma component name "mi + xiaomi", this seems intended to mirror the MI logo horizontally (i.e., `-scale-x-100`). A vertical flip would invert the logo upside-down, which is unlikely to match the design intent. This should be confirmed against the Figma source.

**Fix:** Verify in Figma. If the intent is a horizontal mirror:

```tsx
// Line 52 — change:
<div className="-scale-y-100 relative h-[30px] w-[29.998px] overflow-hidden">
// To:
<div className="-scale-x-100 relative h-[30px] w-[29.998px] overflow-hidden">
```

---

### IN-02: `eslint-disable @next/next/no-img-element` is hoisted to file top but applies to `<img>` tags that could safely use `next/image`

**File:** `src/widgets/cases/ui/cases-section-360.tsx:3`, `src/widgets/cases/ui/cases-section-768.tsx:3`, `src/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024.tsx:1`

**Issue:** The file-level disable suppresses the lint rule for all `<img>` usage in the file. In `cases-section-360.tsx` and `cases-section-768.tsx` the native `<img>` is only used for the views icon (a tiny inline SVG/PNG). All card images already use `next/image`. A targeted inline comment `{/* eslint-disable-next-line */}` would be narrower and safer.

**Fix:** Replace file-level disable with inline disable on the specific line, or convert the views icon to use `next/image`.

---

### IN-03: `BoneyardSkeleton` wrapper breaks `article` semantics in 360/768 card components

**File:** `src/widgets/cases/ui/cases-section-360.tsx:77-138`, `src/widgets/cases/ui/cases-section-768.tsx:76-139`

**Issue:** `BoneyardSkeleton` wraps the `<article>` element. If `BoneyardSkeleton` renders a `<div>` as its skeleton placeholder, the DOM hierarchy during loading state becomes `div > article`, which is valid but unusual. More importantly, during loading the skeleton is shown in place of the article, so the `role="button"` interactive content is hidden and keyboard focus is lost. Users who tab to a card while images are loading will land on the skeleton (if it renders as a non-interactive element) with no announcement.

This is an info-level note since the image load is typically fast on LCP-class images, but worth reviewing if `BoneyardSkeleton` has any interactive children.

---

### IN-04: Magic numbers for card dimensions are duplicated across 360/768 files without a shared constant

**File:** `src/widgets/cases/ui/cases-section-360.tsx:30-33`, `src/widgets/cases/ui/cases-section-768.tsx:30-33`

**Issue:** `VERT_CARD_W`, `VERT_CARD_H`, `AD_CARD_W`, `AD_CARD_H`, and `CASES_SCROLL_GAP_PX` are declared independently in both files with different values. The gap constant name is identical (`CASES_SCROLL_GAP_PX = 16`) in both files, which is fine since they have the same value. However there is no central source of truth — if a designer changes the 768 card dimensions, both the layout file and `sizes` props need coordinated updates.

**Fix:** Extract per-breakpoint dimension sets to `cases.data.ts` or a dedicated `cases-dimensions.ts` constant file, exported by breakpoint key. This would also make the `sizes` attribute on `next/image` easier to keep in sync.

---

_Reviewed: 2026-04-22_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
