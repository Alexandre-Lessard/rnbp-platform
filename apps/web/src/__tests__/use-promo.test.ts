import { describe, it, expect } from "vitest";
import { formatPromoDate, promoSentence } from "@/lib/use-promo";

const promo = { textFr: "Étiquettes gratuites.", textEn: "Free labels.", endsOn: "2027-01-01" };

describe("formatPromoDate", () => {
  it("writes the first of the month as 1er in French", () => {
    expect(formatPromoDate("2027-01-01", "fr")).toBe("1er janvier 2027");
  });

  it("leaves other French days alone", () => {
    expect(formatPromoDate("2027-01-15", "fr")).toBe("15 janvier 2027");
  });

  it("formats English dates in words", () => {
    expect(formatPromoDate("2027-01-01", "en")).toBe("January 1, 2027");
  });
});

describe("promoSentence", () => {
  it("appends the valid-until line built from the end date", () => {
    expect(promoSentence(promo, "fr", "Offre valide jusqu'au {date}.")).toBe(
      "Étiquettes gratuites. Offre valide jusqu'au 1er janvier 2027.",
    );
    expect(promoSentence(promo, "en", "Offer valid until {date}.")).toBe(
      "Free labels. Offer valid until January 1, 2027.",
    );
  });
});
