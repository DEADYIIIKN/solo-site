/* eslint-disable @next/next/no-img-element */

"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { teamSectionAssets } from "@/widgets/team/model/team.data";

type TeamSectionPhotoProps = {
  className?: string;
  frameClassName: string;
  roundedClassName?: string;
  style?: CSSProperties;
  /** 360/480: кроп по бокам без transform — иначе ломается скругление; фон белый */
  variant?: "default" | "narrow";
};

export function TeamSectionPhoto({
  className,
  frameClassName,
  roundedClassName = "rounded-[12px]",
  style,
  variant = "default",
}: TeamSectionPhotoProps) {
  const narrow = variant === "narrow";

  return (
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
        <Image
          alt="Команда SOLO"
          className="object-cover object-center"
          draggable={false}
          fill
          loading="lazy"
          sizes="(max-width: 479px) 387px, (max-width: 767px) 440px, 520px"
          src={teamSectionAssets.teamPhoto}
          style={{ marginLeft: "-9%", width: "118%" }}
        />
      ) : (
        <Image
          alt="Команда SOLO"
          className="object-cover object-[center_26%]"
          draggable={false}
          fill
          loading="lazy"
          sizes="(max-width: 1023px) 100vw, 50vw"
          src={teamSectionAssets.teamPhoto}
        />
      )}
    </div>
  );
}
