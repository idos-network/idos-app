import { z } from 'zod';

export const saveUserSchema = z.object({
  id: z.string().min(1),
  mainEvm: z.string().min(1),
  referrerCode: z.string().optional(),
  cookieConsent: z.nullable(z.boolean()).optional(),
});

export const idOSUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  mainEvm: z.string(),
  referrerCode: z.string().optional(),
  cookieConsent: z.nullable(z.boolean()).optional(),
  faceSignUserId: z.string().optional(),
  faceSignTokenCreatedAt: z.coerce.date().optional(),
  faceSignDone: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type IdOSUser = z.infer<typeof idOSUserSchema>;
