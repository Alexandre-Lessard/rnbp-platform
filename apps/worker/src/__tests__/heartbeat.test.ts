import { describe, it, expect, vi } from "vitest";
import { runHeartbeat, type HeartbeatEnv } from "../utils/heartbeat.js";

const PING = "https://health.example/ping/token";
const SITE = "https://rnbp.example";

function env(dbOk = true, extra: Partial<HeartbeatEnv> = {}): HeartbeatEnv {
  const first = dbOk ? vi.fn().mockResolvedValue({ 1: 1 }) : vi.fn().mockRejectedValue(new Error("D1"));
  return {
    DB: { prepare: () => ({ first }) } as unknown as D1Database,
    FRONTEND_URL: SITE,
    HEALTH_PING_URL: PING,
    ...extra,
  };
}

function fetchStub(siteStatus = 200, siteBody = "<title>RNBP</title>") {
  return vi.fn(async (url: RequestInfo | URL) =>
    String(url) === SITE ? new Response(siteBody, { status: siteStatus }) : new Response("ok"),
  ) as unknown as typeof fetch;
}

describe("runHeartbeat", () => {
  it("pings when the database and the site both answer", async () => {
    const f = fetchStub();
    const r = await runHeartbeat(env(), f);
    expect(r).toEqual({ database: "ok", site: "ok", pinged: true });
    expect(f).toHaveBeenCalledWith(PING, expect.anything());
  });

  it("stays silent when the database fails", async () => {
    const f = fetchStub();
    const r = await runHeartbeat(env(false), f);
    expect(r.pinged).toBe(false);
    expect(f).not.toHaveBeenCalledWith(PING, expect.anything());
  });

  it("stays silent when the site errors", async () => {
    const r = await runHeartbeat(env(), fetchStub(502, "Bad gateway"));
    expect(r).toEqual({ database: "ok", site: "error", pinged: false });
  });

  it("stays silent when a 200 page is not the RNBP site", async () => {
    const r = await runHeartbeat(env(), fetchStub(200, "<title>Error</title>"));
    expect(r.site).toBe("error");
    expect(r.pinged).toBe(false);
  });

  it("does nothing towards the monitor without a ping URL", async () => {
    const f = fetchStub();
    const r = await runHeartbeat(env(true, { HEALTH_PING_URL: undefined }), f);
    expect(r.pinged).toBe(false);
    expect(f).toHaveBeenCalledTimes(1);
  });
});
