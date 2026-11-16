import type { Metadata } from "next";

import { getSiteSettings } from "@/shared/lib/get-site-settings";
import { ServicePage } from "@/widgets/service-page/service-page";

const title = "Производство рекламных роликов";
const description = "Сценарий, съёмка и монтаж рекламного ролика или серии для бренда. Подготовим версии для нужных площадок.";
const path = "/services/reklamnye-roliki";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

export default async function AdvertisingVideoPage() {
  const settings = await getSiteSettings();

  return (
    <ServicePage kind="advertising" tgChannelUrl={settings.tgChannelUrl} />
  );
}
