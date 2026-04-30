import type { Metadata } from "next";

import { BusinessGoals } from "@/widgets/business-goals";
import { CasesSection } from "@/widgets/cases";
import { getCasesForSite } from "@/widgets/cases/lib/get-cases-for-site";
import { FirstScreen } from "@/widgets/first-screen";
import { FooterSection } from "@/widgets/footer";
import { LeadFormSection } from "@/widgets/lead-form";
import { LevelsSection } from "@/widgets/levels";
import { PhilosophyClients } from "@/widgets/philosophy-clients";
import { DarkSurfaceGrid } from "@/shared/ui/dark-surface-grid";
import { ServicesSection } from "@/widgets/services";
import { Showreel } from "@/widgets/showreel";
import { TeamSection } from "@/widgets/team";
import { siteConfig } from "@/shared/config/site";
import { getSiteSettings } from "@/shared/lib/get-site-settings";

/** Обновление с CMS без полной пересборки. */
export const revalidate = 60;

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.ogDescription,
    url: "/",
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
    title: siteConfig.defaultTitle,
    description: siteConfig.ogDescription,
    images: [siteConfig.ogImage],
  },
};

export default async function HomePage() {
  const [{ verticalCards, adCards }, settings] = await Promise.all([
    getCasesForSite(),
    getSiteSettings(),
  ]);

  return (
    <main className="app-main overflow-x-clip">
      {/* Без isolate/z-0: иначе stacking context первого блока оказывается под соседними секциями (sticky z-[40]) — навбар и fixed-модалки внутри блока не перекрывают страницу. */}
      <div className="relative overflow-x-clip bg-[#0d0300]">
        <DarkSurfaceGrid />
        <FirstScreen showNews={settings.showNews} />
        {settings.showShowreel && <Showreel />}
      </div>
      <BusinessGoals />
      {settings.showTeam && <TeamSection />}
      <PhilosophyClients />
      {settings.showCases && (
        <CasesSection adCards={adCards} verticalCards={verticalCards} />
      )}
      {settings.showServices && <ServicesSection />}
      {settings.showLevels && <LevelsSection />}
      <LeadFormSection />
      <FooterSection
        showNews={settings.showNews}
        showSecrets={settings.showSecrets}
        tgChannelUrl={settings.tgChannelUrl}
      />
    </main>
  );
}
