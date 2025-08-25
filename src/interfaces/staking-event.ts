import { z } from 'zod';

export interface LockupPeriod {
  id: string;
  months: number;
  days: number;
  multiplier: number;
  isSelected: boolean;
}

export interface StakingAsset {
  name: string;
  icon: string;
  apy: string;
}

export const ethDepositPositionSchema = z.object({
  id: z.bigint().optional(),
  originalAmount: z.bigint(),
  projectRewardsWithdrawn: z.bigint(),
  ethAmount: z.bigint(),
  lstExchangeRateAtCreation: z.bigint(),
  lstExchangeRateAtUnlock: z.bigint(),
  createdAt: z.bigint(),
  lockDuration: z.bigint(),
  isUnlocked: z.boolean(),
});

export type EthDepositPosition = z.infer<typeof ethDepositPositionSchema>;

export const nearDepositPositionSchema = z.object({
  created_timestamp_ms: z.number(),
  days: z.number(),
  near_deposited: z.string(),
  near_rewards: z.string(),
  withdrawn_timestamp_ms: z.number().nullable(),
  current_stnear_value: z.string(),
  shares_deposited: z.string(),
  shares_withdrawn: z.string(),
});

export type NearDepositPosition = z.infer<typeof nearDepositPositionSchema>;

export const depositPositionSchema = z.object({
  asset: z.string(),
  id: z.bigint().optional(),
  originalAmount: z.bigint(),
  projectRewardsWithdrawn: z.bigint(),
  nativeAmount: z.bigint(),
  lstExchangeRateAtCreation: z.bigint(),
  lstExchangeRateAtUnlock: z.bigint(),
  createdAt: z.bigint(),
  lockDuration: z.bigint(),
  isUnlocked: z.boolean(),
});

export type DepositPosition = z.infer<typeof depositPositionSchema>;
