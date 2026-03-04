import type { FastifyInstance } from "fastify";
import { insuranceRequestSchema, INSURERS } from "@rcbp/shared";
import { getDb } from "../db/client.js";
import { insuranceRequests } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

export async function insuranceRoutes(app: FastifyInstance) {
  // ── Submit insurance request ─────────────────────────────────────

  app.post(
    "/insurance/request",
    { preHandler: requireAuth },
    async (request, reply) => {
      const body = insuranceRequestSchema.parse(request.body);
      const db = getDb();

      const [req] = await db
        .insert(insuranceRequests)
        .values({
          userId: request.userId!,
          insurerName: body.insurerName,
          messageContent: body.messageContent,
        })
        .returning();

      return reply.status(201).send({ request: req });
    },
  );

  // ── List insurers ────────────────────────────────────────────────

  app.get("/insurance/insurers", async (_request, reply) => {
    return reply.send({ insurers: INSURERS });
  });
}
