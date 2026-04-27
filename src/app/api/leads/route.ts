/**
 * POST /api/leads — единственный endpoint submit'а формы.
 *
 * Архитектура (08-CONTEXT.md § Locked Architecture, D1-D4):
 *   1. rate-limit per IP (D3) → 10 req / 5 min, превышение = 200 {accepted:false}
 *   2. validate body (zod-эквивалент guard) → ошибка = 400
 *   3. payload.create({ collection: "leads", ... }) — ALWAYS first (D2 fallback)
 *   4. forwardLeadToWebhook → обновляем lead.forwardedToWebhook / webhookError
 *   5. response 200 {ok:true, accepted:true, leadId} (D4: success всегда, если БД жива)
 *
 * 500 возвращаем только если payload.create упал (true infra error).
 */

import { getPayload } from "payload";
import config from "@payload-config";

import { checkRateLimit } from "@/lib/leads/rate-limit";
import { validateLeadInput } from "@/lib/leads/validation";
import { forwardLeadToWebhook } from "@/lib/leads/forward-webhook";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);

  // 1. Rate limit (D3: тихо отбрасываем без save/forward)
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return Response.json(
      { ok: true, accepted: false, reason: "rate-limit" },
      { status: 200 },
    );
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const parsed = validateLeadInput(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, errors: parsed.errors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 3. Save to Payload Collection FIRST (FUNC-02 always-save per D2)
  let leadId: string | number;
  try {
    const payload = await getPayload({ config });
    const lead = await payload.create({
      collection: "leads",
      data: {
        name: data.name,
        phone: data.phone,
        message: data.message,
        consent: data.consent,
        contactMethod: data.contactMethod,
        source: data.source,
        forwardedToWebhook: false,
        userIp: ip,
      },
    });
    leadId = lead.id;
  } catch (err) {
    console.error("[leads] Failed to save lead to Collection", err);
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }

  // 4. Forward to n8n (best-effort — ошибка НЕ фейлит запрос, D4)
  const fwd = await forwardLeadToWebhook(data);
  try {
    const payload = await getPayload({ config });
    await payload.update({
      collection: "leads",
      id: leadId,
      data: fwd.ok
        ? { forwardedToWebhook: true }
        : { webhookError: fwd.error ?? "unknown error" },
    });
  } catch (err) {
    // Не критично — заявка уже сохранена. Логируем для дебага.
    console.error("[leads] Failed to update lead with webhook status", err);
  }

  return Response.json(
    { ok: true, accepted: true, leadId },
    { status: 200 },
  );
}
