import { getPayload } from "payload";
import { notFound } from "next/navigation";

import config from "@payload-config";
import { CasesAdvertisingPreviewClient } from "./PreviewClient";

export const dynamic = "force-dynamic";

export default async function CasesAdvertisingPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payload = await getPayload({ config });

  let doc: Record<string, unknown>;
  try {
    doc = (await payload.findByID({
      collection: "cases-advertising",
      id,
      depth: 2,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    notFound();
  }

  return <CasesAdvertisingPreviewClient initialData={doc} />;
}
