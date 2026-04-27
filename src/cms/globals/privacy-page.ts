import type { GlobalConfig } from "payload";

/**
 * Содержимое страницы /privacy — Политика конфиденциальности.
 * Singleton Global (не Collection) — страница всегда одна.
 */
export const PrivacyPage: GlobalConfig = {
  slug: "privacy-page",
  label: "Политика конфиденциальности",
  admin: {
    group: "Контент",
    description: "Содержимое страницы /privacy",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "content",
      type: "richText",
      label: "Содержимое политики",
    },
  ],
};
