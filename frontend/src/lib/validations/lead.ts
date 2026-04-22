import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(180),
  interest: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(5000),
  source: z.string().trim().max(160).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
