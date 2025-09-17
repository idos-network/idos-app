import { eq } from 'drizzle-orm';
import { db } from './index';
import { quests } from './schema';

export async function getAllQuests() {
  return await db.select().from(quests);
}

export async function getActiveQuests() {
  return await db.select().from(quests).where(eq(quests.isActive, true));
}

export async function getQuestById(id: number) {
  const result = await db
    .select()
    .from(quests)
    .where(eq(quests.id, id))
    .limit(1);
  return result[0];
}

export async function getQuestByName(name: string) {
  const result = await db
    .select()
    .from(quests)
    .where(eq(quests.name, name))
    .limit(1);
  return result[0];
}
