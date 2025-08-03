import { db } from './index';
import { users, quests, userQuests } from './schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { generateReferralCode } from '@/utils/referral-code';

export const idOSUserSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referralCode: z.string(),
  referralCount: z.number().default(0),
  referrerCode: z.string().default(''),
});

export type idOSUser = z.infer<typeof idOSUserSchema>;

export async function saveUser(user: idOSUser) {
  return await db.insert(users).values(user).onConflictDoNothing();
}

export async function updateUser(user: idOSUser) {
  return await db.update(users).set(user).where(eq(users.id, user.id));
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function getUserByReferralCode(referralCode: string) {
  return await db
    .select()
    .from(users)
    .where(eq(users.referralCode, referralCode));
}

export async function getUserReferralCount(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function getUserTotalPoints(id: string): Promise<number> {
  const result = await db
    .select({
      totalPoints: sql<number>`sum(${userQuests.completionCount} * ${quests.pointsReward})`,
    })
    .from(userQuests)
    .innerJoin(quests, eq(userQuests.questId, quests.id))
    .where(eq(userQuests.userId, id));

  return Number(result[0]?.totalPoints) || 0;
}

export async function generateUserReferralCode(userId: string): Promise<void> {
  const referralCode = generateReferralCode(userId);
  await db.update(users).set({ referralCode }).where(eq(users.id, userId));
}
