"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439 } from "@/shared/ui/section-eyebrow-text";
import { teamSectionContent } from "@/widgets/team/model/team.data";
import { TeamSectionPhoto } from "@/widgets/team/ui/team-section-photo";
import { TeamStatValue, useInViewOnce } from "@/widgets/team/ui/team-shared";

export function TeamSection1024() {
  const [headerRef, headerInView] = useInViewOnce<HTMLDivElement>();
  const [statsRef, statsInView] = useInViewOnce<HTMLDivElement>();
  const [manifestoRef, manifestoInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section
      className="team-section-scope relative hidden overflow-x-clip bg-[#0d0300] min-[1024px]:block min-[1440px]:hidden"
      id="team-section-1024"
    >
      <div className="w-full bg-white">
        <div className="relative mx-auto w-[1024px] px-[40px] pb-[56px] pt-[64px]">
        <div className="w-full" ref={headerRef}>
          <div
            className={cn(
              "flex items-start gap-[80px] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              headerInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <SectionEyebrowRow>
              <p className={sectionEyebrowText480To1439}>
                {teamSectionContent.sectionLabel}
              </p>
            </SectionEyebrowRow>
            <p className="max-w-[620px] text-[0] text-[#0d0300]">
              <span className="text-[32px] font-bold leading-[1.05]">{teamSectionContent.headline.lead}</span>
              <span className="text-[32px] font-normal italic leading-[1.05]">
                {teamSectionContent.headline.accent}
              </span>
              <span className="text-[32px] font-bold leading-[1.05]">{teamSectionContent.headline.tail}</span>
            </p>
          </div>
        </div>

        <div
          className={cn(
            "mt-[48px] flex w-full flex-col gap-[32px] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            statsInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          ref={statsRef}
          style={{ transitionDelay: statsInView ? "80ms" : "0ms" }}
        >
          <div className="flex w-full items-start justify-between">
            {teamSectionContent.stats.map((stat) => (
              <div className="flex min-w-0 flex-col items-center gap-[16px] text-center text-[#0d0300]" key={stat.label}>
                <p className="whitespace-nowrap text-center text-[38px] font-bold leading-[1.4] tracking-[-0.76px]">
                  <TeamStatValue
                    active={statsInView}
                    format={stat.format}
                    suffix={stat.suffix}
                    target={stat.target}
                  />
                </p>
                <p className="whitespace-nowrap text-center text-[14px] font-normal leading-[1.2]">{stat.label}</p>
              </div>
            ))}
          </div>

          <TeamSectionPhoto frameClassName="h-[320px] w-full shrink-0" />
        </div>

        <div className="mx-auto mt-[64px] max-w-[720px] text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            {teamSectionContent.manifesto.parts.map((part, i) => (
              <span
                className={cn(
                  "text-[36px] leading-[0.95]",
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
