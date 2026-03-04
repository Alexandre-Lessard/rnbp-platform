import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(255).optional(),
  type: z.enum(["insurer", "retailer", "security", "other"]),
  message: z.string().trim().min(10).max(2000),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
