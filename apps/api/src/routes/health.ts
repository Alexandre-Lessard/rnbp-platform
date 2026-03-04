import type { FastifyInstance } from "fastify";
import { getDb } from "../db/client.js";
import { sql } from "drizzle-orm";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    const checks: Record<string, string> = {};

    // Database check
    try {
      const db = getDb();
      await db.execute(sql`SELECT 1`);
      checks.database = "ok";
    } catch {
      checks.database = "error";
    }

    const healthy = Object.values(checks).every((v) => v === "ok");

    return reply.status(healthy ? 200 : 503).send({
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    });
  });
}
