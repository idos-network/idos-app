import { db, users, userQuests } from './index';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';
import { questsConfig } from '@/utils/quests';

export const idOSUserSchema = z.object({
  id: z.string(),
  mainEvm: z.string(),
  referrerCode: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type IdOSUser = z.infer<typeof idOSUserSchema>;

export async function saveUser(user: IdOSUser) {
  return await db.insert(users).values(user).onConflictDoNothing();
}

export async function updateUser(user: IdOSUser) {
  return await db.update(users).set(user).where(eq(users.id, user.id));
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function getUserReferralCount(
  referralCode: string,
): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.referrerCode, referralCode));

  return result[0].count;
}

export async function getUserTotalPoints(id: string): Promise<number> {
  const userQuestResults = await db
    .select()
    .from(userQuests)
    .where(eq(userQuests.userId, id));

  let totalPoints = 0;

  for (const userQuest of userQuestResults) {
    const quest = questsConfig.find((q) => q.name === userQuest.questName);
    if (quest) {
      totalPoints += quest.pointsReward;
    }
  }

  return totalPoints;
}
