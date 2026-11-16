import type { Metadata } from "next";

import { getSiteSettings } from "@/shared/lib/get-site-settings";
import { ServicePage } from "@/widgets/service-page/service-page";

const title = "Вертикальные видео для социальных сетей";
const description = "Съёмка и монтаж серий вертикальных видео для соцсетей бренда. От 10 роликов в месяц.";
const path = "/services/vertical-video";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
};

export default async function VerticalVideoPage() {
  const settings = await getSiteSettings();

  return (
    <ServicePage kind="vertical" tgChannelUrl={settings.tgChannelUrl} />
  );
}
