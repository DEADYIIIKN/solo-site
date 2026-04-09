"use client";

import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import {
  casesAdCards1440,
  casesVerticalCards1440,
  type CasesSectionCardsProps,
} from "@/widgets/cases/model/cases.data";
import { CasesSection1024 } from "@/widgets/cases/ui/cases-section-1024";
import { CasesSection1440 } from "@/widgets/cases/ui/cases-section-1440";
import { CasesSection360 } from "@/widgets/cases/ui/cases-section-360";
import { CasesSection480 } from "@/widgets/cases/ui/cases-section-480";
import { CasesSection768 } from "@/widgets/cases/ui/cases-section-768";

/**
 * Секция «Кейсы»: pin-scroll и сворачивание только на 1024+; на 360–768 — статичная вёрстка по Figma без разделителя.
 */
export function CasesSection({
  verticalCards = casesVerticalCards1440,
  adCards = casesAdCards1440,
}: CasesSectionCardsProps = {}) {
  const layout = useViewportLayout();

  if (!layout) {
    return <div id="cases-section" />;
  }

  return (
    <div id="cases-section">
      {layout === "360" ? (
        <div className="flex w-full justify-center bg-[#0d0300]">
          <CasesSection360 adCards={adCards} verticalCards={verticalCards} />
        </div>
      ) : null}
      {layout === "480" ? (
        <div className="flex w-full justify-center bg-[#0d0300]">
          <CasesSection480 adCards={adCards} verticalCards={verticalCards} />
        </div>
      ) : null}
      {layout === "768" ? (
        <div className="flex w-full justify-center bg-[#0d0300]">
          <CasesSection768 adCards={adCards} verticalCards={verticalCards} />
        </div>
      ) : null}
      {layout === "1024" ? (
        <div className="flex w-full justify-center bg-[#0d0300]">
          <CasesSection1024 adCards={adCards} verticalCards={verticalCards} />
        </div>
      ) : null}
      {layout === "1440" ? (
        <div className="flex w-full justify-center bg-[#0d0300]">
          <CasesSection1440 adCards={adCards} verticalCards={verticalCards} />
        </div>
      ) : null}
    </div>
  );
}
