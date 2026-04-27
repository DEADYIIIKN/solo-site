/**
 * Unit-тесты для validateLeadInput (T-08-01: Tampering mitigation).
 *
 * Источник: src/lib/leads/validation.ts — hand-rolled guard вместо zod
 * (см. комментарий в файле — zod не в deps). Schema эквивалентна leadSchema
 * из 08-02-PLAN.md, поэтому тесты называются «leadSchema-style» по плану,
 * но импортируется реально существующая функция validateLeadInput.
 */
import { describe, expect, it } from "vitest";

import { validateLeadInput } from "@/lib/leads/validation";

const valid = {
  name: "Иван",
  phone: "+7 (900) 123-45-67",
  message: "тестовое сообщение",
  consent: true,
  contactMethod: "call" as const,
  source: "hero-cta",
};

function fieldsWithErrors(result: ReturnType<typeof validateLeadInput>): string[] {
  if (result.success) return [];
  return result.errors.map((e) => e.field);
}

describe("validateLeadInput", () => {
  it("accepts valid payload", () => {
    const r = validateLeadInput(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.name).toBe("Иван");
      expect(r.data.contactMethod).toBe("call");
    }
  });

  it("rejects empty name", () => {
    const r = validateLeadInput({ ...valid, name: "" });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("name");
  });

  it("rejects whitespace-only name (must trim)", () => {
    const r = validateLeadInput({ ...valid, name: "   " });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("name");
  });

  it("rejects invalid phone format", () => {
    const r = validateLeadInput({ ...valid, phone: "abc" });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("phone");
  });

  it("rejects consent=false", () => {
    const r = validateLeadInput({ ...valid, consent: false });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("consent");
  });

  it("rejects unknown contactMethod (e.g. 'email')", () => {
    const r = validateLeadInput({ ...valid, contactMethod: "email" });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("contactMethod");
  });

  it("rejects empty source", () => {
    const r = validateLeadInput({ ...valid, source: "" });
    expect(r.success).toBe(false);
    expect(fieldsWithErrors(r)).toContain("source");
  });

  it("accepts missing message (optional, defaults to empty string)", () => {
    const { message: _ignored, ...rest } = valid;
    void _ignored;
    const r = validateLeadInput(rest);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.message).toBe("");
    }
  });

  it("rejects non-object payload (null / array / primitive)", () => {
    expect(validateLeadInput(null).success).toBe(false);
    expect(validateLeadInput([]).success).toBe(false);
    expect(validateLeadInput("string").success).toBe(false);
  });
});
