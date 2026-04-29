import type { CollectionConfig } from "payload";

export const EmailTemplates: CollectionConfig = {
  slug: "email-templates",
  labels: {
    singular: "Письмо",
    plural: "Письма",
  },
  admin: {
    useAsTitle: "title",
    group: "Письма",
    defaultColumns: ["title", "slug", "subject", "updatedAt"],
    description:
      "Макеты писем для рассылок. Публичный HTML доступен по /email/<slug>, изображения подставляются абсолютными ссылками.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название в админке",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug письма",
      admin: {
        position: "sidebar",
        description: "URL письма: /email/<slug>",
      },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      label: "Тема письма",
    },
    {
      name: "preheader",
      type: "textarea",
      label: "Preheader",
      admin: {
        description: "Скрытая строка превью, которую почтовые клиенты показывают рядом с темой.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Контент",
          fields: [
            {
              name: "headline",
              type: "richText",
              required: true,
              label: "Заголовок",
            },
            {
              name: "body",
              type: "richText",
              required: true,
              label: "Текст письма",
            },
            {
              name: "buttonText",
              type: "text",
              defaultValue: "Оставить заявку",
              label: "Текст кнопки",
            },
            {
              name: "buttonUrl",
              type: "text",
              defaultValue: "/#lead-form-section",
              label: "Ссылка кнопки",
            },
          ],
        },
        {
          label: "Изображения",
          fields: [
            {
              name: "headerLogo",
              type: "upload",
              relationTo: "media",
              label: "Логотип в шапке",
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Главное изображение",
              admin: {
                description:
                  "Можно загрузить PNG/JPG/WebP/AVIF. В HTML письма будет использована WebP-версия с абсолютной ссылкой.",
              },
            },
            {
              name: "footerLogo",
              type: "upload",
              relationTo: "media",
              label: "Логотип в подвале",
            },
          ],
        },
        {
          label: "Подвал",
          fields: [
            {
              name: "footerSiteLabel",
              type: "text",
              defaultValue: "наш сайт",
              label: "Текст ссылки на сайт",
            },
            {
              name: "footerSiteUrl",
              type: "text",
              defaultValue: "/",
              label: "Ссылка на сайт",
            },
            {
              name: "footerEmail",
              type: "text",
              defaultValue: "info@soloproduction.pro",
              label: "Email",
            },
            {
              name: "footerPhone",
              type: "text",
              defaultValue: "+7 968 973 11-68",
              label: "Телефон",
            },
            {
              name: "footerTelegramLabel",
              type: "text",
              defaultValue: "@mskfosage",
              label: "Telegram текст",
            },
            {
              name: "footerTelegramUrl",
              type: "text",
              defaultValue: "https://t.me/mskfosage",
              label: "Telegram ссылка",
            },
          ],
        },
      ],
    },
  ],
};
