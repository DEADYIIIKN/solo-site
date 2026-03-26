# First Screen Header Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать первый экран сайта с точным `header + hero + geo-block` по Figma для мобильных, планшетных и desktop-кадров.

**Architecture:** Первый экран реализуется отдельным `widget`, внутри которого `header` и `hero` разделены по ответственности. `Hero` держит все одноразовые декоративные слои, CTA и geo-блок, а `header` использует один компонент с layout-ветками под mobile/tablet и desktop-поведение из Figma.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4 utilities, локальные Figma assets из `public/assets/figma`, общие токены из `src/app/globals.css`

---

### Task 1: Create first-screen widget structure

**Files:**
- Create: `src/widgets/first-screen/model/first-screen.data.ts`
- Create: `src/widgets/first-screen/ui/first-screen.tsx`
- Create: `src/widgets/first-screen/ui/first-screen-header.tsx`
- Create: `src/widgets/first-screen/ui/first-screen-hero.tsx`
- Create: `src/widgets/first-screen/index.ts`

- [ ] **Step 1: Define screen data and asset references**
- [ ] **Step 2: Build shared widget shell and export surface**
- [ ] **Step 3: Implement header with breakpoint-specific layout branches**
- [ ] **Step 4: Implement hero with headline, CTA, geo-block and hero image**

### Task 2: Wire first screen into app entry

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace empty main with first-screen widget**

### Task 3: Tune tokens and verify screen integration

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add any missing first-screen-only utility tokens/classes**
- [ ] **Step 2: Run `pnpm lint`**
- [ ] **Step 3: Run `pnpm typecheck`**
- [ ] **Step 4: Run `pnpm build`**
