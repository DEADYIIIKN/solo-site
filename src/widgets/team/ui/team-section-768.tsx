"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439 } from "@/shared/ui/section-eyebrow-text";
import { teamSectionContent } from "@/widgets/team/model/team.data";
import { TeamSectionPhoto } from "@/widgets/team/ui/team-section-photo";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";

/** Планшет: шапка слева/справа, без блока метрик — по макету */
export function TeamSection768() {
  const [headerRef, headerInView] = useInViewOnce<HTMLDivElement>();
  const [manifestoRef, manifestoInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section
      className="team-section-scope relative hidden overflow-x-clip bg-[#0d0300] min-[768px]:block min-[1024px]:hidden"
      id="team-section-768"
    >
      <div className="w-full bg-white">
        <div className="relative mx-auto w-full max-w-[768px] px-[48px] pb-[48px] pt-[56px]">
        <div ref={headerRef}>
          <div
            className={cn(
              "flex items-start gap-[32px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              headerInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <SectionEyebrowRow className="pt-[2px]">
              <p className={sectionEyebrowText480To1439}>
                {teamSectionContent.sectionLabel}
              </p>
            </SectionEyebrowRow>
            <p className="min-w-0 max-w-[520px] text-[0] text-[#0d0300]">
              <span className="text-[26px] font-bold leading-[1.08]">{teamSectionContent.headline.lead}</span>
              <span className="text-[26px] font-normal italic leading-[1.08]">
                {teamSectionContent.headline.accent}
              </span>
              <span className="text-[26px] font-bold leading-[1.08]">{teamSectionContent.headline.tail}</span>
            </p>
          </div>
        </div>

        <TeamSectionPhoto
          className={cn(
            "mt-[44px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            headerInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[280px] w-full"
          style={{ transitionDelay: "100ms" }}
        />

        <div className="mx-auto mt-[56px] max-w-[600px] text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            {teamSectionContent.manifesto.parts.map((part, i) => (
              <span
                className={cn(
                  "text-[28px] leading-[1.05]",
                  "italic" in part && part.italic ? "font-normal italic" : "font-bold",
                )}
                key={i}
              >
                {part.text}
              </span>
            ))}
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
