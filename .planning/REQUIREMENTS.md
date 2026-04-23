# Requirements: SOLO Site — Frontend Quality & Bug Fix

**Defined:** 2026-04-22
**Core Value:** Сайт должен одинаково работать в Chrome и Safari, корректно выглядеть по всем брейкпоинтам и не ломаться — каждый баг стоит доверия клиента.

## v1 Requirements

### Form Bugs

- [ ] **FORM-01**: Клик по тексту «Политика конфиденциальности» в форме не вызывает перезагрузку страницы (создать `/privacy` страницу или изменить поведение ссылки)
- [ ] **FORM-02**: Весь текст лейбла чекбокса согласия на обработку персональных данных является кликабельным (не только сам чекбокс)
- [ ] **FORM-03**: Текст кнопки «Оставить заявку» в форме внутри кейсов отображается по центру кнопки

### Layout 1440px (Desktop)

- [ ] **LY1440-01**: Названия услуг выровнены по нижнему краю карточки как в Figma (сейчас прыгают вверх)
- [ ] **LY1440-02**: В карточке №4 услуг длина текстового фрейма и начертание шрифта соответствуют Figma
- [ ] **LY1440-03**: Фотография команды отображается актуальная (не кешированная старая версия)

### Layout 1180px (iPad Horizontal)

- [ ] **LY1180-01**: Полосы прокрутки клиентов растянуты на полную ширину — не видно где они заканчиваются

### Layout 820px (Tablet Portrait)

- [ ] **LY820-01**: Стрелки карусели услуг смотрят в правильные стороны (← →)
- [ ] **LY820-02**: Карусель услуг не обрезает правую карточку
- [ ] **LY820-03**: Полосы клиентов растянуты на полную ширину — не видно где заканчиваются
- [ ] **LY820-04**: Межстрочный интервал в карточках кейсов (Режиссер / DOP) соответствует Figma
- [ ] **LY820-05**: Межстрочный интервал и расположение текстов в секции воронки соответствуют Figma

### Layout 360px (Mobile)

- [ ] **LY360-01**: Стрелки карусели услуг смотрят в правильные стороны (← →)
- [ ] **LY360-02**: Карусель услуг не обрезает правую карточку и правый контент виден
- [ ] **LY360-03**: Фотография в секции «что мы делаем» отображается корректно (сейчас пропала)
- [ ] **LY360-04**: Отступы между лого клиентов соответствуют Figma (сейчас больше чем в дизайне)
- [ ] **LY360-05**: Межстрочный интервал в карточках кейсов соответствует Figma
- [ ] **LY360-06**: Тексты в секции воронки не накладываются друг на друга

### Safari Cross-Browser

- [x] **SAFARI-01
**: Анимации и CSS transitions работают в Safari идентично Chrome
- [x] **SAFARI-02
**: Scroll-анимации и sticky-элементы работают в Safari идентично Chrome

### Animations

- [x] **ANI-01
**: Анимация секции с кейсами работает корректно (scroll-based transition между кейсами)
- [x] **ANI-02
**: Все анимации сайта имеют плавный easing (нет рывков, мерцания, некорректных состояний)

### Pixel-Perfect (Figma)

- [ ] **PX-01**: Все блоки на 1440px соответствуют дизайну Figma (лист «Адаптивы актуальные»)
- [ ] **PX-02**: Все блоки на 1180px соответствуют дизайну Figma
- [ ] **PX-03**: Все блоки на 820px соответствуют дизайну Figma
- [ ] **PX-04**: Все блоки на 360px соответствуют дизайну Figma
- [ ] **PX-05**: Все блоки на 480px соответствуют дизайну Figma

### Stack Audit

- [ ] **AUDIT-01**: Проведён аудит: документировано обоснование использования Next.js vs React SPA для данного сайта-лендинга
- [ ] **AUDIT-02**: Проведён аудит подхода к анимациям: текущий boneyard-js + CSS vs GSAP / Framer Motion, задокументирована рекомендация

### Testing

- [ ] **TEST-01**: E2E тесты для форм (отправка, валидация, чекбокс согласия) на Playwright
- [ ] **TEST-02**: Cross-browser тесты: Safari + Chrome + мобайл (Playwright multi-browser)
- [ ] **TEST-03**: Unit тесты для компонентов форм и хуков анимации

## v2 Requirements

### Refactoring (Tech Debt)

- **REFAC-01**: Унификация 5 идентичных компонентов модалей консультации в один `ConsultationModalBase`
- **REFAC-02**: Разбивка `business-goals.tsx` (1300 строк) на per-breakpoint компоненты
- **REFAC-03**: Разбивка `services-section-below-1024.tsx` (1000 строк) на per-breakpoint компоненты
- **REFAC-04**: Перенос shared-типов форм из 1440-компонента в отдельный model-файл

### Form Functionality

- **FUNC-01**: Реализовать отправку данных формы в CRM/Telegram/n8n (сейчас TODO в коде)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Отправка формы (лид-capture) | Отдельная задача вне текущего скоупа |
| Миграция SQLite → Postgres | Инфраструктурная задача, не влияет на frontend |
| Видео в git (56MB bts-ozon.mp4) | Отдельный cleanup, не блокирует работу |
| SEO оптимизация | Вне скоупа данного milestone |
| Новые страницы / секции | Только правки существующих |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 1 | Pending |
| FORM-02 | Phase 1 | Pending |
| FORM-03 | Phase 1 | Pending |
| LY1440-01 | Phase 2 | Pending |
| LY1440-02 | Phase 2 | Pending |
| LY1440-03 | Phase 2 | Pending |
| LY1180-01 | Phase 2 | Pending |
| LY820-01 | Phase 3 | Pending |
| LY820-02 | Phase 3 | Pending |
| LY820-03 | Phase 3 | Pending |
| LY820-04 | Phase 3 | Pending |
| LY820-05 | Phase 3 | Pending |
| LY360-01 | Phase 3 | Pending |
| LY360-02 | Phase 3 | Pending |
| LY360-03 | Phase 3 | Pending |
| LY360-04 | Phase 3 | Pending |
| LY360-05 | Phase 3 | Pending |
| LY360-06 | Phase 3 | Pending |
| SAFARI-01 | Phase 4 | Pending |
| SAFARI-02 | Phase 4 | Pending |
| ANI-01 | Phase 4 | Pending |
| ANI-02 | Phase 4 | Pending |
| PX-01 | Phase 5 | Pending |
| PX-02 | Phase 5 | Pending |
| PX-03 | Phase 5 | Pending |
| PX-04 | Phase 5 | Pending |
| PX-05 | Phase 5 | Pending |
| AUDIT-01 | Phase 1 | Pending |
| AUDIT-02 | Phase 1 | Pending |
| TEST-01 | Phase 6 | Pending |
| TEST-02 | Phase 6 | Pending |
| TEST-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after initial definition*
