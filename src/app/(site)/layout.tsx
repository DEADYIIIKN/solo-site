import type { Metadata } from "next";
import localFont from "next/font/local";

import { publicSiteUrl } from "@/shared/config/public-site-url";
import { siteConfig } from "@/shared/config/site";
import { getSiteSettings } from "@/shared/lib/get-site-settings";
import { YandexMetrika } from "@/widgets/analytics";
import { SiteLoadOverlay } from "@/widgets/site-load";
import { TgPopupHost } from "@/widgets/tg-popup";

import { SiteMotionConfig } from "./motion-config-provider";

import "../globals.css";

export const revalidate = 60;

const montserrat = localFont({
  display: "swap",
  src: [
    {
      path: "../../../public/fonts/montserrat/Montserrat-Regular.woff2",
      style: "normal",
      weight: "400"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Medium.woff2",
      style: "normal",
      weight: "500"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-SemiBold.woff2",
      style: "normal",
      weight: "600"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Bold.woff2",
      style: "normal",
      weight: "700"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-Italic.woff2",
      style: "italic",
      weight: "400"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-MediumItalic.woff2",
      style: "italic",
      weight: "500"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-SemiBoldItalic.woff2",
      style: "italic",
      weight: "600"
    },
    {
      path: "../../../public/fonts/montserrat/Montserrat-BoldItalic.woff2",
      style: "italic",
      weight: "700"
    }
  ],
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const metadataBase = new URL(settings.productionBaseUrl || publicSiteUrl);

  return {
    title: {
      default: settings.seoTitle,
      template: `%s | ${siteConfig.name} Продакшн`,
    },
    description: settings.seoDescription,
    metadataBase,
    applicationName: `${siteConfig.name} Продакшн`,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: "/",
      siteName: `${siteConfig.name} Продакшн`,
      title: settings.ogTitle,
      description: settings.ogDescription,
      images: [
        {
          url: settings.ogImageUrl,
          width: 512,
          height: 512,
          alt: `${siteConfig.name} Продакшн`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.ogTitle,
      description: settings.ogDescription,
      images: [settings.ogImageUrl],
    },
    category: "marketing",
    robots: {
      index: settings.allowIndexing,
      follow: settings.allowIndexing,
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html dir="ltr" lang="ru">
      <body className={`${montserrat.variable} ${montserrat.className} page-shell`}>
        <SiteMotionConfig>
          {children}
          <SiteLoadOverlay />
          <TgPopupHost />
          <YandexMetrika settings={settings} />
        </SiteMotionConfig>
      </body>
    </html>
  );
}
