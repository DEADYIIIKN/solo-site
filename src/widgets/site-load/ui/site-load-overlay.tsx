"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { getCriticalSiteLoadAssetsForViewport } from "@/widgets/site-load/model/site-load-critical-assets";

/* ── timing ─────────────────────────────────────────────── */
const ANIM_MIN_MS = 2800;
const HOLD_MS     = 500;
const EXIT_DUR_MS = 600;
const PRELOAD_TIMEOUT_MS = 4500;

/* ── geometry — все единицы в px (SVG user units при 1:1) ── */
// Pill & Camera: viewBox width = 113.143 (full unit including triangle)
// Camera unit center X = 113.143 / 2 = 56.5715
const CAM_VB_W = 113.143;
const CAM_H    = 67.5535;
const PILL_H   = 35.9533;
const CAM_CX   = CAM_VB_W / 2;  // 56.572 — center X (одинаков для pill и camera)
const CAM_CY   = CAM_H   / 2;   // 33.777 — center Y camera
const PILL_CY  = PILL_H  / 2;   // 17.977 — center Y pill

// Logo: viewBox "0 0 396 70"
// О2 unit (body+triangle) начинается с x=282.857, ширина = CAM_VB_W
// → center X = 282.857 + 56.572 = 339.429
const LOGO_W     = 396;
const LOGO_H     = 70;
const LOGO_O2_CX = 282.857 + CAM_CX; // 339.429 — О2 центр X
const LOGO_CY    = LOGO_H / 2;       // 35

// Смещение от О2-центра к центру всего лого
// После появления всех букв нужно сдвинуть вправо на эту величину
const LOGO_CENTER_SHIFT = LOGO_O2_CX - LOGO_W / 2; // 339.429 - 198 = 141.429

/* ── SVG paths from Figma 783:9977 ──────────────────────── */

// Pill — viewBox "0 0 113.143 35.9533"
const D_PILL_BODY =
  "M78.9926 5.63075C75.6683 1.89586 71.5548 0 66.757 0H17.1708C12.4376 0 8.33755 1.89069 4.98367 5.62558C1.67559 9.30882 0 12.8393 0 18C0 23.1606 1.67559 26.6444 4.98367 30.3277C8.33216 34.0574 12.4322 35.9533 17.1708 35.9533H66.757C71.5494 35.9533 75.6683 34.0574 78.9926 30.3226C82.2683 26.6393 83.9278 23.1552 83.9278 18C83.9278 12.8445 82.2683 9.31915 78.9926 5.63075Z";
const D_PILL_TRI =
  "M93.3643 14.6336C92.4188 15.1231 91.8019 16.2516 91.8019 17.4935L91.8019 17.6742C91.8019 18.9213 92.4188 20.0445 93.3643 20.534L109.549 28.9176C111.252 29.7988 113.143 28.2941 113.143 26.0578V9.10982C113.143 6.87351 111.246 5.36889 109.549 6.25003L93.3643 14.6336Z";

// Camera — viewBox "0 0 113.143 67.5535"
const D_CAM_BODY =
  "M78.9926 5.63075C75.6683 1.89586 71.5548 0 66.757 0H17.1708C12.4376 0 8.33755 1.89069 4.98367 5.62558C1.67559 9.30882 0 13.7927 0 18.9534V48.6002C0 53.7608 1.67559 58.2446 4.98367 61.9279C8.33216 65.6576 12.4322 67.5535 17.1708 67.5535H66.757C71.5494 67.5535 75.6683 65.6576 78.9926 61.9228C82.2683 58.2395 83.9278 53.7554 83.9278 48.6002V18.9534C83.9278 13.7979 82.2683 9.31915 78.9926 5.63075ZM69.5074 19.3202V48.2281C69.5074 49.2509 69.1922 50.1033 68.5403 50.8316C67.9261 51.5187 67.2527 51.8339 66.431 51.8339H17.5075C16.6805 51.8339 16.0124 51.5135 15.3982 50.8316C14.7463 50.1084 14.4311 49.256 14.4311 48.2281V19.3202C14.4311 18.2922 14.7463 17.445 15.3982 16.7166C16.0124 16.0295 16.6859 15.7144 17.5075 15.7144H66.431C67.2527 15.7144 67.9261 16.0347 68.5403 16.7166C69.1922 17.4398 69.5074 18.2922 69.5074 19.3202Z";
