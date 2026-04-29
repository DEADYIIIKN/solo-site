import config from "@payload-config";
import { getPayload } from "payload";

import { renderEmailHtml } from "@/features/email-template";
import type { EmailTemplateRenderInput } from "@/features/email-template";
import { publicSiteUrl } from "@/shared/config/public-site-url";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type EmailTemplateDoc = Omit<EmailTemplateRenderInput, "siteUrl"> & {
  slug: string;
};

async function findEmailTemplate(slug: string): Promise<EmailTemplateDoc | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "email-templates",
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 1,
    limit: 1,
    overrideAccess: true,
  });

  return (result.docs[0] as unknown as EmailTemplateDoc | undefined) ?? null;
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { slug } = await context.params;
  const email = await findEmailTemplate(slug);

  if (!email) {
    return new Response("Email template not found", { status: 404 });
  }

  const html = renderEmailHtml({
    ...email,
    siteUrl: publicSiteUrl,
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
