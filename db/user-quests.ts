import { db } from './index';
import { userQuests } from './schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { getQuestByName } from '@/utils/quests';

export const userQuestSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  questName: z.string(),
  completionCount: z.number(),
  lastCompletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserQuest = z.infer<typeof userQuestSchema>;

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
  // First check if the quest exists and is repeatable
  const quest = await getQuestByName(questName);

  if (!quest) {
    return {
      success: false,
      error: 'Quest not found',
      code: 'QUEST_NOT_FOUND',
    };
  }

  const { isRepeatable } = quest;

  // Check if user quest record exists
  const existingUserQuest = await db
    .select()
    .from(userQuests)
    .where(
      and(eq(userQuests.userId, userId), eq(userQuests.questName, questName)),
    )
    .limit(1);

  if (existingUserQuest.length > 0) {
    const currentCount = existingUserQuest[0].completionCount;

    // If quest is not repeatable and already completed once, don't allow
    if (!isRepeatable && currentCount && currentCount > 0) {
      return {
        success: false,
        error: 'Quest is not repeatable and already completed',
        code: 'QUEST_NOT_REPEATABLE',
      };
    }

    // Update existing record - increment completion count
    const result = await db
      .update(userQuests)
      .set({
        completionCount: (currentCount || 0) + 1,
        lastCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(userQuests.questName, questName), eq(userQuests.userId, userId)),
      );

    return { success: true, data: result };
  } else {
    // Create new record with count = 1
    const result = await db.insert(userQuests).values({
      userId,
      questName,
      completionCount: 1,
      lastCompletedAt: new Date(),
    });

    return { success: true, data: result };
  }
};

export const getUserQuests = async (userId: string) => {
  return await db
    .select()
    .from(userQuests)
    .where(eq(userQuests.userId, userId))
    .orderBy(desc(userQuests.createdAt));
};

export const getUserQuestById = async (userId: string, id: number) => {
  return await db
    .select()
    .from(userQuests)
    .where(and(eq(userQuests.userId, userId), eq(userQuests.id, id)));
};