const D_CAM_TRI =
  "M93.3643 24.6336C92.4188 25.1231 91.8019 26.2516 91.8019 27.4935V40.6742C91.8019 41.9213 92.4188 43.0445 93.3643 43.534L109.549 51.9176C111.252 52.7988 113.143 51.294 113.143 49.0578V19.1098C113.143 16.8735 111.246 15.3689 109.549 16.25L93.3643 24.6336Z";

// Logo СОЛО — viewBox "0 0 396 70"
const D_LOGO_O2 =
  "M361.85 5.63075C358.525 1.89586 354.412 0 349.614 0H300.028C295.295 0 291.195 1.89069 287.841 5.62558C284.533 9.30882 282.857 13.7927 282.857 18.9534V48.6002C282.857 53.7608 284.533 58.2446 287.841 61.9279C291.189 65.6576 295.289 67.5535 300.028 67.5535H349.614C354.407 67.5535 358.525 65.6576 361.85 61.9228C365.125 58.2395 366.785 53.7554 366.785 48.6002V18.9534C366.785 13.7979 365.125 9.31915 361.85 5.63075ZM352.365 19.3202V48.2281C352.365 49.2509 352.049 50.1033 351.397 50.8316C350.783 51.5187 350.11 51.8339 349.288 51.8339H300.365C299.538 51.8339 298.87 51.5135 298.255 50.8316C297.603 50.1084 297.288 49.256 297.288 48.2281V19.3202C297.288 18.2922 297.603 17.445 298.255 16.7166C298.87 16.0295 299.543 15.7144 300.365 15.7144H349.288C350.11 15.7144 350.783 16.0347 351.397 16.7166C352.049 17.4398 352.365 18.2922 352.365 19.3202Z";
const D_LOGO_TRI =
  "M376.222 24.6337C375.276 25.1232 374.659 26.2516 374.659 27.4936V40.6743C374.659 41.9214 375.276 43.0446 376.222 43.5341L392.406 51.9177C394.109 52.7989 396 51.2941 396 49.0579V19.1099C396 16.8736 394.103 15.369 392.406 16.2501L376.222 24.6337Z";
const D_LOGO_L =
  "M205.366 8.34117C206.497 3.45795 210.849 0 215.864 0H257.265C263.216 0 268.041 4.82155 268.041 10.7692V62.1654C268.041 65.1393 265.629 67.55 262.653 67.55H259.028C256.053 67.55 253.641 65.1393 253.641 62.1654V18.2041C253.641 16.7172 252.435 15.5118 250.947 15.5118H220.328C219.083 15.5118 217.999 16.3654 217.709 17.5761L207.755 59.0501C206.593 63.893 202.26 67.3077 197.277 67.3077H188.613C185.646 67.3077 183.238 64.9113 183.225 61.9468L183.207 57.9083C183.194 54.9252 185.61 52.5 188.595 52.5H193C194.253 52.5 195.341 51.6355 195.624 50.4148L205.366 8.34117Z";
const D_LOGO_O1 =
  "M167.889 5.63075C164.566 1.89586 160.451 0 155.655 0H106.069C101.335 0 97.2304 1.89069 93.8808 5.62558C90.5728 9.30882 88.898 13.7927 88.898 18.9534V48.6002C88.898 53.7608 90.5728 58.2395 93.8808 61.9279C97.2304 65.6576 101.329 67.5535 106.069 67.5535H155.655C160.446 67.5535 164.566 65.6576 167.889 61.9228C171.167 58.2395 172.826 53.7554 172.826 48.6002V18.9534C172.826 13.7979 171.167 9.31915 167.889 5.63075ZM158.405 19.3202V48.2281C158.405 49.256 158.089 50.1033 157.438 50.8316C156.823 51.5187 156.151 51.8339 155.329 51.8339H106.405C105.578 51.8339 104.911 51.5135 104.296 50.8316C103.645 50.1084 103.33 49.256 103.33 48.2281V19.3202C103.33 18.2922 103.645 17.445 104.296 16.7166C104.911 16.0295 105.583 15.7144 106.405 15.7144H155.329C156.156 15.7144 156.823 16.0347 157.438 16.7166C158.089 17.4398 158.405 18.2922 158.405 19.3202Z";
