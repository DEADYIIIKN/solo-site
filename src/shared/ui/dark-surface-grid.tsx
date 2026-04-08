import { cn } from "@/shared/lib/utils";
import { firstScreenAssets } from "@/widgets/first-screen/model/first-screen.data";

export function DarkSurfaceGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0 opacity-[0.08]", className)}
      style={{
        backgroundImage: `url('${firstScreenAssets.backgroundGrid}')`,
        backgroundPosition: "top left",
        backgroundRepeat: "repeat",
        backgroundSize: "778px 416px",
      }}
    />
  );
}
