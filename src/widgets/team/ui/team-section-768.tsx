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
        <div className="relative mx-auto flex w-full max-w-[768px] flex-col gap-[60px] px-[48px] pb-[80px] pt-[80px]">
        <div ref={headerRef}>
          <div
            className={cn(
              "flex items-start gap-[80px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              headerInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <SectionEyebrowRow className="pt-[2px]">
              <p className={sectionEyebrowText480To1439}>
                {teamSectionContent.sectionLabel}
              </p>
            </SectionEyebrowRow>
            <p className="min-w-0 max-w-[520px] text-[0] text-[#0d0300]">
              <span className="text-[28px] font-bold leading-none">{teamSectionContent.headline.lead}</span>
              <span className="text-[28px] font-normal italic leading-none">
                {teamSectionContent.headline.accent}
              </span>
              <span className="text-[28px] font-bold leading-none">{teamSectionContent.headline.tail}</span>
            </p>
          </div>
        </div>

        <TeamSectionPhoto
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            headerInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[284px] w-full"
          imageClassName="object-cover object-[center_45%]"
          roundedClassName="rounded-[8px]"
          style={{ transitionDelay: "100ms" }}
        />

        <div className="mx-auto max-w-[672px] text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            {teamSectionContent.manifesto.parts.map((part, i) => (
              <span
                className={cn(
                  "text-[32px] leading-[0.9]",
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
