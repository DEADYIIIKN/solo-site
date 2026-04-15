"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { BoneyardSkeleton } from "@/shared/ui/boneyard-skeleton";
import { teamSectionAssets } from "@/widgets/team/model/team.data";

type TeamSectionPhotoProps = {
  className?: string;
  frameClassName: string;
  roundedClassName?: string;
  style?: CSSProperties;
  imageClassName?: string;
  imageWrapperClassName?: string;
  /** 360/480: кроп по бокам без transform — иначе ломается скругление; фон белый */
  variant?: "default" | "narrow";
};

export function TeamSectionPhoto({
  className,
  frameClassName,
  roundedClassName = "rounded-[12px]",
  style,
  imageClassName,
  imageWrapperClassName,
  variant = "default",
}: TeamSectionPhotoProps) {
  const narrow = variant === "narrow";
  const [loaded, setLoaded] = useState(false);

  return (
    <BoneyardSkeleton
      loading={!loaded}
      name={narrow ? "team-section-photo-narrow" : "team-section-photo-default"}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          narrow ? "bg-white" : "isolate bg-[#0d0300]",
          roundedClassName,
          frameClassName,
          className,
        )}
        style={style}
      >
        {narrow ? (
          <div className={cn("absolute inset-y-0 left-[-9%] w-[118%]", imageWrapperClassName)}>
            <Image
              alt="Команда SOLO"
              className={cn("object-cover object-center", imageClassName)}
              draggable={false}
              fill
              loading="lazy"
              onError={() => setLoaded(true)}
              onLoad={() => setLoaded(true)}
              sizes="(max-width: 479px) 387px, (max-width: 767px) 440px, 520px"
              src={teamSectionAssets.teamPhoto}
            />
          </div>
        ) : (
          <Image
            alt="Команда SOLO"
            className={cn("object-cover object-[center_26%]", imageClassName)}
            draggable={false}
            fill
            loading="lazy"
            onError={() => setLoaded(true)}
            onLoad={() => setLoaded(true)}
            sizes="(max-width: 1023px) 100vw, 50vw"
            src={teamSectionAssets.teamPhoto}
          />
        )}
      </div>
    </BoneyardSkeleton>
  );
}
