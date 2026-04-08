/* eslint-disable @next/next/no-img-element */

"use client";

import type { CSSProperties } from "react";

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
        <img
          alt="Команда SOLO"
          className="block h-full min-h-0 w-[118%] max-w-none object-cover object-center -ml-[9%]"
          decoding="async"
          draggable={false}
          loading="lazy"
          src={teamSectionAssets.teamPhoto}
        />
      ) : (
        <img
          alt="Команда SOLO"
          className="min-h-0 h-full w-full object-cover object-[center_26%]"
          decoding="async"
          draggable={false}
          loading="lazy"
          src={teamSectionAssets.teamPhoto}
        />
      )}
    </div>
  );
}
