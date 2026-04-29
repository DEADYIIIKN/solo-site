export const showreelVideoSrc =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SHOWREEL_VIDEO?.trim()
    ? process.env.NEXT_PUBLIC_SHOWREEL_VIDEO.trim()
    : "/assets/video/bts-ozon.mp4";

export const showreelAssets = {
  backgroundGrid: "/assets/figma/9656-first-screen-1440/rectangle173.png",
  video: showreelVideoSrc,
};
