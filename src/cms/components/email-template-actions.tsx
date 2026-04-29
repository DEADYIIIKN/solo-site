"use client";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";

function normalizeSlug(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function EmailTemplateActions() {
  const { id } = useDocumentInfo();
  const slug = useFormFields(([fields]) => normalizeSlug(fields.slug?.value));
  const canUseLinks = Boolean(id && slug);
  const basePath = canUseLinks ? `/email/${encodeURIComponent(slug)}` : "";

  return (
    <div
      style={{
        display: "grid",
        gap: "0.5rem",
        marginBlock: "1rem",
      }}
    >
      <div
        style={{
          color: "var(--theme-elevation-600)",
          fontSize: "0.8125rem",
          lineHeight: 1.35,
        }}
      >
        Сохрани письмо, затем открой или скачай готовый HTML-макет.
      </div>
      <a
        aria-disabled={!canUseLinks}
        href={canUseLinks ? basePath : undefined}
        rel="noopener noreferrer"
        style={{
          alignItems: "center",
          background: canUseLinks ? "var(--theme-elevation-900)" : "var(--theme-elevation-150)",
          borderRadius: "var(--style-radius-s)",
          color: canUseLinks ? "var(--theme-bg)" : "var(--theme-elevation-500)",
          display: "inline-flex",
          fontSize: "0.875rem",
          fontWeight: 600,
          justifyContent: "center",
          minHeight: "2.25rem",
          padding: "0.45rem 0.75rem",
          pointerEvents: canUseLinks ? "auto" : "none",
          textDecoration: "none",
        }}
        target="_blank"
      >
        Открыть макет
      </a>
      <a
        aria-disabled={!canUseLinks}
        href={canUseLinks ? `${basePath}/download` : undefined}
        style={{
          alignItems: "center",
          background: canUseLinks ? "#ff5c00" : "var(--theme-elevation-150)",
          borderRadius: "var(--style-radius-s)",
          color: canUseLinks ? "#ffffff" : "var(--theme-elevation-500)",
          display: "inline-flex",
          fontSize: "0.875rem",
          fontWeight: 600,
          justifyContent: "center",
          minHeight: "2.25rem",
          padding: "0.45rem 0.75rem",
          pointerEvents: canUseLinks ? "auto" : "none",
          textDecoration: "none",
        }}
      >
        Скачать HTML
      </a>
      <a
        aria-disabled={!canUseLinks}
        href={canUseLinks ? `${basePath}/html` : undefined}
        rel="noopener noreferrer"
        style={{
          color: canUseLinks ? "var(--theme-text)" : "var(--theme-elevation-500)",
          fontSize: "0.8125rem",
          pointerEvents: canUseLinks ? "auto" : "none",
          textDecoration: "underline",
        }}
        target="_blank"
      >
        Посмотреть код HTML
      </a>
    </div>
  );
}
