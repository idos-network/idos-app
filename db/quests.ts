import { eq } from 'drizzle-orm';
import { db } from './index';
import { quests } from './schema';
import { z } from 'zod';
import questsData from '../quests.json';

export const questSchema = z.object({
  id: z.number(),
  name: z.string(),
  pointsReward: z.number(),
  isActive: z.boolean(),
  isRepeatable: z.boolean(),
});

export type Quest = z.infer<typeof questSchema>;

export const questsConfig: readonly Quest[] = questsData;

export async function getActiveQuests() {
  return await db
    .select()
    .from(quests)
    .where(eq(quests.isActive, true))
    .orderBy(quests.pointsReward);
}

export async function getQuestByName(name: string) {
  const result = await db
    .select()
    .from(quests)
    .where(eq(quests.name, name))
    .limit(1);

  return result[0] || null;
}
