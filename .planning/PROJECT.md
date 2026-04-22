# SOLO Site — Frontend Quality & Bug Fix

## What This Is

Сайт видеопродакшн-агентства SOLO (soloproduction.pro) — лендинг с кейсами, услугами, формой заявки и анимациями. Сайт построен на Next.js 15 + PayloadCMS 3 + SQLite, задеплоен в Docker с Traefik. Текущая задача — привести верстку к 1:1 с дизайном в Figma по всем брейкпоинтам, устранить кросс-браузерные баги Safari и наладить корректную работу анимаций.

## Core Value

Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.

## Requirements

### Validated

- ✓ Next.js 15 App Router + PayloadCMS 3 как CMS — existing
- ✓ Tailwind CSS 4 + TypeScript — existing
- ✓ Breakpoint-специфичные компоненты (360 / 480 / 768 / 1024 / 1440) — existing
- ✓ Docker-деплой на demo.soloproduction.pro — existing
- ✓ Анимация секций (boneyard-js скелетоны, CSS transitions) — existing (broken)

### Active

- [ ] **BUG-01** — Исправить баг формы: клик по тексту «Политика конфиденциальности» вызывает 404 → перезагрузку страницы (ссылка ведёт на `/privacy` которой не существует)
- [ ] **BUG-02** — Сделать весь текст лейбла чекбокса согласия кликабельным (не только чекбокс)
- [ ] **BUG-03** — Центровать текст кнопки «Оставить заявку» в форме внутри кейсов
- [ ] **BUG-04** — Выровнять названия услуг по нижнему краю на 1440px (сейчас прыгают вверх)
- [ ] **BUG-05** — Исправить длину текстового фрейма и начертание шрифта в карточке №4 услуг на 1440px
- [ ] **BUG-06** — Обновить фото команды (возможно проблема с кешом)
- [ ] **BUG-07** — Полосы клиентов: растянуть до полной ширины (видно где заканчиваются) на 1180px и 820px
- [ ] **BUG-08** — Уменьшить отступы между лого клиентов до значений из Figma на 360px (сейчас больше чем в дизайне)
- [ ] **BUG-09** — Стрелки карусели услуг смотрят не в те стороны на 820px и 360px
- [ ] **BUG-10** — Карусель услуг обрезает правую карточку на 820px и 360px
- [ ] **BUG-11** — Межстрочный интервал в карточках кейсов (Режиссер / DOP) слишком большой на 820px и 360px
- [ ] **BUG-12** — Межстрочный интервал и наложение текстов в секции воронки на 820px и 360px
- [ ] **BUG-13** — Пропавшее фото в секции «что мы делаем» на 360px
- [ ] **BUG-14** — Safari: анимации/transitions работают некорректно или не запускаются
- [ ] **BUG-15** — Safari: scroll-анимации и sticky-элементы ведут себя иначе чем в Chrome
- [ ] **ANI-01** — Починить анимацию секции с кейсами (работает некорректно, требует тестирования)
- [ ] **ANI-02** — Все анимации должны быть плавными (review + fix easing/duration)
- [ ] **DESIGN-01** — Pixel-perfect сверка всех блоков с Figma по всем брейкпоинтам (Figma: https://www.figma.com/design/Yo6xTXU1ZD7XYeem3tKqE3/...)
- [ ] **AUDIT-01** — Аудит стека: оценить целесообразность Next.js vs чистый React для данного сайта
- [ ] **AUDIT-02** — Аудит подхода к анимациям: текущий подход vs GSAP/Framer Motion/CSS
- [ ] **TEST-01** — E2E тесты ключевых сценариев (форма, карусели, анимации)
- [ ] **TEST-02** — Cross-browser тесты: Safari + Chrome + мобайл (Playwright)
- [ ] **TEST-03** — Unit тесты для компонентов форм и анимационной логики

### Out of Scope

- Реализация отправки формы (TODO в коде) — отдельная задача, не входит в текущий скоуп
- Рефакторинг 5 идентичных модалей консультации — технический долг, не приоритет сейчас
- Рефакторинг `business-goals.tsx` (1300 строк) — технический долг
- Миграция базы данных с SQLite на Postgres — инфраструктурная задача

## Context

**Текущее состояние:**
- Сайт живёт на `demo.soloproduction.pro`, Figma лист «Адаптивы актуальные»
- Брейкпоинты: 360px (мобайл), 820px (планшет портрет), 1180px (iPad горизонтально), 1440px+ (десктоп)
- Компоненты разбиты по брейкпоинтам — отдельные файлы per-breakpoint (паттерн установлен)
- `boneyard-js` — кастомный скелетон/анимация пакет с конфигом по брейкпоинтам
- Animations используют CSS transitions, возможно Framer Motion (нужно проверить в кодовой базе)

**Известные технические долги (из анализа кода):**
- `/privacy` страницы не существует — именно это вызывает баг BUG-01
- 5 почти идентичных модальных компонентов консультации (copy-paste by breakpoint)
- `business-goals.tsx` — 1300 строк, все брейкпоинты в одном файле
- `services-section-below-1024.tsx` — 1000 строк, аналогичная проблема

**Figma:**
- Лист: «Адаптивы актуальные»
- URL: https://www.figma.com/design/Yo6xTXU1ZD7XYeem3tKqE3/%D0%A1%D0%B0%D0%B9%D1%82-%D0%A1%D0%9E%D0%9B%D0%9E-%D1%81%D0%BE%D0%B3%D0%BB%D0%B0%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5--Copy-?node-id=783-7092&m=dev

## Constraints

- **Стек**: Next.js 15 + PayloadCMS 3 — не меняем в рамках текущего скоупа (аудит отдельной фазой)
- **Деплой**: Docker + Traefik, demo.soloproduction.pro — CI/CD pipeline сохраняется
- **Браузеры**: Chrome (последний) + Safari (последний) — оба должны работать одинаково
- **Брейкпоинты**: 360 / 820 / 1180 / 1440px — все должны соответствовать Figma
- **Паттерн компонентов**: per-breakpoint файлы — придерживаемся установленного паттерна

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Начать с bug fixes, не с pixel-perfect | Баги блокируют пользователей сейчас | — Pending |
| Аудит стека отдельной фазой | Нельзя менять стек не понимая последствий | — Pending |
| Figma MCP для pixel-perfect | Автоматическая сверка с дизайном точнее ручной | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 after initialization*
