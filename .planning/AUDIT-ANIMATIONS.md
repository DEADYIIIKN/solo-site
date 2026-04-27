# Аудит анимаций: boneyard-js + CSS vs GSAP vs Framer Motion

**Дата аудита:** 2026-04-22
**Автор:** Claude (плановый аудит Phase 1, AUDIT-02)

---

## Контекст

### Текущий подход

В кодовой базе используется два слоя анимации:

1. **boneyard-js** (`^1.7.6`) — кастомный скелетон/reveal-пакет. Компонент `BoneyardSkeleton` оборачивает контент, показывая shimmer-placeholder во время загрузки и плавно проявляя контент (`transition={220}`). Внутри boneyard-js используется Intersection Observer + CSS transitions для reveal-эффектов.

2. **CSS transitions** — hover-состояния и scroll-driven переходы в секции кейсов (ANI-01) реализованы через Tailwind CSS классы (`transition`, `duration-*`, `ease-*`) и нативные CSS-свойства.

**GSAP** и **Framer Motion** в проекте не установлены (подтверждено `package.json`).

### Зависимость Phase 4

Phase 4 (Safari + Animations) требует, чтобы все анимации и transitions работали **идентично в Safari и Chrome**. Это критично:

- **SAFARI-01**: CSS transitions и анимации должны корректно запускаться и завершаться в Safari (latest) без мерцания и пропущенных состояний
- **SAFARI-02**: Scroll-driven анимации и sticky-элементы должны вести себя одинаково в Safari и Chrome
- **ANI-01**: Scroll-based transition в секции кейсов должен работать без визуальных глитчей
- **ANI-02**: Все анимации должны использовать плавный easing

Выбор библиотеки в данном аудите является входным условием для планирования Phase 4.

---

## Сравнение

| Критерий | boneyard-js + CSS | GSAP | Framer Motion |
|---|---|---|---|
| **Safari-совместимость** | Частичная. `IntersectionObserver` хорошо поддерживается в Safari (≥12.1). CSS `transition` с `transform`/`opacity` работают надёжно. Однако `scroll-timeline` и `animation-timeline` (CSS Scroll-Driven Animations) **НЕ поддерживаются в Safari < 18** (по состоянию на 2025). Если ANI-01 использует CSS scroll-timeline — это сломано в Safari. | Отличная. GSAP намеренно избегает нативных CSS animation API, которые Safari поддерживает с задержкой. Использует `requestAnimationFrame` + прямую манипуляцию DOM-свойствами. Совместимость с Safari верифицирована годами. Поддерживает Safari 11+. | Хорошая. Использует `transform`/`opacity` для аппаратного ускорения. ScrollLinked (`useScroll`) через Motion Values не зависит от CSS scroll-timeline — работает в Safari. Ряд экспериментальных фич (Scroll-Driven по CSS spec) может отсутствовать, но core API стабилен в Safari. |
| **Интеграция с React 19** | Нейтральная. boneyard-js работает как React-компонент (`"use client"`). Нет конфликтов с React 19 concurrent features, но и глубокой интеграции нет. CSS transitions не зависят от React. | Осторожная интеграция. GSAP — императивная библиотека, требует `useGSAP()` хук (из `@gsap/react`) для корректной работы с React lifecycle и concurrent mode. При неправильном использовании может вызвать двойные анимации или утечки. | Нативная. Framer Motion (Motion) разработан специально для React. `motion.*` компоненты, `AnimatePresence`, `useInView`, `useScroll` — всё работает с React 19 Strict Mode и concurrent features без обходных путей. |
| **Scroll-driven анимации** | Ограниченная. boneyard-js: reveal по IntersectionObserver (не scroll-position). Нативный CSS `animation-timeline: scroll()` — современный API, не работает в Safari < 18. Реализация ANI-01 требует либо кастомного JS, либо ограничена. | Мощная. ScrollTrigger плагин (GSAP) — индустриальный стандарт для scroll-driven анимаций. Работает во всех браузерах, включая Safari, через position-based расчёты без CSS Scroll API. Поддерживает pin, scrub, snap. | Хорошая. `useScroll()` + `useTransform()` обеспечивают scroll-position driven анимации через Motion Values. Не зависит от CSS scroll-timeline — работает в Safari. Декларативный API, легко интегрируется в JSX. |
| **Размер бандла** | Минимальный. boneyard-js — маленький пакет (~5 KB). CSS transitions — нулевой JS overhead. Framer/GSAP не установлены. | Средний. GSAP core ~27 KB gzip. ScrollTrigger добавляет ~12 KB. Итого ~39 KB gzip для полного scroll-capable набора. | Средний. Framer Motion ~45 KB gzip для полного пакета. Поддерживает tree-shaking (`motion/react` — подмножество), можно снизить до ~17–25 KB при использовании только нужных API. |
| **Кривая обучения** | Низкая (уже в проекте). CSS transitions — стандарт. boneyard-js — простой wrapper. | Средняя. GSAP API хорошо документирован, но императивный стиль (`gsap.to()`, `gsap.timeline()`) требует понимания lifecycle hooks в React. `useGSAP` нужен для безопасного использования с concurrent features. | Низкая–средняя. Декларативный JSX-подход интуитивен для React-разработчиков. `<motion.div animate={{ opacity: 1 }}>` читается прозрачно. `useScroll`/`useInView` имеют чёткую документацию. |
| **Поддержка CSS transitions** | Нативная поддержка. Hover-состояния через Tailwind `transition-*` классы остаются без изменений. boneyard-js добавляет поверх CSS transitions для reveal. | Дополняет. GSAP может анимировать те же свойства, что и CSS transitions, но через JS. Hover-эффекты можно оставить на CSS; GSAP заменяет сложные scroll/timeline анимации. | Заменяет или дополняет. `motion.div` с `whileHover` заменяет CSS hover transitions, или можно оставить CSS transitions нетронутыми и добавить Motion только для scroll/reveal. |
| **Декларативный API** | Частично. CSS — декларативный. boneyard-js — компонент-wrapper (декларативный в JSX, но ограниченный по возможностям). | Нет. Полностью императивный. `gsap.to(element, {...})` — прямая манипуляция. Требует `useRef` и `useGSAP`. Мощно, но verbose для React-проектов. | Да. Первоклассный декларативный API: `animate`, `initial`, `exit`, `whileInView`, `whileHover` как JSX-props. Стиль соответствует React-философии. |
| **Требует установки** | Нет (уже установлен). | Да. `pnpm add gsap @gsap/react` — две новые зависимости. | Да. `pnpm add motion` (бывший Framer Motion, пакет переименован в `motion`) — одна зависимость. |
| **Активная поддержка (2025)** | Низкая активность. boneyard-js — нишевый пакет с ограниченным сообществом. v1.7.6 — последняя версия. Нет гарантий совместимости с будущими React-версиями. | Высокая. GSAP ~20M npm downloads/месяц, активно поддерживается GreenSock, регулярные релизы. GSAP 3.x стабилен, GSAP 4.x в разработке. | Высокая. Motion (Framer Motion) — один из наиболее популярных React-анимационных пакетов (~10M downloads/месяц), активно поддерживается Matt Perry / Framer. v11.x — актуальная LTS версия. |

