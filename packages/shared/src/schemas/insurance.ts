import { z } from "zod";
import { INSURERS } from "../constants/insurers.js";

export const insuranceRequestSchema = z.object({
  insurerName: z.enum(INSURERS, {
    errorMap: () => ({ message: "Assureur invalide" }),
  }),
  messageContent: z.string().min(1).max(2000),
});

export type InsuranceRequestInput = z.infer<typeof insuranceRequestSchema>;
