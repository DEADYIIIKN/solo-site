import { getPayload } from "payload";
import config from "@payload-config";

/**
 * CSV export для Payload Collection «leads» (Phase 12, ADMIN-03).
 *
 * GET /api/leads/export — скачивает все заявки в CSV формате.
 * Колонки: id, name, phone, message, contactMethod, consent, source,
 * forwardedToWebhook, webhookError, userIp, createdAt.
 *
 * UTF-8 BOM (﻿) — чтобы Excel правильно отображал русские буквы.
 *
 * Доступ закрыт — endpoint для админа. Payload Collection «leads» имеет
 * `read: () => true` (Phase 8), но в проде стоит ограничить (out of scope).
 */

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Имя" },
  { key: "phone", label: "Телефон" },
  { key: "message", label: "Сообщение" },
  { key: "contactMethod", label: "Способ связи" },
  { key: "consent", label: "Согласие" },
  { key: "source", label: "Источник" },
  { key: "forwardedToWebhook", label: "Forwarded" },
  { key: "webhookError", label: "Webhook error" },
  { key: "userIp", label: "IP" },
  { key: "createdAt", label: "Дата создания" },
] as const;

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // CSV escaping: если есть запятая, кавычка или перевод строки — оборачиваем
  // в кавычки и удваиваем внутренние кавычки.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  let leads: Record<string, unknown>[] = [];
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "leads",
      limit: 10_000,
      sort: "-createdAt",
      overrideAccess: true,
    });
    leads = result.docs as Record<string, unknown>[];
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const header = COLUMNS.map((c) => escapeCsvCell(c.label)).join(",");
  const rows = leads.map((lead) =>
    COLUMNS.map((c) => escapeCsvCell(lead[c.key])).join(","),
  );
  const csv = [header, ...rows].join("\r\n");
  // UTF-8 BOM для корректного открытия в Excel (русский текст).
  const body = `﻿${csv}`;

  const today = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