---

## Recommendation

**Рекомендация: перейти на Framer Motion (пакет `motion`) для замены boneyard-js reveal-анимаций и реализации scroll-driven анимации в секции кейсов (ANI-01).**

**Обоснование:**

1. **Safari-совместимость — главный критерий Phase 4.** Framer Motion использует Motion Values и `requestAnimationFrame`-based scroll tracking (`useScroll`) вместо CSS `animation-timeline`, которого нет в Safari < 18. Это напрямую закрывает риск из STATE.md: «boneyard-js + CSS transitions may need Safari-specific vendor prefix audit before Phase 4».

2. **Декларативный React-first API снижает риски.** В отличие от GSAP (императивный, требует `useGSAP` для concurrent safety), Framer Motion/Motion работает как обычные React-компоненты. Это снижает вероятность утечек и двойных анимаций при concurrent rendering React 19.

3. **`useInView` + `useScroll` + `useTransform` закрывают все кейсы проекта.** Reveal-анимации (замена boneyard-js shimmer → Framer `initial`/`whileInView`), scroll-driven переход между кейсами (ANI-01 через `useScroll`/`useTransform`), hover-эффекты (либо оставить на CSS, либо `whileHover`).

4. **boneyard-js выводится из проекта.** Пакет с низкой активностью поддержки, нишевым API и неподтверждённой Safari-совместимостью для сложных анимаций. В Phase 4 его функциональность полностью покрывается Framer Motion с меньшим риском.

5. **GSAP не выбран**, несмотря на превосходную Safari-совместимость, по следующим причинам: (a) императивный API создаёт friction в React 19-проекте, (b) ScrollTrigger добавляет ~39 KB vs ~25 KB Motion с tree-shaking, (c) для данного проекта (лендинг, ограниченный набор анимаций) мощность GSAP избыточна.

**Конкретные шаги для Phase 4:** `pnpm add motion`, мигрировать `BoneyardSkeleton` → `motion.div` с `initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}`, реализовать ANI-01 через `useScroll`/`useTransform`, верифицировать в Safari.
