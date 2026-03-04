import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { getConfig } from "./config.js";
import { healthRoutes } from "./routes/health.js";
import { authRoutes } from "./routes/auth.js";
import { itemRoutes } from "./routes/items.js";
import { registerWithItemRoutes } from "./routes/register-with-item.js";
import { reportRoutes } from "./routes/reports.js";
import { newsletterRoutes } from "./routes/newsletter.js";
import { insuranceRoutes } from "./routes/insurance.js";
import { errorHandler } from "./middleware/error-handler.js";
import { securityHeaders } from "./middleware/security-headers.js";

export async function buildApp() {
  const config = getConfig();

  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "production" ? "info" : "debug",
      transport:
        config.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { translateTime: "HH:MM:ss" } }
          : undefined,
    },
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // CORS
  await app.register(cors, {
    origin: config.CORS_ORIGINS,
    credentials: true,
  });

  // Security headers
  await app.register(securityHeaders);

  // Rate limiting (global baseline)
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Routes
  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(authRoutes, { prefix: "/api" });
  await app.register(itemRoutes, { prefix: "/api" });
  await app.register(registerWithItemRoutes, { prefix: "/api" });
  await app.register(reportRoutes, { prefix: "/api" });
  await app.register(newsletterRoutes, { prefix: "/api" });
  await app.register(insuranceRoutes, { prefix: "/api" });

  return app;
}
