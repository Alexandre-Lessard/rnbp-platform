import type { FastifyInstance } from "fastify";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile } from "node:fs/promises";
import { getConfig } from "../config.js";
import { AppError } from "../utils/errors.js";

const execAsync = promisify(exec);

const STATUS_FILE = "/tmp/rnbp-deploy-status.json";

type DeployStatus =
  | { status: "running"; startedAt: string }
  | { status: "success"; startedAt: string; finishedAt: string; commit: string | null }
  | { status: "failed"; startedAt: string; finishedAt: string; error: string };

async function writeStatus(status: DeployStatus): Promise<void> {
  try {
    await writeFile(STATUS_FILE, JSON.stringify(status), "utf8");
  } catch {
    // Best-effort; do not crash the deploy on a status write error
  }
}

function requireBearer(authHeader: string | undefined, secret: string): void {
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid deploy secret");
  }
}

export async function deployRoutes(app: FastifyInstance) {
  app.post(
    "/deploy-webhook",
    {
      config: { rateLimit: { max: 10, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const config = getConfig();

      if (!config.DEPLOY_WEBHOOK_SECRET) {
        throw new AppError(503, "DEPLOY_NOT_CONFIGURED", "Deploy webhook not configured");
      }

      requireBearer(request.headers.authorization, config.DEPLOY_WEBHOOK_SECRET);

      const startedAt = new Date().toISOString();
      await writeStatus({ status: "running", startedAt });

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
          timeout: 300_000,
          maxBuffer: 10 * 1024 * 1024,
          env: { ...process.env, HOME: "/home/prod" },
        });

        app.log.info(`Deploy succeeded: ${stdout.slice(-200)}`);
        if (stderr) app.log.warn(`Deploy stderr: ${stderr.slice(-200)}`);

        let commit: string | null = null;
        try {
          const { stdout: rev } = await execAsync("git -C /opt/rnbp/repo rev-parse HEAD");
          commit = rev.trim();
        } catch {
          // ignore
        }

        await writeStatus({
          status: "success",
          startedAt,
          finishedAt: new Date().toISOString(),
          commit,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        app.log.error(err, "Deploy webhook failed");
        await writeStatus({
          status: "failed",
          startedAt,
          finishedAt: new Date().toISOString(),
          error: message.slice(0, 500),
        });
      }
    },
  );

  app.get(
    "/deploy-status",
    {
      config: { rateLimit: { max: 120, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const config = getConfig();

      if (!config.DEPLOY_WEBHOOK_SECRET) {
        throw new AppError(503, "DEPLOY_NOT_CONFIGURED", "Deploy webhook not configured");
      }

      requireBearer(request.headers.authorization, config.DEPLOY_WEBHOOK_SECRET);

      try {
        const raw = await readFile(STATUS_FILE, "utf8");
        reply.header("content-type", "application/json").send(raw);
      } catch {
        throw new AppError(404, "NO_DEPLOY_STATUS", "No deploy has run yet");
      }
    },
  );
}
