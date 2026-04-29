import type { PayloadMediaLike } from "@/shared/lib/payload-media";

type LexicalNode = {
  type?: string;
  text?: string;
  format?: number;
  tag?: string;
  url?: string;
  fields?: {
    url?: string;
    newTab?: boolean;
    linkType?: string;
  };
  children?: LexicalNode[];
};

type LexicalStateLike = {
  root?: {
    type?: string;
    children?: LexicalNode[];
  };
};

export type EmailTemplateRenderInput = {
  siteUrl: string;
  subject: string;
  preheader?: string | null;
  headline?: LexicalStateLike | null;
  body?: LexicalStateLike | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  heroImage?: PayloadMediaLike;
  headerLogo?: PayloadMediaLike;
  footerLogo?: PayloadMediaLike;
  footerSiteLabel?: string | null;
  footerSiteUrl?: string | null;
  footerEmail?: string | null;
  footerPhone?: string | null;
  footerTelegramLabel?: string | null;
  footerTelegramUrl?: string | null;
};

const EMAIL_IMAGE_SIZES = ["card-768-webp", "card-360-webp", "card-768-avif", "card-360-avif"];
const EMAIL_HERO_SIZES = ["card-768-webp", "card-1440-webp", "card-768-avif", "card-1440-avif"];
const EMAIL_LOGO_SIZES = ["card-360-webp", "card-360-avif"];

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function renderTextNode(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

function absoluteUrl(siteUrl: string, value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `${siteUrl.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}

export function emailMediaUrl(
  media: PayloadMediaLike,
  siteUrl: string,
  preferredSizes: readonly string[] = EMAIL_IMAGE_SIZES,
): string {
  if (!media || typeof media !== "object") return "";

  const sizes = media.sizes;
  if (sizes && typeof sizes === "object") {
    for (const sizeName of preferredSizes) {
      const size = sizes[sizeName];
      if (size?.url) return absoluteUrl(siteUrl, size.url);
    }
  }

  return media.url ? absoluteUrl(siteUrl, media.url) : "";
}

function renderInlineNodes(nodes: LexicalNode[] | undefined, siteUrl: string): string {
  if (!Array.isArray(nodes)) return "";

  return nodes
    .map((node) => {
      if (node.type === "text") {
        let text = renderTextNode(node.text ?? "");
        const format = node.format ?? 0;
        if (format & 1) text = `<strong>${text}</strong>`;
        if (format & 2) text = `<em>${text}</em>`;
        if (format & 8) text = `<u>${text}</u>`;
        return text;
      }

      if (node.type === "linebreak") {
        return "<br />";
      }

      const children = renderInlineNodes(node.children, siteUrl);
      const linkUrl = node.url ?? node.fields?.url;
      if (node.type === "link" && linkUrl) {
        const href = absoluteUrl(siteUrl, linkUrl);
        return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer" style="color:#ff5c00; font-weight:500; text-decoration:underline;">${children}</a>`;
      }

      return children;
    })
    .join("");
}

