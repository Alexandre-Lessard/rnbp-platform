import { describe, it, expect, vi } from "vitest";

// Mock the DB module before importing the function
vi.mock("../db/client.js", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve([]), // No existing user — number is unique
        }),
      }),
    }),
  }),
}));

const { generateClientNumber } = await import("../utils/client-number.js");

describe("generateClientNumber", () => {
  it("returns a 9-digit string", async () => {
    const num = await generateClientNumber();
    expect(num).toMatch(/^\d{9}$/);
  });

  it("returns a number >= 100000000", async () => {
    const num = await generateClientNumber();
    expect(Number(num)).toBeGreaterThanOrEqual(100_000_000);
  });

  it("returns a number <= 999999999", async () => {
    const num = await generateClientNumber();
    expect(Number(num)).toBeLessThanOrEqual(999_999_999);
  });
});
