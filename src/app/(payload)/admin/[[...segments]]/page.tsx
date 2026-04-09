import type { Metadata } from "next";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { ensurePayloadSchema } from "@/shared/lib/ensure-payload-schema";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  await ensurePayloadSchema();
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  await ensurePayloadSchema();
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
