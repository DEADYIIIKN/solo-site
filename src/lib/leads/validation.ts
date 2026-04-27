/**
 * Validation для POST /api/leads body (T-08-01: Tampering mitigation).
 *
 * Hand-rolled guard вместо zod — zod не установлен в dependencies, добавлять
 * целый пакет ради одной schema избыточно. Логика валидации эквивалентна
 * описанной в 08-02-PLAN.md (leadSchema).
 */

import { isConsultationPhoneValid } from "@/widgets/first-screen/model/first-screen-consultation-form";

export type ContactMethod = "call" | "telegram" | "whatsapp";

export interface LeadInput {
  name: string;
  phone: string;
  message: string;
  consent: true;
  contactMethod: ContactMethod;
  source: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult =
  | { success: true; data: LeadInput }
  | { success: false; errors: ValidationError[] };

const CONTACT_METHODS: ReadonlyArray<ContactMethod> = ["call", "telegram", "whatsapp"];
const NAME_MAX = 200;
const MESSAGE_MAX = 2000;
const SOURCE_MAX = 50;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateLeadInput(raw: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isPlainObject(raw)) {
    return { success: false, errors: [{ field: "_root", message: "Тело запроса должно быть JSON-объектом" }] };
  }

  // name
  const rawName = raw.name;
  let name = "";
  if (typeof rawName !== "string") {
    errors.push({ field: "name", message: "Имя обязательно" });
  } else {
    name = rawName.trim();
    if (name.length < 1) errors.push({ field: "name", message: "Имя обязательно" });
    else if (name.length > NAME_MAX) errors.push({ field: "name", message: `Имя должно быть короче ${NAME_MAX} символов` });
  }

  // phone
  const rawPhone = raw.phone;
  let phone = "";
  if (typeof rawPhone !== "string") {
    errors.push({ field: "phone", message: "Телефон обязателен" });
  } else {
    phone = rawPhone.trim();
    if (!isConsultationPhoneValid(phone)) {
      errors.push({ field: "phone", message: "Невалидный номер телефона" });
    }
  }

  // message (optional)
  const rawMessage = raw.message;
  let message = "";
  if (rawMessage !== undefined && rawMessage !== null) {
    if (typeof rawMessage !== "string") {
      errors.push({ field: "message", message: "Сообщение должно быть строкой" });
    } else {
      message = rawMessage;
      if (message.length > MESSAGE_MAX) {
        errors.push({ field: "message", message: `Сообщение длиннее ${MESSAGE_MAX} символов` });
      }
    }
  }

  // consent (must be literal true)
  if (raw.consent !== true) {
    errors.push({ field: "consent", message: "Требуется согласие на обработку ПД" });
  }

  // contactMethod
  const rawCM = raw.contactMethod;
  let contactMethod: ContactMethod = "call";
  if (typeof rawCM !== "string" || !CONTACT_METHODS.includes(rawCM as ContactMethod)) {
    errors.push({ field: "contactMethod", message: "Неверный способ связи" });
  } else {
    contactMethod = rawCM as ContactMethod;
  }

  // source
  const rawSource = raw.source;
  let source = "";
  if (typeof rawSource !== "string") {
    errors.push({ field: "source", message: "Источник обязателен" });
  } else {
    source = rawSource.trim();
    if (source.length < 1) errors.push({ field: "source", message: "Источник обязателен" });
    else if (source.length > SOURCE_MAX) errors.push({ field: "source", message: `Источник длиннее ${SOURCE_MAX} символов` });
  }

  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name,
      phone,
      message,
      consent: true,
      contactMethod,
      source,
    },
  };
}
