/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

import { SiteNavLink } from "@/shared/ui/site-nav-link";
import {
  footerAssets,
  footerBlogPosts,
  footerContent,
  getFooterNavLinks,
} from "@/widgets/footer/model/footer.data";

const CARD_WIDTH = 328;
const CARD_GAP = 10;
const SLIDE_STEP = CARD_WIDTH + CARD_GAP;
const MAX_SLIDE = 1;

/**
 * Figma 783:11444 — «footer» 768px.
 */
export function Footer768({
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
      className="relative hidden w-full bg-[#0d0300] min-[768px]:block min-[1024px]:hidden"
      id="footer-768"
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
      <div className="relative mx-auto flex max-w-[768px] flex-col gap-[120px] px-[48px] py-[80px]">

        {/* ── Blog section ────────────────────────────── */}
        {showSecrets && <div className="flex flex-col gap-[30px]">

          {/* Title + navigation arrows */}
          <div className="flex items-center justify-between pl-[20px]">
            <p className="m-0 font-bold lowercase leading-[0.9] text-[30px] text-white whitespace-nowrap">
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
          <div className="overflow-hidden">
            <div
              className="flex gap-[10px] transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(${-slideIndex * SLIDE_STEP}px)` }}
            >
              {footerBlogPosts.map((post) => (
                <div
                  className="flex w-[328px] shrink-0 flex-col gap-[20px]"
                  key={post.id}
                >
                  <div className="relative h-[184px] w-full overflow-hidden rounded-[12px]">
                    <img
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                      height={184}
                      src={post.image}
                      width={328}
                    />
                  </div>
                  <p className="m-0 ml-[20px] w-[288px] font-bold lowercase leading-[0.9] tracking-[0.24px] text-[16px] text-white">
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

        {/* ── Bottom info section ──────────────────────── */}
        <div className="flex flex-col">

          {/* Row 1 — Logo + Navigation */}
          <div className="flex items-center justify-between">
            <img
              alt="СОЛО"
              className="block"
              height={24}
              src={footerAssets.logo}
              width={136}
            />
            <nav
              aria-label="Footer navigation"
              className="flex w-[328px] items-center justify-between"
            >
              {navLinks.map((item) => (
                <SiteNavLink
                  className="font-normal leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70 lowercase"
                  href={item.href}
                  key={item.label}
                  style={{ color: "#ffffff" }}
                >
                  {item.label}
                </SiteNavLink>
              ))}
            </nav>
          </div>

          {/* Row 2 — Phone/Email + Telegram */}
          <div className="mt-[100px] flex items-start justify-between">

            {/* Phone & Email */}
            <div className="flex flex-col gap-[31px]">
              <div className="flex flex-col gap-[20px]">
                <p className="m-0 font-normal leading-[1.2] text-[14px] text-[#9c9c9c]">
                  {footerContent.phoneSubtitle}
                </p>
                <a
                  className="m-0 font-bold leading-none text-[24px] no-underline transition-opacity hover:opacity-70"
                  href={`tel:${footerContent.phone.replace(/\s/g, "")}`}
                  style={{ color: "#ffffff" }}
                >
                  {footerContent.phone}
                </a>
              </div>
              <a
                className="m-0 font-bold leading-none text-[24px] no-underline transition-opacity hover:opacity-70"
                href={`mailto:${footerContent.email}`}
                style={{ color: "#ffffff" }}
              >
                {footerContent.email}
              </a>
            </div>

            {/* Telegram CTA */}
            <div className="flex w-[242px] flex-col gap-[16px]">
              <p className="m-0 font-normal leading-[1.2] text-[14px] text-white">
                {footerContent.tgDescription}
              </p>
              <a
                className="flex h-[52px] w-[217px] shrink-0 items-center overflow-hidden rounded-[50px] bg-white px-[3px] no-underline transition-opacity hover:opacity-90"
                href="https://t.me/soloproduction"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex w-full items-center gap-[12px] overflow-hidden">
                  <img
                    alt=""
                    className="block shrink-0"
                    height={46}
                    src={footerAssets.tgIcon}
                    width={46}
                  />
                  <span className="shrink-0 font-semibold lowercase leading-[1.2] text-[16px] text-[#0d0300]">
                    {footerContent.tgCta}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Row 3 — Legal + Privacy */}
          <div className="mt-[120px] flex items-start justify-between">
            <p className="m-0 font-normal leading-[1.2] text-[14px] text-[#9c9c9c]">
              {footerContent.legal}
            </p>
            <a
              className="font-normal leading-[1.2] text-[14px] no-underline transition-opacity hover:opacity-70"
              href="/privacy"
              style={{ color: "#9c9c9c" }}
            >
              {footerContent.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
