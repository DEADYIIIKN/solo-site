"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439 } from "@/shared/ui/section-eyebrow-text";
import { teamSectionContent } from "@/widgets/team/model/team.data";
import { TeamSectionPhoto } from "@/widgets/team/ui/team-section-photo";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";

/** Узкий планшет / большой мобильный: всё по центру, переносы как в макете */
export function TeamSection480() {
  const [blockRef, inView] = useInViewOnce<HTMLDivElement>();
  const [manifestoRef, manifestoInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section
      className="team-section-scope relative hidden overflow-x-clip bg-[#0d0300] min-[480px]:block min-[768px]:hidden"
      id="team-section-480"
    >
      <div className="w-full bg-white">
        <div className="relative mx-auto w-full max-w-[480px] px-6 pb-10 pt-12" ref={blockRef}>
        <div
          className={cn(
            "flex flex-col items-center gap-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <SectionEyebrowRow>
            <p className={sectionEyebrowText480To1439}>
              {teamSectionContent.sectionLabel}
            </p>
          </SectionEyebrowRow>

          <p className="w-full text-center text-[0] text-[#0d0300]">
            <span className="block text-[22px] font-bold leading-[1.12]">Создаем рекламу и контент</span>
            <span className="mt-1 block text-[22px] leading-[1.12]">
              <span className="font-bold">для соцсетей, которые </span>
              <span className="font-normal italic">системно</span>
            </span>
            <span className="mt-1 block text-[22px] leading-[1.12]">
              <span className="font-normal italic">приводят клиентов </span>
              <span className="font-bold">в ваш бизнес.</span>
            </span>
          </p>
        </div>

        <TeamSectionPhoto
          className={cn(
            "mt-12 w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[240px] w-full"
          roundedClassName="rounded-2xl"
          style={{ transitionDelay: "80ms" }}
          variant="narrow"
        />

        <div className="mt-14 text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="text-[22px] font-bold leading-[1.12]">Мы </span>
            <span className="text-[22px] font-normal italic leading-[1.12]">
              превращаем идеи в&nbsp;контент,{" "}
            </span>
            <span className="mt-1 block text-[22px] font-bold leading-[1.12]">который объединяет креатив</span>
            <span className="block text-[22px] font-bold leading-[1.12]">и стратегию.</span>
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
