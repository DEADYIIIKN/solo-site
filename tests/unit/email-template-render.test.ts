import { describe, expect, it } from "vitest";

import { renderEmailHtml } from "@/features/email-template";
import type { EmailTemplateRenderInput } from "@/features/email-template";

const baseInput: EmailTemplateRenderInput = {
  siteUrl: "https://demo.example.com",
  subject: "Письмо СОЛО",
  preheader: "Короткий прехедер",
  headline: {
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Вы " },
            { type: "text", text: "соревнуетесь", format: 2 },
          ],
        },
      ],
    },
  },
  body: {
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Текст " },
            { type: "text", text: "жирный", format: 1 },
          ],
        },
      ],
    },
  },
  buttonText: "Оставить заявку",
  buttonUrl: "https://demo.example.com/#lead-form-section",
  heroImage: {
    url: "/api/media/file/hero.jpg",
    sizes: {
      "card-768-webp": { url: "/api/media/file/hero-768.webp" },
      "card-768-avif": { url: "/api/media/file/hero-768.avif" },
    },
  },
  headerLogo: {
    url: "/api/media/file/logo-header.png",
    sizes: {
      "card-360-webp": { url: "/api/media/file/logo-header.webp" },
    },
  },
  footerLogo: {
    url: "/api/media/file/logo-footer.png",
    sizes: {
      "card-360-webp": { url: "/api/media/file/logo-footer.webp" },
    },
  },
};

describe("renderEmailHtml", () => {
  it("renders email-safe table HTML with absolute WebP media URLs", () => {
    const html = renderEmailHtml(baseInput);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<table");
    expect(html).toContain("Короткий прехедер");
    expect(html).toContain("https://demo.example.com/api/media/file/hero-768.webp");
    expect(html).toContain("https://demo.example.com/api/media/file/logo-header.webp");
    expect(html).toContain("https://demo.example.com/#lead-form-section");
    expect(html).not.toContain("hero-768.avif");
  });

  it("escapes rich text and preserves basic formatting", () => {
    const html = renderEmailHtml({
      ...baseInput,
      body: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                { type: "text", text: "<script>alert(1)</script>" },
                { type: "text", text: " bold", format: 1 },
                { type: "text", text: " italic", format: 2 },
              ],
            },
          ],
        },
      },
    });

    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("<strong> bold</strong>");
    expect(html).toContain("<em> italic</em>");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("preserves manual line breaks inside rich text", () => {
    const html = renderEmailHtml({
      ...baseInput,
      body: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", text: "Первая строка\nВторая строка" }],
            },
          ],
        },
      },
    });

    expect(html).toContain("Первая строка<br />Вторая строка");
  });

  it("renders lexical linebreak nodes as email-safe br tags", () => {
    const html = renderEmailHtml({
      ...baseInput,
      body: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [
                { type: "text", text: "Первая строка" },
                { type: "linebreak" },
                { type: "text", text: "Вторая строка" },
              ],
            },
          ],
        },
      },
    });

    expect(html).toContain("Первая строка<br />Вторая строка");
  });
});
