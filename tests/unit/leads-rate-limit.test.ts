/**
 * Unit-тесты для in-memory per-IP rate-limiter (D3 из 08-CONTEXT.md).
 * Источник: src/lib/leads/rate-limit.ts — Map<ip, timestamps[]>, окно 5 мин, лимит 10.
 *
 * Используем явный параметр `now`, чтобы тесты были детерминированы и не зависели
 * от Date.now() / fake timers.
 */
import { beforeEach, describe, expect, it } from "vitest";

import { __resetRateLimit, checkRateLimit } from "@/lib/leads/rate-limit";

const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 10;

describe("checkRateLimit", () => {
  beforeEach(() => {
    __resetRateLimit();
  });

  it("allows first 10 requests from same IP", () => {
    const now = 1_000_000;
    for (let i = 0; i < LIMIT; i++) {
      const res = checkRateLimit("1.1.1.1", now + i);
      expect(res.allowed).toBe(true);
    }
  });

  it("blocks 11th request within 5min window with retryAfterMs in (0, WINDOW_MS]", () => {
    const now = 1_000_000;
    for (let i = 0; i < LIMIT; i++) {
      checkRateLimit("1.1.1.1", now + i);
    }
    const res = checkRateLimit("1.1.1.1", now + LIMIT);
    expect(res.allowed).toBe(false);
    expect(res.retryAfterMs).toBeGreaterThan(0);
    expect(res.retryAfterMs).toBeLessThanOrEqual(WINDOW_MS);
  });

  it("treats different IPs independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < LIMIT; i++) {
      checkRateLimit("1.1.1.1", now + i);
    }
    // 1.1.1.1 теперь на лимите, 2.2.2.2 должен проходить с нуля
    for (let i = 0; i < LIMIT; i++) {
      const res = checkRateLimit("2.2.2.2", now + i);
      expect(res.allowed).toBe(true);
    }
    // А 1.1.1.1 остаётся заблокированным
    expect(checkRateLimit("1.1.1.1", now + LIMIT).allowed).toBe(false);
  });

  it("slides window — old requests expire after WINDOW_MS and request is allowed again", () => {
    const start = 1_000_000;
    for (let i = 0; i < LIMIT; i++) {
      checkRateLimit("1.1.1.1", start + i);
    }
    // На самом первом таймстэмпе + WINDOW_MS + 1 он выпадает за окно
    const later = start + WINDOW_MS + 1;
    const res = checkRateLimit("1.1.1.1", later);
    expect(res.allowed).toBe(true);
  });

  it("__resetRateLimit clears storage so a previously-blocked IP starts fresh", () => {
    const now = 1_000_000;
    for (let i = 0; i < LIMIT; i++) {
      checkRateLimit("1.1.1.1", now + i);
    }
    expect(checkRateLimit("1.1.1.1", now + LIMIT).allowed).toBe(false);

    __resetRateLimit();

    expect(checkRateLimit("1.1.1.1", now + LIMIT + 1).allowed).toBe(true);
  });
});
