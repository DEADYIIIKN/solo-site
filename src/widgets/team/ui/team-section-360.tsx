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
        <div className="relative mx-auto flex w-full max-w-[360px] flex-col items-center gap-[40px] px-4 pb-[70px] pt-[70px]" ref={blockRef}>
        <div
          className={cn(
            "flex flex-col items-center gap-[40px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <SectionEyebrowRow>
            <p className={sectionEyebrowTextMax479}>
              {teamSectionContent.sectionLabel}
            </p>
          </SectionEyebrowRow>

          <p className="min-w-full text-center text-[0] text-[#0d0300]">
            <span className="text-[18px] font-bold leading-none">
              Создаем рекламу и контент для&nbsp;соцсетей, которые{" "}
            </span>
            <span className="text-[18px] font-normal italic leading-none">
              системно приводят клиентов
            </span>
            <span className="text-[18px] font-bold leading-none"> в&nbsp;ваш бизнес.</span>
          </p>
        </div>

        <TeamSectionPhoto
          className={cn(
            "w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[204px] w-full"
          imageWrapperClassName="inset-0 w-full"
          imageClassName="object-cover object-center"
          roundedClassName="rounded-[8px]"
          style={{ transitionDelay: "80ms" }}
          variant="narrow"
        />

        <div className="text-center" ref={manifestoRef}>
          <p
            className={cn(
              "text-[0] text-[#0d0300] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              manifestoInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            )}
          >
            <span className="text-[18px] font-bold leading-[0.9]">Мы </span>
            <span className="text-[18px] font-normal italic leading-[0.9]">
              превращаем идеи в&nbsp;контент,{" "}
            </span>
            <span className="text-[18px] font-bold leading-[0.9]">
              который объединяет креатив и&nbsp;стратегию.
            </span>
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
