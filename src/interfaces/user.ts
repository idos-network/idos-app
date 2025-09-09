import { z } from 'zod';

export const idOSUserSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referrerCode: z.string().optional(),
  cookieConsent: z.nullable(z.boolean()).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  faceSignHash: z.nullable(z.string()).optional(),
  faceSignToken: z.nullable(z.string()).optional(),
  faceSignTokenCreatedAt: z.nullable(z.coerce.date()).optional(),
});

export type IdOSUser = z.infer<typeof idOSUserSchema>;
