// Production heartbeat for health-monitor (health.al-si.com), a dead man's
// switch: it alerts when the ping stops coming. So the Worker pings only when
// the API's database answers AND the public site serves the RNBP page, and on
// failure it simply stays silent. A passing blip never alerts; a failure that
// lasts past the monitor's interval + grace does, and so does this cron itself
// no longer running.

export type HeartbeatEnv = {
  DB: D1Database;
  FRONTEND_URL?: unknown;
  HEALTH_PING_URL?: unknown;
};

export type HeartbeatResult = {
  database: "ok" | "error";
  site: "ok" | "error";
  pinged: boolean;
};

const TIMEOUT_MS = 10_000;

export async function runHeartbeat(
  env: HeartbeatEnv,
  fetchFn: typeof fetch = fetch,
): Promise<HeartbeatResult> {
  const result: HeartbeatResult = { database: "error", site: "error", pinged: false };

  try {
    await env.DB.prepare("SELECT 1").first();
    result.database = "ok";
  } catch (err) {
    console.error("heartbeat: database check failed", err);
  }

  const siteUrl = typeof env.FRONTEND_URL === "string" ? env.FRONTEND_URL : "";
  if (siteUrl) {
    try {
      const res = await fetchFn(siteUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      // A 200 alone could be an error page served by the platform; the brand
      // name proves the SPA shell itself came back.
      if (res.ok && (await res.text()).includes("RNBP")) result.site = "ok";
      else console.error(`heartbeat: site check failed (${res.status})`);
    } catch (err) {
      console.error("heartbeat: site check failed", err);
    }
  }

  const pingUrl = typeof env.HEALTH_PING_URL === "string" ? env.HEALTH_PING_URL : "";
  if (pingUrl && result.database === "ok" && result.site === "ok") {
    try {
      const res = await fetchFn(pingUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      result.pinged = res.ok;
    } catch (err) {
      console.error("heartbeat: ping failed", err);
    }
  }

  return result;
}
