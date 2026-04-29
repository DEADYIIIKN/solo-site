"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  posterSrc: string;
  videoSrc: string | undefined | null;
  ariaLabel: string;
  /** Sizes attribute for the poster Image — should match real container width × DPR. */
  sizes: string;
};

/**
 * Маленький client-only компонент. Outer hero остаётся RSC.
 * Показывает JPG poster (priority — кандидат на LCP), как только видео готово —
 * прячет Image и отдаёт video. Без overhead'а на гидрацию всего hero subtree.
 */
export function FirstScreenHeroVideoPoster({ posterSrc, videoSrc, ariaLabel, sizes }: Props) {
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    if (!videoSrc) return;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setShouldLoadVideo(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [videoSrc]);

  return (
    <>
      {!videoReady ? (
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          fill
          priority
          sizes={sizes}
          src={posterSrc}
        />
      ) : null}
      {videoSrc ? (
        <video
          aria-label={ariaLabel}
          autoPlay
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          loop
          muted
          onCanPlay={() => setVideoReady(true)}
          playsInline
          poster={posterSrc}
          preload="none"
          src={shouldLoadVideo ? videoSrc : undefined}
        />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#1a1410]" />
      )}
    </>
  );
}
