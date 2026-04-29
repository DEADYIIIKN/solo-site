"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

function normalizeSlug(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function EmailTemplatePreview() {
  const { id } = useDocumentInfo();
  const slug = useFormFields(([fields]) => normalizeSlug(fields.slug?.value));
  const canPreview = Boolean(id && slug);
  const previewPath = canPreview ? `/email/${encodeURIComponent(slug)}` : "";

  return (
    <div
      style={{
        display: "grid",
        gap: "0.75rem",
        marginTop: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "var(--theme-elevation-600)",
          fontSize: "0.8125rem",
          lineHeight: 1.35,
        }}
      >
        Превью показывает последнюю сохраненную версию письма.
      </div>
      {canPreview ? (
        <div
          style={{
            background: "#ebebeb",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: "var(--style-radius-s)",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <iframe
            src={previewPath}
            style={{
              border: 0,
              display: "block",
              height: "760px",
              width: "100%",
            }}
            title="Превью письма"
          />
        </div>
      ) : (
        <div
          style={{
            alignItems: "center",
            background: "var(--theme-elevation-50)",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: "var(--style-radius-s)",
            color: "var(--theme-elevation-600)",
            display: "flex",
            minHeight: "5rem",
            padding: "1rem",
          }}
        >
          Сохрани письмо, чтобы увидеть превью.
        </div>
      )}
    </div>
  );
}
