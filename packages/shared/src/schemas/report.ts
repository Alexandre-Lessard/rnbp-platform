import { z } from "zod";

export const createReportSchema = z.object({
  itemId: z.string().uuid("ID d'article invalide"),
  policeReportNumber: z.string().max(100).optional(),
  theftDate: z.string().datetime().optional(),
  theftLocation: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
