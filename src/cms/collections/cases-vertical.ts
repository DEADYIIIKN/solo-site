import type { CollectionConfig } from "payload";

export const CasesVertical: CollectionConfig = {
  slug: "cases-vertical",
  labels: {
    singular: "Кейс (вертикальный)",
    plural: "Кейсы (вертикальные)",
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
          data.internalKey = `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
        return data;
      },
    ],
  },
  fields: [
    /* ── internalKey: скрыт, автогенерируется ── */
    {
      name: "internalKey",
      type: "text",
      required: true,
      unique: true,
      admin: {
        hidden: true,
      },
    },

    /* ── Табы: Карточка / Модалка ── */
    {
      type: "tabs",
      tabs: [
        {
          label: "🖼  Карточка",
          description: "Поля, которые видны на карточке в карусели",
          fields: [
            {
              name: "title",
              type: "textarea",
              required: true,
              label: "Заголовок",
              admin: {
                description: "Текст поверх фото. Для двух строк — перенос строки (Enter): например «Tito» на первой строке, «POV» на второй",
                rows: 2,
              },
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Изображение",
            },
            {
              name: "views",
              type: "text",
              required: true,
              label: "Просмотры",
              admin: {
                description: "Введи число — пробелы расставятся автоматически",
                components: {
                  Field: "@/cms/components/views-input#ViewsInput",
                },
              },
              hooks: {
                beforeChange: [
                  ({ value }) => {
                    if (typeof value !== "string") return value;
                    const digits = value.replace(/\D/g, "");
                    if (!digits) return value;
                    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
                  },
                ],
              },
            },
            {
              name: "credits",
              type: "array",
              label: "Авторы",
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
          description: "Текст в детальной карточке при клике",
          fields: [
            {
              name: "detailTask",
              type: "textarea",
              required: true,
              label: "Задача",
              admin: {
                description: "Описание задачи клиента",
                rows: 5,
              },
            },
            {
              name: "detailResult",
              type: "textarea",
              required: true,
              label: "Результат",
              admin: {
                description: "Что получилось в итоге",
                rows: 5,
              },
            },
            {
              name: "detailVideo",
              type: "upload",
              relationTo: "media",
              label: "Видео в модалке",
              admin: {
                description:
                  "По кнопке play поверх превью карточки. MP4 или WebM; загрузи файл в Media (alt обязателен, например «Видео кейса Callebaut»).",
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
