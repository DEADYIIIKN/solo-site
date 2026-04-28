---
phase: 13-static-media-optimization-p0
plan: 03
type: execute
wave: 2
depends_on: [13-01, 13-02]
files_modified:
  - public/assets/figma/**
autonomous: false
requirements: [PERF-05]
must_haves:
  truths:
    - "Каждый удалённый файл подтверждённый дубликат (sha256 совпадает с canonical копией)"
    - "Перед удалением grep -r проверяет 0 references в src/"
    - "Total /public/assets < 60 MB (было 141 MB)"
    - "Build проходит после cleanup, demo рендерит без 404"
  artifacts:
    - path: "public/assets/"
      provides: "deduplicated static media"
  key_links:
    - from: "src/widgets/footer/model/footer.data.ts"
      to: "public/assets/figma/footer-1440/blog-card-{1,2,3}.jpg"
      via: "canonical refs (НЕ удалять)"
      pattern: "footer-1440/blog-card"
---

# Plan 13-03: Cleanup `/public/assets` дубликатов

**Phase:** 13 — Static Media Optimization (P0)
**REQ-IDs:** PERF-05
**Depends on:** 13-01, 13-02 (refs обновлены — иначе удалим живой файл)
**Status:** ready

<objective>
Удалить подтверждённые дубликаты медиа в `/public/assets/figma/` после того как 13-01 и 13-02 закончили миграцию refs. Cleanup boundary: удаляем ТОЛЬКО файлы где sha256 совпадает с canonical копией И grep -r показывает 0 references в src/. Цель: 141 MB → < 60 MB.
</objective>

<context>
@.planning/PROJECT.md
@.planning/REQUIREMENTS.md
@.planning/research/AUDIT-PSI.md
@.planning/phases/13-static-media-optimization-p0/13-CONTEXT.md
@.planning/phases/13-static-media-optimization-p0/13-01-SUMMARY.md
@.planning/phases/13-static-media-optimization-p0/13-02-SUMMARY.md

<interfaces>
Известные группы дубликатов (из AUDIT-PSI.md + CONTEXT.md):

**Group A — Footer blog-card дубликаты (canonical: `figma/footer-1440/blog-card-{1,2,3}.jpg`):**
- `figma/9043-footer-article-accessory-card-1440/telegram-cloud-document...jpg` ↔ `figma/9044-...media.../*.jpg`
- `figma/9047-footer-article-brief-card-1440/rectangle38.jpg` ↔ `figma/9048-...media.../rectangle38.jpg`
- `figma/9050-footer-article-branding-card-1440/image.jpg` ↔ `figma/9052-...media.../image.jpg`
- `figma/blog/...` (если существует)

**Group B — PNG per-breakpoint дубликаты (после 13-02 удалены из data, остались на диске):**
- `figma/10547-business-goals-360/rectangle75.png` (3.2 MB)
- `figma/11323-business-goals-480/rectangle75.png` (3.2 MB)
- `figma/11947-business-goals-768/rectangle75.png` (3.2 MB)
- `figma/9656-first-screen-1440/hero-image.png` (2.9 MB) — после конверсии в .jpg
- `figma/9003-hero-screen-1024/hero-image.png` (2.9 MB)
- `figma/1440-fresh/hero-image.png` (если есть)
- `figma/9656-team-what-we-do-1440/team.png` (2.9 MB)
- `figma/11972-showreel-768/02-showreel.png` (2.9 MB)
- `figma/8969-what-we-do-card-traffic-image-1024/image.jpg` (3.2 MB) — заменён JPG quality 85 в 13-02

**Canonical refs (НЕ ТРОГАТЬ):**
- `figma/footer-1440/blog-card-{1,2,3}.jpg` — используется footer.data.ts
- `figma/9656-first-screen-1440/hero-image.jpg` (NEW) — используется first-screen.data.ts
- `figma/9656-team-what-we-do-1440/team.jpg` (NEW) — используется team.data.ts
- `figma/9656-business-goals-1440/rectangle75.jpg` (NEW) — используется business-goals.data.ts
- `figma/11972-showreel-1440/02-showreel.jpg` (NEW) — используется showreel.tsx
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Audit — sha256 + grep -r для каждого подозрительного файла</name>
  <files>scripts/audit-asset-duplicates.sh</files>
  <action>
    1. Создать `scripts/audit-asset-duplicates.sh`:
       ```bash
       #!/usr/bin/env bash
       set -euo pipefail
       cd "$(dirname "$0")/.."

       # Кандидаты на удаление (после 13-01 + 13-02)
       CANDIDATES=(
         "public/assets/figma/9043-footer-article-accessory-card-1440/telegram-cloud-document252627272500332767172.jpg"
         "public/assets/figma/9044-footer-article-accessory-media-1440/telegram-cloud-document252627272500332767172.jpg"
         "public/assets/figma/9047-footer-article-brief-card-1440/rectangle38.jpg"
         "public/assets/figma/9048-footer-article-brief-media-1440/rectangle38.jpg"
         "public/assets/figma/9050-footer-article-branding-card-1440/image.jpg"
         "public/assets/figma/9052-footer-article-branding-media-1440/image.jpg"
         "public/assets/figma/10547-business-goals-360/rectangle75.png"
         "public/assets/figma/11323-business-goals-480/rectangle75.png"
         "public/assets/figma/11947-business-goals-768/rectangle75.png"
         "public/assets/figma/9656-first-screen-1440/hero-image.png"
         "public/assets/figma/9003-hero-screen-1024/hero-image.png"
         "public/assets/figma/1440-fresh/hero-image.png"
         "public/assets/figma/9656-team-what-we-do-1440/team.png"
         "public/assets/figma/11972-showreel-768/02-showreel.png"
         "public/assets/figma/8969-what-we-do-card-traffic-image-1024/image.jpg"
       )

       echo "=== sha256 + grep refs ==="
       for f in "${CANDIDATES[@]}"; do
         [[ -f "$f" ]] || { echo "SKIP (not found): $f"; continue; }
         hash=$(shasum -a 256 "$f" | cut -d' ' -f1)
         basename=$(basename "$f")
         refs=$(grep -rn "$basename" src/ 2>/dev/null | wc -l | tr -d ' ')
         echo "$hash  refs=$refs  $f"
       done
       ```
    2. `chmod +x scripts/audit-asset-duplicates.sh && ./scripts/audit-asset-duplicates.sh > .planning/phases/13-static-media-optimization-p0/audit-output.txt`.
    3. Для каждой группы (A/B) — проверить что hashes совпадают между card/media парой (Group A) и `refs=0` (после 13-01/13-02).
    4. Зафиксировать в `audit-output.txt` финальный список к удалению. Файлы где `refs > 0` — НЕ удалять, escalate как concern.
  </action>
  <verify>
    <automated>./scripts/audit-asset-duplicates.sh | tee .planning/phases/13-static-media-optimization-p0/audit-output.txt</automated>
  </verify>
  <done>
    audit-output.txt создан, для каждого кандидата зафиксированы sha256 + count refs. Список к удалению согласован (только файлы с refs=0).
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Audit вывод с sha256 и refs для каждого кандидата. Перед фактическим удалением — нужно глазами свериться что список безопасный.</what-built>
  <how-to-verify>
    1. Прочитать `.planning/phases/13-static-media-optimization-p0/audit-output.txt`.
    2. Подтвердить: для каждого файла `refs=0` ИЛИ это явный дубликат (тот же hash + один из пары card/media уже не используется).
    3. Если `refs > 0` для какого-то ожидаемого кандидата — escalate (это значит 13-01 или 13-02 пропустили какой-то ref).
  </how-to-verify>
  <resume-signal>Type "approved with list: [files]" с финальным списком, либо "fix-refs" если есть оставшиеся references.</resume-signal>
</task>

<task type="auto">
  <name>Task 2: Удалить подтверждённые дубликаты + verify build</name>
  <files>public/assets/figma/**</files>
  <action>
    1. Удалить все файлы из approved-списка (Task 1 checkpoint). Использовать `git rm` чтобы удаление было tracked:
       ```bash
       git rm public/assets/figma/9043-...jpg \
              public/assets/figma/9044-...jpg \
              ... (полный список из audit-output.txt) ...
       ```
    2. Если директория пустая после удаления — `rmdir` неявно через `git rm` (либо `find public/assets/figma -type d -empty -delete`).
    3. `du -sm public/assets/` → должно быть < 60 MB.
    4. `pnpm build` → не должно быть warning о missing files / 404 на статике.
    5. `pnpm test` → unit-тесты passing (нет fixture references на удалённые пути).
  </action>
  <verify>
    <automated>du -sm public/assets/ && pnpm build && pnpm test</automated>
  </verify>
  <done>
    - `du -sm public/assets/` < 60 MB
    - pnpm build passes без errors / 404 warnings
    - pnpm test passes
    - git status показывает удалённые файлы как staged deletions
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Cleanup выполнен. Repo /public/assets уменьшен с 141 MB до < 60 MB. Build + tests passing.</what-built>
  <how-to-verify>
    1. `git status` — список удалённых файлов соответствует approved-списку из Task 1.
    2. `du -sm public/assets/` < 60 MB.
    3. После deploy на demo: открыть `/` на mobile + desktop → DevTools Network → 0 × 404 на figma/-paths.
    4. Smoke E2E: `pnpm test:e2e` — passing на chromium + webkit.
    5. Visual: открыть все 5 breakpoints (resize browser) → нет broken images.
  </how-to-verify>
  <resume-signal>Type "approved" если ОК, иначе откатить через `git restore --staged --worktree -- public/assets/figma/...`.</resume-signal>
</task>

</tasks>

<verification>
- audit-output.txt подтверждает sha256 совпадения и refs=0 для каждого удалённого файла
- `du -sm public/assets/` < 60 MB
- pnpm build + pnpm test passing
- 0 × 404 на figma/-paths в Network tab после deploy
- E2E suite passing
</verification>

<success_criteria>
- /public/assets < 60 MB (было 141 MB) — снижение ≥ 50%
- 0 broken refs в build
- 0 × 404 в demo Network tab
- E2E + unit tests passing
</success_criteria>

<output>
После завершения создать `.planning/phases/13-static-media-optimization-p0/13-03-SUMMARY.md` с:
- before/after `du -sm` numbers
- list of removed files (с sha256 для traceability)
- любые files которые НЕ удалены и почему (escalation для отдельной задачи)
</output>
