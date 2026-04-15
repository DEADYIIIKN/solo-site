"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

/** Figma: круг + треугольник play поверх превью */
function ModalPlayOverlay({ sizePx }: { sizePx: number }) {
  const s = sizePx;
  return (
    <div
      aria-hidden
      className="pointer-events-none relative flex shrink-0 items-center justify-center"
      style={{ width: s, height: s }}
    >
      <Image
        alt=""
        aria-hidden
        className="absolute inset-0"
        height={s}
        src="/assets/figma/7255-play-button/subtract.svg"
        width={s}
      />
      <Image
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        height={Math.round(s * (55.7143 / 60))}
        src="/assets/figma/7255-play-button/ellipse2.svg"
        width={Math.round(s * (55.7143 / 60))}
      />
    </div>
  );
}

type CaseModalVideoBlockProps = {
  /** Открыта ли модалка — при закрытии сбрасываем воспроизведение */
  modalOpen: boolean;
  posterSrc: string;
  /** URL видео из CMS (Media); без него — только постер, без кнопки play */
  videoUrl?: string;
  playSize: number;
  className: string;
  imageSizes: string;
  /** Подпись для screen readers */
  videoLabel?: string;
};

const OVERLAY_MS = 380;

export function CaseModalVideoBlock({
  modalOpen,
  posterSrc,
  videoUrl,
  playSize,
  className,
  imageSizes,
  videoLabel = "Видео кейса",
}: CaseModalVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  /** Показывать крупную кнопку play поверх (пауза / конец / ещё не стартовали) */
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);

  const resetVideo = useCallback(() => {
    setShowPlayOverlay(true);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (!modalOpen) resetVideo();
  }, [modalOpen, resetVideo]);

  useEffect(() => {
    resetVideo();
  }, [posterSrc, videoUrl, resetVideo]);

  const togglePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setShowPlayOverlay(true));
    else v.pause();
  }, []);

  const hasVideo = Boolean(videoUrl?.trim());

  if (!hasVideo) {
    return (
      <div className={cn("relative overflow-hidden rounded-[12px]", className)}>
        <Image alt="" className="object-cover" fill sizes={imageSizes} src={posterSrc} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-[12px] bg-black", className)}>
      <video
        aria-label={videoLabel}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        playsInline
        poster={posterSrc}
        preload="metadata"
        ref={videoRef}
        src={videoUrl}
        tabIndex={showPlayOverlay ? -1 : 0}
        onClick={togglePlayPause}
        onEnded={() => setShowPlayOverlay(true)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            togglePlayPause();
          }
        }}
        onPause={() => setShowPlayOverlay(true)}
        onPlaying={() => setShowPlayOverlay(false)}
      />
      <button
        aria-hidden={!showPlayOverlay}
        aria-label="Воспроизвести видео"
        className={cn(
          "absolute inset-0 z-[1] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0",
          "transition-[opacity,transform] ease-out",
          showPlayOverlay ? "pointer-events-auto opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
        )}
        style={{ transitionDuration: `${OVERLAY_MS}ms` }}
        tabIndex={showPlayOverlay ? 0 : -1}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          const v = videoRef.current;
          if (!v) return;
          void v.play().catch(() => setShowPlayOverlay(true));
        }}
      >
        <ModalPlayOverlay sizePx={playSize} />
      </button>
    </div>
  );
}
