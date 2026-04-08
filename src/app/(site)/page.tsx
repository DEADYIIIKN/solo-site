import { BusinessGoals } from "@/widgets/business-goals";
import { CasesSection } from "@/widgets/cases";
import { getCasesForSite } from "@/widgets/cases/lib/get-cases-for-site";
import { FirstScreen } from "@/widgets/first-screen";
import { Footer360, Footer480, Footer768, Footer1024, Footer1440 } from "@/widgets/footer";
import { LeadFormSection } from "@/widgets/lead-form";
import { LevelsSection } from "@/widgets/levels";
import { PhilosophyClients } from "@/widgets/philosophy-clients";
import { DarkSurfaceGrid } from "@/shared/ui/dark-surface-grid";
import { ServicesSection } from "@/widgets/services";
import { Showreel } from "@/widgets/showreel";
import { TeamSection } from "@/widgets/team";
import { getSiteSettings } from "@/shared/lib/get-site-settings";

/** Обновление с CMS без полной пересборки. */
export const revalidate = 60;

export default async function HomePage() {
  const [{ verticalCards, adCards }, settings] = await Promise.all([
    getCasesForSite(),
    getSiteSettings(),
  ]);

  return (
    <main className="app-main">
      <div className="relative isolate z-0 overflow-x-clip bg-[#0d0300]">
        <DarkSurfaceGrid />
        <FirstScreen />
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
      <div id="footer-section">
        <Footer360 showSecrets={settings.showSecrets} />
        <Footer480 showSecrets={settings.showSecrets} />
        <Footer768 showSecrets={settings.showSecrets} />
        <Footer1024 showSecrets={settings.showSecrets} />
        <Footer1440 showSecrets={settings.showSecrets} />
      </div>
    </main>
  );
}
