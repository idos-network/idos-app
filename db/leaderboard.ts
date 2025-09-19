import { generateReferralCode, questsConfig } from '@/utils/quests';
import { count, sql } from 'drizzle-orm';
import { db, userQuests, users } from './index';

export interface QuestPointsEntry {
  userId: string;
  name: string;
  questPoints: number;
  referralCount: number;
}

export async function getQuestPoints(): Promise<Map<string, QuestPointsEntry>> {
  const questAggregates = await db
    .select({
      userId: userQuests.userId,
      questName: userQuests.questName,
      completionCount: count(userQuests.id),
    })
    .from(userQuests)
    .groupBy(userQuests.userId, userQuests.questName);

  const questLookup = new Map(questsConfig.map((q) => [q.name, q]));

  const questPointsByUser = new Map<string, number>();
  for (const row of questAggregates) {
    const quest = questLookup.get(row.questName);
    if (!quest) continue;

    const effectiveCount = quest.isRepeatable
      ? row.completionCount
      : Math.min(1, row.completionCount);
    const pointsToAdd = quest.pointsReward * effectiveCount;

    questPointsByUser.set(
      row.userId,
      (questPointsByUser.get(row.userId) ?? 0) + pointsToAdd,
    );
  }

  const referralCounts = await db
    .select({
      referrerCode: users.referrerCode,
      referrals: count(),
    })
    .from(users)
    .where(
      sql`${users.referrerCode} IS NOT NULL AND ${users.referrerCode} != ''`,
    )
    .groupBy(users.referrerCode);

  const refCodeToCount = new Map<string, number>();
  for (const row of referralCounts) {
    if (row.referrerCode) {
      refCodeToCount.set(row.referrerCode, row.referrals);
    }
  }

  const allUsers = await db
    .select({ id: users.id, name: users.name })
    .from(users);

  const referralQuest = questLookup.get('referral_program');
  const referralPoints = referralQuest?.pointsReward ?? 0;

  const questDataByUser = new Map<string, QuestPointsEntry>();

  for (const { id, name } of allUsers) {
    const questPoints = questPointsByUser.get(id) ?? 0;
    const code = generateReferralCode(id);
    const referralCount = refCodeToCount.get(code) ?? 0;

    let totalQuestPoints = questPoints;
    if (referralPoints > 0 && referralCount > 0) {
      totalQuestPoints += referralCount * referralPoints;
    }

    questDataByUser.set(id, {
      userId: id,
      name: name || '',
      questPoints: totalQuestPoints,
      referralCount,
    });
  }

  return questDataByUser;
}

export async function getSocialPoints(): Promise<Map<string, number>> {
  // TODO: Implement social points calculation

  return new Map<string, number>();
}

export async function getContributionPoints(): Promise<Map<string, number>> {
  // TODO: Implement contribution points calculation

  return new Map<string, number>();
}
