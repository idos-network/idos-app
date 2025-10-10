import { generateReferralCode } from '@/utils/quests';
import { eq, sql } from 'drizzle-orm';
import { db, referrals } from '.';
import { refreshLeaderboard } from './leaderboard';

export function createReferral(userId: string) {
  const referralCode = generateReferralCode(userId);
  return db
    .insert(referrals)
    .values({ userId, referralCode })
    .onConflictDoNothing();
}

export async function updateReferralCount(referralCode: string) {
  const result = await db
    .update(referrals)
    .set({ referralCount: sql`${referrals.referralCount} + 1` })
    .where(eq(referrals.referralCode, referralCode));

  await refreshLeaderboard();

  return result;
}

export async function getUserReferralCount(userId: string): Promise<number> {
  const result = await db
    .select({ referralCount: referrals.referralCount })
    .from(referrals)
    .where(eq(referrals.userId, userId))
    .limit(1);

  return result[0]?.referralCount ?? 0;
}

export async function getUserReferralCode(userId: string) {
  const result = await db
    .select({ referralCode: referrals.referralCode })
    .from(referrals)
    .where(eq(referrals.userId, userId))
    .limit(1);
  return result[0]?.referralCode ?? '';
}
