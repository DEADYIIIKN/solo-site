import type { Metadata } from "next";
import localFont from "next/font/local";

import { publicSiteUrl } from "@/shared/config/public-site-url";
import { siteConfig } from "@/shared/config/site";
import { SiteLoadOverlay } from "@/widgets/site-load";
import "@/bones/registry.js";

import "../globals.css";

const metadataBase = new URL(publicSiteUrl);

const montserrat = localFont({
  display: "swap",
  src: [
    {
      path: "../../../public/fonts/montserrat/Montserrat-Regular.ttf",
      style: "normal",
      weight: "400"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Medium.ttf",
      style: "normal",
      weight: "500"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-SemiBold.ttf",
      style: "normal",
      weight: "600"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Bold.ttf",
      style: "normal",
      weight: "700"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Italic.ttf",
      style: "italic",
      weight: "400"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-MediumItalic.ttf",
      style: "italic",
      weight: "500"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-SemiBoldItalic.ttf",
      style: "italic",
      weight: "600"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-BoldItalic.ttf",
      style: "italic",
      weight: "700"
    }
  ],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} Продакшн`,
    template: `%s | ${siteConfig.name} Продакшн`,
  },
  description: siteConfig.description,
  metadataBase,
  applicationName: `${siteConfig.name} Продакшн`,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: `${siteConfig.name} Продакшн`,
    title: `${siteConfig.name} Продакшн`,
    description: siteConfig.ogDescription,
    images: [
      {
        url: siteConfig.ogImage,
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Продакшн`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Продакшн`,
    description: siteConfig.ogDescription,
    images: [siteConfig.ogImage],
  },
  category: "marketing",
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="ru">
      <body className={`${montserrat.variable} ${montserrat.className} page-shell`}>
        {children}
        <SiteLoadOverlay />
      </body>
    </html>
  );
}
