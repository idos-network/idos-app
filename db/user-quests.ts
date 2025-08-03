import { db } from './index';
import { userQuests, quests } from './schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

export const userQuestSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  questId: z.number(),
  completionCount: z.number().default(0),
  lastCompletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserQuest = z.infer<typeof userQuestSchema>;

export const saveUserQuest = async (userQuest: UserQuest) => {
  return await db.insert(userQuests).values(userQuest).onConflictDoNothing();
};

export const completeUserQuest = async (questId: number, userId: string) => {
  // First check if the quest is repeatable
  const questData = await db
    .select({ isRepeatable: quests.isRepeatable })
    .from(quests)
    .where(eq(quests.id, questId))
    .limit(1);

  if (!questData.length) {
    throw new Error('Quest not found');
  }

  const { isRepeatable } = questData[0];

  // Check if user quest record exists
  const existingUserQuest = await db
    .select()
    .from(userQuests)
    .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)))
    .limit(1);

  if (existingUserQuest.length > 0) {
    const currentCount = existingUserQuest[0].completionCount;

    // If quest is not repeatable and already completed once, don't allow
    if (!isRepeatable && currentCount && currentCount > 0) {
      throw new Error('Quest is not repeatable and already completed');
    }

    // Update existing record - increment completion count
    return await db
      .update(userQuests)
      .set({
        completionCount: (currentCount || 0) + 1,
        lastCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(userQuests.questId, questId), eq(userQuests.userId, userId)),
      );
  } else {
    // Create new record with count = 1
    return await db.insert(userQuests).values({
      userId,
      questId,
      completionCount: 1,
      lastCompletedAt: new Date(),
    });
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
