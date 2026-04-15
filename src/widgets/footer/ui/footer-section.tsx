"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { Footer360 } from "@/widgets/footer/ui/footer-360";
import { Footer480 } from "@/widgets/footer/ui/footer-480";
import { Footer768 } from "@/widgets/footer/ui/footer-768";
import { Footer1024 } from "@/widgets/footer/ui/footer-1024";
import { Footer1440 } from "@/widgets/footer/ui/footer-1440";

type FooterSectionProps = {
  showSecrets: boolean;
  showNews: boolean;
};

export function FooterSection({ showSecrets, showNews }: FooterSectionProps) {
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="footer-section" />;
  }

  return (
    <div className="bg-[#0d0300]" id="footer-section">
      {layout === "360" ? <Footer360 showNews={showNews} showSecrets={showSecrets} /> : null}
      {layout === "480" ? <Footer480 showNews={showNews} showSecrets={showSecrets} /> : null}
      {layout === "768" ? <Footer768 showNews={showNews} showSecrets={showSecrets} /> : null}
      {layout === "1024" ? <Footer1024 showNews={showNews} showSecrets={showSecrets} /> : null}
      {layout === "1440" ? <Footer1440 showNews={showNews} showSecrets={showSecrets} /> : null}
    </div>
  );
}
