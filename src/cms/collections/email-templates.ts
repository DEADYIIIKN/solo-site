import type { CollectionConfig } from "payload";

const SOLO_SITE_URL = "https://soloproduction.pro/";
const SOLO_LEAD_FORM_URL = "https://soloproduction.pro/#lead-form-section";

function slugifyEmailSubject(value: string): string {
  const translit: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  const slug = value
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => translit[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return slug || `email-${Date.now()}`;
}

export const EmailTemplates: CollectionConfig = {
  slug: "email-templates",
  labels: {
    singular: "Письмо",
    plural: "Письма",
  },
  admin: {
    useAsTitle: "subject",
    group: "Письма",
    defaultColumns: ["subject", "slug", "updatedAt"],
    description:
      "Макеты писем для рассылок. Публичный HTML доступен по /email/<slug>, изображения подставляются абсолютными ссылками.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (!data) return data;

        const subject =
          typeof data.subject === "string" && data.subject.trim()
            ? data.subject.trim()
            : typeof originalDoc?.subject === "string"
              ? originalDoc.subject
              : "";

        data.title = subject;
        data.buttonUrl = SOLO_LEAD_FORM_URL;
        data.footerSiteUrl = SOLO_SITE_URL;

        if (!subject) return data;

        const baseSlug = slugifyEmailSubject(subject);
        let nextSlug = baseSlug;
        let suffix = 2;

        while (true) {
          const existing = await req.payload.find({
            collection: "email-templates",
            where: {
              slug: {
                equals: nextSlug,
              },
            },
            depth: 0,
            limit: 1,
            overrideAccess: true,
            req,
          });

          const match = existing.docs[0];
          if (!match || (operation === "update" && String(match.id) === String(originalDoc?.id))) {
            break;
          }

          nextSlug = `${baseSlug}-${suffix}`;
          suffix += 1;
        }

        data.slug = nextSlug;
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название в админке",
      admin: {
        hidden: true,
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug письма",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Генерируется автоматически из темы письма. URL письма: /email/<slug>",
      },
    },
    {
      name: "templateActions",
      type: "ui",
      label: "Макет письма",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/cms/components/email-template-actions#EmailTemplateActions",
        },
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
              defaultValue: SOLO_LEAD_FORM_URL,
              label: "Ссылка кнопки",
              admin: {
                readOnly: true,
              },
            },
            {
              name: "templatePreview",
              type: "ui",
              label: "Превью письма",
              admin: {
                components: {
                  Field: "@/cms/components/email-template-preview#EmailTemplatePreview",
                },
              },
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
              defaultValue: SOLO_SITE_URL,
              label: "Ссылка на сайт",
              admin: {
                readOnly: true,
              },
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
