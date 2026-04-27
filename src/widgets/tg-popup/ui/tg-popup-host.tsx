"use client";

/**
 * TgPopupHost — глобальный контроллер для TG-popup (Phase 10, plan 10-03).
 *
 * Связывает foundation (10-01 useActivityTimer) и UI (10-02 TgPopup) через три gate:
 *   1. Env gate: NEXT_PUBLIC_TG_CHANNEL_URL должен быть задан, иначе silent skip.
 *   2. Session gate: sessionStorage["tg-popup-dismissed"] === "1" — не показываем
 *      повторно в той же сессии.
 *   3. Variant gate: useViewportLayout() ещё не resolved (SSR / pre-mount) — null.
 *
 * Когда все три gate пройдены — рендерится `<TgPopupHostActive>`, который
 * безусловно вызывает useActivityTimer (Rules of Hooks compliance — гейтинг
 * через рендер компонента, не через условный duration).
 *
 * Через 60s активного времени — setOpen(true), TgPopup появляется. Dismiss
 * (✕ / overlay click / ESC / CTA click) → setOpen(false) + persist в
 * sessionStorage.
 */

import { useCallback, useEffect, useState } from "react";

import { useActivityTimer } from "@/shared/lib/use-activity-timer";
import { useViewportLayout } from "@/shared/lib/use-viewport-layout";

import { TgPopup } from "./tg-popup";
import type { TgPopupVariant } from "./tg-popup-variants";

const STORAGE_KEY = "tg-popup-dismissed";

/**
 * Возвращает timer duration в ms.
 * Production default: 60_000 (60 секунд активности).
 * E2E test override: `window.__TG_TEST_TRIGGER_MS__` — number, устанавливается
 * через `page.addInitScript()` ТОЛЬКО в `tg-popup.spec.ts` (другие тесты не
 * видят popup за их test runtime).
 */
function getTriggerMs(): number {
  if (typeof window !== "undefined") {
    const override = (window as { __TG_TEST_TRIGGER_MS__?: unknown })
      .__TG_TEST_TRIGGER_MS__;
    if (typeof override === "number" && override > 0) return override;
  }
  return 60_000;
}

export function TgPopupHost() {
  const ctaHref = process.env.NEXT_PUBLIC_TG_CHANNEL_URL ?? "";
  const variant = useViewportLayout();

  // sessionStorage gate — initial check во время mount (avoid SSR mismatch).
  // null = ещё не проверили (mount); false = можно показывать; true = dismissed.
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setDismissed(window.sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Приватный режим Safari, sessionStorage недоступен — считаем что не dismissed.
      setDismissed(false);
    }
  }, []);

  // Silent skip: env пустой ИЛИ уже dismiss-нуто ИЛИ variant ещё не resolved.
  if (!ctaHref) return null;
  if (dismissed !== false) return null;
  if (!variant) return null;

  return <TgPopupHostActive variant={variant} ctaHref={ctaHref} />;
}

function TgPopupHostActive({
  variant,
  ctaHref,
}: {
  variant: TgPopupVariant;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);
  // Считываем один раз на mount — overrides не должны меняться в runtime.
  const triggerMs = getTriggerMs();

  useActivityTimer(
    triggerMs,
    useCallback(() => {
      setOpen(true);
    }, []),
  );

  const handleDismiss = useCallback(() => {
    setOpen(false);
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* noop — приватный режим Safari etc. */
    }
  }, []);

  return (
    <TgPopup
      ctaHref={ctaHref}
      onDismiss={handleDismiss}
      open={open}
      variant={variant}
    />
  );
}
