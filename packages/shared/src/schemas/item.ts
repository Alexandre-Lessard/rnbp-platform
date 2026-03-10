import { z } from "zod";
import { ITEM_CATEGORIES } from "../constants/categories.js";

export const createItemSchema = z.object({
  name: z.string().min(1, "Nom requis").max(255),
  category: z.enum(ITEM_CATEGORIES, {
    errorMap: () => ({ message: "Catégorie invalide" }),
  }),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  serialNumber: z.string().max(255).optional(),
  estimatedValue: z.number().int().min(1000, "Valeur minimale de 1 000 $").optional(),
  purchaseDate: z.string().datetime().optional(),
  description: z.string().max(2000).optional(),
});

export const updateItemSchema = createItemSchema.partial();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
