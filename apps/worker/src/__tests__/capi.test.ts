import { describe, it, expect, beforeAll, vi, afterEach } from "vitest";
import { initConfig, type Bindings } from "../config.js";
import { sendPurchaseEvent, type PurchaseEvent } from "../utils/capi.js";

beforeAll(() => {
  initConfig({
    JWT_PRIVATE_KEY: "dGVzdC1wcml2YXRlLWtleQ==",
    JWT_PUBLIC_KEY: "dGVzdC1wdWJsaWMta2V5",
    PASSWORD_PEPPER: "test-pepper",
    META_CAPI_TOKEN: "test-token",
    NODE_ENV: "test",
  } as unknown as Bindings);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function event(overrides: Partial<PurchaseEvent> = {}): PurchaseEvent {
  return {
    orderId: "order-1",
    eventId: "11111111-1111-4111-8111-111111111111",
    adConsent: true,
    email: "Someone@Example.com",
    valueCents: 4999,
    sourceUrl: "https://badgeid.ca/shop/success",
    ...overrides,
  };
}

function mockFetch(ok = true) {
  const spy = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    text: async () => (ok ? "{}" : "denied"),
  } as Response);
  vi.stubGlobal("fetch", spy);
  return spy;
}

describe("sendPurchaseEvent — consent gate", () => {
  // The whole point of freezing consent on the order: the Stripe webhook has
  // no browser to ask, so a refusal has to survive all the way to here.
  it("stays silent when consent was refused", async () => {
    const fetchSpy = mockFetch();
    expect(await sendPurchaseEvent(event({ adConsent: false }))).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("stays silent when no choice was ever recorded", async () => {
    const fetchSpy = mockFetch();
    expect(await sendPurchaseEvent(event({ adConsent: null }))).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends when consent was given", async () => {
    const fetchSpy = mockFetch();
    expect(await sendPurchaseEvent(event())).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe("sendPurchaseEvent — deduplication", () => {
  // Without a shared id Meta counts the browser copy and this one separately,
  // and the cost per acquisition it reports is half the real figure.
  it("refuses to send without an event id", async () => {
    const fetchSpy = mockFetch();
    expect(await sendPurchaseEvent(event({ eventId: null }))).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("carries the event id through to Meta", async () => {
    const fetchSpy = mockFetch();
    await sendPurchaseEvent(event());
    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.data[0].event_id).toBe("11111111-1111-4111-8111-111111111111");
  });
});

describe("sendPurchaseEvent — payload", () => {
  it("hashes the email, lower-cased, and never sends it in the clear", async () => {
    const fetchSpy = mockFetch();
    await sendPurchaseEvent(event());
    const raw = (fetchSpy.mock.calls[0][1] as RequestInit).body as string;
    expect(raw).not.toContain("Someone@Example.com");
    expect(raw.toLowerCase()).not.toContain("someone@example.com");

    const body = JSON.parse(raw);
    expect(body.data[0].user_data.em[0]).toMatch(/^[0-9a-f]{64}$/);
  });

  it("normalises casing before hashing, so one person is one match", async () => {
    const fetchSpy = mockFetch();
    await sendPurchaseEvent(event({ email: "Someone@Example.com" }));
    await sendPurchaseEvent(event({ email: "  someone@example.com  " }));
    const hashOf = (i: number) =>
      JSON.parse((fetchSpy.mock.calls[i][1] as RequestInit).body as string).data[0].user_data.em[0];
    expect(hashOf(0)).toBe(hashOf(1));
  });

  it("reports the value in dollars, not cents", async () => {
    const fetchSpy = mockFetch();
    await sendPurchaseEvent(event({ valueCents: 4999 }));
    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.data[0].custom_data.value).toBe(49.99);
    expect(body.data[0].custom_data.currency).toBe("CAD");
  });

  it("repackages fbclid as fbc, which is what Meta matches on", async () => {
    const fetchSpy = mockFetch();
    await sendPurchaseEvent(event({ fbclid: "AbCd123" }));
    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body.data[0].user_data.fbc).toMatch(/^fb\.1\.\d+\.AbCd123$/);
  });
});

describe("sendPurchaseEvent — failure handling", () => {
  // A measurement problem must never fail the webhook: Stripe would retry it,
  // and a paid order would keep being reprocessed over a marketing detail.
  it("returns false rather than throwing when Meta rejects the call", async () => {
    mockFetch(false);
    await expect(sendPurchaseEvent(event())).resolves.toBe(false);
  });

  it("returns false rather than throwing when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(sendPurchaseEvent(event())).resolves.toBe(false);
  });
});
