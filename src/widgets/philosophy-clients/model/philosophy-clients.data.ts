/** Figma 783:9294 — «6 Философия, клиенты», брейкпоинт 1440 */
export const philosophyClients1440Assets = {
  teamPhoto: "/assets/figma/7830-philosophy-clients-1440/team-card.jpg",
  patternGrid: "/assets/figma/7830-philosophy-clients-1440/pattern-grid.svg",
} as const;

export const philosophyClients1440Content = {
  philosophyEyebrow: "Наша философия",
  clientsEyebrow: "клиенты",
  cards: [
    {
      id: "01",
      title: "Креатив",
      body: {
        parts: [
          { text: "Мы помогаем брендам креативно выделяться ", emphasis: "none" as const },
          { text: "в\u00a0перегруженной интернет-среде,", emphasis: "italic" as const },
          {
            text: " в\u00a0понятной форме доносить смыслы и\u00a0влиять на\u00a0решение человека о\u00a0покупке.",
            emphasis: "none" as const,
          },
        ],
      },
    },
    {
      id: "02",
      title: "Стратегия",
      body: {
        parts: [
          { text: "Мы внимательно относимся к\u00a0тому, ", emphasis: "none" as const },
          { text: "что мы снимаем, а главное зачем. ", emphasis: "italic" as const },
          {
            text: "Используем данные для анализа рынка и ниши, чтобы креатив и\u00a0контент работали согласованно.",
            emphasis: "none" as const,
          },
        ],
      },
    },
    {
      id: "03",
      title: "Команда",
      body: {
        parts: [
          { text: "Над проектом работает слаженная ", emphasis: "none" as const },
          { text: "команда специалистов,", emphasis: "italic" as const },
          { text: " где у каждого своя зона ответственности.", emphasis: "none" as const },
        ],
      },
    },
    {
      id: "04",
      title: "Прозрачность",
      body: {
        parts: [
          { text: "Мы показываем и\u00a0согласовываем каждый этап работы. Вы всегда понимаете, ", emphasis: "none" as const },
          { text: "что делается, зачем и к какому результату это ведет.", emphasis: "italic" as const },
        ],
      },
    },
    {
      id: "05",
      title: "Аутентичность",
      body: {
        parts: [
          {
            text: "Мы верим, что каждый бизнес уникален. Поэтому к\u00a0каждому проекту подходим индивидуально. Мы\u00a0создаем ",
            emphasis: "none" as const,
          },
          { text: "полностью аутентичный контент,", emphasis: "italic" as const },
          { text: " который отражает бренд и\u00a0продукт.", emphasis: "none" as const },
        ],
      },
    },
  ],
} as const;

/** Фон карточки «Прозрачность» — как в Figma 783:9319 */
export const philosophyCard04RadialBg =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 640 340' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-6.1328e-15 -27.8 52.759 -1.5126e-13 320 278)'><stop stop-color='rgba(246,43,10,1)' offset='0.033654'/><stop stop-color='rgba(251,68,5,1)' offset='0.26683'/><stop stop-color='rgba(255,92,0,1)' offset='0.5'/><stop stop-color='rgba(255,108,17,0.85)' offset='0.625'/><stop stop-color='rgba(255,123,34,0.7)' offset='0.75'/><stop stop-color='rgba(255,154,68,0.4)' offset='1'/></radialGradient></defs></svg>\")";

/** Figma 783:8633 — «Прозрачность», 478×270 */
export const philosophyCard04RadialBg1024 =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 478 270' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-4.5804e-15 -22.076 39.405 -1.2012e-13 239 220.76)'><stop stop-color='rgba(246,43,10,1)' offset='0.033654'/><stop stop-color='rgba(251,68,5,1)' offset='0.26683'/><stop stop-color='rgba(255,92,0,1)' offset='0.5'/><stop stop-color='rgba(255,108,17,0.85)' offset='0.625'/><stop stop-color='rgba(255,123,34,0.7)' offset='0.75'/><stop stop-color='rgba(255,154,68,0.4)' offset='1'/></radialGradient></defs></svg>\")";

/** Въезд карточек — масштаб 270/340 от 1440, Figma 783:8605 */
export const PHILOSOPHY_CARD_ENTER_OFFSET_Y_1024 = [167, 125, 83, 41, 41] as const;

/**
 * Высота слоя со стопкой на 1024: низ 5-й карточки в покое ≈640px + въезд (до 41px) без обрезки при overflow-hidden.
 * Совпадает по смыслу с 1440 (запас под анимацию), не сжимать до 640 — иначе 05-й слайд «снизу пополам».
 */
export const PHILOSOPHY_STACK_MIN_H_PX_1024 = 700;

export const strategyBarGradient =
  "linear-gradient(180deg, rgba(255, 154, 68, 0) 0%, rgba(255, 124, 49, 0.8) 71.635%, rgba(255, 124, 49, 0.95) 88%, rgba(255, 92, 0, 0.95) 99.519%)";

/** Figma 783:11253 — «Прозрачность», 432×270 */
export const philosophyCard04RadialBg432 =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 432 270' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-4.1396e-15 -22.076 35.613 -1.2012e-13 216 220.76)'><stop stop-color='rgba(246,43,10,1)' offset='0.033654'/><stop stop-color='rgba(251,68,5,1)' offset='0.26683'/><stop stop-color='rgba(255,92,0,1)' offset='0.5'/><stop stop-color='rgba(255,108,17,0.85)' offset='0.625'/><stop stop-color='rgba(255,123,34,0.7)' offset='0.75'/><stop stop-color='rgba(255,154,68,0.4)' offset='1'/></radialGradient></defs></svg>\")";

/** Figma 783:10477 — «Прозрачность», 328×220 */
export const philosophyCard04RadialBg360 =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 328 220' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-3.1431e-15 -17.988 27.039 -9.7873e-14 164 179.88)'><stop stop-color='rgba(246,43,10,1)' offset='0.033654'/><stop stop-color='rgba(251,68,5,1)' offset='0.26683'/><stop stop-color='rgba(255,92,0,1)' offset='0.5'/><stop stop-color='rgba(255,108,17,0.85)' offset='0.625'/><stop stop-color='rgba(255,123,34,0.7)' offset='0.75'/><stop stop-color='rgba(255,154,68,0.4)' offset='1'/></radialGradient></defs></svg>\")";

/** Figma 783:11863…783:11868 — столбики «Стратегия», карточка 432×270 */
export const STRATEGY_BARS_432 = [
  { bottom: 0, left: 0, h: 51, w: 73, top: undefined as number | undefined },
  { left: 73, top: 169, h: 101, w: 72, bottom: undefined },
  { left: 145, top: 110, h: 160, w: 73, bottom: undefined },
  { left: 218, top: 71, h: 199, w: 72, bottom: undefined },
  { left: 290, top: 41, h: 229, w: 73, bottom: undefined },
  { left: 363, bottom: 0, h: 270, w: 72, top: undefined },
] as const;

/** Figma 783:10464…783:10468 — «Стратегия», карточка 328×220 */
export const STRATEGY_BARS_360 = [
  { bottom: -0.03, left: 0, h: 48.995, w: 65.961, top: undefined as number | undefined },
  { left: 65.96, top: 122.97, h: 97.029, w: 65.058, bottom: undefined },
  { left: 131.02, top: 66.29, h: 153.709, w: 65.961, bottom: undefined },
  { left: 196.98, top: 28.82, h: 191.175, w: 65.058, bottom: undefined },
  { left: 262.04, top: 0, h: 219.996, w: 65.961, bottom: undefined },
] as const;
