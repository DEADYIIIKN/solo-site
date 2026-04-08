"use client";

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
  return (
    <div id="cases-section">
      <div className="hidden w-full justify-center bg-[#0d0300] max-[479px]:flex">
        <CasesSection360 adCards={adCards} verticalCards={verticalCards} />
      </div>
      <div className="hidden w-full justify-center bg-[#0d0300] min-[480px]:max-[767px]:flex">
        <CasesSection480 adCards={adCards} verticalCards={verticalCards} />
      </div>
      <div className="hidden w-full justify-center bg-[#0d0300] min-[768px]:max-[1023px]:flex">
        <CasesSection768 adCards={adCards} verticalCards={verticalCards} />
      </div>
      <div className="hidden w-full justify-center bg-[#0d0300] min-[1024px]:max-[1439px]:flex">
        <CasesSection1024 adCards={adCards} verticalCards={verticalCards} />
      </div>
      <div className="hidden w-full justify-center bg-[#0d0300] min-[1440px]:flex">
        <CasesSection1440 adCards={adCards} verticalCards={verticalCards} />
      </div>
    </div>
  );
}
