import { db, users } from './index';
import { eq, count } from 'drizzle-orm';
import { questsConfig } from '@/utils/quests';
import { getUserQuestsSummary } from './user-quests';
import { idOSUserSchema } from '@/interfaces/user';

export async function saveUser(data: any) {
  const user = idOSUserSchema.parse(data);

  return await db.insert(users).values(user).onConflictDoNothing();
}

export async function updateUser(data: any) {
  const user = idOSUserSchema.parse(data);

  return await db.update(users).set(user).where(eq(users.id, user.id));
}

export async function getUserById(userId: string) {
  return await db.select().from(users).where(eq(users.id, userId));
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

export async function getUserTotalPoints(userId: string): Promise<number> {
  const questSummaries = await getUserQuestsSummary(userId);

  const questLookup = new Map(questsConfig.map((quest) => [quest.name, quest]));

  return questSummaries.reduce((totalPoints, summary) => {
    const quest = questLookup.get(summary.questName);
    if (quest) {
      totalPoints += quest.pointsReward * summary.completionCount;
    }
    return totalPoints;
  }, 0);
}
