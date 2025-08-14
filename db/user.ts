import { idOSUserSchema } from '@/interfaces/user';
import { generateReferralCode, questsConfig } from '@/utils/quests';
import { count, eq } from 'drizzle-orm';
import { db, users } from './index';
import { getUserQuestsSummary } from './user-quests';

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
  const [questSummaries, user] = await Promise.all([
    getUserQuestsSummary(userId),
    getUserById(userId),
  ]);

  const questLookup = new Map(questsConfig.map((quest) => [quest.name, quest]));

  // Calculate points from completed quests
  let totalPoints = questSummaries.reduce((points, summary) => {
    const quest = questLookup.get(summary.questName);
    if (quest) {
      points += quest.pointsReward * summary.completionCount;
    }
    return points;
  }, 0);

  // Add referral points
  if (user[0]?.id) {
    const referralCode = generateReferralCode(user[0].id);
    const referralCount = await getUserReferralCount(referralCode);
    const referralQuest = questLookup.get('referral_program');
    if (referralQuest && referralCount > 0) {
      totalPoints += referralQuest.pointsReward * referralCount;
    }
  }

  return totalPoints;
}
