/**
 * Forward валидной заявки в n8n webhook (FUNC-01).
 *
 * Поведение:
 * - URL берётся из настроек Payload, затем из process.env.N8N_WEBHOOK_URL.
 *   Если URL нет — возвращаем `{ ok: false, error: "n8n webhook URL not configured" }`
 *   и логгируем warn один раз (через module-level флаг). НЕ throw — заявка
 *   уже сохранена в Collection (D2/D4).
 * - Timeout по умолчанию 10s через AbortController (T-08-05 mitigation).
 * - Любая сетевая ошибка ловится и упаковывается в `{ ok: false, error }`.
 */

import type { LeadInput } from "./validation";

let warnedMissingUrl = false;

export interface ForwardResult {
  ok: boolean;
  error?: string;
}

function normalizeWebhookUrl(url: unknown): string | undefined {
  if (typeof url !== "string") return undefined;
  const trimmed = url.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function resolveLeadWebhookUrl(adminWebhookUrl?: unknown): string | undefined {
  return normalizeWebhookUrl(adminWebhookUrl) ?? normalizeWebhookUrl(process.env.N8N_WEBHOOK_URL);
}

export async function forwardLeadToWebhook(
  data: LeadInput,
  options: { timeoutMs?: number; webhookUrl?: string } = {},
): Promise<ForwardResult> {
  const url = resolveLeadWebhookUrl(options.webhookUrl);
  if (!url) {
    if (!warnedMissingUrl) {
      console.warn(
        "[leads] n8n webhook URL not configured — заявка сохранена только локально",
      );
      warnedMissingUrl = true;
    }
    return { ok: false, error: "n8n webhook URL not configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        message: data.message,
        consent: data.consent,
        contactMethod: data.contactMethod,
        source: data.source,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { ok: false, error: `Webhook responded ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

/** Только для unit-тестов. */
export function __resetWebhookWarn(): void {
  warnedMissingUrl = false;
}
