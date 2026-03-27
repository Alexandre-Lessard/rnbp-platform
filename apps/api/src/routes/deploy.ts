import type { FastifyInstance } from "fastify";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { getConfig } from "../config.js";
import { AppError } from "../utils/errors.js";

const execAsync = promisify(exec);

export async function deployRoutes(app: FastifyInstance) {
  app.post(
    "/deploy-webhook",
    {
      config: { rateLimit: { max: 3, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const config = getConfig();

      if (!config.DEPLOY_WEBHOOK_SECRET) {
        throw new AppError(503, "DEPLOY_NOT_CONFIGURED", "Deploy webhook not configured");
      }

      const auth = request.headers.authorization;
      if (!auth || auth !== `Bearer ${config.DEPLOY_WEBHOOK_SECRET}`) {
        throw new AppError(401, "UNAUTHORIZED", "Invalid deploy secret");
      }

      // Run deploy in background — don't block the response
      reply.send({ status: "deploying", message: "Deploy triggered" });

      try {
        const script = [
          "cd /opt/rnbp/repo",
          "git fetch origin main",
          "git reset --hard origin/main",
          "source ~/.nvm/nvm.sh",
          "pnpm install --frozen-lockfile",
          "pnpm --filter @rnbp/shared build",
          "pnpm --filter @rnbp/api build",
          "sudo systemctl restart rnbp-api",
        ].join(" && ");

        const { stdout, stderr } = await execAsync(script, {
          timeout: 120_000,
          env: { ...process.env, HOME: "/home/prod" },
        });

        app.log.info(`Deploy succeeded: ${stdout.slice(-200)}`);
        if (stderr) app.log.warn(`Deploy stderr: ${stderr.slice(-200)}`);
      } catch (err) {
        app.log.error(err, "Deploy webhook failed");
      }
    },
  );
}
