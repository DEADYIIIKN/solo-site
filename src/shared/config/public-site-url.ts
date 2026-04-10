const DEMO_SITE_URL = "https://demo.soloproduction.pro";

function normalizeSiteUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/+$/, "");
}

export const publicSiteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.PAYLOAD_PUBLIC_SERVER_URL) ??
  DEMO_SITE_URL;

