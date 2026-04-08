export function formatConsultationPhone(rawValue: string): string {
  const digitsOnly = rawValue.replace(/\D/g, "");
  if (!digitsOnly) return "";

  let normalized = digitsOnly;
  if (normalized[0] === "8") normalized = `7${normalized.slice(1)}`;
  else if (normalized[0] !== "7") normalized = `7${normalized}`;
  normalized = normalized.slice(0, 11);

  const country = "+7";
  const local = normalized.slice(1);
  if (!local) return country;

  const p1 = local.slice(0, 3);
  const p2 = local.slice(3, 6);
  const p3 = local.slice(6, 8);
  const p4 = local.slice(8, 10);

  let result = `${country} (${p1}`;
  if (p1.length === 3) result += ")";
  if (p2) result += ` ${p2}`;
  if (p3) result += `-${p3}`;
  if (p4) result += `-${p4}`;
  return result;
}

function normalizeConsultationPhoneDigits(rawDigits: string): string {
  if (!rawDigits) return "";
  let normalized = rawDigits;
  if (normalized[0] === "8") normalized = `7${normalized.slice(1)}`;
  else if (normalized[0] !== "7") normalized = `7${normalized}`;
  return normalized.slice(0, 11);
}

export function formatConsultationPhoneBackspace(
  currentValue: string,
  selectionStart: number,
): string | null {
  if (selectionStart <= 0) return null;
  const beforeCaret = currentValue.slice(0, selectionStart);
  const prevChar = beforeCaret[beforeCaret.length - 1] ?? "";
  if (/\d/.test(prevChar)) return null;

  const digitsBeforeCaret = (beforeCaret.match(/\d/g) ?? []).length;
  if (digitsBeforeCaret <= 1) return null;

  const normalized = normalizeConsultationPhoneDigits(
    currentValue.replace(/\D/g, ""),
  );
  if (!normalized.startsWith("7") || normalized.length <= 1) return null;

  const localDigits = normalized.slice(1).split("");
  const localRemoveIndex = digitsBeforeCaret - 2;
  if (localRemoveIndex < 0 || localRemoveIndex >= localDigits.length) return null;

  localDigits.splice(localRemoveIndex, 1);
  return formatConsultationPhone(`7${localDigits.join("")}`);
}

export function isConsultationPhoneValid(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length !== 11) return false;
  return digitsOnly.startsWith("7") || digitsOnly.startsWith("8");
}
