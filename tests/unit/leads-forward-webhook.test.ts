import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetWebhookWarn,
  forwardLeadToWebhook,
  resolveLeadWebhookUrl,
} from "@/lib/leads/forward-webhook";
import type { LeadInput } from "@/lib/leads/validation";

const previousEnvUrl = process.env.N8N_WEBHOOK_URL;

const validLead: LeadInput = {
  name: "Иван",
  phone: "+7 (900) 123-45-67",
  message: "тестовое сообщение",
  consent: true,
  contactMethod: "call",
  source: "hero-cta",
};

describe("lead webhook forwarding", () => {
  beforeEach(() => {
    delete process.env.N8N_WEBHOOK_URL;
    __resetWebhookWarn();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (previousEnvUrl === undefined) {
      delete process.env.N8N_WEBHOOK_URL;
    } else {
      process.env.N8N_WEBHOOK_URL = previousEnvUrl;
    }
    vi.unstubAllGlobals();
  });

  it("uses admin webhook URL before env fallback", () => {
    process.env.N8N_WEBHOOK_URL = "https://env.example/webhook";

    expect(resolveLeadWebhookUrl(" https://admin.example/webhook ")).toBe(
      "https://admin.example/webhook",
    );
  });

  it("falls back to env webhook URL when admin setting is empty", () => {
    process.env.N8N_WEBHOOK_URL = " https://env.example/webhook ";

    expect(resolveLeadWebhookUrl(" ")).toBe("https://env.example/webhook");
  });

  it("posts lead payload to configured webhook URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const result = await forwardLeadToWebhook(validLead, {
      webhookUrl: "https://admin.example/webhook",
      timeoutMs: 100,
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://admin.example/webhook",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("returns a local-save error when webhook URL is not configured", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const result = await forwardLeadToWebhook(validLead);

    expect(result).toEqual({
      ok: false,
      error: "n8n webhook URL not configured",
    });
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
