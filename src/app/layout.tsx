import type { Metadata } from "next";
import localFont from "next/font/local";

import { siteConfig } from "@/shared/config/site";

import "./globals.css";

const montserrat = localFont({
  display: "swap",
  src: [
    {
      path: "../../public/fonts/montserrat/Montserrat-Regular.ttf",
      style: "normal",
      weight: "400"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-Medium.ttf",
      style: "normal",
      weight: "500"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-SemiBold.ttf",
      style: "normal",
      weight: "600"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-Bold.ttf",
      style: "normal",
      weight: "700"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-Italic.ttf",
      style: "italic",
      weight: "400"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-MediumItalic.ttf",
      style: "italic",
      weight: "500"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-SemiBoldItalic.ttf",
      style: "italic",
      weight: "600"
    },
    {
      path: "../../public/fonts/montserrat/Montserrat-BoldItalic.ttf",
      style: "italic",
      weight: "700"
    }
  ],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${montserrat.variable} page-shell`}>
        {children}
      </body>
    </html>
  );
}
