import { z } from "zod";

// Normalisation at the schema level rather than in the route: every caller gets
// the same address, so "Alex@Badge.CA " and "alex@badge.ca" can never become two
// rows.
export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Adresse courriel invalide")
    .max(255),
  /** Where the consent was given — CASL requires being able to prove it. */
  source: z.string().trim().max(60).optional(),
});

export const newsletterUnsubscribeSchema = z.object({
  token: z.string().min(1),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>;
