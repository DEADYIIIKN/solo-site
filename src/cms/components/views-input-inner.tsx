"use client";

import React from "react";
import { useField } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

function fmt(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
}

export function ViewsInputInner(props: TextFieldClientProps) {
  const { path, field, readOnly } = props;
  const { value, setValue, showError } = useField<string>({ path });

  const label =
    typeof field.label === "string" ? field.label : "Просмотры";
  const required = "required" in field ? Boolean(field.required) : false;
  const description =
    typeof field.admin?.description === "string"
      ? field.admin.description
      : undefined;

  return (
    <div className={`field-type text${showError ? " error" : ""}`}>
      <label className="field-label" htmlFor={`field-${path}`}>
        {label}
        {required && <span className="required">&nbsp;*</span>}
      </label>
      <input
        className="field-type__input"
        disabled={readOnly}
        id={`field-${path}`}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(fmt(e.target.value));
        }}
        placeholder="13400"
        type="text"
        value={value ?? ""}
      />
      {description && (
        <p className="field-description">{description}</p>
      )}
    </div>
  );
}
