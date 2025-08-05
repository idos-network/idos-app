import { db, userQuests } from './index';
import { eq, and, desc, count, min, max } from 'drizzle-orm';
import { getQuestByName, questsConfig } from '@/utils/quests';
import { QuestNotFoundError, QuestNotRepeatableError } from '@/utils/errors';
import type { UserQuestSummary } from '@/interfaces/user-quests';

export const completeUserQuest = async (
  userId: string,
  questName: string,
): Promise<any> => {
  const quest = await getQuestByName(questName);

  if (!quest) {
    throw new QuestNotFoundError(questName);
  }

  if (!quest.isRepeatable) {
    const existingCompletion = await db
      .select()
      .from(userQuests)
      .where(
        and(eq(userQuests.userId, userId), eq(userQuests.questName, questName)),
      )
      .limit(1);

    if (existingCompletion.length > 0) {
      throw new QuestNotRepeatableError(questName);
    }
  }

  const result = await db.insert(userQuests).values({
    userId,
    questName,
  });

  return { success: true, data: result };
};

export const getUserQuests = async (userId: string) => {
  return await db
    .select()
    .from(userQuests)
    .where(eq(userQuests.userId, userId))
    .orderBy(desc(userQuests.createdAt));
};

export const getUserQuestsSummary = async (
  userId: string,
): Promise<UserQuestSummary[]> => {
  const results = await db
    .select({
      userId: userQuests.userId,
      questName: userQuests.questName,
      completionCount: count(userQuests.id),
      lastCompletedAt: max(userQuests.createdAt),
      firstCompletedAt: min(userQuests.createdAt),
    })
    .from(userQuests)
    .where(eq(userQuests.userId, userId))
    .groupBy(userQuests.userId, userQuests.questName);

  const questLookup = new Map(questsConfig.map((quest) => [quest.name, quest]));

  return results.map((result) => {
    const quest = questLookup.get(result.questName);
    const completionCount =
      quest && !quest.isRepeatable ? 1 : result.completionCount;

    return {
      userId: result.userId,
      questName: result.questName,
      completionCount,
      lastCompletedAt: new Date(result.lastCompletedAt!),
      firstCompletedAt: new Date(result.firstCompletedAt!),
    };
  });
};
