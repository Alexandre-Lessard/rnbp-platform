import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      JWT_PRIVATE_KEY: "dGVzdC1wcml2YXRlLWtleQ==",
      JWT_PUBLIC_KEY: "dGVzdC1wdWJsaWMta2V5",
      NODE_ENV: "test",
    },
  },
});
