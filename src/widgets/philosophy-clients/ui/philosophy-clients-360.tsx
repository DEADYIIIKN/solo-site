"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowTextMax479 } from "@/shared/ui/section-eyebrow-text";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";
import { philosophyClients1440Content } from "@/widgets/philosophy-clients/model/philosophy-clients.data";
import {
  PhilosophyClientsNarrowClientsBlock,
  PhilosophyNarrowCardStack,
  philosophyNarrowRevealOff,
  philosophyNarrowRevealOn,
  philosophyNarrowRevealTransition,
} from "@/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack";
import { MARQUEE_GAP_360_PX } from "@/widgets/philosophy-clients/ui/philosophy-clients-marquee-1024";

/** Figma 783:10450 — карточки 328×220, типографика 12/28 */
export function PhilosophyClients360() {
  const [titleRef, titleInView] = useInViewOnce<HTMLDivElement>();

  return (
    <div className="w-full min-w-0">
      <section
        className="philosophy-clients-scope relative block w-full overflow-visible bg-[#0d0300]"
        id="philosophy-clients-360"
      >
        <div className="w-full min-w-0 rounded-bl-[60px] rounded-br-[60px] bg-white">
          <div className="relative mx-auto w-full max-w-[360px] min-w-0 overflow-x-auto">
            <div className="flex flex-col items-center gap-[50px] px-4 py-[70px]">
              <div ref={titleRef}>
                <div
                  className={cn(
                    philosophyNarrowRevealTransition,
                    titleInView ? philosophyNarrowRevealOn : philosophyNarrowRevealOff,
                  )}
                >
                  <SectionEyebrowRow align="start">
                    <p className={sectionEyebrowTextMax479}>
                      {philosophyClients1440Content.philosophyEyebrow}
                    </p>
                  </SectionEyebrowRow>
                </div>
              </div>
              <PhilosophyNarrowCardStack size="360" />
            </div>
          </div>
          <PhilosophyClientsNarrowClientsBlock
            clientsEyebrowStyle="narrow"
            eyebrowPlClassName="flex w-full justify-center px-4"
            marqueeGapPx={MARQUEE_GAP_360_PX}
          />
        </div>
      </section>
    </div>
  );
}
