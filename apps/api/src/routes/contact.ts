import type { FastifyInstance } from "fastify";
import { contactSchema } from "@rnbp/shared";
import { getDb } from "../db/client.js";
import { contactMessages } from "../db/schema.js";
import {
  sendEmail,
  buildContactNotificationEmail,
} from "../utils/email.js";

export async function contactRoutes(app: FastifyInstance) {
  app.post(
    "/contact",
    {
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
    },
    async (request, reply) => {
      const body = contactSchema.parse(request.body);

      // Honeypot — si rempli, on fait semblant que ça a marché
      if (body.website) {
        return reply.status(201).send({ message: "Message envoyé." });
      }

      const db = getDb();

      await db.insert(contactMessages).values({
        name: body.name,
        email: body.email,
        company: body.company,
        type: body.type,
        message: body.message,
      });

      try {
        await sendEmail(
          buildContactNotificationEmail(
            body.name,
            body.email,
            body.company,
            body.type,
            body.message,
          ),
        );
      } catch (err) {
        // Email failure is non-blocking — the message is already in DB
        app.log.error(err, "Failed to send contact notification email");
      }

      return reply.status(201).send({ message: "Message envoyé." });
    },
  );
}
