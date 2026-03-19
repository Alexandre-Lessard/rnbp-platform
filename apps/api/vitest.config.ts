import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";

function loadEnvFile(path: string): Record<string, string> {
  const content = readFileSync(path, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

export default defineConfig({
  test: {
    env: loadEnvFile(".env.test"),
  },
});
