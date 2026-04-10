"use client";

import Image from "next/image";
import { useState } from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import { publicSiteUrl } from "@/shared/config/public-site-url";
import { CasesAdDetailModal } from "@/widgets/cases/ui/cases-ad-detail-modal";
import type { CasesAdCard } from "@/widgets/cases/model/cases.data";

/* ─── helpers ─────────────────────────────────────────────────── */

type MediaLike = { url?: string | null } | string | number | null | undefined;

function mediaSrc(m: MediaLike): string {
  if (m && typeof m === "object" && "url" in m && typeof m.url === "string") return m.url;
  return "";
}

function mapDoc(doc: Record<string, unknown>): CasesAdCard {
  const credits = (doc.credits as { line?: string }[] | undefined)
    ?.map((r) => r.line)
    .filter((x): x is string => Boolean(x)) ?? [];
  const bulletsRaw = doc.detailResultBullets as { line?: string }[] | undefined;
  const detailResultBullets = bulletsRaw
    ?.map((b) => b.line)
    .filter((x): x is string => Boolean(x));
  const closing = typeof doc.detailResultClosing === "string" ? doc.detailResultClosing : undefined;
  const adV = mediaSrc(doc.detailVideo as MediaLike);
  return {
    id: String(doc.id ?? "preview"),
    image: mediaSrc(doc.image as MediaLike),
    title: String(doc.title ?? ""),
    credits,
    detailTask: String(doc.detailTask ?? ""),
    detailResultLead: String(doc.detailResultLead ?? ""),
    ...(adV ? { detailVideoUrl: adV } : {}),
    ...(detailResultBullets?.length ? { detailResultBullets } : {}),
    ...(closing?.trim() ? { detailResultClosing: closing } : {}),
  };
}

/* ─── Ad card (1440 размер: 575×320) ──────────────────────────── */

function AdCardPreview({
  card,
  onClick,
}: {
  card: CasesAdCard;
  onClick: () => void;
}) {
  return (
    <button
      aria-label="Открыть модалку"
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#0d0300] outline-none"
      onClick={onClick}
      style={{ width: 575, height: 320 }}
      type="button"
    >
      {card.image && (
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 grayscale group-hover:grayscale-0"
          fill
          sizes="575px"
          src={card.image}
          unoptimized
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[#0d0300] mix-blend-color"
        style={{ opacity: 0.2 }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 py-5 text-center text-white">
        <div className="h-[34px] shrink-0 opacity-0" aria-hidden />
        <p className="m-0 max-w-full text-[28px] font-bold uppercase leading-[0.9]">{card.title}</p>
        <div className="flex min-h-[34px] max-w-[340px] flex-col justify-end text-[14px] font-normal leading-[1.2]">
          {card.credits.map((line) => (
            <p className="m-0 leading-[1.2]" key={line}>{line}</p>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm">
          открыть модалку →
        </span>
      </div>
    </button>
  );
}

/* ─── Main client component ────────────────────────────────────── */

export function CasesAdvertisingPreviewClient({
  initialData,
}: {
  initialData: Record<string, unknown>;
}) {
  const { data } = useLivePreview({
    initialData,
    serverURL: publicSiteUrl,
    depth: 2,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const card = mapDoc(data);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0d0300] overflow-hidden">
      <AdCardPreview card={card} onClick={() => setModalOpen(true)} />
      <p className="mt-4 text-[11px] text-white/25">наведи для цвета · нажми для модалки</p>

      <CasesAdDetailModal
        card={card}
        layout="1440"
        onClose={() => setModalOpen(false)}
        open={modalOpen}
      />
    </div>
  );
}