const D_LOGO_C =
  "M77.0045 10.3349C77.0045 13.3059 74.5967 15.7154 71.624 15.7195L17.5076 15.7936C16.6857 15.7936 16.0128 16.1083 15.3977 16.7954C14.7466 17.5237 14.4323 18.3705 14.4322 19.3983V48.3065C14.4323 49.3341 14.7466 50.1862 15.3977 50.9094C16.0128 51.5913 16.6805 51.9109 17.5076 51.9109L71.6095 51.8369C74.5878 51.8328 77.0045 54.2449 77.0045 57.2215V62.1721C77.0045 65.1431 74.5967 67.5527 71.624 67.5567L17.1708 67.631C12.4313 67.631 8.33195 65.7365 4.98262 62.0071C1.6745 58.3189 0 53.8378 0 48.6772V19.0328C0 13.8722 1.6745 9.38598 4.98262 5.70274C8.33197 1.96837 12.4364 0.0788763 17.1708 0.0788763L71.6097 0.00711181C74.5881 0.00318559 77.0045 2.41511 77.0045 5.39172V10.3349Z";

/* ── CSS keyframes ───────────────────────────────────────── */
/*
  Таймлайн (от первого paint):
    0ms    — капсула входит (spring), держится
    500ms  — камера раскрывается из высоты капсулы (scaleY .532→1), пульсирует
    650ms  — капсула схлопывается и гаснет
    1400ms — О2+△ scale-in на месте камеры
    1500ms — камера заканчивает fade-out
    1560ms — Л выезжает справа
    1690ms — О1 выезжает справа
    1820ms — С выезжает справа → СОЛО собран
*/
const KEYFRAMES_CSS = `
  @keyframes _slPill {
    0%   { opacity:0; transform:scale(.76);
           animation-timing-function:cubic-bezier(.34,1.56,.64,1); }
    50%  { opacity:1; transform:scale(1);
           animation-timing-function:ease-in-out; }
    72%  { opacity:1; transform:scaleX(1) scaleY(1);
           animation-timing-function:cubic-bezier(.4,0,.6,1); }
    100% { opacity:0; transform:scaleX(1) scaleY(0); }
  }

  @keyframes _slCam {
    0%   { opacity:0; transform:scaleY(.532);
           animation-timing-function:cubic-bezier(.22,1,.36,1); }
    10%  { opacity:1; }
    50%  { transform:scaleY(1);
           animation-timing-function:ease-in-out; }
    62%  { transform:scale(1.022); animation-timing-function:ease-in-out; }
    74%  { transform:scale(1);     animation-timing-function:ease-in-out; }
    84%  { transform:scale(1.015); animation-timing-function:ease-in-out; }
    90%  { transform:scale(1); opacity:1; animation-timing-function:ease-in; }
    100% { opacity:0; transform:scale(1); }
  }

  /* О2 в логотипе: камера «стала» буквой О — scale-in на том же месте */
  @keyframes _slO2 {
    from { opacity:0; transform:scale(.88); }
    to   { opacity:1; transform:scale(1);   }
  }

  /* Буквы Л, О1, С выезжают справа (от О2) влево на своё место */
  @keyframes _slLetter {
    from { opacity:0; transform:translateX(20px); }
    to   { opacity:1; transform:translateX(0);     }
  }

  /*
    После того как камера гаснет (≈1500ms), лого плавно смещается вправо
    так, чтобы всё слово СОЛО оказалось по центру экрана.
    Смещение = LOGO_O2_CX - LOGO_W/2 = 339.429 - 198 = 141.429px.
  */
  @keyframes _slLogoCenter {
    from { transform: translateX(0); }
    to   { transform: translateX(${LOGO_CENTER_SHIFT}px); }
  }
`;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const decodeAndDone = () => {
      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined).finally(done);
        return;
      }

      done();
    };

    image.decoding = "async";
    image.fetchPriority = "high";
    image.loading = "eager";
    image.onload = decodeAndDone;
    image.onerror = done;
    image.src = src;

    if (image.complete) decodeAndDone();
  });
}

