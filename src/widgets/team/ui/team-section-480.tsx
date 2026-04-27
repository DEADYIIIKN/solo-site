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
        <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-[50px] px-6 pb-[80px] pt-[80px]" ref={blockRef}>
        <div
          className={cn(
            "flex flex-col items-center gap-[50px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <SectionEyebrowRow>
            <p className={sectionEyebrowText480To1439}>
              {teamSectionContent.sectionLabel}
            </p>
          </SectionEyebrowRow>

          <p className="min-w-full text-center text-[0] text-[#0d0300]" style={{ lineHeight: 1 }}>
            <span className="text-[23px] font-bold" style={{ lineHeight: 1 }}>
              Создаем рекламу и контент для соцсетей, которые{" "}
            </span>
            <span className="text-[23px] font-normal italic" style={{ lineHeight: 1 }}>системно приводят клиентов</span>
            <span className="text-[23px] font-bold" style={{ lineHeight: 1 }}> в ваш бизнес.</span>
          </p>
        </div>

        <TeamSectionPhoto
          className={cn(
            "w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          frameClassName="h-[284px] w-full"
          imageWrapperClassName="left-[-11.79%] w-[123.58%]"
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
            style={{ lineHeight: 0.9 }}
          >
            <span className="text-[24px] font-bold" style={{ lineHeight: 0.9 }}>Мы </span>
            <span className="text-[24px] font-normal italic" style={{ lineHeight: 0.9 }}>
              превращаем идеи в&nbsp;контент,{" "}
            </span>
            <span className="text-[24px] font-bold" style={{ lineHeight: 0.9 }}>который объединяет креатив и стратегию.</span>
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
