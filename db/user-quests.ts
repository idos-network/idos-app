import { db, userQuests } from './index';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { getQuestByName } from '@/utils/quests';

export const userQuestSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  questName: z.string(),
  completedAt: z.coerce.date(),
});

export type UserQuest = z.infer<typeof userQuestSchema>;

export const userQuestSummarySchema = z.object({
  userId: z.string(),
  questName: z.string(),
  completionCount: z.number(),
  lastCompletedAt: z.coerce.date(),
  firstCompletedAt: z.coerce.date(),
});

export type UserQuestSummary = z.infer<typeof userQuestSummarySchema>;

export type CompleteUserQuestResult =
  | { success: true; data: any }
  | {
      success: false;
      error: string;
      code: 'QUEST_NOT_FOUND' | 'QUEST_NOT_REPEATABLE';
    };

export const completeUserQuest = async (
  userId: string,
  questName: string,
): Promise<CompleteUserQuestResult> => {
  const quest = await getQuestByName(questName);

  if (!quest) {
    return {
      success: false,
      error: 'Quest not found',
      code: 'QUEST_NOT_FOUND',
    };
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
      return {
        success: false,
        error: 'Quest is not repeatable and already completed',
        code: 'QUEST_NOT_REPEATABLE',
      };
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
    .orderBy(desc(userQuests.completedAt));
};

export const getUserQuestsSummary = async (
  userId: string,
): Promise<UserQuestSummary[]> => {
  const allCompletions = await getUserQuests(userId);

  const questSummaries = new Map<string, UserQuestSummary>();

  for (const completion of allCompletions) {
    const existing = questSummaries.get(completion.questName);

    const completedAtDate = new Date(completion.completedAt);

    if (!existing) {
      questSummaries.set(completion.questName, {
        userId,
        questName: completion.questName,
        completionCount: 1,
        lastCompletedAt: completedAtDate,
        firstCompletedAt: completedAtDate,
      });
    } else {
      existing.completionCount += 1;
      existing.firstCompletedAt = completedAtDate;
    }
  }
  return Array.from(questSummaries.values());
};

export const getUserQuestById = async (userId: string, id: number) => {
  return await db
    .select()
    .from(userQuests)
    .where(and(eq(userQuests.userId, userId), eq(userQuests.id, id)));
};
