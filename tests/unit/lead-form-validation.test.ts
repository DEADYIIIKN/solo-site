/**
 * Mirrors the submit guard in src/widgets/lead-form/ui/lead-form-fields.tsx:212
 *   if (!name.trim() || !isConsultationPhoneValid(phone) || !consent) return;
 *
 * Locks the rule: name (after trim) + valid phone + consent must all be truthy.
 */
import { describe, expect, it } from "vitest";

import { isConsultationPhoneValid } from "@/widgets/first-screen/model/first-screen-consultation-form";

type LeadFormState = {
  name: string;
  phone: string;
  consent: boolean;
};

function canSubmitLeadForm(state: LeadFormState): boolean {
  if (!state.name.trim()) return false;
  if (!isConsultationPhoneValid(state.phone)) return false;
  if (!state.consent) return false;
  return true;
}

const validState: LeadFormState = {
  name: "Алекс",
  phone: "+7 (912) 345-67-89",
  consent: true,
};

describe("lead form — submit guard", () => {
  it("returns true when all fields are valid", () => {
    expect(canSubmitLeadForm(validState)).toBe(true);
  });

  it("returns false when name is empty", () => {
    expect(canSubmitLeadForm({ ...validState, name: "" })).toBe(false);
  });

  it("returns false when name is only whitespace (must trim)", () => {
    expect(canSubmitLeadForm({ ...validState, name: "   " })).toBe(false);
  });

  it("returns false when phone is empty", () => {
    expect(canSubmitLeadForm({ ...validState, phone: "" })).toBe(false);
  });

  it("returns false when phone is incomplete (under 11 digits)", () => {
    expect(
      canSubmitLeadForm({ ...validState, phone: "+7 (912) 345-67-8" }),
    ).toBe(false);
  });

  it("returns false when consent is unchecked", () => {
    expect(canSubmitLeadForm({ ...validState, consent: false })).toBe(false);
  });

  it("returns false when ALL fields invalid", () => {
    expect(
      canSubmitLeadForm({ name: "", phone: "", consent: false }),
    ).toBe(false);
  });

  it("accepts a leading-8 phone (11 digits, starts with 8)", () => {
    expect(
      canSubmitLeadForm({ ...validState, phone: "89123456789" }),
    ).toBe(true);
  });
});
