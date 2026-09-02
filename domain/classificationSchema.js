import { z } from "zod";

export const classificationSchema = z.object({
  classification: z.enum([
    "IN_REMIT",
    "OUT_OF_REMIT",
    "NEEDS_REVIEW"
  ]),
  confidence: z.number().min(0).max(1),
  intent: z.string(),
  reason: z.string()
});