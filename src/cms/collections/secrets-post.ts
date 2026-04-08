import type { CollectionConfig } from "payload";

/**
 * Материалы в духе «делимся секретами» / блог.
 */
export const SecretsPost: CollectionConfig = {
  slug: "secrets-posts",
  labels: {
    singular: "Секрет / статья",
    plural: "Секреты и статьи",
  },
  admin: {
    useAsTitle: "title",
    group: "Контент",
    defaultColumns: ["title", "published", "slug", "publishedAt", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
      label: "Опубликовано",
      admin: {
        position: "sidebar",
        description: "Включи, чтобы блок показывался на сайте",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
  ],
};
