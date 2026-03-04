import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().email("Adresse courriel invalide"),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
