import { loadConfig } from "./config.js";
import { buildApp } from "./app.js";
import { closeDb, runMigrations } from "./db/client.js";

async function main() {
  const config = loadConfig();

  // Auto-migrate at startup
  console.log("Running database migrations...");
  await runMigrations();
  console.log("Migrations complete.");

  const app = await buildApp();

  // Graceful shutdown
  const signals = ["SIGINT", "SIGTERM"] as const;
  for (const signal of signals) {
    process.on(signal, async () => {
      app.log.info(`${signal} received, shutting down...`);
      await app.close();
      await closeDb();
      process.exit(0);
    });
  }

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Server running on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
