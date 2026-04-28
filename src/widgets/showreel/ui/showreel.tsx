"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { useViewportLayout } from "@/shared/lib/use-viewport-layout";
import { showreelAssets } from "@/widgets/showreel/model/showreel.data";

function ShowreelVideoOrPlaceholder({
  ariaLabel = "Showreel",
  className,
  shouldLoad = true,
}: {
  ariaLabel?: string;
  className?: string;
  shouldLoad?: boolean;
}) {
  const src = showreelAssets.video;
  if (!src || !shouldLoad) {
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
      preload="none"
      src={src}
    />
  );
}

export function Showreel() {
  const layout = useViewportLayout();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isVideoInView, setIsVideoInView] = useState(false);

  useEffect(() => {
    if (hasUserScrolled) return;
    const unlock = () => {
      if (window.scrollY <= 8) return;
      setHasUserScrolled(true);
    };

    unlock();
    window.addEventListener("scroll", unlock, { passive: true });
    return () => window.removeEventListener("scroll", unlock);
  }, [hasUserScrolled]);

  useEffect(() => {
    if (!hasUserScrolled) return;
    const section = sectionRef.current;
    if (!section || isVideoInView) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsVideoInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsVideoInView(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasUserScrolled, isVideoInView]);

  if (!layout) {
    return <section className="relative z-10 overflow-x-clip" id="showreel-section" ref={sectionRef} />;
  }

  return (
    <section className="relative z-10 overflow-x-clip" id="showreel-section" ref={sectionRef}>
      {layout === "360" ? (
        <div className="relative mx-auto aspect-video w-[360px]">
          <div className="absolute inset-0 z-10 overflow-hidden">
            <ShowreelVideoOrPlaceholder shouldLoad={isVideoInView} />
          </div>
        </div>
      ) : null}

      {layout === "480" ? (
        <div className="relative mx-auto aspect-video w-[480px]">
          <div className="absolute inset-0 z-10 overflow-hidden">
            <ShowreelVideoOrPlaceholder shouldLoad={isVideoInView} />
          </div>
        </div>
      ) : null}

      {layout === "768" ? (
        <div className="relative mx-auto h-[432px] w-[768px]">
          <div className="absolute inset-0 z-10 overflow-hidden">
            <ShowreelVideoOrPlaceholder shouldLoad={isVideoInView} />
          </div>
        </div>
      ) : null}

      {layout === "1024" ? (
        <div className="relative mx-auto h-[576px] w-[1024px]">
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            data-showreel-target="1024"
            style={{ opacity: 0 }}
          >
            <ShowreelVideoOrPlaceholder shouldLoad={isVideoInView} />
          </div>
        </div>
      ) : null}

      {layout === "1440" ? (
        <div className="relative mx-auto h-[810px] w-[1440px]">
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            data-showreel-target="1440"
            style={{ opacity: 0 }}
          >
            <ShowreelVideoOrPlaceholder shouldLoad={isVideoInView} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