function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let settled = false;

    const done = () => {
      if (settled) return;
      settled = true;
      video.removeAttribute("src");
      video.load();
      resolve();
    };

    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = done;
    video.onerror = done;
    video.src = src;
    video.load();
  });
}

function waitForCriticalAssets(width: number): Promise<void> {
  const assets = getCriticalSiteLoadAssetsForViewport(width);
  const preload = Promise.all(
    assets.map((asset) =>
      asset.kind === "video" ? preloadVideo(asset.src) : preloadImage(asset.src),
    ),
  ).then(() => undefined);

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, PRELOAD_TIMEOUT_MS);
  });

  return Promise.race([preload, timeout]);
}

/**
 * Figma 783:9969/9977 — экран загрузки.
 *
 * Ключевая механика позиционирования:
 *  Единая «сцена» (нулевая точка) — center stage = (50vw, 50vh).
 *  Камера и О2 в логотипе имеют один и тот же центр X = CAM_VB_W/2 (56.57px).
 *  Логотип сдвинут влево на LOGO_O2_CX (339.43px) чтобы О2 оказалась на нулевой точке.
 *  Таким образом камера и О2 в логотипе точно накладываются при crossfade.
 */
export function SiteLoadOverlay() {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pct, setPct]         = useState(0);
  const [scale, setScale]     = useState(1);
  const [appReady, setAppReady] = useState(false);
  const [criticalAssetsReady, setCriticalAssetsReady] = useState(false);
  const startedAtRef = useRef(0);
  const progressRef = useRef(0);
  const appReadyRef = useRef(false);
  const criticalAssetsReadyRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = performance.now();
  }, []);

  /* ── Adaptive scale: fit full logo on narrow viewports ── */
  useEffect(() => {
    const compute = () => {
      // Логотип уходит влево от центра на LOGO_O2_CX px.
      // Нужно минимум 16px отступа от левого края.
      const available = window.innerWidth / 2 - 16;
      setScale(Math.min(1, available / LOGO_O2_CX));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  /* ── Realistic loading progress counter ───────────────── */
  useEffect(() => {
    criticalAssetsReadyRef.current = criticalAssetsReady;
  }, [criticalAssetsReady]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      appReadyRef.current = true;
      setAppReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let cancelled = false;

    waitForCriticalAssets(window.innerWidth).finally(() => {
      if (!cancelled) setCriticalAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Realistic loading progress counter ───────────────── */
  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const ready = appReadyRef.current && criticalAssetsReadyRef.current;
      let current = progressRef.current;

      if (ready) {
        // Страница загружена — быстро добегаем до 100
        current = Math.min(100, current + dt * 0.22);
      } else {
        // Органичное замедление по мере роста
        const s =
          current < 30 ? 0.075 :
          current < 60 ? 0.043 :
          current < 80 ? 0.021 : 0.006;
        current = Math.min(99, current + dt * s);
      }

      progressRef.current = current;
      setPct(Math.floor(current));
      if (current < 100) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Exit: ждём гидрацию + критические ассеты первого экрана ── */
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!appReady || !criticalAssetsReady) {
      return;
    }

    const elapsed = performance.now() - startedAtRef.current;
    const remaining = reduceMotion ? 0 : Math.max(0, ANIM_MIN_MS - elapsed);
    const delay = remaining + (reduceMotion ? 150 : HOLD_MS);
    const timeout = window.setTimeout(() => setExiting(true), delay);

    return () => window.clearTimeout(timeout);
  }, [appReady, criticalAssetsReady]);

  useEffect(() => {
    if (!exiting) return;
    document.body.style.overflow = "";
    const t = window.setTimeout(() => setVisible(false), EXIT_DUR_MS);
    return () => window.clearTimeout(t);
  }, [exiting]);

  useEffect(() => {
    if (visible && !exiting) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [visible, exiting]);

  if (!visible) return null;

  return (
    <div
      aria-busy={!exiting}
      aria-hidden={exiting}
      className={cn(
        "fixed inset-0 z-[10000] bg-[#0d0300]",
        "transition-opacity duration-[600ms] ease-out",
        exiting ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      role="status"
    >
      <style>{KEYFRAMES_CSS}</style>
      <span className="sr-only">Загрузка</span>

      {/*
        ── Animation stage ──────────────────────────────────
        Нулевая точка сцены = (50vw, 50vh) = центр камеры = центр О2.
        Все дочерние элементы позиционированы относительно этой точки.
        scale() работает вокруг нулевой точки → responsive без потери alignment.
      */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* ── 1. Капсула (pill) ─ center = (0, 0) ── */}
        <div
          style={{
            position: "absolute",
            width: CAM_VB_W,
            height: PILL_H,
            left: -CAM_CX,   // -56.572
            top:  -PILL_CY,  // -17.977
          }}
        >
          <div style={{ transformOrigin: "center", animation: "_slPill 650ms linear both" }}>
            <svg
              aria-hidden="true"
              fill="none"
              height={PILL_H}
              viewBox="0 0 113.143 35.9533"
              width={CAM_VB_W}
            >
              <path d={D_PILL_BODY} fill="white" />
              <path d={D_PILL_TRI}  fill="#FF5C00" />
            </svg>
          </div>
        </div>

        {/* ── 2. Камера ─ center = (0, 0), delay 500ms ── */}
        <div
          style={{
            position: "absolute",
            width: CAM_VB_W,
            height: CAM_H,
            left: -CAM_CX,  // -56.572
            top:  -CAM_CY,  // -33.777
          }}
        >
          <div style={{ transformOrigin: "center", animation: "_slCam 1000ms linear 500ms both" }}>
            <svg
              aria-hidden="true"
              fill="none"
              height={CAM_H}
              viewBox="0 0 113.143 67.5535"
              width={CAM_VB_W}
            >
              <path d={D_CAM_BODY} fill="white" fillRule="evenodd" />
              <path d={D_CAM_TRI}  fill="#FF5C00" />
            </svg>
          </div>
        </div>

        {/* ── 3. Логотип СОЛО ─ О2 center = (0, 0) ── */}
        {/*
          Логотип сдвинут так, что О2 (x=282.857…396) стоит ровно
          на нулевой точке сцены → точное наложение с камерой.
        */}
        <svg
          aria-label="СОЛО"
          fill="none"
          style={{
            position: "absolute",
            width: LOGO_W,
            height: LOGO_H,
            left: -LOGO_O2_CX, // -339.429 → О2 на нулевой точке сцены
            top:  -LOGO_CY,    // -35
            // После гашения камеры (~1500ms) плавно сдвигаемся вправо
            // на LOGO_CENTER_SHIFT (141.429px) → всё СОЛО по центру
            animation: `_slLogoCenter 720ms cubic-bezier(.22,1,.36,1) 1500ms both`,
          }}
          viewBox="0 0 396 70"
        >
          {/* О2 + △ — scale-in на месте камеры, delay совпадает с началом fade-out камеры */}
          <g
            style={{
              animation: "_slO2 450ms cubic-bezier(.22,1,.36,1) 1400ms both",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={D_LOGO_O2}  fill="white" />
            <path d={D_LOGO_TRI} fill="#FF5C00" />
          </g>

          {/* Л */}
          <g
            style={{
              animation: "_slLetter 400ms cubic-bezier(.22,1,.36,1) 1560ms both",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={D_LOGO_L} fill="white" />
          </g>

          {/* О1 */}
          <g
            style={{
              animation: "_slLetter 400ms cubic-bezier(.22,1,.36,1) 1690ms both",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={D_LOGO_O1} fill="white" />
          </g>

          {/* С */}
          <g
            style={{
              animation: "_slLetter 400ms cubic-bezier(.22,1,.36,1) 1820ms both",
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={D_LOGO_C} fill="white" />
          </g>
        </svg>
      </div>

      {/* ── Progress percentage (Figma: bottom 95px, Montserrat Bold 22px) ── */}
      <p
        className="m-0"
        style={{
          position: "absolute",
          bottom: 95,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-family-heading, Montserrat, sans-serif)",
          fontWeight: 700,
          fontSize: 22,
          lineHeight: 1.2,
          color: "white",
          whiteSpace: "nowrap",
        }}
      >
        {pct}%
      </p>
    </div>
  );
}
