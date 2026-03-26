import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { siteConfig } from "@/shared/config/site";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"]
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
