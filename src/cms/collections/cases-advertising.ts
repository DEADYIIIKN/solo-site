import type { CollectionConfig } from "payload";

/** Рекламные кейсы (карусель «Рекламные кейсы»). */
export const CasesAdvertising: CollectionConfig = {
  slug: "cases-advertising",
  labels: {
    singular: "Кейс (рекламный)",
    plural: "Кейсы (рекламные)",
  },
  orderable: true,
  admin: {
    useAsTitle: "title",
    group: "Контент",
    defaultColumns: ["image", "title", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === "create" && data && !data.internalKey) {
          data.internalKey = `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
        return data;
      },
    ],
  },
  fields: [
    /* ── Служебные поля ── */
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Название",
          admin: {
            description: "Заголовок карточки и список в админке. Пример: TRS Motors & Mercedes",
            width: "60%",
          },
        },
        {
          name: "internalKey",
          type: "text",
          required: true,
          unique: true,
          admin: {
            hidden: true,
          },
        },
      ],
    },

    /* ── Табы: Карточка / Модалка ── */
    {
      type: "tabs",
      tabs: [
        {
          label: "🖼  Карточка",
          description: "Поля карточки в карусели рекламных кейсов",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Изображение",
            },
            {
              name: "credits",
              type: "array",
              label: "Авторы",
              minRows: 1,
              admin: {
                description: "Строки мелким текстом внизу карточки",
                initCollapsed: false,
                components: {
                  Field: "@/cms/components/inline-line-array-field#InlineLineArrayField",
                },
              },
              labels: {
                singular: "Строка",
                plural: "Строки",
              },
              fields: [
                {
                  name: "line",
                  type: "text",
                  required: true,
                  label: "Текст",
                },
              ],
            },
          ],
        },
        {
          label: "📋  Модалка",
          description: "Детальный текст при клике на карточку",
          fields: [
            {
              name: "detailTask",
              type: "textarea",
              required: true,
              label: "Задача",
              admin: {
                description: "Что стояло перед командой",
                rows: 5,
              },
            },
            {
              name: "detailResultLead",
              type: "textarea",
              required: true,
              label: "Результат — вводный абзац",
              admin: {
                rows: 4,
              },
            },
            {
              name: "detailResultBullets",
              type: "array",
              label: "Результат — пункты списка",
              admin: {
                description: "Маркированный список под вводным абзацем (необязательно)",
                initCollapsed: true,
                components: {
                  Field: "@/cms/components/inline-line-array-field#InlineLineArrayField",
                },
              },
              labels: {
                singular: "Пункт",
                plural: "Пункты",
              },
              fields: [
                {
                  name: "line",
                  type: "text",
                  required: true,
                  label: "Пункт",
                },
              ],
            },
            {
              name: "detailResultClosing",
              type: "textarea",
              label: "Результат — заключение",
              admin: {
                description: "Текст после списка (необязательно)",
                rows: 3,
              },
            },
            {
              name: "detailVideo",
              type: "upload",
              relationTo: "media",
              label: "Видео в модалке",
              admin: {
                description:
                  "По кнопке play на превью в модалке. MP4 или WebM; alt в Media — для доступности.",
                components: {
                  Field: "@/cms/components/upload-with-quick-file-field#UploadWithQuickFileField",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
