"use client";

import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import type { DefaultCellComponentProps } from "payload";

export function CaseVisibilityCell({
  cellData,
  collectionSlug,
  rowData,
}: DefaultCellComponentProps): React.JSX.Element {
  const router = useRouter();
  const [visible, setVisible] = useState(cellData !== false);
  const [pending, setPending] = useState(false);

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const nextVisible = !visible;
    setVisible(nextVisible);
    setPending(true);

    try {
      const response = await fetch(`/api/${collectionSlug}/${rowData.id}`, {
        body: JSON.stringify({ isVisible: nextVisible }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`Failed to update case visibility: ${response.status}`);
      }

      router.refresh();
    } catch {
      setVisible(!nextVisible);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      aria-label={visible ? "Скрыть кейс с сайта" : "Показать кейс на сайте"}
      disabled={pending}
      onClick={handleClick}
      style={{
        alignItems: "center",
        background: "transparent",
        border: 0,
        color: visible ? "var(--theme-success-600, #15803d)" : "var(--theme-error-600, #b91c1c)",
        cursor: pending ? "wait" : "pointer",
        display: "inline-flex",
        fontSize: 20,
        lineHeight: 1,
        opacity: pending ? 0.55 : 1,
        padding: 0,
      }}
      title={visible ? "Показывается на сайте" : "Скрыт с сайта"}
      type="button"
    >
      {visible ? "👁" : "◌"}
    </button>
  );
}
