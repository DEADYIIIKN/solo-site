"use client";

import { useEffect, useRef } from "react";

import { showreelAssets } from "@/widgets/showreel/model/showreel.data";

type LargeBreakpoint = "1024" | "1440";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getLargeBreakpoint(width: number): LargeBreakpoint | null {
  if (width >= 1440) return "1440";
  if (width >= 1024) return "1024";
  return null;
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t;
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function ShowreelMorphOverlay() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastSourceRef = useRef<HTMLElement | null>(null);
  const lastTargetRef = useRef<HTMLElement | null>(null);
  const sourceRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const breakpointRef = useRef<LargeBreakpoint | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const phaseRef = useRef<"source" | "morph" | "target">("source");

  useEffect(() => {
    function resetElementStyles() {
      if (lastSourceRef.current) {
        lastSourceRef.current.style.opacity = "";
        lastSourceRef.current.style.willChange = "";
      }
      if (lastTargetRef.current) {
        lastTargetRef.current.style.opacity = "";
        lastTargetRef.current.style.willChange = "";
      }
      lastSourceRef.current = null;
      lastTargetRef.current = null;
      phaseRef.current = "source";
    }

    function hideOverlay() {
      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.opacity = "0";
      overlay.style.transform = "translate3d(0,0,0) scale(1,1)";
    }

    function resolveTargets(breakpoint: LargeBreakpoint) {
      if (breakpointRef.current !== breakpoint) {
        breakpointRef.current = breakpoint;
        sourceRef.current = null;
        targetRef.current = null;
        sectionRef.current = null;
      }

      if (!sourceRef.current || !sourceRef.current.isConnected) {
        sourceRef.current = document.querySelector<HTMLElement>(
          `[data-showreel-source="${breakpoint}"]`,
        );
      }
      if (!targetRef.current || !targetRef.current.isConnected) {
        targetRef.current = document.querySelector<HTMLElement>(
          `[data-showreel-target="${breakpoint}"]`,
        );
      }
      if (!sectionRef.current || !sectionRef.current.isConnected) {
        sectionRef.current = targetRef.current?.closest("section") ?? null;
      }
    }

    function updateLayout() {
      const breakpoint = getLargeBreakpoint(window.innerWidth);
      if (!breakpoint) {
        hideOverlay();
        resetElementStyles();
        targetProgressRef.current = 0;
        currentProgressRef.current = 0;
        return;
      }

      resolveTargets(breakpoint);
      const source = sourceRef.current;
      const target = targetRef.current;
      const showreelSection = sectionRef.current;

      if (!source || !target || !showreelSection) {
        hideOverlay();
        resetElementStyles();
        targetProgressRef.current = 0;
        currentProgressRef.current = 0;
        return;
      }

      if (showreelAssets.video && currentProgressRef.current > 0.02) {
        const video = videoRef.current;
        if (video && !video.currentSrc && !video.src) {
          video.src = showreelAssets.video;
          video.load();
        }
      }

      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (
        sourceRect.width <= 0 ||
        sourceRect.height <= 0 ||
        targetRect.width <= 0 ||
        targetRect.height <= 0
      ) {
        hideOverlay();
        resetElementStyles();
        targetProgressRef.current = 0;
        currentProgressRef.current = 0;
        return;
      }

      const sectionTop = showreelSection.getBoundingClientRect().top;
      const startY = window.innerHeight * 1.02;
      const endY = window.innerHeight * 0.02;
      const rawProgress = clamp((startY - sectionTop) / (startY - endY), 0, 1);
      targetProgressRef.current = rawProgress;
      currentProgressRef.current = lerp(
        currentProgressRef.current,
        targetProgressRef.current,
        0.12,
      );

      const progress = easeInOutCubic(currentProgressRef.current);

      // Hysteresis removes flicker when user micro-scrolls around boundaries.
      const enterMorphAt = 0.06;
      const returnSourceAt = 0.03;
      const enterTargetAt = 0.97;
      const returnMorphAt = 0.93;

      if (phaseRef.current === "source" && currentProgressRef.current >= enterMorphAt) {
        phaseRef.current = "morph";
      } else if (
        phaseRef.current === "morph" &&
        currentProgressRef.current <= returnSourceAt
      ) {
        phaseRef.current = "source";
      } else if (
        phaseRef.current === "morph" &&
        currentProgressRef.current >= enterTargetAt
      ) {
        phaseRef.current = "target";
      } else if (
        phaseRef.current === "target" &&
        currentProgressRef.current <= returnMorphAt
      ) {
        phaseRef.current = "morph";
      }

      source.style.willChange = "opacity";
      target.style.willChange = "opacity";
      source.style.opacity = phaseRef.current === "source" ? "1" : "0";
      target.style.opacity = phaseRef.current === "target" ? "1" : "0";
      lastSourceRef.current = source;
      lastTargetRef.current = target;

      const x = lerp(sourceRect.left, targetRect.left, progress);
      const y = lerp(sourceRect.top, targetRect.top, progress);
      const width = lerp(sourceRect.width, targetRect.width, progress);
      const height = lerp(sourceRect.height, targetRect.height, progress);
      const sx = width / sourceRect.width;
      const sy = height / sourceRect.height;

      const overlay = overlayRef.current;
      if (!overlay) return;
      overlay.style.width = `${sourceRect.width}px`;
      overlay.style.height = `${sourceRect.height}px`;
      overlay.style.opacity = phaseRef.current === "morph" ? "1" : "0";
      overlay.style.borderRadius = `${lerp(12, 0, progress)}px`;
      overlay.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${sx}, ${sy})`;
    }

    function tick() {
      updateLayout();
      frameRef.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      resetElementStyles();
      hideOverlay();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[200] overflow-hidden opacity-0"
      ref={overlayRef}
      style={{
        top: 0,
        left: 0,
        transformOrigin: "top left",
        willChange: "transform,opacity,border-radius",
      }}
    >
      {showreelAssets.video ? (
        <video
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="none"
          ref={videoRef}
        />
      ) : (
        <div aria-hidden className="h-full w-full bg-[#1a1410]" />
      )}
    </div>
  );
}
