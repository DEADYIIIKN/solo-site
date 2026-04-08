import { cn } from "@/shared/lib/utils";

type FirstScreenGeoGlowProps = {
  cx: number;
  cy: number;
  /** радиус размытого «ореола» */
  r: number;
  blur: number;
  size: number;
  /** уникальный id фильтра (в DOM несколько брейкпоинтов сразу) */
  filterId: string;
  /** радиус центральной точки, по умолчанию как в макете 1440 */
  dotR?: number;
  /**
   * Пульсация записи (`first-screen-geo-recording-pulse` в globals.css).
   * Для статичных маркеров (например «Пакеты» в услугах 1440) — `false`.
   */
  pulse?: boolean;
};

/** Оранжевая метка: размытый ореол + чёткая точка (как гео-блок героя 480 / Figma 783:9214–9215). */
export function FirstScreenGeoGlow({
  cx,
  cy,
  r,
  blur,
  size,
  filterId,
  dotR = 6,
  pulse = true,
}: FirstScreenGeoGlowProps) {
  return (
    <svg
      className={cn("block size-full", pulse && "first-screen-geo-recording-pulse")}
      fill="none"
      height={size}
      overflow="visible"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height={size} id={filterId} width={size} x="0" y="0">
          <feFlood floodOpacity="0" result="bg" />
          <feBlend in="SourceGraphic" in2="bg" mode="normal" result="shape" />
          <feGaussianBlur result="glow" stdDeviation={blur} />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <circle cx={cx} cy={cy} fill="#FF5C00" r={r} />
      </g>
      <circle cx={cx} cy={cy} fill="#FF5C00" r={dotR} />
    </svg>
  );
}
