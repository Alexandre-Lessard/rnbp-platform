import type { FastifyInstance } from "fastify";

/**
 * Add security response headers to all responses.
 * Note: In production, nginx will set most of these, but this provides defense-in-depth.
 */
export async function securityHeaders(app: FastifyInstance) {
  app.addHook("onSend", async (_request, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("X-XSS-Protection", "0"); // modern browsers don't need this, but set to 0 to disable buggy filter
    reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
    reply.header(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()",
    );
    // HSTS is set by nginx in production, but add here as fallback
    reply.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  });
}
