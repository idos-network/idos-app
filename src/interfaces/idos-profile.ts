import { z } from 'zod';

export const idosUserSchema = z.object({
  id: z.string(),
  mainAddress: z.string(),
  userEncryptionPublicKey: z.string(),
  ownershipProofSignature: z.string(),
  publicKey: z.string(),
  idosKey: z.boolean().optional(),
  humanVerified: z.boolean().optional(),
  idosStakingCredential: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const idOSWalletSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  address: z.string(),
  wallet_type: z.string(),
  message: z.string(),
  public_key: z.string(),
  signature: z.string(),
});

export type IdosUser = z.infer<typeof idosUserSchema>;
export type IdosWallet = z.infer<typeof idOSWalletSchema>;
