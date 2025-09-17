import { generateReferralCode } from '@/utils/quests';
import { eq, sql } from 'drizzle-orm';
import { db, referrals } from '.';
import { refreshLeaderboard } from './leaderboard';

export function createReferral(userId: string) {
  const referralCode = generateReferralCode(userId);
  return db.insert(referrals).values({ userId, referralCode });
}

export function updateReferralCount(referralCode: string) {
  const result = db
    .update(referrals)
    .set({ referralCount: sql`${referrals.referralCount} + 1` })
    .where(eq(referrals.referralCode, referralCode));

  refreshLeaderboard();

  return result;
}
