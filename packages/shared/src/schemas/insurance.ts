import { z } from "zod";
import { INSURERS } from "../constants/insurers.js";

const validInsurerIds = INSURERS.map((i) => i.id) as [string, ...string[]];

export const insuranceRequestSchema = z.object({
  insurerId: z.enum(validInsurerIds, {
    errorMap: () => ({ message: "Assureur invalide" }),
  }),
  messageContent: z.string().min(1).max(2000),
});

export type InsuranceRequestInput = z.infer<typeof insuranceRequestSchema>;
