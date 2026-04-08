"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowTextMax479 } from "@/shared/ui/section-eyebrow-text";
import { teamSectionContent } from "@/widgets/team/model/team.data";
import { TeamSectionPhoto } from "@/widgets/team/ui/team-section-photo";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";

/** Мобильный: центр, акцент курсивом одной фразой */
export function TeamSection360() {
  const [blockRef, inView] = useInViewOnce<HTMLDivElement>();
  const [manifestoRef, manifestoInView] = useInViewOnce<HTMLDivElement>();

  return (
    <section
      className="team-section-scope relative block overflow-x-clip bg-[#0d0300] min-[480px]:hidden"
      id="team-section-360"
    >
      <div className="w-full bg-white">
        <div className="relative mx-auto w-full max-w-[360px] px-4 pb-10 pt-10" ref={blockRef}>
        <div
          className={cn(
            "flex flex-col items-center gap-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <SectionEyebrowRow>
            <p className={sectionEyebrowTextMax479}>
              {teamSectionContent.sectionLabel}
            </p>
          </SectionEyebrowRow>

          <p className="w-full text-center text-[0] text-[#0d0300]">
            <span className="block text-[20px] font-bold leading-[1.15]">
              Создаем рекламу и контент для&nbsp;соцсетей, которые{" "}
            </span>
            <span className="mt-1 block text-[20px] font-normal italic leading-[1.15]">
              системно приводят клиентов{" "}
            </span>
            <span className="mt-1 block text-[20px] font-bold leading-[1.15]">в ваш бизнес.</span>
          </p>
        </div>

        <TeamSectionPhoto
          className={cn(
            "mt-10 w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[200px] w-full"
          roundedClassName="rounded-2xl"
          style={{ transitionDelay: "80ms" }}
          variant="narrow"
        />

        <div className="mt-12 text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="text-[18px] font-bold leading-[1.12]">Мы </span>
            <span className="text-[18px] font-normal italic leading-[1.12]">
              превращаем идеи в&nbsp;контент,{" "}
            </span>
            <span className="text-[18px] font-bold leading-[1.12]">
              который объединяет креатив и&nbsp;стратегию.
            </span>
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
