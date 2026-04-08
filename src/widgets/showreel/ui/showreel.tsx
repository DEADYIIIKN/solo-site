"use client";

import { cn } from "@/shared/lib/utils";
import { showreelAssets } from "@/widgets/showreel/model/showreel.data";

function ShowreelVideoOrPlaceholder({
  ariaLabel = "Showreel",
  className,
}: {
  ariaLabel?: string;
  className?: string;
}) {
  const src = showreelAssets.video;
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[#1a1410]",
          className,
        )}
      />
    );
  }
  return (
    <video
      aria-label={ariaLabel}
      autoPlay
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full object-cover",
        className,
      )}
      loop
      muted
      playsInline
      preload="auto"
      src={src}
    />
  );
}

export function Showreel() {
  return (
    <section className="relative z-10 overflow-x-clip" id="showreel-section">
      {/* 360: 16:9 как на 768/1024 — не квадрат 360×360 (иначе лишняя тёмная зона под полосой видео) */}
      <div className="relative mx-auto aspect-video w-[360px] min-[480px]:hidden">
        <div className="absolute inset-0 z-10 overflow-hidden">
          <ShowreelVideoOrPlaceholder />
        </div>
      </div>

      <div className="relative mx-auto hidden aspect-video w-[480px] min-[480px]:block min-[768px]:hidden">
        <div className="absolute inset-0 z-10 overflow-hidden">
          <ShowreelVideoOrPlaceholder />
        </div>
      </div>

      <div className="relative mx-auto hidden h-[432px] w-[768px] min-[768px]:block min-[1024px]:hidden">
        <div className="absolute inset-0 z-10 overflow-hidden">
          <ShowreelVideoOrPlaceholder />
        </div>
      </div>

      {/* 1024: высота = h видео (576), без вертикального центрирования — иначе полосы «воздуха» сверху/снизу */}
      <div className="relative mx-auto hidden h-[576px] w-[1024px] min-[1024px]:block min-[1440px]:hidden">
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          data-showreel-target="1024"
          style={{ opacity: 0 }}
        >
          <ShowreelVideoOrPlaceholder />
        </div>
      </div>

      <div className="relative mx-auto hidden h-[810px] w-[1440px] min-[1440px]:block">
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          data-showreel-target="1440"
          style={{ opacity: 0 }}
        >
          <ShowreelVideoOrPlaceholder />
        </div>
      </div>
    </section>
  );
}
