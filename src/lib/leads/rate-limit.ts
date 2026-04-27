/**
 * In-memory per-IP rate limiter для POST /api/leads (D3 из 08-CONTEXT.md).
 *
 * Лимит: 10 запросов / 5 минут per IP. Хранилище — module-level Map
 * `Map<ip, timestamps[]>`, выживает пока процесс жив, обнуляется при рестарте
 * Docker / HMR в dev — приемлемо для лендинга (~10 заявок/день).
 *
 * При превышении лимита API route возвращает 200 {ok:true, accepted:false},
 * НЕ сохраняет в Collection и НЕ форвардит в n8n (D3 compromise — лучше тихо
 * отбросить дубликаты, чем заваливать админку).
 */

const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 10;
const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs?: number;
}

export function checkRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  const cutoff = now - WINDOW_MS;
  const prev = (buckets.get(ip) ?? []).filter((t) => t >= cutoff);

  if (prev.length >= LIMIT) {
    const oldest = prev[0] ?? now;
    const retryAfterMs = Math.max(0, WINDOW_MS - (now - oldest));
    buckets.set(ip, prev);
    return { allowed: false, retryAfterMs };
  }

  prev.push(now);
  buckets.set(ip, prev);
  return { allowed: true };
}

/** Только для unit-тестов (08-04). Не вызывать из production code. */
export function __resetRateLimit(): void {
  buckets.clear();
}
