import { db } from './index';
import { users, userQuests } from './schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { questsConfig } from '@/utils/quests';

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
  const userQuestResults = await db
    .select()
    .from(userQuests)
    .where(eq(userQuests.userId, id));

  let totalPoints = 0;

  for (const userQuest of userQuestResults) {
    const quest = questsConfig.find((q) => q.name === userQuest.questName);
    if (quest && userQuest.completionCount) {
      totalPoints += userQuest.completionCount * quest.pointsReward;
    }
  }

  return totalPoints;
}
