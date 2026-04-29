/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useState } from "react";

import { SiteNavLink } from "@/shared/ui/site-nav-link";
import {
  footerAssets,
  footerBlogPosts,
  footerContent,
  getFooterNavLinks,
} from "@/widgets/footer/model/footer.data";

const CARD_WIDTH = 242;
const CARD_GAP = 10;
const SLIDE_STEP = CARD_WIDTH + CARD_GAP;
const MAX_SLIDE = 2;

/**
 * Figma 783:10266 — «footer» 360px: одноколоночный центрированный макет без навигации.
 */
export function Footer360({
  showSecrets = true,
  showNews = true,
}: {
  showSecrets?: boolean;
  showNews?: boolean;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const navLinks = getFooterNavLinks(showNews);

  const handlePrev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setSlideIndex((i) => Math.min(MAX_SLIDE, i + 1));

  return (
    <footer
      className="relative block w-full bg-[#0d0300] min-[480px]:hidden"
      id="footer-360"
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('${footerAssets.backgroundGrid}')`,
          backgroundSize: "778px 416px",
          backgroundPosition: "top left",
        }}
      />

      {/* Main content */}
      <div className="relative mx-auto flex max-w-[360px] flex-col gap-[100px] px-[16px] pt-[70px] pb-[70px]">

        {/* ── Blog section ────────────────────────────── */}
        {showSecrets && <div className="flex flex-col gap-[30px]">

          {/* Title + navigation arrows */}
          <div className="flex items-start justify-between">
            <p className="m-0 max-w-[220px] pl-[12px] font-bold lowercase leading-[0.9] text-[20px] text-white">
              {footerContent.blogTitle}
            </p>
            <div className="flex shrink-0 items-center gap-[12px]">
              <button
                aria-label="Предыдущие статьи"
                className="relative block size-[34px] shrink-0 cursor-pointer overflow-hidden transition-opacity disabled:cursor-default disabled:opacity-30"
                disabled={slideIndex === 0}
                onClick={handlePrev}
                type="button"
              >
                <img
                  alt=""
                  className="block"
                  height={34}
                  src={footerAssets.arrowPrev}
                  width={34}
                />
              </button>
              <button
                aria-label="Следующие статьи"
                className="relative block size-[34px] shrink-0 cursor-pointer overflow-hidden transition-opacity disabled:cursor-default disabled:opacity-30"
                disabled={slideIndex === MAX_SLIDE}
                onClick={handleNext}
                type="button"
              >
                <img
                  alt=""
                  className="block"
                  height={34}
                  src={footerAssets.arrowNext}
                  width={34}
                />
              </button>
            </div>
          </div>

          {/* Blog cards slider */}
          <div className="overflow-visible">
            <div
              className="flex gap-[10px] transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(${-slideIndex * SLIDE_STEP}px)` }}
            >
              {footerBlogPosts.map((post) => (
                <div
                  className="flex w-[242px] shrink-0 flex-col gap-[12px]"
                  key={post.id}
                >
                  <div className="relative h-[136px] w-full overflow-hidden rounded-[12px]">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      loading="lazy"
                      sizes="100vw"
                      unoptimized
                      src={post.image}
                    />
                  </div>
                  <p className="m-0 ml-[11px] w-[220px] font-bold lowercase leading-[0.9] tracking-[0.24px] text-[13px] text-white">
                    {post.titleParts.map((part, i) =>
                      part.italic ? (
                        <span className="font-normal italic" key={i}>
                          {part.text}
                        </span>
                      ) : (
                        <span key={i}>{part.text}</span>
                      ),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {/* ── Bottom info — single column centered ───── */}
        <div className="flex flex-col items-center gap-[40px]">

          {/* Logo centered */}
          <img
            alt="СОЛО"
            className="block"
            height={24}
            src={footerAssets.logo}
            width={136}
          />

          <nav
            aria-label="Footer navigation"
            className="flex w-full max-w-[280px] flex-wrap items-center justify-center gap-x-[20px] gap-y-[12px]"
          >
            {navLinks.map((item) => (
              <SiteNavLink
                className="font-normal lowercase leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70"
                href={item.href}
                key={item.label}
                style={{ color: "#ffffff" }}
              >
                {item.label}
              </SiteNavLink>
            ))}
          </nav>

          {/* Phone & Email */}
          <div className="flex flex-col items-center gap-[20px]">
            <div className="flex flex-col items-center gap-[8px]">
              <p className="m-0 font-normal leading-[1.2] text-[11px] text-[#c8c3bf]">
                {footerContent.phoneSubtitle}
              </p>
              <a
                className="m-0 font-bold leading-none text-[20px] no-underline transition-opacity hover:opacity-70"
                href={`tel:${footerContent.phone.replace(/\s/g, "")}`}
                style={{ color: "#ffffff" }}
              >
                {footerContent.phone}
              </a>
            </div>
            <a
              className="m-0 font-bold leading-none text-[20px] no-underline transition-opacity hover:opacity-70"
              href={`mailto:${footerContent.email}`}
              style={{ color: "#ffffff" }}
            >
              {footerContent.email}
            </a>
          </div>

          {/* Telegram CTA */}
          <div className="flex flex-col items-center gap-[20px]">
            <p className="m-0 w-[184px] text-center font-normal leading-[1.2] text-[12px] text-white">
              {footerContent.tgDescription}
            </p>
            <a
              className="flex h-[44px] w-[184px] shrink-0 items-center overflow-hidden rounded-[50px] bg-white px-[3px] no-underline transition-opacity hover:opacity-90"
              href={process.env.NEXT_PUBLIC_TG_CHANNEL_URL ?? "https://t.me/soloproduction"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex w-full items-center gap-[6px] overflow-hidden">
                <img
                  alt=""
                  className="block shrink-0"
                  height={38}
                  src={footerAssets.tgIcon}
                  width={38}
                />
                <span className="shrink-0 font-semibold lowercase leading-[1.2] text-[14px] text-[#0d0300]">
                  {footerContent.tgCta}
                </span>
              </div>
            </a>
          </div>

          {/* Legal + Privacy stacked centered */}
          <div className="flex flex-col items-center gap-[24px] text-center">
            <p className="m-0 font-normal leading-[1.2] text-[11px] text-[#c8c3bf]">
              {footerContent.legal}
            </p>
            <a
              className="font-normal leading-[1.2] text-[11px] no-underline transition-opacity hover:opacity-70"
              href="/privacy"
              style={{ color: "#c8c3bf" }}
            >
              {footerContent.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
