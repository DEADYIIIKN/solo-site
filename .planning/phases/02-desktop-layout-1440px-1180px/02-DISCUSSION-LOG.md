# Phase 2: Desktop Layout (1440px + 1180px) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 02-desktop-layout-1440px-1180px
**Areas discussed:** Фото команды, Маркиз шириной, Figma MCP для карточек, Какая секция — service cards

---

## Фото команды (LY1440-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Устарел файл в репо | В public/assets/.../team.png лежит старая версия фото. Нужно заменить файл на актуальный. | ✓ |
| Next.js image кэш | Файл правильный, но Next.js Image Optimization закэшировал старую версию. | |
| Payload CMS отдаёт другое | Фото управляется через Payload CMS и в базе ссылка на старую версию. | |
| Не знаю, нужно проверить | Не уверен — нужно сначала посмотреть в браузере, что именно показывается. | |

**User's choice:** Устарел файл в репо

---

| Option | Description | Selected |
|--------|-------------|----------|
| Я предоставлю файл | Принесу PNG/JPG и скажу куда положить. Планировщик добавляет шаг замены файла. | ✓ |
| Есть в Payload CMS | Фото уже загружена в Payload Media. Нужно подтянуть src из API. | |
| Есть в Figma | Актуальная фотография есть в Figma. Можно экспортировать через Figma MCP. | |

**User's choice:** Я предоставлю файл
**Notes:** Plan must include a [BLOCKING] checkpoint for user to provide the file.

---

## Маркиз шириной (LY1180-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Стык двух копий виден | Полоса движется, но в какой-то момент виден шов между двумя повторяющимися сегментами — разрыв цикла. | |
| Полоса уже края окна | Справа видна пустая область родительского элемента — полоса не растягивается на 100% ширины. | |
| Полоса обрезается раньше края | Полоса не доходит до правого края — overflow clip режет раньше, чем нужно. | |

**User's choice:** Other — "По бокам видно и слева и справа как обрезаются линии"
**Notes:** Bilateral clipping on both sides = parent overflow-hidden constrains the marquee container. Not a segment-gap issue.

---

| Option | Description | Selected |
|--------|-------------|----------|
| 100vw breakout | Маркиз выходит за границы родителя через width: 100vw + negative margins. Минимальный скоп изменений. | |
| Убрать overflow выше | Найти обрезающий overflow-hidden на родительском элементе и убрать его. | |
| Перенести маркиз на уровень выше | Перенести маркиз в page.tsx / layout.tsx, где нет ограничений по ширине. | |

**User's choice:** Other — "Исправь как считаешь нужным, я не знаю"
**Notes:** Claude's Discretion — 100vw breakout preferred.

---

## Figma MCP для карточек (LY1440-01, LY1440-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Figma MCP автоматически | Исполнитель сам открывает Figma MCP, находит нужные ноды и извлекает px-значения. | ✓ |
| Я дам node ID вручную | Вы знаете конкретный Figma node ID карточки и передаёте его — исполнитель делает точный запрос. | |
| Визуальная инспекция в браузере | Открываем сайт в браузере + DevTools, сравниваем с Figma на глаз. Figma MCP не используем. | |

**User's choice:** Figma MCP автоматически

---

## Какая секция — service cards (LY1440-01, LY1440-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Business Goals секция | Секция с целями бизнеса — там есть грид карточек с текстом (четыре или больше). | ✓ |
| Levels секция | Блок уровней под карточками услуг — там есть заголовки уровней. | |
| Сами карточки услуг (внутри Vertical/Commercial) | Заголовки внутри больших анимированных карточек самих по себе прыгают. | |

**User's choice:** Business Goals секция

---

| Option | Description | Selected |
|--------|-------------|----------|
| Четвёртая в гриде | 4-я по порядку в DOM, исполнитель найдёт сам. | ✓ |
| Исполнитель разберётся сам | Figma MCP + визуальная инспекция покажут нужную карточку. | |

**User's choice:** Исполнитель разберётся сам

---

## Claude's Discretion

- Marquee fix approach: user deferred — 100vw breakout preferred
- Business Goals card #4 identification: executor identifies by DOM order + Figma MCP

## Deferred Ideas

None.
