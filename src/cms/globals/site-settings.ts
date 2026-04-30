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
    description: "Управление видимостью секций и ссылками сайта",
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
              name: "showShowreel",
              type: "checkbox",
              defaultValue: true,
              label: "Шоурил",
              admin: {
                description: "Блок с видео-шоурилом",
                width: "50%",
              },
            },
            {
              name: "showTeam",
              type: "checkbox",
              defaultValue: true,
              label: "Команда",
              admin: {
                description: "Блок «Наша команда»",
                width: "50%",
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
                description: "Страница новостей, ссылки в навигации и блок «Делимся секретами» в футере",
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
    {
      type: "collapsible",
      label: "Ссылки",
      admin: {
        initCollapsed: false,
        description: "Ссылки, которые используются в общих блоках сайта",
      },
      fields: [
        {
          name: "tgChannelUrl",
          type: "text",
          defaultValue: "https://t.me/soloproductionpro",
          label: "Telegram-канал в футере",
          admin: {
            description: "Полная ссылка на канал, например https://t.me/soloproductionpro",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "SEO и аналитика",
      admin: {
        initCollapsed: false,
        description: "Production-домен, индексация, базовые meta-теги и Яндекс Метрика",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "productionBaseUrl",
              type: "text",
              defaultValue: "https://soloproduction.pro",
              label: "Production URL",
              admin: {
                description: "Основной публичный домен без слеша в конце",
                width: "50%",
              },
            },
            {
              name: "allowIndexing",
              type: "checkbox",
              defaultValue: true,
              label: "Разрешить индексацию",
              admin: {
                description: "Если выключить, robots/meta будут noindex/nofollow",
                width: "50%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "seoTitle",
              type: "text",
              defaultValue: "Видеопродакшн для брендов и рекламы",
              label: "SEO title главной",
              admin: {
                width: "50%",
              },
            },
            {
              name: "seoDescription",
              type: "textarea",
              defaultValue:
                "СОЛО Продакшн: видеопродакшн для брендов, рекламы и соцсетей. Стратегия, креатив, съёмка и контент, который решает бизнес-задачи.",
              label: "SEO description",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "ogTitle",
              type: "text",
              defaultValue: "СОЛО Продакшн",
              label: "Open Graph title",
              admin: {
                width: "50%",
              },
            },
            {
              name: "ogDescription",
              type: "textarea",
              defaultValue:
                "Создаём рекламу и видеоконтент для брендов: соцсети, performance, имиджевые ролики и контент-системы под результат.",
              label: "Open Graph description",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          name: "ogImageUrl",
          type: "text",
          defaultValue: "/favicon.png",
          label: "Open Graph image URL",
          admin: {
            description: "Можно указать абсолютный URL или путь внутри сайта",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "yandexMetrikaEnabled",
              type: "checkbox",
              defaultValue: false,
              label: "Включить Яндекс Метрику",
              admin: {
                width: "50%",
              },
            },
            {
              name: "yandexMetrikaId",
              type: "text",
              label: "ID счетчика Яндекс Метрики",
              admin: {
                width: "50%",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "yandexMetrikaWebvisor",
              type: "checkbox",
              defaultValue: true,
              label: "Вебвизор",
              admin: {
                width: "25%",
              },
            },
            {
              name: "yandexMetrikaClickmap",
              type: "checkbox",
              defaultValue: true,
              label: "Карта кликов",
              admin: {
                width: "25%",
              },
            },
            {
              name: "yandexMetrikaTrackLinks",
              type: "checkbox",
              defaultValue: true,
              label: "Внешние ссылки",
              admin: {
                width: "25%",
              },
            },
            {
              name: "yandexMetrikaAccurateTrackBounce",
              type: "checkbox",
              defaultValue: true,
              label: "Точный bounce",
              admin: {
                width: "25%",
              },
            },
          ],
        },
      ],
    },
  ],
};
