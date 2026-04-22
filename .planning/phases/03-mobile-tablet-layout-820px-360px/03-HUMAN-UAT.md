# Phase 3: Human UAT Checklist

**Phase:** 03-mobile-tablet-layout-820px-360px  
**Created:** 2026-04-22  
**Status:** Awaiting user verification

9/11 must-haves verified statically. The following 5 items require browser verification.

---

## Setup

```bash
npm run dev
# Open http://localhost:3000
```

---

## Checklist

### 1. Стрелки карусели кейсов (LY820-01, LY360-01)

**Viewport:** 820px → 360px → 1440px  
**Section:** Кейсы

- [ ] Viewport 820px: левая стрелка (aria-label="Назад") показывает **←**
- [ ] Viewport 820px: правая стрелка (aria-label="Вперёд") показывает **→**
- [ ] Viewport 360px: аналогично ←/→
- [ ] Viewport 1440px: стрелки не регрессировали (тоже ←/→)

**Why:** SVG-константы FIGMA_LEFT_FILE/FIGMA_RIGHT_FILE имеют инвертированные имена относительно их SVG-геометрии. Нельзя подтвердить статически.

---

### 2. Фотография команды на 360px (LY360-03)

**Viewport:** 360px  
**Section:** «что мы делаем» (team section)

- [ ] Фото команды видно (не skeleton, не broken image)
- [ ] Контейнер h-[204px] с rounded-[8px] отображается корректно

**Why:** Asset delivery требует браузерного запроса (teamSectionAssets.teamPhoto).

---

### 3. Полосы логотипов клиентов на 820px (LY820-03)

**Viewport:** 820px  
**Section:** Клиенты (philosophy-clients)

- [ ] Бегущие строки с логотипами занимают **100% ширины viewport**
- [ ] **Горизонтальный скроллбар отсутствует** на странице

**Why:** 100vw breakout (width: 100vw + marginLeft: calc(50% - 50vw)) может создать горизонтальный overflow в зависимости от родительского контейнера.

---

### 4. Gap между логотипами на 360px (LY360-04)

**Viewport:** 360px  
**Section:** Клиенты (philosophy-clients)

- [ ] Gap между логотипами в строке выглядит **небольшим и пропорциональным** (20px, не 60px)
- [ ] Совпадает с дизайном Figma визуально

**Why:** MARQUEE_GAP_360_PX=20 инферировано логически (Figma MCP был недоступен). Нужна визуальная проверка.

---

### 5. Тексты воронки (Levels) на 820px и 360px (LY820-05, LY360-06)

**Viewport:** 820px → 360px  
**Section:** Уровни (levels / воронка)

- [ ] Viewport 820px: все 6 текстов (3× label серый + 3× title жирный) **видны без перекрытия**
- [ ] Viewport 820px: label расположен над title с видимым промежутком (~7px)
- [ ] Viewport 360px: аналогично — все 6 текстов видны

**Why:** Абсолютные координаты групп не были верифицированы через Figma MCP. Flex gap-[7px] реализован, но совпадение с дизайном нельзя подтвердить статически.

---

## Result

После проверки напишите в чат:
- **"approved"** — все пункты прошли
- **"issue: [описание]"** — если что-то не так (укажите какой пункт)