function renderRichText(
  state: LexicalStateLike | null | undefined,
  siteUrl: string,
  options: { headline?: boolean } = {},
): string {
  const children = state?.root?.children;
  if (!Array.isArray(children) || children.length === 0) return "";

  return children
    .map((node) => {
      const content = renderInlineNodes(node.children, siteUrl);
      if (!content.trim()) return `<p class="${options.headline ? "" : "body-empty"}">&nbsp;</p>`;
      if (options.headline) return content;
      return `<p style="line-height:1.2; mso-line-height-rule:exactly;">${content}</p>`;
    })
    .join("");
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function renderEmailHtml(input: EmailTemplateRenderInput): string {
  const siteUrl = input.siteUrl.replace(/\/+$/, "");
  const subject = text(input.subject, "Письмо СОЛО");
  const preheader = text(input.preheader, "");
  const headerLogo = emailMediaUrl(input.headerLogo, siteUrl, EMAIL_LOGO_SIZES);
  const footerLogo = emailMediaUrl(input.footerLogo, siteUrl, EMAIL_LOGO_SIZES);
  const heroImage = emailMediaUrl(input.heroImage, siteUrl, EMAIL_HERO_SIZES);
  const buttonText = text(input.buttonText, "Оставить заявку");
  const buttonUrl = absoluteUrl(siteUrl, text(input.buttonUrl, "/#lead-form-section"));
  const footerSiteLabel = text(input.footerSiteLabel, "наш сайт");
  const footerSiteUrl = absoluteUrl(siteUrl, text(input.footerSiteUrl, "/"));
  const footerEmail = text(input.footerEmail, "info@soloproduction.pro");
  const footerPhone = text(input.footerPhone, "+7 968 973 11-68");
  const footerTelegramLabel = text(input.footerTelegramLabel, "@mskfosage");
  const footerTelegramUrl = absoluteUrl(siteUrl, text(input.footerTelegramUrl, "https://t.me/mskfosage"));
  const headline = renderRichText(input.headline, siteUrl, { headline: true });
  const body = renderRichText(input.body, siteUrl);

  return `<!DOCTYPE html>
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    html, body { margin:0 !important; padding:0 !important; width:100% !important; height:100% !important; }
    body { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family:Montserrat, Arial, Helvetica, sans-serif; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
    a { text-decoration:underline; }
    a.btn-cta { text-decoration:none !important; color:#ffffff !important; }
    .body-text p { margin:0; }
    .body-empty { margin:0 !important; line-height:1.2 !important; font-size:14px !important; }
    .headline em { font-weight:400 !important; font-style:italic !important; }
    @media only screen and (max-width:620px) {
      .outer-pad { padding-left:16px !important; padding-right:16px !important; }
      .email-container { width:100% !important; max-width:100% !important; }
      .px-48 { padding-left:24px !important; padding-right:24px !important; }
      .px-40 { padding-left:20px !important; padding-right:20px !important; }
      .headline { font-size:30px !important; line-height:1.06 !important; }
      .hero-img { width:100% !important; height:auto !important; }
      .btn-table { width:100% !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ebebeb;">
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ebebeb;">
    <tr>
      <td class="outer-pad" align="center" style="padding:0 64px;">
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:600px; background-color:#fffffe;">
          <tr>
            <td class="px-48" align="left" style="padding:40px 48px 32px 48px; background-color:#fffffe;">
              ${headerLogo ? `<img src="${escapeAttr(headerLogo)}" width="91" height="26" alt="СОЛО — агентство видеоконтента" style="display:block; width:91px; height:auto; max-width:91px;" />` : ""}
            </td>
          </tr>
          <tr>
            <td class="px-48" align="left" valign="top" style="padding:21px 48px 21px 48px; background-color:#fffffe;">
              <h1 class="headline" style="margin:0; padding:0; font-family:Montserrat, Arial, Helvetica, sans-serif; font-size:40px; font-weight:600; line-height:0.94; color:#0d0300;">${headline}</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0; background-color:#fffffe; line-height:0; font-size:0;">
              ${heroImage ? `<img class="hero-img" src="${escapeAttr(heroImage)}" width="600" height="376" alt="" style="display:block; width:100%; max-width:600px; height:auto;" />` : ""}
            </td>
          </tr>
          <tr>
            <td class="px-40" align="left" style="padding:40px 40px 16px 40px; background-color:#fffffe;">
              <div class="body-text" style="font-family:Montserrat, Arial, Helvetica, sans-serif; font-size:14px; font-weight:400; line-height:1.2; color:#0d0300; mso-line-height-rule:exactly;">${body}</div>
            </td>
          </tr>
          <tr>
            <td class="px-40" align="left" style="padding:24px 40px 96px 40px; background-color:#fffffe;">
              <table role="presentation" class="btn-table" width="208" height="45" cellspacing="0" cellpadding="0" border="0" style="width:208px; height:45px; max-width:100%; border-collapse:separate; table-layout:fixed; border-radius:4px; background-color:#ff5c00;">
                <tr>
                  <td align="center" valign="middle" bgcolor="#ff5c00" style="height:45px; padding:0 16px; background-color:#ff5c00; border-radius:4px;">
                    <a class="btn-cta" href="${escapeAttr(buttonUrl)}" target="_blank" rel="noopener noreferrer" style="font-family:Helvetica, Arial, sans-serif; font-size:16px; line-height:24px; font-weight:700; color:#ffffff; text-decoration:none; display:block; width:100%; text-align:center;">${escapeHtml(buttonText)}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="px-40" align="center" style="padding:37px 40px; background-color:#0d0300;">
              ${footerLogo ? `<img src="${escapeAttr(footerLogo)}" width="95" height="26" alt="СОЛО" style="display:block; width:95px; height:auto; max-width:95px; margin:0 auto 24px auto;" />` : ""}
              <div style="font-family:Montserrat, Arial, Helvetica, sans-serif; font-size:14.554px; line-height:1.46; color:#ffffff;">
                <a href="${escapeAttr(footerSiteUrl)}" target="_blank" rel="noopener noreferrer" style="display:block; color:#ff5c02; font-weight:500; text-decoration:underline;">${escapeHtml(footerSiteLabel)}</a>
                <p style="margin:0; color:#ffffff; font-weight:500;">${escapeHtml(footerEmail)}</p>
                <p style="margin:0; color:#ffffff; font-weight:500;">${escapeHtml(footerPhone)}</p>
                <p style="margin:24px 0 0 0; color:#ffffff; font-weight:500;">Телеграм: <a href="${escapeAttr(footerTelegramUrl)}" target="_blank" rel="noopener noreferrer" style="color:#ff5c02; font-weight:500; text-decoration:underline;">${escapeHtml(footerTelegramLabel)}</a></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
