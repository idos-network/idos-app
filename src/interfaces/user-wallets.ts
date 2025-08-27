import { z } from 'zod';

export const userWalletSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  address: z.string(),
  walletType: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const saveUserWalletsSchema = z.object({
  userId: z.string(),
  wallets: z.array(
    z.object({
      address: z.string(),
      walletType: z.string(),
    }),
  ),
});

export type UserWallet = z.infer<typeof userWalletSchema>;
export type SaveUserWalletsRequest = z.infer<typeof saveUserWalletsSchema>;
