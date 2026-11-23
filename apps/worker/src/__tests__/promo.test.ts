import { describe, it, expect } from "vitest";
import { isPromoVisible, montrealToday } from "../utils/promo.js";

const base = { active: true, autoHide: true, endsOn: "2027-01-01" };

describe("isPromoVisible", () => {
  it("hides an inactive promo whatever the date", () => {
    expect(isPromoVisible({ ...base, active: false }, new Date("2026-12-01T12:00:00Z"))).toBe(false);
  });

  it("shows an active promo past its end date when auto-hide is off", () => {
    expect(isPromoVisible({ ...base, autoHide: false }, new Date("2027-03-01T12:00:00Z"))).toBe(true);
  });

  it("shows the promo the day before the end date", () => {
    expect(isPromoVisible(base, new Date("2026-12-31T12:00:00Z"))).toBe(true);
  });

  it("shows the promo until 23:59 Montreal time on the end date", () => {
    // 23:59 EST on January 1 is 04:59 UTC on January 2.
    expect(isPromoVisible(base, new Date("2027-01-02T04:59:00Z"))).toBe(true);
  });

  it("hides the promo from midnight Montreal time the next day", () => {
    expect(isPromoVisible(base, new Date("2027-01-02T05:00:00Z"))).toBe(false);
  });
});

describe("montrealToday", () => {
  it("uses Montreal's date, not UTC's", () => {
    expect(montrealToday(new Date("2026-11-24T03:00:00Z"))).toBe("2026-11-23");
  });
});
