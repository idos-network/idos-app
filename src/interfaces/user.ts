import { z } from 'zod';

export const idOSUserSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referrerCode: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type IdOSUser = z.infer<typeof idOSUserSchema>;
