"use client";

import dynamic from "next/dynamic";
import type { TextFieldClientProps } from "payload";

const ViewsInputInner = dynamic(() => import("./views-input-inner").then(m => ({ default: m.ViewsInputInner })), {
  ssr: false,
  loading: () => <span style={{ opacity: 0.4 }}>…</span>,
});

export function ViewsInput(props: TextFieldClientProps) {
  return <ViewsInputInner {...props} />;
}
