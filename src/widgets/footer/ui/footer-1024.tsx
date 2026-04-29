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

const CARD_WIDTH = 386;
const CARD_GAP = 10;
const SLIDE_STEP = CARD_WIDTH + CARD_GAP;
const MAX_SLIDE = 1;

/**
 * Figma 783:8318 — «footer» 1024px: тёмный блок с разделом блога и нижней информацией.
 */
export function Footer1024({
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
      className="relative hidden w-full bg-[#0d0300] min-[1024px]:block min-[1440px]:hidden"
      id="footer-1024"
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
      <div className="relative mx-auto flex max-w-[1024px] flex-col gap-[160px] px-[40px] pt-[120px] pb-[100px]">

        {/* ── Blog section ────────────────────────────── */}
        {showSecrets && <div className="flex flex-col gap-[60px]">

          {/* Title + navigation arrows */}
          <div className="flex items-center justify-between pl-[30px]">
            <p className="m-0 font-bold lowercase leading-[0.9] text-[40px] text-white whitespace-nowrap">
              {footerContent.blogTitle}
            </p>
            <div className="flex items-center gap-[12px]">
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
                  className="flex w-[386px] shrink-0 flex-col gap-[20px]"
                  key={post.id}
                >
                  {/* Card image */}
                  <div className="relative h-[217px] w-full overflow-hidden rounded-[12px]">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 480px"
                      src={post.image}
                    />
                  </div>
                  {/* Card title */}
                  <p className="m-0 ml-[25px] w-[336px] font-bold lowercase leading-[0.9] tracking-[0.24px] text-[18px] text-white">
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

        {/* ── Bottom info grid ────────────────────────── */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "465px 385px",
            columnGap: "94px",
            rowGap: "120px",
            gridTemplateRows: "repeat(3, fit-content(100%))",
          }}
        >
          {/* Row 1, Col 1 — Logo */}
          <div className="flex items-center">
            <img
              alt="СОЛО"
              className="block"
              height={24}
              src={footerAssets.logo}
              width={136}
            />
          </div>

          {/* Row 1, Col 2 — Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center justify-between"
          >
            {navLinks.map((item) => (
              <SiteNavLink
                className="font-medium lowercase leading-[1.4] text-[16px] no-underline transition-opacity hover:opacity-70"
                href={item.href}
                key={item.label}
                style={{ color: "#ffffff" }}
              >
                {item.label}
              </SiteNavLink>
            ))}
          </nav>

          {/* Row 2, Col 1 — Phone & Email */}
          <div className="flex flex-col gap-[30px] self-start">
            <div className="flex flex-col gap-[20px]">
              <p className="m-0 font-normal leading-[1.2] text-[16px] text-[#c8c3bf]">
                {footerContent.phoneSubtitle}
              </p>
              <a
                className="m-0 font-bold leading-none text-[32px] no-underline transition-opacity hover:opacity-70"
                href={`tel:${footerContent.phone.replace(/\s/g, "")}`}
                style={{ color: "#ffffff" }}
              >
                {footerContent.phone}
              </a>
            </div>
            <a
              className="m-0 font-bold leading-none text-[32px] no-underline transition-opacity hover:opacity-70"
              href={`mailto:${footerContent.email}`}
              style={{ color: "#ffffff" }}
            >
              {footerContent.email}
            </a>
          </div>

          {/* Row 2, Col 2 — Telegram CTA */}
          <div className="flex flex-col gap-[19px] self-start">
            <p className="m-0 w-[270px] font-normal leading-[1.2] text-[16px] text-white">
              {footerContent.tgDescription}
            </p>
            <a
              className="flex h-[60px] w-[250px] shrink-0 items-center overflow-hidden rounded-[50px] bg-white px-[5px] no-underline transition-opacity hover:opacity-90"
              href={process.env.NEXT_PUBLIC_TG_CHANNEL_URL ?? "https://t.me/soloproduction"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex w-full items-center gap-[14px] overflow-hidden">
                <img
                  alt=""
                  className="block shrink-0"
                  height={51}
                  src={footerAssets.tgIcon}
                  width={51}
                />
                <span className="shrink-0 font-semibold lowercase leading-[1.2] text-[18px] text-[#0d0300]">
                  {footerContent.tgCta}
                </span>
              </div>
            </a>
          </div>

          {/* Row 3, Col 1 — Legal */}
          <p className="m-0 self-start font-normal leading-[1.2] text-[14px] text-[#c8c3bf]">
            {footerContent.legal}
          </p>

          {/* Row 3, Col 2 — Privacy */}
          <a
            className="self-start font-normal leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70"
            href="/privacy"
            style={{ color: "#c8c3bf" }}
          >
            {footerContent.privacy}
          </a>
        </div>
      </div>
    </footer>
  );
}
