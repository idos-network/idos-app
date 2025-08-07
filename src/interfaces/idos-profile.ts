import { z } from 'zod';

export const idosUserProfileSchema = z.object({
  id: z.string(),
  mainAddress: z.string(),
  userEncryptionPublicKey: z.string(),
  encryptionPasswordStore: z.string(),
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

export const idOSProfileRequestSchema = z.object({
  userId: z.string(),
  userEncryptionPublicKey: z.string(),
  encryptionPasswordStore: z.string(),
  address: z.string(),
  ownershipProofMessage: z.string(),
  ownershipProofSignature: z.string(),
  publicKey: z.string(),
  walletType: z.string(),
});

export type IdosUserProfile = z.infer<typeof idosUserProfileSchema>;
export type IdosWallet = z.infer<typeof idOSWalletSchema>;
