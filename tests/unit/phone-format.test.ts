import { describe, expect, it } from "vitest";

import {
  formatConsultationPhone,
  formatConsultationPhoneBackspace,
  isConsultationPhoneValid,
} from "@/widgets/first-screen/model/first-screen-consultation-form";

describe("phone format — formatConsultationPhone", () => {
  it("returns empty string for empty input", () => {
    expect(formatConsultationPhone("")).toBe("");
    expect(formatConsultationPhone("abc")).toBe("");
  });

  it("prepends +7 country code when user types just '9'", () => {
    expect(formatConsultationPhone("9")).toBe("+7 (9");
  });

  it("formats progressively as digits are typed", () => {
    expect(formatConsultationPhone("79")).toBe("+7 (9");
    expect(formatConsultationPhone("7912")).toBe("+7 (912)");
    expect(formatConsultationPhone("7912345")).toBe("+7 (912) 345");
    expect(formatConsultationPhone("791234567")).toBe("+7 (912) 345-67");
    expect(formatConsultationPhone("79123456789")).toBe("+7 (912) 345-67-89");
  });

  it("normalizes leading 8 to 7 (RU local format)", () => {
    expect(formatConsultationPhone("89123456789")).toBe("+7 (912) 345-67-89");
  });

  it("treats non-7/8 leading digit as local — prepends 7", () => {
    // input "9123456789" (10 digits, no country) → +7 (912) 345-67-89
    expect(formatConsultationPhone("9123456789")).toBe("+7 (912) 345-67-89");
  });

  it("ignores non-digit chars (paste of '+7 (912) 345-67-89')", () => {
    expect(formatConsultationPhone("+7 (912) 345-67-89")).toBe(
      "+7 (912) 345-67-89",
    );
  });

  it("truncates to 11 digits max", () => {
    expect(formatConsultationPhone("791234567899999")).toBe("+7 (912) 345-67-89");
  });
});

describe("phone format — formatConsultationPhoneBackspace", () => {
  it("returns null when caret is at start (nothing to delete)", () => {
    expect(formatConsultationPhoneBackspace("+7 (912) 345-67-89", 0)).toBe(null);
  });

  it("returns null when previous char is a digit (let browser handle it)", () => {
    // caret right after '9' (position 6 in "+7 (912)")
    const value = "+7 (912) 345-67-89";
    expect(formatConsultationPhoneBackspace(value, 6)).toBe(null);
  });

  it("removes nearest digit to the left when previous char is non-digit", () => {
    // caret right after ')' — should delete '2' (last digit before ')')
    const value = "+7 (912) 345-67-89";
    const caret = value.indexOf(")") + 1; // 8
    const result = formatConsultationPhoneBackspace(value, caret);
    expect(result).toBe("+7 (913) 456-78-9");
  });

  it("returns null when only country code digit remains", () => {
    // value "+7 (9" — caret at end (5), prev char is '9' digit → null (browser handles)
    expect(formatConsultationPhoneBackspace("+7 (9", 5)).toBe(null);
  });
});

describe("phone format — isConsultationPhoneValid", () => {
  it("requires exactly 11 digits starting with 7 or 8", () => {
    expect(isConsultationPhoneValid("+7 (912) 345-67-89")).toBe(true);
    expect(isConsultationPhoneValid("89123456789")).toBe(true);
  });

  it("rejects under 11 digits", () => {
    expect(isConsultationPhoneValid("+7 (912) 345-67-8")).toBe(false);
    expect(isConsultationPhoneValid("")).toBe(false);
  });

  it("rejects 11 digits starting with non-7/8", () => {
    expect(isConsultationPhoneValid("19123456789")).toBe(false);
  });
});
