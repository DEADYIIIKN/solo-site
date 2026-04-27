import type { CollectionConfig } from "payload";

/**
 * Заявки с лендинга (форма обратной связи).
 * Локальный fallback (D2 из 08-CONTEXT.md): любая заявка сохраняется в БД до форварда в n8n,
 * чтобы не потерять контакт даже при сбое webhook.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: {
    singular: "Заявка",
    plural: "Заявки",
  },
  admin: {
    useAsTitle: "phone",
    group: "Заявки",
    /* ADMIN-01: list view columns — name, phone, source, contactMethod,
       forwardedToWebhook, createdAt (Phase 11). */
    defaultColumns: [
      "phone",
      "name",
      "source",
      "contactMethod",
      "forwardedToWebhook",
      "createdAt",
    ],
    /* ADMIN-02: default sort — newest first.
       Filter работает встроенно в Payload admin UI на всех полях. */
    listSearchableFields: ["phone", "name", "source"],
  },
  defaultSort: "-createdAt",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Имя",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Телефон",
      admin: {
        description: "Формат: +7 (xxx) xxx-xx-xx",
      },
    },
    {
      name: "message",
      type: "textarea",
      label: "Сообщение",
    },
    {
      name: "contactMethod",
      type: "select",
      required: true,
      defaultValue: "call",
      label: "Способ связи",
      options: [
        { label: "Позвонить", value: "call" },
        { label: "Telegram", value: "telegram" },
        { label: "WhatsApp", value: "whatsapp" },
      ],
    },
    {
      name: "consent",
      type: "checkbox",
      required: true,
      defaultValue: false,
      label: "Согласие на обработку ПД",
    },
    {
      name: "source",
      type: "text",
      label: "Источник",
      admin: {
        description: "header-cta / hero-cta / services-cta / lead-form / consultation-modal",
      },
    },
    {
      name: "forwardedToWebhook",
      type: "checkbox",
      defaultValue: false,
      label: "Отправлено в n8n",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "webhookError",
      type: "textarea",
      label: "Ошибка webhook",
      admin: {
        position: "sidebar",
        description: "Заполняется автоматически при сбое n8n",
      },
    },
    {
      name: "userIp",
      type: "text",
      label: "IP пользователя",
      admin: {
        position: "sidebar",
        description: "Для дебага рейт-лимита; PII — не показывать публично",
      },
    },
  ],
};
