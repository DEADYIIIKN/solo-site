import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_SHOWREEL_VIDEO = process.env.NEXT_PUBLIC_SHOWREEL_VIDEO;

async function loadShowreelData() {
  vi.resetModules();
  return import("@/widgets/showreel/model/showreel.data");
}

describe("showreel video source", () => {
  afterEach(() => {
    if (ORIGINAL_SHOWREEL_VIDEO === undefined) {
      delete process.env.NEXT_PUBLIC_SHOWREEL_VIDEO;
    } else {
      process.env.NEXT_PUBLIC_SHOWREEL_VIDEO = ORIGINAL_SHOWREEL_VIDEO;
    }
  });

  it("does not fall back to a bundled public video when env is unset", async () => {
    delete process.env.NEXT_PUBLIC_SHOWREEL_VIDEO;

    const { showreelVideoSrc } = await loadShowreelData();

    expect(showreelVideoSrc).toBe("");
  });

  it("uses NEXT_PUBLIC_SHOWREEL_VIDEO when provided", async () => {
    process.env.NEXT_PUBLIC_SHOWREEL_VIDEO = "https://cdn.example.com/showreel.mp4";

    const { showreelVideoSrc } = await loadShowreelData();

    expect(showreelVideoSrc).toBe("https://cdn.example.com/showreel.mp4");
  });
});
