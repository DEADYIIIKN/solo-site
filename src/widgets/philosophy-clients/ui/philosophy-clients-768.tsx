"use client";

import { cn } from "@/shared/lib/utils";
import { SectionEyebrowRow } from "@/shared/ui/section-eyebrow-row";
import { sectionEyebrowText480To1439 } from "@/shared/ui/section-eyebrow-text";
import { useInViewOnce } from "@/widgets/team/ui/team-shared";
import { philosophyClients1440Content } from "@/widgets/philosophy-clients/model/philosophy-clients.data";
import {
  PhilosophyClientsNarrowClientsBlock,
  PhilosophyNarrowCardStack,
  philosophyNarrowRevealOff,
  philosophyNarrowRevealOn,
  philosophyNarrowRevealTransition,
} from "@/widgets/philosophy-clients/ui/philosophy-clients-narrow-stack";

/** Figma 783:11849 — заголовок слева, колонка карточек 432×270 */
export function PhilosophyClients768() {
  const [titleRef, titleInView] = useInViewOnce<HTMLDivElement>();

  return (
    <div className="w-full min-w-0">
      <section
        className="philosophy-clients-scope relative block w-full overflow-visible bg-[#0d0300]"
        id="philosophy-clients-768"
      >
        <div className="w-full rounded-bl-[60px] rounded-br-[60px] bg-white">
          <div className="relative mx-auto w-full max-w-[768px]">
            <div className="flex flex-row items-start justify-center gap-[73px] px-12 py-20">
            <div ref={titleRef} className="flex h-[57px] shrink-0 items-end">
              <div
                className={cn(
                  philosophyNarrowRevealTransition,
                  titleInView ? philosophyNarrowRevealOn : philosophyNarrowRevealOff,
                )}
              >
                <SectionEyebrowRow>
                  <p className={sectionEyebrowText480To1439}>
                    {philosophyClients1440Content.philosophyEyebrow}
                  </p>
                </SectionEyebrowRow>
              </div>
            </div>
            <PhilosophyNarrowCardStack size="432" />
            </div>
            <PhilosophyClientsNarrowClientsBlock eyebrowPlClassName="pl-12" />
          </div>
        </div>
      </section>
    </div>
  );
}
