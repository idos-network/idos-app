import { z } from 'zod';

export const idosUserSchema = z.object({
  id: z.string(),
  mainAddress: z.string(),
  userEncryptionPublicKey: z.string(),
  ownershipProofSignature: z.string(),
  idosKey: z.boolean().optional(),
  humanVerified: z.boolean().optional(),
  idosStakingCredential: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IdosUser = z.infer<typeof idosUserSchema>;
