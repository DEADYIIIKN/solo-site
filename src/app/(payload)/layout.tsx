/* Сгенерировано по шаблону Payload — при `payload generate:importmap` может обновиться importMap. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { Metadata } from "next";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import { ensurePayloadSchema } from "@/shared/lib/ensure-payload-schema";
import { importMap } from "./admin/importMap.js";
import "./custom.scss";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = async ({ children }: Args) => {
  await ensurePayloadSchema();

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
};

export default Layout;
