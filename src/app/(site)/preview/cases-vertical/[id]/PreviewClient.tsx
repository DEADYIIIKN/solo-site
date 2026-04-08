"use client";

import Image from "next/image";
import { useState } from "react";

import { useLivePreview } from "@payloadcms/live-preview-react";

import { CasesVerticalDetailModal } from "@/widgets/cases/ui/cases-vertical-detail-modal";
import { cases1440Assets } from "@/widgets/cases/model/cases.data";
import type { CasesVerticalCard } from "@/widgets/cases/model/cases.data";

/* ─── helpers ─────────────────────────────────────────────────── */

type MediaLike = { url?: string | null } | string | number | null | undefined;

function mediaSrc(m: MediaLike): string {
  if (m && typeof m === "object" && "url" in m && typeof m.url === "string") return m.url;
  return "";
}

function mapDoc(doc: Record<string, unknown>): CasesVerticalCard {
  const titleLines = String(doc.title ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const credits = (doc.credits as { line?: string }[] | undefined)
    ?.map((r) => r.line)
    .filter((x): x is string => Boolean(x)) ?? [];
  const vUrl = mediaSrc(doc.detailVideo as MediaLike);
  return {
    id: String(doc.id ?? "preview"),
    image: mediaSrc(doc.image as MediaLike),
    titleLines,
    views: String(doc.views ?? ""),
    credits,
    overlayLight: true,
    detailTask: String(doc.detailTask ?? ""),
    detailResult: String(doc.detailResult ?? ""),
    ...(vUrl ? { detailVideoUrl: vUrl } : {}),
  };
}

/* ─── Card (1440 размер: 283×510) ─────────────────────────────── */

function CardPreview({
  card,
  onClick,
}: {
  card: CasesVerticalCard;
  onClick: () => void;
}) {
  return (
    <button
      aria-label="Открыть модалку"
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#0d0300] outline-none"
      onClick={onClick}
      style={{ width: 283, height: 510 }}
      type="button"
    >
      {card.image && (
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 grayscale group-hover:grayscale-0"
          fill
          sizes="283px"
          src={card.image}
          unoptimized
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[#0d0300] mix-blend-color transition-opacity duration-300"
        style={{ opacity: card.overlayLight ? 0.2 : 0.6 }}
      />
      <div className="pointer-events-none absolute inset-px flex h-[calc(100%-2px)] flex-col justify-between p-5 text-center text-white">
        <div className="flex min-h-[40px] flex-col justify-center text-[24px] font-bold uppercase leading-[0.9]">
          {card.titleLines.map((line) => (
            <p className="m-0 leading-[0.9]" key={line}>{line}</p>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <img alt="" className="block shrink-0 object-contain" height="21" src={cases1440Assets.viewsIcon} style={{ maxWidth: 31, maxHeight: 21 }} width="31" />
          <p className="m-0 text-[40px] font-bold lowercase leading-[1.2]">{card.views}</p>
        </div>
        <div className="flex min-h-[37px] flex-col justify-end text-[14px] font-normal leading-[1.2]">
          {card.credits.map((line) => (
            <p className="m-0" key={line}>{line}</p>
          ))}
        </div>
      </div>
      {/* Hover hint */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm">
          открыть модалку →
        </span>
      </div>
    </button>
  );
}

/* ─── Main client component ────────────────────────────────────── */

export function CasesVerticalPreviewClient({
  initialData,
}: {
  initialData: Record<string, unknown>;
}) {
  const { data } = useLivePreview({
    initialData,
    serverURL: "http://localhost:3000",
    depth: 2,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const card = mapDoc(data);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0d0300] overflow-hidden">
      <CardPreview card={card} onClick={() => setModalOpen(true)} />
      <p className="mt-4 text-[11px] text-white/25">наведи для цвета · нажми для модалки</p>

      <CasesVerticalDetailModal
        card={card}
        layout="1440"
        onClose={() => setModalOpen(false)}
        open={modalOpen}
      />
    </div>
  );
}
