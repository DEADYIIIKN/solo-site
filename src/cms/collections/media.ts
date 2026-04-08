import type { CollectionConfig } from "payload";

/** Человекочитаемый alt из имени файла (без расширения). */
function altFromFilename(filename: string): string {
  const base = filename
    .replace(/\.[^.]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return "Медиафайл";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function ensureAlt(data: Record<string, unknown> | null | undefined): void {
  if (!data) return;
  const existing = typeof data.alt === "string" ? data.alt.trim() : "";
  if (existing) return;
  const fn = typeof data.filename === "string" ? data.filename.trim() : "";
  data.alt = fn ? altFromFilename(fn) : "Медиафайл";
}

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Настройки",
    defaultColumns: ["filename", "alt", "updatedAt"],
    description:
      "Перетащи файлы прямо на таблицу ниже — загрузятся без лишних шагов. Alt подставится из имени файла; при желании поправь в карточке.",
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        ensureAlt(data as Record<string, unknown> | null | undefined);
        return data;
      },
    ],
    beforeChange: [
      ({ data }) => {
        ensureAlt(data as Record<string, unknown> | null | undefined);
        return data;
      },
    ],
  },
  upload: {
    mimeTypes: ["image/*", "video/*"],
    /** Массовая загрузка с экрана списка (drag-and-drop на таблицу). */
    bulkUpload: true,
    /** Файл на экране создания — сразу видно поле загрузки. */
    hideFileInputOnCreate: false,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
      label: "Alt-текст",
      admin: {
        description:
          "Необязательно: если пусто — возьмём из имени файла. Для важных кадров лучше написать осмысленно (например «Кейс Callebaut — портрет шефа»).",
      },
    },
  ],
};
