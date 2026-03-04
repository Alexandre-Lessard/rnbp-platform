import { customAlphabet } from "nanoid";

// Exclude ambiguous characters: 0, 1, I, L, O
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const generate = customAlphabet(ALPHABET, 8);

export function generateRnbpNumber(): string {
  return `RNBP-${generate()}`;
}
