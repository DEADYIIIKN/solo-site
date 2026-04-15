import type { GlobalConfig } from "payload";

/**
 * Глобальные настройки сайта.
 * Каждый тумблер управляет видимостью целого блока на главной.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Настройки сайта",
  admin: {
    group: "Настройки",
    description: "Управление видимостью секций на главной странице",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "collapsible",
      label: "Секции главной страницы",
      admin: {
        initCollapsed: false,
        description: "Включи секцию — она появится на сайте; выключи — скроется вместе со всем контентом",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "showSecrets",
              type: "checkbox",
              defaultValue: false,
              label: "Секреты и статьи",
              admin: {
                description: "Слайдер «Делимся секретами» на главной",
                width: "33%",
              },
            },
            {
              name: "showShowreel",
              type: "checkbox",
              defaultValue: true,
              label: "Шоурил",
              admin: {
                description: "Блок с видео-шоурилом",
                width: "33%",
              },
            },
            {
              name: "showTeam",
              type: "checkbox",
              defaultValue: true,
              label: "Команда",
              admin: {
                description: "Блок «Наша команда»",
                width: "33%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "showNews",
              type: "checkbox",
              defaultValue: true,
              label: "Новости",
              admin: {
                description: "Страница новостей и ссылки на нее в навигации",
                width: "33%",
              },
            },
            {
              name: "showCases",
              type: "checkbox",
              defaultValue: true,
              label: "Кейсы",
              admin: {
                description: "Карусели кейсов",
                width: "33%",
              },
            },
            {
              name: "showServices",
              type: "checkbox",
              defaultValue: true,
              label: "Услуги",
              admin: {
                description: "Блок услуг",
                width: "33%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "showLevels",
              type: "checkbox",
              defaultValue: true,
              label: "Уровни",
              admin: {
                description: "Блок уровней / пакетов",
                width: "33%",
              },
            },
          ],
        },
      ],
    },
  ],
};
